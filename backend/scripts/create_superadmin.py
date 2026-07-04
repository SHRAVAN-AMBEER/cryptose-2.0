import os
import sys
import getpass
from pymongo import MongoClient
from datetime import datetime

def main():
    print("🚀 CRYPTOSE Superadmin Provisioning Tool 🚀\n")
    
    # Connect to MongoDB
    try:
        from ai_engine.core.config import settings
        mongo_uri = settings.MONGODB_URL
        client = MongoClient(mongo_uri)
        db = client.get_default_database()
        
        # Test connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB.")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        sys.exit(1)

    print("\n--- Create New Superadmin ---")
    email = input("Email: ").strip()
    if not email:
        print("Email is required.")
        sys.exit(1)

    username = input("Username: ").strip()
    if not username:
        print("Username is required.")
        sys.exit(1)

    # Check if email/username already exists
    if db.users.find_one({"email": email}) or db.members.find_one({"email": email}) or db.admins.find_one({"email": email}):
        print("❌ Error: Email already exists in the system.")
        sys.exit(1)
        
    if db.users.find_one({"username": username}) or db.members.find_one({"username": username}) or db.admins.find_one({"username": username}):
        print("❌ Error: Username already exists in the system.")
        sys.exit(1)

    password = getpass.getpass("Password: ")
    if not password:
        print("Password is required.")
        sys.exit(1)

    confirm_password = getpass.getpass("Confirm Password: ")
    if password != confirm_password:
        print("❌ Error: Passwords do not match.")
        sys.exit(1)

    new_admin = {
        "username": username,
        "email": email,
        "password": password,
        "role": "admin",
        "profile": {
            "bio": "Superadmin",
            "location": "HQ",
            "preferences": {}
        },
        "created_at": datetime.utcnow()
    }

    try:
        result = db.admins.insert_one(new_admin)
        print(f"\n🎉 Superadmin successfully created!")
        print(f"ID: {result.inserted_id}")
        print(f"You can now log in at http://localhost:3000/login using {email}")
    except Exception as e:
        print(f"\n❌ Error inserting admin into database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
