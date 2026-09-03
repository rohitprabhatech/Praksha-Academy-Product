"""Shared SQLAlchemy column helpers and mixins (Sprint 02)."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column


def uuid_pk() -> Mapped[str]:
    return mapped_column(String(36), primary_key=True)


def uuid_fk(
    column: str,
    *,
    nullable: bool = False,
    ondelete: str | None = None,
    onupdate: str = "CASCADE",
    primary_key: bool = False,
    index: bool = False,
) -> Mapped[str]:
    fk_kwargs = {"onupdate": onupdate}
    if ondelete:
        fk_kwargs["ondelete"] = ondelete
    return mapped_column(
        String(36),
        ForeignKey(column, **fk_kwargs),
        nullable=nullable,
        primary_key=primary_key,
        index=index,
    )


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )


class SoftDeleteMixin:
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=False),
        nullable=True,
    )


class TenantOwnedMixin:
    tenant_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("tenants.id", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
