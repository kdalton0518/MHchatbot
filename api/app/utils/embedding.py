# Get OpenAI Embedding

import asyncio
from openai import OpenAI
from ..config import settings


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


# embeddings = openai_embedding_list(contexts, 100)
# with open("embeddings.json", "w") as f:
#     json.dump(embeddings, f)