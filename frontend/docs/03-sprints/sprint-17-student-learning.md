# Sprint 17 — Student Learning Experience

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-17-student-learning`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

Extend the **existing** student shell: course learning page, live classes, materials, progress, settings. Wire My Courses “Continue” to `/student/courses/:id` instead of a toast. Do not rebuild Dashboard/Wishlist/Certificates from scratch.

---

## 3. Why This Sprint Exists

Confirmed: student accesses assigned courses, online sessions, progress. Shell exists; player/live/materials do not.

---

## 4. Prerequisites

Sprint 02 guards. Sprint 09 curriculum. Sprint 10 live/materials. Existing `StudentLayout`, My Courses.

**BLOCKER:** 02. 09/10 recommended or learning page shows EmptyState.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Dashboard | `/student/dashboard` | Partial | Upcoming class + continue real route |
| My Courses | `/student/courses` | Partial | Continue → learning route |
| Course learning | `/student/courses/:id` | Missing | Curriculum + lesson placeholder |
| Live classes | `/student/live-classes` | Missing | Upcoming + join |
| Materials | `/student/materials` | Missing | List |
| Progress | `/student/progress` | Missing | Per-course bars |
| Settings | `/student/settings` | Missing | Theme + change password |
| Sidebar | layout | Partial | Add Live, Materials, Progress, Settings |

Keep Wishlist, Certificates, Notifications, Profile.

---

## 6. Page-by-Page Development Instructions

### Course learning `/student/courses/:id`

#### Page Purpose
Student studies one **dynamic** course.

#### User
Student.

#### Entry Point
My Courses / Dashboard continue.

#### UI Layout
Title, teacher, progress bar. Left/top: module-chapter-lesson list. Main: lesson title + description placeholder (no video SDK). Links to materials/assignments.

#### Loading / Empty / Error
Skeleton; no lessons; unknown/not enrolled id.

#### Responsive Behavior
Desktop: list + content. Mobile: stacked, list first.

---

### Live classes

Table/cards: title, course, date, time, Join (disabled if no URL). Tabs upcoming vs past optional.

### Materials / Progress / Settings

Lists and bars; settings like teacher settings.

---

## 7. Component Requirements

Reuse Student CourseCard, DashboardHeader, EmptyState. Reuse public Curriculum display if data shape matches. Do not add a new video player library.

---

## 8. User Flow

Student login → Dashboard → Continue → lesson list → select lesson.  
Live classes → Join → new tab URL.

---

## 9–11. States / Search / Forms

Filter live by upcoming. Settings password form same as Sprint 02.

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] Continue does not only toast.
- [ ] No hardcoded Python student page.
- [ ] Join disabled without link.
- [ ] Sidebar new items work.
- [ ] States, responsive, no console errors.
- [ ] PR `[Sprint 17] Student Learning Experience` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-17-student-learning`. Depends on 02, 09, 10. Blocks 18. Do not parallel with unrelated student file edits without Team Lead.
