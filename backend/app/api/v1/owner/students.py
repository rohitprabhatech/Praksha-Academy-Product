"""Owner — students management."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.owner import ResetPasswordRequest, StudentCreate, StudentUpdate
from app.services.owner_service import OwnerService

router = APIRouter(prefix="/owner/students", tags=["Owner — Students"])
service = OwnerService()


@router.get("")
def list_students(
    page: int = 1,
    per_page: int = 20,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.list_students(db, current_user.get("tenant_id"), page, per_page)
    return success_response(data=data)


@router.post("")
def create_student(
    body: StudentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_student(db, current_user.get("tenant_id"), body)
    return success_response(
        data=data, message="Student created. Default password: Praksha@123"
    )


@router.get("/{student_id}")
def get_student(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.get_student(db, student_id, current_user.get("tenant_id"))
    return success_response(data=data)


@router.put("/{student_id}")
def update_student(
    student_id: str,
    body: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_student(db, student_id, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Student updated")


@router.delete("/{student_id}")
def delete_student(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    service.delete_student(db, student_id, current_user.get("tenant_id"))
    return success_response(message="Student removed")


@router.post("/{student_id}/reset-password")
def reset_student_password(
    student_id: str,
    body: ResetPasswordRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    service.reset_student_password(
        db, student_id, current_user.get("tenant_id"), body.new_password
    )
    return success_response(message="Password reset successfully")
