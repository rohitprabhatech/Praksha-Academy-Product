# Sprint 19 — Notifications & Cross-Role Polish

## 1. Sprint Owner

Developer: Unassigned  
Branch: `feature/sprint-19-notifications-cross-role`  
Status: Not Started  
Estimated Duration: 3–4 days

---

## 2. Sprint Goal

Unify notification inbox UX for owner, teacher, student. Mount NotificationDropdown on admin/teacher top bars. Mock fan-out from owner create. Consistent logout.

---

## 3. Why This Sprint Exists

Owner create and student inbox exist separately. Teacher inbox is thin. Dropdown unused until Sprint 01.

---

## 4. Prerequisites

13, 14, 17.

**BLOCKER:** none hard; weaker if 14 missing teacher inbox.

---

## 5. Pages to Create / Complete

| Page Name | Route | Current Status | Required Work |
| --- | --- | --- | --- |
| Owner notifications | existing | Partial | Fan-out mock |
| Student notifications | existing | Partial | Shared item UI |
| Teacher notifications | existing | Partial | Same patterns |
| Dropdown | layout | Partial | Badge + unread |

---

## 6. Page-by-Page Development Instructions

Keep list + unread filter. EmptyState. Mark read / mark all. Owner create already has audience Students/Teachers/All — writing to a shared mock inbox is enough.

#### Loading / Empty / Error / Success
Inbox skeleton; no notifications; retry; mark read.

#### Responsive Behavior
Mobile: full page, not a tiny dropdown only.

---

## 7. Component Requirements

Reuse `NotificationCard`. Reuse `NotificationDropdown`. Do not add a toast-based inbox.

---

## 8. User Flow

Owner Create Notification audience Students → student inbox shows item → mark read → badge updates.

---

## 9–11. States / Search / Forms

Filter all/unread. No new create fields.

**Backend dependency: frontend will consume the available backend/API service.**

---

## 12. Acceptance Criteria

- [ ] Badge updates.
- [ ] Audience mock works.
- [ ] Empty/loading/error.
- [ ] Logout still `/login`.
- [ ] PR `[Sprint 19] Notifications Cross Role` → `dev`.

---

## 13–15. Checklist / DoD / Dependencies

Branch `feature/sprint-19-notifications-cross-role`. Depends on 13, 14, 17. Blocks 20. No parallel needed.
