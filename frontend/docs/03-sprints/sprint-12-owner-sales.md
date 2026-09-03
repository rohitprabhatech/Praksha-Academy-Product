# Sprint 12 — Owner Enrollments, Payments, Coupons, Marks & Attendance (Owner view)

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-12-owner-sales-and-records`  
Status: Not Started  
Estimated Duration: 5 days

---

## 2. Sprint Goal

(1) Sales: Enrollment list/details/manual enroll, Payment list/details, Coupon CRUD.  
(2) Owner **view** of Marks and Attendance as filterable tables (teacher enters in Sprint 16; owner reviews here). Do not build a payment gateway.

---

## 3. Why This Sprint Exists

Admin assignment: Enrollments, Payments, Coupons. Confirmed: owner manages students/courses; marks/attendance must be visible to owner. Student checkout is **not** in this sprint.

---

## 4. Prerequisites

Sprint 05 students, Sprint 08 courses.

**BLOCKER:** missing student or course selects for manual enrollment.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Enrollments | `/admin/enrollments`, `/manual`, `/:id` | Missing | List, manual, details |
| Payments | `/admin/payments`, `/:id` | Missing | List, details |
| Coupons | `/admin/coupons`, `/create`, `/:id/edit` | Missing | CRUD |
| Marks (owner view) | `/admin/marks` | Missing | Read-only table |
| Attendance (owner view) | `/admin/attendance` | Missing | Read-only table |

---

## 6. Page-by-Page Development Instructions

### Manual Enrollment

#### Page Purpose
Owner assigns a student to a course in the UI.

#### User
Owner.

#### Entry Point
Enrollments → Manual enrollment.

#### UI Layout
Student select, course select, optional batch select, Submit.

#### Success
Toast + row on enrollment list.

#### Duplicate
Frontend warning if same pair exists in mock.

---

### Payments

List: id, student, course, amount, status, date. Details: same + notes placeholder. No gateway SDK.

---

### Coupons

code, discount value, expiry, status.

---

### Owner Marks `/admin/marks`

#### Page Purpose
Review scores (assignment/quiz/exam) across students.

#### User
Owner.

#### UI Layout
DataTable: student, course, assessment type, title, score. Filters. EmptyState if none.

#### Actions
None required except filter; not an entry form.

---

### Owner Attendance `/admin/attendance`

DataTable: date, course/batch, student, present/absent. Filters. Read-only.

---

## 7. Component Requirements

Reuse DataTable, PageHeader, AdminModal. No new chart lib.

---

## 8. User Flow

Owner → Manual Enrollment → student + course → list.  
Owner → Payments → details.  
Owner → Coupons → create.  
Owner → Marks / Attendance → filter → view.

---

## 9–11. States / Search / Forms

Search names/codes. Filter status/course. Pagination DataTable.

### Manual enrollment

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| studentId | select | Yes | required | |
| courseId | select | Yes | required | |
| batchId | select | No | | |

### Coupon

| Field | Type | Required | Validation | UI Behavior |
| --- | --- | --- | --- | --- |
| code | text | Yes | required | |
| discount | number | Yes | ≥ 0 | |
| expiry | date | No | | |
| status | select | Yes | | |

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] All listed routes open.
- [ ] Manual enrollment adds mock row.
- [ ] No public checkout invented.
- [ ] Marks/attendance owner tables exist (may be empty).
- [ ] States, validation, responsive, reuse DataTable.
- [ ] PR `[Sprint 12] Owner Enrollments Payments Coupons Marks Attendance` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-12-owner-sales-and-records`.  
Depends on 05, 08. Blocks nothing critical for teacher entry (16 can mock). Sequential after 11 preferred.
