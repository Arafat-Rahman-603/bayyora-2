# 11 — Accessibility Audit (WCAG 2.2 Level AA — Agent I)

**Project:** Bayyora (بيّورا)  
**Auditor:** Agent I (Accessibility Specialist)  
**Target Standard:** **W3C WCAG 2.2 Level AA**  
**Primary Audited Files:** `planning/bayyora/03-BRAND-AND-DESIGN-SYSTEM.md`, `06-UX-AND-USER-JOURNEYS.md`, `12-QA-AND-ACCEPTANCE-CRITERIA.md`, `18-DESIGN-CUSTOMIZATION-AND-THEMING.md`, `25-DESIGN-SYSTEM-SPECIFICATION.md`, `27-ACCESSIBILITY-DESIGN-STANDARDS.md`

---

## 1. Accessibility Findings & Resolution Status

Our adversarial audit of `01` through `23` identified two major accessibility defects—both of which have now been **remediated at the specification level in `25-DESIGN-SYSTEM-SPECIFICATION.md` and `27-ACCESSIBILITY-DESIGN-STANDARDS.md`**, with two remaining schema updates required in `18-DESIGN-CUSTOMIZATION-AND-THEMING.md`:

---

### Finding `AUD-039` — Mathematical WCAG Contrast Failure in `reference_terracotta` (`#E4572E` = `3.68:1`) & `1.14:1` Input Border Contrast, Plus Missing Fields in `ThemeSettings` Validator
- **Category:** Accessibility (WCAG 2.2 SC 1.4.3 Contrast Minimum & SC 1.4.11 Non-Text Contrast)
- **Severity:** **Critical** *(Resolved in `25-DESIGN-SYSTEM-SPECIFICATION.md`; Schema sync required in `18`)*
- **Confidence:** Confirmed (Mathematical Luminance Proof)
- **Location:** `planning/bayyora/18-DESIGN-CUSTOMIZATION-AND-THEMING.md:24, 58-71, 88-98`; `03-BRAND-AND-DESIGN-SYSTEM.md:53-54, 64`
- **Evidence & Mathematical Proof:**
  1. `18:91` claimed that `#E4572E` (`reference_terracotta`) has `"3.9–4.5 : 1"` contrast with `#FFFFFF`. In reality, $L(\text{\#E4572E}) = 0.23506$, giving $(1.0 + 0.05)/(0.23506 + 0.05) = \mathbf{3.68 : 1}$ with `#FFFFFF` (**FAILS `4.5:1`**) and $(0.23506 + 0.05)/(0.0168 + 0.05) = \mathbf{4.27 : 1}$ with `#12233F` (**ALSO FAILS `4.5:1`**).
  2. `03:54 & 64` used `Sand (#F5EFE4)` input backgrounds with `Sand Soft (#EAE0D0)` borders (`1.14:1` contrast, failing **SC 1.4.11 `3.0:1`**).
  3. `18:61 & 68` (`tailwind.config.ts`) referenced `var(--color-najd-elevated)` and `var(--color-text-muted)`, which were omitted from the `ThemeSettings` schema table in `18:22-38`, and the `beforeChange` validator in `18:92-98` only checked 4 color pairs.
- **Resolution & Remaining Action:**
  - `25-DESIGN-SYSTEM-SPECIFICATION.md` §2.1 replaced `#E4572E` with `#C7441F` (`4.95:1` with `#FFFFFF`), darkened Oasis Teal to `#136F63` (`5.22:1` on cream), and introduced `--color-border-input: #7A869A` (`>= 3.32:1` input border contrast).
  - During Milestone 1 implementation of `ThemeSettings.ts`, include `colors.textMuted`, `colors.navyElevated`, and `colors.borderInput` in the Payload Global schema and validate all 9 text/surface pairs + `3.0:1` input border contrast in the `beforeChange` hook.

---

### Finding `AUD-040` — Upgrade from WCAG 2.1 AA to WCAG 2.2 AA (`SC 2.4.11`, `SC 2.5.7`, `SC 2.5.8`, `SC 3.3.7`, `SC 3.3.8`) & `360px` Mobile Header Overflow Fix
- **Category:** Accessibility (WCAG 2.2 Level AA)
- **Severity:** **High** *(Resolved in `25-DESIGN-SYSTEM-SPECIFICATION.md` §5.5 & `27-ACCESSIBILITY-DESIGN-STANDARDS.md`)*
- **Confidence:** Confirmed
- **Location:** `planning/bayyora/06-UX-AND-USER-JOURNEYS.md:83-85, 95`; `27-ACCESSIBILITY-DESIGN-STANDARDS.md:1-115`
- **Problem & Resolution:**
  1. **Mobile `360px` Header Overflow (`06:83-85`):** Fitting Logo (`120px`) + Language Switcher + Saffron CTA pill + Hamburger (`44px`) in a `328px` inner mobile header caused horizontal overflow at `360px`. Resolved in `25-DESIGN-SYSTEM-SPECIFICATION.md` §5.5 by keeping only 3 items in the `360px` top bar (Logo + Compact CTA Pill + `44x44px` Hamburger) and placing the Language Switcher inside the slide-over drawer.
  2. **WCAG 2.2 New Criteria:** `27-ACCESSIBILITY-DESIGN-STANDARDS.md` §2 defines mandatory implementations for `SC 2.4.11` (`scroll-padding-top` / `scroll-padding-bottom`), `SC 2.5.7` (single-tap preset buttons on `BeforeAfterSlider` on both desktop and mobile), `SC 2.5.8` (`>= 24x24px` / `44x44px` hit areas), `SC 3.3.7` (session pre-fill between `/free-audit`, WhatsApp, and `/contact`), and `SC 3.3.8` (no cognitive puzzle CAPTCHAs; `autocomplete` enabled).

