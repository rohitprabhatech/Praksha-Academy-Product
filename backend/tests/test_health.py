"""Sprint 01 — health and foundation tests."""

from app.core.config import get_settings
from app.core.response import error_response, success_response
from app.core.security import (
    create_access_token,
    hash_password,
    safe_decode_token,
    verify_password,
)
from app.utils.ids import generate_uuid


def test_root_returns_success_envelope(client):
    response = client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert "data" in body
    assert body["data"]["health"] == "/api/v1/health"


def test_health_endpoint_envelope(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["message"]
    assert "data" in body
    assert body["data"]["app"]
    assert body["data"]["version"]
    assert body["data"]["database"] in {"up", "down"}
    assert body["data"]["status"] in {"ok", "degraded"}


def test_ready_endpoint_status_codes(client):
    response = client.get("/api/v1/ready")
    # Without a live MySQL instance, readiness should be 503 in local CI.
    assert response.status_code in {200, 503}
    body = response.json()
    assert "success" in body
    assert "message" in body


def test_unknown_route_uses_error_envelope(client):
    response = client.get("/api/v1/does-not-exist")
    assert response.status_code == 404
    body = response.json()
    assert body["success"] is False
    assert "message" in body
    assert "errors" in body


def test_password_hashing_roundtrip():
    password = "Sprint01-Test!"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong-password", hashed) is False


def test_jwt_create_and_decode():
    token = create_access_token(
        subject="user-uuid-demo",
        claims={"role": "owner", "tenant_id": None},
    )
    payload = safe_decode_token(token)
    assert payload is not None
    assert payload["sub"] == "user-uuid-demo"
    assert payload["type"] == "access"
    assert payload["role"] == "owner"


def test_generate_uuid_format():
    value = generate_uuid()
    assert isinstance(value, str)
    assert len(value) == 36


def test_settings_database_url_contains_mysql():
    settings = get_settings()
    assert settings.database_url.startswith("mysql+pymysql://")
    assert settings.api_v1_prefix == "/api/v1"


def test_success_and_error_helpers():
    ok = success_response(data={"ping": "pong"}, message="works")
    assert ok.status_code == 200
    assert ok.body

    err = error_response("bad", errors={"field": "required"}, status_code=400)
    assert err.status_code == 400
