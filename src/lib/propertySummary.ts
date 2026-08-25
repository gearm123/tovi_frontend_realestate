import type { TranslationTree } from '../i18n/translations'
import type { Property } from '../types/property'

/** Canonical listing stats after price and area: m² → rooms → bedrooms → bathrooms. */
export function getPropertySpecParts(
  property: Pick<Property, 'area' | 'rooms' | 'bedrooms' | 'bathrooms'>,
  t: TranslationTree,
): string[] {
  return [
    `${property.area} m²`,
    `${property.rooms} ${t.property.rooms}`,
    `${property.bedrooms} ${t.property.bed}`,
    `${property.bathrooms} ${t.property.bath}`,
  ]
}

/** Present features only, in a stable order used on cards, maps, and similar listings. */
export function getActivePropertyFeatures(
  property: Pick<Property, 'features'>,
  t: TranslationTree,
): string[] {
  const labels: string[] = []
  if (property.features.parking) labels.push(t.filters.features.parking)
  if (property.features.elevator) labels.push(t.filters.features.elevator)
  if (property.features.balcony) labels.push(t.filters.features.balcony)
  if (property.features.mamad) labels.push(t.property.safeRoom)
  else if (property.features.miklat) labels.push(t.property.buildingShelter)
  if (property.features.petsAllowed) labels.push(t.filters.features.petsAllowed)
  return labels
}
