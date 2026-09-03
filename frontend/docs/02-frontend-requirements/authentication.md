# Authentication UI — Frontend Requirements

**Existing:** `/login`, `/register`, `/forgot-password`, `/verify-otp`, `/admin/login`.  
**Missing:** reset password, change password, unauthorized, access denied, route guards, role redirect.

Do **not** document backend authentication, JWT, sessions, or password hashing.  
**Backend dependency — frontend implementation will consume the available backend service/API.**

---

## Screens

| Screen | Route | Status |
| --- | --- | --- |
| Student/public Login | `/login` | Done — mock auth + role redirect (student/teacher) |
| Admin Login | `/admin/login` | Done — owner/admin guarded |
| Register | `/register` | Partial — UI; API in Sprint 03 |
| Forgot Password | `/forgot-password` | Partial — UI; API in Sprint 03 |
| Verify OTP | `/verify-otp` | Partial — UI |
| Reset Password | `/reset-password` | Done — route wired |
| Change Password | Per-role settings or `/change-password` | Not started |
| Unauthorized | `/unauthorized` | Done |
| Access Denied | `/access-denied` | Done — route wired |
| Route guards | student / teacher / admin | Done |

Teachers use `/login` with role redirect (**Q-03**, **teacher login route is optional**).

---

## Role-based frontend redirection

After a successful login (when auth data is available):

| Role | Redirect |
| --- | --- |
| Admin / Owner | `/admin/dashboard` |
| Teacher | `/teacher/dashboard` |
| Student | `/student/dashboard` |
| Unknown / missing role | `/unauthorized` |

If a signed-in student opens `/admin/*` → `/access-denied`.  
If a guest opens `/student/*` or `/admin/dashboard` → `/login` (preserve `from` location).

Logout (all layouts): clear frontend auth state, toast, navigate to `/login`. Admin sidebar currently navigates to `/login` or `/admin/login` inconsistently — unify.

---

## Forms and validation (frontend)

### Login (keep existing fields)

- Email required + format
- Password required, min 6 (already)
- Remember me (UI only until API)
- Loading on submit, disabled button, error banner if login fails

### Register (keep existing)

- Full name, email, password, confirm password, agree to terms
- Navigate to login or verify-otp on mock success (already goes to login)

### Forgot password

- Email required
- Success state already exists

### Reset password (new)

- New password, confirm password
- Match + min length
- Success → `/login`

### Change password (new)

- Current password, new password, confirm
- Available from student/admin/teacher settings or profile

---

## UI states

| State | Requirement |
| --- | --- |
| Loading | Button spinner (login already has this) |
| Empty | N/A |
| Error | Inline field errors + form-level message |
| Success | Toast + redirect |
| Disabled | Submit while submitting |

Mount `ToastContainer` at app root so existing toasts work.

---

## Out of scope

- Token storage design beyond “frontend will store whatever the available auth API returns”.
- OTP provider / SMS / email backend.
- Social login (not in existing UI).
