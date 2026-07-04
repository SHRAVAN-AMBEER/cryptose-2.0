import chromadb
from chromadb.config import Settings
import os

# Path where ChromaDB will persist data
CHROMA_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "chroma_data")
os.makedirs(CHROMA_DB_DIR, exist_ok=True)

chroma_client = None
embeddings = None

def get_embeddings():
    global embeddings
    if embeddings is None:
        # Lazy load embeddings to speed up flask startup
        from langchain_huggingface import HuggingFaceEmbeddings
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return embeddings

def get_chroma_client():
    global chroma_client
    if chroma_client is None:
        chroma_client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
    return chroma_client

def get_collection(collection_name: str = "crypto_knowledge"):
    # Create or get collection
    return get_chroma_client().get_or_create_collection(name=collection_name)

def get_retriever(collection_name: str = "crypto_knowledge"):
    from langchain_community.vectorstores import Chroma
    vectorstore = Chroma(
        client=get_chroma_client(),
        collection_name=collection_name,
        embedding_function=get_embeddings()
    )
    return vectorstore.as_retriever(search_kwargs={"k": 3})
