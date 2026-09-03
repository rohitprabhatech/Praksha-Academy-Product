# Sprint 10 — Owner Live Classes & Study Materials

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-10-owner-learning-operations`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

Build Owner Materials (PDF, Notes, PPT, Videos, Documents) and Live Classes (schedule with meeting **link**). Attach both to existing courses.

---

## 3. Why This Sprint Exists

Teacher online sessions and student live/materials screens need owner (or later teacher) records. Admin assignment lists these modules. They do not exist.

---

## 4. Prerequisites

Sprint 08 courses. Sprint 06 teachers for live class teacher field.

**BLOCKER:** no courses.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Materials list / add / edit | `/admin/materials`, `/add`, `/:id/edit` | Missing | CRUD |
| Live class list / schedule / edit | `/admin/live-classes`, `/schedule`, `/:id/edit` | Missing | CRUD |

---

## 6. Page-by-Page Development Instructions

### Materials List `/admin/materials`

#### Page Purpose
Library of files/links per course.

#### User
Owner.

#### Entry Point
Sidebar Learning → Materials.

#### UI Layout
PageHeader + Add. DataTable: title, type, course, date, actions.

#### Loading / Empty / Error / Success
Standard.

#### Add/Edit Material
title, type (PDF/Notes/PPT/Videos/Documents), course select, file or URL, status. Preview not required.

---

### Live Class List `/admin/live-classes`

#### Page Purpose
Schedule online sessions.

#### User
Owner.

#### Entry Point
Live Classes nav.

#### UI Layout
Table: class name, teacher, course, date, start, end, status, meeting link (open in new tab).

#### Schedule / Edit
Fields: Class Name, Teacher, Course, Date, Start Time, End Time, Meeting Link.

Do **not** embed Zoom/Meet SDK.

---

## 7. Component Requirements

Reuse DataTable, PageHeader, AdminModal, AdminSurface. Native file input. MUI date/time TextFields. No new calendar library unless Team Lead approves.

---

## 8. User Flow

Owner → Materials → Add PDF for a course → list.  
Owner → Live Classes → Schedule → meeting URL → list → student/teacher later join via link.

---

## 9–11. States / Search / Forms

Search title. Filter type/course. Pagination DataTable. Delete confirm.

### Material

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| title | text | Yes | required | |
| type | select | Yes | enum above | |
| courseId | select | Yes | required | |
| file | file | No* | | *file or url |
| url | url | No* | URL format if set | |
| status | select | Yes | | |

### Live class

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| name | text | Yes | required | |
| teacherId | select | Yes | required | |
| courseId | select | Yes | required | |
| date | date | Yes | required | |
| startTime | time | Yes | required | |
| endTime | time | Yes | required | |
| meetingLink | url | No | URL if set | |

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] All routes open; nav enabled.
- [ ] Material types selectable.
- [ ] Live class has meeting link field (not a custom video classroom).
- [ ] States, validation, responsive, DataTable reused.
- [ ] PR `[Sprint 10] Owner Live Classes and Materials` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-10-owner-learning-operations`.  
Depends on 08 (and 06). Blocks 15 and 17. Parallel with 09/11 if Team Lead accepts different folders.
