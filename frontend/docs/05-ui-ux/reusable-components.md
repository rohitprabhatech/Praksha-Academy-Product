# Reusable Components Guide

Check the codebase before creating a new component. **Do not duplicate.**

---

## Already exists — reuse

| Need | Existing |
| --- | --- |
| Admin/owner page title + crumbs | `components/admin/common/PageHeader.jsx` |
| Table + search + pagination | `components/admin/common/DataTable.jsx` |
| Modal | `components/admin/common/AdminModal.jsx` |
| KPI card (content/reports) | `components/admin/common/StatCard.jsx` |
| Card surface | `components/admin/common/AdminSurface.jsx` |
| Dashboard KPI | `components/admin/DashboardCard.jsx` |
| Charts | `components/admin/charts/*` |
| Public course card/grid/filter/pagination | `components/courses/*` |
| Student course/wishlist/certificate/notification cards | `components/student/*` |
| Auth fields | `components/auth/*` |
| Section heading (About/Contact) | `components/common/SectionHeading.jsx` |
| Image placeholder | `components/common/ImagePlaceholder.jsx` |
| Video modal | `components/common/VideoModal.jsx` |
| Admin confirm via | AdminModal |

---

## Add in Sprint 01 (if not present as shared)

| Component | Purpose |
| --- | --- |
| EmptyState | Title, description, optional CTA |
| ErrorState | Message + Retry |
| PageLoader / Skeleton | Full page or section loading |
| ToastContainer | App root (library, not a new design) |

---

## Add when first needed (then reuse)

| Component | First sprint likely | Notes |
| --- | --- | --- |
| ConfirmDialog | 05 | Can wrap AdminModal |
| FileUpload | 06 / 10 | Image + documents |
| StatusBadge | 05 | If chips stay inline, chip is enough |
| FilterBar | 05 | DataTable search may suffice |
| Date fields | 10 | MUI TextField type date/time |
| TeacherLayout sidebar | 14 | Clone student sidebar structure |
| DashboardLayout | 01 | AdminLayout is this |

---

## Do not create

- Second DataTable for teachers
- PythonCourseCard
- Separate Button library (use MUI Button + guidelines)
- New toast system
- Duplicate ThemeProviders

---

## Dashboard layout

| Role | Layout file |
| --- | --- |
| Public | `MainLayout.jsx` |
| Owner | `AdminLayout.jsx` |
| Student | `StudentLayout.jsx` |
| Teacher | `TeacherLayout.jsx` (new, Sprint 14) |

TopNavbar + Sidebar + Outlet is the dashboard layout. Implement once per role.
