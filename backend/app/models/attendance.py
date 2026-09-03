"""Attendance records."""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from sqlalchemy import Date, DateTime, Enum, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class AttendanceRecord(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "attendance_records"
    __table_args__ = (
        UniqueConstraint(
            "tenant_id",
            "student_id",
            "attendance_date",
            "course_id",
            "batch_id",
            "live_class_id",
            name="uk_attendance_session",
        ),
    )

    id: Mapped[str] = uuid_pk()
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="CASCADE", index=True)
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE", index=True)
    batch_id: Mapped[Optional[str]] = uuid_fk(
        "batches.id", nullable=True, ondelete="SET NULL"
    )
    live_class_id: Mapped[Optional[str]] = uuid_fk(
        "live_classes.id", nullable=True, ondelete="SET NULL"
    )
    attendance_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    status: Mapped[str] = mapped_column(
        Enum("present", "absent", "late", name="attendance_status", native_enum=True),
        nullable=False,
        server_default="absent",
    )
    remarks: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    marked_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    marked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
