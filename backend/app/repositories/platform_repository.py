"""Platform admin repository — DB queries only."""

from __future__ import annotations

from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import utcnow_naive
from app.models.audit import PlatformAuditLog
from app.models.platform import PlatformSetting, SubscriptionPlan, Tenant, TenantSubscription
from app.utils.ids import new_uuid


class PlatformRepository:
    # ─── TENANTS ──────────────────────────────────────────────────────────────

    def list_tenants(
        self,
        db: Session,
        page: int,
        per_page: int,
        status: Optional[str],
        search: Optional[str],
    ) -> tuple[list[Tenant], int]:
        query = db.query(Tenant).filter(Tenant.deleted_at.is_(None))
        if status:
            query = query.filter(Tenant.status == status)
        if search:
            like = f"%{search}%"
            query = query.filter(
                (Tenant.name.like(like)) | (Tenant.slug.like(like))
            )
        total = query.count()
        items = (
            query.order_by(Tenant.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )
        return items, total

    def get_tenant(self, db: Session, tenant_id: str) -> Optional[Tenant]:
        return (
            db.query(Tenant)
            .filter(Tenant.id == tenant_id, Tenant.deleted_at.is_(None))
            .first()
        )

    def get_tenant_by_slug(self, db: Session, slug: str) -> Optional[Tenant]:
        return db.query(Tenant).filter(Tenant.slug == slug).first()

    def create_tenant(self, db: Session, data: dict) -> Tenant:
        tenant = Tenant(id=new_uuid(), **data)
        db.add(tenant)
        db.flush()
        return tenant

    def update_tenant_status(
        self, db: Session, tenant: Tenant, new_status: str, **extra_fields
    ) -> Tenant:
        tenant.status = new_status
        for key, value in extra_fields.items():
            setattr(tenant, key, value)
        db.flush()
        return tenant

    def soft_delete_tenant(self, db: Session, tenant: Tenant) -> None:
        tenant.deleted_at = utcnow_naive()
        db.flush()

    # ─── SUBSCRIPTION PLANS ────────────────────────────────────────────────────

    def list_plans(self, db: Session) -> list[SubscriptionPlan]:
        return (
            db.query(SubscriptionPlan)
            .filter(SubscriptionPlan.deleted_at.is_(None))
            .order_by(SubscriptionPlan.sort_order)
            .all()
        )

    def get_plan(self, db: Session, plan_id: str) -> Optional[SubscriptionPlan]:
        return (
            db.query(SubscriptionPlan)
            .filter(
                SubscriptionPlan.id == plan_id,
                SubscriptionPlan.deleted_at.is_(None),
            )
            .first()
        )

    def get_plan_by_code(self, db: Session, code: str) -> Optional[SubscriptionPlan]:
        return (
            db.query(SubscriptionPlan)
            .filter(SubscriptionPlan.code == code)
            .first()
        )

    def create_plan(self, db: Session, data: dict) -> SubscriptionPlan:
        plan = SubscriptionPlan(id=new_uuid(), **data)
        db.add(plan)
        db.flush()
        return plan

    def update_plan(
        self, db: Session, plan: SubscriptionPlan, data: dict
    ) -> SubscriptionPlan:
        for key, value in data.items():
            if value is not None:
                setattr(plan, key, value)
        db.flush()
        return plan

    def soft_delete_plan(self, db: Session, plan: SubscriptionPlan) -> None:
        plan.deleted_at = utcnow_naive()
        plan.status = "archived"
        db.flush()

    def create_subscription(self, db: Session, data: dict) -> TenantSubscription:
        sub = TenantSubscription(id=new_uuid(), **data)
        db.add(sub)
        db.flush()
        return sub

    # ─── PLATFORM SETTINGS ────────────────────────────────────────────────────

    def list_settings(self, db: Session) -> list[PlatformSetting]:
        return db.query(PlatformSetting).order_by(PlatformSetting.setting_key).all()

    def get_setting(self, db: Session, key: str) -> Optional[PlatformSetting]:
        return (
            db.query(PlatformSetting)
            .filter(PlatformSetting.setting_key == key)
            .first()
        )

    def upsert_setting(
        self,
        db: Session,
        key: str,
        value: object,
        description: Optional[str] = None,
    ) -> PlatformSetting:
        setting = self.get_setting(db, key)
        if setting:
            setting.setting_value = value
            if description is not None:
                setting.description = description
        else:
            setting = PlatformSetting(
                id=new_uuid(),
                setting_key=key,
                setting_value=value,
                description=description,
            )
            db.add(setting)
        db.flush()
        return setting

    # ─── AUDIT LOGS ────────────────────────────────────────────────────────────

    def log(
        self,
        db: Session,
        actor_id: Optional[str],
        action: str,
        entity_type: str,
        entity_id: Optional[str],
        tenant_id: Optional[str] = None,
        ip: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> None:
        entry = PlatformAuditLog(
            id=new_uuid(),
            actor_user_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            tenant_id=tenant_id,
            metadata_json=metadata,
            ip_address=ip,
        )
        db.add(entry)
        db.flush()

    def list_audit_logs(
        self,
        db: Session,
        page: int,
        per_page: int,
        tenant_id: Optional[str],
        actor_id: Optional[str],
    ) -> tuple[list[PlatformAuditLog], int]:
        query = db.query(PlatformAuditLog)
        if tenant_id:
            query = query.filter(PlatformAuditLog.tenant_id == tenant_id)
        if actor_id:
            query = query.filter(PlatformAuditLog.actor_user_id == actor_id)
        total = query.count()
        items = (
            query.order_by(PlatformAuditLog.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )
        return items, total
