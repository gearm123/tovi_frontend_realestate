export type SiteNavKey =
  | 'buy'
  | 'rent'
  | 'search'
  | 'sellWithUs'
  | 'about'
  | 'magazine'
  | 'contact'

export interface SiteNavItem {
  to: string
  key: SiteNavKey
}

export const siteNavItems: SiteNavItem[] = [
  { to: '/sales', key: 'buy' },
  { to: '/rentals', key: 'rent' },
  { to: '/properties', key: 'search' },
  { to: '/services', key: 'sellWithUs' },
  { to: '/about', key: 'about' },
  { to: '/magazine', key: 'magazine' },
  { to: '/contact', key: 'contact' },
]

export function isNavItemActive(item: SiteNavItem, pathname: string): boolean {
  if (pathname === item.to || pathname.startsWith(`${item.to}/`)) return true
  if (item.key === 'sellWithUs' && pathname.startsWith('/sellers-package')) return true
  return false
}

