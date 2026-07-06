import { getDefaultOgImageUrl, toAbsoluteUrl } from '../constants/seoConfig'

export interface PageMetaInput {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const MANAGED_SELECTOR = 'data-managed-by="page-seo"'

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`
  let element = document.head.querySelector(selector) as HTMLMetaElement | null

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    element.setAttribute('data-managed-by', 'page-seo')
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"][${MANAGED_SELECTOR}]`
  let element = document.head.querySelector(selector) as HTMLLinkElement | null

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    element.setAttribute('data-managed-by', 'page-seo')
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

function upsertJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]) {
  const scriptId = `jsonld-${id}`
  let element = document.getElementById(scriptId) as HTMLScriptElement | null

  if (!element) {
    element = document.createElement('script')
    element.id = scriptId
    element.type = 'application/ld+json'
    element.setAttribute('data-managed-by', 'page-seo')
    document.head.appendChild(element)
  }

  element.textContent = JSON.stringify(data)
}

export function applyPageMeta(meta: PageMetaInput): void {
  document.title = meta.title

  upsertMeta('name', 'description', meta.description)

  const canonicalPath = meta.path ?? window.location.pathname
  const canonicalUrl = toAbsoluteUrl(canonicalPath)
  const imageUrl = meta.image ? toAbsoluteUrl(meta.image) : getDefaultOgImageUrl()

  upsertLink('canonical', canonicalUrl)

  upsertMeta('property', 'og:title', meta.title)
  upsertMeta('property', 'og:description', meta.description)
  upsertMeta('property', 'og:type', meta.type ?? 'website')
  upsertMeta('property', 'og:url', canonicalUrl)
  upsertMeta('property', 'og:image', imageUrl)
  upsertMeta('property', 'og:site_name', 'ProperTLV')

  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', meta.title)
  upsertMeta('name', 'twitter:description', meta.description)
  upsertMeta('name', 'twitter:image', imageUrl)

  if (meta.noIndex) {
    upsertMeta('name', 'robots', 'noindex, nofollow')
  } else {
    const robots = document.querySelector('meta[name="robots"][data-managed-by="page-seo"]')
    robots?.remove()
  }

  if (meta.jsonLd) {
    upsertJsonLd('page', meta.jsonLd)
  }
}

export function applyGlobalJsonLd(id: string, data: Record<string, unknown>): void {
  upsertJsonLd(id, data)
}
