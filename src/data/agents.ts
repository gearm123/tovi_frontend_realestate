import type { Agent } from '../types/agent'
import { business } from './business'
import { teamPortrait } from './teamPortraits'

/**
 * Listing agents — each property's `agentId` routes inquiries to that agent's email.
 * Active listing agents: Tova, Miri, Yana, Eden.
 */
export const DEFAULT_AGENT_ID = 'tova-dekkers'

const officePhone = business.phone

export const agents: Agent[] = [
  {
    id: 'tova-dekkers',
    name: 'Tova Dekkers',
    title: {
      en: 'Founder & Lead Real Estate Agent',
      he: 'מייסדת וסוכנת נדל״ן ראשית',
    },
    email: 'tova@propertlv.com',
    phone: officePhone,
    image: teamPortrait('tova-dekkers'),
    imageAlt: {
      en: 'Portrait of Tova Dekkers, Founder and Lead Real Estate Agent at ProperTLV',
      he: 'דיוקן של Tova Dekkers, מייסדת וסוכנת נדל״ן ראשית ב-ProperTLV',
    },
  },
  {
    id: 'miri-minkin',
    name: 'Miri Minkin',
    title: {
      en: 'Real Estate Specialist',
      he: 'מומחית נדל״ן',
    },
    email: 'miri@propertlv.com',
    phone: officePhone,
    image: teamPortrait('miri-minkin'),
    imageAlt: {
      en: 'Portrait of Miri Minkin, Real Estate Specialist at ProperTLV',
      he: 'דיוקן של Miri Minkin, מומחית נדל״ן ב-ProperTLV',
    },
  },
  {
    id: 'yana-yatsenko',
    name: 'Yana Yatsenko',
    title: {
      en: 'Real Estate Agent',
      he: 'סוכנת נדל״ן',
    },
    email: 'yana01204@gmail.com',
    phone: officePhone,
    image: teamPortrait('yana-yatsenko'),
    imageAlt: {
      en: 'Portrait of Yana Yatsenko, Real Estate Agent at ProperTLV',
      he: 'דיוקן של Yana Yatsenko, סוכנת נדל״ן ב-ProperTLV',
    },
  },
  {
    id: 'eden-nahum',
    name: 'Eden Nahum',
    title: {
      en: 'Real Estate Agent',
      he: 'סוכנת נדל״ן',
    },
    email: 'office@propertlv.com',
    phone: officePhone,
    image: teamPortrait('eden-nahum'),
    imageAlt: {
      en: 'Portrait of Eden Nahum, Real Estate Agent at ProperTLV',
      he: 'דיוקן של Eden Nahum, סוכנת נדל״ן ב-ProperTLV',
    },
  },
  {
    id: 'lee-cohen',
    name: 'Lee Cohen',
    title: {
      en: 'Office & Operations',
      he: 'תפעול ומשרד',
    },
    email: 'lee@propertlv.com',
    phone: officePhone,
    image: teamPortrait('lee-cohen'),
    imageAlt: {
      en: 'Portrait of Lee Cohen, Office & Operations at ProperTLV',
      he: 'דיוקן של Lee Cohen, תפעול ומשרד ב-ProperTLV',
    },
  },
]

const agentById = new Map(agents.map((agent) => [agent.id, agent]))

export function getAgentRecord(id: string): Agent | undefined {
  return agentById.get(id)
}
