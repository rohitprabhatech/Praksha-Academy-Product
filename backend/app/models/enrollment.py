"""Enrollment and lesson progress tables."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import DateTime, Enum, Numeric, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class Enrollment(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint("tenant_id", "student_id", "course_id", name="uk_enrollments_student_course"),
    )

    id: Mapped[str] = uuid_pk()
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="CASCADE", index=True)
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="RESTRICT", index=True)
    batch_id: Mapped[Optional[str]] = uuid_fk(
        "batches.id", nullable=True, ondelete="SET NULL", index=True
    )
    status: Mapped[str] = mapped_column(
        Enum(
            "pending",
            "active",
            "completed",
            "cancelled",
            "transferred",
            name="enrollment_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="pending",
        index=True,
    )
    enrolled_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    progress_percent: Mapped[Decimal] = mapped_column(
        Numeric(5, 2), nullable=False, server_default="0.00"
    )
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class LessonProgress(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "lesson_progress"
    __table_args__ = (
        UniqueConstraint("tenant_id", "enrollment_id", "lesson_id", name="uk_lesson_progress"),
    )

    id: Mapped[str] = uuid_pk()
    enrollment_id: Mapped[str] = uuid_fk("enrollments.id", ondelete="CASCADE", index=True)
    lesson_id: Mapped[str] = uuid_fk("course_lessons.id", ondelete="CASCADE")
    status: Mapped[str] = mapped_column(
        Enum(
            "not_started",
            "in_progress",
            "completed",
            name="lesson_progress_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="not_started",
    )
    progress_percent: Mapped[Decimal] = mapped_column(
        Numeric(5, 2), nullable=False, server_default="0.00"
    )
    started_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    last_accessed_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
