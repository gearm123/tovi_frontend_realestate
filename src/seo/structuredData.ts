import { officeOpeningHours } from '../data/business'
import { getBusiness } from '../lib/siteDataStore'
import { toAbsoluteUrl } from '../constants/seoConfig'
import type { Property } from '../types/property'
import { getPropertyImages } from '../utils/propertyGallery'

function cleanProfileUrl(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return url
  }
}

export function buildLocalBusinessJsonLd(): Record<string, unknown> {
  const business = getBusiness()
  const { googleBusiness, phone, address, email, social } = business

  return {
    '@context': 'https://schema.org',
    '@type': ['RealEstateAgent', 'LocalBusiness'],
    name: googleBusiness.listingName,
    alternateName: business.name,
    url: toAbsoluteUrl('/'),
    image: toAbsoluteUrl('/assets/properties/1.jpg'),
    telephone: phone.tel,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.line1,
      addressLocality: address.city,
      addressCountry: 'IL',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: officeOpeningHours.dayOfWeek.map((day) => `https://schema.org/${day}`),
      opens: officeOpeningHours.opens,
      closes: officeOpeningHours.closes,
    },
    sameAs: [
      googleBusiness.mapsUrl,
      cleanProfileUrl(social.facebook),
      cleanProfileUrl(social.instagram),
      cleanProfileUrl(social.linkedin),
    ].filter((url) => url.trim().length > 0),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: googleBusiness.rating,
      reviewCount: googleBusiness.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  }
}

export function buildRealEstateListingJsonLd(
  property: Property,
  localized: { title: string; description: string; address: string },
  path: string,
): Record<string, unknown> {
  const images = getPropertyImages(property).map((src) => toAbsoluteUrl(src))
  const listing: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: localized.title,
    description: localized.description,
    url: toAbsoluteUrl(path),
    image: images.length === 1 ? images[0] : images,
    address: {
      '@type': 'PostalAddress',
      streetAddress: localized.address,
      addressLocality: 'Tel Aviv',
      addressCountry: 'IL',
    },
  }

  if (property.priceNumeric) {
    listing.offers = {
      '@type': 'Offer',
      price: property.priceNumeric,
      priceCurrency: 'ILS',
      availability: 'https://schema.org/InStock',
    }
  }

  return listing
}

export function buildArticleJsonLd(
  article: { title: string; excerpt: string; date: string; image?: string },
  path: string,
): Record<string, unknown> {
  const business = getBusiness()
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    url: toAbsoluteUrl(path),
    image: article.image ? toAbsoluteUrl(article.image) : toAbsoluteUrl('/assets/properties/1.jpg'),
    author: {
      '@type': 'Organization',
      name: business.name,
    },
    publisher: {
      '@type': 'Organization',
      name: business.name,
      url: toAbsoluteUrl('/'),
    },
  }
}
