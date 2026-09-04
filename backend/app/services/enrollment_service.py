"""Enrollment and lesson progress service."""

from __future__ import annotations

from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import utcnow_naive
from app.models.course import Course, CourseChapter, CourseLesson, CourseModule
from app.models.enrollment import Enrollment, LessonProgress
from app.models.profiles import StudentProfile
from app.utils.ids import new_uuid


class EnrollmentService:
    def _require_tenant(self, tenant_id: Optional[str]) -> str:
        if not tenant_id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Tenant context required")
        return tenant_id

    def _get_all_lessons(self, db: Session, course_id: str, tenant_id: str) -> list[CourseLesson]:
        modules = (
            db.query(CourseModule)
            .filter(
                CourseModule.course_id == course_id,
                CourseModule.tenant_id == tenant_id,
                CourseModule.deleted_at.is_(None),
            )
            .all()
        )
        lessons: list[CourseLesson] = []
        for module in modules:
            chapters = (
                db.query(CourseChapter)
                .filter(
                    CourseChapter.module_id == module.id,
                    CourseChapter.deleted_at.is_(None),
                )
                .all()
            )
            for chapter in chapters:
                lessons.extend(
                    db.query(CourseLesson)
                    .filter(
                        CourseLesson.chapter_id == chapter.id,
                        CourseLesson.deleted_at.is_(None),
                    )
                    .all()
                )
        return lessons

    def enroll_student(
        self,
        db: Session,
        tenant_id: Optional[str],
        student_id: str,
        course_id: str,
        batch_id: Optional[str],
        created_by: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        student = (
            db.query(StudentProfile)
            .filter(
                StudentProfile.id == student_id,
                StudentProfile.tenant_id == tid,
                StudentProfile.deleted_at.is_(None),
            )
            .first()
        )
        if not student:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Student not found")

        course = (
            db.query(Course)
            .filter(
                Course.id == course_id,
                Course.tenant_id == tid,
                Course.deleted_at.is_(None),
            )
            .first()
        )
        if not course:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")

        existing = (
            db.query(Enrollment)
            .filter(
                Enrollment.tenant_id == tid,
                Enrollment.student_id == student_id,
                Enrollment.course_id == course_id,
            )
            .first()
        )
        if existing:
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                detail="Student is already enrolled in this course",
            )

        enrollment = Enrollment(
            id=new_uuid(),
            tenant_id=tid,
            student_id=student_id,
            course_id=course_id,
            batch_id=batch_id,
            status="active",
            created_by=created_by,
        )
        db.add(enrollment)
        db.flush()

        lessons = self._get_all_lessons(db, course_id, tid)
        for lesson in lessons:
            db.add(
                LessonProgress(
                    id=new_uuid(),
                    tenant_id=tid,
                    enrollment_id=enrollment.id,
                    lesson_id=lesson.id,
                    status="not_started",
                )
            )
        db.commit()
        return {
            "enrollment_id": enrollment.id,
            "status": enrollment.status,
            "lessons_tracked": len(lessons),
        }

    def list_enrollments(self, db: Session, tenant_id: Optional[str]) -> list[dict]:
        tid = self._require_tenant(tenant_id)
        rows = (
            db.query(Enrollment)
            .filter(Enrollment.tenant_id == tid)
            .order_by(Enrollment.created_at.desc())
            .all()
        )
        return [
            {
                "id": e.id,
                "student_id": e.student_id,
                "course_id": e.course_id,
                "batch_id": e.batch_id,
                "status": e.status,
                "progress_percent": float(e.progress_percent),
            }
            for e in rows
        ]

    def list_student_enrollments(
        self, db: Session, tenant_id: Optional[str], user_id: str
    ) -> list[dict]:
        tid = self._require_tenant(tenant_id)
        student = (
            db.query(StudentProfile)
            .filter(
                StudentProfile.user_id == user_id,
                StudentProfile.tenant_id == tid,
                StudentProfile.deleted_at.is_(None),
            )
            .first()
        )
        if not student:
            return []
        rows = (
            db.query(Enrollment)
            .filter(Enrollment.tenant_id == tid, Enrollment.student_id == student.id)
            .all()
        )
        return [
            {
                "id": e.id,
                "course_id": e.course_id,
                "status": e.status,
                "progress_percent": float(e.progress_percent),
            }
            for e in rows
        ]

    def cancel_enrollment(
        self, db: Session, enrollment_id: str, tenant_id: Optional[str]
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        enrollment = (
            db.query(Enrollment)
            .filter(Enrollment.id == enrollment_id, Enrollment.tenant_id == tid)
            .first()
        )
        if not enrollment:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Enrollment not found")
        enrollment.status = "cancelled"
        enrollment.cancelled_at = utcnow_naive()
        db.commit()
        return {"id": enrollment.id, "status": enrollment.status}

    def mark_lesson_progress(
        self,
        db: Session,
        tenant_id: Optional[str],
        enrollment_id: str,
        lesson_id: str,
        new_status: str,
        progress_percent: float,
        user_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        if new_status not in {"not_started", "in_progress", "completed"}:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid status")

        student = (
            db.query(StudentProfile)
            .filter(
                StudentProfile.user_id == user_id,
                StudentProfile.tenant_id == tid,
                StudentProfile.deleted_at.is_(None),
            )
            .first()
        )
        if not student:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Student profile not found")

        enrollment = (
            db.query(Enrollment)
            .filter(
                Enrollment.id == enrollment_id,
                Enrollment.tenant_id == tid,
                Enrollment.student_id == student.id,
            )
            .first()
        )
        if not enrollment:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Enrollment not found")

        progress = (
            db.query(LessonProgress)
            .filter(
                LessonProgress.enrollment_id == enrollment_id,
                LessonProgress.lesson_id == lesson_id,
                LessonProgress.tenant_id == tid,
            )
            .first()
        )
        if not progress:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                detail="Lesson progress record not found",
            )

        progress.status = new_status
        progress.progress_percent = progress_percent
        now = utcnow_naive()
        if new_status == "in_progress" and not progress.started_at:
            progress.started_at = now
        if new_status == "completed" and not progress.completed_at:
            progress.completed_at = now
            progress.progress_percent = 100
        progress.last_accessed_at = now
        self._update_enrollment_progress(db, enrollment)
        db.commit()
        return {
            "lesson_id": lesson_id,
            "status": progress.status,
            "enrollment_progress_percent": float(enrollment.progress_percent),
            "enrollment_status": enrollment.status,
        }

    def _update_enrollment_progress(self, db: Session, enrollment: Enrollment) -> None:
        rows = (
            db.query(LessonProgress)
            .filter(
                LessonProgress.enrollment_id == enrollment.id,
                LessonProgress.tenant_id == enrollment.tenant_id,
            )
            .all()
        )
        if not rows:
            enrollment.progress_percent = 0
            return
        completed = sum(1 for row in rows if row.status == "completed")
        pct = round((completed / len(rows)) * 100, 2)
        enrollment.progress_percent = pct
        if pct >= 100.0:
            enrollment.status = "completed"
            enrollment.completed_at = utcnow_naive()
