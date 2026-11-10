# 22 — CMS, Admin Dashboard & Dynamic Publishing Acceptance Tests

**Project:** Bayyora (بيّورا)  
**Author:** Agent 9 (QA & Acceptance Criteria Agent)  
**Inputs:** Owner Architecture Mandate (§2–§7), `16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md`, `18-DESIGN-CUSTOMIZATION-AND-THEMING.md`, `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md`  
**Status:** Complete CMS & Admin Acceptance Test Suite (Planning-Only Mode)

---

## 1. Global Settings, Header, Footer & Theme Customization Tests (`AC-CMS-01` – `AC-CMS-05`)

| Test ID | Requirement Ref | Test Scenario (Playwright / Integration Test) | Measurable Pass Condition |
| :--- | :--- | :--- | :--- |
| **AC-CMS-01** | `CMS-002` (§2.1) | In `/admin/globals/site-settings`, update `whatsappNumber`, `workingHours` (AR & EN), and enable `announcementBar`. Click Save. | Live pages `/` and `/en` immediately reflect the new WhatsApp number in the floating button and all CTAs, display the updated working hours in Footer & `/contact`, and render the announcement bar without any code edit or server restart. |
| **AC-CMS-02** | `CMS-003` (§2.2) | In `/admin/globals/header-nav`, reorder two top-level navigation items, change the primary CTA label (`ar` & `en`), and reorder a link inside the 9-service dropdown. | Both the desktop sticky header and the mobile hamburger drawer update identically on `/` and `/en` from the single `HeaderNav` data source. |
| **AC-CMS-03** | `CMS-003` (§2.3) | In `/admin/globals/footer-nav`, update the footer tagline override, toggle a social media link, and edit the copyright text. | Global footer on all AR and EN pages reflects the updated links and copyright text immediately upon cache revalidation. |
| **AC-CMS-04** | `CMS-008` (§2.12) | Logged in as `Owner`, open `/admin/globals/theme-settings`, change `components.cardRadius` from `'lg'` (`16px`) to `'xl'` (`24px`) and switch `activePalettePreset`. | Root `<html>` CSS custom properties (`--radius-card`, `--color-*`) update on the live site and all Tailwind-bound cards/sections reflect the updated design tokens. |
| **AC-CMS-05** | `CMS-008`, `NFR-005` | In `ThemeSettings`, attempt to set `colors.textInk` to `#F2A541` (*Saffron Rise*) on `colors.canvasSand` (`#F5EFE4`) and click Save. | Save is **rejected by the `beforeChange` WCAG 2.1 AA contrast validator hook** with a validation error stating contrast (`1.7:1`) is below the `4.5:1` minimum threshold. |

---

## 2. Page Builder & Content Collection CRUD Tests (`AC-CMS-06` – `AC-CMS-14`)

| Test ID | Requirement Ref | Test Scenario | Measurable Pass Condition |
| :--- | :--- | :--- | :--- |
| **AC-CMS-06** | `CMS-004` (§2.4) | Edit the Homepage (`Pages` `slug: 'home'`): drag `ProcessStepsBlock` above `PackageComparisonBlock`, toggle `SeasonalBannerBlock` `isVisible = false`, and change a Hero CTA label. | Live Homepage (`/`) renders `ProcessStepsBlock` above `PackageComparisonBlock`, hides the seasonal banner, and updates the CTA label while preserving strict `H1 → H2 → H3` hierarchy. |
| **AC-CMS-07** | `CMS-004`, `BR-009` | Attempt to publish a page containing a `StatisticsBlock`, `TestimonialBlock`, or `ClientLogosBlock` without checking the required `verificationSourceNote` / `clientPermissionVerified` flag. | Payload `beforeChange` validation **blocks publication** and highlights the missing permission/verification field. |
| **AC-CMS-08** | `CMS-005` (§2.5) | In `/admin/collections/services`, edit `/services/brand-identity` deliverables AND create a brand-new 10th service (`slug: 'packaging-design'`, localized AR & EN) and publish. | `/services/brand-identity` updates immediately, AND `/services/packaging-design` + `/en/services/packaging-design` automatically become live, render with the standard 8-section Service template, and appear in `/sitemap.xml` — with zero developer code changes. |
| **AC-CMS-09** | `CMS-005` (§2.6), `BR-003` | In `/admin/collections/packages`, update `Bidaya` `designsCount` from `10` to `12` and verify public price visibility. | Package cards on `/` and `/packages` immediately display `12 designs / ١٢ تصميم`. Public prices remain **completely absent** from HTML/JSON responses while `SiteSettings.publicPricingEnabled === false`. |
| **AC-CMS-10** | `CMS-006` (§2.7), `BR-009`, `BR-010` | In `/admin/collections/projects`: (1) Publish a project with `isSampleConcept: true`; (2) Attempt to publish the `Dawair` project with `isSampleConcept: false` while `clientPermissionVerified: false`. | (1) The sample project renders on `/our-work` with a visible **`نموذج توضيحي` (AR) / `Sample concept` (EN)** badge.<br>(2) Publishing `Dawair` as real work without `clientPermissionVerified: true` is **blocked**. |
| **AC-CMS-11** | `CMS-006` (§2.8) | In `/admin/collections/cities`, create a 6th city (`slug: 'jubail'`, localized AR & EN) with unique local copy; then test pasting identical copy from `dammam`. | Unique `jubail` record automatically serves `/city/jubail` and `/en/city/jubail`. Pasting duplicate copy triggers the **anti-doorway similarity warning (`> 40%` overlap)**. |
| **AC-CMS-12** | `CMS-006` (§2.9) | In `/admin/collections/posts`, create a bilingual blog article with categories, tags, featured image, and a future `publishedAt` timestamp. | Article remains hidden from `/blog` and `/sitemap.xml` until the scheduled `publishedAt` time arrives, then publishes automatically with auto-calculated `readingTimeMinutes` and valid `Article` JSON-LD. |
| **AC-CMS-13** | `CMS-006` (§2.10) | In `/admin/collections/faqs`, add a new FAQ in AR & EN, assign it to `/services/photography`, and reorder it to #1. | The new FAQ appears first in the FAQ accordion on `/services/photography` and `/en/services/photography` and updates the page's `FAQPage` JSON-LD schema. |
| **AC-CMS-14** | `CMS-007` (§2.11) | In `/admin/collections/media`: (1) Attempt to upload an image without `ar` or `en` `alt` text; (2) Attempt to delete a `Media` item currently used as `heroImage` on a published Service. | (1) Upload save is blocked until both `ar` and `en` `alt` texts are provided.<br>(2) **Deletion is blocked by the `beforeDelete` reference check hook**, listing the exact published Service referencing the image. |

---

## 3. Localization, Dynamic SEO & Redirect Management Tests (`AC-CMS-15` – `AC-CMS-19`)

| Test ID | Requirement Ref | Test Scenario | Measurable Pass Condition |
| :--- | :--- | :--- | :--- |
| **AC-CMS-15** | `CMS-009` (§3) | Create a new Page in Arabic (`locale: 'ar'`) and leave the English (`locale: 'en'`) `title` or `seo.metaDescription` empty; attempt to set English `translationStatus = 'published'`. | CMS displays a `Missing English Translation` badge in the admin list view, blocks publishing the incomplete `en` locale, and ensures `/` (`ar`) does not emit a broken `hreflang="en"` link until `/en/` is published. |
| **AC-CMS-16** | `SEO-001` (§4.1) | Edit a custom `seo.metaTitle` and `seo.metaDescription` on `/services/social-media` in AR & EN. Then clear `seo.metaTitle` on a test draft to verify fallback behavior. | When custom values exist, Next.js `generateMetadata` outputs the **exact custom values** (never overwriting them). When left blank, it outputs the automatic fallback (`${doc.name} | ${siteSettings.brandName}`). |
| **AC-CMS-17** | `SEO-002` (§4.3) | Toggle `seo.noIndex = true` (or revert `_status` to `'draft'`) on any published page and inspect `/sitemap.xml` and the page's `<meta name="robots">` tag. | Page immediately outputs `<meta name="robots" content="noindex, nofollow" />` and is **removed from `/sitemap.xml`** within `< 500ms`. |
| **AC-CMS-18** | `SEO-004` (§4.6, §7) | Change the URL `slug` of a published service from `video-animation` to `video-motion-graphics` and save. | Payload automatically creates two `301` redirect rules in `Redirects` (`/services/video-animation -> /services/video-motion-graphics` and `/en/services/video-animation -> /en/services/video-motion-graphics`), and requesting the old URL returns `HTTP 301` to the new URL. |
| **AC-CMS-19** | `SEO-004` (§4.6) | Open the `BrokenLinksReport` tool in `/admin` after unpublishing a target page linked inside a blog post. | The scanner flags the exact source blog post and broken target URL so the SEO Manager can update or redirect it. |

---

## 4. Publishing Workflow, Versioning, Rollback & 6-Role RBAC Tests (`AC-CMS-20` – `AC-CMS-24`)

| Test ID | Requirement Ref | Test Scenario | Measurable Pass Condition |
| :--- | :--- | :--- | :--- |
| **AC-CMS-20** | `CMS-010` (§7) | Edit a published page and click **Save Draft** (without clicking Publish). Request the public URL in an incognito browser vs. the Admin **Live Preview** window. | Incognito public visitors continue seeing the prior published version; Admin Live Preview (`/api/draft`) renders the uncommitted draft changes in real time. |
| **AC-CMS-21** | `CMS-010` (§7) | Publish an edit to a page, open its **Versions** tab in `/admin`, select the previous version, and click **Restore**. | Document rolls back to the prior version, triggers `revalidateTag()`, and the live public page reverts within `< 500ms`. |
| **AC-CMS-22** | `CMS-011` (§6) | Log in as `Content Editor` and attempt to: (1) Edit `ThemeSettings`; (2) Publish `/privacy` (`isLegalPage: true`); (3) Enable `publicPricingEnabled` in `SiteSettings`. | All 3 operations return `HTTP 403 Forbidden` on the server and are disabled/hidden in the Admin UI. |
| **AC-CMS-23** | `CMS-011` (§6) | Log in as `Arabic Translator` and `SEO Manager` and verify field-level permissions. | `Arabic Translator` can edit `ar` content fields and `translationStatus` but cannot alter `en` content or `SiteSettings`. `SEO Manager` can edit `seoFields` and `Redirects` across all collections. |
| **AC-CMS-24** | `CMS-011` (§6) | Perform a login, page update, publish, and version rollback, then inspect `/admin/collections/audit-logs` as `Owner`. | All 4 actions are recorded in `AuditLogs` with actor user ID, timestamp, collection, document ID, and JSON diff; attempting to edit or delete an `AuditLogs` record is rejected (`HTTP 403`). |

