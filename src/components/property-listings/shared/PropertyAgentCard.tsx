import { Link } from 'react-router-dom'
import type { ResolvedAgent } from '../../../types/agent'
import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import {
  buildPropertyMailtoUrl,
  buildPropertyWhatsAppUrl,
  getPropertyContactPath,
} from '../../../utils/propertyContact'
import './PropertyAgentCard.css'

interface PropertyAgentCardProps {
  agent: ResolvedAgent
  property: Pick<Property, 'id' | 'listingType' | 'agentId' | 'title'>
  propertyTitle: string
  variant?: 'detail' | 'compact'
}

function agentInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function PropertyAgentCard({
  agent,
  property,
  propertyTitle,
  variant = 'detail',
}: PropertyAgentCardProps) {
  const { t } = useLanguage()
  const contactPath = getPropertyContactPath(property)
  const mailtoUrl = buildPropertyMailtoUrl(agent.email, propertyTitle, property.id)
  const whatsappUrl = agent.phone.whatsapp
    ? buildPropertyWhatsAppUrl(agent.phone.whatsapp, propertyTitle, property.id)
    : undefined

  return (
    <section
      className={`property-agent property-agent--${variant}`}
      aria-labelledby={`property-agent-${property.id}`}
    >
      <h2 id={`property-agent-${property.id}`} className="property-agent__heading">
        {t.property.yourAgent}
      </h2>

      <div className="property-agent__card">
        {agent.image ? (
          <img
            src={agent.image}
            alt={agent.imageAlt ?? agent.name}
            className="property-agent__photo"
            loading="lazy"
          />
        ) : (
          <div className="property-agent__photo property-agent__photo--initials" aria-hidden="true">
            {agentInitials(agent.name)}
          </div>
        )}

        <div className="property-agent__info">
          <p className="property-agent__name">{agent.name}</p>
          <p className="property-agent__title">{agent.title}</p>
          <a href={`mailto:${agent.email}`} className="property-agent__email">
            {agent.email}
          </a>
        </div>
      </div>

      <div className="property-agent__actions">
        <a href={mailtoUrl} className="property-agent__cta property-agent__cta--primary">
          {t.property.emailAgent.replace('{name}', agent.name.split(' ')[0] ?? agent.name)}
        </a>
        <Link to={contactPath} className="property-agent__cta">
          {t.property.contactAgent}
        </Link>
        <a href={`tel:${agent.phone.tel}`} className="property-agent__cta">
          {t.property.agentPhone}
        </a>
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            className="property-agent__cta property-agent__cta--whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        )}
      </div>
    </section>
  )
}
