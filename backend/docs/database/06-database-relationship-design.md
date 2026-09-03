# 06 — Database Relationship Design

## Platform Relationships

```
Prabha Technology (Platform)
│
├── tenants
│     └── tenant_subscriptions → subscription_plans
│     └── tenant_profiles (1:1)
│     └── users (1:N tenant users)
│
├── roles ←→ permissions (via role_permissions)
│     └── user_roles ← users
│
└── platform_audit_logs → users (actor)
```

> One tenant has one profile, many users, and many subscriptions over time.
> One subscription plan can be assigned to many tenants.
> Users can have multiple roles via user_roles.

---

## Tenant Core Relationships

```
Tenant
│
├── tenant_profiles (1:1)
├── users (1:N)
│     ├── teacher_profiles (1:1 per teacher user)
│     └── student_profiles (1:1 per student user)
│
├── academic_classes (1:N)
├── subjects (1:N)
└── batches (1:N)
      └── academic_classes (N:1, required)
      └── courses (N:1, optional)
```

> One tenant can have many academic classes (grades 8–12).
> One academic class can have many batches.
> A batch optionally links to one course.

---

## Course Relationships

```
Tenant
  └── Courses
        ├── academic_classes (N:1, optional)
        ├── subjects (N:1, optional)
        ├── course_teachers (M:N) → teacher_profiles
        ├── course_modules (1:N)
        │     └── course_chapters (1:N)
        │           └── course_lessons (1:N)
        ├── batches (1:N, optional link)
        ├── study_materials (1:N)
        ├── live_classes (1:N)
        ├── assignments (1:N)
        ├── quizzes (1:N)
        └── exams (1:N)
```

> One tenant can have many courses.
> One course can have multiple teachers (M:N via course_teachers).
> One teacher can teach multiple courses.
> One course has a curriculum tree: modules → chapters → lessons.
> One course can have multiple batches.

---

## Enrollment Relationships

```
Student (student_profiles)
  └── Enrollments (N:M with courses)
        ├── course_id (required)
        ├── batch_id (optional)
        ├── lesson_progress (1:N)
        ├── assignment_submissions (1:N)
        ├── quiz_attempts (1:N)
        ├── exam_attempts (1:N)
        ├── marks (1:N)
        ├── attendance_records (1:N)
        ├── payments (1:N)
        └── certificates (0:1)
```

> One student can enroll in many courses.
> One course can have many enrolled students.
> Enrollment is the central junction connecting a student to a course (and optionally a batch).
> All learning activity references the enrollment.

---

## Assessment Relationships

### Assignments

```
Course → Assignments (1:N)
  └── Assignment Submissions (1:N per student)
        └── Marks (optional reference)
```

> One assignment belongs to one course (and optionally one batch).
> One student submits one submission per assignment.
> Teacher reviews and scores the submission.

### Quizzes

```
Course → Quizzes (1:N)
  └── Quiz Questions (1:N)
        └── Quiz Question Options (1:N, for MCQ)
  └── Quiz Attempts (1:N per student)
        └── Quiz Answers (1:N per question)
```

> One quiz has many questions.
> MCQ questions have options with one marked correct.
> Students can have multiple attempts (up to max_attempts).
> Score is calculated from quiz_answers and stored on quiz_attempts.

### Exams

```
Course → Exams (1:N)
  └── Exam Questions (1:N, if online)
        └── Exam Question Options (1:N)
  └── Exam Attempts (1:N per student)
        └── Exam Answers (1:N)
```

> Exams are separate from quizzes (Q-11 confirmed).
> Online exams use the same question pattern.
> Offline exams: teacher enters marks directly without attempts.

---

## Marks & Attendance

### Marks

```
Student + Course + Enrollment → Marks
  assessment_type: assignment | quiz | exam | manual
  assessment_id: FK to source (nullable for manual)
```

> Marks can reference an assessment or be manually entered.
> Score is 0–100. Not all marks need a separate assessment record.

### Attendance

```
Course + Batch + Date + Student → Attendance Record
  (optionally linked to live_class_id)
```

> One attendance record per student per session.
> UNIQUE constraint prevents duplicate records.
> Status: present, absent, late.

---

## Commerce Relationships

```
Student → Payments (1:N)
  └── enrollment_id (optional)
  └── course_id (optional)

Coupons → Coupon Redemptions (1:N)
  └── payment_id
```

> Payments link to student and optionally enrollment/course.
> Coupons are tenant-scoped with redemption tracking.

---

## CMS Relationships

```
Tenant
  ├── blog_posts (1:N)
  ├── gallery_items (1:N)
  ├── faqs (1:N)
  ├── testimonials (1:N)
  ├── contact_messages (1:N)
  └── notifications (1:N)
        └── notification_recipients (1:N per user)
```

> All CMS content is tenant-scoped.
> Notifications target users via notification_recipients.

---

## Key Cardinality Summary

| Relationship | Cardinality |
|---|---|
| Tenant → Courses | 1:N |
| Course → Teachers | M:N |
| Course → Batches | 1:N |
| Course → Modules → Chapters → Lessons | 1:N:N:N |
| Student → Courses (via enrollments) | M:N |
| Student → Batches (via enrollment.batch_id) | N:1 optional |
| Assignment → Submissions | 1:N |
| Quiz → Questions → Options | 1:N:N |
| Quiz → Attempts → Answers | 1:N:N |
| Exam → Attempts | 1:N |
| Student → Marks | 1:N |
| Student → Attendance | 1:N |
| Tenant → Subscription | 1:N (history) |
