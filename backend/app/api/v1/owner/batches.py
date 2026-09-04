"""Owner — batches and batch students."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.owner import AddStudentToBatchRequest, BatchCreate, BatchUpdate
from app.services.academic_service import AcademicService

router = APIRouter(prefix="/owner/batches", tags=["Owner — Batches"])
service = AcademicService()


@router.get("")
def list_batches(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.list_batches(db, current_user.get("tenant_id"))
    )


@router.post("")
def create_batch(
    body: BatchCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_batch(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Batch created")


@router.put("/{batch_id}")
def update_batch(
    batch_id: str,
    body: BatchUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_batch(
        db, batch_id, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Batch updated")


@router.delete("/{batch_id}")
def delete_batch(
    batch_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    service.delete_batch(db, batch_id, current_user.get("tenant_id"))
    return success_response(message="Batch deleted")


@router.get("/{batch_id}/students")
def list_batch_students(
    batch_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.list_batch_students(db, batch_id, current_user.get("tenant_id"))
    return success_response(data=data)


@router.post("/{batch_id}/students")
def add_student_to_batch(
    batch_id: str,
    body: AddStudentToBatchRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.add_student_to_batch(
        db,
        batch_id,
        body.student_id,
        current_user.get("tenant_id"),
        current_user["sub"],
    )
    return success_response(data=data, message="Student added to batch")


@router.delete("/{batch_id}/students/{student_id}")
def remove_student_from_batch(
    batch_id: str,
    student_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    service.remove_student_from_batch(
        db, batch_id, student_id, current_user.get("tenant_id")
    )
    return success_response(message="Student removed from batch")
