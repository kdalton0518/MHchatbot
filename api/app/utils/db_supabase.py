import supabase
from ..config import settings


def supabase_userpass_conn():
    url = f"https://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/mhchatbot"
    supabase_client = supabase.create_client(url, settings.SUPABASE_KEY)
    return supabase_client


def supabase_urlkey_conn():
    supabase_client = supabase.create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return supabase_client

