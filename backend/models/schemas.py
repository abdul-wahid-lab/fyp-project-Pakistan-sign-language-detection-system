from pydantic import BaseModel
from typing import Optional

class CaptureRequest(BaseModel):
    duration: Optional[int] = None

class MatchRequest(BaseModel):
    mode: int = 1
    speech: int = 0
    voice_mode: str = "offline"

class PredictionResponse(BaseModel):
    label: str
    mode: int

class StatusResponse(BaseModel):
    status: str

class LabelRequest(BaseModel):
    label: str
    mode: int = 1
