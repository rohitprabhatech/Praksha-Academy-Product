"""Owner finance, coupons, and certificates."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.finance import (
    CouponCreate,
    CouponUpdate,
    FeeStructureCreate,
    FeeStructureUpdate,
    GenerateInvoicesRequest,
    IssueCertificateRequest,
    RecordPaymentRequest,
    WaiveInvoiceRequest,
)
from app.services.finance_service import FinanceService

router = APIRouter(prefix="/owner", tags=["Owner — Finance"])
service = FinanceService()


@router.get("/fee-structures")
def list_fee_structures(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.list_fee_structures(db, current_user.get("tenant_id"))
    )


@router.post("/fee-structures")
def create_fee_structure(
    body: FeeStructureCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_fee_structure(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Fee structure created")


@router.patch("/fee-structures/{fs_id}")
def update_fee_structure(
    fs_id: str,
    body: FeeStructureUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_fee_structure(
        db, current_user.get("tenant_id"), fs_id, body
    )
    return success_response(data=data, message="Fee structure updated")


@router.post("/fee-structures/{fs_id}/generate-invoices")
def generate_invoices(
    fs_id: str,
    body: GenerateInvoicesRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.generate_invoices(
        db, current_user.get("tenant_id"), fs_id, body, current_user["sub"]
    )
    return success_response(data=data, message="Invoices generated")


@router.get("/fee-invoices")
def list_fee_invoices(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.list_invoices(
            db, current_user.get("tenant_id"), invoice_status=status
        )
    )


@router.patch("/fee-invoices/{invoice_id}/waive")
def waive_invoice(
    invoice_id: str,
    body: WaiveInvoiceRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.waive_invoice(
        db, current_user.get("tenant_id"), invoice_id, body.notes
    )
    return success_response(data=data, message="Invoice waived")


@router.post("/payments")
def record_payment(
    body: RecordPaymentRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.record_payment(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Payment recorded")


@router.get("/finance/summary")
def finance_summary(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.get_finance_summary(db, current_user.get("tenant_id"))
    )


@router.get("/coupons")
def list_coupons(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(data=service.list_coupons(db, current_user.get("tenant_id")))


@router.post("/coupons")
def create_coupon(
    body: CouponCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_coupon(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Coupon created")


@router.patch("/coupons/{coupon_id}")
def update_coupon(
    coupon_id: str,
    body: CouponUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_coupon(
        db, current_user.get("tenant_id"), coupon_id, body
    )
    return success_response(data=data, message="Coupon updated")


@router.post("/certificates/issue")
def issue_certificate(
    body: IssueCertificateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.issue_certificate(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Certificate issued")


@router.patch("/certificates/{certificate_id}/revoke")
def revoke_certificate(
    certificate_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.revoke_certificate(
        db, current_user.get("tenant_id"), certificate_id
    )
    return success_response(data=data, message="Certificate revoked")
