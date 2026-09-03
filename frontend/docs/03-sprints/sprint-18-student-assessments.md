# Sprint 18 — Student Assessments (Assignments, Quizzes, Exams, Marks)

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-18-student-assessments`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

Student can list/submit assignments, attempt quizzes (simple form), view exams/results, and view marks. Add nav items. Attendance view can be a simple list (present/absent history).

---

## 3. Why This Sprint Exists

Confirmed student requirements: assignments, submit, quizzes, marks/results. Not built.

---

## 4. Prerequisites

Sprint 17. Sprint 11/16 shapes.

**BLOCKER:** 17 (sidebar/layout).

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Assignments | `/student/assignments`, `/:id` | Missing | List + submit |
| Quizzes | `/student/quizzes`, `/:id` attempt, results | Missing | Attempt form |
| Exams | `/student/exams`, `/:id` | Missing | Info + results |
| Marks | `/student/marks` | Missing | Read-only scores |
| Attendance | `/student/attendance` | Missing | Read-only history |

---

## 6. Page-by-Page Development Instructions

### Assignment detail

#### Page Purpose
Read instructions and upload a file.

#### User
Student.

#### UI Layout
Title, due date, instructions, file input, Submit. After submit: status Submitted (disabled).

#### Validation
File required.

#### Closed assignment
Disabled submit + message.

---

### Quiz attempt `/student/quizzes/:id`

Simple: all questions on one page or one-by-one. Submit. Then results summary (score). No timer unless already easy. MCQ radio + short text.

### Exams

If online attempt is too large, show schedule + “Results when published” + results table — still a complete page, not a blank.

### Marks / Attendance

Read-only DataTable or cards.

---

## 7. Component Requirements

Reuse EmptyState, file input pattern from owner materials. Do not clone teacher QuestionEditor for taking quizzes — a slimmer `QuizAttemptForm` is OK.

---

## 8. User Flow

Student → Assignments → open → upload → submit → toast.  
Student → Quizzes → attempt → submit → results.  
Student → Marks → see scores.

---

## 9–11. States / Search / Forms

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| assignmentFile | file | Yes | required | |
| quiz answers | radio/text | Yes per question | | |

Search optional. Filter pending/submitted.

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] Submit without file blocked.
- [ ] Closed assignment cannot submit.
- [ ] Quiz results show after submit (mock score OK).
- [ ] Marks page read-only.
- [ ] States, responsive, nav items.
- [ ] PR `[Sprint 18] Student Assessments` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-18-student-assessments`. Depends on 17, 11. Blocks 19 slightly. Sequential after 17.
