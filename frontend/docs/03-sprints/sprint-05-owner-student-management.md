# Sprint 05 — Owner Student Management

## 1. Sprint Owner

Developer: Aditya Kshirsagar  
Branch: `feature/sprint-05-owner-student-management`  
Status: Not Started  
Estimated Duration: 2 days

---

## 2. Sprint Goal

Build Owner Student List, Add, Edit, and Details with search, filter, pagination, activate/deactivate, and delete confirmation — using existing `DataTable` / `PageHeader` / `AdminModal`. Enable sidebar **Students**.

---

## 3. Why This Sprint Exists

Confirmed: Owner manages students. Manual enrollment (Sprint 12) and teacher “My Students” need student records in the UI. This page set does not exist today.

---

## 4. Prerequisites

* Sprint 04 shell.
* `DataTable`, `PageHeader`, `AdminModal`, EmptyState, ErrorState, PageLoader.
* Do **not** wait for Courses.

**BLOCKER:** Sprint 04 not merged (nav/layout).

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Student List | `/admin/students` | Missing | Full list UX |
| Add Student | `/admin/students/add` | Missing | Form |
| Edit Student | `/admin/students/:id/edit` | Missing | Form prefill |
| Student Details | `/admin/students/:id` | Missing | Profile + enrolled courses + progress sections (empty OK) |

---

## 6. Page-by-Page Development Instructions

### Student List `/admin/students`

#### Page Purpose
Find and manage all students.

#### User
Owner.

#### Entry Point
Sidebar Users → Students.

#### UI Layout
AdminLayout. PageHeader title “Students”, subtitle count, action button “Add Student”. DataTable.

#### Header
TopNavbar + PageHeader.

#### Sidebar
Students active.

#### Main Content
Table columns: name, email, phone, status, enrolled count (0 until courses), actions (view/edit/delete).

#### Actions
Add Student; row View; Edit; Delete (confirm); Activate/Deactivate.

#### Forms
None on list.

#### Validation
N/A.

#### Loading State
PageLoader or table skeleton.

#### Empty State
EmptyState “No students yet” + Add Student.

#### Error State
ErrorState + Retry.

#### Success State
Rows render; toast after delete.

#### Responsive Behavior
Desktop: full table. Tablet/Mobile: DataTable horizontal scroll (existing pagination).

---

### Add / Edit Student

#### Page Purpose
Create or update a student.

#### User
Owner.

#### Entry Point
Add button / Edit action.

#### UI Layout
PageHeader breadcrumbs Admin / Students / Add. Form in AdminSurface. Submit + Cancel.

#### Header / Sidebar
Same chrome; Students active.

#### Main Content
Fields below.

#### Actions
Save, Cancel (back to list).

#### Loading / Empty / Error / Success
Submit spinner; N/A; field errors + toast on fail; toast + navigate list.

#### Responsive Behavior
Single column mobile; optional 2-col desktop (name/email).

---

### Student Details `/admin/students/:id`

#### Page Purpose
Read-only profile plus enrolled courses and progress (may be empty).

#### User
Owner.

#### Entry Point
View on list.

#### UI Layout
Header with name, status chip, Edit button. Sections: contact, Enrolled courses (EmptyState if none), Progress (placeholder bars or empty).

#### Unknown id
ErrorState or not-found copy + back to list.

#### Responsive Behavior
Stacked sections.

---

## 7. Component Requirements

| Component | Purpose | Where | Reuse? |
| --- | --- | --- | --- |
| DataTable | List | List | **Reuse** |
| PageHeader | Title | All | **Reuse** |
| AdminModal | Delete confirm | List | **Reuse** |
| AdminSurface | Form card | Add/Edit | **Reuse** |
| Status chip | Active/Inactive | List/Details | MUI Chip — no new Badge lib |
| StudentForm | Shared add/edit | Add/Edit | **New** one form component, used twice |

Do not create `UserTable.jsx` if DataTable suffices.

---

## 8. User Flow

Owner Dashboard → Students → Add Student → fill form → validate → Save → toast → List shows row → View Details → Edit → Save → Deactivate (confirm) → Delete (confirm).

---

## 9. Frontend Data States

Loading, empty, error, success, disabled (save in flight), confirmation (delete/deactivate).

---

## 10. Search / Filter / Sort / Pagination

Search: name, email (DataTable `searchKey` or both via custom filter).  
Filter: status Active / Inactive / All.  
Sort: optional name (if easy with client sort; not required if DataTable lacks it — document in PR).  
Pagination: DataTable existing page size.

---

## 11. Form Requirements

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| fullName | text | Yes | min 2 | |
| email | email | Yes | format | |
| phone | tel | No | 10 digits if present | |
| status | select | Yes | Active/Inactive | default Active |

Submit: Save. Cancel: list. No reset button required. Messages: field helpers + toast. Disabled + loading on submit.

**Backend dependency: frontend will consume the available backend/API service.** Use mock array in `services` or `data`.

---

## 12. Acceptance Criteria

- [ ] All four routes open.
- [ ] Navigation + breadcrumbs work.
- [ ] UI sections present.
- [ ] Forms have all fields.
- [ ] Validation works.
- [ ] Buttons work.
- [ ] Loading/empty/error/success/confirm.
- [ ] Search/filter/pagination work on mock data.
- [ ] Responsive.
- [ ] DataTable reused.
- [ ] No duplicate table component.
- [ ] No console errors.
- [ ] Unknown id handled.
- [ ] Sidebar Students enabled.
- [ ] PR `[Sprint 05] Owner Student Management` → `dev`.

---

## 13. Developer Checklist

Before: `dev` pulled, Sprint 04 done, branch `feature/sprint-05-owner-student-management`.  
During: reuse admin common, mock only.  
Before PR: CRUD + empty + invalid email + mobile table + console.

---

## 14. Definition of Done

`definition-of-done.md`.

---

## 15. Sprint Dependency Rule

### Depends On
04.

### Blocks
12 (manual enrollment student select). Soft-blocks teacher My Students.

### Can Run in Parallel
With 07 (classes) if different files — Team Lead only.
