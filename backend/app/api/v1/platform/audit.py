"""Platform — audit log routes (master_admin only)."""

from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.services.platform_service import PlatformService

router = APIRouter(prefix="/platform/audit-logs", tags=["Platform — Audit"])
service = PlatformService()


@router.get("")
def list_audit_logs(
    page: int = 1,
    per_page: int = 20,
    tenant_id: Optional[str] = None,
    actor_id: Optional[str] = None,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_role("master_admin")),
):
    data = service.list_audit_logs(db, page, per_page, tenant_id, actor_id)
    return success_response(data=data)
