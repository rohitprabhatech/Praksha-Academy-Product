# UI / UX Guidelines

Source tokens already in the repo (`theme/theme.js` comments: mandatory for all frontend developers). Dashboards must look like **one product**.

---

## Colors

| Token | Hex | Use |
| --- | --- | --- |
| Primary | `#2563EB` | Buttons, links, active nav |
| Primary hover | `#1D4ED8` | |
| Secondary | `#F59E0B` | Accents, badges |
| Success | `#22C55E` | Positive status |
| Error | `#EF4444` | Errors, logout |
| Page background | `#F8FAFC` | Dashboards |
| Card | `#FFFFFF` | |
| Border | `#E2E8F0` | |
| Text primary | `#1E293B` | |
| Text secondary | `#64748B` | |
| Text muted | `#94A3B8` | |

Dark mode: use MUI palette from `constants/theme.js`. Do not invent a third palette.

## Typography

- Font: **Inter**, system-ui fallback (already in theme).
- Page title: 1.375–1.8rem, weight 700–800.
- Section title: ~1.125rem, weight 700.
- Body: 0.875–1rem, line-height ~1.6–1.7.
- Table: 0.875rem.

## Spacing

8px grid: 8 / 16 / 24 / 32. Dashboard section gap ~24px. Card padding 16–24px.

## Buttons

- Public marketing CTAs may stay pill-shaped (current global MUI override).
- Dashboard actions: 8px radius, `textTransform: none`, min height ~40px.
- Primary filled `#2563EB`; secondary outlined; danger text/outlined red.
- Disabled: no pointer; lighter blue (login already uses `#93C5FD`).

## Forms

- Labels always visible.
- 8–10px input radius in dashboards.
- Helper text for errors (react-hook-form).
- Required indicated in label (`*` or “(required)”).

## Cards

White, 1px `#E2E8F0`, 16px radius, hover shadow optional (`0 16px 32px rgba(15,23,42,0.08)`).

## Tables

Use `DataTable`. Header muted, row hover. Pagination at bottom. Horizontal scroll on small screens.

## Modals

Use `AdminModal`. Confirm deletes. Escape/overlay close. Primary/cancel pair.

## Sidebar

- Owner/Teacher/Student: ~260px, white or existing admin blue — **pick one owner sidebar and keep it**.
- Active: primary text + light primary background.
- Group labels uppercase, 0.6875rem, `#94A3B8`.

## Navbar

Public: existing sticky navbar. Dashboards: TopNavbar with page title, notifications, profile.

## Icons

`react-icons/fi` (already used). Keep sizes 16–20 in nav, 18–22 in cards.

## Alerts / toasts

`react-toastify` after Sprint 01 mounts container. Use success/error only; do not alert() .

## Badges

Status chips: Published/Active green, Draft/Warning amber, Inactive/Error red, Info blue. Font weight 600, height ~22px.

## Responsive design

| Breakpoint | Behavior |
| --- | --- |
| ≥1200 desktop | Sidebars permanent |
| 768–1199 tablet | Drawers; 2-col grids |
| <768 mobile | 1-col; hamburger; tables scroll |

## Empty / loading / error

- Loading: skeleton or circular spinner; never blank white.
- Empty: dashed or card + one sentence + optional CTA.
- Error: message + Retry.

All new dashboard pages must include these three.

## Consistency rule

If a control already exists in `components/admin/common`, use it. Do not restyle per module.
