import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import AdminShell from './layouts/AdminShell'
import AdminProtectedRoute from './layouts/AdminProtectedRoute'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AllSalesPage from './pages/AllSalesPage'
import AllRentalsPage from './pages/AllRentalsPage'
import SellersPackagePage from './pages/SellersPackagePage'
import ContactPage from './pages/ContactPage'
import MagazinePage from './pages/MagazinePage'
import MagazineArticlePage from './pages/MagazineArticlePage'
import PropertiesSearchPage from './pages/PropertiesSearchPage'
import ServicesPage from './pages/ServicesPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminListingsPage from './pages/admin/AdminListingsPage'
import AdminListingFormPage from './pages/admin/AdminListingFormPage'
import AdminAgentsPage from './pages/admin/AdminAgentsPage'
import AdminAgentFormPage from './pages/admin/AdminAgentFormPage'
import AdminBusinessPage from './pages/admin/AdminBusinessPage'
import AdminLeadCapturePage from './pages/admin/AdminLeadCapturePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin">
          <Route index element={<AdminLoginPage />} />
          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminShell />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="listings" element={<AdminListingsPage />} />
              <Route path="listings/new" element={<AdminListingFormPage />} />
              <Route path="listings/:id" element={<AdminListingFormPage />} />
              <Route path="agents" element={<AdminAgentsPage />} />
              <Route path="agents/new" element={<AdminAgentFormPage />} />
              <Route path="agents/:id" element={<AdminAgentFormPage />} />
              <Route path="business" element={<AdminBusinessPage />} />
              <Route path="lead-capture" element={<AdminLeadCapturePage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>
        </Route>

        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="sales" element={<AllSalesPage />} />
          <Route path="rentals" element={<AllRentalsPage />} />
          <Route path="properties" element={<PropertiesSearchPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="sellers-package" element={<SellersPackagePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="magazine" element={<MagazinePage />} />
          <Route path="magazine/:slug" element={<MagazineArticlePage />} />
          <Route path="property/sale/:id" element={<PropertyDetailPage />} />
          <Route path="property/rental/:id" element={<PropertyDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
