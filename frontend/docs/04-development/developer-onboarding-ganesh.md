# Developer Onboarding — Ganesh

Welcome to Praksha Academy frontend. Read this before writing code.

Unclear requirements: **ask the Team Lead. Do not guess business rules.**

---

## Project Overview

Praksha Academy is an education website and learning dashboard.

The frontend (`frontend/`) is a React 18 + Vite SPA using MUI, Bootstrap, React Router, react-hook-form, and axios (axios is barely used yet).

Most screens use **mock/static data**.  
**Backend dependency: frontend will consume the available backend/API service.** Do not design APIs or databases.

---

## User Roles

| Role | In the current code | Routes |
| --- | --- | --- |
| Public user | Marketing site | `/`, `/courses`, `/about`, `/contact`, … |
| Owner | Named **Admin** | `/admin/*` |
| Teacher | **Does not exist yet** | Planned `/teacher/*` |
| Student | Student layout | `/student/*` |

Until Team Lead says otherwise, keep saying **Admin** in the UI and keep `/admin` URLs.

---

## Existing Project

What Ganesh must understand:

1. **Public site is largely built.** Do not rebuild Home, Courses, About, Contact.
2. **Student dashboard shell exists** (six pages, mock data). No course player yet.
3. **Admin dashboard + CMS/reports exist** (mock). Students/Teachers/Courses admin pages do **not**.
4. **Two admin sidebars** (`AdminSidebar.jsx` and `Sidebar.jsx`). Layout currently uses `AdminSidebar`. `TopNavbar` exists but is not mounted.
5. **Auth screens exist** but there is no auth guard. Anyone can open `/student/dashboard`.
6. **Toasts** (`react-toastify`) are called but **`ToastContainer` is not in `App.jsx`** — they may not show.
7. **Courses are dynamic data** (`src/data/courses.js` + `/courses/:slug`). Never add `Python.jsx` / `Java.jsx` pages.

Full analysis: `docs/00-project-analysis/current-project-analysis.md`.

---

## Folder Structure

Work inside `frontend/src/`. Important folders:

| Folder | What belongs there |
| --- | --- |
| `pages/` | Route-level screens (`pages/admin`, `pages/student`, `pages/auth`, public pages) |
| `components/` | UI pieces grouped by area (`admin`, `student`, `courses`, `common`, …) |
| `layouts/` | `MainLayout`, `StudentLayout`, `AdminLayout` |
| `routes/` | `AppRoutes.jsx`, `AdminRoutes.jsx` |
| `context/` | Theme today; Auth later (Sprint 02) |
| `services/` | `httpClient.js`, `api.js` — unused by most pages |
| `data/` | Static content and course mocks |
| `constants/` | Nav, theme, dashboard mock stats |
| `theme/` | Duplicate tokens used by About/Contact — do not add a third theme file |

What does **not** belong there: backend servers, SQL, API route handlers.

Do **not** move the app to a `features/` tree in Sprint 01. See `docs/01-frontend-architecture/folder-structure.md`.

---

## Development Rules

1. Frontend only. No API/SQL design.
2. Reuse `PageHeader`, `DataTable`, `AdminModal`, `StatCard` — do not clone them.
3. Follow colors/spacing in `docs/05-ui-ux/ui-guidelines.md`.
4. Every new data page: loading, empty, error, success.
5. Dynamic courses only.
6. Do not “fix” unrelated files in your PR.
7. If a requirement is UNKNOWN, escalate — do not invent.

---

## Git Rules

```
main          ← do not push feature work here
  └── dev     ← PR target
        └── feature/sprint-01-frontend-foundation   ← your work
```

```bash
git checkout dev
git pull origin dev
git checkout -b feature/sprint-01-frontend-foundation
```

Commits: `feat:`, `fix:`, `refactor:`, `style:`, `test:`, `docs:`, `chore:`

PR title: `[Sprint 01] Frontend Foundation & Shared Shell`  
Target branch: **`dev`**

Details: `git-branching-guide.md`, `commit-convention.md`, `pull-request-guide.md`.

---

## First Sprint

**Ganesh is assigned to Sprint 01 — Frontend Foundation & Shared Shell.**

File: `docs/03-sprints/sprint-01-frontend-foundation.md`  
Branch: `feature/sprint-01-frontend-foundation`

Why: bounded scope, teaches layouts/routes, low dependency, must be done before auth guards and owner modules.

---

## Before Starting

- [ ] Node/npm available
- [ ] Clone/pull repo
- [ ] `cd frontend` → `npm install` → `npm run dev`
- [ ] Read Sprint 00 analysis + this onboarding doc
- [ ] Read Sprint 01 completely
- [ ] Branch from latest `dev`
- [ ] Ask Team Lead if anything in Sprint 01 is unclear

---

## Before PR

- [ ] `npm run dev` — listed routes work
- [ ] Desktop, tablet, mobile admin chrome
- [ ] Toasts visible
- [ ] Console clean
- [ ] No extra features
- [ ] Screenshots in PR
- [ ] PR to `dev`

---

## Who to Ask

| Topic | Who |
| --- | --- |
| Unclear product rules (batches, quizzes vs exams, owner vs admin name) | Team Lead |
| Git / PR / review | Team Lead |
| Design tokens | `docs/05-ui-ux/ui-guidelines.md` then Team Lead |
| Backend/API availability | Team Lead — still frontend consumes whatever exists |

Do not invent answers for `docs/00-project-analysis/open-questions.md`.
