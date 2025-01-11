from typing import List

from pydantic import AnyHttpUrl, EmailStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/fastapi"
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl]
    
    # NextAuth
    NEXTAUTH_URL: str
    NEXTAUTH_SECRET: str
    NEXT_PUBLIC_FASTAPI_URL: str
    
    # Database
    POSTGRES_PRISMA_URL: str
    POSTGRES_URL_NON_POOLING: str
    FASTAPI_ASYNC_DB_URL: str
    FASTAPI_SYNC_DB_URL: str
    
    FIRST_USER_EMAIL: str
    FIRST_USER_PASSWORD: str
    FIRST_USER_NAME: str
    
    # OpenAI
    OPENAI_API_KEY: str
    
    # SSO
    GOOGLE_ID: str = None
    GOOGLE_SECRET: str = None
    
    
    class Config:
        env_file = ".env"


settings = Settings()
