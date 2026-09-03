# Assignments — Frontend Requirements

Confirmed in admin assignment: AssignmentList, CreateAssignment, AssignmentDetails, Submissions.

Also required on Teacher (review) and Student (submit) UIs.

**Backend dependency — frontend implementation will consume the available backend service/API.**

---

## Owner screens

| Page | Route |
| --- | --- |
| List | `/admin/assignments` |
| Create | `/admin/assignments/create` |
| Details | `/admin/assignments/:id` |
| Submissions | `/admin/assignments/:id/submissions` |

Assignment fields are **not fully listed** in the assignment file. Use only what is needed for a list/create UI without inventing grading engines:

- Title (required)
- Course (required, select)
- Teacher (optional display; may follow selected course)
- Due date
- Description / instructions
- Status (Draft / Published)
- Attachment (optional file)

**Do not add rubric builders unless confirmed.**

## Teacher screens

- List filtered to assigned courses.
- Create for assigned courses only (dropdown limited in UI).
- Review: submissions table, status, optional marks field if Q-13 says teacher enters marks.

## Student screens

- List for enrolled courses.
- Detail + file upload submission.
- States: not started, submitted, closed.

## Shared UI states

Loading, empty (“No assignments”), error, success toast, disabled submit while uploading.

## Out of scope

- Backend storage of files (frontend uses file input; upload uses available API).
- Plagiarism or auto-grade.
