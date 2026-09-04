"""Owner — subjects."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.owner import SubjectCreate, SubjectUpdate
from app.services.academic_service import AcademicService

router = APIRouter(prefix="/owner/subjects", tags=["Owner — Subjects"])
service = AcademicService()


@router.get("")
def list_subjects(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.list_subjects(db, current_user.get("tenant_id"))
    )


@router.post("")
def create_subject(
    body: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_subject(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Subject created")


@router.put("/{subject_id}")
def update_subject(
    subject_id: str,
    body: SubjectUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_subject(
        db, subject_id, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Subject updated")


@router.delete("/{subject_id}")
def delete_subject(
    subject_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    service.delete_subject(db, subject_id, current_user.get("tenant_id"))
    return success_response(message="Subject deleted")
