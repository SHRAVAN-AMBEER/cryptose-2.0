from pymongo import MongoClient
import os
from backend.ai_engine.core.config import settings

_client = None

def get_db():
    global _client
    if _client is None:
        _client = MongoClient(settings.MONGODB_URL)
    # Extract db name from URI or use default
    db_name = settings.MONGODB_URL.split('/')[-1].split('?')[0]
    if not db_name:
        db_name = "cryptoseDB"
    return _client[db_name]

def get_user_profile(user_email: str) -> dict:
    db = get_db()
    profile = db.user_profiles.find_one({"email": user_email})
    if not profile:
        profile = {
            "email": user_email,
            "preferences": {},
            "favorite_coins": [],
            "risk_appetite": "Medium",
            "watchlist": [],
            "previous_recommendations": [],
            "portfolio": {}
        }
        db.user_profiles.insert_one(profile)
        # Fetch again to get the _id removed safely below
        profile = db.user_profiles.find_one({"email": user_email})
    
    if "_id" in profile:
        profile["_id"] = str(profile["_id"])
    return profile

def update_user_profile(user_email: str, updates: dict):
    db = get_db()
    db.user_profiles.update_one(
        {"email": user_email},
        {"$set": updates},
        upsert=True
    )
