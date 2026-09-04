"""Owner enrollments."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.lms import EnrollRequest
from app.services.enrollment_service import EnrollmentService

router = APIRouter(prefix="/owner/enrollments", tags=["Owner — Enrollments"])
service = EnrollmentService()


@router.get("")
def list_enrollments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.list_enrollments(db, current_user.get("tenant_id"))
    )


@router.post("")
def enroll_student(
    body: EnrollRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.enroll_student(
        db,
        current_user.get("tenant_id"),
        body.student_id,
        body.course_id,
        body.batch_id,
        current_user["sub"],
    )
    return success_response(data=data, message="Student enrolled successfully")


@router.patch("/{enrollment_id}/cancel")
def cancel_enrollment(
    enrollment_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.cancel_enrollment(
        db, enrollment_id, current_user.get("tenant_id")
    )
    return success_response(data=data, message="Enrollment cancelled")
