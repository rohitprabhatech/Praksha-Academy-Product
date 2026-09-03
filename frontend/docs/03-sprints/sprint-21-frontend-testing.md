# Sprint 21 — Frontend Testing

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-21-frontend-testing`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

Execute `docs/06-testing/frontend-testing-guide.md`. Attach a test report to the PR. Optional Vitest only if Team Lead approves a new devDependency. No backend tests.

---

## 3. Why This Sprint Exists

`package.json` has no test script. Quality gate before final QA.

---

## 4. Prerequisites

Sprint 20.

**BLOCKER:** 20 preferred.

---

## 5. Pages to Create / Complete

None. Test existing.

---

## 6. Page-by-Page Development Instructions

Run smoke matrix: public, auth, owner, teacher, student. Role table in testing guide. Record pass/fail.

---

## 7. Component Requirements

None new.

---

## 8. User Flow

Documented in testing guide.

---

## 9–11. States / Search / Forms

Explicitly test loading/empty/error on one module per role. Search/filter/pagination on Courses + one DataTable.

---

## 12. Acceptance Criteria

- [ ] Test report in PR.
- [ ] Role guards verified.
- [ ] `npm run lint` / `npm run build` attempted; failures listed or fixed.
- [ ] Known issues listed (`bug-management.md` style).
- [ ] PR `[Sprint 21] Frontend Testing` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-21-frontend-testing`. Depends on 20. Blocks 22.
