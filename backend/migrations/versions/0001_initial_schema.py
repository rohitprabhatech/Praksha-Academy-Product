"""Initial schema baseline from database/schema.sql.

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-09-03

This revision is the Alembic baseline for Sprint 02.

- If the database already contains tables (typical local setup where
  schema.sql was applied manually), upgrade() is a no-op.
- If the database is empty, upgrade() applies database/schema.sql
  (CREATE DATABASE / USE statements are skipped; DB must already exist).

After applying to an existing populated DB, run:
  alembic stamp 0001_initial_schema
"""

from __future__ import annotations

from pathlib import Path

import sqlalchemy as sa
from alembic import op

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None

SCHEMA_PATH = Path(__file__).resolve().parents[2] / "database" / "schema.sql"


def _split_sql_statements(sql: str) -> list[str]:
    """Split schema.sql into executable statements (simple ; splitter)."""
    statements: list[str] = []
    buffer: list[str] = []
    for raw_line in sql.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("--"):
            continue
        upper = line.upper()
        if upper.startswith("CREATE DATABASE") or upper.startswith("USE "):
            continue
        buffer.append(raw_line)
        if line.endswith(";"):
            statement = "\n".join(buffer).strip().rstrip(";").strip()
            buffer = []
            if statement:
                statements.append(statement)
    if buffer:
        statement = "\n".join(buffer).strip().rstrip(";").strip()
        if statement:
            statements.append(statement)
    return statements


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    if inspector.has_table("tenants"):
        # Schema already present (e.g. applied via schema.sql).
        return

    if not SCHEMA_PATH.exists():
        raise FileNotFoundError(f"Schema file not found: {SCHEMA_PATH}")

    sql = SCHEMA_PATH.read_text(encoding="utf-8")
    for statement in _split_sql_statements(sql):
        bind.execute(sa.text(statement))


def downgrade() -> None:
    raise NotImplementedError(
        "Baseline schema downgrade is not supported. "
        "Restore from backup or drop the database deliberately."
    )
