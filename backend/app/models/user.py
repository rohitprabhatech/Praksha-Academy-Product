"""User identity and auth-token tables."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Enum, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TimestampMixin, uuid_fk, uuid_pk


class User(TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("tenant_id", "email", name="uk_users_tenant_email"),)

    id: Mapped[str] = uuid_pk()
    tenant_id: Mapped[Optional[str]] = uuid_fk(
        "tenants.id", nullable=True, ondelete="RESTRICT", index=True
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(
        Enum(
            "pending",
            "active",
            "inactive",
            "suspended",
            name="user_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="pending",
        index=True,
    )
    email_verified_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    updated_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class UserRole(Base):
    __tablename__ = "user_roles"
    __table_args__ = (
        UniqueConstraint("user_id", "role_id", "tenant_id", name="uk_user_roles_user_role_tenant"),
    )

    id: Mapped[str] = uuid_pk()
    user_id: Mapped[str] = uuid_fk("users.id", ondelete="CASCADE", index=True)
    role_id: Mapped[str] = uuid_fk("roles.id", ondelete="RESTRICT", index=True)
    tenant_id: Mapped[Optional[str]] = uuid_fk(
        "tenants.id", nullable=True, ondelete="CASCADE", index=True
    )
    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
    assigned_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    __table_args__ = (UniqueConstraint("token_hash", name="uk_password_reset_tokens_hash"),)

    id: Mapped[str] = uuid_pk()
    user_id: Mapped[str] = uuid_fk("users.id", ondelete="CASCADE", index=True)
    token_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(nullable=False, index=True)
    used_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )


class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id: Mapped[str] = uuid_pk()
    user_id: Mapped[str] = uuid_fk("users.id", ondelete="CASCADE", index=True)
    otp_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    purpose: Mapped[str] = mapped_column(
        Enum(
            "registration",
            "email_change",
            "login",
            name="email_verification_purpose",
            native_enum=True,
        ),
        nullable=False,
        server_default="registration",
    )
    expires_at: Mapped[datetime] = mapped_column(nullable=False, index=True)
    verified_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
