# 26 — Motion & Animation System Specification

**Project:** Bayyora (بيّورا) — Saudi Digital Marketing & Creative Agency  
**Tagline:** خطوة لفوق — *One step up*  
**Document Version:** 1.0  
**Status:** Active Specification (Aligned with `web-animation-design` Skill, Core Web Vitals & WCAG 2.2 AA)  
**Cross-References:** `08-NEXTJS-TECHNICAL-ARCHITECTURE.md`, `21-TECH-STACK-DECISION-RECORD.md`, `24-UI-UX-SKILLS-AND-WORKFLOW.md`, `25-DESIGN-SYSTEM-SPECIFICATION.md`, `27-ACCESSIBILITY-DESIGN-STANDARDS.md`

---

## 1. Animation Technology Evaluation & Decision Record

Per Section 5 of the UI/UX & Motion setup requirements, we evaluated three animation approaches for Bayyora's Next.js 15 App Router + React 19 architecture:

| Candidate | Bundle Weight (gzipped) | React 19 / Next.js 15 Compatibility | GPU & Accessibility Support | Decision for Bayyora |
| :--- | :--- | :--- | :--- | :--- |
| **1. CSS Transitions & Keyframes + Tailwind CSS** | **`0 KB` JS** | Native browser support; works inside React Server Components without `"use client"`. | Runs on the compositor thread (`transform`, `opacity`); native `@media (prefers-reduced-motion: reduce)`. | **SELECTED (Tier 1 Default):** Mandatory for all button press states, card hover lifts, focus rings, link underlines, and Radix accordion/dropdown/drawer CSS state transitions (`data-[state=open]`). |
| **2. Motion for React (`motion` package, imported via `motion/react`)** | **`~15 KB` (with `LazyMotion` + `domAnimation`)** | Official successor to `framer-motion`; first-class React 19 & Next.js 15 support. | Built-in `useReducedMotion()` hook, `<MotionConfig reducedMotion="user">`, interruptible spring physics, and `AnimatePresence` exit animations. | **SELECTED (Tier 2 Interactive Islands):** Used strictly in isolated Client Components requiring exit animations, layout morphing (Seasonal Campaign & Portfolio Filter tabs), or gesture/drag physics (`BeforeAfterSlider`). Always wrap with `<LazyMotion features={domAnimation}>` to keep bundle impact minimal. |
| **3. GSAP (`gsap` + `ScrollTrigger`)** | **`~28–45 KB` JS** | Requires manual `useLayoutEffect` / cleanup refs and `"use client"` wrappers. | Imperative DOM manipulation can conflict with React concurrent rendering and cause CLS if pins/spacers are injected on mobile. | **NOT RECOMMENDED (Excluded from Core Bundle):** Bayyora's conversion-focused agency site does not use pinned scroll-jacking or complex multi-stage canvas timelines. Excluding GSAP saves `~40 KB` of main-thread JS on mobile. |

---

## 2. Centralized Motion Tokens (`globals.css` & `src/lib/motion-tokens.ts`)

All CSS transitions and `motion/react` animations must reference the centralized token scale below. Arbitrary magic numbers (`transition: all 0.5s linear`) are prohibited.

### 2.1 Duration Tokens

| Token Name | CSS Variable | Value | Target Use Case |
| :--- | :--- | :--- | :--- |
| `duration-instant` | `--duration-instant` | `0ms` | Keyboard navigation focus, subsequent tooltips (`[data-instant]`), and `prefers-reduced-motion: reduce` fallback. |
| `duration-micro` | `--duration-micro` | `120ms` | Button `:active` press scale (`scale(0.98)`), checkbox/radio toggle, color/border hover state. |
| `duration-fast` | `--duration-fast` | `180ms` | Dropdown menus, popovers, language switcher pill, tab indicator switch, exit animations (`~20%` faster than entrance). |
| `duration-normal` | `--duration-normal` | `240ms` | FAQ accordion expand/collapse, modal dialog entrance, mobile navigation drawer slide-over, card hover elevation. |
| `duration-reveal` | `--duration-reveal` | `400ms` | Subtle above-the-fold Hero transformation card entrance or single-pass section scroll reveal (marketing context only). |

> **Hard Ceiling Rule (`web-animation-design`):** Interactive UI animations (buttons, dropdowns, modals, drawers, tabs, accordions) **must never exceed `300ms`**.

### 2.2 Easing Curve Tokens (The Easing Blueprint)

| Token Name | CSS Variable | Cubic-Bezier / Spring Definition | Mandatory Usage Rule |
| :--- | :--- | :--- | :--- |
| `ease-out-quart` | `--ease-out` | `cubic-bezier(0.165, 0.84, 0.44, 1)` | **Elements Entering or Exiting:** Modals, mobile nav drawer, dropdowns, toast alerts, scroll reveals. Fast initial acceleration creates instant responsiveness. |
| `ease-in-out-cubic` | `--ease-in-out` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | **On-Screen Morphing / Movement:** Active tab pill sliding between Seasonal Campaign tabs (`رمضان`, `العيد`, `اليوم الوطني`) or Portfolio filter tabs. |
| `ease-standard` | `--ease-hover` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | **Hover & Color Transitions:** Background color, border color, and subtle card elevation. |
| `spring-snappy` | *(Motion JS Token)* | `{ type: 'spring', duration: 0.28, bounce: 0.1 }` | **Interruptible UI Gestures:** `BeforeAfterSlider` handle release or shared-layout tab indicator (`layoutId`). |

> **Prohibited Easings:** Never use `ease-in` for UI entrances (makes the interface feel sluggish due to slow start) and never use `linear` except for determinate progress indicators or loading spinners.

---

## 3. Component-by-Component Interaction & Motion Matrix

### 3.1 Button & CTA Feedback (CSS Only)
- **Press Feedback:** `active:scale-[0.98] transition-transform duration-[120ms] ease-out`
- **Hover Feedback (Pointer Devices Only):**
  ```css
  @media (hover: hover) and (pointer: fine) {
    .btn-interactive:hover {
      transform: translateY(-1px);
    }
  }
  ```
- **Directional Arrow Icon Inside Link/CTA:** Translates `3px` toward the inline end (`ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1`) in `150ms var(--ease-out)`.

### 3.2 Card Hover Interactions (CSS Only — Anti-Flicker Pattern)
- Per `web-animation-design`, only apply hover elevation on devices with a fine pointer (`@media (hover: hover) and (pointer: fine)`).
- Maximum vertical translation on `ServiceCard` or `PortfolioCard` is `-3px` (`-translate-y-[3px]`) over `200ms var(--ease-hover)` with shadow transition via pseudo-element opacity (or subtle border-color transition to `--color-oasis`).

### 3.3 Header Dropdowns & Popovers (Radix + CSS)
- **Origin-Aware Scaling:** Never scale from `scale(0)` or `center`. Always start from `scale(0.96)` and `opacity: 0` anchored to `transform-origin: var(--radix-navigation-menu-viewport-transform-origin)` (or `top start` in logical coordinates).
- **Enter:** `180ms var(--ease-out)` (`opacity: 0 -> 1`, `scale(0.96) -> scale(1)`).
- **Exit:** `140ms var(--ease-out)` (`opacity: 1 -> 0`, `scale(1) -> scale(0.97)`).

### 3.4 Mobile Navigation Drawer (RTL / LTR Direction-Aware)
- **Paired Elements Rule:** The drawer panel and the backdrop overlay (`bg-navy/60`) must share the exact same duration (`240ms`) and easing (`var(--ease-out)`).
- **RTL vs. LTR Slide Direction:**
  - In Arabic (`dir="rtl"`), the hamburger button sits on the left (`inline-end`), so the drawer slides in from the **left edge** (`translateX(-100%) -> translateX(0)`).
  - In English (`dir="ltr"`), the hamburger button sits on the right (`inline-end`), so the drawer slides in from the **right edge** (`translateX(100%) -> translateX(0)`).

### 3.5 FAQ Accordion (`@radix-ui/react-accordion`)
- Uses Radix's measured `--radix-accordion-content-height` CSS variable with `overflow: hidden` and `220ms var(--ease-out)` height/opacity transition, paired with a `180deg` chevron rotation (`transition-transform duration-[220ms] ease-out`).
- Under `@media (prefers-reduced-motion: reduce)`, `animation-duration: 0.01ms` expands the answer immediately without layout sliding.

### 3.6 Seasonal Campaign Tabs & Portfolio Filter Grid (`motion/react`)
- **Tab Pill Indicator:** Uses `motion.span` with `layoutId="active-tab-pill"` and `transition={{ type: 'spring', duration: 0.25, bounce: 0.08 }}` for smooth on-screen movement.
- **Tab Content / Filtered Grid Cards:** Cross-fades with `initial={{ opacity: 0, y: 6 }}` to `animate={{ opacity: 1, y: 0 }}` (`duration: 0.18`, `ease: [0.165, 0.84, 0.44, 1]`). Never animate from `scale(0)`.

### 3.7 Before / After Transformation Slider (`BeforeAfterSlider.tsx`)
- **Compositor-Only Clipping:** Rather than animating `width` (which triggers layout recalculation on every drag frame), the "Before" overlay layer is clipped using `clip-path: inset(0 var(--clip-end) 0 0)` (or `scaleX` + counter-scaled inner image) updated via a React `ref` (`requestAnimationFrame`) during pointer drag for locked `60fps` performance on mid-range Android phones.
- **Non-Drag Accessibility Controls (WCAG 2.2 SC 2.5.7):** Includes clickable preset pills (`قبل / Before` -> `100%`, `مقارنة / Split` -> `50%`, `بعد / After` -> `0%`) and keyboard `<input type="range">` (`ArrowLeft`/`ArrowRight` in `10%` steps) that animate the divider smoothly over `220ms var(--ease-in-out)`.

### 3.8 Section Scroll Reveal Policy (Restraint Rule)
- Per `frontend-design` (`SKILL.md:278`), scattering fade-and-slide-up animations on every single paragraph and card down the page reads as a generic AI template and hurts mobile scroll responsiveness.
- **Bayyora Scroll Reveal Rule:**
  1. Above-the-fold Hero content renders **immediately on SSR (`opacity: 1`)** so LCP (`<= 2.0s`) is never delayed by JavaScript hydration or opacity animations!
  2. Below-the-fold section containers may use a single, subtle `IntersectionObserver` (`threshold: 0.15`, `triggerOnce: true`) fade-in (`opacity: 0 -> 1`, `translateY(12px -> 0)`, `350ms var(--ease-out)`), limited to at most 1 container reveal per section—never per-card staggered waterfalls that delay reading.

---

## 4. Performance & Accessibility Guardrails for Motion

1. **The Golden Compositor Rule:** Only animate `transform` (`translate3d`, `scale`, `rotate`) and `opacity` (plus `clip-path` where needed). Never animate `margin`, `padding`, `top`, `left`, `width`, or `box-shadow` directly on main-thread scroll or drag loops.
2. **Never Animate Keyboard Navigation:** Tab focus rings (`:focus-visible`) and arrow-key list/tab traversal must update **instantly (`0ms`)** so keyboard users experience zero lag.
3. **Global Reduced-Motion Enforcement:**
   - **Global CSS Reset (`globals.css`):**
     ```css
     @media (prefers-reduced-motion: reduce) {
       *, ::before, ::after {
         animation-duration: 0.01ms !important;
         animation-iteration-count: 1 !important;
         transition-duration: 0.01ms !important;
         scroll-behavior: auto !important;
       }
     }
     ```
   - **React Provider (`src/app/(frontend)/[locale]/layout.tsx`):** Wrap client motion islands in `<MotionConfig reducedMotion="user">`, which automatically disables transform/spatial animations while preserving accessible opacity cross-fades across all `motion.*` components when the user's OS has Reduced Motion enabled.

