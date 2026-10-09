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
import { fetchListings, fetchSiteContent, saveSiteContent, type SiteContent } from '../services/listingsApi'
import { withNormalizedPropertyImages } from '../utils/propertyGallery'
import { withoutStreetNumbers } from '../utils/streetNumber'
import { withCleanedListingCopy } from '../utils/listingCopy'

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
  agents: Agent[]
  business: BusinessContact
  leadCapture: LeadCaptureSettings
  defaultAgentId: string
  listingsStatus: ListingsStatus
  listingsError: string
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

function fallbackListings(): Property[] {
  return clone(defaultProperties)
    .map(withoutStreetNumbers)
    .map(withCleanedListingCopy)
    .map(withNormalizedPropertyImages)
}

let listingsCache: Property[] = []
let listingsStatus: ListingsStatus = 'loading'
let listingsError = ''
let settings: SiteContent = seedContent()
let contentStatus: ListingsStatus = 'loading'
let contentError = ''
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
    listingsStatus,
    listingsError,
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

export function refreshListings(): Promise<void> {
  const generation = ++refreshGeneration
  if (!listingsCache.length) listingsStatus = 'loading'
  return fetchListings()
    .then((rows) => {
      if (generation !== refreshGeneration) return
      listingsCache = rows
        .map(withoutStreetNumbers)
        .map(withCleanedListingCopy)
        .map(withNormalizedPropertyImages)
      listingsStatus = 'ready'
      listingsError = ''
    })
    .catch((error: unknown) => {
      if (generation !== refreshGeneration) return
      listingsStatus = 'error'
      listingsError = error instanceof Error ? error.message : 'Could not load listings'
      if (!listingsCache.length) listingsCache = fallbackListings()
    })
    .finally(() => {
      if (generation !== refreshGeneration) return
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
      settings = { ...next, leadCapture: normalizeLeadCapture(next.leadCapture) }
      contentStatus = 'ready'
      contentError = ''
    })
    .catch((error: unknown) => {
      if (generation !== contentGeneration) return
      contentStatus = 'error'
      contentError = error instanceof Error ? error.message : 'Could not load site settings'
    })
    .finally(() => {
      if (generation !== contentGeneration) return
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
