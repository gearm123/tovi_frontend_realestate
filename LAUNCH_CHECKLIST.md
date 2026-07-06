# ProperTLV — Launch Checklist

Track progress toward a production-ready brokerage site.  
Last updated: July 2026.

---

## Priority 1 — Must have for launch

- [ ] **Real property listings** — Replace demo data in `src/data/properties.ts` with live inventory (photos, prices, addresses, exact coordinates, agents)
- [ ] **Sold / rented handling** — Hide or mark listings that are no longer available
- [ ] **Working contact form** — Submissions reach agent/office inboxes (Netlify Forms, Formspree, email API, or CRM)
- [ ] **Agent routing on inquiries** — Property-specific contact routes to the assigned agent email
- [ ] **Google Maps live on production** — Netlify env vars set; API key referrers include live domain
- [ ] **Privacy policy** — Required for contact forms, newsletter, and Google Maps

---

## Priority 2 — Trust & credibility

- [ ] **Google Business Reviews** — Replace placeholder URL; show reviews button on site
- [ ] **Real testimonials** — Remove “Sample” labels when client approves quotes
- [ ] **Brokerage / legal footer** — License info, terms, accessibility statement as needed
- [ ] **Online booking** — Connect real Calendly (or similar); update `PLACEHOLDER_BOOKING_URL` in `src/data/placeholders.ts`

---

## Priority 3 — Content & media

- [ ] **Magazine articles** — Replace 4 placeholder articles with real neighbourhood guides / market content
- [ ] **Hero video** — Wire `HeroVideo.tsx` to `public/videos/tel-aviv.mp4` or remove placeholder text
- [ ] **Property video tours** — Add real `videoUrl` per listing (YouTube, Vimeo, or `/videos/...`)
- [ ] **Rental services page/section** — Dedicated landlord/tenant content for Yana’s rentals (optional but recommended)

---

## Priority 4 — SEO & growth

- [ ] **Per-page meta titles & descriptions** — Properties, articles, services (not just global `index.html`)
- [ ] **Open Graph / social preview** — Image + title when links are shared on WhatsApp, Facebook, etc.
- [ ] **sitemap.xml** and **robots.txt**
- [ ] **Structured data** — LocalBusiness, RealEstateListing (Schema.org)
- [ ] **Analytics** — GA4, Plausible, or similar

---

## Priority 5 — Operations & long-term

- [ ] **Newsletter integration** — Mailchimp, Brevo, or CRM (`src/services/newsletterService.ts`)
- [ ] **CRM / MLS sync** — Single source of truth for listings instead of manual `properties.ts` edits
- [ ] **CMS or admin** — If client will update content without developer deploys
- [ ] **French / Russian content** — UI exists; body copy still mostly EN/HE
- [ ] **404 page** and form confirmation emails
- [ ] **API key & secrets hygiene** — Restrict Google Maps key; rotate if exposed

---

## Quick reference — what’s done

- [x] Bilingual EN/HE site structure
- [x] Sellers Exclusive Package (PDF brochure content)
- [x] Services vs exclusive package split
- [x] Per-listing agent assignment + contact routing (UI)
- [x] Google Maps integration (code + env config)
- [x] 2026 market articles (Olim + Israeli buyers)
- [x] WhatsApp floating button
- [x] Accessibility widget
- [x] Magazine, search, sales/rentals filters
