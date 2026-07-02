import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  applyAccessibilitySettings,
  loadAccessibilitySettings,
  saveAccessibilitySettings,
} from '../lib/accessibilityStorage'
import {
  DEFAULT_ACCESSIBILITY_SETTINGS,
  FONT_SCALE_STEPS,
  type AccessibilitySettings,
} from '../types/accessibility'

interface AccessibilityContextValue {
  settings: AccessibilitySettings
  increaseTextSize: () => void
  decreaseTextSize: () => void
  toggleHighContrast: () => void
  toggleUnderlineLinks: () => void
  toggleReadableFont: () => void
  resetSettings: () => void
  canIncreaseText: boolean
  canDecreaseText: boolean
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null)

function updateSettings(
  current: AccessibilitySettings,
  patch: Partial<AccessibilitySettings>,
): AccessibilitySettings {
  const next = { ...current, ...patch }
  if (patch.fontScaleStep !== undefined) {
    next.fontScaleStep = Math.min(
      FONT_SCALE_STEPS.length - 1,
      Math.max(0, Math.round(patch.fontScaleStep)),
    )
  }
  return next
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() =>
    loadAccessibilitySettings(),
  )

  useEffect(() => {
    applyAccessibilitySettings(settings)
    saveAccessibilitySettings(settings)
  }, [settings])

  const setAndApply = useCallback((patch: Partial<AccessibilitySettings>) => {
    setSettings((current) => updateSettings(current, patch))
  }, [])

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      settings,
      increaseTextSize: () => setAndApply({ fontScaleStep: settings.fontScaleStep + 1 }),
      decreaseTextSize: () => setAndApply({ fontScaleStep: settings.fontScaleStep - 1 }),
      toggleHighContrast: () => setAndApply({ highContrast: !settings.highContrast }),
      toggleUnderlineLinks: () => setAndApply({ underlineLinks: !settings.underlineLinks }),
      toggleReadableFont: () => setAndApply({ readableFont: !settings.readableFont }),
      resetSettings: () => setSettings(DEFAULT_ACCESSIBILITY_SETTINGS),
      canIncreaseText: settings.fontScaleStep < FONT_SCALE_STEPS.length - 1,
      canDecreaseText: settings.fontScaleStep > 0,
    }),
    [setAndApply, settings],
  )

  return (
    <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
  )
}

export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}
