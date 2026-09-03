# 07 — Database Normalization Principles

## Normalization Goals

The Praksha Academy database follows **Third Normal Form (3NF)** as the baseline, with deliberate denormalization only where justified (e.g., `enrollments.progress_percent` for query performance).

---

## First Normal Form (1NF)

**Rule:** Each column contains atomic values; no repeating groups.

| Check | Status |
|---|---|
| No comma-separated lists in columns | ✅ Tags use `tags_json` (JSON column) |
| No multi-value columns | ✅ M:N via junction tables (course_teachers, user_roles) |
| Each row is unique | ✅ UUID primary keys |
| No repeating question groups | ✅ Separate quiz_questions / exam_questions tables |

---

## Second Normal Form (2NF)

**Rule:** All non-key attributes depend on the entire primary key.

| Check | Status |
|---|---|
| Junction tables have only relationship attributes | ✅ course_teachers, role_permissions |
| No partial dependencies on composite keys | ✅ All tables use single-column UUID PK |
| Enrollment attributes on enrollment, not student | ✅ progress_percent on enrollments |

---

## Third Normal Form (3NF)

**Rule:** No transitive dependencies (non-key → non-key).

| Check | Status |
|---|---|
| Teacher data not duplicated in courses | ✅ course_teachers junction table |
| Student data not duplicated in enrollments | ✅ student_profiles separate from enrollments |
| Course name not stored in marks | ✅ marks reference course_id |
| User name not stored in audit logs | ✅ actor_user_id FK only |
| Academy settings not in users table | ✅ tenant_profiles separate |

---

## Deliberate Denormalization

| Column | Table | Justification |
|---|---|---|
| `progress_percent` | enrollments | Avoid expensive aggregation on every dashboard load |
| `used_count` | coupons | Fast availability check without COUNT query |
| `score` on quiz_attempts | quiz_attempts | Stored result after grading; source of truth for display |
| `author_name` on blog_posts | blog_posts | Display name even if author user is deleted |

These are updated by application logic, not triggers.

---

## Anti-Patterns Avoided

| Anti-Pattern | Our Approach |
|---|---|
| Python Course table, Java Course table | Single `courses` table with dynamic records |
| Storing teacher name in every assignment | FK to teacher_profiles |
| Storing student email in enrollments | FK to student_profiles → users |
| Storing calculated totals in courses | Computed at query time or in reports |
| Platform data mixed with tenant data | Strict table classification |

---

## Repeating Groups Eliminated

| Instead of... | We use... |
|---|---|
| `course.teacher_id` only (single teacher) | `course_teachers` M:N (supports Q-04 future) |
| Questions as JSON blob in quiz | `quiz_questions` + `quiz_question_options` tables |
| Roles as ENUM on users | `roles` + `user_roles` configurable RBAC |
| All settings in one JSON | Structured columns + `settings_json` for extras |
