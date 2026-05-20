
from fastapi import APIRouter
from models.schemas import StatusResponse
from services import mediapipe_service

router = APIRouter()


@router.post("/start-capture", response_model=StatusResponse)
def start_capture():
    mediapipe_service.start()
    return {"status": "capture started"}


@router.post("/stop-capture", response_model=StatusResponse)
def stop_capture():
    mediapipe_service.stop()
    return {"status": "capture stopped"}
