# 15 — Sample Data

Realistic example records demonstrating tenant isolation. UUIDs are shortened for readability.

---

## Platform Data

### Prabha Technology (Platform Owner)

No tenant_id — platform-level only.

### Subscription Plans

| id | code | name | monthly_price | trial_days | max_students |
|---|---|---|---|---|---|
| plan-001 | starter | Starter Plan | 2999.00 | 15 | 100 |
| plan-002 | professional | Professional Plan | 5999.00 | 15 | 500 |
| plan-003 | enterprise | Enterprise Plan | 9999.00 | 30 | NULL |

---

## Tenant A: Praksha Academy Pune

### tenants

| id | tenant_code | name | status |
|---|---|---|---|
| tenant-aaa | praksha-pune | Praksha Academy Pune | active |

### tenant_subscriptions

| tenant_id | plan_id | status | starts_at | trial_ends_at |
|---|---|---|---|---|
| tenant-aaa | plan-002 | active | 2025-01-01 | 2025-01-15 |

### tenant_profiles

| tenant_id | display_name | academic_year | contact_email |
|---|---|---|---|
| tenant-aaa | Praksha Academy Pune | 2025-26 | contact@praksha.academy |

### users (Tenant A)

| id | tenant_id | email | first_name | role |
|---|---|---|---|---|
| user-a01 | tenant-aaa | owner@praksha.academy | Rajesh | owner |
| user-a02 | tenant-aaa | priya.sharma@praksha.academy | Priya | teacher |
| user-a03 | tenant-aaa | amit.patel@praksha.academy | Amit | student |

### academic_classes (Tenant A)

| id | tenant_id | name |
|---|---|---|
| class-a01 | tenant-aaa | Class 10 Science |
| class-a02 | tenant-aaa | Class 12 Science |

### subjects (Tenant A)

| id | tenant_id | name |
|---|---|---|
| subj-a01 | tenant-aaa | Mathematics |
| subj-a02 | tenant-aaa | Physics |

### courses (Tenant A)

| id | tenant_id | name | slug | price | status |
|---|---|---|---|---|---|
| course-a01 | tenant-aaa | Python Programming | python-programming | 15000.00 | published |
| course-a02 | tenant-aaa | 12th Physics | 12th-physics | 12000.00 | published |

### course_teachers (Tenant A)

| course_id | teacher_id | is_primary |
|---|---|---|
| course-a01 | teacher-a01 | 1 |
| course-a02 | teacher-a01 | 1 |

### batches (Tenant A)

| id | tenant_id | name | academic_class_id | course_id |
|---|---|---|---|---|
| batch-a01 | tenant-aaa | Morning Batch | class-a01 | course-a01 |
| batch-a02 | tenant-aaa | Evening Batch | class-a01 | course-a01 |

### enrollments (Tenant A)

| student_id | course_id | batch_id | status |
|---|---|---|---|
| student-a01 | course-a01 | batch-a01 | active |
| student-a01 | course-a02 | NULL | active |

---

## Tenant B: Delhi Coaching Center

### tenants

| id | tenant_code | name | status |
|---|---|---|---|
| tenant-bbb | delhi-coaching | Delhi Coaching Center | active |

### courses (Tenant B)

| id | tenant_id | name | slug | price | status |
|---|---|---|---|---|---|
| course-b01 | tenant-bbb | Python Programming | python-programming | 18000.00 | published |
| course-b02 | tenant-bbb | JEE Mathematics | jee-mathematics | 25000.00 | published |

### users (Tenant B)

| id | tenant_id | email | first_name | role |
|---|---|---|---|---|
| user-b01 | tenant-bbb | admin@delhicoaching.com | Suresh | owner |
| user-b02 | tenant-bbb | neha@delhicoaching.com | Neha | teacher |
| user-b03 | tenant-bbb | rahul@delhicoaching.com | Rahul | student |

---

## Tenant Isolation Demonstration

### Both tenants have "Python Programming"

```sql
-- Tenant A's Python course
SELECT * FROM courses
WHERE tenant_id = 'tenant-aaa' AND slug = 'python-programming';
-- Returns: course-a01, price: 15000.00

-- Tenant B's Python course
SELECT * FROM courses
WHERE tenant_id = 'tenant-bbb' AND slug = 'python-programming';
-- Returns: course-b01, price: 18000.00
```

Same slug, different tenants, different data — **no conflict** because of `UNIQUE(tenant_id, slug)`.

### Same email in different tenants

```sql
-- This is ALLOWED:
-- user-a03: amit.patel@praksha.academy (tenant-aaa)
-- If tenant-bbb also had amit.patel@praksha.academy → allowed (different tenant_id)
```

### Cross-tenant query is empty

```sql
-- Teacher from Tenant A cannot see Tenant B courses
SELECT * FROM courses
WHERE tenant_id = 'tenant-aaa';
-- Returns only Tenant A courses, never Tenant B data
```

---

## Assessment Sample (Tenant A)

### Assignment

| id | course_id | title | due_at | status |
|---|---|---|---|---|
| asgn-a01 | course-a01 | Python Basics Assignment | 2025-03-15 | published |

### Quiz

| id | course_id | title | max_attempts | status |
|---|---|---|---|---|
| quiz-a01 | course-a01 | Python Variables Quiz | 2 | published |

### Exam

| id | course_id | title | exam_date | is_online | status |
|---|---|---|---|---|---|
| exam-a01 | course-a01 | Python Mid-Term | 2025-04-01 | 1 | scheduled |

---

## Payment Sample (Tenant A)

| id | student_id | course_id | amount | status |
|---|---|---|---|---|
| pay-a01 | student-a01 | course-a01 | 15000.00 | completed |
| pay-a02 | student-a01 | course-a02 | 12000.00 | completed |
