import { useEffect, useState } from 'react'
import { MOBILE_MAX_WIDTH, type Viewport } from '../constants/breakpoints'

export function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(() =>
    typeof window !== 'undefined' &&
    window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches
      ? 'mobile'
      : 'desktop',
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`)

    const handleChange = (event: MediaQueryListEvent) => {
      setViewport(event.matches ? 'mobile' : 'desktop')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return viewport
}
