"""Owner dashboard request schemas."""

from __future__ import annotations

from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class TenantProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(default=None, max_length=200)
    tagline: Optional[str] = Field(default=None, max_length=500)
    logo_url: Optional[str] = Field(default=None, max_length=500)
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = Field(default=None, max_length=30)
    address_line1: Optional[str] = Field(default=None, max_length=255)
    address_line2: Optional[str] = Field(default=None, max_length=255)
    city: Optional[str] = Field(default=None, max_length=100)
    state: Optional[str] = Field(default=None, max_length=100)
    country: Optional[str] = Field(default=None, max_length=100)
    postal_code: Optional[str] = Field(default=None, max_length=20)
    website_url: Optional[str] = Field(default=None, max_length=500)
    academic_year: Optional[str] = Field(default=None, max_length=20)
    default_language: Optional[str] = Field(default=None, max_length=50)


class TeacherCreate(BaseModel):
    email: EmailStr
    first_name: str = Field(min_length=1, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    phone: Optional[str] = Field(default=None, max_length=30)
    employee_code: Optional[str] = Field(default=None, max_length=50)
    qualification: Optional[str] = None
    experience_years: Optional[float] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None
    joined_at: Optional[date] = None


class TeacherUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    phone: Optional[str] = Field(default=None, max_length=30)
    employee_code: Optional[str] = Field(default=None, max_length=50)
    qualification: Optional[str] = None
    experience_years: Optional[float] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None


class StudentCreate(BaseModel):
    email: EmailStr
    first_name: str = Field(min_length=1, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    phone: Optional[str] = Field(default=None, max_length=30)
    enrollment_number: Optional[str] = Field(default=None, max_length=50)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    address_line1: Optional[str] = None
    city: Optional[str] = None
    joined_at: Optional[date] = None


class StudentUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    phone: Optional[str] = Field(default=None, max_length=30)
    enrollment_number: Optional[str] = Field(default=None, max_length=50)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    address_line1: Optional[str] = None
    city: Optional[str] = None


class ResetPasswordRequest(BaseModel):
    new_password: str = Field(min_length=8)


class ClassCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    code: Optional[str] = Field(default=None, max_length=50)
    description: Optional[str] = Field(default=None, max_length=500)
    sort_order: int = 0


class ClassUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=150)
    code: Optional[str] = Field(default=None, max_length=50)
    description: Optional[str] = Field(default=None, max_length=500)
    sort_order: Optional[int] = None
    status: Optional[str] = None


class SubjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    code: Optional[str] = Field(default=None, max_length=50)
    description: Optional[str] = Field(default=None, max_length=500)


class SubjectUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=150)
    code: Optional[str] = Field(default=None, max_length=50)
    description: Optional[str] = Field(default=None, max_length=500)
    status: Optional[str] = None


class BatchCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    code: Optional[str] = Field(default=None, max_length=50)
    academic_class_id: str
    course_id: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    max_students: Optional[int] = None


class BatchUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=150)
    code: Optional[str] = Field(default=None, max_length=50)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    max_students: Optional[int] = None
    status: Optional[str] = None


class AddStudentToBatchRequest(BaseModel):
    student_id: str
