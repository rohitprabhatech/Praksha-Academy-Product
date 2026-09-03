# Bug Management (Frontend)

Frontend bugs only.

## How to report

Include: sprint (if known), route, role (guest/student/admin/teacher), browser, viewport (375/768/1440), steps, expected, actual, screenshot, console errors.

## Severity

| Level | Meaning | Action |
| --- | --- | --- |
| Blocker | Cannot complete a sprint flow (login, layout crash) | Fix before merge |
| Major | Feature unusable (form never submits, table empty wrongly) | Fix in sprint or immediate follow-up |
| Minor | Visual spacing, copy | May be Sprint 20 |
| Cosmetic | Pixel-perfect | UX sprint |

## Tracking

Until a dedicated tool is chosen, list known issues in the PR body. After merge, Team Lead may copy them into the next sprint file.

Do not file “backend 500” as a frontend bug unless the UI fails to show the Error state. Missing API is **Backend dependency: frontend will consume the available backend/API service.**
