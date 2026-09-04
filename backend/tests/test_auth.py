"""Auth unit + integration tests (Sprint 03)."""

from __future__ import annotations

from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import SessionLocal, check_database_connection
from app.core.security import (
    create_access_token,
    generate_otp,
    generate_refresh_token,
    hash_password,
    hash_token,
    utcnow_naive,
    verify_password,
)
from app.main import create_app
from app.models.auth_tokens import RefreshToken, UserSession
from app.models.platform import Tenant
from app.models.rbac import Role
from app.models.user import EmailVerification, PasswordResetToken, User, UserRole
from app.utils.ids import new_uuid


requires_db = pytest.mark.skipif(
    not check_database_connection(),
    reason="MySQL is not available",
)


# ─── Unit tests (no DB) ───────────────────────────────────────────────────────


def test_generate_otp_is_six_digits():
    plain, hashed = generate_otp()
    assert plain.isdigit()
    assert len(plain) == 6
    assert hashed == hash_token(plain)


def test_generate_refresh_token_pair():
    raw, hashed = generate_refresh_token()
    assert raw != hashed
    assert hashed == hash_token(raw)


def test_access_token_contains_roles_and_tenant():
    token = create_access_token("u1", "t1", ["owner", "teacher"])
    from app.core.security import decode_access_token

    payload = decode_access_token(token)
    assert payload["sub"] == "u1"
    assert payload["tenant_id"] == "t1"
    assert payload["roles"] == ["owner", "teacher"]
    assert payload["type"] == "access"


def test_me_requires_auth(client: TestClient):
    response = client.get("/api/v1/auth/me")
    assert response.status_code in {401, 403}


def test_login_validation_error(client: TestClient):
    response = client.post("/api/v1/auth/login", json={"email": "bad", "password": ""})
    assert response.status_code == 422
    body = response.json()
    assert body["success"] is False


# ─── DB helpers ───────────────────────────────────────────────────────────────


@pytest.fixture()
def db() -> Session:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def _ensure_role(db: Session, scope: str, code: str, name: str) -> Role:
    role = db.query(Role).filter(Role.scope == scope, Role.code == code).first()
    if role:
        return role
    role = Role(id=new_uuid(), scope=scope, code=code, name=name, is_system=True)
    db.add(role)
    db.flush()
    return role


def _create_tenant(db: Session, slug: str) -> Tenant:
    tenant = Tenant(
        id=new_uuid(),
        tenant_code=slug.upper().replace("-", "")[:10],
        name=f"Academy {slug}",
        slug=slug,
        status="active",
        contact_email=f"admin+{slug}@example.com",
    )
    db.add(tenant)
    db.flush()
    return tenant


def _unique_email(prefix: str) -> str:
    return f"{prefix}.{new_uuid()[:8]}@example.com"


def _create_user(
    db: Session,
    *,
    email: str,
    password: str,
    tenant_id: str | None,
    role_code: str,
    role_scope: str,
    status: str = "active",
) -> User:
    user = User(
        id=new_uuid(),
        tenant_id=tenant_id,
        email=email.lower(),
        password_hash=hash_password(password),
        first_name="Test",
        last_name="User",
        status=status,
        email_verified_at=utcnow_naive() if status == "active" else None,
    )
    db.add(user)
    db.flush()

    role = _ensure_role(db, role_scope, role_code, role_code.title())
    db.add(
        UserRole(
            id=new_uuid(),
            user_id=user.id,
            role_id=role.id,
            tenant_id=tenant_id,
        )
    )
    db.commit()
    db.refresh(user)
    return user


def _cleanup_user(db: Session, user_id: str) -> None:
    db.query(EmailVerification).filter(EmailVerification.user_id == user_id).delete()
    db.query(PasswordResetToken).filter(PasswordResetToken.user_id == user_id).delete()
    db.query(UserSession).filter(UserSession.user_id == user_id).delete()
    db.query(RefreshToken).filter(RefreshToken.user_id == user_id).delete()
    db.query(UserRole).filter(UserRole.user_id == user_id).delete()
    db.query(User).filter(User.id == user_id).delete()
    db.commit()


@pytest.fixture()
def auth_client() -> TestClient:
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client


# ─── Integration tests ────────────────────────────────────────────────────────


@requires_db
def test_login_success(auth_client: TestClient, db: Session):
    slug = f"auth-login-{new_uuid()[:8]}"
    tenant = _create_tenant(db, slug)
    email = _unique_email("owner")
    password = "OwnerPass1!"
    user = _create_user(
        db,
        email=email,
        password=password,
        tenant_id=tenant.id,
        role_code="owner",
        role_scope="tenant",
    )
    try:
        response = auth_client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password, "tenant_slug": slug},
        )
        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        assert body["data"]["access_token"]
        assert body["data"]["refresh_token"]
        assert body["data"]["user"]["email"] == email
        assert "owner" in body["data"]["user"]["roles"]
    finally:
        _cleanup_user(db, user.id)
        db.query(Tenant).filter(Tenant.id == tenant.id).delete()
        db.commit()


@requires_db
def test_login_wrong_password(auth_client: TestClient, db: Session):
    slug = f"auth-badpw-{new_uuid()[:8]}"
    tenant = _create_tenant(db, slug)
    email = _unique_email("owner")
    user = _create_user(
        db,
        email=email,
        password="CorrectPass1!",
        tenant_id=tenant.id,
        role_code="owner",
        role_scope="tenant",
    )
    try:
        response = auth_client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": "WrongPass1!", "tenant_slug": slug},
        )
        assert response.status_code == 401
        assert response.json()["success"] is False
    finally:
        _cleanup_user(db, user.id)
        db.query(Tenant).filter(Tenant.id == tenant.id).delete()
        db.commit()


@requires_db
def test_login_suspended_user(auth_client: TestClient, db: Session):
    slug = f"auth-susp-{new_uuid()[:8]}"
    tenant = _create_tenant(db, slug)
    email = _unique_email("owner")
    user = _create_user(
        db,
        email=email,
        password="OwnerPass1!",
        tenant_id=tenant.id,
        role_code="owner",
        role_scope="tenant",
        status="suspended",
    )
    try:
        response = auth_client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": "OwnerPass1!", "tenant_slug": slug},
        )
        assert response.status_code == 403
    finally:
        _cleanup_user(db, user.id)
        db.query(Tenant).filter(Tenant.id == tenant.id).delete()
        db.commit()


@requires_db
def test_refresh_and_logout(auth_client: TestClient, db: Session):
    slug = f"auth-rt-{new_uuid()[:8]}"
    tenant = _create_tenant(db, slug)
    email = _unique_email("owner")
    password = "OwnerPass1!"
    user = _create_user(
        db,
        email=email,
        password=password,
        tenant_id=tenant.id,
        role_code="owner",
        role_scope="tenant",
    )
    try:
        login = auth_client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password, "tenant_slug": slug},
        ).json()["data"]
        access = login["access_token"]
        refresh = login["refresh_token"]

        refreshed = auth_client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh},
        )
        assert refreshed.status_code == 200
        assert refreshed.json()["data"]["access_token"]

        logout = auth_client.post(
            "/api/v1/auth/logout",
            json={"refresh_token": refresh},
            headers={"Authorization": f"Bearer {access}"},
        )
        assert logout.status_code == 200

        again = auth_client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": refresh},
        )
        assert again.status_code == 401
    finally:
        _cleanup_user(db, user.id)
        db.query(Tenant).filter(Tenant.id == tenant.id).delete()
        db.commit()


@requires_db
def test_get_and_update_me(auth_client: TestClient, db: Session):
    slug = f"auth-me-{new_uuid()[:8]}"
    tenant = _create_tenant(db, slug)
    email = _unique_email("owner")
    password = "OwnerPass1!"
    user = _create_user(
        db,
        email=email,
        password=password,
        tenant_id=tenant.id,
        role_code="owner",
        role_scope="tenant",
    )
    try:
        login = auth_client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password, "tenant_slug": slug},
        ).json()["data"]
        headers = {"Authorization": f"Bearer {login['access_token']}"}

        me = auth_client.get("/api/v1/auth/me", headers=headers)
        assert me.status_code == 200
        assert me.json()["data"]["email"] == email

        updated = auth_client.put(
            "/api/v1/auth/me",
            headers=headers,
            json={"first_name": "Updated", "phone": "9999999999"},
        )
        assert updated.status_code == 200
        assert updated.json()["data"]["first_name"] == "Updated"
        assert updated.json()["data"]["phone"] == "9999999999"
    finally:
        _cleanup_user(db, user.id)
        db.query(Tenant).filter(Tenant.id == tenant.id).delete()
        db.commit()


@requires_db
def test_password_reset_flow(auth_client: TestClient, db: Session):
    slug = f"auth-pw-{new_uuid()[:8]}"
    tenant = _create_tenant(db, slug)
    email = _unique_email("owner")
    password = "OwnerPass1!"
    user = _create_user(
        db,
        email=email,
        password=password,
        tenant_id=tenant.id,
        role_code="owner",
        role_scope="tenant",
    )
    try:
        # Create reset token directly (email prints in dev; we seed hash)
        plain, hashed = generate_otp()
        db.add(
            PasswordResetToken(
                id=new_uuid(),
                user_id=user.id,
                token_hash=hashed,
                expires_at=utcnow_naive() + timedelta(minutes=30),
            )
        )
        db.commit()

        reset = auth_client.post(
            "/api/v1/auth/reset-password",
            json={"token": plain, "new_password": "NewPass123!"},
        )
        assert reset.status_code == 200

        old_login = auth_client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password, "tenant_slug": slug},
        )
        assert old_login.status_code == 401

        new_login = auth_client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": "NewPass123!", "tenant_slug": slug},
        )
        assert new_login.status_code == 200
    finally:
        _cleanup_user(db, user.id)
        db.query(Tenant).filter(Tenant.id == tenant.id).delete()
        db.commit()


@requires_db
def test_verify_email_flow(auth_client: TestClient, db: Session):
    slug = f"auth-otp-{new_uuid()[:8]}"
    tenant = _create_tenant(db, slug)
    email = _unique_email("pending")
    user = _create_user(
        db,
        email=email,
        password="PendingPass1!",
        tenant_id=tenant.id,
        role_code="student",
        role_scope="tenant",
        status="pending",
    )
    user_id = user.id
    try:
        plain, hashed = generate_otp()
        db.add(
            EmailVerification(
                id=new_uuid(),
                user_id=user_id,
                otp_hash=hashed,
                purpose="registration",
                expires_at=utcnow_naive() + timedelta(minutes=15),
            )
        )
        db.commit()

        bad = auth_client.post(
            "/api/v1/auth/verify-email",
            json={"user_id": user_id, "otp": "000000"},
        )
        assert bad.status_code == 400

        ok = auth_client.post(
            "/api/v1/auth/verify-email",
            json={"user_id": user_id, "otp": plain},
        )
        assert ok.status_code == 200

        db.expire_all()
        refreshed = db.query(User).filter(User.id == user_id).first()
        assert refreshed is not None
        assert refreshed.status == "active"
        assert refreshed.email_verified_at is not None
    finally:
        _cleanup_user(db, user_id)
        db.query(Tenant).filter(Tenant.id == tenant.id).delete()
        db.commit()


@requires_db
def test_forgot_password_always_succeeds(auth_client: TestClient):
    response = auth_client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "nobody-exists@example.com"},
    )
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_settings_token_config():
    settings = get_settings()
    assert settings.access_token_expire_minutes > 0
    assert settings.refresh_token_expire_days > 0
    assert verify_password("x", hash_password("x"))
