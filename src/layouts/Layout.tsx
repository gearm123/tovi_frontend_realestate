import { Outlet } from 'react-router-dom'
import AccessibilityWidget from '../components/accessibility/AccessibilityWidget'
import FloatingHomeButton from '../components/FloatingHomeButton'
import FloatingTopControls from '../components/FloatingTopControls'
import LeadCapturePopup from '../components/lead-capture/LeadCapturePopup'
import GlobalSiteSeo from '../components/seo/GlobalSiteSeo'
import ScrollToTop from '../components/ScrollToTop'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

export default function Layout() {
  return (
    <>
      <GlobalSiteSeo />
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingTopControls />
      <FloatingHomeButton />
      <AccessibilityWidget />
      <WhatsAppButton />
      <LeadCapturePopup />
    </>
  )
}
