# Frontend Work Status

**Source:** Code inspection of `frontend/` plus `frontend/Admin_Dashboard_Requirements/requirements.md`.  
**Use this file as the input to sprint planning.**  
**Frontend only.** Backend/API dependency — frontend will integrate with the available API.

Status values:

- **COMPLETED** — implemented and usable (even if still on mock data).
- **PARTIALLY COMPLETED** — started; missing screens, states, wiring, or production quality.
- **NEEDS IMPROVEMENT** — exists but UI/UX or functional quality is not production-ready.
- **NOT STARTED** — required frontend work with no pages/routes/components.
- **UNKNOWN** — cannot be confirmed from the existing project or client files.

---

## COMPLETED

Already implemented and usable as frontend UI.

| ID | Item | Evidence |
| --- | --- | --- |
| C-01 | Vite/React app bootstrap | `frontend/package.json`, `src/main.jsx`, `src/App.jsx` |
| C-02 | Public Home page | `src/pages/Home.jsx` |
| C-03 | Public Courses catalog (search, filter, sort, pagination) | `src/pages/Courses.jsx` |
| C-04 | Public Course Details (dynamic slug) | `src/pages/CourseDetails.jsx`, `src/data/courses.js` |
| C-05 | Public About page | `src/pages/About.jsx` + about components |
| C-06 | Public Contact page (form UI) | `src/pages/Contact.jsx` |
| C-07 | Public 404 | `src/pages/NotFound.jsx` |
| C-08 | Public Navbar + Footer | `components/navigation/` |
| C-09 | MainLayout (navbar/footer/AOS) | `layouts/MainLayout.jsx` |
| C-10 | Student layout + sidebar | `layouts/StudentLayout.jsx` |
| C-11 | Admin reusable table/modal/header/stat card | `components/admin/common/` |
| C-12 | Admin charts (revenue, students, enrollment) | `components/admin/charts/` |
| C-13 | Theme tokens + dark/light toggle context | `constants/theme.js`, `context/ThemeModeContext.jsx` |
| C-14 | Static course dataset treated as dynamic catalog | `data/courses.js` |
| C-15 | Admin team assignment document | `Admin_Dashboard_Requirements/requirements.md` |

---

## PARTIALLY COMPLETED

Started but incomplete.

| ID | Item | What exists | What is missing |
| --- | --- | --- | --- |
| P-01 | Student Login | Full UI + validation | Session, API, role redirect, dashboard navigation |
| P-02 | Register | Full UI + validation | Persistence, email verification beyond mock OTP |
| P-03 | Forgot Password | Email + success UI | Reset password page |
| P-04 | Verify OTP | 6-digit UI | Real verification, recovery of lost email state |
| P-05 | Admin Login | Form + navigate | Validation depth, auth guard, credentials |
| P-06 | Student Dashboard | Stats + continue list | Live data, next-class, assignments, real progress |
| P-07 | Student My Courses | Filter tabs + cards | Course player, empty enrollment from API |
| P-08 | Student Wishlist | List + empty state | Persist, enroll CTA to real checkout |
| P-09 | Student Certificates | Cards + PDF | Real certificate records |
| P-10 | Student Notifications | List + filters | Real feed, mark-all persistence |
| P-11 | Student Profile | Edit form | Avatar upload, change password, settings |
| P-12 | Admin Dashboard | KPI + charts | Live data, working Refresh, upcoming class links |
| P-13 | Admin Profile / Settings | Forms + theme toggle | Save to API, password change |
| P-14 | Admin Blog CMS | List/create/edit/details | Persistence, public blog connection, rich text |
| P-15 | Admin Gallery | List/add image/video | Persistence, public gallery page |
| P-16 | Admin FAQ CMS | List/add/edit | Persistence, public FAQ page |
| P-17 | Admin Testimonials CMS | List/add/edit | Persistence, Home testimonials connection |
| P-18 | Admin Notifications | List/create | Persistence, delivery, teacher/student inboxes |
| P-19 | Admin Contact Messages | List/details/reply UI | Persistence, link from public Contact form |
| P-20 | Admin Reports | Four report pages | Live data, export UX completeness |
| P-21 | Public Blog | Listing + search/filter | Article detail, CMS connection |
| P-22 | Public Programs | Three cards | Full program UX matching Home quality |
| P-23 | Admin routing/layout | Two route files + AdminLayout | Single owner route tree, TopNavbar, one sidebar |
| P-24 | HTTP services | axios + `adminApi` stubs | Usage from pages |
| P-25 | Contact/About content | Structure complete | Real phone, email, address, faculty, media |

---

## NEEDS IMPROVEMENT

Implemented but requires UI/UX or functional improvement.

| ID | Item | Problem |
| --- | --- | --- |
| I-01 | Toast notifications | `toast()` called; `ToastContainer` never mounted |
| I-02 | Logo asset | `praksha-mark.png` imported; not in listed assets |
| I-03 | Duplicate admin sidebars | `AdminSidebar.jsx` vs `Sidebar.jsx` |
| I-04 | Unused admin chrome | `TopNavbar`, `Breadcrumb`, `ProfileMenu`, `NotificationDropdown` not in layout |
| I-05 | Unused home components | `Hero`, `WhyChooseUs`, `Categories`, `Testimonials` unused |
| I-06 | Duplicate themes | `constants/theme.js` vs `theme/theme.js` |
| I-07 | Navbar search | Input does not search or navigate |
| I-08 | Legal links | Footer/Login links 404; privacy path mismatch |
| I-09 | Unprotected dashboards | `/student/*` and `/admin/*` (except login) open without auth |
| I-10 | Admin login security UX | Any submit enters dashboard |
| I-11 | Global MUI button shape | Theme uses pill buttons; admin content uses 8–10px radius |
| I-12 | Mock dataset mismatch | Public courses ≠ student enrolled courses ≠ admin report rows |
| I-13 | SEO | `react-helmet-async` unused; About/Contact TODOs |
| I-14 | Programs visual quality | Placeholder compared with Home |
| I-15 | Admin sidebar completeness | Live nav omits Users/Academic/Learning/Sales |
| I-16 | Home vs component library | Two competing home implementations |

---

## NOT STARTED

Required frontend work that does not exist.

### Authentication / access

| ID | Item |
| --- | --- |
| N-01 | Reset Password page |
| N-02 | Change Password page (all roles) |
| N-03 | Unauthorized page |
| N-04 | Access Denied page |
| N-05 | Auth context + protected route wrappers |
| N-06 | Role-based frontend redirection after login |

### Owner — users & academic (confirmed by admin requirements file)

| ID | Item |
| --- | --- |
| N-07 | Student List / Add / Edit / Details |
| N-08 | Teacher List / Add / Edit / Details |
| N-09 | Class List / Add / Edit |
| N-10 | Subject List / Add / Edit |
| N-11 | Admin Course List / Add / Edit / Details |
| N-12 | Curriculum builder UI |
| N-13 | Study Materials CRUD |
| N-14 | Live Classes schedule UI |
| N-15 | Assignments list/create/details/submissions |
| N-16 | Exams list/create/questions/results |
| N-17 | Enrollment list/details/manual enrollment |
| N-18 | Payments list/details |
| N-19 | Coupons list/create/edit |

### Owner — requested in this planning brief, not in original admin assignment

| ID | Item |
| --- | --- |
| N-20 | Owner Marks screens |
| N-21 | Owner Attendance screens |
| N-22 | Owner Quizzes screens (separate from Exams) |

### Teacher product

| ID | Item |
| --- | --- |
| N-23 | Teacher layout, routes, dashboard |
| N-24 | Teacher My Courses / Course Details |
| N-25 | Teacher My Students / My Batches |
| N-26 | Teacher Live Sessions / Online Classes |
| N-27 | Teacher Assignments + review |
| N-28 | Teacher Quizzes + results |
| N-29 | Teacher Exams + marks |
| N-30 | Teacher Attendance |
| N-31 | Teacher Study / Course Materials |
| N-32 | Teacher Notifications / Profile / Settings |

### Student learning (beyond current shell)

| ID | Item |
| --- | --- |
| N-33 | Student course learning / lesson player |
| N-34 | Student live classes / upcoming / recorded |
| N-35 | Student assignment list + submission |
| N-36 | Student quiz attempt + results |
| N-37 | Student exams + marks |
| N-38 | Student attendance |
| N-39 | Student study materials |
| N-40 | Student course progress (dedicated) |
| N-41 | Student My Teachers / My Batches |
| N-42 | Student Settings |

### Public website gaps

| ID | Item |
| --- | --- |
| N-43 | Public Teachers page |
| N-44 | Standalone FAQ page |
| N-45 | Success Stories page (if required) |
| N-46 | Privacy Policy, Terms, Refund Policy pages |
| N-47 | Public blog article detail |
| N-48 | Working navbar course search |

### Shared engineering

| ID | Item |
| --- | --- |
| N-49 | Shared hooks (`useAuth`, `useDebounce`, table helpers) |
| N-50 | Unified owner/teacher/student route files |
| N-51 | Frontend test suite (none found) |

---

## UNKNOWN

Cannot be confirmed from the existing project or the admin requirements file.

| ID | Question | Why unknown |
| --- | --- | --- |
| U-01 | Is “Admin” the same role as “Academy Owner”? | Code and assignment say Admin. This planning brief says Owner. |
| U-02 | Are Quizzes a separate module from Exams? | Reports show quiz scores; admin assignment only lists Exams. |
| U-03 | Is Batch Management different from Classes (Class 8–12)? | Assignment uses Classes; this brief uses Batches. |
| U-04 | Is there a public checkout / payment UI for students? | Admin Payments exist in assignment; no student checkout pages. |
| U-05 | Can students self-enroll from Course Details? | Course Details has CTA; no enrollment flow. |
| U-06 | Is a public Gallery page required? | Admin Gallery exists; no public gallery route. |
| U-07 | Are Marks/Attendance owner-level, teacher-level, or both? | This brief lists both owner and teacher. Original admin file lists neither. |
| U-08 | Multi-teacher per course? Multi-course per teacher? | Not specified in code. |
| U-09 | Student registration vs owner-created students | Both Register UI and Add Student are implied. |
| U-10 | Live class meeting vendor (UI only: link field vs embedded) | Live class fields in assignment include Meeting Link. |
| U-11 | Certificate issuance rules | Student PDF exists; issuance workflow does not. |
| U-12 | Whether `/owner` routes should replace `/admin` | Current routes are `/admin/*`. |

Items in UNKNOWN must not be invented in sprints. Sprints that touch them must either follow the existing admin assignment (Classes, Exams, Admin routes) or wait for an answer in `open-questions.md`.
