# Tenant Website CMS — Developer Guide

**Audience:** New developers  
**Feature:** Academy Owner can customise the public website (Home, Courses, Programs, Blog, About, Contact) per tenant  
**Last updated:** 2026-09-03

This is the single reference for the website customisation work.

---

## 1. Why this exists

Praksha Academy is **multi-tenant SaaS**.

Each customer academy (tenant) will sell under its own:

- Logo and academy name  
- Address, phone, email  
- Homepage copy  
- Programs / about story  
- Navigation labels  
- Blog / gallery / FAQ / testimonials (existing Content tools)

Owners must change these from the **Owner dashboard** (`/admin/*`), without editing code.

---

## 2. Who can manage what

| Role | Access |
| --- | --- |
| Academy Owner (`admin` / `owner`) | Full Website CMS under `/admin/website/*` + Content (Blog, Gallery, FAQ, Testimonials) |
| Teacher / Student | No website CMS |
| Master Admin (`master_admin`) | Platform only (`/platform/*`) — not per-academy marketing pages |

Login for owners: `/login` with `admin@praksha.academy` / `admin123`

---

## 3. Owner dashboard — Website menu

Sidebar group **Website**:

| Menu | Path | Controls |
| --- | --- | --- |
| Website Overview | `/admin/website` | Hub + publish status |
| Branding | `/admin/website/branding` | Name, tagline, logo URL, hero image URL, primary colour |
| Navigation | `/admin/website/navigation` | Menu labels + visibility |
| Home page | `/admin/website/home` | Hero text, CTAs, highlights, section titles |
| Courses page | `/admin/website/courses` | Courses listing title/subtitle |
| Programs | `/admin/website/programs` | Program cards (add/remove/edit) |
| About | `/admin/website/about` | Story, belief, approach, differentiators |
| Contact | `/admin/website/contact` | Email, phone, address, hours, footer socials |

Sidebar group **Content** (already present, now enabled):

| Menu | Path |
| --- | --- |
| Blog | `/admin/blog` |
| Gallery | `/admin/gallery` |
| FAQ | `/admin/faq` |
| Testimonials | `/admin/testimonials` |

### Editor workflow

1. Edit fields  
2. **Save draft** (stored for this tenant only)  
3. **Publish** (copies draft → public site)  
4. **View site** opens `/` in a new tab  

---

## 4. How public pages get content

```
Owner edits draft (tenant-scoped)
        ↓
Publish
        ↓
localStorage: praksha_website_published_<tenantId>
        ↓
WebsiteProvider loads published content
        ↓
Navbar / Footer / Home / Courses / Programs / About / Contact read it
```

Public tenant id today:

- `VITE_PUBLIC_TENANT_ID` (default `mock-tenant-a`)  
- Must match the owner user’s `tenantId` (`mock-tenant-a` for demo owner)

Later: resolve tenant from subdomain (`academy.praksha.app`) instead of env.

---

## 5. Key files

### Data & services

| File | Purpose |
| --- | --- |
| `src/data/websiteDefaults.js` | Default content shape for a new tenant |
| `src/services/websiteService.js` | Draft/publish get/save (localStorage mock) |
| `src/context/WebsiteContext.jsx` | Published content for public routes |
| `src/hooks/useWebsiteDraftEditor.js` | Shared draft loader for admin editors |

### Owner UI

| File | Purpose |
| --- | --- |
| `src/pages/admin/Website/*` | Overview + section editors |
| `src/components/admin/website/WebsiteEditorShell.jsx` | Save / Publish / View chrome |
| `src/constants/adminDashboard.js` | Sidebar Website + Content groups |
| `src/routes/AdminRoutes.jsx` | `/admin/website/*` routes |

### Public consumers

| File | What became dynamic |
| --- | --- |
| `src/components/navigation/Navbar.jsx` | Logo, academy name, nav items |
| `src/components/navigation/Footer.jsx` | Brand, blurb, contact, socials |
| `src/pages/Home.jsx` | Hero copy + CTAs |
| `src/pages/Courses.jsx` | Page title/subtitle |
| `src/pages/Programs.jsx` | Full programs list from CMS |
| `src/pages/About.jsx` + WhoWeAre / Differentiators | Story + differentiators |
| `src/pages/Contact.jsx` + ContactInfo | Titles + contact channels |
| `src/App.jsx` | Wraps app in `WebsiteProvider` |

---

## 6. Content model (shape)

Top-level keys on the website document:

- `branding`  
- `navigation[]`  
- `home`  
- `coursesPage`  
- `programs`  
- `about`  
- `contact`  
- `footer`  
- `blogPage`  
- `updatedAt` / `publishedAt`

See `createDefaultWebsiteContent()` in `websiteDefaults.js` for the full schema.

---

## 7. How to test (manual)

1. `cd frontend && npm run dev`  
2. Login as owner → `/admin/website`  
3. Change academy name + hero text → **Save draft** → **Publish**  
4. Open `/` → navbar name and home hero should match  
5. Edit Contact phone/address → Publish → check Footer + Contact page  
6. Hide a nav item in Navigation → Publish → item disappears from navbar  

Storage keys in browser DevTools → Application → Local Storage:

- `praksha_website_draft_mock-tenant-a`  
- `praksha_website_published_mock-tenant-a`

---

## 8. Multi-tenant rules (important)

1. Never share one academy’s website JSON across tenants.  
2. Always key storage/API by `tenant_id`.  
3. Public site must resolve tenant (env today, subdomain later).  
4. Backend later should map this to `tenant_profiles` + CMS tables (`blog_posts`, etc.) already in `schema.sql`.  
5. Do not hardcode “Praksha Academy” in new public components — read from `useWebsite()`.

---

## 9. What is still temporary

| Item | Status |
| --- | --- |
| Persistence | Browser localStorage (mock) |
| Logo upload | URL field only (no file upload yet) |
| Course catalogue rows | Still `src/data/courses.js` (page header is CMS) |
| Blog articles | Existing admin Blog UI (not inside Website draft JSON) |
| Subdomain tenant routing | Not built — uses `VITE_PUBLIC_TENANT_ID` |
| Backend APIs | Future sprint (`/api/v1/owner/website`) |

---

## 10. Backend alignment (for later)

When APIs exist, replace `websiteService.js` only. Keep the same content shape so Owner screens stay stable.

Suggested endpoints:

- `GET /api/v1/owner/website`  
- `PUT /api/v1/owner/website` (draft)  
- `POST /api/v1/owner/website/publish`  
- `GET /api/v1/public/website` (by tenant code / host)

DB already has `tenant_profiles`, `blog_posts`, `gallery_items`, `faqs`, `testimonials`, `contact_messages`.

---

## 11. Related docs

- `frontend/docs/DEVELOPER_AUTH_AND_ROLES_GUIDE.md` — login/roles  
- `backend/docs/database/02-multi-tenant-architecture.md` — tenant isolation  
- `frontend/docs/02-frontend-requirements/public-website.md` — original public site requirements  

---

## 12. Definition of done (this feature)

- [x] Owner can open Website CMS from dashboard  
- [x] Branding, nav, home, courses header, programs, about, contact editable  
- [x] Save draft + Publish  
- [x] Public Navbar/Footer/pages read published tenant content  
- [x] Content scoped by `tenantId`  
- [x] Developer documentation in this file  
