# Praksha Academy — Frontend Development Documentation

Frontend-only plan for remaining work. **No application source code was modified to produce these docs.**  
**No backend, database, SQL, or API design** is included.  
**Backend dependency: frontend will consume the available backend/API service.**

---

## Praksha Academy frontend

React 18 + Vite app in `frontend/`. Owner = existing **Admin** (`/admin`). Teacher app does not exist yet. Student shell exists. Courses are dynamic (`/courses/:slug`), never one file per course name.

---

## Current status

Public site + auth screens + student shell + admin foundation/CMS/reports (mock) exist. Academic owner CRUD, teacher app, student learning/assessments, and auth guards do not.

Details: `00-project-analysis/current-project-analysis.md`.

---

## Ganesh

**Ganesh is assigned to Sprint 01 — Frontend Foundation & Shared Shell.**

Onboarding: `04-development/developer-onboarding-ganesh.md`  
Assignment: `04-development/developer-assignment.md`  
Sprint file: `03-sprints/sprint-01-frontend-foundation.md`  
Branch: `feature/sprint-01-frontend-foundation`

---

## Sprint methodology

23 items: Sprint 00 (analysis, complete) then 01–22 sequential implementation. One developer per sprint. Tracker: `07-management/sprint-tracker.md`.

---

## Git / PR / commits

`main` ← `dev` ← `feature/sprint-XX-name`. Never push features to `main`.  
PR title: `[Sprint XX] Short Description` targeting `dev`.

---

## Documentation structure

```
docs/
├── README.md
├── 00-project-analysis/
├── 01-frontend-architecture/     (includes component-architecture.md)
├── 02-frontend-requirements/     (owner, courses, teachers, students, classes, …)
├── 03-sprints/                   (sprint-00 … sprint-22)
├── 04-development/               (assignment, Ganesh onboarding, git, commits, PR, DoD)
├── 05-ui-ux/                     (includes responsive-guidelines.md)
├── 06-testing/
└── 07-management/                (tracker, dependency map, traceability, bug-management.md)
```

Start: onboarding → Sprint 00 analysis → **Sprint 01 file** → UI guidelines.
