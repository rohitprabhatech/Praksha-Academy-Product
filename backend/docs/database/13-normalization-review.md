# 13 — Normalization Review

Formal review of the Praksha Academy database against normalization rules.

---

## First Normal Form (1NF) — PASS

| Check | Result | Evidence |
|---|---|---|
| Atomic column values | ✅ Pass | No arrays or comma-separated values in scalar columns |
| Unique rows | ✅ Pass | UUID PK on every table |
| No repeating groups | ✅ Pass | Questions in separate tables, not embedded in quiz row |
| Consistent column types | ✅ Pass | All IDs are CHAR(36), all timestamps DATETIME(6) |

**Note:** `tags_json` and `settings_json` use MySQL JSON type for flexible key-value data. This is acceptable in 1NF as the JSON is not queried relationally — it stores optional configuration.

---

## Second Normal Form (2NF) — PASS

| Check | Result | Evidence |
|---|---|---|
| 1NF satisfied | ✅ Pass | See above |
| Full key dependency | ✅ Pass | All tables use single-column UUID PK |
| No partial dependencies | ✅ Pass | Junction tables (course_teachers, role_permissions) contain only relationship data |

Since all primary keys are single-column UUIDs, 2NF is automatically satisfied.

---

## Third Normal Form (3NF) — PASS

| Check | Result | Evidence |
|---|---|---|
| 2NF satisfied | ✅ Pass | See above |
| No transitive dependencies | ✅ Pass | See analysis below |

### Transitive Dependency Analysis

| Potential Issue | Resolution |
|---|---|
| Teacher name in courses | ❌ Avoided — `course_teachers` → `teacher_profiles` → `users` |
| Student email in enrollments | ❌ Avoided — FK chain to `users.email` |
| Course name in marks | ❌ Avoided — `marks.course_id` FK only |
| Academy name in users | ❌ Avoided — `tenant_profiles.display_name` |
| Plan name in subscriptions | ❌ Avoided — `tenant_subscriptions.plan_id` FK |
| Teacher name in assignments | ❌ Avoided — `assignments.teacher_id` FK |

---

## Boyce-Codd Normal Form (BCNF) — PASS

All functional dependencies are determined by candidate keys. No anomalies detected.

---

## Denormalization Justification

| Column | Table | 3NF Violation? | Justified? |
|---|---|---|---|
| `progress_percent` | enrollments | Minor | ✅ Yes — performance cache |
| `used_count` | coupons | Minor | ✅ Yes — avoid COUNT on every validation |
| `score` | quiz_attempts | Minor | ✅ Yes — stored grading result |
| `author_name` | blog_posts | Minor | ✅ Yes — display resilience |

All denormalized columns are updated by application logic, not database triggers.

---

## Duplicate Data Check

| Data | Stored Once? | Location |
|---|---|---|
| User email | ✅ | `users.email` |
| Teacher qualification | ✅ | `teacher_profiles.qualification` |
| Course name | ✅ | `courses.name` |
| Student enrollment number | ✅ | `student_profiles.enrollment_number` |
| Academy settings | ✅ | `tenant_profiles` |
| Subscription plan details | ✅ | `subscription_plans` |

No unnecessary duplication found.

---

## Repeating Groups Check

| Instead of... | We have... | Status |
|---|---|---|
| Multiple teacher IDs in courses | `course_teachers` junction | ✅ Normalized |
| Questions as JSON in quiz | `quiz_questions` table | ✅ Normalized |
| Options as JSON in question | `quiz_question_options` table | ✅ Normalized |
| Roles as ENUM on users | `roles` + `user_roles` | ✅ Normalized |
| Attendance as JSON per session | `attendance_records` per student | ✅ Normalized |

---

## Conclusion

The database design satisfies **3NF** with four justified denormalizations for performance. No structural normalization issues remain.
