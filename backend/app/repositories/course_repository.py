"""Course / program / curriculum repository."""

from __future__ import annotations

from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import utcnow_naive
from app.models.course import (
    Course,
    CourseChapter,
    CourseLesson,
    CourseModule,
    CourseTeacher,
)
from app.models.learning import StudyMaterial
from app.models.programs import Program, ProgramCourse
from app.utils.ids import new_uuid


class CourseRepository:
    def list_programs(
        self,
        db: Session,
        tenant_id: str,
        page: int,
        per_page: int,
        status: Optional[str],
    ) -> tuple[list[Program], int]:
        query = db.query(Program).filter(
            Program.tenant_id == tenant_id,
            Program.deleted_at.is_(None),
        )
        if status:
            query = query.filter(Program.status == status)
        total = query.count()
        items = (
            query.order_by(Program.sort_order, Program.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )
        return items, total

    def get_program(
        self, db: Session, program_id: str, tenant_id: str
    ) -> Optional[Program]:
        return (
            db.query(Program)
            .filter(
                Program.id == program_id,
                Program.tenant_id == tenant_id,
                Program.deleted_at.is_(None),
            )
            .first()
        )

    def get_program_by_slug(
        self, db: Session, tenant_id: str, slug: str
    ) -> Optional[Program]:
        return (
            db.query(Program)
            .filter(
                Program.tenant_id == tenant_id,
                Program.slug == slug,
                Program.deleted_at.is_(None),
            )
            .first()
        )

    def create_program(self, db: Session, tenant_id: str, data: dict) -> Program:
        program = Program(id=new_uuid(), tenant_id=tenant_id, **data)
        db.add(program)
        db.flush()
        return program

    def list_courses(
        self,
        db: Session,
        tenant_id: str,
        page: int,
        per_page: int,
        status: Optional[str],
        category: Optional[str],
    ) -> tuple[list[Course], int]:
        query = db.query(Course).filter(
            Course.tenant_id == tenant_id,
            Course.deleted_at.is_(None),
        )
        if status:
            query = query.filter(Course.status == status)
        if category:
            query = query.filter(Course.category == category)
        total = query.count()
        items = (
            query.order_by(Course.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )
        return items, total

    def get_course(self, db: Session, course_id: str, tenant_id: str) -> Optional[Course]:
        return (
            db.query(Course)
            .filter(
                Course.id == course_id,
                Course.tenant_id == tenant_id,
                Course.deleted_at.is_(None),
            )
            .first()
        )

    def get_course_by_slug(
        self, db: Session, tenant_id: str, slug: str
    ) -> Optional[Course]:
        return (
            db.query(Course)
            .filter(
                Course.tenant_id == tenant_id,
                Course.slug == slug,
                Course.deleted_at.is_(None),
            )
            .first()
        )

    def create_course(
        self, db: Session, tenant_id: str, data: dict, created_by: str
    ) -> Course:
        course = Course(
            id=new_uuid(),
            tenant_id=tenant_id,
            created_by=created_by,
            **data,
        )
        db.add(course)
        db.flush()
        return course

    def list_modules(
        self, db: Session, course_id: str, tenant_id: str
    ) -> list[CourseModule]:
        return (
            db.query(CourseModule)
            .filter(
                CourseModule.course_id == course_id,
                CourseModule.tenant_id == tenant_id,
                CourseModule.deleted_at.is_(None),
            )
            .order_by(CourseModule.sort_order)
            .all()
        )

    def get_module(
        self, db: Session, module_id: str, tenant_id: str
    ) -> Optional[CourseModule]:
        return (
            db.query(CourseModule)
            .filter(
                CourseModule.id == module_id,
                CourseModule.tenant_id == tenant_id,
                CourseModule.deleted_at.is_(None),
            )
            .first()
        )

    def create_module(
        self, db: Session, tenant_id: str, course_id: str, data: dict
    ) -> CourseModule:
        module = CourseModule(
            id=new_uuid(),
            tenant_id=tenant_id,
            course_id=course_id,
            **data,
        )
        db.add(module)
        db.flush()
        return module

    def list_chapters(
        self, db: Session, module_id: str, tenant_id: str
    ) -> list[CourseChapter]:
        return (
            db.query(CourseChapter)
            .filter(
                CourseChapter.module_id == module_id,
                CourseChapter.tenant_id == tenant_id,
                CourseChapter.deleted_at.is_(None),
            )
            .order_by(CourseChapter.sort_order)
            .all()
        )

    def get_chapter(
        self, db: Session, chapter_id: str, tenant_id: str
    ) -> Optional[CourseChapter]:
        return (
            db.query(CourseChapter)
            .filter(
                CourseChapter.id == chapter_id,
                CourseChapter.tenant_id == tenant_id,
                CourseChapter.deleted_at.is_(None),
            )
            .first()
        )

    def create_chapter(
        self, db: Session, tenant_id: str, module_id: str, data: dict
    ) -> CourseChapter:
        chapter = CourseChapter(
            id=new_uuid(),
            tenant_id=tenant_id,
            module_id=module_id,
            **data,
        )
        db.add(chapter)
        db.flush()
        return chapter

    def list_lessons(
        self, db: Session, chapter_id: str, tenant_id: str
    ) -> list[CourseLesson]:
        return (
            db.query(CourseLesson)
            .filter(
                CourseLesson.chapter_id == chapter_id,
                CourseLesson.tenant_id == tenant_id,
                CourseLesson.deleted_at.is_(None),
            )
            .order_by(CourseLesson.sort_order)
            .all()
        )

    def get_lesson(
        self, db: Session, lesson_id: str, tenant_id: str
    ) -> Optional[CourseLesson]:
        return (
            db.query(CourseLesson)
            .filter(
                CourseLesson.id == lesson_id,
                CourseLesson.tenant_id == tenant_id,
                CourseLesson.deleted_at.is_(None),
            )
            .first()
        )

    def create_lesson(
        self, db: Session, tenant_id: str, chapter_id: str, data: dict
    ) -> CourseLesson:
        lesson = CourseLesson(
            id=new_uuid(),
            tenant_id=tenant_id,
            chapter_id=chapter_id,
            **data,
        )
        db.add(lesson)
        db.flush()
        return lesson

    def assign_teacher(
        self,
        db: Session,
        tenant_id: str,
        course_id: str,
        teacher_id: str,
        is_primary: bool,
        assigned_by: str,
    ) -> CourseTeacher:
        existing = (
            db.query(CourseTeacher)
            .filter(
                CourseTeacher.tenant_id == tenant_id,
                CourseTeacher.course_id == course_id,
                CourseTeacher.teacher_id == teacher_id,
            )
            .first()
        )
        if existing:
            existing.is_primary = is_primary
            existing.assigned_by = assigned_by
            db.flush()
            return existing
        row = CourseTeacher(
            id=new_uuid(),
            tenant_id=tenant_id,
            course_id=course_id,
            teacher_id=teacher_id,
            is_primary=is_primary,
            assigned_by=assigned_by,
        )
        db.add(row)
        db.flush()
        return row

    def add_course_to_program(
        self,
        db: Session,
        tenant_id: str,
        program_id: str,
        course_id: str,
        sort_order: int,
    ) -> ProgramCourse:
        existing = (
            db.query(ProgramCourse)
            .filter(
                ProgramCourse.tenant_id == tenant_id,
                ProgramCourse.program_id == program_id,
                ProgramCourse.course_id == course_id,
            )
            .first()
        )
        if existing:
            existing.sort_order = sort_order
            db.flush()
            return existing
        row = ProgramCourse(
            id=new_uuid(),
            tenant_id=tenant_id,
            program_id=program_id,
            course_id=course_id,
            sort_order=sort_order,
            created_at=utcnow_naive(),
        )
        db.add(row)
        db.flush()
        return row

    def list_published_courses(self, db: Session, tenant_id: str) -> list[Course]:
        return (
            db.query(Course)
            .filter(
                Course.tenant_id == tenant_id,
                Course.status == "published",
                Course.deleted_at.is_(None),
            )
            .order_by(Course.is_featured.desc(), Course.created_at.desc())
            .all()
        )

    def get_published_course_by_slug(
        self, db: Session, tenant_id: str, slug: str
    ) -> Optional[Course]:
        return (
            db.query(Course)
            .filter(
                Course.tenant_id == tenant_id,
                Course.slug == slug,
                Course.status == "published",
                Course.deleted_at.is_(None),
            )
            .first()
        )

    def list_published_programs(self, db: Session, tenant_id: str) -> list[Program]:
        return (
            db.query(Program)
            .filter(
                Program.tenant_id == tenant_id,
                Program.status == "published",
                Program.deleted_at.is_(None),
            )
            .order_by(Program.sort_order)
            .all()
        )

    def create_material(
        self, db: Session, tenant_id: str, course_id: str, data: dict, uploaded_by: str
    ) -> StudyMaterial:
        material = StudyMaterial(
            id=new_uuid(),
            tenant_id=tenant_id,
            course_id=course_id,
            uploaded_by=uploaded_by,
            **data,
        )
        db.add(material)
        db.flush()
        return material

    def list_materials(
        self, db: Session, course_id: str, tenant_id: str
    ) -> list[StudyMaterial]:
        return (
            db.query(StudyMaterial)
            .filter(
                StudyMaterial.course_id == course_id,
                StudyMaterial.tenant_id == tenant_id,
                StudyMaterial.deleted_at.is_(None),
            )
            .order_by(StudyMaterial.created_at.desc())
            .all()
        )
