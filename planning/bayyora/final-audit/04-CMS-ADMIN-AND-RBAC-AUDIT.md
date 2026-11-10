# 04 — CMS, Admin Dashboard & RBAC Security Audit (Agent D)

**Project:** Bayyora (بيّورا)  
**Auditor:** Agent D (CMS & Admin Architect)  
**Primary Audited Files:** `planning/bayyora/16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md`, `18-DESIGN-CUSTOMIZATION-AND-THEMING.md`, `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`, `22-CMS-ADMIN-ACCEPTANCE-TESTS.md`

---

## 1. Content Manageability Classification Matrix (Section 7 Requirement)

Every content requirement was audited against the Payload CMS schemas in `16`, `17`, and `18`:

| Content Domain | Classification | Evidence & Audit Notes |
| :--- | :--- | :--- |
| **Global Website Settings (`SiteSettings`)** | **Partially Manageable** | Brand names, taglines, logos, WhatsApp, phone, email, hours, socials, announcement bar, and `publicPricingEnabled` are modeled (`16:35-42`). **Missing:** `integrations.ghlCalendarIdAr/En`, `analytics.*` (`09:93,114`), and Saudi legal credentials (`CR`, `VAT`, `Saudi Business Center ID`, `National Address` — `AUD-015`). |
| **Header & Navigation (`HeaderNav`)** | **Fully Manageable** | Single source of truth for desktop/mobile nav links, 9-service mega-dropdown, language switcher, and CTA (`16:44-53`). |
| **Footer (`FooterNav`)** | **Fully Manageable** | Logo variant, tagline, column links, city links, legal bar links, copyright, and pre-footer CTA (`16:55-64`). |
| **Home Page & Dynamic Pages (`Pages`)** | **Fully Manageable** | 15-block page builder supporting add/remove/reorder/hide (`isVisible`) and 4 visual variants (`16:66-88`). |
| **9 Service Categories (`Services`)** | **Partially Manageable** | All 9 services and structured deliverables modeled (`17:94-112`). **Missing:** Recurring section H2 headings (`المشكلة`, `وش تحصل؟`, `قبل وبعد`, `موجودة في`, `كيف نشتغل؟`) require a `UIStrings` global so they aren't hardcoded (`AUD-012`). |
| **Packages & Starter Bundles (`Packages`)** | **Partially Manageable** | 3 monthly tiers (`Bidaya`, `Numow`, `Riyada`) and 2 starter bundles (`Look`, `Go Online`) modeled (`17:114-135`). **Missing:** `Riyada`'s `1 x 30s video/month` field, structured deliverables for `one_time_bundle`, Founding Offer (`OD-007`), and Single Services callout (`AUD-014`). |
| **Portfolio & Case Studies (`Projects`)** | **Partially Manageable** | Enforces `isSampleConcept` and `clientPermissionVerified` (`17:137-152`). **Gap:** `relatedService` is singular (`17:45,145`), which cannot represent **Dawair's confirmed 2-service scope (`Website + Social Media`)**, and lacks a multi-deliverable gallery for full case studies (`AUD-013`). |
| **5 Eastern Province City Pages (`Cities`)** | **Partially Manageable** | All 5 cities modeled (`17:154-166`). **Gap:** `highlightedServices` pulls identical service descriptions across all 5 cities instead of city-contextualized copy (`07:63` vs `17:160` — `AUD-025`). |
| **Blog (`Posts`, `Categories`, `Tags`)** | **Partially Manageable** | Full post/category/tag schemas exist (`17:168-171`). **Missing:** `/blog` archive page H1/intro/SEO fields (`07:55`) and `sfdaComplianceVerified` field on `Posts` (`11:104` vs `17:169` — `AUD-012`, `AUD-023`). |
| **FAQs (`Faqs`) & Media (`Media`)** | **Fully Manageable** | Categorized bilingual FAQs (`17:172`) and WebP/AVIF media library with required bilingual `alt` text (`17:173`). |
| **UI Microcopy, Form Labels & 404 Page** | **Hardcoded Risk** | Form labels/errors (`09:81`), 404 page copy, PDPL cookie banner, and filter bar labels have no backing Global in `17` (`AUD-012`). |

---

## 2. Detailed CMS & RBAC Findings

### Finding `AUD-005` — Missing Field-Level Access Control Allows RBAC Publishing Bypass, Self-Approval of Compliance Gates & Privilege Escalation to `Owner`
- **Category:** CMS Authorization / RBAC (OWASP ASVS V4.1 / Top 10:2025 A01)
- **Severity:** **Critical** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/16-CMS-ADMIN-ARCHITECTURE.md:109-118`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:78, 88, 140-143, 176`; `20-SECURITY-PERFORMANCE-AND-DEVOPS.md:45-54`
- **Evidence:** `16:113-114` restricts Legal Page publishing and Dawair/SFDA sign-off to `Owner`/`Administrator`, and restricts `SEO Manager` to SEO fields only. However, `17` only defines field-level access on `Packages.internalPriceSar` (`17:134`).
- **Problem & Impact:**
  1. In Payload CMS, collection-level `access.update: true` allows setting `{ _status: 'published' }`. Without a `beforeChange` publishing guard or field-level access on `_status`, `SEO Manager` and `Arabic Translator` can publish any page, and `Content Editor` can set `isLegalPage: false` and publish `/privacy`, `/terms`, or `/refunds`.
  2. Without field-level `access.update: isOwnerOrAdmin` on `Projects.clientPermissionVerified`, `Projects.sfdaComplianceVerified`, and `StatisticsBlock.ownerApproved`, any `Content Editor` can check those boxes themselves.
  3. Without field-level `access.update: isOwner` on `Users.roles` (`17:176`), an `Administrator` (who has `Manage Editors` access in `16:110`) can update their own user record with `roles: ['owner']`, escalating to `Owner / Super Admin`.
- **Recommendation:** Enforce field-level `access.update` on `Users.roles` (`isOwner`), compliance checkboxes (`isOwnerOrAdmin`), content vs. SEO fields, and a shared `beforeChange` hook blocking `_status: 'published'` for unauthorized roles.
- **Priority:** `P0` | **Complexity:** Medium | **Approval Required:** No

---

### Finding `AUD-012` — Missing `UIStrings` Global Forces Form Labels, Validation Errors, 404 Page, Cookie Banner & `/blog` Archive Header Into Hardcoded Files
- **Category:** CMS Customization (`CMS-001`–`CMS-004`)
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md:97, 107, 130`; `09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md:81`; `16-CMS-ADMIN-ARCHITECTURE.md:33-64`
- **Evidence:** `09:81` states all form field labels, placeholders, submit buttons, and thank-you messages are editable in Payload CMS, yet neither the 4 Globals nor the 14 Collections in `17` contain fields for form labels, 404 copy, cookie consent copy, service template H2 headings, or `/blog` archive metadata.
- **Recommendation:** Add a 5th Global (`UIStrings` / `SiteDictionary`) in Payload CMS containing localized field groups for `auditFormUi`, `contactFormUi`, `serviceTemplateHeadings`, `portfolioFilterUi`, `blogIndexPage`, `cookieBannerUi`, and `notFoundPageUi`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-013` — `Projects.relatedService` Is Singular (`hasMany: false`), Failing to Model Dawair's Confirmed Two-Service Scope (`Website + Social Media`)
- **Category:** CMS Content Modeling (`BR-010` / `FR-012`)
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/00-PROJECT-SOURCE-AUDIT.md:35`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:45, 145`; `12-QA-AND-ACCEPTANCE-CRITERIA.md:51`
- **Evidence:** `00:35` confirms Dawair's scope is **Website + Social Media Management**, while `17:45 & 145` defines `relatedService` as a singular relationship (`PROJECTS }o--|| SERVICES`).
- **Recommendation:** Change `Projects.relatedServices` to `hasMany: true`, add a localized `filterCategory` (`logo | signboard | social | video | website`) for `/our-work` filter pills (`AC-FUNC-05`), and add a `deliverablesGallery` array for multi-service case studies (`/our-work/dawair`).
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-014` — `Packages` Schema Omits `Riyada`'s 30s Video Field, Starter Bundle Deliverables Structure, Founding Offer (`OD-007`) & Single Services Callout
- **Category:** CMS Content Modeling (`BR-002`, `BR-012`, `FR-011`)
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/01-PRD.md:30-31, 70`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:114-135`
- **Evidence:** `17:124-129` only defines social media counters (`platformsCount`, `designsCount`, `storiesCount`, `reelsCountText`, `reportingCadence`).
- **Recommendation:** Add `monthlyVideoNote`, `adsScopeNote`, and `adBudgetDisclaimer` to `Packages`; add structured `bundleDeliverables` for `one_time_bundle` (`Look`, `Go Online`); and add `foundingOffer` and `singleServicesCallout` groups to `SiteSettings` / `Packages`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-016` — `Arabic Translator` Role Can Mutate English (`en`) Content & Shared Non-Localized Fields Unless `req.locale === 'ar'` Is Enforced
- **Category:** CMS RBAC (`AC-CMS-23`)
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/16-CMS-ADMIN-ARCHITECTURE.md:114`; `22-CMS-ADMIN-ACCEPTANCE-TESTS.md:57`
- **Evidence:** `22:57` requires that `Arabic Translator` cannot alter `en` content, but `16:114` does not specify checking `req.locale === 'ar'` or locking non-localized fields (`slug`, `quantifiedDeliverables`, `heroImage`).
- **Recommendation:** In collection-level `access.update`, require `req.locale === 'ar'` for `arabic_translator`, and restrict all `localized: false` fields to `isOwnerAdminOrEditor`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

