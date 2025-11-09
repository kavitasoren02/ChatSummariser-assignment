from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str
    
    # Gemini API
    gemini_api_key: str
    
    # App Config
    app_name: str = "AI Chat Portal"
    debug: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
