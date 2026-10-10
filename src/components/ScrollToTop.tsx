import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { scrollPageTo, scrollPageToTop } from '../utils/scrollPageToTop'

const PROPERTY_PATH = /^\/property\/(?:sale|rental)\//

function revealListing(path: string) {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('a[href]')].filter(
    (item) => item.getAttribute('href') === path,
  )
  const link =
    links.find((item) => {
      const rect = item.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    }) ?? null
  if (!link) return
  const rect = link.getBoundingClientRect()
  const offscreen = rect.bottom < 0 || rect.top > window.innerHeight
  if (!offscreen) return
  scrollPageTo(Math.max(0, window.scrollY + rect.top - 120))
}

export default function ScrollToTop() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const positions = useRef(new Map<string, number>())
  const leftPath = useRef<string | null>(null)

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  useLayoutEffect(() => {
    const previousPath = leftPath.current
    const saved = positions.current.get(location.key)

    if (navigationType === 'POP' && saved != null) {
      scrollPageTo(saved)
      const frame = window.requestAnimationFrame(() => {
        scrollPageTo(saved)
        if (previousPath && PROPERTY_PATH.test(previousPath)) revealListing(previousPath)
      })
      return () => {
        window.cancelAnimationFrame(frame)
        positions.current.set(location.key, window.scrollY)
        leftPath.current = location.pathname
      }
    }

    scrollPageToTop()
    return () => {
      positions.current.set(location.key, window.scrollY)
      leftPath.current = location.pathname
    }
  }, [location.key, location.pathname, navigationType])

  return null
}
