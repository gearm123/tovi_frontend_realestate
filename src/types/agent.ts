import type { BusinessPhone } from './business'

export interface LocalizedAgentText {
  en: string
  he: string
}

/** Listing agent — personal email and optional direct phone */
export interface Agent {
  id: string
  name: string
  title: LocalizedAgentText
  /** Personal inbox for property inquiries */
  email: string
  phone?: BusinessPhone
  image?: string
  imageAlt?: LocalizedAgentText
}

export interface ResolvedAgent {
  id: string
  name: string
  title: string
  email: string
  phone: BusinessPhone
  image?: string
  imageAlt?: string
}
