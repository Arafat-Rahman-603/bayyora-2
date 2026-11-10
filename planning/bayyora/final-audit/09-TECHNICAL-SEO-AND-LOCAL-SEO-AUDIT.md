# 09 — Technical SEO & Local SEO Audit (`100/100` Lighthouse Target — Agent H)

**Project:** Bayyora (بيّورا)  
**Auditor:** Agent H (Technical SEO Specialist)  
**Primary Audited Files:** `planning/bayyora/05-INFORMATION-ARCHITECTURE-AND-SITEMAP.md`, `07-BILINGUAL-CONTENT-STRATEGY.md`, `10-SEO-AND-LOCAL-SEO-STRATEGY.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md`, `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md`

---

## 1. Full 27-Route Bilingual Inventory Audit (Section 8.1 & 8.2)

We audited all **27 canonical Arabic (`/`) and English (`/en/`) route pairs (54 pages)** across `05` and `10`:
- **Routes `#1`–`#13` and `#15`–`#23` (22 route pairs / 44 pages):** Fully documented with bilingual slugs, titles, meta descriptions, and `<h1>` tags in `10-SEO-AND-LOCAL-SEO-STRATEGY.md:56-99`.
- **5 Route Pairs Omitted from Metadata Table in `10:56-99` (`AUD-034`):** Routes `#14` (`/our-work/dawair`), `#24` (`/blog`), `#25` (`/privacy`), `#26` (`/terms`), and `#27` (`/refunds`) are defined in the master sitemap (`05:77, 87-90`) but were omitted from the metadata table in `10:56-99`.

---

## 2. Detailed Technical & Local SEO Findings

### Finding `AUD-002` — Broken `hreflang` Reciprocity & `sitemap.xml` 404 Pollution When Only One Locale Is Translated
- **Category:** Technical SEO / Bilingual Indexing (`SEO-001`–`SEO-003`)
- **Severity:** **Critical** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/10-SEO-AND-LOCAL-SEO-STRATEGY.md:120, 162`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:71, 78-79`; `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md:49-51, 88`
- **Evidence:** `10:120` states `sitemap.ts` queries all records where `_status === 'published' && seo.noIndex !== true` across both `/` and `/en/`. Meanwhile, `10:162` plans Phase 3 Arabic blog articles (`2 Arabic Articles / Month`), and `07:101` sets `fallback: false`.
- **Problem & Impact:** Because Payload's `_status` is document-level, publishing an Arabic blog post sets `_status = 'published'` even when the English locale is untranslated (`translationStatus.en = 'draft'`). Emitting `/en/blog/[slug]` in `sitemap.xml` and `<link rel="alternate" hreflang="en" ...>` when `/en/blog/[slug]` returns `404` violates Google's `hreflang` reciprocity rules and fails SEO audits. Furthermore, `17:71` leaves `seo.noIndex` localization ambiguous (`No (or per-locale)`).
- **Recommendation:**
  1. Set `localized: true` on `seo.noIndex` in `17:71`.
  2. Require `sitemap.ts` and `generatePageMetadata()` to verify `_status === 'published' && doc.translationStatus[locale] === 'published' && !doc.seo[locale]?.noIndex` per locale before emitting a locale URL in `sitemap.xml` or `alternates.languages`.
- **Priority:** `P0` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-035` — Trailing-Slash vs. Non-Trailing-Slash URL Contradiction Across Sitemap, Canonicals & `BreadcrumbList`
- **Category:** Technical SEO / Canonical Consistency
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/05-INFORMATION-ARCHITECTURE-AND-SITEMAP.md:64-90` vs. `167-172`; `10-SEO-AND-LOCAL-SEO-STRATEGY.md:56-99, 153` vs. `112-116`; `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md:24`
- **Evidence:** `05:64-90` and `10:56-99, 153` use trailing slashes (`/services/brand-identity/`, `/en/`), whereas `10:112-116` and `08:98-108` omit trailing slashes (`/services/brand-identity`, `/en`). And in `19:24`, `${siteUrl}/en${pagePath}` produces `https://bayyora.com/en/` (with trailing slash) when `pagePath = "/"`.
- **Problem & Impact:** Causes `308` redirects on internal links and non-matching canonical/`hreflang` URLs.
- **Recommendation:** Enforce `trailingSlash: false` in `next.config.mjs` and pass all URLs through a `normalizeCanonicalUrl()` helper that strips trailing slashes on every path except root `/`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-036` — Local SEO Doorway-Page Risk Across `Al Ahsa`, `Hofuf`, and `Mubarraz` (`Cities` Schema Contradiction)
- **Category:** Local SEO / Content Quality (`SEO-004`)
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/07-BILINGUAL-CONTENT-STRATEGY.md:63`; `10-SEO-AND-LOCAL-SEO-STRATEGY.md:14-19`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:160`; `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md:99`
- **Evidence:** `07:63` requires contextualizing the 9 services to each city's commercial character, but `17:160` defines `highlightedServices: relationship -> Services (hasMany: true)`, which renders the identical 9 service cards across all 5 cities. Moreover, Al Ahsa (`الأحساء`) is the governorate containing Hofuf (`الهفوف`) and Mubarraz (`المبرّز`).
- **Recommendation:**
  1. Add `administrativeType` (`'governorate' | 'city'`), `parentCity` (`Hofuf` and `Mubarraz` contained in `Al Ahsa`), `commercialZones` (`minRows: 3` real local districts/souqs), and `cityServiceHighlights` (city-specific service descriptions) to `Cities` (`17:154-166`).
  2. Upgrade the `Cities` token-similarity check (`19:99`) from a warning to a pre-publish block (`< 35%` shingle overlap required).
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-037` — Misuse of `LocalBusiness` JSON-LD & `geoCoordinates` on City Landing Pages Without Physical Branch Addresses
- **Category:** Structured Data / Google Search Central Compliance
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/13-IMPLEMENTATION-ROADMAP.md:82`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:163`; `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md:72`
- **Problem & Impact:** Emitting 5 separate `LocalBusiness` entities on `/city/al-ahsa`, `/city/hofuf`, `/city/mubarraz`, `/city/dammam`, and `/city/khobar` when Bayyora does not have 5 physical walk-in branch offices violates Google's Structured Data Guidelines.
- **Recommendation:** Emit a single root `ProfessionalService` / `LocalBusiness` entity (`@id: "https://<DOMAIN>/#organization"`), and on `/city/[slug]` pages emit `@type: "Service"` with `provider: { "@id": "https://<DOMAIN>/#organization" }` and `areaServed: { "@type": "City", "name": city.name, "geo": { "@type": "GeoCoordinates", ... } }`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

