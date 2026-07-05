import type { Agent } from '../types/agent'
import { business } from './business'

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
    image: '/assets/team/tova-dekkers.jpg',
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
    image: '/assets/team/miri-minkin.jpg',
    imageAlt: {
      en: 'Portrait of Miri Minkin, Real Estate Specialist at ProperTLV',
      he: 'דיוקן של Miri Minkin, מומחית נדל״ן ב-ProperTLV',
    },
  },
  {
    id: 'dawn-schuster',
    name: 'Dawn Schuster',
    title: {
      en: 'Real Estate Agent & Designer',
      he: 'סוכנת נדל״ן ומעצבת',
    },
    email: 'dawn@propertlv.com',
    phone: officePhone,
    image: '/assets/team/dawn-schuster.jpg',
    imageAlt: {
      en: 'Portrait of Dawn Schuster, Real Estate Agent and Designer at ProperTLV',
      he: 'דיוקן של Dawn Schuster, סוכנת נדל״ן ומעצבת ב-ProperTLV',
    },
  },
  {
    id: 'yana-yatsenko',
    name: 'Yana Yatsenko',
    title: {
      en: 'Rental Specialist',
      he: 'מומחית השכרות',
    },
    email: 'yana01204@gmail.com',
    phone: officePhone,
  },
  {
    id: 'eden-kaduri',
    name: 'Eden Kaduri',
    title: {
      en: 'Real Estate Agent',
      he: 'סוכנת נדל״ן',
    },
    email: 'office@propertlv.com',
    phone: officePhone,
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
  },
]

const agentById = new Map(agents.map((agent) => [agent.id, agent]))

export function getAgentRecord(id: string): Agent | undefined {
  return agentById.get(id)
}
