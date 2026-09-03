# 05 — User & Role Data Model

## Recommendation: Single `users` Table

The database uses a **single `users` table** with nullable `tenant_id` and role-based access control (RBAC) via junction tables.

### Why Single Table

| Advantage | Detail |
|---|---|
| One auth flow | Login always queries `users` by email |
| No duplicate credentials | Same person doesn't need two password hashes |
| Flexible roles | RBAC via `user_roles` supports multiple roles |
| Future-proof | New roles added without schema changes |
| Tenant isolation | `tenant_id` distinguishes platform vs tenant users |

### Alternative Rejected: Separate Auth Tables

Separate `platform_users` and `tenant_users` tables would duplicate authentication logic, complicate password reset, and make cross-role scenarios (Q-03) harder.

---

## User Types

| User Type | tenant_id | Roles | Login |
|---|---|---|---|
| Master Admin | NULL | `master_admin` | Platform admin login |
| Tenant Owner | UUID | `owner` | Tenant login (`/admin/login`) |
| Teacher | UUID | `teacher` | Shared login (`/login`) |
| Student | UUID | `student` | Shared login (`/login`) |

---

## Tables

### `users`

Core identity for all users.

| Column | Purpose |
|---|---|
| `id` | UUID primary key |
| `tenant_id` | NULL for platform users; set for tenant users |
| `email` | Login identifier — unique per tenant |
| `password_hash` | Bcrypt/Argon2 hash (never plaintext) |
| `first_name`, `last_name` | Display name |
| `phone` | Contact number |
| `avatar_url` | Profile image URL |
| `status` | pending / active / inactive / suspended |
| `email_verified_at` | When email was verified |
| `last_login_at` | Last successful login |

**Unique constraint:** `UNIQUE(tenant_id, email)`

### `teacher_profiles` / `student_profiles`

Role-specific extended data. One profile per user per role per tenant.

- Teacher: qualification, experience, specialization, bio, employee_code
- Student: enrollment_number, date_of_birth, guardian info

A user with both teacher and admin roles (Q-03) has separate UIs but one `users` row with multiple `user_roles` entries.

---

## RBAC Architecture

### `roles`

| Column | Purpose |
|---|---|
| `scope` | `platform` or `tenant` |
| `code` | Machine-readable: `master_admin`, `owner`, `teacher`, `student` |
| `name` | Display name |
| `is_system` | System roles cannot be deleted |

**Seed data:**

| scope | code | name |
|---|---|---|
| platform | master_admin | Master Admin |
| tenant | owner | Academy Owner |
| tenant | teacher | Teacher |
| tenant | student | Student |

### `permissions`

Granular permissions grouped by module.

| scope | code | module |
|---|---|---|
| platform | tenants.create | tenants |
| platform | tenants.read | tenants |
| tenant | courses.create | courses |
| tenant | courses.read | courses |
| tenant | marks.write | marks |
| tenant | attendance.write | attendance |

### `role_permissions`

Many-to-many: which permissions each role has.

### `user_roles`

Many-to-many: which roles each user has.

| Column | Purpose |
|---|---|
| `user_id` | The user |
| `role_id` | The role |
| `tenant_id` | NULL for platform roles; set for tenant roles |
| `assigned_by` | Who assigned this role |

---

## Platform Roles vs Tenant Roles

| Type | scope | Examples | tenant_id |
|---|---|---|---|
| Platform | `platform` | master_admin | NULL |
| Tenant | `tenant` | owner, teacher, student | Required |

Platform roles grant access to SaaS management features.
Tenant roles grant access to academy operations within one tenant.

---

## Authentication Support Tables

### `password_reset_tokens`

| Column | Purpose |
|---|---|
| `user_id` | User requesting reset |
| `token_hash` | Hashed reset token |
| `expires_at` | Token expiry |
| `used_at` | When token was consumed |

### `email_verifications`

| Column | Purpose |
|---|---|
| `user_id` | User being verified |
| `otp_hash` | Hashed OTP |
| `purpose` | registration / email_change / login |
| `expires_at` | OTP expiry |
| `verified_at` | When verified |

---

## Login Flow (Database Records)

```
User submits email + password
        ↓
SELECT * FROM users WHERE email = ? AND (tenant_id = ? OR tenant_id IS NULL)
        ↓
Verify password_hash
        ↓
SELECT roles FROM user_roles JOIN roles WHERE user_id = ?
        ↓
Check tenant status (if tenant user)
        ↓
Update last_login_at
        ↓
Return JWT with user_id, tenant_id, roles
```

---

## Q-03: Dual Role (Teacher + Admin)

One `users` row with two `user_roles` entries:
- `{ role: owner, tenant_id: uuid-a }`
- `{ role: teacher, tenant_id: uuid-a }`

Separate UIs per role — no merged dashboard.
