# Student Dashboard — Frontend Requirements

**Existing (partial, mock):** Dashboard, My Courses, Wishlist, Certificates, Notifications, Profile.

**Not started:** learning player, live/recorded classes, assignments, exams, materials, progress, settings, teachers/batches.

**Backend dependency — frontend implementation will consume the available backend service/API.**

---

## Keep and improve

| Screen | Route | Improvement |
| --- | --- | --- |
| Dashboard | `/student/dashboard` | Replace mock with service data; add upcoming class + pending assignment widgets |
| My Courses | `/student/courses` | Primary action opens `/student/courses/:id` not a toast |
| Wishlist | `/student/wishlist` | Keep empty state |
| Certificates | `/student/certificates` | Keep PDF utility |
| Notifications | `/student/notifications` | Keep filters |
| Profile | `/student/profile` | Add link to settings / change password |

## New screens (v1)

| Screen | Route |
| --- | --- |
| Course learning / details | `/student/courses/:id` |
| Live / upcoming classes | `/student/live-classes` |
| Assignments list + submission | `/student/assignments`, `/student/assignments/:id` |
| Exams list + attempt or info | `/student/exams`, `/student/exams/:id` |
| Study materials | `/student/materials` |
| Course progress | `/student/progress` |
| Settings | `/student/settings` |

## OPEN QUESTION screens

| Screen | Question |
| --- | --- |
| My Teachers | Not in current sidebar; optional |
| My Batches | Q-07 |
| Recorded Classes | Q-22 — may be a tab on live classes |
| Quizzes / attempt / results | Q-11 |
| Marks standalone | Q-13 — can show on progress/exams |
| Attendance standalone | Q-13 — can show on progress |

---

## Course learning screen

- Course title, teacher name, progress bar.
- Module/chapter/lesson list from curriculum (same shape as public/admin).
- Lesson content area: placeholder for video/text; **no custom video platform required**.
- Link to materials, assignments for that course.
- Loading / empty curriculum / error states.

## Live classes

- List: title, course, teacher, date, time, status, join link (opens URL).
- Upcoming vs past tabs if recorded is not a separate module.

## Assignments

- List with due date and status (pending / submitted).
- Detail: instructions, file upload, submit button, success/error.
- Validation: file required if specified by UI flag.

## Exams

- List with date/status.
- Detail: if online exam is not confirmed (Q-14), show info + “results when published” rather than a full quiz engine.

## Progress

- Per-course progress, completed lessons, assignment completion. Simple cards + bars (already used on dashboard).

## Auth

- Guard `/student/*`.
- Login success should land here for student role.
