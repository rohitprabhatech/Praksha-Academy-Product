"""Platform — subscription plan routes (master_admin only)."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.platform import PlanCreate, PlanUpdate
from app.services.platform_service import PlatformService

router = APIRouter(prefix="/platform/plans", tags=["Platform — Plans"])
service = PlatformService()


@router.get("")
def list_plans(
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_role("master_admin")),
):
    return success_response(data=service.list_plans(db))


@router.post("")
def create_plan(
    body: PlanCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("master_admin")),
):
    data = service.create_plan(db, body, current_user["sub"])
    return success_response(data=data, message="Plan created")


@router.put("/{plan_id}")
def update_plan(
    plan_id: str,
    body: PlanUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("master_admin")),
):
    data = service.update_plan(db, plan_id, body, current_user["sub"])
    return success_response(data=data, message="Plan updated")


@router.delete("/{plan_id}")
def delete_plan(
    plan_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("master_admin")),
):
    service.delete_plan(db, plan_id, current_user["sub"])
    return success_response(message="Plan deleted")
