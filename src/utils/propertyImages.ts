const PROPERTY_IMAGE_PATTERN = /\/assets\/properties\/(\d+)\.jpg$/

export interface PropertyImageSources {
  id: string
  desktopWebp: string
  desktopJpg: string
  mobileWebp: string
}

export function getPropertyImageSources(imagePath: string): PropertyImageSources {
  const match = imagePath.match(PROPERTY_IMAGE_PATTERN)
  const id = match?.[1] ?? '1'

  return {
    id,
    desktopWebp: `/assets/properties/${id}.webp`,
    desktopJpg: `/assets/properties/${id}.jpg`,
    mobileWebp: `/assets/properties/mobile/${id}.webp`,
  }
}

export const HERO_IMAGE = {
  mobileWebp: '/assets/stub-mobile.webp',
  desktopWebp: '/assets/stub.webp',
  fallback: '/assets/stub.png',
} as const
