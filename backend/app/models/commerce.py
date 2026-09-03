"""Commerce: payments, coupons, wishlist, certificates."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlalchemy import DateTime, Enum, Integer, Numeric, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class Payment(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "payments"

    id: Mapped[str] = uuid_pk()
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="RESTRICT", index=True)
    enrollment_id: Mapped[Optional[str]] = uuid_fk(
        "enrollments.id", nullable=True, ondelete="SET NULL", index=True
    )
    course_id: Mapped[Optional[str]] = uuid_fk(
        "courses.id", nullable=True, ondelete="SET NULL"
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="INR")
    payment_method: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    transaction_ref: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(
        Enum(
            "pending",
            "completed",
            "failed",
            "refunded",
            "cancelled",
            name="payment_status",
            native_enum=True,
        ),
        nullable=False,
        server_default="pending",
        index=True,
    )
    paid_at: Mapped[Optional[datetime]] = mapped_column(nullable=True, index=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class Coupon(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "coupons"
    __table_args__ = (UniqueConstraint("tenant_id", "code", name="uk_coupons_code"),)

    id: Mapped[str] = uuid_pk()
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    discount_type: Mapped[str] = mapped_column(
        Enum("percentage", "fixed", name="coupon_discount_type", native_enum=True),
        nullable=False,
        server_default="percentage",
    )
    discount_value: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    max_uses: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    used_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    min_order_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    valid_from: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    valid_until: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("active", "inactive", "expired", name="coupon_status", native_enum=True),
        nullable=False,
        server_default="active",
        index=True,
    )
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class CouponRedemption(TenantOwnedMixin, Base):
    __tablename__ = "coupon_redemptions"

    id: Mapped[str] = uuid_pk()
    coupon_id: Mapped[str] = uuid_fk("coupons.id", ondelete="RESTRICT", index=True)
    payment_id: Mapped[str] = uuid_fk("payments.id", ondelete="CASCADE", index=True)
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="RESTRICT")
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    redeemed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )


class WishlistItem(TenantOwnedMixin, Base):
    __tablename__ = "wishlist_items"
    __table_args__ = (
        UniqueConstraint("tenant_id", "student_id", "course_id", name="uk_wishlist_items"),
    )

    id: Mapped[str] = uuid_pk()
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="CASCADE")
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="CASCADE")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )


class Certificate(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "certificates"
    __table_args__ = (
        UniqueConstraint("tenant_id", "certificate_number", name="uk_certificates_number"),
        UniqueConstraint("tenant_id", "enrollment_id", name="uk_certificates_enrollment"),
    )

    id: Mapped[str] = uuid_pk()
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="CASCADE", index=True)
    course_id: Mapped[str] = uuid_fk("courses.id", ondelete="RESTRICT")
    enrollment_id: Mapped[str] = uuid_fk("enrollments.id", ondelete="RESTRICT")
    certificate_number: Mapped[str] = mapped_column(String(100), nullable=False)
    issued_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=func.current_timestamp(),
    )
    file_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("issued", "revoked", name="certificate_status", native_enum=True),
        nullable=False,
        server_default="issued",
    )
    issued_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
