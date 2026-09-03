"""Quiz tables: quizzes, questions, options, attempts, answers."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum, Integer, Numeric, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class Quiz(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "quizzes"

    id: Mapped[str] = uuid_pk()
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE", index=True)
    batch_id: Mapped[Optional[str]] = uuid_fk(
        "batches.id", nullable=True, ondelete="SET NULL", index=True
    )
    teacher_id: Mapped[Optional[str]] = uuid_fk(
        "teacher_profiles.id", nullable=True, ondelete="SET NULL"
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    max_attempts: Mapped[int] = mapped_column(Integer, nullable=False, server_default="1")
    passing_score: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    available_from: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    available_until: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("draft", "published", "closed", name="quiz_status", native_enum=True),
        nullable=False,
        server_default="draft",
        index=True,
    )
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class QuizQuestion(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "quiz_questions"

    id: Mapped[str] = uuid_pk()
    quiz_id: Mapped[str] = uuid_fk("quizzes.id", ondelete="CASCADE", index=True)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    question_type: Mapped[str] = mapped_column(
        Enum("mcq", "short_text", name="quiz_question_type", native_enum=True),
        nullable=False,
        server_default="mcq",
    )
    points: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False, server_default="1.00")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")


class QuizQuestionOption(TenantOwnedMixin, Base):
    __tablename__ = "quiz_question_options"

    id: Mapped[str] = uuid_pk()
    question_id: Mapped[str] = uuid_fk("quiz_questions.id", ondelete="CASCADE", index=True)
    option_text: Mapped[str] = mapped_column(String(500), nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )


class QuizAttempt(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "quiz_attempts"
    __table_args__ = (
        UniqueConstraint(
            "tenant_id", "quiz_id", "student_id", "attempt_number", name="uk_quiz_attempts"
        ),
    )

    id: Mapped[str] = uuid_pk()
    quiz_id: Mapped[str] = uuid_fk("quizzes.id", ondelete="CASCADE", index=True)
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="CASCADE", index=True)
    enrollment_id: Mapped[str] = uuid_fk("enrollments.id", ondelete="CASCADE")
    attempt_number: Mapped[int] = mapped_column(Integer, nullable=False, server_default="1")
    status: Mapped[str] = mapped_column(
        Enum(
            "in_progress",
            "submitted",
            "graded",
            "abandoned",
            name="quiz_attempt_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="in_progress",
        index=True,
    )
    score: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    max_score: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
    submitted_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    graded_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)


class QuizAnswer(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "quiz_answers"
    __table_args__ = (
        UniqueConstraint("tenant_id", "attempt_id", "question_id", name="uk_quiz_answers"),
    )

    id: Mapped[str] = uuid_pk()
    attempt_id: Mapped[str] = uuid_fk("quiz_attempts.id", ondelete="CASCADE", index=True)
    question_id: Mapped[str] = uuid_fk("quiz_questions.id", ondelete="CASCADE")
    selected_option_id: Mapped[Optional[str]] = uuid_fk(
        "quiz_question_options.id", nullable=True, ondelete="SET NULL"
    )
    answer_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_correct: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    points_awarded: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
