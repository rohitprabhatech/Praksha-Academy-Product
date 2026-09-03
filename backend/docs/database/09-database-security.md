# 09 — Database Security

Architecture-level security considerations. **Not implemented** — documented for backend and DevOps teams.

---

## Tenant Isolation

| Layer | Control |
|---|---|
| Schema | `tenant_id` NOT NULL on all tenant tables |
| Application | Mandatory tenant context in every API request |
| Authorization | Verify user belongs to requested tenant |
| API | Never trust `tenant_id` from client input |
| Queries | Always `WHERE tenant_id = :current_tenant_id` |

---

## Least Privilege Database Users

| User | Permissions | Purpose |
|---|---|---|
| `praksha_app` | SELECT, INSERT, UPDATE on all tables; no DDL | Application runtime |
| `praksha_migration` | DDL (CREATE, ALTER, DROP) | Alembic migrations only |
| `praksha_readonly` | SELECT only | Reporting and analytics |
| `praksha_backup` | SELECT + LOCK TABLES | Backup operations |
| `root` | Full access | Emergency only — not used by application |

Application code must NEVER use the migration or root user at runtime.

---

## Credentials Management

- Database credentials stored in environment variables or secrets manager (AWS Secrets Manager, Vault)
- Never commit credentials to git
- Rotate credentials periodically
- Different credentials per environment (dev, staging, production)

---

## Encrypted Connections

- Require TLS/SSL for all database connections in staging and production
- MySQL: `require_secure_transport = ON`
- Connection string: `?ssl_ca=/path/to/ca.pem`
- Reject unencrypted connections from application servers

---

## Password Hashing

- User passwords stored as `password_hash` — never plaintext
- Recommended: **bcrypt** (cost factor 12+) or **Argon2id**
- Password reset tokens and OTP values stored as hashes, not plaintext
- Application layer responsibility (not database)

---

## Sensitive Data Handling

| Data | Storage | Protection |
|---|---|---|
| Passwords | `users.password_hash` | Bcrypt/Argon2 hash |
| Reset tokens | `password_reset_tokens.token_hash` | SHA-256 hash |
| OTP codes | `email_verifications.otp_hash` | SHA-256 hash |
| Payment details | `payments.transaction_ref` | Reference only — no card numbers |
| PII (name, email, phone) | Various tables | Encrypted at rest (MySQL TDE or disk encryption) |

**No credit card numbers, CVV, or bank account details are stored in the database.**

---

## Audit Logging

| Log Type | Table | Scope |
|---|---|---|
| Platform actions | `platform_audit_logs` | Tenant creation, suspension, plan changes |
| Tenant actions | `tenant_audit_logs` | User CRUD, course changes, enrollment |
| Fields logged | action, entity_type, entity_id, actor, IP, timestamp | |

Audit logs are append-only — no UPDATE or DELETE on audit tables.

---

## Backups

See [18-backup-recovery-plan.md](./18-backup-recovery-plan.md).

- Daily automated backups in production
- Encrypted backup storage
- Backup access restricted to DevOps team
- Regular restore testing

---

## SQL Injection Prevention

- Application MUST use parameterized queries (SQLAlchemy ORM/prepared statements)
- Never concatenate user input into SQL strings
- Input validation at API layer before database

---

## Row-Level Security (Future)

MySQL does not have native row-level security. Tenant isolation is enforced at the application layer. If needed in the future:

- MySQL 8.0 views with security definers
- Database proxy with tenant routing
- Separate schemas per tenant (not recommended at current scale)

---

## Network Security

- Database server in private subnet — not publicly accessible
- Application servers connect via private network
- Firewall rules: only application servers can connect to database port
- No direct database access from developer machines in production
