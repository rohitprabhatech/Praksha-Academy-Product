"""In-app notifications and recipients."""

from __future__ import annotations

from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import utcnow_naive
from app.models.notification import Notification, NotificationRecipient
from app.models.rbac import Role
from app.models.user import User, UserRole
from app.schemas.cms import NotificationCreate
from app.utils.ids import new_uuid


class NotificationService:
    def _require_tenant(self, tenant_id: Optional[str]) -> str:
        if not tenant_id:
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Tenant context required")
        return tenant_id

    def create_and_send(
        self,
        db: Session,
        tenant_id: Optional[str],
        data: NotificationCreate,
        actor_id: str,
    ) -> dict:
        tid = self._require_tenant(tenant_id)
        notif = Notification(
            id=new_uuid(),
            tenant_id=tid,
            title=data.title,
            message=data.message,
            notification_type=data.notification_type,
            audience_type=data.audience_type,
            target_user_id=data.target_user_id,
            scheduled_at=data.scheduled_at,
            status="draft",
            created_by=actor_id,
        )
        db.add(notif)
        db.flush()

        recipients: list[str] = []
        if data.scheduled_at:
            notif.status = "scheduled"
        else:
            recipients = self._find_recipients(db, tid, data)
            now = utcnow_naive()
            for user_id in recipients:
                db.add(
                    NotificationRecipient(
                        id=new_uuid(),
                        tenant_id=tid,
                        notification_id=notif.id,
                        user_id=user_id,
                        delivered_at=now,
                    )
                )
            notif.status = "sent"
            notif.sent_at = now

        db.commit()
        return {
            "notification_id": notif.id,
            "status": notif.status,
            "recipients": len(recipients),
        }

    def _find_recipients(
        self, db: Session, tenant_id: str, data: NotificationCreate
    ) -> list[str]:
        if data.audience_type == "specific_user" and data.target_user_id:
            return [data.target_user_id]

        q = db.query(User.id).filter(
            User.tenant_id == tenant_id,
            User.status == "active",
            User.deleted_at.is_(None),
        )

        if data.audience_type != "all":
            role_map = {
                "students": "student",
                "teachers": "teacher",
                "owners": "owner",
            }
            role_code = role_map.get(data.audience_type)
            if role_code:
                role = (
                    db.query(Role)
                    .filter(Role.scope == "tenant", Role.code == role_code)
                    .first()
                )
                if role:
                    q = q.join(UserRole, UserRole.user_id == User.id).filter(
                        UserRole.role_id == role.id,
                        UserRole.tenant_id == tenant_id,
                    )

        return [row[0] for row in q.all()]

    def get_my_notifications(
        self,
        db: Session,
        tenant_id: Optional[str],
        user_id: str,
        unread_only: bool = False,
    ) -> list:
        tid = self._require_tenant(tenant_id)
        q = (
            db.query(NotificationRecipient, Notification)
            .join(Notification, Notification.id == NotificationRecipient.notification_id)
            .filter(
                NotificationRecipient.user_id == user_id,
                NotificationRecipient.tenant_id == tid,
            )
        )
        if unread_only:
            q = q.filter(NotificationRecipient.is_read.is_(False))
        results = q.order_by(Notification.sent_at.desc()).all()
        return [
            {
                "id": nr.id,
                "notification_id": n.id,
                "title": n.title,
                "message": n.message,
                "type": n.notification_type,
                "is_read": bool(nr.is_read),
                "delivered_at": str(nr.delivered_at) if nr.delivered_at else None,
            }
            for nr, n in results
        ]

    def mark_read(self, db: Session, recipient_id: str, user_id: str) -> None:
        nr = (
            db.query(NotificationRecipient)
            .filter(
                NotificationRecipient.id == recipient_id,
                NotificationRecipient.user_id == user_id,
            )
            .first()
        )
        if not nr:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Notification not found")
        nr.is_read = True
        nr.read_at = utcnow_naive()
        db.commit()
