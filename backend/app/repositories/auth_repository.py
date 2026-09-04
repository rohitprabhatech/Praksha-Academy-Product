"""Auth repository — DB queries only."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import utcnow_naive
from app.models.auth_tokens import RefreshToken, UserSession
from app.models.platform import Tenant
from app.models.rbac import Role
from app.models.user import EmailVerification, PasswordResetToken, User, UserRole
from app.utils.ids import new_uuid


class AuthRepository:
    def get_user_by_email(
        self, db: Session, email: str, tenant_id: Optional[str]
    ) -> Optional[User]:
        return (
            db.query(User)
            .filter(
                User.email == email,
                User.tenant_id == tenant_id,
                User.deleted_at.is_(None),
            )
            .first()
        )

    def get_user_by_id(self, db: Session, user_id: str) -> Optional[User]:
        return (
            db.query(User)
            .filter(User.id == user_id, User.deleted_at.is_(None))
            .first()
        )

    def get_user_roles(self, db: Session, user_id: str) -> list[str]:
        rows = (
            db.query(Role.code)
            .join(UserRole, UserRole.role_id == Role.id)
            .filter(UserRole.user_id == user_id)
            .all()
        )
        return [row[0] for row in rows]

    def create_refresh_token(
        self,
        db: Session,
        user_id: str,
        token_hash: str,
        device_info: Optional[str],
        ip_address: Optional[str],
        expires_at: datetime,
    ) -> RefreshToken:
        token = RefreshToken(
            id=new_uuid(),
            user_id=user_id,
            token_hash=token_hash,
            device_info=device_info,
            ip_address=ip_address,
            expires_at=expires_at,
        )
        db.add(token)
        db.flush()
        return token

    def get_refresh_token_by_hash(
        self, db: Session, token_hash: str
    ) -> Optional[RefreshToken]:
        return (
            db.query(RefreshToken)
            .filter(
                RefreshToken.token_hash == token_hash,
                RefreshToken.revoked_at.is_(None),
                RefreshToken.expires_at > utcnow_naive(),
            )
            .first()
        )

    def revoke_refresh_token(self, db: Session, token: RefreshToken) -> None:
        token.revoked_at = utcnow_naive()
        db.flush()

    def revoke_all_user_tokens(self, db: Session, user_id: str) -> None:
        db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            RefreshToken.revoked_at.is_(None),
        ).update({"revoked_at": utcnow_naive()})
        db.flush()

    def create_session(
        self,
        db: Session,
        user_id: str,
        refresh_token_id: str,
        ip_address: Optional[str],
        user_agent: Optional[str],
    ) -> UserSession:
        session = UserSession(
            id=new_uuid(),
            user_id=user_id,
            refresh_token_id=refresh_token_id,
            ip_address=ip_address,
            user_agent=user_agent,
            is_active=1,
        )
        db.add(session)
        db.flush()
        return session

    def create_password_reset_token(
        self,
        db: Session,
        user_id: str,
        token_hash: str,
        expires_at: datetime,
    ) -> PasswordResetToken:
        token = PasswordResetToken(
            id=new_uuid(),
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
        )
        db.add(token)
        db.flush()
        return token

    def get_valid_reset_token(
        self, db: Session, token_hash: str
    ) -> Optional[PasswordResetToken]:
        return (
            db.query(PasswordResetToken)
            .filter(
                PasswordResetToken.token_hash == token_hash,
                PasswordResetToken.used_at.is_(None),
                PasswordResetToken.expires_at > utcnow_naive(),
            )
            .first()
        )

    def mark_reset_token_used(self, db: Session, token: PasswordResetToken) -> None:
        token.used_at = utcnow_naive()
        db.flush()

    def update_password(self, db: Session, user: User, new_hash: str) -> None:
        user.password_hash = new_hash
        db.flush()

    def create_email_verification(
        self,
        db: Session,
        user_id: str,
        otp_hash: str,
        purpose: str,
        expires_at: datetime,
    ) -> EmailVerification:
        verification = EmailVerification(
            id=new_uuid(),
            user_id=user_id,
            otp_hash=otp_hash,
            purpose=purpose,
            expires_at=expires_at,
        )
        db.add(verification)
        db.flush()
        return verification

    def get_valid_email_verification(
        self,
        db: Session,
        user_id: str,
        otp_hash: str,
        purpose: str,
    ) -> Optional[EmailVerification]:
        return (
            db.query(EmailVerification)
            .filter(
                EmailVerification.user_id == user_id,
                EmailVerification.otp_hash == otp_hash,
                EmailVerification.purpose == purpose,
                EmailVerification.verified_at.is_(None),
                EmailVerification.expires_at > utcnow_naive(),
            )
            .first()
        )

    def mark_email_verified(
        self, db: Session, verification: EmailVerification, user: User
    ) -> None:
        now = utcnow_naive()
        verification.verified_at = now
        user.email_verified_at = now
        user.status = "active"
        db.flush()

    def get_tenant_by_slug(self, db: Session, slug: str) -> Optional[Tenant]:
        return (
            db.query(Tenant)
            .filter(Tenant.slug == slug, Tenant.deleted_at.is_(None))
            .first()
        )
