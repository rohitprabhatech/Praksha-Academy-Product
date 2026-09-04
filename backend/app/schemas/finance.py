"""Finance, coupon, and certificate schemas."""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class FeeStructureCreate(BaseModel):
    name: str
    course_id: Optional[str] = None
    batch_id: Optional[str] = None
    academic_class_id: Optional[str] = None
    fee_type: str = "one_time"
    amount: float
    currency: str = "INR"
    due_day: Optional[int] = None
    late_fee: Optional[float] = None
    is_optional: bool = False
    description: Optional[str] = None


class FeeStructureUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    late_fee: Optional[float] = None
    is_optional: Optional[bool] = None
    description: Optional[str] = None
    status: Optional[str] = None


class GenerateInvoicesRequest(BaseModel):
    student_ids: Optional[list[str]] = None
    due_date: date
    discount_amount: float = 0.0
    notes: Optional[str] = None


class WaiveInvoiceRequest(BaseModel):
    notes: Optional[str] = None


class RecordPaymentRequest(BaseModel):
    student_id: str
    fee_invoice_id: Optional[str] = None
    enrollment_id: Optional[str] = None
    course_id: Optional[str] = None
    amount: float
    payment_method: str = "cash"
    transaction_ref: Optional[str] = None
    notes: Optional[str] = None


class CouponCreate(BaseModel):
    code: str
    description: Optional[str] = None
    discount_type: str = "percentage"
    discount_value: float
    max_uses: Optional[int] = None
    min_order_amount: Optional[float] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None


class CouponUpdate(BaseModel):
    description: Optional[str] = None
    max_uses: Optional[int] = None
    valid_until: Optional[datetime] = None
    status: Optional[str] = None


class ValidateCouponRequest(BaseModel):
    code: str
    order_amount: float = Field(gt=0)


class IssueCertificateRequest(BaseModel):
    student_id: str
    course_id: str
    enrollment_id: str
    file_url: Optional[str] = None
