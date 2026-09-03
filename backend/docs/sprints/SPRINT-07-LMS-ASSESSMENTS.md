# SPRINT 07 — Enrollment, LMS & Assessment APIs
**Project:** Praksha Academy SaaS
**Developer:** _(assign name here)_
**Branch:** `feature/sprint-07-lms-assessments`
**Base Branch:** `dev`
**Estimated Time:** 10–14 working days
**Depends on:** Sprint 03 + Sprint 05 + Sprint 06 merged to `dev`

---

## What Is This Sprint About?

This is the **core learning experience**. Covers:
1. **Enrollments** — owner enrolls students in courses
2. **Lesson Progress** — student marks lessons as complete
3. **Live Classes** — teacher schedules and manages sessions
4. **Announcements** — teacher posts messages to a batch
5. **Question Bank** — shared pool of questions
6. **Assignments** — teacher creates, student submits, teacher grades
7. **Quizzes** — timed MCQ tests with auto-grading
8. **Exams** — scheduled assessments with manual grading
9. **Marks** — unified ledger of all student scores
10. **Attendance** — teacher marks daily attendance

---

## Step 1 — Create Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feature/sprint-07-lms-assessments
```

---

## Step 2 — Key Business Rules to Understand

### Enrollment
- One student can only enroll in a course ONCE (unique constraint in DB)
- When enrolled, automatically create `lesson_progress` rows for ALL lessons in that course
- Owner manually enrolls students; students don't self-enroll (for now)

### Lesson Progress
- Progress % of an enrollment = (completed lessons / total lessons) × 100
- Update `enrollments.progress_percent` whenever a lesson is completed
- Mark enrollment as `completed` when progress = 100%

### Quiz Auto-Grading
- When student submits a quiz attempt:
  - For MCQ questions: auto-check `selected_option_id` against `is_correct` column
  - For short_text: leave `is_correct = null` (teacher grades manually)
  - Calculate total `score` = sum of `points_awarded`
  - Set `status = graded` (if no short_text) or `submitted` (if has short_text)
- Enforce `max_attempts`: if student already has that many attempts, reject start

### Attendance
- Unique constraint: `(tenant_id, student_id, attendance_date, course_id, batch_id, live_class_id)`
- Teacher cannot mark the same student twice for the same session

---

## Step 3 — Schemas (`app/schemas/lms.py`)

```python
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


# ─── ENROLLMENTS ──────────────────────────────────────────────────────────────

class EnrollRequest(BaseModel):
    student_id: str       # student_profiles.id
    course_id: str
    batch_id: Optional[str] = None


# ─── LESSON PROGRESS ──────────────────────────────────────────────────────────

class LessonProgressUpdate(BaseModel):
    progress_percent: float = 0.0
    status: str = "in_progress"   # not_started | in_progress | completed


# ─── LIVE CLASSES ─────────────────────────────────────────────────────────────

class LiveClassCreate(BaseModel):
    course_id: str
    batch_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    session_date: date
    start_time: str    # "HH:MM" format
    end_time: str
    meeting_link: Optional[str] = None

class LiveClassUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    session_date: Optional[date] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    meeting_link: Optional[str] = None

class AddRecordingRequest(BaseModel):
    recording_url: str


# ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────

class AnnouncementCreate(BaseModel):
    course_id: str
    batch_id: Optional[str] = None
    title: str
    message: str
    attachment_url: Optional[str] = None


# ─── QUESTION BANK ────────────────────────────────────────────────────────────

class QuestionOption(BaseModel):
    option_text: str
    is_correct: bool = False

class QuestionBankCreate(BaseModel):
    subject_id: Optional[str] = None
    question_text: str
    question_type: str = "mcq"   # mcq | short_text | true_false
    difficulty: str = "medium"   # easy | medium | hard
    tags_json: Optional[dict] = None
    explanation: Optional[str] = None
    options: List[QuestionOption] = []   # for MCQ and true_false


# ─── ASSIGNMENTS ──────────────────────────────────────────────────────────────

class AssignmentCreate(BaseModel):
    course_id: str
    batch_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    attachment_url: Optional[str] = None
    due_at: Optional[datetime] = None
    max_score: float = 100.0

class AssignmentSubmitRequest(BaseModel):
    submission_text: Optional[str] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None

class AssignmentGradeRequest(BaseModel):
    score: float
    feedback: Optional[str] = None


# ─── QUIZZES ──────────────────────────────────────────────────────────────────

class QuizQuestionCreate(BaseModel):
    question_text: str
    question_type: str = "mcq"
    points: float = 1.0
    sort_order: int = 0
    options: List[QuestionOption] = []
    bank_question_id: Optional[str] = None   # import from question bank

class QuizCreate(BaseModel):
    course_id: str
    batch_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    max_attempts: int = 1
    passing_score: Optional[float] = None
    available_from: Optional[datetime] = None
    available_until: Optional[datetime] = None
    questions: List[QuizQuestionCreate] = []

class SubmitAnswerRequest(BaseModel):
    question_id: str
    selected_option_id: Optional[str] = None
    answer_text: Optional[str] = None


# ─── EXAMS ────────────────────────────────────────────────────────────────────

class ExamCreate(BaseModel):
    course_id: str
    batch_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    exam_date: date
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    max_score: float = 100.0
    is_online: bool = False

class ExamGradeRequest(BaseModel):
    score: float


# ─── MARKS ────────────────────────────────────────────────────────────────────

class ManualMarkCreate(BaseModel):
    student_id: str       # student_profiles.id
    course_id: str
    enrollment_id: str
    title: str
    score: float
    max_score: float = 100.0
    remarks: Optional[str] = None


# ─── ATTENDANCE ───────────────────────────────────────────────────────────────

class AttendanceMarkRequest(BaseModel):
    course_id: str
    batch_id: Optional[str] = None
    live_class_id: Optional[str] = None
    attendance_date: date
    records: List[dict]  # [{student_id: str, status: "present"|"absent"|"late", remarks: str}]
```

---

## Step 4 — Enrollment Service

### `app/services/enrollment_service.py`

```python
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.enrollment import Enrollment, LessonProgress
from app.models.course import Course, CourseModule, CourseChapter, CourseLesson
from app.models.profiles import StudentProfile
from app.utils.ids import new_uuid
from datetime import datetime


class EnrollmentService:

    def enroll_student(self, db: Session, tenant_id: str,
                       student_id: str, course_id: str,
                       batch_id: str | None, created_by: str) -> dict:
        # Check student exists in this tenant
        student = db.query(StudentProfile).filter(
            StudentProfile.id == student_id,
            StudentProfile.tenant_id == tenant_id,
            StudentProfile.deleted_at == None
        ).first()
        if not student:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Student not found")

        # Check course exists and is published
        course = db.query(Course).filter(
            Course.id == course_id,
            Course.tenant_id == tenant_id,
            Course.deleted_at == None
        ).first()
        if not course:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course not found")

        # Check not already enrolled
        existing = db.query(Enrollment).filter(
            Enrollment.tenant_id == tenant_id,
            Enrollment.student_id == student_id,
            Enrollment.course_id == course_id
        ).first()
        if existing:
            raise HTTPException(status.HTTP_409_CONFLICT,
                                "Student is already enrolled in this course")

        # Create enrollment
        enrollment = Enrollment(
            id=new_uuid(), tenant_id=tenant_id,
            student_id=student_id, course_id=course_id,
            batch_id=batch_id, status="active", created_by=created_by
        )
        db.add(enrollment)
        db.flush()

        # Auto-create lesson_progress rows for all lessons in this course
        lessons = self._get_all_lessons(db, course_id, tenant_id)
        for lesson in lessons:
            db.add(LessonProgress(
                id=new_uuid(), tenant_id=tenant_id,
                enrollment_id=enrollment.id, lesson_id=lesson.id,
                status="not_started"
            ))

        db.commit()
        return {"enrollment_id": enrollment.id, "status": "active",
                "lessons_tracked": len(lessons)}

    def _get_all_lessons(self, db: Session, course_id: str, tenant_id: str) -> list:
        """Get all lessons for a course by traversing module → chapter → lesson."""
        modules = db.query(CourseModule).filter(
            CourseModule.course_id == course_id,
            CourseModule.tenant_id == tenant_id,
            CourseModule.deleted_at == None
        ).all()
        lessons = []
        for m in modules:
            chapters = db.query(CourseChapter).filter(
                CourseChapter.module_id == m.id,
                CourseChapter.deleted_at == None
            ).all()
            for ch in chapters:
                chapter_lessons = db.query(CourseLesson).filter(
                    CourseLesson.chapter_id == ch.id,
                    CourseLesson.deleted_at == None
                ).all()
                lessons.extend(chapter_lessons)
        return lessons

    def mark_lesson_progress(self, db: Session, tenant_id: str,
                             enrollment_id: str, lesson_id: str,
                             new_status: str, progress_percent: float) -> dict:
        lp = db.query(LessonProgress).filter(
            LessonProgress.enrollment_id == enrollment_id,
            LessonProgress.lesson_id == lesson_id,
            LessonProgress.tenant_id == tenant_id
        ).first()
        if not lp:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Lesson progress record not found")

        lp.status = new_status
        lp.progress_percent = progress_percent
        if new_status == "in_progress" and not lp.started_at:
            lp.started_at = datetime.utcnow()
        if new_status == "completed" and not lp.completed_at:
            lp.completed_at = datetime.utcnow()
        lp.last_accessed_at = datetime.utcnow()

        # Update enrollment progress %
        self._update_enrollment_progress(db, enrollment_id, tenant_id)
        db.commit()
        return {"lesson_id": lesson_id, "status": new_status}

    def _update_enrollment_progress(self, db: Session, enrollment_id: str,
                                    tenant_id: str) -> None:
        all_lp = db.query(LessonProgress).filter(
            LessonProgress.enrollment_id == enrollment_id,
            LessonProgress.tenant_id == tenant_id
        ).all()
        if not all_lp:
            return
        completed = sum(1 for lp in all_lp if lp.status == "completed")
        pct = round((completed / len(all_lp)) * 100, 2)

        enrollment = db.query(Enrollment).filter(
            Enrollment.id == enrollment_id
        ).first()
        if enrollment:
            enrollment.progress_percent = pct
            if pct >= 100.0:
                enrollment.status = "completed"
                enrollment.completed_at = datetime.utcnow()
```

---

## Step 5 — Quiz Service (Auto-Grading)

### `app/services/quiz_service.py`

```python
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.quiz import (
    Quiz, QuizQuestion, QuizQuestionOption, QuizAttempt, QuizAnswer
)
from app.utils.ids import new_uuid
from datetime import datetime


class QuizService:

    def start_attempt(self, db: Session, tenant_id: str, quiz_id: str,
                      student_id: str, enrollment_id: str) -> dict:
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id,
                                     Quiz.tenant_id == tenant_id).first()
        if not quiz:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Quiz not found")
        if quiz.status != "published":
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Quiz is not available")

        # Check max attempts
        existing_attempts = db.query(QuizAttempt).filter(
            QuizAttempt.quiz_id == quiz_id,
            QuizAttempt.student_id == student_id,
            QuizAttempt.tenant_id == tenant_id
        ).count()
        if existing_attempts >= quiz.max_attempts:
            raise HTTPException(status.HTTP_400_BAD_REQUEST,
                                f"Maximum {quiz.max_attempts} attempt(s) reached")

        attempt = QuizAttempt(
            id=new_uuid(), tenant_id=tenant_id, quiz_id=quiz_id,
            student_id=student_id, enrollment_id=enrollment_id,
            attempt_number=existing_attempts + 1,
            status="in_progress"
        )
        db.add(attempt)
        db.commit()

        # Return quiz questions (without correct answers)
        questions = db.query(QuizQuestion).filter(
            QuizQuestion.quiz_id == quiz_id
        ).order_by(QuizQuestion.sort_order).all()

        return {
            "attempt_id": attempt.id,
            "attempt_number": attempt.attempt_number,
            "questions": [self._question_for_student(db, q) for q in questions]
        }

    def _question_for_student(self, db: Session, q: QuizQuestion) -> dict:
        """Return question with options but WITHOUT marking which is correct."""
        options = db.query(QuizQuestionOption).filter(
            QuizQuestionOption.question_id == q.id
        ).all()
        return {
            "id": q.id,
            "question_text": q.question_text,
            "question_type": q.question_type,
            "points": float(q.points),
            "options": [
                {"id": o.id, "option_text": o.option_text}  # NO is_correct here!
                for o in options
            ]
        }

    def submit_attempt(self, db: Session, tenant_id: str, attempt_id: str,
                       answers: list[dict]) -> dict:
        """
        answers = [{"question_id": "...", "selected_option_id": "...", "answer_text": "..."}]
        Auto-grade MCQ. Short text left for manual grading.
        """
        attempt = db.query(QuizAttempt).filter(
            QuizAttempt.id == attempt_id,
            QuizAttempt.tenant_id == tenant_id,
            QuizAttempt.status == "in_progress"
        ).first()
        if not attempt:
            raise HTTPException(status.HTTP_404_NOT_FOUND,
                                "Attempt not found or already submitted")

        total_score = 0.0
        has_short_text = False

        for ans in answers:
            question = db.query(QuizQuestion).filter(
                QuizQuestion.id == ans["question_id"]
            ).first()
            if not question:
                continue

            is_correct = None
            points_awarded = 0.0

            if question.question_type == "mcq" and ans.get("selected_option_id"):
                option = db.query(QuizQuestionOption).filter(
                    QuizQuestionOption.id == ans["selected_option_id"]
                ).first()
                if option and option.is_correct:
                    is_correct = True
                    points_awarded = float(question.points)
                else:
                    is_correct = False
            elif question.question_type == "short_text":
                has_short_text = True   # needs manual grading

            total_score += points_awarded

            db.add(QuizAnswer(
                id=new_uuid(), tenant_id=tenant_id,
                attempt_id=attempt_id,
                question_id=ans["question_id"],
                selected_option_id=ans.get("selected_option_id"),
                answer_text=ans.get("answer_text"),
                is_correct=is_correct,
                points_awarded=points_awarded,
            ))

        # Calculate max_score
        all_questions = db.query(QuizQuestion).filter(
            QuizQuestion.quiz_id == attempt.quiz_id
        ).all()
        max_score = sum(float(q.points) for q in all_questions)

        attempt.score = total_score
        attempt.max_score = max_score
        attempt.submitted_at = datetime.utcnow()
        attempt.status = "submitted" if has_short_text else "graded"
        if not has_short_text:
            attempt.graded_at = datetime.utcnow()

        db.commit()

        return {
            "attempt_id": attempt_id,
            "score": total_score,
            "max_score": max_score,
            "status": attempt.status,
            "percentage": round((total_score / max_score) * 100, 2) if max_score else 0,
        }
```

---

## Step 6 — Attendance Service

### `app/services/attendance_service.py`

```python
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.attendance import AttendanceRecord
from app.utils.ids import new_uuid
from datetime import date, datetime


class AttendanceService:

    def mark_attendance(self, db: Session, tenant_id: str, teacher_id: str,
                        course_id: str, attendance_date: date,
                        records: list[dict],
                        batch_id: str | None = None,
                        live_class_id: str | None = None) -> dict:
        """
        records = [{"student_id": "...", "status": "present", "remarks": ""}]
        """
        marked = 0
        errors = []

        for rec in records:
            student_id = rec["student_id"]
            att_status = rec.get("status", "absent")
            remarks = rec.get("remarks", "")

            # Check for duplicate
            existing = db.query(AttendanceRecord).filter(
                AttendanceRecord.tenant_id == tenant_id,
                AttendanceRecord.student_id == student_id,
                AttendanceRecord.attendance_date == attendance_date,
                AttendanceRecord.course_id == course_id,
                AttendanceRecord.batch_id == batch_id,
                AttendanceRecord.live_class_id == live_class_id,
            ).first()

            if existing:
                # Update existing record
                existing.status = att_status
                existing.remarks = remarks
                existing.marked_by = teacher_id
                existing.marked_at = datetime.utcnow()
                marked += 1
            else:
                db.add(AttendanceRecord(
                    id=new_uuid(), tenant_id=tenant_id,
                    student_id=student_id, course_id=course_id,
                    batch_id=batch_id, live_class_id=live_class_id,
                    attendance_date=attendance_date, status=att_status,
                    remarks=remarks, marked_by=teacher_id,
                ))
                marked += 1

        db.commit()
        return {"marked": marked, "date": str(attendance_date)}

    def get_student_attendance_summary(self, db: Session, tenant_id: str,
                                       student_id: str,
                                       course_id: str | None = None) -> dict:
        q = db.query(AttendanceRecord).filter(
            AttendanceRecord.tenant_id == tenant_id,
            AttendanceRecord.student_id == student_id
        )
        if course_id:
            q = q.filter(AttendanceRecord.course_id == course_id)
        records = q.all()

        total = len(records)
        present = sum(1 for r in records if r.status == "present")
        absent = sum(1 for r in records if r.status == "absent")
        late = sum(1 for r in records if r.status == "late")

        return {
            "total_sessions": total,
            "present": present,
            "absent": absent,
            "late": late,
            "attendance_percent": round((present / total) * 100, 2) if total else 0,
        }
```

---

## Step 7 — Route Handlers

### Enrollments `app/api/v1/owner/enrollments.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.lms import EnrollRequest
from app.services.enrollment_service import EnrollmentService

router = APIRouter(prefix="/owner/enrollments", tags=["Owner — Enrollments"])
service = EnrollmentService()


@router.post("")
def enroll_student(body: EnrollRequest, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("owner"))):
    data = service.enroll_student(
        db, current_user["tenant_id"],
        body.student_id, body.course_id, body.batch_id, current_user["sub"]
    )
    return success_response(data=data, message="Student enrolled successfully")
```

### Student Lesson Progress `app/api/v1/student/progress.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.lms import LessonProgressUpdate
from app.services.enrollment_service import EnrollmentService

router = APIRouter(prefix="/student", tags=["Student — Learning"])
service = EnrollmentService()


@router.put("/lessons/{lesson_id}/progress")
def update_lesson_progress(lesson_id: str, body: LessonProgressUpdate,
                           enrollment_id: str,   # query param
                           db: Session = Depends(get_db),
                           current_user: dict = Depends(require_role("student"))):
    data = service.mark_lesson_progress(
        db, current_user["tenant_id"],
        enrollment_id, lesson_id,
        body.status, body.progress_percent
    )
    return success_response(data=data)
```

### Teacher — Assignments `app/api/v1/teacher/assignments.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.lms import AssignmentCreate, AssignmentGradeRequest
from app.models.assessment import Assignment, AssignmentSubmission
from app.utils.ids import new_uuid
from datetime import datetime

router = APIRouter(prefix="/teacher", tags=["Teacher — Assignments"])


@router.post("/assignments")
def create_assignment(body: AssignmentCreate, db: Session = Depends(get_db),
                      current_user: dict = Depends(require_role("teacher", "owner"))):
    # Get teacher profile ID for this user
    from app.models.profiles import TeacherProfile
    teacher = db.query(TeacherProfile).filter(
        TeacherProfile.user_id == current_user["sub"],
        TeacherProfile.tenant_id == current_user["tenant_id"]
    ).first()

    assignment = Assignment(
        id=new_uuid(),
        tenant_id=current_user["tenant_id"],
        course_id=body.course_id,
        batch_id=body.batch_id,
        teacher_id=teacher.id if teacher else None,
        title=body.title,
        description=body.description,
        instructions=body.instructions,
        attachment_url=body.attachment_url,
        due_at=body.due_at,
        max_score=body.max_score,
        status="draft",
        created_by=current_user["sub"],
    )
    db.add(assignment)
    db.commit()
    return success_response(data={"id": assignment.id, "title": assignment.title},
                           message="Assignment created")


@router.post("/assignments/{assignment_id}/publish")
def publish_assignment(assignment_id: str, db: Session = Depends(get_db),
                       current_user: dict = Depends(require_role("teacher", "owner"))):
    a = db.query(Assignment).filter(
        Assignment.id == assignment_id,
        Assignment.tenant_id == current_user["tenant_id"]
    ).first()
    if not a:
        from fastapi import HTTPException, status
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Assignment not found")
    a.status = "published"
    db.commit()
    return success_response(message="Assignment published")


@router.post("/submissions/{submission_id}/grade")
def grade_submission(submission_id: str, body: AssignmentGradeRequest,
                     db: Session = Depends(get_db),
                     current_user: dict = Depends(require_role("teacher", "owner"))):
    sub = db.query(AssignmentSubmission).filter(
        AssignmentSubmission.id == submission_id,
        AssignmentSubmission.tenant_id == current_user["tenant_id"]
    ).first()
    if not sub:
        from fastapi import HTTPException, status
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Submission not found")
    sub.score = body.score
    sub.feedback = body.feedback
    sub.status = "reviewed"
    sub.reviewed_at = datetime.utcnow()
    sub.reviewed_by = current_user["sub"]
    db.commit()
    return success_response(message="Submission graded")
```

### Student — Quiz Attempt `app/api/v1/student/quiz.py`

```python
from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.lms import SubmitAnswerRequest
from app.services.quiz_service import QuizService

router = APIRouter(prefix="/student", tags=["Student — Quiz"])
service = QuizService()


@router.post("/quizzes/{quiz_id}/attempt")
def start_quiz(quiz_id: str, enrollment_id: str,
               db: Session = Depends(get_db),
               current_user: dict = Depends(require_role("student"))):
    from app.models.profiles import StudentProfile
    student = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user["sub"],
        StudentProfile.tenant_id == current_user["tenant_id"]
    ).first()
    data = service.start_attempt(
        db, current_user["tenant_id"], quiz_id, student.id, enrollment_id
    )
    return success_response(data=data)


@router.post("/attempts/{attempt_id}/submit")
def submit_quiz(attempt_id: str, answers: List[SubmitAnswerRequest],
                db: Session = Depends(get_db),
                current_user: dict = Depends(require_role("student"))):
    data = service.submit_attempt(
        db, current_user["tenant_id"], attempt_id,
        [a.model_dump() for a in answers]
    )
    return success_response(data=data, message="Quiz submitted and graded")
```

### Teacher — Attendance `app/api/v1/teacher/attendance.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.lms import AttendanceMarkRequest
from app.services.attendance_service import AttendanceService

router = APIRouter(prefix="/teacher", tags=["Teacher — Attendance"])
service = AttendanceService()


@router.post("/attendance")
def mark_attendance(body: AttendanceMarkRequest, db: Session = Depends(get_db),
                    current_user: dict = Depends(require_role("teacher", "owner"))):
    data = service.mark_attendance(
        db, current_user["tenant_id"], current_user["sub"],
        body.course_id, body.attendance_date, body.records,
        body.batch_id, body.live_class_id
    )
    return success_response(data=data, message="Attendance marked")
```

---

## Step 8 — Register All Routers

In `app/api/v1/router.py`, add all new routers:

```python
from app.api.v1.owner.enrollments import router as enrollments_router
from app.api.v1.student.progress import router as student_progress_router
from app.api.v1.student.quiz import router as student_quiz_router
from app.api.v1.teacher.assignments import router as teacher_assignments_router
from app.api.v1.teacher.attendance import router as teacher_attendance_router

api_router.include_router(enrollments_router)
api_router.include_router(student_progress_router)
api_router.include_router(student_quiz_router)
api_router.include_router(teacher_assignments_router)
api_router.include_router(teacher_attendance_router)
```

---

## Step 9 — Tests

Create `tests/test_lms/`:

### `test_enrollment.py`
1. Enroll student in course — creates lesson_progress rows ✅
2. Enroll same student twice → 409 ✅
3. Course with 3 lessons → 3 lesson_progress rows created ✅

### `test_progress.py`
4. Mark lesson as in_progress ✅
5. Mark lesson as completed — updates enrollment % ✅
6. Complete all lessons — enrollment status = "completed" ✅

### `test_assignments.py`
7. Create assignment (draft) ✅
8. Publish assignment ✅
9. Student submits assignment ✅
10. Late submission (after due_at) → status = "late" ✅
11. Teacher grades submission ✅
12. Score + feedback saved ✅

### `test_quiz.py`
13. Create quiz with MCQ questions ✅
14. Student starts attempt ✅
15. Max attempts enforced → 400 if exceeded ✅
16. Student submits — MCQ auto-graded ✅
17. Score calculated correctly ✅
18. Short text question → status = "submitted" (not graded) ✅

### `test_attendance.py`
19. Mark attendance for 5 students ✅
20. Double-marking same student same day → updates (no duplicate) ✅
21. Student attendance summary % calculated correctly ✅

Minimum: **21 tests**.

---

## API Summary Table

| Method | Endpoint | Who | Description |
|--------|----------|-----|-------------|
| POST | `/owner/enrollments` | Owner | Enroll student in course |
| GET | `/owner/enrollments` | Owner | List all enrollments |
| PATCH | `/owner/enrollments/{id}/cancel` | Owner | Cancel enrollment |
| GET | `/student/enrollments` | Student | My enrollments |
| PUT | `/student/lessons/{id}/progress` | Student | Update lesson progress |
| POST | `/teacher/live-classes` | Teacher | Create live class |
| PATCH | `/teacher/live-classes/{id}/complete` | Teacher | Mark complete + add recording |
| POST | `/teacher/announcements` | Teacher | Post announcement |
| GET | `/student/announcements` | Student | My announcements |
| GET/POST/DELETE | `/owner/question-bank` | Owner | Question bank CRUD |
| POST | `/teacher/assignments` | Teacher | Create assignment |
| POST | `/teacher/assignments/{id}/publish` | Teacher | Publish |
| GET | `/teacher/assignments/{id}/submissions` | Teacher | All submissions |
| POST | `/teacher/submissions/{id}/grade` | Teacher | Grade |
| GET | `/student/assignments` | Student | My assignments |
| POST | `/student/assignments/{id}/submit` | Student | Submit |
| POST | `/teacher/quizzes` | Teacher | Create quiz |
| POST | `/student/quizzes/{id}/attempt` | Student | Start attempt |
| POST | `/student/attempts/{id}/submit` | Student | Submit + auto-grade |
| POST | `/owner/exams` | Owner | Schedule exam |
| POST | `/teacher/exams/{id}/grade/{attemptId}` | Teacher | Grade exam |
| POST | `/teacher/attendance` | Teacher | Mark attendance |
| GET | `/student/attendance` | Student | My attendance summary |
| GET/POST/DELETE | `/teacher/marks` | Teacher | Marks management |

---

## Definition of Done ✅

- [ ] Enrolling a student auto-creates lesson_progress for all lessons
- [ ] Progress % updates when lessons are completed
- [ ] Enrollment status becomes "completed" when progress = 100%
- [ ] Quiz auto-grades MCQ on submit
- [ ] Max attempts enforced for quizzes
- [ ] Attendance prevents duplicate records
- [ ] Late assignment submissions flagged correctly
- [ ] `pytest tests/test_lms/ -v` — all 21 tests PASS
- [ ] PR to `dev` with title: `feat(sprint-07): LMS & Assessment APIs`
