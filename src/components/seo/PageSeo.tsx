import { useLanguage } from '../../context/LanguageContext'
import { usePageSeo, type UsePageSeoOptions } from '../../hooks/usePageSeo'

type PageSeoProps = Omit<UsePageSeoOptions, 'locale'>

/** Updates document title, meta tags, Open Graph, and optional JSON-LD for the current page. */
export default function PageSeo(props: PageSeoProps) {
  const { locale } = useLanguage()
  usePageSeo({ ...props, locale })
  return null
}
