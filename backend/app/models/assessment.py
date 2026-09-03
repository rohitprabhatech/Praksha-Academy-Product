"""Assignments and submissions."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import Enum, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class Assignment(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "assignments"

    id: Mapped[str] = uuid_pk()
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE", index=True)
    batch_id: Mapped[Optional[str]] = uuid_fk(
        "batches.id", nullable=True, ondelete="SET NULL", index=True
    )
    teacher_id: Mapped[Optional[str]] = uuid_fk(
        "teacher_profiles.id", nullable=True, ondelete="SET NULL", index=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    attachment_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    due_at: Mapped[Optional[datetime]] = mapped_column(nullable=True, index=True)
    max_score: Mapped[Decimal] = mapped_column(
        Numeric(5, 2), nullable=False, server_default="100.00"
    )
    status: Mapped[str] = mapped_column(
        Enum("draft", "published", "closed", name="assignment_status", native_enum=True),
        nullable=False,
        server_default="draft",
        index=True,
    )
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class AssignmentSubmission(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "assignment_submissions"
    __table_args__ = (
        UniqueConstraint(
            "tenant_id", "assignment_id", "student_id", name="uk_assignment_submissions"
        ),
    )

    id: Mapped[str] = uuid_pk()
    assignment_id: Mapped[str] = uuid_fk("assignments.id", ondelete="CASCADE", index=True)
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="CASCADE", index=True)
    enrollment_id: Mapped[str] = uuid_fk("enrollments.id", ondelete="CASCADE")
    submission_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    file_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    file_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(
        Enum(
            "not_started",
            "submitted",
            "late",
            "reviewed",
            "closed",
            name="assignment_submission_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="not_started",
        index=True,
    )
    score: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    submitted_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    reviewed_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
