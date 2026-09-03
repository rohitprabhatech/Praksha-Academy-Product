# Frontend Dependency Map

Based on the **actual** repo (public site + student shell + admin CMS exist; teacher and owner academic CRUD do not).

```
Sprint 00  Analysis (complete)
        ↓
Sprint 01  Foundation (Ganesh) — toasts, one admin shell, shared states, logo
        ↓
Sprint 02  Authentication UI
        ↓
    ┌───┴────────────────┐
    ↓                    ↓
Sprint 03 Public      Sprint 04 Owner shell
                         ↓
              ┌──────────┼──────────┐
              ↓          ↓          ↓
           Sprint 05  Sprint 06  Sprint 07
           Students   Teachers   Classes/Subjects/Batches
                         ↓
                      Sprint 08 Courses (assign teacher)
                         ↓
           ┌─────────────┼──────────────┬────────────┐
           ↓             ↓              ↓            ↓
        Sprint 09     Sprint 10      Sprint 11    Sprint 12
        Curriculum    Live/Materials Assign/Quiz  Enroll/Pay/
                                     /Exams       Marks view
                         ↓
                      Sprint 13 CMS/Reports harden
                         ↓
                      Sprint 14 Teacher dashboard
                         ↓
                      Sprint 15 Teacher course ops
                         ↓
                      Sprint 16 Teacher assessments/marks/attendance
                         ↓
                      Sprint 17 Student learning
                         ↓
                      Sprint 18 Student assessments
                         ↓
                      Sprint 19 Notifications
                         ↓
                      Sprint 20 Responsive UX
                         ↓
                      Sprint 21 Testing
                         ↓
                      Sprint 22 Final QA
```

Sprint 03 may run after 01 in parallel with 02 **only** if Team Lead accepts two branches.

Teacher cannot start before Owner can assign a teacher to a course (08) and auth roles exist (02).
