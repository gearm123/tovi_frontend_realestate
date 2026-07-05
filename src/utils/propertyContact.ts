import type { Property } from '../types/property'

export function getPropertyContactPath(
  property: Pick<Property, 'id' | 'listingType' | 'agentId'>,
): string {
  const interest = property.listingType === 'sale' ? 'buying' : 'renting'
  const params = new URLSearchParams({
    interest,
    property: property.id,
    agent: property.agentId,
  })
  return `/contact?${params.toString()}`
}

export function buildPropertyMailtoUrl(
  agentEmail: string,
  propertyTitle: string,
  propertyId: string,
): string {
  const subject = `Inquiry: ${propertyTitle} (${propertyId})`
  const body = `Hi,\n\nI'm interested in this property:\n${propertyTitle} (ID: ${propertyId})\n\n`
  return `mailto:${agentEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function buildPropertyWhatsAppUrl(
  whatsappNumber: string,
  propertyTitle: string,
  propertyId: string,
): string {
  const text = `Hi, I'm interested in ${propertyTitle} (${propertyId})`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
}
