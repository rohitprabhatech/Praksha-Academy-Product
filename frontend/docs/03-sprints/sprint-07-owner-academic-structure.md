# Sprint 07 — Owner Classes, Subjects & Batches

## 1. Sprint Owner

Developer: Aditya Wakchaure
Branch: `feature/sprint-07-owner-academic-structure`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

Build Owner CRUD for **Classes** (Class 8 … Class 12 streams), **Subjects**, and **Batches** (named groups under a class/course for timetable-style grouping). These feed Course create dropdowns and later Teacher/Student batch lists.

---

## 3. Why This Sprint Exists

Admin assignment requires Classes and Subjects. Current product requirements also need batch grouping for teacher/student navigation. None of these pages exist.

---

## 4. Prerequisites

Sprint 04. Courses not required.

**BLOCKER:** Sprint 04.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Class List / Add / Edit | `/admin/classes`, `/add`, `/:id/edit` | Missing | CRUD |
| Subject List / Add / Edit | `/admin/subjects`, `/add`, `/:id/edit` | Missing | CRUD |
| Batch List / Add / Edit | `/admin/batches`, `/add`, `/:id/edit` | Missing | CRUD: name, class, optional course, status |

Seed mock classes: Class 8, 9, 10, 11 Science/Commerce/Arts, 12 Science/Commerce/Arts.

---

## 6. Page-by-Page Development Instructions

### Class List `/admin/classes`

#### Page Purpose
Academic grade/stream records.

#### User
Owner.

#### Entry Point
Sidebar Academic → Classes.

#### UI Layout
PageHeader + DataTable (name, status, actions). Add Class.

#### Loading / Empty / Error / Success
Standard. Empty: “No classes yet”.

#### Responsive Behavior
Same as Students table.

---

### Add/Edit Class

Fields: name (required), status. Save/Cancel. Unique name check on mock list.

---

### Subject List / Add / Edit

Same pattern. Field: name, status.

---

### Batch List `/admin/batches`

#### Page Purpose
Named batches (e.g. “Evening A”) so Teacher/Student can later filter people — not a hardcoded course page.

#### User
Owner.

#### Entry Point
Sidebar Batches (Academic group).

#### UI Layout
Table: name, class, course (optional), status.

#### Add/Edit Batch
name required; class required select; course optional select (empty until Sprint 08 — allow empty); status.

#### Unknown id
Not-found.

---

## 7. Component Requirements

Reuse DataTable, PageHeader, AdminModal, AdminSurface. One small `NameStatusForm` if Classes/Subjects are identical — Batches need a separate form.

---

## 8. User Flow

Owner → Classes → Add “Class 12 Science” → Subjects → Add “Physics” → Batches → Add “Morning Batch” linked to Class 12 Science → later Course form uses Class/Subject; teacher sees batches after Sprint 15.

---

## 9. Frontend Data States

Loading, empty, error, success, disabled save, delete confirmation.

---

## 10. Search / Filter / Sort / Pagination

Search by name. Filter status. Pagination DataTable.

---

## 11. Form Requirements

### Class / Subject

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| name | text | Yes | required, unique in mock | |
| status | select | Yes | Active/Inactive | |

### Batch

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| name | text | Yes | required | |
| classId | select | Yes | required | options from classes |
| courseId | select | No | | may be empty |
| status | select | Yes | | |

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] All class/subject/batch routes open.
- [ ] Navigation works; sidebar items enabled.
- [ ] Forms/validation/states/responsive.
- [ ] Seed classes can appear as initial mock rows.
- [ ] No Python-specific pages.
- [ ] Reuse DataTable.
- [ ] PR `[Sprint 07] Owner Classes Subjects Batches` → `dev`.

---

## 13. Developer Checklist

Branch `feature/sprint-07-owner-academic-structure`. Test unique name, delete confirm, empty lists.

---

## 14. Definition of Done

`definition-of-done.md`.

---

## 15. Sprint Dependency Rule

### Depends On
04.

### Blocks
08 (class/subject dropdowns). 15 (teacher batches).

### Can Run in Parallel
With 05/06 if Team Lead accepts.
