# Exams — Frontend Requirements

Confirmed in admin assignment: ExamList, CreateExam, QuestionManagement, ExamResults.

**Backend dependency — frontend implementation will consume the available backend service/API.**

---

## Owner

| Page | Route |
| --- | --- |
| List | `/admin/exams` |
| Create | `/admin/exams/create` |
| Questions | `/admin/exams/:id/questions` |
| Results | `/admin/exams/:id/results` |

Suggested fields (assignment did not enumerate them; keep minimal):

- Exam title, course, date, start/end time, duration, status.
- Question manager: add question, type (MCQ / short text), options for MCQ, delete.

**Q-14:** If exams are offline, QuestionManagement can be a simple instructions + total marks form instead of a full quiz engine. Default for planning: build the question list UI because it is named in the assignment.

## Teacher

- List/results for assigned courses.
- Question edit **OPEN** — default: teacher can view; owner creates unless confirmed otherwise.

## Student

- List of published exams for enrolled courses.
- Attempt screen only if online exams confirmed; otherwise details + “appear in classroom” copy and later results.

## UI states

Loading, empty, error, success, disabled after submit.
