import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ResolvedAgent } from '../../../types/agent'
import type { Property } from '../../../types/property'
import { useLanguage } from '../../../context/LanguageContext'
import {
  buildPropertyWhatsAppUrl,
  getPropertyContactPath,
  getPropertyListingUrl,
} from '../../../utils/propertyContact'
import './PropertyAgentCard.css'

interface PropertyAgentCardProps {
  agent: ResolvedAgent
  property: Pick<Property, 'id' | 'listingType' | 'agentId' | 'title'>
  propertyTitle: string
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
}: PropertyAgentCardProps) {
  const { t } = useLanguage()
  const [linkCopied, setLinkCopied] = useState(false)
  const contactPath = getPropertyContactPath(property)
  const listingUrl = getPropertyListingUrl(property)
  const whatsappUrl = agent.phone.whatsapp
    ? buildPropertyWhatsAppUrl(agent.phone.whatsapp, propertyTitle, property)
    : undefined

  const shareListing = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: propertyTitle, url: listingUrl })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(listingUrl)
      setLinkCopied(true)
      window.setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      setLinkCopied(false)
    }
  }

  return (
    <section
      className="property-agent"
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
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            className="property-agent__cta property-agent__cta--whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.property.whatsapp}
          </a>
        )}
        <button
          type="button"
          className="property-agent__cta"
          onClick={shareListing}
          aria-live="polite"
        >
          {linkCopied ? t.property.linkCopied : t.property.shareListing}
        </button>
        <Link to={contactPath} className="property-agent__cta property-agent__cta--primary">
          {t.property.bookViewing}
        </Link>
      </div>
    </section>
  )
}
