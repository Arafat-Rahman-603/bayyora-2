# BAYYORA — CONTENT & CMS RENDERING AUDIT (`CONTENT-RENDERING-AUDIT.md`)

**Project:** Bayyora (بيّورا)  
**Scope:** All 27 Canonical Pages (54 Bilingual AR/EN Routes), 15 CMS Page Builder Blocks, Seed Data Completeness, and On-Demand Cache Revalidation  
**Date:** 2026-11-09

---

## 1. CMS Page Builder Blocks Coverage (`src/blocks/RenderBlocks.tsx`)

All **15 CMS Page Builder blocks** defined in `src/blocks/pageBlocks.ts` are now implemented and rendered in `src/blocks/RenderBlocks.tsx`:

| # | Block Slug (`blockType`) | Rendering Status | Key Features & Governance Guards |
| :---: | :--- | :--- | :--- |
| 1 | `hero` | **IMPLEMENTED** | Supports `split_maps_compare` (with interactive `<HeroComparisonCard />`) and `centered_editorial`; honours `primaryCtaUrl` and `secondaryCtaUrl`. |
| 2 | `serviceCards` | **IMPLEMENTED** | Supports `pain_strip_4col` and `grid_3col_compact`; filters by `selectedServices` when configured in CMS. |
| 3 | `packageComparison` | **IMPLEMENTED** | Renders Monthly Retainers (`Bidaya`, `Numow`, `Riyada`) and conditionally renders One-Time Starter Bundles (`Look`, `Go Online`) when `showStarterBundles: true`. |
| 4 | `beforeAndAfter` | **IMPLEMENTED** | Renders section `<h2>` header (`eyebrow`, `heading`, `subheading`) + interactive `<BeforeAfterSlider />` with keyboard/drag slider and 25%/50%/85% presets. |
| 5 | `processSteps` | **IMPLEMENTED** | Renders 4-step numbered onboarding flow (`01`–`04`) in responsive 4-column grid. |
| 6 | `seasonalBanner` | **IMPLEMENTED** | Renders interactive 5-season tabs (`Ramadan`, `Eid`, `Founding Day`, `National Day`, `White Friday & Back to School`) with `DEFAULT_SEASON_DATA` fallback. |
| 7 | `faqSection` | **IMPLEMENTED** | Filters by `selectedFaqs` when configured; optionally renders category filter pills and `FAQPage` JSON-LD. |
| 8 | `portfolioGrid` | **IMPLEMENTED** | Renders section `<h2>` header + `<PortfolioFilterGrid />` with all 9 service filters and 5 business type filters + optional CTA button. |
| 9 | `textAndImage` | **IMPLEMENTED** | Renders "Why Bayyora" 5-bullet list (`bullets` + optional `body` text) alongside the dark navy Rising Line feature card. |
| 10 | `ctaSection` | **IMPLEMENTED** | Renders dark navy conversion banner with `<RisingLineSvg />`, WhatsApp CTA, and Free Audit CTA. |
| 11 | `statistics` | **IMPLEMENTED** | Strictly enforces `BR-009`: only renders metric items where `item.approvedByOwner === true`. |
| 12 | `testimonial` | **IMPLEMENTED** | Strictly enforces `BR-009` / `BR-010`: only renders quotes where `block.clientPermissionVerified === true`. |
| 13 | `clientLogos` | **IMPLEMENTED** | Strictly enforces `BR-010`: only renders logos where `logo.clientPermissionVerified === true`. |
| 14 | `imageGallery` | **IMPLEMENTED** | Renders responsive 3-column showcase grid with optional captions and `"Sample concept"` / `"نموذج توضيحي"` badges (`BR-011`). |
| 15 | `contactSection` | **IMPLEMENTED** | Renders embedded `<ContactForm />` or `<FreeAuditForm />` with section header. |

---

## 2. Page-by-Page Content Blueprint Verification

| Page / Template | Arabic Route | English Route | Blueprint Completeness Verification |
| :--- | :--- | :--- | :--- |
| **Homepage** | `/` | `/en` | **COMPLETE (9 Sections):** (1) Split Hero + `<HeroComparisonCard />`, (2) 4-Card Pain Strip, (3) 9 Services Grid, (4) Interactive `<BeforeAfterSlider />`, (5) 4-Step Process, (6) 3 Monthly Packages (`Bidaya`, `Numow`, `Riyada`), (7) Why Bayyora (5 bullets + Navy card), (8) 5-Tab `<SeasonalCampaignTabs />`, (9) Quick FAQ (5 items) + Footer CTA Band. |
| **Services Hub** | `/services` | `/en/services` | **COMPLETE:** Hero banner, all 9 services in 3-col grid with deliverables & CTAs, plus bottom "Single Service vs. Monthly Package" conversion CTA section. |
| **9 Service Detail Pages** | `/services/[slug]` | `/en/services/[slug]` | **COMPLETE (8 Sections):** Breadcrumbs, Service Hero, Problem Box + Deliverables Box (with `/packages` link in `packageInclusionNote`), 3-Step Process, category-matched `<BeforeAfterSlider />`, 2 Service FAQs, Cross-Navigation to other 8 services, and Bottom Service Conversion CTA. |
| **Packages** | `/packages` | `/en/packages` | **COMPLETE:** Hero banner, Founding Client Offer banner (`siteSettings.foundingClientOffer`), 3 Monthly Packages (`Bidaya`, `Numow`, `Riyada`), 2 One-Time Starter Bundles (`Look`, `Go Online`), Single Services À La Carte callout, Ad Spend Separation & 15% VAT Clarity card (`BR-012`), 3-Step Quote Onboarding section, and Package & Billing FAQs. |
| **Our Work** | `/our-work` | `/en/our-work` | **COMPLETE:** Hero banner, Interactive `<BeforeAfterSlider />`, `<PortfolioFilterGrid />` (9 Service filters × 5 Business Type filters, 5 Sample Concept cards with visible `"Sample concept"` / `"نموذج توضيحي"` badges), and the truthful Dawair "Coming Soon (With Client Permission)" teaser card (`BR-010`). |
| **Dawair Case Study Gate** | `/our-work/dawair` | `/en/our-work/dawair` | **VERIFIED 404 GATE (`BR-010`):** Seeded as `_status: 'draft'`, `clientPermissionVerified: false`, `businessType: 'restaurant'`, `cityTag: 'Hofuf — Al Ahsa'`. Public requests return HTTP 404. |
| **About Bayyora** | `/about` | `/en/about` | **COMPLETE:** Hero banner, Why We Built Bayyora narrative, `بيّورا` (`بيّن`) & Rising Line (`خطوة لفوق`) brand meaning callout, 4 core value cards, and Eastern Province Cities We Serve card with Free Audit & Book Visit CTAs. |
| **Free Mini Audit** | `/free-audit` | `/en/free-audit` | **COMPLETE:** Hero banner, all **6 Audit Checkpoints** (Google Maps, Instagram, Snapchat, TikTok, Website/Digital Menu, 3 Local Competitors Benchmark), **3 Optional Free Sample Gifts** callout (`BR-008`), and 6-field `<FreeAuditForm />` with Saudi phone normalization (`٠٥...` / `05...` -> `+9665...`) and PDPL consent. |
| **Contact & Visit Booking** | `/contact` | `/en/contact` | **COMPLETE:** Hero banner, Direct Contact Channels (WhatsApp CTA, `phoneNumber` [`dir="ltr"`], `businessEmail` [`dir="ltr"`], `workingHours`, `serviceAreasSummary`), On-Site Shop Visit Booking card, and `<ContactForm />`. |
| **5 City Landing Pages** | `/city/[slug]` | `/en/city/[slug]` | **COMPLETE (`al-ahsa`, `hofuf`, `mubarraz`, `dammam`, `khobar`):** City Hero, Authentic Local Market Intro, Merchant Challenges Solved, Commercial Corridors Served, On-Site Visit Card, All 9 Services Grid, Sample Concepts Showcase (`<PortfolioFilterGrid />`), Other Eastern Province Cities cross-links, and `Service` + `GeoCoordinates` JSON-LD. |
| **FAQ Page** | `/faq` | `/en/faq` | **COMPLETE:** Hero banner, 12 bilingual FAQs across 4 categories (`pricing_packages`, `work_timing`, `accounts_payment`, `service_specific`), category filter pills, and `FAQPage` JSON-LD. |
| **Blog Index & 3 Posts** | `/blog`, `/blog/[slug]` | `/en/blog`, `/en/blog/[slug]` | **COMPLETE:** Blog index with category badges & `4 min read` badges; 3 full bilingual articles (`google-maps-for-shops-ahsa`, `restaurant-menu-and-food-photography-guide`, `ramadan-campaign-checklist-saudi-shops`) with Key Takeaways box, Related Articles section, Conversion CTA, and `Article` JSON-LD. |
| **3 Legal Pages** | `/privacy`, `/terms`, `/refunds` | `/en/privacy`, `/en/terms`, `/en/refunds` | **COMPLETE:** Full Saudi PDPL privacy policy, 100% client ownership & ad spend terms, and flexible month-to-month refund policy. |

---

## 3. Cache Revalidation & Draft Mode Audit (`CACHE-001`, `CACHE-002`)

1. **Tag Alignment (`src/hooks/revalidate.ts` <-> `src/lib/payload-queries.ts`):**
   - `revalidate.ts` now invalidates both `:ar` and `:en` tags (`page:${slug}:ar`, `page:${slug}:en`, `${collectionSlug}:${slug}:ar`, `${collectionSlug}:${slug}:en`, `${collectionSlug}:ar`, `${collectionSlug}:en`) and parent hub paths (`/services`, `/en/services`, `/our-work`, `/en/our-work`, `/blog`, `/en/blog`, `/faq`, `/en/faq`).
2. **Draft Preview Support (`src/lib/payload-queries.ts`):**
   - `getPageBySlug`, `getServiceBySlug`, `getCityBySlug`, `getPostBySlug`, and `getCaseStudyProjectBySlug` now omit `_status: { equals: 'published' }` when Next.js `draftMode().isEnabled` is `true`, enabling Payload Live Preview for unpublished drafts while keeping `unstable_cache` strictly for published public requests.

