"""Owner tenant-setup API tests (Sprint 05)."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, check_database_connection
from app.core.security import create_access_token, hash_password, utcnow_naive
from app.main import create_app
from app.models.academic import AcademicClass, Batch, Subject
from app.models.batch_students import BatchStudent
from app.models.platform import Tenant
from app.models.profiles import StudentProfile, TeacherProfile
from app.models.rbac import Role
from app.models.tenant import TenantProfile
from app.models.user import User, UserRole
from app.models.website import TenantWebsiteSettings
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
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client


def _ensure_role(db: Session, scope: str, code: str) -> Role:
    role = db.query(Role).filter(Role.scope == scope, Role.code == code).first()
    if role:
        return role
    role = Role(id=new_uuid(), scope=scope, code=code, name=code.title(), is_system=True)
    db.add(role)
    db.flush()
    return role


def _create_owner_context(db: Session) -> tuple[User, Tenant, str]:
    slug = f"own5-{new_uuid()[:8]}"
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
    user = User(
        id=new_uuid(),
        tenant_id=tenant.id,
        email=f"owner.{new_uuid()[:8]}@example.com",
        password_hash=hash_password("OwnerPass1!"),
        first_name="Owner",
        status="active",
        email_verified_at=utcnow_naive(),
    )
    db.add(user)
    db.flush()
    role = _ensure_role(db, "tenant", "owner")
    db.add(
        UserRole(
            id=new_uuid(),
            user_id=user.id,
            role_id=role.id,
            tenant_id=tenant.id,
        )
    )
    db.commit()
    token = create_access_token(user.id, tenant.id, ["owner"])
    return user, tenant, token


def _cleanup_tenant(db: Session, tenant_id: str, owner_id: str) -> None:
    db.query(BatchStudent).filter(BatchStudent.tenant_id == tenant_id).delete()
    db.query(Batch).filter(Batch.tenant_id == tenant_id).delete()
    db.query(Subject).filter(Subject.tenant_id == tenant_id).delete()
    db.query(AcademicClass).filter(AcademicClass.tenant_id == tenant_id).delete()
    db.query(TeacherProfile).filter(TeacherProfile.tenant_id == tenant_id).delete()
    db.query(StudentProfile).filter(StudentProfile.tenant_id == tenant_id).delete()
    db.query(TenantWebsiteSettings).filter(
        TenantWebsiteSettings.tenant_id == tenant_id
    ).delete()
    db.query(TenantProfile).filter(TenantProfile.tenant_id == tenant_id).delete()

    user_ids = [row[0] for row in db.query(User.id).filter(User.tenant_id == tenant_id).all()]
    for uid in user_ids:
        db.query(UserRole).filter(UserRole.user_id == uid).delete()
    db.query(User).filter(User.tenant_id == tenant_id).delete()
    db.query(Tenant).filter(Tenant.id == tenant_id).delete()
    db.commit()


@requires_db
def test_profile_and_website(client: TestClient, db: Session):
    owner, tenant, token = _create_owner_context(db)
    headers = {"Authorization": f"Bearer {token}"}
    try:
        profile = client.get("/api/v1/owner/profile", headers=headers)
        assert profile.status_code == 200
        assert profile.json()["data"]["display_name"]

        updated = client.put(
            "/api/v1/owner/profile",
            headers=headers,
            json={"display_name": "Updated Academy", "city": "Pune"},
        )
        assert updated.status_code == 200
        assert updated.json()["data"]["display_name"] == "Updated Academy"

        website = client.put(
            "/api/v1/owner/profile/website",
            headers=headers,
            json={"primary_color": "#123456", "show_blog": True, "seo_title": "Hello"},
        )
        assert website.status_code == 200
        assert website.json()["data"]["show_blog"] is True

        published = client.post("/api/v1/owner/profile/website/publish", headers=headers)
        assert published.status_code == 200
        assert published.json()["data"]["is_published"] is True
    finally:
        _cleanup_tenant(db, tenant.id, owner.id)


@requires_db
def test_teachers_and_students_crud(client: TestClient, db: Session):
    owner, tenant, token = _create_owner_context(db)
    headers = {"Authorization": f"Bearer {token}"}
    try:
        teacher_email = f"teacher.{new_uuid()[:8]}@example.com"
        created_t = client.post(
            "/api/v1/owner/teachers",
            headers=headers,
            json={
                "email": teacher_email,
                "first_name": "Tejas",
                "employee_code": f"T-{new_uuid()[:6]}",
            },
        )
        assert created_t.status_code == 200
        teacher_id = created_t.json()["data"]["id"]

        dup = client.post(
            "/api/v1/owner/teachers",
            headers=headers,
            json={"email": teacher_email, "first_name": "Dup"},
        )
        assert dup.status_code == 409

        student_email = f"student.{new_uuid()[:8]}@example.com"
        created_s = client.post(
            "/api/v1/owner/students",
            headers=headers,
            json={
                "email": student_email,
                "first_name": "Sara",
                "gender": "female",
                "enrollment_number": f"EN-{new_uuid()[:6]}",
            },
        )
        assert created_s.status_code == 200
        student_id = created_s.json()["data"]["id"]

        listed = client.get("/api/v1/owner/students", headers=headers)
        assert listed.status_code == 200
        assert any(item["id"] == student_id for item in listed.json()["data"]["items"])

        updated = client.put(
            f"/api/v1/owner/teachers/{teacher_id}",
            headers=headers,
            json={"first_name": "TejasUpdated", "specialization": "Math"},
        )
        assert updated.status_code == 200
        assert updated.json()["data"]["first_name"] == "TejasUpdated"
    finally:
        _cleanup_tenant(db, tenant.id, owner.id)


@requires_db
def test_academic_and_batch_membership(client: TestClient, db: Session):
    owner, tenant, token = _create_owner_context(db)
    headers = {"Authorization": f"Bearer {token}"}
    try:
        class_resp = client.post(
            "/api/v1/owner/classes",
            headers=headers,
            json={"name": f"Class-{new_uuid()[:6]}", "code": f"C-{new_uuid()[:4]}"},
        )
        assert class_resp.status_code == 200
        class_id = class_resp.json()["data"]["id"]

        subject_resp = client.post(
            "/api/v1/owner/subjects",
            headers=headers,
            json={"name": f"Math-{new_uuid()[:6]}"},
        )
        assert subject_resp.status_code == 200

        batch_resp = client.post(
            "/api/v1/owner/batches",
            headers=headers,
            json={
                "name": f"Batch-{new_uuid()[:6]}",
                "academic_class_id": class_id,
                "max_students": 40,
            },
        )
        assert batch_resp.status_code == 200
        batch_id = batch_resp.json()["data"]["id"]

        student_id = client.post(
            "/api/v1/owner/students",
            headers=headers,
            json={
                "email": f"batch.student.{new_uuid()[:8]}@example.com",
                "first_name": "BatchKid",
            },
        ).json()["data"]["id"]

        added = client.post(
            f"/api/v1/owner/batches/{batch_id}/students",
            headers=headers,
            json={"student_id": student_id},
        )
        assert added.status_code == 200

        again = client.post(
            f"/api/v1/owner/batches/{batch_id}/students",
            headers=headers,
            json={"student_id": student_id},
        )
        assert again.status_code == 409

        members = client.get(
            f"/api/v1/owner/batches/{batch_id}/students", headers=headers
        )
        assert members.status_code == 200
        assert any(m["student_id"] == student_id for m in members.json()["data"])

        removed = client.delete(
            f"/api/v1/owner/batches/{batch_id}/students/{student_id}",
            headers=headers,
        )
        assert removed.status_code == 200
    finally:
        _cleanup_tenant(db, tenant.id, owner.id)


@requires_db
def test_tenant_isolation_for_teachers(client: TestClient, db: Session):
    owner_a, tenant_a, token_a = _create_owner_context(db)
    owner_b, tenant_b, token_b = _create_owner_context(db)
    try:
        teacher_id = client.post(
            "/api/v1/owner/teachers",
            headers={"Authorization": f"Bearer {token_a}"},
            json={
                "email": f"iso.{new_uuid()[:8]}@example.com",
                "first_name": "Hidden",
            },
        ).json()["data"]["id"]

        other = client.get(
            f"/api/v1/owner/teachers/{teacher_id}",
            headers={"Authorization": f"Bearer {token_b}"},
        )
        assert other.status_code == 404

        listed_b = client.get(
            "/api/v1/owner/teachers",
            headers={"Authorization": f"Bearer {token_b}"},
        )
        assert listed_b.status_code == 200
        assert all(item["id"] != teacher_id for item in listed_b.json()["data"]["items"])
    finally:
        _cleanup_tenant(db, tenant_a.id, owner_a.id)
        _cleanup_tenant(db, tenant_b.id, owner_b.id)
