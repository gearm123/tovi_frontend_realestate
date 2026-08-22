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
import { withNormalizedPropertyImages } from '../utils/propertyGallery'

const STORAGE_KEY = 'propertlv_site_data_v5'
const DATA_EVENT = 'propertlv-site-data-updated'

export type LeadCaptureSettings = {
  enabled: boolean
  rule: LeadCapturePageRule
  delayMs: number
  recipientEmail: string
}

export interface SiteData {
  properties: Property[]
  agents: Agent[]
  business: BusinessContact
  leadCapture: LeadCaptureSettings
  defaultAgentId: string
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function seedSiteData(): SiteData {
  return {
    properties: clone(defaultProperties),
    agents: clone(defaultAgents),
    business: clone(defaultBusiness),
    leadCapture: {
      enabled: defaultLeadCapture.enabled,
      rule: clone(defaultLeadCapture.rule),
      delayMs: defaultLeadCapture.delayMs,
      recipientEmail: defaultLeadCapture.recipientEmail,
    },
    defaultAgentId: DEFAULT_AGENT_ID,
  }
}

function readStorage(): SiteData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<SiteData>
    const seed = seedSiteData()
    return {
      properties: (Array.isArray(parsed.properties) ? parsed.properties : seed.properties).map(
        withNormalizedPropertyImages,
      ),
      agents: Array.isArray(parsed.agents) ? parsed.agents : seed.agents,
      business: parsed.business ? { ...seed.business, ...parsed.business } : seed.business,
      leadCapture: parsed.leadCapture
        ? { ...seed.leadCapture, ...parsed.leadCapture }
        : seed.leadCapture,
      defaultAgentId: parsed.defaultAgentId ?? seed.defaultAgentId,
    }
  } catch {
    return null
  }
}

let cache: SiteData | null = null

function notify(): void {
  window.dispatchEvent(new Event(DATA_EVENT))
}

export function getSiteData(): SiteData {
  if (cache) return cache
  cache = readStorage() ?? seedSiteData()
  return cache
}

export function saveSiteData(next: SiteData): void {
  cache = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  notify()
}

export function updateSiteData(updater: (current: SiteData) => SiteData): SiteData {
  const next = updater(clone(getSiteData()))
  saveSiteData(next)
  return next
}

export function resetSiteData(): SiteData {
  localStorage.removeItem(STORAGE_KEY)
  cache = seedSiteData()
  notify()
  return cache
}

export function subscribeSiteData(listener: () => void): () => void {
  window.addEventListener(DATA_EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(DATA_EVENT, listener)
    window.removeEventListener('storage', listener)
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
    featured: false,
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
