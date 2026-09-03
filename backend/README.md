# Praksha Academy Backend

Multi-tenant education SaaS API for **Praksha Academy** (Prabha Technology).

## Stack

- **Python 3.11 or 3.12** (recommended; avoid 3.14 until wheels are available)
- FastAPI
- SQLAlchemy 2.x
- MySQL 8.0+
- Alembic
- Pydantic Settings
- JWT / Passlib (scaffolded for Sprint 03)

## Sprint status

| Sprint | Scope | Status |
|---|---|---|
| 01 | Backend foundation | Complete |
| 02 | Database models + Alembic baseline | Complete (see `docs/sprint-02-database.md`) |
| 03 | Authentication | Not started |

Existing design source of truth: `database/schema.sql` and `docs/database/`.

## Project layout

```
backend/
├── app/
│   ├── api/v1/          # Routers (HTTP only)
│   ├── core/            # Config, DB, security, responses
│   ├── models/          # SQLAlchemy models (Sprint 02+)
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   ├── repositories/    # Data access
│   ├── utils/
│   └── main.py
├── migrations/          # Alembic
├── tests/
├── database/schema.sql  # Approved SQL design
├── docs/database/       # Database documentation
├── requirements.txt
└── .env.example
```

## Quick start

```bash
cd backend

# Prefer Python 3.11 on this machine:
#   py -3.11 -m venv .venv
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS / Linux
# source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # or: cp .env.example .env

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Health: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
- Docs (dev): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

MySQL is optional for `/api/v1/health` (returns `database: down` / `status: degraded` if unreachable).  
`/api/v1/ready` returns **503** when the database is down.

## Tests

```bash
cd backend
pytest -q
```

## API response standard

Success:

```json
{ "success": true, "message": "...", "data": {} }
```

Error:

```json
{ "success": false, "message": "...", "errors": {} }
```

## Architecture rule

```
Router → Service → Repository → SQLAlchemy Model → MySQL
```

Do not put business logic in route functions.

## Multi-tenant rule

Never trust `tenant_id` from the client for authorization.  
Derive tenant context from the authenticated session/token (Sprint 03+).

## Environment

Copy `.env.example` to `.env` and set real `DB_*` and `JWT_SECRET_KEY` values before any non-local deployment. Never commit `.env`.
