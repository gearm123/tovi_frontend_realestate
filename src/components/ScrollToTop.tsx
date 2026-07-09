import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollPageToTop } from '../utils/scrollPageToTop'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    scrollPageToTop()
  }, [pathname])

  return null
}
