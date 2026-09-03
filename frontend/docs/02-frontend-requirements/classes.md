# Classes, Sessions & Batches — Frontend Requirements

**Backend dependency: frontend will consume the available backend/API service.**

| Requirement ID | Feature | User Role | Page | Purpose | User Action | Expected UI | Validation | UI States | Acceptance Criteria | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CLS-01 | Academic classes | Owner | `/admin/classes*` | Grades 8–12 streams | CRUD | Table | Name unique mock | L/E/Err/S | Seed examples | 07 | Not started |
| CLS-02 | Subjects | Owner | `/admin/subjects*` | Subjects | CRUD | Table | Name required | L/E/Err/S | 07 | 07 | Not started |
| CLS-03 | Batches | Owner | `/admin/batches*` | Groups | CRUD | Name+class | Name, class | L/E/Err/S | 07 | 07 | Not started |
| CLS-04 | Live classes owner | Owner | `/admin/live-classes*` | Schedule | Meeting link | Form | Date/time | L/E/Err/S | No video SDK | 10 | Not started |
| CLS-05 | Teacher live | Teacher | `/teacher/live-classes` | Conduct | Join | List | N/A | Empty | 15 | 15 | Not started |
| CLS-06 | Student live | Student | `/student/live-classes` | Attend | Join | List | N/A | Disabled no link | 17 | 17 | Not started |
| CLS-07 | Teacher batches | Teacher | `/teacher/batches` | See groups | View | Table | N/A | Empty | 15 | 15 | Not started |
