"""Teacher announcements model."""

from __future__ import annotations

from typing import Optional

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class Announcement(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "announcements"

    id: Mapped[str] = uuid_pk()
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE", index=True)
    batch_id: Mapped[Optional[str]] = uuid_fk(
        "batches.id", nullable=True, ondelete="SET NULL", index=True
    )
    posted_by: Mapped[str] = uuid_fk("teacher_profiles.id", ondelete="RESTRICT", index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(String(5000), nullable=False)
    attachment_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(10), nullable=False, server_default="'active'")
