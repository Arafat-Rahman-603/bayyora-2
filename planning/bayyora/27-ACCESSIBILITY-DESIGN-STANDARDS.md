# 27 — Accessibility Design Standards (WCAG 2.2 AA & Bilingual RTL/LTR Compliance)

**Project:** Bayyora (بيّورا) — Saudi Digital Marketing & Creative Agency  
**Tagline:** خطوة لفوق — *One step up*  
**Document Version:** 1.0  
**Status:** Active Specification (Upgrades Project Accessibility Standard from WCAG 2.1 AA to **WCAG 2.2 AA**)  
**Cross-References:** `01-PRD.md`, `03-BRAND-AND-DESIGN-SYSTEM.md`, `06-UX-AND-USER-JOURNEYS.md`, `12-QA-AND-ACCEPTANCE-CRITERIA.md`, `18-DESIGN-CUSTOMIZATION-AND-THEMING.md`, `25-DESIGN-SYSTEM-SPECIFICATION.md`, `26-MOTION-AND-ANIMATION-SYSTEM.md`

---

## 1. Conformance Target & Scope

Bayyora's public website (`/` in Arabic RTL and `/en/` in English LTR) and custom CMS components must conform to **W3C Web Content Accessibility Guidelines (WCAG) 2.2 Level AA** (superseding earlier references to WCAG 2.1 AA across `01`, `03`, `12`, and `18`).

> **Audit Honesty Rule:** Automated scanners (`@axe-core/playwright` and Lighthouse Accessibility `>= 95`) catch only `~35–45%` of WCAG issues. Full WCAG 2.2 AA conformance requires both automated CI gates AND the manual keyboard, zoom/reflow, RTL screen-reader, and reduced-motion verification protocols defined in Section 6.

---

## 2. Specific WCAG 2.2 Level A & AA New Criteria Compliance

In addition to all WCAG 2.0 and 2.1 AA requirements, Bayyora explicitly addresses every new criterion introduced in **WCAG 2.2**:

### 2.1 SC 2.4.11 — Focus Not Obscured (Minimum) (Level AA)
- **Risk in Bayyora:** Bayyora features a sticky top header (`74px` height, `z-index: 50`), an optional top Announcement Bar (`~36px`), and a fixed bottom-corner floating WhatsApp CTA pill (`52x52px`, `bottom: 20px`, `z-index: 40`). When a keyboard user tabs forward (`Tab`) or backward (`Shift+Tab`), focused links or inputs near the top or bottom of the viewport could be hidden behind these fixed layers.
- **Mandatory Architectural Fix:**
  1. Set dynamic scroll padding on the root `<html>` element:
     ```css
     html {
       scroll-padding-top: calc(var(--header-h, 74px) + var(--announcement-h, 0px) + 16px);
       scroll-padding-bottom: 92px; /* Clears 52px floating WhatsApp button + 20px offset + 20px buffer */
     }
     ```
  2. Position the floating WhatsApp CTA button at `inset-inline-end: 20px; bottom: 20px` so it never overlaps form submit buttons or main column text containers.

### 2.2 SC 2.5.7 — Dragging Movements (Level AA)
- **Risk in Bayyora:** The interactive `BeforeAfterSlider` on `/services/*` and `/our-work` uses horizontal pointer dragging to reveal the "Before" and "After" transformation.
- **Mandatory Architectural Fix:**
  1. Provide single-tap / single-click non-dragging segmented controls (`قبل / Before`, `مقارنة 50% / Split`, `بعد / After`) directly above or below the slider on **both desktop and mobile** (upgrading `06-UX-AND-USER-JOURNEYS.md:95` which previously only specified tap tabs on mobile).
  2. Allow clicking/tapping anywhere along the slider track to jump the divider to that position without dragging.
  3. Expose a semantic `<input type="range" min="0" max="100" step="10">` with localized `aria-label` (`مقارنة التصميم قبل وبعد` / `Before and after design comparison`) operable via keyboard arrow keys (`ArrowLeft`, `ArrowRight`, `Home`, `End`).

### 2.3 SC 2.5.8 — Target Size (Minimum) (Level AA)
- **Requirement:** Every interactive pointer target must be at least **`24x24 CSS pixels`** (or have a `24px` spacing circle around its center that does not intersect any other target).
- **Bayyora Target Standard:**
  - Primary/Secondary Buttons, Form Inputs, Select Triggers, Accordion Headers, Mobile Nav Links, Floating WhatsApp Button: **`>= 44x44 CSS px`** (`48px` standard height).
  - Header Nav Links, Filter Pills, Seasonal Tabs, Footer Links, Legal Bar Links: **`min-h-[36px] inline-flex items-center py-1.5`** with at least `8px` gap between adjacent targets (`gap-2` minimum).
  - Compact Icon Buttons (e.g., modal/drawer close `X` or announcement bar dismiss): Use the `touch-hitbox` pseudo-element pattern (`min-w-[44px] min-h-[44px]`) so the hit area is always `>= 44x44px`.

### 2.4 SC 3.2.6 — Consistent Help (Level A)
- **Requirement:** Help mechanisms (Bayyora's WhatsApp contact link, business phone/email, and `/faq` link) must appear in the same relative order across every page in header, floating widget, and footer landmarks.

### 2.5 SC 3.3.7 — Redundant Entry (Level A)
- **Risk in Bayyora:** A shop owner fills out the 6-field `/free-audit` form (`Name`, `Shop Name`, `City`, `WhatsApp`, `Instagram/Maps Link`, `Help Needed`) and then clicks the post-submission WhatsApp confirmation button (`REC-003`) or navigates to `/contact`.
- **Mandatory Architectural Fix:**
  - The post-submission WhatsApp button on `/free-audit` automatically interpolates the submitted `name`, `shopName`, and `city` into the `wa.me` pre-filled text so the user does not have to re-type their shop details on WhatsApp.
  - Within the same browser session (`sessionStorage`), if a user navigates from `/free-audit` to `/contact` (or vice versa), previously entered fields (`name`, `shopName`, `city`, `whatsapp`) pre-populate automatically.

### 2.6 SC 3.3.8 — Accessible Authentication (Minimum) (Level AA)
- **Requirement:** Authentication flows (`/admin/login` and any anti-spam protection on `/free-audit` and `/contact`) must not require a cognitive function test (such as transcribing distorted text or solving visual object-recognition puzzles) unless an alternative is provided.
- **Mandatory Architectural Fix:**
  - `/admin/login` inputs must include proper `autocomplete="username"` and `autocomplete="current-password"`, allow pasting passwords (`onPaste` never blocked), and support WebAuthn passkeys / TOTP autofill (`autocomplete="one-time-code"`).
  - Public forms (`/free-audit`, `/contact`) use **Cloudflare Turnstile in Non-Interactive / Managed mode** + server-side honeypot/rate limiting—never puzzle CAPTCHAs.

---

## 3. Semantic HTML, Landmarks & Heading Hierarchy

1. **Skip-to-Content Link:** Every page renders a localized skip link as the first focusable child of `<body>`:
   - Arabic (`/`): `<a href="#main-content" className="sr-only focus:not-sr-only ...">تخطي إلى المحتوى الرئيسي</a>`
   - English (`/en/`): `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>`
2. **Required Page Landmarks:**
   - `<header role="banner">` (with Announcement Bar inside `<aside aria-label="...">` above nav)
   - `<nav aria-label="القائمة الرئيسية | Main navigation">`
   - `<main id="main-content" tabIndex={-1}>`
   - `<footer role="contentinfo" aria-label="تذييل الصفحة | Site footer">`
3. **Strict Heading Hierarchy (`<h1> -> <h2> -> <h3>`):**
   - Exactly **one `<h1>` per page** (enforced by the CMS SEO Admin Validator in `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md`).
   - Section eyebrow pills (`خدماتنا / Our Services`, `الباقات / Packages`) are rendered as `<p>` or `<span>` inside the section header—never as `<h4/h5>` above an `<h2>` (which would create an out-of-order heading tree `H4 -> H2`).

---

## 4. Bilingual RTL (`ar`) & LTR (`en`) Accessibility Rules

1. **Root Document Attributes (`src/app/(frontend)/[locale]/layout.tsx`):**
   - Arabic routes (`/`): `<html lang="ar" dir="rtl">`
   - English routes (`/en/*`): `<html lang="en" dir="ltr">`
2. **Inline Language Switching (`lang` & `dir` Isolation):**
   - The Language Switcher button in the Arabic header (`English`) must carry `lang="en" dir="ltr"`, and the switcher button in the English header (`عربي`) must carry `lang="ar" dir="rtl"` so screen readers (NVDA, VoiceOver, TalkBack) switch voice synthesizers accurately.
   - Bidirectional tokens inside Arabic prose—phone numbers (`<span dir="ltr">+966 5X XXX XXXX</span>`), URLs, Instagram handles (`@handle`), and English brand/package subtitles (`Bidaya`, `Numow`, `Riyada`)—must be wrapped in `dir="ltr"` (or `bdi`) so punctuation (`+`, `@`, `/`) never jumps to the wrong side of the string.
3. **Keyboard Directionality in RTL:**
   - In `dir="rtl"`, horizontal tab lists (`SeasonalCampaignTabs`, `PortfolioFilterGrid`) and sliders (`BeforeAfterSlider`) must invert `ArrowLeft` (moves **next** in RTL reading order) and `ArrowRight` (moves **previous** in RTL reading order). Radix UI primitives handle this automatically when `dir={locale === 'ar' ? 'rtl' : 'ltr'}` is passed to `<DirectionProvider>` or the component root.

---

## 5. CMS-Enforced Accessibility Guardrails

To ensure non-technical editors cannot accidentally degrade accessibility over time:
1. **`ThemeSettings` Contrast Gate (`18-DESIGN-CUSTOMIZATION-AND-THEMING.md`):** Blocks saving any custom color palette where text/surface contrast falls below `4.5:1` or input border contrast falls below `3.0:1`, and rejects mid-luminance accent colors ($0.175 < L < 0.240$) that fail `4.5:1` against both white and dark navy.
2. **`Media` Alt-Text Requirement (`16-CMS-ADMIN-ARCHITECTURE.md`):** All content images require localized `alt` (`ar` and `en`) unless explicitly flagged `isDecorative: true` (which renders `alt="" role="presentation"`).
3. **Lexical Rich-Text Guard (`19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md`):** Disallows inserting `<h1>` inside rich-text editors (restricts editors to `H2`, `H3`, `H4`) and prohibits empty links or unlabelled icon links.

---

## 6. Automated & Manual Accessibility Verification Protocol

| Verification Layer | Tooling / Method | Pass Criteria (Release Gate) |
| :--- | :--- | :--- |
| **1. Component Unit A11y** | `vitest` + `vitest-axe` | Zero violations across all interactive components (`Button`, `Header`, `FaqAccordion`, `FreeAuditForm`, `BeforeAfterSlider`, `PackageCard`). |
| **2. E2E Route Scan** | `Playwright` + `@axe-core/playwright` (`withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])`) | **0 Critical / Serious / Moderate violations** across representative Arabic (`/`) and English (`/en/`) routes at `360px` and `1440px`. |
| **3. Keyboard & Focus-Not-Obscured E2E** | Playwright keyboard tabbing script | Every interactive element reachable via `Tab`/`Shift+Tab`; bounding box of `:focus-visible` element never intersects sticky header (`y >= headerBottom`) or floating WhatsApp pill (`SC 2.4.11`). |
| **4. 200% Zoom & `320px/360px` Reflow** | Playwright viewport check (`320px` & `360px`) | `document.documentElement.scrollWidth <= window.innerWidth` (zero horizontal scrollbar per `SC 1.4.10`). |
| **5. Screen Reader Spot Check** | Manual NVDA / VoiceOver check on `/` (AR) and `/en` (EN) | Landmarks, `aria-expanded` states, form validation errors (`aria-live`), and bilingual language switches read accurately. |

