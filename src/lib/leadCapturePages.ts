import { leadCapturePopupConfig, type LeadCapturePageRule } from '../config/leadCapturePopup'

function matchesPath(pattern: string, pathname: string): boolean {
  if (pattern.endsWith('*')) {
    const prefix = pattern.slice(0, -1).replace(/\/$/, '') || '/'
    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  }

  return pathname === pattern
}

function matchesRule(rule: LeadCapturePageRule, pathname: string): boolean {
  if (rule.mode === 'all') return true

  const matched = rule.paths.some((pattern) => matchesPath(pattern, pathname))

  if (rule.mode === 'include') return matched
  return !matched
}

export function shouldShowLeadCaptureOnPage(pathname: string): boolean {
  if (!leadCapturePopupConfig.enabled) return false
  return matchesRule(leadCapturePopupConfig.rule, pathname)
}
