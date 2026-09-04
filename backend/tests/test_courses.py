"""Course & content API tests (Sprint 06)."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, check_database_connection
from app.core.security import create_access_token, hash_password, utcnow_naive
from app.main import create_app
from app.models.course import Course, CourseChapter, CourseLesson, CourseModule
from app.models.platform import Tenant
from app.models.programs import Program, ProgramCourse
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
    with TestClient(create_app()) as test_client:
        yield test_client


def _ensure_role(db: Session, code: str) -> Role:
    role = db.query(Role).filter(Role.scope == "tenant", Role.code == code).first()
    if role:
        return role
    role = Role(id=new_uuid(), scope="tenant", code=code, name=code.title(), is_system=True)
    db.add(role)
    db.flush()
    return role


def _owner_ctx(db: Session) -> tuple[User, Tenant, str]:
    slug = f"c6-{new_uuid()[:8]}"
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
    role = _ensure_role(db, "owner")
    db.add(UserRole(id=new_uuid(), user_id=user.id, role_id=role.id, tenant_id=tenant.id))
    db.commit()
    return user, tenant, create_access_token(user.id, tenant.id, ["owner"])


def _cleanup(db: Session, tenant_id: str) -> None:
    db.query(CourseLesson).filter(CourseLesson.tenant_id == tenant_id).delete()
    db.query(CourseChapter).filter(CourseChapter.tenant_id == tenant_id).delete()
    db.query(CourseModule).filter(CourseModule.tenant_id == tenant_id).delete()
    db.query(ProgramCourse).filter(ProgramCourse.tenant_id == tenant_id).delete()
    db.query(Program).filter(Program.tenant_id == tenant_id).delete()
    db.query(Course).filter(Course.tenant_id == tenant_id).delete()
    user_ids = [r[0] for r in db.query(User.id).filter(User.tenant_id == tenant_id).all()]
    for uid in user_ids:
        db.query(UserRole).filter(UserRole.user_id == uid).delete()
    db.query(User).filter(User.tenant_id == tenant_id).delete()
    db.query(Tenant).filter(Tenant.id == tenant_id).delete()
    db.commit()


@requires_db
def test_course_publish_and_public_catalog(client: TestClient, db: Session):
    owner, tenant, token = _owner_ctx(db)
    headers = {"Authorization": f"Bearer {token}"}
    slug = f"py-basics-{new_uuid()[:6]}"
    try:
        created = client.post(
            "/api/v1/owner/courses",
            headers=headers,
            json={"name": "Python Basics", "slug": slug, "price": 999},
        )
        assert created.status_code == 200
        course_id = created.json()["data"]["id"]

        dup = client.post(
            "/api/v1/owner/courses",
            headers=headers,
            json={"name": "Dup", "slug": slug},
        )
        assert dup.status_code == 409

        public_before = client.get(f"/api/v1/public/{tenant.slug}/courses")
        assert public_before.status_code == 200
        assert all(c["id"] != course_id for c in public_before.json()["data"])

        published = client.post(
            f"/api/v1/owner/courses/{course_id}/publish", headers=headers
        )
        assert published.status_code == 200
        assert published.json()["data"]["status"] == "published"

        public_after = client.get(f"/api/v1/public/{tenant.slug}/courses")
        assert any(c["id"] == course_id for c in public_after.json()["data"])
    finally:
        _cleanup(db, tenant.id)


@requires_db
def test_module_chapter_lesson_and_public_detail(client: TestClient, db: Session):
    owner, tenant, token = _owner_ctx(db)
    headers = {"Authorization": f"Bearer {token}"}
    course_slug = f"fs-{new_uuid()[:6]}"
    try:
        course_id = client.post(
            "/api/v1/owner/courses",
            headers=headers,
            json={"name": "Full Stack", "slug": course_slug},
        ).json()["data"]["id"]

        m1 = client.post(
            f"/api/v1/owner/courses/{course_id}/modules",
            headers=headers,
            json={"title": "Intro", "sort_order": 0},
        ).json()["data"]
        m2 = client.post(
            f"/api/v1/owner/courses/{course_id}/modules",
            headers=headers,
            json={"title": "Advanced", "sort_order": 1},
        ).json()["data"]

        reorder = client.post(
            f"/api/v1/owner/courses/{course_id}/modules/reorder",
            headers=headers,
            json={"ordered_ids": [m2["id"], m1["id"]]},
        )
        assert reorder.status_code == 200

        modules = client.get(
            f"/api/v1/owner/courses/{course_id}/modules", headers=headers
        ).json()["data"]
        assert modules[0]["id"] == m2["id"]

        chapter_id = client.post(
            f"/api/v1/owner/modules/{m1['id']}/chapters",
            headers=headers,
            json={"title": "Chapter 1"},
        ).json()["data"]["id"]

        lesson = client.post(
            f"/api/v1/owner/chapters/{chapter_id}/lessons",
            headers=headers,
            json={
                "title": "What is Python?",
                "lesson_type": "text",
                "is_free_preview": True,
            },
        )
        assert lesson.status_code == 200

        client.post(f"/api/v1/owner/courses/{course_id}/publish", headers=headers)
        detail = client.get(f"/api/v1/public/{tenant.slug}/courses/{course_slug}")
        assert detail.status_code == 200
        body = detail.json()["data"]
        assert body["slug"] == course_slug
        assert len(body["modules"]) >= 1
        lessons = []
        for module in body["modules"]:
            for chapter in module["chapters"]:
                lessons.extend(chapter["lessons"])
        assert any(lesson["is_free_preview"] is True for lesson in lessons)
    finally:
        _cleanup(db, tenant.id)


@requires_db
def test_program_create_and_link_course(client: TestClient, db: Session):
    owner, tenant, token = _owner_ctx(db)
    headers = {"Authorization": f"Bearer {token}"}
    try:
        course_id = client.post(
            "/api/v1/owner/courses",
            headers=headers,
            json={"name": "Linked Course", "slug": f"link-{new_uuid()[:6]}"},
        ).json()["data"]["id"]

        program = client.post(
            "/api/v1/owner/programs",
            headers=headers,
            json={
                "name": "Career Track",
                "slug": f"career-{new_uuid()[:6]}",
                "price": 4999,
            },
        )
        assert program.status_code == 200
        program_id = program.json()["data"]["id"]

        linked = client.post(
            f"/api/v1/owner/programs/{program_id}/courses",
            headers=headers,
            json={"course_id": course_id, "sort_order": 0},
        )
        assert linked.status_code == 200
        assert linked.json()["data"]["course_id"] == course_id
    finally:
        _cleanup(db, tenant.id)


@requires_db
def test_invalid_tenant_slug_404(client: TestClient):
    response = client.get("/api/v1/public/does-not-exist-academy/courses")
    assert response.status_code == 404
