"""Study materials and live classes."""

from __future__ import annotations

from datetime import date, time
from typing import Optional

from sqlalchemy import BigInteger, Date, Enum, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class StudyMaterial(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "study_materials"

    id: Mapped[str] = uuid_pk()
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE", index=True)
    batch_id: Mapped[Optional[str]] = uuid_fk(
        "batches.id", nullable=True, ondelete="SET NULL", index=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    material_type: Mapped[str] = mapped_column(
        Enum(
            "pdf",
            "notes",
            "ppt",
            "video",
            "document",
            "link",
            name="study_material_type",
            native_enum=True,
        ),
        nullable=False,
    )
    file_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    file_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    file_size_bytes: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    mime_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("draft", "published", "archived", name="study_material_status", native_enum=True),
        nullable=False,
        server_default="draft",
        index=True,
    )
    uploaded_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class LiveClass(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "live_classes"

    id: Mapped[str] = uuid_pk()
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE", index=True)
    batch_id: Mapped[Optional[str]] = uuid_fk(
        "batches.id", nullable=True, ondelete="SET NULL", index=True
    )
    teacher_id: Mapped[str] = uuid_fk("teacher_profiles.id", ondelete="RESTRICT", index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    session_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    meeting_link: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    recording_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(
        Enum(
            "scheduled",
            "live",
            "completed",
            "cancelled",
            name="live_class_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="scheduled",
        index=True,
    )
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
