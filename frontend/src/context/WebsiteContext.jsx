import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { DEFAULT_TENANT_ID } from '../data/websiteDefaults'
import {
  getPublishedWebsite,
  getVisibleNav,
} from '../services/websiteService'

const WebsiteContext = createContext(null)

/**
 * Provides published tenant website content to public pages.
 * Tenant resolution (subdomain) comes later; for now uses default tenant
 * or VITE_PUBLIC_TENANT_ID.
 */
export function WebsiteProvider({ children, tenantId }) {
  const resolvedTenantId =
    tenantId || import.meta.env.VITE_PUBLIC_TENANT_ID || DEFAULT_TENANT_ID

  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const published = await getPublishedWebsite(resolvedTenantId)
      setContent(published)
    } catch (err) {
      setError(err.message || 'Failed to load website content')
    } finally {
      setLoading(false)
    }
  }, [resolvedTenantId])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Re-read when owner publishes in another tab
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === `praksha_website_published_${resolvedTenantId}`) {
        refresh()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh, resolvedTenantId])

  const value = useMemo(
    () => ({
      tenantId: resolvedTenantId,
      content,
      loading,
      error,
      refresh,
      navItems: getVisibleNav(content),
      branding: content?.branding || null,
    }),
    [resolvedTenantId, content, loading, error, refresh]
  )

  return (
    <WebsiteContext.Provider value={value}>{children}</WebsiteContext.Provider>
  )
}

export function useWebsite() {
  const ctx = useContext(WebsiteContext)
  if (!ctx) {
    throw new Error('useWebsite must be used inside WebsiteProvider')
  }
  return ctx
}

export default WebsiteContext
