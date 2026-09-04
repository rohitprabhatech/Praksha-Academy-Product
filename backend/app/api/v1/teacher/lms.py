"""Teacher LMS routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.lms import (
    AnnouncementCreate,
    AssignmentCreate,
    AssignmentGradeRequest,
    AttendanceMarkRequest,
    LiveClassCreate,
    QuizCreate,
)
from app.services.assessment_service import AssessmentService
from app.services.quiz_service import QuizService

router = APIRouter(prefix="/teacher", tags=["Teacher — LMS"])
assessment_service = AssessmentService()
quiz_service = QuizService()


@router.post("/assignments")
def create_assignment(
    body: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("teacher", "owner")),
):
    data = assessment_service.create_assignment(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Assignment created")


@router.post("/assignments/{assignment_id}/publish")
def publish_assignment(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("teacher", "owner")),
):
    data = assessment_service.publish_assignment(
        db, assignment_id, current_user.get("tenant_id")
    )
    return success_response(data=data, message="Assignment published")


@router.post("/submissions/{submission_id}/grade")
def grade_submission(
    submission_id: str,
    body: AssignmentGradeRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("teacher", "owner")),
):
    data = assessment_service.grade_submission(
        db, submission_id, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Submission graded")


@router.post("/quizzes")
def create_quiz(
    body: QuizCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("teacher", "owner")),
):
    data = quiz_service.create_quiz(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Quiz created")


@router.post("/quizzes/{quiz_id}/publish")
def publish_quiz(
    quiz_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("teacher", "owner")),
):
    data = quiz_service.publish_quiz(db, quiz_id, current_user.get("tenant_id"))
    return success_response(data=data, message="Quiz published")


@router.post("/attendance")
def mark_attendance(
    body: AttendanceMarkRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("teacher", "owner")),
):
    data = assessment_service.mark_attendance(
        db, current_user.get("tenant_id"), current_user["sub"], body
    )
    return success_response(data=data, message="Attendance marked")


@router.post("/announcements")
def create_announcement(
    body: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("teacher", "owner")),
):
    data = assessment_service.create_announcement(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Announcement posted")


@router.post("/live-classes")
def create_live_class(
    body: LiveClassCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("teacher", "owner")),
):
    data = assessment_service.create_live_class(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Live class created")
