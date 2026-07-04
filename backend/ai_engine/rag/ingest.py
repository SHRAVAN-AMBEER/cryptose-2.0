import os
import requests
import uuid
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from backend.ai_engine.rag.chroma_client import get_collection, embeddings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PDF_URLS = [
    "https://bitcoin.org/bitcoin.pdf",
    "https://ethereum.org/en/whitepaper/"
]

def download_file(url, filename):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(response.content)
        return filename
    return None

def ingest_real_data():
    collection = get_collection("crypto_knowledge")
    
    # 1. Fetch Bitcoin Whitepaper
    btc_pdf_path = "bitcoin_whitepaper.pdf"
    logger.info("Downloading Bitcoin Whitepaper...")
    download_file(PDF_URLS[0], btc_pdf_path)
    
    docs = []
    
    if os.path.exists(btc_pdf_path):
        logger.info("Parsing Bitcoin PDF...")
        loader = PyPDFLoader(btc_pdf_path)
        docs.extend(loader.load())
    
    # 2. Fetch Ethereum Whitepaper (Web)
    logger.info("Scraping Ethereum Web Whitepaper...")
    try:
        web_loader = WebBaseLoader("https://ethereum.org/en/whitepaper/")
        docs.extend(web_loader.load())
    except Exception as e:
        logger.error(f"Error scraping Ethereum doc: {e}")

    # 3. Fetch some general Crypto Research
    logger.info("Scraping General Crypto info...")
    try:
        web_loader = WebBaseLoader("https://en.wikipedia.org/wiki/Cryptocurrency")
        docs.extend(web_loader.load())
    except Exception as e:
        logger.error(f"Error scraping Crypto wiki: {e}")

    # Chunk the documents
    logger.info(f"Loaded {len(docs)} documents. Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    
    chunks = text_splitter.split_documents(docs)
    logger.info(f"Created {len(chunks)} text chunks. Generating embeddings...")

    # We will upload in batches to avoid overwhelming the memory/model
    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        
        texts = [chunk.page_content for chunk in batch]
        metadatas = [chunk.metadata for chunk in batch]
        ids = [str(uuid.uuid4()) for _ in range(len(batch))]
        
        # We manually embed because we want to pass them to Chroma directly
        embedded_docs = embeddings.embed_documents(texts)
        
        collection.add(
            embeddings=embedded_docs,
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )
        logger.info(f"Ingested batch {i//batch_size + 1}/{(len(chunks)-1)//batch_size + 1}")

    logger.info("✅ Successfully ingested all real data into ChromaDB!")

    # Cleanup
    if os.path.exists(btc_pdf_path):
        os.remove(btc_pdf_path)

if __name__ == "__main__":
    ingest_real_data()
