"""Marks / gradebook table."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import DateTime, Enum, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class Mark(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "marks"

    id: Mapped[str] = uuid_pk()
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="CASCADE", index=True)
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE", index=True)
    enrollment_id: Mapped[str] = uuid_fk("enrollments.id", ondelete="CASCADE", index=True)
    assessment_type: Mapped[str] = mapped_column(
        Enum(
            "assignment",
            "quiz",
            "exam",
            "manual",
            name="marks_assessment_type",
            native_enum=True,
        ),
        nullable=False,
    )
    assessment_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    score: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    max_score: Mapped[Decimal] = mapped_column(
        Numeric(5, 2), nullable=False, server_default="100.00"
    )
    remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
    recorded_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
