"""CMS and notification schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field


class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    author_name: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags_json: Optional[Any] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags_json: Optional[Any] = None
    status: Optional[str] = None


class GalleryItemCreate(BaseModel):
    title: Optional[str] = None
    media_type: str = "image"
    media_url: str
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    sort_order: int = 0


class GalleryItemUpdate(BaseModel):
    title: Optional[str] = None
    media_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None


class FaqCreate(BaseModel):
    question: str
    answer: str
    category: Optional[str] = None
    sort_order: int = 0


class FaqUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None


class TestimonialCreate(BaseModel):
    author_name: str
    author_title: Optional[str] = None
    content: str
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    image_url: Optional[str] = None
    sort_order: int = 0


class TestimonialUpdate(BaseModel):
    author_name: Optional[str] = None
    author_title: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    image_url: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None


class ContactSubmitRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str


class ReplyRequest(BaseModel):
    reply_message: str


class NotificationCreate(BaseModel):
    title: str
    message: str
    notification_type: str = "info"
    audience_type: str = "all"
    target_user_id: Optional[str] = None
    scheduled_at: Optional[datetime] = None
