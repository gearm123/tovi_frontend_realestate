from datetime import date
from pathlib import Path

from fpdf import FPDF

OUT = Path(__file__).resolve().parent.parent / "docs" / "ProperTLV-Client-Requirements-Checklist.pdf"


class PDF(FPDF):
    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")

    def write_block(self, text: str, size: int = 10, style: str = "", color=(40, 40, 40)):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", style, size)
        self.set_text_color(*color)
        self.multi_cell(self.epw, 5, text)
        self.ln(1)

    def section_title(self, title: str):
        self.ln(2)
        self.write_block(title, size=13, style="B", color=(240, 90, 36))

    def subsection(self, title: str):
        self.write_block(title, size=11, style="B", color=(30, 30, 30))

    def body(self, text: str):
        self.write_block(text)

    def bullet(self, text: str):
        self.write_block(f"- {text}")

    def field(self, label: str):
        self.write_block(label, style="B")
        y = self.get_y() + 1
        self.set_draw_color(200, 200, 200)
        self.line(self.l_margin, y, self.w - self.r_margin, y)
        self.ln(6)

    def priority_box(self, text: str):
        self.set_x(self.l_margin)
        self.set_font("Helvetica", "B", 9)
        self.set_fill_color(255, 244, 238)
        self.set_text_color(180, 70, 20)
        self.multi_cell(self.epw, 6, text, fill=True)
        self.ln(2)


def main() -> None:
    OUT.parent.mkdir(exist_ok=True)

    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_margins(15, 15, 15)
    pdf.add_page()

    pdf.write_block("ProperTLV Website", size=22, style="B", color=(20, 20, 20))
    pdf.write_block("Information and Services Checklist", size=14)
    pdf.write_block(f"Generated: {date.today():%B %d, %Y}", color=(80, 80, 80))
    pdf.write_block("Project: tovi_frontend_realestate (PropertyTLV)", color=(80, 80, 80))
    pdf.write_block(
        "Purpose: Everything the company must provide to replace placeholder/demo content "
        "and make the website fully functional with real information.",
        color=(80, 80, 80),
    )
    pdf.priority_box(
        "How to use: Fill in each blank field. CRITICAL items block a real public launch. "
        "HIGH items affect credibility and conversions."
    )

    pdf.section_title("Executive Summary")
    pdf.body(
        "The website UI is largely complete in English and Hebrew. Most business data, media, "
        "forms, maps, listings, reviews, and integrations are still placeholder or demo content."
    )
    pdf.body("Already real / working today:")
    for item in [
        "Business name: ProperTLV",
        "Contact person shown: Tovi",
        "Phone: 058-6270099 / +972586270099",
        "WhatsApp floating button",
        "Bilingual site (English + Hebrew) with RTL support",
    ]:
        pdf.bullet(item)

    pdf.body("Still placeholder or missing:")
    for item in [
        "Email, office address, social media links",
        "Google Business Profile / Google Reviews link",
        "Online booking link (Calendly or similar)",
        "All 10 property listings (demo data)",
        "Contact form backend (shows success but sends nothing)",
        "Newsletter signup backend",
        "Live map (Google Maps or Mapbox)",
        "Hero animation/video",
        "Most marketing copy, testimonials, and magazine articles",
        "Many image assets referenced by the site",
    ]:
        pdf.bullet(item)

    pdf.add_page()
    pdf.section_title("1. Business Contact Details")
    pdf.priority_box("Priority: CRITICAL")
    pdf.subsection("1.1 Contact information")
    for label in [
        "Official business email:",
        "Office address (street, building, floor):",
        "City / postal code:",
        "Business hours (EN):",
        "Business hours (HE):",
        "Confirm phone is correct (currently 058-6270099):",
        "Confirm contact person name (currently Tovi):",
    ]:
        pdf.field(label)
    pdf.body("Used in: Footer, Contact page, WhatsApp button.")
    pdf.body("Developer files: src/data/placeholders.ts, src/data/business.ts")

    pdf.subsection("1.2 Social media accounts")
    for label in [
        "Instagram profile URL:",
        "Facebook page URL:",
        "LinkedIn (optional, not on site yet):",
        "YouTube channel (optional):",
    ]:
        pdf.field(label)

    pdf.add_page()
    pdf.section_title("2. Google Business and Reviews")
    pdf.priority_box("Priority: HIGH")
    for label in [
        "Google Business Profile name:",
        "Google Maps place URL:",
        "Google review link (g.page/.../review):",
        "Google Business account owner email:",
    ]:
        pdf.field(label)
    pdf.body("Company steps:")
    for item in [
        "Create or claim ProperTLV on business.google.com",
        "Verify the business",
        "Add logo, cover photo, address, hours, phone, website URL",
        "Provide the public review link to the developer",
    ]:
        pdf.bullet(item)
    pdf.body("Developer file: PLACEHOLDER_GOOGLE_REVIEWS_URL in src/data/placeholders.ts")

    pdf.section_title("3. Online Booking / Scheduling")
    pdf.priority_box("Priority: HIGH")
    for label in [
        "Preferred booking tool (Calendly / Cal.com / other):",
        "Booking URL for consultations:",
        "Booking label (EN):",
        "Booking label (HE):",
    ]:
        pdf.field(label)
    pdf.body("Current placeholder: https://calendly.com/placeholder-propertlv/consultation")

    pdf.add_page()
    pdf.section_title("4. Property Listings (Real Inventory)")
    pdf.priority_box("Priority: CRITICAL")
    pdf.body(
        "The site currently shows 10 demo listings in src/data/properties.ts with fake titles, "
        "prices, descriptions, and approximate map coordinates."
    )
    for label in [
        "How will listings be managed? (Manual / CRM / MLS / Custom API):",
        "CRM or MLS system name (if applicable):",
        "API documentation contact / login:",
    ]:
        pdf.field(label)
    pdf.subsection("For each property listing, provide:")
    for item in [
        "Listing ID / reference number",
        "Sale or rental",
        "Property type and neighborhood",
        "Full street address and exact lat/lng if possible",
        "Price, size (sqm), rooms, bedrooms, bathrooms",
        "Features: floor, elevator, parking, balcony, etc.",
        "English and Hebrew title and description",
        "Availability status",
        "3-8 high-quality photos per listing",
        "Optional video tour URL",
    ]:
        pdf.bullet(item)

    pdf.add_page()
    pdf.section_title("5. Brand Assets and Images")
    pdf.priority_box("Priority: CRITICAL")
    pdf.subsection("5.1 Logos (PNG with real transparency)")
    for item in [
        "Main header logo (logo_shine_new_content.png)",
        "Secondary About-section logo (logo_pat_content.png)",
        "Favicon / app icon",
    ]:
        pdf.bullet(item)
    pdf.subsection("5.2 Homepage hero")
    pdf.field("Hero type (photo / video / animation):")
    pdf.field("Hero file delivery method:")
    pdf.body('Current state: Hero shows placeholder text "here will be your animation".')
    pdf.subsection("5.3 Property and magazine images")
    pdf.body("Provide photos for each listing and hero images for 4 magazine articles.")

    pdf.add_page()
    pdf.section_title("6. Third-Party Integrations and API Keys")
    pdf.priority_box("Priority: CRITICAL for maps, forms, newsletter")
    pdf.subsection("6.1 Google Maps (recommended)")
    for label in [
        "Decision: Google Maps or Mapbox?",
        "Google Cloud billing account owner:",
        "Google Maps API key:",
    ]:
        pdf.field(label)
    pdf.body(
        "Company steps: Create Google Cloud project, enable Maps JavaScript API, "
        "create restricted API key, enable billing."
    )
    pdf.body("Deploy env vars: VITE_MAP_PROVIDER=google, VITE_GOOGLE_MAPS_API_KEY=<key>")

    pdf.subsection("6.2 Mapbox (alternative)")
    pdf.field("Mapbox account email:")
    pdf.field("Mapbox access token:")
    pdf.body("Deploy env vars: VITE_MAP_PROVIDER=mapbox, VITE_MAPBOX_ACCESS_TOKEN=<token>")

    pdf.subsection("6.3 Contact form delivery")
    for label in [
        "Preferred method (Email / CRM / Formspree / custom backend):",
        "Destination email address(es):",
        "CRM webhook URL (if applicable):",
    ]:
        pdf.field(label)
    pdf.body("Current state: ContactForm.tsx shows success but sends no data.")

    pdf.subsection("6.4 Newsletter signup")
    pdf.field("Newsletter provider (Mailchimp / Brevo / other):")
    pdf.field("API key / list ID / account login:")
    pdf.body("Current state: newsletterService.ts uses placeholder provider only.")

    pdf.add_page()
    pdf.section_title("7. Marketing and Written Content")
    pdf.priority_box("Priority: HIGH")
    pdf.body("Approve final copy in English and Hebrew for:")
    for item in [
        "About ProperTLV",
        "Exclusivity / seller package",
        "Buyer services",
        "Seller services",
        "Magazine intro and 4 articles",
        "Hero tagline and animation text",
    ]:
        pdf.bullet(item)
    pdf.field("Legal company name for footer/contracts:")
    pdf.field("Tagline (EN):")
    pdf.field("Tagline (HE):")

    pdf.section_title("8. Testimonials and Reviews")
    pdf.priority_box("Priority: HIGH")
    pdf.body("Site shows 4 sample testimonials tagged Sample. For each real testimonial provide:")
    for item in [
        "Client name or Anonymous",
        "Quote in EN and HE",
        "Transaction type",
        "Date (month/year)",
        "Written permission to publish",
    ]:
        pdf.bullet(item)
    pdf.field("Number of real testimonials to publish at launch:")

    pdf.add_page()
    pdf.section_title("9. Legal, SEO, and Analytics")
    pdf.priority_box("Priority: MEDIUM")
    for label in [
        "Privacy policy text or link:",
        "Terms of use text or link:",
        "Cookie policy required? (Yes/No):",
        "Production website URL:",
        "Meta description (EN):",
        "Meta description (HE):",
        "Open Graph share image (1200x630):",
        "Google Analytics 4 ID (G-XXXX):",
        "Google Tag Manager ID (optional):",
    ]:
        pdf.field(label)
    pdf.body(
        "Not yet implemented: Open Graph tags, sitemap.xml, robots.txt, JSON-LD structured data."
    )

    pdf.section_title("10. Launch Readiness Checklist")
    checks = [
        "Real email and office address entered",
        "Social media links live and tested",
        "Google Business Profile verified and review link connected",
        "Booking/scheduling link connected",
        "At least 3-5 real property listings with photos uploaded",
        "Contact form sends to real inbox or CRM",
        "Newsletter connected to email marketing tool",
        "Live map working with API key on production domain",
        "Hero video/animation replaced or placeholder text removed",
        "All Sample / placeholder tags removed from UI",
        "Marketing copy approved in EN and HE",
        "Real testimonials approved for publication",
        "Magazine articles replaced with final content",
        "Favicon and social share image updated",
        "Privacy policy published",
        "Analytics installed and tested",
        "Full mobile and desktop QA on production URL",
    ]
    for item in checks:
        pdf.bullet(f"[ ] {item}")

    pdf.ln(2)
    pdf.subsection("Developer handoff files")
    for path in [
        "src/data/placeholders.ts",
        "src/data/business.ts",
        "src/data/properties.ts",
        "src/data/content/en.ts and he.ts",
        "src/data/magazine/en.ts and he.ts",
        "src/constants/mapConfig.ts",
        "src/components/ContactForm.tsx",
        "src/services/newsletterService.ts",
        "src/services/bookingService.ts",
    ]:
        pdf.bullet(path)

    pdf.output(str(OUT))
    print(f"Created {OUT}")
    print(f"Size: {OUT.stat().st_size} bytes")


if __name__ == "__main__":
    main()
