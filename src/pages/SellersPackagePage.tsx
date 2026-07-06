import PageShell from '../components/PageShell'
import SellersExclusivePackage from '../components/services/SellersExclusivePackage'
import { useSiteContent } from '../hooks/useSiteContent'
import './SellersPackagePage.css'

export default function SellersPackagePage() {
  const { content } = useSiteContent()
  const { exclusivityPackage } = content

  return (
    <>
      <PageShell
        title={exclusivityPackage.title}
        accent={exclusivityPackage.accent}
        subtitle={exclusivityPackage.subtitle}
        seoKey="sellersPackage"
      />
      <div className="sellers-package-page">
        <SellersExclusivePackage />
      </div>
    </>
  )
}
