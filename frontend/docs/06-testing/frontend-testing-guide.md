# Frontend Testing Guide

Frontend testing only. No API contract tests, no database tests, no backend auth tests.

There is **no automated test suite** in `frontend/package.json` today (`dev`, `build`, `lint`, `preview` only).

---

## What to test

| Area | How |
| --- | --- |
| Navigation | Every enabled sidebar/nav link; back button; 404 |
| Forms | Submit valid; submit empty; submit invalid |
| Validation | Messages match rules; focus/error styles |
| Buttons | Primary actions, cancel, disabled while loading |
| Search | Courses page; navbar → query; DataTable search |
| Filtering | Course category; student course tabs; admin filters |
| Sorting | Courses sort select |
| Pagination | Courses (6 per page); DataTable pages |
| Responsive | 375, 768, 1024, 1440 |
| Role-based UI | Guest / student / teacher / admin cannot open others’ dashboards after Sprint 02 |
| Loading | Slow mock delay still shows spinner |
| Empty | Empty arrays |
| Error | Failed mock / unknown ids |
| Browsers | Chromium (Chrome/Edge) required; Firefox if available |

---

## Role matrix (after Sprint 02)

| User | `/` | `/login` | `/student/dashboard` | `/admin/dashboard` | `/teacher/dashboard` |
| --- | --- | --- | --- | --- | --- |
| Guest | yes | yes | redirect login | redirect login | redirect login |
| Student | yes | n/a | yes | access denied | access denied |
| Teacher | yes | n/a | access denied | access denied | yes (from Sprint 14) |
| Admin | yes | n/a | access denied | yes | access denied |

---

## Per-sprint

Use the sprint file Testing Checklist. Minimum bar:

- [ ] Page opens correctly
- [ ] Navigation works
- [ ] Forms work
- [ ] Validation works
- [ ] Loading / empty / error
- [ ] Responsive
- [ ] No console errors

---

## Public smoke

Home, Courses (search/filter/sort/page), Course details (valid + invalid slug), Programs, Blog (+ detail after Sprint 03), About, Contact (validation + success), legal pages, 404.

## Auth smoke

Login/register/forgot/otp/reset; admin login empty blocked; logout.

## Owner smoke (as modules land)

Each enabled sidebar destination; one create/edit/delete where applicable.

## Teacher / student smoke

Assigned vs empty; continue course; assignment submit without file.

---

## Console and build

```bash
cd frontend
npm run lint
npm run build
```

Fix errors before PR. Warnings should be listed as known issues if not fixed.

---

## Optional automation

If Team Leader approves Vitest + Testing Library in Sprint 21, start with:

- LoginForm validation
- RequireRole redirect (mock context)
- Courses search helper functions (pure functions in Courses.jsx can be extracted)

Do not block v1 on full coverage.
