# Students — Frontend Requirements

**Backend dependency: frontend will consume the available backend/API service.**

| Requirement ID | Feature | User Role | Page | Purpose | User Action | Expected UI | Validation | UI States | Acceptance Criteria | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| STU-01 | Owner student CRUD | Owner | `/admin/students*` | Manage learners | Add/edit | List/details | Name, email | L/E/Err/S | Search/pagination | 05 | Not started |
| STU-02 | Student dashboard | Student | `/student/dashboard` | Home | Continue | Stats + progress | N/A | Mock today | Continue → learning | Exists; 17 | Partial |
| STU-03 | My courses | Student | `/student/courses` | Access assigned | Filter | Cards | N/A | Empty tab | Exists | Exists | Partial |
| STU-04 | Live sessions | Student | `/student/live-classes` | Attend | Join | List + join | N/A | Disabled no URL | 17 | 17 | Not started |
| STU-05 | Assignments submit | Student | `/student/assignments*` | Submit work | Upload | File + status | File required | Closed disabled | 18 | 18 | Not started |
| STU-06 | Quizzes | Student | `/student/quizzes*` | Attempt | Submit answers | Form + results | Answers required | L/E/Err/S | 18 | 18 | Not started |
| STU-07 | Marks/progress | Student | `/student/marks` `/progress` | View results | Read | Tables/bars | N/A | Empty | 17–18 | 17–18 | Not started |
| STU-08 | Shell pages | Student | wishlist, certificates, profile, notifications | Existing | Use | Existing UI | Profile email | Empty certs | Do not rebuild | Exists | Partial |
