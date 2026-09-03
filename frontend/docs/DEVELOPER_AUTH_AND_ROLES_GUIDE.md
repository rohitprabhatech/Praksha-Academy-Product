# Praksha Academy — Frontend Auth & Role Updates (Developer Guide)

**Audience:** New developers joining the project  
**Last updated:** 2026-09-03  
**Purpose:** One place to understand the latest login, roles, dashboards, and how they connect to the backend.

---

## 1. Product roles (who is who)

| Role (UI / storage) | Backend role code | Who | Dashboard after login |
| --- | --- | --- | --- |
| `master_admin` | `master_admin` | **Prabha Technology** platform admin | `/platform/dashboard` |
| `admin` | `owner` (normalized to `admin`) | Academy Owner | `/admin/dashboard` |
| `teacher` | `teacher` | Teacher in a tenant | `/teacher/dashboard` |
| `student` | `student` | Student in a tenant | `/student/dashboard` |

**Important**

- There is **one login page for everyone:** `/login`
- `/admin/login` redirects to `/login` (kept for old bookmarks)
- Owner still uses `/admin/*` routes (interim decision Q-01 — do not rename to `/owner` until Team Lead confirms)

---

## 2. Demo accounts (mock auth)

Mock auth is ON by default (`VITE_USE_MOCK_AUTH=true`).

| Email | Password | Opens |
| --- | --- | --- |
| `master@prabhatech.com` | `master123` | Prabha Technology dashboard |
| `admin@praksha.academy` | `admin123` | Academy Owner dashboard |
| `teacher@praksha.com` | `teacher123` | Teacher dashboard |
| `student@praksha.com` | `student123` | Student dashboard |

Defined in: `frontend/src/services/authService.js` → `MOCK_USERS`

---

## 3. Unified login flow

```
User opens /login
      ↓
Enters email + password
      ↓
authService.loginRequest()
      ↓
AuthContext stores user + tokens (localStorage or sessionStorage)
      ↓
Redirect by role:
  master_admin → /platform/dashboard
  admin/owner  → /admin/dashboard
  teacher      → /teacher/dashboard
  student      → /student/dashboard
```

Key files:

- `src/pages/auth/Login.jsx` + `src/components/auth/LoginForm.jsx`
- `src/context/AuthContext.jsx`
- `src/services/authService.js`
- `src/constants/roles.js` → `getDashboardPathForRole()`

---

## 4. Route protection

Guards:

- `RequireAuth` — must be logged in
- `RequireRole` — must have allowed role (owner/admin alias aware)

| Area | Path prefix | Allowed roles |
| --- | --- | --- |
| Platform (Prabha Tech) | `/platform/*` | `master_admin` |
| Academy Owner | `/admin/*` (except redirected login) | `admin`, `owner` |
| Teacher | `/teacher/*` | `teacher` |
| Student | `/student/*` | `student` |

Wrong role → `/access-denied`  
Unknown role → `/unauthorized`  
Guest → `/login`

---

## 5. Prabha Technology (Master Admin) dashboard

**Goal:** Platform team reviews **new academy registration requests**, accepts or rejects them, and sees tenant academies.

### Routes

| Path | Page |
| --- | --- |
| `/platform/dashboard` | Stats + recent requests |
| `/platform/requests` | List requests → **Accept** / **Reject** |
| `/platform/academies` | Active / trial academies (tenants) |

### Files

| File | Purpose |
| --- | --- |
| `src/routes/PlatformRoutes.jsx` | Route tree + guards |
| `src/layouts/PlatformLayout.jsx` | Shell |
| `src/components/platform/PlatformSidebar.jsx` | Nav |
| `src/pages/platform/Dashboard.jsx` | Overview |
| `src/pages/platform/RegistrationRequests.jsx` | Accept / Reject UI |
| `src/pages/platform/Academies.jsx` | Tenant list |
| `src/services/platformService.js` | Mock data + approve/reject logic |

**Note:** This is frontend mock data until backend Master Admin / tenant APIs (Sprint 04+) exist. Accepting a request currently updates in-memory mock lists only.

---

## 6. API client readiness (Sprint 03)

| Setting | Default | Meaning |
| --- | --- | --- |
| `VITE_USE_MOCK_AUTH` | `true` | Use mock users |
| `VITE_API_BASE_URL` | `/api/v1` | Axios base path |

- `src/services/httpClient.js` — attaches `Authorization: Bearer <token>`
- `vite.config.js` — proxies `/api` → `http://127.0.0.1:8000`
- `src/services/api.js` — `authApi` helpers for real endpoints

When Sprint 03 auth APIs are live:

1. Create `frontend/.env.local`
2. Set `VITE_USE_MOCK_AUTH=false`
3. Restart Vite

---

## 7. How to run & test

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open: http://127.0.0.1:5173/login

### Backend (already needed for health; auth APIs later)

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Quick checklist

1. Login as each of the 4 demo users → correct dashboard  
2. Open `/student/dashboard` while logged in as teacher → `/access-denied`  
3. Open `/platform/requests` as master admin → Accept a pending request  
4. Logout → always returns to `/login`

---

## 8. Folder map (auth-related)

```
frontend/src/
├── constants/roles.js              # Roles, redirects, helpers
├── context/AuthContext.jsx         # Session state
├── services/
│   ├── authService.js              # Login/register mock + API switch
│   ├── platformService.js          # Master Admin mock requests
│   ├── httpClient.js               # Axios + token
│   └── api.js                      # Endpoint helpers
├── components/auth/                # Login form, RequireAuth, RequireRole
├── components/platform/            # Platform sidebar
├── layouts/PlatformLayout.jsx
├── pages/
│   ├── auth/                       # Login, reset, access-denied, unauthorized
│   ├── platform/                   # Master Admin pages
│   ├── admin/                      # Owner academy admin
│   ├── teacher/                    # Teacher shell
│   └── student/                    # Student app
└── routes/
    ├── AppRoutes.jsx
    ├── PlatformRoutes.jsx
    ├── AdminRoutes.jsx
    └── TeacherRoutes.jsx
```

---

## 9. What is still mock / not finished

| Item | Status |
| --- | --- |
| Real JWT login/register APIs | Sprint 03 (backend) |
| Persist registration requests in MySQL | Later platform sprint |
| Full teacher modules | Later frontend sprints |
| Rename `/admin` → `/owner` | Waiting on Q-01 decision |
| Change password page | Not started |
| Master Admin create-tenant form (beyond accept) | Future enhancement |

---

## 10. Rules for new developers

1. Do **not** add a second login page for a role — extend `/login` + role redirect.  
2. Do **not** trust `tenant_id` from the client when writing backend code — derive from token.  
3. Keep Owner UI under `/admin/*` until Team Lead renames it.  
4. Prefer updating this file when auth/role routing changes again.  
5. Backend source of truth for tables: `backend/database/schema.sql` + `backend/docs/database/`.

---

## 11. Related docs

- `frontend/docs/02-frontend-requirements/authentication.md`
- `frontend/docs/DEVELOPER_WEBSITE_CMS_GUIDE.md` — **Owner website CMS (Home/Courses/Programs/About/Contact)**
- `frontend/docs/00-project-analysis/open-questions.md` (Q-01 Owner vs Admin)
- `backend/docs/sprint-01-backend-foundation.md`
- `backend/docs/sprint-02-database.md`
- `backend/docs/database/02-multi-tenant-architecture.md`
