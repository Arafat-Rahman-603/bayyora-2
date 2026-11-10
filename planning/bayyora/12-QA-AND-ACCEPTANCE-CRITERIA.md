# 12 — Quality Assurance Strategy & Measurable Acceptance Criteria

**Project:** Bayyora (بيّورا)  
**Author:** Agent 9 (QA & Acceptance Criteria Agent)  
**Inputs:** `01-PRD.md` & Specialist Documents `03` through `11`  
**Status:** Complete Verification Plan (No Implementation Testing Executed During Planning Phase)

---

## 1. QA Philosophy & Release Gate Structure

No launch phase (Phase 1, Phase 2, or Phase 3) may be promoted from Staging (`staging.bayyora.*`) to Production until **100% of applicable P0/P1 Acceptance Criteria (`AC-*`) pass verification** and receive sign-off from:
1. **Native Saudi Arabic Reviewer & Local Partner** (linguistic & regulatory sign-off).
2. **Product Owner (Ataullah)** (brand, design, and commercial sign-off).

---

## 2. Measurable Acceptance Criteria Registry (`AC-xxx`)

### 2.1 Business & Brand Integrity Criteria (`AC-BIZ-*` & `AC-DES-*`)
| Criterion ID | PRD Ref | Verification Test Case | Measurable Pass Condition |
| :--- | :--- | :--- | :--- |
| **AC-BIZ-01** | `BR-003` | Inspect all 54 pages (AR & EN) for hardcoded currency symbols (`ريال`, `SAR`) or public price numbers. | **Zero public prices appear anywhere on the website** (unless `OD-006` is explicitly revised by owner). Every package/service card routes to *"Request a quote / free mini audit"*. |
| **AC-BIZ-02** | `BR-009` | Inspect all Before/After portfolio cards on Home, 9 Service pages, Our Work, and City pages. | Every unapproved or conceptual example renders a visible **`نموذج توضيحي` (AR) / `Sample concept` (EN)** badge. Zero invented stats, fake reviews, or guaranteed sales claims exist. |
| **AC-BIZ-03** | `BR-010` | Verify Dawair (`دوائر`) mentions on Home, Our Work, Hofuf City page, and `/our-work/dawair/`. | Prior to written client permission (`OD-008`), Dawair appears only as the documented "coming soon (with client permission)" teaser; full photos/case study remain unpublished until written sign-off is logged. |
| **AC-DES-01** | `BR-002` | Inspect Arabic brand name spelling across all headings, titles, meta tags, and body copy. | `بيّورا` is written **with the shadda (`يّ`) in 100% of occurrences**. |
| **AC-DES-02** | `UX-003` | Inspect the Rising Line logo lockup and decorative step/arrow motifs on `/` (AR) vs. `/en/` (EN). | On `/` (`dir="rtl"`), the logo line and all page motifs rise **toward the left**. On `/en/` (`dir="ltr"`), the logo line and all page motifs rise **toward the right**. Zero mixed directions occur inside a single page. |
| **AC-DES-03** | `NFR-003` | Inspect computed font-family and font-weight on Arabic vs. English headings. | Both scripts render in self-hosted `Readex Pro`; English headlines render 1 weight lighter (`600` vs `700`) for optical balance; Arabic appears on top/first when paired with English. |
| **AC-DES-04** | `NFR-005` | Run axe-core / Lighthouse accessibility audit on proposed palette combinations (`#12233F`, `#F2A541`, `#1F7A5C`, `#F5EFE4`, `#1A1A1A`, `#FFFFFF`). | **Zero instances of `Saffron Rise (#F2A541)` text on `Sand (#F5EFE4)` or `White (#FFFFFF)`**. All Saffron CTA buttons use dark `Najd Night (#12233F)` or `Ink (#1A1A1A)` text (contrast ratio $\ge 7.6:1$, passing WCAG AAA). |

---

### 2.2 Information Architecture, Routing, RTL/LTR & Navigation Criteria (`AC-IA-*`)
| Criterion ID | PRD Ref | Verification Test Case | Measurable Pass Condition |
| :--- | :--- | :--- | :--- |
| **AC-IA-01** | `FR-001`, `FR-002` | Crawl all 27 Arabic root URLs (`/`, `/services/*`, `/packages/`, etc.) and all 27 English `/en/` URLs. | All **54 URLs** return `HTTP 200 OK` (in their respective rollout phase), use clean Latin slugs in both languages, and set `<html lang="ar" dir="rtl">` on root and `<html lang="en" dir="ltr">` on `/en/`. |
| **AC-IA-02** | `FR-003` | Click the header Language Switcher (`EN / عربي`) on every page (e.g., `/services/photography/`). | Navigates directly to `/en/services/photography/` (and back to `/services/photography/`), never redirecting to the homepage. |
| **AC-IA-03** | `FR-004`, `FR-005` | Test sticky header on desktop and mobile (`360px` width) while scrolling down `100px`. | Header starts on `Sand (#F5EFE4)` and transitions to `Najd Night (#12233F)` with reversed white/Saffron logo on scroll. Both the Language Switcher (`EN / عربي`) and the `"اطلب تحليل مجاني / Free mini audit"` CTA remain accessible on desktop and mobile. |
| **AC-IA-04** | `FR-004` | Open the `خدماتنا / Services` dropdown on desktop and inside the mobile hamburger drawer. | Displays all **9 services** in the exact order of the `Doc A` sitemap (`#3` Brand & Identity through `#11` Seasonal Campaigns). |
| **AC-IA-05** | `FR-021` | Inspect the global footer across AR and EN pages. | Renders on `Najd Night` background with reversed logo + tagline, 4 columns (9 Services, 5 Bayyora links, 5 Areas we serve, Contact info + Sun–Thu hours), 4 social links (Snapchat, Instagram, TikTok, X), and bottom bar (`© Bayyora · Privacy · Terms · Refunds`). |

---

### 2.3 Functional Page & Component Criteria (`AC-FUNC-*`)
| Criterion ID | PRD Ref | Verification Test Case | Measurable Pass Condition |
| :--- | :--- | :--- | :--- |
| **AC-FUNC-01** | `FR-006` | Inspect floating WhatsApp button position on `/` (AR) vs. `/en/` (EN) across desktop and mobile. | Floating button sits at **`bottom-left` on Arabic RTL pages** and **`bottom-right` on English LTR pages** (`inset-inline-start: 20px; bottom: 20px`), without blocking form submit buttons. |
| **AC-FUNC-02** | `FR-007` | Click WhatsApp CTAs on Home, all 9 Service pages, all 3 Monthly Package cards, 2 Starter Bundle cards, and 5 City pages. | Every link opens `https://wa.me/<NUMBER>?text=...` with the exact pre-filled Arabic or English message matching that specific page/service/package (`07-BILINGUAL-CONTENT-STRATEGY.md` §4). |
| **AC-FUNC-03** | `FR-010` | Audit each of the 9 individual service pages (`/services/*`). | Every page contains all 8 mandatory sections: Hero, Problem, What you get, Before & After (with sample badges), Included in (package cross-sell), How it works, FAQ (3–4 items), and Final CTA band. |
| **AC-FUNC-04** | `FR-011` | Audit `/packages/` and `/en/packages/`. | Displays `Bidaya`, `Numow`, and `Riyada` with exact documented quantities (`10/8/2`, `16/12/4`, `24/6-8+30s video`), `Look` and `Go Online` starter bundles, Single Services, Founding Offer banner (`OD-007`), 3 quote steps, and 4 FAQs — with zero prices. |
| **AC-FUNC-05** | `FR-012` | Test the Dual Filter Bar on `/our-work/` and `/en/our-work/`. | Users can filter portfolio/sample items by **Service** (`logo`, `signboard`, `social`, `video`, `website`) and **Business Type** (`restaurant`, `café`, `pharmacy`, `salon`, `retail`) with zero console errors. |

---

### 2.4 GoHighLevel, Booking & Analytics Integration Criteria (`AC-INT-*`)
| Criterion ID | PRD Ref | Verification Test Case | Measurable Pass Condition |
| :--- | :--- | :--- | :--- |
| **AC-INT-01** | `FR-015`, `INT-001` | Submit `/free-audit/` (AR) and `/en/free-audit/` (EN) with test shop data (including `@handle` in the Instagram field). | Form accepts both `@handle` and full URLs in the Instagram field, validates all 6 fields (`Name`, `Shop name`, `City`, `WhatsApp number`, `Instagram link`, `What do you need help with?`), creates a contact/opportunity in GoHighLevel Stage 1 (`New Lead / Audit Requested`) with language tag, and renders the exact documented bilingual thank-you message. |
| **AC-INT-02** | `FR-016`, `INT-002` | Complete a test shop visit booking on `/contact/` and `/en/contact/` via the embedded GHL Calendar. | Calendar displays slots in **Saudi Arabia time (`Asia/Riyadh`, Sunday–Thursday)**, creates the appointment in GHL Stage 2 (`Shop Visit Scheduled`), and notifies the Local Partner. |
| **AC-INT-03** | `INT-004`, `INT-005` | Use GTM Preview Mode, Meta Pixel Helper, and Snap Pixel Helper while clicking a WhatsApp CTA and submitting the Free Audit form. | `whatsapp_click` and `audit_form_submit` events fire cleanly to GA4, Meta Pixel, and Snapchat Pixel with accurate `page_lang` and `cta_location` parameters. |

---

### 2.5 Technical Performance, 100/100 Lighthouse SEO, Accessibility & Cross-Browser Criteria (`AC-TECH-*`, `AC-SEO-*`)
| Criterion ID | PRD Ref | Verification Test Case | Measurable Pass Condition |
| :--- | :--- | :--- | :--- |
| **AC-TECH-01** | `NFR-002`–`NFR-005` | Run Lighthouse CI (Mobile & Desktop) across Homepage, every Service page, Packages, About, Contact, Free Audit, Portfolio, Blog, and every City page in both `/` (AR) and `/en/` (EN). | • **Mobile Lighthouse Performance $\ge 90$** (`LCP < 2.0s`, `CLS < 0.05`, `INP < 150ms`)<br>• **Lighthouse Accessibility $\ge 95$**<br>• **Lighthouse Best Practices $\ge 95$**<br>• **Lighthouse SEO: $100/100$** on every public indexable page. |
| **AC-TECH-02** | `NFR-003`, `NFR-004` | Inspect Chrome DevTools Network waterfall on `/` and `/en/`. | Zero network requests to `fonts.googleapis.com` or `fonts.gstatic.com` (fonts served locally via `next/font/local` as `.woff2`); 100% of raster images served via `next/image` as `.webp` / `.avif`. |
| **AC-SEO-01** | `SEO-001`–`SEO-004` | Run Playwright SEO test suite + Rich Results validation across all published AR and EN routes. | Every page outputs a unique `<title>` ($\le 60$ chars), unique `<meta name="description">` ($\le 155$ chars), exactly 1 `<h1>`, valid self-referencing canonical, bidirectional `hreflang="ar-SA"` / `"en"` / `"x-default"` tags, valid truthful JSON-LD (`Organization`, `LocalBusiness`, `Service`, `BreadcrumbList`, `FAQPage`, `Article`), and descriptive Arabic/English `alt` text. Draft and `noIndex` pages are excluded from `/sitemap.xml`. |
| **AC-CROSS-01** | `UX-001`, `UX-002` | Test across **iOS Safari (iPhone 14/15/16)**, **Android Chrome (Samsung Galaxy)**, and **Desktop Chrome/Safari/Edge** at `360px`, `390px`, `768px`, `1024px`, and `1440px`. | Zero horizontal overflow (`overflow-x`), intact Arabic glyph connections in `Readex Pro`, smooth touch interactions, and `48x48px` minimum tap targets on all interactive controls. |

---

## 3. Automated Testing Architecture (Vitest, Playwright & `@axe-core/playwright`)

1. **Unit & Integration Tests (`Vitest` + React Testing Library):**
   - Test Zod schemas (`auditFormSchema`, `contactFormSchema`, Arabic-Indic digit normalizer `٠-٩` $\rightarrow$ `0-9`).
   - Test SEO metadata generators (`generatePageMetadata`), JSON-LD schema builders, WhatsApp URL builders, and WCAG contrast ratio validator (`contrast-validator.ts`).
   - Test Next.js Server Actions (`submitAuditAction`, `submitContactAction`) with mocked `CRMProvider` and fail-safe DB queue fallback.
2. **End-to-End & Accessibility Tests (`Playwright` + `@axe-core/playwright`):**
   - Crawl all 27 Arabic routes (`/`) and 27 English routes (`/en/`), asserting `HTTP 200`, `dir="rtl"` vs. `dir="ltr"`, zero console/page errors, and zero WCAG 2.1 AA axe-core violations.
   - *(For complete CMS Admin Dashboard, RBAC, Page Builder, Live Preview, Versioning, and Cache Revalidation acceptance tests, see `22-CMS-ADMIN-ACCEPTANCE-TESTS.md`.)*



---

## 9. WCAG 2.2 AA, Motion & Web Interface Guidelines QA Gates (`24`–`28`)

In addition to the functional, SEO, and performance criteria above, pre-release QA enforces:
1. **WCAG 2.2 Level AA Conformance (`27-ACCESSIBILITY-DESIGN-STANDARDS.md`):**
   - `@axe-core/playwright` configured with `['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']`.
   - Automated bounding-box assertion for **SC 2.4.11 (Focus Not Obscured)** verifying focused elements never collide with the `74px` sticky header or `52x52px` floating WhatsApp CTA.
   - Verification of **SC 2.5.7 (Dragging Movements)** single-tap preset buttons on `BeforeAfterSlider` across both desktop and mobile.
   - Verification of **SC 2.5.8 (Target Size Minimum `>= 24x24px` / `44x44px` primary)** and zero horizontal overflow at `320px` and `360px`.
2. **Motion & Reduced-Motion QA (`26-MOTION-AND-ANIMATION-SYSTEM.md`):**
   - Emulate `prefers-reduced-motion: reduce` in Playwright and verify all spatial transitions collapse to instant/opacity changes (`<= 0.01ms` CSS transition duration).
   - Verify hover transforms only activate under `@media (hover: hover) and (pointer: fine)`.
3. **Web Interface Guidelines Audit (`24-UI-UX-SKILLS-AND-WORKFLOW.md`):**
   - Execute `.agents/skills/web-design-guidelines/SKILL.md` (against `.agents/skills/web-design-guidelines/references/web-interface-guidelines.md`) prior to milestone sign-off.
