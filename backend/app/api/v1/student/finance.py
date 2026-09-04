"""Student finance and certificates."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.services.finance_service import FinanceService

router = APIRouter(prefix="/student", tags=["Student — Finance"])
service = FinanceService()


@router.get("/fee-invoices")
def my_invoices(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    return success_response(
        data=service.list_student_invoices(
            db, current_user.get("tenant_id"), current_user["sub"]
        )
    )


@router.get("/certificates")
def my_certificates(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    return success_response(
        data=service.list_student_certificates(
            db, current_user.get("tenant_id"), current_user["sub"]
        )
    )
