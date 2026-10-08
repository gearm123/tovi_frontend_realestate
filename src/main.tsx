import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AccessibilityProvider } from './context/AccessibilityContext.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { applyAccessibilitySettings, loadAccessibilitySettings } from './lib/accessibilityStorage.ts'
import { refreshListings, refreshSiteContent } from './lib/siteDataStore.ts'

applyAccessibilitySettings(loadAccessibilitySettings())
void refreshListings()
void refreshSiteContent()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    </LanguageProvider>
  </StrictMode>,
)
