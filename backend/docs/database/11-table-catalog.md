# 11 — Complete Table Catalog

Reference documentation for all **54 tables** in the Praksha Academy SaaS database.

**Source of truth:** [`database/schema.sql`](../../database/schema.sql)

| Metric | Value |
|---|---|
| Total tables | 54 |
| Platform-level | 12 |
| Tenant-level | 42 |
| Primary key type | UUID (`CHAR(36)`) |
| Engine | InnoDB |
| Charset | utf8mb4_unicode_ci |

---

## Table Index

### Platform Tables (12)

| # | Table |
|---|---|
| 1 | [`tenants`](#tenants) |
| 2 | [`subscription_plans`](#subscription_plans) |
| 3 | [`tenant_subscriptions`](#tenant_subscriptions) |
| 4 | [`platform_settings`](#platform_settings) |
| 5 | [`roles`](#roles) |
| 6 | [`permissions`](#permissions) |
| 7 | [`role_permissions`](#role_permissions) |
| 8 | [`users`](#users) |
| 9 | [`user_roles`](#user_roles) |
| 10 | [`password_reset_tokens`](#password_reset_tokens) |
| 11 | [`email_verifications`](#email_verifications) |
| 12 | [`platform_audit_logs`](#platform_audit_logs) |

### Tenant Tables (42)

| # | Table |
|---|---|
| 1 | [`tenant_profiles`](#tenant_profiles) |
| 2 | [`teacher_profiles`](#teacher_profiles) |
| 3 | [`student_profiles`](#student_profiles) |
| 4 | [`academic_classes`](#academic_classes) |
| 5 | [`subjects`](#subjects) |
| 6 | [`batches`](#batches) |
| 7 | [`courses`](#courses) |
| 8 | [`course_teachers`](#course_teachers) |
| 9 | [`course_modules`](#course_modules) |
| 10 | [`course_chapters`](#course_chapters) |
| 11 | [`course_lessons`](#course_lessons) |
| 12 | [`enrollments`](#enrollments) |
| 13 | [`lesson_progress`](#lesson_progress) |
| 14 | [`study_materials`](#study_materials) |
| 15 | [`live_classes`](#live_classes) |
| 16 | [`assignments`](#assignments) |
| 17 | [`assignment_submissions`](#assignment_submissions) |
| 18 | [`quizzes`](#quizzes) |
| 19 | [`quiz_questions`](#quiz_questions) |
| 20 | [`quiz_question_options`](#quiz_question_options) |
| 21 | [`quiz_attempts`](#quiz_attempts) |
| 22 | [`quiz_answers`](#quiz_answers) |
| 23 | [`exams`](#exams) |
| 24 | [`exam_questions`](#exam_questions) |
| 25 | [`exam_question_options`](#exam_question_options) |
| 26 | [`exam_attempts`](#exam_attempts) |
| 27 | [`exam_answers`](#exam_answers) |
| 28 | [`marks`](#marks) |
| 29 | [`attendance_records`](#attendance_records) |
| 30 | [`payments`](#payments) |
| 31 | [`coupons`](#coupons) |
| 32 | [`coupon_redemptions`](#coupon_redemptions) |
| 33 | [`wishlist_items`](#wishlist_items) |
| 34 | [`certificates`](#certificates) |
| 35 | [`blog_posts`](#blog_posts) |
| 36 | [`gallery_items`](#gallery_items) |
| 37 | [`faqs`](#faqs) |
| 38 | [`testimonials`](#testimonials) |
| 39 | [`notifications`](#notifications) |
| 40 | [`notification_recipients`](#notification_recipients) |
| 41 | [`contact_messages`](#contact_messages) |
| 42 | [`tenant_audit_logs`](#tenant_audit_logs) |

---

## tenants

### Purpose
Root entity representing each academy customer (tenant) on the SaaS platform. Stores identity, status lifecycle, and contact metadata.

### Level (Platform/Tenant)
Platform

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Not Required — root tenant entity (no `tenant_id` column)

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_code` | VARCHAR(32) | No | — | Human-readable unique tenant identifier |
| `name` | VARCHAR(200) | No | — | Display name |
| `slug` | VARCHAR(200) | No | — | URL-safe unique identifier |
| `status` | ENUM('pending','trial','active','suspended','cancelled','archived') | No | 'pending' | Lifecycle/status flag |
| `contact_email` | VARCHAR(255) | Yes | — | Contact email address |
| `contact_phone` | VARCHAR(30) | Yes | — | Contact phone number |
| `timezone` | VARCHAR(64) | No | 'Asia/Kolkata' | IANA timezone identifier |
| `trial_ends_at` | DATETIME(6) | Yes | — | Trial period end datetime |
| `activated_at` | DATETIME(6) | Yes | — | Tenant activation datetime |
| `suspended_at` | DATETIME(6) | Yes | — | Tenant suspension datetime |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

None.

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_tenants_tenant_code` | tenant_code |
| `uk_tenants_slug` | slug |

### Indexes

| Index | Columns |
|---|---|
| `idx_tenants_status` | status |
| `idx_tenants_deleted_at` | deleted_at |

### Delete Behavior
Referenced by most tables. Child tenant data CASCADEs on delete. Platform FKs (users, tenant_subscriptions) use RESTRICT or SET NULL.

### Business Rules

- Each tenant must have a unique `tenant_code` and `slug`.
- Status progresses through: pending → trial/active → suspended/cancelled/archived.
- Soft-delete via `deleted_at`; do not hard-delete tenants with active subscriptions.
- Default timezone is `Asia/Kolkata`.

### Example Usage

Register a new academy: insert with `status = 'trial'`, set `trial_ends_at`, generate UUID for `id`.

---
## subscription_plans

### Purpose
Catalog of SaaS subscription tiers offered by Prabha Technology with pricing, limits, and feature flags.

### Level (Platform/Tenant)
Platform

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Not Required — no `tenant_id` column

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `code` | VARCHAR(50) | No | — | Short unique code within scope |
| `name` | VARCHAR(150) | No | — | Display name |
| `description` | TEXT | Yes | — | Longer text description |
| `monthly_price` | DECIMAL(12,2) | No | 0.00 | Monthly subscription price |
| `annual_price` | DECIMAL(12,2) | Yes | — | Annual subscription price |
| `currency` | CHAR(3) | No | 'INR' | ISO 4217 currency code |
| `trial_days` | INT UNSIGNED | No | 0 | Trial period length in days |
| `max_students` | INT UNSIGNED | Yes | — | Plan student limit (NULL = unlimited) |
| `max_teachers` | INT UNSIGNED | Yes | — | Plan teacher limit (NULL = unlimited) |
| `max_courses` | INT UNSIGNED | Yes | — | Plan course limit (NULL = unlimited) |
| `features_json` | JSON | Yes | — | JSON plan feature flags |
| `status` | ENUM('active','inactive','archived') | No | 'active' | Lifecycle/status flag |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

None.

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_subscription_plans_code` | code |

### Indexes

| Index | Columns |
|---|---|
| `idx_subscription_plans_status` | status |

### Delete Behavior
RESTRICT on delete if tenant_subscriptions reference the plan.

### Business Rules

- Plan `code` must be globally unique.
- `features_json` stores plan feature flags for UI and enforcement.
- NULL limits (`max_students`, etc.) mean unlimited.
- Soft-delete via `deleted_at`.

### Example Usage

Seed plans: `code = 'starter'`, `monthly_price = 999.00`, `max_students = 100`.

---
## tenant_subscriptions

### Purpose
Links tenants to subscription plans and tracks billing cycle, trial, and subscription status.

### Level (Platform/Tenant)
Platform

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `plan_id` | CHAR(36) | No | — | FK to `subscription_plans` |
| `status` | ENUM('trial','active','past_due','cancelled','expired') | No | 'trial' | Lifecycle/status flag |
| `billing_cycle` | ENUM('monthly','annual','custom') | No | 'monthly' | Subscription billing frequency |
| `starts_at` | DATETIME(6) | No | — | Subscription start datetime |
| `ends_at` | DATETIME(6) | Yes | — | Subscription end datetime |
| `trial_ends_at` | DATETIME(6) | Yes | — | Trial period end datetime |
| `cancelled_at` | DATETIME(6) | Yes | — | Cancellation datetime |
| `auto_renew` | TINYINT(1) | No | 1 | Auto-renewal flag for subscription |
| `notes` | TEXT | Yes | — | Free-form notes |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_tenant_subscriptions_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | RESTRICT |
| `fk_tenant_subscriptions_plan` | `plan_id` | `subscription_plans`.`id` | CASCADE | RESTRICT |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_tenant_subscriptions_tenant_id` | tenant_id |
| `idx_tenant_subscriptions_plan_id` | plan_id |
| `idx_tenant_subscriptions_status` | status |
| `idx_tenant_subscriptions_ends_at` | ends_at |

### Delete Behavior
Parent tenant delete: RESTRICT. Parent plan delete: RESTRICT.

### Business Rules

- Each tenant may have multiple subscription records over time (history).
- Only one subscription should be `active` or `trial` at a time (enforced at application layer).
- Deleting a tenant is RESTRICTed while subscriptions reference it.

### Example Usage

On tenant signup: link tenant to `starter` plan with `billing_cycle = 'monthly'`, `status = 'trial'`.

---
## platform_settings

### Purpose
Global key-value configuration store for platform-wide settings (JSON values).

### Level (Platform/Tenant)
Platform

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Not Required — no `tenant_id` column

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `setting_key` | VARCHAR(100) | No | — | Unique configuration key |
| `setting_value` | JSON | Yes | — | JSON configuration value |
| `description` | VARCHAR(500) | Yes | — | Longer text description |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

None.

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_platform_settings_key` | setting_key |

### Indexes

None (beyond primary key and unique constraints).

### Delete Behavior
No foreign keys — standalone rows.

### Business Rules

- `setting_key` is globally unique.
- Values stored as JSON for flexibility.

### Example Usage

Store SMTP config: `setting_key = 'email.smtp'`, `setting_value = {"host": "..."}`.

---
## roles

### Purpose
RBAC role definitions scoped to `platform` or `tenant` level.

### Level (Platform/Tenant)
Platform

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Not Required — no `tenant_id` column

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `scope` | ENUM('platform','tenant') | No | — | RBAC scope: `platform` or `tenant` |
| `code` | VARCHAR(50) | No | — | Short unique code within scope |
| `name` | VARCHAR(100) | No | — | Display name |
| `description` | VARCHAR(500) | Yes | — | Longer text description |
| `is_system` | TINYINT(1) | No | 0 | System role flag (1 = built-in, non-deletable) |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

None.

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_roles_scope_code` | scope, code |

### Indexes

None (beyond primary key and unique constraints).

### Delete Behavior
role_permissions CASCADE. user_roles RESTRICT.

### Business Rules

- `scope` + `code` combination must be unique.
- System roles (`is_system = 1`) cannot be deleted by tenants.

### Example Usage

Create tenant role: `scope = 'tenant'`, `code = 'owner'`, `name = 'Academy Owner'`.

---
## permissions

### Purpose
Granular permission definitions grouped by module, scoped to `platform` or `tenant`.

### Level (Platform/Tenant)
Platform

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Not Required — no `tenant_id` column

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `scope` | ENUM('platform','tenant') | No | — | RBAC scope: `platform` or `tenant` |
| `code` | VARCHAR(100) | No | — | Short unique code within scope |
| `name` | VARCHAR(150) | No | — | Display name |
| `module` | VARCHAR(50) | No | — | Permission module grouping |
| `description` | VARCHAR(500) | Yes | — | Longer text description |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

None.

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_permissions_scope_code` | scope, code |

### Indexes

| Index | Columns |
|---|---|
| `idx_permissions_module` | module |

### Delete Behavior
role_permissions CASCADE.

### Business Rules

- `scope` + `code` combination must be unique.
- Grouped by `module` for UI organization.

### Example Usage

Define permission: `scope = 'tenant'`, `code = 'courses.create'`, `module = 'courses'`.

---
## role_permissions

### Purpose
Many-to-many junction mapping roles to permissions.

### Level (Platform/Tenant)
Platform

### Primary Key
`role_id, permission_id`

### tenant_id (Required/Not Required/Nullable)
Not Required — no `tenant_id` column

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `role_id` | CHAR(36) | No | — | FK to `roles` |
| `permission_id` | CHAR(36) | No | — | FK to `permissions` |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_role_permissions_role` | `role_id` | `roles`.`id` | CASCADE | CASCADE |
| `fk_role_permissions_permission` | `permission_id` | `permissions`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_role_permissions_permission_id` | permission_id |

### Delete Behavior
Junction table — CASCADE on role or permission delete.

### Business Rules

- Composite primary key on (`role_id`, `permission_id`).
- Deleting a role or permission cascades junction rows.

### Example Usage

Grant `courses.create` to `owner` role by inserting junction row.

---
## users

### Purpose
Authentication identity for all users — platform admins (`tenant_id` NULL) and tenant users (`tenant_id` set).

### Level (Platform/Tenant)
Platform

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Nullable — `NULL` for platform admins; set for tenant users

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | Yes | — | Owning tenant FK |
| `email` | VARCHAR(255) | No | — | Email address |
| `password_hash` | VARCHAR(255) | No | — | Bcrypt/argon2 password hash — never plaintext |
| `first_name` | VARCHAR(100) | No | — | User first name |
| `last_name` | VARCHAR(100) | Yes | — | User last name |
| `phone` | VARCHAR(30) | Yes | — | Phone number |
| `avatar_url` | VARCHAR(500) | Yes | — | Profile avatar image URL |
| `status` | ENUM('pending','active','inactive','suspended') | No | 'pending' | Lifecycle/status flag |
| `email_verified_at` | DATETIME(6) | Yes | — | Email verification datetime |
| `last_login_at` | DATETIME(6) | Yes | — | Last login datetime |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |
| `updated_by` | CHAR(36) | Yes | — | FK to `users` who last updated the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_users_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | RESTRICT |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_users_tenant_email` | tenant_id, email |

### Indexes

| Index | Columns |
|---|---|
| `idx_users_tenant_id` | tenant_id |
| `idx_users_status` | status |
| `idx_users_deleted_at` | deleted_at |

### Delete Behavior
Tenant delete: RESTRICT. Child tokens/verifications CASCADE. Audit logs SET NULL on actor delete.

### Business Rules

- Email uniqueness is scoped per tenant: (`tenant_id`, `email`).
- Platform admins have `tenant_id = NULL`.
- Password stored as hash only — never plaintext.
- Soft-delete via `deleted_at`.

### Example Usage

Create tenant admin: `tenant_id = <uuid>`, `email = 'admin@academy.com'`, `status = 'active'`.

---
## user_roles

### Purpose
Assigns roles to users, optionally scoped to a specific tenant.

### Level (Platform/Tenant)
Platform

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Nullable — `NULL` for platform-scoped role assignments

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `user_id` | CHAR(36) | No | — | FK to `users` |
| `role_id` | CHAR(36) | No | — | FK to `roles` |
| `tenant_id` | CHAR(36) | Yes | — | Owning tenant FK |
| `assigned_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Role/teacher assignment datetime |
| `assigned_by` | CHAR(36) | Yes | — | FK to `users` who made the assignment |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_user_roles_user` | `user_id` | `users`.`id` | CASCADE | CASCADE |
| `fk_user_roles_role` | `role_id` | `roles`.`id` | CASCADE | RESTRICT |
| `fk_user_roles_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_user_roles_user_role_tenant` | user_id, role_id, tenant_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_user_roles_user_id` | user_id |
| `idx_user_roles_role_id` | role_id |
| `idx_user_roles_tenant_id` | tenant_id |

### Delete Behavior
User delete: CASCADE. Role delete: RESTRICT. Tenant delete: CASCADE.

### Business Rules

- Unique assignment per (`user_id`, `role_id`, `tenant_id`).
- Platform roles use `tenant_id = NULL`.

### Example Usage

Assign owner role: `user_id`, `role_id`, `tenant_id` all set.

---
## password_reset_tokens

### Purpose
Stores hashed password reset tokens with expiry and usage tracking.

### Level (Platform/Tenant)
Platform

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Not Required — no `tenant_id` column

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `user_id` | CHAR(36) | No | — | FK to `users` |
| `token_hash` | VARCHAR(255) | No | — | Hashed token — never store raw token |
| `expires_at` | DATETIME(6) | No | — | Token/OTP expiry datetime |
| `used_at` | DATETIME(6) | Yes | — | Token usage datetime |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_password_reset_tokens_user` | `user_id` | `users`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_password_reset_tokens_hash` | token_hash |

### Indexes

| Index | Columns |
|---|---|
| `idx_password_reset_tokens_user_id` | user_id |
| `idx_password_reset_tokens_expires_at` | expires_at |

### Delete Behavior
User delete: CASCADE.

### Business Rules

- Store `token_hash` only — never the raw token.
- Token is single-use: set `used_at` on redemption.
- Expired tokens should be rejected by application logic.

### Example Usage

On forgot-password: insert hashed token, `expires_at = NOW() + 1 hour`.

---
## email_verifications

### Purpose
OTP-based email verification records for registration, email change, or login.

### Level (Platform/Tenant)
Platform

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Not Required — no `tenant_id` column

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `user_id` | CHAR(36) | No | — | FK to `users` |
| `otp_hash` | VARCHAR(255) | No | — | Hashed OTP — never store raw OTP |
| `purpose` | ENUM('registration','email_change','login') | No | 'registration' | Email verification purpose |
| `expires_at` | DATETIME(6) | No | — | Token/OTP expiry datetime |
| `verified_at` | DATETIME(6) | Yes | — | Verification completion datetime |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_email_verifications_user` | `user_id` | `users`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_email_verifications_user_id` | user_id |
| `idx_email_verifications_expires_at` | expires_at |

### Delete Behavior
User delete: CASCADE.

### Business Rules

- Store `otp_hash` only — never the raw OTP.
- `purpose` distinguishes registration, email change, and login flows.

### Example Usage

On registration: insert OTP hash with `purpose = 'registration'`, 10-minute expiry.

---
## platform_audit_logs

### Purpose
Immutable audit trail for platform-level actions, optionally referencing a tenant.

### Level (Platform/Tenant)
Platform

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Nullable — optional reference to affected tenant

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `actor_user_id` | CHAR(36) | Yes | — | FK to `users` — who performed the action |
| `action` | VARCHAR(100) | No | — | Audit action identifier (e.g. `course.publish`) |
| `entity_type` | VARCHAR(100) | No | — | Audited entity table/type name |
| `entity_id` | CHAR(36) | Yes | — | UUID of audited entity |
| `tenant_id` | CHAR(36) | Yes | — | Owning tenant FK |
| `metadata_json` | JSON | Yes | — | JSON metadata for audit/context |
| `ip_address` | VARCHAR(45) | Yes | — | Client IP address (IPv4/IPv6) |
| `user_agent` | VARCHAR(500) | Yes | — | Client user-agent string |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_platform_audit_logs_actor` | `actor_user_id` | `users`.`id` | CASCADE | SET NULL |
| `fk_platform_audit_logs_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | SET NULL |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_platform_audit_logs_actor` | actor_user_id |
| `idx_platform_audit_logs_tenant_id` | tenant_id |
| `idx_platform_audit_logs_entity` | entity_type, entity_id |
| `idx_platform_audit_logs_created_at` | created_at |

### Delete Behavior
Actor user delete: SET NULL. Tenant delete: SET NULL.

### Business Rules

- Append-only — no updates or deletes.
- `metadata_json` stores action-specific context.

### Example Usage

Log tenant suspension: `action = 'tenant.suspend'`, `entity_type = 'tenants'`, `tenant_id`.

---
## tenant_profiles

### Purpose
Extended branding and contact profile for a tenant (one profile per tenant).

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `display_name` | VARCHAR(200) | No | — | Tenant public display name |
| `tagline` | VARCHAR(500) | Yes | — | Tenant tagline/slogan |
| `logo_url` | VARCHAR(500) | Yes | — | Tenant logo image URL |
| `contact_email` | VARCHAR(255) | Yes | — | Contact email address |
| `contact_phone` | VARCHAR(30) | Yes | — | Contact phone number |
| `address_line1` | VARCHAR(255) | Yes | — | Address line 1 |
| `address_line2` | VARCHAR(255) | Yes | — | Address line 2 |
| `city` | VARCHAR(100) | Yes | — | City |
| `state` | VARCHAR(100) | Yes | — | State/province |
| `country` | VARCHAR(100) | Yes | 'India' | Country |
| `postal_code` | VARCHAR(20) | Yes | — | Postal/ZIP code |
| `website_url` | VARCHAR(500) | Yes | — | Public website URL |
| `academic_year` | VARCHAR(20) | Yes | — | Current academic year label |
| `default_language` | VARCHAR(50) | No | 'English' | Tenant default language |
| `settings_json` | JSON | Yes | — | JSON tenant settings overrides |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_tenant_profiles_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_tenant_profiles_tenant_id` | tenant_id |

### Indexes

None (beyond primary key and unique constraints).

### Delete Behavior
Tenant delete: CASCADE.

### Business Rules

- Exactly one profile per tenant (`uk_tenant_profiles_tenant_id`).
- `settings_json` holds tenant-specific configuration overrides.

### Example Usage

After tenant creation: insert profile with `display_name`, `logo_url`, branding settings.

---
## teacher_profiles

### Purpose
Teacher-specific profile linked to a user within a tenant.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `user_id` | CHAR(36) | No | — | FK to `users` |
| `employee_code` | VARCHAR(50) | Yes | — | Teacher employee ID |
| `qualification` | VARCHAR(255) | Yes | — | Teacher qualification |
| `experience_years` | DECIMAL(4,1) | Yes | — | Years of teaching experience |
| `specialization` | VARCHAR(255) | Yes | — | Teacher subject specialization |
| `bio` | TEXT | Yes | — | Teacher biography |
| `joined_at` | DATE | Yes | — | Date joined organization |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_teacher_profiles_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_teacher_profiles_user` | `user_id` | `users`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_teacher_profiles_user` | tenant_id, user_id |
| `uk_teacher_profiles_code` | tenant_id, employee_code |

### Indexes

| Index | Columns |
|---|---|
| `idx_teacher_profiles_tenant_id` | tenant_id |
| `idx_teacher_profiles_deleted_at` | deleted_at |

### Delete Behavior
Tenant delete: CASCADE. User delete: CASCADE.

### Business Rules

- One teacher profile per user per tenant.
- `employee_code` unique per tenant when set.
- Soft-delete via `deleted_at`.

### Example Usage

Onboard teacher: link `user_id`, set `qualification`, `employee_code`.

---
## student_profiles

### Purpose
Student-specific profile linked to a user within a tenant.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `user_id` | CHAR(36) | No | — | FK to `users` |
| `enrollment_number` | VARCHAR(50) | Yes | — | Student enrollment/roll number |
| `date_of_birth` | DATE | Yes | — | Student date of birth |
| `gender` | ENUM('male','female','other','prefer_not_to_say') | Yes | — | Student gender |
| `guardian_name` | VARCHAR(150) | Yes | — | Parent/guardian name |
| `guardian_phone` | VARCHAR(30) | Yes | — | Parent/guardian phone |
| `address_line1` | VARCHAR(255) | Yes | — | Address line 1 |
| `city` | VARCHAR(100) | Yes | — | City |
| `joined_at` | DATE | Yes | — | Date joined organization |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_student_profiles_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_student_profiles_user` | `user_id` | `users`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_student_profiles_user` | tenant_id, user_id |
| `uk_student_profiles_enrollment` | tenant_id, enrollment_number |

### Indexes

| Index | Columns |
|---|---|
| `idx_student_profiles_tenant_id` | tenant_id |
| `idx_student_profiles_deleted_at` | deleted_at |

### Delete Behavior
Tenant delete: CASCADE. User delete: CASCADE.

### Business Rules

- One student profile per user per tenant.
- `enrollment_number` unique per tenant when set.
- Soft-delete via `deleted_at`.

### Example Usage

Enroll student user: link `user_id`, set `enrollment_number`, guardian details.

---
## academic_classes

### Purpose
Academic class/grade definitions within a tenant (e.g., Class 10, JEE Batch).

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `name` | VARCHAR(150) | No | — | Display name |
| `code` | VARCHAR(50) | Yes | — | Short unique code within scope |
| `description` | VARCHAR(500) | Yes | — | Longer text description |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `status` | ENUM('active','inactive') | No | 'active' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |
| `updated_by` | CHAR(36) | Yes | — | FK to `users` who last updated the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_academic_classes_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_academic_classes_name` | tenant_id, name |
| `uk_academic_classes_code` | tenant_id, code |

### Indexes

| Index | Columns |
|---|---|
| `idx_academic_classes_tenant_id` | tenant_id |
| `idx_academic_classes_status` | status |

### Delete Behavior
Tenant delete: CASCADE. Referenced by batches: RESTRICT.

### Business Rules

- Class `name` and `code` unique per tenant.
- Soft-delete via `deleted_at`.

### Example Usage

Create class: `name = 'Class 12 Science'`, `code = 'C12-SCI'`.

---
## subjects

### Purpose
Subject catalog within a tenant (e.g., Mathematics, Physics).

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `name` | VARCHAR(150) | No | — | Display name |
| `code` | VARCHAR(50) | Yes | — | Short unique code within scope |
| `description` | VARCHAR(500) | Yes | — | Longer text description |
| `status` | ENUM('active','inactive') | No | 'active' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |
| `updated_by` | CHAR(36) | Yes | — | FK to `users` who last updated the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_subjects_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_subjects_name` | tenant_id, name |
| `uk_subjects_code` | tenant_id, code |

### Indexes

| Index | Columns |
|---|---|
| `idx_subjects_tenant_id` | tenant_id |

### Delete Behavior
Tenant delete: CASCADE. Referenced by courses: SET NULL.

### Business Rules

- Subject `name` and `code` unique per tenant.
- Soft-delete via `deleted_at`.

### Example Usage

Add subject: `name = 'Mathematics'`, `code = 'MATH'`.

---
## batches

### Purpose
Student cohorts within an academic class, optionally linked to a course.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `academic_class_id` | CHAR(36) | No | — | FK to `academic_classes` |
| `course_id` | CHAR(36) | Yes | — | FK to `courses` |
| `name` | VARCHAR(150) | No | — | Display name |
| `code` | VARCHAR(50) | Yes | — | Short unique code within scope |
| `start_date` | DATE | Yes | — | Batch start date |
| `end_date` | DATE | Yes | — | Batch end date |
| `status` | ENUM('active','inactive','completed') | No | 'active' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |
| `updated_by` | CHAR(36) | Yes | — | FK to `users` who last updated the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_batches_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_batches_academic_class` | `academic_class_id` | `academic_classes`.`id` | CASCADE | RESTRICT |
| `fk_batches_course` | `course_id` | `courses`.`id` | CASCADE | SET NULL |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_batches_name_class` | tenant_id, academic_class_id, name |

### Indexes

| Index | Columns |
|---|---|
| `idx_batches_tenant_id` | tenant_id |
| `idx_batches_academic_class_id` | academic_class_id |
| `idx_batches_course_id` | course_id |
| `idx_batches_status` | status |

### Delete Behavior
Tenant delete: CASCADE. Academic class delete: RESTRICT. Course delete: SET NULL.

### Business Rules

- Batch `name` unique within (`tenant_id`, `academic_class_id`).
- `course_id` is optional; SET NULL if course deleted.
- Cannot delete academic class while batches reference it (RESTRICT).

### Example Usage

Create batch: `academic_class_id`, `name = 'Morning Batch 2026'`, `start_date`.

---
## courses

### Purpose
Sellable/enrollable course offerings with pricing, content metadata, and publication status.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `academic_class_id` | CHAR(36) | Yes | — | FK to `academic_classes` |
| `subject_id` | CHAR(36) | Yes | — | FK to `subjects` |
| `name` | VARCHAR(200) | No | — | Display name |
| `slug` | VARCHAR(220) | No | — | URL-safe unique identifier |
| `category` | VARCHAR(100) | Yes | — | Content category |
| `description` | TEXT | Yes | — | Longer text description |
| `thumbnail_url` | VARCHAR(500) | Yes | — | Thumbnail image URL |
| `price` | DECIMAL(12,2) | No | 0.00 | Course list price |
| `discount_price` | DECIMAL(12,2) | Yes | — | Course discounted/sale price |
| `duration_label` | VARCHAR(100) | Yes | — | Human-readable duration label |
| `language` | VARCHAR(50) | No | 'English' | Content language |
| `course_type` | VARCHAR(50) | Yes | — | Course type classification |
| `status` | ENUM('draft','published','archived') | No | 'draft' | Lifecycle/status flag |
| `is_featured` | TINYINT(1) | No | 0 | Featured course flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |
| `updated_by` | CHAR(36) | Yes | — | FK to `users` who last updated the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_courses_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_courses_academic_class` | `academic_class_id` | `academic_classes`.`id` | CASCADE | SET NULL |
| `fk_courses_subject` | `subject_id` | `subjects`.`id` | CASCADE | SET NULL |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_courses_slug` | tenant_id, slug |

### Indexes

| Index | Columns |
|---|---|
| `idx_courses_tenant_id` | tenant_id |
| `idx_courses_academic_class_id` | academic_class_id |
| `idx_courses_subject_id` | subject_id |
| `idx_courses_status` | status |
| `idx_courses_category` | tenant_id, category |

### Delete Behavior
Tenant delete: CASCADE. Academic class/subject delete: SET NULL. Enrollments: RESTRICT. Certificates: RESTRICT.

### Business Rules

- Course `slug` unique per tenant.
- Default status is `draft`; must be `published` for public enrollment.
- Soft-delete via `deleted_at`.

### Example Usage

Publish course: `name = 'JEE Physics'`, `slug = 'jee-physics'`, `status = 'published'`, `price = 5000`.

---
## course_teachers

### Purpose
Assigns teachers to courses with optional primary-teacher flag.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `teacher_id` | CHAR(36) | No | — | FK to `teacher_profiles` |
| `is_primary` | TINYINT(1) | No | 0 | Primary teacher flag (1 = primary) |
| `assigned_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Role/teacher assignment datetime |
| `assigned_by` | CHAR(36) | Yes | — | FK to `users` who made the assignment |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_course_teachers_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_course_teachers_course` | `course_id` | `courses`.`id` | CASCADE | CASCADE |
| `fk_course_teachers_teacher` | `teacher_id` | `teacher_profiles`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_course_teachers` | tenant_id, course_id, teacher_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_course_teachers_course_id` | course_id |
| `idx_course_teachers_teacher_id` | teacher_id |

### Delete Behavior
Tenant/course/teacher delete: CASCADE.

### Business Rules

- One assignment per (`tenant_id`, `course_id`, `teacher_id`).
- At most one teacher should be `is_primary = 1` per course (application layer).

### Example Usage

Assign teacher to course: `course_id`, `teacher_id`, `is_primary = 1`.

---
## course_modules

### Purpose
Top-level content sections within a course curriculum.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `title` | VARCHAR(200) | No | — | Title or heading |
| `description` | TEXT | Yes | — | Longer text description |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `status` | ENUM('active','inactive') | No | 'active' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_course_modules_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_course_modules_course` | `course_id` | `courses`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_course_modules_tenant_id` | tenant_id |
| `idx_course_modules_course_id` | course_id |

### Delete Behavior
Tenant/course delete: CASCADE.

### Business Rules

- Ordered via `sort_order` within a course.
- Soft-delete via `deleted_at`.

### Example Usage

Add module: `course_id`, `title = 'Mechanics'`, `sort_order = 1`.

---
## course_chapters

### Purpose
Chapters within a course module.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `module_id` | CHAR(36) | No | — | FK to `course_modules` |
| `title` | VARCHAR(200) | No | — | Title or heading |
| `description` | TEXT | Yes | — | Longer text description |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `status` | ENUM('active','inactive') | No | 'active' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_course_chapters_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_course_chapters_module` | `module_id` | `course_modules`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_course_chapters_tenant_id` | tenant_id |
| `idx_course_chapters_module_id` | module_id |

### Delete Behavior
Tenant/module delete: CASCADE.

### Business Rules

- Ordered via `sort_order` within a module.
- Soft-delete via `deleted_at`.

### Example Usage

Add chapter: `module_id`, `title = 'Kinematics'`, `sort_order = 1`.

---
## course_lessons

### Purpose
Individual lessons within a chapter (video, document, text, link, or mixed).

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `chapter_id` | CHAR(36) | No | — | FK to `course_chapters` |
| `title` | VARCHAR(200) | No | — | Title or heading |
| `lesson_type` | ENUM('video','document','text','link','mixed') | No | 'text' | Lesson content type |
| `content` | TEXT | Yes | — | Main text/HTML content |
| `video_url` | VARCHAR(500) | Yes | — | Video content URL |
| `duration_minutes` | INT UNSIGNED | Yes | — | Duration in minutes |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `status` | ENUM('active','inactive') | No | 'active' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_course_lessons_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_course_lessons_chapter` | `chapter_id` | `course_chapters`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_course_lessons_tenant_id` | tenant_id |
| `idx_course_lessons_chapter_id` | chapter_id |

### Delete Behavior
Tenant/chapter delete: CASCADE.

### Business Rules

- Ordered via `sort_order` within a chapter.
- `lesson_type` determines which content fields are populated.
- Soft-delete via `deleted_at`.

### Example Usage

Add video lesson: `chapter_id`, `lesson_type = 'video'`, `video_url`, `duration_minutes = 45`.

---
## enrollments

### Purpose
Student enrollment in a course, optionally assigned to a batch, with progress tracking.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `student_id` | CHAR(36) | No | — | FK to `student_profiles` |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `batch_id` | CHAR(36) | Yes | — | FK to `batches` |
| `status` | ENUM('pending','active','completed','cancelled','transferred') | No | 'pending' | Lifecycle/status flag |
| `enrolled_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Enrollment datetime |
| `completed_at` | DATETIME(6) | Yes | — | Completion datetime |
| `cancelled_at` | DATETIME(6) | Yes | — | Cancellation datetime |
| `progress_percent` | DECIMAL(5,2) | No | 0.00 | Completion percentage (0.00–100.00) |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_enrollments_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_enrollments_student` | `student_id` | `student_profiles`.`id` | CASCADE | CASCADE |
| `fk_enrollments_course` | `course_id` | `courses`.`id` | CASCADE | RESTRICT |
| `fk_enrollments_batch` | `batch_id` | `batches`.`id` | CASCADE | SET NULL |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_enrollments_student_course` | tenant_id, student_id, course_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_enrollments_tenant_id` | tenant_id |
| `idx_enrollments_student_id` | student_id |
| `idx_enrollments_course_id` | course_id |
| `idx_enrollments_batch_id` | batch_id |
| `idx_enrollments_status` | status |

### Delete Behavior
Tenant/student delete: CASCADE. Course delete: RESTRICT. Batch delete: SET NULL.

### Business Rules

- One enrollment per student per course per tenant.
- `progress_percent` should be recalculated from `lesson_progress`.
- Cannot delete course while enrollments exist (RESTRICT).

### Example Usage

Enroll student: `student_id`, `course_id`, `batch_id`, `status = 'active'`.

---
## lesson_progress

### Purpose
Per-enrollment progress tracking for individual lessons.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `enrollment_id` | CHAR(36) | No | — | FK to `enrollments` |
| `lesson_id` | CHAR(36) | No | — | FK to `course_lessons` |
| `status` | ENUM('not_started','in_progress','completed') | No | 'not_started' | Lifecycle/status flag |
| `progress_percent` | DECIMAL(5,2) | No | 0.00 | Completion percentage (0.00–100.00) |
| `started_at` | DATETIME(6) | Yes | — | Start datetime |
| `completed_at` | DATETIME(6) | Yes | — | Completion datetime |
| `last_accessed_at` | DATETIME(6) | Yes | — | Timestamp |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_lesson_progress_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_lesson_progress_enrollment` | `enrollment_id` | `enrollments`.`id` | CASCADE | CASCADE |
| `fk_lesson_progress_lesson` | `lesson_id` | `course_lessons`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_lesson_progress` | tenant_id, enrollment_id, lesson_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_lesson_progress_tenant_id` | tenant_id |
| `idx_lesson_progress_enrollment_id` | enrollment_id |

### Delete Behavior
Tenant/enrollment/lesson delete: CASCADE.

### Business Rules

- One progress row per (`tenant_id`, `enrollment_id`, `lesson_id`).
- Status flow: not_started → in_progress → completed.

### Example Usage

Track completion: `enrollment_id`, `lesson_id`, `status = 'completed'`, `progress_percent = 100`.

---
## study_materials

### Purpose
Downloadable or linked study resources attached to a course/batch.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `batch_id` | CHAR(36) | Yes | — | FK to `batches` |
| `title` | VARCHAR(200) | No | — | Title or heading |
| `material_type` | ENUM('pdf','notes','ppt','video','document','link') | No | — | Study material type |
| `file_url` | VARCHAR(500) | Yes | — | Uploaded file URL |
| `file_name` | VARCHAR(255) | Yes | — | Original uploaded file name |
| `file_size_bytes` | BIGINT UNSIGNED | Yes | — | File size in bytes |
| `mime_type` | VARCHAR(100) | Yes | — | MIME type of uploaded file |
| `description` | TEXT | Yes | — | Longer text description |
| `status` | ENUM('draft','published','archived') | No | 'draft' | Lifecycle/status flag |
| `uploaded_by` | CHAR(36) | Yes | — | FK to `users` who uploaded material |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_study_materials_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_study_materials_course` | `course_id` | `courses`.`id` | CASCADE | CASCADE |
| `fk_study_materials_batch` | `batch_id` | `batches`.`id` | CASCADE | SET NULL |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_study_materials_tenant_id` | tenant_id |
| `idx_study_materials_course_id` | course_id |
| `idx_study_materials_batch_id` | batch_id |
| `idx_study_materials_status` | status |

### Delete Behavior
Tenant/course delete: CASCADE. Batch delete: SET NULL.

### Business Rules

- Must belong to a course; batch is optional.
- Soft-delete via `deleted_at`.

### Example Usage

Upload notes: `course_id`, `material_type = 'pdf'`, `file_url`, `status = 'published'`.

---
## live_classes

### Purpose
Scheduled live teaching sessions with meeting links and recordings.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `batch_id` | CHAR(36) | Yes | — | FK to `batches` |
| `teacher_id` | CHAR(36) | No | — | FK to `teacher_profiles` |
| `title` | VARCHAR(200) | No | — | Title or heading |
| `description` | TEXT | Yes | — | Longer text description |
| `session_date` | DATE | No | — | Live class session date |
| `start_time` | TIME | No | — | Session/exam start time |
| `end_time` | TIME | No | — | Session/exam end time |
| `meeting_link` | VARCHAR(500) | Yes | — | Live class meeting URL (Zoom/Meet) |
| `recording_url` | VARCHAR(500) | Yes | — | Recorded session URL |
| `status` | ENUM('scheduled','live','completed','cancelled') | No | 'scheduled' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_live_classes_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_live_classes_course` | `course_id` | `courses`.`id` | CASCADE | CASCADE |
| `fk_live_classes_batch` | `batch_id` | `batches`.`id` | CASCADE | SET NULL |
| `fk_live_classes_teacher` | `teacher_id` | `teacher_profiles`.`id` | CASCADE | RESTRICT |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_live_classes_tenant_id` | tenant_id |
| `idx_live_classes_course_id` | course_id |
| `idx_live_classes_batch_id` | batch_id |
| `idx_live_classes_teacher_id` | teacher_id |
| `idx_live_classes_session_date` | session_date |
| `idx_live_classes_status` | status |

### Delete Behavior
Tenant/course delete: CASCADE. Batch delete: SET NULL. Teacher delete: RESTRICT.

### Business Rules

- Teacher cannot be deleted while live classes reference them (RESTRICT).
- Soft-delete via `deleted_at`.

### Example Usage

Schedule session: `course_id`, `teacher_id`, `session_date`, `start_time`, `meeting_link`.

---
## assignments

### Purpose
Course assignments with due dates, scoring, and attachments.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `batch_id` | CHAR(36) | Yes | — | FK to `batches` |
| `teacher_id` | CHAR(36) | Yes | — | FK to `teacher_profiles` |
| `title` | VARCHAR(200) | No | — | Title or heading |
| `description` | TEXT | Yes | — | Longer text description |
| `instructions` | TEXT | Yes | — | Instructions for students |
| `attachment_url` | VARCHAR(500) | Yes | — | Assignment attachment URL |
| `due_at` | DATETIME(6) | Yes | — | Timestamp |
| `max_score` | DECIMAL(5,2) | No | 100.00 | Maximum possible score |
| `status` | ENUM('draft','published','closed') | No | 'draft' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_assignments_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_assignments_course` | `course_id` | `courses`.`id` | CASCADE | CASCADE |
| `fk_assignments_batch` | `batch_id` | `batches`.`id` | CASCADE | SET NULL |
| `fk_assignments_teacher` | `teacher_id` | `teacher_profiles`.`id` | CASCADE | SET NULL |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_assignments_tenant_id` | tenant_id |
| `idx_assignments_course_id` | course_id |
| `idx_assignments_batch_id` | batch_id |
| `idx_assignments_teacher_id` | teacher_id |
| `idx_assignments_status` | status |
| `idx_assignments_due_at` | due_at |

### Delete Behavior
Tenant/course delete: CASCADE. Batch/teacher delete: SET NULL.

### Business Rules

- Must be `published` before students can submit.
- Soft-delete via `deleted_at`.

### Example Usage

Create homework: `course_id`, `title`, `due_at`, `max_score = 20`, `status = 'published'`.

---
## assignment_submissions

### Purpose
Student submissions for assignments with grading and feedback.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `assignment_id` | CHAR(36) | No | — | FK to `assignments` |
| `student_id` | CHAR(36) | No | — | FK to `student_profiles` |
| `enrollment_id` | CHAR(36) | No | — | FK to `enrollments` |
| `submission_text` | TEXT | Yes | — | Assignment submission text |
| `file_url` | VARCHAR(500) | Yes | — | Uploaded file URL |
| `file_name` | VARCHAR(255) | Yes | — | Original uploaded file name |
| `status` | ENUM('not_started','submitted','late','reviewed','closed') | No | 'not_started' | Lifecycle/status flag |
| `score` | DECIMAL(5,2) | Yes | — | Achieved score |
| `feedback` | TEXT | Yes | — | Reviewer feedback text |
| `submitted_at` | DATETIME(6) | Yes | — | Submission datetime |
| `reviewed_at` | DATETIME(6) | Yes | — | Review datetime |
| `reviewed_by` | CHAR(36) | Yes | — | FK to `users` who reviewed submission |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_assignment_submissions_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_assignment_submissions_assignment` | `assignment_id` | `assignments`.`id` | CASCADE | CASCADE |
| `fk_assignment_submissions_student` | `student_id` | `student_profiles`.`id` | CASCADE | CASCADE |
| `fk_assignment_submissions_enrollment` | `enrollment_id` | `enrollments`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_assignment_submissions` | tenant_id, assignment_id, student_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_assignment_submissions_tenant_id` | tenant_id |
| `idx_assignment_submissions_assignment_id` | assignment_id |
| `idx_assignment_submissions_student_id` | student_id |
| `idx_assignment_submissions_status` | status |

### Delete Behavior
Tenant/assignment/student/enrollment delete: CASCADE.

### Business Rules

- One submission record per student per assignment per tenant.
- Late submissions flagged via `status = late` when past `due_at`.

### Example Usage

Student submits: `assignment_id`, `student_id`, `file_url`, `status = 'submitted'`.

---
## quizzes

### Purpose
Course quizzes with attempt limits, duration, and availability windows.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `batch_id` | CHAR(36) | Yes | — | FK to `batches` |
| `teacher_id` | CHAR(36) | Yes | — | FK to `teacher_profiles` |
| `title` | VARCHAR(200) | No | — | Title or heading |
| `description` | TEXT | Yes | — | Longer text description |
| `duration_minutes` | INT UNSIGNED | Yes | — | Duration in minutes |
| `max_attempts` | INT UNSIGNED | No | 1 | Maximum quiz attempts allowed |
| `passing_score` | DECIMAL(5,2) | Yes | — | Minimum score to pass |
| `available_from` | DATETIME(6) | Yes | — | Quiz available-from datetime |
| `available_until` | DATETIME(6) | Yes | — | Quiz available-until datetime |
| `status` | ENUM('draft','published','closed') | No | 'draft' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_quizzes_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_quizzes_course` | `course_id` | `courses`.`id` | CASCADE | CASCADE |
| `fk_quizzes_batch` | `batch_id` | `batches`.`id` | CASCADE | SET NULL |
| `fk_quizzes_teacher` | `teacher_id` | `teacher_profiles`.`id` | CASCADE | SET NULL |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_quizzes_tenant_id` | tenant_id |
| `idx_quizzes_course_id` | course_id |
| `idx_quizzes_batch_id` | batch_id |
| `idx_quizzes_status` | status |

### Delete Behavior
Tenant/course delete: CASCADE. Batch/teacher delete: SET NULL.

### Business Rules

- `max_attempts` defaults to 1.
- Availability controlled by `available_from` / `available_until`.
- Soft-delete via `deleted_at`.

### Example Usage

Create quiz: `course_id`, `duration_minutes = 30`, `max_attempts = 2`, `passing_score = 60`.

---
## quiz_questions

### Purpose
Questions belonging to a quiz (MCQ or short text).

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `quiz_id` | CHAR(36) | No | — | FK to `quizzes` |
| `question_text` | TEXT | No | — | Question prompt text |
| `question_type` | ENUM('mcq','short_text') | No | 'mcq' | Question format (`mcq` or `short_text`) |
| `points` | DECIMAL(5,2) | No | 1.00 | Question point value |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_quiz_questions_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_quiz_questions_quiz` | `quiz_id` | `quizzes`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_quiz_questions_tenant_id` | tenant_id |
| `idx_quiz_questions_quiz_id` | quiz_id |

### Delete Behavior
Tenant/quiz delete: CASCADE.

### Business Rules

- MCQ questions require options in `quiz_question_options`.
- Soft-delete via `deleted_at`.

### Example Usage

Add MCQ: `quiz_id`, `question_text`, `question_type = 'mcq'`, `points = 2`.

---
## quiz_question_options

### Purpose
Answer options for MCQ quiz questions.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `question_id` | CHAR(36) | No | — | FK to quiz/exam question table |
| `option_text` | VARCHAR(500) | No | — | MCQ answer option text |
| `is_correct` | TINYINT(1) | No | 0 | Correct answer flag for MCQ option |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_quiz_question_options_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_quiz_question_options_question` | `question_id` | `quiz_questions`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_quiz_question_options_tenant_id` | tenant_id |
| `idx_quiz_question_options_question_id` | question_id |

### Delete Behavior
Tenant/question delete: CASCADE.

### Business Rules

- At least one option should have `is_correct = 1` per MCQ (application layer).

### Example Usage

Add options: `question_id`, `option_text`, `is_correct = 1` for correct answer.

---
## quiz_attempts

### Purpose
Student quiz attempt records with scoring.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `quiz_id` | CHAR(36) | No | — | FK to `quizzes` |
| `student_id` | CHAR(36) | No | — | FK to `student_profiles` |
| `enrollment_id` | CHAR(36) | No | — | FK to `enrollments` |
| `attempt_number` | INT UNSIGNED | No | 1 | Attempt sequence number (1-based) |
| `status` | ENUM('in_progress','submitted','graded','abandoned') | No | 'in_progress' | Lifecycle/status flag |
| `score` | DECIMAL(5,2) | Yes | — | Achieved score |
| `max_score` | DECIMAL(5,2) | Yes | — | Maximum possible score |
| `started_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Start datetime |
| `submitted_at` | DATETIME(6) | Yes | — | Submission datetime |
| `graded_at` | DATETIME(6) | Yes | — | Grading datetime |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_quiz_attempts_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_quiz_attempts_quiz` | `quiz_id` | `quizzes`.`id` | CASCADE | CASCADE |
| `fk_quiz_attempts_student` | `student_id` | `student_profiles`.`id` | CASCADE | CASCADE |
| `fk_quiz_attempts_enrollment` | `enrollment_id` | `enrollments`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_quiz_attempts` | tenant_id, quiz_id, student_id, attempt_number |

### Indexes

| Index | Columns |
|---|---|
| `idx_quiz_attempts_tenant_id` | tenant_id |
| `idx_quiz_attempts_quiz_id` | quiz_id |
| `idx_quiz_attempts_student_id` | student_id |
| `idx_quiz_attempts_status` | status |

### Delete Behavior
Tenant/quiz/student/enrollment delete: CASCADE.

### Business Rules

- Unique per (`tenant_id`, `quiz_id`, `student_id`, `attempt_number`).
- Attempt number increments for retakes within `max_attempts`.

### Example Usage

Start attempt: `quiz_id`, `student_id`, `enrollment_id`, `attempt_number = 1`, `status = 'in_progress'`.

---
## quiz_answers

### Purpose
Individual answers within a quiz attempt.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `attempt_id` | CHAR(36) | No | — | FK to quiz/exam attempt table |
| `question_id` | CHAR(36) | No | — | FK to quiz/exam question table |
| `selected_option_id` | CHAR(36) | Yes | — | FK to selected MCQ option |
| `answer_text` | TEXT | Yes | — | Free-text student answer |
| `is_correct` | TINYINT(1) | Yes | — | Correct answer flag for MCQ option |
| `points_awarded` | DECIMAL(5,2) | Yes | — | Points awarded for answer |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_quiz_answers_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_quiz_answers_attempt` | `attempt_id` | `quiz_attempts`.`id` | CASCADE | CASCADE |
| `fk_quiz_answers_question` | `question_id` | `quiz_questions`.`id` | CASCADE | CASCADE |
| `fk_quiz_answers_option` | `selected_option_id` | `quiz_question_options`.`id` | CASCADE | SET NULL |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_quiz_answers` | tenant_id, attempt_id, question_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_quiz_answers_tenant_id` | tenant_id |
| `idx_quiz_answers_attempt_id` | attempt_id |

### Delete Behavior
Tenant/attempt/question delete: CASCADE. Option delete: SET NULL.

### Business Rules

- One answer per question per attempt.
- MCQ uses `selected_option_id`; short text uses `answer_text`.

### Example Usage

Record answer: `attempt_id`, `question_id`, `selected_option_id`, `is_correct = 1`.

---
## exams

### Purpose
Formal exams with scheduling, duration, and online/offline mode.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `batch_id` | CHAR(36) | Yes | — | FK to `batches` |
| `title` | VARCHAR(200) | No | — | Title or heading |
| `description` | TEXT | Yes | — | Longer text description |
| `exam_date` | DATE | No | — | Exam date |
| `start_time` | TIME | Yes | — | Session/exam start time |
| `end_time` | TIME | Yes | — | Session/exam end time |
| `duration_minutes` | INT UNSIGNED | Yes | — | Duration in minutes |
| `max_score` | DECIMAL(5,2) | No | 100.00 | Maximum possible score |
| `is_online` | TINYINT(1) | No | 0 | Online exam flag (1 = online) |
| `status` | ENUM('draft','scheduled','in_progress','completed','cancelled') | No | 'draft' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_exams_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_exams_course` | `course_id` | `courses`.`id` | CASCADE | CASCADE |
| `fk_exams_batch` | `batch_id` | `batches`.`id` | CASCADE | SET NULL |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_exams_tenant_id` | tenant_id |
| `idx_exams_course_id` | course_id |
| `idx_exams_batch_id` | batch_id |
| `idx_exams_exam_date` | exam_date |
| `idx_exams_status` | status |

### Delete Behavior
Tenant/course delete: CASCADE. Batch delete: SET NULL.

### Business Rules

- One attempt per student per exam (`uk_exam_attempts`).
- Soft-delete via `deleted_at`.

### Example Usage

Schedule exam: `course_id`, `exam_date`, `duration_minutes = 180`, `is_online = 1`.

---
## exam_questions

### Purpose
Questions belonging to an exam (MCQ or short text).

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `exam_id` | CHAR(36) | No | — | FK to `exams` |
| `question_text` | TEXT | No | — | Question prompt text |
| `question_type` | ENUM('mcq','short_text') | No | 'mcq' | Question format (`mcq` or `short_text`) |
| `points` | DECIMAL(5,2) | No | 1.00 | Question point value |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_exam_questions_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_exam_questions_exam` | `exam_id` | `exams`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_exam_questions_tenant_id` | tenant_id |
| `idx_exam_questions_exam_id` | exam_id |

### Delete Behavior
Tenant/exam delete: CASCADE.

### Business Rules

- MCQ questions require options in `exam_question_options`.
- Soft-delete via `deleted_at`.

### Example Usage

Add question: `exam_id`, `question_text`, `points = 5`.

---
## exam_question_options

### Purpose
Answer options for MCQ exam questions.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `question_id` | CHAR(36) | No | — | FK to quiz/exam question table |
| `option_text` | VARCHAR(500) | No | — | MCQ answer option text |
| `is_correct` | TINYINT(1) | No | 0 | Correct answer flag for MCQ option |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_exam_question_options_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_exam_question_options_question` | `question_id` | `exam_questions`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_exam_question_options_tenant_id` | tenant_id |
| `idx_exam_question_options_question_id` | question_id |

### Delete Behavior
Tenant/question delete: CASCADE.

### Business Rules

- At least one option should have `is_correct = 1` per MCQ (application layer).

### Example Usage

Add options: `question_id`, `option_text`, `is_correct`.

---
## exam_attempts

### Purpose
Student exam attempt records (one per student per exam).

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `exam_id` | CHAR(36) | No | — | FK to `exams` |
| `student_id` | CHAR(36) | No | — | FK to `student_profiles` |
| `enrollment_id` | CHAR(36) | No | — | FK to `enrollments` |
| `status` | ENUM('in_progress','submitted','graded','absent') | No | 'in_progress' | Lifecycle/status flag |
| `score` | DECIMAL(5,2) | Yes | — | Achieved score |
| `max_score` | DECIMAL(5,2) | Yes | — | Maximum possible score |
| `started_at` | DATETIME(6) | Yes | — | Start datetime |
| `submitted_at` | DATETIME(6) | Yes | — | Submission datetime |
| `graded_at` | DATETIME(6) | Yes | — | Grading datetime |
| `graded_by` | CHAR(36) | Yes | — | FK to `users` who graded attempt |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_exam_attempts_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_exam_attempts_exam` | `exam_id` | `exams`.`id` | CASCADE | CASCADE |
| `fk_exam_attempts_student` | `student_id` | `student_profiles`.`id` | CASCADE | CASCADE |
| `fk_exam_attempts_enrollment` | `enrollment_id` | `enrollments`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_exam_attempts` | tenant_id, exam_id, student_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_exam_attempts_tenant_id` | tenant_id |
| `idx_exam_attempts_exam_id` | exam_id |
| `idx_exam_attempts_student_id` | student_id |

### Delete Behavior
Tenant/exam/student/enrollment delete: CASCADE.

### Business Rules

- Unique per (`tenant_id`, `exam_id`, `student_id`).
- Status `absent` for no-show students.

### Example Usage

Student takes exam: `exam_id`, `student_id`, `status = 'submitted'`, `score = 85`.

---
## exam_answers

### Purpose
Individual answers within an exam attempt.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `attempt_id` | CHAR(36) | No | — | FK to quiz/exam attempt table |
| `question_id` | CHAR(36) | No | — | FK to quiz/exam question table |
| `selected_option_id` | CHAR(36) | Yes | — | FK to selected MCQ option |
| `answer_text` | TEXT | Yes | — | Free-text student answer |
| `is_correct` | TINYINT(1) | Yes | — | Correct answer flag for MCQ option |
| `points_awarded` | DECIMAL(5,2) | Yes | — | Points awarded for answer |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_exam_answers_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_exam_answers_attempt` | `attempt_id` | `exam_attempts`.`id` | CASCADE | CASCADE |
| `fk_exam_answers_question` | `question_id` | `exam_questions`.`id` | CASCADE | CASCADE |
| `fk_exam_answers_option` | `selected_option_id` | `exam_question_options`.`id` | CASCADE | SET NULL |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_exam_answers` | tenant_id, attempt_id, question_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_exam_answers_tenant_id` | tenant_id |
| `idx_exam_answers_attempt_id` | attempt_id |

### Delete Behavior
Tenant/attempt/question delete: CASCADE. Option delete: SET NULL.

### Business Rules

- One answer per question per attempt.

### Example Usage

Record answer: `attempt_id`, `question_id`, `selected_option_id`.

---
## marks

### Purpose
Unified gradebook entries from assignments, quizzes, exams, or manual entry.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `student_id` | CHAR(36) | No | — | FK to `student_profiles` |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `enrollment_id` | CHAR(36) | No | — | FK to `enrollments` |
| `assessment_type` | ENUM('assignment','quiz','exam','manual') | No | — | Source assessment type for mark |
| `assessment_id` | CHAR(36) | Yes | — | Polymorphic FK to source assessment |
| `title` | VARCHAR(200) | No | — | Title or heading |
| `score` | DECIMAL(5,2) | No | — | Achieved score |
| `max_score` | DECIMAL(5,2) | No | 100.00 | Maximum possible score |
| `remarks` | TEXT | Yes | — | Additional remarks or comments |
| `recorded_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Mark recorded datetime |
| `recorded_by` | CHAR(36) | Yes | — | FK to `users` who recorded mark |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_marks_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_marks_student` | `student_id` | `student_profiles`.`id` | CASCADE | CASCADE |
| `fk_marks_course` | `course_id` | `courses`.`id` | CASCADE | CASCADE |
| `fk_marks_enrollment` | `enrollment_id` | `enrollments`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_marks_tenant_id` | tenant_id |
| `idx_marks_student_id` | student_id |
| `idx_marks_course_id` | course_id |
| `idx_marks_enrollment_id` | enrollment_id |
| `idx_marks_assessment` | tenant_id, assessment_type, assessment_id |

### Delete Behavior
Tenant/student/course/enrollment delete: CASCADE.

### Business Rules

- `assessment_type` + `assessment_id` polymorphically references source assessment.
- Can aggregate assignment, quiz, exam, or manual grades.

### Example Usage

Gradebook entry: `assessment_type = 'exam'`, `assessment_id`, `score = 85`, `max_score = 100`.

---
## attendance_records

### Purpose
Daily/session attendance for students in courses, batches, or live classes.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `student_id` | CHAR(36) | No | — | FK to `student_profiles` |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `batch_id` | CHAR(36) | Yes | — | FK to `batches` |
| `live_class_id` | CHAR(36) | Yes | — | FK to `live_classes` |
| `attendance_date` | DATE | No | — | Attendance date |
| `status` | ENUM('present','absent','late') | No | 'absent' | Lifecycle/status flag |
| `remarks` | VARCHAR(500) | Yes | — | Additional remarks or comments |
| `marked_by` | CHAR(36) | Yes | — | FK to `users` who marked attendance |
| `marked_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Attendance marked datetime |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_attendance_records_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_attendance_records_student` | `student_id` | `student_profiles`.`id` | CASCADE | CASCADE |
| `fk_attendance_records_course` | `course_id` | `courses`.`id` | CASCADE | CASCADE |
| `fk_attendance_records_batch` | `batch_id` | `batches`.`id` | CASCADE | SET NULL |
| `fk_attendance_records_live_class` | `live_class_id` | `live_classes`.`id` | CASCADE | SET NULL |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_attendance_session` | tenant_id, student_id, attendance_date, course_id, batch_id, live_class_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_attendance_records_tenant_id` | tenant_id |
| `idx_attendance_records_student_id` | student_id |
| `idx_attendance_records_course_id` | course_id |
| `idx_attendance_records_date` | attendance_date |

### Delete Behavior
Tenant/student/course delete: CASCADE. Batch/live_class delete: SET NULL.

### Business Rules

- Unique per session: (`tenant_id`, `student_id`, `attendance_date`, `course_id`, `batch_id`, `live_class_id`).
- Default status is `absent` until marked present/late.

### Example Usage

Mark present: `student_id`, `course_id`, `attendance_date`, `status = 'present'`.

---
## payments

### Purpose
Payment transactions for course enrollments.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `student_id` | CHAR(36) | No | — | FK to `student_profiles` |
| `enrollment_id` | CHAR(36) | Yes | — | FK to `enrollments` |
| `course_id` | CHAR(36) | Yes | — | FK to `courses` |
| `amount` | DECIMAL(12,2) | No | — | Payment amount |
| `currency` | CHAR(3) | No | 'INR' | ISO 4217 currency code |
| `payment_method` | VARCHAR(50) | Yes | — | Payment method label |
| `transaction_ref` | VARCHAR(100) | Yes | — | Payment gateway transaction reference |
| `status` | ENUM('pending','completed','failed','refunded','cancelled') | No | 'pending' | Lifecycle/status flag |
| `paid_at` | DATETIME(6) | Yes | — | Payment completion datetime |
| `notes` | TEXT | Yes | — | Free-form notes |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_payments_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_payments_student` | `student_id` | `student_profiles`.`id` | CASCADE | RESTRICT |
| `fk_payments_enrollment` | `enrollment_id` | `enrollments`.`id` | CASCADE | SET NULL |
| `fk_payments_course` | `course_id` | `courses`.`id` | CASCADE | SET NULL |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_payments_tenant_id` | tenant_id |
| `idx_payments_student_id` | student_id |
| `idx_payments_enrollment_id` | enrollment_id |
| `idx_payments_status` | status |
| `idx_payments_paid_at` | paid_at |

### Delete Behavior
Tenant delete: CASCADE. Student delete: RESTRICT. Enrollment/course delete: SET NULL.

### Business Rules

- Student deletion RESTRICTed while payments exist.
- Status flow: pending → completed/failed/refunded/cancelled.

### Example Usage

Record payment: `student_id`, `course_id`, `amount = 5000`, `status = 'completed'`, `paid_at`.

---
## coupons

### Purpose
Discount coupon definitions for tenant checkout.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `code` | VARCHAR(50) | No | — | Short unique code within scope |
| `description` | VARCHAR(500) | Yes | — | Longer text description |
| `discount_type` | ENUM('percentage','fixed') | No | 'percentage' | Coupon type: `percentage` or `fixed` |
| `discount_value` | DECIMAL(12,2) | No | — | Discount amount or percentage value |
| `max_uses` | INT UNSIGNED | Yes | — | Maximum coupon redemptions allowed |
| `used_count` | INT UNSIGNED | No | 0 | Current coupon redemption count |
| `min_order_amount` | DECIMAL(12,2) | Yes | — | Minimum order for coupon eligibility |
| `valid_from` | DATETIME(6) | Yes | — | Coupon valid-from datetime |
| `valid_until` | DATETIME(6) | Yes | — | Coupon valid-until datetime |
| `status` | ENUM('active','inactive','expired') | No | 'active' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_coupons_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_coupons_code` | tenant_id, code |

### Indexes

| Index | Columns |
|---|---|
| `idx_coupons_tenant_id` | tenant_id |
| `idx_coupons_status` | status |

### Delete Behavior
Tenant delete: CASCADE. Referenced by redemptions: RESTRICT.

### Business Rules

- Coupon `code` unique per tenant.
- `used_count` incremented on each redemption.
- Soft-delete via `deleted_at`.

### Example Usage

Create coupon: `code = 'WELCOME10'`, `discount_type = 'percentage'`, `discount_value = 10`.

---
## coupon_redemptions

### Purpose
Records of coupon usage against payments.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `coupon_id` | CHAR(36) | No | — | FK to `coupons` |
| `payment_id` | CHAR(36) | No | — | FK to `payments` |
| `student_id` | CHAR(36) | No | — | FK to `student_profiles` |
| `discount_amount` | DECIMAL(12,2) | No | — | Applied discount amount in currency |
| `redeemed_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Coupon redemption datetime |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_coupon_redemptions_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_coupon_redemptions_coupon` | `coupon_id` | `coupons`.`id` | CASCADE | RESTRICT |
| `fk_coupon_redemptions_payment` | `payment_id` | `payments`.`id` | CASCADE | CASCADE |
| `fk_coupon_redemptions_student` | `student_id` | `student_profiles`.`id` | CASCADE | RESTRICT |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_coupon_redemptions_tenant_id` | tenant_id |
| `idx_coupon_redemptions_coupon_id` | coupon_id |
| `idx_coupon_redemptions_payment_id` | payment_id |

### Delete Behavior
Tenant/payment delete: CASCADE. Coupon/student delete: RESTRICT.

### Business Rules

- Coupon deletion RESTRICTed while redemptions exist.
- Links coupon, payment, and student for audit trail.

### Example Usage

Apply coupon: `coupon_id`, `payment_id`, `student_id`, `discount_amount = 500`.

---
## wishlist_items

### Purpose
Student saved/favorited courses.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `student_id` | CHAR(36) | No | — | FK to `student_profiles` |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_wishlist_items_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_wishlist_items_student` | `student_id` | `student_profiles`.`id` | CASCADE | CASCADE |
| `fk_wishlist_items_course` | `course_id` | `courses`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_wishlist_items` | tenant_id, student_id, course_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_wishlist_items_tenant_id` | tenant_id |

### Delete Behavior
Tenant/student/course delete: CASCADE.

### Business Rules

- One wishlist entry per student per course per tenant.

### Example Usage

Student saves course: `student_id`, `course_id`.

---
## certificates

### Purpose
Completion certificates issued to students for course enrollments.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `student_id` | CHAR(36) | No | — | FK to `student_profiles` |
| `course_id` | CHAR(36) | No | — | FK to `courses` |
| `enrollment_id` | CHAR(36) | No | — | FK to `enrollments` |
| `certificate_number` | VARCHAR(100) | No | — | Unique certificate serial number |
| `issued_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Certificate issue datetime |
| `file_url` | VARCHAR(500) | Yes | — | Uploaded file URL |
| `status` | ENUM('issued','revoked') | No | 'issued' | Lifecycle/status flag |
| `issued_by` | CHAR(36) | Yes | — | FK to `users` who issued certificate |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_certificates_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_certificates_student` | `student_id` | `student_profiles`.`id` | CASCADE | CASCADE |
| `fk_certificates_course` | `course_id` | `courses`.`id` | CASCADE | RESTRICT |
| `fk_certificates_enrollment` | `enrollment_id` | `enrollments`.`id` | CASCADE | RESTRICT |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_certificates_number` | tenant_id, certificate_number |
| `uk_certificates_enrollment` | tenant_id, enrollment_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_certificates_tenant_id` | tenant_id |
| `idx_certificates_student_id` | student_id |

### Delete Behavior
Tenant/student delete: CASCADE. Course/enrollment delete: RESTRICT.

### Business Rules

- One certificate per enrollment (`uk_certificates_enrollment`).
- `certificate_number` unique per tenant.
- Enrollment and course deletion RESTRICTed while certificate exists.

### Example Usage

Issue certificate: `enrollment_id`, `certificate_number = 'CERT-2026-001'`, `file_url`.

---
## blog_posts

### Purpose
Tenant CMS blog content with SEO metadata.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `title` | VARCHAR(250) | No | — | Title or heading |
| `slug` | VARCHAR(270) | No | — | URL-safe unique identifier |
| `excerpt` | TEXT | Yes | — | Short summary excerpt |
| `content` | LONGTEXT | Yes | — | Main text/HTML content |
| `category` | VARCHAR(100) | Yes | — | Content category |
| `author_name` | VARCHAR(150) | Yes | — | Author display name |
| `author_user_id` | CHAR(36) | Yes | — | FK to `users` — blog post author |
| `thumbnail_url` | VARCHAR(500) | Yes | — | Thumbnail image URL |
| `tags_json` | JSON | Yes | — | JSON array of blog tags |
| `seo_title` | VARCHAR(250) | Yes | — | SEO page title |
| `seo_description` | VARCHAR(500) | Yes | — | SEO meta description |
| `status` | ENUM('draft','published','archived') | No | 'draft' | Lifecycle/status flag |
| `published_at` | DATETIME(6) | Yes | — | Blog publish datetime |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_blog_posts_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_blog_posts_slug` | tenant_id, slug |

### Indexes

| Index | Columns |
|---|---|
| `idx_blog_posts_tenant_id` | tenant_id |
| `idx_blog_posts_status` | status |
| `idx_blog_posts_published_at` | published_at |

### Delete Behavior
Tenant delete: CASCADE.

### Business Rules

- Slug unique per tenant.
- Soft-delete via `deleted_at`.

### Example Usage

Publish post: `title`, `slug`, `content`, `status = 'published'`, `published_at`.

---
## gallery_items

### Purpose
Media gallery entries (images/videos) for tenant website.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `title` | VARCHAR(200) | Yes | — | Title or heading |
| `media_type` | ENUM('image','video') | No | 'image' | Gallery media type (`image` or `video`) |
| `media_url` | VARCHAR(500) | No | — | Gallery media URL |
| `thumbnail_url` | VARCHAR(500) | Yes | — | Thumbnail image URL |
| `description` | TEXT | Yes | — | Longer text description |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `status` | ENUM('active','inactive') | No | 'active' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_gallery_items_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_gallery_items_tenant_id` | tenant_id |
| `idx_gallery_items_status` | status |

### Delete Behavior
Tenant delete: CASCADE.

### Business Rules

- Ordered via `sort_order`.
- Soft-delete via `deleted_at`.

### Example Usage

Add photo: `media_type = 'image'`, `media_url`, `sort_order = 1`.

---
## faqs

### Purpose
Frequently asked questions for tenant public site.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `question` | VARCHAR(500) | No | — | FAQ question text |
| `answer` | TEXT | No | — | FAQ answer text |
| `category` | VARCHAR(100) | Yes | — | Content category |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `status` | ENUM('active','inactive') | No | 'active' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_faqs_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_faqs_tenant_id` | tenant_id |
| `idx_faqs_status` | status |

### Delete Behavior
Tenant delete: CASCADE.

### Business Rules

- Ordered via `sort_order`.
- Soft-delete via `deleted_at`.

### Example Usage

Add FAQ: `question`, `answer`, `category = 'Admissions'`.

---
## testimonials

### Purpose
Student/parent testimonials displayed on tenant site.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `author_name` | VARCHAR(150) | No | — | Author display name |
| `author_title` | VARCHAR(150) | Yes | — | Author title/role |
| `content` | TEXT | No | — | Main text/HTML content |
| `rating` | TINYINT UNSIGNED | Yes | — | Testimonial rating (1–5) |
| `image_url` | VARCHAR(500) | Yes | — | Testimonial author image URL |
| `sort_order` | INT | No | 0 | Display sort order (ascending) |
| `status` | ENUM('active','inactive') | No | 'active' | Lifecycle/status flag |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |
| `deleted_at` | DATETIME(6) | Yes | — | Soft-delete timestamp (NULL = active) |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_testimonials_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_testimonials_tenant_id` | tenant_id |
| `idx_testimonials_status` | status |

### Delete Behavior
Tenant delete: CASCADE.

### Business Rules

- `rating` is 1–5 when set.
- Soft-delete via `deleted_at`.

### Example Usage

Add review: `author_name`, `content`, `rating = 5`.

---
## notifications

### Purpose
Tenant-wide or targeted notifications with scheduling.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `title` | VARCHAR(200) | No | — | Title or heading |
| `message` | TEXT | No | — | Notification or reply message body |
| `notification_type` | ENUM('info','warning','success','alert') | No | 'info' | Notification severity/type |
| `audience_type` | ENUM('all','students','teachers','owners','specific_user') | No | 'all' | Notification audience targeting |
| `target_user_id` | CHAR(36) | Yes | — | FK to `users` — specific notification target |
| `status` | ENUM('draft','scheduled','sent','cancelled') | No | 'draft' | Lifecycle/status flag |
| `scheduled_at` | DATETIME(6) | Yes | — | Notification scheduled datetime |
| `sent_at` | DATETIME(6) | Yes | — | Notification sent datetime |
| `created_by` | CHAR(36) | Yes | — | FK to `users` who created the record |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_notifications_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_notifications_tenant_id` | tenant_id |
| `idx_notifications_status` | status |
| `idx_notifications_scheduled_at` | scheduled_at |

### Delete Behavior
Tenant delete: CASCADE.

### Business Rules

- Audience targeting via `audience_type` and optional `target_user_id`.
- Scheduled notifications use `scheduled_at`; set `sent_at` on delivery.

### Example Usage

Send alert: `title`, `message`, `audience_type = 'students'`, `status = 'sent'`.

---
## notification_recipients

### Purpose
Per-user delivery and read-status for notifications.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `notification_id` | CHAR(36) | No | — | FK to `notifications` |
| `user_id` | CHAR(36) | No | — | FK to `users` |
| `is_read` | TINYINT(1) | No | 0 | Notification read flag |
| `read_at` | DATETIME(6) | Yes | — | Notification read datetime |
| `delivered_at` | DATETIME(6) | Yes | — | Notification delivered datetime |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_notification_recipients_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_notification_recipients_notification` | `notification_id` | `notifications`.`id` | CASCADE | CASCADE |
| `fk_notification_recipients_user` | `user_id` | `users`.`id` | CASCADE | CASCADE |

### Unique Constraints

| Constraint | Columns |
|---|---|
| `uk_notification_recipients` | tenant_id, notification_id, user_id |

### Indexes

| Index | Columns |
|---|---|
| `idx_notification_recipients_tenant_id` | tenant_id |
| `idx_notification_recipients_user_id` | user_id |
| `idx_notification_recipients_is_read` | is_read |

### Delete Behavior
Tenant/notification/user delete: CASCADE.

### Business Rules

- One row per (`tenant_id`, `notification_id`, `user_id`).
- Track read status via `is_read` and `read_at`.

### Example Usage

Deliver to user: `notification_id`, `user_id`, `delivered_at`.

---
## contact_messages

### Purpose
Inbound contact form submissions from tenant public site.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `name` | VARCHAR(150) | No | — | Display name |
| `email` | VARCHAR(255) | No | — | Email address |
| `phone` | VARCHAR(30) | Yes | — | Phone number |
| `subject` | VARCHAR(250) | Yes | — | Message subject line |
| `message` | TEXT | No | — | Notification or reply message body |
| `status` | ENUM('new','read','replied','archived') | No | 'new' | Lifecycle/status flag |
| `replied_at` | DATETIME(6) | Yes | — | Contact reply datetime |
| `replied_by` | CHAR(36) | Yes | — | FK to `users` who replied to contact message |
| `reply_message` | TEXT | Yes | — | Admin reply to contact message |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |
| `updated_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) | Last update timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_contact_messages_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_contact_messages_tenant_id` | tenant_id |
| `idx_contact_messages_status` | status |
| `idx_contact_messages_created_at` | created_at |

### Delete Behavior
Tenant delete: CASCADE.

### Business Rules

- Status workflow: new → read → replied → archived.
- Inbound only — no FK to users table.

### Example Usage

Store inquiry: `name`, `email`, `message`, `status = 'new'`.

---
## tenant_audit_logs

### Purpose
Immutable audit trail for tenant-scoped actions.

### Level (Platform/Tenant)
Tenant

### Primary Key
`id`

### tenant_id (Required/Not Required/Nullable)
Required

### Columns

| Column | Data Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | CHAR(36) | No | — | Primary key UUID |
| `tenant_id` | CHAR(36) | No | — | Owning tenant FK |
| `actor_user_id` | CHAR(36) | Yes | — | FK to `users` — who performed the action |
| `action` | VARCHAR(100) | No | — | Audit action identifier (e.g. `course.publish`) |
| `entity_type` | VARCHAR(100) | No | — | Audited entity table/type name |
| `entity_id` | CHAR(36) | Yes | — | UUID of audited entity |
| `metadata_json` | JSON | Yes | — | JSON metadata for audit/context |
| `ip_address` | VARCHAR(45) | Yes | — | Client IP address (IPv4/IPv6) |
| `user_agent` | VARCHAR(500) | Yes | — | Client user-agent string |
| `created_at` | DATETIME(6) | No | CURRENT_TIMESTAMP(6) | Record creation timestamp |

### Foreign Keys

| Constraint | Column | References | ON UPDATE | ON DELETE |
|---|---|---|---|---|
| `fk_tenant_audit_logs_tenant` | `tenant_id` | `tenants`.`id` | CASCADE | CASCADE |
| `fk_tenant_audit_logs_actor` | `actor_user_id` | `users`.`id` | CASCADE | SET NULL |

### Unique Constraints

None (beyond primary key).

### Indexes

| Index | Columns |
|---|---|
| `idx_tenant_audit_logs_tenant_id` | tenant_id |
| `idx_tenant_audit_logs_actor` | actor_user_id |
| `idx_tenant_audit_logs_entity` | entity_type, entity_id |
| `idx_tenant_audit_logs_created_at` | created_at |

### Delete Behavior
Tenant delete: CASCADE. Actor user delete: SET NULL.

### Business Rules

- Append-only — no updates or deletes.
- Every query MUST filter by `tenant_id`.

### Example Usage

Log course publish: `action = 'course.publish'`, `entity_type = 'courses'`, `entity_id`.

---
