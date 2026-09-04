"""Owner dashboard business logic."""

from __future__ import annotations

import math
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, utcnow_naive
from app.models.user import User
from app.repositories.owner_repository import OwnerRepository
from app.schemas.owner import (
    StudentCreate,
    StudentUpdate,
    TeacherCreate,
    TeacherUpdate,
    TenantProfileUpdate,
)
from app.schemas.website import WebsiteSettingsUpdate

repo = OwnerRepository()
DEFAULT_PASSWORD = "Praksha@123"
BOOL_FLAGS = {
    "show_blog",
    "show_gallery",
    "show_faq",
    "show_testimonials",
    "show_programs",
}


class OwnerService:
    def _paginate(self, total: int, page: int, per_page: int) -> dict:
        return {
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": math.ceil(total / per_page) if per_page else 1,
        }

    def _require_tenant(self, tenant_id: Optional[str]) -> str:
        if not tenant_id:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="Tenant context required",
            )
        return tenant_id

    def _profile_to_dict(self, profile) -> dict:
        return {
            "id": profile.id,
            "tenant_id": profile.tenant_id,
            "display_name": profile.display_name,
            "tagline": profile.tagline,
            "logo_url": profile.logo_url,
            "contact_email": profile.contact_email,
            "contact_phone": profile.contact_phone,
            "address_line1": profile.address_line1,
            "address_line2": profile.address_line2,
            "city": profile.city,
            "state": profile.state,
            "country": profile.country,
            "postal_code": profile.postal_code,
            "website_url": profile.website_url,
            "academic_year": profile.academic_year,
            "default_language": profile.default_language,
        }

    def _website_to_dict(self, settings) -> dict:
        return {
            "id": settings.id,
            "tenant_id": settings.tenant_id,
            "primary_color": settings.primary_color,
            "secondary_color": settings.secondary_color,
            "font_family": settings.font_family,
            "logo_url": settings.logo_url,
            "favicon_url": settings.favicon_url,
            "show_blog": bool(settings.show_blog),
            "show_gallery": bool(settings.show_gallery),
            "show_faq": bool(settings.show_faq),
            "show_testimonials": bool(settings.show_testimonials),
            "show_programs": bool(settings.show_programs),
            "home_page_json": settings.home_page_json,
            "about_page_json": settings.about_page_json,
            "contact_page_json": settings.contact_page_json,
            "courses_header_json": settings.courses_header_json,
            "programs_page_json": settings.programs_page_json,
            "seo_title": settings.seo_title,
            "seo_description": settings.seo_description,
            "seo_keywords": settings.seo_keywords,
            "is_published": bool(settings.is_published),
            "published_at": str(settings.published_at) if settings.published_at else None,
        }

    def _teacher_to_dict(self, teacher, user: Optional[User] = None) -> dict:
        data = {
            "id": teacher.id,
            "tenant_id": teacher.tenant_id,
            "user_id": teacher.user_id,
            "employee_code": teacher.employee_code,
            "qualification": teacher.qualification,
            "experience_years": (
                float(teacher.experience_years) if teacher.experience_years is not None else None
            ),
            "specialization": teacher.specialization,
            "bio": teacher.bio,
            "joined_at": str(teacher.joined_at) if teacher.joined_at else None,
        }
        if user:
            data.update(
                {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": user.phone,
                    "status": user.status,
                }
            )
        return data

    def _student_to_dict(self, student, user: Optional[User] = None) -> dict:
        data = {
            "id": student.id,
            "tenant_id": student.tenant_id,
            "user_id": student.user_id,
            "enrollment_number": student.enrollment_number,
            "date_of_birth": str(student.date_of_birth) if student.date_of_birth else None,
            "gender": student.gender,
            "guardian_name": student.guardian_name,
            "guardian_phone": student.guardian_phone,
            "address_line1": student.address_line1,
            "city": student.city,
            "joined_at": str(student.joined_at) if student.joined_at else None,
        }
        if user:
            data.update(
                {
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": user.phone,
                    "status": user.status,
                }
            )
        return data

    def _load_user(self, db: Session, user_id: str) -> Optional[User]:
        return db.query(User).filter(User.id == user_id, User.deleted_at.is_(None)).first()

    # ─── PROFILE / WEBSITE ────────────────────────────────────────────────────

    def get_profile(self, db: Session, tenant_id: Optional[str]) -> dict:
        tid = self._require_tenant(tenant_id)
        profile = repo.get_or_create_tenant_profile(db, tid)
        db.commit()
        return self._profile_to_dict(profile)

    def update_profile(
        self, db: Session, tenant_id: Optional[str], data: TenantProfileUpdate
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        profile = repo.get_or_create_tenant_profile(db, tid)
        updates = data.model_dump(exclude_none=True)
        if "contact_email" in updates and updates["contact_email"] is not None:
            updates["contact_email"] = str(updates["contact_email"]).lower()
        for key, value in updates.items():
            setattr(profile, key, value)
        db.commit()
        return self._profile_to_dict(profile)

    def get_website_settings(self, db: Session, tenant_id: Optional[str]) -> dict:
        tid = self._require_tenant(tenant_id)
        settings = repo.get_or_create_website_settings(db, tid)
        db.commit()
        return self._website_to_dict(settings)

    def update_website_settings(
        self, db: Session, tenant_id: Optional[str], data: WebsiteSettingsUpdate
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        settings = repo.get_or_create_website_settings(db, tid)
        updates = data.model_dump(exclude_none=True)
        for key, value in updates.items():
            if key in BOOL_FLAGS:
                setattr(settings, key, 1 if value else 0)
            else:
                setattr(settings, key, value)
        db.commit()
        return self._website_to_dict(settings)

    def publish_website(
        self, db: Session, tenant_id: Optional[str], actor_id: str
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        settings = repo.get_or_create_website_settings(db, tid)
        settings.is_published = 1
        settings.published_at = utcnow_naive()
        settings.published_by = actor_id
        db.commit()
        return {"is_published": True, "published_at": str(settings.published_at)}

    # ─── TEACHERS ─────────────────────────────────────────────────────────────

    def list_teachers(
        self, db: Session, tenant_id: Optional[str], page: int, per_page: int
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        items, total = repo.list_teachers(db, tid, page, per_page)
        return {
            "items": [
                self._teacher_to_dict(t, self._load_user(db, t.user_id)) for t in items
            ],
            **self._paginate(total, page, per_page),
        }

    def create_teacher(
        self, db: Session, tenant_id: Optional[str], data: TeacherCreate
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        email = str(data.email).lower().strip()
        if repo.get_user_by_email_in_tenant(db, email, tid):
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                detail="Email already in use in this academy",
            )
        user = repo.create_user_with_role(
            db,
            tid,
            email,
            hash_password(DEFAULT_PASSWORD),
            data.first_name,
            data.last_name,
            data.phone,
            "teacher",
        )
        profile = repo.create_teacher_profile(
            db,
            tid,
            user.id,
            {
                "employee_code": data.employee_code,
                "qualification": data.qualification,
                "experience_years": data.experience_years,
                "specialization": data.specialization,
                "bio": data.bio,
                "joined_at": data.joined_at,
            },
        )
        db.commit()
        return self._teacher_to_dict(profile, user)

    def get_teacher(
        self, db: Session, teacher_id: str, tenant_id: Optional[str]
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        teacher = repo.get_teacher(db, teacher_id, tid)
        if not teacher:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Teacher not found")
        return self._teacher_to_dict(teacher, self._load_user(db, teacher.user_id))

    def update_teacher(
        self,
        db: Session,
        teacher_id: str,
        tenant_id: Optional[str],
        data: TeacherUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        teacher = repo.get_teacher(db, teacher_id, tid)
        if not teacher:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Teacher not found")

        updates = data.model_dump(exclude_none=True)
        user_fields = {}
        for key in ("first_name", "last_name", "phone"):
            if key in updates:
                user_fields[key] = updates.pop(key)
        for key, value in updates.items():
            setattr(teacher, key, value)

        user = self._load_user(db, teacher.user_id)
        if user and user_fields:
            for key, value in user_fields.items():
                setattr(user, key, value)
        db.commit()
        return self._teacher_to_dict(teacher, user)

    def delete_teacher(
        self, db: Session, teacher_id: str, tenant_id: Optional[str]
    ) -> None:
        tid = self._require_tenant(tenant_id)
        teacher = repo.get_teacher(db, teacher_id, tid)
        if not teacher:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Teacher not found")
        teacher.deleted_at = utcnow_naive()
        user = self._load_user(db, teacher.user_id)
        if user:
            user.status = "inactive"
        db.commit()

    def reset_teacher_password(
        self,
        db: Session,
        teacher_id: str,
        tenant_id: Optional[str],
        new_password: str,
    ) -> None:
        tid = self._require_tenant(tenant_id)
        teacher = repo.get_teacher(db, teacher_id, tid)
        if not teacher:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Teacher not found")
        user = self._load_user(db, teacher.user_id)
        if not user:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
        user.password_hash = hash_password(new_password)
        db.commit()

    # ─── STUDENTS ─────────────────────────────────────────────────────────────

    def list_students(
        self, db: Session, tenant_id: Optional[str], page: int, per_page: int
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        items, total = repo.list_students(db, tid, page, per_page)
        return {
            "items": [
                self._student_to_dict(s, self._load_user(db, s.user_id)) for s in items
            ],
            **self._paginate(total, page, per_page),
        }

    def create_student(
        self, db: Session, tenant_id: Optional[str], data: StudentCreate
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        email = str(data.email).lower().strip()
        if repo.get_user_by_email_in_tenant(db, email, tid):
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                detail="Email already in use in this academy",
            )
        if data.gender and data.gender not in {
            "male",
            "female",
            "other",
            "prefer_not_to_say",
        }:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid gender")

        user = repo.create_user_with_role(
            db,
            tid,
            email,
            hash_password(DEFAULT_PASSWORD),
            data.first_name,
            data.last_name,
            data.phone,
            "student",
        )
        profile = repo.create_student_profile(
            db,
            tid,
            user.id,
            {
                "enrollment_number": data.enrollment_number,
                "date_of_birth": data.date_of_birth,
                "gender": data.gender,
                "guardian_name": data.guardian_name,
                "guardian_phone": data.guardian_phone,
                "address_line1": data.address_line1,
                "city": data.city,
                "joined_at": data.joined_at,
            },
        )
        db.commit()
        return self._student_to_dict(profile, user)

    def get_student(
        self, db: Session, student_id: str, tenant_id: Optional[str]
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        student = repo.get_student(db, student_id, tid)
        if not student:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Student not found")
        return self._student_to_dict(student, self._load_user(db, student.user_id))

    def update_student(
        self,
        db: Session,
        student_id: str,
        tenant_id: Optional[str],
        data: StudentUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        student = repo.get_student(db, student_id, tid)
        if not student:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Student not found")

        updates = data.model_dump(exclude_none=True)
        if "gender" in updates and updates["gender"] not in {
            "male",
            "female",
            "other",
            "prefer_not_to_say",
        }:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid gender")

        user_fields = {}
        for key in ("first_name", "last_name", "phone"):
            if key in updates:
                user_fields[key] = updates.pop(key)
        for key, value in updates.items():
            setattr(student, key, value)

        user = self._load_user(db, student.user_id)
        if user and user_fields:
            for key, value in user_fields.items():
                setattr(user, key, value)
        db.commit()
        return self._student_to_dict(student, user)

    def delete_student(
        self, db: Session, student_id: str, tenant_id: Optional[str]
    ) -> None:
        tid = self._require_tenant(tenant_id)
        student = repo.get_student(db, student_id, tid)
        if not student:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Student not found")
        student.deleted_at = utcnow_naive()
        user = self._load_user(db, student.user_id)
        if user:
            user.status = "inactive"
        db.commit()

    def reset_student_password(
        self,
        db: Session,
        student_id: str,
        tenant_id: Optional[str],
        new_password: str,
    ) -> None:
        tid = self._require_tenant(tenant_id)
        student = repo.get_student(db, student_id, tid)
        if not student:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Student not found")
        user = self._load_user(db, student.user_id)
        if not user:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
        user.password_hash = hash_password(new_password)
        db.commit()
