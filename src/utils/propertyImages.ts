import { PLACEHOLDER_PROPERTY_IMAGE } from '../data/placeholders'

const PROPERTY_IMAGE_PATTERN = /\/assets\/properties\/(\d+)\.jpg$/

export interface PropertyImageSources {
  id: string
  desktopWebp: string
  desktopJpg: string
  mobileWebp: string
  fallback: string
}

export function getPropertyImageSources(imagePath: string): PropertyImageSources {
  const match = imagePath.match(PROPERTY_IMAGE_PATTERN)
  const id = match?.[1] ?? 'placeholder'

  if (!match) {
    return {
      id,
      desktopWebp: imagePath,
      desktopJpg: imagePath,
      mobileWebp: imagePath,
      fallback: imagePath,
    }
  }

  const jpg = `/assets/properties/${id}.jpg`

  return {
    id,
    desktopWebp: jpg,
    desktopJpg: jpg,
    mobileWebp: jpg,
    fallback: PLACEHOLDER_PROPERTY_IMAGE,
  }
}

export const HERO_IMAGE = {
  fallback: '/assets/properhero-poster.jpg',
  /** Secondary Tel Aviv skyline if the hero poster fails */
  fallbackAlt: '/assets/hero.jpg',
} as const

export const HERO_VIDEO = '/assets/properhero.mp4'
