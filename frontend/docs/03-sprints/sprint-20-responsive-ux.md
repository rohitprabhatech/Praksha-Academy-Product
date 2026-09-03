# Sprint 20 — Responsive & Visual Consistency

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-20-responsive-ux`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

One visual system across public, owner, teacher, student. Fix spacing, radii, leftover inconsistencies. **No new product modules.**

---

## 3. Why This Sprint Exists

Public CSS + MUI + Bootstrap + two admin shells produced drift. Dashboards must look like one product before test/QA.

---

## 4. Prerequisites

Sprints 01–19 features that exist on `dev`.

**BLOCKER:** none if Team Lead wants a mid-project UX pass; preferred after 19.

---

## 5. Pages to Create / Complete

None new. Polish all major routes (public, auth, owner, teacher, student).

---

## 6. Page-by-Page Development Instructions

Walk 375 / 768 / 1440 on: Home, Courses, Course details, Login, Admin dashboard, one owner CRUD, Teacher dashboard, Student dashboard, one form.

Fix: overflow, overlapping sidebar, pill vs 8px buttons on dashboards, chart overflow.

Follow `docs/05-ui-ux/ui-guidelines.md` and `responsive-guidelines.md`.

---

## 7. Component Requirements

Do not add a new Button library. Reuse common Empty/Error/Loader styles.

---

## 8. User Flow

Guest → student → teacher → owner on phone and desktop.

---

## 9–11. States / Search / Forms

Verify loading/empty/error look consistent. No new forms.

---

## 12. Acceptance Criteria

- [ ] No new features.
- [ ] No page-level horizontal scroll except tables.
- [ ] Screenshots in PR (desktop+mobile).
- [ ] Console clean.
- [ ] PR `[Sprint 20] Responsive and Visual Consistency` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-20-responsive-ux`. Depends on 19. Blocks 21. No parallel.
