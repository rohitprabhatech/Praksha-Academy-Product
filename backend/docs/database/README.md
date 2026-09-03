# Praksha Academy SaaS — Database Documentation

## Entry Point for the Development Team

This folder contains the complete database architecture for **Prakha Academy**, a multi-tenant SaaS education platform sold by **Prabha Technology** to multiple academy customers.

**Status:** Database design complete — awaiting Team Lead approval before FastAPI backend development.

---

## Quick Start

| If you need to... | Read this |
|---|---|
| Understand the big picture | [01-database-overview.md](./01-database-overview.md) |
| Understand tenant isolation | [02-multi-tenant-architecture.md](./02-multi-tenant-architecture.md) |
| Know which tables are platform vs tenant | [03-platform-vs-tenant-data.md](./03-platform-vs-tenant-data.md) |
| See all modules | [04-database-modules.md](./04-database-modules.md) |
| Understand users and roles | [05-user-role-data-model.md](./05-user-role-data-model.md) |
| Understand relationships | [06-database-relationship-design.md](./06-database-relationship-design.md) |
| See ERD diagrams | [10-erd.md](./10-erd.md) |
| See every table in detail | [11-table-catalog.md](./11-table-catalog.md) |
| Learn the database as a new developer | [12-database-explanation-for-team.md](./12-database-explanation-for-team.md) |
| See the actual SQL schema | [../../database/schema.sql](../../database/schema.sql) |

---

## Design Workflow (Completed)

```
Existing Project Analysis          ✅
        ↓
Database Requirements Analysis     ✅
        ↓
Platform vs Tenant Classification  ✅
        ↓
Module Identification              ✅
        ↓
Entity Identification              ✅
        ↓
Relationship Design                ✅
        ↓
Tenant Isolation Design            ✅
        ↓
Normalization Review               ✅
        ↓
ERD                                ✅
        ↓
Table Catalog                      ✅
        ↓
Team Explanation Document          ✅
        ↓
Index & Constraint Design          ✅
        ↓
Database Review                    ✅
        ↓
SQL Schema                         ✅
        ↓
SQL Validation                     ✅
        ↓
TEAM LEAD APPROVAL                 ⏳ Pending
        ↓
FastAPI Backend Development        ❌ Not started
```

---

## Key Numbers

| Metric | Value |
|---|---|
| Recommended database | **MySQL 8.0+** |
| Total tables | **54** |
| Platform-level tables | **12** |
| Tenant-level tables | **42** |
| Primary key type | **UUID (CHAR(36))** |
| Tenant identifier | **UUID + tenant_code** |

---

## Document Index

| # | Document | Purpose |
|---|---|---|
| 01 | [database-overview](./01-database-overview.md) | Architecture summary and database choice |
| 02 | [multi-tenant-architecture](./02-multi-tenant-architecture.md) | Tenant isolation design |
| 03 | [platform-vs-tenant-data](./03-platform-vs-tenant-data.md) | Table classification |
| 04 | [database-modules](./04-database-modules.md) | Module inventory from frontend |
| 05 | [user-role-data-model](./05-user-role-data-model.md) | Auth and RBAC design |
| 06 | [database-relationship-design](./06-database-relationship-design.md) | All relationships explained |
| 07 | [database-normalization](./07-database-normalization.md) | Normalization principles |
| 08 | [index-strategy](./08-index-strategy.md) | Index design |
| 09 | [database-security](./09-database-security.md) | Security architecture |
| 10 | [erd](./10-erd.md) | Entity-relationship diagrams |
| 11 | [table-catalog](./11-table-catalog.md) | Complete table reference |
| 12 | [database-explanation-for-team](./12-database-explanation-for-team.md) | Team learning guide |
| 13 | [normalization-review](./13-normalization-review.md) | 1NF/2NF/3NF review |
| 14 | [data-flow](./14-data-flow.md) | Business process flows |
| 15 | [sample-data](./15-sample-data.md) | Example records |
| 16 | [tenant-isolation-examples](./16-tenant-isolation-examples.md) | Isolation patterns |
| 17 | [database-migration-plan](./17-database-migration-plan.md) | Migration strategy |
| 18 | [backup-recovery-plan](./18-backup-recovery-plan.md) | Backup and DR |
| 19 | [naming-convention](./19-naming-convention.md) | Naming standards |
| 20 | [database-decisions](./20-database-decisions.md) | Architecture decisions |

---

## Important Rules

1. **Every tenant-owned query MUST filter by `tenant_id`.**
2. **Platform data and tenant data must never be mixed.**
3. **Do not start FastAPI/SQLAlchemy development until this design is approved.**
4. **The SQL schema in `database/schema.sql` is the source of truth.**

---

## Frontend Analysis Note

The existing frontend was originally built as a single-academy LMS. This database design extends it to **multi-tenant SaaS** while preserving all frontend modules: courses, teachers, students, batches, classes, assignments, quizzes, exams, marks, attendance, payments, CMS, and notifications.

All frontend requirement documents in `frontend/docs/02-frontend-requirements/` were analyzed during this design.
