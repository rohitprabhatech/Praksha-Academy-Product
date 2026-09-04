"""Owner CMS content and notifications."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.cms import (
    BlogPostCreate,
    BlogPostUpdate,
    FaqCreate,
    FaqUpdate,
    GalleryItemCreate,
    GalleryItemUpdate,
    NotificationCreate,
    ReplyRequest,
    TestimonialCreate,
    TestimonialUpdate,
)
from app.services.cms_service import CmsService
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/owner", tags=["Owner — CMS"])
service = CmsService()
notif_service = NotificationService()


@router.get("/blog")
def list_blog_posts(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.list_blog_posts(db, current_user.get("tenant_id"), status)
    )


@router.post("/blog")
def create_post(
    body: BlogPostCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_blog_post(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Post created")


@router.patch("/blog/{post_id}")
def update_post(
    post_id: str,
    body: BlogPostUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_blog_post(
        db, current_user.get("tenant_id"), post_id, body
    )
    return success_response(data=data, message="Post updated")


@router.post("/blog/{post_id}/publish")
def publish_post(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.publish_blog_post(db, current_user.get("tenant_id"), post_id)
    return success_response(data=data, message="Post published")


@router.get("/gallery")
def list_gallery(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.list_gallery(db, current_user.get("tenant_id"))
    )


@router.post("/gallery")
def create_gallery(
    body: GalleryItemCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_gallery_item(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Gallery item created")


@router.patch("/gallery/{item_id}")
def update_gallery(
    item_id: str,
    body: GalleryItemUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_gallery_item(
        db, current_user.get("tenant_id"), item_id, body
    )
    return success_response(data=data, message="Gallery item updated")


@router.get("/faqs")
def list_faqs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(data=service.list_faqs(db, current_user.get("tenant_id")))


@router.post("/faqs")
def create_faq(
    body: FaqCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_faq(db, current_user.get("tenant_id"), body)
    return success_response(data=data, message="FAQ created")


@router.patch("/faqs/{faq_id}")
def update_faq(
    faq_id: str,
    body: FaqUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_faq(db, current_user.get("tenant_id"), faq_id, body)
    return success_response(data=data, message="FAQ updated")


@router.get("/testimonials")
def list_testimonials(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.list_testimonials(db, current_user.get("tenant_id"))
    )


@router.post("/testimonials")
def create_testimonial(
    body: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.create_testimonial(db, current_user.get("tenant_id"), body)
    return success_response(data=data, message="Testimonial created")


@router.patch("/testimonials/{item_id}")
def update_testimonial(
    item_id: str,
    body: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.update_testimonial(
        db, current_user.get("tenant_id"), item_id, body
    )
    return success_response(data=data, message="Testimonial updated")


@router.get("/contact-messages")
def list_messages(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    return success_response(
        data=service.list_messages(db, current_user.get("tenant_id"), status)
    )


@router.patch("/contact-messages/{msg_id}/reply")
def reply_message(
    msg_id: str,
    body: ReplyRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = service.reply_to_message(
        db,
        current_user.get("tenant_id"),
        msg_id,
        body.reply_message,
        current_user["sub"],
    )
    return success_response(data=data, message="Reply sent")


@router.post("/notifications")
def create_notification(
    body: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_role("owner")),
):
    data = notif_service.create_and_send(
        db, current_user.get("tenant_id"), body, current_user["sub"]
    )
    return success_response(data=data, message="Notification sent")
