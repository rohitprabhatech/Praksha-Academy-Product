/**
 * Auth API service.
 * Sprint 03 will replace mock paths with real /api/v1/auth/* calls.
 * Until then, USE_MOCK_AUTH keeps UI/guards testable.
 *
 * Unified login: all roles use the same /login page.
 */

import httpClient from './httpClient'
import { normalizeRole } from '../constants/roles'

const USE_MOCK_AUTH = String(import.meta.env.VITE_USE_MOCK_AUTH ?? 'true') === 'true'

/**
 * Demo accounts (mock only).
 * Same login page for everyone — role decides dashboard redirect.
 */
export const MOCK_USERS = [
  {
    id: 'mock-master-1',
    email: 'master@prabhatech.com',
    password: 'master123',
    role: 'master_admin',
    name: 'Prabha Technology Admin',
    tenantId: null,
  },
  {
    id: 'mock-owner-1',
    email: 'admin@praksha.academy',
    password: 'admin123',
    role: 'owner',
    name: 'Academy Owner',
    tenantId: 'mock-tenant-a',
  },
  {
    id: 'mock-teacher-1',
    email: 'teacher@praksha.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'Teacher User',
    tenantId: 'mock-tenant-a',
  },
  {
    id: 'mock-student-1',
    email: 'student@praksha.com',
    password: 'student123',
    role: 'student',
    name: 'Student User',
    tenantId: 'mock-tenant-a',
  },
]

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function toAuthUser(raw) {
  return {
    id: raw.id ?? raw.user_id ?? null,
    name: raw.name ?? [raw.first_name, raw.last_name].filter(Boolean).join(' ') ?? '',
    email: raw.email,
    role: normalizeRole(raw.role ?? raw.roles?.[0]),
    tenantId: raw.tenantId ?? raw.tenant_id ?? null,
  }
}

/**
 * Login against mock users or future API.
 * No role filter here — unified login accepts all roles.
 */
export async function loginRequest({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()

  if (USE_MOCK_AUTH) {
    await delay()
    const matched = MOCK_USERS.find(
      (user) => user.email === normalizedEmail && user.password === password
    )

    if (!matched) {
      return { success: false, message: 'Invalid email or password.' }
    }

    const user = toAuthUser(matched)
    return {
      success: true,
      message: 'Login successful',
      user,
      accessToken: `mock-access-${matched.id}`,
      refreshToken: `mock-refresh-${matched.id}`,
    }
  }

  const { data } = await httpClient.post('/auth/login', {
    email: normalizedEmail,
    password,
  })

  if (!data?.success) {
    return {
      success: false,
      message: data?.message || 'Invalid email or password.',
    }
  }

  const payload = data.data || {}
  return {
    success: true,
    message: data.message || 'Login successful',
    user: toAuthUser(payload.user || payload),
    accessToken: payload.access_token || payload.accessToken,
    refreshToken: payload.refresh_token || payload.refreshToken,
  }
}

export async function registerRequest(payload) {
  if (USE_MOCK_AUTH) {
    await delay()
    return {
      success: true,
      message: 'Account created successfully',
      data: { email: payload.email },
    }
  }

  const { data } = await httpClient.post('/auth/register', payload)
  return data
}

export async function forgotPasswordRequest({ email }) {
  if (USE_MOCK_AUTH) {
    await delay()
    return {
      success: true,
      message: 'If an account exists, reset instructions were sent.',
    }
  }

  const { data } = await httpClient.post('/auth/forgot-password', { email })
  return data
}

export async function resetPasswordRequest(payload) {
  if (USE_MOCK_AUTH) {
    await delay()
    return {
      success: true,
      message: 'Password reset successfully',
    }
  }

  const { data } = await httpClient.post('/auth/reset-password', payload)
  return data
}

export async function logoutRequest() {
  if (USE_MOCK_AUTH) {
    return { success: true }
  }

  try {
    const { data } = await httpClient.post('/auth/logout')
    return data
  } catch {
    return { success: true }
  }
}

export async function fetchMeRequest() {
  if (USE_MOCK_AUTH) {
    return { success: false, message: 'Mock auth has no /me endpoint' }
  }

  const { data } = await httpClient.get('/auth/me')
  return data
}

export const authConfig = {
  useMockAuth: USE_MOCK_AUTH,
}
