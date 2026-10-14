import { agents as defaultAgents, DEFAULT_AGENT_ID } from '../data/agents'
import { business as defaultBusiness } from '../data/business'
import { properties as defaultProperties } from '../data/properties'
import {
  leadCapturePopupConfig as defaultLeadCapture,
  type LeadCapturePageRule,
} from '../config/leadCapturePopup'
import type { Agent } from '../types/agent'
import type { BusinessContact } from '../types/business'
import type { ListingType, Property, PropertyFeatures } from '../types/property'
import { PLACEHOLDER_MAP_CENTER, PLACEHOLDER_PROPERTY_IMAGE } from '../data/placeholders'
import { buildStoredMagazineArticles } from '../data/magazine/stored'
import type { MagazineArticle } from '../types/magazine'
import {
  fetchArticles,
  fetchListings,
  fetchSiteContent,
  saveSiteContent,
  type SiteContent,
} from '../services/listingsApi'
import { withNormalizedPropertyImages } from '../utils/propertyGallery'
import { withoutStreetNumbers } from '../utils/streetNumber'
import { withCleanedListingCopy } from '../utils/listingCopy'
import { assignPropertyCodes } from '../utils/propertyCode'

const DATA_EVENT = 'propertlv-site-data-updated'

export type LeadCaptureSettings = {
  enabled: boolean
  rule: LeadCapturePageRule
  delayMs: number
  appearances: number
  recipientEmail: string
}

export type ListingsStatus = 'loading' | 'ready' | 'error'

export interface SiteData {
  properties: Property[]
  articles: MagazineArticle[]
  agents: Agent[]
  business: BusinessContact
  leadCapture: LeadCaptureSettings
  defaultAgentId: string
  listingsStatus: ListingsStatus
  listingsError: string
  articlesStatus: ListingsStatus
  articlesError: string
  contentStatus: ListingsStatus
  contentError: string
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

export function normalizeLeadCapture(
  value: Partial<LeadCaptureSettings> | null | undefined,
): LeadCaptureSettings {
  const appearances = Number(value?.appearances)
  return {
    enabled: value?.enabled ?? defaultLeadCapture.enabled,
    rule: value?.rule ?? clone(defaultLeadCapture.rule),
    delayMs: Number.isFinite(Number(value?.delayMs)) ? Number(value?.delayMs) : defaultLeadCapture.delayMs,
    recipientEmail: value?.recipientEmail?.trim() || defaultLeadCapture.recipientEmail,
    appearances:
      Number.isFinite(appearances) && appearances >= 1
        ? Math.floor(appearances)
        : defaultLeadCapture.appearances,
  }
}

function seedContent(): SiteContent {
  return {
    agents: clone(defaultAgents),
    business: clone(defaultBusiness),
    leadCapture: normalizeLeadCapture(defaultLeadCapture),
    defaultAgentId: DEFAULT_AGENT_ID,
  }
}

function prepareListings(rows: Property[]): Property[] {
  return assignPropertyCodes(
    rows.map(withoutStreetNumbers).map(withCleanedListingCopy).map(withNormalizedPropertyImages),
  )
}

function fallbackListings(): Property[] {
  return prepareListings(clone(defaultProperties))
}

let listingsCache: Property[] = []
let listingsStatus: ListingsStatus = 'loading'
let listingsError = ''
let articlesCache: MagazineArticle[] = buildStoredMagazineArticles()
let articlesStatus: ListingsStatus = 'loading'
let articlesError = ''
let articlesGeneration = 0
let settings: SiteContent = seedContent()
let contentStatus: ListingsStatus = 'loading'
let contentError = ''

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue)
  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((copy, key) => {
        copy[key] = stableValue((value as Record<string, unknown>)[key])
        return copy
      }, {})
  }
  return value
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(stableValue(left)) === JSON.stringify(stableValue(right))
}

let cache: SiteData | null = null
let refreshGeneration = 0
let contentGeneration = 0

function notify(): void {
  window.dispatchEvent(new Event(DATA_EVENT))
}

function publish(): SiteData {
  cache = {
    ...settings,
    properties: listingsCache,
    articles: articlesCache,
    listingsStatus,
    listingsError,
    articlesStatus,
    articlesError,
    contentStatus,
    contentError,
  }
  return cache
}

export function getSiteData(): SiteData {
  if (cache) return cache
  return publish()
}

function rememberListings(next: Property[], status: ListingsStatus, error = ''): void {
  listingsCache = next
  listingsStatus = status
  listingsError = error
  cache = null
  publish()
  notify()
}

export function upsertCachedListing(property: Property): void {
  const normalized = withNormalizedPropertyImages(withoutStreetNumbers(withCleanedListingCopy(property)))
  const exists = listingsCache.some((item) => item.id === normalized.id)
  rememberListings(
    exists
      ? listingsCache.map((item) => (item.id === normalized.id ? normalized : item))
      : [normalized, ...listingsCache],
    'ready',
  )
}

export function removeCachedListing(id: string): void {
  rememberListings(
    listingsCache.filter((item) => item.id !== id),
    'ready',
  )
}

export function upsertCachedArticle(article: MagazineArticle): void {
  const exists = articlesCache.some((item) => item.id === article.id)
  articlesCache = exists
    ? articlesCache.map((item) => (item.id === article.id ? article : item))
    : [article, ...articlesCache]
  articlesStatus = 'ready'
  articlesError = ''
  cache = null
  publish()
  notify()
}

export function removeCachedArticle(id: string): void {
  articlesCache = articlesCache.filter((item) => item.id !== id)
  articlesStatus = 'ready'
  articlesError = ''
  cache = null
  publish()
  notify()
}

export function refreshArticles(): Promise<void> {
  const generation = ++articlesGeneration
  if (!articlesCache.length) articlesStatus = 'loading'
  return fetchArticles()
    .then((rows) => {
      if (generation !== articlesGeneration) return
      const changed = articlesStatus !== 'ready' || articlesError !== '' || !sameJson(articlesCache, rows)
      if (changed) articlesCache = rows
      articlesStatus = 'ready'
      articlesError = ''
      if (!changed) return
      cache = null
      publish()
      notify()
    })
    .catch((error: unknown) => {
      if (generation !== articlesGeneration) return
      articlesStatus = 'error'
      articlesError = error instanceof Error ? error.message : 'Could not load articles'
      if (!articlesCache.length) articlesCache = buildStoredMagazineArticles()
      cache = null
      publish()
      notify()
    })
}

export function refreshListings(): Promise<void> {
  const generation = ++refreshGeneration
  if (!listingsCache.length) listingsStatus = 'loading'
  return fetchListings()
    .then((rows) => {
      if (generation !== refreshGeneration) return
      const next = prepareListings(rows)
      const changed = listingsStatus !== 'ready' || listingsError !== '' || !sameJson(listingsCache, next)
      if (changed) listingsCache = next
      listingsStatus = 'ready'
      listingsError = ''
      if (!changed) return
      cache = null
      publish()
      notify()
    })
    .catch((error: unknown) => {
      if (generation !== refreshGeneration) return
      listingsStatus = 'error'
      listingsError = error instanceof Error ? error.message : 'Could not load listings'
      if (!listingsCache.length) listingsCache = fallbackListings()
      cache = null
      publish()
      notify()
    })
}

export async function refreshSiteContent(): Promise<void> {
  const generation = ++contentGeneration
  return fetchSiteContent()
    .then((next) => {
      if (generation !== contentGeneration) return
      const prepared = { ...next, leadCapture: normalizeLeadCapture(next.leadCapture) }
      const changed = contentStatus !== 'ready' || contentError !== '' || !sameJson(settings, prepared)
      if (changed) settings = prepared
      contentStatus = 'ready'
      contentError = ''
      if (!changed) return
      cache = null
      publish()
      notify()
    })
    .catch((error: unknown) => {
      if (generation !== contentGeneration) return
      contentStatus = 'error'
      contentError = error instanceof Error ? error.message : 'Could not load site settings'
      cache = null
      publish()
      notify()
    })
}

export async function persistSiteContent(updater: (current: SiteData) => SiteData): Promise<SiteData> {
  const next = updater(clone(getSiteData()))
  const saved = await saveSiteContent({
    agents: next.agents,
    business: next.business,
    leadCapture: next.leadCapture,
    defaultAgentId: next.defaultAgentId,
  })
  settings = { ...saved, leadCapture: normalizeLeadCapture(saved.leadCapture) }
  contentStatus = 'ready'
  contentError = ''
  cache = null
  publish()
  notify()
  return getSiteData()
}

export function subscribeSiteData(listener: () => void): () => void {
  window.addEventListener(DATA_EVENT, listener)
  return () => {
    window.removeEventListener(DATA_EVENT, listener)
  }
}

export function getBusiness(): BusinessContact {
  return getSiteData().business
}

export function getLeadCaptureSettings(): LeadCaptureSettings {
  return getSiteData().leadCapture
}

export function getAgents(): Agent[] {
  return getSiteData().agents
}

export function getAgentByRecordId(id: string): Agent | undefined {
  return getSiteData().agents.find((agent) => agent.id === id)
}

export function getDefaultAgentId(): string {
  return getSiteData().defaultAgentId
}

export function formatListingPrice(priceNumeric: number, listingType: ListingType): string {
  const formatted = priceNumeric.toLocaleString('en-US')
  return listingType === 'rental' ? `₪${formatted} / month` : `₪${formatted}`
}

export function createEmptyFeatures(): PropertyFeatures {
  return {
    balcony: false,
    parking: false,
    elevator: false,
    mamad: false,
    miklat: false,
    petsAllowed: false,
  }
}

export function createBlankProperty(listingType: ListingType = 'sale'): Property {
  const data = getSiteData()
  return {
    id: `${listingType}-${Date.now()}`,
    agentId: data.defaultAgentId || data.agents[0]?.id || DEFAULT_AGENT_ID,
    title: '',
    neighborhood: 'Lev HaIr',
    address: '',
    priceNumeric: listingType === 'rental' ? 8000 : 3_500_000,
    price: formatListingPrice(listingType === 'rental' ? 8000 : 3_500_000, listingType),
    listingType,
    propertyType: 'apartment',
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    area: 70,
    description: '',
    image: PLACEHOLDER_PROPERTY_IMAGE,
    images: [PLACEHOLDER_PROPERTY_IMAGE],
    videoUrl: '',
    coordinates: { ...PLACEHOLDER_MAP_CENTER },
    floor: '',
    highlights: [],
    specialNotes: [],
    featured: false,
    exclusive: false,
    isNew: false,
    availability: 'available',
    propertyCode: '',
    ownerPhone: '',
    fullAddress: '',
    features: createEmptyFeatures(),
  }
}

export function createBlankAgent(): Agent {
  const phone = clone(getBusiness().phone)
  return {
    id: `agent-${Date.now()}`,
    name: '',
    title: { en: '', he: '' },
    email: '',
    phone,
    image: '',
    imageAlt: { en: '', he: '' },
  }
}

export function slugifyId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
