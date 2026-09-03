# SPRINT 05 — Tenant Setup APIs (Owner Dashboard)
**Project:** Praksha Academy SaaS
**Developer:** _(assign name here)_
**Branch:** `feature/sprint-05-tenant-setup`
**Base Branch:** `dev`
**Estimated Time:** 7–10 working days
**Depends on:** Sprint 03 + Sprint 04 merged to `dev`

---

## What Is This Sprint About?

Once a tenant (academy) is approved and activated (Sprint 04), the **Academy Owner** needs APIs to set up their academy:

1. Update their academy profile (name, logo, contact)
2. Manage their public website content (CMS)
3. Add/manage teachers
4. Add/manage students
5. Create academic classes (e.g. "Class 10", "Grade 5")
6. Create subjects (e.g. "Mathematics", "Physics")
7. Create batches (e.g. "Batch 2026-A") and add students to them

**Important:** All data is **tenant-scoped**. Owner of Academy A can NEVER see or modify Academy B's data.

---

## Step 1 — Create Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feature/sprint-05-tenant-setup
```

---

## Step 2 — Understand Tenant Isolation

Every service method must filter by `tenant_id`. The `tenant_id` comes from the JWT token:

```python
# In route handler:
@router.get("/students")
def list_students(current_user: dict = Depends(require_role("owner")),
                  db: Session = Depends(get_db)):
    tenant_id = current_user["tenant_id"]   # ← ALWAYS get from JWT, NOT from URL
    return service.list_students(db, tenant_id)
```

**Never trust the URL or request body for tenant_id. Always use JWT.**

---

## Step 3 — Folder Structure

```
backend/app/
├── schemas/
│   ├── owner.py              ← NEW: all owner-facing schemas
│   └── website.py            ← NEW: website CMS schemas
│
├── repositories/
│   ├── owner_repository.py   ← NEW: user/profile DB queries for owner ops
│   └── academic_repository.py ← NEW: classes, subjects, batches queries
│
├── services/
│   ├── owner_service.py      ← NEW: business logic
│   └── academic_service.py   ← NEW: classes/subjects/batches logic
│
└── api/v1/
    └── owner/
        ├── __init__.py       ← NEW
        ├── profile.py        ← NEW (tenant profile + website CMS)
        ├── teachers.py       ← NEW
        ├── students.py       ← NEW
        ├── classes.py        ← NEW
        ├── subjects.py       ← NEW
        └── batches.py        ← NEW
```

---

## Step 4 — Schemas (`app/schemas/owner.py`)

```python
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime


# ─── TENANT PROFILE ───────────────────────────────────────────────────────────

class TenantProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    tagline: Optional[str] = None
    logo_url: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    website_url: Optional[str] = None
    academic_year: Optional[str] = None
    default_language: Optional[str] = None


# ─── TEACHERS ─────────────────────────────────────────────────────────────────

class TeacherCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: Optional[str] = None
    phone: Optional[str] = None
    employee_code: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[float] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None
    joined_at: Optional[date] = None

class TeacherUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    employee_code: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[float] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None


# ─── STUDENTS ─────────────────────────────────────────────────────────────────

class StudentCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: Optional[str] = None
    phone: Optional[str] = None
    enrollment_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None        # male | female | other | prefer_not_to_say
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    address_line1: Optional[str] = None
    city: Optional[str] = None
    joined_at: Optional[date] = None

class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    enrollment_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None

class ResetPasswordRequest(BaseModel):
    new_password: str


# ─── ACADEMIC CLASSES ─────────────────────────────────────────────────────────

class ClassCreate(BaseModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = None
    sort_order: int = 0

class ClassUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None   # active | inactive


# ─── SUBJECTS ─────────────────────────────────────────────────────────────────

class SubjectCreate(BaseModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = None

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


# ─── BATCHES ──────────────────────────────────────────────────────────────────

class BatchCreate(BaseModel):
    name: str
    code: Optional[str] = None
    academic_class_id: str
    course_id: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    max_students: Optional[int] = None

class BatchUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    max_students: Optional[int] = None
    status: Optional[str] = None   # active | inactive | completed

class AddStudentToBatchRequest(BaseModel):
    student_id: str
```

---

## Step 5 — Website CMS Schemas (`app/schemas/website.py`)

```python
from pydantic import BaseModel
from typing import Optional, Any


class WebsiteSettingsUpdate(BaseModel):
    # Branding
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    font_family: Optional[str] = None
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    # Nav toggles
    show_blog: Optional[bool] = None
    show_gallery: Optional[bool] = None
    show_faq: Optional[bool] = None
    show_testimonials: Optional[bool] = None
    show_programs: Optional[bool] = None
    # Page content (free-form JSON)
    home_page_json: Optional[Any] = None
    about_page_json: Optional[Any] = None
    contact_page_json: Optional[Any] = None
    courses_header_json: Optional[Any] = None
    programs_page_json: Optional[Any] = None
    # SEO
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
```

---

## Step 6 — Repository (`app/repositories/owner_repository.py`)

```python
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from app.models.user import User, UserRole
from app.models.profiles import TeacherProfile, StudentProfile
from app.models.rbac import Role
from app.models.tenant import TenantProfile
from app.models.website import TenantWebsiteSettings
from app.utils.ids import new_uuid


class OwnerRepository:

    def get_or_create_tenant_profile(self, db: Session, tenant_id: str) -> TenantProfile:
        profile = db.query(TenantProfile).filter(
            TenantProfile.tenant_id == tenant_id
        ).first()
        if not profile:
            profile = TenantProfile(
                id=new_uuid(), tenant_id=tenant_id, display_name="My Academy"
            )
            db.add(profile)
            db.flush()
        return profile

    def get_or_create_website_settings(self, db: Session, tenant_id: str) -> TenantWebsiteSettings:
        ws = db.query(TenantWebsiteSettings).filter(
            TenantWebsiteSettings.tenant_id == tenant_id
        ).first()
        if not ws:
            ws = TenantWebsiteSettings(id=new_uuid(), tenant_id=tenant_id)
            db.add(ws)
            db.flush()
        return ws

    def get_user_by_email_in_tenant(self, db: Session, email: str,
                                    tenant_id: str) -> Optional[User]:
        return db.query(User).filter(
            User.email == email,
            User.tenant_id == tenant_id,
            User.deleted_at == None
        ).first()

    def create_user_with_role(self, db: Session, tenant_id: str,
                              email: str, password_hash: str,
                              first_name: str, last_name: Optional[str],
                              phone: Optional[str], role_code: str) -> User:
        # Create user
        user = User(
            id=new_uuid(), tenant_id=tenant_id, email=email,
            password_hash=password_hash, first_name=first_name,
            last_name=last_name, phone=phone, status="active",
        )
        db.add(user)
        db.flush()

        # Assign role
        role = db.query(Role).filter(
            Role.scope == "tenant", Role.code == role_code
        ).first()
        if role:
            db.add(UserRole(
                id=new_uuid(), user_id=user.id,
                role_id=role.id, tenant_id=tenant_id
            ))
        db.flush()
        return user

    def list_teachers(self, db: Session, tenant_id: str,
                      page: int, per_page: int) -> tuple[list, int]:
        q = db.query(TeacherProfile).filter(
            TeacherProfile.tenant_id == tenant_id,
            TeacherProfile.deleted_at == None
        )
        total = q.count()
        items = q.order_by(TeacherProfile.created_at.desc()) \
                 .offset((page - 1) * per_page).limit(per_page).all()
        return items, total

    def get_teacher(self, db: Session, teacher_id: str,
                    tenant_id: str) -> Optional[TeacherProfile]:
        return db.query(TeacherProfile).filter(
            TeacherProfile.id == teacher_id,
            TeacherProfile.tenant_id == tenant_id,
            TeacherProfile.deleted_at == None
        ).first()

    def create_teacher_profile(self, db: Session, tenant_id: str,
                               user_id: str, data: dict) -> TeacherProfile:
        profile = TeacherProfile(
            id=new_uuid(), tenant_id=tenant_id, user_id=user_id, **data
        )
        db.add(profile)
        db.flush()
        return profile

    def list_students(self, db: Session, tenant_id: str,
                      page: int, per_page: int) -> tuple[list, int]:
        q = db.query(StudentProfile).filter(
            StudentProfile.tenant_id == tenant_id,
            StudentProfile.deleted_at == None
        )
        total = q.count()
        items = q.order_by(StudentProfile.created_at.desc()) \
                 .offset((page - 1) * per_page).limit(per_page).all()
        return items, total

    def get_student(self, db: Session, student_id: str,
                    tenant_id: str) -> Optional[StudentProfile]:
        return db.query(StudentProfile).filter(
            StudentProfile.id == student_id,
            StudentProfile.tenant_id == tenant_id,
            StudentProfile.deleted_at == None
        ).first()

    def create_student_profile(self, db: Session, tenant_id: str,
                               user_id: str, data: dict) -> StudentProfile:
        profile = StudentProfile(
            id=new_uuid(), tenant_id=tenant_id, user_id=user_id, **data
        )
        db.add(profile)
        db.flush()
        return profile
```

---

## Step 7 — Service (`app/services/owner_service.py`)

Key rules:
1. When creating teacher/student: **create User AND profile in one transaction** (use `db.commit()` once at the end)
2. Default password for owner-created accounts: **`Praksha@123`** — hash it, never store plain
3. Always validate email not already in use in the same tenant

```python
import math
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.repositories.owner_repository import OwnerRepository
from app.schemas.owner import (
    TenantProfileUpdate, TeacherCreate, TeacherUpdate,
    StudentCreate, StudentUpdate
)
from app.schemas.website import WebsiteSettingsUpdate

repo = OwnerRepository()
DEFAULT_PASSWORD = "Praksha@123"


class OwnerService:

    def _paginate(self, total, page, per_page) -> dict:
        import math
        return {"total": total, "page": page, "per_page": per_page,
                "pages": math.ceil(total / per_page) if per_page else 1}

    # ─── PROFILE ──────────────────────────────────────────────────────────────

    def get_profile(self, db: Session, tenant_id: str) -> dict:
        profile = repo.get_or_create_tenant_profile(db, tenant_id)
        db.commit()
        return self._profile_to_dict(profile)

    def update_profile(self, db: Session, tenant_id: str,
                       data: TenantProfileUpdate) -> dict:
        profile = repo.get_or_create_tenant_profile(db, tenant_id)
        for k, v in data.model_dump(exclude_none=True).items():
            setattr(profile, k, v)
        db.commit()
        return self._profile_to_dict(profile)

    def get_website_settings(self, db: Session, tenant_id: str) -> dict:
        ws = repo.get_or_create_website_settings(db, tenant_id)
        db.commit()
        return self._website_to_dict(ws)

    def update_website_settings(self, db: Session, tenant_id: str,
                                data: WebsiteSettingsUpdate) -> dict:
        ws = repo.get_or_create_website_settings(db, tenant_id)
        for k, v in data.model_dump(exclude_none=True).items():
            setattr(ws, k, v)
        db.commit()
        return self._website_to_dict(ws)

    def publish_website(self, db: Session, tenant_id: str, actor_id: str) -> dict:
        from datetime import datetime, timezone
        ws = repo.get_or_create_website_settings(db, tenant_id)
        ws.is_published = 1
        ws.published_at = datetime.now(timezone.utc)
        ws.published_by = actor_id
        db.commit()
        return {"is_published": True}

    # ─── TEACHERS ─────────────────────────────────────────────────────────────

    def list_teachers(self, db: Session, tenant_id: str,
                      page: int, per_page: int) -> dict:
        items, total = repo.list_teachers(db, tenant_id, page, per_page)
        return {"items": [self._teacher_to_dict(t) for t in items],
                **self._paginate(total, page, per_page)}

    def create_teacher(self, db: Session, tenant_id: str,
                       data: TeacherCreate) -> dict:
        # Check email not taken
        if repo.get_user_by_email_in_tenant(db, data.email, tenant_id):
            raise HTTPException(status.HTTP_409_CONFLICT,
                                "Email already in use in this academy")

        user = repo.create_user_with_role(
            db, tenant_id, data.email,
            hash_password(DEFAULT_PASSWORD),
            data.first_name, data.last_name, data.phone, "teacher"
        )
        profile = repo.create_teacher_profile(db, tenant_id, user.id, {
            "employee_code": data.employee_code,
            "qualification": data.qualification,
            "experience_years": data.experience_years,
            "specialization": data.specialization,
            "bio": data.bio,
            "joined_at": data.joined_at,
        })
        db.commit()
        return self._teacher_to_dict(profile)

    def get_teacher(self, db: Session, teacher_id: str, tenant_id: str) -> dict:
        t = repo.get_teacher(db, teacher_id, tenant_id)
        if not t:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Teacher not found")
        return self._teacher_to_dict(t)

    def update_teacher(self, db: Session, teacher_id: str, tenant_id: str,
                       data: TeacherUpdate) -> dict:
        t = repo.get_teacher(db, teacher_id, tenant_id)
        if not t:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Teacher not found")
        for k, v in data.model_dump(exclude_none=True).items():
            setattr(t, k, v)
        db.commit()
        return self._teacher_to_dict(t)

    def delete_teacher(self, db: Session, teacher_id: str, tenant_id: str) -> None:
        from datetime import datetime
        t = repo.get_teacher(db, teacher_id, tenant_id)
        if not t:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Teacher not found")
        t.deleted_at = datetime.utcnow()
        db.commit()

    def reset_teacher_password(self, db: Session, teacher_id: str,
                               tenant_id: str, new_password: str) -> None:
        from app.models.user import User
        t = repo.get_teacher(db, teacher_id, tenant_id)
        if not t:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Teacher not found")
        user = db.query(User).filter(User.id == t.user_id).first()
        if user:
            user.password_hash = hash_password(new_password)
        db.commit()

    # ─── STUDENTS ─────────────────────────────────────────────────────────────
    # (Same pattern as teachers — implement similarly)

    def list_students(self, db: Session, tenant_id: str,
                      page: int, per_page: int) -> dict:
        items, total = repo.list_students(db, tenant_id, page, per_page)
        return {"items": [self._student_to_dict(s) for s in items],
                **self._paginate(total, page, per_page)}

    def create_student(self, db: Session, tenant_id: str,
                       data: StudentCreate) -> dict:
        if repo.get_user_by_email_in_tenant(db, data.email, tenant_id):
            raise HTTPException(status.HTTP_409_CONFLICT,
                                "Email already in use in this academy")
        user = repo.create_user_with_role(
            db, tenant_id, data.email, hash_password(DEFAULT_PASSWORD),
            data.first_name, data.last_name, data.phone, "student"
        )
        profile = repo.create_student_profile(db, tenant_id, user.id, {
            "enrollment_number": data.enrollment_number,
            "date_of_birth": data.date_of_birth,
            "gender": data.gender,
            "guardian_name": data.guardian_name,
            "guardian_phone": data.guardian_phone,
            "address_line1": data.address_line1,
            "city": data.city,
            "joined_at": data.joined_at,
        })
        db.commit()
        return self._student_to_dict(profile)

    # ─── Helper converters ─────────────────────────────────────────────────────

    def _profile_to_dict(self, p) -> dict:
        return {k: getattr(p, k) for k in [
            "id", "tenant_id", "display_name", "tagline", "logo_url",
            "contact_email", "contact_phone", "city", "state", "country"
        ]}

    def _website_to_dict(self, ws) -> dict:
        return {k: getattr(ws, k) for k in [
            "id", "tenant_id", "primary_color", "secondary_color", "font_family",
            "logo_url", "favicon_url", "show_blog", "show_gallery", "show_faq",
            "show_testimonials", "show_programs", "home_page_json", "about_page_json",
            "contact_page_json", "courses_header_json", "programs_page_json",
            "seo_title", "seo_description", "is_published", "published_at"
        ]}

    def _teacher_to_dict(self, t) -> dict:
        return {
            "id": t.id,
            "tenant_id": t.tenant_id,
            "user_id": t.user_id,
            "employee_code": t.employee_code,
            "qualification": t.qualification,
            "experience_years": float(t.experience_years) if t.experience_years else None,
            "specialization": t.specialization,
            "bio": t.bio,
            "joined_at": str(t.joined_at) if t.joined_at else None,
        }

    def _student_to_dict(self, s) -> dict:
        return {
            "id": s.id,
            "tenant_id": s.tenant_id,
            "user_id": s.user_id,
            "enrollment_number": s.enrollment_number,
            "date_of_birth": str(s.date_of_birth) if s.date_of_birth else None,
            "gender": s.gender,
            "guardian_name": s.guardian_name,
            "guardian_phone": s.guardian_phone,
            "city": s.city,
        }
```

---

## Step 8 — Route Handlers

### `app/api/v1/owner/profile.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.owner import TenantProfileUpdate
from app.schemas.website import WebsiteSettingsUpdate
from app.services.owner_service import OwnerService

router = APIRouter(prefix="/owner/profile", tags=["Owner — Profile"])
service = OwnerService()


@router.get("")
def get_profile(db: Session = Depends(get_db),
                current_user: dict = Depends(require_role("owner"))):
    return success_response(data=service.get_profile(db, current_user["tenant_id"]))


@router.put("")
def update_profile(body: TenantProfileUpdate, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("owner"))):
    data = service.update_profile(db, current_user["tenant_id"], body)
    return success_response(data=data, message="Profile updated")


@router.get("/website")
def get_website(db: Session = Depends(get_db),
                current_user: dict = Depends(require_role("owner"))):
    return success_response(
        data=service.get_website_settings(db, current_user["tenant_id"])
    )


@router.put("/website")
def update_website(body: WebsiteSettingsUpdate, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("owner"))):
    data = service.update_website_settings(db, current_user["tenant_id"], body)
    return success_response(data=data, message="Website settings saved")


@router.post("/website/publish")
def publish_website(db: Session = Depends(get_db),
                    current_user: dict = Depends(require_role("owner"))):
    data = service.publish_website(db, current_user["tenant_id"], current_user["sub"])
    return success_response(data=data, message="Website published")
```

### `app/api/v1/owner/teachers.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.owner import TeacherCreate, TeacherUpdate, ResetPasswordRequest
from app.services.owner_service import OwnerService

router = APIRouter(prefix="/owner/teachers", tags=["Owner — Teachers"])
service = OwnerService()


@router.get("")
def list_teachers(page: int = 1, per_page: int = 20,
                  db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("owner"))):
    data = service.list_teachers(db, current_user["tenant_id"], page, per_page)
    return success_response(data=data)


@router.post("")
def create_teacher(body: TeacherCreate, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("owner"))):
    data = service.create_teacher(db, current_user["tenant_id"], body)
    return success_response(data=data, message="Teacher created. Default password: Praksha@123")


@router.get("/{teacher_id}")
def get_teacher(teacher_id: str, db: Session = Depends(get_db),
                current_user: dict = Depends(require_role("owner"))):
    data = service.get_teacher(db, teacher_id, current_user["tenant_id"])
    return success_response(data=data)


@router.put("/{teacher_id}")
def update_teacher(teacher_id: str, body: TeacherUpdate,
                   db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("owner"))):
    data = service.update_teacher(db, teacher_id, current_user["tenant_id"], body)
    return success_response(data=data, message="Teacher updated")


@router.delete("/{teacher_id}")
def delete_teacher(teacher_id: str, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("owner"))):
    service.delete_teacher(db, teacher_id, current_user["tenant_id"])
    return success_response(message="Teacher removed")


@router.post("/{teacher_id}/reset-password")
def reset_teacher_password(teacher_id: str, body: ResetPasswordRequest,
                           db: Session = Depends(get_db),
                           current_user: dict = Depends(require_role("owner"))):
    service.reset_teacher_password(db, teacher_id, current_user["tenant_id"],
                                   body.new_password)
    return success_response(message="Password reset successfully")
```

### `app/api/v1/owner/students.py`
*(Same pattern as teachers — build `list`, `create`, `get`, `update`, `delete`, `reset-password`)*

### `app/api/v1/owner/classes.py`
*(CRUD for `AcademicClass` — same pattern)*

### `app/api/v1/owner/subjects.py`
*(CRUD for `Subject` — same pattern)*

### `app/api/v1/owner/batches.py`
*(CRUD for `Batch` + `GET /{id}/students`, `POST /{id}/students`, `DELETE /{id}/students/{studentId}`)*

### Register in `app/api/v1/router.py`

```python
from app.api.v1.owner.profile import router as owner_profile_router
from app.api.v1.owner.teachers import router as teachers_router
from app.api.v1.owner.students import router as students_router
from app.api.v1.owner.classes import router as classes_router
from app.api.v1.owner.subjects import router as subjects_router
from app.api.v1.owner.batches import router as batches_router

api_router.include_router(owner_profile_router)
api_router.include_router(teachers_router)
api_router.include_router(students_router)
api_router.include_router(classes_router)
api_router.include_router(subjects_router)
api_router.include_router(batches_router)
```

---

## Step 9 — Academic Service (`app/services/academic_service.py`)

```python
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.academic import AcademicClass, Subject, Batch
from app.models.batch_students import BatchStudent
from app.utils.ids import new_uuid
from datetime import datetime


class AcademicService:

    def list_classes(self, db: Session, tenant_id: str) -> list:
        items = db.query(AcademicClass).filter(
            AcademicClass.tenant_id == tenant_id,
            AcademicClass.deleted_at == None
        ).order_by(AcademicClass.sort_order).all()
        return [self._class_to_dict(c) for c in items]

    def create_class(self, db: Session, tenant_id: str, data: dict) -> dict:
        obj = AcademicClass(id=new_uuid(), tenant_id=tenant_id, **data)
        db.add(obj)
        db.commit()
        return self._class_to_dict(obj)

    def update_class(self, db: Session, class_id: str, tenant_id: str,
                     data: dict) -> dict:
        obj = db.query(AcademicClass).filter(
            AcademicClass.id == class_id,
            AcademicClass.tenant_id == tenant_id,
            AcademicClass.deleted_at == None
        ).first()
        if not obj:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Class not found")
        for k, v in data.items():
            if v is not None:
                setattr(obj, k, v)
        db.commit()
        return self._class_to_dict(obj)

    def delete_class(self, db: Session, class_id: str, tenant_id: str) -> None:
        obj = db.query(AcademicClass).filter(
            AcademicClass.id == class_id,
            AcademicClass.tenant_id == tenant_id,
            AcademicClass.deleted_at == None
        ).first()
        if not obj:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Class not found")
        obj.deleted_at = datetime.utcnow()
        db.commit()

    # ─── Batches ──────────────────────────────────────────────────────────────

    def add_student_to_batch(self, db: Session, batch_id: str, student_id: str,
                             tenant_id: str, added_by: str) -> dict:
        # Check if already in batch
        existing = db.query(BatchStudent).filter(
            BatchStudent.batch_id == batch_id,
            BatchStudent.student_id == student_id,
            BatchStudent.tenant_id == tenant_id,
            BatchStudent.status == "active",
        ).first()
        if existing:
            raise HTTPException(status.HTTP_409_CONFLICT,
                                "Student is already in this batch")
        bs = BatchStudent(
            id=new_uuid(), tenant_id=tenant_id, batch_id=batch_id,
            student_id=student_id, added_by=added_by
        )
        db.add(bs)
        db.commit()
        return {"batch_id": batch_id, "student_id": student_id, "status": "active"}

    def remove_student_from_batch(self, db: Session, batch_id: str,
                                  student_id: str, tenant_id: str) -> None:
        bs = db.query(BatchStudent).filter(
            BatchStudent.batch_id == batch_id,
            BatchStudent.student_id == student_id,
            BatchStudent.tenant_id == tenant_id,
        ).first()
        if not bs:
            raise HTTPException(status.HTTP_404_NOT_FOUND,
                                "Student not found in this batch")
        bs.status = "removed"
        db.commit()

    def _class_to_dict(self, c) -> dict:
        return {
            "id": c.id, "name": c.name, "code": c.code,
            "description": c.description, "sort_order": c.sort_order,
            "status": c.status,
        }
```

---

## Step 10 — Tests

Create `tests/test_owner/`:

### `test_profile.py`
1. GET /owner/profile returns profile ✅
2. PUT /owner/profile updates display_name ✅
3. GET/PUT website settings ✅
4. Publish website sets is_published=true ✅

### `test_teachers.py`
5. Create teacher — user + profile created ✅
6. Duplicate email returns 409 ✅
7. List teachers is paginated ✅
8. Get teacher by ID ✅
9. Update teacher profile ✅
10. Delete teacher (soft delete) ✅
11. Reset teacher password ✅
12. Teacher from Tenant A not visible to Tenant B owner ✅

### `test_students.py`
13. Create student — user + profile created ✅
14. Duplicate email returns 409 ✅
15. List students ✅
16. Update student ✅
17. Delete student ✅

### `test_academic.py`
18. Create class ✅
19. List classes ✅
20. Update class ✅
21. Create subject ✅
22. Create batch ✅
23. Add student to batch ✅
24. Add same student twice → 409 ✅
25. Remove student from batch ✅

Minimum: **25 tests**.

---

## API Summary Table

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/owner/profile` | Get tenant profile |
| PUT | `/api/v1/owner/profile` | Update profile |
| GET | `/api/v1/owner/profile/website` | Website CMS settings |
| PUT | `/api/v1/owner/profile/website` | Update CMS content |
| POST | `/api/v1/owner/profile/website/publish` | Publish website |
| GET | `/api/v1/owner/teachers` | List teachers |
| POST | `/api/v1/owner/teachers` | Create teacher |
| GET | `/api/v1/owner/teachers/{id}` | Get teacher |
| PUT | `/api/v1/owner/teachers/{id}` | Update teacher |
| DELETE | `/api/v1/owner/teachers/{id}` | Delete teacher |
| POST | `/api/v1/owner/teachers/{id}/reset-password` | Reset password |
| GET | `/api/v1/owner/students` | List students |
| POST | `/api/v1/owner/students` | Create student |
| GET | `/api/v1/owner/students/{id}` | Get student |
| PUT | `/api/v1/owner/students/{id}` | Update student |
| DELETE | `/api/v1/owner/students/{id}` | Delete student |
| GET/POST/PUT/DELETE | `/api/v1/owner/classes` | Academic classes CRUD |
| GET/POST/PUT/DELETE | `/api/v1/owner/subjects` | Subjects CRUD |
| GET/POST/PUT/DELETE | `/api/v1/owner/batches` | Batches CRUD |
| GET | `/api/v1/owner/batches/{id}/students` | List batch students |
| POST | `/api/v1/owner/batches/{id}/students` | Add student to batch |
| DELETE | `/api/v1/owner/batches/{id}/students/{sId}` | Remove from batch |

---

## Definition of Done ✅

- [ ] Teacher/student creation is atomic (user + profile in one `db.commit()`)
- [ ] Default password is `Praksha@123` (hashed)
- [ ] All routes filter by `tenant_id` from JWT
- [ ] Owner from Tenant A cannot see Tenant B data (tested!)
- [ ] Website CMS settings saved and published correctly
- [ ] `pytest tests/test_owner/ -v` — all 25 tests PASS
- [ ] PR to `dev` with title: `feat(sprint-05): Tenant Setup APIs`
