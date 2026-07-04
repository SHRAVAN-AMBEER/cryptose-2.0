from langgraph.checkpoint.mongodb import MongoDBSaver
from pymongo import MongoClient
import os
from backend.ai_engine.core.config import settings

_client = None

def get_checkpointer():
    global _client
    if _client is None:
        _client = MongoClient(settings.MONGODB_URL)
    return MongoDBSaver(_client)
