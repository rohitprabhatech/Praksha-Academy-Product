"""Public catalog endpoints (no auth)."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.response import success_response
from app.services.course_service import CourseService

router = APIRouter(prefix="/public", tags=["Public Catalog"])
service = CourseService()


@router.get("/{tenant_slug}/courses")
def public_courses(tenant_slug: str, db: Session = Depends(get_db)):
    tenant_id = service.resolve_tenant_id(db, tenant_slug)
    return success_response(data=service.public_list_courses(db, tenant_id))


@router.get("/{tenant_slug}/courses/{slug}")
def public_course_detail(tenant_slug: str, slug: str, db: Session = Depends(get_db)):
    tenant_id = service.resolve_tenant_id(db, tenant_slug)
    return success_response(data=service.public_get_course(db, tenant_id, slug))


@router.get("/{tenant_slug}/programs")
def public_programs(tenant_slug: str, db: Session = Depends(get_db)):
    tenant_id = service.resolve_tenant_id(db, tenant_slug)
    return success_response(data=service.public_list_programs(db, tenant_id))
