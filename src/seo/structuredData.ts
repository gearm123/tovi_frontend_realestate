import { business } from '../data/business'
import { toAbsoluteUrl } from '../constants/seoConfig'
import type { Property } from '../types/property'

export function buildLocalBusinessJsonLd(): Record<string, unknown> {
  const { googleBusiness, phone, address, email, social } = business

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
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
    sameAs: [social.instagram, social.facebook, social.linkedin, googleBusiness.mapsUrl],
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
  const listing: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: localized.title,
    description: localized.description,
    url: toAbsoluteUrl(path),
    image: toAbsoluteUrl(property.image),
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
