"""Auth business logic."""

from __future__ import annotations

from datetime import timedelta
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    generate_otp,
    generate_refresh_token,
    hash_password,
    hash_token,
    utcnow_naive,
    verify_password,
)
from app.repositories.auth_repository import AuthRepository
from app.schemas.auth import LoginRequest, UpdateMeRequest
from app.utils.email import send_password_reset_email

settings = get_settings()
repo = AuthRepository()


class AuthService:
    def login(
        self,
        db: Session,
        data: LoginRequest,
        ip: str,
        user_agent: str,
    ) -> dict:
        tenant_id: Optional[str] = None
        if data.tenant_slug:
            tenant = repo.get_tenant_by_slug(db, data.tenant_slug)
            if not tenant:
                raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Academy not found")
            tenant_id = tenant.id

        user = repo.get_user_by_email(db, data.email.lower().strip(), tenant_id)
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if user.status == "suspended":
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="Your account has been suspended",
            )
        if user.status == "inactive":
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="Your account is inactive",
            )
        if user.status == "pending":
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                detail="Please verify your email first",
            )

        roles = repo.get_user_roles(db, user.id)
        access_token = create_access_token(user.id, user.tenant_id, roles)

        raw_rt, hashed_rt = generate_refresh_token()
        expires_at = utcnow_naive() + timedelta(days=settings.refresh_token_expire_days)
        rt_record = repo.create_refresh_token(
            db,
            user.id,
            hashed_rt,
            user_agent[:500] if user_agent else None,
            ip[:45] if ip else None,
            expires_at,
        )
        repo.create_session(
            db,
            user.id,
            rt_record.id,
            ip[:45] if ip else None,
            user_agent[:500] if user_agent else None,
        )
        user.last_login_at = utcnow_naive()
        db.commit()

        return {
            "access_token": access_token,
            "refresh_token": raw_rt,
            "token_type": "bearer",
            "expires_in": settings.access_token_expire_minutes * 60,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "tenant_id": user.tenant_id,
                "roles": roles,
                "status": user.status,
            },
        }

    def refresh(self, db: Session, raw_refresh_token: str) -> dict:
        token_hash = hash_token(raw_refresh_token)
        rt = repo.get_refresh_token_by_hash(db, token_hash)
        if not rt:
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )

        user = repo.get_user_by_id(db, rt.user_id)
        if not user:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="User not found")

        roles = repo.get_user_roles(db, user.id)
        access_token = create_access_token(user.id, user.tenant_id, roles)
        db.commit()

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.access_token_expire_minutes * 60,
        }

    def logout(self, db: Session, raw_refresh_token: str) -> None:
        token_hash = hash_token(raw_refresh_token)
        rt = repo.get_refresh_token_by_hash(db, token_hash)
        if rt:
            repo.revoke_refresh_token(db, rt)
            db.commit()

    def logout_all(self, db: Session, user_id: str) -> None:
        repo.revoke_all_user_tokens(db, user_id)
        db.commit()

    def get_me(self, db: Session, user_id: str) -> dict:
        user = repo.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
        roles = repo.get_user_roles(db, user_id)
        return {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.phone,
            "avatar_url": user.avatar_url,
            "tenant_id": user.tenant_id,
            "roles": roles,
            "status": user.status,
        }

    def update_me(self, db: Session, user_id: str, data: UpdateMeRequest) -> dict:
        user = repo.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

        updates = data.model_dump(exclude_none=True)
        for field, value in updates.items():
            setattr(user, field, value)
        db.commit()
        return self.get_me(db, user_id)

    def forgot_password(
        self,
        db: Session,
        email: str,
        tenant_slug: Optional[str],
    ) -> None:
        tenant_id: Optional[str] = None
        if tenant_slug:
            tenant = repo.get_tenant_by_slug(db, tenant_slug)
            if tenant:
                tenant_id = tenant.id

        user = repo.get_user_by_email(db, email.lower().strip(), tenant_id)
        # Always succeed — do not reveal whether the email exists.
        if not user:
            return

        plain_token, hashed = generate_otp()
        expires_at = utcnow_naive() + timedelta(minutes=30)
        repo.create_password_reset_token(db, user.id, hashed, expires_at)
        db.commit()
        send_password_reset_email(user.email, user.first_name, plain_token)

    def reset_password(self, db: Session, token: str, new_password: str) -> None:
        token_hash = hash_token(token)
        reset = repo.get_valid_reset_token(db, token_hash)
        if not reset:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token",
            )

        user = repo.get_user_by_id(db, reset.user_id)
        if not user:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

        repo.update_password(db, user, hash_password(new_password))
        repo.mark_reset_token_used(db, reset)
        repo.revoke_all_user_tokens(db, user.id)
        db.commit()

    def verify_email(self, db: Session, user_id: str, otp: str) -> None:
        user = repo.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

        otp_hash = hash_token(otp)
        verification = repo.get_valid_email_verification(
            db, user_id, otp_hash, "registration"
        )
        if not verification:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP",
            )

        repo.mark_email_verified(db, verification, user)
        db.commit()

    def create_registration_otp(self, db: Session, user_id: str) -> str:
        """Helper for registration flows / tests — returns plain OTP."""
        plain, hashed = generate_otp()
        expires_at = utcnow_naive() + timedelta(minutes=15)
        repo.create_email_verification(
            db, user_id, hashed, "registration", expires_at
        )
        db.commit()
        return plain
