# Frontend Folder Structure

**Do not change folders as part of this planning task.**  
This document records the current tree and a recommended target for developers.

---

## Current Structure

Observed under `frontend/src/` (application source only):

```
frontend/
├── Admin_Dashboard_Requirements/
│   └── requirements.md
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   ├── assets/
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── about/          (16 files)
│   │   ├── admin/
│   │   │   ├── charts/
│   │   │   ├── common/
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── Sidebar.jsx          ← duplicate shell
│   │   │   ├── TopNavbar.jsx        ← unused by layout
│   │   │   ├── Breadcrumb.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── NotificationDropdown.jsx
│   │   │   ├── ProfileMenu.jsx
│   │   │   ├── RecentActivities.jsx
│   │   │   └── UpcomingClasses.jsx
│   │   ├── auth/
│   │   ├── common/
│   │   ├── contact/
│   │   ├── courses/
│   │   ├── home/           (partially unused)
│   │   ├── navigation/
│   │   └── student/
│   ├── constants/
│   │   ├── adminDashboard.js
│   │   ├── siteData.js
│   │   └── theme.js
│   ├── context/
│   │   └── ThemeModeContext.jsx
│   ├── data/
│   │   ├── aboutData.js
│   │   ├── contactData.js
│   │   ├── courses.js
│   │   └── mediaData.js
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── MainLayout.jsx
│   │   └── StudentLayout.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Blog/
│   │   │   ├── ContactMessages/
│   │   │   ├── Dashboard/
│   │   │   ├── FAQ/
│   │   │   ├── Gallery/
│   │   │   ├── Login/
│   │   │   ├── Notifications/
│   │   │   ├── Profile/
│   │   │   ├── Reports/
│   │   │   ├── Settings/
│   │   │   └── Testimonials/
│   │   ├── auth/
│   │   ├── student/
│   │   ├── About.jsx
│   │   ├── Blog.jsx
│   │   ├── Contact.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── Courses.jsx
│   │   ├── Home.jsx
│   │   ├── NotFound.jsx
│   │   └── Programs.jsx
│   ├── routes/
│   │   ├── AdminRoutes.jsx
│   │   └── AppRoutes.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── httpClient.js
│   ├── styles/
│   ├── theme/
│   │   └── theme.js          ← duplicate tokens
│   └── utils/
│       └── certificatePdf.js
```

**Missing folders vs admin assignment:** `pages/admin/Students`, `Teachers`, `Classes`, `Subjects`, `Courses`, `Materials`, `LiveClasses`, `Assignments`, `Exams`, `Enrollments`, `Payments`, `Coupons`.  
**Missing vs product brief:** `pages/teacher`, `hooks`, auth context.

---

## Recommended Structure

Evolve incrementally. Do not rewrite the public site folders in sprint 1.

```
frontend/src/
├── assets/
├── components/
│   ├── about/
│   ├── admin/
│   │   ├── charts/
│   │   ├── common/          (shared with teacher where possible)
│   │   └── layout/          (single Sidebar + TopNavbar)
│   ├── auth/
│   ├── common/              (EmptyState, Loader, ErrorState, ConfirmDialog)
│   ├── contact/
│   ├── courses/
│   ├── home/
│   ├── navigation/
│   ├── student/
│   └── teacher/
├── constants/
├── context/
│   ├── ThemeModeContext.jsx
│   └── AuthContext.jsx
├── data/                    (content + mocks until API exists)
├── hooks/
│   ├── useAuth.js
│   └── useDebouncedValue.js
├── layouts/
│   ├── AdminLayout.jsx
│   ├── MainLayout.jsx
│   ├── StudentLayout.jsx
│   └── TeacherLayout.jsx
├── pages/
│   ├── admin/               (owner modules as in assignment)
│   ├── auth/
│   ├── student/
│   ├── teacher/
│   └── public pages (keep at pages/ root or move to pages/public later)
├── routes/
│   ├── AppRoutes.jsx
│   ├── AdminRoutes.jsx
│   ├── TeacherRoutes.jsx
│   ├── StudentRoutes.jsx
│   └── guards/
├── services/
│   ├── httpClient.js
│   ├── api.js
│   └── mocks/
├── styles/
├── theme/                   (single source — merge with constants/theme)
└── utils/
```

### Rules for new files

1. Owner pages stay under `pages/admin/` to match the existing assignment and routes.
2. Teacher pages go under `pages/teacher/`.
3. Do not add `pages/courses/python.jsx` style files.
4. Reuse `components/admin/common` instead of creating `components/teacher/common/DataTable.jsx`.
5. Remove or stop importing duplicate shells after Sprint 01 (`AdminSidebar` vs `Sidebar`, unused home components).
6. Merge theme files when touching design tokens.

### What not to create

- `backend/`
- `database/`
- `api/` route handlers inside this frontend app
- SQL or schema folders
- `features/owner/courses` **in Sprint 01** (see migration below)

---

## Problems with the current structure

- Two admin sidebars; unused TopNavbar.
- Duplicate theme files.
- Unused `components/home/*` vs inline Home.
- No `hooks/`, no auth context, no `pages/teacher`.
- Admin routes split across `AppRoutes.jsx` and `AdminRoutes.jsx`.
- `components/common` vs `components/admin/common` is fine if documented.

## Recommended vs `src/app` + `src/features` (generic template)

A full move to `app/routes` + `features/owner` would touch almost every import. The **current pages/components split already scales** if we add `pages/teacher` and `hooks`.

**Decision:** Keep the existing area-based tree. Do **not** big-bang restructure. Optional `features/` is post-v1.

## Migration plan (documentation only — do not perform in Sprint 01)

| Step | When | What |
| --- | --- | --- |
| 1 | Sprint 01 | Use one sidebar; add EmptyState in `components/common` |
| 2 | Sprint 02 | Add `context/AuthContext.jsx`, `routes/guards/` |
| 3 | Sprint 14 | Add `layouts/TeacherLayout.jsx`, `pages/teacher/`, `components/teacher/` |
| 4 | Later UX | Merge `theme/theme.js` into `constants/theme.js` if Team Lead agrees |
| 5 | Post-v1 optional | Move public pages under `pages/public/` |

## Risks of restructuring now

- Merge conflicts with every in-flight file.
- Ganesh’s first sprint becomes a rewrite, not a learning sprint.
- Easy to break Admin Blog routes that already work.

## Which sprint handles change

Sprint 01: layout/toast/logo only.  
Sprint 02: auth files.  
Sprint 14: teacher folders **created as new files**, not a repo-wide move.

## Folder purpose / naming

| Folder | Belongs | Does not belong |
| --- | --- | --- |
| `components/common` | EmptyState, used by 2+ roles | CourseForm |
| `components/admin/common` | DataTable, PageHeader | Public Hero |
| `pages/admin` | Owner screens | Teacher screens |
| `features/` | Not used yet | Do not create empty feature folders |

Reusable = `common` + `admin/common`. Feature-specific = `pages/...` + thin local components.
