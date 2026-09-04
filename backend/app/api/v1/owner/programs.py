"""Owner — programs."""

from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.courses import AddCourseToProgramRequest, ProgramCreate, ProgramUpdate
from app.services.course_service import CourseService

router = APIRouter(prefix="/owner/programs", tags=["Owner — Programs"])
service = CourseService()


@router.get("")
def list_programs(
    page: int = 1,
    per_page: int = 20,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.list_programs(
        db, current_user.get("tenant_id"), page, per_page, status
    )
    return success_response(data=data)


@router.post("")
def create_program(
    body: ProgramCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_program(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Program created")


@router.put("/{program_id}")
def update_program(
    program_id: str,
    body: ProgramUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_program(
        db, program_id, current_user.get("tenant_id"), body
    )
    return success_response(data=data, message="Program updated")


@router.post("/{program_id}/courses")
def add_course_to_program(
    program_id: str,
    body: AddCourseToProgramRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.add_course_to_program(
        db, program_id, current_user.get("tenant_id"), body
    )
    return success_response(data=data, message="Course added to program")
