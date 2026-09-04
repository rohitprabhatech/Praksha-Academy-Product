"""Course catalog and curriculum business logic."""

from __future__ import annotations

import math
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import utcnow_naive
from app.models.course import CourseModule
from app.models.platform import Tenant
from app.repositories.course_repository import CourseRepository
from app.repositories.owner_repository import OwnerRepository
from app.schemas.courses import (
    AddCourseToProgramRequest,
    AssignTeacherRequest,
    ChapterCreate,
    ChapterUpdate,
    CourseCreate,
    CourseUpdate,
    LessonCreate,
    LessonUpdate,
    MaterialCreate,
    ModuleCreate,
    ModuleUpdate,
    ProgramCreate,
    ProgramUpdate,
)

repo = CourseRepository()
owner_repo = OwnerRepository()


class CourseService:
    def _require_tenant(self, tenant_id: Optional[str]) -> str:
        if not tenant_id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Tenant context required")
        return tenant_id

    def _paginate(self, total: int, page: int, per_page: int) -> dict:
        return {
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": math.ceil(total / per_page) if per_page else 1,
        }

    def _program_to_dict(self, program) -> dict:
        return {
            "id": program.id,
            "name": program.name,
            "slug": program.slug,
            "description": program.description,
            "thumbnail_url": program.thumbnail_url,
            "price": float(program.price),
            "discount_price": (
                float(program.discount_price) if program.discount_price is not None else None
            ),
            "duration_label": program.duration_label,
            "category": program.category,
            "is_featured": bool(program.is_featured),
            "status": program.status,
            "sort_order": program.sort_order,
        }

    def _course_to_dict(self, course) -> dict:
        return {
            "id": course.id,
            "name": course.name,
            "slug": course.slug,
            "academic_class_id": course.academic_class_id,
            "subject_id": course.subject_id,
            "category": course.category,
            "description": course.description,
            "thumbnail_url": course.thumbnail_url,
            "price": float(course.price),
            "discount_price": (
                float(course.discount_price) if course.discount_price is not None else None
            ),
            "duration_label": course.duration_label,
            "language": course.language,
            "course_type": course.course_type,
            "status": course.status,
            "is_featured": bool(course.is_featured),
            "created_at": str(course.created_at) if course.created_at else None,
        }

    # ─── PROGRAMS ─────────────────────────────────────────────────────────────

    def list_programs(
        self,
        db: Session,
        tenant_id: Optional[str],
        page: int,
        per_page: int,
        status: Optional[str],
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        items, total = repo.list_programs(db, tid, page, per_page, status)
        return {
            "items": [self._program_to_dict(p) for p in items],
            **self._paginate(total, page, per_page),
        }

    def create_program(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: ProgramCreate,
        created_by: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        slug = data.slug.strip().lower()
        if repo.get_program_by_slug(db, tid, slug):
            raise HTTPException(status.HTTP_409_CONFLICT, detail="Program slug already in use")
        payload = data.model_dump()
        payload["slug"] = slug
        payload["is_featured"] = 1 if data.is_featured else 0
        payload["created_by"] = created_by
        payload["status"] = "draft"
        program = repo.create_program(db, tid, payload)
        db.commit()
        return self._program_to_dict(program)

    def update_program(
        self,
        db: Session,
        program_id: str,
        tenant_id: Optional[str],
        data: ProgramUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        program = repo.get_program(db, program_id, tid)
        if not program:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Program not found")
        updates = data.model_dump(exclude_none=True)
        if "slug" in updates:
            updates["slug"] = updates["slug"].strip().lower()
            other = repo.get_program_by_slug(db, tid, updates["slug"])
            if other and other.id != program_id:
                raise HTTPException(status.HTTP_409_CONFLICT, detail="Program slug already in use")
        if "status" in updates and updates["status"] not in {
            "draft",
            "published",
            "archived",
        }:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid status")
        if "is_featured" in updates:
            updates["is_featured"] = 1 if updates["is_featured"] else 0
        for key, value in updates.items():
            setattr(program, key, value)
        db.commit()
        return self._program_to_dict(program)

    def add_course_to_program(
        self,
        db: Session,
        program_id: str,
        tenant_id: Optional[str],
        data: AddCourseToProgramRequest,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        if not repo.get_program(db, program_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Program not found")
        if not repo.get_course(db, data.course_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        row = repo.add_course_to_program(
            db, tid, program_id, data.course_id, data.sort_order
        )
        db.commit()
        return {
            "program_id": row.program_id,
            "course_id": row.course_id,
            "sort_order": row.sort_order,
        }

    # ─── COURSES ──────────────────────────────────────────────────────────────

    def list_courses(
        self,
        db: Session,
        tenant_id: Optional[str],
        page: int,
        per_page: int,
        status: Optional[str],
        category: Optional[str],
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        items, total = repo.list_courses(db, tid, page, per_page, status, category)
        return {
            "items": [self._course_to_dict(c) for c in items],
            **self._paginate(total, page, per_page),
        }

    def create_course(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: CourseCreate,
        created_by: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        slug = data.slug.strip().lower()
        if repo.get_course_by_slug(db, tid, slug):
            raise HTTPException(status.HTTP_409_CONFLICT, detail="Slug already in use")
        payload = data.model_dump()
        payload["slug"] = slug
        course = repo.create_course(db, tid, payload, created_by)
        db.commit()
        return self._course_to_dict(course)

    def get_course(
        self, db: Session, course_id: str, tenant_id: Optional[str]
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        course = repo.get_course(db, course_id, tid)
        if not course:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        return self._course_to_dict(course)

    def update_course(
        self,
        db: Session,
        course_id: str,
        tenant_id: Optional[str],
        data: CourseUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        course = repo.get_course(db, course_id, tid)
        if not course:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        updates = data.model_dump(exclude_none=True)
        if "slug" in updates:
            updates["slug"] = updates["slug"].strip().lower()
            other = repo.get_course_by_slug(db, tid, updates["slug"])
            if other and other.id != course_id:
                raise HTTPException(status.HTTP_409_CONFLICT, detail="Slug already in use")
        for key, value in updates.items():
            setattr(course, key, value)
        db.commit()
        return self._course_to_dict(course)

    def publish_course(
        self, db: Session, course_id: str, tenant_id: Optional[str]
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        course = repo.get_course(db, course_id, tid)
        if not course:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        course.status = "published"
        db.commit()
        return self._course_to_dict(course)

    def archive_course(
        self, db: Session, course_id: str, tenant_id: Optional[str]
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        course = repo.get_course(db, course_id, tid)
        if not course:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        course.status = "archived"
        db.commit()
        return self._course_to_dict(course)

    def delete_course(
        self, db: Session, course_id: str, tenant_id: Optional[str]
    ) -> None:
        tid = self._require_tenant(tenant_id)
        course = repo.get_course(db, course_id, tid)
        if not course:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        course.deleted_at = utcnow_naive()
        db.commit()

    def assign_teacher(
        self,
        db: Session,
        course_id: str,
        tenant_id: Optional[str],
        data: AssignTeacherRequest,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        if not repo.get_course(db, course_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        if not owner_repo.get_teacher(db, data.teacher_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Teacher not found")
        row = repo.assign_teacher(
            db, tid, course_id, data.teacher_id, data.is_primary, actor_id
        )
        db.commit()
        return {
            "course_id": row.course_id,
            "teacher_id": row.teacher_id,
            "is_primary": bool(row.is_primary),
        }

    # ─── CONTENT HIERARCHY ────────────────────────────────────────────────────

    def list_modules(
        self, db: Session, course_id: str, tenant_id: Optional[str]
    ) -> list[dict]:
        tid = self._require_tenant(tenant_id)
        if not repo.get_course(db, course_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        return [
            {
                "id": m.id,
                "title": m.title,
                "description": m.description,
                "sort_order": m.sort_order,
                "status": m.status,
            }
            for m in repo.list_modules(db, course_id, tid)
        ]

    def create_module(
        self,
        db: Session,
        course_id: str,
        tenant_id: Optional[str],
        data: ModuleCreate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        if not repo.get_course(db, course_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        module = repo.create_module(db, tid, course_id, data.model_dump())
        db.commit()
        return {
            "id": module.id,
            "title": module.title,
            "sort_order": module.sort_order,
            "status": module.status,
        }

    def update_module(
        self,
        db: Session,
        module_id: str,
        tenant_id: Optional[str],
        data: ModuleUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        module = repo.get_module(db, module_id, tid)
        if not module:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Module not found")
        updates = data.model_dump(exclude_none=True)
        for key, value in updates.items():
            setattr(module, key, value)
        db.commit()
        return {
            "id": module.id,
            "title": module.title,
            "sort_order": module.sort_order,
            "status": module.status,
        }

    def reorder_modules(
        self,
        db: Session,
        course_id: str,
        tenant_id: Optional[str],
        ordered_ids: list[str],
    ) -> None:
        tid = self._require_tenant(tenant_id)
        if not repo.get_course(db, course_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        for index, module_id in enumerate(ordered_ids):
            db.query(CourseModule).filter(
                CourseModule.id == module_id,
                CourseModule.course_id == course_id,
                CourseModule.tenant_id == tid,
            ).update({"sort_order": index})
        db.commit()

    def list_chapters(
        self, db: Session, module_id: str, tenant_id: Optional[str]
    ) -> list[dict]:
        tid = self._require_tenant(tenant_id)
        if not repo.get_module(db, module_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Module not found")
        return [
            {
                "id": c.id,
                "title": c.title,
                "description": c.description,
                "sort_order": c.sort_order,
                "status": c.status,
            }
            for c in repo.list_chapters(db, module_id, tid)
        ]

    def create_chapter(
        self,
        db: Session,
        module_id: str,
        tenant_id: Optional[str],
        data: ChapterCreate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        if not repo.get_module(db, module_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Module not found")
        chapter = repo.create_chapter(db, tid, module_id, data.model_dump())
        db.commit()
        return {
            "id": chapter.id,
            "title": chapter.title,
            "sort_order": chapter.sort_order,
        }

    def update_chapter(
        self,
        db: Session,
        chapter_id: str,
        tenant_id: Optional[str],
        data: ChapterUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        chapter = repo.get_chapter(db, chapter_id, tid)
        if not chapter:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Chapter not found")
        for key, value in data.model_dump(exclude_none=True).items():
            setattr(chapter, key, value)
        db.commit()
        return {
            "id": chapter.id,
            "title": chapter.title,
            "sort_order": chapter.sort_order,
            "status": chapter.status,
        }

    def create_lesson(
        self,
        db: Session,
        chapter_id: str,
        tenant_id: Optional[str],
        data: LessonCreate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        if not repo.get_chapter(db, chapter_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Chapter not found")
        if data.lesson_type not in {"video", "document", "text", "link", "mixed"}:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid lesson_type")
        lesson = repo.create_lesson(db, tid, chapter_id, data.model_dump())
        db.commit()
        return {
            "id": lesson.id,
            "title": lesson.title,
            "lesson_type": lesson.lesson_type,
            "is_free_preview": bool(lesson.is_free_preview),
            "sort_order": lesson.sort_order,
        }

    def update_lesson(
        self,
        db: Session,
        lesson_id: str,
        tenant_id: Optional[str],
        data: LessonUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        lesson = repo.get_lesson(db, lesson_id, tid)
        if not lesson:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Lesson not found")
        for key, value in data.model_dump(exclude_none=True).items():
            setattr(lesson, key, value)
        db.commit()
        return {
            "id": lesson.id,
            "title": lesson.title,
            "lesson_type": lesson.lesson_type,
            "is_free_preview": bool(lesson.is_free_preview),
            "status": lesson.status,
        }

    def list_lessons(
        self, db: Session, chapter_id: str, tenant_id: Optional[str]
    ) -> list[dict]:
        tid = self._require_tenant(tenant_id)
        if not repo.get_chapter(db, chapter_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Chapter not found")
        return [
            {
                "id": lesson.id,
                "title": lesson.title,
                "lesson_type": lesson.lesson_type,
                "duration_minutes": lesson.duration_minutes,
                "is_free_preview": bool(lesson.is_free_preview),
                "sort_order": lesson.sort_order,
                "status": lesson.status,
            }
            for lesson in repo.list_lessons(db, chapter_id, tid)
        ]

    def create_material(
        self,
        db: Session,
        course_id: str,
        tenant_id: Optional[str],
        data: MaterialCreate,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        if not repo.get_course(db, course_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        if data.material_type not in {"pdf", "notes", "ppt", "video", "document", "link"}:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid material_type")
        material = repo.create_material(
            db, tid, course_id, data.model_dump(), actor_id
        )
        db.commit()
        return {
            "id": material.id,
            "title": material.title,
            "material_type": material.material_type,
            "status": material.status,
        }

    def list_materials(
        self, db: Session, course_id: str, tenant_id: Optional[str]
    ) -> list[dict]:
        tid = self._require_tenant(tenant_id)
        if not repo.get_course(db, course_id, tid):
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        return [
            {
                "id": m.id,
                "title": m.title,
                "material_type": m.material_type,
                "file_url": m.file_url,
                "status": m.status,
            }
            for m in repo.list_materials(db, course_id, tid)
        ]

    # ─── PUBLIC ───────────────────────────────────────────────────────────────

    def resolve_tenant_id(self, db: Session, tenant_slug: str) -> str:
        tenant = (
            db.query(Tenant)
            .filter(
                Tenant.slug == tenant_slug,
                Tenant.status.in_(["trial", "active"]),
                Tenant.deleted_at.is_(None),
            )
            .first()
        )
        if not tenant:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Academy not found")
        return tenant.id

    def public_list_courses(self, db: Session, tenant_id: str) -> list[dict]:
        return [self._course_to_dict(c) for c in repo.list_published_courses(db, tenant_id)]

    def public_list_programs(self, db: Session, tenant_id: str) -> list[dict]:
        return [self._program_to_dict(p) for p in repo.list_published_programs(db, tenant_id)]

    def public_get_course(self, db: Session, tenant_id: str, slug: str) -> dict:
        course = repo.get_published_course_by_slug(db, tenant_id, slug)
        if not course:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Course not found")
        result = self._course_to_dict(course)
        result["modules"] = []
        for module in repo.list_modules(db, course.id, tenant_id):
            module_data = {
                "id": module.id,
                "title": module.title,
                "chapters": [],
            }
            for chapter in repo.list_chapters(db, module.id, tenant_id):
                chapter_data = {
                    "id": chapter.id,
                    "title": chapter.title,
                    "lessons": [
                        {
                            "id": lesson.id,
                            "title": lesson.title,
                            "lesson_type": lesson.lesson_type,
                            "duration_minutes": lesson.duration_minutes,
                            "is_free_preview": bool(lesson.is_free_preview),
                        }
                        for lesson in repo.list_lessons(db, chapter.id, tenant_id)
                    ],
                }
                module_data["chapters"].append(chapter_data)
            result["modules"].append(module_data)
        return result
