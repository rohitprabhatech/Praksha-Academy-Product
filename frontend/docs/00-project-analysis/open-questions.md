# Open Questions

Only questions that **cannot** be answered from:

- the existing frontend codebase
- `frontend/Admin_Dashboard_Requirements/requirements.md`

Do not invent answers. Until answered, developers must follow the **existing project conventions** listed under “Interim rule”.

---

## Role and naming

| ID | Question | Interim rule |
| --- | --- | --- |
| Q-01 | Is the Academy Owner the same as the current **Admin** user? | Keep routes and copy as **Admin** (`/admin/*`) unless the client confirms a rename to Owner. |
| Q-02 | Should owner URLs change from `/admin` to `/owner`? | Do not rename routes until confirmed. |
| Q-03 | Can one person be both teacher and admin? | Build separate UIs; do not merge dashboards. |

---

## Course and teaching model

| ID | Question | Interim rule |
| --- | --- | --- |
| Q-04 | Can one course have multiple teachers? | Course create form in the admin assignment has a single **Teacher** field. Use one teacher unless told otherwise. |
| Q-05 | Can one teacher manage multiple courses? | Assume yes (teacher “My Courses” is a list). |
| Q-06 | Can a student join multiple courses? | Assume yes (student My Courses is already a list). |
| Q-07 | How do Batches relate to Classes and Courses? | **Frontend batches are in scope** (Sprint 07/15). Keep Class = academic grade (8–12). Batch = named group with class required and course optional. Do not invent capacity rules. |
| Q-08 | Are “Classes” academic grades (8–12) or timetable batches? | Treat as **academic grade/category** as in the admin assignment examples. |
| Q-09 | Must every course belong to a Class + Subject? | Admin course fields include Category, Class, Subject, Teacher. Include those fields. |
| Q-10 | Are public catalog courses the same records as admin courses? | Design UI as one dynamic course model. Public pages already use `courses.js`. |

---

## Assessments

| ID | Question | Interim rule |
| --- | --- | --- |
| Q-11 | Are **Quizzes** separate from **Exams**? | **Yes for UI:** separate nav and routes (Sprint 11/16/18). Keep the same QuestionEditor component. Do not invent different grading engines. |
| Q-12 | Who creates assignments — owner, teacher, or both? | Admin assignment puts Assignments under admin learning. Also required on teacher UI in this brief. Build owner screens first; teacher screens consume the same UI patterns. |
| Q-13 | Who enters marks and attendance — owner, teacher, or both? | **Interim (now in sprint plan):** Teacher enters; Owner read-only tables; Student views own history. Change only if Team Lead says otherwise. |
| Q-14 | Are exams online (in-app) or offline mark entry? | Unknown. UI should support listing, scheduling, and results; question builder only if online exams are confirmed. |

---

## Enrollment and payments

| ID | Question | Interim rule |
| --- | --- | --- |
| Q-15 | Do students self-enroll and pay from the public Course Details page? | Course Details has a purchase-style CTA but no checkout. Do not invent a payment gateway UI beyond admin Payments screens until confirmed. |
| Q-16 | Is Manual Enrollment (owner) the only enrollment method for v1? | Admin assignment includes EnrollmentList, EnrollmentDetails, ManualEnrollment. Build those. |
| Q-17 | Are coupons student-facing or admin-only? | Admin assignment is admin Coupons CRUD. No student coupon field exists. Admin-only until confirmed. |

---

## Users and registration

| ID | Question | Interim rule |
| --- | --- | --- |
| Q-18 | Do students self-register, or does the owner create accounts? | Both exist as implied UI (Register page + Add Student). Keep both screens. |
| Q-19 | Do teachers self-register? | Admin assignment is Add Teacher. No public teacher register. Owner-created teachers only. |
| Q-20 | What identifier does login use — email only? | Current forms use email + password. |

---

## Live classes and materials

| ID | Question | Interim rule |
| --- | --- | --- |
| Q-21 | Is the live class UI a meeting **link** field or an embedded classroom? | Admin assignment: Meeting Link. Use link + schedule UI, not a custom video SDK. |
| Q-22 | Are recorded classes a separate library or attachments on live classes? | Unknown. Student brief asks for Recorded Classes. Keep a student list UI; source TBD. |
| Q-23 | Material types required: PDF, Notes, PPT, Videos, Documents — all in v1? | Admin assignment lists all. Support those file-type options in the form. |

---

## Public website

| ID | Question | Interim rule |
| --- | --- | --- |
| Q-24 | Is a dedicated public Teachers page required? | Home already shows featured teachers. Dedicated page is optional until confirmed. |
| Q-25 | Is a dedicated Success Stories page required? | Home has story placeholders. Optional until confirmed. |
| Q-26 | Should public Blog read from Admin Blog? | Not connected today. Plan to connect in a later sprint; do not duplicate CMS. |
| Q-27 | Is a public Gallery page required? | Admin Gallery exists; no public route. Optional until confirmed. |
| Q-28 | Real contact email, phone, address, hours? | `contactData.js` is explicitly TODO/null. Content, not engineering, must supply values. |
| Q-29 | Real faculty names, timeline, awards? | `aboutData.js` hides empty sections. Content must supply values. |

---

## Product / legal

| ID | Question | Interim rule |
| --- | --- | --- |
| Q-30 | Required legal pages: Privacy, Terms, Refund — confirmed copy? | Links exist; pages do not. Need legal copy before implementation beyond a stub layout. |
| Q-31 | Certificate rules (when issued, who signs, template)? | Student PDF utility exists with mock data. |

---

## How to close a question

1. Team Leader asks the client.
2. Answer is written here (replace “Interim rule” with “Decision”).
3. Related sprint file is updated.
4. Traceability sheet status is updated.

Until then, developers must not invent business rules.
