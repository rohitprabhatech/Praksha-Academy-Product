# Praksha Academy — Backend Sprint Index
**Company:** Prabha Technology
**Project:** Praksha Academy SaaS
**Stack:** Python 3.11 · FastAPI · SQLAlchemy · Alembic · MySQL 8 · pytest

---

## Quick Setup (Every Developer Must Do This First)

```bash
# 1. Clone repo
git clone https://github.com/rohitprabhatech/Praksha-Academy-Product.git
cd Praksha-Academy-Product/backend

# 2. Python 3.11 only (3.12+ will break packages)
python --version   # must show 3.11.x

# 3. Create virtual environment
python -m venv .venv
.\.venv\Scripts\activate      # Windows
source .venv/bin/activate     # Mac/Linux

# 4. Install all dependencies
pip install -r requirements.txt

# 5. Setup your .env
cp .env.example .env
# Edit .env — add your MySQL credentials

# 6. Test DB connection
python scripts/check_db_status.py

# 7. Run migrations
alembic upgrade head

# 8. Start server
uvicorn app.main:app --reload

# 9. Open Swagger UI (test all APIs here)
# http://localhost:8000/docs
```

---

## Completed Sprints

| Sprint | Status | Branch | What Was Built |
|--------|--------|--------|----------------|
| Sprint 01 | ✅ Done | `feature/sprint-01-backend-foundation` | FastAPI scaffold, health checks, CORS, pytest |
| Sprint 02 | ✅ Done | `feature/sprint-02-database` | 64 SQLAlchemy models, Alembic migrations |
| DB Design | ✅ Done | `feature/sprint-db-design` | Complete SQL schema, ERD, Sprint Plan |

---

## Backend Sprints to Complete

| Sprint | File | Branch | Assigned To | Status |
|--------|------|--------|-------------|--------|
| Sprint 03 | [SPRINT-03-AUTH.md](./SPRINT-03-AUTH.md) | `feature/sprint-03-auth-apis` | | ✅ Done (local) |
| Sprint 04 | [SPRINT-04-PLATFORM-ADMIN.md](./SPRINT-04-PLATFORM-ADMIN.md) | `feature/sprint-04-platform-admin` | | ✅ Done (local) |
| Sprint 05 | [SPRINT-05-TENANT-SETUP.md](./SPRINT-05-TENANT-SETUP.md) | `feature/sprint-05-tenant-setup` | | 🔄 In Progress |
| Sprint 06 | [SPRINT-06-COURSES.md](./SPRINT-06-COURSES.md) | `feature/sprint-06-courses` | | ⬜ Not Started |
| Sprint 07 | [SPRINT-07-LMS-ASSESSMENTS.md](./SPRINT-07-LMS-ASSESSMENTS.md) | `feature/sprint-07-lms-assessments` | | ⬜ Not Started |
| Sprint 08 | [SPRINT-08-FINANCE-CMS.md](./SPRINT-08-FINANCE-CMS.md) | `feature/sprint-08-finance-cms` | | ⬜ Not Started |

---

## Sprint Dependencies

```
Sprint 03 (Auth)
    ↓
Sprint 04 (Platform Admin)    Sprint 05 (Tenant Setup)
                                   ↓
                              Sprint 06 (Courses)
                                   ↓
                              Sprint 07 (LMS & Assessments)

Sprint 05 is also required for Sprint 08 (Finance & CMS)
```

**Sprint 03 must be done first.** Then Sprints 04 and 05 can run in parallel. After Sprint 05, Sprints 06, 07, 08 can be assigned to different developers.

---

## Git Workflow (All Developers Follow This)

```bash
# 1. Always start from latest dev
git checkout dev
git pull origin dev

# 2. Create your sprint branch
git checkout -b feature/sprint-XX-name

# 3. Work. Commit often.
git add .
git commit -m "feat(sprint-XX): description of what you did"

# 4. Push your branch
git push origin feature/sprint-XX-name

# 5. Open a Pull Request on GitHub → target branch: dev
# PR title format: feat(sprint-XX): Short description
# PR must have: what was done, endpoints added, tests result

# 6. Never merge to main directly — always go through dev
```

---

## Code Standards (Must Follow)

### 1. Response Format — ALWAYS use this
```python
from app.core.response import success_response, error_response

# Success
return success_response(data={...}, message="Done")

# Error (use HTTPException instead usually)
raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
```

### 2. Tenant Isolation — NEVER forget this
```python
# In every service method:
tenant_id = current_user["tenant_id"]  # from JWT token
results = db.query(Model).filter(
    Model.tenant_id == tenant_id,   # ← MUST be here
    Model.deleted_at == None
).all()
```

### 3. Soft Delete — Never hard delete
```python
# WRONG: db.delete(record)
# RIGHT:
from datetime import datetime
record.deleted_at = datetime.utcnow()
db.commit()
```

### 4. One transaction per request
```python
# All DB changes in one service method → one db.commit() at the end
def create_something(db: Session, ...):
    obj1 = ...
    db.add(obj1)
    db.flush()   # flush to get the ID but don't commit yet

    obj2 = ...   # depends on obj1.id
    db.add(obj2)
    db.flush()

    db.commit()  # ← only ONE commit at the very end
    return result
```

### 5. Architecture layers
```
Route Handler  → calls Service
Service        → calls Repository (for DB) + raises HTTPException
Repository     → only DB queries, no business logic
```

### 6. File naming
```
schemas/auth.py          ← Pydantic request/response models
repositories/auth_repo.py ← DB queries only
services/auth_service.py  ← Business logic
api/v1/auth.py           ← Route handlers
```

---

## Testing Standards

Every sprint must include automated tests.

```bash
# Run all tests
pytest -v

# Run specific sprint
pytest tests/test_auth/ -v
pytest tests/test_courses/ -v

# Must see ALL PASSED before submitting PR
```

Each test file should use a test DB (or mocked DB session) — ask the Team Lead for the test database setup.

---

## Important Files to Read Before Starting

| File | Purpose |
|------|---------|
| `app/core/config.py` | All app settings |
| `app/core/response.py` | Standard response format |
| `app/core/database.py` | DB session setup |
| `app/core/security.py` | JWT + password helpers |
| `app/core/dependencies.py` | Auth dependencies |
| `app/models/__init__.py` | All 64 models |
| `backend/database/schema.sql` | Full DB schema |
| `backend/docs/database/ERD.md` | Database diagram |

---

## Questions?

Raise questions before writing code. If something in a sprint document is unclear:
1. Read the relevant model files in `app/models/`
2. Read the schema.sql for that table
3. Check the ERD document
4. Ask the Team Lead

**Do not guess. Ask first.**
