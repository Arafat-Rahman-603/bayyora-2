# BAYYORA — ANIMATION SYSTEM ARCHITECTURE & REPAIR REPORT (`ANIMATION-REPAIR-REPORT.md`)

**Project:** Bayyora (بيّورا)  
**Scope:** End-to-End Motion Architecture, Scroll Reveal State Machine, Hover Micro-Interactions, Performance & Reduced-Motion Compliance  
**Date:** 2026-11-09

---

## 1. Problems Identified in the Previous Animation Implementation

1. **Visible-Then-Invisible Flash (`ANIM-001`):**
   - `useInViewOnce` in `src/components/ui/AnimatedSection.tsx` rendered `inView = true` during SSR so server HTML was visible, then flipped `inView = false` inside `useEffect` on hydration for elements below the fold, and then attached `.animate-reveal-up` (`0% { opacity: 0 }`, `animation-fill-mode: both`) when entering the viewport.
   - For staggered items (`animation-delay: 60ms..360ms`), `animation-fill-mode: both` forced the element to jump to `0% { opacity: 0 }` during the delay window, causing visible elements to vanish and reappear.
2. **Stacked / Double-Triggered Animations (`ANIM-002`):**
   - `src/blocks/RenderBlocks.tsx` wrapped `<AnimatedStaggerGrid>`, `<SeasonalCampaignTabs>`, `<FaqAccordion>`, and `<PortfolioFilterGrid>` inside parent `<AnimatedReveal>` containers.
   - Simultaneously, `SeasonalCampaignTabs`, `FaqAccordion`, and `PortfolioFilterGrid` attached `.animate-reveal-scale` to their active panels on initial mount, causing 2–3 animations to fire concurrently on the same DOM subtree.
3. **Locked `:hover` Card Transforms (`ANIM-003`):**
   - `.animate-reveal-up` used `animation-fill-mode: both` (`100% { transform: translate3d(0, 0, 0) }`) and remained on `<article className="card-interactive">` indefinitely after the entrance animation finished.
   - In the CSS cascade, active `animation-fill-mode: forwards/both` declarations override standard `:hover` `transform` rules, preventing `.card-interactive:hover` from lifting cards on hover.
4. **Main-Thread Scroll Jank (`ANIM-004`):**
   - `src/components/layout/Header.tsx` called `setScrollProgress(pct)` inside its window `scroll` listener on every pixel of scroll, triggering 60 React re-renders per second across the entire header and navigation dropdowns.
5. **Continuous Offscreen Timer (`ANIM-005`):**
   - `src/components/domain/HeroComparisonCard.tsx` ran its `2800ms` `setInterval` continuously even when the user scrolled down the page or switched browser tabs.

---

## 2. The Repaired Animation Architecture

### 2.1 Centralized Motion Tokens (`src/app/(frontend)/globals.css` & `tailwind.config.ts`)
All durations and easings are standardized across CSS custom properties and Tailwind utilities:

| Token | Value | Purpose |
| :--- | :--- | :--- |
| `--duration-micro` | `150ms` | Button press (`active:scale-[0.98]`), icon nudges, focus rings |
| `--duration-standard` | `220ms` | Card hover lift (`translate3d(0, -3px, 0)`), tab/filter/accordion panel switch |
| `--duration-section` | `360ms` | Below-the-fold scroll entrance (`bayyora-enter-up`) |
| `--ease-out-smooth` | `cubic-bezier(0.22, 1, 0.36, 1)` | Natural decelerating ease-out curve for all entrances and micro-interactions |

### 2.2 Deterministic 3-Phase Scroll-Reveal State Machine (`src/components/ui/AnimatedSection.tsx`)
`AnimatedReveal` and `AnimatedStaggerGrid` now use a clean `'idle' | 'animating' | 'done'` state machine:
- **Never Hides SSR Content:** Server-rendered HTML and initial client hydration render at full `opacity: 1` with zero inline `opacity: 0`.
- **Above-the-Fold Guard:** On mount, if `el.getBoundingClientRect().top < window.innerHeight * 0.92`, the component transitions immediately to `'done'` without triggering a post-hydration entrance animation (protecting LCP and preventing hero jumps).
- **Below-the-Fold Single Entrance:** Elements below the fold observe once via `IntersectionObserver` (`rootMargin: '0px 0px -6% 0px'`). When intersecting, `phase` becomes `'animating'` (`animate-reveal-up` or `data-stagger-state="animating"`), and immediately disconnects the observer.
- **Clean Class Removal on Completion:** When `onAnimationEnd` fires (or after a `600ms` fallback timeout), `phase` transitions to `'done'`, removing the animation class from the DOM so `:hover` transforms on `.card-interactive` work with zero CSS specificity conflicts.

### 2.3 Interaction-Gated Panel Switching (`.animate-panel-switch`)
- In `SeasonalCampaignTabs.tsx`, `FaqAccordion.tsx`, and `PortfolioFilterGrid.tsx`, a `hasInteracted` ref (`useRef(false)`) tracks whether the user has actively clicked a tab, filter pill, or accordion item.
- On initial page render, `hasInteracted.current === false`, so no panel animation fires during page load or scroll reveal.
- When the user clicks a tab, filter pill, or FAQ item, `hasInteracted.current = true` and `.animate-panel-switch` (`220ms cubic-bezier(0.22, 1, 0.36, 1)`) provides crisp visual feedback.

### 2.4 Direct DOM Scroll Progress Bar (`src/components/layout/Header.tsx`)
- Removed `scrollProgress` React state from `Header.tsx`.
- Added `progressBarRef` (`useRef<HTMLDivElement>(null)`) updated inside a `requestAnimationFrame`-throttled passive scroll listener via `progressBarRef.current.style.transform = scaleX(${ratio})`.
- `setScrolled` is guarded (`if (isScrolledNow !== scrolledRef.current)`) so React state only updates at the single threshold crossing (`window.scrollY > 16`).

### 2.5 Viewport & Tab-Visibility Pause (`src/components/domain/HeroComparisonCard.tsx`)
- Added an `IntersectionObserver` (`isInViewport`) and `document.addEventListener('visibilitychange', ...)` (`isTabVisible`) to `HeroComparisonCard.tsx`.
- The `2800ms` comparison highlight timer only runs when `!isPaused && !isHovered && !prefersReducedMotion && isInViewport && isTabVisible`.

### 2.6 Full `prefers-reduced-motion: reduce` Support
- In `src/app/(frontend)/globals.css`, `@media (prefers-reduced-motion: reduce)` disables all keyframe animations (`animation: none !important; transition-duration: 0.01ms !important; transform: none !important; opacity: 1 !important;`).
- In `AnimatedSection.tsx` and `HeroComparisonCard.tsx`, `window.matchMedia('(prefers-reduced-motion: reduce)')` skips observers and timers immediately.
