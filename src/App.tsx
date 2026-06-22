import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AllSalesPage from './pages/AllSalesPage'
import AllRentalsPage from './pages/AllRentalsPage'
import SellersPackagePage from './pages/SellersPackagePage'
import ContactPage from './pages/ContactPage'
import MagazinePage from './pages/MagazinePage'
import PropertyDetailPage from './pages/PropertyDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="sales" element={<AllSalesPage />} />
          <Route path="rentals" element={<AllRentalsPage />} />
          <Route path="sellers-package" element={<SellersPackagePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="magazine" element={<MagazinePage />} />
          <Route path="property/sale/:id" element={<PropertyDetailPage />} />
          <Route path="property/rental/:id" element={<PropertyDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
