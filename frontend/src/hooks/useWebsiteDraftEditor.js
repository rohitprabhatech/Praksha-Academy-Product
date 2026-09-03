import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import {
  getWebsiteDraft,
  publishWebsite,
  saveWebsiteDraft,
} from '../services/websiteService'
import { DEFAULT_TENANT_ID } from '../data/websiteDefaults'

/**
 * Shared draft loader/saver for website admin pages.
 */
export function useWebsiteDraftEditor() {
  const { tenantId } = useAuth()
  const resolvedTenantId = tenantId || DEFAULT_TENANT_ID

  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getWebsiteDraft(resolvedTenantId)
      setDraft(data)
    } catch (err) {
      toast.error(err.message || 'Failed to load website draft')
    } finally {
      setLoading(false)
    }
  }, [resolvedTenantId])

  useEffect(() => {
    load()
  }, [load])

  const updateSection = useCallback((section, patch) => {
    setDraft((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [section]: {
          ...prev[section],
          ...patch,
        },
      }
    })
  }, [])

  const setFullDraft = useCallback((next) => {
    setDraft(next)
  }, [])

  const save = useCallback(async () => {
    if (!draft) return null
    setSaving(true)
    try {
      const saved = await saveWebsiteDraft(resolvedTenantId, draft)
      setDraft(saved)
      toast.success('Draft saved')
      return saved
    } catch (err) {
      toast.error(err.message || 'Save failed')
      return null
    } finally {
      setSaving(false)
    }
  }, [draft, resolvedTenantId])

  const publish = useCallback(async () => {
    if (!draft) return null
    setPublishing(true)
    try {
      await saveWebsiteDraft(resolvedTenantId, draft)
      const published = await publishWebsite(resolvedTenantId)
      setDraft(published)
      toast.success('Published to public website')
      // Same-tab refresh for WebsiteProvider
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: `praksha_website_published_${resolvedTenantId}`,
        })
      )
      return published
    } catch (err) {
      toast.error(err.message || 'Publish failed')
      return null
    } finally {
      setPublishing(false)
    }
  }, [draft, resolvedTenantId])

  return {
    tenantId: resolvedTenantId,
    draft,
    setDraft: setFullDraft,
    updateSection,
    loading,
    saving,
    publishing,
    save,
    publish,
    reload: load,
  }
}
