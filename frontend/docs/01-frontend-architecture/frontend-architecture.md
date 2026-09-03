# Frontend Architecture

**Frontend only.** No backend, database, or API contract design.  
Where data is required: **Backend dependency — frontend implementation will consume the available backend service/API.**

---

## 1. Current architecture

The app is a **single Vite SPA**.

```
Browser
  → main.jsx
    → App.jsx
         ThemeModeProvider
         MUI ThemeProvider (constants/theme.js)
         BrowserRouter
           AppRoutes.jsx
             MainLayout → public pages
             auth pages (no layout)
             StudentLayout → student pages
             AdminRoutes.jsx → /admin/login, dashboard, profile, settings
             AdminLayout (again) → content/reports pages
             NotFound
```

### What exists

| Layer | Current state |
| --- | --- |
| Pages | Public, auth, student, admin content/reports |
| Layouts | MainLayout, StudentLayout, AdminLayout |
| Components | Feature-foldered (about, contact, courses, admin, student, auth) |
| State | Local `useState` + ThemeModeContext. No auth context. No global store. |
| Services | `httpClient.js` (axios, `baseURL: '/'`) and unused `adminApi` |
| Validation | react-hook-form on auth/student/admin forms; Contact uses custom validate |
| Data | Static JS modules (`data/`, `constants/`) |
| Hooks | None (`src/hooks` does not exist) |
| Route guards | None |

### Problems the current architecture creates

1. Two admin route trees.
2. Two admin sidebars; TopNavbar unused.
3. Two theme modules.
4. Toasts without a root `ToastContainer`.
5. No role model in the frontend (Admin vs Student only; Teacher absent).
6. Pages own mock arrays — no shared frontend service layer.

---

## 2. Recommended frontend architecture

Keep Vite + React + MUI + Bootstrap. Do not introduce a new framework.

Add only what is missing:

```
App
 ├─ ThemeModeProvider
 ├─ AuthProvider          (frontend session/role only)
 ├─ ToastContainer
 └─ Router
      ├─ Public routes + MainLayout
      ├─ Auth routes
      ├─ Owner/Admin routes + AdminLayout + RequireRole(admin)
      ├─ Teacher routes + TeacherLayout + RequireRole(teacher)
      └─ Student routes + StudentLayout + RequireRole(student)
```

### Principles

1. **One layout per role.**
2. **One sidebar per role.** Delete or merge duplicates.
3. **Pages are thin.** Fetch/display via services + hooks.
4. **Courses are dynamic records**, never one React page per course name.
5. **Mock-first is allowed** until API exists; mock adapters live in `services/`, not inside JSX forever.
6. **Do not design APIs here.** When a backend is available, swap the service implementation.

### Role mapping

| Product role | Frontend app | Route prefix | Layout |
| --- | --- | --- | --- |
| Public visitor | Marketing site | `/` | MainLayout |
| Academy Owner | Existing Admin UI | `/admin` | AdminLayout |
| Teacher | New | `/teacher` | TeacherLayout |
| Student | Existing | `/student` | StudentLayout |

---

## 3. Page organization

```
src/pages/
  public/          (optional move later: Home, Courses, About, Contact, Blog, Programs, legal)
  auth/            (already exists)
  admin/           (owner — keep this name until Q-01/Q-02 answered)
  teacher/         (new)
  student/         (already exists)
```

Do not create `pages/python` or `pages/java`. Course screens take `:courseId` or `:slug`.

---

## 4. Component organization

```
src/components/
  common/          Button patterns, EmptyState, Loader, ErrorState, Toast usage
  navigation/      Public Navbar, Footer
  layouts/         (layouts stay in src/layouts)
  admin/
    common/        DataTable, PageHeader, AdminModal, StatCard, AdminSurface
    charts/
  teacher/         (new — reuse admin common where possible)
  student/         (exists)
  courses/         Public catalog/details
  auth/
  about/ contact/ home/
```

**Reuse admin common components** for teacher tables/forms. Do not clone DataTable.

---

## 5. Reusable components (recommended set)

Already present — extend, do not duplicate:

- Admin: DataTable, PageHeader, AdminModal, StatCard, AdminSurface, charts
- Student: cards, sidebar, header
- Public: course cards, filters, pagination
- Common: SectionHeading, ImagePlaceholder, VideoModal

To add (shared, used by all dashboards):

- EmptyState, ErrorState, PageLoader/Skeleton
- ConfirmDialog (AdminModal can wrap this)
- StatusBadge
- FileUpload field
- SearchInput / FilterBar (DataTable already has search)

See `docs/05-ui-ux/reusable-components.md`.

---

## 6. Layouts

| Layout | Chrome | Used by |
| --- | --- | --- |
| MainLayout | Navbar, Footer | Public |
| AuthLayout (optional extract) | Split marketing + form | Login, Register, Forgot, OTP, Reset |
| AdminLayout | Sidebar + TopNavbar + outlet | Owner |
| TeacherLayout | Sidebar + TopNavbar + outlet | Teacher |
| StudentLayout | Sidebar + outlet | Student |

AdminLayout should mount **one** sidebar and the existing TopNavbar.

---

## 7. Route organization

Recommended files (documentation only — do not change code in this planning task):

```
src/routes/
  AppRoutes.jsx          compose all
  PublicRoutes.jsx
  AuthRoutes.jsx
  AdminRoutes.jsx        owner — expand, do not split across AppRoutes
  TeacherRoutes.jsx      new
  StudentRoutes.jsx      extract from AppRoutes
  guards/
    RequireAuth.jsx
    RequireRole.jsx
```

See `docs/01-frontend-architecture/route-plan.md`.

---

## 8. State management organization

No Redux/Zustand is required for the remaining work unless complexity grows.

| State | Where |
| --- | --- |
| Theme | ThemeModeContext (exists) |
| Auth session/role | new AuthContext (frontend only) |
| Table filters, pagination, form fields | local component state |
| Server/cache data | React Query **not currently installed** — optional later; start with service functions + useEffect/useState or small hooks |

Do not put course lists in random page-level constants long term. Move to `services/` + `data/mocks/`.

---

## 9. Frontend service organization

```
src/services/
  httpClient.js          (exists)
  api.js                 (exists — expand as thin wrappers when API is available)
  mocks/                 local mock adapters for development
```

Each feature service (courses, students, teachers, auth) should:

- expose functions used by pages
- return UI-ready data
- internally call the available API **or** mock

**Backend dependency — frontend implementation will consume the available backend service/API.**

Do not document endpoints, payloads, or tables here.

---

## 10. Validation organization

| Area | Approach |
| --- | --- |
| Auth, profile, admin CMS forms | react-hook-form (already used) |
| Contact | migrate to react-hook-form for consistency (later sprint) |
| Shared rules | `src/utils/validation.js` (email, phone, required, min length) |

Client-side validation only. Server errors display in Error state when API exists.

---

## 11. Utility organization

```
src/utils/
  certificatePdf.js      (exists)
  validation.js          (new)
  format.js              (currency, dates)
  storage.js             (theme already in context; auth token storage when API exists)
```

---

## 12. What not to do

- Do not add a backend folder.
- Do not create course-specific page files (`PythonCourse.jsx`).
- Do not create a second design system.
- Do not add a new CSS framework.
- Do not push feature work to `main`.
