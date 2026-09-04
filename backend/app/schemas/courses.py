"""Course, program, and curriculum schemas."""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class ProgramCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=220)
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: float = 0.0
    discount_price: Optional[float] = None
    duration_label: Optional[str] = None
    category: Optional[str] = None
    is_featured: bool = False
    sort_order: int = 0


class ProgramUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    duration_label: Optional[str] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None
    status: Optional[str] = None
    sort_order: Optional[int] = None


class AddCourseToProgramRequest(BaseModel):
    course_id: str
    sort_order: int = 0


class CourseCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=220)
    academic_class_id: Optional[str] = None
    subject_id: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: float = 0.0
    discount_price: Optional[float] = None
    duration_label: Optional[str] = None
    language: str = "English"
    course_type: Optional[str] = None
    is_featured: bool = False


class CourseUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    academic_class_id: Optional[str] = None
    subject_id: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    duration_label: Optional[str] = None
    language: Optional[str] = None
    course_type: Optional[str] = None
    is_featured: Optional[bool] = None


class AssignTeacherRequest(BaseModel):
    teacher_id: str
    is_primary: bool = False


class ModuleCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    sort_order: int = 0


class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None


class ReorderRequest(BaseModel):
    ordered_ids: List[str]


class ChapterCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    sort_order: int = 0


class ChapterUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None


class LessonCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    lesson_type: str = "text"
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    is_free_preview: bool = False
    sort_order: int = 0


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    lesson_type: Optional[str] = None
    content: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    is_free_preview: Optional[bool] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None


class MaterialCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    material_type: str
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    description: Optional[str] = None
    batch_id: Optional[str] = None


class MaterialUpdate(BaseModel):
    title: Optional[str] = None
    file_url: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
