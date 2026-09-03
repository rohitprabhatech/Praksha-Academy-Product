import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AUTH_STORAGE_KEY } from '../services/httpClient'
import {
  loginRequest,
  logoutRequest,
} from '../services/authService'
import {
  getDashboardPathForRole,
  normalizeRole,
  roleMatchesAllowed,
} from '../constants/roles'

const AuthContext = createContext(null)

const getStoredAuth = () => {
  try {
    const rememberedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    if (rememberedUser) return JSON.parse(rememberedUser)

    const sessionUser = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (sessionUser) return JSON.parse(sessionUser)

    return null
  } catch {
    return null
  }
}

const persistAuth = (authPayload, rememberMe) => {
  const serialized = JSON.stringify(authPayload)
  if (rememberMe) {
    localStorage.setItem(AUTH_STORAGE_KEY, serialized)
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
  } else {
    sessionStorage.setItem(AUTH_STORAGE_KEY, serialized)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

const clearPersistedAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth)

  const login = useCallback(
    async ({
      email,
      password,
      rememberMe = false,
      allowedRole = null,
      allowedRoles = null,
    }) => {
      const result = await loginRequest({ email, password })

      if (!result.success || !result.user) {
        return {
          success: false,
          message: result.message || 'Invalid email or password.',
        }
      }

      const role = normalizeRole(result.user.role)
      const rolesGate = allowedRoles ?? (allowedRole ? [allowedRole] : null)

      if (!roleMatchesAllowed(role, rolesGate)) {
        return {
          success: false,
          message: 'Invalid email or password.',
        }
      }

      const authenticated = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role,
        tenantId: result.user.tenantId ?? null,
        accessToken: result.accessToken ?? null,
        refreshToken: result.refreshToken ?? null,
      }

      setAuth(authenticated)
      persistAuth(authenticated, rememberMe)

      return {
        success: true,
        user: authenticated,
        redirectTo: getDashboardPathForRole(role),
      }
    },
    []
  )

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      setAuth(null)
      clearPersistedAuth()
    }
  }, [])

  const value = useMemo(
    () => ({
      user: auth,
      isAuthenticated: Boolean(auth?.email && auth?.role),
      role: auth?.role ?? null,
      tenantId: auth?.tenantId ?? null,
      accessToken: auth?.accessToken ?? null,
      login,
      logout,
      getDashboardPath: () => getDashboardPathForRole(auth?.role),
    }),
    [auth, login, logout]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }

  return context
}

export default AuthContext
