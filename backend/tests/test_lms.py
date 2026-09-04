"""LMS & assessment API tests (Sprint 07)."""

from __future__ import annotations

from datetime import date, datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, check_database_connection
from app.core.security import create_access_token, hash_password, utcnow_naive
from app.main import create_app
from app.models.assessment import Assignment, AssignmentSubmission
from app.models.attendance import AttendanceRecord
from app.models.course import Course, CourseChapter, CourseLesson, CourseModule
from app.models.enrollment import Enrollment, LessonProgress
from app.models.platform import Tenant
from app.models.profiles import StudentProfile, TeacherProfile
from app.models.quiz import Quiz, QuizAnswer, QuizAttempt, QuizQuestion, QuizQuestionOption
from app.models.rbac import Role
from app.models.user import User, UserRole
from app.utils.ids import new_uuid

requires_db = pytest.mark.skipif(
    not check_database_connection(),
    reason="MySQL is not available",
)


@pytest.fixture()
def db() -> Session:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client() -> TestClient:
    with TestClient(create_app()) as c:
        yield c


def _role(db: Session, code: str) -> Role:
    role = db.query(Role).filter(Role.scope == "tenant", Role.code == code).first()
    if role:
        return role
    role = Role(id=new_uuid(), scope="tenant", code=code, name=code.title(), is_system=True)
    db.add(role)
    db.flush()
    return role


def _tenant_bundle(db: Session):
    slug = f"lms-{new_uuid()[:8]}"
    tenant = Tenant(
        id=new_uuid(),
        tenant_code=slug.upper().replace("-", "")[:10],
        name=f"Academy {slug}",
        slug=slug,
        status="active",
        contact_email=f"c+{slug}@example.com",
    )
    db.add(tenant)
    db.flush()

    owner = User(
        id=new_uuid(),
        tenant_id=tenant.id,
        email=f"owner.{new_uuid()[:8]}@example.com",
        password_hash=hash_password("OwnerPass1!"),
        first_name="Owner",
        status="active",
        email_verified_at=utcnow_naive(),
    )
    teacher_user = User(
        id=new_uuid(),
        tenant_id=tenant.id,
        email=f"teacher.{new_uuid()[:8]}@example.com",
        password_hash=hash_password("TeacherPass1!"),
        first_name="Teacher",
        status="active",
        email_verified_at=utcnow_naive(),
    )
    student_user = User(
        id=new_uuid(),
        tenant_id=tenant.id,
        email=f"student.{new_uuid()[:8]}@example.com",
        password_hash=hash_password("StudentPass1!"),
        first_name="Student",
        status="active",
        email_verified_at=utcnow_naive(),
    )
    db.add_all([owner, teacher_user, student_user])
    db.flush()

    for user, code in (
        (owner, "owner"),
        (teacher_user, "teacher"),
        (student_user, "student"),
    ):
        db.add(
            UserRole(
                id=new_uuid(),
                user_id=user.id,
                role_id=_role(db, code).id,
                tenant_id=tenant.id,
            )
        )

    teacher = TeacherProfile(
        id=new_uuid(), tenant_id=tenant.id, user_id=teacher_user.id
    )
    student = StudentProfile(
        id=new_uuid(), tenant_id=tenant.id, user_id=student_user.id
    )
    db.add_all([teacher, student])
    db.commit()

    return {
        "tenant": tenant,
        "owner": owner,
        "teacher_user": teacher_user,
        "student_user": student_user,
        "teacher": teacher,
        "student": student,
        "owner_token": create_access_token(owner.id, tenant.id, ["owner"]),
        "teacher_token": create_access_token(teacher_user.id, tenant.id, ["teacher"]),
        "student_token": create_access_token(student_user.id, tenant.id, ["student"]),
    }


def _seed_course_with_lesson(db: Session, tenant_id: str, created_by: str):
    course = Course(
        id=new_uuid(),
        tenant_id=tenant_id,
        name="LMS Course",
        slug=f"lms-{new_uuid()[:6]}",
        status="published",
        created_by=created_by,
    )
    db.add(course)
    db.flush()
    module = CourseModule(
        id=new_uuid(), tenant_id=tenant_id, course_id=course.id, title="M1", sort_order=0
    )
    db.add(module)
    db.flush()
    chapter = CourseChapter(
        id=new_uuid(), tenant_id=tenant_id, module_id=module.id, title="C1", sort_order=0
    )
    db.add(chapter)
    db.flush()
    lesson = CourseLesson(
        id=new_uuid(),
        tenant_id=tenant_id,
        chapter_id=chapter.id,
        title="L1",
        lesson_type="text",
        sort_order=0,
    )
    db.add(lesson)
    db.commit()
    return course, lesson


def _cleanup(db: Session, tenant_id: str):
    db.query(QuizAnswer).filter(QuizAnswer.tenant_id == tenant_id).delete()
    db.query(QuizAttempt).filter(QuizAttempt.tenant_id == tenant_id).delete()
    db.query(QuizQuestionOption).filter(QuizQuestionOption.tenant_id == tenant_id).delete()
    db.query(QuizQuestion).filter(QuizQuestion.tenant_id == tenant_id).delete()
    db.query(Quiz).filter(Quiz.tenant_id == tenant_id).delete()
    db.query(AssignmentSubmission).filter(AssignmentSubmission.tenant_id == tenant_id).delete()
    db.query(Assignment).filter(Assignment.tenant_id == tenant_id).delete()
    db.query(AttendanceRecord).filter(AttendanceRecord.tenant_id == tenant_id).delete()
    db.query(LessonProgress).filter(LessonProgress.tenant_id == tenant_id).delete()
    db.query(Enrollment).filter(Enrollment.tenant_id == tenant_id).delete()
    db.query(CourseLesson).filter(CourseLesson.tenant_id == tenant_id).delete()
    db.query(CourseChapter).filter(CourseChapter.tenant_id == tenant_id).delete()
    db.query(CourseModule).filter(CourseModule.tenant_id == tenant_id).delete()
    db.query(Course).filter(Course.tenant_id == tenant_id).delete()
    db.query(TeacherProfile).filter(TeacherProfile.tenant_id == tenant_id).delete()
    db.query(StudentProfile).filter(StudentProfile.tenant_id == tenant_id).delete()
    user_ids = [r[0] for r in db.query(User.id).filter(User.tenant_id == tenant_id).all()]
    for uid in user_ids:
        db.query(UserRole).filter(UserRole.user_id == uid).delete()
    db.query(User).filter(User.tenant_id == tenant_id).delete()
    db.query(Tenant).filter(Tenant.id == tenant_id).delete()
    db.commit()


@requires_db
def test_enroll_and_progress(client: TestClient, db: Session):
    ctx = _tenant_bundle(db)
    course, lesson = _seed_course_with_lesson(db, ctx["tenant"].id, ctx["owner"].id)
    try:
        enroll = client.post(
            "/api/v1/owner/enrollments",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={"student_id": ctx["student"].id, "course_id": course.id},
        )
        assert enroll.status_code == 200
        assert enroll.json()["data"]["lessons_tracked"] == 1
        enrollment_id = enroll.json()["data"]["enrollment_id"]

        dup = client.post(
            "/api/v1/owner/enrollments",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={"student_id": ctx["student"].id, "course_id": course.id},
        )
        assert dup.status_code == 409

        progress = client.put(
            f"/api/v1/student/lessons/{lesson.id}/progress",
            headers={"Authorization": f"Bearer {ctx['student_token']}"},
            params={"enrollment_id": enrollment_id},
            json={"status": "completed", "progress_percent": 100},
        )
        assert progress.status_code == 200
        assert progress.json()["data"]["enrollment_progress_percent"] == 100.0
        assert progress.json()["data"]["enrollment_status"] == "completed"
    finally:
        _cleanup(db, ctx["tenant"].id)


@requires_db
def test_quiz_auto_grade_and_max_attempts(client: TestClient, db: Session):
    ctx = _tenant_bundle(db)
    course, _lesson = _seed_course_with_lesson(db, ctx["tenant"].id, ctx["owner"].id)
    try:
        enrollment_id = client.post(
            "/api/v1/owner/enrollments",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={"student_id": ctx["student"].id, "course_id": course.id},
        ).json()["data"]["enrollment_id"]

        quiz = client.post(
            "/api/v1/teacher/quizzes",
            headers={"Authorization": f"Bearer {ctx['teacher_token']}"},
            json={
                "course_id": course.id,
                "title": "MCQ Quiz",
                "max_attempts": 1,
                "questions": [
                    {
                        "question_text": "2+2?",
                        "question_type": "mcq",
                        "points": 5,
                        "options": [
                            {"option_text": "3", "is_correct": False},
                            {"option_text": "4", "is_correct": True},
                        ],
                    }
                ],
            },
        )
        assert quiz.status_code == 200
        quiz_id = quiz.json()["data"]["id"]
        client.post(
            f"/api/v1/teacher/quizzes/{quiz_id}/publish",
            headers={"Authorization": f"Bearer {ctx['teacher_token']}"},
        )

        attempt = client.post(
            f"/api/v1/student/quizzes/{quiz_id}/attempt",
            headers={"Authorization": f"Bearer {ctx['student_token']}"},
            params={"enrollment_id": enrollment_id},
        )
        assert attempt.status_code == 200
        attempt_id = attempt.json()["data"]["attempt_id"]
        option_id = attempt.json()["data"]["questions"][0]["options"][1]["id"]
        question_id = attempt.json()["data"]["questions"][0]["id"]

        submitted = client.post(
            f"/api/v1/student/attempts/{attempt_id}/submit",
            headers={"Authorization": f"Bearer {ctx['student_token']}"},
            json=[
                {
                    "question_id": question_id,
                    "selected_option_id": option_id,
                }
            ],
        )
        assert submitted.status_code == 200
        assert submitted.json()["data"]["score"] == 5
        assert submitted.json()["data"]["status"] == "graded"

        again = client.post(
            f"/api/v1/student/quizzes/{quiz_id}/attempt",
            headers={"Authorization": f"Bearer {ctx['student_token']}"},
            params={"enrollment_id": enrollment_id},
        )
        assert again.status_code == 400
    finally:
        _cleanup(db, ctx["tenant"].id)


@requires_db
def test_assignment_late_and_grade(client: TestClient, db: Session):
    ctx = _tenant_bundle(db)
    course, _lesson = _seed_course_with_lesson(db, ctx["tenant"].id, ctx["owner"].id)
    try:
        enrollment_id = client.post(
            "/api/v1/owner/enrollments",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={"student_id": ctx["student"].id, "course_id": course.id},
        ).json()["data"]["enrollment_id"]

        created = client.post(
            "/api/v1/teacher/assignments",
            headers={"Authorization": f"Bearer {ctx['teacher_token']}"},
            json={
                "course_id": course.id,
                "title": "Homework",
                "due_at": (datetime.utcnow() - timedelta(days=1)).isoformat(),
                "max_score": 10,
            },
        )
        assert created.status_code == 200
        assignment_id = created.json()["data"]["id"]
        client.post(
            f"/api/v1/teacher/assignments/{assignment_id}/publish",
            headers={"Authorization": f"Bearer {ctx['teacher_token']}"},
        )

        submitted = client.post(
            f"/api/v1/student/assignments/{assignment_id}/submit",
            headers={"Authorization": f"Bearer {ctx['student_token']}"},
            json={
                "enrollment_id": enrollment_id,
                "submission_text": "My answers",
            },
        )
        assert submitted.status_code == 200
        assert submitted.json()["data"]["status"] == "late"
        submission_id = submitted.json()["data"]["id"]

        graded = client.post(
            f"/api/v1/teacher/submissions/{submission_id}/grade",
            headers={"Authorization": f"Bearer {ctx['teacher_token']}"},
            json={"score": 8, "feedback": "Good"},
        )
        assert graded.status_code == 200
        assert graded.json()["data"]["score"] == 8
    finally:
        _cleanup(db, ctx["tenant"].id)


@requires_db
def test_attendance_mark_and_summary(client: TestClient, db: Session):
    ctx = _tenant_bundle(db)
    course, _lesson = _seed_course_with_lesson(db, ctx["tenant"].id, ctx["owner"].id)
    try:
        marked = client.post(
            "/api/v1/teacher/attendance",
            headers={"Authorization": f"Bearer {ctx['teacher_token']}"},
            json={
                "course_id": course.id,
                "attendance_date": str(date.today()),
                "records": [
                    {"student_id": ctx["student"].id, "status": "present"},
                ],
            },
        )
        assert marked.status_code == 200
        assert marked.json()["data"]["marked"] == 1

        # Update same day should not duplicate
        again = client.post(
            "/api/v1/teacher/attendance",
            headers={"Authorization": f"Bearer {ctx['teacher_token']}"},
            json={
                "course_id": course.id,
                "attendance_date": str(date.today()),
                "records": [
                    {"student_id": ctx["student"].id, "status": "late"},
                ],
            },
        )
        assert again.status_code == 200

        summary = client.get(
            "/api/v1/student/attendance",
            headers={"Authorization": f"Bearer {ctx['student_token']}"},
            params={"course_id": course.id},
        )
        assert summary.status_code == 200
        assert summary.json()["data"]["total_sessions"] == 1
        assert summary.json()["data"]["late"] == 1
    finally:
        _cleanup(db, ctx["tenant"].id)
