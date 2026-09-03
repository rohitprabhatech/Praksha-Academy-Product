# Teacher Dashboard — Frontend Requirements

**Status:** Not started. No `pages/teacher`, no `/teacher` routes, no TeacherLayout.

Teacher frontend is a **separate dashboard** from Admin and Student.

**Backend dependency — frontend implementation will consume the available backend service/API.**

---

## Confirmed screens for v1

Aligned with “teacher manages assigned courses” and the admin assignment’s learning objects.

| Screen | Route | Notes |
| --- | --- | --- |
| Dashboard | `/teacher/dashboard` | Assigned course count, upcoming live classes, pending reviews |
| My Courses | `/teacher/courses` | Only courses assigned to this teacher (UI filter) |
| Course Details | `/teacher/courses/:id` | Read course info; links to materials, live, assignments, exams |
| My Students | `/teacher/students` | Students in assigned courses |
| Live Classes | `/teacher/live-classes` | Schedule list for assigned courses |
| Materials | `/teacher/materials` | Course materials |
| Assignments | `/teacher/assignments` | Create/list for assigned courses |
| Assignment Review | `/teacher/assignments/:id/review` | Submission list UI |
| Exams | `/teacher/exams` | List/results for assigned courses |
| Notifications | `/teacher/notifications` | Inbox UI (same patterns as student) |
| Profile | `/teacher/profile` | |
| Settings | `/teacher/settings` | Theme + password |

## OPEN QUESTION screens — do not build until answered

| Screen | Question |
| --- | --- |
| My Batches | Q-07 |
| Quizzes / Quiz Results | Q-11 |
| Marks (standalone) | Q-13 — may be a tab on exam/assignment |
| Attendance (standalone) | Q-13 |
| Online Classes as a second product besides Live Classes | Treat as the same Live Classes module |

---

## Dashboard UI

- Greeting + role label “Teacher”.
- Stat cards: assigned courses, students, upcoming classes, pending submissions.
- Upcoming classes table (reuse admin UpcomingClasses pattern).
- Empty state if no courses assigned.

## My Courses

- Cards or table of assigned courses.
- If none: empty state “No courses assigned yet”.
- Click → course details.

## Constraints

- Teacher must not see owner CMS (blog, coupons, all-students academy-wide) unless Q-03 says otherwise.
- Reuse `components/admin/common` for tables/modals.
- Visual language same as admin (blue primary, Inter, 8px grid).

## Auth

- Guard `/teacher/*`.
- Login via `/login` + role redirect (preferred) unless a dedicated teacher login is requested.
