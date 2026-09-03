# 19 — Naming Convention

Consistent naming standards used throughout the Praksha Academy database.

---

## General Rules

- All names in **lowercase snake_case**
- No abbreviations unless universally understood (id, url, otp)
- No reserved SQL words as table names (use `academic_classes` not `classes`)
- Maximum 64 characters (MySQL identifier limit)

---

## Table Naming

| Rule | Example |
|---|---|
| Plural nouns | `courses`, `enrollments`, `users` |
| Descriptive compound names | `course_teachers`, `assignment_submissions` |
| Prefix for scoped tables | `platform_audit_logs`, `tenant_audit_logs` |
| Profile tables | `{role}_profiles` → `teacher_profiles`, `student_profiles` |
| Junction tables | `{entity1}_{entity2}` → `course_teachers`, `role_permissions` |

---

## Column Naming

| Pattern | Example | Purpose |
|---|---|---|
| `id` | `id` | Primary key (UUID) |
| `{entity}_id` | `tenant_id`, `course_id` | Foreign key |
| `{descriptive}_at` | `created_at`, `deleted_at` | Timestamps |
| `{descriptive}_by` | `created_by`, `marked_by` | User references |
| `is_{adjective}` | `is_primary`, `is_online` | Boolean flags |
| `{noun}_url` | `thumbnail_url`, `file_url` | URL fields |
| `{noun}_hash` | `password_hash`, `token_hash` | Hashed values |
| `{noun}_json` | `settings_json`, `metadata_json` | JSON columns |
| `{noun}_type` | `material_type`, `assessment_type` | Type discriminators |
| `{noun}_percent` | `progress_percent` | Percentage values |
| `max_{noun}` | `max_attempts`, `max_score` | Maximum limits |

---

## Primary Key Naming

- Always `id`
- Type: `CHAR(36)` (UUID)
- Never use composite primary keys

---

## Foreign Key Naming

| Pattern | Example |
|---|---|
| Column: `{referenced_table_singular}_id` | `tenant_id`, `course_id`, `student_id` |
| Constraint: `fk_{child_table}_{parent_table}` | `fk_courses_tenant`, `fk_enrollments_student` |

Note: FK constraint names use the child table first, then the parent table (without `_id` suffix).

---

## Index Naming

| Type | Pattern | Example |
|---|---|---|
| Regular index | `idx_{table}_{column(s)}` | `idx_courses_tenant_id` |
| Unique index | `uk_{table}_{column(s)}` | `uk_courses_slug` |
| Composite index | `idx_{table}_{col1}_{col2}` | `idx_marks_assessment` |

---

## Unique Constraint Naming

| Pattern | Example |
|---|---|
| `uk_{table}_{column(s)}` | `uk_users_tenant_email` |
| Same as unique index name | MySQL implements UNIQUE as index |

---

## Timestamp Naming

| Column | Type | Nullable | Purpose |
|---|---|---|---|
| `created_at` | DATETIME(6) | NOT NULL | Record creation time |
| `updated_at` | DATETIME(6) | NOT NULL | Last modification time |
| `deleted_at` | DATETIME(6) | NULL | Soft delete marker (NULL = active) |
| `{action}_at` | DATETIME(6) | Varies | Event-specific timestamps |

Event-specific timestamps: `enrolled_at`, `submitted_at`, `verified_at`, `paid_at`, `issued_at`, `sent_at`, `read_at`, `marked_at`, `graded_at`, `started_at`, `completed_at`, `cancelled_at`, `suspended_at`, `activated_at`, `published_at`, `scheduled_at`, `expires_at`

---

## ENUM Value Naming

- Lowercase snake_case: `'in_progress'`, `'not_started'`
- Consistent across related tables where applicable
- Status enums follow lifecycle order: `draft` → `published` → `closed`

---

## Database Object Naming

| Object | Name |
|---|---|
| Database | `praksha_academy_saas` |
| Dev database | `praksha_academy_dev` |
| Test database | `praksha_academy_test` |
| Staging database | `praksha_academy_staging` |
| Production database | `praksha_academy_prod` |

---

## What NOT to Do

| Anti-Pattern | Correct |
|---|---|
| `Courses` (PascalCase) | `courses` |
| `tbl_courses` (prefix) | `courses` |
| `course_id_fk` (suffix) | `course_id` |
| `classes` (reserved/confusing) | `academic_classes` |
| `class_id` (ambiguous) | `academic_class_id` |
| `data` (vague) | `metadata_json` |
| `flag` (vague) | `is_primary` |
