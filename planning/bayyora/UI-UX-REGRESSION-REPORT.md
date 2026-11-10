# BAYYORA — UI/UX, RESPONSIVE, RTL/LTR & ACCESSIBILITY REGRESSION REPORT (`UI-UX-REGRESSION-REPORT.md`)

**Project:** Bayyora (بيّورا)  
**Scope:** Visual Hierarchy, Responsive Breakpoints (`360×800` to `1920×1080`), Arabic RTL & English LTR Parity, WCAG 2.2 AA Accessibility & Technical SEO  
**Date:** 2026-11-09

---

## 1. UI/UX & Responsive Layout Repairs

### 1.1 Package & Starter Bundle Card Layout (`UI-001`)
- **Before:** `.cq-card` in `src/app/(frontend)/globals.css` used `container: card / inline-size` inside a flex parent (`<AnimatedStaggerItem className="flex min-w-0">`). Because CSS inline-size containment sets intrinsic inline width contribution to `0px`, flex items without `flex-1` or `w-full` collapsed to min-content width (~180px) on 2-column desktop grids (`/en/packages`).
- **After:** Removed `container: card / inline-size` from `.cq-card`, added `width: 100%`, and added `w-full` / `flex-1` in `src/components/domain/PackageCardGrid.tsx`. Both 3-column Monthly Package grids and 2-column Starter Bundle grids now fill 100% of their CSS Grid tracks across all viewports (`360px` to `1920px`).

### 1.2 Solid Sticky Header Bar (`UI-002`)
- **Before:** `.sticky-header-container` used `container-type: scroll-state` and `backdrop-filter: blur(12px)` with a translucent background, allowing white text on dark navy sections (`.section-navy`) to bleed through behind dark-navy header navigation links.
- **After:** Updated `.sticky-header-bar` in `src/app/(frontend)/globals.css` to use a 100% opaque surface background (`background-color: var(--color-surface, #ffffff)`) with a crisp `1px` bottom border and subtle elevation shadow when scrolled.

### 1.3 Mobile Floating WhatsApp Clearance (`UI-002`)
- **Before:** `Footer.tsx` had `pb-8` at the bottom bar, allowing the fixed `FloatingWhatsApp` button (`bottom-5 end-5 z-40`) to overlap copyright/legal links at the very bottom of mobile viewports.
- **After:** Increased bottom footer padding to `pb-24 lg:pb-24` in `src/components/layout/Footer.tsx`.

### 1.4 Tailwind v3.4 Utility Completeness (`UI-001`)
- Added `boxShadow: { '2xs': '0 1px 2px 0 rgb(13 34 53 / 0.04)', xs: '0 1px 3px 0 rgb(13 34 53 / 0.06), 0 1px 2px -1px rgb(13 34 53 / 0.06)' }` and `backdropBlur: { xs: '2px' }` in `tailwind.config.ts` so every `shadow-xs`, `shadow-2xs`, and `backdrop-blur-xs` class generates valid CSS.

---

## 2. Arabic RTL & English LTR Parity Repairs (`RTL-001` – `RTL-004`)

1. **Directional Back-Link Arrow (`RTL-001`):**
   - Fixed `src/app/(frontend)/[locale]/our-work/[slug]/page.tsx` to render `→ العودة إلى معرض الأعمال` in Arabic RTL and `← Back to Our Work` in English LTR.
2. **Bidirectional Isolation (`dir="ltr"`) on Numeric & Latin Identifiers (`RTL-002`):**
   - Added explicit `dir="ltr"` to Commercial Registration (`CR`), VAT Registration (`VAT`), Saudi Business Center ID (`SBC`), phone numbers, and email addresses in `src/components/layout/Footer.tsx` and `src/app/(frontend)/[locale]/[slug]/page.tsx`.
3. **Pure Arabic Placeholder in RTL Audit Form (`RTL-003`):**
   - Updated `SEED_UI_STRINGS.ar.auditFormUi.linkPlaceholder` to `مثال: حساب المحل في إنستقرام أو رابط خرائط جوجل` so RTL inputs never suffer bidirectional punctuation scrambling.
4. **Locale-Aware 404 Page (`LOC-001`, `RTL-004`):**
   - Updated `src/app/(frontend)/[locale]/not-found.tsx` to detect the active locale via `usePathname()` and render exclusively Arabic on `/...` and exclusively English on `/en/...`, passing `dir={isAr ? 'rtl' : 'ltr'}` to `<RisingLineSvg />`.

---

## 3. WCAG 2.2 AA Accessibility Repairs (`A11Y-001` – `A11Y-006`)

1. **Color Contrast (`A11Y-001` — WCAG 1.4.3):**
   - Updated `--color-whatsapp` from `#128c7e` (`4.21:1` with white text) to `#0e7a6d` (`--rgb-whatsapp: 14 122 109`, **`5.22:1`** contrast ratio with `#ffffff`), ensuring all WhatsApp buttons pass WCAG 2.2 AA (`>= 4.5:1`).
2. **Heading Hierarchy (`A11Y-002` — WCAG 1.3.1):**
   - Added `<h2 className="sr-only">` before `<FaqAccordion />` on `/faq` and added section `<h2>` headings to `beforeAndAfter` and `portfolioGrid` blocks in `src/blocks/RenderBlocks.tsx` so no page skips from `<h1>` to `<h3>`.
3. **Desktop Dropdown & Mobile Drawer ARIA / Focus Trap (`A11Y-003`, `A11Y-005` — WCAG 2.1.2, 4.1.2):**
   - Removed invalid `role="menu"` / `role="menuitem"` from the Desktop Services disclosure dropdown in `src/components/layout/Header.tsx` and wired `id="desktop-services-menu"` + `aria-controls="desktop-services-menu"`.
   - Implemented a full `Tab` / `Shift+Tab` keyboard focus trap inside `#mobile-nav-drawer` (`role="dialog" aria-modal="true"`).
4. **Form Error Announcements (`A11Y-004` — WCAG 3.3.1, 3.3.2):**
   - Rendered inline field errors for `shopName` and `pdplConsent` and wired `aria-describedby` across inputs in `src/components/forms/ContactForm.tsx` and `src/components/forms/FreeAuditForm.tsx`.
5. **Interactive Widget Keyboard & Touch Targets (`A11Y-006` — WCAG 2.1.1, 2.5.8):**
   - Added `role="button"`, `tabIndex={0}`, and `Enter`/`Space` keyboard activation to comparison rows in `src/components/domain/HeroComparisonCard.tsx`, increased Pause/Play button touch target height to `min-h-9` (`36px`), and added `aria-pressed` to preset buttons in `src/components/domain/BeforeAfterSlider.tsx`.

