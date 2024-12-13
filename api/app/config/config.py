from typing import List
from pydantic import AnyHttpUrl, EmailStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "mhchatbotsecretkey123"
    PROJECT_NAME: str
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 2
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    # Postgres Database
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str

    # First superuser
    FIRST_SUPERUSER: EmailStr
    FIRST_SUPERUSER_PASSWORD: str

    # OpenAI
    OPENAI_API_KEY: str

    NEXT_PUBLIC_FASTAPI_BACKEND_URL: str
    PWD_SIGNUP_ENABLED: bool

    # SSO
    # GOOGLE_CLIENT_ID: str = None
    # GOOGLE_CLIENT_SECRET: str = None
    # SSO_CALLBACK_HOSTNAME: str = None
    # SSO_LOGIN_CALLBACK_URL: str = None

    class Config:
        env_file = ".env"


settings = Settings()
