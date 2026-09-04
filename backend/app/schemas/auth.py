"""Auth request/response Pydantic schemas."""

from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)
    # Optional — needed when logging in on a tenant portal.
    # If None, treated as platform login (master_admin).
    tenant_slug: Optional[str] = None


class RegisterStudentRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    phone: Optional[str] = Field(default=None, max_length=30)
    tenant_slug: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    tenant_slug: Optional[str] = None


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8)


class VerifyEmailRequest(BaseModel):
    user_id: str
    otp: str = Field(min_length=4, max_length=10)


class ResendVerificationRequest(BaseModel):
    email: EmailStr
    tenant_slug: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class UpdateMeRequest(BaseModel):
    first_name: Optional[str] = Field(default=None, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    phone: Optional[str] = Field(default=None, max_length=30)
    avatar_url: Optional[str] = Field(default=None, max_length=500)


class UserMeResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    tenant_id: Optional[str] = None
    roles: List[str] = []
    status: str
