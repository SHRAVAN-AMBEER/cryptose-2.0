from pymongo import MongoClient, ASCENDING, IndexModel
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_database():
    try:
        # Connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        db = client['cryptoseDB']
        
        # Define collections and their indexes
        collections_config = {
            'users': [
                IndexModel([('email', ASCENDING)], unique=True),
                IndexModel([('username', ASCENDING)])
            ],
            'members': [
                IndexModel([('email', ASCENDING)], unique=True),
                IndexModel([('username', ASCENDING)])
            ],
            'admins': [
                IndexModel([('email', ASCENDING)], unique=True),
                IndexModel([('username', ASCENDING)])
            ]
        }
        
        # Create collections and indexes
        for collection_name, indexes in collections_config.items():
            if collection_name not in db.list_collection_names():
                db.create_collection(collection_name)
                logger.info(f"Created collection: {collection_name}")
            
            collection = db[collection_name]
            collection.create_indexes(indexes)
            logger.info(f"Created indexes for: {collection_name}")
            
            # Add default document schema
            if collection.count_documents({}) == 0:
                collection.insert_one({
                    "username": f"test_{collection_name}",
                    "email": f"test_{collection_name}@example.com",
                    "password": "test123",
                    "role": collection_name.rstrip('s').capitalize(),
                    "profile": {
                        "bio": "",
                        "location": "",
                        "preferences": {}
                    },
                    "coinHistory": []
                })
                logger.info(f"Added test document to {collection_name}")
        
        logger.info("✅ Database initialization completed successfully!")
        logger.info(f"Available collections: {db.list_collection_names()}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Database initialization error: {str(e)}")
        return False
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    init_database()
