# Courses — Frontend Requirements

Courses are **dynamic**. Never add `pages/Python.jsx`.

**Backend dependency: frontend will consume the available backend/API service.**

| Requirement ID | Feature | User Role | Page | Purpose | User Action | Expected UI | Validation | UI States | Acceptance Criteria | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CRS-01 | Public catalog | Public | `/courses` | Browse | Search/filter | Grid + pagination | N/A | Empty filters | Exists | Exists | Complete |
| CRS-02 | Public details | Public | `/courses/:slug` | Market a course | Open slug | Overview/curriculum | N/A | Not-found | Dynamic slug | Exists | Complete |
| CRS-03 | Owner list/create/edit/details | Owner | `/admin/courses*` | Manage | Assign teacher, save | Form sections | Name, teacher, status; discount ≤ price | L/E/Err/S | No hardcoded course routes | 08 | Not started |
| CRS-04 | Curriculum | Owner | `/admin/courses/:id/curriculum` | Structure | Add module/lesson | Nested editor | Titles required | L/E/Err/S | 3 levels | 09 | Not started |
| CRS-05 | Teacher my courses | Teacher | `/teacher/courses*` | Teach assigned | Open course | Assigned only | N/A | Empty if none | Filter by teacher | 14–15 | Not started |
| CRS-06 | Student learning | Student | `/student/courses/:id` | Learn | Continue | Curriculum + placeholder content | N/A | Empty curriculum | Continue not toast-only | 17 | Not started |

Flow: Owner → Course List → Create → Fill → Assign Teacher → Save → List → Teacher Dashboard → manage course.

See `course-management.md`.
