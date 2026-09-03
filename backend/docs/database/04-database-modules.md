# 04 — Database Modules

Modules identified from frontend analysis (`frontend/docs/`) mapped to database tables.

---

## Platform Modules

| Module | Tables | Frontend Source |
|---|---|---|
| Master Admin | `users`, `user_roles`, `roles` | SaaS requirement (new) |
| Tenants | `tenants`, `tenant_profiles` | SaaS requirement (new) |
| Subscription Plans | `subscription_plans` | SaaS requirement (new) |
| Tenant Subscriptions | `tenant_subscriptions` | SaaS requirement (new) |
| Trial Management | `tenants.trial_ends_at`, `tenant_subscriptions.trial_ends_at`, `subscription_plans.trial_days` | SaaS requirement (new) |
| Platform Settings | `platform_settings` | SaaS requirement (new) |
| Platform Audit Logs | `platform_audit_logs` | SaaS requirement (new) |
| RBAC | `roles`, `permissions`, `role_permissions`, `user_roles` | `authentication.md` |

---

## Tenant / Academy Modules

| Module | Tables | Frontend Source | Status |
|---|---|---|---|
| Academy Profile | `tenant_profiles` | `AdminSettings.jsx` | Required |
| Users & Auth | `users`, `password_reset_tokens`, `email_verifications` | `authentication.md` | Required |
| Teachers | `teacher_profiles`, `course_teachers` | `teachers.md`, sprint-06 | Required |
| Students | `student_profiles`, `enrollments` | `students.md`, sprint-05 | Required |
| Academic Classes | `academic_classes` | `classes.md`, sprint-07 | Required |
| Subjects | `subjects` | `classes.md`, sprint-07 | Required |
| Batches | `batches` | `classes.md`, sprint-07 | Required |
| Courses | `courses` | `courses.md`, `course-management.md` | Required |
| Course Teachers | `course_teachers` | `course-management.md` (Q-04: M:N ready) | Required |
| Curriculum | `course_modules`, `course_chapters`, `course_lessons` | sprint-09 | Required |
| Enrollments | `enrollments` | sprint-12 | Required |
| Lesson Progress | `lesson_progress` | sprint-17 | Required |
| Study Materials | `study_materials` | sprint-10 | Required |
| Live Classes | `live_classes` | `classes.md`, sprint-10 | Required |
| Assignments | `assignments`, `assignment_submissions` | `assignments.md`, sprint-11 | Required |
| Quizzes | `quizzes`, `quiz_questions`, `quiz_question_options`, `quiz_attempts`, `quiz_answers` | `quizzes.md`, sprint-11 | Required |
| Exams | `exams`, `exam_questions`, `exam_question_options`, `exam_attempts`, `exam_answers` | `exams.md`, sprint-11 | Required |
| Marks | `marks` | `marks.md`, sprint-12 | Required |
| Attendance | `attendance_records` | `attendance.md`, sprint-12 | Required |
| Payments | `payments` | sprint-12 | Required |
| Coupons | `coupons`, `coupon_redemptions` | sprint-12 | Required |
| Wishlist | `wishlist_items` | `Wishlist.jsx` | Required |
| Certificates | `certificates` | `Certificates.jsx` | Required |
| Blog | `blog_posts` | sprint-13 | Required |
| Gallery | `gallery_items` | sprint-13 | Required |
| FAQ | `faqs` | sprint-13 | Required |
| Testimonials | `testimonials` | sprint-13 | Required |
| Notifications | `notifications`, `notification_recipients` | `notifications.md`, sprint-19 | Required |
| Contact Messages | `contact_messages` | sprint-13 | Required |
| Tenant Audit Logs | `tenant_audit_logs` | SaaS requirement | Required |
| Reports / Analytics | Query-based (no dedicated tables) | `reports.md`, sprint-13 | Query-only |

---

## Modules NOT Included (Not in Frontend Requirements)

| Module | Reason |
|---|---|
| Payment gateway integration | Out of scope — only payment records stored |
| Push notifications | Out of scope per `notifications.md` |
| Video SDK / embedded classroom | Out of scope — meeting link only (Q-21) |
| Plagiarism detection | Out of scope per `assignments.md` |
| Biometric attendance | Out of scope per `attendance.md` |
| Social login | Out of scope per `authentication.md` |
| Dedicated public Teachers page | Optional (Q-24) — no extra tables needed |
| Public Gallery page | Optional (Q-27) — uses existing `gallery_items` |

---

## Module Dependency Order (Implementation)

```
Phase 1: Platform Foundation
  tenants → subscription_plans → tenant_subscriptions → users → roles

Phase 2: Tenant Core
  tenant_profiles → academic_classes → subjects → teacher/student profiles

Phase 3: Academic Structure
  courses → course_teachers → batches → enrollments

Phase 4: Curriculum & Learning
  course_modules → chapters → lessons → study_materials → live_classes

Phase 5: Assessments
  assignments → quizzes → exams → marks → attendance

Phase 6: Commerce & CMS
  payments → coupons → blog → gallery → notifications

Phase 7: Progress & Analytics
  lesson_progress → certificates → reports (queries)
```
