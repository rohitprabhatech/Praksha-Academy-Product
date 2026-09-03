# Reports — Frontend Requirements

**Existing owner pages (mock charts + tables):**

- `/admin/reports/students`
- `/admin/reports/courses`
- `/admin/reports/revenue`
- `/admin/reports/performance`

Do not rebuild. Harden in Sprint 14:

- Loading skeletons for charts.
- Empty data illustrations.
- Error retry.
- Export button **only if already present**; do not invent CSV/PDF backend. If a button exists and does nothing, either wire a **client-side** export from the visible table or hide it until API exists.
- Enable Reports in the unified sidebar (currently live AdminSidebar already links these four pages).
- Original `adminNavGroups` had a single disabled “Reports” item — replace with the four working links.

Teacher/student report dashboards are **not** in the admin assignment. Student sees personal progress; teacher sees class lists. Academy-wide revenue stays owner-only.

**Backend dependency — frontend implementation will consume the available backend service/API.**
