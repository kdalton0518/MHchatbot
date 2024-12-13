from fastapi import APIRouter, Body, Depends

from ..auth import get_current_active_user
from ..models import User
from ..services import new_chat, fetch_all_history, semanticsearch


router = APIRouter()


@router.post("/llm")
async def chatbot_llm(
    user_message: str = Body(...),
    current_user: User = Depends(get_current_active_user),
):
    """
    Chat with Medical LLM (domain-specific Model)
    """
    response = new_chat(user_message, current_user.uuid)
    return {"response": response}

@router.get("/chathistory")
async def chat_history(
    current_user: User = Depends(get_current_active_user),
):
    """
    Chat with Medical LLM (domain-specific Model)
    """
    response = fetch_all_history(current_user.uuid)
    return {"response": response}


@router.post("/ss")
async def semantic_search(
    query: str = Body(...)
):
    """
    Semantic Search
    """
    response = semanticsearch(query)
    return {"response": response}


@router.post("/ml")
async def classification_ml(
    query: str = Body(...)
):
    """
    Classification using Machine Learning Model
    """
    pass

