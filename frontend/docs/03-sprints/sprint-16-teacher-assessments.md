# Sprint 16 — Teacher Assessments, Marks & Attendance

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-16-teacher-assessments`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

Teacher manages Assignments (including review), Quizzes, Exams, Marks entry, and Attendance for assigned courses. Fill remaining sidebar pages from Sprint 14.

---

## 3. Why This Sprint Exists

Confirmed: teacher assignments, quizzes, marks, relevant students. Owner created assessment shells in Sprint 11.

---

## 4. Prerequisites

Sprint 15, Sprint 11.

**BLOCKER:** 15.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Assignments | `/teacher/assignments`, `/:id`, `/:id/review` | Shell | List, detail, review + score |
| Quizzes | `/teacher/quizzes`, `/:id`, `/:id/results` | Shell | List, results, optional questions view |
| Exams | `/teacher/exams`, `/:id` | Shell | List, results |
| Marks | `/teacher/marks` | Shell | Enter/edit scores table |
| Attendance | `/teacher/attendance` | Shell | Date + present/absent toggles, save |

---

## 6. Page-by-Page Development Instructions

### Assignment Review

#### Page Purpose
See submissions and enter a score.

#### User
Teacher.

#### UI Layout
DataTable: student, submitted at, file, status, score input, save.

#### Empty
No submissions.

#### Confirmation
None required per row; disable save while posting.

---

### Marks `/teacher/marks`

Filter course/assessment. Editable score cells. Save. This is the teacher **entry** UI (owner view was Sprint 12).

---

### Attendance `/teacher/attendance`

Select course/batch/date. Student list with Present/Absent. Save. Loading/empty (no students)/error/success toast.

---

### Quizzes / Exams

List for assigned courses. Results table with scores. Creating new quizzes: optional if owner-only create; if teacher can create, reuse QuestionEditor with course select locked.

**Interim:** teacher can create assignment/quiz for assigned courses (dropdown locked). Escalate to Team Lead if owner-only.

---

## 7. Component Requirements

Reuse DataTable, QuestionEditor (Sprint 11), PageHeader, EmptyState. Do not duplicate QuestionEditor.

---

## 8. User Flow

Teacher → Assignments → Review → enter score → Save.  
Teacher → Marks → filter → save.  
Teacher → Attendance → mark present/absent → Save.  
Teacher → Quizzes/Exams → results.

---

## 9–11. States / Search / Forms

Search student. Filter course. Pagination.

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| score | number | No | 0–100 if set | |
| attendance | toggle | Yes per row | | Present/Absent |
| date | date | Yes on attendance | required | |

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] Review/marks/attendance save on mock.
- [ ] Invalid score blocked.
- [ ] Assigned-course filter only.
- [ ] States, responsive.
- [ ] PR `[Sprint 16] Teacher Assessments Marks Attendance` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-16-teacher-assessments`. Depends on 15, 11. Blocks 18 (student can still be built with mocks). Sequential after 15.
