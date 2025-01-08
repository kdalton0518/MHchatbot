from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .app.config import settings
from .app.router import router

app = FastAPI()

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "*"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
app.include_router(router=router, prefix=settings.API_V1_STR)
