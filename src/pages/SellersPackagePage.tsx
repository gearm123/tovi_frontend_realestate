import { Navigate } from 'react-router-dom'

/** Legacy route — redirects to Exclusivity Package section on Services page */
export default function SellersPackagePage() {
  return <Navigate to="/services#exclusivity-package" replace />
}
