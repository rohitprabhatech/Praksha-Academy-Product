# Course Management — Frontend Requirements

Courses are **dynamic frontend data**. Never create course-specific pages such as `Python.jsx` or `Java.jsx`.

Public catalog already uses `src/data/courses.js` + `/courses/:slug`. Owner CRUD must feed the same conceptual model.

**Backend dependency — frontend implementation will consume the available backend service/API.**

---

## Confirmed (admin assignment)

### Course fields

Course Name, Category, Class, Subject, Teacher, Description, Thumbnail, Price, Discount Price, Duration, Language, Course Type, Status.

### Curriculum shape (UI)

Course → Module → Chapter → Lesson

### Pages

| Page | Route |
| --- | --- |
| Course List | `/admin/courses` |
| Add Course | `/admin/courses/add` |
| Edit Course | `/admin/courses/:id/edit` |
| Course Details | `/admin/courses/:id` |
| Curriculum | `/admin/courses/:id/curriculum` |

Also: Classes and Subjects CRUD (Sprint 07) so Course form dropdowns have options.

---

## Course List UI

- Search, filters (category, class, status, teacher), pagination.
- Columns: thumbnail, name, category, teacher, price, status, actions.
- Empty, loading, error states.
- Create button.

## Create / Edit form

- All confirmed fields.
- Teacher select (from teacher list UI). Single teacher until Q-04.
- Thumbnail file upload (frontend preview).
- Validation: required name, category, teacher, status; price ≥ 0; discount ≤ price.
- Success: toast + navigate to list or details.

## Course Details

- Summary of fields.
- Link to curriculum.
- Assigned teacher card.
- Enrollment count placeholder (from available API later).

## Curriculum builder

- Nested lists: add/edit/delete module, chapter, lesson.
- Lesson title + duration + type (lesson already used in public curriculum mock).
- Reorder **OPEN QUESTION** — not specified. Do not build drag-and-drop unless confirmed. Use add/remove/edit only.

---

## Public side

- `/courses` and `/courses/:slug` already implement the student-facing catalog.
- After owner create, public list should read the same service/mock.
- Do not hardcode academy courses (Python, AI, 12th Science, etc.) as routes.

---

## Out of scope

- API resource design.
- Multi-teacher assignment UI until Q-04.
- Separate batch entity until Q-07.
