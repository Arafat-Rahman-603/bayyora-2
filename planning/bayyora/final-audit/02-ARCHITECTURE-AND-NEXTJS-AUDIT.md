# 02 — Architecture & Next.js App Router Audit (Agents A & B)

**Project:** Bayyora (بيّورا)  
**Auditors:** Agent A (Principal Software Architect) & Agent B (Senior Next.js Architect)  
**Primary Audited Files:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md`, `16-CMS-ADMIN-ARCHITECTURE.md`, `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md`, `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`, `21-TECH-STACK-DECISION-RECORD.md`

---

## 1. Architectural Strengths Confirmed
- **Zero WordPress Regressions:** Verified across all 29 planning documents (`00`–`28`) that WordPress, PHP, and MySQL have been completely retired in favor of Next.js App Router + Payload CMS 3.x + PostgreSQL.
- **Clean Route Group Isolation:** Separating `src/app/(frontend)/[locale]/` from `src/app/(payload)/admin/` (`08-NEXTJS-TECHNICAL-ARCHITECTURE.md:94-112`) prevents Payload Admin CSS/JS from leaking into the public marketing bundle.
- **Server-First Component Boundary:** Keeping 85%+ of sections as React Server Components and isolating interactivity into small Client Islands (`HeaderClientDrawer`, `SeasonalCampaignTabs`, `PortfolioFilterGrid`, `BeforeAfterSlider`, `FaqAccordion`, `FreeAuditForm`, `ContactForm`) is architecturally sound.

---

## 2. Detailed Architectural & Next.js Findings

### Finding `AUD-001` — Public Server Component Local API Calls Omit `overrideAccess: false`
- **Category:** Architecture / Next.js / Security
- **Severity:** **Critical** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md:46-47, 159, 170-176`; `20-SECURITY-PERFORMANCE-AND-DEVOPS.md:46-47`
- **Evidence:** `20-SECURITY-PERFORMANCE-AND-DEVOPS.md:46` states: *"Whenever calling `payload.find()` or `payload.update()` on behalf of an authenticated user, `overrideAccess: false` and `user: req.user` must be passed."* It omits anonymous public RSC queries in `src/lib/payload-queries.ts`.
- **Problem & Impact:** Payload's Local API defaults to `overrideAccess: true`, bypassing `access.read` on restricted fields like `Packages.internalPriceSar` (`17:134`) and `Projects.clientPermissionNote` (`17:142`). Passing those objects as props to Client Components serializes confidential pricing and client notes into the public HTML RSC payload.
- **Recommendation:** Enforce `overrideAccess: false` (with `user: undefined`) and explicit `select` field projections on every public query in `src/lib/payload-queries.ts`.
- **Priority:** `P0` | **Complexity:** Small | **Approval Required:** No (Mandatory Security Fix)

---

### Finding `AUD-003` — Draft Mode (`draftMode()`) & `unstable_cache` Key Collision Poisoning Public Cache
- **Category:** Next.js Caching / Revalidation
- **Severity:** **Critical** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md:46-47, 168-176`; `16-CMS-ADMIN-ARCHITECTURE.md:133-135`
- **Evidence:** `08:46` wraps Local API queries in `unstable_cache(async () => payload.find(...), ['page', slug, locale], { tags: [...] })` without branching on `(await draftMode()).isEnabled`.
- **Problem & Impact:** If an administrator opens Live Preview (`/api/draft`), calling the cached function with `draft: true` under the same cache key (`['page', slug, locale]`) writes uncommitted draft data into the public cache served to anonymous visitors.
- **Recommendation:** In `src/lib/payload-queries.ts`, check `const { isEnabled: isDraft } = await draftMode()`. When `isDraft` is `true`, bypass `unstable_cache` completely and call `payload.find({ draft: true, overrideAccess: false, user })`.
- **Priority:** `P0` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-004` — Edge Runtime Incompatibility in `src/middleware.ts` & `/admin` Locale Rewrite Loop
- **Category:** Next.js Middleware / Architecture
- **Severity:** **Critical** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md:82-87`; `20-SECURITY-PERFORMANCE-AND-DEVOPS.md:43`
- **Evidence:** `08:86` states *"Middleware also checks the cached `Redirects` table"*, and `20:43` states `"/admin/* and mutating /api/* routes are protected by both Next.js Middleware..."`
- **Problem & Impact:**
  1. Payload Local API (`@payloadcms/db-postgres` / `pg`) requires Node.js TCP sockets and cannot be imported in Next.js Edge Middleware.
  2. Running `next-intl` locale middleware on `/admin/*` or `/api/*` rewrites `/admin` to `/ar/admin` (404).
- **Recommendation:** Exclude `/admin`, `/api`, `/_next`, and static files from the `middleware.ts` locale matcher, and evaluate CMS `Redirects` inside the Node.js Server Component catch-all / `notFound` boundary (or via an edge-cached JSON map).
- **Priority:** `P0` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-007` — Unconditional `revalidateTag()` / `revalidatePath()` in Payload `afterChange` Hooks Crashes Seed Scripts
- **Category:** Next.js / Payload CMS Integration
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md:173-175`; `13-IMPLEMENTATION-ROADMAP.md:49`
- **Evidence:** `08:173` calls `revalidateTag` and `revalidatePath` directly inside Payload `afterChange` hooks, while `13:49` runs a standalone CLI seed script (`src/seed/`).
- **Problem & Impact:** Calling `revalidateTag()` or `revalidatePath()` outside a Next.js HTTP request context (such as during `pnpm seed` or CLI jobs) throws `Invariant: static generation store missing in revalidateTag`.
- **Recommendation:** Guard all revalidation hooks with `if (context.disableRevalidate) return doc;` and wrap `revalidateTag` / `revalidatePath` calls in `try / catch`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-008` — Missing `generateStaticParams()` & `setRequestLocale()` Opts `[locale]` Routes into Dynamic Rendering
- **Category:** Next.js Rendering & Caching
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md:95-108`; `20-SECURITY-PERFORMANCE-AND-DEVOPS.md:22-25`
- **Evidence:** `20:23` promises `< 80ms` static edge caching on public pages, but `08:95-108` omits `generateStaticParams()` and `setRequestLocale(locale)`.
- **Problem & Impact:** In Next.js 15 App Router with `next-intl`, omitting `generateStaticParams()` and `setRequestLocale(locale)` in `[locale]/layout.tsx` forces every page into Dynamic Rendering (`λ`), defeating static edge caching.
- **Recommendation:** Export `generateStaticParams()` (`[{ locale: 'ar' }, { locale: 'en' }]`) and call `setRequestLocale(locale)` in `[locale]/layout.tsx` and all child page routes.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-009` — Duplicate Homepage Route (`/home` & `/en/home`) and Unprotected Reserved Slugs
- **Category:** Next.js Routing / SEO
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md:96, 99`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:87`
- **Evidence:** Homepage is stored in `Pages` with `slug: 'home'` (`08:96`), while `[locale]/[slug]/page.tsx` (`08:99`) renders any `Pages` record by `slug`.
- **Problem & Impact:** Requesting `/home` or `/en/home` renders a duplicate copy of `/` and `/en`, and editing the `home` slug in Payload Admin breaks `/` with a 404.
- **Recommendation:** In `[locale]/[slug]/page.tsx`, if `slug === 'home'`, execute `permanentRedirect(locale === 'ar' ? '/' : '/en')`. Lock `slug` read-only on system pages and block reserved slugs (`admin`, `api`, `blog`, `city`).
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

