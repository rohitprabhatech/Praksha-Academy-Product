"""Assignments, attendance, announcements, live classes."""

from __future__ import annotations

from datetime import datetime, time
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import utcnow_naive
from app.models.announcements import Announcement
from app.models.assessment import Assignment, AssignmentSubmission
from app.models.attendance import AttendanceRecord
from app.models.learning import LiveClass
from app.models.profiles import StudentProfile, TeacherProfile
from app.schemas.lms import (
    AnnouncementCreate,
    AssignmentCreate,
    AssignmentGradeRequest,
    AssignmentSubmitRequest,
    AttendanceMarkRequest,
    LiveClassCreate,
)
from app.utils.ids import new_uuid


def _parse_hhmm(value: str) -> time:
    hour, minute = value.split(":")
    return time(int(hour), int(minute))


class AssessmentService:
    def _require_tenant(self, tenant_id: Optional[str]) -> str:
        if not tenant_id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Tenant context required")
        return tenant_id

    def _teacher(self, db: Session, user_id: str, tenant_id: str) -> Optional[TeacherProfile]:
        return (
            db.query(TeacherProfile)
            .filter(
                TeacherProfile.user_id == user_id,
                TeacherProfile.tenant_id == tenant_id,
                TeacherProfile.deleted_at.is_(None),
            )
            .first()
        )

    def _student(self, db: Session, user_id: str, tenant_id: str) -> StudentProfile:
        student = (
            db.query(StudentProfile)
            .filter(
                StudentProfile.user_id == user_id,
                StudentProfile.tenant_id == tenant_id,
                StudentProfile.deleted_at.is_(None),
            )
            .first()
        )
        if not student:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Student profile not found")
        return student

    # ─── ASSIGNMENTS ──────────────────────────────────────────────────────────

    def create_assignment(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: AssignmentCreate,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        teacher = self._teacher(db, actor_id, tid)
        due_at = data.due_at
        if due_at and due_at.tzinfo:
            due_at = due_at.replace(tzinfo=None)
        assignment = Assignment(
            id=new_uuid(),
            tenant_id=tid,
            course_id=data.course_id,
            batch_id=data.batch_id,
            teacher_id=teacher.id if teacher else None,
            title=data.title,
            description=data.description,
            instructions=data.instructions,
            attachment_url=data.attachment_url,
            due_at=due_at,
            max_score=data.max_score,
            status="draft",
            created_by=actor_id,
        )
        db.add(assignment)
        db.commit()
        return {"id": assignment.id, "title": assignment.title, "status": assignment.status}

    def publish_assignment(
        self, db: Session, assignment_id: str, tenant_id: Optional[str]
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        assignment = (
            db.query(Assignment)
            .filter(
                Assignment.id == assignment_id,
                Assignment.tenant_id == tid,
                Assignment.deleted_at.is_(None),
            )
            .first()
        )
        if not assignment:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Assignment not found")
        assignment.status = "published"
        db.commit()
        return {"id": assignment.id, "status": assignment.status}

    def submit_assignment(
        self,
        db: Session,
        assignment_id: str,
        tenant_id: Optional[str],
        data: AssignmentSubmitRequest,
        user_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        student = self._student(db, user_id, tid)
        assignment = (
            db.query(Assignment)
            .filter(
                Assignment.id == assignment_id,
                Assignment.tenant_id == tid,
                Assignment.deleted_at.is_(None),
            )
            .first()
        )
        if not assignment:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Assignment not found")
        if assignment.status != "published":
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST, detail="Assignment is not open for submission"
            )

        now = utcnow_naive()
        submit_status = "submitted"
        if assignment.due_at and now > assignment.due_at:
            submit_status = "late"

        existing = (
            db.query(AssignmentSubmission)
            .filter(
                AssignmentSubmission.tenant_id == tid,
                AssignmentSubmission.assignment_id == assignment_id,
                AssignmentSubmission.student_id == student.id,
            )
            .first()
        )
        if existing:
            existing.submission_text = data.submission_text
            existing.file_url = data.file_url
            existing.file_name = data.file_name
            existing.status = submit_status
            existing.submitted_at = now
            existing.enrollment_id = data.enrollment_id
            db.commit()
            return {"id": existing.id, "status": existing.status}

        submission = AssignmentSubmission(
            id=new_uuid(),
            tenant_id=tid,
            assignment_id=assignment_id,
            student_id=student.id,
            enrollment_id=data.enrollment_id,
            submission_text=data.submission_text,
            file_url=data.file_url,
            file_name=data.file_name,
            status=submit_status,
            submitted_at=now,
        )
        db.add(submission)
        db.commit()
        return {"id": submission.id, "status": submission.status}

    def grade_submission(
        self,
        db: Session,
        submission_id: str,
        tenant_id: Optional[str],
        data: AssignmentGradeRequest,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        submission = (
            db.query(AssignmentSubmission)
            .filter(
                AssignmentSubmission.id == submission_id,
                AssignmentSubmission.tenant_id == tid,
            )
            .first()
        )
        if not submission:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Submission not found")
        submission.score = data.score
        submission.feedback = data.feedback
        submission.status = "reviewed"
        submission.reviewed_at = utcnow_naive()
        submission.reviewed_by = actor_id
        db.commit()
        return {"id": submission.id, "status": submission.status, "score": float(submission.score)}

    # ─── ATTENDANCE ───────────────────────────────────────────────────────────

    def mark_attendance(
        self,
        db: Session,
        tenant_id: Optional[str],
        actor_id: str,
        data: AttendanceMarkRequest,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        marked = 0
        for rec in data.records:
            if rec.status not in {"present", "absent", "late"}:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid attendance status")
            existing = (
                db.query(AttendanceRecord)
                .filter(
                    AttendanceRecord.tenant_id == tid,
                    AttendanceRecord.student_id == rec.student_id,
                    AttendanceRecord.attendance_date == data.attendance_date,
                    AttendanceRecord.course_id == data.course_id,
                    AttendanceRecord.batch_id == data.batch_id,
                    AttendanceRecord.live_class_id == data.live_class_id,
                )
                .first()
            )
            if existing:
                existing.status = rec.status
                existing.remarks = rec.remarks
                existing.marked_by = actor_id
                existing.marked_at = utcnow_naive()
            else:
                db.add(
                    AttendanceRecord(
                        id=new_uuid(),
                        tenant_id=tid,
                        student_id=rec.student_id,
                        course_id=data.course_id,
                        batch_id=data.batch_id,
                        live_class_id=data.live_class_id,
                        attendance_date=data.attendance_date,
                        status=rec.status,
                        remarks=rec.remarks,
                        marked_by=actor_id,
                    )
                )
            marked += 1
        db.commit()
        return {"marked": marked, "date": str(data.attendance_date)}

    def student_attendance_summary(
        self,
        db: Session,
        tenant_id: Optional[str],
        user_id: str,
        course_id: Optional[str] = None,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        student = self._student(db, user_id, tid)
        query = db.query(AttendanceRecord).filter(
            AttendanceRecord.tenant_id == tid,
            AttendanceRecord.student_id == student.id,
        )
        if course_id:
            query = query.filter(AttendanceRecord.course_id == course_id)
        records = query.all()
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

    # ─── ANNOUNCEMENTS / LIVE CLASSES ─────────────────────────────────────────

    def create_announcement(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: AnnouncementCreate,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        teacher = self._teacher(db, actor_id, tid)
        if not teacher:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Teacher profile required")
        row = Announcement(
            id=new_uuid(),
            tenant_id=tid,
            course_id=data.course_id,
            batch_id=data.batch_id,
            posted_by=teacher.id,
            title=data.title,
            message=data.message,
            attachment_url=data.attachment_url,
            status="active",
        )
        db.add(row)
        db.commit()
        return {"id": row.id, "title": row.title}

    def create_live_class(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: LiveClassCreate,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        teacher = self._teacher(db, actor_id, tid)
        if not teacher:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Teacher profile required")
        row = LiveClass(
            id=new_uuid(),
            tenant_id=tid,
            course_id=data.course_id,
            batch_id=data.batch_id,
            teacher_id=teacher.id,
            title=data.title,
            description=data.description,
            session_date=data.session_date,
            start_time=_parse_hhmm(data.start_time),
            end_time=_parse_hhmm(data.end_time),
            meeting_link=data.meeting_link,
            status="scheduled",
            created_by=actor_id,
        )
        db.add(row)
        db.commit()
        return {"id": row.id, "title": row.title, "status": row.status}
