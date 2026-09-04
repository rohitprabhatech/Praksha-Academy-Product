"""Owner — courses."""

from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.courses import AssignTeacherRequest, CourseCreate, CourseUpdate
from app.services.course_service import CourseService

router = APIRouter(prefix="/owner/courses", tags=["Owner — Courses"])
service = CourseService()


@router.get("")
def list_courses(
    page: int = 1,
    per_page: int = 20,
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.list_courses(
        db, current_user.get("tenant_id"), page, per_page, status, category
    )
    return success_response(data=data)


@router.post("")
def create_course(
    body: CourseCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_course(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Course created")


@router.get("/{course_id}")
def get_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    data = service.get_course(db, course_id, current_user.get("tenant_id"))
    return success_response(data=data)


@router.put("/{course_id}")
def update_course(
    course_id: str,
    body: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_course(db, course_id, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Course updated")


@router.post("/{course_id}/publish")
def publish_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.publish_course(db, course_id, current_user.get("tenant_id"))
    return success_response(data=data, message="Course published")


@router.post("/{course_id}/archive")
def archive_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.archive_course(db, course_id, current_user.get("tenant_id"))
    return success_response(data=data, message="Course archived")


@router.delete("/{course_id}")
def delete_course(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    service.delete_course(db, course_id, current_user.get("tenant_id"))
    return success_response(message="Course deleted")


@router.post("/{course_id}/teachers")
def assign_teacher(
    course_id: str,
    body: AssignTeacherRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.assign_teacher(
        db, course_id, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Teacher assigned")
