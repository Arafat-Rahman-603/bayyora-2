# 01 — Product Requirements Document (PRD) — v2.0 (Next.js + Payload CMS Architecture)

**Project:** Bayyora (بيّورا) — Bilingual Digital Agency Website, CMS & Lead Generation Platform  
**Author:** Agent 1 (PRD Agent — First Priority Specialist)  
**Reviewed By:** Agent 0 (Project Orchestrator)  
**Version:** 2.0 (Next.js App Router + Payload CMS + 100/100 Lighthouse SEO Revision — Planning Phase)  
**Date:** 8 November 2026  

---

## 1. Product Vision & Architectural Mandate

**Bayyora (بيّورا)** — derived from the Arabic **بيّن** (*bayyin*, "to stand out, to be clearly seen") — is a local-first creative and digital marketing agency built for small businesses and neighbourhood shops in Saudi Arabia, launching first in **Al Ahsa (Al-Hofuf and Al-Mubarraz)** and expanding to **Dammam** and **Khobar**.

Guided by the confirmed tagline **خطوة لفوق / One step up**, the Bayyora platform has **two core mandates**:
1. **Customer-Facing Mandate ("The Site's One Job"):** Convert local shop owners browsing on their phones into active conversations via **WhatsApp**, **Free Mini Audit requests (delivered within 48 hours)**, or **in-person shop visit bookings**.
2. **Owner & Operational Mandate (100% CMS-Driven Next.js Platform):** Deliver an ultra-fast, **Next.js App Router + TypeScript (Strict) + Tailwind CSS + Integrated Payload CMS + PostgreSQL** application where **practically all business content, pages, sections, services, package quantities, portfolio items, city pages, blog posts, navigation, design tokens, and SEO metadata are manageable by a non-technical administrator through the Admin Dashboard without editing source code**, while targeting **100/100 Lighthouse SEO** and **90+ Mobile Lighthouse Performance**.

---

## 2. Business Objectives & Requirements (`BR-xxx`)

| ID | Requirement Title | Description | Status | Source Ref |
| :--- | :--- | :--- | :--- | :--- |
| **BR-001** | **Consultative Lead Generation ("The Site's One Job")** | Every page and user journey must guide shop owners toward one of three primary conversions: (1) Starting a WhatsApp conversation, (2) Requesting a Free Mini Audit, or (3) Booking an in-person shop visit. | `[CONFIRMED]` | Doc A §2 |
| **BR-002** | **Confirmed Brand Identity** | Use confirmed brand name **Bayyora (بيّورا)** (always with shadda) and tagline **خطوة لفوق / One step up**, paired with the **Rising Line** motif and **Readex Pro** typography. | `[CONFIRMED]` | Doc A §1 |
| **BR-003** | **Quote-Only Pricing Policy (Default Disabled in CMS)** | Display zero public prices on the website by default. All packages, starter bundles, and services must list exact inclusions and route pricing inquiries to *"Request a quote / free mini audit"*. Price fields in the CMS remain disabled/hidden unless the owner explicitly toggles pricing policy later. | `[CONFIRMED]`<br>*(See OD-006)* | Doc A §1, §2, §3.4 |
| **BR-004** | **Geographic Rollout & Extensibility** | Target Saudi Arabia with initial city pages for **Al Ahsa**, **Hofuf**, **Mubarraz**, **Dammam**, and **Khobar**, while allowing admins to launch additional Saudi city pages from the CMS without developer intervention. | `[CONFIRMED]` | Doc A §1, §2, §3.9 |
| **BR-005** | **Nine Core Service Categories (+ CMS Extensibility)** | Present all 9 service categories accurately: (1) Brand & Identity, (2) Print & Shop Design, (3) Websites & Online Stores, (4) Social Media Management, (5) Video & Animation, (6) Photography, (7) Ads & Local Search, (8) WhatsApp & Follow-up, (9) Seasonal Campaigns — and allow admins to add future services dynamically via the CMS. | `[CONFIRMED]` | Doc A §2, §3.3 |
| **BR-006** | **Three Monthly Packages** | Present the 3 tiered monthly packages (**Bidaya / بداية**, **Numow / نمو**, **Riyada / ريادة**) with CMS-editable deliverable quantities and reporting cadences. | `[CONFIRMED]` | Doc A §3.4 |
| **BR-007** | **Two One-Time Starter Bundles** | Present the 2 starter bundles (**Look / لوك** and **Go Online / أونلاين**) with CMS-editable deliverables. | `[CONFIRMED]` | Doc A §3.4 |
| **BR-008** | **48-Hour Free Mini Audit Offer** | Offer a Free Mini Audit reviewing 6 checkpoints (Google Maps, Instagram, Snapchat, TikTok, Website if available, 3 competitors) plus 1 free sample gift (logo idea, sample post, or Maps fix), delivered via WhatsApp within 48 hours. | `[CONFIRMED]` | Doc A §3.7 |
| **BR-009** | **Truth in Proof & Sample Labelling** | Never invent testimonials, statistics, client logos, or guaranteed sales claims. Unapproved or conceptual portfolio items must be explicitly marked in the CMS and rendered with the badge **`نموذج توضيحي` / `Sample concept`**. | `[CONFIRMED]` | Doc A §1, §2, §3 |
| **BR-010** | **Dawair Client Permission Gate** | Reference first client **Dawair (دوائر)** (Hofuf restaurant; scope: Website + Social Media Management) as "coming soon / with client permission" until `clientPermissionVerified = true` is recorded in the CMS. | `[CONFIRMED]`<br>*(See OD-008)* | Doc A §1, §2, §3.5 |
| **BR-011** | **Client Account Ownership Guarantee** | Explicitly state across relevant pages that all client accounts (domains, hosting, social media, ad accounts, Google Maps) are registered in the client's name and remain client property. | `[CONFIRMED]` | Doc A §3.1, §3.3, §3.6, §3.10 |
| **BR-012** | **Ad Budget Separation** | Clearly state on Ads/Local Search and Packages pages that paid advertising media budgets are separate from Bayyora's management fees. | `[CONFIRMED]` | Doc A §3.3.7, §3.4, §3.11 |
| **BR-013** | **Phased Launch Execution** | Execute build in structured phases (Foundation & CMS Setup → Phase 1 Core Funnel → Phase 2 Full Bilingual Site → Phase 3 Proof, City Pages & Blog). | `[CONFIRMED]` | Doc A §2 |
| **BR-014** | **Regulatory Compliance (SFDA, Mawthooq, PDPL)** | Enforce SFDA review for pharmacy/medical content, Mawthooq licence verification for influencer campaigns, and Saudi PDPL compliance in data collection and Privacy Policy. | `[CONFIRMED]` | Doc A §2, §3.11 |

---

## 3. Target Users & Personas (Public Visitors & Admin Users)

### 3.1 Public Website Visitors
1. **Abu Fahad — Traditional Neighbourhood Shop / Pharmacy / Retail Owner (Al Ahsa):** 35–55, browses on mobile in Arabic (`dir="rtl"`), communicates via WhatsApp, wants local face-to-face trust, Google Maps visibility, signboard/menu refresh, and honest reports on calls and messages.
2. **Sara / Tariq — Modern Café, Restaurant, or Salon Founder (Hofuf, Dammam, Khobar):** 25–42, bilingual, heavy user of TikTok/Reels/Snapchat, wants cohesive branding, photography, short-form video, and Salla/Zid or web presence from one team (`Look`, `Go Online`, `Numow`, or `Riyada`).

### 3.2 Internal CMS & Admin Personas
3. **Owner / Super Admin (Ataullah):** Needs full control over global settings, brand design tokens, pricing visibility policy, user roles, legal pages, and final publishing approvals without touching code.
4. **Content Editor / Local Partner:** Needs to add portfolio before/after items, update package deliverable numbers, toggle seasonal banners (Ramadan, Eid, Founding Day, National Day, White Friday), and publish blog posts.
5. **SEO Manager:** Needs real-time character counters, missing `alt`/translation alerts, structured data controls, 301 redirect management, and per-page canonical/robots settings.
6. **Arabic Translator / Native Saudi Reviewer:** Needs side-by-side Arabic/English localization editing, translation status tracking, and draft preview links before approving Arabic copy.

---

## 4. Public Website Functional Requirements (`FR-xxx`)

| ID | Requirement | Description | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **FR-001** | **Bilingual Next.js Routing (`/` and `/en/`)** | Serve Arabic as the default root language (`/`, `locale="ar"`, `dir="rtl"`) and English under `/en/` (`locale="en"`, `dir="ltr"`) via Next.js App Router `[locale]` dynamic routing with 100% page parity across all 27 sitemap routes (54 pages) and extensibility for future locales. | P0 | `[CONFIRMED]` |
| **FR-002** | **Clean Latin URL Slugs** | Use clean Latin URL slugs in both Arabic and English (e.g., `/services/brand-identity` and `/en/services/brand-identity`) so links remain clean when shared on WhatsApp. | P0 | `[CONFIRMED]` |
| **FR-003** | **Context-Preserving Language Switcher** | Header language switcher (`EN / عربي`) navigates directly to the translated counterpart of the current page using CMS-resolved alternate slugs. | P0 | `[CONFIRMED]` |
| **FR-004** | **CMS-Driven Sticky Responsive Header** | Render sticky header from `HeaderNav` & `SiteSettings` globals: Rising Line logo lockup (right in AR, left in EN), centered nav menu + 9-service dropdown, language switcher, and always-visible Saffron `"Free mini audit"` CTA on desktop and mobile. | P0 | `[CONFIRMED]` |
| **FR-005** | **Header Scroll Transition** | Transition sticky header background from `Sand (#F5EFE4)` at top of viewport to `Najd Night (#12233F)` with reversed white/Saffron logo upon scroll. | P1 | `[PROPOSED]` |
| **FR-006** | **Global Floating WhatsApp Button** | Persistent floating WhatsApp button (`bottom-left` in Arabic RTL, `bottom-right` in English LTR) driven by `SiteSettings.whatsappNumber`. | P0 | `[CONFIRMED]` |
| **FR-007** | **Context-Aware Pre-Filled WhatsApp Links** | Every WhatsApp CTA opens `https://wa.me/<NUMBER>?text=<ENCODED_MSG>` using the localized pre-filled message configured on that page, service, package, or city record in the CMS. | P0 | `[CONFIRMED]` |
| **FR-008** | **Block-Driven Homepage (`/` & `/en/`)** | Render all 9 Homepage sections via reusable CMS blocks: Hero (with Before→After visual), 9 Service cards, Before & After proof showcase, Monthly Packages overview, 4 Steps, Why Bayyora, Seasonal Campaign banner, Quick Questions (FAQs), and Final CTA band. | P0 | `[CONFIRMED]` |
| **FR-009** | **Services Hub Page (`/services`)** | Render Services Hub dynamically from the `Services` collection and page blocks. | P1 | `[CONFIRMED]` |
| **FR-010** | **Dynamic Service Pages (`/services/[slug]`)** | Render all 9 initial services (and any future CMS-created services) via a reusable Next.js Server Component template: Hero, Problem, What you get, Before & After, Included in (related packages), How it works, Service FAQs, and Final CTA. | P1 | `[CONFIRMED]` |
| **FR-011** | **Dynamic Packages Page (`/packages`)** | Render Monthly Packages (`Bidaya`, `Numow`, `Riyada`), Starter Bundles (`Look`, `Go Online`), Single Services callout, Founding Offer banner (`OD-007`), 3 quote steps, and Package FAQs from the `Packages` collection — with public prices disabled by default. | P0/P1 | `[CONFIRMED]` |
| **FR-012** | **Our Work Portfolio & Dual Filter (`/our-work`)** | Render portfolio grid from the `Projects` collection with interactive filtering by **Service** and **Business Type**, displaying the Dawair teaser and badged Sample Concepts (`نموذج توضيحي` / `Sample concept`). | P1 | `[CONFIRMED]` |
| **FR-013** | **Case Study Page (`/our-work/[slug]`)** | Reusable case study route (initially for Dawair `/our-work/dawair`), enforcing a strict CMS publication gate (`clientPermissionVerified === true`). | P2 | `[CONFIRMED]` |
| **FR-014** | **About Page (`/about`)** | CMS-managed About page (Meaning of `بيّن`, Story, Logo directionality, Team [gated by `OD-010`], 4 Values, Book a Visit CTA). | P1 | `[CONFIRMED]` |
| **FR-015** | **Free Mini Audit Funnel (`/free-audit`)** | Conversion page displaying the 6 audit checkpoints, 1-of-3 free gift offer, and 6-field Audit Form validated via **Zod + Next.js Server Action** forwarding securely to GoHighLevel CRM. | P0 | `[CONFIRMED]` |
| **FR-016** | **Contact & Visit Booking Page (`/contact`)** | Displays WhatsApp CTA, GoHighLevel Calendar booking widget (Sun–Thu, `Asia/Riyadh`), secondary contact form (Server Action), phone/email, working hours, and service areas from `SiteSettings`. | P1 | `[CONFIRMED]` |
| **FR-017** | **Dynamic City Landing Pages (`/city/[slug]`)** | Render initial 5 cities (`al-ahsa`, `hofuf`, `mubarraz`, `dammam`, `khobar`) and any future admin-created cities from the `Cities` collection with unique localized content. | P2 | `[CONFIRMED]` |
| **FR-018** | **Standalone FAQ Page (`/faq`)** | Render categorized FAQs from the `Faqs` collection with `FAQPage` JSON-LD structured data. | P1 | `[CONFIRMED]` |
| **FR-019** | **Bilingual Blog System (`/blog` & `/blog/[slug]`)** | Complete blog archive and article reader supporting categories, tags, author bio, auto-calculated reading time, table of contents, related articles, and `Article` JSON-LD schema. | P2 | `[CONFIRMED]` |
| **FR-020** | **Legal Pages (`/privacy`, `/terms`, `/refunds`)** | Render Saudi PDPL-compliant Privacy Policy, Terms of Service, and Refund & Revision Policy from CMS rich-text blocks (restricted to Owner/Admin publishing). | P1 | `[CONFIRMED]` |
| **FR-021** | **CMS-Driven Global 4-Column Footer** | Render footer from `FooterNav` & `SiteSettings`: reversed logo + tagline, 4 columns (Services, Bayyora, Areas we serve, Contact), Social icons (Snapchat, Instagram, TikTok, X), and legal links. | P0 | `[CONFIRMED]` |

---

## 5. CMS, Admin & Customization Requirements (`CMS-xxx`)

| ID | Requirement | Specification | Status |
| :--- | :--- | :--- | :--- |
| **CMS-001** | **Integrated Self-Hosted Next.js CMS (Payload CMS 3.x)** | Run Payload CMS 3.x natively inside the Next.js App Router project (`src/app/(payload)/admin`) backed by **PostgreSQL**, providing end-to-end TypeScript type generation and zero-latency Local API queries in React Server Components. | `[CONFIRMED]` |
| **CMS-002** | **Global Website Settings (`SiteSettings`)** | Admin interface to manage brand names (AR/EN), taglines (AR/EN), logo variants (RTL/LTR), favicon, contact details, Saudi WhatsApp number, phone, email, working hours, social URLs, service areas, default SEO/OG image, default language, announcement bar, global CTA text, and copyright text. | `[CONFIRMED]` |
| **CMS-003** | **Single-Source Navigation (`HeaderNav` & `FooterNav`)** | Admin interfaces to add, remove, reorder, and translate header links, 9-service dropdown items, CTA buttons, mobile menu settings, and all 4 footer columns from a single source of truth. | `[CONFIRMED]` |
| **CMS-004** | **15-Block Brand-Safe Page Builder** | Enable admins to assemble, reorder, toggle visibility, and select controlled layout variants for 15 approved block types (`Hero`, `TextAndImage`, `ServiceCards`, `PackageComparison`, `BeforeAndAfter`, `Statistics` [verified data only], `PortfolioGrid`, `ProcessSteps`, `FAQ`, `Testimonial` [permission gated], `CTASection`, `ImageGallery`, `ClientLogos` [permission gated], `SeasonalBanner`, `ContactSection`). | `[CONFIRMED]` |
| **CMS-005** | **Full Service & Package CRUD** | Admins can edit all 9 services (and create new ones) and edit all monthly/starter packages (`Bidaya`, `Numow`, `Riyada`, `Look`, `Go Online`), including deliverable quantities and ordering, without code changes. Public price display remains disabled by default. | `[CONFIRMED]` |
| **CMS-006** | **Portfolio, City, Blog & FAQ Management** | Full CRUD collections for `Projects` (with mandatory `isSampleConcept` badge enforcement and `clientPermissionVerified` gate), `Cities` (extensible to new cities), `Posts` (with scheduled publishing & categories/tags), and `Faqs`. | `[CONFIRMED]` |
| **CMS-007** | **Reference-Safe Media Library** | Centralized `Media` collection supporting WebP/AVIF generation, focal point selection, mandatory AR/EN `alt` text, SHA-256 deduplication, usage tracking, and a **`beforeDelete` hook that prevents deleting any asset referenced by published content**. | `[CONFIRMED]` |
| **CMS-008** | **Centralized Design Token & Theme Customization (`ThemeSettings`)** | Manage approved brand colors, typography settings, button variants, section backgrounds, card styles, border radius, and container widths centrally via CSS custom properties injected at root layout, protected by WCAG contrast validation. | `[CONFIRMED]` |
| **CMS-009** | **Bilingual Localization & Translation Completeness Tracking** | Independent editing of `ar` (default) and `en` fields, explicit per-locale translation status (`draft`, `in_review`, `approved`, `published`), visual warnings for missing translations, and prevention of silent publication of untranslated pages. | `[CONFIRMED]` |
| **CMS-010** | **Drafts, Live Preview, Versioning, Rollback & Cache Revalidation** | Support `Draft → Review → Preview → Approval → Publish → On-Demand Cache Revalidation (revalidateTag/revalidatePath)` plus full version history and 1-click rollback across all core collections. | `[CONFIRMED]` |
| **CMS-011** | **6-Role RBAC & Immutable Audit Logging** | Enforce 6 administrative roles (`Owner / Super Admin`, `Administrator`, `Content Editor`, `SEO Manager`, `Arabic Translator`, `Viewer / Reviewer`) with server-side permission checks and an immutable `AuditLogs` collection. | `[CONFIRMED]` |

---

## 6. Non-Functional, Performance, Security & SEO Requirements

### 6.1 Non-Functional & Performance Requirements (`NFR-xxx`)
| ID | Category | Specification | Quality Target | Status |
| :--- | :--- | :--- | :--- | :--- |
| **NFR-001** | **Core Tech Stack** | Next.js (App Router), React, TypeScript (`strict: true`), Tailwind CSS, Server Components by default, Payload CMS 3.x, PostgreSQL. | 100% Strict TypeScript | `[CONFIRMED]` |
| **NFR-002** | **Lighthouse Performance** | Mobile & Desktop Lighthouse Performance via Server Components, ISR/on-demand revalidation, `next/image` (WebP/AVIF), `next/font/local` (`Readex Pro`), and deferred third-party scripts. | **Mobile Performance $\ge 90$** (LCP $< 2.0\text{s}$, CLS $< 0.05$, INP $< 150\text{ms}$) | `[CONFIRMED]` |
| **NFR-003** | **Lighthouse Accessibility** | WCAG 2.1 AA compliance, accessible Radix/shadcn primitives, keyboard navigation, RTL/LTR screen-reader support, and contrast enforcement. | **Lighthouse Accessibility $\ge 95$** | `[CONFIRMED]` |
| **NFR-004** | **Lighthouse Best Practices** | Modern HTTPS, CSP headers, zero console errors, secure cookies, and optimized image aspect ratios. | **Lighthouse Best Practices $\ge 95$** | `[CONFIRMED]` |
| **NFR-005** | **Lighthouse SEO Target** | Architectural and technical SEO compliance across every public, indexable page (`/` and `/en/`). | **Lighthouse SEO: $100/100$** | `[CONFIRMED]` |
| **NFR-006** | **Security & Resilience** | Argon2/PBKDF2 password hashing, HTTP-only secure sessions, CSRF protection, rate limiting on auth & forms, MIME/magic-byte upload validation, Zod env/input validation, and automated daily PostgreSQL PITR backups. | Zero exposed secrets; automated backups | `[CONFIRMED]` |

### 6.2 Advanced SEO Requirements (`SEO-xxx`)
| ID | Requirement | Specification | Status |
| :--- | :--- | :--- | :--- |
| **SEO-001** | **Next.js `generateMetadata` Integration** | Dynamically resolve SEO title, meta description, canonical URL, `hreflang` (`ar-SA`, `en`, `x-default`), Open Graph, Twitter/X cards, and `robots` directives from CMS fields with smart fallbacks (never overwriting custom admin values). | `[CONFIRMED]` |
| **SEO-002** | **Dynamic `sitemap.ts` & `robots.ts`** | Automatically include only `published` and `indexable` (`noindex !== true`) Arabic and English routes in `sitemap.xml`, excluding drafts and private routes; immediately refresh upon CMS publish. | `[CONFIRMED]` |
| **SEO-003** | **Truthful JSON-LD Structured Data** | Generate valid `Organization`, `LocalBusiness` (verified details only), `Service`, `BreadcrumbList`, `FAQPage`, and `Article` JSON-LD matching visible page content — never inventing ratings, reviews, prices, or hours. | `[CONFIRMED]` |
| **SEO-004** | **Built-In CMS SEO Admin Tools** | Provide live character counters (Title $\le 60$, Description $\le 155$), metadata completeness badges, missing `alt` text warnings, missing translation alerts, focus keyword analyzer, 301 redirect manager (auto-triggered on slug change), and broken-link checker. | `[CONFIRMED]` |

### 6.3 Integration Requirements (`INT-xxx`)
| ID | System | Specification | Status |
| :--- | :--- | :--- | :--- |
| **INT-001** | **Server-Side Integration Abstraction Layer** | Encapsulate GoHighLevel CRM, Calendar, and Notification integrations behind a clean TypeScript service interface (`CRMProvider`) executed via Next.js Server Actions so API keys never reach the browser and providers can be swapped without UI rewrites. | `[CONFIRMED]` |
| **INT-002** | **GoHighLevel Audit Form & Calendar** | Submit the 6-field Free Mini Audit form and Short Contact Form via Zod-validated Server Actions to GHL (with local PostgreSQL encrypted fallback log), and embed/bridge the GHL Visit Calendar (`Asia/Riyadh`, Sun–Thu). | `[CONFIRMED]` |
| **INT-003** | **Consent-Aware Analytics & Pixels** | Load GTM, GA4, Meta Pixel, and Snapchat Pixel via `@next/third-parties` / deferred script strategy gated by Saudi PDPL cookie consent, tracking `whatsapp_click`, `audit_form_submit`, `visit_booking_complete`, and `contact_form_submit`. | `[CONFIRMED]` |

---

## 7. Out-of-Scope Functionality

1. **WordPress, PHP, or Heavy Third-Party Page Builders (Elementor/Divi):** Completely retired and excluded.
2. **Self-Serve Online E-Commerce Checkout / Payment Cart:** Bayyora operates on the consultative "quote after we talk" workflow.
3. **Unrestricted Raw CSS/HTML Injection by Non-Owner Editors:** To prevent breaking brand layout or introducing XSS vulnerabilities, editors choose from approved layout variants and design tokens rather than writing raw CSS/JS.
4. **Fabricated Social Proof:** Never invent fake ratings, client counts, search volume forecasts, or unapproved testimonials.

*(See `23-UPDATED-REQUIREMENT-TRACEABILITY.md` for the complete cross-reference matrix connecting every requirement to its responsible agent, planning document, and acceptance test.)*
