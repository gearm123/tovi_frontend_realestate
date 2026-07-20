import { useSyncExternalStore } from 'react'
import { getSiteData, subscribeSiteData, type SiteData } from '../lib/siteDataStore'

export function useSiteData(): SiteData {
  return useSyncExternalStore(subscribeSiteData, getSiteData, getSiteData)
}
