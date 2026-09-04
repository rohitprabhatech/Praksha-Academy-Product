"""Quiz create/attempt/auto-grade service."""

from __future__ import annotations

from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import utcnow_naive
from app.models.profiles import StudentProfile, TeacherProfile
from app.models.quiz import (
    Quiz,
    QuizAnswer,
    QuizAttempt,
    QuizQuestion,
    QuizQuestionOption,
)
from app.schemas.lms import QuizCreate, SubmitAnswerRequest
from app.utils.ids import new_uuid


class QuizService:
    def _require_tenant(self, tenant_id: Optional[str]) -> str:
        if not tenant_id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Tenant context required")
        return tenant_id

    def create_quiz(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: QuizCreate,
        actor_user_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        teacher = (
            db.query(TeacherProfile)
            .filter(
                TeacherProfile.user_id == actor_user_id,
                TeacherProfile.tenant_id == tid,
                TeacherProfile.deleted_at.is_(None),
            )
            .first()
        )
        quiz = Quiz(
            id=new_uuid(),
            tenant_id=tid,
            course_id=data.course_id,
            batch_id=data.batch_id,
            teacher_id=teacher.id if teacher else None,
            title=data.title,
            description=data.description,
            duration_minutes=data.duration_minutes,
            max_attempts=data.max_attempts,
            passing_score=data.passing_score,
            available_from=data.available_from.replace(tzinfo=None)
            if data.available_from and data.available_from.tzinfo
            else data.available_from,
            available_until=data.available_until.replace(tzinfo=None)
            if data.available_until and data.available_until.tzinfo
            else data.available_until,
            status="draft",
            created_by=actor_user_id,
        )
        db.add(quiz)
        db.flush()

        for q in data.questions:
            if q.question_type not in {"mcq", "short_text"}:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST, detail="Invalid question_type"
                )
            question = QuizQuestion(
                id=new_uuid(),
                tenant_id=tid,
                quiz_id=quiz.id,
                question_text=q.question_text,
                question_type=q.question_type,
                points=q.points,
                sort_order=q.sort_order,
            )
            db.add(question)
            db.flush()
            for idx, opt in enumerate(q.options):
                db.add(
                    QuizQuestionOption(
                        id=new_uuid(),
                        tenant_id=tid,
                        question_id=question.id,
                        option_text=opt.option_text,
                        is_correct=opt.is_correct,
                        sort_order=idx,
                    )
                )
        db.commit()
        return {"id": quiz.id, "title": quiz.title, "status": quiz.status}

    def publish_quiz(
        self, db: Session, quiz_id: str, tenant_id: Optional[str]
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        quiz = (
            db.query(Quiz)
            .filter(Quiz.id == quiz_id, Quiz.tenant_id == tid, Quiz.deleted_at.is_(None))
            .first()
        )
        if not quiz:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Quiz not found")
        quiz.status = "published"
        db.commit()
        return {"id": quiz.id, "status": quiz.status}

    def start_attempt(
        self,
        db: Session,
        tenant_id: Optional[str],
        quiz_id: str,
        enrollment_id: str,
        user_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        quiz = (
            db.query(Quiz)
            .filter(Quiz.id == quiz_id, Quiz.tenant_id == tid, Quiz.deleted_at.is_(None))
            .first()
        )
        if not quiz:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Quiz not found")
        if quiz.status != "published":
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Quiz is not available")

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

        existing_count = (
            db.query(QuizAttempt)
            .filter(
                QuizAttempt.quiz_id == quiz_id,
                QuizAttempt.student_id == student.id,
                QuizAttempt.tenant_id == tid,
            )
            .count()
        )
        if existing_count >= quiz.max_attempts:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                detail=f"Maximum {quiz.max_attempts} attempt(s) reached",
            )

        attempt = QuizAttempt(
            id=new_uuid(),
            tenant_id=tid,
            quiz_id=quiz_id,
            student_id=student.id,
            enrollment_id=enrollment_id,
            attempt_number=existing_count + 1,
            status="in_progress",
        )
        db.add(attempt)
        db.commit()

        questions = (
            db.query(QuizQuestion)
            .filter(
                QuizQuestion.quiz_id == quiz_id,
                QuizQuestion.deleted_at.is_(None),
            )
            .order_by(QuizQuestion.sort_order)
            .all()
        )
        return {
            "attempt_id": attempt.id,
            "attempt_number": attempt.attempt_number,
            "questions": [self._question_for_student(db, q) for q in questions],
        }

    def _question_for_student(self, db: Session, question: QuizQuestion) -> dict:
        options = (
            db.query(QuizQuestionOption)
            .filter(QuizQuestionOption.question_id == question.id)
            .order_by(QuizQuestionOption.sort_order)
            .all()
        )
        return {
            "id": question.id,
            "question_text": question.question_text,
            "question_type": question.question_type,
            "points": float(question.points),
            "options": [{"id": o.id, "option_text": o.option_text} for o in options],
        }

    def submit_attempt(
        self,
        db: Session,
        tenant_id: Optional[str],
        attempt_id: str,
        answers: list[SubmitAnswerRequest],
        user_id: str,
    ) -> dict:
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
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Student profile not found")

        attempt = (
            db.query(QuizAttempt)
            .filter(
                QuizAttempt.id == attempt_id,
                QuizAttempt.tenant_id == tid,
                QuizAttempt.student_id == student.id,
                QuizAttempt.status == "in_progress",
            )
            .first()
        )
        if not attempt:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                detail="Attempt not found or already submitted",
            )

        total_score = 0.0
        has_short_text = False
        for ans in answers:
            question = (
                db.query(QuizQuestion)
                .filter(QuizQuestion.id == ans.question_id)
                .first()
            )
            if not question:
                continue

            is_correct = None
            points_awarded = 0.0
            if question.question_type == "mcq" and ans.selected_option_id:
                option = (
                    db.query(QuizQuestionOption)
                    .filter(QuizQuestionOption.id == ans.selected_option_id)
                    .first()
                )
                if option and option.is_correct:
                    is_correct = True
                    points_awarded = float(question.points)
                else:
                    is_correct = False
            elif question.question_type == "short_text":
                has_short_text = True

            total_score += points_awarded
            db.add(
                QuizAnswer(
                    id=new_uuid(),
                    tenant_id=tid,
                    attempt_id=attempt_id,
                    question_id=ans.question_id,
                    selected_option_id=ans.selected_option_id,
                    answer_text=ans.answer_text,
                    is_correct=is_correct,
                    points_awarded=points_awarded,
                )
            )

        all_questions = (
            db.query(QuizQuestion)
            .filter(QuizQuestion.quiz_id == attempt.quiz_id, QuizQuestion.deleted_at.is_(None))
            .all()
        )
        max_score = sum(float(q.points) for q in all_questions)
        attempt.score = total_score
        attempt.max_score = max_score
        attempt.submitted_at = utcnow_naive()
        attempt.status = "submitted" if has_short_text else "graded"
        if not has_short_text:
            attempt.graded_at = utcnow_naive()
        db.commit()

        return {
            "attempt_id": attempt_id,
            "score": total_score,
            "max_score": max_score,
            "status": attempt.status,
            "percentage": round((total_score / max_score) * 100, 2) if max_score else 0,
        }
