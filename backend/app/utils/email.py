"""Email sending helpers.

Development: print/log the content.
Production: replace with SMTP or a provider (SendGrid, etc.).
"""

from __future__ import annotations

import logging

from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


def send_otp_email(to_email: str, name: str, otp: str) -> None:
    """Send OTP for email verification."""
    if settings.is_development:
        logger.info("[DEV EMAIL] To: %s | OTP: %s", to_email, otp)
        print(f"\n{'=' * 40}")
        print("EMAIL VERIFICATION OTP")
        print(f"To: {to_email} ({name})")
        print(f"OTP: {otp}")
        print(f"{'=' * 40}\n")
        return
    # TODO: Implement SMTP / email provider in production
    logger.warning("Email delivery not configured; OTP for %s not sent", to_email)


def send_password_reset_email(to_email: str, name: str, token: str) -> None:
    """Send password reset token."""
    if settings.is_development:
        logger.info("[DEV EMAIL] To: %s | Reset Token: %s", to_email, token)
        print(f"\n{'=' * 40}")
        print("PASSWORD RESET")
        print(f"To: {to_email} ({name})")
        print(f"Reset Token: {token}")
        print(f"{'=' * 40}\n")
        return
    # TODO: Implement SMTP / email provider in production
    logger.warning("Email delivery not configured; reset token for %s not sent", to_email)
