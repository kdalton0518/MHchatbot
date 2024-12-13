from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from ..config import settings

import supabase
import psycopg2


def postgres_userpass_conn():
    engine = create_async_engine(
        f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}",
        echo=False,
    )

    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    return engine, async_session

def postgres_userpass_conn_sync():
    conn = psycopg2.connect(f"host={settings.POSTGRES_HOST} port={settings.POSTGRES_PORT} dbname={settings.POSTGRES_DB} user={settings.POSTGRES_USER} password={settings.POSTGRES_PASSWORD}")
    cur = conn.cursor()
    
    return conn, cur


def postgres_urlkey_conn():
    # supabase_client = supabase.create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    # return supabase_client
    pass
