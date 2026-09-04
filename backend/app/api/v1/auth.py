"""Authentication API routes."""

from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.response import success_response
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    RefreshTokenRequest,
    ResetPasswordRequest,
    UpdateMeRequest,
    VerifyEmailRequest,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])
service = AuthService()


@router.post("/login")
def login(data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "")
    result = service.login(db, data, ip, user_agent)
    return success_response(data=result, message="Login successful")


@router.post("/refresh")
def refresh_token(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    result = service.refresh(db, data.refresh_token)
    return success_response(data=result, message="Token refreshed")


@router.post("/logout")
def logout(
    data: RefreshTokenRequest,
    db: Session = Depends(get_db),
    _current_user: dict = Depends(get_current_user),
):
    service.logout(db, data.refresh_token)
    return success_response(message="Logged out successfully")


@router.post("/logout-all")
def logout_all(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service.logout_all(db, current_user["sub"])
    return success_response(message="All sessions logged out")


@router.get("/me")
def get_me(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = service.get_me(db, current_user["sub"])
    return success_response(data=result)


@router.put("/me")
def update_me(
    data: UpdateMeRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = service.update_me(db, current_user["sub"], data)
    return success_response(data=result, message="Profile updated")


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    service.forgot_password(db, data.email, data.tenant_slug)
    return success_response(
        message="If your email is registered, you will receive a reset link"
    )


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    service.reset_password(db, data.token, data.new_password)
    return success_response(message="Password reset successful")


@router.post("/verify-email")
def verify_email(data: VerifyEmailRequest, db: Session = Depends(get_db)):
    service.verify_email(db, data.user_id, data.otp)
    return success_response(message="Email verified successfully")
