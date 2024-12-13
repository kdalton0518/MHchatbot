from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .app.auth import get_hashed_password
from .app.config import settings
from .app.routers import api_router
from .app.models import User, History
from .app.utils import supabase_urlkey_conn, postgres_userpass_conn

# Create initial superuser


@asynccontextmanager
async def lifespan(app: FastAPI):
    # engine, async_session = postgres_userpass_conn()
    supabase_client = supabase_urlkey_conn()

    # Create initial superuser
    try:
        user = supabase_client.from_('users').select('email').eq(
            'email', settings.FIRST_SUPERUSER).execute()
        user = user.data

        if not user:
            user = supabase_client.from_('users').insert([
                {
                    'email': settings.FIRST_SUPERUSER,
                    'hashed_password': get_hashed_password(settings.FIRST_SUPERUSER_PASSWORD),
                    'is_superuser': True,
                    'is_active': True  # Explicitly set is_active
                }
            ]).execute()
    except Exception as e:
        print(f"Error creating superuser: {str(e)}")
        raise

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            # See https://github.com/pydantic/pydantic/issues/7186 for reason of using rstrip
            str(origin).rstrip("/")
            for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print([str(origin).rstrip("/")
          for origin in settings.BACKEND_CORS_ORIGINS])


app.include_router(api_router, prefix=settings.API_V1_STR)
