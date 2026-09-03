# Sprint 15 — Teacher Course Operations

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-15-teacher-course-operations`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

Replace Sprint 14 shell pages for My Courses, Course Details, My Students, Batches, Live Classes (Classes), and Materials with real lists filtered to **assigned courses only**. Teacher can open a course and manage course-related frontend features (view curriculum, see students, live sessions, materials).

---

## 3. Why This Sprint Exists

Confirmed: teacher manages assigned courses, students, online sessions, materials. Owner created the data in 07–10.

---

## 4. Prerequisites

Sprint 14 layout. Sprint 08–10, 07 batches.

**BLOCKER:** 14.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| My Courses | `/teacher/courses` | Shell | Assigned course cards/table |
| Course Details | `/teacher/courses/:id` | Missing | Read course; links to live/materials/students |
| My Students | `/teacher/students` | Shell | Students in assigned courses |
| Batches | `/teacher/batches` | Shell | Batches linked to assigned courses |
| Classes / Live | `/teacher/live-classes` | Shell | Schedule list; join link |
| Materials | `/teacher/materials` | Shell | List; add if scoped to assigned course ids |

---

## 6. Page-by-Page Development Instructions

### My Courses

#### Page Purpose
Only courses assigned to this teacher.

#### User
Teacher.

#### Entry Point
Sidebar My Courses; dashboard card.

#### UI Layout
Cards or DataTable: name, class, student count, status. Click → details.

#### Empty
EmptyState no assigned courses.

#### Actions
Open course. Teacher must **not** edit owner pricing.

---

### Course Details `/teacher/courses/:id`

#### Page Purpose
Hub for one dynamic course.

#### User
Teacher.

#### Entry Point
My Courses.

#### UI Layout
Course title, class/subject, curriculum read-only (from Sprint 09 mock), tabs or links: Students, Live, Materials, Assignments.

#### Wrong teacher / unknown id
Access denied or not-found.

---

### My Students / Batches / Live / Materials

Tables filtered by assigned course ids. Live: date, time, join URL. Materials: title, type, open/download. Optional: Schedule live / Add material with **course select locked** to assigned courses (reuse owner form fields).

---

## 7. Component Requirements

Reuse DataTable, PageHeader, EmptyState. Reuse student CourseCard only if it fits; else DataTable. Do not clone owner CourseForm entirely if most fields are owner-only — details are read-only.

---

## 8. User Flow

Teacher Dashboard → My Courses → Course Details → Students / Live / Materials.  
Join live class opens meeting URL in new tab.

---

## 9–11. States / Search / Forms

Search student name / course name. Filter course. Pagination DataTable.

If add material allowed:

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| title | text | Yes | required | |
| type | select | Yes | | |
| courseId | select | Yes | assigned only | locked options |
| file or url | file/url | one required | | |

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] Teacher A does not see Teacher B courses in the UI list (mock two teachers).
- [ ] All listed routes filled (not 404).
- [ ] Join link works.
- [ ] States, responsive, reuse DataTable.
- [ ] PR `[Sprint 15] Teacher Course Operations` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-15-teacher-course-operations`. Depends on 14, 10, 07. Blocks 16. No parallel with 14.
