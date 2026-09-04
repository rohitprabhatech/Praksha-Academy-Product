"""Owner/Teacher — course modules, chapters, lessons, materials."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.courses import (
    ChapterCreate,
    ChapterUpdate,
    LessonCreate,
    LessonUpdate,
    MaterialCreate,
    ModuleCreate,
    ModuleUpdate,
    ReorderRequest,
)
from app.services.course_service import CourseService

router = APIRouter(tags=["Owner — Course Content"])
service = CourseService()


@router.get("/owner/courses/{course_id}/modules")
def list_modules(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    return success_response(
        data=service.list_modules(db, course_id, current_user.get("tenant_id"))
    )


@router.post("/owner/courses/{course_id}/modules")
def create_module(
    course_id: str,
    body: ModuleCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    data = service.create_module(db, course_id, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Module created")


@router.put("/owner/modules/{module_id}")
def update_module(
    module_id: str,
    body: ModuleUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    data = service.update_module(db, module_id, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Module updated")


@router.post("/owner/courses/{course_id}/modules/reorder")
def reorder_modules(
    course_id: str,
    body: ReorderRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    service.reorder_modules(
        db, course_id, current_user.get("tenant_id"), body.ordered_ids
    )
    return success_response(message="Modules reordered")


@router.get("/owner/modules/{module_id}/chapters")
def list_chapters(
    module_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    return success_response(
        data=service.list_chapters(db, module_id, current_user.get("tenant_id"))
    )


@router.post("/owner/modules/{module_id}/chapters")
def create_chapter(
    module_id: str,
    body: ChapterCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    data = service.create_chapter(db, module_id, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Chapter created")


@router.put("/owner/chapters/{chapter_id}")
def update_chapter(
    chapter_id: str,
    body: ChapterUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    data = service.update_chapter(db, chapter_id, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Chapter updated")


@router.get("/owner/chapters/{chapter_id}/lessons")
def list_lessons(
    chapter_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    return success_response(
        data=service.list_lessons(db, chapter_id, current_user.get("tenant_id"))
    )


@router.post("/owner/chapters/{chapter_id}/lessons")
def create_lesson(
    chapter_id: str,
    body: LessonCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    data = service.create_lesson(db, chapter_id, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Lesson created")


@router.put("/owner/lessons/{lesson_id}")
def update_lesson(
    lesson_id: str,
    body: LessonUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    data = service.update_lesson(db, lesson_id, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Lesson updated")


@router.get("/owner/courses/{course_id}/materials")
def list_materials(
    course_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    return success_response(
        data=service.list_materials(db, course_id, current_user.get("tenant_id"))
    )


@router.post("/owner/courses/{course_id}/materials")
def create_material(
    course_id: str,
    body: MaterialCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner", "teacher")),
):
    data = service.create_material(
        db, course_id, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Material created")
