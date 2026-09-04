"""Add course_lessons.is_free_preview if missing."""

from alembic import op
from sqlalchemy import inspect

revision = "0004_lesson_free_preview"
down_revision = "0003_batches_max_students"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    columns = {col["name"] for col in inspect(bind).get_columns("course_lessons")}
    if "is_free_preview" not in columns:
        op.execute(
            """
            ALTER TABLE course_lessons
            ADD COLUMN is_free_preview TINYINT(1) NOT NULL DEFAULT 0
            AFTER duration_minutes
            """
        )


def downgrade() -> None:
    bind = op.get_bind()
    columns = {col["name"] for col in inspect(bind).get_columns("course_lessons")}
    if "is_free_preview" in columns:
        op.execute("ALTER TABLE course_lessons DROP COLUMN is_free_preview")
