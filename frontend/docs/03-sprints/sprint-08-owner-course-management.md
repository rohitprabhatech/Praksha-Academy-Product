# Sprint 08 — Owner Course Management

## 1. Sprint Owner

Developer: Ganesh
Branch: `feature/sprint-08-owner-course-management`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

Implement dynamic Course List, Create, Edit, and Details. Owner fills course information, **assigns a teacher**, saves, and the course appears in the list. **Do not** create `Python.jsx`, `Java.jsx`, or any course-name route. Curriculum is Sprint 09.

---

## 3. Why This Sprint Exists

This is the core business flow: Owner creates courses → teacher dashboards show assigned courses → students enroll. Public catalog already uses slugs; admin CRUD does not exist.

---

## 4. Prerequisites

* Sprint 06 (teachers in a select).
* Sprint 07 (class and subject options).
* Sprint 04 shell.
* Public `data/courses.js` is **not** a substitute for admin CRUD; you may adapter-merge mocks later.

**BLOCKER:** 06 or 07 missing (empty dropdowns).

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Course List | `/admin/courses` | Missing | Table + filters |
| Add Course | `/admin/courses/add` | Missing | Full field set |
| Edit Course | `/admin/courses/:id/edit` | Missing | Prefill |
| Course Details | `/admin/courses/:id` | Missing | Summary + link to curriculum (disabled or “coming” until 09) |

---

## 6. Page-by-Page Development Instructions

### Course List `/admin/courses`

#### Page Purpose
See all academy courses (Python, AI, 12th Science, etc. as **rows**, not pages).

#### User
Owner.

#### Entry Point
Sidebar Academic → Courses.

#### UI Layout
PageHeader “Courses” + Add Course. DataTable: thumbnail, name, category, class, teacher, price, status, actions.

#### Actions
Add, view, edit, delete confirm.

#### Loading / Empty / Error / Success
Skeleton; “No courses yet”; Retry; rows + toasts.

#### Responsive Behavior
Table scroll on mobile.

---

### Add Course `/admin/courses/add`

#### Page Purpose
Create a dynamic course and assign one teacher (single teacher until Team Lead says otherwise).

#### User
Owner.

#### Entry Point
Add Course.

#### UI Layout
Sections: Basic (name, category, description, language, type, duration); Academic (class, subject); Teacher (select); Pricing (price, discount); Media (thumbnail preview); Status.

#### Header
Breadcrumbs Admin / Courses / Create.

#### Sidebar
Courses active.

#### Main Content
Form.

#### Actions
Save, Cancel.

#### Forms
See table.

#### Validation
See table.

#### Loading State
Save spinner.

#### Empty State
If teacher list empty: message “Add a teacher first” + link `/admin/teachers/add`.

#### Error State
Field errors.

#### Success State
Toast + navigate to list or details.

#### Responsive Behavior
Desktop 2-column sections; mobile 1 column.

---

### Edit Course

Same form, prefilled. Route `/:id/edit`.

---

### Course Details `/admin/courses/:id`

#### Page Purpose
Read course; show assigned teacher card; link to curriculum.

#### User
Owner.

#### Entry Point
View.

#### UI Layout
Title, status, thumbnail, fields dl/grid, teacher name, “Manage curriculum” button (Sprint 09 route can 404 until 09 — prefer link present but Team Lead may hide until 09).

#### Unknown id
Not-found.

---

## 7. Component Requirements

Reuse DataTable, PageHeader, AdminModal, AdminSurface, Chip.  
New: `CourseForm` shared add/edit. Native file input for thumbnail.  
Do **not** duplicate public `components/courses/CourseCard` inside admin list unless you need a card view — table is specified.

---

## 8. User Flow

Owner Login → Owner Dashboard → Course Management (Courses) → Course List → Create Course → Fill Course Form → Validate Form → Assign Teacher → Submit → Success Message → Course appears in Owner Course List → Course Details → (Sprint 09) Curriculum → Assigned course appears in Teacher Dashboard (Sprint 14+).

---

## 9. Frontend Data States

Loading, empty, error, success, disabled save, delete confirmation.

---

## 10. Search / Filter / Sort / Pagination

Search: course name.  
Filter: category, class, status, teacher.  
Sort: optional name/price client-side.  
Pagination: DataTable.

---

## 11. Form Requirements

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| name | text | Yes | required | |
| category | text/select | Yes | required | free text or list |
| classId | select | No | | from Sprint 07 |
| subjectId | select | No | | from Sprint 07 |
| teacherId | select | Yes | required | from Sprint 06 |
| description | textarea | No | | |
| thumbnail | file | No | image | preview |
| price | number | No | ≥ 0 | |
| discountPrice | number | No | ≤ price if both set | |
| duration | text | No | | |
| language | text | No | | |
| courseType | text/select | No | | |
| status | select | Yes | Draft/Published/Inactive | |

Submit Save. Cancel list. Loading/disabled. Toasts.

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] Routes open.
- [ ] Navigation works.
- [ ] All listed fields present.
- [ ] Teacher is a select, not only free text.
- [ ] Saving “Python” does **not** add `/python` route; it adds `/admin/courses/:id`.
- [ ] Validation including discount ≤ price.
- [ ] States + responsive + DataTable reused.
- [ ] Empty teachers message.
- [ ] Sidebar Courses enabled.
- [ ] PR `[Sprint 08] Owner Course Management` → `dev`.

---

## 13. Developer Checklist

Branch `feature/sprint-08-owner-course-management`. Test create/edit/list/details/unknown id/mobile.

---

## 14. Definition of Done

`definition-of-done.md`.

---

## 15. Sprint Dependency Rule

### Depends On
06, 07, 04.

### Blocks
09, 10, 11, 12, 14 (teacher my courses).

### Can Run in Parallel
No.
