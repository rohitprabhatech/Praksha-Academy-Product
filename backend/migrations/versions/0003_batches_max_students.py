"""Add batches.max_students column if missing."""

from alembic import op
from sqlalchemy import inspect

revision = "0003_batches_max_students"
down_revision = "0002_new_tables"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    columns = {col["name"] for col in inspect(bind).get_columns("batches")}
    if "max_students" not in columns:
        op.execute(
            """
            ALTER TABLE batches
            ADD COLUMN max_students INT UNSIGNED NULL
            AFTER end_date
            """
        )


def downgrade() -> None:
    bind = op.get_bind()
    columns = {col["name"] for col in inspect(bind).get_columns("batches")}
    if "max_students" in columns:
        op.execute("ALTER TABLE batches DROP COLUMN max_students")
