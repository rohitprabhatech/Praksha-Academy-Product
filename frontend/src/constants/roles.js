/**
 * Role constants aligned with backend RBAC (schema roles)
 * and frontend interim naming (Q-01: Owner uses /admin/* as "admin").
 */

export const ROLES = {
  MASTER_ADMIN: 'master_admin',
  OWNER: 'owner',
  ADMIN: 'admin', // frontend alias for owner (Q-01 interim)
  TEACHER: 'teacher',
  STUDENT: 'student',
}

/** Prabha Technology platform (Master Admin) */
export const PLATFORM_ROLES = [ROLES.MASTER_ADMIN]

/** Roles allowed into /admin/* (Owner / Academy Admin dashboard) */
export const OWNER_ROLES = [ROLES.ADMIN, ROLES.OWNER]

/** Roles allowed into /teacher/* */
export const TEACHER_ROLES = [ROLES.TEACHER]

/** Roles allowed into /student/* */
export const STUDENT_ROLES = [ROLES.STUDENT]

/**
 * Normalize API/DB role codes to frontend role used in route guards.
 * Backend `owner` → frontend `admin` until /owner routes are confirmed.
 */
export function normalizeRole(role) {
  if (!role) return null
  const value = String(role).toLowerCase().trim()
  if (value === ROLES.OWNER) return ROLES.ADMIN
  return value
}

export function isOwnerRole(role) {
  const normalized = normalizeRole(role)
  return OWNER_ROLES.includes(normalized) || normalized === ROLES.ADMIN
}

export function isPlatformRole(role) {
  return normalizeRole(role) === ROLES.MASTER_ADMIN
}

export function getDashboardPathForRole(role) {
  const normalized = normalizeRole(role)

  switch (normalized) {
    case ROLES.MASTER_ADMIN:
      return '/platform/dashboard'
    case ROLES.ADMIN:
    case ROLES.OWNER:
      return '/admin/dashboard'
    case ROLES.TEACHER:
      return '/teacher/dashboard'
    case ROLES.STUDENT:
      return '/student/dashboard'
    default:
      return '/unauthorized'
  }
}

export function getLoginPathForRole(role) {
  // Unified login for every role
  return '/login'
}

export function roleMatchesAllowed(role, allowedRoles) {
  if (!allowedRoles) return true
  const list = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  const normalized = normalizeRole(role)
  const allowedNormalized = list.map(normalizeRole)
  return allowedNormalized.includes(normalized)
}

export const ROLE_LABELS = {
  [ROLES.MASTER_ADMIN]: 'Prabha Technology (Master Admin)',
  [ROLES.ADMIN]: 'Academy Owner',
  [ROLES.OWNER]: 'Academy Owner',
  [ROLES.TEACHER]: 'Teacher',
  [ROLES.STUDENT]: 'Student',
}
