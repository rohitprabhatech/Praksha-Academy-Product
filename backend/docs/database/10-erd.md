# 10 — Entity-Relationship Diagrams

Seven ERDs covering the complete database. All diagrams use Mermaid syntax.

---

## ERD 1: Platform / Master Admin

```mermaid
erDiagram
    tenants ||--o{ tenant_subscriptions : has
    subscription_plans ||--o{ tenant_subscriptions : "assigned to"
    tenants ||--o| tenant_profiles : has
    tenants ||--o{ users : "has users"
    users ||--o{ user_roles : has
    roles ||--o{ user_roles : "assigned via"
    roles ||--o{ role_permissions : has
    permissions ||--o{ role_permissions : "granted via"
    users ||--o{ platform_audit_logs : performs
    tenants ||--o{ platform_audit_logs : "affects"
    users ||--o{ password_reset_tokens : requests
    users ||--o{ email_verifications : verifies

    tenants {
        char id PK
        varchar tenant_code UK
        varchar name
        enum status
        datetime trial_ends_at
    }

    subscription_plans {
        char id PK
        varchar code UK
        varchar name
        decimal monthly_price
        int trial_days
    }

    tenant_subscriptions {
        char id PK
        char tenant_id FK
        char plan_id FK
        enum status
        datetime starts_at
        datetime ends_at
    }

    users {
        char id PK
        char tenant_id FK "nullable"
        varchar email
        varchar password_hash
        enum status
    }

    roles {
        char id PK
        enum scope
        varchar code
        varchar name
    }
```

**Explanation:** Platform tables manage the SaaS business. `tenants` is the central registry. Each tenant has subscriptions, a profile, and users. RBAC is managed through roles, permissions, and user_roles. Platform audit logs track all administrative actions.

---

## ERD 2: Tenant / Academy Core

```mermaid
erDiagram
    tenants ||--o| tenant_profiles : has
    tenants ||--o{ users : employs
    users ||--o| teacher_profiles : "extends as"
    users ||--o| student_profiles : "extends as"
    tenants ||--o{ academic_classes : offers
    tenants ||--o{ subjects : teaches
    tenants ||--o{ tenant_audit_logs : logs

    teacher_profiles {
        char id PK
        char tenant_id FK
        char user_id FK
        varchar employee_code
        varchar qualification
    }

    student_profiles {
        char id PK
        char tenant_id FK
        char user_id FK
        varchar enrollment_number
        date date_of_birth
    }

    academic_classes {
        char id PK
        char tenant_id FK
        varchar name
        enum status
    }

    subjects {
        char id PK
        char tenant_id FK
        varchar name
        enum status
    }

    tenant_profiles {
        char id PK
        char tenant_id FK
        varchar display_name
        varchar academic_year
        json settings_json
    }
```

**Explanation:** Each tenant has one academy profile, many users (with role-specific profiles), academic classes (grades), and subjects. Teacher and student profiles extend the base user record with role-specific fields.

---

## ERD 3: Courses / Teachers / Students / Batches

```mermaid
erDiagram
    courses ||--o{ course_teachers : "taught by"
    teacher_profiles ||--o{ course_teachers : teaches
    courses ||--o{ course_modules : contains
    course_modules ||--o{ course_chapters : contains
    course_chapters ||--o{ course_lessons : contains
    courses ||--o{ batches : "grouped in"
    academic_classes ||--o{ batches : "belongs to"
    courses ||--o{ enrollments : "enrolled in"
    student_profiles ||--o{ enrollments : enrolls
    batches ||--o{ enrollments : "assigned to"
    enrollments ||--o{ lesson_progress : tracks
    course_lessons ||--o{ lesson_progress : "progressed in"
    student_profiles ||--o{ wishlist_items : wishes
    courses ||--o{ wishlist_items : "wished for"

    courses {
        char id PK
        char tenant_id FK
        varchar name
        varchar slug UK
        decimal price
        enum status
    }

    course_teachers {
        char id PK
        char course_id FK
        char teacher_id FK
        tinyint is_primary
    }

    batches {
        char id PK
        char tenant_id FK
        char academic_class_id FK
        char course_id FK "nullable"
        varchar name
    }

    enrollments {
        char id PK
        char tenant_id FK
        char student_id FK
        char course_id FK
        char batch_id FK "nullable"
        enum status
        decimal progress_percent
    }
```

**Explanation:** Courses are the central academic entity. Teachers are assigned via M:N junction. Curriculum is a 3-level tree. Students enroll in courses (optionally in a batch). Progress is tracked per lesson per enrollment.

---

## ERD 4: Classes / Assignments / Quizzes / Exams

```mermaid
erDiagram
    courses ||--o{ live_classes : schedules
    courses ||--o{ study_materials : provides
    courses ||--o{ assignments : assigns
    courses ||--o{ quizzes : contains
    courses ||--o{ exams : schedules
    teacher_profiles ||--o{ live_classes : conducts
    teacher_profiles ||--o{ assignments : creates
    assignments ||--o{ assignment_submissions : receives
    student_profiles ||--o{ assignment_submissions : submits
    quizzes ||--o{ quiz_questions : contains
    quiz_questions ||--o{ quiz_question_options : "has options"
    quizzes ||--o{ quiz_attempts : attempted
    quiz_attempts ||--o{ quiz_answers : records
    exams ||--o{ exam_questions : contains
    exam_questions ||--o{ exam_question_options : "has options"
    exams ||--o{ exam_attempts : attempted
    exam_attempts ||--o{ exam_answers : records

    assignments {
        char id PK
        char course_id FK
        varchar title
        datetime due_at
        enum status
    }

    assignment_submissions {
        char id PK
        char assignment_id FK
        char student_id FK
        enum status
        decimal score
    }

    quizzes {
        char id PK
        char course_id FK
        int max_attempts
        decimal passing_score
    }

    exams {
        char id PK
        char course_id FK
        date exam_date
        tinyint is_online
        enum status
    }
```

**Explanation:** Learning operations branch from courses. Assignments have submissions reviewed by teachers. Quizzes and exams are separate modules (Q-11) with their own question/attempt/answer structures. Live classes and study materials support the learning experience.

---

## ERD 5: Attendance / Marks / Results

```mermaid
erDiagram
    student_profiles ||--o{ marks : receives
    student_profiles ||--o{ attendance_records : "marked for"
    courses ||--o{ marks : "scored in"
    courses ||--o{ attendance_records : "attended in"
    enrollments ||--o{ marks : "via enrollment"
    live_classes ||--o{ attendance_records : "session for"
    batches ||--o{ attendance_records : "batch context"
    student_profiles ||--o{ certificates : earns
    courses ||--o{ certificates : "certified in"
    enrollments ||--o| certificates : "upon completion"

    marks {
        char id PK
        char tenant_id FK
        char student_id FK
        char course_id FK
        enum assessment_type
        char assessment_id "nullable"
        decimal score
        decimal max_score
    }

    attendance_records {
        char id PK
        char tenant_id FK
        char student_id FK
        char course_id FK
        date attendance_date
        enum status
    }

    certificates {
        char id PK
        char student_id FK
        char course_id FK
        varchar certificate_number UK
        enum status
    }
```

**Explanation:** Marks are polymorphic — they can reference assignments, quizzes, exams, or be manually entered. Attendance is recorded per student per session with duplicate prevention. Certificates are issued upon course completion.

---

## ERD 6: Subscriptions / Tenant Management

```mermaid
erDiagram
    tenants ||--o{ tenant_subscriptions : subscribes
    subscription_plans ||--o{ tenant_subscriptions : provides
    tenants ||--o| tenant_profiles : configures
    tenants ||--o{ users : "owner created"
    users ||--o{ user_roles : "assigned role"
    roles ||--o{ user_roles : defines

    tenants {
        char id PK
        varchar tenant_code UK
        varchar name
        enum status
        datetime trial_ends_at
        datetime activated_at
    }

    subscription_plans {
        char id PK
        varchar code UK
        varchar name
        decimal monthly_price
        int trial_days
        int max_students
        int max_teachers
    }

    tenant_subscriptions {
        char id PK
        char tenant_id FK
        char plan_id FK
        enum status
        enum billing_cycle
        datetime starts_at
        datetime ends_at
        datetime trial_ends_at
    }
```

**Explanation:** SaaS subscription lifecycle. Master Admin creates tenants, assigns plans, and manages trial/active/suspended states. Plan limits (max_students, max_teachers) enforce subscription tiers.

---

## ERD 7: Complete Database Relationship Overview

```mermaid
erDiagram
    tenants ||--o{ tenant_subscriptions : subscribes
    subscription_plans ||--o{ tenant_subscriptions : offers
    tenants ||--o| tenant_profiles : profiles
    tenants ||--o{ users : users
    tenants ||--o{ courses : courses
    tenants ||--o{ academic_classes : classes
    tenants ||--o{ subjects : subjects
    tenants ||--o{ batches : batches
    tenants ||--o{ payments : payments
    tenants ||--o{ blog_posts : cms
    tenants ||--o{ notifications : notifies
    tenants ||--o{ tenant_audit_logs : audits
    users ||--o{ user_roles : roles
    roles ||--o{ role_permissions : permissions
    courses ||--o{ course_teachers : teachers
    courses ||--o{ enrollments : enrollments
    courses ||--o{ assignments : assignments
    courses ||--o{ quizzes : quizzes
    courses ||--o{ exams : exams
    courses ||--o{ live_classes : sessions
    courses ||--o{ study_materials : materials
    student_profiles ||--o{ enrollments : enrolls
    enrollments ||--o{ lesson_progress : progress
    enrollments ||--o{ marks : marks
    enrollments ||--o{ attendance_records : attendance
```

**Explanation:** High-level view of all major relationships. `tenants` is the root for all tenant data. `courses` is the central academic hub connecting teachers, students, assessments, and learning materials. `enrollments` is the junction connecting students to the learning experience.

---

## Diagram Notes

- All `id` columns are `CHAR(36)` UUIDs
- All tenant tables include `tenant_id` FK (not shown in every diagram for readability)
- `created_at`, `updated_at`, `deleted_at` audit columns omitted from diagrams
- See [11-table-catalog.md](./11-table-catalog.md) for complete column definitions
