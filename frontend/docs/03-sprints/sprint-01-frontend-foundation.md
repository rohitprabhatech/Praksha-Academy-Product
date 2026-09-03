# Sprint 01 — Frontend Foundation & Shared Shell

## 1. Sprint Owner

Developer: *Aditya Wakchaure**  
Branch: `feature/sprint-01-frontend-foundation`  
Status:Started  
Estimated Duration: 2 days

---

## 2. Sprint Goal

Make the existing app a stable base: toasts actually appear, the owner/admin area uses **one** layout (one sidebar + the unused TopNavbar), shared loading/empty/error UI exists, and the academy logo is not a broken image. Do **not** build Students, Courses, or Teacher Dashboard in this sprint.

---

## 3. Why This Sprint Exists

Later sprints add many admin pages. If Ganesh (or anyone) adds them on top of two sidebars, split `/admin` routes, and silent `toast()` calls, every module will look different and bugs will multiply. This sprint is the onboarding sprint: Ganesh must read the real layouts and routes before owning a product module.

---

## 4. Prerequisites
Adita Wakchure must already have:

* Read `docs/00-project-analysis/current-project-analysis.md`
* Read `docs/04-development/developer-onboarding-ganesh.md`
* Local `frontend` running (`npm install` / `npm run dev` inside `frontend/`)
* Existing `AdminLayout.jsx`, `AdminSidebar.jsx`, `Sidebar.jsx`, `TopNavbar.jsx`
* Existing `App.jsx` and `routes/AppRoutes.jsx` + `AdminRoutes.jsx`
* Existing `react-toastify` dependency (already in `package.json`) — **do not install new packages unless Team Lead approves**
* Existing reusable pieces: `PageHeader`, `DataTable`, `AdminModal`, `StatCard`, `AdminSurface`

**BLOCKER:** none for starting. If `praksha-mark.png` cannot be obtained, use a Team Lead–approved placeholder in `src/assets/` and document it in the PR — do not invent a second logo component.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| App root | all | Needs improvement | Mount `ToastContainer`; keep ThemeProvider |
| Admin layout chrome | `/admin/*` | Partial / duplicate | One sidebar; mount `TopNavbar`; mobile menu still works |
| Admin Dashboard | `/admin/dashboard` | Complete UI, wrong/inconsistent chrome | Must render inside unified layout |
| Admin Blog List | `/admin/blog` | Complete mock UI | Must use same layout as dashboard (not a second tree that 404s) |
| Student Dashboard | `/student/dashboard` | Complete mock | No visual redesign; confirm toasts if logout used |
| Public Home | `/` | Complete | Logo not broken; no other Home rewrite |

No new product routes.

---

## 6. Page-by-Page Development Instructions

### App root (`src/App.jsx`)

#### Page Purpose
Host theme, router, and global toast UI.

#### User
All users.

#### Entry Point
Application boot (`main.jsx`).

#### UI Layout
Unchanged visually except toasts appear at a corner.

#### Header / Sidebar / Main Content
Unchanged.

#### Actions
None new.

#### Forms
None.

#### Validation
None.

#### Loading State
N/A.

#### Empty State
N/A.

#### Error State
N/A.

#### Success State
`toast.success` from Login or Admin logout becomes **visible**.

#### Responsive Behavior
Desktop / tablet / mobile: toast must not cover the whole screen; use default `react-toastify` position (e.g. top-right).

---

### Admin layout (`src/layouts/AdminLayout.jsx`)

#### Page Purpose
Single chrome for every owner/admin page.

#### User
Owner (existing Admin).

#### Entry Point
Any `/admin/*` page except `/admin/login`.

#### UI Layout
Desktop: left sidebar (full height) + right column (TopNavbar sticky + page outlet).  
Mobile: TopNavbar with hamburger; sidebar in Drawer (already exists in both sidebar files).

#### Header
Use existing `components/admin/TopNavbar.jsx` (search may stay non-functional). Include theme toggle, notification icon, profile menu that already exist inside TopNavbar.

#### Sidebar
Use **one** implementation only. Recommended: keep the sidebar that `AdminLayout` already imports (`AdminSidebar.jsx`) **or** switch to `Sidebar.jsx` if Team Lead prefers the blue full-nav version — **do not render both**. Enable links that already have pages (Dashboard, Blog, Gallery, FAQ, Testimonials, Notifications, Contact Messages, Reports, Profile, Settings). Leave Students/Teachers/Courses etc. as disabled “Soon” if using the full nav constants in `adminDashboard.js`.

#### Main Content
Existing `<Outlet />`. Do not restyle every inner page.

#### Actions
Logout from sidebar and/or ProfileMenu: toast + navigate to `/login` or `/admin/login` (pick one and use it consistently; document in PR).

#### Forms
None.

#### Validation
None.

#### Loading State
N/A for layout.

#### Empty State
N/A.

#### Error State
N/A.

#### Success State
Logout toast visible.

#### Responsive Behavior
Desktop (≥900px / `md` or `lg` as currently coded): permanent sidebar.  
Tablet: drawer.  
Mobile: drawer + compact TopNavbar. No double hamburger bars.

---

### Shared feedback pages (not routes — components)

Create only if missing:

* `EmptyState` — title, short message, optional button
* `ErrorState` — message + Retry button slot
* `PageLoader` — centered spinner or skeleton block

Put them in `src/components/common/` (folder already exists). **Do not** create `components/ui/` yet (folder migration is documented, not this sprint’s job).

#### Loading / Empty / Error
These components **are** the states. Prove they render by using EmptyState on an existing empty table if easy, or a Story-less demo is not required — using them on Admin Blog empty search is enough.

#### Responsive Behavior
Desktop: centered in content width.  
Tablet/Mobile: full width with 16px padding.

---

## 7. Component Requirements

| Component Name | Purpose | Where used | Reuse existing? |
| --- | --- | --- | --- |
| ToastContainer | Show toasts | `App.jsx` | Library — do not write a custom toast |
| AdminLayout | Owner chrome | All `/admin` pages except login | Exists — **edit, do not duplicate** |
| AdminSidebar **or** Sidebar | Nav | AdminLayout | Two files exist — **use one only** |
| TopNavbar | Admin header | AdminLayout | Exists, currently unused — **wire it** |
| Breadcrumb | Path label | Inside TopNavbar | Exists — do not duplicate |
| ProfileMenu | Account menu | Inside TopNavbar | Exists |
| NotificationDropdown | Bell menu | Inside TopNavbar | Exists |
| EmptyState | No data | Shared | **New** if not present |
| ErrorState | Fetch/UI error | Shared | **New** if not present |
| PageLoader | Loading | Shared | **New** if not present |
| PageHeader / DataTable | Unchanged | Content pages | Reuse — do not clone |

---

## 8. User Flow

Ganesh starts `npm run dev`  
→ Open `/login` → submit mock login → **toast is visible**  
→ Open `/admin/login` → enter dashboard  
→ See **one** sidebar + top bar  
→ Click Blog in sidebar → `/admin/blog` still in **same** chrome (not 404, not a second sidebar style)  
→ Click Dashboard → back to KPIs  
→ Open mobile width → hamburger opens drawer  
→ Logout → toast + login screen  
→ Open `/` → logo image is not broken  
→ Open `/student/dashboard` → still works (no regression)

---

## 9. Frontend Data States

### Loading
PageLoader component exists and can wrap outlet later; dashboard may keep current static data.

### Empty
EmptyState component exists.

### Error
ErrorState component exists.

### Success
Toasts visible.

### Disabled
“Soon” nav items not clickable.

### Confirmation
Not required this sprint (no delete flows).

---

## 10. Search / Filter / Sort / Pagination

TopNavbar search: **leave non-functional** (Sprint 03 wires public navbar search). Do not invent admin global search.

---

## 11. Form Requirements

No new forms. Do not change Login field tables in this sprint.

---

## 12. Acceptance Criteria

- [ ] Developer can open the page (`/`, `/login`, `/admin/dashboard`, `/admin/blog`, `/student/dashboard`).
- [ ] Page has correct route (no new routes required).
- [ ] Navigation works between dashboard and existing content pages under one layout.
- [ ] Required UI sections are present (sidebar + TopNavbar on admin).
- [ ] Forms contain all required fields (unchanged).
- [ ] Required fields are validated (unchanged).
- [ ] Buttons work correctly (logout, menu).
- [ ] Loading state exists (shared PageLoader).
- [ ] Empty state exists (shared EmptyState).
- [ ] Error state exists (shared ErrorState).
- [ ] Success state exists (visible toast).
- [ ] Responsive layout works (desktop, tablet, mobile admin chrome).
- [ ] Existing reusable components are reused (TopNavbar, not a new header).
- [ ] No unnecessary duplicate components (only one sidebar mounted).
- [ ] No console errors.
- [ ] No broken navigation.
- [ ] Logo is not a broken image.
- [ ] `AdminRoutes` and `AppRoutes` admin trees no longer fight (blog reachable with same layout).
- [ ] PR is created to `dev`.
- [ ] PR is reviewed.
- [ ] Sprint is tested.

---

## 13. Developer Checklist

### Before Development

- [ ] Pull latest `dev` branch.
- [ ] Read this sprint document completely.
- [ ] Review Sprint 00 analysis.
- [ ] Understand existing `AdminLayout`, both sidebars, `TopNavbar`, `App.jsx`.
- [ ] Confirm branch name `feature/sprint-01-frontend-foundation`.

### During Development

- [ ] Follow existing project conventions (JSX, MUI, no new CSS framework).
- [ ] Reuse existing components.
- [ ] Do not create duplicate sidebars/headers.
- [ ] Keep UI consistent with current admin tokens (`#2563EB`, Inter).
- [ ] Handle shared UI states via common components.
- [ ] Test each route after layout change.
- [ ] Do not start Student/Teacher/Course modules.

### Before PR

- [ ] Run frontend locally.
- [ ] Test all routes listed in acceptance criteria.
- [ ] Test forms (login still works).
- [ ] Test responsive layout.
- [ ] Check browser console.
- [ ] Remove debugging code.
- [ ] Verify no unrelated files changed.
- [ ] Update documentation if necessary.
- [ ] Create PR to `dev` titled `[Sprint 01] Frontend Foundation & Shared Shell`.

---

## 14. Definition of Done

- [ ] All sprint requirements completed.
- [ ] All pages completed (layout/root; no extra product pages).
- [ ] All required components completed.
- [ ] Navigation verified.
- [ ] Forms verified (no regression).
- [ ] Validation verified (no regression).
- [ ] Loading states completed (shared).
- [ ] Empty states completed (shared).
- [ ] Error states completed (shared).
- [ ] Responsive UI completed.
- [ ] No unnecessary duplicate components.
- [ ] No console errors.
- [ ] No broken routes.
- [ ] Developer testing completed.
- [ ] PR created.
- [ ] Code review completed.
- [ ] Review comments resolved.
- [ ] PR merged into `dev`.
- [ ] QA completed.
- [ ] Sprint marked Completed.

---

## 15. Sprint Dependency Rule

### Depends On

Sprint 00 (read analysis). Existing codebase.

### Blocks

Sprint 02 (auth toasts/guards assume app root is stable).  
Sprint 04 (owner shell).  
Sprint 13 (content pages must share layout).

### Can Run in Parallel

No. This is the first code sprint.

---

**Backend dependency: frontend will consume the available backend/API service.**  
No API work in this sprint. Mock data stays as it is.



====
Completed