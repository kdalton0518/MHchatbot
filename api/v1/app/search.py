import json

from sqlalchemy import text

from .utils import async_session, openai_embedding_one


class SemanticSearch():
    def __init__(self):
        self.async_session = async_session

    async def search(self, query):
        query_vector = openai_embedding_one(query)
        
        # Convert query_vector into a string (JSON format)
        query_vector_str = json.dumps(query_vector)
        
        async with self.async_session() as session:
            sql = text("""
            SELECT id, context, response, semantic_vector <=> cast(:query_vector as vector) as similarity
            FROM "Embedding" 
            ORDER BY semantic_vector <=> cast(:query_vector as vector)
            LIMIT 5
            """)
            
            result = await session.execute(
                sql,
                {"query_vector": query_vector_str}
            )
            rows = result.fetchall()
            
            return [
                {
                    "id": row.id,
                    "context": row.context,
                    "response": row.response,
                    "similarity": row.similarity
                }
                for row in rows
            ]

