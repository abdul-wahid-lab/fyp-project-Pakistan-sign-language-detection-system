# D:\4-2026\backend\services\speech_service.py

import os
from pygame import mixer
from core.config import settings

_initialized = False


def play(label: str):
    global _initialized
    mp3 = os.path.join(settings.SPEECH_DIR, f"{label}.mp3")
    if not os.path.exists(mp3):
        print(f"[audio] file not found: {mp3}")
        return
    if not _initialized:
        mixer.init()
        _initialized = True
    if mixer.music.get_busy():
        mixer.music.stop()
    mixer.music.load(mp3)
    mixer.music.play()
