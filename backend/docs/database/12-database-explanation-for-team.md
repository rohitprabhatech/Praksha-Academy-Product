# Praksha Academy SaaS — Database Explanation for the Team

This document explains **every table** in the Praksha Academy database in plain language. Read it once and you should understand what the database stores, why each piece exists, and how tables connect.

**Source of truth:** `database/schema.sql`  
**Total tables:** 54 (12 platform-level, 42 tenant-level)

---

## How to read this document

- **Platform-level tables** belong to Prabha Technology (the SaaS operator). They manage customers (tenants), billing, and global settings.
- **Tenant-level tables** belong to each academy (school/coaching center). Every row in these tables has a `tenant_id` so data stays isolated between academies.
- Almost every table uses a **UUID** (`CHAR(36)`) as its primary key — safe for distributed systems and hard to guess.
- **`deleted_at`** means soft delete: the row still exists but is treated as removed.
- **`tenant_id`** on tenant tables is mandatory for queries — never forget it in application code.

---

## Big picture

```
Prabha Technology (Platform)
    └── tenants (each academy customer)
            ├── subscription & billing
            ├── users, roles, permissions
            └── academy data (courses, students, exams, payments, CMS, etc.)
```

One **tenant** = one academy using the product. Students, teachers, courses, and payments all live under that tenant.

---

# Part 1 — Platform-Level Tables

These tables run the SaaS business itself, not day-to-day teaching inside an academy.

---

## tenants

**Why it exists:** This is the heart of multi-tenancy. Each row is one academy customer (e.g. "ABC Coaching Center") that signed up for Praksha Academy.

| Column | Why it exists |
|--------|---------------|
| `id` | Unique identifier for the tenant. Referenced everywhere else as `tenant_id`. |
| `tenant_code` | Short human-readable code (e.g. `ABC001`) for support, invoices, and URLs. Must be unique globally. |
| `name` | Official business name shown in admin panels and reports. |
| `slug` | URL-friendly name (e.g. `abc-coaching`) used for subdomain or path routing (`abc-coaching.praksha.com`). |
| `status` | Lifecycle: `pending` (signup), `trial`, `active`, `suspended`, `cancelled`, `archived`. Controls whether the academy can use the system. |
| `contact_email` | Primary contact for billing and admin communication. |
| `contact_phone` | Optional phone for support. |
| `timezone` | Default timezone for scheduling (live classes, exams). Defaults to `Asia/Kolkata`. |
| `trial_ends_at` | When the free trial expires, if applicable. |
| `activated_at` | When the tenant first became fully active (after trial or payment). |
| `suspended_at` | When access was suspended (e.g. non-payment). |
| `created_at` / `updated_at` | Audit timestamps. |
| `deleted_at` | Soft delete — tenant is archived, not physically removed. |

### Relationships

- **Parent of almost everything:** `tenant_subscriptions`, `users`, `tenant_profiles`, and all 42 tenant-level tables reference `tenants.id`.
- **Referenced by:** `platform_audit_logs.tenant_id` when platform admins act on a specific tenant.

---

## subscription_plans

**Why it exists:** Defines the SaaS pricing tiers Prabha Technology sells (e.g. Starter, Pro, Enterprise). Each plan sets price limits and feature caps.

| Column | Why it exists |
|--------|---------------|
| `id` | Unique plan identifier. |
| `code` | Machine-readable code like `starter_monthly`. Used in code and APIs. |
| `name` | Display name shown on pricing pages ("Professional Plan"). |
| `description` | Marketing text explaining what's included. |
| `monthly_price` | Cost per month in the plan's currency. |
| `annual_price` | Optional yearly price (often discounted). |
| `currency` | ISO currency code, default `INR`. |
| `trial_days` | How many free trial days this plan offers. |
| `max_students` | Cap on student count (NULL = unlimited). |
| `max_teachers` | Cap on teachers (NULL = unlimited). |
| `max_courses` | Cap on courses (NULL = unlimited). |
| `features_json` | Flexible JSON list of enabled features (e.g. live classes, certificates). |
| `status` | `active`, `inactive`, or `archived` — controls if new signups can pick this plan. |
| `sort_order` | Display order on pricing page. |
| `created_at` / `updated_at` / `deleted_at` | Standard audit and soft delete. |

### Relationships

- **Referenced by:** `tenant_subscriptions.plan_id` — each tenant subscription points to one plan.

---

## tenant_subscriptions

**Why it exists:** Links a tenant to their current (or past) subscription plan. Tracks billing cycle, trial, renewal, and cancellation.

| Column | Why it exists |
|--------|---------------|
| `id` | Unique subscription record. A tenant can have multiple rows over time (history). |
| `tenant_id` | Which academy this subscription belongs to. |
| `plan_id` | Which plan they are on. |
| `status` | `trial`, `active`, `past_due`, `cancelled`, `expired` — drives access control. |
| `billing_cycle` | `monthly`, `annual`, or `custom`. |
| `starts_at` | When this subscription period began. |
| `ends_at` | When it expires (NULL if ongoing). |
| `trial_ends_at` | Trial end for this specific subscription instance. |
| `cancelled_at` | When the tenant cancelled. |
| `auto_renew` | Whether to renew automatically (1 = yes). |
| `notes` | Internal notes (e.g. special deal, manual extension). |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants` (via `tenant_id`), `subscription_plans` (via `plan_id`).
- **Used for:** Enforcing plan limits (`max_students`, etc.) in application logic.

---

## platform_settings

**Why it exists:** Stores global configuration for the entire SaaS platform — things that apply to all tenants, not one academy.

| Column | Why it exists |
|--------|---------------|
| `id` | Row identifier. |
| `setting_key` | Unique name like `maintenance_mode` or `default_trial_days`. |
| `setting_value` | JSON value — flexible for strings, numbers, booleans, or objects. |
| `description` | Human explanation for admins editing settings. |
| `created_at` / `updated_at` | When the setting was created or last changed. |

### Relationships

- **Standalone table** — no foreign keys. Read by platform admin APIs and background jobs.

---

## roles

**Why it exists:** Defines named job functions in the system (e.g. Platform Admin, Tenant Owner, Teacher, Student). Roles group permissions together.

| Column | Why it exists |
|--------|---------------|
| `id` | Unique role identifier. |
| `scope` | `platform` (Prabha staff) or `tenant` (academy staff/students). Same role code can exist in both scopes separately. |
| `code` | Machine name like `tenant_owner`, `teacher`, `student`. |
| `name` | Display label ("Academy Owner"). |
| `description` | What this role is allowed to do in plain language. |
| `is_system` | Built-in roles (1) cannot be deleted by tenants; custom roles (0) can. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Linked to permissions via:** `role_permissions`.
- **Assigned to users via:** `user_roles`.

---

## permissions

**Why it exists:** Granular actions a user can perform (e.g. `courses.create`, `students.view`). The app checks permissions, not role names, for fine control.

| Column | Why it exists |
|--------|---------------|
| `id` | Unique permission identifier. |
| `scope` | `platform` or `tenant` — matches role scope. |
| `code` | Unique action code like `assignments.grade`. |
| `name` | Human-readable label. |
| `module` | Groups permissions (courses, exams, payments) for UI and docs. |
| `description` | Explains when this permission applies. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Linked to roles via:** `role_permissions`.

---

## role_permissions

**Why it exists:** Junction table — "which permissions does each role have?" Many-to-many between roles and permissions.

| Column | Why it exists |
|--------|---------------|
| `role_id` | The role receiving the permission. |
| `permission_id` | The permission being granted. |
| `created_at` | When this grant was added. |

### Relationships

- **Connects:** `roles` ↔ `permissions`.
- **Composite primary key:** `(role_id, permission_id)` — each pair appears once.

---

## users

**Why it exists:** Every person who can log in — platform admins, academy owners, teachers, and students. One table for all; role and profile tables distinguish them.

| Column | Why it exists |
|--------|---------------|
| `id` | Unique user identifier. |
| `tenant_id` | NULL for platform admins; set for academy users. Same email can exist in different tenants. |
| `email` | Login username. Unique per tenant (or globally when `tenant_id` is NULL). |
| `password_hash` | Hashed password — never store plain text. |
| `first_name` / `last_name` | Display name parts. |
| `phone` | Optional contact number. |
| `avatar_url` | Profile picture URL. |
| `status` | `pending`, `active`, `inactive`, `suspended` — controls login ability. |
| `email_verified_at` | When email was confirmed (NULL = not verified). |
| `last_login_at` | Last successful login for security and analytics. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` / `updated_by` | Which user created or last updated this account. |

### Relationships

- **Belongs to:** `tenants` (optional, via `tenant_id`).
- **Has roles via:** `user_roles`.
- **Has profiles via:** `teacher_profiles`, `student_profiles` (when applicable).
- **Security tables:** `password_reset_tokens`, `email_verifications`.
- **Audit:** `platform_audit_logs.actor_user_id`, `tenant_audit_logs.actor_user_id`.

---

## user_roles

**Why it exists:** Assigns one or more roles to a user. A teacher might also be a tenant admin; this table supports multiple roles per user.

| Column | Why it exists |
|--------|---------------|
| `id` | Unique assignment row. |
| `user_id` | The user receiving the role. |
| `role_id` | The role being assigned. |
| `tenant_id` | Context: for tenant-scoped roles, which academy. NULL for platform roles. |
| `assigned_at` | When the role was granted. |
| `assigned_by` | Admin who made the assignment. |

### Relationships

- **Connects:** `users` ↔ `roles` ↔ `tenants` (optional context).
- **Unique constraint:** Same user cannot get the same role twice in the same tenant.

---

## password_reset_tokens

**Why it exists:** Secure "forgot password" flow. Stores hashed tokens with expiry so users can reset passwords without exposing real tokens in the database.

| Column | Why it exists |
|--------|---------------|
| `id` | Token record identifier. |
| `user_id` | Who requested the reset. |
| `token_hash` | Hashed token from the email link — compare on submit, never store raw token. |
| `expires_at` | Token becomes invalid after this time. |
| `used_at` | When the token was consumed (NULL = still valid if not expired). |
| `created_at` | When the reset was requested. |

### Relationships

- **Belongs to:** `users` — deleted when user is deleted.

---

## email_verifications

**Why it exists:** OTP or verification codes for registration, email change, or login verification. Same pattern as password reset but for proving email ownership.

| Column | Why it exists |
|--------|---------------|
| `id` | Verification record identifier. |
| `user_id` | User being verified. |
| `otp_hash` | Hashed OTP — never store plain OTP. |
| `purpose` | `registration`, `email_change`, or `login` — different flows, same table. |
| `expires_at` | OTP validity window. |
| `verified_at` | When successfully verified (NULL = pending). |
| `created_at` | When OTP was sent. |

### Relationships

- **Belongs to:** `users`.

---

## platform_audit_logs

**Why it exists:** Immutable log of important actions by platform staff — tenant suspension, plan changes, impersonation, etc. Required for compliance and debugging.

| Column | Why it exists |
|--------|---------------|
| `id` | Log entry identifier. |
| `actor_user_id` | Platform user who performed the action (NULL if system). |
| `action` | What happened, e.g. `tenant.suspended`, `plan.updated`. |
| `entity_type` | Type of object affected (`tenant`, `subscription_plan`, etc.). |
| `entity_id` | ID of the affected record. |
| `tenant_id` | If the action targeted a specific tenant. |
| `metadata_json` | Extra details (old/new values, reason). |
| `ip_address` / `user_agent` | Client info for security investigations. |
| `created_at` | When the action occurred. |

### Relationships

- **Optional links to:** `users` (actor), `tenants` (target tenant).
- **Append-only in practice** — rows are never updated.

---

# Part 2 — Tenant-Level Tables

Everything below belongs to one academy. **Always filter by `tenant_id`.**

---

## tenant_profiles

**Why it exists:** Public and operational details for an academy — branding, address, contact info. Separated from `tenants` so core tenant record stays lean and profile can be rich.

| Column | Why it exists |
|--------|---------------|
| `id` | Profile row identifier. |
| `tenant_id` | One profile per tenant (unique). |
| `display_name` | Name shown on the academy's public website. |
| `tagline` | Short slogan under the logo. |
| `logo_url` | Academy logo for header, certificates, emails. |
| `contact_email` / `contact_phone` | Public-facing contact (may differ from billing contact on `tenants`). |
| `address_line1` / `address_line2` / `city` / `state` / `country` / `postal_code` | Physical address for footer, invoices, certificates. |
| `website_url` | External website if any. |
| `academic_year` | Current year label e.g. `2025-26`. |
| `default_language` | Primary language for content. |
| `settings_json` | Tenant-specific toggles (theme colors, feature flags) without schema changes. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **One-to-one with:** `tenants` (via `tenant_id`).

---

## teacher_profiles

**Why it exists:** Extends a `users` row with teacher-specific data — employee ID, qualifications, bio. Not every user has a teacher profile; only those who teach.

| Column | Why it exists |
|--------|---------------|
| `id` | Teacher profile identifier (used in course assignments, live classes). |
| `tenant_id` | Which academy employs this teacher. |
| `user_id` | Links to login account in `users`. |
| `employee_code` | Internal staff ID (unique per tenant). |
| `qualification` | Degrees/certifications. |
| `experience_years` | Years of teaching experience. |
| `specialization` | Subject area expertise. |
| `bio` | Public biography for course pages. |
| `joined_at` | Date teacher joined the academy. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |

### Relationships

- **Belongs to:** `tenants`, `users`.
- **Referenced by:** `course_teachers`, `live_classes`, `assignments`, `quizzes`.

---

## student_profiles

**Why it exists:** Extends a `users` row with student-specific data — enrollment number, guardian info, demographics. Separates login identity from student record.

| Column | Why it exists |
|--------|---------------|
| `id` | Student profile identifier (used in enrollments, payments, marks). |
| `tenant_id` | Which academy the student belongs to. |
| `user_id` | Links to login account. |
| `enrollment_number` | Official roll/admission number (unique per tenant). |
| `date_of_birth` | For age verification, reports. |
| `gender` | Optional demographic field. |
| `guardian_name` / `guardian_phone` | Parent/guardian contact for minors. |
| `address_line1` / `city` | Student address. |
| `joined_at` | When student joined the academy. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |

### Relationships

- **Belongs to:** `tenants`, `users`.
- **Referenced by:** `enrollments`, `payments`, `assignment_submissions`, `quiz_attempts`, `exam_attempts`, `marks`, `attendance_records`, `wishlist_items`, `certificates`, `coupon_redemptions`.

---

## academic_classes

**Why it exists:** Grade or class levels in the academy hierarchy (e.g. "Class 10", "JEE Batch Year 1"). Groups students and batches structurally.

| Column | Why it exists |
|--------|---------------|
| `id` | Class identifier. |
| `tenant_id` | Owning academy. |
| `name` | Display name ("Class 12 Science"). |
| `code` | Short code for reports (`C12-SCI`). |
| `description` | Optional details. |
| `sort_order` | Order in dropdowns and lists. |
| `status` | `active` or `inactive`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` / `updated_by` | Who managed this record. |

### Relationships

- **Belongs to:** `tenants`.
- **Referenced by:** `batches`, `courses` (optional link).

---

## subjects

**Why it exists:** Academic subjects offered by the tenant (Mathematics, Physics, English). Used to categorize courses.

| Column | Why it exists |
|--------|---------------|
| `id` | Subject identifier. |
| `tenant_id` | Owning academy. |
| `name` | Subject name. |
| `code` | Short code (`MATH`, `PHY`). |
| `description` | Optional notes. |
| `status` | `active` or `inactive`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` / `updated_by` | Who managed this record. |

### Relationships

- **Belongs to:** `tenants`.
- **Referenced by:** `courses.subject_id`.

---

## batches

**Why it exists:** A running group of students within a class — e.g. "Class 10 — Morning Batch 2025". Links class, optional course, and time period together.

| Column | Why it exists |
|--------|---------------|
| `id` | Batch identifier. |
| `tenant_id` | Owning academy. |
| `academic_class_id` | Which class level this batch belongs to. |
| `course_id` | Optional link to a specific course curriculum. |
| `name` | Batch name ("Morning Batch A"). |
| `code` | Internal batch code. |
| `start_date` / `end_date` | Batch duration. |
| `status` | `active`, `inactive`, or `completed`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` / `updated_by` | Who created or updated. |

### Relationships

- **Belongs to:** `tenants`, `academic_classes`, optionally `courses`.
- **Referenced by:** `enrollments`, `study_materials`, `live_classes`, `assignments`, `quizzes`, `exams`, `attendance_records`.

---

## courses

**Why it exists:** The main sellable/ teachable product — a structured program with modules, lessons, price, and teachers. Central entity in the LMS.

| Column | Why it exists |
|--------|---------------|
| `id` | Course identifier. |
| `tenant_id` | Owning academy. |
| `academic_class_id` | Optional link to class level. |
| `subject_id` | Optional link to subject. |
| `name` | Course title. |
| `slug` | URL-friendly unique name per tenant. |
| `category` | Grouping for catalog (Competitive, Foundation, etc.). |
| `description` | Full course description for marketing and detail pages. |
| `thumbnail_url` | Cover image for course cards. |
| `price` | List price. |
| `discount_price` | Sale price if on offer. |
| `duration_label` | Human text like "6 months" or "120 hours". |
| `language` | Instruction language. |
| `course_type` | Custom type label (recorded, hybrid, live). |
| `status` | `draft`, `published`, or `archived` — controls visibility. |
| `is_featured` | Show on homepage when true. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` / `updated_by` | Author tracking. |

### Relationships

- **Belongs to:** `tenants`, optionally `academic_classes`, `subjects`.
- **Referenced by:** `batches`, `course_teachers`, `course_modules`, `enrollments`, `study_materials`, `live_classes`, `assignments`, `quizzes`, `exams`, `marks`, `payments`, `wishlist_items`, `certificates`, `attendance_records`.

---

## course_teachers

**Why it exists:** Many-to-many: which teachers teach which courses. A course can have multiple teachers; one can be marked primary.

| Column | Why it exists |
|--------|---------------|
| `id` | Assignment row identifier. |
| `tenant_id` | Owning academy. |
| `course_id` | The course. |
| `teacher_id` | The teacher (`teacher_profiles.id`, not `users.id`). |
| `is_primary` | Main instructor flag for display. |
| `assigned_at` | When assignment was made. |
| `assigned_by` | Admin who assigned. |

### Relationships

- **Connects:** `courses` ↔ `teacher_profiles`.
- **Unique per tenant:** Same teacher cannot be assigned twice to the same course.

---

## course_modules

**Why it exists:** Top level of course content structure. A course is divided into modules (units), each containing chapters.

| Column | Why it exists |
|--------|---------------|
| `id` | Module identifier. |
| `tenant_id` | Owning academy. |
| `course_id` | Parent course. |
| `title` | Module name ("Introduction to Algebra"). |
| `description` | Module overview. |
| `sort_order` | Order within the course. |
| `status` | `active` or `inactive`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |

### Relationships

- **Belongs to:** `tenants`, `courses`.
- **Parent of:** `course_chapters`.

---

## course_chapters

**Why it exists:** Second level of content hierarchy — chapters inside a module. Groups related lessons.

| Column | Why it exists |
|--------|---------------|
| `id` | Chapter identifier. |
| `tenant_id` | Owning academy. |
| `module_id` | Parent module. |
| `title` | Chapter name. |
| `description` | Chapter summary. |
| `sort_order` | Order within module. |
| `status` | `active` or `inactive`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |

### Relationships

- **Belongs to:** `tenants`, `course_modules`.
- **Parent of:** `course_lessons`.

---

## course_lessons

**Why it exists:** Smallest teachable unit — a single video, document, text page, or link. Students progress lesson by lesson.

| Column | Why it exists |
|--------|---------------|
| `id` | Lesson identifier. |
| `tenant_id` | Owning academy. |
| `chapter_id` | Parent chapter. |
| `title` | Lesson title. |
| `lesson_type` | `video`, `document`, `text`, `link`, or `mixed` — drives UI player. |
| `content` | Text/HTML body for text lessons. |
| `video_url` | External or hosted video link. |
| `duration_minutes` | Expected watch/read time. |
| `sort_order` | Order within chapter. |
| `status` | `active` or `inactive`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |

### Relationships

- **Belongs to:** `tenants`, `course_chapters`.
- **Tracked in:** `lesson_progress`.

---

## enrollments

**Why it exists:** Records that a student is (or was) enrolled in a course. Gateway to all learning activity — progress, assignments, exams, certificates.

| Column | Why it exists |
|--------|---------------|
| `id` | Enrollment identifier. |
| `tenant_id` | Owning academy. |
| `student_id` | Enrolled student (`student_profiles.id`). |
| `course_id` | Course they joined. |
| `batch_id` | Optional batch assignment. |
| `status` | `pending`, `active`, `completed`, `cancelled`, `transferred`. |
| `enrolled_at` | When enrollment started. |
| `completed_at` | When course was finished. |
| `cancelled_at` | When enrollment was cancelled. |
| `progress_percent` | Overall course completion (0–100), updated from lesson progress. |
| `created_at` / `updated_at` | Audit timestamps. |
| `created_by` | Admin or system that created enrollment. |

### Relationships

- **Belongs to:** `tenants`, `student_profiles`, `courses`, optionally `batches`.
- **Referenced by:** `lesson_progress`, `assignment_submissions`, `quiz_attempts`, `exam_attempts`, `marks`, `payments`, `certificates`.
- **Unique:** One enrollment per student per course per tenant.

---

## lesson_progress

**Why it exists:** Tracks each student's progress on each lesson within an enrollment — started, completed, percentage watched.

| Column | Why it exists |
|--------|---------------|
| `id` | Progress row identifier. |
| `tenant_id` | Owning academy. |
| `enrollment_id` | Which enrollment this progress belongs to. |
| `lesson_id` | Which lesson. |
| `status` | `not_started`, `in_progress`, or `completed`. |
| `progress_percent` | Fine-grained progress (e.g. 45% of video watched). |
| `started_at` | First access. |
| `completed_at` | When marked complete. |
| `last_accessed_at` | Resume position / recent activity. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants`, `enrollments`, `course_lessons`.
- **Unique:** One progress row per enrollment per lesson.

---

## study_materials

**Why it exists:** Downloadable or viewable files attached to a course (PDFs, PPTs, notes) — separate from structured lesson content.

| Column | Why it exists |
|--------|---------------|
| `id` | Material identifier. |
| `tenant_id` | Owning academy. |
| `course_id` | Course this material supports. |
| `batch_id` | Optional — restrict to specific batch. |
| `title` | Display name. |
| `material_type` | `pdf`, `notes`, `ppt`, `video`, `document`, or `link`. |
| `file_url` | Storage location. |
| `file_name` | Original filename for download. |
| `file_size_bytes` | Size for UI and quotas. |
| `mime_type` | Browser handling hint. |
| `description` | Optional notes. |
| `status` | `draft`, `published`, or `archived`. |
| `uploaded_by` | Teacher/admin who uploaded. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |

### Relationships

- **Belongs to:** `tenants`, `courses`, optionally `batches`.

---

## live_classes

**Why it exists:** Scheduled live online sessions — video meetings with a teacher at a specific date and time.

| Column | Why it exists |
|--------|---------------|
| `id` | Session identifier. |
| `tenant_id` | Owning academy. |
| `course_id` | Related course. |
| `batch_id` | Optional batch-specific session. |
| `teacher_id` | Conducting teacher. |
| `title` | Session title. |
| `description` | Agenda or notes. |
| `session_date` | Calendar date. |
| `start_time` / `end_time` | Time window. |
| `meeting_link` | Zoom/Google Meet URL. |
| `recording_url` | Link to recording after session. |
| `status` | `scheduled`, `live`, `completed`, or `cancelled`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` | Who scheduled it. |

### Relationships

- **Belongs to:** `tenants`, `courses`, `teacher_profiles`, optionally `batches`.
- **Referenced by:** `attendance_records.live_class_id`.

---

## assignments

**Why it exists:** Homework or projects teachers assign to students — with due dates, instructions, and max score.

| Column | Why it exists |
|--------|---------------|
| `id` | Assignment identifier. |
| `tenant_id` | Owning academy. |
| `course_id` | Course context. |
| `batch_id` | Optional batch scope. |
| `teacher_id` | Creating/owning teacher. |
| `title` | Assignment name. |
| `description` | Summary shown to students. |
| `instructions` | Detailed steps for completion. |
| `attachment_url` | Reference file from teacher. |
| `due_at` | Submission deadline. |
| `max_score` | Maximum marks (default 100). |
| `status` | `draft`, `published`, or `closed`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` | Creator user id. |

### Relationships

- **Belongs to:** `tenants`, `courses`, optionally `batches`, `teacher_profiles`.
- **Parent of:** `assignment_submissions`.
- **Referenced by:** `marks` (via `assessment_type` + `assessment_id`).

---

## assignment_submissions

**Why it exists:** A student's work for one assignment — file upload, text, score, and teacher feedback.

| Column | Why it exists |
|--------|---------------|
| `id` | Submission identifier. |
| `tenant_id` | Owning academy. |
| `assignment_id` | Which assignment. |
| `student_id` | Submitting student. |
| `enrollment_id` | Ensures student is enrolled in the course. |
| `submission_text` | Written answer if no file. |
| `file_url` / `file_name` | Uploaded work. |
| `status` | `not_started`, `submitted`, `late`, `reviewed`, `closed`. |
| `score` | Marks given by teacher. |
| `feedback` | Teacher comments. |
| `submitted_at` | When student submitted. |
| `reviewed_at` | When teacher graded. |
| `reviewed_by` | Grading teacher/admin. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants`, `assignments`, `student_profiles`, `enrollments`.
- **Unique:** One submission per student per assignment.

---

## quizzes

**Why it exists:** Short online tests within a course — multiple attempts allowed, timed, with auto-grading for MCQs.

| Column | Why it exists |
|--------|---------------|
| `id` | Quiz identifier. |
| `tenant_id` | Owning academy. |
| `course_id` | Parent course. |
| `batch_id` | Optional batch scope. |
| `teacher_id` | Creator teacher. |
| `title` | Quiz name. |
| `description` | Instructions for students. |
| `duration_minutes` | Time limit (NULL = unlimited). |
| `max_attempts` | How many tries allowed (default 1). |
| `passing_score` | Minimum score to pass. |
| `available_from` / `available_until` | Availability window. |
| `status` | `draft`, `published`, or `closed`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` | Creator. |

### Relationships

- **Belongs to:** `tenants`, `courses`, optionally `batches`, `teacher_profiles`.
- **Parent of:** `quiz_questions`, `quiz_attempts`.
- **Referenced by:** `marks`.

---

## quiz_questions

**Why it exists:** Individual questions inside a quiz — MCQ or short text.

| Column | Why it exists |
|--------|---------------|
| `id` | Question identifier. |
| `tenant_id` | Owning academy. |
| `quiz_id` | Parent quiz. |
| `question_text` | The question. |
| `question_type` | `mcq` or `short_text`. |
| `points` | Weight of this question. |
| `sort_order` | Display order. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |

### Relationships

- **Belongs to:** `tenants`, `quizzes`.
- **Parent of:** `quiz_question_options`.
- **Referenced by:** `quiz_answers`.

---

## quiz_question_options

**Why it exists:** Answer choices for MCQ quiz questions. One or more can be marked correct.

| Column | Why it exists |
|--------|---------------|
| `id` | Option identifier. |
| `tenant_id` | Owning academy. |
| `question_id` | Parent question. |
| `option_text` | Choice text (up to 500 chars). |
| `is_correct` | Whether this is a correct answer. |
| `sort_order` | Display order (A, B, C, D). |
| `created_at` | When option was added. |

### Relationships

- **Belongs to:** `tenants`, `quiz_questions`.
- **Referenced by:** `quiz_answers.selected_option_id`.

---

## quiz_attempts

**Why it exists:** One student's one attempt at a quiz — tracks timing, score, and grading status.

| Column | Why it exists |
|--------|---------------|
| `id` | Attempt identifier. |
| `tenant_id` | Owning academy. |
| `quiz_id` | Quiz being attempted. |
| `student_id` | Student taking the quiz. |
| `enrollment_id` | Validates course enrollment. |
| `attempt_number` | 1st, 2nd, 3rd try etc. |
| `status` | `in_progress`, `submitted`, `graded`, or `abandoned`. |
| `score` / `max_score` | Achieved and possible points. |
| `started_at` | When attempt began. |
| `submitted_at` | When student finished. |
| `graded_at` | When grading completed. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants`, `quizzes`, `student_profiles`, `enrollments`.
- **Parent of:** `quiz_answers`.
- **Unique:** One row per student per quiz per attempt number.

---

## quiz_answers

**Why it exists:** Stores the student's answer to each question in one quiz attempt.

| Column | Why it exists |
|--------|---------------|
| `id` | Answer row identifier. |
| `tenant_id` | Owning academy. |
| `attempt_id` | Parent attempt. |
| `question_id` | Which question. |
| `selected_option_id` | Chosen MCQ option (NULL for text questions). |
| `answer_text` | Free-text answer for `short_text` questions. |
| `is_correct` | Grading result. |
| `points_awarded` | Points earned for this question. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants`, `quiz_attempts`, `quiz_questions`, optionally `quiz_question_options`.
- **Unique:** One answer per question per attempt.

---

## exams

**Why it exists:** Formal exams — scheduled, higher stakes than quizzes. Can be online or offline (`is_online`).

| Column | Why it exists |
|--------|---------------|
| `id` | Exam identifier. |
| `tenant_id` | Owning academy. |
| `course_id` | Course being examined. |
| `batch_id` | Optional batch scope. |
| `title` | Exam name ("Mid-Term Mathematics"). |
| `description` | Instructions and syllabus coverage. |
| `exam_date` | Scheduled date. |
| `start_time` / `end_time` | Time slot for in-person or online window. |
| `duration_minutes` | Allowed duration for online exams. |
| `max_score` | Total marks (default 100). |
| `is_online` | 1 = taken in LMS; 0 = offline/paper. |
| `status` | `draft`, `scheduled`, `in_progress`, `completed`, `cancelled`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` | Creator. |

### Relationships

- **Belongs to:** `tenants`, `courses`, optionally `batches`.
- **Parent of:** `exam_questions`, `exam_attempts`.
- **Referenced by:** `marks`.

---

## exam_questions

**Why it exists:** Questions on an exam paper — same structure as quiz questions but tied to exams.

| Column | Why it exists |
|--------|---------------|
| `id` | Question identifier. |
| `tenant_id` | Owning academy. |
| `exam_id` | Parent exam. |
| `question_text` | Question content. |
| `question_type` | `mcq` or `short_text`. |
| `points` | Marks for this question. |
| `sort_order` | Order on the paper. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |

### Relationships

- **Belongs to:** `tenants`, `exams`.
- **Parent of:** `exam_question_options`.
- **Referenced by:** `exam_answers`.

---

## exam_question_options

**Why it exists:** MCQ choices for exam questions — mirror of `quiz_question_options` for the exam module.

| Column | Why it exists |
|--------|---------------|
| `id` | Option identifier. |
| `tenant_id` | Owning academy. |
| `question_id` | Parent question. |
| `option_text` | Choice text. |
| `is_correct` | Correct answer flag. |
| `sort_order` | Display order. |
| `created_at` | When added. |

### Relationships

- **Belongs to:** `tenants`, `exam_questions`.
- **Referenced by:** `exam_answers.selected_option_id`.

---

## exam_attempts

**Why it exists:** One student's participation in one exam — usually one attempt per student (unlike quizzes).

| Column | Why it exists |
|--------|---------------|
| `id` | Attempt identifier. |
| `tenant_id` | Owning academy. |
| `exam_id` | The exam. |
| `student_id` | The student. |
| `enrollment_id` | Course enrollment validation. |
| `status` | `in_progress`, `submitted`, `graded`, or `absent`. |
| `score` / `max_score` | Result marks. |
| `started_at` / `submitted_at` | Timing for online exams. |
| `graded_at` | When marks were finalized. |
| `graded_by` | Teacher who graded (especially offline exams). |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants`, `exams`, `student_profiles`, `enrollments`.
- **Parent of:** `exam_answers`.
- **Unique:** One attempt per student per exam.

---

## exam_answers

**Why it exists:** Student's answer to each exam question within one attempt — same pattern as `quiz_answers`.

| Column | Why it exists |
|--------|---------------|
| `id` | Answer identifier. |
| `tenant_id` | Owning academy. |
| `attempt_id` | Parent attempt. |
| `question_id` | Question answered. |
| `selected_option_id` | MCQ choice. |
| `answer_text` | Text answer. |
| `is_correct` | Grading flag. |
| `points_awarded` | Marks for this answer. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants`, `exam_attempts`, `exam_questions`, optionally `exam_question_options`.
- **Unique:** One answer per question per attempt.

---

## marks

**Why it exists:** Unified gradebook — stores scores from assignments, quizzes, exams, or manual entry in one place for reports and transcripts.

| Column | Why it exists |
|--------|---------------|
| `id` | Mark record identifier. |
| `tenant_id` | Owning academy. |
| `student_id` | Student receiving the mark. |
| `course_id` | Course context. |
| `enrollment_id` | Links to active enrollment. |
| `assessment_type` | `assignment`, `quiz`, `exam`, or `manual`. |
| `assessment_id` | ID of the source record (NULL for manual). |
| `title` | Display label ("Unit Test 1", "Assignment 3"). |
| `score` | Marks obtained. |
| `max_score` | Maximum possible (default 100). |
| `remarks` | Teacher notes. |
| `recorded_at` | When mark was entered. |
| `recorded_by` | Teacher/admin who entered it. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants`, `student_profiles`, `courses`, `enrollments`.
- **Polymorphic link:** `assessment_type` + `assessment_id` point to assignments, quizzes, or exams (enforced in application, not DB FK).

---

## attendance_records

**Why it exists:** Daily or session-based attendance — present, absent, or late — for students in courses/batches/live classes.

| Column | Why it exists |
|--------|---------------|
| `id` | Attendance row identifier. |
| `tenant_id` | Owning academy. |
| `student_id` | Student marked. |
| `course_id` | Course context. |
| `batch_id` | Optional batch. |
| `live_class_id` | Optional — attendance for a specific live session. |
| `attendance_date` | Calendar date of attendance. |
| `status` | `present`, `absent`, or `late`. |
| `remarks` | Notes (e.g. "Medical leave"). |
| `marked_by` | Teacher/admin who recorded it. |
| `marked_at` | When it was recorded. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants`, `student_profiles`, `courses`, optionally `batches`, `live_classes`.
- **Unique:** One record per student per date per course/batch/live_class combination.

---

## payments

**Why it exists:** Money collected from students — course fees, enrollment payments, refunds. Core financial record for the academy.

| Column | Why it exists |
|--------|---------------|
| `id` | Payment identifier. |
| `tenant_id` | Owning academy. |
| `student_id` | Paying student. |
| `enrollment_id` | Optional link to enrollment being paid for. |
| `course_id` | Optional course reference. |
| `amount` | Payment amount. |
| `currency` | Default `INR`. |
| `payment_method` | UPI, card, cash, bank transfer, etc. |
| `transaction_ref` | Gateway or bank reference number. |
| `status` | `pending`, `completed`, `failed`, `refunded`, `cancelled`. |
| `paid_at` | When payment succeeded. |
| `notes` | Internal notes. |
| `created_at` / `updated_at` | Audit timestamps. |
| `created_by` | Admin who recorded (for manual payments). |

### Relationships

- **Belongs to:** `tenants`, `student_profiles`, optionally `enrollments`, `courses`.
- **Referenced by:** `coupon_redemptions`.

---

## coupons

**Why it exists:** Discount codes tenants create for marketing — percentage or fixed amount off course fees.

| Column | Why it exists |
|--------|---------------|
| `id` | Coupon identifier. |
| `tenant_id` | Owning academy. |
| `code` | Code students enter at checkout (unique per tenant). |
| `description` | Internal/marketing description. |
| `discount_type` | `percentage` or `fixed` amount. |
| `discount_value` | Percent (e.g. 20) or rupee amount. |
| `max_uses` | Total redemption limit (NULL = unlimited). |
| `used_count` | How many times redeemed so far. |
| `min_order_amount` | Minimum cart value to apply coupon. |
| `valid_from` / `valid_until` | Active date range. |
| `status` | `active`, `inactive`, or `expired`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` | Who created the coupon. |

### Relationships

- **Belongs to:** `tenants`.
- **Referenced by:** `coupon_redemptions`.

---

## coupon_redemptions

**Why it exists:** Audit trail when a coupon is used — links coupon, payment, student, and actual discount applied.

| Column | Why it exists |
|--------|---------------|
| `id` | Redemption identifier. |
| `tenant_id` | Owning academy. |
| `coupon_id` | Coupon used. |
| `payment_id` | Payment where discount was applied. |
| `student_id` | Student who redeemed. |
| `discount_amount` | Actual rupees saved. |
| `redeemed_at` | When redemption happened. |

### Relationships

- **Belongs to:** `tenants`, `coupons`, `payments`, `student_profiles`.
- **Updates:** `coupons.used_count` should increment in application logic.

---

## wishlist_items

**Why it exists:** Lets students save courses they are interested in but have not enrolled in yet — common e-commerce pattern.

| Column | Why it exists |
|--------|---------------|
| `id` | Wishlist row identifier. |
| `tenant_id` | Owning academy. |
| `student_id` | Student who saved the course. |
| `course_id` | Saved course. |
| `created_at` | When item was added. |

### Relationships

- **Belongs to:** `tenants`, `student_profiles`, `courses`.
- **Unique:** One wishlist entry per student per course.

---

## certificates

**Why it exists:** Issued completion certificates when a student finishes a course — with unique certificate number and optional PDF file.

| Column | Why it exists |
|--------|---------------|
| `id` | Certificate identifier. |
| `tenant_id` | Issuing academy. |
| `student_id` | Graduate. |
| `course_id` | Completed course. |
| `enrollment_id` | Source enrollment (one certificate per enrollment). |
| `certificate_number` | Public verification number (unique per tenant). |
| `issued_at` | Issue date. |
| `file_url` | Generated PDF location. |
| `status` | `issued` or `revoked`. |
| `issued_by` | Admin/teacher who issued. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants`, `student_profiles`, `courses`, `enrollments`.

---

## blog_posts

**Why it exists:** CMS content for the academy's public website — news, articles, tips. Supports SEO fields and publishing workflow.

| Column | Why it exists |
|--------|---------------|
| `id` | Post identifier. |
| `tenant_id` | Owning academy. |
| `title` | Article headline. |
| `slug` | URL path (unique per tenant). |
| `excerpt` | Short preview for listing pages. |
| `content` | Full article body (LONGTEXT). |
| `category` | Blog category. |
| `author_name` | Display name if not linked to user. |
| `author_user_id` | Optional link to `users` who wrote it. |
| `thumbnail_url` | Featured image. |
| `tags_json` | JSON array of tags. |
| `seo_title` / `seo_description` | Meta tags for search engines. |
| `status` | `draft`, `published`, or `archived`. |
| `published_at` | Go-live timestamp. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` | Creator. |

### Relationships

- **Belongs to:** `tenants`.
- **Optional link to:** `users` via `author_user_id`.

---

## gallery_items

**Why it exists:** Photo and video gallery for the academy's marketing site — events, campus, achievements.

| Column | Why it exists |
|--------|---------------|
| `id` | Gallery item identifier. |
| `tenant_id` | Owning academy. |
| `title` | Caption title. |
| `media_type` | `image` or `video`. |
| `media_url` | Full-size media URL. |
| `thumbnail_url` | Smaller preview for grid. |
| `description` | Optional caption. |
| `sort_order` | Display order in gallery. |
| `status` | `active` or `inactive`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |
| `created_by` | Uploader. |

### Relationships

- **Belongs to:** `tenants`.

---

## faqs

**Why it exists:** Frequently asked questions on the academy website — admissions, fees, schedules.

| Column | Why it exists |
|--------|---------------|
| `id` | FAQ identifier. |
| `tenant_id` | Owning academy. |
| `question` | The question text. |
| `answer` | The answer text. |
| `category` | Grouping (Admissions, Fees, etc.). |
| `sort_order` | Display order. |
| `status` | `active` or `inactive`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |

### Relationships

- **Belongs to:** `tenants`.

---

## testimonials

**Why it exists:** Student or parent quotes displayed on the marketing site for social proof.

| Column | Why it exists |
|--------|---------------|
| `id` | Testimonial identifier. |
| `tenant_id` | Owning academy. |
| `author_name` | Person quoted. |
| `author_title` | Role/context ("JEE Rank 45", "Parent of Class 10 student"). |
| `content` | Quote text. |
| `rating` | Optional star rating (1–5). |
| `image_url` | Author photo. |
| `sort_order` | Display order. |
| `status` | `active` or `inactive`. |
| `created_at` / `updated_at` / `deleted_at` | Audit and soft delete. |

### Relationships

- **Belongs to:** `tenants`.

---

## notifications

**Why it exists:** Announcements and alerts created by academy admins — broadcast or targeted to students, teachers, or specific users.

| Column | Why it exists |
|--------|---------------|
| `id` | Notification identifier. |
| `tenant_id` | Owning academy. |
| `title` | Notification headline. |
| `message` | Body text. |
| `notification_type` | `info`, `warning`, `success`, or `alert` — drives icon/color. |
| `audience_type` | `all`, `students`, `teachers`, `owners`, or `specific_user`. |
| `target_user_id` | When audience is `specific_user`. |
| `status` | `draft`, `scheduled`, `sent`, or `cancelled`. |
| `scheduled_at` | Future send time. |
| `sent_at` | When actually delivered. |
| `created_by` | Admin who created it. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants`.
- **Parent of:** `notification_recipients` (when sent to many users).

---

## notification_recipients

**Why it exists:** Per-user delivery and read status for notifications — who received it and whether they read it.

| Column | Why it exists |
|--------|---------------|
| `id` | Recipient row identifier. |
| `tenant_id` | Owning academy. |
| `notification_id` | Parent notification. |
| `user_id` | Recipient login account. |
| `is_read` | 0 = unread, 1 = read. |
| `read_at` | When user opened it. |
| `delivered_at` | When push/email/in-app delivery completed. |
| `created_at` | When recipient row was created. |

### Relationships

- **Belongs to:** `tenants`, `notifications`, `users`.
- **Unique:** One row per user per notification.

---

## contact_messages

**Why it exists:** Inquiries submitted through the academy's "Contact Us" form on the public website.

| Column | Why it exists |
|--------|---------------|
| `id` | Message identifier. |
| `tenant_id` | Academy receiving the inquiry. |
| `name` | Sender's name. |
| `email` | Reply address. |
| `phone` | Optional phone. |
| `subject` | Message subject line. |
| `message` | Full message body. |
| `status` | `new`, `read`, `replied`, or `archived` — inbox workflow. |
| `replied_at` | When staff replied. |
| `replied_by` | Staff user who replied. |
| `reply_message` | Copy of staff reply. |
| `created_at` / `updated_at` | Audit timestamps. |

### Relationships

- **Belongs to:** `tenants`.

---

## tenant_audit_logs

**Why it exists:** Same idea as `platform_audit_logs` but scoped inside one academy — who changed a course, graded an exam, deleted a student, etc.

| Column | Why it exists |
|--------|---------------|
| `id` | Log entry identifier. |
| `tenant_id` | Which academy (required, unlike platform log). |
| `actor_user_id` | Academy user who performed the action. |
| `action` | What happened, e.g. `course.published`, `payment.recorded`. |
| `entity_type` | Affected object type. |
| `entity_id` | Affected record ID. |
| `metadata_json` | Extra context (before/after values). |
| `ip_address` / `user_agent` | Client info. |
| `created_at` | When action occurred. |

### Relationships

- **Belongs to:** `tenants`, optionally `users` (actor).
- **Append-only** — never update or delete in normal operation.

---

# Part 3 — How Tables Work Together

## Content hierarchy

```
courses
  └── course_modules
        └── course_chapters
              └── course_lessons
                    └── lesson_progress (per enrollment)
```

## Student journey

```
users → student_profiles → enrollments → lesson_progress / assignments / quizzes / exams
                                              ↓
                                         marks, certificates, payments
```

## Assessment flow

```
assignments → assignment_submissions → marks
quizzes → quiz_questions → quiz_question_options
       → quiz_attempts → quiz_answers → marks
exams → exam_questions → exam_question_options
     → exam_attempts → exam_answers → marks
```

## Auth and access

```
users → user_roles → roles → role_permissions → permissions
users → teacher_profiles / student_profiles
users → password_reset_tokens, email_verifications
```

## Multi-tenant rule (critical)

Every query on tenant tables must include:

```sql
WHERE tenant_id = :current_tenant_id
```

Platform admins querying across tenants use platform APIs with explicit tenant selection — never mix tenant data in one response by accident.

---

# Part 4 — Quick Reference

| # | Table | Level | One-line purpose |
|---|-------|-------|------------------|
| 1 | tenants | Platform | Academy customers |
| 2 | subscription_plans | Platform | SaaS pricing tiers |
| 3 | tenant_subscriptions | Platform | Tenant ↔ plan billing |
| 4 | platform_settings | Platform | Global SaaS config |
| 5 | roles | Platform | Job function definitions |
| 6 | permissions | Platform | Granular actions |
| 7 | role_permissions | Platform | Role ↔ permission map |
| 8 | users | Platform | Login accounts |
| 9 | user_roles | Platform | User ↔ role assignments |
| 10 | password_reset_tokens | Platform | Forgot password |
| 11 | email_verifications | Platform | Email/OTP verification |
| 12 | platform_audit_logs | Platform | Platform admin audit trail |
| 13 | tenant_profiles | Tenant | Academy branding & settings |
| 14 | teacher_profiles | Tenant | Teacher details |
| 15 | student_profiles | Tenant | Student details |
| 16 | academic_classes | Tenant | Class/grade levels |
| 17 | subjects | Tenant | Subject catalog |
| 18 | batches | Tenant | Student groups |
| 19 | courses | Tenant | Courses/programs |
| 20 | course_teachers | Tenant | Course ↔ teacher map |
| 21 | course_modules | Tenant | Course content units |
| 22 | course_chapters | Tenant | Chapters in modules |
| 23 | course_lessons | Tenant | Individual lessons |
| 24 | enrollments | Tenant | Student ↔ course join |
| 25 | lesson_progress | Tenant | Per-lesson completion |
| 26 | study_materials | Tenant | Downloadable files |
| 27 | live_classes | Tenant | Scheduled live sessions |
| 28 | assignments | Tenant | Homework/tasks |
| 29 | assignment_submissions | Tenant | Student homework uploads |
| 30 | quizzes | Tenant | Online quizzes |
| 31 | quiz_questions | Tenant | Quiz questions |
| 32 | quiz_question_options | Tenant | MCQ options |
| 33 | quiz_attempts | Tenant | Student quiz tries |
| 34 | quiz_answers | Tenant | Answers per attempt |
| 35 | exams | Tenant | Formal exams |
| 36 | exam_questions | Tenant | Exam questions |
| 37 | exam_question_options | Tenant | Exam MCQ options |
| 38 | exam_attempts | Tenant | Student exam participation |
| 39 | exam_answers | Tenant | Exam answers |
| 40 | marks | Tenant | Unified gradebook |
| 41 | attendance_records | Tenant | Attendance tracking |
| 42 | payments | Tenant | Fee payments |
| 43 | coupons | Tenant | Discount codes |
| 44 | coupon_redemptions | Tenant | Coupon usage log |
| 45 | wishlist_items | Tenant | Saved courses |
| 46 | certificates | Tenant | Completion certificates |
| 47 | blog_posts | Tenant | Website blog CMS |
| 48 | gallery_items | Tenant | Photo/video gallery |
| 49 | faqs | Tenant | FAQ content |
| 50 | testimonials | Tenant | Social proof quotes |
| 51 | notifications | Tenant | Announcements |
| 52 | notification_recipients | Tenant | Per-user notification state |
| 53 | contact_messages | Tenant | Contact form inbox |
| 54 | tenant_audit_logs | Tenant | Academy audit trail |

---

# Part 5 — Common Questions

**Q: Why is `teacher_id` on some tables pointing to `teacher_profiles`, not `users`?**  
A: Login identity (`users`) is separate from the teacher record (`teacher_profiles`). Always use profile IDs for academic relationships so deleted logins do not break historical data unexpectedly.

**Q: Why both `quiz_*` and `exam_*` tables?**  
A: Quizzes are informal, repeatable, often auto-graded practice. Exams are formal, usually once per student, may be offline, and have different workflows. Separate tables keep logic and UI simpler.

**Q: Why does `marks` exist when submissions and attempts already have scores?**  
A: `marks` is the gradebook view — one place for report cards, transcripts, and analytics across all assessment types plus manual entries.

**Q: Can one user be both teacher and student?**  
A: Yes. One `users` row, optional `teacher_profiles` and/or `student_profiles`, and roles assigned via `user_roles`.

**Q: What happens when a tenant is deleted?**  
A: `tenants` uses soft delete (`deleted_at`). Tenant child tables use `ON DELETE CASCADE` from `tenant_id` for hard deletes if ever needed — but production should soft-delete and archive.

---

*For ERD diagrams see [10-erd.md](./10-erd.md). For column-level reference see [11-table-catalog.md](./11-table-catalog.md). For SQL see [../../database/schema.sql](../../database/schema.sql).*
