"""Academic structure: classes, subjects, batches."""

from __future__ import annotations

from datetime import date
from typing import Optional

from sqlalchemy import Date, Enum, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class AcademicClass(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "academic_classes"
    __table_args__ = (
        UniqueConstraint("tenant_id", "name", name="uk_academic_classes_name"),
        UniqueConstraint("tenant_id", "code", name="uk_academic_classes_code"),
    )

    id: Mapped[str] = uuid_pk()
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    status: Mapped[str] = mapped_column(
        Enum("active", "inactive", name="academic_class_status", native_enum=True),
        nullable=False,
        server_default="active",
        index=True,
    )
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    updated_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class Subject(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "subjects"
    __table_args__ = (
        UniqueConstraint("tenant_id", "name", name="uk_subjects_name"),
        UniqueConstraint("tenant_id", "code", name="uk_subjects_code"),
    )

    id: Mapped[str] = uuid_pk()
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("active", "inactive", name="subject_status", native_enum=True),
        nullable=False,
        server_default="active",
    )
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    updated_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class Batch(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "batches"
    __table_args__ = (
        UniqueConstraint("tenant_id", "academic_class_id", "name", name="uk_batches_name_class"),
    )

    id: Mapped[str] = uuid_pk()
    academic_class_id: Mapped[str] = uuid_fk(
        "academic_classes.id", ondelete="RESTRICT", index=True
    )
    course_id: Mapped[Optional[str]] = uuid_fk(
        "courses.id", nullable=True, ondelete="SET NULL", index=True
    )
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("active", "inactive", "completed", name="batch_status", native_enum=True),
        nullable=False,
        server_default="active",
        index=True,
    )
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    updated_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
