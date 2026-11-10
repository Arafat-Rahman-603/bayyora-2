# 16 — Prioritized Remediation Roadmap (`P0` – `P3`)

**Project:** Bayyora (بيّورا)  
**Document Version:** 1.0  
**Execution Rule:** Do NOT start application implementation until the Owner issues **`APPROVED TO IMPLEMENT`**. Every item below is mapped to the exact Milestone in `13-IMPLEMENTATION-ROADMAP.md` where it must be enforced.

---

## 1. `P0` — Critical Mandatory Security & Integrity Fixes (Enforce in Milestone 1 Scaffolding)

| Finding ID | Issue Summary | Affected Files / Specs | Responsible Specialist | Concrete Solution & Regression Test |
| :--- | :--- | :--- | :--- | :--- |
| **`AUD-001`** | Public RSC `payload.find()` omits `overrideAccess: false`, leaking `internalPriceSar` and `clientPermissionNote` in RSC Flight payloads. | `08`, `17`, `20` (`src/lib/payload-queries.ts`) | Next.js Architect + AppSec | Pass `overrideAccess: false` and explicit `select` projections on all public RSC queries. **Test:** Playwright inspects HTML/RSC payload to assert `internalPriceSar` is absent (`AC-CMS-09`). |
| **`AUD-002`** | Public queries, `sitemap.ts`, and `hreflang` check document-level `_status` instead of localized `translationStatus[locale] === 'published'`, and `seo.noIndex` is not localized. | `08`, `10`, `17`, `19` (`src/app/sitemap.ts`, `generate-page-metadata.ts`) | Technical SEO + CMS Architect | Localize `seo.noIndex` (`localized: true`) and filter all public queries, `sitemap.ts`, and `alternates.languages` by `_status === 'published' && translationStatus[locale] === 'published'`. **Test:** `AC-CMS-15`. |
| **`AUD-003`** | `/api/draft` lacks `payload.auth()` session check & relative-path validation, and `unstable_cache` is not bypassed during `draftMode().isEnabled`. | `08`, `16` (`src/app/api/draft/route.ts`, `payload-queries.ts`) | Next.js Architect + AppSec | Require `payload.auth({ headers })` + `PREVIEW_SECRET` + relative URL regex in `/api/draft`, and bypass `unstable_cache` when `(await draftMode()).isEnabled` is true. **Test:** `AC-CMS-20` + `AC-CMS-26`. |
| **`AUD-004`** | `src/middleware.ts` cannot run Payload DB queries in Edge Runtime and must not rewrite `/admin` or `/api` to `/ar/admin`. | `08`, `20` (`src/middleware.ts`) | Next.js Architect | Exclude `/admin`, `/api`, `/_next` from `middleware.ts` matcher; resolve CMS `Redirects` in the Node.js RSC layout/catch-all boundary (or edge-cached map). **Test:** E2E check on `/admin` and `301` redirects. |
| **`AUD-005`** | Missing field-level `access.update` on `_status`, `isLegalPage`, `clientPermissionVerified`, `sfdaComplianceVerified`, and `Users.roles` allows RBAC bypass & privilege escalation to `Owner`. | `16`, `17`, `20` (`src/access/*.ts`, `src/collections/*.ts`) | CMS Architect + AppSec | Add field-level `access.update: isOwner` on `Users.roles`, `isOwnerOrAdmin` on compliance checkboxes, and a `beforeChange` hook blocking unauthorized `_status: 'published'` transitions. **Test:** `AC-CMS-22`, `AC-CMS-23`, `AC-CMS-27`. |
| **`AUD-006`** | Unescaped `</script>` in `JSON.stringify()` inside `<script type="application/ld+json">` enables Stored XSS via `structuredDataOverride`. | `17`, `19`, `20` (`src/seo/json-ld.ts`) | AppSec + SEO Specialist | Serialize all JSON-LD with `.replace(/</g, '\\u003c').replace(/>/g, '\\u003e')`. **Test:** Vitest unit test injecting `"</script><script>alert(1)</script>"` into JSON-LD generator. |
| **`AUD-024`** | Public Payload REST (`/api/[...slug]`) & GraphQL exposure without row-level `_status === 'published'` filter. | `08`, `17`, `20` (`src/payload.config.ts`) | CMS Architect + AppSec | Set `graphQL: { disable: true }`, return `{ _status: { equals: 'published' } }` for anonymous `access.read`, and hide `clientPermissionNote` via field-level `access.read`. **Test:** Vitest/Playwright API test on `/api/projects?draft=true`. |

---

## 2. `P1` — High-Priority Pre-Launch Fixes (Enforce Across Milestones 1–3)

1. **`AUD-007` (Revalidation Hook Guard):** Guard `revalidateTag`/`revalidatePath` in Payload `afterChange` hooks with `if (context.disableRevalidate) return doc;` and `try/catch` so CLI seeding (`src/seed/`) never crashes.
2. **`AUD-008` (Static Route Caching):** Export `generateStaticParams()` and call `setRequestLocale(locale)` in `[locale]/layout.tsx` and child routes to preserve `< 80ms` static edge caching.
3. **`AUD-009` (Homepage Slug Guard):** Redirect `/home` and `/en/home` (`308`) to `/` and `/en`, and lock system page slugs read-only.
4. **`AUD-010` & `AUD-025` (Pinned Stack & Next.js 15 Async Params):** Pin `next@^15.2.4` (mitigating `CVE-2025-29927`), `react@^19.0.0`, `tailwindcss@^3.4.17`, and exact `@payloadcms/*` versions; use `params: Promise<...>` in all route files.
5. **`AUD-012`–`AUD-016` & `AUD-045` (CMS Schema Completeness):**
   - Add `UIStrings` Global (form labels/errors, 404 copy, PDPL cookie banner, service H2 headings, `/blog` archive header).
   - Change `Projects.relatedServices` to `hasMany: true` + `deliverablesGallery` for Dawair (`Website + Social Media`).
   - Add `Riyada`'s 30s video field, Starter Bundle deliverables structure, Founding Offer (`OD-007`), and Single Services callout to `Packages` / `SiteSettings`.
   - Add Saudi legal credentials (`CR`, `VAT`, `Saudi Business Center ID`, `National Address`) to `SiteSettings`.
   - Enforce `req.locale === 'ar'` for `Arabic Translator` updates and add `sfdaComplianceVerified` + `mawthooqLicenseVerified` to `Posts` and `Projects`.
6. **`AUD-017` & `AUD-018` (Database Referential & Redirect Integrity):** Check drafts, globals, blocks, and Lexical nodes in `Media` `beforeDelete` hook; delete reverse redirect rules (`fromPath === newPath`) when reverting a slug edit (`A -> B -> A`).
7. **`AUD-021`, `AUD-026`–`AUD-031` (AppSec & Privacy Hardening):**
   - Implement TOTP/WebAuthn MFA for `Owner` and `Administrator` (`AUD-021`).
   - Restrict `instagramOrLink` via Zod to `@handle` or public `http(s)://` URLs and escape CSV formula characters (`AUD-026`).
   - Add split Content-Security-Policy (`frame-ancestors 'self'`) and HSTS/nosniff headers (`AUD-027`).
   - Enforce `file-type` magic-byte checks, EXIF GPS stripping, and `sharp({ limitInputPixels: 36_000_000 })` on `Media` (`AUD-028`).
   - Add `idempotencyKey`, `CRON_SECRET`, and `@payloadcms/email-resend` for `LeadSubmissions` (`AUD-029`).
   - Capture PDPL consent fields (`privacyConsentAccepted`, `consentTimestamp`, `privacyPolicyVersion`), encrypt `LeadSubmissions.payloadJson` with AES-256-GCM, and run a 90-day PII retention purge (`AUD-030`).
   - Use distributed rate limiting + non-interactive Cloudflare Turnstile on public forms (`AUD-031`).
8. **`AUD-035`–`AUD-037` (Technical & Local SEO):** Enforce `trailingSlash: false` with `normalizeCanonicalUrl()`; add `commercialZones` and `cityServiceHighlights` to `Cities` with `< 35%` similarity gate; and emit `Service` (`areaServed`) instead of fake branch `LocalBusiness` JSON-LD on city pages.
9. **`AUD-041` (DevOps Migrations):** Enforce Expand-and-Contract backward-compatible SQL migrations prior to container rollout.

---

## 3. `P2` — Medium-Priority Improvements (Enforce Across Milestones 3–5)

- **`AUD-011`:** Expand `src/env.ts` to validate all CRM, preview, cron, encryption, and email secrets.
- **`AUD-019` & `AUD-020`:** Store denormalized `actorEmail`/`actorRole` on `AuditLogs` and synchronize collection counts (`14 Collections + 5 Globals`).
- **`AUD-022` & `AUD-023`:** Enforce `Argon2id` (or PBKDF2 `>= 600,000` iterations) + max password length `128` + `sessionVersion` JWT invalidation.
- **`AUD-032` & `AUD-033`:** Enforce human review SOP for AI product scenes and pharmacy blog posts.
- **`AUD-034` & `AUD-038`:** Complete the 5 remaining metadata table rows in `10` and split Arabic/Latin variable font preloading by active locale.
- **`AUD-042`–`AUD-044`:** Formalize `RPO <= 5m` / `RTO <= 30m` + S3 Object Lock, cache `/api/health` DB checks for `5s`, and add negative security tests `AC-CMS-25`–`AC-CMS-28`.

