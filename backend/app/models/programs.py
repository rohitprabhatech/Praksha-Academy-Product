"""Programs and program_courses models."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DECIMAL, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class Program(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "programs"
    __table_args__ = (
        UniqueConstraint("tenant_id", "slug", name="uk_programs_slug"),
    )

    id: Mapped[str] = uuid_pk()
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(220), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    price: Mapped[float] = mapped_column(DECIMAL(12, 2), nullable=False, server_default="0.00")
    discount_price: Mapped[Optional[float]] = mapped_column(DECIMAL(12, 2), nullable=True)
    duration_label: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_featured: Mapped[int] = mapped_column(nullable=False, server_default="0")
    status: Mapped[str] = mapped_column(String(20), nullable=False, server_default="'draft'", index=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class ProgramCourse(Base):
    __tablename__ = "program_courses"
    __table_args__ = (
        UniqueConstraint("tenant_id", "program_id", "course_id", name="uk_program_courses"),
    )

    id: Mapped[str] = uuid_pk()
    tenant_id: Mapped[str] = uuid_fk("tenants.id", ondelete="CASCADE", index=True)
    program_id: Mapped[str] = uuid_fk("programs.id", ondelete="CASCADE", index=True)
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE", index=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    created_at: Mapped[datetime] = mapped_column(nullable=False)
