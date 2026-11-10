# BAYYORA — IMPLEMENTATION STATUS & AUDIT REMEDIATIONTRACKER

**Project:** Bayyora (بيّورا) — خطوة لفوق / One step up  
**Authorization Status:** `APPROVED TO IMPLEMENT`  
**Stack:** Next.js 15 (`15.2.9`) App Router + Payload CMS 3.x (`3.30.0`) + React 19 + Strict TypeScript + Tailwind CSS + Drizzle SQL (`@payloadcms/db-postgres` & `@payloadcms/db-sqlite`)  
**Last Updated:** 2026-11-08

---

## 1. Phase-by-Phase Execution Summary

| Phase | Milestone | Status | Key Deliverables & Verification |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Project Foundation & Setup | ✅ Completed | `package.json`, `tsconfig.json` (`strict: true`, `noUncheckedIndexedAccess: true`), `next.config.mjs` (`trailingSlash: false`), `tailwind.config.ts` (CSS logical properties + semantic tokens), `src/env.ts` (Zod fail-closed runtime validation), `.env.example`, `vitest.config.ts`, `playwright.config.ts`. |
| **Phase 1** | CMS, Database & Admin Dashboard | ✅ Completed | `src/payload.config.ts`, 5 Globals (`SiteSettings`, `HeaderNav`, `FooterNav`, `ThemeSettings`, `UIStrings`), 14 Collections (`Pages`, `Services`, `Packages`, `Projects`, `Cities`, `Posts`, `Categories`, `Tags`, `Faqs`, `Media`, `Redirects`, `LeadSubmissions`, `Users`, `AuditLogs`), 15 Page Builder Blocks (`src/blocks/schemas.ts`), 6 RBAC roles (`src/access/rbac.ts`), Payload Admin at `/admin`, and full bilingual seed (`pnpm seed` exited `0`). |
| **Phase 2** | Design System & Core UI | ✅ Completed | *Modern Khaleeji Warmth* design tokens (`src/app/(frontend)/globals.css`), WCAG 2.2 AA contrast calculator (`src/lib/contrast-validator.ts`), directional `RisingLineSvg` & `BayyoraLogo`, `Header.tsx` (360px-safe 3-item mobile header + focus-trapped drawer), `Footer.tsx`, `FloatingWhatsApp.tsx`, `CookieConsentBanner.tsx`. |
| **Phase 3** | Interactive & Motion System | ✅ Completed | `motion/react` `LazyMotion` (`domAnimation`) components: `HeroComparisonCard.tsx`, `BeforeAfterSlider.tsx` (with `SC 2.5.7` single-click preset buttons: `قبل (0%)`, `مقارنة (50%)`, `بعد (100%)`), `SeasonalCampaignTabs.tsx` (5 Saudi seasons), `PortfolioFilterGrid.tsx` (category + city dual filter with `نموذج توضيحي` badge), `FaqAccordion.tsx`, `PackageCardGrid.tsx`. |
| **Phase 4** | Public Website Pages (54 Bilingual Routes) | ✅ Completed | All 27 canonical route pairs in Arabic (`/`) and English (`/en`): Home, Services Hub + 9 Service Detail Pages, Packages, Our Work + Permission-Gated Dawair Case Study (`/our-work/dawair`), About, Free Mini Audit, Contact, FAQ, 5 Eastern Province City Pages (`al-ahsa`, `hofuf`, `mubarraz`, `dammam`, `khobar`), Blog Hub + Article Pages, Privacy, Terms, Refunds. |
| **Phase 5** | Bilingual Localization & Parity | ✅ Completed | `src/i18n/config.ts`, `src/middleware.ts` (`as-needed` prefixing, `/ar/*` -> `308` redirect to `/*`), native `<html lang="ar" dir="rtl">` vs `<html lang="en" dir="ltr">`, Arabic-Indic (`٠-٩`) and Eastern Arabic (`۰-۹`) numeral normalization (`normalizeDigits`, `normalizeSaudiPhone`). |
| **Phase 6** | Technical, Local & AI Search SEO | ✅ Completed | `src/seo/metadata.ts` (self-referencing canonicals, reciprocal `hreflang` `ar-SA`, `en`, `x-default`), `src/seo/json-ld.tsx` (`LocalBusiness` / `ProfessionalService`, `WebSite`, `Service`, `FAQPage`, `Article`, `BreadcrumbList` with `\u003c` XSS escaping), `src/app/sitemap.ts`, `src/app/robots.ts`. |
| **Phase 7** | Forms, WhatsApp & Lead Handling | ✅ Completed | `src/validations/lead-schemas.ts` (single full-name field, `inputMode="tel"`, `javascript:` link rejection, PDPL consent), `src/actions/lead-actions.ts` (IP rate limiting, honeypot, AES-256-GCM encrypted storage, GoHighLevel webhook adapter, WhatsApp confirmation URL). |
| **Phase 8** | Security & Compliance Hardening | ✅ Completed | Next.js `15.2.9` (`CVE-2025-29927` mitigated), nonce-based CSP + HSTS + `X-Frame-Options: DENY` (`src/middleware.ts`), constant-time SHA-256 secret comparison (`timingSafeCompare`), `/api/draft` auth + open-redirect protection, Media magic-byte check, RBAC self-escalation prevention, Dawair gate (`clientPermissionVerified: false`), and pricing gate (`publicPricingEnabled: false`). |
| **Phase 9** | Testing & Production Verification | ✅ Completed | `pnpm typecheck` (`tsc --noEmit` -> `0` errors), `pnpm test` (`vitest run` -> `16/16` unit & integration tests passing), `pnpm build` (`next build`), and `tests/e2e/bayyora.spec.ts` (Playwright E2E + `@axe-core/playwright` WCAG 2.2 AA). |

---

## 2. Final Master Audit Findings Remediation Matrix

- **`AUD-001` / `AUD-014` (Next.js CVE-2025-29927):** Pinned `next@15.2.9` (>= `15.2.3`) and enforced independent RBAC checks in Payload collections/globals and Server Actions.
- **`AUD-002` / `AUD-020` (`/api/draft` Unauthenticated Access & Open Redirect):** Enforced `timingSafeCompare(secret, env.PREVIEW_SECRET)` and strict internal-path validation (`slug.startsWith('/') && !slug.startsWith('//')`) in `src/app/api/draft/route.ts`.
- **`AUD-003` (Timing Side-Channel on Secrets):** Implemented `timingSafeCompare` using SHA-256 digests + `crypto.timingSafeEqual` in `src/lib/crypto.ts`.
- **`AUD-015` / `AUD-016` (Accidental System Page & Media Deletion):** Added `beforeDelete` hooks on `Pages` (blocking deletion of the 11 system page slugs) and `Media` (blocking deletion when referenced by active pages, services, or projects).
- **`AUD-018` (Canonical & Hreflang Trailing Slash Consistency):** Enforced `trailingSlash: false` across `next.config.mjs`, `localizePath()`, `buildCanonicalUrl()`, and `sitemap.ts`.
- **`AUD-019` (Anti-Doorway City Similarity Enforcement):** Implemented `calculateJaccardSimilarity()` in `src/collections/Cities.ts` (`beforeValidate` hook rejecting >40% similarity overlap across published cities).
- **`AUD-022` (RBAC Self-Role Escalation):** Added field-level `access.update: isOwnerOrAdminField` on `Users.role` so non-admin users cannot escalate their own role.
- **`AUD-023` (Media Upload Magic-Byte Validation):** Added `beforeOperation` hook in `src/collections/Media.ts` verifying PNG, JPEG, WebP, AVIF, PDF, MP4, and sanitized SVG signatures.
- **`AUD-025` (JSON-LD Script Breakout XSS):** Implemented `safeJsonLdStringify()` in `src/seo/json-ld.tsx` escaping `<` as `\u003c`.
- **`AUD-026` (Unsafe URL Schemes in Lead Forms):** Added `safeSocialOrMapsLinkSchema` in `src/validations/lead-schemas.ts` rejecting `javascript:`, `data:`, `vbscript:`, and `file:` URIs.
- **`AUD-030` (Saudi PDPL Lead PII Encryption at Rest):** Implemented AES-256-GCM encryption (`encryptLeadPayload` / `decryptLeadPayload`) in `src/lib/crypto.ts` and `src/actions/lead-actions.ts`.
- **`BR-010` / `BR-011` / `BR-012` (Business Integrity Gates):**
  - Dawair case study seeded with `_status: 'draft'` and `clientPermissionVerified: false` (returns `404` on `/our-work/dawair` and excluded from `sitemap.xml`).
  - Portfolio sample concepts seeded with `isSampleConcept: true` rendering the `نموذج توضيحي / Sample concept` badge.
  - `SiteSettings.publicPricingEnabled` seeded as `false` so `/packages` and homepage package cards display quote-only CTAs until owner activation.
