import ServiceSectionBlock from './ServiceSectionBlock'
import TeamSection from './TeamSection'
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
