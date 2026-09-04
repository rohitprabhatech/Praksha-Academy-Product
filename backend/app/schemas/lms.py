"""LMS and assessment schemas."""

from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class EnrollRequest(BaseModel):
    student_id: str
    course_id: str
    batch_id: Optional[str] = None


class LessonProgressUpdate(BaseModel):
    progress_percent: float = 0.0
    status: str = "in_progress"


class QuestionOption(BaseModel):
    option_text: str
    is_correct: bool = False


class QuizQuestionCreate(BaseModel):
    question_text: str
    question_type: str = "mcq"
    points: float = 1.0
    sort_order: int = 0
    options: List[QuestionOption] = []


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
    enrollment_id: str
    submission_text: Optional[str] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None


class AssignmentGradeRequest(BaseModel):
    score: float
    feedback: Optional[str] = None


class AttendanceRecordItem(BaseModel):
    student_id: str
    status: str = "absent"
    remarks: Optional[str] = None


class AttendanceMarkRequest(BaseModel):
    course_id: str
    batch_id: Optional[str] = None
    live_class_id: Optional[str] = None
    attendance_date: date
    records: List[AttendanceRecordItem]


class AnnouncementCreate(BaseModel):
    course_id: str
    batch_id: Optional[str] = None
    title: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=5000)
    attachment_url: Optional[str] = None


class LiveClassCreate(BaseModel):
    course_id: str
    batch_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    session_date: date
    start_time: str
    end_time: str
    meeting_link: Optional[str] = None
