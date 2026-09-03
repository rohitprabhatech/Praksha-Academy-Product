"""Course catalog and curriculum structure."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum, Integer, Numeric, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class Course(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "courses"
    __table_args__ = (UniqueConstraint("tenant_id", "slug", name="uk_courses_slug"),)

    id: Mapped[str] = uuid_pk()
    academic_class_id: Mapped[Optional[str]] = uuid_fk(
        "academic_classes.id", nullable=True, ondelete="SET NULL", index=True
    )
    subject_id: Mapped[Optional[str]] = uuid_fk(
        "subjects.id", nullable=True, ondelete="SET NULL", index=True
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False, server_default="0.00")
    discount_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    duration_label: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    language: Mapped[str] = mapped_column(String(50), nullable=False, server_default="English")
    course_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("draft", "published", "archived", name="course_status", native_enum=True),
        nullable=False,
        server_default="draft",
        index=True,
    )
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0")
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    updated_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class CourseTeacher(TenantOwnedMixin, Base):
    __tablename__ = "course_teachers"
    __table_args__ = (
        UniqueConstraint("tenant_id", "course_id", "teacher_id", name="uk_course_teachers"),
    )

    id: Mapped[str] = uuid_pk()
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE", index=True)
    teacher_id: Mapped[str] = uuid_fk("teacher_profiles.id", ondelete="CASCADE", index=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0")
    assigned_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
    assigned_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class CourseModule(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "course_modules"

    id: Mapped[str] = uuid_pk()
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE", index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    status: Mapped[str] = mapped_column(
        Enum("active", "inactive", name="course_module_status", native_enum=True),
        nullable=False,
        server_default="active",
    )


class CourseChapter(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "course_chapters"

    id: Mapped[str] = uuid_pk()
    module_id: Mapped[str] = uuid_fk("course_modules.id", ondelete="CASCADE", index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    status: Mapped[str] = mapped_column(
        Enum("active", "inactive", name="course_chapter_status", native_enum=True),
        nullable=False,
        server_default="active",
    )


class CourseLesson(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "course_lessons"

    id: Mapped[str] = uuid_pk()
    chapter_id: Mapped[str] = uuid_fk("course_chapters.id", ondelete="CASCADE", index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    lesson_type: Mapped[str] = mapped_column(
        Enum(
            "video",
            "document",
            "text",
            "link",
            "mixed",
            name="course_lesson_type",
            native_enum=True,
        ),
        nullable=False,
        server_default="text",
    )
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    video_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    status: Mapped[str] = mapped_column(
        Enum("active", "inactive", name="course_lesson_status", native_enum=True),
        nullable=False,
        server_default="active",
    )
