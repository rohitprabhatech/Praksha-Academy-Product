# Notifications — Frontend Requirements

**Existing owner UI:** `/admin/notifications`, `/admin/notifications/create` (mock).  
**Existing student UI:** `/student/notifications` (mock).  
**Missing:** Teacher notifications; real delivery; ToastContainer; connection between create and inboxes.

**Backend dependency — frontend implementation will consume the available backend service/API.**

---

## Owner (keep)

Create fields already in UI: Title, Message, Type (Info/Warning/Success/Alert), Audience (All Users, Students, Teachers, Specific User), Scheduled date, Status (Draft / Scheduled / Send Now).

Harden: validation, empty list, error, loading, confirmation before send.

## Teacher / Student

- List, unread filter, mark read, empty state (student already has this).
- Teacher: clone student notification page patterns.

## Cross-cutting

- Header dropdown exists (`NotificationDropdown`) but is unused — mount in Admin/Teacher top nav.
- Logout/login toasts need root ToastContainer (Sprint 01).

Do not design push-notification infrastructure.
