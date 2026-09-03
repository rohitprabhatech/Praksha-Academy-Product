# Sprint 02 — Database Models & Alembic Baseline

**Branch:** `feature/sprint-02-database`  
**Status:** Complete — awaiting Team Lead approval for Sprint 03

## Goal

Align SQLAlchemy models with `database/schema.sql` and establish an Alembic baseline. No auth APIs in this sprint.

## Delivered

- Modular SQLAlchemy models for all **54** tables under `app/models/`
- Shared mixins (`uuid_pk`, timestamps, soft delete, tenant ownership)
- Alembic env imports full model metadata
- Baseline revision: `migrations/versions/0001_initial_schema.py`
- Model alignment tests in `tests/test_models_sprint02.py`

## Alembic strategy (existing DB)

Your local DB already has schema applied via `schema.sql`.

```bash
cd backend
.\.venv\Scripts\Activate.ps1
alembic stamp 0001_initial_schema
alembic current
```

For an **empty** database that already exists:

```bash
alembic upgrade head
```

(`upgrade` applies `schema.sql` CREATE statements when `tenants` is missing.)

## Known intentional deltas vs raw SQL

Documented for Team Lead — not silent “fixes”:

| Item | Schema | Models | Note |
|---|---|---|---|
| Secondary non-unique indexes | Many | Partial | Unique + FK constraints are modeled |
| UNSIGNED ints | Present | Integer/BigInteger | Acceptable for app layer |
| DATETIME(6) | Fractional | DateTime | Precision not forced in ORM |
| LONGTEXT | blog content | Text | Sufficient for ORM |
| Platform email UNIQUE with NULL tenant_id | MySQL NULL quirk | Same as schema | Open issue D-01 — do not “fix” in Sprint 02 |
| Attendance UNIQUE with NULLs | ADR-016 | Same as schema | Open issue D-02 — app must guard |

## Out of scope

- Auth endpoints (Sprint 03)
- Role/permission seed data inserts (can land with Sprint 03 bootstrap)
- Frontend changes

## Verify

```bash
pytest -q tests/test_models_sprint02.py tests/test_health.py
python -c "from app.models import *; from app.core.database import Base; print(len(Base.metadata.tables))"
```
