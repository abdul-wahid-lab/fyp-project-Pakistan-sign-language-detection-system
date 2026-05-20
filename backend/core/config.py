from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    FRONTEND_URL: str = "http://localhost:3000"
    KEYPOINTS_DIR: str = "Keypoints"
    DATA_DIR: str = "PSL/data"
    SPEECH_DIR: str = "data/speech"
    CAMERA_INDEX: int = 0

    class Config:
        env_file = ".env"

settings = Settings()
