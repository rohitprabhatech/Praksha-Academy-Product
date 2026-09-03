"""Platform-level tables: tenants, plans, subscriptions, settings."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any, Optional

from sqlalchemy import Boolean, Enum, Integer, JSON, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TimestampMixin, uuid_fk, uuid_pk


class Tenant(TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "tenants"
    __table_args__ = (
        UniqueConstraint("tenant_code", name="uk_tenants_tenant_code"),
        UniqueConstraint("slug", name="uk_tenants_slug"),
    )

    id: Mapped[str] = uuid_pk()
    tenant_code: Mapped[str] = mapped_column(String(32), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(
        Enum(
            "pending",
            "trial",
            "active",
            "suspended",
            "cancelled",
            "archived",
            name="tenant_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="pending",
        index=True,
    )
    contact_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    timezone: Mapped[str] = mapped_column(String(64), nullable=False, server_default="Asia/Kolkata")
    trial_ends_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    activated_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    suspended_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)


class SubscriptionPlan(TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "subscription_plans"
    __table_args__ = (UniqueConstraint("code", name="uk_subscription_plans_code"),)

    id: Mapped[str] = uuid_pk()
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    monthly_price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), nullable=False, server_default="0.00"
    )
    annual_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="INR")
    trial_days: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    max_students: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    max_teachers: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    max_courses: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    features_json: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("active", "inactive", "archived", name="subscription_plan_status", native_enum=True),
        nullable=False,
        server_default="active",
        index=True,
    )
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")


class TenantSubscription(TimestampMixin, Base):
    __tablename__ = "tenant_subscriptions"

    id: Mapped[str] = uuid_pk()
    tenant_id: Mapped[str] = uuid_fk("tenants.id", ondelete="RESTRICT", index=True)
    plan_id: Mapped[str] = uuid_fk("subscription_plans.id", ondelete="RESTRICT", index=True)
    status: Mapped[str] = mapped_column(
        Enum(
            "trial",
            "active",
            "past_due",
            "cancelled",
            "expired",
            name="tenant_subscription_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="trial",
        index=True,
    )
    billing_cycle: Mapped[str] = mapped_column(
        Enum("monthly", "annual", "custom", name="billing_cycle", native_enum=True),
        nullable=False,
        server_default="monthly",
    )
    starts_at: Mapped[datetime] = mapped_column(nullable=False)
    ends_at: Mapped[Optional[datetime]] = mapped_column(nullable=True, index=True)
    trial_ends_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    auto_renew: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="1")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class PlatformSetting(TimestampMixin, Base):
    __tablename__ = "platform_settings"
    __table_args__ = (UniqueConstraint("setting_key", name="uk_platform_settings_key"),)

    id: Mapped[str] = uuid_pk()
    setting_key: Mapped[str] = mapped_column(String(100), nullable=False)
    setting_value: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
