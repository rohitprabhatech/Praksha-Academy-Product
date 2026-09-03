# Sprint 09 — Owner Curriculum Builder

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-09-owner-curriculum`  
Status: Not Started  
Estimated Duration: 4–5 days

---

## 2. Sprint Goal

Build Course → Module → Chapter → Lesson editor at `/admin/courses/:id/curriculum`. Move up/down allowed; do not add a new drag-and-drop package unless Team Lead approves.

---

## 3. Why This Sprint Exists

Student learning and public course curriculum need a structure stored on the course. Assignment specifies this nest.

---

## 4. Prerequisites

Sprint 08 course records.

**BLOCKER:** no course id to attach.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Curriculum | `/admin/courses/:id/curriculum` | Missing | Nested editor |

---

## 6. Page-by-Page Development Instructions

### Curriculum

#### Page Purpose
Define lessons for a dynamic course.

#### User
Owner.

#### Entry Point
Course Details → Manage Curriculum.

#### UI Layout
PageHeader with course name. Nested lists/accordions. Add Module; inside: Add Chapter; inside: Add Lesson.

#### Header / Sidebar
Admin chrome; Courses active.

#### Main Content
Tree. Lesson fields: title, duration, type (lesson/video/text).

#### Actions
Add/edit/delete module/chapter/lesson; move up/down; Save all; Back to course.

#### Forms
Inline or modal; titles required.

#### Loading / Empty / Error / Success
Skeleton; “Add first module”; Retry; toast on save.

#### Responsive Behavior
Stacked nested cards on mobile; no trapped overflow.

---

## 7. Component Requirements

Reuse AdminModal, PageHeader, buttons. New: `CurriculumTree` used only here. Do not duplicate public `components/courses/Curriculum.jsx` unless you can share data shape — public component is display-only; admin is editor.

---

## 8. User Flow

Course Details → Curriculum → Add module “Intro” → Add chapter → Add lesson → Save → tree visible → later Student course page reads same mock.

---

## 9–11. States / Search / Forms

No search required. Delete confirm on module with children. Lesson title required.

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| moduleTitle | text | Yes | required | |
| chapterTitle | text | Yes | required | |
| lessonTitle | text | Yes | required | |
| duration | text | No | | |
| type | select | No | lesson/video/text | |

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] Route opens for valid course id.
- [ ] Unknown course handled.
- [ ] Nested add/delete works without crash.
- [ ] Loading/empty/error/success.
- [ ] Responsive.
- [ ] No new npm DnD lib without approval.
- [ ] PR `[Sprint 09] Owner Curriculum Builder` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-09-owner-curriculum`.  
Depends on 08. Blocks 17 (student learning). No parallel with 08.
