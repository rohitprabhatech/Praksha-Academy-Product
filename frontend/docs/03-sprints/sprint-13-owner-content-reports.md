# Sprint 13 — Owner Content & Reports Hardening

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-13-owner-content-reports`  
Status: Not Started  
Estimated Duration: 4–5 days

---

## 2. Sprint Goal

Do **not** rebuild Blog, Gallery, FAQ, Testimonials, Notifications, Contact Messages, or Reports. Add loading/empty/error, move mocks behind a frontend service, connect public Blog + Contact form to the same mock where practical, confirm sidebar.

---

## 3. Why This Sprint Exists

These pages already exist as mock CRUD. They lack consistent states and public wiring. Rebuilding would duplicate completed work.

---

## 4. Prerequisites

Sprint 01, 04. Pages already in `pages/admin/{Blog,Gallery,FAQ,Testimonials,Notifications,ContactMessages,Reports}`.

**BLOCKER:** none if 01/04 done.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| All existing CMS/report pages | existing `/admin/blog` etc. | Partial | States + service; no new design |

---

## 6. Page-by-Page Development Instructions

For **each** existing list page: wrap fetch in loading; empty DataTable already has emptyText — use EmptyState if blank; ErrorState on throw.

### Contact → Admin inbox

If public Contact submit can push a mock message into a shared module, do it. If too risky, document limitation in PR.

### Public Blog

If Sprint 03 article detail exists, share the same mock records as admin blog when possible.

### Reports

Chart loading skeleton; empty; retry. Do not invent CSV backend. Client-side export optional.

---

## 7. Component Requirements

Reuse PageHeader, DataTable, StatCard, existing charts. No new report library.

---

## 8. User Flow

Owner uses Blog/FAQ as today → empty search shows empty → error retry works. Public contact may appear in Contact Messages.

---

## 9–11. States / Search / Forms

Keep existing search on DataTable. Keep existing create forms and validation; add missing required if submit allows blanks.

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] Existing routes still work.
- [ ] Loading/empty/error on each list/report.
- [ ] No second CMS.
- [ ] Toasts visible (Sprint 01).
- [ ] Responsive charts.
- [ ] PR `[Sprint 13] Owner Content and Reports Hardening` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-13-owner-content-reports`. Depends on 01, 04. Blocks 19 (notification fan-out polish). Can run after 04 even if 05–12 incomplete.
