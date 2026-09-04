"""Platform — settings routes (master_admin only)."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.platform import SettingUpdate
from app.services.platform_service import PlatformService

router = APIRouter(prefix="/platform/settings", tags=["Platform — Settings"])
service = PlatformService()


@router.get("")
def list_settings(
    db: Session = Depends(get_db),
    _current_user: dict = Depends(require_role("master_admin")),
):
    return success_response(data=service.list_settings(db))


@router.put("/{key}")
def upsert_setting(
    key: str,
    body: SettingUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("master_admin")),
):
    data = service.upsert_setting(db, key, body, current_user["sub"])
    return success_response(data=data, message="Setting saved")
