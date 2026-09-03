# 20 — Database Design Decisions

Architecture Decision Records (ADRs) for major database design choices.

---

## ADR-001: Database Engine

**Decision:** MySQL 8.0+ with InnoDB engine.

**Reason:** Production-grade relational database with excellent Python/FastAPI/SQLAlchemy ecosystem support. ACID transactions, FK integrity, JSON columns, and mature managed hosting options.

**Alternatives Considered:** PostgreSQL (equally valid), SQLite (not production-suitable), MongoDB (poor fit for relational academic data).

---

## ADR-002: Primary Key Strategy

**Decision:** UUID (CHAR(36)) for all primary keys.

**Reason:** Non-sequential (prevents enumeration attacks), safe for distributed systems, no ID collision across tenants, safe to expose in APIs.

**Alternatives Considered:** BIGINT auto-increment (guessable, collision risk in distributed systems), UUID + BIGINT hybrid (unnecessary complexity at current scale).

---

## ADR-003: Tenant Identification

**Decision:** UUID (`tenants.id`) + human-readable `tenant_code`.

**Reason:** UUID for internal FK references (secure, non-guessable). `tenant_code` for subdomains, branding, and human identification (e.g., `praksha-pune`). `slug` for URL routing.

**Alternatives Considered:** Integer ID only (enumeration risk), UUID only (poor usability), string code only (not suitable as FK).

---

## ADR-004: Multi-Tenancy Model

**Decision:** Shared database, shared schema, tenant-discriminated rows (`tenant_id` column).

**Reason:** Simplest to maintain, lowest cost, proven SaaS pattern. One schema to migrate, one backup, easy cross-tenant analytics for platform admin.

**Alternatives Considered:** Database-per-tenant (expensive, complex migrations), schema-per-tenant (MySQL limitation, complex), row-level security (not native in MySQL).

---

## ADR-005: User Table Architecture

**Decision:** Single `users` table with nullable `tenant_id`.

**Reason:** One authentication flow, no duplicate credentials, flexible RBAC. Platform users have `tenant_id = NULL`; tenant users have it set.

**Alternatives Considered:** Separate `platform_users` and `tenant_users` (duplicate auth logic), user-per-role tables (over-normalized).

---

## ADR-006: Role-Based Access Control

**Decision:** Configurable RBAC with `roles`, `permissions`, `role_permissions`, `user_roles`.

**Reason:** Supports platform roles (master_admin) and tenant roles (owner, teacher, student). New roles/permissions added without schema changes. Not hardcoded into table structure.

**Alternatives Considered:** Role ENUM on users (inflexible), hardcoded role checks (not maintainable).

---

## ADR-007: Course-Teacher Relationship

**Decision:** Many-to-many via `course_teachers` junction table.

**Reason:** Frontend currently uses single teacher (Q-04 interim), but M:N design future-proofs for multi-teacher courses. `is_primary` flag identifies lead teacher.

**Alternatives Considered:** Single `teacher_id` FK on courses (limits future flexibility).

---

## ADR-008: Quizzes vs Exams

**Decision:** Separate table sets (`quizzes`/`quiz_*` and `exams`/`exam_*`).

**Reason:** Frontend requirements confirm separate modules (Q-11). Different business rules: quizzes allow multiple attempts with auto-grading; exams may be online or offline with different scheduling.

**Alternatives Considered:** Single `assessments` table with type discriminator (loses type-specific fields, complicates queries).

---

## ADR-009: Marks Storage

**Decision:** Dedicated `marks` table with polymorphic `assessment_type` + `assessment_id`.

**Reason:** Unified marks view for owner/teacher/student dashboards. Supports assignment, quiz, exam, and manual marks. Avoids duplicating score data across submission/attempt tables.

**Alternatives Considered:** Scores only on submission/attempt tables (no unified view), calculated on-the-fly (expensive for reports).

---

## ADR-010: File Storage

**Decision:** Store file metadata + external URL in database; files stored in object storage (S3/local).

**Reason:** Database is not designed for binary storage. URLs are portable, CDN-friendly, and backup-efficient.

**Alternatives Considered:** BLOB storage in MySQL (poor performance, large backups), filesystem paths (not portable).

---

## ADR-011: Soft Delete

**Decision:** `deleted_at` column on key entities; not on all tables.

**Tables with soft delete:** tenants, users, courses, academic_classes, subjects, batches, teacher_profiles, student_profiles, course_modules, course_chapters, course_lessons, study_materials, live_classes, assignments, quizzes, exams, coupons, blog_posts, gallery_items, faqs, testimonials.

**Tables without soft delete:** Junction tables, submissions, attempts, answers, marks, attendance, payments, notifications, audit logs, tokens.

**Reason:** Preserve history for important entities; hard delete acceptable for transactional/ephemeral data.

---

## ADR-012: Academic Class Naming

**Decision:** Table named `academic_classes` (not `classes`).

**Reason:** `classes` is a reserved word in many languages/ORMs and conflicts with OOP "class" concept. Frontend uses "Classes" to mean academic grades (8-12).

---

## ADR-013: Enrollment as Central Junction

**Decision:** `enrollments` table connects students to courses (with optional batch).

**Reason:** Single point of reference for all learning activity. Assignments, quizzes, exams, marks, attendance, and progress all link through enrollment.

**Alternatives Considered:** Direct student-to-course references everywhere (duplication, no status tracking).

---

## ADR-014: Subscription Data on Platform Level

**Decision:** `subscription_plans` and `tenant_subscriptions` are platform tables, not tenant tables.

**Reason:** Prabha Technology owns billing. Tenants should not modify their own subscription records.

---

## ADR-015: Audit Logging Split

**Decision:** Separate `platform_audit_logs` and `tenant_audit_logs`.

**Reason:** Platform actions (tenant creation, suspension) are separate from tenant actions (course creation, enrollment). Different retention policies and access controls.

---

## ADR-016: Attendance Uniqueness

**Decision:** UNIQUE constraint on `(tenant_id, student_id, attendance_date, course_id, batch_id, live_class_id)`.

**Reason:** Prevents duplicate attendance records. Nullable `batch_id` and `live_class_id` allow both session-based and daily attendance patterns.

**Note:** Application must handle NULL uniqueness semantics in MySQL (multiple NULLs allowed in unique index).

---

## ADR-017: No Payment Gateway Tables

**Decision:** Store payment records only; no gateway-specific tables.

**Reason:** Frontend requirements exclude payment gateway integration (Q-15, Q-16). Only manual payment recording needed for v1.

---

## ADR-018: Reports as Queries

**Decision:** No dedicated report tables; reports are query-based views over existing data.

**Reason:** Frontend reports (student growth, revenue, performance) are aggregations over enrollments, payments, and marks. Materialized views can be added later if performance requires.

---

## Decision Log

| ADR | Decision | Date | Status |
|---|---|---|---|
| 001 | MySQL 8.0+ | 2025-09-01 | Approved |
| 002 | UUID primary keys | 2025-09-01 | Approved |
| 003 | UUID + tenant_code | 2025-09-01 | Approved |
| 004 | Shared schema multi-tenancy | 2025-09-01 | Approved |
| 005 | Single users table | 2025-09-01 | Approved |
| 006 | Configurable RBAC | 2025-09-01 | Approved |
| 007 | M:N course_teachers | 2025-09-01 | Approved |
| 008 | Separate quiz/exam tables | 2025-09-01 | Approved |
| 009 | Polymorphic marks | 2025-09-01 | Approved |
| 010 | External file storage | 2025-09-01 | Approved |
| 011 | Selective soft delete | 2025-09-01 | Approved |
| 012 | academic_classes naming | 2025-09-01 | Approved |
| 013 | Enrollment junction | 2025-09-01 | Approved |
| 014 | Platform-level subscriptions | 2025-09-01 | Approved |
| 015 | Split audit logs | 2025-09-01 | Approved |
| 016 | Attendance uniqueness | 2025-09-01 | Approved |
| 017 | No payment gateway | 2025-09-01 | Approved |
| 018 | Query-based reports | 2025-09-01 | Approved |
