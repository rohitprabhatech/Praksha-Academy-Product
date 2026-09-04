"""API v1 router aggregation."""

from fastapi import APIRouter

from app.api.v1 import auth, public
from app.api.v1.endpoints import health
from app.api.v1.owner import owner_router
from app.api.v1.platform import platform_router
from app.api.v1.student.finance import router as student_finance_router
from app.api.v1.student.lms import router as student_lms_router
from app.api.v1.student.notifications import router as student_notif_router
from app.api.v1.teacher.lms import router as teacher_lms_router

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(platform_router)
api_router.include_router(owner_router)
api_router.include_router(public.router)
api_router.include_router(student_lms_router)
api_router.include_router(student_finance_router)
api_router.include_router(student_notif_router)
api_router.include_router(teacher_lms_router)
