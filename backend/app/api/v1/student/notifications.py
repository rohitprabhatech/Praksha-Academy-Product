"""Student notification inbox."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/student/notifications", tags=["Student — Notifications"])
service = NotificationService()


@router.get("")
def my_notifications(
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    data = service.get_my_notifications(
        db, current_user.get("tenant_id"), current_user["sub"], unread_only
    )
    return success_response(data=data)


@router.post("/{recipient_id}/read")
def mark_read(
    recipient_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    service.mark_read(db, recipient_id, current_user["sub"])
    return success_response(message="Marked as read")
