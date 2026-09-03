"""Platform and tenant audit log tables."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from sqlalchemy import DateTime, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TenantOwnedMixin, uuid_fk, uuid_pk


class PlatformAuditLog(Base):
    __tablename__ = "platform_audit_logs"

    id: Mapped[str] = uuid_pk()
    actor_user_id: Mapped[Optional[str]] = uuid_fk(
        "users.id", nullable=True, ondelete="SET NULL", index=True
    )
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    tenant_id: Mapped[Optional[str]] = uuid_fk(
        "tenants.id", nullable=True, ondelete="SET NULL", index=True
    )
    metadata_json: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
        index=True,
    )


class TenantAuditLog(TenantOwnedMixin, Base):
    __tablename__ = "tenant_audit_logs"

    id: Mapped[str] = uuid_pk()
    actor_user_id: Mapped[Optional[str]] = uuid_fk(
        "users.id", nullable=True, ondelete="SET NULL", index=True
    )
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    metadata_json: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
        index=True,
    )
