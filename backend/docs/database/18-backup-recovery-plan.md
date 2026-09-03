# 18 — Backup & Recovery Plan

Architecture-level backup and disaster recovery strategy.

---

## Backup Strategy

### Production

| Type | Frequency | Retention | Method |
|---|---|---|---|
| Full backup | Daily (2:00 AM IST) | 30 days | mysqldump or Percona XtraBackup |
| Incremental | Every 6 hours | 7 days | Binary log shipping |
| Transaction logs | Continuous | 7 days | MySQL binary logs |

### Staging

| Type | Frequency | Retention |
|---|---|---|
| Full backup | Weekly | 14 days |

### Development

No automated backups. Developers can recreate from migrations.

---

## Backup Storage

- Stored in separate cloud region from production database
- Encrypted at rest (AES-256)
- Access restricted to DevOps team only
- Backup files named: `praksha_prod_YYYYMMDD_HHMMSS.sql.gz`

---

## What to Back Up

| Component | Method |
|---|---|
| Database (all tables) | mysqldump / XtraBackup |
| Binary logs | Continuous archiving |
| Application config | Git repository |
| File storage (S3) | S3 versioning + cross-region replication |
| Secrets | Secrets manager (separate backup) |

---

## Recovery Procedures

### Scenario 1: Accidental Data Deletion (Single Tenant)

1. Identify affected tenant and time of deletion
2. Restore from latest backup to a temporary database
3. Extract affected tenant's data
4. Import into production (with Team Lead approval)
5. Verify data integrity
6. Log recovery in platform_audit_logs

### Scenario 2: Database Corruption

1. Stop application traffic (maintenance mode)
2. Assess corruption scope
3. Restore from latest full backup
4. Apply binary logs up to point before corruption
5. Verify data integrity
6. Resume application traffic
7. Post-incident review

### Scenario 3: Complete Disaster (Server Loss)

1. Provision new database server
2. Restore from latest off-site backup
3. Apply incremental backups and binary logs
4. Update DNS/connection strings
5. Verify all tenants accessible
6. Resume application
7. **Target RTO:** 4 hours | **Target RPO:** 1 hour

---

## Restore Testing

| Test | Frequency | Procedure |
|---|---|---|
| Full restore | Monthly | Restore to isolated environment, verify table counts |
| Point-in-time recovery | Quarterly | Restore to specific timestamp, verify data |
| Tenant-level recovery | Quarterly | Extract single tenant, verify isolation |

Document results of each test. Failed tests must be investigated before next production backup cycle.

---

## Monitoring

- Backup job success/failure alerts
- Backup file size anomaly detection
- Binary log shipping lag monitoring
- Disk space monitoring on backup storage
- Backup age alert if no successful backup in 25 hours

---

## Tenant Data Portability

For tenant offboarding or migration:

1. Export all tenant data (WHERE tenant_id = ?) to structured format
2. Include: users, courses, enrollments, assessments, marks, attendance
3. Exclude: other tenants' data, platform configuration
4. Provide export to tenant upon request (GDPR/data portability)

---

## Key Metrics

| Metric | Target |
|---|---|
| Recovery Time Objective (RTO) | 4 hours |
| Recovery Point Objective (RPO) | 1 hour |
| Backup success rate | 99.9% |
| Restore test pass rate | 100% |
