# 04 — HTML Reference & Visual Design Audit

**Project:** Bayyora (بيّورا)  
**Author:** Agent 2 (Brand & Design System Agent)  
**Audited Reference Artifacts:**
1. Full-page visual screenshot (`media_1794129016400_e3567133.png`)
2. Complete HTML prototype source (`index.html`, 889 lines)

---

## 1. Comprehensive 17-Point Analysis of the HTML Reference

### 1.1 Overall Design Direction
- Warm, approachable, non-corporate aesthetic tailored to local Saudi business owners.
- Replaces cold tech/SaaS white backgrounds with a warm cream/sand canvas (`--cream: #FFF8EC`), high-contrast deep navy focal blocks (`--ink: #12263A`), generous border radii (`16px–24px`), and scannable Arabic-first typography.

### 1.2 Layout Patterns
- Centered `1160px` max-width container (`.wrap`) with `24px` desktop padding (`16px` mobile).
- Modular CSS Grid layouts:
  - Asymmetric 2-column grids for Hero (`1.15fr 1fr`), Why Bayyora (`1.3fr 1fr`), and Forms (`1fr 1.1fr`).
  - Symmetric 2-column grids for About (`1fr 1fr`), Service details (`1fr 1fr`), and Starter Bundles (`1fr 1fr`).
  - 3-column grids for Services (`.svc-grid`), Monthly Packages (`.plans`), and Portfolio Work (`.work-grid`).
  - 4-column grids for Pain Strip (`.pain-grid`), 4 Steps (`.steps`), and Footer (`.foot`).

### 1.3 Header and Navigation Behavior
- Sticky top bar (`position: sticky; top: 0; z-index: 50; height: 74px`) with translucent warm background (`rgba(255,248,236,.94)`) and `backdrop-filter: blur(8px)`.
- 3-zone flex layout: Logo lockup (wordmark + rising arrow SVG) on the inline-start side (right in RTL), 6 horizontal links in the center, and action buttons (Language toggle + "Free audit" button + mobile hamburger) on the inline-end side.
- **Limitation Observed:** Does not transition to `Najd Night` on scroll, lacks a dropdown menu for the 9 services, and hides `.nav-actions .btn` ("Free audit") below `720px`.

### 1.4 Hero Section Structure
- Split 2-column layout (`padding: 64px 0 72px`).
- **Inline-Start Column (Right in AR):** Tagline with rising arrow (`خطوة لفوق`), high-impact H1 with accented keyword (`يبان`), concise lead paragraph, dual CTA row (WhatsApp green pill button + Ghost "Free audit" button), and service area/hours trust micro-copy (`الأحساء · الدمام · الخبر — من الأحد إلى الخميس`).
- **Inline-End Column (Left in AR):** Side-by-side "Before vs. After" Google Maps listing card comparison (`.compare`). The "Before" card shows a grey placeholder (`لا توجد صور`), `3.6 ★` rating, red `✕` for Website and WhatsApp, and "8 months ago" last post; the "After" card has an accent border, navy gradient header (`بيّورا`), `4.7 ★` rating, green `✓` marks, and "Today" last post, with a centered caption `مثال توضيحي / Illustrative example`.

### 1.5 Typography
- Uses Google Fonts `Readex Pro` (`400, 500, 600, 700`) with `Tahoma, Arial, sans-serif` fallbacks.
- Fluid sizing via `clamp()` for H1 (`clamp(2.1rem, 5.2vw, 3.9rem)` in AR; slightly smaller `clamp(2rem, 4.4vw, 3.3rem)` in EN) and H2 (`clamp(1.7rem, 3.4vw, 2.6rem)`).
- Base body size is `17px` (`16px` on mobile) with `line-height: 1.7`, giving Arabic diacritics (such as the shadda on `بيّورا` and `محلّك`) ample vertical breathing room.

### 1.6 Color Usage
- **Reference CSS Variables:** `--ink: #12263A`, `--ink-2: #1C3550`, `--cream: #FFF8EC`, `--soft: #F6EEDF`, `--line: #E9E0CF`, `--accent: #E4572E` (terracotta red-orange), `--accent-dark: #C7441F`, `--wa: #1FA855`, `--muted: #4A5A6A`.
- **Key Observation:** The HTML prototype uses `#E4572E` (terracotta) instead of Document A's proposed `Saffron Rise (#F2A541)` and `Oasis Green (#1F7A5C)`. Because `#E4572E` is darker than `#F2A541`, the prototype used it for small `.eyebrow` text on light backgrounds and white text on `.btn-accent`. When transitioning to Document A's proposed `Saffron Rise (#F2A541)`, we must apply Document A's contrast rules (dark navy/ink text on Saffron buttons; no Saffron text on light backgrounds).

### 1.7 Spacing System
- Generous `88px` vertical section spacing (`padding-top: 0` on consecutive cream sections to avoid double-spacing, `60px` on mobile).
- Consistent internal card padding (`24px–30px` on cards, `36px–48px` on feature banners).
- Grid gaps of `14px–20px` for card matrices and `36px–48px` for 2-column split sections.

### 1.8 Buttons and CTA Styles
- Pill-shaped (`border-radius: 999px`), `min-height: 48px`, `padding: 12px 24px`, `font-weight: 600`.
- Four variants: `.btn-wa` (green with WhatsApp SVG), `.btn-accent` (accent fill), `.btn-ghost` (`inset 0 0 0 2px var(--ink)`), and `.btn-light` (white fill for dark CTA bands).

### 1.9 Cards and Content Sections
- **Pain Strip (`.pain`):** Full-width white background band with 4 cream `.pain-card` blocks, each topped with a `52x52px` circular icon.
- **Service Cards (`.svc-card`):** Horizontal flex layout (icon circle + text column) inside a 3x3 grid.
- **4 Steps (`.steps`):** CSS counter-driven (`counter-increment: s`) 4-column ordered list where numbers `1–4` render at `2.2rem` above each step title.
- **Package Cards (`.plans`):** 3-column stretch grid where the middle tier (`Numow / نمو`) uses `.plan.hot` (dark navy background, "Most popular" pill badge, accented CTA).
- **Why Bayyora + Slogan Card (`.why-grid`):** 5 icon-led rows paired with a large dark navy `.slogan-card` showcasing the rising arrow and bilingual tagline.
- **Seasonal Pills (`.seasons`):** Pill-shaped list (`رمضان`, `العيد`, `يوم التأسيس`, `اليوم الوطني`, `الجمعة البيضاء`) with the active/upcoming season highlighted in dark navy.
- **FAQ Accordions (`.faq`):** Native `<details><summary>` elements (`max-width: 820px`) with custom `+` / `−` pseudo-element indicators.

### 1.10 Image Placement and Proportions
- Uses CSS-drawn UI mockups (Google Maps before/after cards in Hero) and `4:3` aspect-ratio dashed placeholders (`.ba div { aspect-ratio: 4/3 }`) on the Our Work page.
- Zero reliance on generic stock photos.

### 1.11 Background Treatments
- Alternates between `--cream` (default body), `#FFFFFF` (pain section and card surfaces), and `--ink` (featured `Numow` card, slogan card, pre-footer `.cta` band, and `footer`).

### 1.12 Animations and Interactions
- Lightweight micro-interactions: `.svc-card:hover { transform: translateY(-3px) }`, `.btn:active { transform: scale(.98) }`, `html { scroll-behavior: smooth }`, and `@media (prefers-reduced-motion: reduce)` reset.

### 1.13 Mobile Responsiveness (`\le 720px`)
- Collapses all multi-column grids to `1fr`.
- Converts `.nav-links` into a full-width dropdown drawer below the `74px` header.
- Shrinks the floating WhatsApp button to a circular icon button (`.wa-float span { display: none }`) so it does not obscure mobile content.

### 1.14 Desktop Responsiveness (`> 980px` & `721px–980px`)
- Clean tablet intermediate breakpoint at `980px` (2-column grids) and desktop layout at `1160px` max container width.

### 1.15 Footer Structure
- Dark navy background (`padding: 60px 0 28px`), 4-column grid (`1.4fr 1fr 1fr 1fr`), bottom legal bar with copyright and Privacy/Terms links, and persistent floating WhatsApp button (`inset-inline-start: 20px; bottom: 20px`).

---

## 2. Classification Matrix: Adopt, Adapt, Avoid & Missing

### 2.1 Patterns Worth Adopting (16/17 Core Layout & UI Patterns)
1. **CSS Logical Properties for Automatic RTL/LTR Mirroring:** Using `inset-inline-start`, `margin-inline`, and `text-align: start` so Arabic (`dir="rtl"`) and English (`dir="ltr"`) mirror effortlessly.
2. **Hero Side-by-Side "Before vs. After" Google Maps Card:** Visually proves Bayyora's value proposition in 3 seconds without requiring stock photography.
3. **4-Column "Why Customers Miss You" Pain Strip:** High-empathy problem framing immediately below the hero.
4. **3x3 Service Card Grid with Icon Badges:** Clean, thumb-friendly overview of all 9 services.
5. **CSS-Numbered 4-Step Process Cards (`.steps`):** Clear, scannable progression.
6. **3-Tier Package Layout with Highlighted Middle Card (`Numow`):** Strong visual hierarchy drawing attention to the most popular tier.
7. **2-Column "Why Bayyora" List + Dark Navy Slogan Card:** Reinforces the `خطوة لفوق / One step up` brand identity alongside the 5 trust pillars.
8. **Native `<details><summary>` FAQ Accordions:** Zero-JS-overhead, accessible, fast-loading expandable FAQs.
9. **Floating WhatsApp Button Using `inset-inline-start: 20px`:** Automatically places the floating button at `bottom-left` in Arabic RTL and `bottom-right` in English LTR, collapsing to an icon on mobile.
10. **`prefers-reduced-motion: reduce` Support & `:focus-visible` Outlines:** Strong baseline accessibility practices.

### 2.2 Patterns Worth Adapting (Require Modification to Align with Document A & Next.js/Payload Architecture)
| Pattern in `index.html` | Required Adaptation for Production Next.js + Payload CMS Site | Reason (`Doc A` Reference) |
| :--- | :--- | :--- |
| **Color Variables (`#FFF8EC`, `#12263A`, `#E4572E`)** | Map to Document A's proposed palette (`Sand #F5EFE4`, `Najd Night #12233F`, `Saffron Rise #F2A541`, `Oasis Green #1F7A5C`, `Ink #1A1A1A`) via Payload `ThemeSettings` CSS custom properties, enforcing dark text on Saffron buttons. | `Doc A` §1 (Colour palette & Contrast rules) |
| **Sticky Header (Static Cream Background)** | Add scroll listener (`window.scrollY > 40`) to transition header to `Najd Night (#12233F)` with reversed white/Saffron logo, add Services 9-item dropdown (driven by `HeaderNav` global), and keep "Free mini audit" CTA visible on mobile. | `Doc A` §2 (Navigation & Header) |
| **Logo & Rising Line Direction in LTR** | Provide dedicated RTL (rising left) and LTR (rising right) logo and arrow SVGs so the header logo and page arrows never point in opposite directions on `/en/`. | `Doc A` §1 (Tagline directionality rule) |
| **Our Work `.ba` Dashed Boxes** | Replace `[قبل: أضف صورة]` developer placeholders with CMS-managed `Projects` collection items explicitly badged `نموذج توضيحي / Sample concept` + the Dawair teaser block. | `Doc A` §2, §3.5 |
| **Footer Columns** | Expand from 4 partial columns to the exact 4 columns in `Doc A` driven by the `FooterNav` global: Services (9 links), Bayyora (About, Our work, Packages, FAQ, Blog), Areas we serve (5 city links), Contact + Social links (Snapchat, Instagram, TikTok, X) + Refunds link. | `Doc A` §2 (Footer) |

### 2.3 Patterns That Must NOT Be Used (Strict Rejections)
1. **Hardcoded Public Prices & Price Tables:** `index.html` displays SAR prices on service cards (`From SAR 1,290`), monthly plans (`1,490`, `2,690`, `4,490`), bundles (`2,490`, `6,990`), a single-service price table, and *"Dammam and Khobar prices are about 20% higher"*. **All public prices must be removed** per `BR-003` ("Quote after we talk: no prices on the site").
2. **Client-Side Hash Routing (`#home`, `#services`) & CSS `.ar`/`.en` Hiding:** Storing both languages in a single DOM and switching via `#hash` prevents proper Google indexing of `/en/` URLs, breaks `hreflang="ar-SA"`/`"en"` pairs, and prevents unique `<title>` and `<meta name="description">` per page. Next.js App Router `[locale]` server-rendered routes replace this completely.
3. **Forms Opening `wa.me` Instead of Saving to GoHighLevel CRM:** In `index.html`, submitting `#auditForm` or `#visitForm` only opens a WhatsApp tab. If the user closes WhatsApp without pressing send, the lead is lost forever. Forms must submit via **Next.js Server Actions** to **GoHighLevel (GHL)** and display the documented thank-you message.
4. **Google Fonts CDN `<link>` Tag:** `index.html` loads `Readex Pro` from `fonts.googleapis.com`. Next.js `next/font/local` with self-hosted `Readex Pro` subsets (`arabic` & `latin`) replaces external CDN requests for `90+` Mobile Lighthouse Performance.
5. **Hardcoded Unapproved Contract/Payment Claims in FAQ:** `index.html` hardcodes *"3-month minimum"* and *"50% upfront for projects"*. Document A keeps payment methods and exact contract minimums out of public hardcoding until confirmed (`OD-009`).

### 2.4 Requirements Missing From the HTML Reference
- Individual dedicated pages for the **9 Services** (each with Problem, What you get, Before/After, Package mapping, How it works, 3–4 FAQs, and CTA).
- Dedicated **5 City Landing Pages** (`Al Ahsa`, `Hofuf`, `Mubarraz`, `Dammam`, `Khobar`).
- **Our Work Dual Filtering** (Filter by Service + Filter by Business Type) and **Dawair Case Study** template (`/our-work/dawair/`).
- **GoHighLevel Calendar Embed** on `/contact/` for booking shop visits.
- **TikTok** checkpoint and **"What do you need help with?"** field on `/free-audit/`.
- **Standalone FAQ Page** (`/faq/`), **Blog** (`/blog/`), and **3 Legal Pages** (`/privacy/`, `/terms/`, `/refunds/`).
- **Analytics & Pixels** (GA4, GSC, Meta Pixel, Snapchat Pixel, WhatsApp click tracking) and **`LocalBusiness` JSON-LD Schema**.

