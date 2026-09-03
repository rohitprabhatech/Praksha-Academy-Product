# Public Website — Frontend Requirements

**Status of existing work:** Home, Courses, Course Details, About, Contact are largely built. Blog listing and Programs exist but are thinner. Do not rebuild completed pages unless listed under improvement.

**Backend dependency — frontend implementation will consume the available backend service/API.**

---

## Confirmed pages (exist)

### Home `/`

Keep. Improvements only:

- Wire navbar search or remove the inert search field (Sprint 03).
- Replace broken logo asset.
- Featured courses must continue to come from **dynamic course data**, not hardcoded course pages.
- Featured teachers derived from course instructor data is acceptable until Q-24.

### Courses `/courses`

Keep. Catalog must remain **data-driven**. Adding Python/Java/AI later means adding records, not pages.

### Course Details `/courses/:slug`

Keep. CTA currently has no enrollment/checkout flow (**Q-15**). Do not invent payment UI here until confirmed.

### About `/about`

Keep. Fill `aboutData.js` / `mediaData.js` when content is supplied. Do not fake faculty or awards.

### Contact `/contact`

Keep. Wire form submit when API exists. Fill `contactData.js` when business supplies values.

### Blog `/blog`

Keep listing. Add `/blog/:slug` and eventually read the same records as Admin Blog (do not create a second CMS).

### Programs `/programs`

Needs improvement — currently three cards. Rebuild to match Home visual quality using program data (still not course-specific pages).

---

## Missing public pages to build

| Page | Route | Notes |
| --- | --- | --- |
| Privacy Policy | `/privacy-policy` | Linked from Footer. Redirect `/privacy` → this path. |
| Terms | `/terms` | Linked from Footer and Login. |
| Refund Policy | `/refund-policy` | Linked from Footer. Copy is **Q-30**. |
| Blog article | `/blog/:slug` | Missing. |

## Optional until open questions

| Page | Question |
| --- | --- |
| `/teachers` | Q-24 |
| `/faq` | FAQ already on About |
| `/success-stories` | Q-25 |
| Public gallery | Q-27 |

---

## UI states (all public forms/pages)

- Loading: skeleton or spinner on catalog if data fetch is added.
- Empty: catalog already has empty filter results; keep.
- Error: Contact form already has error state; catalog needs error if API fails.
- Success: Contact form already has success.

## Responsive

Desktop / tablet / mobile already started. Sprint 21 re-QAs Home hero, course grid, About sections, Contact two-column form.

## Out of scope

- Backend contact inbox implementation (admin UI already exists).
- Hardcoded pages per course name.
