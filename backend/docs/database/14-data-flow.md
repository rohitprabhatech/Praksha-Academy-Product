# 14 — Data Flow

Business process flows showing database records created at each stage.

---

## Flow 1: New Tenant Onboarding

```
Master Admin (platform user)
        │
        ▼
CREATE tenants (status: pending, tenant_code: "praksha-pune")
        │
        ▼
CREATE tenant_subscriptions (plan_id: "starter", status: trial, trial_ends_at: +15 days)
        │
        ▼
CREATE users (tenant_id: tenant-uuid, email: owner@praksha.academy, role: owner)
        │
        ▼
CREATE user_roles (user_id, role_id: owner, tenant_id)
        │
        ▼
CREATE tenant_profiles (display_name: "Praksha Academy Pune", academic_year: "2025-26")
        │
        ▼
UPDATE tenants SET status = 'trial', activated_at = NOW()
        │
        ▼
INSERT platform_audit_logs (action: 'tenant.created', entity_type: 'tenants')
        │
        ▼
Owner receives credentials → logs in → configures academy
```

**Records created:** 1 tenant, 1 subscription, 1 user, 1 user_role, 1 tenant_profile, 1 audit log

---

## Flow 2: New Course

```
Owner (tenant user)
        │
        ▼
SELECT academic_classes, subjects, teacher_profiles (for dropdowns)
        │
        ▼
CREATE courses (name: "Python Programming", slug: "python-programming", tenant_id)
        │
        ▼
CREATE course_teachers (course_id, teacher_id, is_primary: 1)
        │
        ▼
CREATE course_modules → course_chapters → course_lessons (curriculum)
        │
        ▼
UPDATE courses SET status = 'published'
        │
        ▼
INSERT tenant_audit_logs (action: 'course.created')
        │
        ▼
Public catalog shows course (filtered by tenant_id + status = published)
```

**Records created:** 1 course, 1+ course_teachers, N modules/chapters/lessons, 1 audit log

---

## Flow 3: Student Enrollment

```
Owner (or student self-register)
        │
        ▼
CREATE users (email, password_hash, tenant_id) — if new student
        │
        ▼
CREATE student_profiles (user_id, enrollment_number)
        │
        ▼
CREATE user_roles (role: student)
        │
        ▼
CREATE enrollments (student_id, course_id, batch_id optional, status: active)
        │
        ▼
INSERT tenant_audit_logs (action: 'enrollment.created')
        │
        ▼
Student sees course in My Courses
Teacher sees student in assigned course
```

**Records created:** 1 user (if new), 1 student_profile, 1 user_role, 1 enrollment

---

## Flow 4: Assignment Lifecycle

```
Owner/Teacher
        │
        ▼
CREATE assignments (course_id, title, due_at, status: draft)
        │
        ▼
UPDATE assignments SET status = 'published'
        │
        ▼
Student (enrolled in course)
        │
        ▼
CREATE assignment_submissions (assignment_id, student_id, status: submitted, file_url)
        │
        ▼
Teacher reviews
        │
        ▼
UPDATE assignment_submissions SET score = 85, status = 'reviewed', feedback = "..."
        │
        ▼
CREATE marks (assessment_type: assignment, assessment_id, score: 85)
        │
        ▼
Student views marks in /student/marks
Owner views read-only in /admin/marks
```

**Records created:** 1 assignment, 1 submission, 1 mark

---

## Flow 5: Quiz Attempt

```
Owner creates quiz with questions and options
        │
        ▼
CREATE quizzes → quiz_questions → quiz_question_options
        │
        ▼
Student starts attempt
        │
        ▼
CREATE quiz_attempts (status: in_progress)
        │
        ▼
Student answers each question
        │
        ▼
CREATE quiz_answers (selected_option_id or answer_text)
        │
        ▼
Student submits
        │
        ▼
UPDATE quiz_attempts SET status = 'graded', score = calculated_score
        │
        ▼
CREATE marks (assessment_type: quiz, score)
```

---

## Flow 6: Attendance Marking

```
Teacher selects date + course/batch
        │
        ▼
SELECT enrollments WHERE course_id AND batch_id (list of students)
        │
        ▼
For each student:
  INSERT attendance_records (student_id, course_id, batch_id, date, status: present/absent)
  ON DUPLICATE KEY → UPDATE status
        │
        ▼
Student views history in /student/attendance
Owner views read-only in /admin/attendance
```

---

## Flow 7: Payment & Enrollment

```
Owner creates manual enrollment
        │
        ▼
CREATE enrollments (status: active)
        │
        ▼
CREATE payments (student_id, course_id, amount, status: completed)
        │
        ▼
(Optional) APPLY coupon → CREATE coupon_redemptions
        │
        ▼
Revenue report aggregates payments by tenant_id
```

---

## Flow 8: Tenant Suspension

```
Master Admin
        │
        ▼
UPDATE tenants SET status = 'suspended', suspended_at = NOW()
        │
        ▼
UPDATE tenant_subscriptions SET status = 'cancelled'
        │
        ▼
INSERT platform_audit_logs (action: 'tenant.suspended')
        │
        ▼
All tenant user logins rejected (application checks tenant status)
```

---

## Flow 9: Notification Delivery

```
Owner creates notification (audience: all students)
        │
        ▼
CREATE notifications (status: draft)
        │
        ▼
Owner clicks "Send Now"
        │
        ▼
SELECT users WHERE tenant_id AND role = student
        │
        ▼
For each user: CREATE notification_recipients (is_read: 0)
        │
        ▼
UPDATE notifications SET status = 'sent', sent_at = NOW()
        │
        ▼
Students see notification in inbox
```
