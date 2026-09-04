"""Security helpers: password hashing, JWT, OTP, and token hashing."""

from __future__ import annotations

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=settings.bcrypt_rounds,
)


def hash_password(plain_password: str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Verify a plaintext password against a stored hash."""
    return pwd_context.verify(plain_password, password_hash)


def create_access_token(
    user_id: str,
    tenant_id: Optional[str],
    roles: list[str],
    expires_minutes: Optional[int] = None,
) -> str:
    """Create a short-lived JWT access token."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes or settings.access_token_expire_minutes
    )
    payload: dict[str, Any] = {
        "sub": user_id,
        "tenant_id": tenant_id,
        "roles": roles,
        "exp": expire,
        "type": "access",
    }
    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT access token. Raises JWTError on failure."""
    payload = jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )
    if payload.get("type") != "access":
        raise JWTError("Invalid token type")
    return payload


def decode_token(token: str) -> dict[str, Any]:
    """Decode and validate any JWT. Raises JWTError on failure."""
    return jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )


class TokenDecodeError(Exception):
    """Raised when a token cannot be decoded or validated."""


def safe_decode_token(token: str) -> Optional[dict[str, Any]]:
    """Decode a JWT and return None instead of raising on failure."""
    try:
        return decode_token(token)
    except JWTError:
        return None


def generate_refresh_token() -> tuple[str, str]:
    """
    Returns (raw_token, hashed_token).
    Store only hashed_token in DB. Send raw_token to the client.
    """
    raw = secrets.token_urlsafe(64)
    hashed = hashlib.sha256(raw.encode()).hexdigest()
    return raw, hashed


def generate_otp() -> tuple[str, str]:
    """
    Returns (plain_otp, hashed_otp).
    Send plain_otp to the user. Store hashed_otp in DB.
    """
    plain = str(secrets.randbelow(900000) + 100000)  # 6-digit OTP
    hashed = hashlib.sha256(plain.encode()).hexdigest()
    return plain, hashed


def hash_token(token: str) -> str:
    """Hash any string token for safe DB storage."""
    return hashlib.sha256(token.encode()).hexdigest()


def utcnow_naive() -> datetime:
    """UTC now as naive datetime (matches MySQL DateTime columns)."""
    return datetime.now(timezone.utc).replace(tzinfo=None)
