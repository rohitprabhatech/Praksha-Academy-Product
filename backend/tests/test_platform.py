"""Platform admin API tests (Sprint 04)."""

from __future__ import annotations

from datetime import datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, check_database_connection
from app.core.security import create_access_token, hash_password, utcnow_naive
from app.main import create_app
from app.models.audit import PlatformAuditLog
from app.models.platform import PlatformSetting, SubscriptionPlan, Tenant, TenantSubscription
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
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client


def _ensure_role(db: Session, scope: str, code: str, name: str) -> Role:
    role = db.query(Role).filter(Role.scope == scope, Role.code == code).first()
    if role:
        return role
    role = Role(id=new_uuid(), scope=scope, code=code, name=name, is_system=True)
    db.add(role)
    db.flush()
    return role


def _create_master_admin(db: Session) -> tuple[User, str]:
    email = f"master.{new_uuid()[:8]}@example.com"
    user = User(
        id=new_uuid(),
        tenant_id=None,
        email=email,
        password_hash=hash_password("MasterPass1!"),
        first_name="Master",
        last_name="Admin",
        status="active",
        email_verified_at=utcnow_naive(),
    )
    db.add(user)
    db.flush()
    role = _ensure_role(db, "platform", "master_admin", "Master Admin")
    db.add(
        UserRole(
            id=new_uuid(),
            user_id=user.id,
            role_id=role.id,
            tenant_id=None,
        )
    )
    db.commit()
    token = create_access_token(user.id, None, ["master_admin"])
    return user, token


def _create_owner_token(db: Session) -> tuple[User, Tenant, str]:
    slug = f"own-{new_uuid()[:8]}"
    tenant = Tenant(
        id=new_uuid(),
        tenant_code=slug.upper().replace("-", "")[:10],
        name="Owner Academy",
        slug=slug,
        status="active",
        contact_email=f"contact+{slug}@example.com",
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
    role = _ensure_role(db, "tenant", "owner", "Owner")
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


def _cleanup_user(db: Session, user_id: str) -> None:
    db.query(UserRole).filter(UserRole.user_id == user_id).delete()
    db.query(User).filter(User.id == user_id).delete()
    db.commit()


def _cleanup_tenant_tree(db: Session, tenant_id: str) -> None:
    db.query(PlatformAuditLog).filter(PlatformAuditLog.tenant_id == tenant_id).delete()
    db.query(TenantSubscription).filter(TenantSubscription.tenant_id == tenant_id).delete()
    owner_ids = [
        row[0]
        for row in db.query(User.id).filter(User.tenant_id == tenant_id).all()
    ]
    for uid in owner_ids:
        db.query(UserRole).filter(UserRole.user_id == uid).delete()
    db.query(User).filter(User.tenant_id == tenant_id).delete()
    db.query(Tenant).filter(Tenant.id == tenant_id).delete()
    db.commit()


@requires_db
def test_non_master_gets_403(client: TestClient, db: Session):
    owner, tenant, token = _create_owner_token(db)
    try:
        response = client.get(
            "/api/v1/platform/tenants",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 403
    finally:
        _cleanup_user(db, owner.id)
        _cleanup_tenant_tree(db, tenant.id)


@requires_db
def test_create_list_get_tenant(client: TestClient, db: Session):
    admin, token = _create_master_admin(db)
    headers = {"Authorization": f"Bearer {token}"}
    slug = f"sunrise-{new_uuid()[:8]}"
    tenant_id = None
    try:
        created = client.post(
            "/api/v1/platform/tenants",
            headers=headers,
            json={
                "name": "Sunrise Academy",
                "slug": slug,
                "contact_email": f"contact+{slug}@example.com",
                "owner_first_name": "Ravi",
                "owner_email": f"owner+{slug}@example.com",
                "owner_password": "OwnerPass1!",
            },
        )
        assert created.status_code == 200
        body = created.json()
        assert body["success"] is True
        assert body["data"]["status"] == "pending"
        tenant_id = body["data"]["id"]

        listed = client.get("/api/v1/platform/tenants", headers=headers)
        assert listed.status_code == 200
        assert any(item["id"] == tenant_id for item in listed.json()["data"]["items"])

        detail = client.get(f"/api/v1/platform/tenants/{tenant_id}", headers=headers)
        assert detail.status_code == 200
        assert detail.json()["data"]["slug"] == slug

        # Owner user created (fresh DB snapshot)
        db.rollback()
        owner = (
            db.query(User)
            .filter(User.tenant_id == tenant_id, User.email == f"owner+{slug}@example.com")
            .first()
        )
        assert owner is not None
        assert owner.status == "active"
    finally:
        if tenant_id:
            _cleanup_tenant_tree(db, tenant_id)
        db.query(PlatformAuditLog).filter(PlatformAuditLog.actor_user_id == admin.id).delete()
        _cleanup_user(db, admin.id)


@requires_db
def test_tenant_status_transitions(client: TestClient, db: Session):
    admin, token = _create_master_admin(db)
    headers = {"Authorization": f"Bearer {token}"}
    slug = f"flow-{new_uuid()[:8]}"
    tenant_id = None
    try:
        tenant_id = client.post(
            "/api/v1/platform/tenants",
            headers=headers,
            json={
                "name": "Flow Academy",
                "slug": slug,
                "contact_email": f"c+{slug}@example.com",
                "owner_first_name": "Asha",
                "owner_email": f"o+{slug}@example.com",
                "owner_password": "OwnerPass1!",
            },
        ).json()["data"]["id"]

        assert (
            client.patch(
                f"/api/v1/platform/tenants/{tenant_id}/approve", headers=headers
            ).json()["data"]["status"]
            == "trial"
        )
        assert (
            client.patch(
                f"/api/v1/platform/tenants/{tenant_id}/activate", headers=headers
            ).json()["data"]["status"]
            == "active"
        )
        assert (
            client.patch(
                f"/api/v1/platform/tenants/{tenant_id}/suspend", headers=headers
            ).json()["data"]["status"]
            == "suspended"
        )

        # Invalid: suspended -> trial
        bad = client.patch(
            f"/api/v1/platform/tenants/{tenant_id}/approve", headers=headers
        )
        assert bad.status_code == 400

        assert (
            client.patch(
                f"/api/v1/platform/tenants/{tenant_id}/activate", headers=headers
            ).json()["data"]["status"]
            == "active"
        )
        assert (
            client.patch(
                f"/api/v1/platform/tenants/{tenant_id}/cancel", headers=headers
            ).json()["data"]["status"]
            == "cancelled"
        )
    finally:
        if tenant_id:
            _cleanup_tenant_tree(db, tenant_id)
        db.query(PlatformAuditLog).filter(PlatformAuditLog.actor_user_id == admin.id).delete()
        _cleanup_user(db, admin.id)


@requires_db
def test_duplicate_slug_conflict(client: TestClient, db: Session):
    admin, token = _create_master_admin(db)
    headers = {"Authorization": f"Bearer {token}"}
    slug = f"dup-{new_uuid()[:8]}"
    tenant_id = None
    try:
        first = client.post(
            "/api/v1/platform/tenants",
            headers=headers,
            json={
                "name": "Dup One",
                "slug": slug,
                "contact_email": f"c1+{slug}@example.com",
                "owner_first_name": "One",
                "owner_email": f"o1+{slug}@example.com",
                "owner_password": "OwnerPass1!",
            },
        )
        assert first.status_code == 200
        tenant_id = first.json()["data"]["id"]

        second = client.post(
            "/api/v1/platform/tenants",
            headers=headers,
            json={
                "name": "Dup Two",
                "slug": slug,
                "contact_email": f"c2+{slug}@example.com",
                "owner_first_name": "Two",
                "owner_email": f"o2+{slug}@example.com",
                "owner_password": "OwnerPass1!",
            },
        )
        assert second.status_code == 409
    finally:
        if tenant_id:
            _cleanup_tenant_tree(db, tenant_id)
        db.query(PlatformAuditLog).filter(PlatformAuditLog.actor_user_id == admin.id).delete()
        _cleanup_user(db, admin.id)


@requires_db
def test_plans_crud_and_assign(client: TestClient, db: Session):
    admin, token = _create_master_admin(db)
    headers = {"Authorization": f"Bearer {token}"}
    slug = f"plan-{new_uuid()[:8]}"
    code = f"pro-{new_uuid()[:6]}"
    tenant_id = None
    plan_id = None
    try:
        tenant_id = client.post(
            "/api/v1/platform/tenants",
            headers=headers,
            json={
                "name": "Plan Academy",
                "slug": slug,
                "contact_email": f"c+{slug}@example.com",
                "owner_first_name": "Plan",
                "owner_email": f"o+{slug}@example.com",
                "owner_password": "OwnerPass1!",
            },
        ).json()["data"]["id"]

        created = client.post(
            "/api/v1/platform/plans",
            headers=headers,
            json={
                "code": code,
                "name": "Pro Plan",
                "monthly_price": 1999,
                "annual_price": 19999,
                "max_students": 500,
            },
        )
        assert created.status_code == 200
        plan_id = created.json()["data"]["id"]

        listed = client.get("/api/v1/platform/plans", headers=headers)
        assert any(p["id"] == plan_id for p in listed.json()["data"])

        updated = client.put(
            f"/api/v1/platform/plans/{plan_id}",
            headers=headers,
            json={"name": "Pro Plus", "monthly_price": 2499},
        )
        assert updated.status_code == 200
        assert updated.json()["data"]["name"] == "Pro Plus"

        assigned = client.post(
            f"/api/v1/platform/tenants/{tenant_id}/subscription",
            headers=headers,
            json={
                "plan_id": plan_id,
                "billing_cycle": "monthly",
                "starts_at": datetime.utcnow().isoformat(),
                "ends_at": (datetime.utcnow() + timedelta(days=30)).isoformat(),
            },
        )
        assert assigned.status_code == 200
        assert assigned.json()["data"]["plan_id"] == plan_id

        deleted = client.delete(f"/api/v1/platform/plans/{plan_id}", headers=headers)
        assert deleted.status_code == 200
        db.rollback()
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
        assert plan is not None
        assert plan.status == "archived"
        assert plan.deleted_at is not None
    finally:
        if plan_id:
            db.query(TenantSubscription).filter(
                TenantSubscription.plan_id == plan_id
            ).delete()
            db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).delete()
            db.commit()
        if tenant_id:
            _cleanup_tenant_tree(db, tenant_id)
        db.query(PlatformAuditLog).filter(PlatformAuditLog.actor_user_id == admin.id).delete()
        _cleanup_user(db, admin.id)


@requires_db
def test_settings_and_audit(client: TestClient, db: Session):
    admin, token = _create_master_admin(db)
    headers = {"Authorization": f"Bearer {token}"}
    key = f"feature_flag_{new_uuid()[:8]}"
    try:
        saved = client.put(
            f"/api/v1/platform/settings/{key}",
            headers=headers,
            json={"value": {"enabled": True}, "description": "test flag"},
        )
        assert saved.status_code == 200
        assert saved.json()["data"]["setting_value"] == {"enabled": True}

        listed = client.get("/api/v1/platform/settings", headers=headers)
        assert listed.status_code == 200
        assert any(s["setting_key"] == key for s in listed.json()["data"])

        logs = client.get("/api/v1/platform/audit-logs", headers=headers)
        assert logs.status_code == 200
        assert logs.json()["data"]["total"] >= 1
    finally:
        db.query(PlatformSetting).filter(PlatformSetting.setting_key == key).delete()
        db.query(PlatformAuditLog).filter(PlatformAuditLog.actor_user_id == admin.id).delete()
        _cleanup_user(db, admin.id)
        db.commit()


@requires_db
def test_soft_delete_tenant(client: TestClient, db: Session):
    admin, token = _create_master_admin(db)
    headers = {"Authorization": f"Bearer {token}"}
    slug = f"del-{new_uuid()[:8]}"
    tenant_id = None
    try:
        tenant_id = client.post(
            "/api/v1/platform/tenants",
            headers=headers,
            json={
                "name": "Delete Me",
                "slug": slug,
                "contact_email": f"c+{slug}@example.com",
                "owner_first_name": "Del",
                "owner_email": f"o+{slug}@example.com",
                "owner_password": "OwnerPass1!",
            },
        ).json()["data"]["id"]

        deleted = client.delete(f"/api/v1/platform/tenants/{tenant_id}", headers=headers)
        assert deleted.status_code == 200

        missing = client.get(f"/api/v1/platform/tenants/{tenant_id}", headers=headers)
        assert missing.status_code == 404
    finally:
        if tenant_id:
            _cleanup_tenant_tree(db, tenant_id)
        db.query(PlatformAuditLog).filter(PlatformAuditLog.actor_user_id == admin.id).delete()
        _cleanup_user(db, admin.id)
        db.commit()
