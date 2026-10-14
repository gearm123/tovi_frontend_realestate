import type { LeadCapturePageRule } from '../config/leadCapturePopup'
import type { Agent } from '../types/agent'
import type { BusinessContact } from '../types/business'
import type { FailedLead } from '../types/failedLead'
import type { MagazineArticle } from '../types/magazine'
import type { Property } from '../types/property'
import { getAdminToken } from '../lib/adminAuth'

export interface SiteContent {
  agents: Agent[]
  business: BusinessContact
  leadCapture: {
    enabled: boolean
    rule: LeadCapturePageRule
    delayMs: number
    appearances: number
    recipientEmail: string
  }
  defaultAgentId: string
}

export class ListingsApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ListingsApiError'
    this.status = status
  }
}

async function readBody(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text()
  if (!text) return {}
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    return {}
  }
}

async function request(path: string, init: RequestInit = {}): Promise<Record<string, unknown>> {
  let response: Response
  try {
    response = await fetch(path, init)
  } catch {
    throw new ListingsApiError(
      'The listings server is not running. Start the site with npm run dev:netlify.',
      0,
    )
  }

  const body = await readBody(response)
  if (!response.ok) {
    const message = typeof body.error === 'string' ? body.error : 'The listings server rejected the request.'
    throw new ListingsApiError(message, response.status)
  }
  return body
}

function authHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra)
  // Public pages share one catalog. A signed-in browser still reads that copy
  // outside the admin panel, so looking at the site does not wake the database.
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) return headers
  const token = getAdminToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return headers
}

export async function fetchListings(): Promise<Property[]> {
  const body = await request('/api/listings', { headers: authHeaders() })
  if (!Array.isArray(body.listings)) {
    throw new ListingsApiError('The listings server did not return listings.', 500)
  }
  return body.listings as Property[]
}

export async function saveListing(listing: Property): Promise<Property> {
  const body = await request('/api/listings', {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ listing }),
  })
  return body.listing as Property
}

export async function deleteListing(id: string): Promise<void> {
  await request(`/api/listings/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

export async function fetchArticles(): Promise<MagazineArticle[]> {
  const body = await request('/api/articles', { headers: authHeaders() })
  if (!Array.isArray(body.articles)) {
    throw new ListingsApiError('The articles server did not return articles.', 500)
  }
  return body.articles as MagazineArticle[]
}

export async function saveArticle(
  article: MagazineArticle,
): Promise<{ article: MagazineArticle; warning?: string }> {
  const body = await request('/api/articles', {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ article }),
  })
  return {
    article: body.article as MagazineArticle,
    warning: typeof body.warning === 'string' ? body.warning : undefined,
  }
}

export async function deleteArticle(id: string): Promise<void> {
  await request(`/api/articles/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

export async function fetchFailedLeads(): Promise<FailedLead[]> {
  const body = await request('/api/failed-leads', { headers: authHeaders() })
  if (!Array.isArray(body.leads)) {
    throw new ListingsApiError('Could not load failed emails.', 500)
  }
  return body.leads as FailedLead[]
}

export async function saveFailedLead(lead: {
  name: string
  phone: string
  message?: string
  sourcePage: string
  interest: string
  recipientEmail: string
}): Promise<void> {
  await request('/api/failed-leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lead }),
  })
}

export async function deleteFailedLead(id: string): Promise<void> {
  await request(`/api/failed-leads/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
}

export async function uploadListingImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const body = await request('/api/listing-images', {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  })
  if (typeof body.url !== 'string' || !body.url) {
    throw new ListingsApiError('The photo upload did not return a URL.', 500)
  }
  return body.url
}

export async function loginAdmin(username: string, password: string): Promise<string> {
  const body = await request('/api/admin/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (typeof body.token !== 'string' || !body.token) {
    throw new ListingsApiError('Sign-in did not return a session.', 500)
  }
  return body.token
}

export async function fetchSiteContent(): Promise<SiteContent> {
  const body = await request('/api/site')
  return body.settings as SiteContent
}

export async function saveSiteContent(settings: SiteContent): Promise<SiteContent> {
  const body = await request('/api/site', {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ settings }),
  })
  return body.settings as SiteContent
}
