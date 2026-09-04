"""Blog, gallery, FAQ, testimonials, and contact messages."""

from __future__ import annotations

from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import utcnow_naive
from app.models.cms import BlogPost, ContactMessage, Faq, GalleryItem, Testimonial
from app.schemas.cms import (
    BlogPostCreate,
    BlogPostUpdate,
    ContactSubmitRequest,
    FaqCreate,
    FaqUpdate,
    GalleryItemCreate,
    GalleryItemUpdate,
    TestimonialCreate,
    TestimonialUpdate,
)
from app.utils.ids import new_uuid


class CmsService:
    def _require_tenant(self, tenant_id: Optional[str]) -> str:
        if not tenant_id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Tenant context required")
        return tenant_id

    # ─── BLOG ─────────────────────────────────────────────────────────────────

    def list_blog_posts(
        self, db: Session, tenant_id: Optional[str], post_status: Optional[str] = None
    ) -> list:
        tid = self._require_tenant(tenant_id)
        q = db.query(BlogPost).filter(
            BlogPost.tenant_id == tid, BlogPost.deleted_at.is_(None)
        )
        if post_status:
            q = q.filter(BlogPost.status == post_status)
        return [self._post_to_dict(p) for p in q.order_by(BlogPost.created_at.desc()).all()]

    def create_blog_post(
        self, db: Session, tenant_id: Optional[str], data: BlogPostCreate, actor_id: str
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        if (
            db.query(BlogPost)
            .filter(
                BlogPost.tenant_id == tid,
                BlogPost.slug == data.slug,
                BlogPost.deleted_at.is_(None),
            )
            .first()
        ):
            raise HTTPException(status.HTTP_409_CONFLICT, detail="Slug already in use")
        post = BlogPost(
            id=new_uuid(),
            tenant_id=tid,
            created_by=actor_id,
            **data.model_dump(),
        )
        db.add(post)
        db.commit()
        db.refresh(post)
        return self._post_to_dict(post)

    def update_blog_post(
        self,
        db: Session,
        tenant_id: Optional[str],
        post_id: str,
        data: BlogPostUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        post = (
            db.query(BlogPost)
            .filter(
                BlogPost.id == post_id,
                BlogPost.tenant_id == tid,
                BlogPost.deleted_at.is_(None),
            )
            .first()
        )
        if not post:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Post not found")
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(post, key, value)
        db.commit()
        return self._post_to_dict(post)

    def publish_blog_post(self, db: Session, tenant_id: Optional[str], post_id: str) -> dict:
        tid = self._require_tenant(tenant_id)
        post = (
            db.query(BlogPost)
            .filter(
                BlogPost.id == post_id,
                BlogPost.tenant_id == tid,
                BlogPost.deleted_at.is_(None),
            )
            .first()
        )
        if not post:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Post not found")
        post.status = "published"
        post.published_at = utcnow_naive()
        db.commit()
        return self._post_to_dict(post)

    def _post_to_dict(self, p: BlogPost) -> dict:
        return {
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "status": p.status,
            "category": p.category,
            "excerpt": p.excerpt,
            "thumbnail_url": p.thumbnail_url,
            "published_at": str(p.published_at) if p.published_at else None,
        }

    # ─── GALLERY ──────────────────────────────────────────────────────────────

    def list_gallery(
        self, db: Session, tenant_id: Optional[str], active_only: bool = False
    ) -> list:
        tid = self._require_tenant(tenant_id)
        q = db.query(GalleryItem).filter(
            GalleryItem.tenant_id == tid, GalleryItem.deleted_at.is_(None)
        )
        if active_only:
            q = q.filter(GalleryItem.status == "active")
        items = q.order_by(GalleryItem.sort_order.asc()).all()
        return [
            {
                "id": i.id,
                "title": i.title,
                "media_type": i.media_type,
                "media_url": i.media_url,
                "thumbnail_url": i.thumbnail_url,
                "sort_order": i.sort_order,
                "status": i.status,
            }
            for i in items
        ]

    def create_gallery_item(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: GalleryItemCreate,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        item = GalleryItem(
            id=new_uuid(),
            tenant_id=tid,
            created_by=actor_id,
            **data.model_dump(),
        )
        db.add(item)
        db.commit()
        return {"id": item.id, "media_url": item.media_url}

    def update_gallery_item(
        self,
        db: Session,
        tenant_id: Optional[str],
        item_id: str,
        data: GalleryItemUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        item = (
            db.query(GalleryItem)
            .filter(
                GalleryItem.id == item_id,
                GalleryItem.tenant_id == tid,
                GalleryItem.deleted_at.is_(None),
            )
            .first()
        )
        if not item:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Gallery item not found")
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(item, key, value)
        db.commit()
        return {"id": item.id, "status": item.status}

    # ─── FAQ ──────────────────────────────────────────────────────────────────

    def list_faqs(
        self, db: Session, tenant_id: Optional[str], active_only: bool = False
    ) -> list:
        tid = self._require_tenant(tenant_id)
        q = db.query(Faq).filter(Faq.tenant_id == tid, Faq.deleted_at.is_(None))
        if active_only:
            q = q.filter(Faq.status == "active")
        items = q.order_by(Faq.sort_order.asc()).all()
        return [
            {
                "id": f.id,
                "question": f.question,
                "answer": f.answer,
                "category": f.category,
                "sort_order": f.sort_order,
                "status": f.status,
            }
            for f in items
        ]

    def create_faq(
        self, db: Session, tenant_id: Optional[str], data: FaqCreate
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        faq = Faq(id=new_uuid(), tenant_id=tid, **data.model_dump())
        db.add(faq)
        db.commit()
        return {"id": faq.id, "question": faq.question}

    def update_faq(
        self, db: Session, tenant_id: Optional[str], faq_id: str, data: FaqUpdate
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        faq = (
            db.query(Faq)
            .filter(Faq.id == faq_id, Faq.tenant_id == tid, Faq.deleted_at.is_(None))
            .first()
        )
        if not faq:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="FAQ not found")
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(faq, key, value)
        db.commit()
        return {"id": faq.id, "status": faq.status}

    # ─── TESTIMONIALS ─────────────────────────────────────────────────────────

    def list_testimonials(
        self, db: Session, tenant_id: Optional[str], active_only: bool = False
    ) -> list:
        tid = self._require_tenant(tenant_id)
        q = db.query(Testimonial).filter(
            Testimonial.tenant_id == tid, Testimonial.deleted_at.is_(None)
        )
        if active_only:
            q = q.filter(Testimonial.status == "active")
        items = q.order_by(Testimonial.sort_order.asc()).all()
        return [
            {
                "id": t.id,
                "author_name": t.author_name,
                "author_title": t.author_title,
                "content": t.content,
                "rating": t.rating,
                "image_url": t.image_url,
                "status": t.status,
            }
            for t in items
        ]

    def create_testimonial(
        self, db: Session, tenant_id: Optional[str], data: TestimonialCreate
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        item = Testimonial(id=new_uuid(), tenant_id=tid, **data.model_dump())
        db.add(item)
        db.commit()
        return {"id": item.id, "author_name": item.author_name}

    def update_testimonial(
        self,
        db: Session,
        tenant_id: Optional[str],
        item_id: str,
        data: TestimonialUpdate,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        item = (
            db.query(Testimonial)
            .filter(
                Testimonial.id == item_id,
                Testimonial.tenant_id == tid,
                Testimonial.deleted_at.is_(None),
            )
            .first()
        )
        if not item:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(item, key, value)
        db.commit()
        return {"id": item.id, "status": item.status}

    # ─── CONTACT ──────────────────────────────────────────────────────────────

    def submit_contact(
        self, db: Session, tenant_id: str, data: ContactSubmitRequest
    ) -> dict:
        msg = ContactMessage(
            id=new_uuid(),
            tenant_id=tenant_id,
            name=data.name,
            email=str(data.email),
            phone=data.phone,
            subject=data.subject,
            message=data.message,
            status="new",
        )
        db.add(msg)
        db.commit()
        return {"id": msg.id, "message": "Message received"}

    def list_messages(
        self, db: Session, tenant_id: Optional[str], msg_status: Optional[str] = None
    ) -> list:
        tid = self._require_tenant(tenant_id)
        q = db.query(ContactMessage).filter(ContactMessage.tenant_id == tid)
        if msg_status:
            q = q.filter(ContactMessage.status == msg_status)
        return [
            {
                "id": m.id,
                "name": m.name,
                "email": m.email,
                "subject": m.subject,
                "status": m.status,
                "created_at": str(m.created_at),
            }
            for m in q.order_by(ContactMessage.created_at.desc()).all()
        ]

    def reply_to_message(
        self,
        db: Session,
        tenant_id: Optional[str],
        message_id: str,
        reply: str,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        msg = (
            db.query(ContactMessage)
            .filter(ContactMessage.id == message_id, ContactMessage.tenant_id == tid)
            .first()
        )
        if not msg:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Message not found")
        msg.reply_message = reply
        msg.replied_at = utcnow_naive()
        msg.replied_by = actor_id
        msg.status = "replied"
        db.commit()
        return {"id": msg.id, "status": "replied"}
