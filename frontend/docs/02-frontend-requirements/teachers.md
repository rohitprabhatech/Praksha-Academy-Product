# Teachers — Frontend Requirements

**Backend dependency: frontend will consume the available backend/API service.**

| Requirement ID | Feature | User Role | Page | Purpose | User Action | Expected UI | Validation | UI States | Acceptance Criteria | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TCH-01 | Owner teacher CRUD | Owner | `/admin/teachers*` | Manage faculty | Add/edit | Assignment fields + image | Name, email | L/E/Err/S | Image preview | 06 | Not started |
| TCH-02 | Teacher dashboard | Teacher | `/teacher/dashboard` | Home | View summaries | Cards + upcoming + pending | N/A | Empty no courses | Full sidebar | 14 | Not started |
| TCH-03 | Assigned courses | Teacher | `/teacher/courses*` | Manage courses | Open course | Assigned only | N/A | L/E/Err | No other teachers’ courses | 15 | Not started |
| TCH-04 | Online sessions | Teacher | `/teacher/live-classes` | Conduct sessions | Join/schedule | Link field | URL if set | L/E/Err | New tab join | 15 | Not started |
| TCH-05 | Assignments/quizzes/marks | Teacher | `/teacher/assignments*` etc. | Assess | Review, score | Tables + inputs | Score 0–100 | L/E/Err/S | Review works | 16 | Not started |
| TCH-06 | Attendance | Teacher | `/teacher/attendance` | Record presence | Toggle save | Date + list | Date required | L/E/Err/S | Save toast | 16 | Not started |

Teacher self-register is not in the product: owner creates teachers (TCH-01). Login via `/login` + role.

See `teacher-dashboard.md`.
