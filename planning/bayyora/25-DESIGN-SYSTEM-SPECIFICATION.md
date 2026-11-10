# 25 — Complete Design System Specification (Tokens, RTL/LTR Grids & Component States)

**Project:** Bayyora (بيّورا) — Saudi Digital Marketing & Creative Agency  
**Tagline:** خطوة لفوق — *One step up*  
**Document Version:** 1.0  
**Status:** Active Specification (Aligned with WCAG 2.2 AA & Payload CMS `ThemeSettings`)  
**Cross-References:** `03-BRAND-AND-DESIGN-SYSTEM.md`, `04-HTML-REFERENCE-DESIGN-AUDIT.md`, `18-DESIGN-CUSTOMIZATION-AND-THEMING.md`, `24-UI-UX-SKILLS-AND-WORKFLOW.md`, `26-MOTION-AND-ANIMATION-SYSTEM.md`, `27-ACCESSIBILITY-DESIGN-STANDARDS.md`

---

## 1. Design System Architecture & Single Source of Truth

Bayyora's design system is engineered around **zero token duplication**:
1. **CMS Layer (`ThemeSettings` Global in Payload CMS):** Stores owner-approved color presets, typography scale presets, container widths, section spacing density, and border-radius presets (`18-DESIGN-CUSTOMIZATION-AND-THEMING.md`).
2. **CSS Custom Properties Layer (`<html style="...">` + `globals.css`):** Injected server-side in `src/app/(frontend)/[locale]/layout.tsx` so zero client-side JavaScript is needed to apply theme tokens and zero FOUC occurs.
3. **Tailwind CSS Semantic Mapping (`tailwind.config.ts`):** Maps semantic token names (`bg-canvas`, `bg-surface`, `bg-navy`, `text-ink`, `text-muted`, `bg-accent`, `bg-oasis`, `border-subtle`, `border-input`) to CSS variables.
4. **Reusable Primitive Components (`src/components/ui/`):** Built with Radix UI / shadcn primitives and `class-variance-authority` (`cva`), consuming only semantic Tailwind classes and CSS logical properties.

---

## 2. Calibrated Color System (WCAG 2.2 AA Mathematically Verified)

To resolve the mid-luminance contrast failure discovered in the HTML reference (`#E4572E` / `#E05A2B` terracotta has relative luminance $L \approx 0.213\text{–}0.235$, yielding only `3.68:1–3.99:1` against `#FFFFFF` and `4.22:1` against `#12233F`), the design system enforces **mathematically verified WCAG 2.2 AA (`>= 4.5:1` text, `>= 3.0:1` UI/input boundaries)** across both approved brand presets:

### 2.1 Semantic Color Tokens

| CSS Custom Property | Tailwind Token | Default Value (Preset A: Najd & Saffron) | Alternative (Preset B: Accessible Terracotta) | Usage & WCAG 2.2 AA Verified Contrast Ratio |
| :--- | :--- | :--- | :--- | :--- |
| `--color-canvas` | `bg-canvas` | `#F7F3EB` (Warm Cream) | `#F7F3EB` | Primary page canvas (`L = 0.892`). |
| `--color-canvas-sand` | `bg-canvas-sand` | `#EFE9DC` (Soft Sand) | `#EFE9DC` | Alternating section surface & subtle card fill (`L = 0.818`). |
| `--color-surface` | `bg-surface` | `#FFFFFF` (Pure White) | `#FFFFFF` | Elevated cards, inputs, modals, and accordion items (`L = 1.000`). |
| `--color-navy` | `bg-navy` / `text-navy` | `#0D2235` (Deep Arabian Navy) | `#0D2235` | Primary authority dark surface & headings (`L = 0.0156`). **`15.4:1` on `#F7F3EB`**, **`18.1:1` with `#FFFFFF`**. |
| `--color-navy-elevated` | `bg-navy-elevated` | `#16324B` (Elevated Navy) | `#16324B` | Cards inside dark navy sections (`Numow` card, dark pre-footer banner) (`L = 0.030`). **`13.1:1` with `#FFFFFF`**. |
| `--color-oasis` | `bg-oasis` / `text-oasis` | `#136F63` (Saudi Palm Teal) | `#136F63` | Trust badges, checkmarks, local city tags (`L = 0.130`). **`5.83:1` with `#FFFFFF`**, **`5.22:1` on `#F7F3EB`**, **`4.81:1` on `#EFE9DC`**. |
| `--color-accent` | `bg-accent` | `#F2A541` (Warm Saffron) | `#C7441F` (Deep Terracotta) | Primary CTA fill (`L = 0.468` for `#F2A541`; `L = 0.162` for `#C7441F`). |
| `--color-on-accent` | `text-on-accent` | `#0D2235` (on `#F2A541`) | `#FFFFFF` (on `#C7441F`) | Auto-computed CTA button text: **`7.90:1` (`#0D2235` on `#F2A541`)** or **`4.95:1` (`#FFFFFF` on `#C7441F`)**. |
| `--color-whatsapp` | `bg-whatsapp` | `#128C7E` (Accessible WA Green) | `#128C7E` | WhatsApp CTA fill (`L = 0.201`). Uses `#FFFFFF` text at **`4.51:1`** (or `#25D366` with `#0D2235` dark text at **`8.65:1`**). |
| `--color-ink` | `text-ink` | `#141A21` (Charcoal Ink) | `#141A21` | Primary body copy (`L = 0.011`). **`16.5:1` on `#F7F3EB`**. |
| `--color-muted` | `text-muted` | `#4A5568` (Warm Slate) | `#4A5568` | Secondary body copy & captions (`L = 0.091`). **`6.68:1` on `#F7F3EB`**, **`6.15:1` on `#EFE9DC`**. |
| `--color-border-subtle` | `border-subtle` | `#DFD6C7` (Warm Hairline) | `#DFD6C7` | Decorative card dividers and section hairlines (`1px solid`). |
| `--color-border-input` | `border-input` | `#7A869A` (Accessible Input Border) | `#7A869A` | Form input, checkbox, select, and radio borders (`L = 0.236`). **`3.68:1` against `#FFFFFF` and `3.32:1` against `#F7F3EB`** (passes **WCAG 2.2 SC 1.4.11 `>= 3.0:1`**!). |
| `--color-success` | `text-success` / `bg-success` | `#15803D` | `#15803D` | Verified / "After" metric states (`5.13:1` with `#FFFFFF`). |
| `--color-warning` | `text-warning` / `bg-warning` | `#B45309` | `#B45309` | Sample concept badge / SLA warnings (`5.02:1` with `#FFFFFF`). |
| `--color-danger` | `text-danger` / `bg-danger` | `#B91C1C` | `#B91C1C` | Form validation errors & "Before" weak states (`6.47:1` with `#FFFFFF`). |

---

## 3. Bilingual Typography System (`ar` RTL & `en` LTR)

### 3.1 Font Families & Self-Hosted Loading (`next/font/local`)
- **Primary Arabic & Bilingual UI Font (`--font-arabic`):** `IBM Plex Sans Arabic` (or `Readex Pro` selectable in `ThemeSettings.typography.fontPairPreset`), loaded via `next/font/local` with `display: 'swap'` and `adjustFontFallback: 'Arial'`.
- **Primary English Display & UI Font (`--font-sans`):** `Plus Jakarta Sans` (on `/en/*` when `ibm_plex_jakarta` preset is active, falling back seamlessly to `IBM Plex Sans Arabic` for mixed Arabic terms).
- **Monospace / Numeric Metric Font (`--font-mono`):** `IBM Plex Mono` (`400`, `600`) with `font-variant-numeric: tabular-nums` for package deliverables (`8`, `16`, `24`), 48-hour SLA badges (`48h`), and step numbers (`01`–`04`).

### 3.2 Fluid Type Scale & Script-Specific Line Heights
Arabic script requires taller line heights (`+0.1` to `+0.15` over Latin) to prevent clipping of diacritics (*tashkeel*), hamzas (`أ / إ`), and deep descenders (`ي / ر / ن`), and **zero positive letter-spacing (`letter-spacing: 0`)** so cursive Arabic letter connections are never broken.

| Token | Element / Role | Fluid Size (`clamp`) | Arabic (`dir="rtl"`) Weight / Line-Height / Tracking | English (`dir="ltr"`) Weight / Line-Height / Tracking | Max Measure |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-display` | Hero `<h1>` | `clamp(2.125rem, 4vw + 1rem, 3.5rem)` (`34px–56px`) | `700` / `1.28` / `0` | `700` / `1.15` / `-0.02em` | `18–22 ch` (AR) / `24 ch` (EN) |
| `text-h1` | Inner Page `<h1>` | `clamp(1.875rem, 3vw + 1rem, 2.75rem)` (`30px–44px`) | `700` / `1.30` / `0` | `700` / `1.18` / `-0.02em` | `25 ch` |
| `text-h2` | Section `<h2>` | `clamp(1.5rem, 2.2vw + 0.8rem, 2.25rem)` (`24px–36px`) | `700` / `1.35` / `0` | `600` / `1.22` / `-0.015em` | `32 ch` |
| `text-h3` | Card Title `<h3>` | `clamp(1.2rem, 1.2vw + 0.8rem, 1.45rem)` (`19.2px–23.2px`) | `600` / `1.42` / `0` | `600` / `1.30` / `-0.01em` | `40 ch` |
| `text-h4` | Sub-heading `<h4>` | `1.125rem` (`18px`) | `600` / `1.50` / `0` | `600` / `1.40` / `0` | `50 ch` |
| `text-body-lg` | Hero Lead / Subheadline | `clamp(1.0625rem, 0.5vw + 0.95rem, 1.2rem)` (`17px–19.2px`) | `400` / `1.80` / `0` | `400` / `1.65` / `0` | `60 ch` |
| `text-body` | Standard Body & Form Inputs | `1.0625rem` (`17px` AR) / `1rem` (`16px` EN) | `400` / `1.78` / `0` | `400` / `1.65` / `0` | `65 ch` |
| `text-body-sm` | Card Meta / Helper Text | `0.875rem` (`14px`) | `500` / `1.65` / `0` | `400` / `1.55` / `0` | `65 ch` |
| `text-badge` | Eyebrow / Badge Pill | `0.8125rem` (`13px`) | `600` / `1.40` / `0` (Never uppercase) | `600` / `1.40` / `0.02em` (Sentence case) | `40 ch` |

---

## 4. Layout Widths, Grid Systems, Spacing & Logical Properties

### 4.1 Responsive Breakpoints & Container Widths
- **Breakpoints:**
  - `xs`: `360px` (Minimum mandatory Saudi Android viewport check)
  - `sm`: `640px` (Large mobile / phablet)
  - `md`: `768px` (Tablet portrait — 2-column grids activate)
  - `lg`: `1024px` (Desktop navigation bar & 3-column grids activate)
  - `xl`: `1280px` (Standard max container `1240px` + `24px` inline padding)
  - `2xl`: `1440px` (Wide desktop canvas)
- **Container Tokens:**
  - `--container-main`: `1240px` (`max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8`)
  - `--container-narrow`: `820px` (FAQs, Legal pages, Blog article body, Free Audit form container)

### 4.2 Vertical & Horizontal Spacing Scale (`8px` Base Grid)
- **Section Vertical Padding (`--section-py`):**
  - Mobile (`< 768px`): `3.5rem` (`56px`, `py-14`)
  - Tablet (`768px–1023px`): `4.5rem` (`72px`, `md:py-18`)
  - Desktop (`>= 1024px`): `6rem` (`96px`, `lg:py-24`)
- **Grid Gaps:**
  - Card Grids (Services 3x3, Pain Points 4-col, Process 4-col): `gap-5 lg:gap-6` (`20px` mobile, `24px` desktop)
  - Package Comparison 3-Col Grid: `gap-6 lg:gap-8` (`24px` mobile, `32px` desktop)
- **Mandatory CSS Logical Properties:**
  - Physical directional classes (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right`, `border-l-*`, `border-r-*`) are **banned in shared components** (enforced via ESLint).
  - Always use logical equivalents: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`, `border-s-*`, `border-e-*`, `inset-inline-start`, `inset-inline-end`.

---

## 5. Component Specifications & Interactive State Matrix

Every interactive component must implement all **6 states**: `Default`, `Hover` (pointer devices only), `Focus-Visible` (WCAG 2.2 AA dual-ring), `Active/Pressed`, `Loading/Pending`, and `Disabled/Error`.

### 5.1 Global Focus-Visible Standard (WCAG 2.2 SC 2.4.7 & 2.4.11)
- **Class Pattern:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 focus-visible:ring-offset-canvas` (and on dark `.section-navy` surfaces: `focus-visible:ring-accent focus-visible:ring-offset-navy`).
- **Sticky Viewport Clearance (WCAG 2.2 SC 2.4.11):** `html { scroll-padding-top: calc(var(--header-h, 74px) + var(--announcement-h, 0px) + 16px); scroll-padding-bottom: 88px; }` so focused elements are never hidden behind the sticky header or floating WhatsApp pill.

### 5.2 Buttons (`<Button />`)
- **Sizing & Touch Targets:** Minimum height `48px` (`min-h-12 px-6 py-3`) for primary/secondary CTAs; `44px` (`min-h-11 px-4 py-2.5`) for compact header/card actions.
- **Variants:**
  1. `primary` (Audit CTA): `bg-accent text-on-accent font-semibold shadow-sm`
     - Hover (`@media (hover: hover)`): `hover:brightness-95 hover:-translate-y-0.5`
     - Active: `active:scale-[0.98] active:translate-y-0`
  2. `whatsapp` (Direct WhatsApp CTA): `bg-whatsapp text-white font-semibold`
     - Includes mandatory inline SVG WhatsApp icon (`aria-hidden="true"`) with `gap-2`.
  3. `secondary` (Navy Solid): `bg-navy text-white font-semibold hover:bg-navy-elevated`
  4. `outline` (Secondary Action): `border-2 border-navy text-navy bg-transparent hover:bg-navy/5` (on dark surfaces: `border-white/30 text-white hover:bg-white/10`).
  5. `ghost`: `text-navy hover:bg-canvas-sand`
- **Loading State:** Preserves exact button width, sets `aria-busy="true"` and `disabled`, replaces icon with a `16px` SVG spinner (`animate-spin`), and announces localized status (`جاري الإرسال...` / `Sending...`).

### 5.3 Cards (`ServiceCard`, `PackageCard`, `PortfolioCard`, `PainPointCard`)
- **Surface & Geometry:** `rounded-2xl` (`16px`), `border border-subtle`, `bg-surface` (or `bg-canvas-sand` for Pain Points), `p-6 lg:p-7`.
- **Package Comparison Hierarchy (`Bidaya`, `Numow`, `Riyada`):**
  - Standard Tiers (`Bidaya`, `Riyada`): `bg-surface text-ink border-subtle`.
  - Highlighted Tier (`Numow` — `isMostPopular: true`): `bg-navy text-white border-2 border-accent shadow-xl lg:-translate-y-2` with top badge pill (`الأكثر طلباً` / `Most Popular` in `bg-accent text-on-accent`).
  - Quote-Only Mode (`SiteSettings.publicPricingEnabled === false`): Displays localized scope-based pricing note (`حسب احتياج محلك — نحددها بعد التحليل المجاني` / `Tailored quote after your free audit`) and CTA (`اطلب عرض سعر لباقة نمو` / `Request a quote for Numow`).
- **Portfolio / Sample Card (`PortfolioCard`):**
  - If `isSampleConcept === true`, renders a non-removable top-start badge (`نموذج توضيحي` / `Sample concept`) in `bg-canvas-sand text-navy border border-navy/20`.

### 5.4 Forms (`FreeAuditForm`, `ContactForm`)
- **Field Geometry:** Single-column vertical stack (`gap-5`), input height `48px` (`h-12`), `rounded-xl` (`12px`), `bg-surface`, `border border-input` (`#7A869A`, `>= 3:1` contrast), `px-4 text-base text-ink`.
- **Labels & Instructions:** Permanent visible `<label>` above every input (`font-semibold text-navy mb-1.5`) with optional helper text (`text-body-sm text-muted`) linked via `aria-describedby`. Placeholders are never used as the sole label.
- **Bidi Input Handling:**
  - `whatsapp` phone input: `type="tel" inputMode="tel" dir="ltr" className="text-start"` with automatic server/client normalization of Arabic-Indic (`٠-٩`) and Eastern Arabic (`۰-۹`) digits to ASCII (`0-9`).
  - `instagramOrLink` input: `type="text" dir="ltr" className="text-start"` accepting `@handle`, Instagram URL, or Google Maps URL.
- **Validation & Error States:**
  - Invalid input: `border-2 border-danger bg-danger/5` with `aria-invalid="true"` and `aria-describedby="{id}-error"`.
  - Error message: Rendered immediately below the field with a `16px` alert icon + clear corrective copy in `text-danger text-body-sm font-medium`.
  - Top Error Summary: If a submit fails validation, focus moves to an `aria-live="assertive"` summary banner at the top of the form listing anchor links to each invalid field.

### 5.5 Header, Mobile Navigation Drawer & Dropdowns
- **Desktop Header (`>= 1024px`):** Sticky `h-[74px]`, `bg-canvas/95 backdrop-blur-md border-b border-subtle z-50`. Contains Logo (start), 6 top-level nav items (including accessible Radix `NavigationMenu` dropdown for the 9 Services), Language Switcher (`EN` / `عربي`), and Primary CTA button (`تحليل مجاني` / `Free mini audit`).
- **Mobile Header (`360px–1023px`):** To prevent horizontal overflow at `360px` (`Finding I-02`), the mobile top bar contains **only 3 items**:
  1. Bayyora Logo (`max-w-[116px]`, start)
  2. Compact Primary CTA Pill (`تحليل مجاني` / `Free Audit`, `min-h-10 px-3.5 text-sm`)
  3. Accessible Hamburger Trigger (`44x44px`, `aria-expanded`, `aria-controls="mobile-nav-drawer"`, end)
  - The Language Switcher (`English` / `العربية`), full 9-Service accordion list, WhatsApp direct CTA, and secondary links live inside the slide-over **Mobile Navigation Drawer** (sliding from `inline-end`: right in LTR, left in RTL, with Radix `Dialog` focus trap, backdrop click dismiss, and `Escape` key handler).

### 5.6 Accordions, Tabs, Modals & Empty/Loading States
- **FAQ Accordion (`FaqAccordion`):** Built on `@radix-ui/react-accordion`. Trigger row is a full-width `<button>` (`min-h-[56px] py-4 px-5 flex items-center justify-between gap-4 text-start font-semibold text-navy`), with a `+` / `ChevronDown` icon rotating `180deg` (or `45deg` for `+`) on `[data-state=open]`.
- **Seasonal Campaign & Filter Tabs (`SeasonalCampaignTabs`, `PortfolioFilterGrid`):** Built on `@radix-ui/react-tabs` with `role="tablist"`, automatic RTL/LTR `ArrowLeft`/`ArrowRight` keyboard support, `min-h-11 px-4 rounded-full` tab pills, and `overflow-x-auto scrollbar-none` on mobile so pills never wrap awkwardly.
- **Empty States:** When a portfolio filter combination yields 0 items, renders a structured card (`bg-canvas-sand rounded-2xl p-8 text-center`) with a clear explanation and a 1-click `"عرض كل الأعمال / Show all work"` reset button.
- **Loading / Skeleton States:** Use calm `bg-canvas-sand animate-pulse rounded-2xl` placeholders matching exact card dimensions (`aspect-[4/3]` or fixed heights) to guarantee `CLS = 0.00`.

---

## 6. Approved Section Visual Variants (CMS Page Builder)

Editors in Payload CMS can select from 4 approved `sectionStyleVariant` options per block (`16-CMS-ADMIN-ARCHITECTURE.md`, `18-DESIGN-CUSTOMIZATION-AND-THEMING.md`):

| Variant Key | Background Surface | Heading Color | Body Text Color | Card Surface Inside Section | Primary Use Cases |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sand_light` (Default) | `--color-canvas` (`#F7F3EB`) | `--color-navy` (`#0D2235`) | `--color-ink` (`#141A21`) | `--color-surface` (`#FFFFFF`) | Hero, 9 Services Grid, Monthly Packages, FAQ |
| `pure_white` | `--color-surface` (`#FFFFFF`) | `--color-navy` (`#0D2235`) | `--color-ink` (`#141A21`) | `--color-canvas-sand` (`#EFE9DC`) | 4 Pain Points, 4-Step Process, Starter Bundles |
| `najd_night` | `--color-navy` (`#0D2235`) | `#FFFFFF` | `#E2E8F0` | `--color-navy-elevated` (`#16324B`) | Why Bayyora visual callout, Pre-Footer Final CTA Banner |
| `oasis_tint` | `#EBF5F3` (5% Oasis Teal tint) | `--color-navy` (`#0D2235`) | `--color-ink` (`#141A21`) | `--color-surface` (`#FFFFFF`) | 48-Hour Free Mini Audit callout, Local City proof highlights |

