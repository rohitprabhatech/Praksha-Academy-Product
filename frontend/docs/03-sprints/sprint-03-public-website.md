# Sprint 03 — Public Website Completion

## 1. Sprint Owner

Developer: Renuka  
Branch: `feature/sprint-03-public-website`  
Status: Started  
Estimated Duration: 2 days

---

## 2. Sprint Goal

Finish remaining public marketing/legal UX: rebuild Programs to match Home quality, make navbar search actually filter Courses, add legal pages, add blog article detail. Do **not** rebuild Home, Courses catalog, About, or Contact.

---

## 3. Why This Sprint Exists

Footer and Login already link to Privacy/Terms that 404. Navbar search does nothing. Programs is a stub. Public users hit these before any dashboard.

---

## 4. Prerequisites

* Sprint 01 (logo, toasts). Sprint 02 is **not** required.
* Existing `Navbar.jsx`, `Footer.jsx`, `pages/Programs.jsx`, `pages/Blog.jsx`, `pages/Courses.jsx`

**BLOCKER:** none if 01 merged.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Programs | `/programs` | Partial | Rebuild visual quality; still data-driven cards, not course pages |
| Blog list | `/blog` | Partial | Link cards to `/blog/:slug` |
| Blog article | `/blog/:slug` | Missing | Detail + not-found |
| Privacy Policy | `/privacy-policy` | Missing | Layout + placeholder copy if legal text absent |
| Terms | `/terms` | Missing | Same |
| Refund Policy | `/refund-policy` | Missing | Same |
| Privacy alias | `/privacy` | Missing | Redirect to `/privacy-policy` |
| Navbar search | global | Needs improvement | Navigate to `/courses?q=` and apply in Courses |

Do not add `/teachers` or `/success-stories` unless Team Lead closes those questions.

---

## 6. Page-by-Page Development Instructions

### Programs `/programs`

#### Page Purpose
Explain academy tracks (career, programming, exam readiness) and send users to courses or contact.

#### User
Public.

#### Entry Point
Navbar Programs.

#### UI Layout
MainLayout. Hero (title + subtitle) + card grid (3+ programs from data, not hardcoded course names as routes).

#### Header
Page title “Programs”.

#### Sidebar
None (public navbar).

#### Main Content
Cards: title, description, CTA to `/courses` or `/contact`.

#### Actions
CTA buttons.

#### Forms
None.

#### Validation
None.

#### Loading / Empty / Error / Success
Static data: no spinner required. If array empty, EmptyState. N/A error unless fetch added.

#### Responsive Behavior
Desktop: 3 columns. Tablet: 2. Mobile: 1.

---

### Blog article `/blog/:slug`

#### Page Purpose
Read one article.

#### User
Public.

#### Entry Point
Blog list card.

#### UI Layout
MainLayout. Title, date, author, body. Back to `/blog`.

#### Header
Article title.

#### Main Content
Existing hardcoded posts in `Blog.jsx` should move to a shared array/module so list + detail share data.

#### Empty/Error
Unknown slug: same pattern as Course Details not-found.

#### Responsive Behavior
Readable max-width ~720px, padding 16px mobile.

---

### Legal pages

#### Page Purpose
Satisfy footer/login links.

#### User
Public.

#### Entry Point
Footer, Login footer.

#### UI Layout
MainLayout, prose, last-updated line. If copy missing: honest “Content to be provided by Praksha Academy” — do not invent legal text.

#### Responsive Behavior
Single column.

---

### Navbar search

#### Page Purpose
Find courses.

#### User
Public.

#### Entry Point
Navbar `InputBase`.

#### Behavior
On Enter or search icon: `navigate(/courses?q=encodeURIComponent(value))`. `Courses.jsx` reads `useSearchParams` and sets existing `searchTerm`.

#### Validation
Trim; empty query shows all courses.

---

## 7. Component Requirements

| Component | Purpose | Where | Reuse? |
| --- | --- | --- | --- |
| Navbar | Search | Public | Exists — wire it |
| Footer | Legal hrefs | Public | Exists — paths already listed |
| SectionHeading / SectionHeader | Programs/Blog | Public | Exists — do not add a third |
| MainLayout | Chrome | All public | Exists |
| Course search logic | `getSearchedCourses` | Courses.jsx | Exists — reuse |

---

## 8. User Flow

User on Home types “Python” in navbar → Enter → `/courses?q=Python` → catalog filtered.  
User Footer → Privacy Policy → page renders (not 404).  
User Blog → article → back to list.  
Unknown blog slug → not-found card → Back to Blog.

---

## 9. Frontend Data States

Loading: optional blog detail skeleton.  
Empty: unknown slug; Programs empty array.  
Error: N/A unless fetch.  
Success: pages render.  
Disabled: N/A.  
Confirmation: N/A.

---

## 10. Search / Filter / Sort / Pagination

Search: course title/category/description/instructor/level (already in Courses.jsx). Navbar supplies the query.  
Filter/sort/pagination: already on Courses — do not rebuild.

---

## 11. Form Requirements

No new forms. Navbar search is not a validated form.

---

## 12. Acceptance Criteria

- [ ] Developer can open `/programs`, `/blog`, `/blog/:slug`, legal routes.
- [ ] Page has correct route.
- [ ] Navigation works (footer, login privacy).
- [ ] Required UI sections are present.
- [ ] Forms N/A.
- [ ] Validation: search query applied.
- [ ] Buttons work.
- [ ] Loading/empty/error/success as specified.
- [ ] Responsive layout works.
- [ ] Reuse existing components.
- [ ] No duplicate Home rebuild.
- [ ] No console errors.
- [ ] No broken navigation.
- [ ] No new `/python` course route.
- [ ] PR to `dev`, reviewed, tested.

---

## 13. Developer Checklist

### Before Development

- [ ] Pull `dev`.
- [ ] Read this file.
- [ ] Review Navbar/Footer/Courses/Blog.
- [ ] Branch `feature/sprint-03-public-website`.

### During Development

- [ ] Conventions.
- [ ] Reuse components.
- [ ] No duplicate heroes.
- [ ] UI consistent with Home.
- [ ] States on blog not-found.
- [ ] Test each page.

### Before PR

- [ ] Run locally.
- [ ] Test routes + search.
- [ ] Responsive.
- [ ] Console.
- [ ] No debug.
- [ ] Unrelated files clean.
- [ ] PR `[Sprint 03] Public Website Completion` → `dev`.

---

## 14. Definition of Done

Standard list in `docs/04-development/definition-of-done.md` plus this sprint’s acceptance criteria.

---

## 15. Sprint Dependency Rule

### Depends On
Sprint 01.

### Blocks
Nothing critical for owner modules.

### Can Run in Parallel
Yes, with Sprint 02, **if** Team Lead accepts two feature branches (different files). Default if only Ganesh: after 01, Team Lead chooses 02 vs 03.


=============
Completed