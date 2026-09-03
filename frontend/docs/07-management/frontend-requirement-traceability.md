# Frontend Requirement Traceability

Confirmed frontend requirements only. UNKNOWN items stay in `open-questions.md` and are not scheduled as required sprints.

**Status:** Not Started / Partial / Exists / Sprint-bound

| Requirement ID | Requirement | Role | Page / Route | Sprint | Acceptance Criteria (summary) | Status |
| --- | --- | --- | --- | --- | --- | --- |
| FR-001 | Public Home | Public | `/` | Existing; polish 03/20 | Renders; courses dynamic | Exists |
| FR-002 | Public Courses catalog | Public | `/courses` | Existing | Search/filter/sort/pagination | Exists |
| FR-003 | Public Course details | Public | `/courses/:slug` | Existing | Dynamic slug; not-found | Exists |
| FR-004 | Public About | Public | `/about` | Existing | Sections; hide empty facts | Exists |
| FR-005 | Public Contact | Public | `/contact` | Existing; 13 | Validation; success/error | Partial |
| FR-006 | Public Blog list | Public | `/blog` | Existing; 03/13 | List; later CMS connect | Partial |
| FR-007 | Public Programs | Public | `/programs` | 03 | Visual quality vs Home | Partial |
| FR-008 | Blog article | Public | `/blog/:slug` | 03 | Not-found state | Not Started |
| FR-009 | Legal pages | Public | `/privacy-policy` `/terms` `/refund-policy` | 03 | Footer links work | Not Started |
| FR-010 | Navbar search | Public | Navbar → `/courses?q=` | 03 | Query applied | Not Started |
| FR-011 | Login UI | Auth | `/login` | Existing; 02 | Validation; redirect | Partial |
| FR-012 | Register UI | Auth | `/register` | Existing; 02 | Validation | Partial |
| FR-013 | Forgot password | Auth | `/forgot-password` | Existing; 02 | Success state | Partial |
| FR-014 | Verify OTP | Auth | `/verify-otp` | Existing; 02 | 6 digits | Partial |
| FR-015 | Admin login | Owner | `/admin/login` | Existing; 02 | Empty submit blocked | Partial |
| FR-016 | Reset password | Auth | `/reset-password` | 02 | Match passwords | Not Started |
| FR-017 | Change password | All roles | Settings/profile | 02/14/17 | Current+new+confirm | Not Started |
| FR-018 | Route guards | All | `/student/*` `/admin/*` `/teacher/*` | 02 | Guest redirected | Not Started |
| FR-019 | Role redirect | Auth | Login success | 02 | Role → dashboard | Not Started |
| FR-020 | Unauthorized / access denied | Auth | `/unauthorized` `/access-denied` | 02 | Wrong role | Not Started |
| FR-021 | Toast root | All | App | 01 | Toasts visible | Not Started |
| FR-022 | Unified admin shell | Owner | AdminLayout | 01/04 | One sidebar + TopNavbar | Partial |
| FR-023 | Owner dashboard | Owner | `/admin/dashboard` | Existing; 04 | KPIs/charts; refresh | Partial |
| FR-024 | Owner profile/settings | Owner | `/admin/profile` `/admin/settings` | Existing; 04 | Theme toggle works | Partial |
| FR-025 | Owner students CRUD | Owner | `/admin/students*` | 05 | Search/filter/pagination | Not Started |
| FR-026 | Owner teachers CRUD | Owner | `/admin/teachers*` | 06 | Assignment fields | Not Started |
| FR-027 | Owner classes CRUD | Owner | `/admin/classes*` | 07 | Grade/stream names | Not Started |
| FR-028 | Owner subjects CRUD | Owner | `/admin/subjects*` | 07 | Name/status | Not Started |
| FR-029 | Owner courses CRUD | Owner | `/admin/courses*` | 08 | Dynamic; assign teacher | Not Started |
| FR-030 | Curriculum builder | Owner | `/admin/courses/:id/curriculum` | 09 | Module/chapter/lesson | Not Started |
| FR-031 | Owner materials | Owner | `/admin/materials*` | 10 | Types PDF–Documents | Not Started |
| FR-032 | Owner live classes | Owner | `/admin/live-classes*` | 10 | Meeting link field | Not Started |
| FR-033 | Owner assignments | Owner | `/admin/assignments*` | 11 | List/create/details/submissions | Not Started |
| FR-034 | Owner exams | Owner | `/admin/exams*` | 11 | Questions + results | Not Started |
| FR-035 | Owner enrollments | Owner | `/admin/enrollments*` | 12 | Manual enrollment | Not Started |
| FR-036 | Owner payments | Owner | `/admin/payments*` | 12 | List/details | Not Started |
| FR-037 | Owner coupons | Owner | `/admin/coupons*` | 12 | Create/edit | Not Started |
| FR-038 | Owner blog CMS | Owner | `/admin/blog*` | Exists; 13 | States; public connect | Partial |
| FR-039 | Owner gallery | Owner | `/admin/gallery*` | Exists; 13 | States | Partial |
| FR-040 | Owner FAQ CMS | Owner | `/admin/faq*` | Exists; 13 | States | Partial |
| FR-041 | Owner testimonials | Owner | `/admin/testimonials*` | Exists; 13 | States | Partial |
| FR-042 | Owner notifications | Owner | `/admin/notifications*` | Exists; 13/19 | Create + inbox fan-out mock | Partial |
| FR-043 | Owner contact messages | Owner | `/admin/contact-messages*` | Exists; 13 | Reply UI | Partial |
| FR-044 | Owner reports | Owner | `/admin/reports/*` | Exists; 13 | Four report pages | Partial |
| FR-045 | Teacher dashboard | Teacher | `/teacher/dashboard` | 14 | Assigned stats; empty | Not Started |
| FR-046 | Teacher my courses | Teacher | `/teacher/courses*` | 15 | Assigned only | Not Started |
| FR-047 | Teacher students | Teacher | `/teacher/students` | 15 | Filtered list | Not Started |
| FR-048 | Teacher live/materials | Teacher | `/teacher/live-classes` `/teacher/materials` | 15 | Assigned courses | Not Started |
| FR-049 | Teacher assessments | Teacher | `/teacher/assignments*` `/teacher/exams*` | 16 | Review + results | Not Started |
| FR-050 | Teacher profile/settings/notifications | Teacher | `/teacher/profile` etc. | 14/19 | Guarded | Not Started |
| FR-051 | Student dashboard | Student | `/student/dashboard` | Exists; 17 | Continue → learning | Partial |
| FR-052 | Student my courses | Student | `/student/courses` | Exists; 17 | Filters | Partial |
| FR-053 | Student wishlist | Student | `/student/wishlist` | Exists | Empty state | Exists |
| FR-054 | Student certificates | Student | `/student/certificates` | Exists | PDF | Exists |
| FR-055 | Student notifications | Student | `/student/notifications` | Exists; 19 | Filters | Partial |
| FR-056 | Student profile | Student | `/student/profile` | Exists; 17 | Validation | Partial |
| FR-057 | Student course learning | Student | `/student/courses/:id` | 17 | Curriculum UI | Not Started |
| FR-058 | Student live classes | Student | `/student/live-classes` | 17 | Join link | Not Started |
| FR-059 | Student materials | Student | `/student/materials` | 17 | List | Not Started |
| FR-060 | Student progress | Student | `/student/progress` | 17 | Bars | Not Started |
| FR-061 | Student settings | Student | `/student/settings` | 17 | Password | Not Started |
| FR-062 | Student assignments | Student | `/student/assignments*` | 18 | Submit file | Not Started |
| FR-063 | Student exams | Student | `/student/exams*` | 18 | List/detail/results | Not Started |
| FR-064 | Shared empty/loading/error | All dashboards | Common components | 01 then all | Every new page | Not Started |
| FR-065 | Responsive consistency | All | All | 20 | 375/768/1280 | Partial |
| FR-066 | Frontend test pass | All | All | 21 | Report in PR | Not Started |
| FR-067 | Production QA | All | All | 22 | Build succeeds | Not Started |
| FR-068 | Dynamic courses only | All | Catalog + admin + teacher + student | 08+ | No Python.jsx pages | Partial (public only) |
| FR-069 | Logo asset | Public/dashboards | Navbar/sidebars | 01 | Not broken | Partial |

## Not in this table (open questions)

Quizzes as separate module, owner marks page, attendance module, batches, public teachers page, student checkout, rename `/admin` → `/owner`. See `docs/00-project-analysis/open-questions.md`.
