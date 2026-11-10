# 23 — Updated Master Requirement Traceability Matrix (v2.0 — Next.js & Payload CMS)

**Project:** Bayyora (بيّورا)  
**Authors:** Agent 0 (Project Orchestrator) & Agent 1 (PRD Agent)  
**Date:** 8 November 2026  
**Scope:** End-to-End Traceability Across All 24 Planning Documents (`00` through `23`)

---

## 1. Business & Brand Requirements Traceability (`BR-xxx`)

| Source Reference | PRD v2.0 Req ID | Requirement Summary | Responsible Agent | Related Planning Document(s) | Verification / Acceptance Criterion ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Doc A` §2 ("The site's one job") | **`BR-001`** | Consultative lead generation via WhatsApp, Free Mini Audit, or Shop Visit booking. | Agent 1, Agent 3, Agent 6 | `01-PRD.md`, `06-UX-AND-USER-JOURNEYS.md`, `09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md` | `AC-FUNC-01`, `AC-FUNC-02`, `AC-INT-01`, `AC-INT-02` |
| `Doc A` §1 (Name, Tagline, Logo, Font) | **`BR-002`** | Confirmed name `Bayyora (بيّورا)` (with shadda), tagline `خطوة لفوق / One step up`, Rising Line motif, and `Readex Pro`. | Agent 2 | `00-PROJECT-SOURCE-AUDIT.md`, `03-BRAND-AND-DESIGN-SYSTEM.md` | `AC-DES-01`, `AC-DES-02`, `AC-DES-03` |
| `Doc A` §1, §2, §3.4 & Owner Mandate §2.6 | **`BR-003`** | Quote-only pricing model (zero public prices on site; `publicPricingEnabled = false` by default in CMS). | Agent 1, Agent 5B, Agent 8 | `01-PRD.md`, `16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md` | `AC-BIZ-01`, `AC-CMS-09` |
| `Doc A` §1, §2, §3.9 & Owner Mandate §2.8 | **`BR-004`** | Geographic focus on Al Ahsa, Hofuf, Mubarraz, Dammam, Khobar + CMS extensibility for future cities. | Agent 5B, Agent 7 | `05-INFORMATION-ARCHITECTURE-AND-SITEMAP.md`, `10-SEO-AND-LOCAL-SEO-STRATEGY.md`, `16-CMS-ADMIN-ARCHITECTURE.md` | `AC-IA-01`, `AC-CMS-11` |
| `Doc A` §2, §3.3 & Owner Mandate §2.5 | **`BR-005`** | All 9 service categories preserved + dynamic CMS extensibility for future services. | Agent 3, Agent 4, Agent 5B | `05-INFORMATION-ARCHITECTURE-AND-SITEMAP.md`, `07-BILINGUAL-CONTENT-STRATEGY.md`, `16-CMS-ADMIN-ARCHITECTURE.md` | `AC-FUNC-03`, `AC-CMS-08` |
| `Doc A` §3.4 & Owner Mandate §2.6 | **`BR-006`, `BR-007`** | 3 Monthly packages (`Bidaya`, `Numow`, `Riyada`) & 2 Starter bundles (`Look`, `Go Online`) with CMS-editable quantities. | Agent 4, Agent 5B, Agent 8 | `07-BILINGUAL-CONTENT-STRATEGY.md`, `11-BUSINESS-OPERATIONS-AND-COMPLIANCE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md` | `AC-FUNC-04`, `AC-CMS-09` |
| `Doc A` §3.7 | **`BR-008`** | 48-hour Free Mini Audit reviewing 6 checkpoints + 1-of-3 free sample gift. | Agent 6, Agent 8 | `09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md`, `11-BUSINESS-OPERATIONS-AND-COMPLIANCE.md` | `AC-INT-01` |
| `Doc A` §1, §2, §3 & Owner Mandate §2.4, §2.7 | **`BR-009`, `BR-010`** | Zero fake stats/testimonials; mandatory `نموذج توضيحي / Sample concept` badge; `Dawair` gated behind written client permission (`clientPermissionVerified`). | Agent 4, Agent 5B, Agent 8 | `07-BILINGUAL-CONTENT-STRATEGY.md`, `16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md` | `AC-BIZ-02`, `AC-BIZ-03`, `AC-CMS-07`, `AC-CMS-10` |
| `Doc A` §2, §3.11 | **`BR-011`, `BR-012`, `BR-014`** | Client account ownership guarantee, separate ad media budgets, and Saudi PDPL, SFDA, and Mawthooq compliance gates. | Agent 8 | `11-BUSINESS-OPERATIONS-AND-COMPLIANCE.md` | `AC-CMS-22` |

---

## 2. Public Bilingual Website Functional Traceability (`FR-xxx`)

| Source Reference | PRD v2.0 Req ID | Requirement Summary | Responsible Agent | Related Planning Document(s) | Verification / Acceptance Criterion ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Doc A` §2 & Owner Mandate §3 | **`FR-001`, `FR-002`, `FR-003`** | Arabic default at `/` (`dir="rtl"`), English under `/en/` (`dir="ltr"`), clean Latin slugs, context-preserving language switcher across all 27 routes (54 pages). | Agent 3, Agent 5 | `05-INFORMATION-ARCHITECTURE-AND-SITEMAP.md`, `08-NEXTJS-TECHNICAL-ARCHITECTURE.md` | `AC-IA-01`, `AC-IA-02`, `AC-CMS-15` |
| `Doc A` §2 & Owner Mandate §2.2, §2.3 | **`FR-004`, `FR-005`, `FR-021`** | Sticky responsive header (Sand $\rightarrow$ Najd Night on scroll), 9-service dropdown, visible mobile audit CTA, and 4-column global footer. | Agent 2, Agent 3, Agent 5B | `03-BRAND-AND-DESIGN-SYSTEM.md`, `05-INFORMATION-ARCHITECTURE-AND-SITEMAP.md`, `16-CMS-ADMIN-ARCHITECTURE.md` | `AC-IA-03`, `AC-IA-04`, `AC-IA-05`, `AC-CMS-02`, `AC-CMS-03` |
| `Doc A` §2, §3 | **`FR-006`, `FR-007`** | Floating WhatsApp button (`bottom-left` AR, `bottom-right` EN) & context-aware pre-filled WhatsApp messages. | Agent 3, Agent 4, Agent 6 | `06-UX-AND-USER-JOURNEYS.md`, `07-BILINGUAL-CONTENT-STRATEGY.md`, `09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md` | `AC-FUNC-01`, `AC-FUNC-02` |
| `Doc A` §3.1–§3.11 | **`FR-008`–`FR-020`** | Complete templates and block structures for Home, Services Hub, 9 Services, Packages, Our Work (with dual filter), Dawair Case Study, About, Free Audit, Contact, 5 Cities, FAQ, Blog, and 3 Legal pages. | Agent 3, Agent 4, Agent 5 | `05-INFORMATION-ARCHITECTURE-AND-SITEMAP.md`, `07-BILINGUAL-CONTENT-STRATEGY.md`, `08-NEXTJS-TECHNICAL-ARCHITECTURE.md` | `AC-FUNC-03`, `AC-FUNC-04`, `AC-FUNC-05`, `AC-CMS-06`–`AC-CMS-13` |

---

## 3. CMS, Admin Dashboard & Customization Traceability (`CMS-xxx`)

| Owner Mandate Ref | PRD v2.0 Req ID | Requirement Summary | Responsible Agent | Related Planning Document(s) | Verification / Acceptance Criterion ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| §1 (CMS & Database) | **`CMS-001`** | Integrated self-hosted Payload CMS 3.x inside Next.js App Router backed by PostgreSQL (`@payloadcms/db-postgres`). | Agent 5 | `08-NEXTJS-TECHNICAL-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md`, `21-TECH-STACK-DECISION-RECORD.md` | `AC-CMS-01`–`AC-CMS-24` |
| §2.1, §2.2, §2.3 | **`CMS-002`, `CMS-003`** | `SiteSettings`, `HeaderNav`, and `FooterNav` Globals managing all brand, contact, navigation, and footer data from a single source of truth. | Agent 5B | `16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md` | `AC-CMS-01`, `AC-CMS-02`, `AC-CMS-03` |
| §2.4 | **`CMS-004`** | 15-Block Brand-Safe Page Builder with drag-and-drop reordering, visibility toggles, and controlled layout variants. | Agent 5B | `16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md` | `AC-CMS-06`, `AC-CMS-07` |
| §2.5, §2.6 | **`CMS-005`** | Full CMS CRUD for all 9 Services (+ future services) and all Packages (`Bidaya`, `Numow`, `Riyada`, `Look`, `Go Online`) with editable deliverable quantities. | Agent 5B | `16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md` | `AC-CMS-08`, `AC-CMS-09` |
| §2.7, §2.8, §2.9, §2.10 | **`CMS-006`** | Full CMS CRUD for `Projects` (portfolio/case studies), `Cities` (extensible city pages), `Posts` (blog with scheduling), and `Faqs`. | Agent 5B | `16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md` | `AC-CMS-10`, `AC-CMS-11`, `AC-CMS-12`, `AC-CMS-13` |
| §2.11 | **`CMS-007`** | Centralized `Media` library with required AR/EN `alt` text, focal points, WebP/AVIF variants, SHA-256 deduplication, and `beforeDelete` reference check hook. | Agent 5, Agent 5B | `16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md` | `AC-CMS-14` |
| §2.12 | **`CMS-008`** | Centralized `ThemeSettings` design tokens with WCAG 2.1 AA contrast validation hook and CSS variable propagation. | Agent 2, Agent 5B | `03-BRAND-AND-DESIGN-SYSTEM.md`, `18-DESIGN-CUSTOMIZATION-AND-THEMING.md` | `AC-DES-04`, `AC-CMS-04`, `AC-CMS-05` |
| §3 | **`CMS-009`** | Independent `ar` / `en` localization, per-locale translation status tracking, missing translation warnings, and publication guards. | Agent 4, Agent 5B | `07-BILINGUAL-CONTENT-STRATEGY.md`, `16-CMS-ADMIN-ARCHITECTURE.md` | `AC-CMS-15` |
| §6, §7 | **`CMS-010`, `CMS-011`** | `Draft → Review → Live Preview → Publish → On-Demand Cache Revalidation`, 50-version history + rollback, 6-role RBAC, and immutable `AuditLogs`. | Agent 5B, Agent 8 | `16-CMS-ADMIN-ARCHITECTURE.md`, `20-SECURITY-PERFORMANCE-AND-DEVOPS.md` | `AC-CMS-20`–`AC-CMS-24` |

---

## 4. Technical Stack, Performance, SEO (100/100), Security & Integrations Traceability

| Owner Mandate Ref | PRD v2.0 Req ID | Requirement Summary | Responsible Agent | Related Planning Document(s) | Verification / Acceptance Criterion ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| §1, §5, §8 | **`NFR-001`–`NFR-005`** | Next.js App Router + TypeScript Strict + Tailwind CSS + RSC by default; Lighthouse targets: **Mobile Performance 90+, Accessibility 95+, Best Practices 95+, SEO 100/100**. | Agent 5, Agent 8, Agent 9 | `08-NEXTJS-TECHNICAL-ARCHITECTURE.md`, `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`, `21-TECH-STACK-DECISION-RECORD.md` | `AC-TECH-01`, `AC-TECH-02`, `AC-CROSS-01` |
| §4.1–§4.7 | **`SEO-001`–`SEO-004`** | Next.js `generateMetadata`, dynamic `sitemap.ts` & `robots.ts`, truthful Schema.org JSON-LD, Arabic/local SEO anti-doorway checks, and built-in CMS SEO Admin Tools + 301 redirect manager. | Agent 7 | `10-SEO-AND-LOCAL-SEO-STRATEGY.md`, `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md` | `AC-SEO-01`, `AC-CMS-16`, `AC-CMS-17`, `AC-CMS-18`, `AC-CMS-19` |
| §6, §10 | **`NFR-006`** | Authentication hardening, 6-role server-side RBAC, rate limiting, SVG/file upload validation, Zod `env.ts`, CI/CD pipeline, deterministic Drizzle SQL migrations, and PostgreSQL PITR backups. | Agent 8 | `20-SECURITY-PERFORMANCE-AND-DEVOPS.md` | `AC-CMS-22`, `AC-CMS-23`, `AC-CMS-24` |
| §9 | **`INT-001`–`INT-003`** | Server-side `CRMProvider` abstraction layer (`submitAuditAction`, `submitContactAction`), PostgreSQL fail-safe lead queue, lazy-loaded GHL Calendar, and consent-aware GTM/GA4/Meta/Snap pixels. | Agent 6 | `09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md` | `AC-INT-01`, `AC-INT-02`, `AC-INT-03` |



---

## 6. UI/UX, Design System, Motion & WCAG 2.2 AA Traceability (`24`–`28`)

| Requirement ID | Requirement Summary | Primary Specification | Verification / Gate |
| :--- | :--- | :--- | :--- |
| **`UI-SKILL-01`** | Workspace installation & verification of `ui-ux-pro-max`, `frontend-design`, `web-design-guidelines`, and `web-animation-design` under `.agents/skills/` | `24-UI-UX-SKILLS-AND-WORKFLOW.md`, `28-SKILL-INSTALLATION-AND-INVENTORY.md` | Verified in `.agents/skills/` (`py -3 .agents/skills/ui-ux-pro-max/scripts/search.py` tested) |
| **`DS-SYS-01`** | Centralized semantic color, fluid typography (`ar`/`en`), spacing, logical RTL/LTR grid, and 6-state component specifications | `25-DESIGN-SYSTEM-SPECIFICATION.md`, `18-DESIGN-CUSTOMIZATION-AND-THEMING.md` | `ThemeSettings` contrast validator + ESLint logical properties check |
| **`MOT-SYS-01`** | Centralized duration (`< 300ms` UI) and easing (`ease-out`, `ease-in-out`, `ease`) tokens using CSS transitions + `motion/react` (`LazyMotion`) | `26-MOTION-AND-ANIMATION-SYSTEM.md`, `21-TECH-STACK-DECISION-RECORD.md` (`ADR-004`) | Playwright reduced-motion E2E check + bundle budget gate |
| **`A11Y-WCAG22`** | Full **WCAG 2.2 Level AA** compliance including `SC 2.4.11` (Focus Not Obscured), `SC 2.5.7` (Dragging Alternatives), `SC 2.5.8` (Target Size), `SC 3.3.7` (Redundant Entry), and `SC 3.3.8` (Accessible Auth) | `27-ACCESSIBILITY-DESIGN-STANDARDS.md`, `12-QA-AND-ACCEPTANCE-CRITERIA.md` | `@axe-core/playwright` (`wcag22aa`) + keyboard bounding-box E2E tests |
