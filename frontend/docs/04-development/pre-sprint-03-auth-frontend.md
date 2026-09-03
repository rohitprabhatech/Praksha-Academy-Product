# Frontend auth readiness (pre–Sprint 03)

Updated the React app so authentication UI matches project requirements and is ready to consume Sprint 03 backend APIs.

## What changed

- Role constants + `owner` → `admin` alias (Q-01 interim `/admin/*`)
- `authService` with mock mode (`VITE_USE_MOCK_AUTH=true`) and real API switch
- `httpClient` uses `/api/v1` + Bearer token interceptor
- Vite proxy: `/api` → `http://127.0.0.1:8000`
- Route guards on student, teacher, and admin areas
- Routes: `/reset-password`, `/access-denied`, `/unauthorized`, `/teacher/*`
- Public login allows **student + teacher**; `/admin/login` allows **owner/admin**
- Single `ToastContainer` in `App.jsx`
- Logout navigates to the correct login portal

## Mock credentials (still)

| Email | Password | Lands on |
|---|---|---|
| student@praksha.com | student123 | `/student/dashboard` |
| teacher@praksha.com | teacher123 | `/teacher/dashboard` |
| admin@praksha.academy | admin123 | `/admin/dashboard` |

## Switch to real API (after Sprint 03)

In `frontend/.env.local`:

```
VITE_USE_MOCK_AUTH=false
VITE_API_BASE_URL=/api/v1
```

Restart Vite after changing env.
