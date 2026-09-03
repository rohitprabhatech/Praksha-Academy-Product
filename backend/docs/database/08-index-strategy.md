# 08 — Index Strategy

## Principles

1. Index `tenant_id` on every tenant table (leading column in composites)
2. Index all foreign key columns
3. Index frequently filtered columns (status, dates)
4. Do NOT index every column — only query-driven indexes
5. Composite indexes: most selective column first after `tenant_id`

---

## Tenant Isolation Indexes

Every tenant table has at minimum:

```sql
KEY idx_{table}_tenant_id (tenant_id)
```

This is critical because every query starts with `WHERE tenant_id = ?`.

---

## Index Catalog

### Platform Tables

| Table | Index | Columns | Why |
|---|---|---|---|
| tenants | uk_tenants_tenant_code | tenant_code | Lookup by code |
| tenants | uk_tenants_slug | slug | URL routing |
| tenants | idx_tenants_status | status | Filter active/suspended |
| tenants | idx_tenants_deleted_at | deleted_at | Exclude soft-deleted |
| subscription_plans | uk_subscription_plans_code | code | Plan lookup |
| subscription_plans | idx_subscription_plans_status | status | Active plans only |
| tenant_subscriptions | idx_tenant_subscriptions_tenant_id | tenant_id | Subscriptions per tenant |
| tenant_subscriptions | idx_tenant_subscriptions_status | status | Active/expired filter |
| tenant_subscriptions | idx_tenant_subscriptions_ends_at | ends_at | Expiry checks |
| users | uk_users_tenant_email | tenant_id, email | Login lookup |
| users | idx_users_tenant_id | tenant_id | Tenant user listing |
| users | idx_users_status | status | Active users filter |
| user_roles | idx_user_roles_user_id | user_id | Roles for user |
| user_roles | idx_user_roles_tenant_id | tenant_id | Tenant role lookup |
| platform_audit_logs | idx_platform_audit_logs_created_at | created_at | Time-range queries |
| platform_audit_logs | idx_platform_audit_logs_tenant_id | tenant_id | Per-tenant audit |

### Tenant Tables — Academic

| Table | Index | Columns | Why |
|---|---|---|---|
| academic_classes | uk_academic_classes_name | tenant_id, name | Unique per tenant |
| subjects | uk_subjects_name | tenant_id, name | Unique per tenant |
| batches | uk_batches_name_class | tenant_id, academic_class_id, name | Unique batch name per class |
| batches | idx_batches_course_id | course_id | Batches for course |
| batches | idx_batches_status | status | Active batches |
| courses | uk_courses_slug | tenant_id, slug | Public URL lookup |
| courses | idx_courses_status | status | Published courses |
| courses | idx_courses_category | tenant_id, category | Category filter |
| course_teachers | uk_course_teachers | tenant_id, course_id, teacher_id | No duplicate assignment |
| course_modules | idx_course_modules_course_id | course_id | Curriculum load |
| course_chapters | idx_course_chapters_module_id | module_id | Chapter listing |
| course_lessons | idx_course_lessons_chapter_id | chapter_id | Lesson listing |

### Tenant Tables — Enrollment & Learning

| Table | Index | Columns | Why |
|---|---|---|---|
| enrollments | uk_enrollments_student_course | tenant_id, student_id, course_id | One enrollment per student per course |
| enrollments | idx_enrollments_status | status | Active enrollments |
| enrollments | idx_enrollments_batch_id | batch_id | Students in batch |
| lesson_progress | uk_lesson_progress | tenant_id, enrollment_id, lesson_id | One progress per lesson |
| study_materials | idx_study_materials_course_id | course_id | Materials per course |
| live_classes | idx_live_classes_session_date | session_date | Calendar queries |
| live_classes | idx_live_classes_teacher_id | teacher_id | Teacher schedule |

### Tenant Tables — Assessments

| Table | Index | Columns | Why |
|---|---|---|---|
| assignments | idx_assignments_due_at | due_at | Upcoming deadlines |
| assignments | idx_assignments_status | status | Published filter |
| assignment_submissions | uk_assignment_submissions | tenant_id, assignment_id, student_id | One submission per student |
| assignment_submissions | idx_assignment_submissions_status | status | Pending review |
| quizzes | idx_quizzes_status | status | Published filter |
| quiz_attempts | uk_quiz_attempts | tenant_id, quiz_id, student_id, attempt_number | Attempt tracking |
| quiz_attempts | idx_quiz_attempts_status | status | Grading queue |
| exams | idx_exams_exam_date | exam_date | Schedule queries |
| exam_attempts | uk_exam_attempts | tenant_id, exam_id, student_id | One attempt per student |

### Tenant Tables — Marks & Attendance

| Table | Index | Columns | Why |
|---|---|---|---|
| marks | idx_marks_student_id | student_id | Student marks view |
| marks | idx_marks_assessment | tenant_id, assessment_type, assessment_id | Lookup by assessment |
| attendance_records | uk_attendance_session | tenant_id, student_id, attendance_date, course_id, batch_id, live_class_id | Prevent duplicates |
| attendance_records | idx_attendance_records_date | attendance_date | Date range queries |

### Tenant Tables — Commerce & CMS

| Table | Index | Columns | Why |
|---|---|---|---|
| payments | idx_payments_status | status | Payment tracking |
| payments | idx_payments_paid_at | paid_at | Revenue reports |
| coupons | uk_coupons_code | tenant_id, code | Coupon lookup |
| certificates | uk_certificates_number | tenant_id, certificate_number | Certificate verification |
| blog_posts | uk_blog_posts_slug | tenant_id, slug | Public blog URL |
| blog_posts | idx_blog_posts_published_at | published_at | Recent posts |
| notifications | idx_notifications_status | status | Draft/sent filter |
| notification_recipients | idx_notification_recipients_is_read | is_read | Unread count |
| contact_messages | idx_contact_messages_status | status | New messages |
| tenant_audit_logs | idx_tenant_audit_logs_created_at | created_at | Audit timeline |

---

## Composite Index Pattern

For tenant-scoped queries, always lead with `tenant_id`:

```sql
-- Good: tenant_id first
KEY idx_courses_status (tenant_id, status)

-- Bad: status first (can't use for tenant-only filter)
KEY idx_courses_status (status, tenant_id)
```

---

## Indexes NOT Created (Deliberate)

| Column | Reason |
|---|---|
| `users.first_name` | Not used in WHERE clauses |
| `courses.description` | Full-text search deferred to application/Elasticsearch |
| `blog_posts.content` | Same — not indexed |
| `assignments.description` | Not filtered |

---

## Future Index Considerations

- Full-text index on `courses.name` + `courses.description` if search becomes slow
- Partitioning `tenant_audit_logs` and `platform_audit_logs` by `created_at` at scale
- Covering indexes for dashboard KPI queries once query patterns are known
