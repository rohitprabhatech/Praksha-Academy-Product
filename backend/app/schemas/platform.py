"""Platform admin request/response schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field


class TenantCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=200)
    contact_email: EmailStr
    contact_phone: Optional[str] = Field(default=None, max_length=30)
    timezone: str = "Asia/Kolkata"
    owner_first_name: str = Field(min_length=1, max_length=100)
    owner_last_name: Optional[str] = Field(default=None, max_length=100)
    owner_email: EmailStr
    owner_password: str = Field(min_length=8)


class AssignPlanRequest(BaseModel):
    plan_id: str
    billing_cycle: str = "monthly"  # monthly | annual | custom
    starts_at: datetime
    ends_at: Optional[datetime] = None
    trial_ends_at: Optional[datetime] = None
    auto_renew: bool = True
    notes: Optional[str] = None


class PlanCreate(BaseModel):
    code: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=150)
    description: Optional[str] = None
    monthly_price: float = Field(ge=0)
    annual_price: Optional[float] = Field(default=None, ge=0)
    currency: str = "INR"
    trial_days: int = Field(default=0, ge=0)
    max_students: Optional[int] = None
    max_teachers: Optional[int] = None
    max_courses: Optional[int] = None
    features_json: Optional[dict[str, Any]] = None
    sort_order: int = 0


class PlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    monthly_price: Optional[float] = Field(default=None, ge=0)
    annual_price: Optional[float] = Field(default=None, ge=0)
    max_students: Optional[int] = None
    max_teachers: Optional[int] = None
    max_courses: Optional[int] = None
    features_json: Optional[dict[str, Any]] = None
    status: Optional[str] = None  # active | inactive | archived
    sort_order: Optional[int] = None


class SettingUpdate(BaseModel):
    value: Any
    description: Optional[str] = None
