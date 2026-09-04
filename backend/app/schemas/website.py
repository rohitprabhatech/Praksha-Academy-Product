"""Website CMS settings schemas."""

from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


class WebsiteSettingsUpdate(BaseModel):
    primary_color: Optional[str] = Field(default=None, max_length=20)
    secondary_color: Optional[str] = Field(default=None, max_length=20)
    font_family: Optional[str] = Field(default=None, max_length=100)
    logo_url: Optional[str] = Field(default=None, max_length=500)
    favicon_url: Optional[str] = Field(default=None, max_length=500)
    show_blog: Optional[bool] = None
    show_gallery: Optional[bool] = None
    show_faq: Optional[bool] = None
    show_testimonials: Optional[bool] = None
    show_programs: Optional[bool] = None
    home_page_json: Optional[Any] = None
    about_page_json: Optional[Any] = None
    contact_page_json: Optional[Any] = None
    courses_header_json: Optional[Any] = None
    programs_page_json: Optional[Any] = None
    seo_title: Optional[str] = Field(default=None, max_length=250)
    seo_description: Optional[str] = Field(default=None, max_length=500)
    seo_keywords: Optional[str] = Field(default=None, max_length=500)
