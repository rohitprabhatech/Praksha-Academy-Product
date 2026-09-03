"""Tenant website CMS settings model."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import TimestampMixin, TenantOwnedMixin, uuid_fk, uuid_pk


class TenantWebsiteSettings(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "tenant_website_settings"

    id: Mapped[str] = uuid_pk()

    # Branding
    primary_color: Mapped[Optional[str]] = mapped_column(String(20), nullable=True, server_default="'#1976d2'")
    secondary_color: Mapped[Optional[str]] = mapped_column(String(20), nullable=True, server_default="'#dc004e'")
    font_family: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, server_default="'Inter'")
    logo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    favicon_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Navigation toggles
    show_blog: Mapped[int] = mapped_column(nullable=False, server_default="0")
    show_gallery: Mapped[int] = mapped_column(nullable=False, server_default="0")
    show_faq: Mapped[int] = mapped_column(nullable=False, server_default="0")
    show_testimonials: Mapped[int] = mapped_column(nullable=False, server_default="1")
    show_programs: Mapped[int] = mapped_column(nullable=False, server_default="1")

    # Page content (structured JSON)
    home_page_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    about_page_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    contact_page_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    courses_header_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    programs_page_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # SEO
    seo_title: Mapped[Optional[str]] = mapped_column(String(250), nullable=True)
    seo_description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    seo_keywords: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Publish state
    is_published: Mapped[int] = mapped_column(nullable=False, server_default="0", index=True)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=False), nullable=True)
    published_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
