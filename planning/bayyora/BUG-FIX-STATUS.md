# BAYYORA — WEBSITE STABILIZATION & UI/UX REPAIR SPRINT STATUS (`BUG-FIX-STATUS.md`)

**Project:** Bayyora (بيّورا) — خطوة لفوق / One step up  
**Sprint Mode:** Implementation-Authorized Stabilization & UI/UX Repair Sprint  
**Status:** **COMPLETED & VERIFIED**  
**Last Updated:** 2026-11-09

---

## 1. Executive Summary

All reported animation, layout, responsive, RTL/LTR, content completeness, CMS integration, accessibility, and SEO regressions across the Bayyora Next.js 15 + Payload CMS 3.x platform have been diagnosed, remediated in source code and seed data, and verified across all **27 canonical pages (54 bilingual AR/EN routes)**.

| Track | Scope | Issues Found | Issues Resolved | Verification Status |
| :--- | :--- | :---: | :---: | :--- |
| **Track 1: Animation System & Motion** | `AnimatedSection.tsx`, `globals.css`, `tailwind.config.ts`, `Header.tsx`, `HeroComparisonCard.tsx`, `SeasonalCampaignTabs.tsx`, `FaqAccordion.tsx`, `PortfolioFilterGrid.tsx`, `RenderBlocks.tsx` | 7 | **7 / 7** | **PASS** (Zero flash, zero overlap, zero hover lock, 60fps scroll, reduced-motion compliant) |
| **Track 2: Content, CMS & Localization** | `RenderBlocks.tsx`, `[slug]/page.tsx`, `services/[slug]/page.tsx`, `city/[slug]/page.tsx`, `blog/**`, `not-found.tsx`, `src/seed/**`, `revalidate.ts`, `payload-queries.ts` | 17 | **17 / 17** | **PASS** (All 15 CMS blocks wired, all 54 bilingual routes complete, zero cross-locale leakage) |
| **Track 3: UI/UX, Responsive, RTL/LTR, A11y & SEO** | `PackageCardGrid.tsx`, `globals.css`, `Header.tsx`, `Footer.tsx`, `ContactForm.tsx`, `FreeAuditForm.tsx`, `BeforeAfterSlider.tsx`, `our-work/[slug]/page.tsx`, `metadata.ts`, `json-ld.tsx` | 16 | **16 / 16** | **PASS** (Zero card width collapse, solid sticky navbar, WCAG 2.2 AA contrast `5.22:1`, full ARIA/focus trap) |
| **TOTAL** | **Full-Stack Application** | **40** | **40 / 40** | **100% RESOLVED** |

---

## 2. Master Issue Resolution Ledger

| Issue ID | Severity | Category | Summary of Root Cause | Files Modified | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ANIM-001` | **CRITICAL** | Animation / Rendering | `AnimatedReveal` & `AnimatedStaggerGrid` toggled `inView` from `true` to `false` after mount while `.animate-reveal-up` used `0% { opacity: 0 }` and `animation-fill-mode: both`, causing visible content to flash invisible on scroll. | `src/components/ui/AnimatedSection.tsx`, `src/app/(frontend)/globals.css` | **FIXED** |
| `ANIM-002` | **HIGH** | Animation Stacking | `RenderBlocks.tsx` wrapped `<AnimatedStaggerGrid>`, `<SeasonalCampaignTabs>`, `<FaqAccordion>`, and `<PortfolioFilterGrid>` inside parent `<AnimatedReveal>`, while child panels also fired `.animate-reveal-scale` on initial mount. | `src/blocks/RenderBlocks.tsx`, `src/components/domain/SeasonalCampaignTabs.tsx`, `src/components/domain/FaqAccordion.tsx`, `src/components/domain/PortfolioFilterGrid.tsx` | **FIXED** |
| `ANIM-003` | **HIGH** | CSS Transform Conflict | Permanent `.animate-reveal-up` (`animation-fill-mode: both`) on `.card-interactive` elements locked `transform: translate3d(0,0,0)` in the CSS cascade, overriding `:hover` lift transforms. | `src/components/ui/AnimatedSection.tsx`, `src/components/domain/HeroComparisonCard.tsx`, `src/components/domain/PortfolioFilterGrid.tsx` | **FIXED** |
| `ANIM-004` | **HIGH** | Scroll Performance | `Header.tsx` called `setScrollProgress(pct)` on every scroll event, re-rendering the entire navigation tree 60 times/sec during scroll. | `src/components/layout/Header.tsx` | **FIXED** |
| `ANIM-005` | **MEDIUM** | Background Timer | `HeroComparisonCard.tsx` ran its `2800ms` `setInterval` continuously even when scrolled out of the viewport or when the browser tab was hidden. | `src/components/domain/HeroComparisonCard.tsx` | **FIXED** |
| `ANIM-006` | **LOW** | GPU Memory | `.card-interactive` applied `will-change: transform` permanently across dozens of cards simultaneously, and motion durations were hardcoded instead of tokenized. | `src/app/(frontend)/globals.css`, `tailwind.config.ts` | **FIXED** |
| `ANIM-007` | **MEDIUM** | RSC Serialization | `AnimatedStaggerGrid` used `React.Children.map` + `React.cloneElement` to inject `delay` into Server Component children. | `src/components/ui/AnimatedSection.tsx`, `src/app/(frontend)/globals.css` | **FIXED** |
| `UI-001` | **CRITICAL** | Layout / Responsive | `.cq-card` applied `container: card / inline-size` inside a flex parent (`<AnimatedStaggerItem className="flex min-w-0">`), collapsing the 2-column Starter Bundle cards into narrow strips; `shadow-xs` / `shadow-2xs` / `backdrop-blur-xs` were missing in Tailwind v3.4 config. | `src/app/(frontend)/globals.css`, `src/components/domain/PackageCardGrid.tsx`, `tailwind.config.ts` | **FIXED** |
| `UI-002` | **HIGH** | Sticky Header / Overlap | `.sticky-header-container` used `container-type: scroll-state` and `backdrop-filter: blur(12px)` semi-transparent background, causing dark navy sections to bleed through the header; `FloatingWhatsApp` overlapped footer legal links on mobile. | `src/app/(frontend)/globals.css`, `src/components/layout/Footer.tsx` | **FIXED** |
| `UI-003` | **MEDIUM** | Navigation UX | Mobile drawer duplicated `/faq` and `/blog` links when already present in CMS `navItems`. | `src/components/layout/Header.tsx` | **FIXED** |
| `UI-004` | **MEDIUM** | Component Fallback | `SeasonalCampaignTabs` rendered an empty state if `seasons` was passed as `[]` instead of falling back to `DEFAULT_SEASON_DATA`. | `src/components/domain/SeasonalCampaignTabs.tsx` | **FIXED** |
| `UI-005` | **LOW** | Theme Preset Wiring | `themeSettings.borderRadiusPreset` was not wired in `layout.tsx`, and `siteSettings.foundingClientOffer` was not rendered on `/packages`. | `src/app/(frontend)/[locale]/layout.tsx`, `src/app/(frontend)/[locale]/[slug]/page.tsx` | **FIXED** |
| `RTL-001` | **MEDIUM** | RTL Directionality | `our-work/[slug]/page.tsx` used left arrow `←` in Arabic (`← العودة إلى معرض الأعمال`) instead of right arrow `→`. | `src/app/(frontend)/[locale]/our-work/[slug]/page.tsx` | **FIXED** |
| `RTL-002` | **MEDIUM** | Bidirectional Text | Footer CR, VAT, SBC ID, and email lacked explicit `dir="ltr"` isolation, and `saudiBusinessCenterUrl` was not linked. | `src/components/layout/Footer.tsx` | **FIXED** |
| `RTL-003` | **MEDIUM** | Mixed Script Placeholder | Arabic `auditFormUi.linkPlaceholder` mixed `@shopname` and English `Google Maps` inside an RTL input. | `src/seed/data-pages-globals.ts`, `src/components/forms/FreeAuditForm.tsx` | **FIXED** |
| `RTL-004` | **LOW** | 404 RTL Direction | `not-found.tsx` rendered `<RisingLineSvg />` without locale `dir` prop. | `src/app/(frontend)/[locale]/not-found.tsx` | **FIXED** |
| `A11Y-001` | **HIGH** | WCAG 2.2 AA Contrast | `--color-whatsapp: #128c7e` had `4.21:1` contrast with white text (below 4.5:1 AA minimum). Updated to `#0E7A6D` (`5.22:1`). | `src/app/(frontend)/globals.css`, `tailwind.config.ts` | **FIXED** |
| `A11Y-002` | **MEDIUM** | Heading Hierarchy | `/faq` skipped `<h2>` between `<h1>` and `<h3>` when category filter was active; `beforeAndAfter` and `portfolioGrid` blocks lacked section `<h2>` headings. | `src/app/(frontend)/[locale]/[slug]/page.tsx`, `src/blocks/RenderBlocks.tsx` | **FIXED** |
| `A11Y-003` | **MEDIUM** | ARIA Semantics | Desktop Services dropdown used `role="menu"` / `role="menuitem"` without arrow-key menu management and lacked `aria-controls`. | `src/components/layout/Header.tsx` | **FIXED** |
| `A11Y-004` | **MEDIUM** | Form Accessibility | `ContactForm` & `FreeAuditForm` did not render `fieldErrors.shopName` or `fieldErrors.pdplConsent` and lacked `aria-describedby`. | `src/components/forms/ContactForm.tsx`, `src/components/forms/FreeAuditForm.tsx` | **FIXED** |
| `A11Y-005` | **MEDIUM** | Modal Focus Trap | Mobile navigation drawer (`role="dialog" aria-modal="true"`) lacked a keyboard `Tab` / `Shift+Tab` focus trap. | `src/components/layout/Header.tsx` | **FIXED** |
| `A11Y-006` | **LOW** | Keyboard / Touch Target | `HeroComparisonCard` rows lacked keyboard focus/activation and Pause button height was `< 36px`; `BeforeAfterSlider` preset buttons lacked `aria-pressed`. | `src/components/domain/HeroComparisonCard.tsx`, `src/components/domain/BeforeAfterSlider.tsx` | **FIXED** |
| `SEO-001` | **MEDIUM** | OpenGraph Metadata | `buildPageMetadata` in `src/seo/metadata.ts` ignored CMS `seo.ogImage` when building `openGraph.images` and `twitter.images`. | `src/seo/metadata.ts` | **FIXED** |
| `SEO-002` | **LOW** | Structured Data | `our-work/[slug]/page.tsx` lacked `BreadcrumbList` JSON-LD; `city/[slug]/page.tsx` lacked city-specific `Service` + `GeoCoordinates` JSON-LD. | `src/app/(frontend)/[locale]/our-work/[slug]/page.tsx`, `src/app/(frontend)/[locale]/city/[slug]/page.tsx`, `src/seo/json-ld.tsx` | **FIXED** |
| `CMS-001` | **HIGH** | Page Builder Blocks | 6 of the 15 CMS Page Builder blocks (`ctaSection`, `statistics`, `testimonial`, `clientLogos`, `imageGallery`, `contactSection`) were defined in Payload schema but missing from `RenderBlocks.tsx`. | `src/blocks/RenderBlocks.tsx` | **FIXED** |
| `CMS-002` | **HIGH** | Homepage Blueprint | Homepage seed layout had 8 blocks instead of 9 (missing `beforeAndAfter` interactive comparison block) and `RenderBlocks.tsx` ignored `showStarterBundles`. | `src/seed/index.ts`, `src/blocks/RenderBlocks.tsx` | **FIXED** |
| `CMS-003` | **MEDIUM** | Block Prop Wiring | `RenderBlocks.tsx` ignored `selectedServices`, `selectedFaqs`, `primaryCtaUrl`, `secondaryCtaUrl`, and `body` fields from CMS blocks. | `src/blocks/RenderBlocks.tsx` | **FIXED** |
| `CMS-004` | **MEDIUM** | Packages Blueprint | `/packages` lacked Single Services callout, Ad Spend Separation & VAT Clarity card (`BR-012`), 3 Quote Steps, and Package FAQs. | `src/app/(frontend)/[locale]/[slug]/page.tsx` | **FIXED** |
| `CMS-005` | **MEDIUM** | Free Audit Blueprint | `/free-audit` listed 3 summary bullets instead of all 6 Audit Checkpoints + the 3 Optional Free Sample Gifts callout (`BR-008`). | `src/app/(frontend)/[locale]/[slug]/page.tsx` | **FIXED** |
| `CMS-006` | **MEDIUM** | Our Work Blueprint | `/our-work` lacked the approved Dawair "Coming Soon (With Client Permission)" teaser card (`BR-010`). | `src/app/(frontend)/[locale]/[slug]/page.tsx` | **FIXED** |
| `CMS-007` | **MEDIUM** | Portfolio Filter | `PortfolioFilterGrid.tsx` only listed 5 of the 9 service categories in its filter pills. | `src/components/domain/PortfolioFilterGrid.tsx` | **FIXED** |
| `CMS-008` | **LOW** | About Page Blueprint | `/about` lacked the `بيّورا` (`بيّن`) & Rising Line brand meaning callout, 4th value card, and direct conversion CTA. | `src/app/(frontend)/[locale]/[slug]/page.tsx` | **FIXED** |
| `CMS-009` | **LOW** | Contact Page Blueprint | `/contact` omitted `siteSettings.phoneNumber` and `siteSettings.businessEmail` in Direct Contact Channels. | `src/app/(frontend)/[locale]/[slug]/page.tsx` | **FIXED** |
| `CMS-010` | **LOW** | Service Detail Pages | `services/[slug]/page.tsx` fell back to `projects[0]` for services without an exact category match, lacked a `/packages` link in `packageInclusionNote`, and lacked a bottom conversion CTA section. | `src/app/(frontend)/[locale]/services/[slug]/page.tsx` | **FIXED** |
| `CMS-011` | **LOW** | City Landing Pages | `city/[slug]/page.tsx` lacked a local portfolio/sample concepts showcase section. | `src/app/(frontend)/[locale]/city/[slug]/page.tsx` | **FIXED** |
| `CMS-012` | **LOW** | Blog Pages | `blog/page.tsx` and `blog/[slug]/page.tsx` did not render category badges or Related Articles, and `Posts.ts` overwrote `readingTimeMinutes: 4` with `1`. | `src/app/(frontend)/[locale]/blog/page.tsx`, `src/app/(frontend)/[locale]/blog/[slug]/page.tsx`, `src/collections/Posts.ts`, `src/seed/index.ts` | **FIXED** |
| `CACHE-001` | **HIGH** | Cache Revalidation | `src/hooks/revalidate.ts` emitted non-localized tags (`page:${slug}`, `${collectionSlug}:list`) that did not match the `:ar` / `:en` tags in `src/lib/payload-queries.ts`. | `src/hooks/revalidate.ts` | **FIXED** |
| `CACHE-002` | **MEDIUM** | Draft Mode Queries | `getPageBySlug`, `getServiceBySlug`, `getCityBySlug`, `getPostBySlug`, and `getCaseStudyProjectBySlug` enforced `_status: { equals: 'published' }` even when `draft === true`. | `src/lib/payload-queries.ts` | **FIXED** |
| `LOC-001` | **HIGH** | Bilingual 404 Page | `src/app/(frontend)/[locale]/not-found.tsx` rendered mixed Arabic + English simultaneously on a single page. | `src/app/(frontend)/[locale]/not-found.tsx` | **FIXED** |
| `LOC-002` | **LOW** | Seed FAQ Depth | 8 of 9 services had only 1 service FAQ instead of 2, and global FAQs had 10 items instead of 12. | `src/seed/data-services-packages.ts`, `src/seed/data-cities-projects-faqs.ts` | **FIXED** |
| `LOC-003` | **LOW** | Dawair Draft Metadata | `dawair` draft project had `businessType: 'retail'` instead of `'restaurant'` (`Hofuf — Al Ahsa`). | `src/seed/data-cities-projects-faqs.ts` | **FIXED** |

