import { useEffect } from 'react'
import { applyPageMeta, type PageMetaInput } from '../seo/applyPageMeta'
import { getStaticPageSeo, type StaticSeoPageKey } from '../seo/pageSeoCatalog'
import type { Locale } from '../i18n/types'

export interface UsePageSeoOptions extends Partial<PageMetaInput> {
  pageKey?: StaticSeoPageKey
  locale: Locale
}

export function usePageSeo({
  pageKey,
  locale,
  title,
  description,
  path,
  image,
  type,
  noIndex,
  jsonLd,
}: UsePageSeoOptions): void {
  useEffect(() => {
    const staticEntry = pageKey ? getStaticPageSeo(pageKey, locale) : undefined

    applyPageMeta({
      title: title ?? staticEntry?.title ?? 'ProperTLV',
      description: description ?? staticEntry?.description ?? '',
      path: path ?? staticEntry?.path,
      image,
      type,
      noIndex,
      jsonLd,
    })
  }, [pageKey, locale, title, description, path, image, type, noIndex, jsonLd])
}
