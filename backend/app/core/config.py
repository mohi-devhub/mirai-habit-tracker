from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

# Get the backend directory (parent of app directory)
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Adaptive Micro-Habit App"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql://username:password@localhost:5432/mirai_db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Firebase
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    
    class Config:
        env_file = str(ENV_FILE)
        env_file_encoding = 'utf-8'
        case_sensitive = True

settings = Settings()

