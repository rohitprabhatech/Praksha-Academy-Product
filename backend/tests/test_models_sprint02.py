"""Sprint 02 — model metadata and live DB alignment tests."""

from __future__ import annotations

import os
from pathlib import Path

import pytest
from sqlalchemy import inspect, text

from app.core.config import get_settings
from app.core.database import Base, engine
import app.models  # noqa: F401


EXPECTED_TABLE_COUNT = 54

SCHEMA_TABLES = {
    "tenants",
    "subscription_plans",
    "tenant_subscriptions",
    "platform_settings",
    "roles",
    "permissions",
    "role_permissions",
    "users",
    "user_roles",
    "password_reset_tokens",
    "email_verifications",
    "platform_audit_logs",
    "tenant_profiles",
    "teacher_profiles",
    "student_profiles",
    "academic_classes",
    "subjects",
    "batches",
    "courses",
    "course_teachers",
    "course_modules",
    "course_chapters",
    "course_lessons",
    "enrollments",
    "lesson_progress",
    "study_materials",
    "live_classes",
    "assignments",
    "assignment_submissions",
    "quizzes",
    "quiz_questions",
    "quiz_question_options",
    "quiz_attempts",
    "quiz_answers",
    "exams",
    "exam_questions",
    "exam_question_options",
    "exam_attempts",
    "exam_answers",
    "marks",
    "attendance_records",
    "payments",
    "coupons",
    "coupon_redemptions",
    "wishlist_items",
    "certificates",
    "blog_posts",
    "gallery_items",
    "faqs",
    "testimonials",
    "notifications",
    "notification_recipients",
    "contact_messages",
    "tenant_audit_logs",
}


def test_metadata_registers_all_schema_tables():
    assert len(Base.metadata.tables) == EXPECTED_TABLE_COUNT
    assert set(Base.metadata.tables.keys()) == SCHEMA_TABLES


def test_core_model_imports():
    from app.models import (
        AttendanceRecord,
        Course,
        Enrollment,
        Role,
        Tenant,
        User,
    )

    assert Tenant.__tablename__ == "tenants"
    assert User.__tablename__ == "users"
    assert Role.__tablename__ == "roles"
    assert Course.__tablename__ == "courses"
    assert Enrollment.__tablename__ == "enrollments"
    assert AttendanceRecord.__tablename__ == "attendance_records"


def test_users_unique_constraint_present():
    table = Base.metadata.tables["users"]
    constraint_names = {c.name for c in table.constraints if c.name}
    assert "uk_users_tenant_email" in constraint_names


def test_attendance_unique_constraint_present():
    table = Base.metadata.tables["attendance_records"]
    constraint_names = {c.name for c in table.constraints if c.name}
    assert "uk_attendance_session" in constraint_names


def test_schema_sql_file_exists():
    path = Path(__file__).resolve().parents[1] / "database" / "schema.sql"
    assert path.exists()
    text_content = path.read_text(encoding="utf-8")
    assert text_content.count("CREATE TABLE") == EXPECTED_TABLE_COUNT


def test_alembic_baseline_revision_exists():
    path = (
        Path(__file__).resolve().parents[1]
        / "migrations"
        / "versions"
        / "0001_initial_schema.py"
    )
    assert path.exists()
    content = path.read_text(encoding="utf-8")
    assert 'revision = "0001_initial_schema"' in content


@pytest.fixture(scope="module")
def live_db_available() -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


def test_live_db_table_count_matches_models(live_db_available):
    if not live_db_available:
        pytest.skip("Live database not available")

    inspector = inspect(engine)
    db_tables = {
        name
        for name in inspector.get_table_names()
        if name != "alembic_version"
    }
    assert len(db_tables) == EXPECTED_TABLE_COUNT
    assert db_tables == SCHEMA_TABLES


def test_live_db_users_columns_include_tenant_and_password(live_db_available):
    if not live_db_available:
        pytest.skip("Live database not available")

    inspector = inspect(engine)
    columns = {col["name"] for col in inspector.get_columns("users")}
    assert {"id", "tenant_id", "email", "password_hash", "status"}.issubset(columns)


def test_settings_point_to_configured_database():
    settings = get_settings()
    assert settings.db_name
    assert "mysql+pymysql://" in settings.database_url
