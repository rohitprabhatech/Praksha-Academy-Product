"""Owner — teachers management."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.owner import ResetPasswordRequest, TeacherCreate, TeacherUpdate
from app.services.owner_service import OwnerService

router = APIRouter(prefix="/owner/teachers", tags=["Owner — Teachers"])
service = OwnerService()


@router.get("")
def list_teachers(
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.list_teachers(db, current_user.get("tenant_id"), page, per_page)
    return success_response(data=data)


@router.post("")
def create_teacher(
    body: TeacherCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_teacher(db, current_user.get("tenant_id"), body)
    return success_response(
        data=data, message="Teacher created. Default password: Praksha@123"
    )


@router.get("/{teacher_id}")
def get_teacher(
    teacher_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.get_teacher(db, teacher_id, current_user.get("tenant_id"))
    return success_response(data=data)


@router.put("/{teacher_id}")
def update_teacher(
    teacher_id: str,
    body: TeacherUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_teacher(db, teacher_id, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Teacher updated")


@router.delete("/{teacher_id}")
def delete_teacher(
    teacher_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    service.delete_teacher(db, teacher_id, current_user.get("tenant_id"))
    return success_response(message="Teacher removed")


@router.post("/{teacher_id}/reset-password")
def reset_teacher_password(
    teacher_id: str,
    body: ResetPasswordRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    service.reset_teacher_password(
        db, teacher_id, current_user.get("tenant_id"), body.new_password
    )
    return success_response(message="Password reset successfully")
