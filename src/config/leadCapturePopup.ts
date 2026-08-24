/**
 * Lead capture popup — visibility and delivery settings.
 *
 * Page rules (for future use):
 * - `all` — every page (current default)
 * - `include` — only paths in `paths` (exact match or prefix with `*`, e.g. `/magazine/*`)
 * - `exclude` — every page except those in `paths`
 */
export type LeadCapturePageRule =
  | { mode: 'all' }
  | { mode: 'include'; paths: string[] }
  | { mode: 'exclude'; paths: string[] }

export const leadCapturePopupConfig = {
  enabled: true,
  rule: { mode: 'all' } satisfies LeadCapturePageRule,
  delayMs: 10_000,
  recipientEmail: 'office@propertlv.com',
} as const
