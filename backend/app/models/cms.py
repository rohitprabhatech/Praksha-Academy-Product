"""CMS content: blog, gallery, FAQs, testimonials, contact messages."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from sqlalchemy import Enum, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class BlogPost(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "blog_posts"
    __table_args__ = (UniqueConstraint("tenant_id", "slug", name="uk_blog_posts_slug"),)

    id: Mapped[str] = uuid_pk()
    title: Mapped[str] = mapped_column(String(250), nullable=False)
    slug: Mapped[str] = mapped_column(String(270), nullable=False)
    excerpt: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    author_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    author_user_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    tags_json: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    seo_title: Mapped[Optional[str]] = mapped_column(String(250), nullable=True)
    seo_description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("draft", "published", "archived", name="blog_post_status", native_enum=True),
        nullable=False,
        server_default="draft",
        index=True,
    )
    published_at: Mapped[Optional[datetime]] = mapped_column(nullable=True, index=True)
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class GalleryItem(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "gallery_items"

    id: Mapped[str] = uuid_pk()
    title: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    media_type: Mapped[str] = mapped_column(
        Enum("image", "video", name="gallery_media_type", native_enum=True),
        nullable=False,
        server_default="image",
    )
    media_url: Mapped[str] = mapped_column(String(500), nullable=False)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    status: Mapped[str] = mapped_column(
        Enum("active", "inactive", name="gallery_item_status", native_enum=True),
        nullable=False,
        server_default="active",
        index=True,
    )
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class Faq(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "faqs"

    id: Mapped[str] = uuid_pk()
    question: Mapped[str] = mapped_column(String(500), nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    status: Mapped[str] = mapped_column(
        Enum("active", "inactive", name="faq_status", native_enum=True),
        nullable=False,
        server_default="active",
        index=True,
    )


class Testimonial(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "testimonials"

    id: Mapped[str] = uuid_pk()
    author_name: Mapped[str] = mapped_column(String(150), nullable=False)
    author_title: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    rating: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    status: Mapped[str] = mapped_column(
        Enum("active", "inactive", name="testimonial_status", native_enum=True),
        nullable=False,
        server_default="active",
        index=True,
    )


class ContactMessage(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "contact_messages"

    id: Mapped[str] = uuid_pk()
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    subject: Mapped[Optional[str]] = mapped_column(String(250), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(
        Enum(
            "new",
            "read",
            "replied",
            "archived",
            name="contact_message_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="new",
        index=True,
    )
    replied_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    replied_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    reply_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
