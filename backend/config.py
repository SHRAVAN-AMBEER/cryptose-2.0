import os
from datetime import timedelta

# config.py

class Config:
    MONGO_URI = "mongodb://localhost:27017/cryptose"
    GEMINI_API_KEY = "AIzaSyCwb-ZcHeWvh7LuuhCNYXBjeX6PFeGWEyI"
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-here')  # In production, use environment variable
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    BCRYPT_LOG_ROUNDS = 12  # Number of rounds for password hashing
