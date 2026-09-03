# Sprint 00 — Existing Project Analysis

## 1. Sprint Owner

Developer: Unassigned (analysis already delivered as documentation)  
Branch: none (documentation only — no feature branch required)  
Status: **Completed**  
Estimated Duration: Already done (source of truth for all later sprints)

This sprint does **not** assign Ganesh. Ganesh must **read** the deliverables before Sprint 01.

---

## 2. Sprint Goal

Record what the Praksha Academy frontend already contains, what is unfinished, and what must be built next — without writing application code.

---

## 3. Why This Sprint Exists

A new developer cannot start Course Management or a Teacher Dashboard until the real app is understood. This sprint prevents rebuilding Home, Login, or Admin Blog, and prevents inventing backend work.

---

## 4. Prerequisites

None. This is the first sprint in the sequence.

**BLOCKER:** none.

---

## 5. Pages to Create / Complete

None. Documentation only.

---

## 6. Page-by-Page Development Instructions

Not applicable.

---

## 7. Deliverables (already created)

| Deliverable | Path |
| --- | --- |
| Current project analysis | `docs/00-project-analysis/current-project-analysis.md` |
| Work status (Completed / Partial / Needs improvement / Not started / Unknown) | `docs/00-project-analysis/frontend-work-status.md` |
| Open questions | `docs/00-project-analysis/open-questions.md` |
| Recommended architecture | `docs/01-frontend-architecture/frontend-architecture.md` |
| Recommended folder structure | `docs/01-frontend-architecture/folder-structure.md` |
| Component architecture | `docs/01-frontend-architecture/component-architecture.md` |
| Route plan | `docs/01-frontend-architecture/route-plan.md` |
| Dependency map | `docs/07-management/frontend-dependency-map.md` |

---

## 8. Component Requirements

None to build.

---

## 9. User Flow

N/A.

---

## 10. Frontend Data States

N/A.

---

## 11. Search / Filter / Sort / Pagination

N/A.

---

## 12. Form Requirements

N/A.

---

## 13. Acceptance Criteria

- [x] Existing frontend inspected (`frontend/src` routes, pages, layouts, components)
- [x] Completed vs partial vs missing work classified
- [x] Duplicate admin sidebars and unused home components documented
- [x] No teacher UI confirmed missing
- [x] Owner UI confirmed as existing Admin (`/admin`)
- [x] Recommended structure documented without moving folders
- [x] Final sprint sequence created from this analysis
- [x] No application code modified
- [x] No backend/API design created

---

## 14. Developer Checklist

### Before Development

- [x] Analysis documents exist
- [ ] Ganesh reads `current-project-analysis.md` before Sprint 01
- [ ] Ganesh reads `developer-onboarding-ganesh.md`

### During Development

N/A (no code).

### Before PR

N/A.

---

## 15. Definition of Done

- [x] Analysis complete
- [x] Work status complete
- [x] Folder recommendation complete
- [x] Route plan complete
- [x] Sprint dependency map complete

---

## 16. Sprint Dependency Rule

### Depends On

Nothing.

### Blocks

Sprint 01 and every later sprint (developers must not start without reading this analysis).

### Can Run in Parallel

No.

---

## Findings summary (for Ganesh)

**Completed (do not rebuild):** public Home, Courses, Course Details, About, Contact; student shell pages; admin dashboard/profile/settings; admin Blog/Gallery/FAQ/Testimonials/Notifications/Contact Messages/Reports (mock).

**Partial:** auth (no guards), student learning (no player), admin nav (two sidebars), Programs, public Blog (no article page).

**Not started:** teacher app; owner Students/Teachers/Classes/Subjects/Courses/Curriculum/Materials/Live Classes/Assignments/Quizzes/Exams/Marks/Attendance/Enrollments/Payments/Coupons.

**Broken / inconsistent:** `ToastContainer` not mounted; `praksha-mark.png` imported but missing from listed assets; navbar search inert; legal footer 404s; `/admin` routes split across two files.
