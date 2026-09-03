# SPRINT 06 — Course & Content APIs
**Project:** Praksha Academy SaaS
**Developer:** _(assign name here)_
**Branch:** `feature/sprint-06-courses`
**Base Branch:** `dev`
**Estimated Time:** 8–10 working days
**Depends on:** Sprint 03 + Sprint 05 merged to `dev`

---

## What Is This Sprint About?

The owner and teacher manage the course catalog. Students browse published courses. This sprint builds:

1. **Programs** — multi-course bundles (e.g. "Full Stack 6-Month Program")
2. **Courses** — individual courses with price, status, thumbnail
3. **Course Structure** — Modules → Chapters → Lessons (hierarchy)
4. **Teacher Assignment** — which teachers teach which courses
5. **Study Materials** — files/links attached to a course
6. **Public Catalog** — unauthenticated endpoints for the tenant's public website

---

## Course Hierarchy

```
Course
  └── Module (e.g. "Introduction")
        └── Chapter (e.g. "Chapter 1: Basics")
              └── Lesson (e.g. "Lesson 1: What is Python?")
```

---

## Step 1 — Create Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feature/sprint-06-courses
```

---

## Step 2 — Schemas (`app/schemas/courses.py`)

```python
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ─── PROGRAMS ─────────────────────────────────────────────────────────────────

class ProgramCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: float = 0.0
    discount_price: Optional[float] = None
    duration_label: Optional[str] = None   # e.g. "6 Months"
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
    status: Optional[str] = None   # draft | published | archived

class AddCourseToProgramRequest(BaseModel):
    course_id: str
    sort_order: int = 0


# ─── COURSES ──────────────────────────────────────────────────────────────────

class CourseCreate(BaseModel):
    name: str
    slug: str
    academic_class_id: Optional[str] = None
    subject_id: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: float = 0.0
    discount_price: Optional[float] = None
    duration_label: Optional[str] = None
    language: str = "English"
    course_type: Optional[str] = None   # online | offline | hybrid
    is_featured: bool = False

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
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
    teacher_id: str       # teacher_profiles.id
    is_primary: bool = False


# ─── COURSE MODULES ───────────────────────────────────────────────────────────

class ModuleCreate(BaseModel):
    title: str
    description: Optional[str] = None
    sort_order: int = 0

class ModuleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None   # active | inactive

class ReorderRequest(BaseModel):
    ordered_ids: List[str]   # list of IDs in new order


# ─── COURSE CHAPTERS ──────────────────────────────────────────────────────────

class ChapterCreate(BaseModel):
    title: str
    description: Optional[str] = None
    sort_order: int = 0

class ChapterUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None


# ─── COURSE LESSONS ───────────────────────────────────────────────────────────

class LessonCreate(BaseModel):
    title: str
    lesson_type: str = "text"   # video | document | text | link | mixed
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


# ─── STUDY MATERIALS ──────────────────────────────────────────────────────────

class MaterialCreate(BaseModel):
    title: str
    material_type: str    # pdf | notes | ppt | video | document | link
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    description: Optional[str] = None
    batch_id: Optional[str] = None

class MaterialUpdate(BaseModel):
    title: Optional[str] = None
    file_url: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None   # draft | published | archived
```

---

## Step 3 — Repository (`app/repositories/course_repository.py`)

```python
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from app.models.course import Course, CourseTeacher, CourseModule, CourseChapter, CourseLesson
from app.models.programs import Program, ProgramCourse
from app.models.learning import StudyMaterial
from app.utils.ids import new_uuid


class CourseRepository:

    # ─── PROGRAMS ─────────────────────────────────────────────────────────────

    def list_programs(self, db: Session, tenant_id: str, page: int,
                      per_page: int, status: Optional[str]) -> tuple[list, int]:
        q = db.query(Program).filter(
            Program.tenant_id == tenant_id,
            Program.deleted_at == None
        )
        if status:
            q = q.filter(Program.status == status)
        total = q.count()
        items = q.order_by(Program.sort_order).offset((page-1)*per_page).limit(per_page).all()
        return items, total

    def get_program(self, db: Session, program_id: str, tenant_id: str) -> Optional[Program]:
        return db.query(Program).filter(
            Program.id == program_id,
            Program.tenant_id == tenant_id,
            Program.deleted_at == None
        ).first()

    def create_program(self, db: Session, tenant_id: str, data: dict) -> Program:
        p = Program(id=new_uuid(), tenant_id=tenant_id, **data)
        db.add(p)
        db.flush()
        return p

    # ─── COURSES ──────────────────────────────────────────────────────────────

    def list_courses(self, db: Session, tenant_id: str, page: int,
                     per_page: int, status: Optional[str],
                     category: Optional[str]) -> tuple[list, int]:
        q = db.query(Course).filter(
            Course.tenant_id == tenant_id,
            Course.deleted_at == None
        )
        if status:
            q = q.filter(Course.status == status)
        if category:
            q = q.filter(Course.category == category)
        total = q.count()
        items = q.order_by(Course.created_at.desc()).offset((page-1)*per_page).limit(per_page).all()
        return items, total

    def get_course(self, db: Session, course_id: str, tenant_id: str) -> Optional[Course]:
        return db.query(Course).filter(
            Course.id == course_id,
            Course.tenant_id == tenant_id,
            Course.deleted_at == None
        ).first()

    def create_course(self, db: Session, tenant_id: str, data: dict,
                      created_by: str) -> Course:
        c = Course(id=new_uuid(), tenant_id=tenant_id, created_by=created_by, **data)
        db.add(c)
        db.flush()
        return c

    def get_modules(self, db: Session, course_id: str, tenant_id: str) -> list:
        return db.query(CourseModule).filter(
            CourseModule.course_id == course_id,
            CourseModule.tenant_id == tenant_id,
            CourseModule.deleted_at == None
        ).order_by(CourseModule.sort_order).all()

    def create_module(self, db: Session, tenant_id: str,
                      course_id: str, data: dict) -> CourseModule:
        m = CourseModule(id=new_uuid(), tenant_id=tenant_id,
                         course_id=course_id, **data)
        db.add(m)
        db.flush()
        return m

    def get_chapters(self, db: Session, module_id: str, tenant_id: str) -> list:
        return db.query(CourseChapter).filter(
            CourseChapter.module_id == module_id,
            CourseChapter.tenant_id == tenant_id,
            CourseChapter.deleted_at == None
        ).order_by(CourseChapter.sort_order).all()

    def get_lessons(self, db: Session, chapter_id: str, tenant_id: str) -> list:
        return db.query(CourseLesson).filter(
            CourseLesson.chapter_id == chapter_id,
            CourseLesson.tenant_id == tenant_id,
            CourseLesson.deleted_at == None
        ).order_by(CourseLesson.sort_order).all()

    # ─── PUBLIC ───────────────────────────────────────────────────────────────

    def list_published_courses(self, db: Session, tenant_id: str) -> list:
        return db.query(Course).filter(
            Course.tenant_id == tenant_id,
            Course.status == "published",
            Course.deleted_at == None
        ).all()

    def get_published_course_by_slug(self, db: Session, tenant_id: str,
                                     slug: str) -> Optional[Course]:
        return db.query(Course).filter(
            Course.tenant_id == tenant_id,
            Course.slug == slug,
            Course.status == "published",
            Course.deleted_at == None
        ).first()
```

---

## Step 4 — Service (`app/services/course_service.py`)

Key rules:
1. Only owner can create/delete courses
2. Teacher can only view courses assigned to them
3. Published courses appear on public catalog; draft/archived do NOT
4. Slug must be unique per tenant — check before creating
5. Reorder = update `sort_order` field for each item in the given list

```python
import math
from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.course_repository import CourseRepository
from app.schemas.courses import (
    ProgramCreate, ProgramUpdate, CourseCreate, CourseUpdate,
    ModuleCreate, ModuleUpdate, ChapterCreate, LessonCreate,
    MaterialCreate
)
from app.utils.ids import new_uuid
from datetime import datetime

repo = CourseRepository()


class CourseService:

    def _paginate(self, total, page, per_page) -> dict:
        return {"total": total, "page": page, "per_page": per_page,
                "pages": math.ceil(total / per_page) if per_page else 1}

    def _course_to_dict(self, c) -> dict:
        return {
            "id": c.id, "name": c.name, "slug": c.slug,
            "category": c.category, "description": c.description,
            "thumbnail_url": c.thumbnail_url, "price": float(c.price),
            "discount_price": float(c.discount_price) if c.discount_price else None,
            "duration_label": c.duration_label, "language": c.language,
            "course_type": c.course_type, "status": c.status,
            "is_featured": bool(c.is_featured), "created_at": str(c.created_at),
        }

    # ─── PROGRAMS ─────────────────────────────────────────────────────────────

    def list_programs(self, db: Session, tenant_id: str, page: int,
                      per_page: int, status: Optional[str]) -> dict:
        items, total = repo.list_programs(db, tenant_id, page, per_page, status)
        return {"items": [self._program_to_dict(p) for p in items],
                **self._paginate(total, page, per_page)}

    def create_program(self, db: Session, tenant_id: str,
                       data: ProgramCreate, created_by: str) -> dict:
        program = repo.create_program(db, tenant_id, {
            **data.model_dump(), "created_by": created_by
        })
        db.commit()
        return self._program_to_dict(program)

    def _program_to_dict(self, p) -> dict:
        return {
            "id": p.id, "name": p.name, "slug": p.slug,
            "price": float(p.price), "status": p.status,
            "is_featured": bool(p.is_featured), "category": p.category,
        }

    # ─── COURSES ──────────────────────────────────────────────────────────────

    def list_courses(self, db: Session, tenant_id: str, page: int,
                     per_page: int, status: Optional[str],
                     category: Optional[str]) -> dict:
        items, total = repo.list_courses(db, tenant_id, page, per_page, status, category)
        return {"items": [self._course_to_dict(c) for c in items],
                **self._paginate(total, page, per_page)}

    def create_course(self, db: Session, tenant_id: str,
                      data: CourseCreate, created_by: str) -> dict:
        # Check slug unique in tenant
        existing = db.query(__import__('app.models.course', fromlist=['Course']).Course).filter_by(
            tenant_id=tenant_id, slug=data.slug
        ).first()
        if existing:
            raise HTTPException(status.HTTP_409_CONFLICT, "Slug already in use")
        course = repo.create_course(db, tenant_id, data.model_dump(), created_by)
        db.commit()
        return self._course_to_dict(course)

    def get_course(self, db: Session, course_id: str, tenant_id: str) -> dict:
        c = repo.get_course(db, course_id, tenant_id)
        if not c:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course not found")
        return self._course_to_dict(c)

    def update_course(self, db: Session, course_id: str, tenant_id: str,
                      data: CourseUpdate) -> dict:
        c = repo.get_course(db, course_id, tenant_id)
        if not c:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course not found")
        for k, v in data.model_dump(exclude_none=True).items():
            setattr(c, k, v)
        db.commit()
        return self._course_to_dict(c)

    def publish_course(self, db: Session, course_id: str, tenant_id: str) -> dict:
        c = repo.get_course(db, course_id, tenant_id)
        if not c:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course not found")
        c.status = "published"
        db.commit()
        return self._course_to_dict(c)

    def archive_course(self, db: Session, course_id: str, tenant_id: str) -> dict:
        c = repo.get_course(db, course_id, tenant_id)
        if not c:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course not found")
        c.status = "archived"
        db.commit()
        return self._course_to_dict(c)

    def delete_course(self, db: Session, course_id: str, tenant_id: str) -> None:
        c = repo.get_course(db, course_id, tenant_id)
        if not c:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course not found")
        c.deleted_at = datetime.utcnow()
        db.commit()

    # ─── MODULES ──────────────────────────────────────────────────────────────

    def list_modules(self, db: Session, course_id: str, tenant_id: str) -> list:
        # verify course belongs to tenant
        if not repo.get_course(db, course_id, tenant_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course not found")
        modules = repo.get_modules(db, course_id, tenant_id)
        return [{"id": m.id, "title": m.title, "sort_order": m.sort_order,
                 "status": m.status} for m in modules]

    def create_module(self, db: Session, course_id: str, tenant_id: str,
                      data: ModuleCreate) -> dict:
        if not repo.get_course(db, course_id, tenant_id):
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course not found")
        m = repo.create_module(db, tenant_id, course_id, data.model_dump())
        db.commit()
        return {"id": m.id, "title": m.title, "sort_order": m.sort_order}

    def reorder_modules(self, db: Session, course_id: str, tenant_id: str,
                        ordered_ids: list[str]) -> None:
        from app.models.course import CourseModule
        for index, module_id in enumerate(ordered_ids):
            db.query(CourseModule).filter(
                CourseModule.id == module_id,
                CourseModule.course_id == course_id,
                CourseModule.tenant_id == tenant_id
            ).update({"sort_order": index})
        db.commit()

    # ─── PUBLIC CATALOG ───────────────────────────────────────────────────────

    def public_list_courses(self, db: Session, tenant_id: str) -> list:
        items = repo.list_published_courses(db, tenant_id)
        return [self._course_to_dict(c) for c in items]

    def public_get_course(self, db: Session, tenant_id: str, slug: str) -> dict:
        c = repo.get_published_course_by_slug(db, tenant_id, slug)
        if not c:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Course not found")
        # Include modules (published) in the public detail
        modules = repo.get_modules(db, c.id, tenant_id)
        result = self._course_to_dict(c)
        result["modules"] = []
        for m in modules:
            chapters = repo.get_chapters(db, m.id, tenant_id)
            module_data = {"id": m.id, "title": m.title, "chapters": []}
            for ch in chapters:
                lessons = repo.get_lessons(db, ch.id, tenant_id)
                chapter_data = {
                    "id": ch.id,
                    "title": ch.title,
                    "lessons": [
                        {"id": l.id, "title": l.title,
                         "lesson_type": l.lesson_type,
                         "duration_minutes": l.duration_minutes,
                         "is_free_preview": bool(l.is_free_preview)}
                        for l in lessons
                    ]
                }
                module_data["chapters"].append(chapter_data)
            result["modules"].append(module_data)
        return result
```

---

## Step 5 — Route Handlers

### `app/api/v1/owner/programs.py`

```python
from fastapi import APIRouter, Depends
from typing import Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.courses import ProgramCreate, ProgramUpdate, AddCourseToProgramRequest
from app.services.course_service import CourseService

router = APIRouter(prefix="/owner/programs", tags=["Owner — Programs"])
service = CourseService()


@router.get("")
def list_programs(page: int = 1, per_page: int = 20,
                  status: Optional[str] = None,
                  db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("owner"))):
    data = service.list_programs(db, current_user["tenant_id"], page, per_page, status)
    return success_response(data=data)


@router.post("")
def create_program(body: ProgramCreate, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("owner"))):
    data = service.create_program(db, current_user["tenant_id"], body, current_user["sub"])
    return success_response(data=data, message="Program created")
```

### `app/api/v1/owner/courses.py`

```python
from fastapi import APIRouter, Depends
from typing import Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.courses import CourseCreate, CourseUpdate
from app.services.course_service import CourseService

router = APIRouter(prefix="/owner/courses", tags=["Owner — Courses"])
service = CourseService()


@router.get("")
def list_courses(page: int = 1, per_page: int = 20,
                 status: Optional[str] = None, category: Optional[str] = None,
                 db: Session = Depends(get_db),
                 current_user: dict = Depends(require_role("owner"))):
    data = service.list_courses(db, current_user["tenant_id"], page, per_page,
                                status, category)
    return success_response(data=data)


@router.post("")
def create_course(body: CourseCreate, db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("owner"))):
    data = service.create_course(db, current_user["tenant_id"], body, current_user["sub"])
    return success_response(data=data, message="Course created")


@router.get("/{course_id}")
def get_course(course_id: str, db: Session = Depends(get_db),
               current_user: dict = Depends(require_role("owner", "teacher"))):
    data = service.get_course(db, course_id, current_user["tenant_id"])
    return success_response(data=data)


@router.put("/{course_id}")
def update_course(course_id: str, body: CourseUpdate,
                  db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("owner"))):
    data = service.update_course(db, course_id, current_user["tenant_id"], body)
    return success_response(data=data, message="Course updated")


@router.post("/{course_id}/publish")
def publish_course(course_id: str, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("owner"))):
    data = service.publish_course(db, course_id, current_user["tenant_id"])
    return success_response(data=data, message="Course published")


@router.post("/{course_id}/archive")
def archive_course(course_id: str, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("owner"))):
    data = service.archive_course(db, course_id, current_user["tenant_id"])
    return success_response(data=data, message="Course archived")


@router.delete("/{course_id}")
def delete_course(course_id: str, db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("owner"))):
    service.delete_course(db, course_id, current_user["tenant_id"])
    return success_response(message="Course deleted")
```

### `app/api/v1/public.py` (Public Catalog — No Auth)

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.response import success_response
from app.services.course_service import CourseService
from app.models.platform import Tenant

router = APIRouter(prefix="/public", tags=["Public Catalog"])
service = CourseService()


def _get_tenant_id(db: Session, tenant_slug: str) -> str:
    tenant = db.query(Tenant).filter(
        Tenant.slug == tenant_slug,
        Tenant.status.in_(["trial", "active"]),
        Tenant.deleted_at == None
    ).first()
    if not tenant:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Academy not found")
    return tenant.id


@router.get("/{tenant_slug}/courses")
def public_courses(tenant_slug: str, db: Session = Depends(get_db)):
    tenant_id = _get_tenant_id(db, tenant_slug)
    data = service.public_list_courses(db, tenant_id)
    return success_response(data=data)


@router.get("/{tenant_slug}/courses/{slug}")
def public_course_detail(tenant_slug: str, slug: str,
                          db: Session = Depends(get_db)):
    tenant_id = _get_tenant_id(db, tenant_slug)
    data = service.public_get_course(db, tenant_id, slug)
    return success_response(data=data)
```

---

## Step 6 — Course Modules/Chapters/Lessons Routes

Create `app/api/v1/owner/content.py`:

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.courses import (
    ModuleCreate, ModuleUpdate, ChapterCreate, ChapterUpdate,
    LessonCreate, LessonUpdate, ReorderRequest
)
from app.services.course_service import CourseService

router = APIRouter(tags=["Owner — Course Content"])
service = CourseService()

owner_or_teacher = Depends(require_role("owner", "teacher"))


# MODULES
@router.get("/owner/courses/{course_id}/modules", dependencies=[owner_or_teacher])
def list_modules(course_id: str, db: Session = Depends(get_db),
                 current_user: dict = Depends(require_role("owner", "teacher"))):
    return success_response(data=service.list_modules(db, course_id, current_user["tenant_id"]))


@router.post("/owner/courses/{course_id}/modules")
def create_module(course_id: str, body: ModuleCreate, db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("owner", "teacher"))):
    data = service.create_module(db, course_id, current_user["tenant_id"], body)
    return success_response(data=data, message="Module created")


@router.post("/owner/courses/{course_id}/modules/reorder")
def reorder_modules(course_id: str, body: ReorderRequest,
                    db: Session = Depends(get_db),
                    current_user: dict = Depends(require_role("owner", "teacher"))):
    service.reorder_modules(db, course_id, current_user["tenant_id"], body.ordered_ids)
    return success_response(message="Modules reordered")


# CHAPTERS — build similarly
# LESSONS — build similarly
```

---

## Step 7 — Tests

Create `tests/test_courses/`:

1. Create program ✅
2. Create course with unique slug ✅
3. Duplicate slug returns 409 ✅
4. List courses (paginated) ✅
5. Publish course changes status to "published" ✅
6. Archive course ✅
7. Draft course NOT in public catalog ✅
8. Published course IS in public catalog ✅
9. Public catalog by tenant_slug works ✅
10. Invalid tenant_slug returns 404 ✅
11. Create module for course ✅
12. List modules in sort order ✅
13. Reorder modules ✅
14. Create chapter under module ✅
15. Create lesson under chapter ✅
16. Teacher can view courses assigned to them ✅
17. Teacher cannot view courses not assigned ✅
18. Delete course (soft delete) ✅
19. Deleted course not in listing ✅
20. Public course detail includes modules/chapters/lessons ✅

Minimum: **20 tests**.

---

## API Summary Table

| Method | Endpoint | Who | Description |
|--------|----------|-----|-------------|
| GET | `/owner/programs` | Owner | List programs |
| POST | `/owner/programs` | Owner | Create program |
| GET | `/owner/courses` | Owner | List courses |
| POST | `/owner/courses` | Owner | Create course |
| GET | `/owner/courses/{id}` | Owner/Teacher | Course detail |
| PUT | `/owner/courses/{id}` | Owner | Update course |
| POST | `/owner/courses/{id}/publish` | Owner | Publish |
| POST | `/owner/courses/{id}/archive` | Owner | Archive |
| DELETE | `/owner/courses/{id}` | Owner | Delete |
| GET | `/owner/courses/{id}/modules` | Owner/Teacher | List modules |
| POST | `/owner/courses/{id}/modules` | Owner/Teacher | Create module |
| POST | `/owner/courses/{id}/modules/reorder` | Owner/Teacher | Reorder |
| GET/POST | `/modules/{id}/chapters` | Owner/Teacher | Chapters CRUD |
| GET/POST | `/chapters/{id}/lessons` | Owner/Teacher | Lessons CRUD |
| GET | `/public/{slug}/courses` | Anyone | Public courses |
| GET | `/public/{slug}/courses/{slug}` | Anyone | Course detail |
| GET | `/public/{slug}/programs` | Anyone | Programs |

---

## Definition of Done ✅

- [ ] Draft courses NOT visible in public catalog
- [ ] Slug is unique per tenant (409 returned if duplicate)
- [ ] Module/chapter/lesson hierarchy works correctly
- [ ] Reorder works (sort_order updated in DB)
- [ ] Teacher can only view their assigned courses
- [ ] `pytest tests/test_courses/ -v` — all 20 tests PASS
- [ ] PR to `dev` with title: `feat(sprint-06): Course & Content APIs`
