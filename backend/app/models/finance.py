"""Finance models: fee_structures, fee_invoices."""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from sqlalchemy import DECIMAL, Date, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.mixins import SoftDeleteMixin, TenantOwnedMixin, TimestampMixin, uuid_fk, uuid_pk


class FeeStructure(TenantOwnedMixin, TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "fee_structures"

    id: Mapped[str] = uuid_pk()
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    course_id: Mapped[Optional[str]] = uuid_fk(
        "courses.id", nullable=True, ondelete="SET NULL", index=True
    )
    batch_id: Mapped[Optional[str]] = uuid_fk(
        "batches.id", nullable=True, ondelete="SET NULL", index=True
    )
    academic_class_id: Mapped[Optional[str]] = uuid_fk(
        "academic_classes.id", nullable=True, ondelete="SET NULL"
    )
    fee_type: Mapped[str] = mapped_column(String(20), nullable=False, server_default="'one_time'")
    amount: Mapped[float] = mapped_column(DECIMAL(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, server_default="'INR'")
    due_day: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    late_fee: Mapped[Optional[float]] = mapped_column(DECIMAL(12, 2), nullable=True)
    is_optional: Mapped[int] = mapped_column(nullable=False, server_default="0")
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    status: Mapped[str] = mapped_column(String(10), nullable=False, server_default="'active'")
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)


class FeeInvoice(TenantOwnedMixin, TimestampMixin, Base):
    __tablename__ = "fee_invoices"
    __table_args__ = (
        UniqueConstraint("tenant_id", "invoice_number", name="uk_fee_invoices_number"),
    )

    id: Mapped[str] = uuid_pk()
    student_id: Mapped[str] = uuid_fk("student_profiles.id", ondelete="RESTRICT", index=True)
    fee_structure_id: Mapped[str] = uuid_fk("fee_structures.id", ondelete="RESTRICT")
    enrollment_id: Mapped[Optional[str]] = uuid_fk(
        "enrollments.id", nullable=True, ondelete="SET NULL"
    )
    invoice_number: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[float] = mapped_column(DECIMAL(12, 2), nullable=False)
    late_fee: Mapped[float] = mapped_column(DECIMAL(12, 2), nullable=False, server_default="0.00")
    discount_amount: Mapped[float] = mapped_column(DECIMAL(12, 2), nullable=False, server_default="0.00")
    total_amount: Mapped[float] = mapped_column(DECIMAL(12, 2), nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    paid_amount: Mapped[float] = mapped_column(DECIMAL(12, 2), nullable=False, server_default="0.00")
    status: Mapped[str] = mapped_column(String(15), nullable=False, server_default="'unpaid'", index=True)
    payment_id: Mapped[Optional[str]] = uuid_fk(
        "payments.id", nullable=True, ondelete="SET NULL"
    )
    notes: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    created_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
