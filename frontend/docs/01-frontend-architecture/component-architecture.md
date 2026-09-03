# Component Architecture

**Do not restructure folders in this document’s name.** This describes how components should be chosen.

---

## Current reality

Components live by **area**, not by `features/owner/courses`:

- `components/admin/common` — DataTable, PageHeader, AdminModal, StatCard, AdminSurface
- `components/admin` — layout chrome, dashboard widgets, charts
- `components/student` — dashboard cards, sidebar
- `components/courses` — public catalog
- `components/auth` — login/register/otp
- `components/about`, `contact`, `home`, `navigation`, `common`

This matches the existing app. A big-bang move to `features/` is **not** Sprint 01 work.

---

## Layers

| Layer | Examples | Rule |
| --- | --- | --- |
| App shell | layouts, Navbar, AdminSidebar, TopNavbar | One per role |
| Shared UI | EmptyState, ErrorState, PageLoader, AdminModal | No feature name in the file |
| Shared data UI | DataTable, PageHeader, StatCard | Owner + Teacher reuse these |
| Feature components | CreateCourse form sections | Live next to the page or `components/admin/` |
| Page | `pages/admin/Courses/CourseList.jsx` | Thin: layout + compose |

---

## Reuse vs new

Before adding a file:

1. Search `components/admin/common` and `components/common`.
2. If DataTable can show the list, do not create `StudentTable.jsx` unless columns are extremely custom — prefer `columns` prop.
3. Do not copy `CourseCard` from `components/courses` into student unless variants already exist (`components/student/CourseCard.jsx` already exists — use it).

---

## Duplicates already in the repo (do not add a third)

| Duplicate | Action |
| --- | --- |
| `AdminSidebar.jsx` vs `Sidebar.jsx` | Sprint 01: mount one |
| `home/Hero.jsx` vs `pages/Home.jsx` inline hero | Do not wire Hero unless replacing Home on purpose (not Sprint 01) |
| `constants/theme.js` vs `theme/theme.js` | Do not add a third; merge only in a later UX sprint if Team Lead agrees |
| `PageHeader` vs `Breadcrumb` in TopNavbar | Both can exist; pages use PageHeader |

---

## New teacher UI

Reuse `DataTable` / `PageHeader` / `AdminModal`.  
Create `layouts/TeacherLayout.jsx` + `components/teacher/Sidebar.jsx` (same pattern as student).  
Do not copy-paste admin CMS.

---

## Naming

- PascalCase files matching the default export.
- `common` = reused in 2+ roles or 2+ modules.
- Feature-specific: keep under `admin/` or `teacher/` or `student/`.
