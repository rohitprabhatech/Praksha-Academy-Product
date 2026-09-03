# SPRINT 03 — Authentication & Authorization APIs
**Project:** Praksha Academy SaaS
**Developer:** _(assign name here)_
**Branch:** `feature/sprint-03-auth-apis`
**Base Branch:** `dev`
**Estimated Time:** 8–10 working days

---

## Before You Start — Read This

### What is this project?
Praksha Academy is a **multi-tenant SaaS** platform. One server runs many academies (tenants). Each academy has its own Owner, Teachers, and Students. There is also a Prabha Technology Master Admin who manages all academies.

### How authentication works
- User logs in with email + password
- Server returns two tokens: `access_token` (short-lived, 15 min) and `refresh_token` (long-lived, 30 days)
- Frontend uses `access_token` in every request header: `Authorization: Bearer <token>`
- When access_token expires, frontend uses refresh_token to get a new one
- On logout, we delete the refresh_token from DB (revoke it)

### User Roles (already in DB)
| Role Code | Who is it | tenant_id in users table |
|-----------|-----------|--------------------------|
| `master_admin` | Prabha Technology admin | NULL |
| `owner` | Academy owner | set (e.g. UUID of academy) |
| `teacher` | Teacher in an academy | set |
| `student` | Student in an academy | set |

---

## Step 1 — Create Your Branch

```bash
cd Praksha-Academy-Product/backend

# Make sure you are on latest dev
git checkout dev
git pull origin dev

# Create your sprint branch
git checkout -b feature/sprint-03-auth-apis
```

---

## Step 2 — Understand Existing Code

Before writing anything, read these files:

| File | What it does |
|------|-------------|
| `app/core/config.py` | All settings (JWT secret, token expiry, etc.) |
| `app/core/response.py` | `success_response()` and `error_response()` — use ALWAYS |
| `app/core/database.py` | `get_db()` — DB session dependency |
| `app/core/security.py` | Already has password helpers — extend it |
| `app/models/user.py` | User, UserRole models |
| `app/models/auth_tokens.py` | RefreshToken, UserSession models |
| `app/api/v1/router.py` | Register your new router here |

---

## Step 3 — Files You Must Create

Create **exactly** these files. Do not create anything else.

```
backend/app/
├── schemas/
│   └── auth.py              ← NEW: Pydantic request/response schemas
│
├── repositories/
│   └── auth_repository.py   ← NEW: All DB queries for auth
│
├── services/
│   └── auth_service.py      ← NEW: All business logic
│
├── api/v1/
│   └── auth.py              ← NEW: All route handlers
│
├── core/
│   └── security.py          ← MODIFY: Add JWT functions here
│   └── dependencies.py      ← MODIFY: Add get_current_user dependency
│
└── utils/
    └── email.py             ← NEW: Email sending helper
```

---

## Step 4 — Write the Schemas (`app/schemas/auth.py`)

```python
from pydantic import BaseModel, EmailStr
from typing import Optional, List

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    # tenant_slug is optional — needed when logging in on a tenant portal
    # If None, login is treated as platform login (master_admin)
    tenant_slug: Optional[str] = None

class RegisterStudentRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: Optional[str] = None
    phone: Optional[str] = None
    tenant_slug: str  # required: which academy to register in

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    tenant_slug: Optional[str] = None

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class VerifyEmailRequest(BaseModel):
    user_id: str
    otp: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr
    tenant_slug: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenData(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds

class UserMeResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: Optional[str]
    phone: Optional[str]
    avatar_url: Optional[str]
    tenant_id: Optional[str]
    roles: List[str]
    status: str

class UpdateMeRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
```

---

## Step 5 — Write Security Helpers (`app/core/security.py`)

Add these functions to the **existing** file:

```python
import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: str, tenant_id: str | None, roles: list[str]) -> str:
    """Create a short-lived JWT access token."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {
        "sub": user_id,
        "tenant_id": tenant_id,
        "roles": roles,
        "exp": expire,
        "type": "access",
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT access token. Raises JWTError on failure."""
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])


def generate_refresh_token() -> tuple[str, str]:
    """
    Returns (raw_token, hashed_token).
    Store only hashed_token in DB. Send raw_token to client.
    """
    raw = secrets.token_urlsafe(64)
    hashed = hashlib.sha256(raw.encode()).hexdigest()
    return raw, hashed


def generate_otp() -> tuple[str, str]:
    """
    Returns (plain_otp, hashed_otp).
    Send plain_otp to user email. Store hashed_otp in DB.
    """
    plain = str(secrets.randbelow(900000) + 100000)  # 6-digit OTP
    hashed = hashlib.sha256(plain.encode()).hexdigest()
    return plain, hashed


def hash_token(token: str) -> str:
    """Hash any string token for safe DB storage."""
    return hashlib.sha256(token.encode()).hexdigest()
```

---

## Step 6 — Write the Repository (`app/repositories/auth_repository.py`)

Repository = only DB queries, NO business logic here.

```python
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User, UserRole
from app.models.auth_tokens import RefreshToken, UserSession
from app.models.rbac import Role
from app.models.user import PasswordResetToken, EmailVerification
from app.utils.ids import new_uuid


class AuthRepository:

    def get_user_by_email(self, db: Session, email: str, tenant_id: Optional[str]) -> Optional[User]:
        return db.query(User).filter(
            User.email == email,
            User.tenant_id == tenant_id,
            User.deleted_at == None
        ).first()

    def get_user_by_id(self, db: Session, user_id: str) -> Optional[User]:
        return db.query(User).filter(
            User.id == user_id,
            User.deleted_at == None
        ).first()

    def get_user_roles(self, db: Session, user_id: str) -> list[str]:
        rows = (
            db.query(Role.code)
            .join(UserRole, UserRole.role_id == Role.id)
            .filter(UserRole.user_id == user_id)
            .all()
        )
        return [r[0] for r in rows]

    def create_refresh_token(
        self, db: Session, user_id: str, token_hash: str,
        device_info: str, ip_address: str, expires_at: datetime
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

    def get_refresh_token_by_hash(self, db: Session, token_hash: str) -> Optional[RefreshToken]:
        return db.query(RefreshToken).filter(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked_at == None,
            RefreshToken.expires_at > datetime.now(timezone.utc)
        ).first()

    def revoke_refresh_token(self, db: Session, token: RefreshToken) -> None:
        token.revoked_at = datetime.now(timezone.utc)
        db.flush()

    def revoke_all_user_tokens(self, db: Session, user_id: str) -> None:
        db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            RefreshToken.revoked_at == None
        ).update({"revoked_at": datetime.now(timezone.utc)})
        db.flush()

    def create_session(self, db: Session, user_id: str, refresh_token_id: str,
                       ip_address: str, user_agent: str) -> UserSession:
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
        self, db: Session, user_id: str, token_hash: str, expires_at: datetime
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

    def get_valid_reset_token(self, db: Session, token_hash: str) -> Optional[PasswordResetToken]:
        return db.query(PasswordResetToken).filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at == None,
            PasswordResetToken.expires_at > datetime.now(timezone.utc)
        ).first()

    def mark_reset_token_used(self, db: Session, token: PasswordResetToken) -> None:
        token.used_at = datetime.now(timezone.utc)
        db.flush()

    def update_password(self, db: Session, user: User, new_hash: str) -> None:
        user.password_hash = new_hash
        db.flush()

    def create_email_verification(
        self, db: Session, user_id: str, otp_hash: str,
        purpose: str, expires_at: datetime
    ) -> EmailVerification:
        ev = EmailVerification(
            id=new_uuid(),
            user_id=user_id,
            otp_hash=otp_hash,
            purpose=purpose,
            expires_at=expires_at,
        )
        db.add(ev)
        db.flush()
        return ev

    def get_valid_email_verification(
        self, db: Session, user_id: str, otp_hash: str, purpose: str
    ) -> Optional[EmailVerification]:
        return db.query(EmailVerification).filter(
            EmailVerification.user_id == user_id,
            EmailVerification.otp_hash == otp_hash,
            EmailVerification.purpose == purpose,
            EmailVerification.verified_at == None,
            EmailVerification.expires_at > datetime.now(timezone.utc)
        ).first()

    def mark_email_verified(self, db: Session, ev: EmailVerification, user: User) -> None:
        ev.verified_at = datetime.now(timezone.utc)
        user.email_verified_at = datetime.now(timezone.utc)
        user.status = "active"
        db.flush()

    def get_tenant_by_slug(self, db: Session, slug: str):
        from app.models.platform import Tenant
        return db.query(Tenant).filter(
            Tenant.slug == slug,
            Tenant.deleted_at == None
        ).first()
```

---

## Step 7 — Write the Service (`app/services/auth_service.py`)

Service = business logic. Calls repository for DB. Returns data or raises HTTPException.

```python
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token, generate_refresh_token, generate_otp,
    hash_password, hash_token, verify_password
)
from app.core.config import get_settings
from app.repositories.auth_repository import AuthRepository
from app.schemas.auth import (
    LoginRequest, RegisterStudentRequest, ResetPasswordRequest,
    VerifyEmailRequest, UpdateMeRequest
)
from app.utils.ids import new_uuid
from app.utils.email import send_otp_email, send_password_reset_email

settings = get_settings()
repo = AuthRepository()


class AuthService:

    def login(self, db: Session, data: LoginRequest, ip: str, user_agent: str) -> dict:
        # 1. Find tenant if slug provided
        tenant_id = None
        if data.tenant_slug:
            tenant = repo.get_tenant_by_slug(db, data.tenant_slug)
            if not tenant:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Academy not found")
            tenant_id = tenant.id

        # 2. Find user
        user = repo.get_user_by_email(db, data.email, tenant_id)
        if not user:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

        # 3. Check password
        if not verify_password(data.password, user.password_hash):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

        # 4. Check user status
        if user.status == "suspended":
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Your account has been suspended")
        if user.status == "inactive":
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Your account is inactive")
        if user.status == "pending":
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Please verify your email first")

        # 5. Get roles
        roles = repo.get_user_roles(db, user.id)

        # 6. Create access token
        access_token = create_access_token(user.id, user.tenant_id, roles)

        # 7. Create refresh token
        raw_rt, hashed_rt = generate_refresh_token()
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
        rt_record = repo.create_refresh_token(
            db, user.id, hashed_rt, user_agent, ip, expires_at
        )

        # 8. Create session
        repo.create_session(db, user.id, rt_record.id, ip, user_agent)

        # 9. Update last_login_at
        user.last_login_at = datetime.now(timezone.utc)

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
            }
        }

    def refresh(self, db: Session, raw_refresh_token: str) -> dict:
        token_hash = hash_token(raw_refresh_token)
        rt = repo.get_refresh_token_by_hash(db, token_hash)
        if not rt:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired refresh token")

        user = repo.get_user_by_id(db, rt.user_id)
        if not user:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")

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
            raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
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
            raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
        if data.first_name is not None:
            user.first_name = data.first_name
        if data.last_name is not None:
            user.last_name = data.last_name
        if data.phone is not None:
            user.phone = data.phone
        if data.avatar_url is not None:
            user.avatar_url = data.avatar_url
        db.commit()
        return self.get_me(db, user_id)

    def forgot_password(self, db: Session, email: str, tenant_slug: Optional[str]) -> None:
        tenant_id = None
        if tenant_slug:
            tenant = repo.get_tenant_by_slug(db, tenant_slug)
            if tenant:
                tenant_id = tenant.id

        user = repo.get_user_by_email(db, email, tenant_id)
        # Always return success (security: don't reveal if email exists)
        if not user:
            return

        raw_token, hashed = generate_otp()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)
        repo.create_password_reset_token(db, user.id, hashed, expires_at)
        db.commit()
        send_password_reset_email(user.email, user.first_name, raw_token)

    def reset_password(self, db: Session, token: str, new_password: str) -> None:
        token_hash = hash_token(token)
        rt = repo.get_valid_reset_token(db, token_hash)
        if not rt:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired reset token")
        user = repo.get_user_by_id(db, rt.user_id)
        if not user:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
        new_hash = hash_password(new_password)
        repo.update_password(db, user, new_hash)
        repo.mark_reset_token_used(db, rt)
        # Revoke all refresh tokens for security
        repo.revoke_all_user_tokens(db, user.id)
        db.commit()

    def verify_email(self, db: Session, user_id: str, otp: str) -> None:
        from app.core.security import hash_token
        otp_hash = hash_token(otp)
        user = repo.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
        ev = repo.get_valid_email_verification(db, user_id, otp_hash, "registration")
        if not ev:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired OTP")
        repo.mark_email_verified(db, ev, user)
        db.commit()
```

---

## Step 8 — Write the Dependencies (`app/core/dependencies.py`)

Modify the **existing** file. Add `get_current_user`:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> dict:
    """Extract and validate the JWT token. Returns the decoded payload."""
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload  # dict: {sub, tenant_id, roles, exp}


def require_role(*allowed_roles: str):
    """
    Usage:
        @router.get("/admin")
        def admin_only(user=Depends(require_role("master_admin", "owner"))):
            ...
    """
    def dependency(current_user: dict = Depends(get_current_user)):
        user_roles = current_user.get("roles", [])
        if not any(r in user_roles for r in allowed_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )
        return current_user
    return dependency
```

---

## Step 9 — Write the Route Handlers (`app/api/v1/auth.py`)

```python
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.response import success_response, error_response
from app.schemas.auth import (
    LoginRequest, RefreshTokenRequest, ForgotPasswordRequest,
    ResetPasswordRequest, VerifyEmailRequest, ResendVerificationRequest,
    UpdateMeRequest
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
def logout(data: RefreshTokenRequest, db: Session = Depends(get_db),
           _=Depends(get_current_user)):
    service.logout(db, data.refresh_token)
    return success_response(message="Logged out successfully")


@router.post("/logout-all")
def logout_all(db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    service.logout_all(db, current_user["sub"])
    return success_response(message="All sessions logged out")


@router.get("/me")
def get_me(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    result = service.get_me(db, current_user["sub"])
    return success_response(data=result)


@router.put("/me")
def update_me(data: UpdateMeRequest, db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    result = service.update_me(db, current_user["sub"], data)
    return success_response(data=result, message="Profile updated")


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    service.forgot_password(db, data.email, data.tenant_slug)
    return success_response(message="If your email is registered, you will receive a reset link")


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    service.reset_password(db, data.token, data.new_password)
    return success_response(message="Password reset successful")


@router.post("/verify-email")
def verify_email(data: VerifyEmailRequest, db: Session = Depends(get_db)):
    service.verify_email(db, data.user_id, data.otp)
    return success_response(message="Email verified successfully")
```

---

## Step 10 — Register the Router (`app/api/v1/router.py`)

Open the existing router file and add:

```python
from app.api.v1.auth import router as auth_router

# Inside the include_router section:
api_router.include_router(auth_router)
```

---

## Step 11 — Email Utility (`app/utils/email.py`)

```python
"""Email sending helper.

In development: just print/log the email content.
In production: replace with SMTP or email service (SendGrid, etc.)
"""

import logging
from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


def send_otp_email(to_email: str, name: str, otp: str) -> None:
    """Send OTP for email verification."""
    if settings.is_development:
        logger.info(f"[DEV EMAIL] To: {to_email} | OTP: {otp}")
        print(f"\n{'='*40}")
        print(f"EMAIL VERIFICATION OTP")
        print(f"To: {to_email} ({name})")
        print(f"OTP: {otp}")
        print(f"{'='*40}\n")
        return
    # TODO: Implement SMTP in production


def send_password_reset_email(to_email: str, name: str, token: str) -> None:
    """Send password reset token."""
    if settings.is_development:
        logger.info(f"[DEV EMAIL] To: {to_email} | Reset Token: {token}")
        print(f"\n{'='*40}")
        print(f"PASSWORD RESET")
        print(f"To: {to_email} ({name})")
        print(f"Reset Token: {token}")
        print(f"{'='*40}\n")
        return
    # TODO: Implement SMTP in production
```

---

## Step 12 — Add to `.env`

Open `.env` and make sure these are set:

```env
JWT_SECRET_KEY=change_this_to_a_64_character_random_string_in_production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30
BCRYPT_ROUNDS=12
```

Generate a real secret key with: `python -c "import secrets; print(secrets.token_hex(32))"`

---

## Step 13 — Write Tests

Create `tests/test_auth/` folder and write these test files:

### `tests/test_auth/test_login.py`
Test cases:
1. Valid login returns access_token and refresh_token ✅
2. Wrong password returns 401 ✅
3. Non-existent email returns 401 ✅
4. Suspended user returns 403 ✅
5. Login with correct tenant_slug works ✅

### `tests/test_auth/test_tokens.py`
Test cases:
6. Valid refresh_token gives new access_token ✅
7. Expired refresh_token returns 401 ✅
8. Already-revoked refresh_token returns 401 ✅
9. Logout revokes the refresh_token ✅
10. Logout-all revokes all user tokens ✅

### `tests/test_auth/test_me.py`
Test cases:
11. GET /me with valid token returns user info ✅
12. GET /me with invalid token returns 401 ✅
13. PUT /me updates first_name ✅

### `tests/test_auth/test_password.py`
Test cases:
14. Forgot password with existing email sends OTP ✅
15. Reset password with valid token changes password ✅
16. Reset with invalid/expired token returns 400 ✅
17. After reset, old refresh tokens are revoked ✅

### `tests/test_auth/test_email_verify.py`
Test cases:
18. Verify email with correct OTP sets status to active ✅
19. Verify email with wrong OTP returns 400 ✅
20. Expired OTP returns 400 ✅

---

## Step 14 — Test Your Work

```bash
# Activate virtual environment
cd backend
.\.venv\Scripts\activate      # Windows
source .venv/bin/activate     # Mac/Linux

# Start server and test manually first
uvicorn app.main:app --reload

# Open in browser: http://localhost:8000/docs
# Test each endpoint via Swagger UI

# Run automated tests
pytest tests/test_auth/ -v

# All tests must PASS before submitting PR
```

---

## API Summary Table

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/v1/auth/login` | No | Login with email + password |
| POST | `/api/v1/auth/refresh` | No | Get new access_token |
| POST | `/api/v1/auth/logout` | Yes | Revoke refresh token |
| POST | `/api/v1/auth/logout-all` | Yes | Revoke all sessions |
| GET | `/api/v1/auth/me` | Yes | Get my profile |
| PUT | `/api/v1/auth/me` | Yes | Update my profile |
| POST | `/api/v1/auth/forgot-password` | No | Request password reset |
| POST | `/api/v1/auth/reset-password` | No | Reset password with token |
| POST | `/api/v1/auth/verify-email` | No | Verify email OTP |

---

## Response Format (NEVER change this)

**Success:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errors": {}
}
```

---

## Definition of Done ✅

Before submitting your PR, verify ALL of these:

- [ ] All 9 endpoints return correct responses
- [ ] `pytest tests/test_auth/ -v` — all 20 tests PASS
- [ ] No `.env` file committed to git (only `.env.example`)
- [ ] No hardcoded passwords/secrets in code
- [ ] Every route uses `success_response()` or `error_response()` from `app/core/response.py`
- [ ] Every protected route uses `Depends(get_current_user)`
- [ ] PR title: `feat(sprint-03): Auth APIs — login, refresh, logout, password reset`
- [ ] PR target branch: `dev`

---

## Submitting Your PR

```bash
git add .
git commit -m "feat(sprint-03): implement auth APIs — login, refresh, logout, password reset, email verify"
git push origin feature/sprint-03-auth-apis

# Open GitHub and create PR to dev branch
```
