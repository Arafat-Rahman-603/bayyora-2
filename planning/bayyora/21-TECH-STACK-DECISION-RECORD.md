# 21 — Architecture & Tech Stack Decision Record (ADR)

**Project:** Bayyora (بيّورا)  
**Author:** Agent 5 (Technical Architecture Agent)  
**Inputs:** Owner Architecture Mandate (§1), `08-NEXTJS-TECHNICAL-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md`  
**Status:** Complete Technology Evaluation & Selection Record (Planning-Only Mode)

---

## 1. ADR-001: Integrated CMS Selection — Why Payload CMS 3.x

### 1.1 Evaluation of Candidates
| Evaluation Dimension | **Payload CMS 3.x (Selected)** | **Sanity (Cloud SaaS)** | **Strapi v5** | **WordPress (Retired)** |
| :--- | :--- | :--- | :--- | :--- |
| **Next.js App Router Integration** | **100% Native.** Installs directly inside `src/app/(payload)` in the same Next.js repository and runs on the same server. | Studio can be embedded, but content lives in external proprietary cloud requiring network API fetches. | Requires running and hosting a separate Node.js backend service and separate repository/build. | Separate PHP/MySQL stack (**Explicitly retired by Owner Mandate**). |
| **Data Fetching Performance** | **Local API (`payload.find()`)** queries PostgreSQL directly inside React Server Components with **0ms HTTP serialization overhead**. | Requires HTTPS GROQ API round-trips to Sanity servers. | Requires REST/GraphQL network round-trips between Next.js and Strapi. | Requires WPGraphQL/REST HTTP calls. |
| **Type Safety** | **Native TypeScript Codegen (`payload-types.ts`)** from collection configs; 100% shared types between DB, CMS, and React components. | Requires external typegen CLI and GROQ query annotations. | Partial/fragile TypeScript generation across separate repos. | No native end-to-end TypeScript safety. |
| **Licensing & Ownership** | **MIT Open-Source License.** 100% self-hosted data ownership; `$0` per-seat or per-record SaaS fees. | Proprietary cloud DB; per-seat fees scale sharply as team grows (`$15–$99+/user/mo`). | Community edition restricts custom RBAC roles behind Enterprise paywall. | GPL, plugin subscription sprawl. |
| **Arabic (`ar` RTL) & English (`en` LTR) Localization** | Built-in field-level localization (`ar` & `en`) with RTL admin field support, per-locale versions, and `fallback: false` control. | Requires document-level or field-level workarounds that complicate relational references. | i18n plugin duplicates entire rows per locale, complicating shared non-localized fields. | Requires paid third-party plugins (Polylang Pro / WPML). |
| **Security & RBAC** | Code-defined, version-controlled collection and field-level access functions (`Owner`, `Admin`, `Editor`, `SEO Manager`, `Arabic Translator`, `Viewer`) included free under MIT license. | Custom roles require Enterprise/Growth tier. | Custom granular roles require paid tier. | Plugin-dependent. |

**Decision:** Adopt **Payload CMS 3.x (`@payloadcms/next`)** embedded directly inside the Next.js App Router application.

---

## 2. ADR-002: Primary Database Selection — Why PostgreSQL over MongoDB

*(Full 8-point comparison matrix is documented in `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md` §1.)*
- **Decision:** Select **PostgreSQL 16+ (`@payloadcms/db-postgres` powered by Drizzle ORM)**.
- **Core Rationale:**
  1. Enforces database-level relational integrity across `Services`, `Packages`, `Projects`, `Cities`, `Faqs`, and `Media` (`ON DELETE RESTRICT` prevents deleting in-use images).
  2. Generates deterministic, Git-tracked SQL migration files (`src/migrations/`) for safe Dev $\rightarrow$ Staging $\rightarrow$ Production deployments.
  3. Stores localized fields in indexed `*_locales` tables for fast SQL queries and clean translation-completeness reporting.
  4. Supports continuous WAL Point-in-Time Recovery (PITR) at low operational cost.

---

## 3. ADR-003: Supporting Libraries & Tooling Matrix

Every supporting dependency has been evaluated against strict criteria: **Does it solve a real problem for Bayyora without inflating client JavaScript bundle size?**

| Category | Evaluated & Recommended Package | Specific Role in Bayyora | Why Selected / Client Bundle Impact |
| :--- | :--- | :--- | :--- |
| **Runtime Validation** | **`zod`** | Validates `/free-audit` and `/contact` forms, Next.js Server Action payloads, startup `process.env` (`src/env.ts`), and custom JSON-LD schemas. | Industry standard TypeScript-first validator; shared between client forms and Server Actions (`~13 KB` gzipped). |
| **Form State Management** | **`react-hook-form` + `@hookform/resolvers`** | Powers the 6-field Free Mini Audit form (`/free-audit`) and Contact form (`/contact`) with accessible inline RTL/LTR error announcements (`role="alert"`). | Uncontrolled input architecture causes zero unnecessary re-renders on mobile devices (`~9 KB` gzipped, loaded only on pages with forms). |
| **Iconography** | **`lucide-react` + Custom Brand SVGs** | Provides clean, consistent stroke icons for Services, Pain cards, and Admin tools, paired with custom inline SVGs for Bayyora's **Rising Line** and **WhatsApp** icons. | Fully tree-shaken in Next.js Server Components (**0 KB client JS** when rendered inside Server Components). |
| **Accessible UI Primitives** | **Selective Radix UI / `shadcn/ui`** (`@radix-ui/react-dialog`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-direction`) | Powers the mobile navigation drawer (focus trap, `Esc` close, `aria-expanded`), the 9-service desktop header dropdown, and accessible tabs/modals with native RTL (`dir="rtl"`) support. | Copy-owned source components in `src/components/ui/` styled with Tailwind tokens. Note: For simple FAQs, we use **native HTML `<details><summary>`** (`0 KB` JS) rather than heavy JS accordions! |
| **Internationalization Routing** | **`next-intl`** *(or Lightweight App Router `[locale]` Middleware)* | Handles `[locale]` routing (`/` for `ar`, `/en/` for `en` via `localePrefix: 'as-needed'`), `Link` localization, and date/number formatting. | Native Next.js App Router RSC support with minimal footprint. |
| **Image Optimization** | **`next/image` + `sharp` + `@payloadcms/storage-s3`** | Resizes uploaded assets in Payload into `WebP` and `AVIF` variants stored on S3/Cloudflare R2 and serves responsive `srcset` tags with automatic lazy loading and aspect-ratio preservation. | Native to both Next.js and Payload 3.x; `0 KB` client bundle cost. |
| **Font Optimization** | **`next/font/local`** | Self-hosts `Readex Pro` (`arabic` and `latin` WOFF2 subsets) with automatic preload headers, `font-display: swap`, and metric-matched fallback font generation. | Eliminates external `fonts.googleapis.com` DNS/TLS round-trips and prevents font-swap CLS. |
| **Code Quality & Formatting** | **`eslint` (`eslint-config-next`, `typescript-eslint`) + `prettier` (`prettier-plugin-tailwindcss`)** | Enforces strict TypeScript rules, React Hooks rules, `jsx-a11y` accessibility checks, and deterministic Tailwind class ordering. | Dev-only (`0 KB` production impact). |
| **Unit & Integration Testing** | **`vitest` + `@testing-library/react`** | Fast TypeScript unit and integration tests for Zod schemas, Arabic digit normalization, WCAG contrast validator, SEO metadata builders, and Server Actions. | Fast ESM/TypeScript execution; dev-only. |
| **E2E, A11y & SEO Testing** | **`@playwright/test` + `@axe-core/playwright` + `@lhci/cli`** | Automated browser testing of all 54 AR/EN routes, CMS Admin publishing workflows, WCAG 2.1 AA accessibility checks, and Lighthouse `100/100` SEO verification. | Dev/CI-only. |
| **Logging & Error Tracking** | **`pino` + `@sentry/nextjs`** | Structured JSON server logging (built into Payload 3.x) with PII redaction + real-time production exception alerting. | Lightweight server instrumentation. |

---

## 4. Explicitly Rejected Dependencies (Avoiding Bloat)

To protect maintainability and the **90+ Mobile Lighthouse Performance** target, the following libraries are **explicitly excluded**:
1. **No Global Client State Libraries (`redux`, `zustand`, `mobx`):** Unnecessary because 90%+ of Bayyora's UI is rendered by React Server Components from cached Payload Local API queries.
2. **No Heavy Animation Frameworks (`framer-motion` / `gsap`) in the Global Bundle:** All hover lifts, sticky header transitions, and button press states use hardware-accelerated native CSS transitions (`transition-transform`, `transition-colors`) with `@media (prefers-reduced-motion: reduce)` support.
3. **No CSS-in-JS Runtime Libraries (`styled-components`, `@emotion/react`):** Incompatible with zero-JS React Server Components and replaced by Tailwind CSS + CSS Custom Properties.
4. **No `axios` or `lodash`:** Native `fetch` and modern ES2023+ TypeScript methods are used throughout.

*(Note: At implementation time, all selected package versions will be verified against official Next.js and Payload CMS compatibility matrices prior to installation.)*



---

## 5. ADR-004: Animation & Motion Architecture (`motion/react` + CSS Transitions)

- **Context:** Bayyora requires polished, responsive micro-interactions (button press feedback, origin-aware dropdowns, direction-aware RTL/LTR mobile navigation drawer, FAQ accordion, Seasonal Campaign & Portfolio filter tab indicators, and an interactive Before/After transformation slider) without sacrificing its `90+` mobile Lighthouse Performance target or `WCAG 2.2 AA` reduced-motion compliance.
- **Evaluated Candidates:**
  1. **CSS Transitions + Tailwind CSS (`0 KB` JS)**
  2. **Motion for React (`motion` package, imported via `motion/react`, `~15 KB` with `LazyMotion` + `domAnimation`)**
  3. **GSAP (`gsap` + `ScrollTrigger`, `~28–45 KB` JS)**
- **Decision:**
  - **Tier 1 (Default):** Use pure CSS transitions (`transform` and `opacity` only, `< 300ms`, `@media (hover: hover) and (pointer: fine)`) and Radix `data-[state=open|closed]` attributes for all standard UI feedback.
  - **Tier 2 (Interactive Client Islands):** Use **Motion for React (`motion/react`)** with `<LazyMotion features={domAnimation}>` and `<MotionConfig reducedMotion="user">` strictly for layout-morphing tab pills (`layoutId`), exit transitions (`AnimatePresence`), and spring gesture interactions (`BeforeAfterSlider`).
  - **GSAP Excluded:** Do not install `gsap` in the core bundle; Bayyora avoids scroll-jacking and complex multi-timeline pinned animations (`26-MOTION-AND-ANIMATION-SYSTEM.md`).
