# Definition of Done (Frontend)

A sprint is **not** done when the developer says the page “looks fine”.

Use this list plus the sprint file’s own Definition of Done.

---

## Product

- [ ] All pages listed in the sprint exist at the documented routes.
- [ ] No extra modules outside sprint scope.
- [ ] Existing completed pages were not rewritten without a documented reason.
- [ ] Courses remain dynamic (no `Python.jsx` pages).

## UI

- [ ] Matches `docs/05-ui-ux/ui-guidelines.md`.
- [ ] Existing components reused (`DataTable`, `PageHeader`, `AdminModal`, etc.).
- [ ] No duplicate sidebar/header/table.
- [ ] Loading, empty, error, success (and confirmation where needed).
- [ ] Desktop, tablet, and mobile checked.

## Quality

- [ ] No console errors.
- [ ] No broken links in the sprint’s navigation.
- [ ] Forms validate on the client.
- [ ] `npm run lint` clean on touched files (or issues listed).
- [ ] Debug `console.log` removed.

## Process

- [ ] Branch `feature/sprint-XX-short-name` from `dev`.
- [ ] PR title `[Sprint XX] …` targeting **`dev`**.
- [ ] Screenshots (desktop + mobile for UI work).
- [ ] Testing notes in PR.
- [ ] Review comments resolved.
- [ ] Merged to `dev`.
- [ ] Tracker updated.

## Out of scope forever for “done”

- Backend, SQL, API contracts.
- Guessing answers to open questions.
