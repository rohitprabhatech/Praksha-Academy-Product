"""Finance, CMS & notification API tests (Sprint 08)."""

from __future__ import annotations

from datetime import date, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, check_database_connection
from app.core.security import create_access_token, hash_password, utcnow_naive
from app.main import create_app
from app.models.cms import BlogPost, ContactMessage, Faq, GalleryItem, Testimonial
from app.models.commerce import Certificate, Coupon, Payment
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.finance import FeeInvoice, FeeStructure
from app.models.notification import Notification, NotificationRecipient
from app.models.platform import Tenant
from app.models.profiles import StudentProfile
from app.models.rbac import Role
from app.models.user import User, UserRole
from app.utils.ids import new_uuid

requires_db = pytest.mark.skipif(
    not check_database_connection(),
    reason="MySQL is not available",
)


@pytest.fixture()
def db() -> Session:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client() -> TestClient:
    with TestClient(create_app()) as c:
        yield c


def _role(db: Session, code: str) -> Role:
    role = db.query(Role).filter(Role.scope == "tenant", Role.code == code).first()
    if role:
        return role
    role = Role(id=new_uuid(), scope="tenant", code=code, name=code.title(), is_system=True)
    db.add(role)
    db.flush()
    return role


def _tenant_bundle(db: Session):
    slug = f"fin-{new_uuid()[:8]}"
    tenant = Tenant(
        id=new_uuid(),
        tenant_code=slug.upper().replace("-", "")[:10],
        name=f"Academy {slug}",
        slug=slug,
        status="active",
        contact_email=f"c+{slug}@example.com",
    )
    db.add(tenant)
    db.flush()

    owner = User(
        id=new_uuid(),
        tenant_id=tenant.id,
        email=f"owner.{new_uuid()[:8]}@example.com",
        password_hash=hash_password("OwnerPass1!"),
        first_name="Owner",
        status="active",
        email_verified_at=utcnow_naive(),
    )
    student_user = User(
        id=new_uuid(),
        tenant_id=tenant.id,
        email=f"student.{new_uuid()[:8]}@example.com",
        password_hash=hash_password("StudentPass1!"),
        first_name="Student",
        status="active",
        email_verified_at=utcnow_naive(),
    )
    db.add_all([owner, student_user])
    db.flush()

    for user, code in ((owner, "owner"), (student_user, "student")):
        db.add(
            UserRole(
                id=new_uuid(),
                user_id=user.id,
                role_id=_role(db, code).id,
                tenant_id=tenant.id,
            )
        )

    student = StudentProfile(id=new_uuid(), tenant_id=tenant.id, user_id=student_user.id)
    db.add(student)
    db.commit()

    return {
        "tenant": tenant,
        "owner": owner,
        "student_user": student_user,
        "student": student,
        "owner_token": create_access_token(owner.id, tenant.id, ["owner"]),
        "student_token": create_access_token(student_user.id, tenant.id, ["student"]),
    }


def _cleanup(db: Session, tenant_id: str):
    db.query(NotificationRecipient).filter(
        NotificationRecipient.tenant_id == tenant_id
    ).delete()
    db.query(Notification).filter(Notification.tenant_id == tenant_id).delete()
    db.query(ContactMessage).filter(ContactMessage.tenant_id == tenant_id).delete()
    db.query(Testimonial).filter(Testimonial.tenant_id == tenant_id).delete()
    db.query(Faq).filter(Faq.tenant_id == tenant_id).delete()
    db.query(GalleryItem).filter(GalleryItem.tenant_id == tenant_id).delete()
    db.query(BlogPost).filter(BlogPost.tenant_id == tenant_id).delete()
    db.query(Certificate).filter(Certificate.tenant_id == tenant_id).delete()
    db.query(Coupon).filter(Coupon.tenant_id == tenant_id).delete()
    db.query(FeeInvoice).filter(FeeInvoice.tenant_id == tenant_id).delete()
    db.query(Payment).filter(Payment.tenant_id == tenant_id).delete()
    db.query(FeeStructure).filter(FeeStructure.tenant_id == tenant_id).delete()
    db.query(Enrollment).filter(Enrollment.tenant_id == tenant_id).delete()
    db.query(Course).filter(Course.tenant_id == tenant_id).delete()
    db.query(StudentProfile).filter(StudentProfile.tenant_id == tenant_id).delete()
    user_ids = [r[0] for r in db.query(User.id).filter(User.tenant_id == tenant_id).all()]
    for uid in user_ids:
        db.query(UserRole).filter(UserRole.user_id == uid).delete()
    db.query(User).filter(User.tenant_id == tenant_id).delete()
    db.query(Tenant).filter(Tenant.id == tenant_id).delete()
    db.commit()


@requires_db
def test_fee_invoice_payment_flow(client: TestClient, db: Session):
    ctx = _tenant_bundle(db)
    tid = ctx["tenant"].id
    try:
        course = Course(
            id=new_uuid(),
            tenant_id=tid,
            name="Fee Course",
            slug=f"fee-{new_uuid()[:6]}",
            status="published",
            created_by=ctx["owner"].id,
        )
        db.add(course)
        db.flush()
        enrollment = Enrollment(
            id=new_uuid(),
            tenant_id=tid,
            student_id=ctx["student"].id,
            course_id=course.id,
            status="active",
            enrolled_at=utcnow_naive(),
        )
        db.add(enrollment)
        db.commit()

        fs = client.post(
            "/api/v1/owner/fee-structures",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={
                "name": "Course Fee",
                "course_id": course.id,
                "amount": 1000,
                "fee_type": "one_time",
            },
        )
        assert fs.status_code == 200, fs.text
        fs_id = fs.json()["data"]["id"]

        gen = client.post(
            f"/api/v1/owner/fee-structures/{fs_id}/generate-invoices",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={"due_date": str(date.today() + timedelta(days=7)), "discount_amount": 100},
        )
        assert gen.status_code == 200
        assert gen.json()["data"]["generated"] == 1

        invoices = client.get(
            "/api/v1/owner/fee-invoices",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
        )
        assert invoices.status_code == 200
        inv = invoices.json()["data"][0]
        assert inv["total_amount"] == 900
        assert inv["status"] == "unpaid"

        mine = client.get(
            "/api/v1/student/fee-invoices",
            headers={"Authorization": f"Bearer {ctx['student_token']}"},
        )
        assert mine.status_code == 200
        assert len(mine.json()["data"]) == 1

        pay = client.post(
            "/api/v1/owner/payments",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={
                "student_id": ctx["student"].id,
                "fee_invoice_id": inv["id"],
                "course_id": course.id,
                "amount": 900,
                "payment_method": "upi",
            },
        )
        assert pay.status_code == 200
        assert pay.json()["data"]["status"] == "completed"

        summary = client.get(
            "/api/v1/owner/finance/summary",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
        )
        assert summary.status_code == 200
        assert summary.json()["data"]["total_revenue"] == 900
        assert summary.json()["data"]["pending_invoices"] == 0
    finally:
        db.rollback()
        _cleanup(db, tid)


@requires_db
def test_coupon_and_certificate(client: TestClient, db: Session):
    ctx = _tenant_bundle(db)
    tid = ctx["tenant"].id
    slug = ctx["tenant"].slug
    try:
        course = Course(
            id=new_uuid(),
            tenant_id=tid,
            name="Cert Course",
            slug=f"cert-{new_uuid()[:6]}",
            status="published",
            created_by=ctx["owner"].id,
        )
        db.add(course)
        db.flush()
        enrollment = Enrollment(
            id=new_uuid(),
            tenant_id=tid,
            student_id=ctx["student"].id,
            course_id=course.id,
            status="active",
            enrolled_at=utcnow_naive(),
        )
        db.add(enrollment)
        db.commit()

        coupon = client.post(
            "/api/v1/owner/coupons",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={
                "code": "SAVE20",
                "discount_type": "percentage",
                "discount_value": 20,
                "min_order_amount": 100,
            },
        )
        assert coupon.status_code == 200, coupon.text

        validate = client.post(
            f"/api/v1/public/{slug}/coupons/validate",
            json={"code": "save20", "order_amount": 500},
        )
        assert validate.status_code == 200
        assert validate.json()["data"]["discount_amount"] == 100
        assert validate.json()["data"]["final_amount"] == 400

        issue = client.post(
            "/api/v1/owner/certificates/issue",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={
                "student_id": ctx["student"].id,
                "course_id": course.id,
                "enrollment_id": enrollment.id,
            },
        )
        assert issue.status_code == 200, issue.text
        cert_number = issue.json()["data"]["certificate_number"]

        verify = client.get(f"/api/v1/public/certificates/{cert_number}")
        assert verify.status_code == 200
        assert verify.json()["data"]["valid"] is True

        mine = client.get(
            "/api/v1/student/certificates",
            headers={"Authorization": f"Bearer {ctx['student_token']}"},
        )
        assert mine.status_code == 200
        assert len(mine.json()["data"]) == 1
    finally:
        db.rollback()
        _cleanup(db, tid)


@requires_db
def test_cms_public_and_contact(client: TestClient, db: Session):
    ctx = _tenant_bundle(db)
    tid = ctx["tenant"].id
    slug = ctx["tenant"].slug
    try:
        create = client.post(
            "/api/v1/owner/blog",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={
                "title": "Welcome",
                "slug": f"welcome-{new_uuid()[:6]}",
                "excerpt": "Hello",
                "content": "Body",
            },
        )
        assert create.status_code == 200, create.text
        post_id = create.json()["data"]["id"]

        pub = client.post(
            f"/api/v1/owner/blog/{post_id}/publish",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
        )
        assert pub.status_code == 200
        assert pub.json()["data"]["status"] == "published"

        blog = client.get(f"/api/v1/public/{slug}/blog")
        assert blog.status_code == 200
        assert len(blog.json()["data"]) == 1

        client.post(
            "/api/v1/owner/faqs",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={"question": "Hours?", "answer": "9-5"},
        )
        client.post(
            "/api/v1/owner/gallery",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={"media_url": "https://example.com/a.jpg", "title": "Campus"},
        )
        client.post(
            "/api/v1/owner/testimonials",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={"author_name": "Ada", "content": "Great", "rating": 5},
        )

        assert client.get(f"/api/v1/public/{slug}/faqs").status_code == 200
        assert client.get(f"/api/v1/public/{slug}/gallery").status_code == 200
        assert client.get(f"/api/v1/public/{slug}/testimonials").status_code == 200

        contact = client.post(
            f"/api/v1/public/{slug}/contact",
            json={
                "name": "Parent",
                "email": "parent@example.com",
                "subject": "Admission",
                "message": "Please call me",
            },
        )
        assert contact.status_code == 200

        messages = client.get(
            "/api/v1/owner/contact-messages",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
        )
        assert messages.status_code == 200
        msg_id = messages.json()["data"][0]["id"]

        reply = client.patch(
            f"/api/v1/owner/contact-messages/{msg_id}/reply",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={"reply_message": "We will call you tomorrow"},
        )
        assert reply.status_code == 200
        assert reply.json()["data"]["status"] == "replied"
    finally:
        db.rollback()
        _cleanup(db, tid)


@requires_db
def test_notifications(client: TestClient, db: Session):
    ctx = _tenant_bundle(db)
    tid = ctx["tenant"].id
    try:
        send = client.post(
            "/api/v1/owner/notifications",
            headers={"Authorization": f"Bearer {ctx['owner_token']}"},
            json={
                "title": "Holiday",
                "message": "Closed tomorrow",
                "audience_type": "students",
                "notification_type": "info",
            },
        )
        assert send.status_code == 200, send.text
        assert send.json()["data"]["status"] == "sent"
        assert send.json()["data"]["recipients"] >= 1

        inbox = client.get(
            "/api/v1/student/notifications",
            headers={"Authorization": f"Bearer {ctx['student_token']}"},
        )
        assert inbox.status_code == 200
        items = inbox.json()["data"]
        assert len(items) >= 1
        recipient_id = items[0]["id"]
        assert items[0]["is_read"] is False

        read = client.post(
            f"/api/v1/student/notifications/{recipient_id}/read",
            headers={"Authorization": f"Bearer {ctx['student_token']}"},
        )
        assert read.status_code == 200

        inbox2 = client.get(
            "/api/v1/student/notifications",
            headers={"Authorization": f"Bearer {ctx['student_token']}"},
        )
        assert inbox2.json()["data"][0]["is_read"] is True
    finally:
        db.rollback()
        _cleanup(db, tid)
