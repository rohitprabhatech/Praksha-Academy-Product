"""Public catalog and CMS endpoints (no auth)."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.response import success_response
from app.schemas.cms import ContactSubmitRequest
from app.schemas.finance import ValidateCouponRequest
from app.services.cms_service import CmsService
from app.services.course_service import CourseService
from app.services.finance_service import FinanceService

router = APIRouter(prefix="/public", tags=["Public Catalog"])
course_service = CourseService()
cms_service = CmsService()
finance_service = FinanceService()


@router.get("/{tenant_slug}/courses")
def public_courses(tenant_slug: str, db: Session = Depends(get_db)):
    tenant_id = course_service.resolve_tenant_id(db, tenant_slug)
    return success_response(data=course_service.public_list_courses(db, tenant_id))


@router.get("/{tenant_slug}/courses/{slug}")
def public_course_detail(tenant_slug: str, slug: str, db: Session = Depends(get_db)):
    tenant_id = course_service.resolve_tenant_id(db, tenant_slug)
    return success_response(data=course_service.public_get_course(db, tenant_id, slug))


@router.get("/{tenant_slug}/programs")
def public_programs(tenant_slug: str, db: Session = Depends(get_db)):
    tenant_id = course_service.resolve_tenant_id(db, tenant_slug)
    return success_response(data=course_service.public_list_programs(db, tenant_id))


@router.get("/{tenant_slug}/blog")
def public_blog(tenant_slug: str, db: Session = Depends(get_db)):
    tenant_id = course_service.resolve_tenant_id(db, tenant_slug)
    return success_response(
        data=cms_service.list_blog_posts(db, tenant_id, post_status="published")
    )


@router.get("/{tenant_slug}/gallery")
def public_gallery(tenant_slug: str, db: Session = Depends(get_db)):
    tenant_id = course_service.resolve_tenant_id(db, tenant_slug)
    return success_response(data=cms_service.list_gallery(db, tenant_id, active_only=True))


@router.get("/{tenant_slug}/faqs")
def public_faqs(tenant_slug: str, db: Session = Depends(get_db)):
    tenant_id = course_service.resolve_tenant_id(db, tenant_slug)
    return success_response(data=cms_service.list_faqs(db, tenant_id, active_only=True))


@router.get("/{tenant_slug}/testimonials")
def public_testimonials(tenant_slug: str, db: Session = Depends(get_db)):
    tenant_id = course_service.resolve_tenant_id(db, tenant_slug)
    return success_response(
        data=cms_service.list_testimonials(db, tenant_id, active_only=True)
    )


@router.post("/{tenant_slug}/contact")
def submit_contact(
    tenant_slug: str,
    body: ContactSubmitRequest,
    db: Session = Depends(get_db),
):
    tenant_id = course_service.resolve_tenant_id(db, tenant_slug)
    data = cms_service.submit_contact(db, tenant_id, body)
    return success_response(data=data, message="Thank you for contacting us")


@router.post("/{tenant_slug}/coupons/validate")
def validate_coupon(
    tenant_slug: str,
    body: ValidateCouponRequest,
    db: Session = Depends(get_db),
):
    tenant_id = course_service.resolve_tenant_id(db, tenant_slug)
    data = finance_service.validate_coupon(db, tenant_id, body.code, body.order_amount)
    return success_response(data=data)


@router.get("/certificates/{cert_number}")
def verify_certificate(cert_number: str, db: Session = Depends(get_db)):
    data = finance_service.verify_certificate(db, cert_number)
    return success_response(data=data)
