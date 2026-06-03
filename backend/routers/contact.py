import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from core.config import settings

router = APIRouter()


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str


class FeedbackForm(BaseModel):
    name: Optional[str] = ""
    ratings: Dict[str, int] = {}
    likes: str
    improve: str


def _send_email(subject: str, body: str, reply_to: Optional[str] = None) -> None:
    if not settings.SMTP_PASS:
        raise HTTPException(status_code=503, detail="Email service not configured")
    msg = MIMEMultipart()
    msg["From"] = f"PSL Website <{settings.SMTP_USER}>"
    msg["To"] = settings.CONTACT_TO
    msg["Subject"] = subject
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.attach(MIMEText(body, "plain"))
    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.send_message(msg)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {e}")


@router.post("/contact")
async def send_contact_email(form: ContactForm):
    if not settings.SMTP_PASS:
        raise HTTPException(status_code=503, detail="Email service not configured")

    body = f"Name: {form.name}\nEmail: {form.email}\n\nMessage:\n{form.message}"
    _send_email(
        subject=f"PSL Contact from {form.email} ({form.name})",
        body=body,
        reply_to=f"{form.name} <{form.email}>",
    )
    return {"success": True}


@router.post("/feedback")
async def send_feedback_email(form: FeedbackForm):
    label_map = {"accuracy": "Detection Accuracy", "speed": "Response Speed", "usability": "Ease of Use", "overall": "Overall Experience"}
    ratings_lines = "\n".join(
        f"  {label_map.get(k, k)}: {'★' * v}{'☆' * (5 - v)} ({v}/5)"
        for k, v in form.ratings.items() if v > 0
    ) or "  (no ratings given)"

    body = (
        f"From: {form.name or 'Anonymous'}\n\n"
        f"Ratings:\n{ratings_lines}\n\n"
        f"What they liked:\n{form.likes}\n\n"
        f"What could be improved:\n{form.improve}"
    )
    _send_email(subject=f"PSL Feedback from {form.name or 'Anonymous'}", body=body)
    return {"success": True}
