# Pull Request Guide

Every frontend PR must target **`dev`**.  
Never target `main` unless explicitly approved for release.

---

## PR must contain

- **Sprint number** (e.g. Sprint 08)
- **Feature** (short name)
- **Summary** (what changed and why)
- **Screenshots** (UI sprints: desktop + mobile where relevant)
- **Testing performed** (checklist from the sprint file)
- **Known issues**
- **Reviewer**
- **Related documentation** (sprint file + requirement file paths)

## Title format

`[Sprint XX] Short Description`

Examples:

- `[Sprint 01] Frontend Foundation & Shared Shell`
- `[Sprint 08] Owner Course Management`

## Body template

```markdown
## Sprint
Sprint 08

## Feature
Owner course list, create, edit, details

## What was implemented?
- Dynamic course form with teacher assignment

## Which pages changed?
- /admin/courses, add, edit, details

## Which components changed?
- CourseForm (new), DataTable (reused)

## Summary
- No course-specific pages

## Screenshots
Required for UI changes (desktop / tablet / mobile)

## Testing
Desktop:
Tablet:
Mobile:

- [ ] Page opens correctly
- [ ] Navigation works
- [ ] Forms / validation
- [ ] Loading / empty / error
- [ ] Responsive
- [ ] No console errors

## Known limitations
- Mock data until API exists

## Target branch
`dev`

## Known issues
- Waiting for course API (mock service in use)

## Reviewer
(name)

## Related documentation
- docs/03-sprints/sprint-08-owner-course-management.md
- docs/02-frontend-requirements/course-management.md
```

## Reviewer checks

- Scope matches the sprint (no extra modules)
- Frontend only (no API spec files, no SQL)
- Reuses existing components
- Open questions not invented
- UI guidelines followed
- Routes match the route plan

## After approval

Merge to `dev`. Update `docs/07-management/sprint-tracker.md` (PR link, status).
