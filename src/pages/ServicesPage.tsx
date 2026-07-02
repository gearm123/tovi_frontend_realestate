import PageShell from '../components/PageShell'
import ServiceSectionBlock from '../components/services/ServiceSectionBlock'
import { useSiteContent } from '../hooks/useSiteContent'
import './ServicesPage.css'

export default function ServicesPage() {
  const { content } = useSiteContent()
  const { servicesPage, exclusivityPackage, buyerServices, sellerServices } = content

  return (
    <>
      <PageShell
        title={servicesPage.title}
        accent={servicesPage.accent}
        subtitle={servicesPage.subtitle}
      />
      <div className="services-page">
        <ServiceSectionBlock
          id="exclusivity-package"
          section={exclusivityPackage}
          variant="premium"
        />
        <ServiceSectionBlock id="buyer-services" section={buyerServices} />
        <ServiceSectionBlock id="seller-services" section={sellerServices} />
      </div>
    </>
  )
}
