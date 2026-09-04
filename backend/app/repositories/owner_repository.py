"""Owner repository — profile, website, teachers, students."""

from __future__ import annotations

from typing import Optional

from sqlalchemy.orm import Session

from app.models.profiles import StudentProfile, TeacherProfile
from app.models.rbac import Role
from app.models.tenant import TenantProfile
from app.models.user import User, UserRole
from app.models.website import TenantWebsiteSettings
from app.utils.ids import new_uuid


class OwnerRepository:
    def get_or_create_tenant_profile(self, db: Session, tenant_id: str) -> TenantProfile:
        profile = (
            db.query(TenantProfile)
            .filter(TenantProfile.tenant_id == tenant_id)
            .first()
        )
        if not profile:
            profile = TenantProfile(
                id=new_uuid(),
                tenant_id=tenant_id,
                display_name="My Academy",
            )
            db.add(profile)
            db.flush()
        return profile

    def get_or_create_website_settings(
        self, db: Session, tenant_id: str
    ) -> TenantWebsiteSettings:
        settings = (
            db.query(TenantWebsiteSettings)
            .filter(TenantWebsiteSettings.tenant_id == tenant_id)
            .first()
        )
        if not settings:
            settings = TenantWebsiteSettings(id=new_uuid(), tenant_id=tenant_id)
            db.add(settings)
            db.flush()
        return settings

    def get_user_by_email_in_tenant(
        self, db: Session, email: str, tenant_id: str
    ) -> Optional[User]:
        return (
            db.query(User)
            .filter(
                User.email == email,
                User.tenant_id == tenant_id,
                User.deleted_at.is_(None),
            )
            .first()
        )

    def create_user_with_role(
        self,
        db: Session,
        tenant_id: str,
        email: str,
        password_hash: str,
        first_name: str,
        last_name: Optional[str],
        phone: Optional[str],
        role_code: str,
    ) -> User:
        user = User(
            id=new_uuid(),
            tenant_id=tenant_id,
            email=email,
            password_hash=password_hash,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            status="active",
        )
        db.add(user)
        db.flush()

        role = (
            db.query(Role)
            .filter(Role.scope == "tenant", Role.code == role_code)
            .first()
        )
        if not role:
            role = Role(
                id=new_uuid(),
                scope="tenant",
                code=role_code,
                name=role_code.title(),
                is_system=True,
            )
            db.add(role)
            db.flush()

        db.add(
            UserRole(
                id=new_uuid(),
                user_id=user.id,
                role_id=role.id,
                tenant_id=tenant_id,
            )
        )
        db.flush()
        return user

    def list_teachers(
        self, db: Session, tenant_id: str, page: int, per_page: int
    ) -> tuple[list[TeacherProfile], int]:
        query = db.query(TeacherProfile).filter(
            TeacherProfile.tenant_id == tenant_id,
            TeacherProfile.deleted_at.is_(None),
        )
        total = query.count()
        items = (
            query.order_by(TeacherProfile.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )
        return items, total

    def get_teacher(
        self, db: Session, teacher_id: str, tenant_id: str
    ) -> Optional[TeacherProfile]:
        return (
            db.query(TeacherProfile)
            .filter(
                TeacherProfile.id == teacher_id,
                TeacherProfile.tenant_id == tenant_id,
                TeacherProfile.deleted_at.is_(None),
            )
            .first()
        )

    def create_teacher_profile(
        self, db: Session, tenant_id: str, user_id: str, data: dict
    ) -> TeacherProfile:
        profile = TeacherProfile(
            id=new_uuid(),
            tenant_id=tenant_id,
            user_id=user_id,
            **data,
        )
        db.add(profile)
        db.flush()
        return profile

    def list_students(
        self, db: Session, tenant_id: str, page: int, per_page: int
    ) -> tuple[list[StudentProfile], int]:
        query = db.query(StudentProfile).filter(
            StudentProfile.tenant_id == tenant_id,
            StudentProfile.deleted_at.is_(None),
        )
        total = query.count()
        items = (
            query.order_by(StudentProfile.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )
        return items, total

    def get_student(
        self, db: Session, student_id: str, tenant_id: str
    ) -> Optional[StudentProfile]:
        return (
            db.query(StudentProfile)
            .filter(
                StudentProfile.id == student_id,
                StudentProfile.tenant_id == tenant_id,
                StudentProfile.deleted_at.is_(None),
            )
            .first()
        )

    def create_student_profile(
        self, db: Session, tenant_id: str, user_id: str, data: dict
    ) -> StudentProfile:
        profile = StudentProfile(
            id=new_uuid(),
            tenant_id=tenant_id,
            user_id=user_id,
            **data,
        )
        db.add(profile)
        db.flush()
        return profile
