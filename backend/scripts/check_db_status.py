"""One-off DB status check. Reads credentials from .env only."""

from __future__ import annotations

import sys
from pathlib import Path

import pymysql
from dotenv import load_dotenv
import os

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

host = os.getenv("DB_HOST", "localhost")
port = int(os.getenv("DB_PORT", "3306"))
user = os.getenv("DB_USER", "")
password = os.getenv("DB_PASSWORD", "")
db_name = os.getenv("DB_NAME", "")


def main() -> int:
    print("=== Praksha Academy — database status ===")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"User: {user}")
    print(f"Database: {db_name}")
    print("Password: [set]" if password else "Password: [missing]")

    try:
        conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            connect_timeout=8,
        )
    except Exception as exc:
        print("STATUS: FAILED — cannot connect to MySQL server")
        print(f"ERROR: {type(exc).__name__}: {exc}")
        return 1

    print("STATUS: Connected to MySQL server")

    try:
        with conn.cursor() as cur:
            cur.execute("SELECT VERSION()")
            print(f"MySQL version: {cur.fetchone()[0]}")

            cur.execute("SHOW DATABASES")
            databases = [row[0] for row in cur.fetchall()]
            exists = db_name in databases
            print(f"Target database exists: {exists}")

            if not exists:
                print("RESULT: Server reachable, but target database is missing")
                print("NEXT: Create DB or run schema.sql")
                return 0

            cur.execute(f"USE `{db_name}`")
            cur.execute("SHOW TABLES")
            tables = sorted(row[0] for row in cur.fetchall())
            print(f"Tables: {len(tables)}")

            if not tables:
                print("RESULT: Database exists but is empty (schema not applied)")
                print("NEXT: Apply backend/database/schema.sql")
                return 0

            for name in tables:
                print(f" - {name}")

            if "alembic_version" in tables:
                cur.execute("SELECT version_num FROM alembic_version")
                row = cur.fetchone()
                print(f"Alembic version: {row[0] if row else '(empty)'}")
            else:
                print("Alembic: not initialized")

            print("RESULT: Database connected and populated")
            return 0
    finally:
        conn.close()


if __name__ == "__main__":
    sys.exit(main())
