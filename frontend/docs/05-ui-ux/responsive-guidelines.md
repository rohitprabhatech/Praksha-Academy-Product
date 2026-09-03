# Responsive Guidelines

Breakpoints already used in the project: MUI `xs/sm/md/lg/xl` and Bootstrap `col-*`.

| Name | Width | Dashboards | Public |
| --- | --- | --- | --- |
| Mobile | 375–767 | Drawer sidebar; stacked cards; tables scroll horizontally | Single column; navbar hamburger |
| Tablet | 768–1199 | Drawer or compact sidebar (`md`/`lg` as in current layouts) | 2-column grids |
| Desktop | ≥1200 | Permanent sidebar ~260px | Navbar links visible |

## Rules

1. No page-level horizontal scroll except data tables.
2. Forms: one column on mobile; two columns on desktop only when labels still align.
3. Primary actions: full width on mobile for auth and create forms.
4. Touch targets ≥ 40px for icon buttons.
5. Admin TopNavbar search may hide on `xs`.
6. Recharts: parent must have width; never fixed 1200px chart on mobile.
7. Test 375, 768, 1024, 1440 before PR.

## Existing patterns to copy

- `StudentLayout` / `AdminLayout`: `display: { xs: 'none', md: 'block' }` sidebar + `Drawer`.
- Public `Navbar.css`: `.navbar-toggle` / `.navbar-mobile`.
- Courses: Bootstrap `col-12 col-sm-6 col-lg-4`.

Do not introduce another breakpoint system.
