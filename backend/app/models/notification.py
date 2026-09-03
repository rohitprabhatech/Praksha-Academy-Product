"""Notifications and recipients."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class Notification(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "notifications"

    id: Mapped[str] = uuid_pk()
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    notification_type: Mapped[str] = mapped_column(
        Enum(
            "info",
            "warning",
            "success",
            "alert",
            name="notification_type",
            native_enum=True,
        ),
        nullable=False,
        server_default="info",
    )
    audience_type: Mapped[str] = mapped_column(
        Enum(
            "all",
            "students",
            "teachers",
            "owners",
            "specific_user",
            name="notification_audience_type",
            native_enum=True,
        ),
        nullable=False,
        server_default="all",
    )
    target_user_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    status: Mapped[str] = mapped_column(
        Enum(
            "draft",
            "scheduled",
            "sent",
            "cancelled",
            name="notification_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="draft",
        index=True,
    )
    scheduled_at: Mapped[Optional[datetime]] = mapped_column(nullable=True, index=True)
    sent_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class NotificationRecipient(TenantOwnedMixin, Base):
    __tablename__ = "notification_recipients"
    __table_args__ = (
        UniqueConstraint(
            "tenant_id", "notification_id", "user_id", name="uk_notification_recipients"
        ),
    )

    id: Mapped[str] = uuid_pk()
    notification_id: Mapped[str] = uuid_fk("notifications.id", ondelete="CASCADE")
    user_id: Mapped[str] = uuid_fk("users.id", ondelete="CASCADE", index=True)
    is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0", index=True)
    read_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    delivered_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
