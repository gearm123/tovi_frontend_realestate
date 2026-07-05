import { agents, DEFAULT_AGENT_ID, getAgentRecord } from '../data/agents'
import { business } from '../data/business'
import type { Agent, ResolvedAgent } from '../types/agent'
import type { Property } from '../types/property'
import type { Locale } from '../i18n/types'

export { agents, DEFAULT_AGENT_ID }

function resolveAgent(agent: Agent, locale: Locale): ResolvedAgent {
  const localeKey = locale === 'he' ? 'he' : 'en'

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
  const agent = getAgentRecord(id)
  if (!agent) return undefined
  return resolveAgent(agent, locale)
}

export function getAgentForProperty(
  property: Pick<Property, 'agentId'>,
  locale: Locale = 'en',
): ResolvedAgent {
  const agent =
    getAgentRecord(property.agentId) ?? getAgentRecord(DEFAULT_AGENT_ID) ?? agents[0]

  return resolveAgent(agent, locale)
}
