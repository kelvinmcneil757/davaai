from fastapi import APIRouter
from ai_service import generate_summary

router = APIRouter()

@router.get("/ping-openai")
def ping_openai():
    test_prompt = "Summarize the benefits of using AI for product strategy."
    result = generate_summary(test_prompt, {})
    return result 