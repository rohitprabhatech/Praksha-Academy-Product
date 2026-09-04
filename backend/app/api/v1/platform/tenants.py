"""Platform — tenant management routes (master_admin only)."""

from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.platform import AssignPlanRequest, TenantCreate
from app.services.platform_service import PlatformService

router = APIRouter(prefix="/platform/tenants", tags=["Platform — Tenants"])
service = PlatformService()


@router.get("")
def list_tenants(
    page: int = 1,
    per_page: int = 20,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_role("master_admin")),
):
    data = service.list_tenants(db, page, per_page, status, search)
    return success_response(data=data)


@router.post("")
def create_tenant(
    body: TenantCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("master_admin")),
):
    data = service.create_tenant(db, body, current_user["sub"])
    return success_response(data=data, message="Tenant created successfully")


@router.get("/{tenant_id}")
def get_tenant(
    tenant_id: str,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_role("master_admin")),
):
    data = service.get_tenant(db, tenant_id)
    return success_response(data=data)


@router.patch("/{tenant_id}/approve")
def approve_tenant(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("master_admin")),
):
    data = service.change_tenant_status(db, tenant_id, "trial", current_user["sub"])
    return success_response(data=data, message="Tenant approved — trial started")


@router.patch("/{tenant_id}/activate")
def activate_tenant(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("master_admin")),
):
    data = service.change_tenant_status(db, tenant_id, "active", current_user["sub"])
    return success_response(data=data, message="Tenant activated")


@router.patch("/{tenant_id}/suspend")
def suspend_tenant(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("master_admin")),
):
    data = service.change_tenant_status(db, tenant_id, "suspended", current_user["sub"])
    return success_response(data=data, message="Tenant suspended")


@router.patch("/{tenant_id}/cancel")
def cancel_tenant(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("master_admin")),
):
    data = service.change_tenant_status(db, tenant_id, "cancelled", current_user["sub"])
    return success_response(data=data, message="Tenant cancelled")


@router.delete("/{tenant_id}")
def delete_tenant(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("master_admin")),
):
    service.delete_tenant(db, tenant_id, current_user["sub"])
    return success_response(message="Tenant deleted")


@router.post("/{tenant_id}/subscription")
def assign_plan(
    tenant_id: str,
    body: AssignPlanRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("master_admin")),
):
    data = service.assign_plan(db, tenant_id, body, current_user["sub"])
    return success_response(data=data, message="Plan assigned")
