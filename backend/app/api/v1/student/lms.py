"""Student learning routes."""

from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.lms import (
    AssignmentSubmitRequest,
    LessonProgressUpdate,
    SubmitAnswerRequest,
)
from app.services.assessment_service import AssessmentService
from app.services.enrollment_service import EnrollmentService
from app.services.quiz_service import QuizService

router = APIRouter(prefix="/student", tags=["Student — LMS"])
enrollment_service = EnrollmentService()
quiz_service = QuizService()
assessment_service = AssessmentService()


@router.get("/enrollments")
def my_enrollments(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    data = enrollment_service.list_student_enrollments(
        db, current_user.get("tenant_id"), current_user["sub"]
    )
    return success_response(data=data)


@router.put("/lessons/{lesson_id}/progress")
def update_lesson_progress(
    lesson_id: str,
    body: LessonProgressUpdate,
    enrollment_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    data = enrollment_service.mark_lesson_progress(
        db,
        current_user.get("tenant_id"),
        enrollment_id,
        lesson_id,
        body.status,
        body.progress_percent,
        current_user["sub"],
    )
    return success_response(data=data)


@router.post("/quizzes/{quiz_id}/attempt")
def start_quiz(
    quiz_id: str,
    enrollment_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    data = quiz_service.start_attempt(
        db,
        current_user.get("tenant_id"),
        quiz_id,
        enrollment_id,
        current_user["sub"],
    )
    return success_response(data=data)


@router.post("/attempts/{attempt_id}/submit")
def submit_quiz(
    attempt_id: str,
    answers: List[SubmitAnswerRequest],
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    data = quiz_service.submit_attempt(
        db,
        current_user.get("tenant_id"),
        attempt_id,
        answers,
        current_user["sub"],
    )
    return success_response(data=data, message="Quiz submitted")


@router.post("/assignments/{assignment_id}/submit")
def submit_assignment(
    assignment_id: str,
    body: AssignmentSubmitRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    data = assessment_service.submit_assignment(
        db,
        assignment_id,
        current_user.get("tenant_id"),
        body,
        current_user["sub"],
    )
    return success_response(data=data, message="Assignment submitted")


@router.get("/attendance")
def my_attendance(
    course_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("student")),
):
    data = assessment_service.student_attendance_summary(
        db, current_user.get("tenant_id"), current_user["sub"], course_id
    )
    return success_response(data=data)
