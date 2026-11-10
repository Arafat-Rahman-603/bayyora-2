# 06 — Complete Application Security Audit (OWASP ASVS 5.0.0 & Top 10:2025)

**Project:** Bayyora (بيّورا)  
**Auditors:** Agent F (Application Security Engineer) & Cybersecurity Auditor  
**Frameworks Applied:** OWASP ASVS 5.0.0, OWASP Top 10:2025, Next.js 15 Security Guidance, Payload CMS 3.x Access Control Guidance  
**Primary Audited Files:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md`, `09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md`, `16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md`, `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md`, `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`

---

## 1. Security Assessment Summary Across All 10 Domains (Section 5)

| Security Domain | ASVS 5.0 / OWASP Top 10:2025 | Audit Status & Key Findings |
| :--- | :--- | :--- |
| **5.1 Authentication** | ASVS V2 / A07:2025 | **3 Findings (`AUD-021`, `AUD-022`, `AUD-023`):** `Users.mfaEnabled` (`17:176`) lacks a TOTP/WebAuthn implementation spec; PBKDF2 default iterations (`25,000`) need Argon2id / `>= 600,000` override + max password length (`128`); stateless JWTs need `sessionVersion` invalidation on role/password change. |
| **5.2 Authorization & RBAC** | ASVS V4 / A01:2025 | **3 Critical Findings (`AUD-001`, `AUD-005`, `AUD-024`):** Public RSC Local API omits `overrideAccess: false`; missing field-level access on `_status`, compliance checkboxes, and `Users.roles`; public Payload REST/GraphQL APIs (`/api/[...slug]`) need row-level `{ _status: { equals: 'published' } }` constraints and `graphQL: { disable: true }`. |
| **5.3 Next.js Security** | ASVS V1, V4 / A01, A05 | **3 Findings (`AUD-003`, `AUD-004`, `AUD-025`):** Unauthenticated `/api/draft` + cache poisoning risk; `next >= 15.2.4` required to mitigate `CVE-2025-29927` (`x-middleware-subrequest` bypass). |
| **5.4 Injection & XSS** | ASVS V5 / A03:2025 | **2 Findings (`AUD-006`, `AUD-026`):** Unescaped `<` in JSON-LD `JSON.stringify` (`19:65`) enables Stored XSS via `structuredDataOverride`; `instagramOrLink` (`09:75`) accepts `javascript:` URLs and spreadsheet formula triggers (`=`, `+`, `-`, `@`). |
| **5.5 CSRF, CORS & Headers** | ASVS V14 / A05:2025 | **1 High Finding (`AUD-027`):** `01-PRD.md:110` requires CSP, HSTS, and security headers, but `20-SECURITY-PERFORMANCE-AND-DEVOPS.md` omits the header specification (and must use `frame-ancestors 'self'` so Payload Split-Screen Live Preview iframe continues working). |
| **5.6 File Upload Security** | ASVS V12 / A04, A05 | **1 High Finding (`AUD-028`):** Missing magic-byte (`file-type`) verification, missing EXIF GPS coordinate stripping on original smartphone shop photos, and missing `sharp({ limitInputPixels })` decompression-bomb guard. |
| **5.7 API & Webhooks** | ASVS V13 / A08:2025 | **1 High Finding (`AUD-029`):** Missing idempotency keys (`idempotencyKey`) and `CRON_SECRET` authentication on `LeadSubmissions` GHL retry jobs; unvalidated `postMessage` origin in `GhlCalendarEmbed`. |
| **5.8 Secrets & Env** | ASVS V6, V14 / A02 | **Verified Clean in Git History (`0` leaked secrets); 1 Spec Gap (`AUD-011` & `AUD-030`):** `LeadSubmissions` claims encryption (`09:25`, `17:175`) without defining AES-256-GCM hooks or `LEAD_PII_ENCRYPTION_KEY` in `src/env.ts`. |
| **5.9 Abuse Protection** | ASVS V1.10 / A04 | **1 High Finding (`AUD-031`):** In-memory LRU rate limiting (`20:56`) resets across serverless instances and trusts spoofable `X-Forwarded-For` headers; static honeypot needs Cloudflare Turnstile (Non-Interactive/Managed). |
| **5.10 Privacy & PDPL** | Saudi PDPL | **1 High Finding (`AUD-030`):** Missing explicit `privacyConsentAccepted` + `consentTimestamp` + `privacyPolicyVersion` fields in `auditFormSchema`/`LeadSubmissions`, and missing 90-day PII auto-purge job. |

---

## 2. Detailed Security Findings (`AUD-006`, `AUD-021`–`AUD-028`, `AUD-031`)

### Finding `AUD-006` — Stored XSS via Unescaped JSON-LD Serialization (`<script type="application/ld+json">`)
- **Severity:** **Critical** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:75`; `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md:65`
- **Evidence:** `19:65` injects JSON-LD via `<script type="application/ld+json">` and `17:75` allows custom `structuredDataOverride` JSON per page.
- **Problem & Impact:** `JSON.stringify(data)` does not escape `</script>`. Any string field in `structuredDataOverride`, `Faqs.answer`, or `Posts.title` containing `</script><script>...` breaks out of the script tag and executes arbitrary JavaScript in visitors' browsers.
- **Recommendation:** Serialize all JSON-LD with `.replace(/</g, '\\u003c').replace(/>/g, '\\u003e')` in `src/seo/json-ld.ts`.
- **Priority:** `P0` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-024` — Public Payload REST (`/api/[...slug]`) & GraphQL (`/api/graphql`) Exposure Without Row-Level `_status === 'published'` Constraints
- **Severity:** **Critical** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md:111`; `20-SECURITY-PERFORMANCE-AND-DEVOPS.md:45-53`
- **Evidence:** Payload mounts `/api/[...slug]/route.ts` (`08:111`). `20:45` mentions collection-level `access.read` without specifying row-level query filters for anonymous callers or disabling GraphQL.
- **Problem & Impact:** If `access.read: () => true` is configured on public collections, unauthenticated requests to `/api/projects?draft=true` return unpublished drafts, and `/api/projects` exposes `clientPermissionNote` (`17:142`) unless field-level `access.read` is restricted.
- **Recommendation:** Set `graphQL: { disable: true }` in `payload.config.ts`; configure anonymous `access.read` to return `{ _status: { equals: 'published' } }`; and add field-level `access.read: isAuthenticatedAdmin` on `Projects.clientPermissionNote` and `StatisticsBlock.verificationSourceNote`.
- **Priority:** `P0` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-021` — Phantom MFA Field (`Users.mfaEnabled`) Without TOTP/WebAuthn Implementation Spec
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:176`; `20-SECURITY-PERFORMANCE-AND-DEVOPS.md:39-43`
- **Problem & Impact:** Payload CMS 3.x does not provide native 2FA/TOTP out of the box. Defining `mfaEnabled` in `17:176` without a TOTP/WebAuthn challenge flow leaves `Owner` and `Administrator` accounts protected by single-factor passwords only.
- **Recommendation:** Implement TOTP (`otplib`) or WebAuthn passkeys (`@simplewebauthn/server`) in Payload's auth flow and require MFA enrollment for `owner` and `admin` roles.
- **Priority:** `P1` | **Complexity:** Medium | **Approval Required:** No

---

### Finding `AUD-025` — Next.js Middleware Bypass Risk (`CVE-2025-29927`) If Version `< 15.2.3` Is Installed
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/20-SECURITY-PERFORMANCE-AND-DEVOPS.md:42, 56`; `21-TECH-STACK-DECISION-RECORD.md:15`
- **Problem & Impact:** Next.js `< 15.2.3` is vulnerable to `CVE-2025-29927` (`x-middleware-subrequest` header bypass).
- **Recommendation:** Pin `next >= 15.2.4` in `package.json` and strip `x-middleware-subrequest` at the reverse proxy/CDN edge.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-026` — Unsanitized `instagramOrLink` Input Allows `javascript:` URLs, SSRF & CSV Formula Injection
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md:75`
- **Evidence:** `09:75` validates `instagramOrLink` with `z.string().trim().max(255).optional()`.
- **Problem & Impact:** Accepts `javascript:alert(1)`, internal cloud metadata URLs (`http://169.254.169.254`), and spreadsheet formula payloads (`=HYPERLINK(...)`).
- **Recommendation:** Validate `instagramOrLink` with a strict Zod union permitting only `@handle` (`/^[a-zA-Z0-9._]{1,60}$/`) or public `https://`/`http://` URLs, and strip/escape leading `=`, `+`, `-`, `@` across all lead text fields.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-027` — Missing Production HTTP Security Headers & Split-CSP Specification
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/01-PRD.md:110`; `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`
- **Problem & Impact:** `01-PRD.md:110` requires CSP and HTTPS headers, but `20-SECURITY-PERFORMANCE-AND-DEVOPS.md` omits them.
- **Recommendation:** Configure `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a split Content-Security-Policy (`frame-ancestors 'self'` to allow Payload Split-Screen Live Preview iframes, plus explicit allowlists for GTM/GA4 and `https://api.leadconnectorhq.com` for the GHL Calendar embed).
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-028` — File Upload Security Gaps: Magic Bytes, EXIF GPS Metadata Leak & Sharp Pixel Flood DoS
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/20-SECURITY-PERFORMANCE-AND-DEVOPS.md:59-62`; `16-CMS-ADMIN-ARCHITECTURE.md:100-103`
- **Recommendation:** Verify file magic bytes (`file-type` library) in a `Media` `beforeOperation` hook; strip EXIF GPS metadata from both the original upload and all resized variants via `sharp`; set `sharp({ limitInputPixels: 36_000_000 })`; and serve S3/R2 uploads with `X-Content-Type-Options: nosniff` and `Content-Security-Policy: sandbox`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-031` — In-Memory Rate Limiting Failure in Serverless & `X-Forwarded-For` Spoofing
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/20-SECURITY-PERFORMANCE-AND-DEVOPS.md:56-58`
- **Recommendation:** Use distributed rate limiting (Upstash Redis / Cloudflare WAF or PostgreSQL atomic counters), read client IPs only from verified proxy headers (`cf-connecting-ip` / `x-real-ip`), and add non-interactive Cloudflare Turnstile to `/free-audit` and `/contact`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

