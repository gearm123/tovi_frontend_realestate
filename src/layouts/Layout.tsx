import { Outlet } from 'react-router-dom'
import AccessibilityWidget from '../components/accessibility/AccessibilityWidget'
import FloatingHomeButton from '../components/FloatingHomeButton'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingHomeButton />
      <AccessibilityWidget />
      <WhatsAppButton />
    </>
  )
}
