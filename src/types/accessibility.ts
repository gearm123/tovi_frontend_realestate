export interface AccessibilitySettings {
  /** Index into FONT_SCALE_STEPS — middle value is default */
  fontScaleStep: number
  highContrast: boolean
  underlineLinks: boolean
  readableFont: boolean
}

export const FONT_SCALE_STEPS = [0.875, 0.9375, 1, 1.0625, 1.125] as const

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  fontScaleStep: 2,
  highContrast: false,
  underlineLinks: false,
  readableFont: false,
}
