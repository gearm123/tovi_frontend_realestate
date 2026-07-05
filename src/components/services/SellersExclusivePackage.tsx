import ServiceSectionBlock from './ServiceSectionBlock'
import TeamSection from './TeamSection'
import PackageShowcaseGallery from './PackageShowcaseGallery'
import SalesPackageClosing from './SalesPackageClosing'
import ReviewsSection from '../trust/ReviewsSection'
import { useSiteContent } from '../../hooks/useSiteContent'
import './SellersExclusivePackage.css'

export default function SellersExclusivePackage() {
  const { content } = useSiteContent()
  const { exclusivityPackage, salesTeam, salesPackageClosing } = content

  return (
    <div className="sellers-exclusive-package">
      <ServiceSectionBlock
        id="exclusivity-package"
        section={exclusivityPackage}
        variant="premium"
      />

      {exclusivityPackage.showcaseImages && (
        <PackageShowcaseGallery images={exclusivityPackage.showcaseImages} />
      )}

      <TeamSection id="exclusivity-package-team" section={salesTeam} variant="premium" />

      <ReviewsSection
        id="exclusivity-package-reviews"
        variant="embedded"
        showGoogleButton={false}
      />

      <SalesPackageClosing section={salesPackageClosing} />
    </div>
  )
}
