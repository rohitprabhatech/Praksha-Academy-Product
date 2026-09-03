# Quizzes — Frontend Requirements

Confirmed for frontend: Owner can manage quizzes; Teacher can manage quizzes; Student can attempt quizzes and see results.

**Backend dependency: frontend will consume the available backend/API service.**

Do not invent a timed proctoring engine. Use a simple question list + attempt form.

| Requirement ID | Feature | Role | Page | Sprint | Status |
| --- | --- | --- | --- | --- | --- |
| QZ-01 | Owner quiz CRUD + questions + results | Owner | `/admin/quizzes*` | 11 | Not started |
| QZ-02 | Teacher quiz list/results (create if assigned courses) | Teacher | `/teacher/quizzes*` | 16 | Not started |
| QZ-03 | Student attempt + results | Student | `/student/quizzes*` | 18 | Not started |

UI states: loading, empty, error, success, disabled after submit.

Share `QuestionEditor` between Owner quizzes and exams (Sprint 11).
