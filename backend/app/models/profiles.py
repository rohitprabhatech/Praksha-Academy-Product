"""Teacher and student profile tables."""

from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Optional

from sqlalchemy import Date, Enum, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class TeacherProfile(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "teacher_profiles"
    __table_args__ = (
        UniqueConstraint("tenant_id", "user_id", name="uk_teacher_profiles_user"),
        UniqueConstraint("tenant_id", "employee_code", name="uk_teacher_profiles_code"),
    )

    id: Mapped[str] = uuid_pk()
    user_id: Mapped[str] = uuid_fk("users.id", ondelete="CASCADE")
    employee_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    qualification: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    experience_years: Mapped[Optional[Decimal]] = mapped_column(Numeric(4, 1), nullable=True)
    specialization: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    joined_at: Mapped[Optional[date]] = mapped_column(Date, nullable=True)


class StudentProfile(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "student_profiles"
    __table_args__ = (
        UniqueConstraint("tenant_id", "user_id", name="uk_student_profiles_user"),
        UniqueConstraint("tenant_id", "enrollment_number", name="uk_student_profiles_enrollment"),
    )

    id: Mapped[str] = uuid_pk()
    user_id: Mapped[str] = uuid_fk("users.id", ondelete="CASCADE")
    enrollment_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    date_of_birth: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    gender: Mapped[Optional[str]] = mapped_column(
        Enum(
            "male",
            "female",
            "other",
            "prefer_not_to_say",
            name="student_gender",
            native_enum=True,
        ),
        nullable=True,
    )
    guardian_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    guardian_phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    address_line1: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    joined_at: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
