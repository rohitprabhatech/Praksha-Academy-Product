"""Question bank model — reusable questions for quizzes and exams."""

from __future__ import annotations

from typing import Optional

from sqlalchemy import Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class QuestionBank(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "question_bank"

    id: Mapped[str] = uuid_pk()
    subject_id: Mapped[Optional[str]] = uuid_fk(
        "subjects.id", nullable=True, ondelete="SET NULL", index=True
    )
    question_text: Mapped[str] = mapped_column(String(2000), nullable=False)
    question_type: Mapped[str] = mapped_column(String(20), nullable=False, server_default="'mcq'")
    difficulty: Mapped[str] = mapped_column(String(10), nullable=False, server_default="'medium'", index=True)
    tags_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    explanation: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class QuestionBankOption(Base):
    __tablename__ = "question_bank_options"

    id: Mapped[str] = uuid_pk()
    tenant_id: Mapped[str] = uuid_fk("tenants.id", ondelete="CASCADE")
    question_id: Mapped[str] = uuid_fk("question_bank.id", ondelete="CASCADE", index=True)
    option_text: Mapped[str] = mapped_column(String(500), nullable=False)
    is_correct: Mapped[int] = mapped_column(nullable=False, server_default="0")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
