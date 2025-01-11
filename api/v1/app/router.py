from fastapi import APIRouter, Body

from .chatbot import MHChatBot
from .classification import MLClassification
from .search import SemanticSearch

router = APIRouter()
mhchatbot = MHChatBot()
semanticsearch = SemanticSearch()
mlclassification = MLClassification()

@router.get("/")
async def root():
    return {"message": "Welcome to the MHChatbot FASTAPI!"}


@router.post("/chatbot")
async def chat_bot(
    user_message: str = Body(...),
    user_id: str = Body(...)
):
    """
    Chat with Medical LLM (domain-specific Model)
    """
    assitant_message = await mhchatbot.send(user_message, user_id)
    return {"response": assitant_message}

@router.post("/chathistory")
async def chat_history(
    user_id: str = Body(...)
):
    """
    Get chat history for a user
    """
    
    chat_history = await mhchatbot.get_chat_history(user_id)
    return {"response": chat_history}


@router.post("/semanticsearch")
async def semantic_search(
    query: str = Body(...)
):
    """
    Semantic Search
    """
    response = await semanticsearch.search(query)
    return {"response": response}


@router.post("/classification")
async def ml_classification(
    query: str = Body(...)
):
    """
    Classification using Machine Learning Model
    """
    response = mlclassification.classify(query)
    return {"response": response}
