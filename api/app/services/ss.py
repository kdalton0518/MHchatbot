# Solution 1 - Normal Approach using Semantic Search

from ..utils import postgres_userpass_conn_sync, openai_embedding_one, supabase_urlkey_conn


def semanticsearch(query):
    query_vector = openai_embedding_one(query)
    supabase_client = supabase_urlkey_conn()
    rows = supabase_client.rpc("get_top_matches", {"query_vector": query_vector}).execute()

    return rows.data

