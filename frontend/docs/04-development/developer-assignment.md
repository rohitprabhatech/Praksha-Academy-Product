# Developer Assignment

**Frontend only.** One sprint = one developer.  
Do not invent extra developer names. The only named assignee in this plan is **Ganesh**.

---

## Ganesh — Initial Assignment

Developer: **Ganesh**

Sprint: **Sprint 01 — Frontend Foundation & Shared Shell**

Module: Application shell (toasts, unified Admin/Owner layout, shared Empty/Error/Loader, logo)

Branch: `feature/sprint-01-frontend-foundation`

Why Ganesh is assigned:

Ganesh is a new joiner. Sprint 01 has **clear, bounded UI work**, **no dependency on unfinished academic modules**, and **forces him to learn the real layouts and routes** (`App.jsx`, `AdminLayout`, `AppRoutes`, `AdminRoutes`) before he touches Course Management or Teacher Dashboard. Those later modules are high-risk if he does not understand the duplicate admin sidebars first.

Prerequisites:

* Read Sprint 00 analysis documents
* Read `developer-onboarding-ganesh.md`
* Run `frontend` locally
* Do not skip Git: branch from latest `dev`

Expected Work:

Exact work is in `docs/03-sprints/sprint-01-frontend-foundation.md`. Summary: mount `ToastContainer`; use one admin sidebar; wire existing `TopNavbar`; add shared Empty/Error/Loader if missing; fix logo asset; merge admin route trees so `/admin/dashboard` and `/admin/blog` share chrome.

Expected Output:

* Visible toasts
* One owner/admin chrome
* Shared state components
* Working logo
* PR to `dev`
* No new LMS pages

---

## Assigned sprints (explicit)

| Developer | Sprint | Module | Branch | Prerequisites | Expected Work | Expected Output |
| --- | --- | --- | --- | --- | --- | --- |
| Ganesh | 01 | Foundation / shared shell | `feature/sprint-01-frontend-foundation` | Sprint 00 read; local app running | Unify admin layout, toasts, shared states, logo | Stable shell on `dev` |

---

## Unassigned sprints

Sprints 00 (completed, docs only), 02–22: **Unassigned**.

Team Lead assigns the next sprint **after** Sprint 01 is merged. Ganesh may be assigned Sprint 02 (Authentication) next because it still teaches core app flow with limited surface area — **only if Team Lead confirms**. Do not pre-assign Ganesh to Owner Course Management, Teacher Dashboard, or Final QA.

---

## How Team Lead assigns the next sprint

1. Open `docs/07-management/sprint-tracker.md`.
2. Confirm dependency sprint is **Completed**.
3. Put exactly one name in Developer (currently only Ganesh exists as a named developer).
4. Create `feature/sprint-XX-short-name` from `dev`.
5. Hand the sprint markdown file to the developer.

See also `developer-assignment-guide.md`.
