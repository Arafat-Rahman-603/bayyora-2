# 03 — Code Quality & TypeScript Audit (Agent C)

**Project:** Bayyora (بيّورا)  
**Auditor:** Agent C (TypeScript & React Specialist)  
**Primary Audited Files:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md`, `09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md`, `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md`, `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`, `21-TECH-STACK-DECISION-RECORD.md`

---

## 1. TypeScript & Code Quality Verification Status
- **Runtime Code Status:** Pre-implementation (`0` `.ts`/`.tsx` files exist in the repository yet).
- **Specification Type-Safety Audit:** We audited all type contracts, React 19 / Next.js 15 API signatures, Zod schemas, and environment validation rules across the planning suite.

---

## 2. TypeScript & Code Quality Findings

### Finding `AUD-010` — React 19 vs. React 18.3+ Contradiction & Synchronous `params` Signature in Next.js 15 Specs
- **Category:** TypeScript / Next.js 15 Compatibility
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md:17, 161`; `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md:35`
- **Evidence:**
  - `08:17` lists `React 19 / 18.3+`, while `08:161` uses `useActionState` (which is a React 19-only hook) and `@payloadcms/next` 3.x requires **React 19 + Next.js 15**.
  - `19:35` depicts synchronous `generateMetadata({ params })`, whereas in Next.js 15 `params` and `searchParams` are typed as `Promise<{ locale: 'ar' | 'en'; slug?: string }>`.
- **Problem & Impact:** Using synchronous `params.locale` in Next.js 15 fails `tsc --noEmit` under `strict: true`, and installing React 18.3 with Payload 3.x causes fatal peer-dependency and missing `useActionState` errors.
- **Recommendation:** Pin `react@^19.0.0`, `react-dom@^19.0.0`, and `next@>=15.2.4`, and type all page/layout props with `params: Promise<{ locale: 'ar' | 'en'; slug: string }>`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-011` — Incomplete `src/env.ts` Zod Schema Omitting Required CRM, Preview, Encryption, and Email Variables
- **Category:** TypeScript / Runtime Validation (`@t3-oss/env-nextjs`)
- **Severity:** **Medium** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/20-SECURITY-PERFORMANCE-AND-DEVOPS.md:63-64`; `09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md:40-44`
- **Evidence:** `20:64` defines `src/env.ts` with only `DATABASE_URI`, `PAYLOAD_SECRET`, `REVALIDATION_SECRET`, `GHL_WEBHOOK_SECRET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `NEXT_PUBLIC_SITE_URL`, and `NEXT_PUBLIC_GTM_ID`.
- **Problem & Impact:** `09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md` and `16-CMS-ADMIN-ARCHITECTURE.md` also require `GHL_API_KEY`, `GHL_LOCATION_ID`, `PREVIEW_SECRET` (for `/api/draft`), `CRON_SECRET` (for background lead retry), `LEAD_PII_ENCRYPTION_KEY` (for `LeadSubmissions` AES-256-GCM encryption), and `RESEND_API_KEY` / `SMTP_URI` (for fallback lead alerts). Any code reading those via raw `process.env.*` bypasses type-safe startup validation.
- **Recommendation:** Expand `src/env.ts` in `20-SECURITY-PERFORMANCE-AND-DEVOPS.md:64` to validate all required server and client environment variables via Zod and add an ESLint `no-process-env` rule outside `src/env.ts`.
- **Priority:** `P2` | **Complexity:** Small | **Approval Required:** No

