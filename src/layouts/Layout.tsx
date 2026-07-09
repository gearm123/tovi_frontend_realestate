import { Outlet } from 'react-router-dom'
import AccessibilityWidget from '../components/accessibility/AccessibilityWidget'
import FloatingHomeButton from '../components/FloatingHomeButton'
import FloatingNavMenu from '../components/FloatingNavMenu'
import GlobalSiteSeo from '../components/seo/GlobalSiteSeo'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

export default function Layout() {
  return (
    <>
      <GlobalSiteSeo />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingNavMenu />
      <FloatingHomeButton />
      <AccessibilityWidget />
      <WhatsAppButton />
    </>
  )
}
