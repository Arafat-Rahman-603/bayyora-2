# 17 — Security & Production Release Readiness Checklist

**Project:** Bayyora (بيّورا)  
**Document Version:** 1.0  
**Purpose:** Mandatory pre-implementation and pre-production release verification gate.

---

## Gate 1: Pre-Implementation Architecture & Skill Sign-Off (Current Phase)

- [x] **Next.js + Payload CMS 3.x + PostgreSQL Architecture Defined:** WordPress retired across all 29 documents (`00`–`28`).
- [x] **Workspace UI/UX, Frontend Design & Motion Skills Installed:** `ui-ux-pro-max`, `frontend-design`, `web-design-guidelines`, and `web-animation-design` verified and installed under `.agents/skills/` (`28-SKILL-INSTALLATION-AND-INVENTORY.md`).
- [x] **WCAG 2.2 AA & Calibrated Color System Defined:** `#C7441F` (`4.95:1`) and `--color-border-input: #7A869A` (`>= 3.3:1`) specified in `25-DESIGN-SYSTEM-SPECIFICATION.md` and `27-ACCESSIBILITY-DESIGN-STANDARDS.md`.
- [x] **Independent 13-Specialist Master Audit Completed:** All 34 findings documented in `18-FINAL-FINDINGS-REGISTER.md` with concrete remediations in `16-REMEDIATION-ROADMAP.md`.
- [ ] **Owner Explicit Authorization (`APPROVED TO IMPLEMENT`):** Required before creating `package.json` or writing any application source code.

---

## Gate 2: Mandatory Security & Engineering Controls (Must Pass Before Production Launch)

- [ ] **Local API Access Control (`AUD-001`, `AUD-024`):** Every public RSC call to `payload.find()` / `payload.findGlobal()` sets `overrideAccess: false`, GraphQL is disabled (`graphQL: { disable: true }`), and anonymous REST `access.read` enforces `{ _status: { equals: 'published' } }`.
- [ ] **Locale-Level Publishing & SEO Gate (`AUD-002`, `AUD-035`):** `seo.noIndex` is localized (`localized: true`), `trailingSlash: false` is normalized across all canonicals/`hreflang` tags, and `sitemap.ts` only emits locale URLs where `translationStatus[locale] === 'published'`.
- [ ] **Draft Mode Isolation (`AUD-003`):** `/api/draft` verifies an active Payload admin session (`payload.auth({ headers })`) + `PREVIEW_SECRET` + internal relative path regex, and bypasses `unstable_cache` when `draftMode().isEnabled` is true.
- [ ] **Field-Level RBAC & Privilege Escalation Prevention (`AUD-005`, `AUD-016`):** Field-level `access.update` locks `Users.roles` to `Owner`, compliance checkboxes (`clientPermissionVerified`, `sfdaComplianceVerified`, `mawthooqLicenseVerified`, `isLegalPage`) to `Owner`/`Administrator`, and `_status: 'published'` to authorized publishing roles.
- [ ] **XSS & Upload Hardening (`AUD-006`, `AUD-026`, `AUD-027`, `AUD-028`):** JSON-LD escapes `<` (`\u003c`), split CSP + HSTS + `nosniff` headers active, `file-type` magic-byte checks active, EXIF GPS stripped from all uploads, and `sharp` `limitInputPixels` enforced.
- [ ] **Saudi PDPL, Legal & CRM Resilience (`AUD-015`, `AUD-029`, `AUD-030`):** PDPL consent checkbox + version/timestamp recorded on forms, `LeadSubmissions.payloadJson` encrypted with AES-256-GCM, 90-day PII retention purge active, `idempotencyKey` active on GHL sync, and `/privacy` + `/terms` reviewed.
- [ ] **Automated CI/CD Quality Gates:** `tsc --noEmit`, ESLint, Vitest, Playwright RTL/LTR E2E (`AC-CMS-01`–`AC-CMS-28`), `@axe-core/playwright` (`wcag22aa`), and Lighthouse CI (`Performance >= 90`, `Accessibility >= 95`, `Best Practices >= 95`, `SEO = 100`) all passing on real build artifacts.

