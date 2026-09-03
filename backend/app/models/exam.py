"""Exam tables: exams, questions, options, attempts, answers."""

from __future__ import annotations

from datetime import date, datetime, time
from decimal import Decimal
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, Enum, Integer, Numeric, String, Text, Time, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class Exam(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "exams"

    id: Mapped[str] = uuid_pk()
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE", index=True)
    batch_id: Mapped[Optional[str]] = uuid_fk(
        "batches.id", nullable=True, ondelete="SET NULL", index=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    exam_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    end_time: Mapped[Optional[time]] = mapped_column(Time, nullable=True)
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    max_score: Mapped[Decimal] = mapped_column(
        Numeric(5, 2), nullable=False, server_default="100.00"
    )
    is_online: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0")
    status: Mapped[str] = mapped_column(
        Enum(
            "draft",
            "scheduled",
            "in_progress",
            "completed",
            "cancelled",
            name="exam_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="draft",
        index=True,
    )
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class ExamQuestion(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "exam_questions"

    id: Mapped[str] = uuid_pk()
    exam_id: Mapped[str] = uuid_fk("exams.id", ondelete="CASCADE", index=True)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    question_type: Mapped[str] = mapped_column(
        Enum("mcq", "short_text", name="exam_question_type", native_enum=True),
        nullable=False,
        server_default="mcq",
    )
    points: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False, server_default="1.00")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")


class ExamQuestionOption(TenantOwnedMixin, Base):
    __tablename__ = "exam_question_options"

    id: Mapped[str] = uuid_pk()
    question_id: Mapped[str] = uuid_fk("exam_questions.id", ondelete="CASCADE", index=True)
    option_text: Mapped[str] = mapped_column(String(500), nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )


class ExamAttempt(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "exam_attempts"
    __table_args__ = (
        UniqueConstraint("tenant_id", "exam_id", "student_id", name="uk_exam_attempts"),
    )

    id: Mapped[str] = uuid_pk()
    exam_id: Mapped[str] = uuid_fk("exams.id", ondelete="CASCADE", index=True)
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="CASCADE", index=True)
    enrollment_id: Mapped[str] = uuid_fk("enrollments.id", ondelete="CASCADE")
    status: Mapped[str] = mapped_column(
        Enum(
            "in_progress",
            "submitted",
            "graded",
            "absent",
            name="exam_attempt_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="in_progress",
    )
    score: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    max_score: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    submitted_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    graded_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    graded_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class ExamAnswer(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "exam_answers"
    __table_args__ = (
        UniqueConstraint("tenant_id", "attempt_id", "question_id", name="uk_exam_answers"),
    )

    id: Mapped[str] = uuid_pk()
    attempt_id: Mapped[str] = uuid_fk("exam_attempts.id", ondelete="CASCADE", index=True)
    question_id: Mapped[str] = uuid_fk("exam_questions.id", ondelete="CASCADE")
    selected_option_id: Mapped[Optional[str]] = uuid_fk(
        "exam_question_options.id", nullable=True, ondelete="SET NULL"
    )
    answer_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_correct: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    points_awarded: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
