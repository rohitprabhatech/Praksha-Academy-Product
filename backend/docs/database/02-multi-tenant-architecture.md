# 02 — Multi-Tenant Architecture

## What is a Tenant?

A **tenant** is a customer organization that purchases and uses the Praksha Academy platform. Each tenant represents one education institute (academy).

Examples:
- Praksha Academy Pune
- Delhi Coaching Center
- Mumbai Science Academy

Each tenant has its own:
- Academy profile and branding
- Users (owner, teachers, students)
- Courses, batches, and academic data
- Subscriptions and billing history
- CMS content and notifications

Tenants are registered in the `tenants` table and identified by a UUID (`id`) and a human-readable `tenant_code`.

---

## Why `tenant_id` is Required

Without `tenant_id`, all academies would share the same data rows. A teacher at Tenant A could see students from Tenant B.

`tenant_id` is the **primary isolation mechanism**. It ensures:

1. Every query for tenant data is scoped to one tenant
2. Unique constraints are per-tenant (e.g., two tenants can both have a "Python" course)
3. Foreign keys maintain referential integrity within a tenant boundary
4. Audit logs are attributable to the correct tenant

---

## Which Tables Require `tenant_id`

### Tables WITH `tenant_id` (Tenant-Level — 42 tables)

All business data owned by a customer academy:

`tenant_profiles`, `teacher_profiles`, `student_profiles`, `academic_classes`, `subjects`, `batches`, `courses`, `course_teachers`, `course_modules`, `course_chapters`, `course_lessons`, `enrollments`, `lesson_progress`, `study_materials`, `live_classes`, `assignments`, `assignment_submissions`, `quizzes`, `quiz_questions`, `quiz_question_options`, `quiz_attempts`, `quiz_answers`, `exams`, `exam_questions`, `exam_question_options`, `exam_attempts`, `exam_answers`, `marks`, `attendance_records`, `payments`, `coupons`, `coupon_redemptions`, `wishlist_items`, `certificates`, `blog_posts`, `gallery_items`, `faqs`, `testimonials`, `notifications`, `notification_recipients`, `contact_messages`, `tenant_audit_logs`

Additionally, `users` has nullable `tenant_id` (NULL for platform users, set for tenant users), and `user_roles` has nullable `tenant_id` for tenant-scoped role assignments.

### Tables WITHOUT `tenant_id` (Platform-Level — 12 tables)

Owned by Prabha Technology:

`tenants`, `subscription_plans`, `tenant_subscriptions`, `platform_settings`, `roles`, `permissions`, `role_permissions`, `users` (nullable), `user_roles` (nullable), `password_reset_tokens`, `email_verifications`, `platform_audit_logs`

---

## Platform-Level vs Tenant-Level

| Level | Owner | Examples |
|---|---|---|
| **Platform** | Prabha Technology | Tenant registry, subscription plans, master admin users |
| **Tenant** | Customer academy | Courses, students, teachers, assignments |

**Rule:** Platform tables manage the SaaS business. Tenant tables manage academy operations. Never store tenant business data in platform tables.

---

## How Tenant Isolation Works

### Database Layer

1. Every tenant-owned row has `tenant_id` as a NOT NULL FK to `tenants.id`
2. Composite unique constraints include `tenant_id` (e.g., `UNIQUE(tenant_id, slug)`)
3. Indexes on `tenant_id` ensure fast filtered queries
4. Foreign keys cascade within tenant boundaries

### Application Layer (Future — FastAPI)

1. After authentication, resolve the user's `tenant_id` from JWT/session
2. Inject `tenant_id` into every repository query
3. Reject requests where `tenant_id` in URL/body doesn't match session
4. Platform admin queries use separate code paths without tenant filter

### Example

```sql
-- CORRECT: Tenant-scoped query
SELECT * FROM courses
WHERE tenant_id = 'uuid-tenant-a'
  AND status = 'published';

-- INCORRECT: Missing tenant filter (data leak risk)
SELECT * FROM courses
WHERE status = 'published';
```

---

## How Foreign Keys Should Work

### Within a Tenant

Child tables reference parent tables that share the same `tenant_id`. The application must verify tenant consistency — a `course_id` from Tenant A must never be joined with a `tenant_id` from Tenant B.

### Cross-Tenant References

**Never allowed.** No FK should point from one tenant's data to another tenant's data.

### Platform to Tenant

- `tenant_subscriptions.tenant_id` → `tenants.id` (platform manages tenant subscriptions)
- `users.tenant_id` → `tenants.id` (nullable — NULL for platform users)

### Delete Behavior Summary

| Relationship | ON DELETE |
|---|---|
| Tenant → tenant-owned child | CASCADE (tenant deletion removes all data) |
| Course → enrollment | RESTRICT (cannot delete course with active enrollments) |
| User → profile | CASCADE |
| Parent assessment → marks | Application-managed (marks retain assessment reference) |

---

## How Queries Should Always Be Tenant-Aware

Every SELECT, UPDATE, DELETE on tenant tables MUST include `tenant_id`:

```sql
-- Read
SELECT * FROM students WHERE tenant_id = ? AND id = ?

-- Update
UPDATE courses SET name = ? WHERE tenant_id = ? AND id = ?

-- Delete (soft)
UPDATE courses SET deleted_at = NOW() WHERE tenant_id = ? AND id = ?
```

Platform admin queries that need cross-tenant visibility (e.g., list all tenants) query platform tables directly and do NOT use tenant business tables without explicit authorization.

---

## How Cross-Tenant Data Leakage is Prevented

| Layer | Mechanism |
|---|---|
| Schema | `tenant_id` NOT NULL on all tenant tables |
| Constraints | Composite UNIQUE includes `tenant_id` |
| Indexes | `tenant_id` as leading column in composite indexes |
| Application | Mandatory tenant context in every request |
| Authorization | Role checks + tenant membership validation |
| API design | Never accept `tenant_id` from client without verification |
| Audit | `tenant_audit_logs` and `platform_audit_logs` track access |

---

## How Master Admin Accesses Tenant Information

Master Admin (Prabha Technology) operates at the **platform level**:

1. **Tenant management:** Query `tenants`, `tenant_subscriptions`, `tenant_profiles`
2. **Usage overview:** Aggregate queries across tenants (with proper authorization)
3. **Support access:** Read-only cross-tenant queries via dedicated admin service (logged in `platform_audit_logs`)
4. **Never impersonate:** Master Admin does not get a `tenant_id` on their user record

Master Admin users have `users.tenant_id = NULL` and platform-scoped roles (`master_admin`).

---

## How Tenant Status Affects Access

The `tenants.status` field controls tenant access:

| Status | Meaning | Access |
|---|---|---|
| `pending` | Created but not activated | No tenant user access |
| `trial` | In trial period | Full access until `trial_ends_at` |
| `active` | Paid and active | Full access |
| `suspended` | Temporarily disabled | Read-only or no access |
| `cancelled` | Subscription ended | No access |
| `archived` | Permanently closed | No access, data retained |

The application must check both `tenants.status` and `tenant_subscriptions.status` before allowing tenant operations.

---

## Tenant Onboarding Flow

```
Master Admin creates tenant
        ↓
Tenant record created (status: pending)
        ↓
Subscription plan assigned (status: trial)
        ↓
Owner user created (tenant_id set)
        ↓
Tenant profile configured
        ↓
Tenant activated (status: active or trial)
        ↓
Owner logs in and configures academy
```

---

## Diagram

```
┌─────────────────────────────────────────────────┐
│              PLATFORM (Prabha Technology)          │
│  tenants │ subscription_plans │ platform_users     │
└──────────────────────┬──────────────────────────┘
                       │ tenant_id FK
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ Tenant A │  │ Tenant B │  │ Tenant C │
   │ courses  │  │ courses  │  │ courses  │
   │ students │  │ students │  │ students │
   │ teachers │  │ teachers │  │ teachers │
   └──────────┘  └──────────┘  └──────────┘
   
   ISOLATED      ISOLATED      ISOLATED
```
