"""Batch student membership table."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import uuid_fk, uuid_pk


class BatchStudent(Base):
    __tablename__ = "batch_students"
    __table_args__ = (
        UniqueConstraint("tenant_id", "batch_id", "student_id", name="uk_batch_students"),
    )

    id: Mapped[str] = uuid_pk()
    tenant_id: Mapped[str] = uuid_fk("tenants.id", ondelete="CASCADE")
    batch_id: Mapped[str] = uuid_fk("batches.id", ondelete="CASCADE", index=True)
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="CASCADE", index=True)
    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), nullable=False, server_default=func.current_timestamp()
    )
    status: Mapped[str] = mapped_column(String(10), nullable=False, server_default="'active'")
    added_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
