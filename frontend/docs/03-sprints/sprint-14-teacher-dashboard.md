# Sprint 14 — Teacher Dashboard Foundation

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-14-teacher-dashboard`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

Create the Teacher Dashboard **layout**. Implement the teacher sidebar with: Dashboard, My Courses, My Students, Batches, Classes (live sessions), Assignments, Quizzes, Exams, Marks, Attendance, Materials, Notifications, Profile, Settings. Create dashboard summary sections for assigned courses, students, upcoming classes, and pending activities. Add loading, empty, and error states. Ensure desktop, tablet, and mobile layouts. Verify every navigation item: pages that are not built until Sprints 15–16 must still **route** to a placeholder page that uses EmptyState (“This section will be available in the next sprint”) **or** a real empty list — **do not** leave dead links. Document unavailable backend data as a dependency.

---

## 3. Why This Sprint Exists

Confirmed: every teacher has a separate dashboard. Zero teacher files exist. Student and Admin layouts are the pattern to copy.

---

## 4. Prerequisites

* Sprint 02 (role `teacher` redirect to `/teacher/dashboard`).
* Sprint 08 (assigned course mock data — dashboard can show empty if none).
* `StudentLayout` + `components/student/Sidebar.jsx` as copy pattern.
* Admin `StatCard` / `DashboardCard` reuse.

**BLOCKER:** Sprint 02 (otherwise teacher URL is unguarded or redirect missing). Sprint 08 recommended so “assigned courses” is not always empty by design.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Teacher Dashboard | `/teacher/dashboard` | Missing | Full dashboard |
| Teacher Profile | `/teacher/profile` | Missing | Form like student profile |
| Teacher Settings | `/teacher/settings` | Missing | Theme + change password |
| Teacher Notifications | `/teacher/notifications` | Missing | Clone student notifications pattern |
| Placeholder list pages | `/teacher/courses`, `/students`, `/batches`, `/live-classes`, `/assignments`, `/quizzes`, `/exams`, `/marks`, `/attendance`, `/materials` | Missing | Shell pages with EmptyState **or** skip if Team Lead prefers hidden nav — **requirement is every nav item works** |

Prefer real empty list pages (same routes Sprint 15–16 will fill) rather than “Soon” dead ends.

---

## 6. Page-by-Page Development Instructions

### Teacher Dashboard `/teacher/dashboard`

#### Page Purpose
Home for one teacher: only **their** assigned courses.

#### User
Teacher.

#### Entry Point
Login with teacher role → this route.

#### UI Layout
TeacherLayout: sidebar + main. Greeting + role label “Teacher”. Four summary cards: Assigned courses count, Students count, Upcoming classes count, Pending activities (submissions to review). Section: upcoming classes table. Section: pending activities list.

#### Header
Mobile top bar with menu (copy StudentLayout). Optional desktop title in content.

#### Sidebar
Exact items: Dashboard, My Courses, My Students, Batches, Classes, Assignments, Quizzes, Exams, Marks, Attendance, Materials, Notifications, Profile, Settings, Logout.  
Do **not** show Blog, Coupons, Revenue, all-academy Students.

#### Main Content
Summary cards + two lists.

#### Actions
Card “View” links to My Courses / Live classes / Assignments. Logout.

#### Forms
None.

#### Validation
None.

#### Loading State
Skeletons for cards.

#### Empty State
If no assigned courses: EmptyState “No courses assigned yet. The academy owner assigns courses to you.”

#### Error State
ErrorState + Retry.

#### Success State
Data visible.

#### Responsive Behavior
Desktop: permanent sidebar ~260px.  
Tablet: drawer.  
Mobile: drawer + stacked cards (2x2 then 1 col).

---

### Profile / Settings / Notifications

Copy student pages’ structure (`pages/student/Profile.jsx`, Settings new, `Notifications.jsx`). Same validation as student profile. Toasts.

---

### Shell list pages (until 15/16)

#### Page Purpose
Navigation never 404s.

#### UI Layout
Page title + EmptyState or empty DataTable.

Sprint 15/16 replace empty with real tables **in those files**, not new routes.

---

## 7. Component Requirements

| Component | Purpose | Where | Reuse? |
| --- | --- | --- | --- |
| TeacherLayout | Shell | `/teacher/*` | New, clone StudentLayout |
| Teacher Sidebar | Nav | Layout | New, clone student sidebar structure |
| StatCard or DashboardCard | KPI | Dashboard | **Reuse admin** |
| EmptyState, ErrorState, PageLoader | States | All | Sprint 01 |
| NotificationCard | Inbox | Notifications | Reuse student component if props allow |

Do not copy Admin CMS.

---

## 8. User Flow

Teacher Login (`/login` role teacher) → Teacher Dashboard → sidebar My Courses (empty or list) → Profile → Settings → Notifications → Logout → cannot open `/admin/dashboard` (access denied).

---

## 9. Frontend Data States

Loading, empty (no courses), error, success, disabled logout none, no delete.

---

## 10. Search / Filter / Sort / Pagination

Not on dashboard. Shell lists: none required until 15.

---

## 11. Form Requirements

### Teacher profile

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| fullName | text | Yes | min 2 | |
| email | email | Yes | format | |
| phone | tel | No | 10 digits if set | |

Settings change password: same as Sprint 02 student.

**Backend dependency: frontend will consume the available backend/API service.** If assigned-course API is missing, mock filter `teacherId === currentUser`.

---

## 12. Acceptance Criteria

- [ ] `/teacher/dashboard` opens for teacher role.
- [ ] Guest redirected to login.
- [ ] Student hitting `/teacher/*` sees access denied.
- [ ] Every sidebar item navigates (no 404).
- [ ] Summary sections present.
- [ ] Loading/empty/error exist.
- [ ] Desktop/tablet/mobile work.
- [ ] Existing StatCard/EmptyState reused.
- [ ] No owner CMS in teacher nav.
- [ ] No console errors.
- [ ] PR `[Sprint 14] Teacher Dashboard Foundation` → `dev`.

---

## 13. Developer Checklist

Before: pull `dev`, read StudentLayout/Sidebar, confirm 02+08, branch `feature/sprint-14-teacher-dashboard`.  
During: every nav click, empty assigned courses, mobile drawer.  
Before PR: screenshots desktop+mobile, PR to `dev`.

---

## 14. Definition of Done

`definition-of-done.md`.

---

## 15. Sprint Dependency Rule

### Depends On
02, 08.

### Blocks
15, 16.

### Can Run in Parallel
No with 08. After 08, sequential 14 then 15.
