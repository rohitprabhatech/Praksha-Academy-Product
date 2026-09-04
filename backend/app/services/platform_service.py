"""Platform admin business logic."""

from __future__ import annotations

import math
import re
from datetime import timedelta
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, utcnow_naive
from app.models.rbac import Role
from app.models.user import User, UserRole
from app.repositories.platform_repository import PlatformRepository
from app.schemas.platform import (
    AssignPlanRequest,
    PlanCreate,
    PlanUpdate,
    SettingUpdate,
    TenantCreate,
)
from app.utils.ids import new_uuid

repo = PlatformRepository()

TENANT_TRANSITIONS = {
    "pending": ["trial", "active", "cancelled"],
    "trial": ["active", "suspended", "cancelled"],
    "active": ["suspended", "cancelled"],
    "suspended": ["active", "cancelled"],
    "cancelled": [],
    "archived": [],
}

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


class PlatformService:
    def _paginate(self, total: int, page: int, per_page: int) -> dict:
        return {
            "total": total,
            "page": page,
            "per_page": per_page,
            "pages": math.ceil(total / per_page) if per_page else 1,
        }

    def _tenant_to_dict(self, tenant) -> dict:
        return {
            "id": tenant.id,
            "name": tenant.name,
            "slug": tenant.slug,
            "tenant_code": tenant.tenant_code,
            "status": tenant.status,
            "contact_email": tenant.contact_email,
            "contact_phone": tenant.contact_phone,
            "timezone": tenant.timezone,
            "trial_ends_at": str(tenant.trial_ends_at) if tenant.trial_ends_at else None,
            "activated_at": str(tenant.activated_at) if tenant.activated_at else None,
            "suspended_at": str(tenant.suspended_at) if tenant.suspended_at else None,
            "created_at": str(tenant.created_at) if tenant.created_at else None,
        }

    def _plan_to_dict(self, plan) -> dict:
        return {
            "id": plan.id,
            "code": plan.code,
            "name": plan.name,
            "description": plan.description,
            "monthly_price": float(plan.monthly_price),
            "annual_price": float(plan.annual_price) if plan.annual_price is not None else None,
            "currency": plan.currency,
            "trial_days": plan.trial_days,
            "max_students": plan.max_students,
            "max_teachers": plan.max_teachers,
            "max_courses": plan.max_courses,
            "features_json": plan.features_json,
            "status": plan.status,
            "sort_order": plan.sort_order,
            "created_at": str(plan.created_at) if plan.created_at else None,
        }

    # ─── TENANTS ──────────────────────────────────────────────────────────────

    def list_tenants(
        self,
        db: Session,
        page: int,
        per_page: int,
        status: Optional[str],
        search: Optional[str],
    ) -> dict:
        items, total = repo.list_tenants(db, page, per_page, status, search)
        return {
            "items": [self._tenant_to_dict(t) for t in items],
            **self._paginate(total, page, per_page),
        }

    def get_tenant(self, db: Session, tenant_id: str) -> dict:
        tenant = repo.get_tenant(db, tenant_id)
        if not tenant:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Tenant not found")
        return self._tenant_to_dict(tenant)

    def create_tenant(self, db: Session, data: TenantCreate, actor_id: str) -> dict:
        slug = data.slug.strip().lower()
        if not SLUG_RE.match(slug):
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                detail="Slug must be lowercase letters, numbers, and hyphens",
            )
        if repo.get_tenant_by_slug(db, slug):
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                detail=f"Slug '{slug}' is already taken",
            )

        tenant_code = slug.upper().replace("-", "")[:10]
        tenant = repo.create_tenant(
            db,
            {
                "name": data.name.strip(),
                "slug": slug,
                "tenant_code": tenant_code,
                "contact_email": str(data.contact_email).lower(),
                "contact_phone": data.contact_phone,
                "timezone": data.timezone,
                "status": "pending",
            },
        )

        owner_email = str(data.owner_email).lower().strip()
        user = User(
            id=new_uuid(),
            tenant_id=tenant.id,
            email=owner_email,
            password_hash=hash_password(data.owner_password),
            first_name=data.owner_first_name.strip(),
            last_name=data.owner_last_name,
            status="active",
            email_verified_at=utcnow_naive(),
        )
        db.add(user)
        db.flush()

        owner_role = (
            db.query(Role)
            .filter(Role.scope == "tenant", Role.code == "owner")
            .first()
        )
        if not owner_role:
            owner_role = Role(
                id=new_uuid(),
                scope="tenant",
                code="owner",
                name="Owner",
                is_system=True,
            )
            db.add(owner_role)
            db.flush()

        db.add(
            UserRole(
                id=new_uuid(),
                user_id=user.id,
                role_id=owner_role.id,
                tenant_id=tenant.id,
                assigned_by=actor_id,
            )
        )

        repo.log(
            db,
            actor_id,
            "tenant.create",
            "tenant",
            tenant.id,
            tenant_id=tenant.id,
            metadata={"name": tenant.name, "slug": tenant.slug},
        )
        db.commit()
        return self._tenant_to_dict(tenant)

    def change_tenant_status(
        self, db: Session, tenant_id: str, new_status: str, actor_id: str
    ) -> dict:
        tenant = repo.get_tenant(db, tenant_id)
        if not tenant:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Tenant not found")

        allowed = TENANT_TRANSITIONS.get(tenant.status, [])
        if new_status not in allowed:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot move tenant from '{tenant.status}' to '{new_status}'",
            )

        extra: dict = {}
        now = utcnow_naive()
        if new_status == "active":
            extra["activated_at"] = now
            extra["suspended_at"] = None
        elif new_status == "suspended":
            extra["suspended_at"] = now
        elif new_status == "trial":
            extra["trial_ends_at"] = now + timedelta(days=30)

        repo.update_tenant_status(db, tenant, new_status, **extra)
        repo.log(db, actor_id, f"tenant.{new_status}", "tenant", tenant.id, tenant_id=tenant.id)
        db.commit()
        return self._tenant_to_dict(tenant)

    def delete_tenant(self, db: Session, tenant_id: str, actor_id: str) -> None:
        tenant = repo.get_tenant(db, tenant_id)
        if not tenant:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Tenant not found")
        repo.soft_delete_tenant(db, tenant)
        repo.log(db, actor_id, "tenant.delete", "tenant", tenant_id, tenant_id=tenant_id)
        db.commit()

    def assign_plan(
        self,
        db: Session,
        tenant_id: str,
        data: AssignPlanRequest,
        actor_id: str,
    ) -> dict:
        tenant = repo.get_tenant(db, tenant_id)
        if not tenant:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Tenant not found")
        plan = repo.get_plan(db, data.plan_id)
        if not plan:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Plan not found")
        if data.billing_cycle not in {"monthly", "annual", "custom"}:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                detail="billing_cycle must be monthly, annual, or custom",
            )

        starts_at = data.starts_at
        if starts_at.tzinfo is not None:
            starts_at = starts_at.replace(tzinfo=None)
        ends_at = data.ends_at
        if ends_at and ends_at.tzinfo is not None:
            ends_at = ends_at.replace(tzinfo=None)
        trial_ends_at = data.trial_ends_at
        if trial_ends_at and trial_ends_at.tzinfo is not None:
            trial_ends_at = trial_ends_at.replace(tzinfo=None)

        sub = repo.create_subscription(
            db,
            {
                "tenant_id": tenant_id,
                "plan_id": data.plan_id,
                "status": "active",
                "billing_cycle": data.billing_cycle,
                "starts_at": starts_at,
                "ends_at": ends_at,
                "trial_ends_at": trial_ends_at,
                "auto_renew": data.auto_renew,
                "notes": data.notes,
            },
        )
        repo.log(
            db,
            actor_id,
            "tenant.assign_plan",
            "tenant_subscription",
            sub.id,
            tenant_id=tenant_id,
            metadata={"plan_id": data.plan_id},
        )
        db.commit()
        return {
            "subscription_id": sub.id,
            "plan_id": plan.id,
            "plan_name": plan.name,
            "status": sub.status,
        }

    # ─── PLANS ────────────────────────────────────────────────────────────────

    def list_plans(self, db: Session) -> list[dict]:
        return [self._plan_to_dict(p) for p in repo.list_plans(db)]

    def create_plan(self, db: Session, data: PlanCreate, actor_id: str) -> dict:
        code = data.code.strip().lower()
        if repo.get_plan_by_code(db, code):
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                detail=f"Plan code '{code}' already exists",
            )
        payload = data.model_dump()
        payload["code"] = code
        plan = repo.create_plan(db, payload)
        repo.log(db, actor_id, "plan.create", "subscription_plan", plan.id)
        db.commit()
        return self._plan_to_dict(plan)

    def update_plan(
        self, db: Session, plan_id: str, data: PlanUpdate, actor_id: str
    ) -> dict:
        plan = repo.get_plan(db, plan_id)
        if not plan:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Plan not found")
        repo.update_plan(db, plan, data.model_dump(exclude_none=True))
        repo.log(db, actor_id, "plan.update", "subscription_plan", plan_id)
        db.commit()
        return self._plan_to_dict(plan)

    def delete_plan(self, db: Session, plan_id: str, actor_id: str) -> None:
        plan = repo.get_plan(db, plan_id)
        if not plan:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Plan not found")
        repo.soft_delete_plan(db, plan)
        repo.log(db, actor_id, "plan.delete", "subscription_plan", plan_id)
        db.commit()

    # ─── SETTINGS ─────────────────────────────────────────────────────────────

    def list_settings(self, db: Session) -> list[dict]:
        return [
            {
                "id": s.id,
                "setting_key": s.setting_key,
                "setting_value": s.setting_value,
                "description": s.description,
            }
            for s in repo.list_settings(db)
        ]

    def upsert_setting(
        self, db: Session, key: str, data: SettingUpdate, actor_id: str
    ) -> dict:
        setting = repo.upsert_setting(db, key, data.value, data.description)
        repo.log(
            db,
            actor_id,
            "setting.upsert",
            "platform_setting",
            setting.id,
            metadata={"key": key},
        )
        db.commit()
        return {
            "id": setting.id,
            "setting_key": setting.setting_key,
            "setting_value": setting.setting_value,
            "description": setting.description,
        }

    # ─── AUDIT ────────────────────────────────────────────────────────────────

    def list_audit_logs(
        self,
        db: Session,
        page: int,
        per_page: int,
        tenant_id: Optional[str],
        actor_id: Optional[str],
    ) -> dict:
        items, total = repo.list_audit_logs(db, page, per_page, tenant_id, actor_id)
        return {
            "items": [
                {
                    "id": log.id,
                    "actor_user_id": log.actor_user_id,
                    "action": log.action,
                    "entity_type": log.entity_type,
                    "entity_id": log.entity_id,
                    "tenant_id": log.tenant_id,
                    "ip_address": log.ip_address,
                    "metadata_json": log.metadata_json,
                    "created_at": str(log.created_at) if log.created_at else None,
                }
                for log in items
            ],
            **self._paginate(total, page, per_page),
        }
