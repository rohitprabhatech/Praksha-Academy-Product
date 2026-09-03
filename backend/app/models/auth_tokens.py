"""Auth token tables: refresh_tokens, user_sessions."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import uuid_fk, uuid_pk


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[str] = uuid_pk()
    user_id: Mapped[str] = uuid_fk("users.id", ondelete="CASCADE", index=True)
    token_hash: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    device_info: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False, index=True)
    revoked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=False), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )


class UserSession(Base):
    __tablename__ = "user_sessions"

    id: Mapped[str] = uuid_pk()
    user_id: Mapped[str] = uuid_fk("users.id", ondelete="CASCADE", index=True)
    refresh_token_id: Mapped[str] = uuid_fk("refresh_tokens.id", ondelete="CASCADE", index=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_active: Mapped[int] = mapped_column(Integer, nullable=False, server_default="1", index=True)
    last_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
