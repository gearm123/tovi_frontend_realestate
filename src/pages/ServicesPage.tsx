import PageShell from '../components/PageShell'
import ExclusivePackageTeaser from '../components/services/ExclusivePackageTeaser'
import ServiceSectionBlock from '../components/services/ServiceSectionBlock'
import { useSiteContent } from '../hooks/useSiteContent'
import './ServicesPage.css'

export default function ServicesPage() {
  const { content } = useSiteContent()
  const { servicesPage, buyerServices, sellerServices } = content

  return (
    <>
      <PageShell
        title={servicesPage.title}
        accent={servicesPage.accent}
        subtitle={servicesPage.subtitle}
        seoKey="services"
      />
      <div className="services-page">
        {servicesPage.paragraphs.length > 0 && (
          <div className="services-page__intro">
            {servicesPage.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}

        <ServiceSectionBlock id="buyer-services" section={buyerServices} />
        <ServiceSectionBlock id="seller-services" section={sellerServices} />
        <ExclusivePackageTeaser />
      </div>
    </>
  )
}
