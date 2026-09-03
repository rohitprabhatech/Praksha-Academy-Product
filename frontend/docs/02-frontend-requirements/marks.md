# Marks — Frontend Requirements

Confirmed: Teacher enters marks; Student views marks/results; Owner reviews a read-only table.

**Backend dependency: frontend will consume the available backend/API service.**

| Requirement ID | Feature | Role | Page | Sprint | Status |
| --- | --- | --- | --- | --- | --- |
| MRK-01 | Owner marks table | Owner | `/admin/marks` | 12 | Not started |
| MRK-02 | Teacher marks entry | Teacher | `/teacher/marks` + assignment review scores | 16 | Not started |
| MRK-03 | Student marks view | Student | `/student/marks` | 18 | Not started |

Validation: score 0–100 if provided. UI states: loading, empty, error, success toast on save (teacher).
