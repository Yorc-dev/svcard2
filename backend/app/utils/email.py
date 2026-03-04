from decouple import config

import aiosmtplib
from email.message import EmailMessage

async def send_activation_email(to_email: str, activation_code: str):
    msg = EmailMessage()
    msg["From"] = config("FROM_EMAIL")
    msg["To"] = to_email
    msg["Subject"] = "Confirm your account"
    link = f"{config('EMAIL_HOST')}/api/users/confirm/{activation_code}"
    msg.set_content(f"Hello!\nPlease confirm your account by clicking this link: {link}")

    await aiosmtplib.send(
        msg,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username="nikitagrebnev311@gmail.com",
        password="trzs doyh fylu mgyh",
    )