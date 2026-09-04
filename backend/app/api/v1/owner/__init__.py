"""Owner API routers."""

from fastapi import APIRouter

from app.api.v1.owner import (
    batches,
    classes,
    cms,
    course_content,
    courses,
    enrollments,
    finance,
    profile,
    programs,
    students,
    subjects,
    teachers,
)

owner_router = APIRouter()
owner_router.include_router(profile.router)
owner_router.include_router(teachers.router)
owner_router.include_router(students.router)
owner_router.include_router(classes.router)
owner_router.include_router(subjects.router)
owner_router.include_router(batches.router)
owner_router.include_router(programs.router)
owner_router.include_router(courses.router)
owner_router.include_router(course_content.router)
owner_router.include_router(enrollments.router)
owner_router.include_router(finance.router)
owner_router.include_router(cms.router)
