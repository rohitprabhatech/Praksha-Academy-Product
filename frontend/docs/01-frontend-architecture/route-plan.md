# Frontend Route Plan

Inspected from `src/routes/AppRoutes.jsx` and `src/routes/AdminRoutes.jsx`.  
**Do not modify routes in this planning task.** This file is the recommended target map.

**Backend dependency — frontend implementation will consume the available backend service/API.**

---

## Existing Routes

### Public (MainLayout)

| Path | Page |
| --- | --- |
| `/` | Home |
| `/courses` | Courses |
| `/courses/:slug` | CourseDetails |
| `/programs` | Programs |
| `/blog` | Blog |
| `/about` | About |
| `/contact` | Contact |

### Auth (no chrome layout)

| Path | Page |
| --- | --- |
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | ForgotPassword |
| `/verify-otp` | VerifyOtp |

### Student (StudentLayout) — unguarded

| Path | Page |
| --- | --- |
| `/student/dashboard` | Dashboard |
| `/student/courses` | MyCourses |
| `/student/wishlist` | Wishlist |
| `/student/certificates` | Certificates |
| `/student/notifications` | Notifications |
| `/student/profile` | Profile |

### Admin via AdminRoutes (`/admin/*`)

| Path | Page |
| --- | --- |
| `/admin` | Redirect to `/admin/dashboard` |
| `/admin/login` | AdminLogin |
| `/admin/dashboard` | Dashboard |
| `/admin/profile` | AdminProfile |
| `/admin/settings` | AdminSettings |
| unmatched `/admin/*` inside AdminRoutes | NotFound |

### Admin via AppRoutes (second AdminLayout tree)

| Path | Page |
| --- | --- |
| `/admin/blog` | BlogList |
| `/admin/blog/create` | CreateBlog |
| `/admin/blog/:id` | BlogDetails |
| `/admin/blog/:id/edit` | EditBlog |
| `/admin/gallery` | GalleryList |
| `/admin/gallery/add-image` | AddImage |
| `/admin/gallery/add-video` | AddVideo |
| `/admin/faq` | FAQList |
| `/admin/faq/add` | AddFAQ |
| `/admin/faq/:id/edit` | EditFAQ |
| `/admin/testimonials` | TestimonialsList |
| `/admin/testimonials/add` | AddTestimonial |
| `/admin/testimonials/:id/edit` | EditTestimonial |
| `/admin/notifications` | NotificationList |
| `/admin/notifications/create` | CreateNotification |
| `/admin/contact-messages` | ContactMessagesList |
| `/admin/contact-messages/:id` | MessageDetails |
| `/admin/reports/students` | StudentReports |
| `/admin/reports/courses` | CourseReports |
| `/admin/reports/revenue` | RevenueReports |
| `/admin/reports/performance` | PerformanceReports |

### Catch-all

| Path | Page |
| --- | --- |
| `*` | NotFound |

### Linked but not routed

`/terms`, `/privacy`, `/privacy-policy`, `/refund-policy`

---

## Routes Requiring Changes

| Route | Change | Why |
| --- | --- | --- |
| `/admin/*` split | Merge all owner routes into one AdminRoutes tree | Avoid NotFound vs content-route ranking issues |
| `/admin/login` vs `/login` | Keep both; add role redirect | Two login UIs exist |
| `/login` success | Redirect by role | Currently only toasts |
| `/student/*` | Wrap with RequireAuth + student role | Open to anyone |
| `/admin/*` (except login) | Wrap with RequireAuth + admin role | Open to anyone |
| `/privacy` vs `/privacy-policy` | Pick one path; redirect the other | Footer and Login disagree |
| Admin sidebar disabled paths | Enable as modules ship | `/admin/students` etc. already named in constants |

---

## Missing Routes

### Public

- `/teachers` — **OPEN QUESTION Q-24**
- `/faq` — **OPEN QUESTION** (FAQ exists on About)
- `/blog/:slug` — article detail
- `/privacy-policy`, `/terms`, `/refund-policy`
- `/reset-password` (or `/reset-password/:token` — token handling is frontend-only display)

### Auth / access

- `/unauthorized`
- `/access-denied`
- `/change-password` (or nested under each role settings)

### Owner / Admin (from admin assignment — not built)

- `/admin/students`, `/admin/students/add`, `/admin/students/:id`, `/admin/students/:id/edit`
- `/admin/teachers`, `/admin/teachers/add`, `/admin/teachers/:id`, `/admin/teachers/:id/edit`
- `/admin/classes`, `/admin/classes/add`, `/admin/classes/:id/edit`
- `/admin/subjects`, `/admin/subjects/add`, `/admin/subjects/:id/edit`
- `/admin/courses`, `/admin/courses/add`, `/admin/courses/:id`, `/admin/courses/:id/edit`, `/admin/courses/:id/curriculum`
- `/admin/materials`, `/admin/materials/add`, `/admin/materials/:id/edit`
- `/admin/live-classes`, `/admin/live-classes/schedule`, `/admin/live-classes/:id/edit`
- `/admin/assignments`, `/admin/assignments/create`, `/admin/assignments/:id`, `/admin/assignments/:id/submissions`
- `/admin/exams`, `/admin/exams/create`, `/admin/exams/:id/questions`, `/admin/exams/:id/results`
- `/admin/enrollments`, `/admin/enrollments/manual`, `/admin/enrollments/:id`
- `/admin/payments`, `/admin/payments/:id`
- `/admin/coupons`, `/admin/coupons/create`, `/admin/coupons/:id/edit`

Owner Marks / Attendance / Quizzes: **OPEN QUESTIONS Q-11, Q-13**. Do not add routes until confirmed. If confirmed, follow the same nested pattern under `/admin/`.

### Teacher (none exist)

Prefix: `/teacher`

- `/teacher/login` — **OPEN QUESTION**: teachers may use `/login` with role redirect instead
- `/teacher/dashboard`
- `/teacher/courses`, `/teacher/courses/:id`
- `/teacher/students`
- `/teacher/live-classes`
- `/teacher/materials`
- `/teacher/assignments`, `/teacher/assignments/:id`, `/teacher/assignments/:id/review`
- `/teacher/exams`, `/teacher/exams/:id`
- `/teacher/notifications`
- `/teacher/profile`
- `/teacher/settings`

Batches / quizzes / marks / attendance teacher routes depend on open questions. Interim: omit `/teacher/batches` until Q-07 is answered; teacher marks/attendance can live as tabs on course details if Q-13 prefers teacher entry.

### Student (missing learning)

- `/student/courses/:id` — learning / details
- `/student/live-classes`
- `/student/assignments`, `/student/assignments/:id`
- `/student/exams`, `/student/exams/:id`
- `/student/materials`
- `/student/progress`
- `/student/settings`

Quizzes/marks/attendance/teachers/batches: add when questions are closed.

---

## Final Recommended Frontend Routes

Keep `/admin` as the owner prefix (Q-02).

### Public

```
/ 
/courses
/courses/:slug
/programs
/blog
/blog/:slug
/about
/contact
/privacy-policy
/terms
/refund-policy
```

Optional until Q-24/Q-25: `/teachers`, `/faq`, `/success-stories`.

### Auth

```
/login
/register
/forgot-password
/verify-otp
/reset-password
/unauthorized
/access-denied
```

### Owner (Admin)

```
/admin/login
/admin/dashboard
/admin/profile
/admin/settings

/admin/students
/admin/students/add
/admin/students/:id
/admin/students/:id/edit

/admin/teachers
/admin/teachers/add
/admin/teachers/:id
/admin/teachers/:id/edit

/admin/classes
/admin/classes/add
/admin/classes/:id/edit

/admin/subjects
/admin/subjects/add
/admin/subjects/:id/edit

/admin/courses
/admin/courses/add
/admin/courses/:id
/admin/courses/:id/edit
/admin/courses/:id/curriculum

/admin/materials
/admin/materials/add
/admin/materials/:id/edit

/admin/live-classes
/admin/live-classes/schedule
/admin/live-classes/:id/edit

/admin/assignments
/admin/assignments/create
/admin/assignments/:id
/admin/assignments/:id/submissions

/admin/exams
/admin/exams/create
/admin/exams/:id/questions
/admin/exams/:id/results

/admin/enrollments
/admin/enrollments/manual
/admin/enrollments/:id

/admin/payments
/admin/payments/:id

/admin/coupons
/admin/coupons/create
/admin/coupons/:id/edit

/admin/blog
/admin/blog/create
/admin/blog/:id
/admin/blog/:id/edit

/admin/gallery
/admin/gallery/add-image
/admin/gallery/add-video

/admin/faq
/admin/faq/add
/admin/faq/:id/edit

/admin/testimonials
/admin/testimonials/add
/admin/testimonials/:id/edit

/admin/notifications
/admin/notifications/create

/admin/contact-messages
/admin/contact-messages/:id

/admin/reports/students
/admin/reports/courses
/admin/reports/revenue
/admin/reports/performance
```

### Teacher

```
/teacher/dashboard
/teacher/courses
/teacher/courses/:id
/teacher/students
/teacher/live-classes
/teacher/materials
/teacher/assignments
/teacher/assignments/:id
/teacher/assignments/:id/review
/teacher/exams
/teacher/exams/:id
/teacher/notifications
/teacher/profile
/teacher/settings
```

### Student

```
/student/dashboard
/student/courses
/student/courses/:id
/student/wishlist
/student/live-classes
/student/assignments
/student/assignments/:id
/student/exams
/student/exams/:id
/student/materials
/student/certificates
/student/progress
/student/notifications
/student/profile
/student/settings
```
