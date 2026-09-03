# 03 — Platform vs Tenant Data Classification

Every table in the Praksha Academy SaaS database is classified as either **Platform** or **Tenant** level.

---

## Classification Table

| Table | Level | tenant_id Required | Owner |
|---|---|---|---|
| `tenants` | Platform | No | Prabha Technology |
| `subscription_plans` | Platform | No | Prabha Technology |
| `tenant_subscriptions` | Platform | No (has tenant_id FK) | Prabha Technology |
| `platform_settings` | Platform | No | Prabha Technology |
| `roles` | Platform | No | Prabha Technology |
| `permissions` | Platform | No | Prabha Technology |
| `role_permissions` | Platform | No | Prabha Technology |
| `users` | Platform/Tenant | Nullable | Prabha Technology / Customer |
| `user_roles` | Platform/Tenant | Nullable | Prabha Technology / Customer |
| `password_reset_tokens` | Platform | No | Prabha Technology |
| `email_verifications` | Platform | No | Prabha Technology |
| `platform_audit_logs` | Platform | No (has tenant_id FK nullable) | Prabha Technology |
| `tenant_profiles` | Tenant | Yes | Customer |
| `teacher_profiles` | Tenant | Yes | Customer |
| `student_profiles` | Tenant | Yes | Customer |
| `academic_classes` | Tenant | Yes | Customer |
| `subjects` | Tenant | Yes | Customer |
| `batches` | Tenant | Yes | Customer |
| `courses` | Tenant | Yes | Customer |
| `course_teachers` | Tenant | Yes | Customer |
| `course_modules` | Tenant | Yes | Customer |
| `course_chapters` | Tenant | Yes | Customer |
| `course_lessons` | Tenant | Yes | Customer |
| `enrollments` | Tenant | Yes | Customer |
| `lesson_progress` | Tenant | Yes | Customer |
| `study_materials` | Tenant | Yes | Customer |
| `live_classes` | Tenant | Yes | Customer |
| `assignments` | Tenant | Yes | Customer |
| `assignment_submissions` | Tenant | Yes | Customer |
| `quizzes` | Tenant | Yes | Customer |
| `quiz_questions` | Tenant | Yes | Customer |
| `quiz_question_options` | Tenant | Yes | Customer |
| `quiz_attempts` | Tenant | Yes | Customer |
| `quiz_answers` | Tenant | Yes | Customer |
| `exams` | Tenant | Yes | Customer |
| `exam_questions` | Tenant | Yes | Customer |
| `exam_question_options` | Tenant | Yes | Customer |
| `exam_attempts` | Tenant | Yes | Customer |
| `exam_answers` | Tenant | Yes | Customer |
| `marks` | Tenant | Yes | Customer |
| `attendance_records` | Tenant | Yes | Customer |
| `payments` | Tenant | Yes | Customer |
| `coupons` | Tenant | Yes | Customer |
| `coupon_redemptions` | Tenant | Yes | Customer |
| `wishlist_items` | Tenant | Yes | Customer |
| `certificates` | Tenant | Yes | Customer |
| `blog_posts` | Tenant | Yes | Customer |
| `gallery_items` | Tenant | Yes | Customer |
| `faqs` | Tenant | Yes | Customer |
| `testimonials` | Tenant | Yes | Customer |
| `notifications` | Tenant | Yes | Customer |
| `notification_recipients` | Tenant | Yes | Customer |
| `contact_messages` | Tenant | Yes | Customer |
| `tenant_audit_logs` | Tenant | Yes | Customer |

---

## Summary

| Level | Table Count |
|---|---|
| Platform | 12 |
| Tenant | 42 |
| **Total** | **54** |

---

## Special Cases

### `users` Table

- **Platform users:** `tenant_id = NULL` (Master Admin staff)
- **Tenant users:** `tenant_id = <tenant UUID>` (Owner, Teacher, Student)
- Email uniqueness: `UNIQUE(tenant_id, email)` — same email can exist in different tenants

### `user_roles` Table

- **Platform roles:** `tenant_id = NULL` (e.g., master_admin)
- **Tenant roles:** `tenant_id = <tenant UUID>` (e.g., owner, teacher, student)

### `tenant_subscriptions` Table

Platform-level table that references `tenants.id`. It is NOT tenant-owned data — it is SaaS billing data managed by Prabha Technology.

### `platform_audit_logs` Table

Platform-level, but includes optional `tenant_id` to log actions that affect a specific tenant (e.g., "suspended tenant X").

---

## Rules

1. Platform tables are never filtered by tenant context in normal tenant operations
2. Tenant tables are ALWAYS filtered by `tenant_id`
3. Master Admin accesses platform tables directly
4. Tenant users never query platform tables (except their own tenant record via API)
5. No tenant business data is stored in platform tables
