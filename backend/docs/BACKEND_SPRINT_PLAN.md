# Praksha Academy — Backend Development Sprint Plan
**Company:** Prabha Technology
**Project:** Praksha Academy SaaS (Multi-tenant Education Platform)
**Stack:** Python 3.11 · FastAPI · SQLAlchemy · Alembic · MySQL 8 · pytest
**Updated:** 2026-09-03
**Note:** Frontend sprints are already planned separately. This document covers BACKEND ONLY.

---

## ✅ COMPLETED

| Sprint | Branch | What was done |
|--------|--------|---------------|
| Sprint 01 | `feature/sprint-01-backend-foundation` | FastAPI app scaffold, health checks, CORS, pytest, .env, Alembic wiring |
| Sprint 02 | `feature/sprint-02-database` | 54 SQLAlchemy models, Alembic initial migration, DB alignment tests |
| DB Design | `feature/sprint-db-design` | Schema updated to 64 tables, ERD, this plan |

---

## SPRINT OVERVIEW

| Sprint | Focus | Tables/APIs | Duration |
|--------|-------|-------------|----------|
| Sprint 03 | Auth APIs | users, refresh_tokens, user_sessions, email_verifications, password_reset_tokens | 1.5 weeks |
| Sprint 04 | Platform Admin APIs | tenants, subscription_plans, tenant_subscriptions, platform_settings, roles, permissions | 1 week |
| Sprint 05 | Tenant Setup APIs | tenant_profiles, tenant_website_settings, teacher_profiles, student_profiles, academic_classes, subjects | 1.5 weeks |
| Sprint 06 | Course & Content APIs | programs, program_courses, courses, course_teachers, course_modules, course_chapters, course_lessons, study_materials | 1.5 weeks |
| Sprint 07 | Enrollment, LMS & Assessment APIs | enrollments, lesson_progress, live_classes, announcements, assignments, quizzes, exams, question_bank, marks, attendance | 2 weeks |
| Sprint 08 | Finance, CMS & Notifications APIs | fee_structures, fee_invoices, payments, coupons, certificates, blog_posts, gallery_items, faqs, testimonials, contact_messages, notifications | 1.5 weeks |

---

---

# SPRINT 03 — Authentication & Authorization APIs

## Branch
```
git checkout dev
git checkout -b feature/sprint-03-auth-apis
```

## Goal
Implement complete JWT-based authentication: register, login, refresh, logout, email OTP verification, password reset. All endpoints must work for all user roles (master_admin, owner, teacher, student).

## Database Tables Used
- `users`
- `user_roles`
- `roles`
- `refresh_tokens`
- `user_sessions`
- `email_verifications`
- `password_reset_tokens`
- `tenant_audit_logs`

## API Endpoints to Build

### Auth Routes — `/api/v1/auth`
| Method | Path | Who can call | Description |
|--------|------|-------------|-------------|
| POST | `/auth/login` | Anyone | Email+password login → returns access_token + refresh_token |
| POST | `/auth/refresh` | Authenticated | Exchange refresh_token → new access_token |
| POST | `/auth/logout` | Authenticated | Revoke refresh token, kill session |
| POST | `/auth/logout-all` | Authenticated | Revoke ALL sessions for this user |
| GET | `/auth/me` | Authenticated | Return current user profile + roles |
| PUT | `/auth/me` | Authenticated | Update name, phone, avatar |
| POST | `/auth/forgot-password` | Anyone | Send OTP/link to email |
| POST | `/auth/reset-password` | Anyone | Verify token, set new password |
| POST | `/auth/verify-email` | Anyone | Verify OTP for email confirmation |
| POST | `/auth/resend-verification` | Anyone | Resend email OTP |

### User Registration (Owner only creates teachers/students in Sprint 05)
| Method | Path | Who can call | Description |
|--------|------|-------------|-------------|
| POST | `/auth/register/student` | Public | Self-registration as student (tenant identified by subdomain or param) |

## Response Format (MUST follow this for ALL endpoints)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
      "id": "uuid",
      "email": "...",
      "first_name": "...",
      "roles": ["owner"]
    }
  }
}
```

Error response:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": [{"field": "email", "message": "No account found"}]
}
```

## Files to Create/Modify

### New files
```
backend/app/api/v1/
    auth.py              ← All auth route handlers

backend/app/schemas/
    auth.py              ← LoginRequest, RegisterRequest, TokenResponse, MeResponse

backend/app/services/
    auth_service.py      ← Business logic: login, register, refresh, logout

backend/app/repositories/
    user_repository.py   ← DB queries for users
    token_repository.py  ← DB queries for refresh_tokens, user_sessions

backend/app/core/
    security.py          ← create_access_token, verify_token, hash_password
    dependencies.py      ← get_current_user, require_role decorators

backend/app/utils/
    email.py             ← send_otp_email (use SMTP or just log in dev)
```

### Modify
```
backend/app/api/v1/router.py   ← register auth.router
backend/app/models/            ← Ensure RefreshToken, UserSession, EmailVerification models match schema v2
```

## Technical Specifications

### JWT Config (in .env)
```
JWT_SECRET_KEY=<random 64-char string>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30
```

### Password Rules
- Minimum 8 characters
- Hash with `bcrypt` via `passlib`
- Never return password_hash in any response

### Refresh Token Flow
1. Login → generate `access_token` (15 min) + `refresh_token` (30 days)
2. Store SHA-256 hash of refresh_token in `refresh_tokens` table
3. On refresh: look up hash, check not revoked, check not expired → issue new access_token
4. On logout: set `revoked_at = NOW()` in refresh_tokens

### Multi-tenancy in Auth
- Platform master admin: `tenant_id = NULL` in users table
- Tenant users: `tenant_id = <tenant uuid>`
- JWT payload must include: `user_id`, `tenant_id`, `roles[]`, `exp`
- Middleware extracts tenant from JWT (not from URL in auth endpoints)

## Tests to Write
```
tests/test_auth/
    test_login.py         ← valid login, wrong password, inactive user
    test_refresh.py       ← valid refresh, expired token, revoked token
    test_logout.py        ← logout invalidates token
    test_register.py      ← student self-registration
    test_password_reset.py
    test_email_verify.py
```
Minimum: **20 test cases**, all must pass.

## Definition of Done
- [ ] All 10 endpoints return correct responses
- [ ] JWT tokens verified by middleware
- [ ] Refresh token stored+revoked in DB
- [ ] Password hashed with bcrypt
- [ ] Email OTP sends (or logs to console in dev)
- [ ] Tests pass: `pytest tests/test_auth/ -v`
- [ ] No `.env` secrets committed
- [ ] PR to `dev` with description

---

---

# SPRINT 04 — Platform Admin APIs

## Branch
```
git checkout dev
git checkout -b feature/sprint-04-platform-admin
```

## Goal
APIs for the Prabha Technology master admin to manage tenants, subscription plans, and platform settings. These are `/platform/*` routes, protected by `master_admin` role.

## Database Tables Used
- `tenants`
- `tenant_subscriptions`
- `subscription_plans`
- `platform_settings`
- `roles`
- `permissions`
- `role_permissions`
- `platform_audit_logs`

## API Endpoints to Build

### Tenants — `/api/v1/platform/tenants`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/platform/tenants` | List all tenants (paginated, filterable by status) |
| POST | `/platform/tenants` | Register new tenant (pending → sends welcome email) |
| GET | `/platform/tenants/{id}` | Get tenant detail |
| PATCH | `/platform/tenants/{id}/approve` | Approve pending tenant → status = trial |
| PATCH | `/platform/tenants/{id}/activate` | Activate tenant |
| PATCH | `/platform/tenants/{id}/suspend` | Suspend tenant |
| PATCH | `/platform/tenants/{id}/cancel` | Cancel tenant |
| DELETE | `/platform/tenants/{id}` | Soft-delete tenant |
| GET | `/platform/tenants/{id}/subscription` | Get current subscription |

### Subscription Plans — `/api/v1/platform/plans`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/platform/plans` | List all plans |
| POST | `/platform/plans` | Create plan |
| GET | `/platform/plans/{id}` | Get plan detail |
| PUT | `/platform/plans/{id}` | Update plan |
| DELETE | `/platform/plans/{id}` | Soft-delete |

### Assign Plan to Tenant
| Method | Path | Description |
|--------|------|-------------|
| POST | `/platform/tenants/{id}/subscription` | Assign/update subscription plan |

### Platform Settings
| Method | Path | Description |
|--------|------|-------------|
| GET | `/platform/settings` | List all settings |
| PUT | `/platform/settings/{key}` | Update a setting value |

### Platform Audit Logs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/platform/audit-logs` | List audit logs (filterable by tenant, actor, date) |

## Files to Create
```
backend/app/api/v1/
    platform/
        __init__.py
        tenants.py
        plans.py
        settings.py
        audit.py

backend/app/schemas/
    platform.py       ← TenantCreate, TenantResponse, PlanCreate, etc.

backend/app/services/
    tenant_service.py
    plan_service.py

backend/app/repositories/
    tenant_repository.py
    plan_repository.py
```

## Pagination Standard (use this everywhere)
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 150,
    "page": 1,
    "per_page": 20,
    "pages": 8
  }
}
```
Query params: `?page=1&per_page=20&status=active&search=praksha`

## Audit Log Requirement
Every write operation (POST/PATCH/DELETE) must create a row in `platform_audit_logs`:
- `actor_user_id` = current user
- `action` = e.g. `"tenant.approve"`, `"plan.create"`
- `entity_type` = `"tenant"`, `"plan"`
- `entity_id` = the affected record UUID
- `metadata_json` = before/after state snapshot

## Tests
```
tests/test_platform/
    test_tenants.py     ← CRUD + status transitions
    test_plans.py       ← CRUD
    test_settings.py
```
Minimum **15 test cases**.

## Definition of Done
- [ ] All endpoints protected by `master_admin` role
- [ ] Pagination works on list endpoints
- [ ] Tenant status machine enforced (can't go suspended → active directly)
- [ ] Audit log written on every write
- [ ] Tests pass

---

---

# SPRINT 05 — Tenant Setup APIs

## Branch
```
git checkout dev
git checkout -b feature/sprint-05-tenant-setup
```

## Goal
APIs for the Academy Owner to set up their tenant: branding, website CMS, teachers, students, academic classes, subjects, batches.

## Database Tables Used
- `tenant_profiles`
- `tenant_website_settings`
- `teacher_profiles` + `users`
- `student_profiles` + `users`
- `academic_classes`
- `subjects`
- `batches`
- `batch_students`
- `tenant_audit_logs`

## API Endpoints to Build

### Tenant Profile — `/api/v1/owner/profile`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/profile` | Get own tenant profile |
| PUT | `/owner/profile` | Update tenant profile (name, logo, contact) |
| PUT | `/owner/profile/website` | Update website CMS settings (branding, pages JSON) |
| GET | `/owner/profile/website` | Get website settings |
| POST | `/owner/profile/website/publish` | Publish website |

### Teachers — `/api/v1/owner/teachers`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/teachers` | List teachers (paginated) |
| POST | `/owner/teachers` | Create teacher (creates user + teacher_profile) |
| GET | `/owner/teachers/{id}` | Get teacher detail |
| PUT | `/owner/teachers/{id}` | Update teacher profile |
| DELETE | `/owner/teachers/{id}` | Soft-delete (deactivate) |
| POST | `/owner/teachers/{id}/reset-password` | Owner resets teacher password |

### Students — `/api/v1/owner/students`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/students` | List students (paginated, filter by batch/class/status) |
| POST | `/owner/students` | Create student (creates user + student_profile) |
| GET | `/owner/students/{id}` | Get student detail |
| PUT | `/owner/students/{id}` | Update student profile |
| DELETE | `/owner/students/{id}` | Soft-delete |
| POST | `/owner/students/{id}/reset-password` | Owner resets student password |

### Academic Classes — `/api/v1/owner/classes`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/classes` | List classes |
| POST | `/owner/classes` | Create class |
| PUT | `/owner/classes/{id}` | Update |
| DELETE | `/owner/classes/{id}` | Soft-delete |

### Subjects — `/api/v1/owner/subjects`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/subjects` | List subjects |
| POST | `/owner/subjects` | Create |
| PUT | `/owner/subjects/{id}` | Update |
| DELETE | `/owner/subjects/{id}` | Soft-delete |

### Batches — `/api/v1/owner/batches`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/batches` | List batches |
| POST | `/owner/batches` | Create batch |
| GET | `/owner/batches/{id}` | Batch detail |
| PUT | `/owner/batches/{id}` | Update |
| DELETE | `/owner/batches/{id}` | Soft-delete |
| GET | `/owner/batches/{id}/students` | List students in batch |
| POST | `/owner/batches/{id}/students` | Add student to batch |
| DELETE | `/owner/batches/{id}/students/{studentId}` | Remove student from batch |

## Important Rules
1. **Tenant Isolation**: Every query MUST filter by `tenant_id` extracted from JWT. A teacher of Tenant A must NEVER see Tenant B data.
2. When creating a teacher/student, always:
   - Create `users` row first (with hashed temp password)
   - Create `teacher_profiles` / `student_profiles` row
   - Assign correct role in `user_roles`
   - Return both user + profile in response
3. Default password for owner-created accounts: `Praksha@123` (hash it, send via email in prod)

## Files to Create
```
backend/app/api/v1/
    owner/
        __init__.py
        profile.py
        teachers.py
        students.py
        classes.py
        subjects.py
        batches.py

backend/app/schemas/
    owner.py         ← TenantProfileUpdate, TeacherCreate, StudentCreate, etc.
    website.py       ← WebsiteSettingsUpdate, PageContentSchema

backend/app/services/
    user_service.py          ← creates user + profile atomically
    academic_service.py
    website_service.py

backend/app/repositories/
    teacher_repository.py
    student_repository.py
    academic_repository.py
```

## Tests
```
tests/test_owner/
    test_profile.py
    test_teachers.py     ← create, list, update, delete, password reset
    test_students.py
    test_classes.py
    test_batches.py
```
Minimum **25 test cases**.

## Definition of Done
- [ ] All routes return tenant-scoped data only
- [ ] Teacher/student creation is atomic (user + profile in same transaction)
- [ ] Website settings saved and published correctly
- [ ] Batch student management works
- [ ] Tests pass

---

---

# SPRINT 06 — Course & Content APIs

## Branch
```
git checkout dev
git checkout -b feature/sprint-06-courses
```

## Goal
Full CRUD for programs, courses, course structure (modules → chapters → lessons), study materials, and teacher course assignment.

## Database Tables Used
- `programs`, `program_courses`
- `courses`, `course_teachers`
- `course_modules`, `course_chapters`, `course_lessons`
- `study_materials`

## API Endpoints to Build

### Programs (Owner)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/programs` | List programs |
| POST | `/owner/programs` | Create program |
| GET | `/owner/programs/{id}` | Detail |
| PUT | `/owner/programs/{id}` | Update |
| DELETE | `/owner/programs/{id}` | Soft-delete |
| POST | `/owner/programs/{id}/courses` | Add course to program |
| DELETE | `/owner/programs/{id}/courses/{courseId}` | Remove course from program |

### Courses (Owner + Teacher)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/courses` | Owner: list all courses |
| POST | `/owner/courses` | Owner: create course |
| GET | `/owner/courses/{id}` | Detail |
| PUT | `/owner/courses/{id}` | Update |
| DELETE | `/owner/courses/{id}` | Soft-delete |
| POST | `/owner/courses/{id}/publish` | Publish course |
| POST | `/owner/courses/{id}/archive` | Archive |
| GET | `/owner/courses/{id}/teachers` | List assigned teachers |
| POST | `/owner/courses/{id}/teachers` | Assign teacher |
| DELETE | `/owner/courses/{id}/teachers/{teacherId}` | Remove teacher |
| GET | `/teacher/courses` | Teacher: list MY courses |
| GET | `/teacher/courses/{id}` | Teacher: course detail |

### Course Structure (Owner + Teacher)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/courses/{id}/modules` | List modules |
| POST | `/courses/{id}/modules` | Create module |
| PUT | `/courses/{id}/modules/{moduleId}` | Update module |
| DELETE | `/courses/{id}/modules/{moduleId}` | Delete |
| POST | `/courses/{id}/modules/reorder` | Reorder modules |
| GET | `/modules/{id}/chapters` | List chapters |
| POST | `/modules/{id}/chapters` | Create chapter |
| PUT | `/modules/{id}/chapters/{chapterId}` | Update |
| DELETE | `/modules/{id}/chapters/{chapterId}` | Delete |
| GET | `/chapters/{id}/lessons` | List lessons |
| POST | `/chapters/{id}/lessons` | Create lesson |
| PUT | `/chapters/{id}/lessons/{lessonId}` | Update |
| DELETE | `/chapters/{id}/lessons/{lessonId}` | Delete |

### Study Materials
| Method | Path | Description |
|--------|------|-------------|
| GET | `/courses/{id}/materials` | List materials |
| POST | `/courses/{id}/materials` | Upload/create material |
| PUT | `/courses/{id}/materials/{matId}` | Update |
| DELETE | `/courses/{id}/materials/{matId}` | Delete |
| POST | `/courses/{id}/materials/{matId}/publish` | Publish |

### Public Catalog (No auth)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/public/{tenantSlug}/courses` | Public course listing |
| GET | `/public/{tenantSlug}/courses/{slug}` | Course detail (published only) |
| GET | `/public/{tenantSlug}/programs` | Programs listing |
| GET | `/public/{tenantSlug}/programs/{slug}` | Program detail |

## File Upload Strategy
In this sprint, file URLs are plain string fields (no actual file upload server).
Accept `file_url` as a string from frontend. Real S3/Cloudflare upload comes later.

## Tests
```
tests/test_courses/
    test_programs.py
    test_courses.py
    test_course_structure.py
    test_materials.py
    test_public_catalog.py
```
Minimum **20 test cases**.

## Definition of Done
- [ ] Course structure (module → chapter → lesson) is fully orderable
- [ ] Published courses appear on public catalog
- [ ] Draft courses NOT visible on public catalog
- [ ] Teacher can only see courses assigned to them
- [ ] Reorder endpoint works
- [ ] Tests pass

---

---

# SPRINT 07 — Enrollment, LMS & Assessment APIs

## Branch
```
git checkout dev
git checkout -b feature/sprint-07-lms-assessments
```

## Goal
Student enrollments, lesson progress tracking, live classes, announcements, question bank, quizzes, exams, assignments, marks, attendance.

## Database Tables Used
- `enrollments`, `lesson_progress`
- `live_classes`, `announcements`, `study_materials`
- `question_bank`, `question_bank_options`
- `assignments`, `assignment_submissions`
- `quizzes`, `quiz_questions`, `quiz_question_options`, `quiz_attempts`, `quiz_answers`
- `exams`, `exam_questions`, `exam_question_options`, `exam_attempts`, `exam_answers`
- `marks`
- `attendance_records`

## API Endpoints

### Enrollments (Owner)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/enrollments` | List all enrollments |
| POST | `/owner/enrollments` | Enroll student in course |
| GET | `/owner/enrollments/{id}` | Detail |
| PATCH | `/owner/enrollments/{id}/cancel` | Cancel enrollment |
| PATCH | `/owner/enrollments/{id}/complete` | Mark complete |

### Lesson Progress (Student)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/student/enrollments` | My enrollments |
| GET | `/student/enrollments/{id}/progress` | Course progress detail |
| POST | `/student/lessons/{id}/start` | Mark lesson started |
| POST | `/student/lessons/{id}/complete` | Mark lesson completed |
| PUT | `/student/lessons/{id}/progress` | Update progress % |

### Live Classes
| Method | Path | Description |
|--------|------|-------------|
| GET | `/teacher/live-classes` | Teacher: my live classes |
| POST | `/teacher/live-classes` | Create live class |
| PUT | `/teacher/live-classes/{id}` | Update |
| DELETE | `/teacher/live-classes/{id}` | Delete |
| PATCH | `/teacher/live-classes/{id}/start` | Mark live |
| PATCH | `/teacher/live-classes/{id}/complete` | Mark completed, add recording URL |
| GET | `/student/live-classes` | Student: upcoming classes for my courses |

### Announcements
| Method | Path | Description |
|--------|------|-------------|
| POST | `/teacher/announcements` | Post announcement |
| GET | `/teacher/announcements` | My announcements |
| DELETE | `/teacher/announcements/{id}` | Delete |
| GET | `/student/announcements` | Student: see announcements for my courses |

### Question Bank (Teacher + Owner)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/question-bank` | List questions |
| POST | `/owner/question-bank` | Add question with options |
| PUT | `/owner/question-bank/{id}` | Update |
| DELETE | `/owner/question-bank/{id}` | Soft-delete |
| GET | `/teacher/question-bank` | Teacher: view question bank |

### Assignments
| Method | Path | Description |
|--------|------|-------------|
| GET | `/teacher/assignments` | My assignments |
| POST | `/teacher/assignments` | Create assignment |
| PUT | `/teacher/assignments/{id}` | Update |
| DELETE | `/teacher/assignments/{id}` | Delete |
| POST | `/teacher/assignments/{id}/publish` | Publish to students |
| GET | `/teacher/assignments/{id}/submissions` | See all submissions |
| POST | `/teacher/submissions/{id}/grade` | Grade submission (score + feedback) |
| GET | `/student/assignments` | Student: my assignments |
| POST | `/student/assignments/{id}/submit` | Submit assignment |
| GET | `/student/assignments/{id}/submission` | My submission detail |

### Quizzes
| Method | Path | Description |
|--------|------|-------------|
| POST | `/teacher/quizzes` | Create quiz with questions |
| GET | `/teacher/quizzes` | My quizzes |
| PUT | `/teacher/quizzes/{id}` | Update quiz |
| GET | `/teacher/quizzes/{id}/attempts` | See all student attempts |
| GET | `/student/quizzes` | My available quizzes |
| POST | `/student/quizzes/{id}/attempt` | Start attempt |
| POST | `/student/attempts/{id}/answer` | Submit answer for question |
| POST | `/student/attempts/{id}/submit` | Submit entire attempt |
| GET | `/student/attempts/{id}/result` | See result |

### Exams
| Method | Path | Description |
|--------|------|-------------|
| POST | `/owner/exams` | Schedule exam |
| GET | `/owner/exams` | List exams |
| PUT | `/owner/exams/{id}` | Update |
| GET | `/teacher/exams` | Teacher: my exams |
| POST | `/teacher/exams/{id}/grade/{attemptId}` | Grade exam attempt |
| GET | `/student/exams` | Student: my scheduled exams |
| POST | `/student/exams/{id}/attempt` | Start attempt |
| POST | `/student/attempts/exam/{id}/submit` | Submit |

### Marks
| Method | Path | Description |
|--------|------|-------------|
| GET | `/teacher/marks` | Marks for my courses |
| POST | `/teacher/marks` | Add manual mark entry |
| GET | `/student/marks` | Student: my marks |
| GET | `/owner/marks` | Owner: all marks |

### Attendance
| Method | Path | Description |
|--------|------|-------------|
| POST | `/teacher/attendance` | Mark attendance for a session |
| GET | `/teacher/attendance` | View attendance records |
| PUT | `/teacher/attendance/{id}` | Correct a record |
| GET | `/student/attendance` | Student: my attendance summary |
| GET | `/owner/attendance` | Owner: all attendance |

## Important Rules
1. Quiz auto-grading: When student submits attempt, auto-grade MCQ questions. Short text requires manual grade.
2. Max attempts enforcement: Reject attempt if `attempt_number > quiz.max_attempts`
3. Time limit: If `duration_minutes` set, reject submission after time expired
4. Assignment late: If `submitted_at > due_at`, set status = `late`

## Tests
```
tests/test_lms/
    test_enrollments.py
    test_lesson_progress.py
    test_live_classes.py
    test_assignments.py
    test_quizzes.py         ← include auto-grading, max attempts
    test_exams.py
    test_marks.py
    test_attendance.py
```
Minimum **35 test cases**.

## Definition of Done
- [ ] Enrollment creates lesson_progress rows for all lessons in course
- [ ] Progress % auto-calculated when lessons completed
- [ ] Quiz auto-graded on submit
- [ ] Attendance unique constraint enforced (no double-marking)
- [ ] All student endpoints return only that student's data
- [ ] Tests pass

---

---

# SPRINT 08 — Finance, CMS & Notifications APIs

## Branch
```
git checkout dev
git checkout -b feature/sprint-08-finance-cms
```

## Goal
Fee management, payment recording, certificates, coupon system, full CMS (blog, gallery, FAQ, testimonials, contact), and notification broadcasting.

## Database Tables Used
- `fee_structures`, `fee_invoices`
- `payments`, `coupons`, `coupon_redemptions`
- `certificates`
- `blog_posts`, `gallery_items`, `faqs`, `testimonials`, `contact_messages`
- `notifications`, `notification_recipients`
- `wishlist_items`

## API Endpoints

### Fee Management (Owner)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/fee-structures` | List fee structures |
| POST | `/owner/fee-structures` | Create fee structure |
| PUT | `/owner/fee-structures/{id}` | Update |
| DELETE | `/owner/fee-structures/{id}` | Soft-delete |
| POST | `/owner/fee-structures/{id}/generate-invoices` | Generate invoices for all enrolled students |
| GET | `/owner/fee-invoices` | List all invoices (filter by status, student, date) |
| GET | `/owner/fee-invoices/{id}` | Invoice detail |
| POST | `/owner/fee-invoices/{id}/waive` | Waive invoice |
| GET | `/student/fee-invoices` | Student: my invoices |

### Payments
| Method | Path | Description |
|--------|------|-------------|
| POST | `/owner/payments` | Record payment (manual, offline) |
| GET | `/owner/payments` | List payments |
| GET | `/owner/payments/{id}` | Detail |
| GET | `/owner/finance/summary` | Revenue summary (total collected, pending) |
| GET | `/student/payments` | Student: my payment history |

### Coupons (Owner)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/coupons` | List coupons |
| POST | `/owner/coupons` | Create coupon |
| PUT | `/owner/coupons/{id}` | Update |
| DELETE | `/owner/coupons/{id}` | Soft-delete |
| POST | `/public/{tenantSlug}/coupons/validate` | Validate coupon code (public, at checkout) |

### Certificates (Owner)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/owner/certificates/issue` | Issue certificate to student |
| GET | `/owner/certificates` | List all certificates |
| PATCH | `/owner/certificates/{id}/revoke` | Revoke |
| GET | `/student/certificates` | Student: my certificates |
| GET | `/public/certificates/{number}` | Verify certificate number (public) |

### Wishlist (Student)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/student/wishlist` | My wishlist |
| POST | `/student/wishlist` | Add course |
| DELETE | `/student/wishlist/{courseId}` | Remove |

### CMS — Blog (Owner)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/owner/blog` | List all posts |
| POST | `/owner/blog` | Create post |
| PUT | `/owner/blog/{id}` | Update |
| POST | `/owner/blog/{id}/publish` | Publish |
| DELETE | `/owner/blog/{id}` | Soft-delete |
| GET | `/public/{tenantSlug}/blog` | Public: published posts |
| GET | `/public/{tenantSlug}/blog/{slug}` | Public: post detail |

### CMS — Gallery, FAQ, Testimonials (Owner)
| Method | Path | Description |
|--------|------|-------------|
| GET/POST/PUT/DELETE | `/owner/gallery` | Gallery CRUD |
| GET/POST/PUT/DELETE | `/owner/faqs` | FAQ CRUD |
| GET/POST/PUT/DELETE | `/owner/testimonials` | Testimonials CRUD |
| GET | `/public/{tenantSlug}/gallery` | Public gallery |
| GET | `/public/{tenantSlug}/faqs` | Public FAQs |
| GET | `/public/{tenantSlug}/testimonials` | Public testimonials |

### Contact Messages
| Method | Path | Description |
|--------|------|-------------|
| POST | `/public/{tenantSlug}/contact` | Submit contact form (public) |
| GET | `/owner/contact-messages` | Owner: list messages |
| PATCH | `/owner/contact-messages/{id}/reply` | Reply to message |
| PATCH | `/owner/contact-messages/{id}/archive` | Archive |

### Notifications (Owner)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/owner/notifications` | Create & send notification |
| GET | `/owner/notifications` | List notifications |
| GET | `/student/notifications` | Student: my notifications |
| POST | `/student/notifications/{id}/read` | Mark as read |
| POST | `/student/notifications/read-all` | Mark all read |
| GET | `/teacher/notifications` | Teacher: my notifications |

## Finance Summary Format
```json
{
  "total_revenue": 125000.00,
  "collected_this_month": 24500.00,
  "pending_invoices": 12,
  "overdue_invoices": 3,
  "pending_amount": 18000.00,
  "overdue_amount": 6000.00
}
```

## Tests
```
tests/test_finance/
    test_fee_structures.py
    test_invoices.py
    test_payments.py
    test_coupons.py
    test_certificates.py

tests/test_cms/
    test_blog.py
    test_gallery.py
    test_faqs.py
    test_contact.py

tests/test_notifications.py
```
Minimum **30 test cases**.

## Definition of Done
- [ ] Fee invoices generated from fee structures
- [ ] Payment records update invoice status
- [ ] Certificate number unique per tenant
- [ ] Public certificate verification works
- [ ] Contact form saves to DB without auth
- [ ] Notifications delivered to correct audience
- [ ] Tests pass

---

---

## Coding Standards (for ALL Sprints)

### 1. Project Structure
```
backend/app/
├── api/
│   └── v1/
│       ├── router.py          ← includes all sub-routers
│       ├── auth.py
│       ├── owner/             ← owner endpoints
│       ├── teacher/           ← teacher endpoints
│       ├── student/           ← student endpoints
│       ├── platform/          ← master admin endpoints
│       └── public.py          ← public unauthenticated endpoints
├── models/                    ← SQLAlchemy models (already built Sprint 02)
├── schemas/                   ← Pydantic request/response models
├── services/                  ← Business logic layer
├── repositories/              ← Database query layer
├── core/
│   ├── config.py              ← Settings from .env
│   ├── database.py            ← SQLAlchemy engine/session
│   ├── security.py            ← JWT helpers
│   └── dependencies.py        ← FastAPI dependencies (get_db, get_current_user)
└── utils/
    ├── email.py
    ├── pagination.py
    └── slug.py
```

### 2. Response Shape (ALWAYS use this)
```python
# backend/app/schemas/base.py
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    errors: Optional[List[dict]] = None
```

### 3. Tenant Isolation Pattern
```python
# In every service method
def get_courses(db: Session, tenant_id: str, ...):
    return db.query(Course).filter(
        Course.tenant_id == tenant_id,
        Course.deleted_at == None
    ).all()
```
**NEVER** query without `tenant_id` filter (except master admin routes).

### 4. Soft Delete Pattern
```python
# Never do:  db.delete(record)
# Always do:
record.deleted_at = datetime.utcnow()
db.commit()
```

### 5. Naming Conventions
- Route functions: `list_courses`, `create_course`, `get_course`, `update_course`, `delete_course`
- Service methods: same names as route functions
- Repository methods: `find_all`, `find_by_id`, `create`, `update`, `delete`
- Schema names: `CourseCreate`, `CourseUpdate`, `CourseResponse`, `CourseListResponse`

### 6. Error Handling
```python
from fastapi import HTTPException, status

raise HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail={"success": False, "message": "Course not found", "errors": []}
)
```

### 7. Git Workflow
```
1. Always branch from dev: git checkout dev && git pull && git checkout -b feature/sprint-XX-name
2. Commit often with meaningful messages: "feat: add course list endpoint with pagination"
3. Open PR to dev when done
4. PR must have: description, what was tested, any env vars added
5. Never commit .env file
```

---

## Environment Variables per Sprint

### Sprint 03 adds:
```
JWT_SECRET_KEY=your_64_char_random_string
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@praksha.academy
SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=noreply@praksha.academy
```

### Sprint 06 adds:
```
UPLOAD_BASE_URL=https://cdn.praksha.academy   (placeholder)
MAX_UPLOAD_SIZE_MB=10
```

---

## Team Assignment Suggestions

| Sprint | Recommended Team Size | Skills Needed |
|--------|-----------------------|---------------|
| Sprint 03 (Auth) | 1–2 developers | JWT, security, SMTP |
| Sprint 04 (Platform) | 1 developer | CRUD, pagination |
| Sprint 05 (Tenant Setup) | 1–2 developers | User management, transactions |
| Sprint 06 (Courses) | 1–2 developers | Nested CRUD, public APIs |
| Sprint 07 (LMS) | 2 developers | Complex business logic, quizzes |
| Sprint 08 (Finance/CMS) | 1–2 developers | Reports, notifications |

---

## Running Tests
```bash
# Activate virtual environment
cd backend
.\.venv\Scripts\activate   # Windows
source .venv/bin/activate  # Mac/Linux

# Run all tests
pytest -v

# Run specific sprint tests
pytest tests/test_auth/ -v
pytest tests/test_courses/ -v

# Run with coverage report
pytest --cov=app tests/ --cov-report=html
```

---

## Quick Start for a New Developer

```bash
# 1. Clone repo
git clone https://github.com/rohitprabhatech/Praksha-Academy-Product.git
cd Praksha-Academy-Product/backend

# 2. Python 3.11 required
python --version  # must be 3.11.x

# 3. Create virtual environment
python -m venv .venv
.\.venv\Scripts\activate   # Windows
source .venv/bin/activate  # Mac/Linux

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env from example
cp .env.example .env
# Edit .env with your MySQL credentials

# 6. Run migrations
alembic upgrade head

# 7. Start server
uvicorn app.main:app --reload

# 8. Test API
# Open http://localhost:8000/docs
```

---

*Document maintained by Prabha Technology. Update this file whenever sprint scope changes.*
