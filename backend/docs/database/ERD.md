# Praksha Academy SaaS — Entity Relationship Diagram (ERD)
**Version:** 2.0.0 | **Tables:** 64 | **Updated:** 2026-09-03

---

## How to Read This ERD

```
TableA ──────< TableB      (one-to-many: one A has many B)
TableA >──────< TableB     (many-to-many via junction table)
TableA ──────o TableB      (one-to-zero-or-one: optional)
```

Columns shown: `PK` = Primary Key, `FK` = Foreign Key, `UQ` = Unique, `NN` = Not Null

---

## Layer 1 — Platform

```
┌────────────────────────────┐
│         tenants            │
├────────────────────────────┤
│ PK  id         CHAR(36)   │
│ UQ  tenant_code VARCHAR   │
│ UQ  slug        VARCHAR   │
│     status      ENUM      │
│     contact_email         │
│     contact_phone         │
│     timezone              │
│     trial_ends_at         │
│     activated_at          │
│     deleted_at            │
└──────────────┬─────────────┘
               │  1
               │ has many
               ▼
┌────────────────────────────┐     ┌──────────────────────────────┐
│   tenant_subscriptions     │     │      subscription_plans      │
├────────────────────────────┤     ├──────────────────────────────┤
│ PK  id                     │     │ PK  id                       │
│ FK  tenant_id ─────────────┼─────│ UQ  code                     │
│ FK  plan_id ───────────────┼─────│     name                     │
│     status   ENUM          │     │     monthly_price            │
│     billing_cycle          │     │     annual_price             │
│     starts_at / ends_at    │     │     max_students/teachers    │
└────────────────────────────┘     │     features_json            │
                                   └──────────────────────────────┘

┌──────────────────┐   ┌──────────────────┐   ┌──────────────────────┐
│      roles       │   │   permissions    │   │   role_permissions   │
├──────────────────┤   ├──────────────────┤   ├──────────────────────┤
│ PK id            │   │ PK id            │   │ FK role_id           │
│ UQ scope+code    │   │ UQ scope+code    │   │ FK permission_id     │
│    name          │───│    module        │───│ (composite PK)       │
│    is_system     │   │    name          │   └──────────────────────┘
└──────────────────┘   └──────────────────┘

┌────────────────────┐
│  platform_settings │
├────────────────────┤
│ PK id              │
│ UQ setting_key     │
│    setting_value   │
│    (JSON)          │
└────────────────────┘
```

---

## Layer 2 — Identity & Auth

```
┌──────────────────────────────────────────────────────────────────┐
│                            users                                  │
├──────────────────────────────────────────────────────────────────┤
│ PK  id             CHAR(36)                                      │
│ FK  tenant_id ───► tenants.id  (NULL = platform user)           │
│ UQ  (tenant_id, email)                                           │
│     first_name / last_name / phone / avatar_url                  │
│     status         ENUM(pending|active|inactive|suspended)       │
│     password_hash                                                │
│     email_verified_at / last_login_at / deleted_at              │
└────────────┬─────────────────────────────────────────────────────┘
             │ 1
    ┌────────┼──────────────┬────────────────┬──────────────────┐
    ▼        ▼              ▼                ▼                  ▼
┌─────────┐ ┌───────────┐ ┌──────────────┐ ┌───────────────┐ ┌────────────────┐
│user_roles│ │refresh_   │ │user_sessions │ │password_reset │ │email_          │
│          │ │tokens     │ │              │ │_tokens        │ │verifications   │
├─────────┤ ├───────────┤ ├──────────────┤ ├───────────────┤ ├────────────────┤
│FK user  │ │FK user_id │ │FK user_id    │ │FK user_id     │ │FK user_id      │
│FK role  │ │token_hash │ │FK refresh_   │ │token_hash     │ │otp_hash        │
│FK tenant│ │device_info│ │  token_id    │ │expires_at     │ │purpose  ENUM   │
│(UQ)     │ │expires_at │ │ip/user_agent │ │used_at        │ │expires_at      │
└─────────┘ │revoked_at │ │is_active     │ └───────────────┘ └────────────────┘
            └───────────┘ └──────────────┘
```

---

## Layer 3 — Tenant Profile & CMS Settings

```
tenants ──────────────────────< tenant_profiles (1:1)
             │
             └─────────────────< tenant_website_settings (1:1)
                                  │ primary_color, logo_url, favicon_url
                                  │ show_blog, show_gallery, show_faq
                                  │ home_page_json, about_page_json
                                  │ contact_page_json, programs_page_json
                                  │ seo_title / seo_description
                                  │ is_published / published_at
```

---

## Layer 4 — People

```
users ──────< teacher_profiles       users ──────< student_profiles
              │ employee_code                       │ enrollment_number
              │ qualification                       │ date_of_birth
              │ experience_years                    │ gender
              │ specialization                      │ guardian_name/phone
              │ bio                                 │ joined_at
              └─ (tenant_id FK)                     └─ (tenant_id FK)
```

---

## Layer 5 — Academic Structure

```
tenants ──────< academic_classes ──────< batches ──────< batch_students
                                         │  │                │
                                         │  └──────FK───────► courses
                                         │
                                         └──────< enrollments

tenants ──────< subjects (used by courses)
```

---

## Layer 6 — Programs & Courses

```
┌─────────────────────────────────────────────────────────┐
│                        programs                          │
│  (tenant_id, name, slug, price, category, is_featured)  │
└──────────────────────┬──────────────────────────────────┘
                       │ 1
                       ▼ many (via program_courses)
┌─────────────────────────────────────────────────────────┐
│                        courses                           │
│  (tenant_id, academic_class_id, subject_id,             │
│   name, slug, price, status, is_featured)               │
└──────┬──────────────────────────────────────────────────┘
       │
  ┌────┼───────────────────────────────┐
  ▼    ▼                               ▼
course_teachers   course_modules ──< course_chapters ──< course_lessons
(teacher_profiles)  (sort_order)       (sort_order)        (lesson_type,
                                                            video_url,
                                                            is_free_preview)
```

---

## Layer 7 — Enrollment & Progress

```
student_profiles ──────< enrollments ──────< lesson_progress
                          │  │ (status, progress_percent)
                          │  └──────FK──────► batches
                          │
                          └──────FK──────► courses
```

---

## Layer 8 — Learning Management

```
courses ──< study_materials   (file_url, material_type)
courses ──< live_classes      (session_date, meeting_link, teacher_id)
courses ──< announcements     (posted_by → teacher_profiles)
```

---

## Layer 9 — Assessments

```
                    question_bank
                    (subject_id, difficulty, tags)
                         │
                    question_bank_options
                         │
           ┌─────────────┴──────────────┐
           ▼                            ▼
      quiz_questions              exam_questions
      (bank_question_id FK)       (bank_question_id FK)
           │                            │
    quiz_question_options        exam_question_options


courses ──< quizzes ──< quiz_questions ──< quiz_question_options
                    ──< quiz_attempts  ──< quiz_answers

courses ──< exams   ──< exam_questions ──< exam_question_options
                    ──< exam_attempts  ──< exam_answers

courses ──< assignments ──< assignment_submissions

student_profiles ──< marks (aggregated ledger: quiz/exam/assignment/manual)
```

---

## Layer 10 — Attendance

```
student_profiles ──< attendance_records
                     │ (attendance_date, status: present|absent|late)
                     ├──FK──► courses
                     ├──FK──► batches (optional)
                     └──FK──► live_classes (optional)
```

---

## Layer 11 — Finance

```
┌─────────────────────────────────────────────┐
│              fee_structures                  │
│  (fee_type, amount, due_day, late_fee)       │
│  FK: course_id / batch_id / class_id        │
└──────────────────┬──────────────────────────┘
                   │ 1
                   ▼ many
┌─────────────────────────────────────────────┐
│              fee_invoices                    │
│  (invoice_number, amount, due_date, status)  │
│  FK: student_id, enrollment_id, payment_id  │
└──────────────────┬──────────────────────────┘
                   │ links to
                   ▼
┌─────────────────────────────────────────────┐
│                payments                      │
│  (amount, payment_method, transaction_ref)  │
│  FK: student_id, enrollment_id, course_id  │
└──────────────────────────────────────────────┘

coupons ──< coupon_redemptions (FK: payment_id)
```

---

## Layer 12 — CMS Content

```
tenants ──< blog_posts      (slug, content, published_at)
tenants ──< gallery_items   (image/video, sort_order)
tenants ──< faqs            (question, answer, category)
tenants ──< testimonials    (author, rating, content)
tenants ──< contact_messages (name, email, status)
```

---

## Layer 13 — Notifications & Audit

```
tenants ──< notifications ──< notification_recipients
                               (is_read, delivered_at)

tenants ──< tenant_audit_logs  (actor, action, entity_type, metadata)
platform   ──< platform_audit_logs
```

---

## Full Table Index (64 Tables)

| # | Table | Layer | Rows (estimated prod) |
|---|-------|-------|----------------------|
| 1 | tenants | Platform | Low (100s) |
| 2 | subscription_plans | Platform | Tiny (5–10) |
| 3 | tenant_subscriptions | Platform | Low |
| 4 | platform_settings | Platform | Tiny |
| 5 | roles | Auth | Tiny (seeded) |
| 6 | permissions | Auth | Small (seeded) |
| 7 | role_permissions | Auth | Small (seeded) |
| 8 | platform_audit_logs | Audit | High |
| 9 | users | Auth | Medium (millions) |
| 10 | user_roles | Auth | Medium |
| 11 | refresh_tokens | Auth | High (purged) |
| 12 | user_sessions | Auth | Medium (purged) |
| 13 | password_reset_tokens | Auth | Low (purged) |
| 14 | email_verifications | Auth | Low (purged) |
| 15 | tenant_profiles | Tenant | Low |
| 16 | tenant_website_settings | CMS | Low |
| 17 | teacher_profiles | People | Medium |
| 18 | student_profiles | People | High |
| 19 | academic_classes | Academic | Low |
| 20 | subjects | Academic | Low |
| 21 | batches | Academic | Medium |
| 22 | batch_students | Academic | High |
| 23 | programs | Programs | Low |
| 24 | program_courses | Programs | Low |
| 25 | courses | Courses | Medium |
| 26 | course_teachers | Courses | Medium |
| 27 | course_modules | Courses | Medium |
| 28 | course_chapters | Courses | Medium |
| 29 | course_lessons | Courses | Medium |
| 30 | enrollments | Enrollment | High |
| 31 | lesson_progress | Progress | Very High |
| 32 | study_materials | LMS | Medium |
| 33 | live_classes | LMS | Medium |
| 34 | announcements | LMS | Medium |
| 35 | question_bank | Assessment | Medium |
| 36 | question_bank_options | Assessment | Medium |
| 37 | assignments | Assessment | Medium |
| 38 | assignment_submissions | Assessment | High |
| 39 | quizzes | Assessment | Medium |
| 40 | quiz_questions | Assessment | Medium |
| 41 | quiz_question_options | Assessment | Medium |
| 42 | quiz_attempts | Assessment | High |
| 43 | quiz_answers | Assessment | Very High |
| 44 | exams | Assessment | Medium |
| 45 | exam_questions | Assessment | Medium |
| 46 | exam_question_options | Assessment | Medium |
| 47 | exam_attempts | Assessment | High |
| 48 | exam_answers | Assessment | Very High |
| 49 | marks | Assessment | High |
| 50 | attendance_records | Attendance | Very High |
| 51 | payments | Finance | High |
| 52 | coupons | Finance | Low |
| 53 | coupon_redemptions | Finance | Medium |
| 54 | fee_structures | Finance | Low |
| 55 | fee_invoices | Finance | High |
| 56 | wishlist_items | Catalog | Medium |
| 57 | certificates | Certs | Medium |
| 58 | blog_posts | CMS | Medium |
| 59 | gallery_items | CMS | Medium |
| 60 | faqs | CMS | Low |
| 61 | testimonials | CMS | Low |
| 62 | contact_messages | CMS | Medium |
| 63 | notifications | Notify | Medium |
| 64 | notification_recipients | Notify | High |
| 65 | tenant_audit_logs | Audit | Very High |

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `tenant_id` on every table | Row-level multi-tenancy; prevents data leakage |
| UUID (`CHAR(36)`) PKs | Avoids sequential ID enumeration; safe in URLs |
| `deleted_at` soft-deletes | Preserve history; recover accidents |
| `question_bank` separate | Reuse questions across quizzes AND exams |
| `refresh_tokens` table | JWT revocation without stateless assumption |
| `fee_structures` + `fee_invoices` | Separate plan definition from per-student billing |
| `batch_students` join table | Fast "list students in batch" without joining enrollments |
| `tenant_website_settings` | Structured CMS replaces localStorage mock |
| `programs` + `program_courses` | Multi-course bundles for public site |
| `announcements` table | Teacher → batch communication, not a notification |
