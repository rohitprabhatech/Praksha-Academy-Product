# Praksha Academy — Current Frontend Project Analysis

**Scope:** Frontend only.  
**Source of truth:** Existing codebase under `frontend/` inspected on 17 August 2026.  
**Application code was not modified.**

---

## 1. Project Overview

Praksha Academy is a React + Vite frontend for an education academy. The product currently combines:

- A **public marketing website** (home, courses catalog, course details, about, contact, blog, programs).
- **Student authentication screens** (login, register, forgot password, OTP).
- A **student dashboard shell** (dashboard, my courses, wishlist, certificates, notifications, profile).
- An **admin (academy owner) dashboard** with foundation screens plus content, communication, and reports modules.

There is **no teacher frontend**. There is **no owner/admin academic management UI** (students, teachers, classes, subjects, courses, curriculum, live classes, assignments, exams, enrollments, payments, coupons).

The existing team assignment file `frontend/Admin_Dashboard_Requirements/requirements.md` treats the academy operator as **Admin**, not “Owner”. In this documentation, **Academy Owner = existing Admin frontend** at `/admin/*`.

Stack found in `frontend/package.json`:

| Area | Technology |
| --- | --- |
| Runtime | React 18, Vite 5 |
| Routing | react-router-dom 7 |
| UI | MUI 5, Bootstrap 5, custom CSS |
| Forms | react-hook-form |
| Charts | recharts |
| HTTP | axios |
| Motion | framer-motion, aos |
| Toasts | react-toastify (imported, **ToastContainer not mounted**) |
| PDF | jspdf (student certificates) |
| Icons | react-icons |

Data is almost entirely **local mock/static data**. Axios exists (`services/httpClient.js`, `services/api.js`) but is not consumed by pages.

---

## 2. Existing Frontend Structure

```
frontend/
├── Admin_Dashboard_Requirements/requirements.md
├── package.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── assets/                  (vite.svg, react.svg; logo PNG imported but not present in src/assets listing)
│   ├── components/
│   │   ├── about/               (16 About sections)
│   │   ├── admin/               (layout, charts, common table/modal)
│   │   ├── auth/                (login, register, forgot password, OTP forms)
│   │   ├── common/
│   │   ├── contact/
│   │   ├── courses/
│   │   ├── home/                (several unused/orphan components)
│   │   ├── navigation/          (Navbar, Footer)
│   │   └── student/
│   ├── constants/               (siteData, theme, adminDashboard)
│   ├── context/                 (ThemeModeContext only)
│   ├── data/                    (courses, aboutData, contactData, mediaData)
│   ├── layouts/                 (MainLayout, StudentLayout, AdminLayout)
│   ├── pages/
│   │   ├── admin/               (Dashboard, Login, Profile, Settings, Blog, Gallery, FAQ, Testimonials, Notifications, ContactMessages, Reports)
│   │   ├── auth/
│   │   ├── student/
│   │   └── public pages
│   ├── routes/                  (AppRoutes.jsx, AdminRoutes.jsx)
│   ├── services/                (httpClient.js, api.js — unused by UI)
│   ├── styles/
│   ├── theme/                   (duplicate of constants/theme tokens)
│   └── utils/                   (certificatePdf.js)
```

**Not found:**

- `src/hooks/`
- `src/pages/teacher/`
- Auth context / protected routes
- Admin pages for Students, Teachers, Classes, Subjects, Courses, Materials, LiveClasses, Assignments, Exams, Enrollments, Payments, Coupons

---

## 3. Existing Pages

Status values: **Complete** = usable UI with local/mock data; **Partial** = exists but thin, disconnected, or missing states; **Missing** = no page file/route.

### 3.1 Public website

| Page | Route | Purpose | Status | Notes |
| --- | --- | --- | --- | --- |
| Home | `/` | Marketing landing page | Complete | Custom inline hero, featured courses, teachers, stories. Uses `data/courses.js`. Does **not** use `components/home/Hero.jsx`. |
| Courses | `/courses` | Catalog with search, category, sort, pagination | Complete | Static courses data. Dynamic by slug, not hardcoded course pages. |
| Course Details | `/courses/:slug` | Public course landing | Complete | Overview, curriculum, instructor, FAQ, reviews, related courses. Empty/not-found state exists. |
| Programs | `/programs` | Program tracks | Partial | Three static cards only. Thin compared with Home/About. |
| Blog | `/blog` | Public articles | Partial | Hardcoded posts. Not connected to admin Blog module. No article detail route. |
| About | `/about` | Academy story | Complete | Rich sections. Some content still TODO in `aboutData.js`. Faculty/timeline/recognition hide when empty. |
| Contact | `/contact` | Enquiry / callback | Complete | Form validation + loading/success/error. Contact values in `contactData.js` are mostly null TODOs. |
| Not Found | `*` | 404 | Complete | Generic public 404. |
| Teachers (public) | — | Faculty listing | Missing | Home shows featured teachers from course data only. |
| FAQ (standalone) | — | Public FAQ page | Missing | FAQ exists inside About and Contact preview, plus admin FAQ. |
| Success Stories | — | Dedicated page | Missing | Home has story placeholders. |
| Why Choose Us | — | Dedicated page | Missing | Exists as unused `components/home/WhyChooseUs.jsx`; Home has its own content. |
| Privacy / Terms / Refund | `/privacy-policy`, `/terms`, `/refund-policy`, `/privacy` | Legal | Missing | Linked from Footer and Login footer. Login uses `/privacy`; Footer uses `/privacy-policy`. |

### 3.2 Authentication

| Page | Route | Purpose | Status | Notes |
| --- | --- | --- | --- | --- |
| Login | `/login` | Student/public sign in | Partial | UI + validation complete. Submit only toasts; no redirect, no role routing, no API. |
| Register | `/register` | Create account | Partial | UI + validation complete. Redirects to `/login` after mock success. |
| Forgot Password | `/forgot-password` | Request reset | Partial | Email form + success UI. No reset-password page. |
| Verify OTP | `/verify-otp` | OTP entry | Partial | 6-digit OTP UI. Email from location state. Mock only. |
| Admin Login | `/admin/login` | Admin sign in | Partial | Navigates to `/admin/dashboard` with no credential check. |
| Reset Password | — | Set new password | Missing | |
| Change Password | — | Authenticated password change | Missing | |
| Unauthorized / Access Denied | — | Role/auth errors | Missing | |

### 3.3 Student

| Page | Route | Purpose | Status | Notes |
| --- | --- | --- | --- | --- |
| Student Dashboard | `/student/dashboard` | Overview stats + continue learning | Partial | Mock data. No live classes, assignments, or progress depth. |
| My Courses | `/student/courses` | Enrolled courses + filters | Partial | Mock list. Continue action only toasts. No course player. |
| Wishlist | `/student/wishlist` | Saved courses | Partial | Mock list + empty state. |
| Certificates | `/student/certificates` | Issued certificates + PDF | Partial | Mock list; client-side PDF via jspdf. Empty state exists. |
| Notifications | `/student/notifications` | In-app notifications | Partial | Mock list, read/unread filter, empty state. |
| Profile | `/student/profile` | Edit profile | Partial | Form + validation. Mock save. No change password. |
| Course learning / player | — | Lessons, materials | Missing | |
| Live / recorded classes | — | Class schedule | Missing | |
| Assignments / quizzes / exams | — | Assessment | Missing | |
| Marks / attendance / progress | — | Academic tracking | Missing | |
| My Teachers / My Batches | — | Relationship screens | Missing | |

Student routes are **not protected**. Anyone can open `/student/*`.

### 3.4 Admin / Academy Owner

| Page | Route | Purpose | Status | Notes |
| --- | --- | --- | --- | --- |
| Admin Dashboard | `/admin/dashboard` | KPI cards + charts | Partial | Static constants in `adminDashboard.js`. Refresh button has no action. |
| Admin Profile | `/admin/profile` | Admin identity | Partial | Local form UI. Not wired to `adminApi`. |
| Admin Settings | `/admin/settings` | Theme + academy defaults | Partial | Dark/light toggle works via ThemeModeContext. Other settings local. |
| Blog List / Create / Edit / Details | `/admin/blog`, `/create`, `/:id`, `/:id/edit` | CMS blog | Partial | Full CRUD UI on mock arrays. |
| Gallery List / Add Image / Add Video | `/admin/gallery`, `/add-image`, `/add-video` | Media CMS | Partial | Mock items. |
| FAQ List / Add / Edit | `/admin/faq`, `/add`, `/:id/edit` | FAQ CMS | Partial | Mock items. |
| Testimonials List / Add / Edit | `/admin/testimonials`, `/add`, `/:id/edit` | Testimonials CMS | Partial | Mock items. |
| Notifications List / Create | `/admin/notifications`, `/create` | Broadcast UI | Partial | Mock. Audience includes Students/Teachers. |
| Contact Messages List / Details | `/admin/contact-messages`, `/:id` | Inbox | Partial | Mock. Reply is local. |
| Student Reports | `/admin/reports/students` | Report UI | Partial | Charts + table, mock data. |
| Course Reports | `/admin/reports/courses` | Report UI | Partial | Mock data. |
| Revenue Reports | `/admin/reports/revenue` | Report UI | Partial | Mock data. |
| Performance Reports | `/admin/reports/performance` | Report UI | Partial | Mock quiz/assignment columns. |
| Students | `/admin/students` | Student management | Missing | Sidebar item exists as disabled “Soon”. |
| Teachers | `/admin/teachers` | Teacher management | Missing | Disabled nav. |
| Classes | `/admin/classes` | Academic class (8–12 etc.) | Missing | Disabled nav. |
| Subjects | `/admin/subjects` | Subjects | Missing | Disabled nav. |
| Courses (admin) | `/admin/courses` | Course CRUD | Missing | Disabled nav. Public catalog is separate. |
| Materials | `/admin/materials` | Study materials | Missing | Disabled nav. |
| Live Classes | `/admin/live-classes` | Schedule | Missing | Disabled nav. |
| Assignments | `/admin/assignments` | Assignments | Missing | Disabled nav. |
| Exams | `/admin/exams` | Exams | Missing | Disabled nav. |
| Enrollments | `/admin/enrollments` | Enrollment | Missing | Disabled nav. |
| Payments | `/admin/payments` | Payments | Missing | Disabled nav. |
| Coupons | `/admin/coupons` | Coupons | Missing | Disabled nav. |

### 3.5 Teacher

| Page | Route | Purpose | Status | Notes |
| --- | --- | --- | --- | --- |
| Entire teacher experience | `/teacher/*` | Teacher dashboard and course ops | Missing | No layout, routes, or pages. |

---

## 4. Existing Components

### 4.1 In use

**Public / shared**

- Navigation: `Navbar`, `Footer`
- Courses: `CategoryFilter`, `CourseGrid`, `CourseCard`, `CoursePagination`, `SortSelect`, `CourseOverview`, `Curriculum`, `InstructorSection`, `LearningOutcomes`, `RelatedCourses`, `ReviewsSection`, `CourseFAQ`
- About: `AboutHero`, `TrustStrip`, `WhoWeAre`, `Differentiators`, `LearningPhilosophy`, `StudentJourney`, `LearningEnvironment`, `Mission`, `Vision`, `Values`, `Faculty`, `AcademyTimeline`, `Recognition`, `AboutFAQ`, `CTASection`
- Contact: `QuickActions`, `ContactForm`, `RequestCallback`, `AcademicAdvisor`, `ContactInfo`, `WorkingHours`, `OnlineSupport`, `MapPreview`, `FAQPreview`, `SupportFlow`, `ContactCTA`
- Common: `SectionHeading`, `ImagePlaceholder`, `VideoModal`, `FloatingContact`, `FeatureCard`
- Auth: `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `VerifyOtpForm`

**Student**

- `Sidebar`, `DashboardHeader`, `CourseCard`, `WishlistCourseCard`, `CertificateCard`, `NotificationCard`, `ProfileCard`

**Admin**

- Used by current `AdminLayout`: `AdminSidebar`
- Used by dashboard: `DashboardCard`, `RecentActivities`, `UpcomingClasses`, `RevenueChart`, `StudentChart`, `CourseEnrollmentChart`, `ChartSurface`
- Used by content/reports: `PageHeader`, `DataTable`, `AdminModal`, `StatCard`, `AdminSurface`

### 4.2 Duplicate / unused / orphaned

| Component | Issue |
| --- | --- |
| `components/home/Hero.jsx` | Not imported by `pages/Home.jsx` |
| `components/home/WhyChooseUs.jsx` | Not imported by Home |
| `components/home/Categories.jsx` | Not imported by Home |
| `components/home/Testimonials.jsx` | Not imported by Home |
| `components/admin/Sidebar.jsx` | Full nav with disabled items; **not** used by `AdminLayout` |
| `components/admin/TopNavbar.jsx` | Exists with search, theme, notifications, profile; **not** mounted |
| `components/admin/Breadcrumb.jsx` | Only used by unused TopNavbar |
| `components/admin/ProfileMenu.jsx` | Only used by unused TopNavbar |
| `components/admin/NotificationDropdown.jsx` | Only used by unused TopNavbar |
| Two theme files | `constants/theme.js` (App) vs `theme/theme.js` (About/Contact) |
| Two admin sidebars | `AdminSidebar.jsx` vs `Sidebar.jsx` |

---

## 5. Existing Dashboards

### Owner Dashboard

**Exists as Admin Dashboard** (`/admin/dashboard`).

- KPI cards: students, teachers, courses, revenue, enrollments, active students (static).
- Charts: revenue, course enrollment, student growth.
- Recent activities and upcoming classes (static).
- Layout: `AdminLayout` + `AdminSidebar` (content/reports only in the live sidebar).
- Dark/light mode exists in theme context; current AdminLayout is mostly light-styled.

### Teacher Dashboard

**Does not exist.**

### Student Dashboard

**Exists** (`/student/dashboard`).

- Greeting header, four stat cards, continue-learning list.
- Mock student name “Aditi”.
- Sidebar navigation to courses, wishlist, certificates, notifications, profile.

---

## 6. Existing Features

Implemented as usable frontend (mock/static data unless noted):

1. Public home, courses catalog (search/filter/sort/pagination), course details by slug.
2. About page with data-driven hide-when-empty sections.
3. Contact page with validated enquiry and callback forms.
4. Public blog listing (static posts).
5. Public 404.
6. Student login/register/forgot-password/OTP UI with client validation.
7. Student dashboard shell and the six student pages listed above.
8. Student certificate PDF download/view (client-side).
9. Admin login (unconditional navigate).
10. Admin dashboard charts and stat cards.
11. Admin profile and settings UI.
12. Admin CMS: Blog, Gallery, FAQ, Testimonials.
13. Admin notifications compose/list UI.
14. Admin contact-message inbox UI.
15. Admin reports (students, courses, revenue, performance) with charts.
16. Dark/light theme toggle on public navbar and admin settings.
17. Responsive public navbar/footer; student and admin mobile drawers.
18. Dynamic public course pages (one template + `courses.js` data).

---

## 7. Partially Completed Features

1. **Authentication** — screens exist; no session, no role redirect, no route guards, no reset/change password.
2. **Student learning** — dashboard/catalog of enrolled courses exist; no player, live class, assignment, quiz, exam, marks, or attendance.
3. **Admin dashboard** — visual complete; static data; Refresh unused; two competing shells.
4. **Admin content/reports** — CRUD/list UIs on mock arrays; no persistence; toasts may not render (no `ToastContainer`).
5. **Admin navigation** — `adminNavGroups` lists all modules as disabled; live `AdminSidebar` only shows content/reports.
6. **Routing** — `/admin/*` handled by `AdminRoutes`; content routes also declared in `AppRoutes` under a second `AdminLayout`. Fragile split.
7. **Public Programs** — route exists, content is a stub.
8. **Public search** — Courses page search works; Navbar search input does nothing.
9. **Contact/About real content** — structure complete; emails, phones, address, faculty, awards still TODO/empty.
10. **HTTP layer** — axios client and `adminApi` exist; unused.
11. **Home marketing components** — older Hero/Categories/Testimonials unused; Home rewritten inline.

---

## 8. Missing Frontend Features

Confirmed missing after inspection (not assumed):

**Teacher frontend (all)**

- Teacher layout, dashboard, my courses, students, batches, live sessions, materials, assignments, quizzes, exams, marks, attendance, notifications, profile, settings.

**Owner academic & operations**

- Student management (list/add/edit/details).
- Teacher management (list/add/edit/details).
- Classes, subjects.
- Admin course CRUD + curriculum builder.
- Study materials, live classes, assignments, exams.
- Enrollments, payments, coupons.
- Marks, attendance, quizzes as dedicated owner screens (not in original admin file; quizzes only appear as report columns).

**Student learning**

- Course player / lesson view.
- Live and recorded classes.
- Assignment submission, quiz attempt, exam taking.
- Marks, attendance, course progress depth.
- My teachers, my batches.
- Settings / change password.

**Auth & access**

- Protected routes.
- Role-based redirection (owner / teacher / student).
- Reset password, change password.
- Unauthorized / access denied pages.
- Logout that clears a session (currently toast + navigate).

**Public**

- Dedicated teachers page, FAQ page, success stories page.
- Legal pages (privacy, terms, refund).
- Blog article detail.
- Working global course search in navbar.

**Engineering gaps that affect all features**

- No `hooks/` folder.
- No auth context.
- No shared form field kit beyond MUI + repeated `sx`.
- Duplicate admin shells and duplicate theme files.

---

## 9. UI/UX Issues

### Layout

- Admin content pages use a different sidebar than the original dashboard sidebar (white Inter sidebar vs blue full-nav sidebar).
- Current `AdminLayout` has no desktop TopNavbar (search, notifications, profile menu exist but unused).
- Student and admin layouts cap content width differently (`1200px` vs `1280px` + sidebar).
- Nested/split admin routing can send unmatched admin URLs to NotFound inside `AdminRoutes`.

### Spacing / visual consistency

- Public site mixes custom CSS + Bootstrap grid + MUI.
- Admin dashboard uses MUI theme from `constants/theme.js` (pill buttons globally).
- Content/reports pages hardcode Inter + `#2563EB` and do not fully follow the same card/button radius as dashboard.
- Two theme sources (`constants/theme.js` and `theme/theme.js`).

### Responsive

- Public navbar has mobile drawer.
- Student/admin have mobile drawers.
- Home trending course track is custom horizontal scroll (needs device QA).
- Admin reports charts need tablet/mobile QA (Recharts containers exist).

### Navigation

- Navbar search is non-functional.
- Footer legal links 404.
- Login footer uses `/privacy`; Footer uses `/privacy-policy`.
- Admin live sidebar omits Users/Academic/Learning/Sales even though those routes are specified in requirements.
- Student “Continue” goes to `/student/courses`, not a lesson.

### Inconsistent / duplicate UI

- Two admin sidebars.
- Two home implementations (page vs unused components).
- Duplicate `CourseCard` (public courses vs student).
- Duplicate `FeatureCard` / `SectionHeader` vs `SectionHeading`.

### Broken / incomplete UI

- `praksha-mark.png` is imported in Navbar, Footer, student sidebar, admin login/sidebars; **not found** in `src/assets` listing (vite.svg and react.svg only). Logo likely broken.
- `hero-learning.jpg` imported on Home; confirm asset presence at build time.
- `react-toastify` is used without `ToastContainer` — success/error toasts likely never appear.
- `react-helmet-async` is a dependency but unused; About/Contact still have SEO TODOs.
- Admin login accepts any/empty-looking submit (HTML `required` only) and always enters dashboard.
- Programs page looks unfinished next to Home/About.

### Usability

- No auth wall on student/admin dashboards.
- Login does not take the user into the student dashboard.
- Contact details (phone/email/address) are empty by design until confirmed — Contact page may look sparse in production.
- Public blog has no article pages.
- Course data and student enrolled-course data are different mock datasets (titles do not match).

---

## 10. Existing ~10% Work

The planning brief called the project ~10% complete. Inspection shows **more than a blank starter**, concentrated in marketing + shells, not in academic operations.

**What appears already completed (frontend UI, mock data):**

1. Project bootstrap (Vite, React, MUI, Bootstrap, Router).
2. Public website core: Home, Courses, Course Details, About, Contact.
3. Public Blog listing and a thin Programs page.
4. Auth screens: Login, Register, Forgot Password, Verify OTP.
5. Student layout + six student pages with mock data.
6. Admin layout + Admin Login, Dashboard, Profile, Settings.
7. Admin content/communication/reports pages (Renuka module in the team assignment) as mock CRUD/list UIs.
8. Shared admin table/modal/page-header/stat-card.
9. Theme tokens and dark/light toggle.
10. Static course catalog treated as data (`data/courses.js`), not one page per course.
11. Written admin team assignment (`Admin_Dashboard_Requirements/requirements.md`).

**What that 10% is not:**

- Not a production-ready LMS.
- Not teacher product.
- Not owner course/teacher/student/batch operations.
- Not real authentication.
- Not API-integrated.

**Rough frontend completeness (judgment from files, not a metric tool):**

| Area | Approx. UI completeness |
| --- | --- |
| Public website | ~70% (Programs, legal, search, teachers, blog detail remaining) |
| Auth UI | ~50% (guards, reset, roles remaining) |
| Student product | ~25% (shell only) |
| Owner/admin product | ~30% (foundation + content/reports; academic/sales missing) |
| Teacher product | 0% |
| Production hardening (a11y QA, testing, consistency) | ~10% |

Overall remaining frontend work is the majority of the product: owner academic modules, entire teacher app, student learning/assessment, auth completion, unification, and QA.
