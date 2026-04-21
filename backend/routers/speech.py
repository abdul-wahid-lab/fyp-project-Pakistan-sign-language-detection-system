# D:\4-2026\backend\routers\speech.py
# FROM: fyp\main.py (pygame mixer block)

from fastapi import APIRouter
from models.schemas import StatusResponse
from services import speech_service

router = APIRouter()


@router.post("/speech/{label}", response_model=StatusResponse)
def play_speech(label: str):
    speech_service.play(label)
    return {"status": f"playing {label}"}
