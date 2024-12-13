from fastapi import APIRouter

from . import login, users, services

api_router = APIRouter()
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(services.router, prefix="/services", tags=["services"])


@api_router.get("/")
async def root():
    return {"message": "Welcome to the MHChatbot Backend API!"}
