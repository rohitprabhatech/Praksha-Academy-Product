# Sprint 04 — Owner Dashboard Shell Unification

## 1. Sprint Owner

Developer: Ganesh sudruk  
Branch: `feature/sprint-04-owner-dashboard-shell`  
Status: Not Started  
Estimated Duration: 2 days

---

## 2. Sprint Goal

Finish the Owner/Admin shell as the template for all later owner modules: full nav groups, ProfileMenu, breadcrumbs, dashboard Refresh using a frontend service (mock OK).

---

## 3. Why This Sprint Exists

Sprint 01 mounts one sidebar + TopNavbar. This sprint fills navigation IA so Students/Teachers/Courses can be enabled as those sprints land, without each developer inventing nav.

---

## 4. Prerequisites

* Sprint 01 merged.
* Sprint 02 merged (admin routes guarded).
* `constants/adminDashboard.js` `adminNavGroups`
* Existing Dashboard, Profile, Settings pages

**BLOCKER:** Sprint 01 not merged.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Admin Dashboard | `/admin/dashboard` | Partial | Refresh loads mock service; skeleton; error panel |
| Admin Profile | `/admin/profile` | Partial | ProfileMenu targets this; save toast |
| Admin Settings | `/admin/settings` | Partial | Theme already works; save toast |
| Sidebar | layout | Partial | Groups: Overview, Users, Academic, Learning, Sales, Content, Communication, Reports, Settings. Missing modules: disabled Soon |

---

## 6. Page-by-Page Development Instructions

### Dashboard `/admin/dashboard`

#### Page Purpose
Owner overview of academy KPIs.

#### User
Owner.

#### Entry Point
Admin login; sidebar Dashboard.

#### UI Layout
AdminLayout. Title “Admin Dashboard”, Refresh, date chip, KPI grid (existing `dashboardStats`), charts, RecentActivities, UpcomingClasses — **keep existing widgets**.

#### Header
TopNavbar + page title in content.

#### Sidebar
Full groups; Dashboard active.

#### Main Content
Existing cards/charts.

#### Actions
Refresh.

#### Forms
None.

#### Validation
None.

#### Loading State
Skeleton on KPI/chart area while refresh mock delay.

#### Empty State
If stats array empty, EmptyState (unlikely with constants).

#### Error State
ErrorState + Retry if service throws.

#### Success State
Data shown.

#### Responsive Behavior
Existing grid: 1 / 2 / 3 columns. Charts full width on mobile.

---

### Profile `/admin/profile`

Keep layout. Wire ProfileMenu. Success toast on Save (mock). Loading on save. Validation: name/email if those fields exist.

### Settings `/admin/settings`

Keep theme toggle. Save toast.

---

## 7. Component Requirements

Reuse: DashboardCard, charts, RecentActivities, UpcomingClasses, TopNavbar, ProfileMenu, NotificationDropdown, Breadcrumb, AdminSurface. Do not create a second dashboard card.

---

## 8. User Flow

Owner login → Dashboard → sidebar Blog (exists) → Profile menu → Profile → Settings → Logout.

---

## 9. Frontend Data States

Loading/empty/error/success/disabled (Soon items)/no delete confirmation this sprint.

---

## 10. Search / Filter / Sort / Pagination

TopNavbar search stays visual-only.

---

## 11. Form Requirements

Profile/settings: keep existing fields; Save disabled while submitting.

---

## 12. Acceptance Criteria

- [ ] Pages open at correct routes.
- [ ] Navigation works for **enabled** items; Soon items do not 404.
- [ ] UI sections present.
- [ ] Forms work (profile/settings).
- [ ] Validation where fields required.
- [ ] Buttons work (Refresh, Save, Logout).
- [ ] Loading/empty/error/success.
- [ ] Responsive.
- [ ] Reuse components; no duplicate sidebar.
- [ ] No console errors.
- [ ] PR `[Sprint 04] Owner Dashboard Shell` → `dev`.

---

## 13. Developer Checklist

Before: pull `dev`, read this file, confirm 01+02, branch `feature/sprint-04-owner-dashboard-shell`.  
During: reuse chrome, don’t add Students pages here.  
Before PR: test enabled nav, mobile drawer, console, PR to `dev`.

---

## 14. Definition of Done

See `definition-of-done.md`.

---

## 15. Sprint Dependency Rule

### Depends On
01, 02.

### Blocks
05–13 owner modules (they enable sidebar items).

### Can Run in Parallel
Not with 01/02. Not with 05 if same sidebar file conflict — sequential preferred.


===============
Completed