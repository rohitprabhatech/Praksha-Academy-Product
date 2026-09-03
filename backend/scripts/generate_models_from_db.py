"""Generate SQLAlchemy models from the live MySQL information_schema.

Run from backend/:
  .venv\\Scripts\\python.exe scripts\\generate_models_from_db.py
"""

from __future__ import annotations

import os
import re
from collections import defaultdict
from pathlib import Path

import pymysql
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

MODELS_DIR = ROOT / "app" / "models"

# Table → module file mapping
MODULE_MAP = {
    "tenants": "platform",
    "subscription_plans": "platform",
    "tenant_subscriptions": "platform",
    "platform_settings": "platform",
    "roles": "rbac",
    "permissions": "rbac",
    "role_permissions": "rbac",
    "users": "user",
    "user_roles": "user",
    "password_reset_tokens": "user",
    "email_verifications": "user",
    "platform_audit_logs": "audit",
    "tenant_audit_logs": "audit",
    "tenant_profiles": "tenant",
    "teacher_profiles": "profiles",
    "student_profiles": "profiles",
    "academic_classes": "academic",
    "subjects": "academic",
    "batches": "academic",
    "courses": "course",
    "course_teachers": "course",
    "course_modules": "course",
    "course_chapters": "course",
    "course_lessons": "course",
    "enrollments": "enrollment",
    "lesson_progress": "enrollment",
    "study_materials": "learning",
    "live_classes": "learning",
    "assignments": "assessment",
    "assignment_submissions": "assessment",
    "quizzes": "quiz",
    "quiz_questions": "quiz",
    "quiz_question_options": "quiz",
    "quiz_attempts": "quiz",
    "quiz_answers": "quiz",
    "exams": "exam",
    "exam_questions": "exam",
    "exam_question_options": "exam",
    "exam_attempts": "exam",
    "exam_answers": "exam",
    "marks": "marks",
    "attendance_records": "attendance",
    "payments": "commerce",
    "coupons": "commerce",
    "coupon_redemptions": "commerce",
    "wishlist_items": "commerce",
    "certificates": "commerce",
    "blog_posts": "cms",
    "gallery_items": "cms",
    "faqs": "cms",
    "testimonials": "cms",
    "notifications": "notification",
    "notification_recipients": "notification",
    "contact_messages": "cms",
}

SQL_TYPE_MAP = {
    "char": "String",
    "varchar": "String",
    "text": "Text",
    "mediumtext": "Text",
    "longtext": "Text",
    "tinyint": "Boolean",  # overridden when not boolean-like
    "smallint": "Integer",
    "int": "Integer",
    "integer": "Integer",
    "bigint": "BigInteger",
    "decimal": "Numeric",
    "float": "Float",
    "double": "Float",
    "date": "Date",
    "time": "Time",
    "datetime": "DateTime",
    "timestamp": "DateTime",
    "json": "JSON",
    "enum": "Enum",
}


def to_class_name(table: str) -> str:
    return "".join(part.capitalize() for part in table.split("_"))


def connect():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "praksha_academy_saas"),
        cursorclass=pymysql.cursors.DictCursor,
    )


def fetch_schema(conn):
    db = os.getenv("DB_NAME", "praksha_academy_saas")
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE, DATA_TYPE, IS_NULLABLE,
                   COLUMN_DEFAULT, COLUMN_KEY, EXTRA, NUMERIC_PRECISION, NUMERIC_SCALE,
                   CHARACTER_MAXIMUM_LENGTH
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = %s
            ORDER BY TABLE_NAME, ORDINAL_POSITION
            """,
            (db,),
        )
        columns = cur.fetchall()

        cur.execute(
            """
            SELECT TABLE_NAME, INDEX_NAME, NON_UNIQUE, GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS cols
            FROM information_schema.STATISTICS
            WHERE TABLE_SCHEMA = %s
            GROUP BY TABLE_NAME, INDEX_NAME, NON_UNIQUE
            """,
            (db,),
        )
        indexes = cur.fetchall()

        cur.execute(
            """
            SELECT TABLE_NAME, CONSTRAINT_NAME, COLUMN_NAME,
                   REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = %s AND REFERENCED_TABLE_NAME IS NOT NULL
            ORDER BY TABLE_NAME, CONSTRAINT_NAME, ORDINAL_POSITION
            """,
            (db,),
        )
        fks = cur.fetchall()

    return columns, indexes, fks


def parse_enum(column_type: str) -> list[str]:
    match = re.match(r"enum\((.*)\)", column_type, re.I)
    if not match:
        return []
    return re.findall(r"'([^']*)'", match.group(1))


def column_sa(col: dict) -> str:
    name = col["COLUMN_NAME"]
    data_type = col["DATA_TYPE"].lower()
    column_type = col["COLUMN_TYPE"].lower()
    nullable = col["IS_NULLABLE"] == "YES"
    primary = col["COLUMN_KEY"] == "PRI"
    extra = (col["EXTRA"] or "").lower()

    args = []
    kwargs = []

    if data_type == "enum":
        values = parse_enum(column_type)
        enum_name = f"{to_class_name(name)}Enum"  # local; we'll inline values
        vals = ", ".join(repr(v) for v in values)
        type_expr = f"Enum({vals}, name='{name}_enum', native_enum=False)"
        # Use VARCHAR storage via native_enum=False with create_constraint - actually for MySQL
        # better: sa.Enum(*values, name=f"ck_{table}_{name}") 
        # We'll pass table later - for now use String with values documented
        type_expr = f"SAEnum({vals}, name=None, native_enum=True)"
    elif data_type in {"char", "varchar"}:
        length = col["CHARACTER_MAXIMUM_LENGTH"] or 255
        type_expr = f"String({length})"
    elif data_type in {"text", "mediumtext", "longtext"}:
        type_expr = "Text"
    elif data_type == "tinyint":
        # MySQL boolean often tinyint(1)
        if "tinyint(1)" in column_type:
            type_expr = "Boolean"
        else:
            type_expr = "Integer"
    elif data_type in {"int", "integer", "smallint"}:
        type_expr = "Integer"
        if "unsigned" in column_type:
            kwargs.append("nullable=False" if not nullable else "")
            # use Integer; unsigned handled loosely
    elif data_type == "bigint":
        type_expr = "BigInteger"
    elif data_type == "decimal":
        p = col["NUMERIC_PRECISION"] or 10
        s = col["NUMERIC_SCALE"] or 0
        type_expr = f"Numeric({p}, {s})"
    elif data_type == "date":
        type_expr = "Date"
    elif data_type == "time":
        type_expr = "Time"
    elif data_type in {"datetime", "timestamp"}:
        type_expr = "DateTime(timezone=False)"
    elif data_type == "json":
        type_expr = "JSON"
    else:
        type_expr = "Text"

    args.append(type_expr)

    if primary:
        kwargs.append("primary_key=True")
    if not nullable and not primary:
        kwargs.append("nullable=False")
    elif nullable and not primary:
        kwargs.append("nullable=True")

    if "auto_increment" in extra:
        kwargs.append("autoincrement=True")

    default = col["COLUMN_DEFAULT"]
    if default is not None and default != "NULL":
        if default.upper() == "CURRENT_TIMESTAMP" or default.upper().startswith("CURRENT_TIMESTAMP"):
            if "on update" in extra:
                kwargs.append("server_default=func.now()")
                kwargs.append("onupdate=func.now()")
            else:
                kwargs.append("server_default=func.current_timestamp()")
        elif data_type == "tinyint" and "tinyint(1)" in column_type:
            kwargs.append(f"server_default='{default}'")
        elif data_type == "enum":
            kwargs.append(f"server_default='{default}'")
        elif data_type in {"int", "bigint", "decimal", "tinyint"}:
            kwargs.append(f"server_default='{default}'")
        else:
            # quote string defaults
            cleaned = default.strip("'")
            kwargs.append(f"server_default='{cleaned}'")
    elif "on update current_timestamp" in extra:
        kwargs.append("server_default=func.now()")
        kwargs.append("onupdate=func.now()")

    kwargs = [k for k in kwargs if k]
    call = ", ".join(args + kwargs)
    return f"    {name} = mapped_column({call})"


def render_module(module: str, tables: dict[str, list], indexes, fks_by_table) -> str:
    lines = [
        '"""SQLAlchemy models — auto-aligned to MySQL schema (Sprint 02)."""',
        "",
        "from __future__ import annotations",
        "",
        "from datetime import date, datetime, time",
        "from decimal import Decimal",
        "from typing import Any, Optional",
        "",
        "from sqlalchemy import (",
        "    JSON,",
        "    BigInteger,",
        "    Boolean,",
        "    Date,",
        "    DateTime,",
        "    Enum as SAEnum,",
        "    ForeignKey,",
        "    Integer,",
        "    Numeric,",
        "    String,",
        "    Text,",
        "    Time,",
        "    UniqueConstraint,",
        "    func,",
        ")",
        "from sqlalchemy.orm import Mapped, mapped_column, relationship",
        "",
        "from app.core.database import Base",
        "",
        "",
    ]

    for table, cols in tables.items():
        class_name = to_class_name(table)
        lines.append(f"class {class_name}(Base):")
        lines.append(f'    __tablename__ = "{table}"')

        # unique constraints from indexes (non-primary unique)
        uq_lines = []
        for idx in indexes:
            if idx["TABLE_NAME"] != table:
                continue
            if idx["INDEX_NAME"] == "PRIMARY":
                continue
            if int(idx["NON_UNIQUE"]) == 0:
                cols_list = idx["cols"].split(",")
                if len(cols_list) > 1 or (len(cols_list) == 1 and cols_list[0] != "id"):
                    col_repr = ", ".join(repr(c) for c in cols_list)
                    uq_lines.append(
                        f'        UniqueConstraint({col_repr}, name="{idx["INDEX_NAME"]}"),'
                    )
        if uq_lines:
            lines.append("    __table_args__ = (")
            lines.extend(uq_lines)
            lines.append("    )")

        lines.append("")

        # Foreign keys map by column
        fk_map = defaultdict(list)
        for fk in fks_by_table.get(table, []):
            fk_map[fk["COLUMN_NAME"]].append(fk)

        for col in cols:
            name = col["COLUMN_NAME"]
            # rebuild with FK if needed
            if name in fk_map:
                ref = fk_map[name][0]
                ref_table = ref["REFERENCED_TABLE_NAME"]
                ref_col = ref["REFERENCED_COLUMN_NAME"]
                # emit custom mapped_column with FK
                data_type = col["DATA_TYPE"].lower()
                column_type = col["COLUMN_TYPE"].lower()
                nullable = col["IS_NULLABLE"] == "YES"
                primary = col["COLUMN_KEY"] == "PRI"
                if data_type in {"char", "varchar"}:
                    length = col["CHARACTER_MAXIMUM_LENGTH"] or 36
                    type_expr = f"String({length})"
                else:
                    type_expr = "String(36)"
                parts = [
                    type_expr,
                    f"ForeignKey('{ref_table}.{ref_col}', onupdate='CASCADE')",
                ]
                if primary:
                    parts.append("primary_key=True")
                if not nullable and not primary:
                    parts.append("nullable=False")
                else:
                    if nullable:
                        parts.append("nullable=True")
                lines.append(f"    {name} = mapped_column({', '.join(parts)})")
            else:
                lines.append(column_sa(col))

        lines.append("")
        lines.append("")

    return "\n".join(lines)


def main():
    conn = connect()
    try:
        columns, indexes, fks = fetch_schema(conn)
    finally:
        conn.close()

    by_table: dict[str, list] = defaultdict(list)
    for col in columns:
        by_table[col["TABLE_NAME"]].append(col)

    fks_by_table: dict[str, list] = defaultdict(list)
    for fk in fks:
        fks_by_table[fk["TABLE_NAME"]].append(fk)

    # group by module
    modules: dict[str, dict[str, list]] = defaultdict(dict)
    missing = []
    for table, cols in by_table.items():
        if table == "alembic_version":
            continue
        module = MODULE_MAP.get(table)
        if not module:
            missing.append(table)
            module = "misc"
        modules[module][table] = cols

    if missing:
        print("Unmapped tables (sent to misc):", missing)

    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    all_exports = []
    for module, tables in sorted(modules.items()):
        content = render_module(module, tables, indexes, fks_by_table)
        path = MODELS_DIR / f"{module}.py"
        path.write_text(content + "\n", encoding="utf-8")
        print(f"Wrote {path.relative_to(ROOT)} ({len(tables)} tables)")
        for table in tables:
            all_exports.append(to_class_name(table))

    # Write __init__.py
    import_lines = []
    for module in sorted(modules.keys()):
        classes = [to_class_name(t) for t in sorted(modules[module].keys())]
        import_lines.append(
            f"from app.models.{module} import (  # noqa: F401\n    "
            + ",\n    ".join(classes)
            + ",\n)"
        )

    init = (
        '"""SQLAlchemy models aligned to database/schema.sql (Sprint 02)."""\n\n'
        "from app.core.database import Base\n\n"
        + "\n".join(import_lines)
        + "\n\n__all__ = [\n    \"Base\",\n    "
        + ",\n    ".join(f'"{c}"' for c in sorted(all_exports))
        + ",\n]\n"
    )
    (MODELS_DIR / "__init__.py").write_text(init, encoding="utf-8")
    print(f"Wrote models/__init__.py with {len(all_exports)} models")


if __name__ == "__main__":
    main()
