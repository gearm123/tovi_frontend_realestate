import {
  DEFAULT_ACCESSIBILITY_SETTINGS,
  FONT_SCALE_STEPS,
  type AccessibilitySettings,
} from '../types/accessibility'

const STORAGE_KEY = 'propertlv-a11y-settings'

function clampFontScaleStep(step: number): number {
  return Math.min(FONT_SCALE_STEPS.length - 1, Math.max(0, Math.round(step)))
}

export function loadAccessibilitySettings(): AccessibilitySettings {
  if (typeof window === 'undefined') return DEFAULT_ACCESSIBILITY_SETTINGS

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_ACCESSIBILITY_SETTINGS

    const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>
    return {
      fontScaleStep: clampFontScaleStep(parsed.fontScaleStep ?? DEFAULT_ACCESSIBILITY_SETTINGS.fontScaleStep),
      highContrast: Boolean(parsed.highContrast),
      underlineLinks: Boolean(parsed.underlineLinks),
      readableFont: Boolean(parsed.readableFont),
    }
  } catch {
    return DEFAULT_ACCESSIBILITY_SETTINGS
  }
}

export function saveAccessibilitySettings(settings: AccessibilitySettings): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Ignore quota / private mode errors
  }
}

export function applyAccessibilitySettings(settings: AccessibilitySettings): void {
  const root = document.documentElement
  const scale = FONT_SCALE_STEPS[clampFontScaleStep(settings.fontScaleStep)]

  root.style.setProperty('--a11y-font-scale', String(scale))
  root.dataset.a11yFontScaleStep = String(clampFontScaleStep(settings.fontScaleStep))

  if (settings.highContrast) {
    root.setAttribute('data-a11y-high-contrast', 'true')
  } else {
    root.removeAttribute('data-a11y-high-contrast')
  }

  if (settings.underlineLinks) {
    root.setAttribute('data-a11y-underline-links', 'true')
  } else {
    root.removeAttribute('data-a11y-underline-links')
  }

  if (settings.readableFont) {
    root.setAttribute('data-a11y-readable-font', 'true')
  } else {
    root.removeAttribute('data-a11y-readable-font')
  }
}
