/**
 * Tenant website content service (Owner CMS).
 * Draft + published copies are stored per tenantId in localStorage until
 * backend tenant_profiles / CMS APIs are available.
 */

import {
  createDefaultWebsiteContent,
  DEFAULT_TENANT_ID,
} from '../data/websiteDefaults'

const draftKey = (tenantId) => `praksha_website_draft_${tenantId}`
const publishedKey = (tenantId) => `praksha_website_published_${tenantId}`

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function resolveTenantId(tenantId) {
  return tenantId || DEFAULT_TENANT_ID
}

export async function getWebsiteDraft(tenantId) {
  await delay()
  const id = resolveTenantId(tenantId)
  const existing = readJson(draftKey(id))
  if (existing) return existing
  const defaults = createDefaultWebsiteContent('Praksha Academy')
  writeJson(draftKey(id), defaults)
  return defaults
}

export async function getPublishedWebsite(tenantId) {
  await delay(150)
  const id = resolveTenantId(tenantId)
  const published = readJson(publishedKey(id))
  if (published) return published
  // First visit: seed published from defaults so public site is never empty
  const defaults = createDefaultWebsiteContent('Praksha Academy')
  writeJson(publishedKey(id), defaults)
  if (!readJson(draftKey(id))) {
    writeJson(draftKey(id), clone(defaults))
  }
  return defaults
}

export async function saveWebsiteDraft(tenantId, content) {
  await delay()
  const id = resolveTenantId(tenantId)
  const next = {
    ...content,
    updatedAt: new Date().toISOString(),
  }
  writeJson(draftKey(id), next)
  return next
}

export async function publishWebsite(tenantId) {
  await delay(500)
  const id = resolveTenantId(tenantId)
  const draft = readJson(draftKey(id)) || createDefaultWebsiteContent('Praksha Academy')
  const published = {
    ...clone(draft),
    publishedAt: new Date().toISOString(),
    updatedAt: draft.updatedAt || new Date().toISOString(),
  }
  writeJson(publishedKey(id), published)
  writeJson(draftKey(id), published)
  return published
}

export async function resetWebsiteDraft(tenantId, academyName = 'Praksha Academy') {
  await delay()
  const id = resolveTenantId(tenantId)
  const defaults = createDefaultWebsiteContent(academyName)
  writeJson(draftKey(id), defaults)
  return defaults
}

export function getVisibleNav(content) {
  return (content?.navigation || []).filter((item) => item.visible !== false)
}
