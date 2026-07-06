# ProperTLV — Launch Checklist

Track progress toward a production-ready brokerage site.  
Last updated: 6 July 2026.

---

## Priority 1 — Must have for launch

- [ ] **Real property listings** — Replace demo data in `src/data/properties.ts` with live inventory (photos, prices, addresses, exact coordinates, agents)
- [ ] **Sold / rented handling** — Hide or mark listings that are no longer available
- [x] **Working contact form** — WhatsApp + mailto on submit; Netlify Forms capture in background (`contactService.ts`, `ContactForm.tsx`)
- [ ] **Netlify form email notifications** — In Netlify dashboard: Site settings → Forms → add notification to `office@propertlv.com` (contact + newsletter)
- [x] **Agent routing on inquiries** — General → `office@propertlv.com`; listing contact → assigned agent email via URL params + mailto
- [ ] **Google Maps live on production** — Netlify env vars set (`VITE_MAP_PROVIDER`, `VITE_GOOGLE_MAPS_API_KEY`); API key referrers include live domain
- [ ] **Privacy policy** — Required for contact forms, newsletter, and Google Maps

---

## Priority 2 — Trust & credibility ✅

*Reviewed against [propertlv.com](https://propertlv.com/) — no further work needed for launch.*

- [x] **Google Business Reviews** — Live Maps link wired (`business.googleBusiness`); banner with logo, stars, and 5.0 · 38 reviews
- [x] **Real testimonials** — Six client quotes on site (`isPlaceholder: false`); old site had no dedicated testimonials page
- [x] **Brokerage / legal footer** — Contact details in footer match live site; no license/terms on current domain either — not required for launch
- [x] **Online booking** — Live site uses contact form + WhatsApp (no Calendly); new site routes booking CTA to `/contact`

---

## Priority 3 — Content & media

- [ ] **Magazine articles** — Replace 4 placeholder articles with real neighbourhood guides / market content
- [ ] **Hero video** — Wire `HeroVideo.tsx` to `public/videos/tel-aviv.mp4` or remove placeholder text
- [ ] **Property video tours** — Add real `videoUrl` per listing (YouTube, Vimeo, or `/videos/...`)
- [ ] **Rental services page/section** — Dedicated landlord/tenant content for Yana’s rentals (optional but recommended)

---

## Priority 4 — SEO & growth ✅

- [x] **Per-page meta titles & descriptions** — `PageSeo` + `pageSeoCatalog.ts` on all routes (incl. properties & articles)
- [x] **Open Graph / social preview** — og:title, description, image, url; Twitter card tags
- [x] **sitemap.xml** and **robots.txt** — Generated at build (`scripts/generate-sitemap.mjs`); `public/robots.txt`
- [x] **Structured data** — `RealEstateAgent` (global), `RealEstateListing` (properties), `Article` (magazine)
- [x] **Analytics placeholder** — `VITE_GA_MEASUREMENT_ID` in `.env.example`; GA4 loads when set (`googleAnalytics.ts`)

---

## Priority 5 — Operations & long-term

- [x] **Newsletter capture (Netlify Forms)** — Signups logged via Netlify; upgrade to Mailchimp/Brevo/CRM later if needed
- [ ] **Auto-forward listing inquiries to agent email** — Optional: Zapier or Netlify function so Netlify notifications go to assigned realtor, not only office
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
- [x] Per-listing agent assignment (`agentId` on every property)
- [x] Agent emails in `src/data/agents.ts` (Tova, Miri, Yana, Eden)
- [x] Contact routing: general → office email; listing → agent email; WhatsApp → office `058-6270099`
- [x] Netlify Forms wired (contact + newsletter) + `netlify.toml`
- [x] Google Maps integration (code + env config)
- [x] 2026 market articles (Olim + Israeli buyers)
- [x] WhatsApp floating button
- [x] Accessibility widget
- [x] Google Business Reviews banner + Maps link
- [x] Client testimonials section (6 quotes)
- [x] Trust & credibility (Priority 2 complete)
- [x] SEO: per-page meta, Open Graph, sitemap, robots.txt, Schema.org, GA placeholder

---

## Contact form — how it works (reference)

| Path | Email (mailto) | WhatsApp | Netlify log |
|------|----------------|----------|-------------|
| General `/contact` | `office@propertlv.com` | Office number | Yes → office inbox (once notifications set) |
| Listing `/contact?property=…&agent=…` | Assigned agent email | Office number (message includes agent + property) | Yes, with `agentEmail` field |
