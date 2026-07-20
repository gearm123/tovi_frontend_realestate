import { DEFAULT_AGENT_ID } from '../data/agents'
import {
  getAgentByRecordId,
  getAgents,
  getBusiness,
  getDefaultAgentId,
} from '../lib/siteDataStore'
import type { Agent, ResolvedAgent } from '../types/agent'
import type { Property } from '../types/property'
import type { Locale } from '../i18n/types'

export { DEFAULT_AGENT_ID }

export function getAllAgents(): Agent[] {
  return getAgents()
}

function resolveAgent(agent: Agent, locale: Locale): ResolvedAgent {
  const localeKey = locale === 'he' ? 'he' : 'en'
  const business = getBusiness()

  return {
    id: agent.id,
    name: agent.name,
    title: agent.title[localeKey],
    email: agent.email,
    phone: agent.phone ?? business.phone,
    image: agent.image,
    imageAlt: agent.imageAlt?.[localeKey],
  }
}

export function getAgentById(id: string, locale: Locale = 'en'): ResolvedAgent | undefined {
  const agent = getAgentByRecordId(id)
  if (!agent) return undefined
  return resolveAgent(agent, locale)
}

export function getAgentForProperty(
  property: Pick<Property, 'agentId'>,
  locale: Locale = 'en',
): ResolvedAgent {
  const list = getAgents()
  const agent =
    getAgentByRecordId(property.agentId) ??
    getAgentByRecordId(getDefaultAgentId()) ??
    getAgentByRecordId(DEFAULT_AGENT_ID) ??
    list[0]

  if (!agent) {
    const business = getBusiness()
    return {
      id: 'office',
      name: business.name,
      title: 'Office',
      email: business.email,
      phone: business.phone,
    }
  }

  return resolveAgent(agent, locale)
}
