# 03 — Brand & Design System Specification

**Project:** Bayyora (بيّورا)  
**Author:** Agent 2 (Brand & Design System Agent)  
**Inputs:** `Doc A` (§1–2), `Doc B` (`index.html` & visual reference screenshot), `01-PRD.md`  
**Status:** Brand Name, Tagline & Readex Pro `[CONFIRMED]` \| Color Palette, Voice & Logo Lockups `[PROPOSED — PENDING APPROVAL]`

---

## 1. Brand Foundation & Core Identity

### 1.1 Confirmed Brand Pillars (`[CONFIRMED]`)
- **Brand Name:** **Bayyora — بيّورا** (always written with the shadda on the *yā'*: `بيّورا`).
- **Etymology:** From the Arabic **بيّن** (*bayyin*), meaning *"to stand out, to be clearly seen"*.
- **Tagline:**
  - **Arabic:** `خطوة لفوق`
  - **English:** `One step up`
- **Brand Story & Visual Metaphor:** The tagline and the **Rising Line** motif tell a single story: a neighbourhood shop moving up a level — first being clearly seen (on the street, on Google Maps, and on phones), then growing step by step. Every service and every page shows progress as **Before → After**.

### 1.2 Logo System: The "Rising Line" Concept (`[PROPOSED — ARTWORK PENDING OD-005]`)
- **Primary Lockup Structure:**
  1. Large Arabic wordmark: **بيّورا**
  2. The **Rising Line** motif directly underneath
  3. Small Latin wordmark **"Bayyora"** positioned below
- **Four Proposed Logo Versions:**
  1. **Full Colour on Sand/White:** `Najd Night (#12233F)` wordmark + `Saffron Rise (#F2A541)` rising line.
  2. **Reversed on Najd Night:** `White (#FFFFFF)` wordmark + `Saffron Rise (#F2A541)` rising line.
  3. **Single-Colour Navy:** All elements in `Najd Night (#12233F)` for monochrome applications.
  4. **Square Icon (Avatar & Favicon):** The rising line + Arabic letter **ب** on a `Najd Night (#12233F)` square/rounded-square background.
- **Logo Governance Rules:**
  - **Clear Space:** Minimum clear space on all sides equal to the height of the Arabic letter **ب**.
  - **Minimum Size:** Minimum width of `120px` on web viewports.
  - **Prohibitions:**
    - Never recolour the wordmark in Saffron.
    - Never stretch, skew, or distort the lockup proportions.
    - Never place the logo over busy photography without a `Najd Night (#12233F)` overlay.
- **Directional Rule (RTL vs. LTR — `[CONFIRMED]`):**
  - **Arabic (`dir="rtl"` at `/`):** The rising line rises **toward the left** (following the Arabic reading direction).
  - **English (`dir="ltr"` at `/en/`):** The rising line and all page step/arrow motifs rise **toward the right** (following the English reading direction).
  - **Hard Constraint:** **Never flip or mix the rising direction inside a single page layout.** (Fixes the discrepancy observed in `index.html` where the logo pointed left while body arrows pointed right on English views.)

---

## 2. Color System & Accessibility Tokens (`[PROPOSED — PENDING APPROVAL OD-003]`)

> **Important Status Note:** The palette below is documented in `Doc A` §1 as **Proposed (pending Ataullah's approval)**. The earlier "Modern Najd" palette from the old placeholder brand name and the `#E4572E` terracotta orange used in `index.html` are superseded by this proposed palette upon approval.

### 2.1 Core Brand Color Tokens
| Token Name | CSS Custom Property | Hex Value | RGB | Role & Usage Allocation | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Najd Night** | `--color-najd-night` | `#12233F` | `18, 35, 63` | **Primary (25–30%):** Scrolled sticky header, global footer, featured package card (`Numow`), final CTA bands, primary logo wordmark on light backgrounds. | `[PROPOSED]` |
| **Saffron Rise** | `--color-saffron-rise` | `#F2A541` | `242, 165, 65` | **Accent (~10% max):** The Rising Line motif, primary CTA button fills, "Most Popular" badge fill, Before→After progress arrows, step numbers/markers. | `[PROPOSED]` |
| **Oasis Green** | `--color-oasis-green` | `#1F7A5C` | `31, 122, 92` | **Secondary (10–15%):** WhatsApp CTAs, success states (`✓`), local/Google Maps highlights, trust/verification icons, eyebrow labels on Sand/White. | `[PROPOSED]` |
| **Sand** | `--color-sand` | `#F5EFE4` | `245, 239, 228` | **Primary Light Canvas (45–50%):** Default page background, initial sticky header background, form input backgrounds. Warmer and more local than stark white. | `[PROPOSED]` |
| **Ink** | `--color-ink` | `#1A1A1A` | `26, 26, 26` | **Body Copy & High-Contrast Text:** Main body paragraphs, form input text, and high-contrast text on `Saffron Rise (#F2A541)` button fills. | `[PROPOSED]` |
| **White** | `--color-white` | `#FFFFFF` | `255, 255, 255` | **Surface / Card Background:** Service cards, package cards, FAQ accordions, Before/After comparison cards, form containers, and reversed text on `Najd Night` / `Oasis Green`. | `[PROPOSED]` |

### 2.2 Supporting UI & Semantic Tokens (Adapted from `index.html` to Harmonize with Proposed Palette)
| Token Name | CSS Custom Property | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Najd Night Elevated** | `--color-najd-elevated` | `#1C3558` | Subtle gradient/border companion on dark `Najd Night` cards. |
| **Saffron Hover** | `--color-saffron-hover` | `#E0922B` | Hover/active state for `Saffron Rise` buttons. |
| **Oasis Hover** | `--color-oasis-hover` | `#18634A` | Hover/active state for `Oasis Green` / WhatsApp buttons. |
| **Sand Soft / Divider** | `--color-sand-soft` | `#EAE0D0` | Card borders, table header backgrounds, subtle list dividers (`1px solid`). |
| **Muted Slate** | `--color-text-muted` | `#4A5568` | Secondary body copy, captions, form helper notes (passes WCAG AA on both `Sand` and `White`). |
| **Error Red** | `--color-error` | `#B3261E` | Form validation alerts and "Before" missing-feature markers (`✕`). |

### 2.3 WCAG 2.1 AA Contrast Matrix & Enforcement Rules
Document A explicitly mandates:
- *"navy on Sand and white on navy or green pass WCAG AA for text"*
- *"never put Saffron text on Sand or white; use Saffron as a fill, or on navy only"*

| Foreground (Text/Icon) | Background Surface | Contrast Ratio | WCAG 2.1 AA Verdict | Mandatory Design System Rule |
| :--- | :--- | :--- | :--- | :--- |
| `Najd Night (#12233F)` | `Sand (#F5EFE4)` | **12.9 : 1** | **AAA Pass** | Use for all H1/H2/H3 headings and primary UI elements on `Sand`. |
| `Ink (#1A1A1A)` | `Sand (#F5EFE4)` | **14.8 : 1** | **AAA Pass** | Use for body copy on `Sand`. |
| `Ink (#1A1A1A)` | `White (#FFFFFF)` | **17.4 : 1** | **AAA Pass** | Use for body copy inside `White` cards. |
| `White (#FFFFFF)` | `Najd Night (#12233F)` | **15.1 : 1** | **AAA Pass** | Use for headings and body text on `Najd Night` sections/footer. |
| `White (#FFFFFF)` | `Oasis Green (#1F7A5C)` | **5.2 : 1** | **AA Pass** | Use for white text/icons inside `Oasis Green` buttons and badges. |
| `Saffron Rise (#F2A541)` | `Najd Night (#12233F)` | **7.6 : 1** | **AAA Pass** | Safe for rising line, highlighted price/step callouts, and accent text **on Najd Night only**. |
| `Najd Night (#12233F)` | `Saffron Rise (#F2A541)` | **7.6 : 1** | **AAA Pass** | **Mandatory text color inside Saffron CTA buttons** (`#12233F` or `#1A1A1A` text on `#F2A541` fill). |
| `White (#FFFFFF)` | `Saffron Rise (#F2A541)` | **1.98 : 1** | **FAIL** | **PROHIBITED:** Never use white text on `Saffron Rise` buttons. |
| `Saffron Rise (#F2A541)` | `Sand (#F5EFE4)` / `White` | **1.7–1.9 : 1** | **FAIL** | **PROHIBITED:** Never use `Saffron Rise` for text or eyebrows on `Sand` or `White`. Use `Oasis Green (#1F7A5C)` or `Najd Night (#12233F)` with a small Saffron underline/pill instead. |

---

## 3. Typography System (`[CONFIRMED: Readex Pro]`)

### 3.1 Font Family & Weight Calibration
- **Font Family:** `'Readex Pro', Tahoma, Arial, sans-serif` (Self-hosted WOFF2 subsets for `arabic` and `latin`).
- **Script Optical Balancing Rule (`Doc A` §1):**
  - **Arabic (`html[lang="ar"]`):** Headlines use **Bold (`700`)** or **SemiBold (`600`)**; body text uses **Regular (`400`)**; UI buttons/labels use **SemiBold (`600`)**.
  - **English (`html[lang="en"]`):** Headlines use **one weight lighter** than Arabic (**SemiBold (`600`)** where Arabic uses `700`, and **Medium (`500`)** where Arabic uses `600`) so both scripts look visually balanced in stroke density and size.
- **Bilingual Pairing Rule:** Whenever Arabic and English appear together inside one lockup or card (e.g., slogan card or package subtitle), **the Arabic line comes first or on top**, with English smaller underneath.

### 3.2 Responsive Type Scale
| Element / Token | Desktop Size (`> 980px`) | Mobile Size (`\le 720px`) | Fluid CSS `clamp()` | Line Height (AR / EN) | Weight (AR / EN) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero H1** | `56px–62px` | `34px` | `clamp(2.125rem, 5vw, 3.75rem)` | `1.25` / `1.18` | `700` / `600` |
| **Page Header H1** | `48px–51px` | `32px` | `clamp(2rem, 4.5vw, 3.2rem)` | `1.25` / `1.20` | `700` / `600` |
| **Section Heading H2** | `36px–42px` | `27px` | `clamp(1.7rem, 3.4vw, 2.6rem)` | `1.30` / `1.25` | `700` / `600` |
| **Card Heading H3** | `20px–24px` | `19px` | `clamp(1.18rem, 2vw, 1.5rem)` | `1.35` / `1.30` | `600` / `500` |
| **Lead Paragraph (`.lead`)** | `19px` | `17px` | `clamp(1.06rem, 1.5vw, 1.18rem)` | `1.75` / `1.65` | `400` / `400` |
| **Body Copy (`body`)** | `17px` | `16px` | `1.0625rem` (`16px` mobile) | `1.75` / `1.65` | `400` / `400` |
| **Eyebrow / Badge** | `14px–15px` | `13px–14px` | `0.875rem` | `1.4` | `600` / `600` |
| **Fine Print / Meta** | `14px` | `13px` | `0.875rem` | `1.5` | `400` / `400` |

---

## 4. Layout, Grid, Spacing & Breakpoints

### 4.1 Container & Grid System (Adopted from `index.html`)
- **Max Container Width (`--wrap`):** `1160px` centered (`margin-inline: auto`), with horizontal padding `24px` on desktop/tablet and `16px` on mobile (`\le 720px`).
- **Narrow Reading Container (FAQ & Legal):** `820px` max-width for optimal readability.
- **Section Vertical Rhythm:**
  - Desktop/Tablet: `88px` top/bottom padding (`64px–72px` for Hero).
  - Mobile (`\le 720px`): `60px` top/bottom padding.
- **8px Spatial Scale:** `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`, `88px`.

### 4.2 Responsive Breakpoints
| Breakpoint Name | Media Query | Grid Behavior |
| :--- | :--- | :--- |
| **Desktop (Default)** | `> 980px` | 2-col Hero (`1.15fr 1fr`), 3-col Services/Packages/Work, 4-col Steps/Pain Strip/Footer (`1.4fr 1fr 1fr 1fr`). |
| **Tablet** | `@media (max-width: 980px)` | Hero, Why Bayyora, About, Form grids stack to `1fr`; Services, Packages, Work, Steps, and Footer become `2 columns` (`1fr 1fr`). |
| **Mobile (Phone-First Primary Target)** | `@media (max-width: 720px)` | All grids collapse to `1 column` (`1fr`); sticky header collapses to hamburger drawer + visible language toggle + compact CTA; floating WhatsApp button remains accessible in thumb zone. |

---

## 5. Core UI Component Specifications

### 5.1 Buttons & CTAs
All interactive buttons must enforce a **minimum touch target height of `48px`** (`padding: 12px 24px`), pill border-radius (`999px`), `font-weight: 600`, inline icon gap `10px`, and subtle press feedback (`transform: scale(0.98)`).
1. **Primary Step-Up Button (`.btn-saffron`):**
   - Background: `Saffron Rise (#F2A541)` \| Text: `Najd Night (#12233F)` \| Hover: `#E0922B`.
   - Usage: "Free mini audit" (`اطلب تحليل مجاني`), primary form submit buttons, final CTA band action.
2. **WhatsApp Primary Button (`.btn-whatsapp`):**
   - Background: `Oasis Green (#1F7A5C)` (or verified WhatsApp accessible green `#178A45`) \| Text & Icon: `White (#FFFFFF)`.
   - Usage: Hero WhatsApp CTA, service inquiry CTAs, floating WhatsApp button.
3. **Secondary Ghost Button (`.btn-ghost`):**
   - Background: `transparent` \| Border: `2px solid Najd Night (#12233F)` \| Text: `Najd Night (#12233F)` \| Hover: fills `Najd Night` with `White` text.
4. **Reversed Ghost / Light Button (`.btn-light`):**
   - For use on `Najd Night` dark sections: `White (#FFFFFF)` background with `Najd Night (#12233F)` text.

### 5.2 Header & Navigation
- **Layout (RTL Arabic):** Logo lockup on the **far right**; 6 navigation links centered (`الرئيسية · خدماتنا · الباقات · أعمالنا · من نحن · تواصل معنا`) with an accessible dropdown/mega-menu on `خدماتنا` listing all 9 services in sitemap order; Language Switcher (`EN`) + Saffron `اطلب تحليل مجاني` button on the **far left**.
- **Layout (LTR English):** Exact mirror (Logo on far left, nav centered, `عربي` switch + Saffron `Free mini audit` button on far right).
- **Sticky Scroll Transition:** Starts with `Sand (#F5EFE4)` background (`rgba(245, 239, 228, 0.95)` with `backdrop-filter: blur(8px)`), transitioning smoothly to `Najd Night (#12233F)` with reversed white text and reversed logo once scrolled past `40px`.
- **Mobile Navigation (`\le 720px`):** Note that in `index.html`, `.nav-actions .btn { display: none }` hid the "Free audit" button on mobile. **To satisfy Document A's requirement ("Always visible: the language switch (EN / عربي) and the button 'اطلب تحليل مجاني / Free mini audit'"), the mobile header must keep a compact "Free audit" CTA visible or pinned in the mobile bar alongside the language switch and hamburger toggle.**

### 5.3 Cards, Before/After Modules & Recurring Motifs
- **Service Cards (`.svc-card`):** `White (#FFFFFF)` surface, `16px` border-radius, `24px` padding, circular icon badge (`52x52px` in `Oasis Green` or `Najd Night` with `Saffron Rise` accent dot), H3 title, concise 1-line benefit statement, and subtle hover lift (`translateY(-3px)`). **No price line is shown.**
- **Package Cards (`.plan`):** 3-column grid (`Bidaya`, `Numow`, `Riyada`). `Bidaya` and `Riyada` use `White (#FFFFFF)` surfaces; **`Numow` ("Most popular / الأكثر طلبًا")** uses `Najd Night (#12233F)` background with a `Saffron Rise (#F2A541)` top badge. Each card displays package name, positioning subline, bulleted deliverables with `Oasis Green` checkmarks, and a full-width *"اطلب عرض سعر / تحليل مجاني — Request a quote / free mini audit"* button.
- **Before → After Comparison Module (`.compare` / `.ba-card`):**
  - Side-by-side (2-column desktop, stacked or swipeable on mobile) visual comparison.
  - **"Before" Card:** Muted neutral tag (`قبل / Before`), low-contrast border, red `✕` markers for missing basics.
  - **"After" Card:** Highlighted `3px solid Saffron Rise (#F2A541)` outline, Saffron/Najd Night badge (`بعد / After`), `Oasis Green (#1F7A5C)` `✓` checkmarks, connected by the **Rising Line** arrow.
  - **Mandatory Sample Badge:** Every conceptual example carries a clear pill badge: `نموذج توضيحي` (AR) / `Sample concept` (EN).
- **Recurring Motif:** The **Rising Line** and a **4-step stair graphic** are used as section dividers, step progression indicators, and Before/After connectors.

---

## 6. Next.js, Tailwind CSS & CMS Theme Token Architecture

### 6.1 Centralized Design Tokens via Payload CMS (`ThemeSettings`)
All visual tokens defined in Sections 2, 3, and 4 are stored centrally in the **`ThemeSettings` Global** inside Payload CMS and injected as CSS Custom Properties (`--color-najd-night`, `--color-saffron-rise`, `--color-oasis-green`, `--color-sand`, `--color-ink`, `--color-white`, `--radius-card`, `--radius-button`, `--container-max`) on the root `<html>` element by the Next.js Root Server Layout (`src/app/(frontend)/[locale]/layout.tsx`).
- **Tailwind CSS Binding:** `tailwind.config.ts` maps semantic class names (`bg-brand-navy`, `bg-brand-saffron`, `bg-brand-oasis`, `bg-brand-sand`, `text-brand-ink`, `rounded-card`, `max-w-wrap`) directly to these CSS custom properties so that updating an approved token in the Admin Dashboard immediately updates all components site-wide upon cache revalidation.
- **Logical Properties in Tailwind:** Use logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`) across all React components to ensure automatic RTL (`dir="rtl"`) and LTR (`dir="ltr"`) mirroring without duplicate stylesheets.
- **Iconography (`Lucide Icons` + Brand SVGs):** Standard UI icons use tree-shaken `lucide-react` Server Components (configurable per Service/Feature in the CMS icon picker), paired with custom inline SVGs for the directional **Rising Line** (`RisingLineSvg`) and **WhatsApp** (`WhatsAppIcon`).
- *(See `18-DESIGN-CUSTOMIZATION-AND-THEMING.md` for the complete schema and governance rules of the CMS Theme Customizer.)*




---

## 7. Integration with UI/UX Skills, Design System v2 & Motion Specifications (`24`–`28`)

This document is supplemented and extended by the dedicated UI/UX, Motion, and Accessibility specifications:
- **Skill Routing & Anti-AI-Cliché Guardrails:** See `24-UI-UX-SKILLS-AND-WORKFLOW.md` and `.agents/skills/` (`ui-ux-pro-max`, `frontend-design`, `web-design-guidelines`, `web-animation-design`).
- **Calibrated WCAG 2.2 AA Tokens & Component State Matrix:** See `25-DESIGN-SYSTEM-SPECIFICATION.md` (which resolves the mid-luminance terracotta contrast gap and establishes `--color-border-input: #7A869A` for `>= 3.0:1` input boundary contrast).
- **Centralized Motion & Animation Tokens (`motion/react` + CSS Transitions):** See `26-MOTION-AND-ANIMATION-SYSTEM.md`.
- **WCAG 2.2 AA Standards (`SC 2.4.11`, `SC 2.5.7`, `SC 2.5.8`, `SC 3.3.7`, `SC 3.3.8`):** See `27-ACCESSIBILITY-DESIGN-STANDARDS.md`.
