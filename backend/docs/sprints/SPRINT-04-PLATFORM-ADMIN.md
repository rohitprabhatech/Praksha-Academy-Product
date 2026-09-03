# SPRINT 04 — Platform Admin APIs (Master Admin)
**Project:** Praksha Academy SaaS
**Developer:** _(assign name here)_
**Branch:** `feature/sprint-04-platform-admin`
**Base Branch:** `dev`
**Estimated Time:** 5–7 working days
**Depends on:** Sprint 03 must be merged to `dev` first

---

## What Is This Sprint About?

The **Prabha Technology Master Admin** (role: `master_admin`) needs APIs to:
- See and manage all academies (tenants)
- Approve/Reject new academy registration requests
- Manage subscription plans
- View platform-wide audit logs
- Change platform settings

These APIs are only accessible to `master_admin`. If any other role tries to access them → return **403 Forbidden**.

---

## Step 1 — Create Branch

```bash
git checkout dev
git pull origin dev
git checkout -b feature/sprint-04-platform-admin
```

---

## Step 2 — Read First

| File | Why |
|------|-----|
| `app/core/dependencies.py` | Read `require_role()` — use it on every route |
| `app/core/response.py` | Use `success_response()` always |
| `app/models/platform.py` | Tenant, SubscriptionPlan, TenantSubscription models |
| `app/models/audit.py` | PlatformAuditLog model |

---

## Step 3 — Folder Structure to Create

```
backend/app/
├── schemas/
│   └── platform.py               ← NEW
│
├── repositories/
│   └── platform_repository.py    ← NEW
│
├── services/
│   └── platform_service.py       ← NEW
│
└── api/v1/
    └── platform/
        ├── __init__.py            ← NEW (empty)
        ├── tenants.py             ← NEW
        ├── plans.py               ← NEW
        ├── settings.py            ← NEW
        └── audit.py              ← NEW
```

---

## Step 4 — Schemas (`app/schemas/platform.py`)

```python
from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from datetime import datetime


# ─── TENANTS ──────────────────────────────────────────────────────────────────

class TenantCreate(BaseModel):
    name: str
    slug: str           # unique URL-friendly identifier, e.g. "sunrise-academy"
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    timezone: str = "Asia/Kolkata"
    # Owner user details (we create an owner user for them)
    owner_first_name: str
    owner_last_name: Optional[str] = None
    owner_email: EmailStr
    owner_password: str

class TenantResponse(BaseModel):
    id: str
    name: str
    slug: str
    tenant_code: str
    status: str
    contact_email: Optional[str]
    contact_phone: Optional[str]
    timezone: str
    trial_ends_at: Optional[datetime]
    activated_at: Optional[datetime]
    created_at: datetime

class TenantListResponse(BaseModel):
    items: list[TenantResponse]
    total: int
    page: int
    per_page: int
    pages: int

class AssignPlanRequest(BaseModel):
    plan_id: str
    billing_cycle: str = "monthly"   # monthly | annual | custom
    starts_at: datetime
    ends_at: Optional[datetime] = None
    trial_ends_at: Optional[datetime] = None
    auto_renew: bool = True
    notes: Optional[str] = None


# ─── SUBSCRIPTION PLANS ────────────────────────────────────────────────────────

class PlanCreate(BaseModel):
    code: str                  # unique code, e.g. "starter", "pro", "enterprise"
    name: str
    description: Optional[str] = None
    monthly_price: float
    annual_price: Optional[float] = None
    currency: str = "INR"
    trial_days: int = 0
    max_students: Optional[int] = None
    max_teachers: Optional[int] = None
    max_courses: Optional[int] = None
    features_json: Optional[dict] = None

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    monthly_price: Optional[float] = None
    annual_price: Optional[float] = None
    max_students: Optional[int] = None
    max_teachers: Optional[int] = None
    max_courses: Optional[int] = None
    features_json: Optional[dict] = None
    status: Optional[str] = None  # active | inactive | archived

class PlanResponse(BaseModel):
    id: str
    code: str
    name: str
    monthly_price: float
    annual_price: Optional[float]
    currency: str
    trial_days: int
    max_students: Optional[int]
    max_teachers: Optional[int]
    max_courses: Optional[int]
    features_json: Optional[dict]
    status: str
    created_at: datetime


# ─── PLATFORM SETTINGS ────────────────────────────────────────────────────────

class SettingUpdate(BaseModel):
    value: Any


# ─── AUDIT LOGS ───────────────────────────────────────────────────────────────

class AuditLogResponse(BaseModel):
    id: str
    actor_user_id: Optional[str]
    action: str
    entity_type: str
    entity_id: Optional[str]
    tenant_id: Optional[str]
    ip_address: Optional[str]
    created_at: datetime
```

---

## Step 5 — Repository (`app/repositories/platform_repository.py`)

```python
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.platform import Tenant, SubscriptionPlan, TenantSubscription, PlatformSetting
from app.models.audit import PlatformAuditLog
from app.utils.ids import new_uuid


class PlatformRepository:

    # ─── TENANTS ──────────────────────────────────────────────────────────────

    def list_tenants(self, db: Session, page: int, per_page: int,
                     status: Optional[str], search: Optional[str]) -> tuple[list, int]:
        query = db.query(Tenant).filter(Tenant.deleted_at == None)
        if status:
            query = query.filter(Tenant.status == status)
        if search:
            query = query.filter(Tenant.name.ilike(f"%{search}%"))
        total = query.count()
        items = query.order_by(Tenant.created_at.desc()) \
                     .offset((page - 1) * per_page).limit(per_page).all()
        return items, total

    def get_tenant(self, db: Session, tenant_id: str) -> Optional[Tenant]:
        return db.query(Tenant).filter(
            Tenant.id == tenant_id,
            Tenant.deleted_at == None
        ).first()

    def get_tenant_by_slug(self, db: Session, slug: str) -> Optional[Tenant]:
        return db.query(Tenant).filter(Tenant.slug == slug).first()

    def create_tenant(self, db: Session, data: dict) -> Tenant:
        tenant = Tenant(id=new_uuid(), **data)
        db.add(tenant)
        db.flush()
        return tenant

    def update_tenant_status(self, db: Session, tenant: Tenant, new_status: str,
                              **extra_fields) -> Tenant:
        tenant.status = new_status
        for k, v in extra_fields.items():
            setattr(tenant, k, v)
        db.flush()
        return tenant

    def soft_delete_tenant(self, db: Session, tenant: Tenant) -> None:
        tenant.deleted_at = datetime.utcnow()
        db.flush()

    # ─── SUBSCRIPTION PLANS ────────────────────────────────────────────────────

    def list_plans(self, db: Session) -> list[SubscriptionPlan]:
        return db.query(SubscriptionPlan).filter(
            SubscriptionPlan.deleted_at == None
        ).order_by(SubscriptionPlan.sort_order).all()

    def get_plan(self, db: Session, plan_id: str) -> Optional[SubscriptionPlan]:
        return db.query(SubscriptionPlan).filter(
            SubscriptionPlan.id == plan_id,
            SubscriptionPlan.deleted_at == None
        ).first()

    def create_plan(self, db: Session, data: dict) -> SubscriptionPlan:
        plan = SubscriptionPlan(id=new_uuid(), **data)
        db.add(plan)
        db.flush()
        return plan

    def update_plan(self, db: Session, plan: SubscriptionPlan, data: dict) -> SubscriptionPlan:
        for k, v in data.items():
            if v is not None:
                setattr(plan, k, v)
        db.flush()
        return plan

    def soft_delete_plan(self, db: Session, plan: SubscriptionPlan) -> None:
        plan.deleted_at = datetime.utcnow()
        plan.status = "archived"
        db.flush()

    def create_subscription(self, db: Session, data: dict) -> TenantSubscription:
        sub = TenantSubscription(id=new_uuid(), **data)
        db.add(sub)
        db.flush()
        return sub

    # ─── PLATFORM SETTINGS ────────────────────────────────────────────────────

    def list_settings(self, db: Session) -> list[PlatformSetting]:
        return db.query(PlatformSetting).all()

    def get_setting(self, db: Session, key: str) -> Optional[PlatformSetting]:
        return db.query(PlatformSetting).filter(PlatformSetting.setting_key == key).first()

    def upsert_setting(self, db: Session, key: str, value: dict) -> PlatformSetting:
        setting = self.get_setting(db, key)
        if setting:
            setting.setting_value = value
        else:
            setting = PlatformSetting(id=new_uuid(), setting_key=key, setting_value=value)
            db.add(setting)
        db.flush()
        return setting

    # ─── AUDIT LOGS ────────────────────────────────────────────────────────────

    def log(self, db: Session, actor_id: Optional[str], action: str,
            entity_type: str, entity_id: Optional[str],
            tenant_id: Optional[str] = None, ip: Optional[str] = None,
            metadata: Optional[dict] = None) -> None:
        log = PlatformAuditLog(
            id=new_uuid(),
            actor_user_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            tenant_id=tenant_id,
            metadata_json=metadata,
            ip_address=ip,
        )
        db.add(log)
        db.flush()

    def list_audit_logs(self, db: Session, page: int, per_page: int,
                        tenant_id: Optional[str], actor_id: Optional[str]) -> tuple[list, int]:
        query = db.query(PlatformAuditLog)
        if tenant_id:
            query = query.filter(PlatformAuditLog.tenant_id == tenant_id)
        if actor_id:
            query = query.filter(PlatformAuditLog.actor_user_id == actor_id)
        total = query.count()
        items = query.order_by(PlatformAuditLog.created_at.desc()) \
                     .offset((page - 1) * per_page).limit(per_page).all()
        return items, total
```

---

## Step 6 — Service (`app/services/platform_service.py`)

Key rules:
1. Create a tenant → also create an owner user (User + UserRole) atomically
2. Tenant status machine:
   - `pending` → can go to `trial` or `active` or `cancelled`
   - `trial` → can go to `active` or `suspended` or `cancelled`
   - `active` → can go to `suspended` or `cancelled`
   - `suspended` → can go to `active` or `cancelled`
   - `cancelled` / `archived` → no more changes

```python
import math
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.platform_repository import PlatformRepository
from app.schemas.platform import TenantCreate, PlanCreate, PlanUpdate, AssignPlanRequest
from app.utils.ids import new_uuid

repo = PlatformRepository()

# Valid status transitions
TENANT_TRANSITIONS = {
    "pending": ["trial", "active", "cancelled"],
    "trial": ["active", "suspended", "cancelled"],
    "active": ["suspended", "cancelled"],
    "suspended": ["active", "cancelled"],
    "cancelled": [],
    "archived": [],
}


class PlatformService:

    def _paginate(self, total: int, page: int, per_page: int) -> dict:
        return {
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": math.ceil(total / per_page) if per_page else 1,
        }

    # ─── TENANTS ──────────────────────────────────────────────────────────────

    def list_tenants(self, db: Session, page: int, per_page: int,
                     status: Optional[str], search: Optional[str]) -> dict:
        items, total = repo.list_tenants(db, page, per_page, status, search)
        return {
            "items": [self._tenant_to_dict(t) for t in items],
            **self._paginate(total, page, per_page),
        }

    def create_tenant(self, db: Session, data: TenantCreate, actor_id: str) -> dict:
        # Check slug not taken
        if repo.get_tenant_by_slug(db, data.slug):
            raise HTTPException(status.HTTP_409_CONFLICT,
                                f"Slug '{data.slug}' is already taken")

        # Generate tenant_code from slug (uppercase, first 10 chars)
        tenant_code = data.slug.upper().replace("-", "")[:10]

        tenant = repo.create_tenant(db, {
            "name": data.name,
            "slug": data.slug,
            "tenant_code": tenant_code,
            "contact_email": data.contact_email,
            "contact_phone": data.contact_phone,
            "timezone": data.timezone,
            "status": "pending",
        })

        # Create owner user
        from app.core.security import hash_password
        from app.models.user import User, UserRole
        from app.models.rbac import Role

        user = User(
            id=new_uuid(),
            tenant_id=tenant.id,
            email=data.owner_email,
            password_hash=hash_password(data.owner_password),
            first_name=data.owner_first_name,
            last_name=data.owner_last_name,
            status="active",
        )
        db.add(user)
        db.flush()

        # Find owner role and assign
        owner_role = db.query(Role).filter(
            Role.scope == "tenant", Role.code == "owner"
        ).first()
        if owner_role:
            db.add(UserRole(
                id=new_uuid(),
                user_id=user.id,
                role_id=owner_role.id,
                tenant_id=tenant.id,
            ))

        repo.log(db, actor_id, "tenant.create", "tenant", tenant.id,
                 metadata={"name": data.name, "slug": data.slug})
        db.commit()
        return self._tenant_to_dict(tenant)

    def get_tenant(self, db: Session, tenant_id: str) -> dict:
        tenant = repo.get_tenant(db, tenant_id)
        if not tenant:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Tenant not found")
        return self._tenant_to_dict(tenant)

    def change_tenant_status(self, db: Session, tenant_id: str,
                             new_status: str, actor_id: str) -> dict:
        tenant = repo.get_tenant(db, tenant_id)
        if not tenant:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Tenant not found")

        allowed = TENANT_TRANSITIONS.get(tenant.status, [])
        if new_status not in allowed:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                f"Cannot move tenant from '{tenant.status}' to '{new_status}'"
            )

        extra = {}
        now = datetime.now(timezone.utc)
        if new_status == "active":
            extra["activated_at"] = now
        elif new_status == "suspended":
            extra["suspended_at"] = now
        elif new_status == "trial":
            extra["trial_ends_at"] = now + timedelta(days=30)

        repo.update_tenant_status(db, tenant, new_status, **extra)
        repo.log(db, actor_id, f"tenant.{new_status}", "tenant", tenant.id)
        db.commit()
        return self._tenant_to_dict(tenant)

    def delete_tenant(self, db: Session, tenant_id: str, actor_id: str) -> None:
        tenant = repo.get_tenant(db, tenant_id)
        if not tenant:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Tenant not found")
        repo.soft_delete_tenant(db, tenant)
        repo.log(db, actor_id, "tenant.delete", "tenant", tenant_id)
        db.commit()

    def _tenant_to_dict(self, t) -> dict:
        return {
            "id": t.id,
            "name": t.name,
            "slug": t.slug,
            "tenant_code": t.tenant_code,
            "status": t.status,
            "contact_email": t.contact_email,
            "contact_phone": t.contact_phone,
            "timezone": t.timezone,
            "trial_ends_at": str(t.trial_ends_at) if t.trial_ends_at else None,
            "activated_at": str(t.activated_at) if t.activated_at else None,
            "created_at": str(t.created_at),
        }

    # ─── PLANS ────────────────────────────────────────────────────────────────

    def list_plans(self, db: Session) -> list:
        plans = repo.list_plans(db)
        return [self._plan_to_dict(p) for p in plans]

    def create_plan(self, db: Session, data: PlanCreate, actor_id: str) -> dict:
        plan = repo.create_plan(db, data.model_dump())
        repo.log(db, actor_id, "plan.create", "subscription_plan", plan.id)
        db.commit()
        return self._plan_to_dict(plan)

    def update_plan(self, db: Session, plan_id: str, data: PlanUpdate, actor_id: str) -> dict:
        plan = repo.get_plan(db, plan_id)
        if not plan:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Plan not found")
        repo.update_plan(db, plan, data.model_dump(exclude_none=True))
        repo.log(db, actor_id, "plan.update", "subscription_plan", plan_id)
        db.commit()
        return self._plan_to_dict(plan)

    def delete_plan(self, db: Session, plan_id: str, actor_id: str) -> None:
        plan = repo.get_plan(db, plan_id)
        if not plan:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Plan not found")
        repo.soft_delete_plan(db, plan)
        repo.log(db, actor_id, "plan.delete", "subscription_plan", plan_id)
        db.commit()

    def assign_plan(self, db: Session, tenant_id: str, data: AssignPlanRequest,
                    actor_id: str) -> dict:
        tenant = repo.get_tenant(db, tenant_id)
        if not tenant:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Tenant not found")
        plan = repo.get_plan(db, data.plan_id)
        if not plan:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Plan not found")
        sub = repo.create_subscription(db, {
            "tenant_id": tenant_id,
            "plan_id": data.plan_id,
            "status": "active",
            "billing_cycle": data.billing_cycle,
            "starts_at": data.starts_at,
            "ends_at": data.ends_at,
            "trial_ends_at": data.trial_ends_at,
            "auto_renew": data.auto_renew,
            "notes": data.notes,
        })
        repo.log(db, actor_id, "tenant.assign_plan", "tenant_subscription",
                 sub.id, tenant_id=tenant_id)
        db.commit()
        return {"subscription_id": sub.id, "plan_name": plan.name}

    def _plan_to_dict(self, p) -> dict:
        return {
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "monthly_price": float(p.monthly_price),
            "annual_price": float(p.annual_price) if p.annual_price else None,
            "currency": p.currency,
            "trial_days": p.trial_days,
            "max_students": p.max_students,
            "max_teachers": p.max_teachers,
            "max_courses": p.max_courses,
            "features_json": p.features_json,
            "status": p.status,
            "created_at": str(p.created_at),
        }
```

---

## Step 7 — Route Handlers

### `app/api/v1/platform/tenants.py`

```python
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.platform import TenantCreate, AssignPlanRequest
from app.services.platform_service import PlatformService

router = APIRouter(prefix="/platform/tenants", tags=["Platform — Tenants"])
service = PlatformService()
master_only = Depends(require_role("master_admin"))


@router.get("", dependencies=[master_only])
def list_tenants(page: int = 1, per_page: int = 20,
                 status: Optional[str] = None, search: Optional[str] = None,
                 db: Session = Depends(get_db)):
    data = service.list_tenants(db, page, per_page, status, search)
    return success_response(data=data)


@router.post("")
def create_tenant(body: TenantCreate, db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("master_admin"))):
    data = service.create_tenant(db, body, current_user["sub"])
    return success_response(data=data, message="Tenant created successfully")


@router.get("/{tenant_id}", dependencies=[master_only])
def get_tenant(tenant_id: str, db: Session = Depends(get_db)):
    data = service.get_tenant(db, tenant_id)
    return success_response(data=data)


@router.patch("/{tenant_id}/approve")
def approve_tenant(tenant_id: str, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("master_admin"))):
    data = service.change_tenant_status(db, tenant_id, "trial", current_user["sub"])
    return success_response(data=data, message="Tenant approved — trial started")


@router.patch("/{tenant_id}/activate")
def activate_tenant(tenant_id: str, db: Session = Depends(get_db),
                    current_user: dict = Depends(require_role("master_admin"))):
    data = service.change_tenant_status(db, tenant_id, "active", current_user["sub"])
    return success_response(data=data, message="Tenant activated")


@router.patch("/{tenant_id}/suspend")
def suspend_tenant(tenant_id: str, db: Session = Depends(get_db),
                   current_user: dict = Depends(require_role("master_admin"))):
    data = service.change_tenant_status(db, tenant_id, "suspended", current_user["sub"])
    return success_response(data=data, message="Tenant suspended")


@router.patch("/{tenant_id}/cancel")
def cancel_tenant(tenant_id: str, db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("master_admin"))):
    data = service.change_tenant_status(db, tenant_id, "cancelled", current_user["sub"])
    return success_response(data=data, message="Tenant cancelled")


@router.delete("/{tenant_id}")
def delete_tenant(tenant_id: str, db: Session = Depends(get_db),
                  current_user: dict = Depends(require_role("master_admin"))):
    service.delete_tenant(db, tenant_id, current_user["sub"])
    return success_response(message="Tenant deleted")


@router.post("/{tenant_id}/subscription")
def assign_plan(tenant_id: str, body: AssignPlanRequest,
                db: Session = Depends(get_db),
                current_user: dict = Depends(require_role("master_admin"))):
    data = service.assign_plan(db, tenant_id, body, current_user["sub"])
    return success_response(data=data, message="Plan assigned")
```

### `app/api/v1/platform/plans.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.core.response import success_response
from app.schemas.platform import PlanCreate, PlanUpdate
from app.services.platform_service import PlatformService

router = APIRouter(prefix="/platform/plans", tags=["Platform — Plans"])
service = PlatformService()
master_only = Depends(require_role("master_admin"))


@router.get("", dependencies=[master_only])
def list_plans(db: Session = Depends(get_db)):
    return success_response(data=service.list_plans(db))


@router.post("")
def create_plan(body: PlanCreate, db: Session = Depends(get_db),
                current_user: dict = Depends(require_role("master_admin"))):
    data = service.create_plan(db, body, current_user["sub"])
    return success_response(data=data, message="Plan created")


@router.put("/{plan_id}")
def update_plan(plan_id: str, body: PlanUpdate, db: Session = Depends(get_db),
                current_user: dict = Depends(require_role("master_admin"))):
    data = service.update_plan(db, plan_id, body, current_user["sub"])
    return success_response(data=data, message="Plan updated")


@router.delete("/{plan_id}")
def delete_plan(plan_id: str, db: Session = Depends(get_db),
                current_user: dict = Depends(require_role("master_admin"))):
    service.delete_plan(db, plan_id, current_user["sub"])
    return success_response(message="Plan deleted")
```

### `app/api/v1/platform/__init__.py`

Register all platform sub-routers. Create a combined router:

```python
from fastapi import APIRouter
from app.api.v1.platform.tenants import router as tenants_router
from app.api.v1.platform.plans import router as plans_router

platform_router = APIRouter()
platform_router.include_router(tenants_router)
platform_router.include_router(plans_router)
```

### Register in `app/api/v1/router.py`

```python
from app.api.v1.platform import platform_router
api_router.include_router(platform_router)
```

---

## Step 8 — Tests

Create `tests/test_platform/`:

### `test_tenants.py`
1. List tenants — returns paginated list ✅
2. Create tenant — creates tenant + owner user ✅
3. Get tenant by ID ✅
4. Approve tenant (pending → trial) ✅
5. Activate tenant (trial → active) ✅
6. Suspend tenant (active → suspended) ✅
7. Invalid status transition returns 400 ✅
8. Delete tenant (soft delete) ✅
9. Non-master_admin gets 403 ✅

### `test_plans.py`
10. Create plan ✅
11. List plans ✅
12. Update plan ✅
13. Delete plan (soft delete) ✅
14. Assign plan to tenant ✅

Minimum: **14 tests**.

---

## API Summary Table

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/platform/tenants` | List all tenants |
| POST | `/api/v1/platform/tenants` | Create tenant + owner |
| GET | `/api/v1/platform/tenants/{id}` | Get tenant |
| PATCH | `/api/v1/platform/tenants/{id}/approve` | Approve → trial |
| PATCH | `/api/v1/platform/tenants/{id}/activate` | Activate |
| PATCH | `/api/v1/platform/tenants/{id}/suspend` | Suspend |
| PATCH | `/api/v1/platform/tenants/{id}/cancel` | Cancel |
| DELETE | `/api/v1/platform/tenants/{id}` | Soft delete |
| POST | `/api/v1/platform/tenants/{id}/subscription` | Assign plan |
| GET | `/api/v1/platform/plans` | List plans |
| POST | `/api/v1/platform/plans` | Create plan |
| PUT | `/api/v1/platform/plans/{id}` | Update plan |
| DELETE | `/api/v1/platform/plans/{id}` | Delete plan |

---

## Definition of Done ✅

- [ ] All 13 endpoints work
- [ ] All routes return 403 when called by non-master_admin
- [ ] Tenant status transitions enforced
- [ ] Creating tenant also creates owner user in same transaction
- [ ] Audit log written on every write operation
- [ ] `pytest tests/test_platform/ -v` — all 14 tests PASS
- [ ] PR to `dev` with title: `feat(sprint-04): Platform Admin APIs`

---

## Submit PR

```bash
git add .
git commit -m "feat(sprint-04): implement platform admin APIs — tenants, plans, subscriptions"
git push origin feature/sprint-04-platform-admin
# Open GitHub → Create PR to dev
```
