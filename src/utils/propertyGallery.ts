import { PLACEHOLDER_PROPERTY_IMAGE } from '../data/placeholders'
import type { Property } from '../types/property'

/** Resolve gallery URLs for a listing, always returning at least one entry. */
export function getPropertyImages(property: Pick<Property, 'image' | 'images'>): string[] {
  const fromGallery = (property.images ?? []).map((src) => src.trim()).filter(Boolean)
  if (fromGallery.length > 0) return fromGallery

  const cover = property.image?.trim()
  if (cover) return [cover]

  return [PLACEHOLDER_PROPERTY_IMAGE]
}

/** Ensure `images` exists and `image` matches the first gallery photo. */
export function withNormalizedPropertyImages(property: Property): Property {
  const images = getPropertyImages(property)
  return {
    ...property,
    images,
    image: images[0] ?? PLACEHOLDER_PROPERTY_IMAGE,
  }
}
