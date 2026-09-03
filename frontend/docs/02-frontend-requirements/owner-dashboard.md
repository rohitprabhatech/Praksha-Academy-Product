# Owner (Admin) Dashboard — Frontend Requirements

**Naming:** Existing product uses **Admin**. Treat Admin as Academy Owner until Q-01 is answered. Keep `/admin` routes.

**Existing:** Login, Dashboard, Profile, Settings, Blog, Gallery, FAQ, Testimonials, Notifications, Contact Messages, Reports.

**Not started (confirmed by `Admin_Dashboard_Requirements/requirements.md`):** Students, Teachers, Classes, Subjects, Courses, Curriculum, Materials, Live Classes, Assignments, Exams, Enrollments, Payments, Coupons.

**OPEN QUESTION (not in original assignment):** Owner Marks, Attendance, Quizzes, Batch Management. See `open-questions.md`. Do not build those owner modules until confirmed.

**Backend dependency — frontend implementation will consume the available backend service/API.**

---

## Dashboard `/admin/dashboard`

Keep the existing KPI cards and charts. Improve:

- Single sidebar listing all modules (enable items as sprints complete).
- Mount TopNavbar (search can be visual-only until a later sprint).
- Refresh should re-load dashboard data from the frontend service (mock or API).
- Loading skeletons; error panel if fetch fails.

## Profile `/admin/profile`

Keep. Add change password entry. Save via frontend service.

## Settings `/admin/settings`

Keep theme toggle. Other fields remain local until API exists.

---

## Confirmed owner modules (build)

Each module: list + create/edit where specified, search, filter, pagination, empty/error/loading, confirmation on delete.

Details for courses, teachers, students, assignments, exams, marks, attendance, notifications, and reports live in their dedicated requirement files.

### Users

- Student management — see student section in this file below and Sprint 05.
- Teacher management — Sprint 06.

### Academic

- Classes (Class 8 … Class 12 Commerce, etc.) — Sprint 07.
- Subjects — Sprint 07.
- Courses + details + curriculum — Sprint 08–09. **Dynamic courses. No Python.jsx page.**

### Learning

- Materials, Live Classes — Sprint 10.
- Assignments, Exams — Sprint 11.

### Sales

- Enrollments, Payments, Coupons — Sprint 13.

### Content / communication / reports

Already built as mock UI — harden in Sprint 14 (states, nav, toast, connect to services). Do not rebuild from scratch.

---

## Owner student screens (confirmed)

- Student List: search, filter, pagination, activate/deactivate, delete, view.
- Add Student, Edit Student, Student Details.
- Details: profile, enrolled courses, progress (UI sections; data from available API).

Fields are not fully listed in the assignment for students (unlike teachers). Use: name, email, phone, status, plus enrolled courses on details. **Do not invent extra academic fields.**

## Owner teacher screens (confirmed)

Fields from assignment: Name, Email, Phone, Profile Image, Qualification, Experience, Specialization, Bio, Status.

Pages: List, Add, Edit, Details.

---

## Dynamic course flow (owner → teacher)

Frontend-only flow:

1. Owner opens Dashboard → Course Management.
2. Create Course → enter course information (name, category, class, subject, teacher, description, thumbnail, price, discount, duration, language, type, status).
3. Assign Teacher (select from teachers list UI).
4. Save → course appears in Course List.
5. Teacher Dashboard “My Courses” shows assigned courses (after Teacher sprints).
6. Teacher opens course details and manages that course.

UI states: saving, validation errors, success toast, list refresh.

**Do not design backend assignment logic.**

---

## Visual consistency

All owner modules must use:

- `PageHeader`, `DataTable`, `AdminModal`, `StatCard`, `AdminSurface`
- Inter, 8px spacing, `#2563EB` primary
- Same sidebar as dashboard

No per-module visual redesign.
