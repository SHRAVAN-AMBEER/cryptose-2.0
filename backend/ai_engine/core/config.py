from pydantic_settings import BaseSettings, SettingsConfigDict
import os

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env"))

class Settings(BaseSettings):
    PROJECT_NAME: str = "CRYPTOSE 2.0"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB
    MONGODB_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Redis
    REDIS_URL: str
    
    # APIs
    COINGECKO_API_KEY: str | None = None
    NEWS_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=env_path,
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
