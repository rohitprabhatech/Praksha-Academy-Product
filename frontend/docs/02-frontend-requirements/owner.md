# Owner — Frontend Requirements

Academy Owner is the existing **Admin** UI (`/admin`). Do not rename routes unless Team Lead decides Q-02.

**Backend dependency: frontend will consume the available backend/API service.**

| Requirement ID | Feature | User Role | Page | Purpose | User Action | Expected UI | Validation | UI States | Acceptance Criteria | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OWN-01 | Owner dashboard | Owner | `/admin/dashboard` | Overview | View KPIs | Cards + charts | N/A | L/E/Err | Charts render | Exists; 04 | Partial |
| OWN-02 | Manage courses | Owner | `/admin/courses*` | CRUD + assign teacher | Create/save | Form + list | See courses.md | L/E/Err/S | Dynamic ids only | 08 | Not started |
| OWN-03 | Manage teachers | Owner | `/admin/teachers*` | CRUD | Add teacher | Form fields from assignment | Email required | L/E/Err/S | All fields | 06 | Not started |
| OWN-04 | Manage students | Owner | `/admin/students*` | CRUD | Add student | List/details | Email required | L/E/Err/S | Search/pagination | 05 | Not started |
| OWN-05 | Classes/subjects/batches | Owner | `/admin/classes*` etc. | Structure | Add class/batch | Tables | Name required | L/E/Err/S | Seed classes OK | 07 | Not started |
| OWN-06 | Assessments | Owner | assignments/quizzes/exams | Define work | Create | Lists + questions | Title+course | L/E/Err/S | Three modules | 11 | Not started |
| OWN-07 | Marks/attendance view | Owner | `/admin/marks` `/admin/attendance` | Review | Filter | Read-only tables | N/A | L/E/Err | Tables exist | 12 | Not started |
| OWN-08 | Shell | Owner | AdminLayout | Chrome | Navigate | One sidebar + TopNavbar | N/A | — | One sidebar | 01, 04 | Partial |

L/E/Err/S = Loading / Empty / Error / Success.

See also `owner-dashboard.md`.
