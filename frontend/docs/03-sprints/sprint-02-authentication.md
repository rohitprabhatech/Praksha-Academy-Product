# Sprint 02 — Authentication UI Completion

## 1. Sprint Owner

Developer:Gaurav thorat  
Branch: `feature/sprint-02-authentication`  
Status: Not Started  
Estimated Duration:2 days

---

## 2. Sprint Goal

Finish frontend authentication: guests cannot open dashboards; login sends Owner/Admin, Teacher, and Student to the correct home; add Reset Password, Change Password, Unauthorized, and Access Denied screens. Do not implement backend auth.

---

## 3. Why This Sprint Exists

Student and admin dashboards are currently open URLs. Building more pages without guards makes every module insecure in the UI sense and blocks role-based Teacher work.

---

## 4. Prerequisites

* Sprint 01 merged (ToastContainer, stable `App.jsx`)
* Existing pages: `pages/auth/Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `VerifyOtp.jsx`, `pages/admin/Login/AdminLogin.jsx`
* Existing forms: `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `VerifyOtpForm`
* `react-hook-form` already used

**BLOCKER:** if Sprint 01 is not merged, toasts and app root are unreliable.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Login | `/login` | Partial | After mock success, redirect by role; error banner; keep validation |
| Register | `/register` | Partial | Keep; still go to login or verify-otp |
| Forgot Password | `/forgot-password` | Partial | Keep success UI; link to reset |
| Verify OTP | `/verify-otp` | Partial | Keep; handle missing email state |
| Admin Login | `/admin/login` | Partial | Block empty submit; go to `/admin/dashboard` only when fields valid (mock) |
| Reset Password | `/reset-password` | Missing | New page matching auth card style |
| Unauthorized | `/unauthorized` | Missing | New |
| Access Denied | `/access-denied` | Missing | New |
| Change Password | Student profile or `/student/settings` section | Missing | Fields on student profile **or** settings; admin profile too if small |

---

## 6. Page-by-Page Development Instructions

### Login `/login`

#### Page Purpose
Public/student (and later teacher) sign-in.

#### User
Student, Teacher (same form; role from mock until API). Owner may keep `/admin/login`.

#### Entry Point
Navbar Login; redirects from guarded routes (`state.from`).

#### UI Layout
Keep existing split panel (blue left, form card right). Do not redesign.

#### Header
Existing “Welcome Back”.

#### Sidebar
None.

#### Main Content
Existing `LoginForm`.

#### Actions
Sign in, Forgot password, Create account.

#### Forms
Email, password, remember me.

#### Validation
Email required + format; password required, min 6 (already).

#### Loading State
Existing button spinner — keep.

#### Empty State
N/A.

#### Error State
Form-level message if mock login fails.

#### Success State
Visible toast + redirect: student → `/student/dashboard`; teacher → `/teacher/dashboard` (if route missing, `/unauthorized` until Sprint 14); do not send students to admin.

#### Responsive Behavior
Desktop: two columns. Tablet/Mobile: form only (already).

---

### Admin Login `/admin/login`

#### Page Purpose
Owner sign-in.

#### User
Owner/Admin.

#### Entry Point
Direct URL or admin logout.

#### UI Layout
Keep existing centered card.

#### Header
“Admin Login”.

#### Sidebar
None.

#### Main Content
Email, password, remember, forgot, submit.

#### Actions
Login to Dashboard.

#### Forms
See table below.

#### Validation
HTML required is not enough — disable or block navigation when email/password empty; email format.

#### Loading State
Optional spinner on button.

#### Empty State
N/A.

#### Error State
Inline if invalid.

#### Success State
Navigate `/admin/dashboard`.

#### Responsive Behavior
Centered card, full width padding on mobile.

---

### Reset Password `/reset-password`

#### Page Purpose
Set a new password after forgot-password/OTP.

#### User
Any recovering account.

#### Entry Point
Link from forgot-password success or email (frontend-only).

#### UI Layout
Same card style as Login right panel (reuse layout patterns from Login/ForgotPassword).

#### Header
“Set new password”.

#### Sidebar
None.

#### Main Content
New password, confirm password, submit, back to login.

#### Actions
Save password; Back to login.

#### Forms
See table.

#### Validation
Required, min 6, passwords match.

#### Loading State
Button spinner.

#### Empty State
N/A.

#### Error State
Mismatch / required messages.

#### Success State
Toast + `/login`.

#### Responsive Behavior
Single column card, max-width ~520px.

---

### Unauthorized `/unauthorized`

#### Page Purpose
Signed-in user has no known role.

#### User
Any.

#### Entry Point
Role redirect when role missing.

#### UI Layout
Simple card in MainLayout or bare centered card + link Home / Login.

#### Header
“We could not sign you in to a dashboard”.

#### Sidebar
None.

#### Main Content
Short explanation + buttons.

#### Actions
Go to Home, Go to Login.

#### Forms
None.

#### Validation
None.

#### Loading / Empty / Error
N/A / N/A / N/A.

#### Success State
N/A.

#### Responsive Behavior
Centered, padded.

---

### Access Denied `/access-denied`

#### Page Purpose
Wrong role (student opening `/admin/dashboard`).

#### User
Authenticated wrong role.

#### Entry Point
Guard.

#### UI Layout
Same as Unauthorized with different copy.

#### Header
“You do not have access to this area”.

#### Actions
Go to my dashboard (based on role), Home.

#### Responsive Behavior
Same as Unauthorized.

---

### Change Password (Student Profile existing `/student/profile`)

#### Page Purpose
Authenticated password change.

#### User
Student (repeat pattern on admin profile if time).

#### Entry Point
Profile page new section.

#### UI Layout
Existing profile form + new card below.

#### Forms
Current, new, confirm.

#### Validation
All required; new min 6; new === confirm.

#### Loading / Empty / Error / Success
Spinner on save; N/A; mismatch errors; toast.

#### Responsive Behavior
Existing profile stack.

---

## 7. Component Requirements

| Component | Purpose | Where | Reuse? |
| --- | --- | --- | --- |
| LoginForm | Student/teacher login | `/login` | Exists — extend submit |
| RegisterForm | Register | `/register` | Exists |
| ForgotPasswordForm | Email | `/forgot-password` | Exists |
| VerifyOtpForm | OTP | `/verify-otp` | Exists |
| AuthContext | Frontend session { role, name } | App | **New** |
| RequireAuth | Redirect guests | Route wrapper | **New** |
| RequireRole | Redirect wrong role | Route wrapper | **New** |
| Reset password form | New passwords | `/reset-password` | New form, same TextField `sx` as LoginForm — **do not clone a new Input kit** |

---

## 8. User Flow

Guest opens `/student/dashboard`  
→ `/login`  
→ Fills email/password  
→ Validate  
→ Mock success  
→ Toast  
→ `/student/dashboard`  

Guest opens `/admin/dashboard`  
→ `/login` or `/admin/login` (keep admin login working)  
→ Admin dashboard  

Student while logged in opens `/admin/dashboard`  
→ `/access-denied`  

Forgot password  
→ email  
→ success UI  
→ `/reset-password`  
→ new password  
→ `/login`  

Logout (student sidebar / admin sidebar)  
→ clear frontend auth state  
→ `/login`  
→ Back button cannot stay on dashboard

---

## 9. Frontend Data States

### Loading
Submit spinners.

### Empty
N/A.

### Error
Field + form errors.

### Success
Toast + redirect.

### Disabled
Submit while submitting.

### Confirmation
None.

---

## 10. Search / Filter / Sort / Pagination

None.

---

## 11. Form Requirements

### Login `/login`

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| email | email | Yes | format | Existing adornment |
| password | password | Yes | min 6 | Show/hide toggle existing |
| rememberMe | checkbox | No | — | Existing |

Submit: Sign in. Cancel: none. Reset: none. Success toast. Error banner. Disabled + loading while submit.

### Admin login

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| email | email | Yes | format | Existing |
| password | password | Yes | min 6 | Show/hide |
| remember | checkbox | No | — | Existing |

Must **not** `navigate('/admin/dashboard')` if fields empty.

### Reset password

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| password | password | Yes | min 6 | show/hide |
| confirmPassword | password | Yes | match | show/hide |

Submit: Update password. Cancel: link to login.

### Change password

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| currentPassword | password | Yes | required | show/hide |
| newPassword | password | Yes | min 6 | show/hide |
| confirmPassword | password | Yes | match | show/hide |

**Backend dependency: frontend will consume the available backend/API service.** Mock delay is OK.

---

## 12. Acceptance Criteria

- [ ] Developer can open `/login`, `/register`, `/forgot-password`, `/reset-password`, `/unauthorized`, `/access-denied`.
- [ ] Page has correct route.
- [ ] Navigation works.
- [ ] Required UI sections are present.
- [ ] Forms contain all required fields.
- [ ] Required fields are validated.
- [ ] Buttons work correctly.
- [ ] Loading state exists.
- [ ] Empty state exists (N/A pages skipped).
- [ ] Error state exists.
- [ ] Success state exists.
- [ ] Responsive layout works.
- [ ] Existing reusable components are reused.
- [ ] No unnecessary duplicate components.
- [ ] No console errors.
- [ ] No broken navigation.
- [ ] Unauthenticated user cannot remain on `/student/dashboard` or `/admin/dashboard`.
- [ ] Wrong role sees access denied.
- [ ] Admin login empty submit does not enter dashboard.
- [ ] PR created to `dev`.
- [ ] PR reviewed.
- [ ] Sprint tested.

---

## 13. Developer Checklist

### Before Development

- [ ] Pull latest `dev`.
- [ ] Read this document.
- [ ] Confirm Sprint 01 merged.
- [ ] Read existing auth forms.
- [ ] Branch `feature/sprint-02-authentication`.

### During Development

- [ ] Follow conventions.
- [ ] Reuse LoginForm styles.
- [ ] Do not duplicate TextField kits.
- [ ] Keep UI consistent.
- [ ] Handle UI states.
- [ ] Test each page.

### Before PR

- [ ] Run locally.
- [ ] Test all auth routes + guards.
- [ ] Test forms.
- [ ] Test responsive.
- [ ] Console clean.
- [ ] Remove debug.
- [ ] No unrelated files.
- [ ] PR to `dev` titled `[Sprint 02] Authentication UI Completion`.

---

## 14. Definition of Done

- [ ] All sprint requirements completed.
- [ ] All pages completed.
- [ ] All required components completed.
- [ ] Navigation verified.
- [ ] Forms verified.
- [ ] Validation verified.
- [ ] Loading / empty / error states completed.
- [ ] Responsive UI completed.
- [ ] No duplicate components.
- [ ] No console errors.
- [ ] No broken routes.
- [ ] Developer testing completed.
- [ ] PR created, reviewed, comments resolved, merged to `dev`.
- [ ] QA completed.
- [ ] Sprint marked Completed.

---

## 15. Sprint Dependency Rule

### Depends On
Sprint 01.

### Blocks
Sprint 04 (owner pages must be guarded). Sprint 14 (teacher redirect). Sprint 17 (student already exists but must stay guarded).

### Can Run in Parallel
Not with Sprint 01. Sprint 03 (public website) can start after 01 without waiting for 02 **only if** Team Lead accepts two branches; default sequential: 02 before 04.
