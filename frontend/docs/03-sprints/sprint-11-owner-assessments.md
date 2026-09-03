# Sprint 11 — Owner Assignments, Quizzes & Exams

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-11-owner-assessments`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

Build Owner UIs for Assignments (list, create, details, submissions), Quizzes (list, create, questions, results), and Exams (list, create, questions, results). Marks appear as **score columns**, not a separate product in this sprint.

---

## 3. Why This Sprint Exists

Confirmed product: assignments, quizzes, exams. Admin assignment named Assignments and Exams; current requirements also confirm Quizzes as frontend screens. None exist.

---

## 4. Prerequisites

Sprint 08 courses. Sprint 05 students useful for mock submissions.

**BLOCKER:** no courses.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Assignments | `/admin/assignments`, `/create`, `/:id`, `/:id/submissions` | Missing | Full |
| Quizzes | `/admin/quizzes`, `/create`, `/:id/questions`, `/:id/results` | Missing | Full |
| Exams | `/admin/exams`, `/create`, `/:id/questions`, `/:id/results` | Missing | Full |

---

## 6. Page-by-Page Development Instructions

### Assignment List / Create / Details / Submissions

#### Page Purpose
Define coursework and see submissions.

#### User
Owner.

#### Entry Point
Sidebar Assignments.

#### UI Layout
List DataTable; Create form; Details instructions; Submissions table (student, date, status, score optional).

#### Actions
Create, view, delete confirm, open submissions.

#### Loading / Empty / Error / Success
Including empty submissions.

#### Responsive Behavior
Tables scroll.

---

### Quiz List / Create / Questions / Results

#### Page Purpose
Owner can manage quizzes (confirmed). Simple question list (MCQ + short text). Results table with scores.

#### User
Owner.

#### Entry Point
Quizzes nav.

#### UI Layout
Same pattern as Exams so developers copy structure, not a new design system.

Do not build a timed game engine. One question editor list is enough.

---

### Exam List / Create / Questions / Results

Same as quizzes with exam-specific labels and date/duration fields.

---

## 7. Component Requirements

Reuse DataTable, PageHeader, AdminModal. New: `QuestionEditor` shared by Quiz and Exam. Do not create two editors.

---

## 8. User Flow

Owner → Assignments → Create for a course → Submissions (mock rows).  
Owner → Quizzes → Create → Questions → Results.  
Owner → Exams → same.

---

## 9–11. States / Search / Forms

Search by title. Filter by course/status. Pagination DataTable.

### Assignment create

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| title | text | Yes | required | |
| courseId | select | Yes | required | |
| dueDate | date | Yes if Published | | |
| instructions | textarea | No | | |
| attachment | file | No | | |
| status | select | Yes | Draft/Published | |

### Quiz / Exam create

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| title | text | Yes | required | |
| courseId | select | Yes | required | |
| date | date | No | | |
| duration | text/number | No | | |
| status | select | Yes | | |

### Question

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| prompt | text | Yes | required | |
| type | select | Yes | MCQ/short | |
| options | text list | Yes if MCQ | ≥2 | |

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] Assignment/quiz/exam routes open.
- [ ] Submissions and results tables exist (mock).
- [ ] Question editor reused.
- [ ] States, validation, responsive.
- [ ] No standalone Marks app in this sprint (score column only).
- [ ] PR `[Sprint 11] Owner Assignments Quizzes Exams` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-11-owner-assessments`.  
Depends on 08. Blocks 16 and 18. Parallel with 10 if Team Lead accepts.
