"""Owner — academy profile and website CMS."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.owner import TenantProfileUpdate
from app.schemas.website import WebsiteSettingsUpdate
from app.services.owner_service import OwnerService

router = APIRouter(prefix="/owner/profile", tags=["Owner — Profile"])
service = OwnerService()


@router.get("")
def get_profile(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(data=service.get_profile(db, current_user.get("tenant_id")))


@router.put("")
def update_profile(
    body: TenantProfileUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_profile(db, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Profile updated")


@router.get("/website")
def get_website(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.get_website_settings(db, current_user.get("tenant_id"))
    )


@router.put("/website")
def update_website(
    body: WebsiteSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_website_settings(db, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Website settings saved")


@router.post("/website/publish")
def publish_website(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.publish_website(
        db, current_user.get("tenant_id"), current_user["sub"]
    )
    return success_response(data=data, message="Website published")
