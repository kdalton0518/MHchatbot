# Get OpenAI Embedding
import asyncio
import os

from openai import OpenAI
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from .config import settings

async_engine = create_async_engine(settings.FASTAPI_ASYNC_DB_URL, echo=False)

async_session = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

sync_engine = create_engine(settings.FASTAPI_SYNC_DB_URL, echo=False)
sync_session = sessionmaker(
    bind=sync_engine,
    expire_on_commit=False,
)

def openai_embedding_one(text):
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding

async def embedding_chunk(chunk):
    tasks = [openai_embedding_one(text) for text in chunk]
    return await asyncio.gather(*tasks)

def openai_embedding_list(texts, chunk_size):
    chunks = [texts[i:i+chunk_size] for i in range(0, len(texts), chunk_size)]
    embeddings = []
    
    async def process_all_chunks():
        tasks = []
        for chunk in chunks:
            tasks.extend(await embedding_chunk(chunk))
        return tasks
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    embeddings = loop.run_until_complete(process_all_chunks())
    loop.close()
    
    return embeddings
