# SPRINT 08 — Finance, CMS & Notifications APIs
**Project:** Praksha Academy SaaS
**Developer:** _(assign name here)_
**Branch:** `feature/sprint-08-finance-cms`
**Base Branch:** `dev`
**Estimated Time:** 8–10 working days
**Depends on:** Sprint 03 + Sprint 05 merged to `dev`

---

## What Is This Sprint About?

This sprint covers all remaining backend APIs:

1. **Fee Management** — fee structures, invoices, payments
2. **Coupons** — discount codes for enrollment
3. **Certificates** — issue/revoke course completion certificates
4. **Wishlist** — students bookmark courses
5. **CMS Content** — Blog, Gallery, FAQ, Testimonials, Contact Messages
6. **Notifications** — broadcast messages to students/teachers

---

## Step 1 — Create Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feature/sprint-08-finance-cms
```

---

## Step 2 — Schemas (`app/schemas/finance.py`)

```python
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


# ─── FEE STRUCTURES ───────────────────────────────────────────────────────────

class FeeStructureCreate(BaseModel):
    name: str
    course_id: Optional[str] = None
    batch_id: Optional[str] = None
    academic_class_id: Optional[str] = None
    fee_type: str = "one_time"   # one_time|monthly|quarterly|annual|custom
    amount: float
    currency: str = "INR"
    due_day: Optional[int] = None   # day of month (1–28) for recurring
    late_fee: Optional[float] = None
    is_optional: bool = False
    description: Optional[str] = None

class FeeStructureUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    late_fee: Optional[float] = None
    is_optional: Optional[bool] = None
    description: Optional[str] = None
    status: Optional[str] = None   # active | inactive


# ─── FEE INVOICES ─────────────────────────────────────────────────────────────

class GenerateInvoicesRequest(BaseModel):
    student_ids: Optional[list[str]] = None   # if None, generate for ALL enrolled students
    due_date: date
    discount_amount: float = 0.0
    notes: Optional[str] = None

class WaiveInvoiceRequest(BaseModel):
    notes: Optional[str] = None


# ─── PAYMENTS ─────────────────────────────────────────────────────────────────

class RecordPaymentRequest(BaseModel):
    student_id: str
    fee_invoice_id: Optional[str] = None
    enrollment_id: Optional[str] = None
    course_id: Optional[str] = None
    amount: float
    payment_method: str = "cash"  # cash|bank_transfer|upi|card|cheque|online
    transaction_ref: Optional[str] = None
    notes: Optional[str] = None


# ─── COUPONS ──────────────────────────────────────────────────────────────────

class CouponCreate(BaseModel):
    code: str
    description: Optional[str] = None
    discount_type: str = "percentage"   # percentage | fixed
    discount_value: float
    max_uses: Optional[int] = None
    min_order_amount: Optional[float] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None

class CouponUpdate(BaseModel):
    description: Optional[str] = None
    max_uses: Optional[int] = None
    valid_until: Optional[datetime] = None
    status: Optional[str] = None   # active | inactive | expired

class ValidateCouponRequest(BaseModel):
    code: str
    order_amount: float


# ─── CERTIFICATES ─────────────────────────────────────────────────────────────

class IssueCertificateRequest(BaseModel):
    student_id: str
    course_id: str
    enrollment_id: str
    file_url: Optional[str] = None
```

---

## Step 3 — Schemas (`app/schemas/cms.py`)

```python
from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


# ─── BLOG POSTS ───────────────────────────────────────────────────────────────

class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    author_name: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags_json: Optional[Any] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    thumbnail_url: Optional[str] = None
    tags_json: Optional[Any] = None
    status: Optional[str] = None   # draft | published | archived


# ─── GALLERY ──────────────────────────────────────────────────────────────────

class GalleryItemCreate(BaseModel):
    title: Optional[str] = None
    media_type: str = "image"   # image | video
    media_url: str
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    sort_order: int = 0


# ─── FAQ ──────────────────────────────────────────────────────────────────────

class FaqCreate(BaseModel):
    question: str
    answer: str
    category: Optional[str] = None
    sort_order: int = 0

class FaqUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None


# ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

class TestimonialCreate(BaseModel):
    author_name: str
    author_title: Optional[str] = None
    content: str
    rating: Optional[int] = None   # 1–5
    image_url: Optional[str] = None
    sort_order: int = 0


# ─── CONTACT ──────────────────────────────────────────────────────────────────

class ContactSubmitRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str

class ReplyRequest(BaseModel):
    reply_message: str


# ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

class NotificationCreate(BaseModel):
    title: str
    message: str
    notification_type: str = "info"   # info|warning|success|alert
    audience_type: str = "all"        # all|students|teachers|owners|specific_user
    target_user_id: Optional[str] = None
    scheduled_at: Optional[datetime] = None
```

---

## Step 4 — Finance Service (`app/services/finance_service.py`)

```python
import math
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.commerce import Payment, Coupon, CouponRedemption, Certificate
from app.models.enrollment import Enrollment
from app.models.profiles import StudentProfile
from app.finance import FeeStructure, FeeInvoice
from app.utils.ids import new_uuid
from app.schemas.finance import (
    FeeStructureCreate, FeeStructureUpdate, GenerateInvoicesRequest,
    RecordPaymentRequest, CouponCreate, IssueCertificateRequest
)


class FinanceService:

    # ─── FEE STRUCTURES ───────────────────────────────────────────────────────

    def create_fee_structure(self, db: Session, tenant_id: str,
                             data: FeeStructureCreate, actor_id: str) -> dict:
        fs = FeeStructure(
            id=new_uuid(), tenant_id=tenant_id,
            created_by=actor_id, **data.model_dump()
        )
        db.add(fs)
        db.commit()
        return {"id": fs.id, "name": fs.name, "amount": float(fs.amount)}

    def list_fee_structures(self, db: Session, tenant_id: str) -> list:
        items = db.query(FeeStructure).filter(
            FeeStructure.tenant_id == tenant_id,
            FeeStructure.deleted_at == None
        ).all()
        return [{"id": i.id, "name": i.name, "amount": float(i.amount),
                 "fee_type": i.fee_type, "status": i.status} for i in items]

    def generate_invoices(self, db: Session, tenant_id: str,
                          fee_structure_id: str, data: GenerateInvoicesRequest,
                          actor_id: str) -> dict:
        """Generate one invoice per enrolled student."""
        fs = db.query(FeeStructure).filter(
            FeeStructure.id == fee_structure_id,
            FeeStructure.tenant_id == tenant_id
        ).first()
        if not fs:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Fee structure not found")

        # Find enrolled students
        if data.student_ids:
            student_ids = data.student_ids
        else:
            # All students enrolled in the course/batch of this fee structure
            enrollments = db.query(Enrollment).filter(
                Enrollment.tenant_id == tenant_id,
                Enrollment.course_id == fs.course_id if fs.course_id else True,
                Enrollment.status == "active"
            ).all()
            student_ids = [e.student_id for e in enrollments]

        generated = 0
        for student_id in student_ids:
            invoice_number = f"INV-{tenant_id[:8].upper()}-{uuid.uuid4().hex[:8].upper()}"
            total = float(fs.amount) - data.discount_amount
            db.add(FeeInvoice(
                id=new_uuid(), tenant_id=tenant_id,
                student_id=student_id,
                fee_structure_id=fee_structure_id,
                invoice_number=invoice_number,
                amount=fs.amount,
                discount_amount=data.discount_amount,
                total_amount=max(total, 0),
                due_date=data.due_date,
                notes=data.notes,
                created_by=actor_id,
            ))
            generated += 1

        db.commit()
        return {"generated": generated, "fee_structure": fs.name}

    # ─── PAYMENTS ─────────────────────────────────────────────────────────────

    def record_payment(self, db: Session, tenant_id: str,
                       data: RecordPaymentRequest, actor_id: str) -> dict:
        payment = Payment(
            id=new_uuid(), tenant_id=tenant_id,
            student_id=data.student_id,
            enrollment_id=data.enrollment_id,
            course_id=data.course_id,
            amount=data.amount,
            payment_method=data.payment_method,
            transaction_ref=data.transaction_ref,
            status="completed",
            paid_at=datetime.now(timezone.utc),
            notes=data.notes,
            created_by=actor_id,
        )
        db.add(payment)

        # If fee_invoice_id provided, link payment and update invoice status
        if data.fee_invoice_id:
            invoice = db.query(FeeInvoice).filter(
                FeeInvoice.id == data.fee_invoice_id,
                FeeInvoice.tenant_id == tenant_id
            ).first()
            if invoice:
                invoice.paid_amount = float(invoice.paid_amount) + data.amount
                invoice.payment_id = payment.id
                if invoice.paid_amount >= float(invoice.total_amount):
                    invoice.status = "paid"
                else:
                    invoice.status = "partial"

        db.commit()
        return {"payment_id": payment.id, "amount": data.amount, "status": "completed"}

    def get_finance_summary(self, db: Session, tenant_id: str) -> dict:
        from sqlalchemy import func
        total_revenue = db.query(func.sum(Payment.amount)).filter(
            Payment.tenant_id == tenant_id,
            Payment.status == "completed"
        ).scalar() or 0

        pending_invoices = db.query(FeeInvoice).filter(
            FeeInvoice.tenant_id == tenant_id,
            FeeInvoice.status.in_(["unpaid", "partial"])
        ).count()

        return {
            "total_revenue": float(total_revenue),
            "pending_invoices": pending_invoices,
        }

    # ─── COUPONS ──────────────────────────────────────────────────────────────

    def create_coupon(self, db: Session, tenant_id: str,
                      data: CouponCreate, actor_id: str) -> dict:
        # Check code not taken
        existing = db.query(Coupon).filter(
            Coupon.tenant_id == tenant_id,
            Coupon.code == data.code.upper()
        ).first()
        if existing:
            raise HTTPException(status.HTTP_409_CONFLICT,
                                "Coupon code already exists")
        coupon = Coupon(
            id=new_uuid(), tenant_id=tenant_id,
            code=data.code.upper(), created_by=actor_id,
            **data.model_dump(exclude={"code"})
        )
        db.add(coupon)
        db.commit()
        return {"id": coupon.id, "code": coupon.code}

    def validate_coupon(self, db: Session, tenant_id: str,
                        code: str, order_amount: float) -> dict:
        now = datetime.now(timezone.utc)
        coupon = db.query(Coupon).filter(
            Coupon.tenant_id == tenant_id,
            Coupon.code == code.upper(),
            Coupon.status == "active",
        ).first()

        if not coupon:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Invalid coupon code")

        if coupon.valid_from and coupon.valid_from > now:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Coupon not yet valid")
        if coupon.valid_until and coupon.valid_until < now:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Coupon has expired")
        if coupon.max_uses and coupon.used_count >= coupon.max_uses:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Coupon usage limit reached")
        if coupon.min_order_amount and order_amount < float(coupon.min_order_amount):
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                f"Minimum order amount is {coupon.min_order_amount}"
            )

        if coupon.discount_type == "percentage":
            discount = round(order_amount * float(coupon.discount_value) / 100, 2)
        else:
            discount = min(float(coupon.discount_value), order_amount)

        return {
            "coupon_id": coupon.id,
            "code": coupon.code,
            "discount_type": coupon.discount_type,
            "discount_value": float(coupon.discount_value),
            "discount_amount": discount,
            "final_amount": round(order_amount - discount, 2),
        }

    # ─── CERTIFICATES ─────────────────────────────────────────────────────────

    def issue_certificate(self, db: Session, tenant_id: str,
                          data: IssueCertificateRequest, actor_id: str) -> dict:
        # Check not already issued
        existing = db.query(Certificate).filter(
            Certificate.tenant_id == tenant_id,
            Certificate.enrollment_id == data.enrollment_id
        ).first()
        if existing:
            raise HTTPException(status.HTTP_409_CONFLICT,
                                "Certificate already issued for this enrollment")

        cert_number = f"CERT-{tenant_id[:6].upper()}-{uuid.uuid4().hex[:10].upper()}"
        cert = Certificate(
            id=new_uuid(), tenant_id=tenant_id,
            student_id=data.student_id, course_id=data.course_id,
            enrollment_id=data.enrollment_id,
            certificate_number=cert_number,
            file_url=data.file_url, status="issued",
            issued_by=actor_id,
        )
        db.add(cert)
        db.commit()
        return {"certificate_id": cert.id, "certificate_number": cert_number}

    def verify_certificate(self, db: Session, cert_number: str) -> dict:
        cert = db.query(Certificate).filter(
            Certificate.certificate_number == cert_number,
            Certificate.status == "issued"
        ).first()
        if not cert:
            raise HTTPException(status.HTTP_404_NOT_FOUND,
                                "Certificate not found or revoked")
        return {
            "certificate_number": cert.certificate_number,
            "issued_at": str(cert.issued_at),
            "status": cert.status,
            "valid": True,
        }
```

---

## Step 5 — CMS Service (`app/services/cms_service.py`)

```python
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cms import BlogPost, GalleryItem, Faq, Testimonial, ContactMessage
from app.utils.ids import new_uuid
from app.schemas.cms import (
    BlogPostCreate, BlogPostUpdate, GalleryItemCreate,
    FaqCreate, FaqUpdate, TestimonialCreate,
    ContactSubmitRequest, ReplyRequest
)


class CmsService:

    # ─── BLOG ─────────────────────────────────────────────────────────────────

    def list_blog_posts(self, db: Session, tenant_id: str,
                        status: Optional[str] = None) -> list:
        q = db.query(BlogPost).filter(
            BlogPost.tenant_id == tenant_id,
            BlogPost.deleted_at == None
        )
        if status:
            q = q.filter(BlogPost.status == status)
        return [self._post_to_dict(p) for p in q.order_by(BlogPost.created_at.desc()).all()]

    def create_blog_post(self, db: Session, tenant_id: str,
                         data: BlogPostCreate, actor_id: str) -> dict:
        # Check slug unique
        if db.query(BlogPost).filter(
            BlogPost.tenant_id == tenant_id, BlogPost.slug == data.slug
        ).first():
            raise HTTPException(status.HTTP_409_CONFLICT, "Slug already in use")
        post = BlogPost(
            id=new_uuid(), tenant_id=tenant_id,
            created_by=actor_id, **data.model_dump()
        )
        db.add(post)
        db.commit()
        return self._post_to_dict(post)

    def publish_blog_post(self, db: Session, tenant_id: str, post_id: str) -> dict:
        post = db.query(BlogPost).filter(
            BlogPost.id == post_id, BlogPost.tenant_id == tenant_id
        ).first()
        if not post:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Post not found")
        post.status = "published"
        post.published_at = datetime.now(timezone.utc)
        db.commit()
        return self._post_to_dict(post)

    def _post_to_dict(self, p) -> dict:
        return {
            "id": p.id, "title": p.title, "slug": p.slug,
            "status": p.status, "category": p.category,
            "excerpt": p.excerpt, "thumbnail_url": p.thumbnail_url,
            "published_at": str(p.published_at) if p.published_at else None,
        }

    # ─── CONTACT MESSAGES ─────────────────────────────────────────────────────

    def submit_contact(self, db: Session, tenant_id: str,
                       data: ContactSubmitRequest) -> dict:
        msg = ContactMessage(
            id=new_uuid(), tenant_id=tenant_id,
            name=data.name, email=data.email, phone=data.phone,
            subject=data.subject, message=data.message, status="new"
        )
        db.add(msg)
        db.commit()
        return {"id": msg.id, "message": "Message received"}

    def list_messages(self, db: Session, tenant_id: str,
                      status: Optional[str] = None) -> list:
        q = db.query(ContactMessage).filter(
            ContactMessage.tenant_id == tenant_id
        )
        if status:
            q = q.filter(ContactMessage.status == status)
        return [{"id": m.id, "name": m.name, "email": m.email,
                 "subject": m.subject, "status": m.status,
                 "created_at": str(m.created_at)}
                for m in q.order_by(ContactMessage.created_at.desc()).all()]

    def reply_to_message(self, db: Session, tenant_id: str,
                         message_id: str, reply: str, actor_id: str) -> dict:
        msg = db.query(ContactMessage).filter(
            ContactMessage.id == message_id,
            ContactMessage.tenant_id == tenant_id
        ).first()
        if not msg:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Message not found")
        msg.reply_message = reply
        msg.replied_at = datetime.now(timezone.utc)
        msg.replied_by = actor_id
        msg.status = "replied"
        db.commit()
        return {"id": msg.id, "status": "replied"}
```

---

## Step 6 — Notification Service (`app/services/notification_service.py`)

```python
from sqlalchemy.orm import Session
from app.models.notification import Notification, NotificationRecipient
from app.models.user import User
from app.utils.ids import new_uuid
from app.schemas.cms import NotificationCreate
from datetime import datetime, timezone


class NotificationService:

    def create_and_send(self, db: Session, tenant_id: str,
                        data: NotificationCreate, actor_id: str) -> dict:
        notif = Notification(
            id=new_uuid(), tenant_id=tenant_id,
            title=data.title, message=data.message,
            notification_type=data.notification_type,
            audience_type=data.audience_type,
            target_user_id=data.target_user_id,
            scheduled_at=data.scheduled_at,
            status="draft", created_by=actor_id,
        )
        db.add(notif)
        db.flush()

        # Find recipient users
        if data.scheduled_at:
            # Don't send now — will be sent by scheduler
            notif.status = "scheduled"
        else:
            recipients = self._find_recipients(db, tenant_id, data)
            for user_id in recipients:
                db.add(NotificationRecipient(
                    id=new_uuid(), tenant_id=tenant_id,
                    notification_id=notif.id, user_id=user_id,
                    delivered_at=datetime.now(timezone.utc),
                ))
            notif.status = "sent"
            notif.sent_at = datetime.now(timezone.utc)

        db.commit()
        return {"notification_id": notif.id, "status": notif.status,
                "recipients": len(recipients) if not data.scheduled_at else 0}

    def _find_recipients(self, db: Session, tenant_id: str,
                         data: NotificationCreate) -> list[str]:
        from app.models.rbac import Role
        from app.models.user import UserRole

        if data.audience_type == "specific_user" and data.target_user_id:
            return [data.target_user_id]

        q = db.query(User.id).filter(
            User.tenant_id == tenant_id,
            User.status == "active",
            User.deleted_at == None
        )

        if data.audience_type != "all":
            role_map = {
                "students": "student",
                "teachers": "teacher",
                "owners": "owner",
            }
            role_code = role_map.get(data.audience_type)
            if role_code:
                role = db.query(Role).filter(Role.code == role_code).first()
                if role:
                    q = q.join(UserRole, UserRole.user_id == User.id).filter(
                        UserRole.role_id == role.id
                    )

        return [row[0] for row in q.all()]

    def get_my_notifications(self, db: Session, tenant_id: str,
                             user_id: str, unread_only: bool = False) -> list:
        q = db.query(NotificationRecipient, Notification).join(
            Notification, Notification.id == NotificationRecipient.notification_id
        ).filter(
            NotificationRecipient.user_id == user_id,
            NotificationRecipient.tenant_id == tenant_id,
        )
        if unread_only:
            q = q.filter(NotificationRecipient.is_read == 0)
        results = q.order_by(Notification.sent_at.desc()).all()
        return [
            {
                "id": nr.id,
                "notification_id": n.id,
                "title": n.title,
                "message": n.message,
                "type": n.notification_type,
                "is_read": bool(nr.is_read),
                "delivered_at": str(nr.delivered_at) if nr.delivered_at else None,
            }
            for nr, n in results
        ]

    def mark_read(self, db: Session, recipient_id: str, user_id: str) -> None:
        nr = db.query(NotificationRecipient).filter(
            NotificationRecipient.id == recipient_id,
            NotificationRecipient.user_id == user_id
        ).first()
        if nr:
            nr.is_read = 1
            nr.read_at = datetime.now(timezone.utc)
            db.commit()
```

---

## Step 7 — Route Handlers

### `app/api/v1/owner/finance.py`

```python
from fastapi import APIRouter, Depends
from typing import Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.finance import (
    FeeStructureCreate, FeeStructureUpdate, GenerateInvoicesRequest,
    RecordPaymentRequest, CouponCreate, CouponUpdate, IssueCertificateRequest
)
from app.services.finance_service import FinanceService

router = APIRouter(prefix="/owner", tags=["Owner — Finance"])
service = FinanceService()


@router.get("/fee-structures")
def list_fee_structures(db: Session = Depends(get_db),
                        current_user: dict = Depends(require_role("owner"))):
    return success_response(data=service.list_fee_structures(db, current_user["tenant_id"]))


@router.post("/fee-structures")
def create_fee_structure(body: FeeStructureCreate, db: Session = Depends(get_db),
                         current_user: dict = Depends(require_role("owner"))):
    data = service.create_fee_structure(db, current_user["tenant_id"], body, current_user["sub"])
    return success_response(data=data, message="Fee structure created")


@router.post("/fee-structures/{fs_id}/generate-invoices")
def generate_invoices(fs_id: str, body: GenerateInvoicesRequest,
                      db: Session = Depends(get_db),
                      current_user: dict = Depends(require_role("owner"))):
    data = service.generate_invoices(db, current_user["tenant_id"], fs_id, body, current_user["sub"])
    return success_response(data=data, message="Invoices generated")


@router.post("/payments")
def record_payment(body: RecordPaymentRequest, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("owner"))):
    data = service.record_payment(db, current_user["tenant_id"], body, current_user["sub"])
    return success_response(data=data, message="Payment recorded")


@router.get("/finance/summary")
def finance_summary(db: Session = Depends(get_db),
                    current_user: dict = Depends(require_role("owner"))):
    data = service.get_finance_summary(db, current_user["tenant_id"])
    return success_response(data=data)


@router.post("/coupons")
def create_coupon(body: CouponCreate, db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("owner"))):
    data = service.create_coupon(db, current_user["tenant_id"], body, current_user["sub"])
    return success_response(data=data, message="Coupon created")


@router.post("/certificates/issue")
def issue_certificate(body: IssueCertificateRequest, db: Session = Depends(get_db),
                      current_user: dict = Depends(require_role("owner"))):
    data = service.issue_certificate(db, current_user["tenant_id"], body, current_user["sub"])
    return success_response(data=data, message="Certificate issued")
```

### `app/api/v1/public.py` (add to existing public router)

```python
# Add these to the existing public.py

@router.post("/{tenant_slug}/contact")
def submit_contact(tenant_slug: str, body: ContactSubmitRequest,
                   db: Session = Depends(get_db)):
    tenant_id = _get_tenant_id(db, tenant_slug)
    data = cms_service.submit_contact(db, tenant_id, body)
    return success_response(data=data, message="Thank you for contacting us")

@router.get("/{tenant_slug}/blog")
def public_blog(tenant_slug: str, db: Session = Depends(get_db)):
    tenant_id = _get_tenant_id(db, tenant_slug)
    data = cms_service.list_blog_posts(db, tenant_id, status="published")
    return success_response(data=data)

@router.get("/certificates/{cert_number}")
def verify_certificate(cert_number: str, db: Session = Depends(get_db)):
    data = finance_service.verify_certificate(db, cert_number)
    return success_response(data=data)

@router.post("/{tenant_slug}/coupons/validate")
def validate_coupon(tenant_slug: str, body: ValidateCouponRequest,
                    db: Session = Depends(get_db)):
    tenant_id = _get_tenant_id(db, tenant_slug)
    data = finance_service.validate_coupon(db, tenant_id, body.code, body.order_amount)
    return success_response(data=data)
```

### `app/api/v1/owner/cms.py`

```python
from fastapi import APIRouter, Depends
from typing import Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.cms import (
    BlogPostCreate, BlogPostUpdate, GalleryItemCreate,
    FaqCreate, FaqUpdate, TestimonialCreate, NotificationCreate, ReplyRequest
)
from app.services.cms_service import CmsService
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/owner", tags=["Owner — CMS"])
service = CmsService()
notif_service = NotificationService()


# BLOG
@router.get("/blog")
def list_blog_posts(status: Optional[str] = None, db: Session = Depends(get_db),
                    current_user: dict = Depends(require_role("owner"))):
    return success_response(data=service.list_blog_posts(db, current_user["tenant_id"], status))


@router.post("/blog")
def create_post(body: BlogPostCreate, db: Session = Depends(get_db),
                current_user: dict = Depends(require_role("owner"))):
    data = service.create_blog_post(db, current_user["tenant_id"], body, current_user["sub"])
    return success_response(data=data, message="Post created")


@router.post("/blog/{post_id}/publish")
def publish_post(post_id: str, db: Session = Depends(get_db),
                 current_user: dict = Depends(require_role("owner"))):
    data = service.publish_blog_post(db, current_user["tenant_id"], post_id)
    return success_response(data=data, message="Post published")


# CONTACT MESSAGES
@router.get("/contact-messages")
def list_messages(status: Optional[str] = None, db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("owner"))):
    return success_response(data=service.list_messages(db, current_user["tenant_id"], status))


@router.patch("/contact-messages/{msg_id}/reply")
def reply_message(msg_id: str, body: ReplyRequest, db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("owner"))):
    data = service.reply_to_message(db, current_user["tenant_id"], msg_id,
                                    body.reply_message, current_user["sub"])
    return success_response(data=data, message="Reply sent")


# NOTIFICATIONS
@router.post("/notifications")
def create_notification(body: NotificationCreate, db: Session = Depends(get_db),
                        current_user: dict = Depends(require_role("owner"))):
    data = notif_service.create_and_send(db, current_user["tenant_id"], body, current_user["sub"])
    return success_response(data=data, message="Notification sent")
```

### `app/api/v1/student/notifications.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/student/notifications", tags=["Student — Notifications"])
service = NotificationService()


@router.get("")
def my_notifications(unread_only: bool = False, db: Session = Depends(get_db),
                     current_user: dict = Depends(require_role("student"))):
    data = service.get_my_notifications(
        db, current_user["tenant_id"], current_user["sub"], unread_only
    )
    return success_response(data=data)


@router.post("/{recipient_id}/read")
def mark_read(recipient_id: str, db: Session = Depends(get_db),
              current_user: dict = Depends(require_role("student"))):
    service.mark_read(db, recipient_id, current_user["sub"])
    return success_response(message="Marked as read")
```

---

## Step 8 — Register All New Routers in `router.py`

```python
from app.api.v1.owner.finance import router as finance_router
from app.api.v1.owner.cms import router as owner_cms_router
from app.api.v1.student.notifications import router as student_notif_router

api_router.include_router(finance_router)
api_router.include_router(owner_cms_router)
api_router.include_router(student_notif_router)
```

---

## Step 9 — Tests

Create `tests/test_finance/` and `tests/test_cms/`:

### `test_fee.py`
1. Create fee structure ✅
2. Generate invoices for enrolled students ✅
3. Invoice amount calculated correctly ✅

### `test_payments.py`
4. Record payment updates invoice status to "paid" ✅
5. Partial payment sets status to "partial" ✅
6. Finance summary returns correct totals ✅

### `test_coupons.py`
7. Create coupon with percentage discount ✅
8. Validate valid coupon → returns discount amount ✅
9. Expired coupon returns 400 ✅
10. Max uses exceeded returns 400 ✅
11. Coupon below min order amount returns 400 ✅

### `test_certificates.py`
12. Issue certificate ✅
13. Issue duplicate → 409 ✅
14. Public verify certificate ✅
15. Verify nonexistent cert → 404 ✅

### `test_cms.py`
16. Create blog post ✅
17. Publish blog post ✅
18. Draft post NOT in public listing ✅
19. Published post IS in public listing ✅
20. Submit contact form (no auth) ✅
21. Owner can list and reply to contact messages ✅

### `test_notifications.py`
22. Create notification for "all" → creates recipients for all users ✅
23. Create notification for "students" only ✅
24. Student gets their notifications ✅
25. Mark notification as read ✅

Minimum: **25 tests**.

---

## API Summary Table

| Method | Endpoint | Who | Description |
|--------|----------|-----|-------------|
| GET/POST | `/owner/fee-structures` | Owner | Fee structures CRUD |
| POST | `/owner/fee-structures/{id}/generate-invoices` | Owner | Generate invoices |
| GET | `/owner/fee-invoices` | Owner | List all invoices |
| GET | `/student/fee-invoices` | Student | My invoices |
| POST | `/owner/payments` | Owner | Record payment |
| GET | `/owner/finance/summary` | Owner | Revenue summary |
| GET/POST | `/owner/coupons` | Owner | Coupons CRUD |
| POST | `/public/{slug}/coupons/validate` | Anyone | Validate coupon |
| POST | `/owner/certificates/issue` | Owner | Issue certificate |
| GET | `/public/certificates/{number}` | Anyone | Verify certificate |
| GET | `/student/certificates` | Student | My certificates |
| GET/POST | `/owner/blog` | Owner | Blog posts |
| POST | `/owner/blog/{id}/publish` | Owner | Publish post |
| GET | `/public/{slug}/blog` | Anyone | Public blog |
| GET/POST | `/owner/gallery` | Owner | Gallery CRUD |
| GET | `/public/{slug}/gallery` | Anyone | Public gallery |
| GET/POST | `/owner/faqs` | Owner | FAQ CRUD |
| GET | `/public/{slug}/faqs` | Anyone | Public FAQs |
| GET/POST | `/owner/testimonials` | Owner | Testimonials CRUD |
| GET | `/public/{slug}/testimonials` | Anyone | Public testimonials |
| GET | `/owner/contact-messages` | Owner | List messages |
| PATCH | `/owner/contact-messages/{id}/reply` | Owner | Reply |
| POST | `/public/{slug}/contact` | Anyone | Submit form |
| POST | `/owner/notifications` | Owner | Create + send |
| GET | `/student/notifications` | Student | My notifications |
| POST | `/student/notifications/{id}/read` | Student | Mark read |

---

## Definition of Done ✅

- [ ] Fee invoices generated from fee structures
- [ ] Payment recording updates invoice status
- [ ] Certificate numbers are unique per tenant
- [ ] Public certificate verification works (no auth needed)
- [ ] Contact form works without login
- [ ] Draft blog posts NOT in public API
- [ ] Notifications delivered to correct audience
- [ ] `pytest tests/test_finance/ tests/test_cms/ -v` — all 25 tests PASS
- [ ] PR to `dev` with title: `feat(sprint-08): Finance, CMS & Notifications APIs`

---

## Final Step — Submit PR

```bash
git add .
git commit -m "feat(sprint-08): implement finance, CMS, and notification APIs"
git push origin feature/sprint-08-finance-cms
# Open GitHub → Create PR to dev
```
