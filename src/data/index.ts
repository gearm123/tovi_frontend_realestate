import type { Locale } from '../i18n/types'
import { business } from './business'
import { getSiteContent } from './content'
import { neighborhoods, properties, propertyTypes, getPropertyById } from './properties'
import {
  PLACEHOLDER_MAP_CENTER,
  PLACEHOLDER_PROPERTY_IMAGE,
  PLACEHOLDER_VIDEO_URL,
} from './placeholders'

export {
  business,
  getSiteContent,
  neighborhoods,
  properties,
  propertyTypes,
  getPropertyById,
  PLACEHOLDER_MAP_CENTER,
  PLACEHOLDER_PROPERTY_IMAGE,
  PLACEHOLDER_VIDEO_URL,
}

export type { BusinessContact } from '../types/business'
export type { SiteContent, ReviewItem, CtaSection } from '../types/content'
export type { Property, ListingType, PropertyType } from '../types/property'

/** Convenience bundle for components that need both business info and localized copy. */
export function getContentBundle(locale: Locale) {
  return {
    business,
    site: getSiteContent(locale),
  }
}
