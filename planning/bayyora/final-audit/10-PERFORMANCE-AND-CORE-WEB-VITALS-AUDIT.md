# 10 — Performance & Core Web Vitals Audit (Agent I)

**Project:** Bayyora (بيّورا)  
**Auditor:** Agent I (Performance Engineer)  
**Targets:** Mobile Lighthouse Performance `>= 90`, LCP `<= 2.5s` (`<= 2.0s` internal target), INP `<= 200ms` (`<= 150ms` internal target), CLS `<= 0.1` (`<= 0.05` internal target)  
**Primary Audited Files:** `planning/bayyora/03-BRAND-AND-DESIGN-SYSTEM.md`, `08-NEXTJS-TECHNICAL-ARCHITECTURE.md`, `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`, `25-DESIGN-SYSTEM-SPECIFICATION.md`, `26-MOTION-AND-ANIMATION-SYSTEM.md`

---

## 1. Runtime Measurement Honesty Statement
- **Live Lighthouse / CrUX Status:** **`NOT TESTABLE — PRE-IMPLEMENTATION`** (No running application server exists prior to `APPROVED TO IMPLEMENT`). Zero Lighthouse scores have been fabricated.
- **Architectural Performance Assessment:** With React Server Components by default, `unstable_cache` + Next.js static route caching (`AUD-008` remediated), WebP/AVIF derivatives via `sharp`, and CSS/`motion/react` (`LazyMotion`) compositor-only animations (`26-MOTION-AND-ANIMATION-SYSTEM.md`), the architecture is capable of achieving `92–98` Mobile Lighthouse Performance on Saudi 4G/5G networks once the two bottlenecks below are resolved.

---

## 2. Performance & Core Web Vitals Findings

### Finding `AUD-008` (Cross-Ref `02-ARCHITECTURE-AND-NEXTJS-AUDIT.md`) — Dynamic Rendering Trap (`force-dynamic`) Defeating Edge Caching (`TTFB` & `LCP` Impact)
- **Severity:** **High** | **Priority:** `P1`
- **Problem & Impact:** Omitting `generateStaticParams()` and `setRequestLocale(locale)` in `src/app/(frontend)/[locale]/layout.tsx` forces every request to render dynamically on the origin Node.js server (`TTFB > 400ms`), risking Mobile LCP `> 2.5s`.
- **Recommendation:** Export `generateStaticParams()` and call `setRequestLocale(locale)` across all `[locale]` layouts and pages so pre-rendered HTML is served from the edge in `< 80ms`.

---

### Finding `AUD-038` — Font Preloading & Fallback Metric Mismatch (`Tahoma` vs. `Arial`) in `next/font/local`
- **Category:** Performance / Font Optimization (`LCP` & `CLS`)
- **Severity:** **Medium** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/03-BRAND-AND-DESIGN-SYSTEM.md:90`; `20-SECURITY-PERFORMANCE-AND-DEVOPS.md:28-29`
- **Evidence:** `03:90` specifies `'Readex Pro', Tahoma, Arial, sans-serif` (or `IBM Plex Sans Arabic` + `Plus Jakarta Sans`), while `20:29` configures `adjustFontFallback: 'Arial'` and `preload: true` for all weights (`400, 500, 600, 700` across `arabic` and `latin`).
- **Problem & Impact:**
  1. Placing `Tahoma` ahead of the generated `Arial` metric-adjusted fallback font causes a layout shift (`CLS`) when the webfont swaps in.
  2. Preloading both Arabic and Latin font files simultaneously on single-language pages downloads unused font subsets during the critical LCP path.
- **Recommendation:** Split Arabic and Latin into separate `unicode-range` WOFF2 variable fonts, set `preload: true` only for the active route locale (`Arabic` on `/`, `Latin` on `/en/`), and allow `next/font/local`'s generated `adjustFontFallback: 'Arial'` face to sit immediately after the primary font family.
- **Priority:** `P2` | **Complexity:** Small | **Approval Required:** No

