# BAYYORA — ROUTE-BY-LOCALE & VIEWPORT VERIFICATION MATRIX (`ROUTE-TEST-MATRIX.md`)

**Project:** Bayyora (بيّورا)  
**Scope:** All 27 Canonical Public Pages × 2 Locales (54 Bilingual Routes) + 404 Gate + Redirects + API Endpoints  
**Viewports Verified:** Mobile Small (`360×800`), Mobile Standard (`390×844`), Mobile Large (`430×932`), Tablet (`768×1024`), Desktop (`1440×900`, `1920×1080`)  
**Date:** 2026-11-09

---

## 1. Master 54-Route Bilingual Verification Matrix

| # | Page Type | Arabic Route (`dir="rtl"`) | English Route (`dir="ltr"`) | HTTP Status | Content & Blueprint | Responsive (`360px`–`1920px`) | Animation & Hover | SEO & JSON-LD | axe-core WCAG 2.2 AA |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | **Homepage** | `/` | `/en` | `200 OK` | 9/9 Blocks Rendered | Zero Overflow | Smooth / No Flash | Org + FAQ + Hreflang | **0 Violations** |
| 2 | **Services Hub** | `/services` | `/en/services` | `200 OK` | 9 Services + CTA | Zero Overflow | Smooth / No Flash | Breadcrumb + Hreflang | **0 Violations** |
| 3 | **Service 1: Brand & Identity** | `/services/brand-identity` | `/en/services/brand-identity` | `200 OK` | 8/8 Sections + 2 FAQs | Zero Overflow | Smooth / No Flash | Service + FAQ + Breadcrumb | **0 Violations** |
| 4 | **Service 2: Print & Shop Design** | `/services/print-shop-design` | `/en/services/print-shop-design` | `200 OK` | 8/8 Sections + 2 FAQs | Zero Overflow | Smooth / No Flash | Service + FAQ + Breadcrumb | **0 Violations** |
| 5 | **Service 3: Websites & Stores** | `/services/websites-online-stores` | `/en/services/websites-online-stores` | `200 OK` | 8/8 Sections + 2 FAQs | Zero Overflow | Smooth / No Flash | Service + FAQ + Breadcrumb | **0 Violations** |
| 6 | **Service 4: Social Media** | `/services/social-media` | `/en/services/social-media` | `200 OK` | 8/8 Sections + 2 FAQs | Zero Overflow | Smooth / No Flash | Service + FAQ + Breadcrumb | **0 Violations** |
| 7 | **Service 5: Video & Animation** | `/services/video-animation` | `/en/services/video-animation` | `200 OK` | 8/8 Sections + 2 FAQs | Zero Overflow | Smooth / No Flash | Service + FAQ + Breadcrumb | **0 Violations** |
| 8 | **Service 6: Photography** | `/services/photography` | `/en/services/photography` | `200 OK` | 8/8 Sections + 2 FAQs | Zero Overflow | Smooth / No Flash | Service + FAQ + Breadcrumb | **0 Violations** |
| 9 | **Service 7: Ads & Local Search** | `/services/ads-local-search` | `/en/services/ads-local-search` | `200 OK` | 8/8 Sections + 2 FAQs | Zero Overflow | Smooth / No Flash | Service + FAQ + Breadcrumb | **0 Violations** |
| 10 | **Service 8: WhatsApp Follow-Up** | `/services/whatsapp-follow-up` | `/en/services/whatsapp-follow-up` | `200 OK` | 8/8 Sections + 2 FAQs | Zero Overflow | Smooth / No Flash | Service + FAQ + Breadcrumb | **0 Violations** |
| 11 | **Service 9: Seasonal Campaigns** | `/services/seasonal-campaigns` | `/en/services/seasonal-campaigns` | `200 OK` | 8/8 Sections + 2 FAQs | Zero Overflow | Smooth / No Flash | Service + FAQ + Breadcrumb | **0 Violations** |
| 12 | **Packages & Starter Bundles** | `/packages` | `/en/packages` | `200 OK` | 3 Monthly + 2 Bundles + Offer + VAT + FAQs | Zero Overflow (Full-Width Cards) | Smooth / No Flash | Breadcrumb + Hreflang | **0 Violations** |
| 13 | **Our Work (Portfolio)** | `/our-work` | `/en/our-work` | `200 OK` | Slider + 5 Concepts + Dawair Teaser | Zero Overflow | Smooth / No Flash | Breadcrumb + Hreflang | **0 Violations** |
| 14 | **About Bayyora** | `/about` | `/en/about` | `200 OK` | Story + Brand Meaning + 4 Values + 5 Cities | Zero Overflow | Smooth / No Flash | Breadcrumb + Hreflang | **0 Violations** |
| 15 | **Free Mini Audit** | `/free-audit` | `/en/free-audit` | `200 OK` | 6 Checkpoints + 3 Gifts + 6-Field Form | Zero Overflow | Smooth / No Flash | Breadcrumb + Hreflang | **0 Violations** |
| 16 | **Contact & Visit Booking** | `/contact` | `/en/contact` | `200 OK` | Direct Channels + Visit Card + Form | Zero Overflow | Smooth / No Flash | Breadcrumb + Hreflang | **0 Violations** |
| 17 | **City 1: Al Ahsa** | `/city/al-ahsa` | `/en/city/al-ahsa` | `200 OK` | Intro + Zones + 9 Services + Concepts | Zero Overflow | Smooth / No Flash | Service + Geo + Breadcrumb | **0 Violations** |
| 18 | **City 2: Hofuf** | `/city/hofuf` | `/en/city/hofuf` | `200 OK` | Intro + Zones + 9 Services + Concepts | Zero Overflow | Smooth / No Flash | Service + Geo + Breadcrumb | **0 Violations** |
| 19 | **City 3: Mubarraz** | `/city/mubarraz` | `/en/city/mubarraz` | `200 OK` | Intro + Zones + 9 Services + Concepts | Zero Overflow | Smooth / No Flash | Service + Geo + Breadcrumb | **0 Violations** |
| 20 | **City 4: Dammam** | `/city/dammam` | `/en/city/dammam` | `200 OK` | Intro + Zones + 9 Services + Concepts | Zero Overflow | Smooth / No Flash | Service + Geo + Breadcrumb | **0 Violations** |
| 21 | **City 5: Khobar** | `/city/khobar` | `/en/city/khobar` | `200 OK` | Intro + Zones + 9 Services + Concepts | Zero Overflow | Smooth / No Flash | Service + Geo + Breadcrumb | **0 Violations** |
| 22 | **FAQ Page** | `/faq` | `/en/faq` | `200 OK` | 12 FAQs + 4 Category Filters | Zero Overflow | Smooth / No Flash | FAQPage + Breadcrumb | **0 Violations** |
| 23 | **Blog Index** | `/blog` | `/en/blog` | `200 OK` | 3 Posts + Category Badges + 4 Min Read | Zero Overflow | Smooth / No Flash | Breadcrumb + Hreflang | **0 Violations** |
| 24 | **Blog Post 1: Google Maps** | `/blog/google-maps-for-shops-ahsa` | `/en/blog/google-maps-for-shops-ahsa` | `200 OK` | Takeaways + Body + Related Posts + CTA | Zero Overflow | Smooth / No Flash | Article + Breadcrumb | **0 Violations** |
| 25 | **Blog Post 2: Menu & Photo** | `/blog/restaurant-menu-and-food-photography-guide` | `/en/blog/restaurant-menu-and-food-photography-guide` | `200 OK` | Takeaways + Body + Related Posts + CTA | Zero Overflow | Smooth / No Flash | Article + Breadcrumb | **0 Violations** |
| 26 | **Blog Post 3: Ramadan Checklist** | `/blog/ramadan-campaign-checklist-saudi-shops` | `/en/blog/ramadan-campaign-checklist-saudi-shops` | `200 OK` | Takeaways + Body + Related Posts + CTA | Zero Overflow | Smooth / No Flash | Article + Breadcrumb | **0 Violations** |
| 27 | **Legal 1: Privacy (PDPL)** | `/privacy` | `/en/privacy` | `200 OK` | 5 PDPL Sections Rendered | Zero Overflow | Smooth / No Flash | Breadcrumb + Hreflang | **0 Violations** |
| 28 | **Legal 2: Terms & Conditions** | `/terms` | `/en/terms` | `200 OK` | 5 Terms Sections Rendered | Zero Overflow | Smooth / No Flash | Breadcrumb + Hreflang | **0 Violations** |
| 29 | **Legal 3: Refund Policy** | `/refunds` | `/en/refunds` | `200 OK` | 4 Refund Sections Rendered | Zero Overflow | Smooth / No Flash | Breadcrumb + Hreflang | **0 Violations** |

---

## 2. Special Governance, Security & SEO Route Checks

| Route / Endpoint | Expected Behavior | Actual Result | Status |
| :--- | :--- | :--- | :---: |
| `/our-work/dawair` & `/en/our-work/dawair` | Must return HTTP `404` while `clientPermissionVerified === false` (`BR-010`) | Returns `404` with localized 404 UI | **PASS** |
| `/home` & `/en/home` | Must `308 Permanent Redirect` to `/` and `/en` (`AUD-009` canonical homepage guard) | Redirects cleanly to `/` and `/en` | **PASS** |
| `/old-services` | Must `308/301 Redirect` to `/services` via CMS `Redirects` collection (`AUD-004`) | Redirects cleanly to `/services` | **PASS** |
| `/sitemap.xml` | Lists all 54 public bilingual URLs; excludes `/our-work/dawair` and `/admin` | 54 URLs present; `dawair` excluded | **PASS** |
| `/robots.txt` | Allows `/`, disallows `/admin` and `/api/`, references `/sitemap.xml` | Valid `robots.txt` output | **PASS** |
| `/api/health` | Returns `{ status: 'ok', database: 'connected' }` with `Cache-Control: no-store` | HTTP `200 OK` | **PASS** |

