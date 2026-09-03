# 16 — Tenant Isolation Examples

Conceptual examples demonstrating correct and incorrect tenant data access patterns.

**Note:** These are database design principles, not application code.

---

## Principle

Every query against tenant-owned data MUST include `tenant_id = current_tenant_id`. There are no exceptions for normal tenant operations.

---

## Example 1: Listing Courses

### Correct

```sql
SELECT id, name, slug, price, status
FROM courses
WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000'
  AND status = 'published'
  AND deleted_at IS NULL;
```

**Why correct:** Filters by the authenticated tenant's ID. Only that tenant's courses are returned.

### Incorrect

```sql
SELECT id, name, slug, price, status
FROM courses
WHERE status = 'published';
```

**Why incorrect:** Returns published courses from ALL tenants. Tenant A would see Tenant B's courses. This is a **data leak**.

---

## Example 2: Getting a Student

### Correct

```sql
SELECT sp.*, u.email, u.first_name
FROM student_profiles sp
JOIN users u ON u.id = sp.user_id
WHERE sp.tenant_id = '550e8400-e29b-41d4-a716-446655440000'
  AND sp.id = 'student-uuid-here';
```

**Why correct:** Both `tenant_id` filter and specific student ID. Even if someone guesses a student UUID from another tenant, the query returns nothing.

### Incorrect

```sql
SELECT sp.*, u.email, u.first_name
FROM student_profiles sp
JOIN users u ON u.id = sp.user_id
WHERE sp.id = 'student-uuid-here';
```

**Why incorrect:** If the UUID is known (or guessed), data from any tenant could be returned.

---

## Example 3: Creating an Enrollment

### Correct

```sql
INSERT INTO enrollments (id, tenant_id, student_id, course_id, batch_id, status)
VALUES (
    UUID(),
    '550e8400-e29b-41d4-a716-446655440000',  -- current tenant
    'student-uuid',
    'course-uuid',
    'batch-uuid',
    'active'
);
```

**Pre-check:** Verify that student_id, course_id, and batch_id all belong to the same tenant_id.

### Incorrect

```sql
INSERT INTO enrollments (id, tenant_id, student_id, course_id, status)
VALUES (
    UUID(),
    '550e8400-e29b-41d4-a716-446655440000',
    'student-from-tenant-A',
    'course-from-tenant-B',  -- WRONG TENANT
    'active'
);
```

**Why incorrect:** Cross-tenant FK reference. The application must validate that all referenced IDs belong to the same tenant before inserting.

---

## Example 4: Unique Constraints Are Per-Tenant

### Allowed

```
Tenant A: course slug = "python-programming"  ✅
Tenant B: course slug = "python-programming"  ✅
```

Both exist because `UNIQUE(tenant_id, slug)` allows the same slug in different tenants.

### Not Allowed (within same tenant)

```
Tenant A: course slug = "python-programming"  ✅
Tenant A: course slug = "python-programming"  ❌ DUPLICATE
```

---

## Example 5: Master Admin Cross-Tenant Access

### Correct (Platform Admin Only)

```sql
-- List all tenants (platform operation)
SELECT id, tenant_code, name, status
FROM tenants
WHERE deleted_at IS NULL
ORDER BY created_at DESC;
```

**Why correct:** Master Admin queries platform tables, not tenant business data directly.

### Correct (Support Read with Audit)

```sql
-- Platform admin viewing a specific tenant's data for support
SELECT COUNT(*) as student_count
FROM student_profiles
WHERE tenant_id = 'specific-tenant-uuid';

-- MUST log this action:
INSERT INTO platform_audit_logs (action, entity_type, tenant_id, actor_user_id)
VALUES ('tenant.data_viewed', 'student_profiles', 'specific-tenant-uuid', 'admin-user-uuid');
```

### Incorrect (Tenant User Cross-Tenant)

```sql
-- Tenant A owner trying to see Tenant B data
SELECT * FROM courses WHERE tenant_id = 'tenant-B-uuid';
```

**Why incorrect:** Tenant users must never access another tenant's data, regardless of role within their tenant.

---

## Example 6: Joins Must Maintain Tenant Scope

### Correct

```sql
SELECT c.name, e.status, sp.enrollment_number
FROM enrollments e
JOIN courses c ON c.id = e.course_id AND c.tenant_id = e.tenant_id
JOIN student_profiles sp ON sp.id = e.student_id AND sp.tenant_id = e.tenant_id
WHERE e.tenant_id = 'current-tenant-uuid'
  AND e.status = 'active';
```

### Incorrect

```sql
SELECT c.name, e.status
FROM enrollments e
JOIN courses c ON c.id = e.course_id  -- missing tenant_id match
WHERE e.tenant_id = 'current-tenant-uuid';
```

**Why incorrect:** If course_id somehow references a course from another tenant, the join would return cross-tenant data.

---

## Example 7: Soft Delete Respects Tenant

### Correct

```sql
UPDATE courses
SET deleted_at = NOW(), updated_at = NOW()
WHERE tenant_id = 'current-tenant-uuid'
  AND id = 'course-uuid';
```

### Incorrect

```sql
UPDATE courses
SET deleted_at = NOW()
WHERE id = 'course-uuid';
```

**Why incorrect:** Could soft-delete a course belonging to another tenant.

---

## Defense in Depth

| Layer | Protection |
|---|---|
| Database schema | `tenant_id` NOT NULL, composite UNIQUE constraints |
| Application queries | Mandatory `WHERE tenant_id = ?` |
| API authorization | Verify user belongs to tenant |
| FK validation | All referenced IDs checked for same tenant |
| Audit logging | Cross-tenant access logged |
| Testing | Integration tests verify isolation |

---

## Golden Rule

> If your query does not include `tenant_id` for a tenant-owned table, it is wrong.
