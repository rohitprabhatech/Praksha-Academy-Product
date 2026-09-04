"""Owner API routers."""

from fastapi import APIRouter

from app.api.v1.owner import batches, classes, profile, students, subjects, teachers

owner_router = APIRouter()
owner_router.include_router(profile.router)
owner_router.include_router(teachers.router)
owner_router.include_router(students.router)
owner_router.include_router(classes.router)
owner_router.include_router(subjects.router)
owner_router.include_router(batches.router)
