import json
import os
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Optional

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

from core.config import settings

router = APIRouter()

CONTACTS_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "contacts.json")


def _save_record(record: dict) -> None:
    os.makedirs(os.path.dirname(CONTACTS_FILE), exist_ok=True)
    try:
        with open(CONTACTS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = []
    data.append(record)
    with open(CONTACTS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def _send_email(subject: str, body: str, reply_to: Optional[str] = None) -> None:
    msg = MIMEMultipart()
    msg["From"] = f"LinguaSign <{settings.SMTP_USER}>"
    msg["To"] = settings.CONTACT_TO
    msg["Subject"] = subject
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.attach(MIMEText(body, "plain"))
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.send_message(msg)


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str


class FeedbackForm(BaseModel):
    name: Optional[str] = ""
    ratings: Dict[str, int] = {}
    likes: str
    improve: str


@router.post("/contact")
async def send_contact(form: ContactForm):
    record = {
        "type": "contact",
        "timestamp": datetime.now().isoformat(),
        "name": form.name,
        "email": form.email,
        "message": form.message,
    }
    _save_record(record)

    if settings.SMTP_PASS:
        body = f"Name: {form.name}\nEmail: {form.email}\n\nMessage:\n{form.message}"
        _send_email(
            subject=f"LinguaSign Contact — {form.name}",
            body=body,
            reply_to=f"{form.name} <{form.email}>",
        )

    return {"success": True}


@router.post("/feedback")
async def send_feedback(form: FeedbackForm):
    label_map = {
        "accuracy": "Detection Accuracy",
        "speed": "Response Speed",
        "usability": "Ease of Use",
        "overall": "Overall Experience",
    }
    ratings_lines = "\n".join(
        f"  {label_map.get(k, k)}: {'★' * v}{'☆' * (5 - v)} ({v}/5)"
        for k, v in form.ratings.items() if v > 0
    ) or "  (no ratings given)"

    record = {
        "type": "feedback",
        "timestamp": datetime.now().isoformat(),
        "name": form.name or "Anonymous",
        "ratings": form.ratings,
        "likes": form.likes,
        "improve": form.improve,
    }
    _save_record(record)

    if settings.SMTP_PASS:
        body = (
            f"From: {form.name or 'Anonymous'}\n\n"
            f"Ratings:\n{ratings_lines}\n\n"
            f"What they liked:\n{form.likes}\n\n"
            f"What could be improved:\n{form.improve}"
        )
        _send_email(subject=f"LinguaSign Feedback — {form.name or 'Anonymous'}", body=body)

    return {"success": True}
