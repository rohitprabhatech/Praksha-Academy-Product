# Sprint 06 — Owner Teacher Management

## 1. Sprint Owner

Developer: Renuka
Branch: `feature/sprint-06-owner-teacher-management`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

Build Owner Teacher List, Add, Edit, Details with fields from the admin assignment: Name, Email, Phone, Profile Image, Qualification, Experience, Specialization, Bio, Status. Enable sidebar Teachers. These records feed Sprint 08 “Assign Teacher”.

---

## 3. Why This Sprint Exists

Confirmed: Owner manages teachers and assigns them to courses. No teacher pages exist. Course create cannot offer a teacher select without this UI.

---

## 4. Prerequisites

Sprint 05 patterns (list/form/details). Sprint 04 shell. DataTable/PageHeader/AdminModal.

**BLOCKER:** Sprint 04. Sprint 05 strongly recommended so Students/Teachers look the same.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Teacher List | `/admin/teachers` | Missing | List + search/filter/pagination |
| Add Teacher | `/admin/teachers/add` | Missing | All assignment fields |
| Edit Teacher | `/admin/teachers/:id/edit` | Missing | Prefill |
| Teacher Details | `/admin/teachers/:id` | Missing | Profile + assigned courses section (empty until Sprint 08) |

---

## 6. Page-by-Page Development Instructions

### Teacher List

#### Page Purpose
Manage faculty accounts in the UI.

#### User
Owner.

#### Entry Point
Sidebar Teachers.

#### UI Layout
Same as Student List. Columns: photo/initials, name, email, specialization, status, actions.

#### Actions
Add, view, edit, delete confirm, activate/deactivate.

#### Loading / Empty / Error / Success
Same patterns as Sprint 05.

#### Responsive Behavior
Same as Students.

---

### Add / Edit Teacher

#### Page Purpose
Capture teacher profile including image preview.

#### User
Owner.

#### Entry Point
Add / Edit.

#### UI Layout
Section cards: Identity, Professional, Bio, Status. Image upload with preview (local File).

#### Actions
Save, Cancel.

#### Responsive Behavior
Image + fields stack on mobile.

---

### Teacher Details

#### Page Purpose
Read teacher; later show assigned courses.

#### User
Owner.

#### Entry Point
View.

#### UI Layout
Header (avatar, name, status, Edit). Bio. Qualification/experience/specialization. Assigned courses EmptyState until courses exist.

#### Unknown id
Not-found + back.

---

## 7. Component Requirements

Reuse DataTable, PageHeader, AdminModal, AdminSurface, Chip.  
New: `TeacherForm` (shared add/edit). File preview — do not add a new upload library; native input.  
Do not clone StudentForm into a third “UserForm” unless it truly shares fields — teachers have extra fields.

---

## 8. User Flow

Owner → Teachers → Add Teacher → image + fields → validate → Save → list → Details → Edit → assign later in Course form (Sprint 08).

---

## 9. Frontend Data States

Loading, empty, error, success, disabled save, delete confirmation.

---

## 10. Search / Filter / Sort / Pagination

Search: name, email, specialization.  
Filter: status.  
Pagination: DataTable.

---

## 11. Form Requirements

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| name | text | Yes | min 2 | |
| email | email | Yes | format | |
| phone | tel | No | 10 digits if set | |
| profileImage | file | No | image types | preview |
| qualification | text | No | | |
| experience | text | No | | |
| specialization | text | No | | |
| bio | textarea | No | | |
| status | select | Yes | Active/Inactive | |

Submit Save, Cancel to list, loading/disabled, toasts.

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] Four routes work.
- [ ] Navigation works.
- [ ] All assignment fields on form.
- [ ] Validation, buttons, states, responsive.
- [ ] Image preview works.
- [ ] DataTable reused.
- [ ] Sidebar Teachers enabled.
- [ ] No console errors.
- [ ] PR `[Sprint 06] Owner Teacher Management` → `dev`.

---

## 13. Developer Checklist

Branch `feature/sprint-06-owner-teacher-management`. Match Student UX. Test image + empty list + unknown id.

---

## 14. Definition of Done

`definition-of-done.md`.

---

## 15. Sprint Dependency Rule

### Depends On
04; 05 recommended.

### Blocks
08 (teacher select). 14 (teacher login identity can stay mock).

### Can Run in Parallel
No with 05 if same developer sequential; other files vs 07 yes with Team Lead.
