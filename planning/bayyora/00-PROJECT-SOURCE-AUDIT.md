# 00 — Project Source Material Audit

**Project:** Bayyora (بيّورا) — Website Foundation & Digital Agency Launch  
**Owner / Principal Architect:** Agent 0 (Project Orchestrator)  
**Date:** 8 November 2026  
**Phase:** Planning-Only Mode (Strict Approval Gate Active)  
**Source Documents Audited:**
1. **Document A (Primary Business & Product Source of Truth):** `Bayyora – Website Foundation & Content.md` (Prepared 4 Nov 2026)
2. **Document B (Visual & Design Reference Only):** `index.html` (889 lines, bilingual RTL/LTR interactive prototype) & full-page rendered visual reference screenshot (`media_1794129016400_e3567133.png`)

---

## 1. Source Hierarchy & Governance Rules

1. **Document A (`Bayyora – Website Foundation & Content.md`)** is the authoritative source of truth for business model, pricing policy, service definitions, package inclusions, sitemap, bilingual copy, integrations (GoHighLevel, WhatsApp, pixels), compliance rules, and open decisions.
   - **Mandatory Owner Architectural Override (8 Nov 2026):** The owner has explicitly retired WordPress and mandated **Next.js (App Router) + TypeScript (Strict) + Tailwind CSS + Payload CMS (Integrated Self-Hosted) + PostgreSQL** with a **100% CMS-driven content/customization architecture** and a **100/100 Lighthouse SEO target**. This owner directive overrides the original WordPress note in Document A §2 across all planning documents.
2. **Document B (`index.html` & visual screenshot)** is a visual and interaction reference only. Where Document B contradicts Document A (most notably by displaying hardcoded SAR prices, omitting TikTok from the audit checklist, using a terracotta `#E4572E` accent instead of the proposed Saffron Rise `#F2A541`, and using client-side hash routing instead of a multi-page bilingual architecture), **Document A + the Owner's Next.js/Payload CMS Architecture Mandate prevail**.
3. **Strict Preservation Rule:** No business requirement from Document A has been silently altered, simplified, or omitted. Confirmed items are separated from proposed items and pending approvals.

---

## 2. Audit of Document A: Business & Product Requirements

### 2.1 Confirmed Brand Decisions
| ID | Element | Confirmed Specification | Source Reference |
| :--- | :--- | :--- | :--- |
| **CBD-01** | **Brand Name** | **Bayyora — بيّورا** (always written in Arabic with the shadda on the *yā'*). | Doc A §1 (Name and meaning) |
| **CBD-02** | **Etymology & Meaning** | Derived from the Arabic root **بيّن** (*bayyin*), meaning *"to stand out, to be clearly seen"*. Core narrative: making local shops visible on the street, on Google Maps, and on phones, then helping them move up. | Doc A §1 (Name and meaning) |
| **CBD-03** | **Tagline (Bilingual)** | Arabic: **خطوة لفوق** \| English: **One step up** | Doc A §1 (Tagline) |
| **CBD-04** | **Tagline & Motif Directionality** | The tagline and Rising Line motif tell one story: a local shop moving up a level. In Arabic (RTL) layouts, the line rises **toward the left**. On English (`/en/`) LTR pages, the motif rises **toward the right**. **Rule:** Never flip the direction inside one layout. | Doc A §1 (Tagline) |
| **CBD-05** | **Logo Concept Chosen** | **Rising line** concept selected on 4 Nov 2026 (final drawn vector artwork still pending). | Doc A §1 (Current status) |
| **CBD-06** | **Primary Typography** | **Readex Pro** for both Arabic and Latin scripts (self-hosted subsets). Arabic headlines in SemiBold/Bold, body in Regular; Latin headlines one weight lighter than Arabic so both scripts appear balanced in optical weight. Arabic leads above/before English when paired. | Doc A §1 (Typography), §2 (Tech notes) |
| **CBD-07** | **Launch Plan & Market Focus** | Agreed 28 Oct 2026: focus on small local shops in Saudi Arabia, starting in **Al Ahsa** (including Hofuf and Mubarraz), expanding to **Dammam** and **Khobar**. | Doc A §1 (Current status) |
| **CBD-08** | **Sales & Pricing Approach** | Agreed 1 Nov 2026: "Quote after we talk." Local partner gathers requirements face-to-face and shows sample work first. **No public prices on the website.** Every pricing moment leads to *"Request a quote / free mini audit"*. | Doc A §1 (Current status), §2 (Principles) |
| **CBD-09** | **First Client Won** | **Dawair (دوائر)**, a pre-launch restaurant in Al-Hofuf, Al Ahsa (won 2 Nov 2026). Scope: **Website + Social Media Management**. Case study/logo/images require written client permission. | Doc A §1 (Current status), §3.5 |

---

### 2.2 Proposed Brand & Design Decisions (Pending Approval by Ataullah)
| ID | Element | Proposed Specification | Status |
| :--- | :--- | :--- | :--- |
| **PBD-01** | **Logo Lockup & Variants** | Main lockup: large Arabic **بيّورا**, rising line underneath, small Latin **"Bayyora"** below. Variants: (1) Full colour on Sand/White (Najd Night wordmark + Saffron line), (2) Reversed on Najd Night (white wordmark + Saffron line), (3) Single-colour navy, (4) Square icon (rising line + ب) for avatars and favicon. | Proposed (Final vector artwork pending) |
| **PBD-02** | **Logo Usage Rules** | Clear space = height of letter **ب**; min web width = `120px`; never recolour wordmark Saffron; never stretch; never place on busy photos without a navy overlay. | Proposed |
| **PBD-03** | **Color Palette** | • **Najd Night (`#12233F`):** Primary deep navy (headers, footer, logo on light backgrounds).<br>• **Saffron Rise (`#F2A541`):** Accent (~10% of layout; rising line, CTA buttons, highlights).<br>• **Oasis Green (`#1F7A5C`):** Secondary (success states, local/Google Maps sections, icons).<br>• **Sand (`#F5EFE4`):** Main warm light background.<br>• **Ink (`#1A1A1A`):** Body text.<br>• **White (`#FFFFFF`):** Cards.<br>*Note:* Old "Modern Najd" palette from earlier placeholder name is explicitly retired. | Proposed (Pending Ataullah's approval — OD-003) |
| **PBD-04** | **Color Contrast Rules** | Navy on Sand and White on Navy/Green pass WCAG AA. **Never put Saffron text on Sand or White; use Saffron as a fill, or on Navy only.** | Proposed |
| **PBD-05** | **Voice & Tone Guide** | Helpful neighbour who knows marketing (not corporate). Short sentences; simple, warm Saudi-friendly Arabic (not heavy formal Arabic); plain English on `/en/`. Speak directly to the owner (`محلّك` / "your shop"). Concrete over hype. Conversation first. Ban jargon (funnels, KPIs, ROI), fake urgency, guaranteed sales, and made-up numbers. | Proposed (Pending Ataullah's approval — OD-004; Arabic copy pending native Saudi review) |
| **PBD-06** | **Photography Direction** | Real local shops (pharmacies, supershops, cafés, restaurants in Al Ahsa and Hofuf), warm daylight, owners/staff at work. Avoid generic stock skyscrapers, luxury-city imagery, and cliché desert/gold themes. | Proposed |

---

### 2.3 Business Objectives & Target Markets
- **Primary Website Objective ("The Site's One Job"):** Get a small shop owner to **message Bayyora on WhatsApp**, **ask for a free mini audit**, or **book a shop visit**.
- **Target Customer Segments:** Local shops and small businesses in Saudi Arabia — specifically pharmacies, small retail, supershops, neighbourhood shops, cafés, restaurants, and salons.
- **Geographic Markets:**
  - **Initial Primary Market:** Al Ahsa (الأحساء), specifically covering **Al-Hofuf (الهفوف)** and **Al-Mubarraz (المبرّز)**.
  - **Expansion Markets:** **Dammam (الدمام)** and **Khobar (الخبر)** in the Eastern Province (الشرقية).

---

### 2.4 Complete Service Catalog (All 9 Categories Preserved)
| # | Service Category (EN / AR) | URL Slug (AR & `/en/`) | Core Benefit Line (AR / EN) | Documented Deliverables ("What You Get") | Package Mapping |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Brand and identity**<br>الهوية والشعار | `/services/brand-identity/` | شعار يتذكّره الناس<br>*A logo people remember* | • Arabic & English logo<br>• Set colours and fonts<br>• Simple brand guide<br>• Business cards & stationery<br>• Packaging design if needed<br>• Rebranding for existing shops | Included in **Look** starter bundle, **Go Online** (full brand identity), or as a single service. |
| **2** | **Print and shop design**<br>تصميم المطبوعات وواجهة المحل | `/services/print-shop-design/` | واجهة توقّف المارّين<br>*A shopfront that stops people walking past* | • Signboard & shopfront design<br>• Menus<br>• Flyers & brochures<br>• Company profile<br>• Roll-ups<br>• Vehicle branding<br>• Print-ready files (delivery to chosen printer; printer recommendation available) | Signboard design included in **Look** bundle, or as a single service. |
| **3** | **Websites and online stores**<br>المواقع والمتاجر الإلكترونية | `/services/websites-online-stores/` | محلّك مفتوح أونلاين ٢٤ ساعة<br>*Your shop, open online 24/7* | • Landing page with WhatsApp<br>• Arabic or Arabic-English website<br>• Salla, Zid, or Shopify store<br>• Google Maps link-up<br>• Monthly website care | Included in **Go Online** starter bundle (5-page AR/EN site), or as a single service. |
| **4** | **Social media management**<br>إدارة السوشال ميديا | `/services/social-media/` | حسابات تجيب زباين، مو بس لايكات<br>*Accounts that bring customers, not just likes* | • Monthly content plan<br>• Designs, stories, and reels<br>• Snapchat, Instagram, TikTok, and X management<br>• Replies to messages & comments<br>• Clear monthly report | Included in **Bidaya**, **Numow**, **Riyada**, **Look** (6 posts), and **Go Online** (1 month). |
| **5** | **Video and animation**<br>الفيديو والموشن | `/services/video-animation/` | فيديوهات توقّف التمرير<br>*Videos that stop the scroll* | • Short promo videos<br>• Reels<br>• Product videos<br>• Motion graphics<br>• Company profile videos<br>• AI product videos | Included in **Riyada** (monthly 30s video; reels in all monthly tiers), or as a single service. |
| **6** | **Photography**<br>التصوير | `/services/photography/` | صور تبيع منتجاتك<br>*Photos that sell your products* | • Product photography<br>• Food & drink photography<br>• Shop & team photos<br>• AI product scenes<br>• Edited photos ready to post | Available as a single service or added to any package. |
| **7** | **Ads and local search**<br>الإعلانات والظهور المحلي | `/services/ads-local-search/` | خلّ الناس تلقاك قبل منافسك / كن أول من يظهر في خرائط قوقل<br>*Get found before your competitor / Be found first on Google Maps* | • Google Maps (Business Profile) setup & optimisation<br>• Local Arabic SEO<br>• Snapchat, Meta, TikTok, and Google ads<br>• Reports on calls & messages | • **Bidaya / Look:** Google Maps setup<br>• **Numow:** Ads on 1–2 platforms<br>• **Riyada:** Ads on all platforms + local SEO<br>*(Ad budgets are separate)* |
| **8** | **WhatsApp and follow-up**<br>واتساب والمتابعة | `/services/whatsapp-follow-up/` | ولا رسالة زبون تضيع<br>*Never lose a customer's message again* | • WhatsApp Business setup<br>• Product catalogue<br>• Quick replies<br>• Offer broadcasts<br>• Simple customer follow-up | • **Bidaya:** WhatsApp Business setup<br>• **Numow / Go Online:** WhatsApp catalogue<br>• Single service |
| **9** | **Seasonal campaigns**<br>الحملات الموسمية | `/services/seasonal-campaigns/` | موسمك جاي… خلّ محلّك جاهز / جاهز لرمضان والعيد واليوم الوطني<br>*Your season is coming. Get your shop ready.* | • Seasonal designs<br>• Reels & stories<br>• Clear customer offer<br>• Signboard & menu refresh<br>• WhatsApp message to customers<br>• **Covered Seasons:** Ramadan, Eid, Founding Day (22 Feb), National Day (23 Sep), White Friday | Standalone seasonal pack or add-on to any package. |

---

### 2.5 Packages, Bundles & Offers (Exact Inclusions Preserved — No Public Prices)

#### A. Monthly Packages
| Package Name (AR / EN) | Positioning | Platforms | Designs / Mo | Stories / Mo | Reels / Mo | Additional Inclusions | Reporting |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **بداية / Bidaya** | الخطوة الأولى<br>*The first step* | 2 platforms | 10 designs | 8 stories | 2 reels | • Google Maps setup<br>• WhatsApp Business setup | Monthly report |
| **نمو / Numow** | الأكثر طلبًا<br>*Most popular* | 3 platforms | 16 designs | 12 stories | 4 reels | • Ads on 1–2 platforms (ad budget separate)<br>• WhatsApp catalogue | Report twice a month (bi-weekly) |
| **ريادة / Riyada** | للمحلات اللي تبغى تكبر بسرعة<br>*For shops ready to grow fast* | 4 platforms | 24 designs | *(Included in social scope)* | 6–8 reels | • Ads on all platforms (ad budget separate)<br>• 30-second video every month<br>• Local SEO | Monthly / ongoing reporting |

#### B. One-Time Starter Bundles
| Bundle Name (AR / EN) | Documented Inclusions |
| :--- | :--- |
| **لوك / Look** | Logo, colours, business card, signboard design, Google Maps setup, 6 posts. |
| **أونلاين / Go Online** | Full brand identity, 5-page Arabic and English website, WhatsApp catalogue, 1 month of social media. |

#### C. Single Services & Founding Offer
- **Single Services:** Any of the 9 services can be requested individually via quote.
- **Founding Offer (عرض التأسيس):** Documented on `/packages/` as *"عرض خاص لأوائل عملائنا. اسألنا عن التفاصيل / A special offer for our first clients. Ask us for details."* Whether to display explicit terms (earlier plan: first 5–7 clients get no setup fee and 10% off for 6 months) or keep them for the quote is **Open Decision #7 (OD-007)**.

---

### 2.6 Free Mini Audit Workflow & Operational Commitments
- **SLA Commitment:** Delivered on WhatsApp within **48 hours** of submission.
- **Audit Scope (6 Checkpoints):**
  1. Google Maps profile
  2. Instagram account
  3. Snapchat account
  4. TikTok account
  5. Website (if available)
  6. 3 local competitors
- **Free Gift / Sample Included (1 of 3):**
  1. One logo idea, OR
  2. One sample social post, OR
  3. One Google Maps profile improvement/fix.
- **Required Form Fields (`/free-audit/`):**
  1. Name (`الاسم`)
  2. Shop name (`اسم المحل`)
  3. City (`المدينة`)
  4. WhatsApp number (`رقم الواتساب`)
  5. Instagram link (`رابط الانستقرام`)
  6. What do you need help with? (`وش تحتاج مساعدة فيه؟`)
- **Submit Button:** `أرسل لي التحليل` / `Send me my audit`
- **Thank-You Message:** `وصلنا طلبك! بنرسل لك التحليل على الواتساب خلال ٤٨ ساعة. وإذا حبيت، نرسل لك بعدها عرض سعر.` / `Got it! We'll send your audit on WhatsApp within 48 hours. If you like, we'll follow up with a quote.`

---

### 2.7 Sitemap & Phased Rollout (All 27 Bilingual Route Pairs = 54 Pages)
Document A defines 27 canonical route pairs (Arabic at root `/`, English under `/en/`, using clean Latin slugs for WhatsApp sharing and `hreflang="ar-SA"` / `hreflang="en"` pairs):
- **Phase 1 (Weeks 2–3 — One-Page Launch / Core Funnel):**
  - `#1` Home (`/` & `/en/`) — Hero, 9 services, 3 packages (inclusions only), free mini audit form, WhatsApp button.
  - `#12` Packages preview (`/packages/` & `/en/packages/`)
  - `#16` Free mini audit (`/free-audit/` & `/en/free-audit/`)
- **Phase 2 (Week 6 — Full Website):**
  - `#2` Services hub (`/services/` & `/en/services/`)
  - `#3–#11` All 9 individual service pages (`/services/*` & `/en/services/*`)
  - `#12` Packages full page (`/packages/` & `/en/packages/`)
  - `#13` Our work (`/our-work/` & `/en/our-work/`) — sample concepts + Dawair teaser
  - `#15` About (`/about/` & `/en/about/`)
  - `#17` Contact / Book a visit (`/contact/` & `/en/contact/`)
  - `#23` FAQ (`/faq/` & `/en/faq/`)
  - `#25` Privacy policy (`/privacy/` & `/en/privacy/`)
  - `#26` Terms of service (`/terms/` & `/en/terms/`)
  - `#27` Refund and revision policy (`/refunds/` & `/en/refunds/`)
- **Phase 3 (Week 8 Onwards — Proof & Local SEO Expansion):**
  - `#14` Case study: Dawair (`/our-work/dawair/` & `/en/our-work/dawair/`) — requires written client permission
  - `#18–#22` 5 City landing pages: Al Ahsa (`/city/al-ahsa/`), Hofuf (`/city/hofuf/`), Mubarraz (`/city/mubarraz/`), Dammam (`/city/dammam/`), Khobar (`/city/khobar/`) and their `/en/` counterparts
  - `#24` Blog (`/blog/` & `/en/blog/`) — 2 Arabic articles per month

---

### 2.8 Technical, SEO, Analytics, Integration & Compliance Requirements
- **Application & CMS Platform (Owner Override):** Original Doc A §2 mentioned WordPress; **Owner Mandate (8 Nov 2026) supersedes this with Next.js App Router + React + TypeScript (Strict) + Tailwind CSS + Integrated Payload CMS 3.x + PostgreSQL**, supporting RTL root `/` (AR) and `/en/` (EN) with `hreflang` and 100% CMS-driven content/settings.
- **Performance & Lighthouse Targets (Owner Upgrade):** Mobile Lighthouse Performance **90+** (upgraded from Doc A's 80+ baseline), Accessibility **95+**, Best Practices **95+**, and **Lighthouse SEO: 100/100**; self-hosted/optimized Readex Pro (Arabic + Latin subsets); `next/image` WebP/AVIF delivery.
- **CRM & Lead Capture:** GoHighLevel (GHL) embedded forms and GHL Calendar booking widget connected directly to the GHL CRM pipeline.
- **WhatsApp:** Floating button on every page (bottom-left in AR, bottom-right in EN) + contextual pre-filled WhatsApp click-to-chat messages per page, service, and package.
- **Tracking & Analytics:** Google Analytics (GA4), Google Search Console, Meta Pixel, Snapchat Pixel, WhatsApp click tracking.
- **SEO:** Dedicated SEO title ($\le 60$ chars) and meta description ($\le 155$ chars) per page, single H1, logical H2 hierarchy, Arabic image alt text, `LocalBusiness` JSON-LD schema, bilingual XML sitemap.
- **Regulatory & Compliance:**
  - **SFDA Compliance:** Pharmacy and medicine marketing content must follow Saudi Food & Drug Authority (SFDA) rules (confirmed by local partner prior to publication).
  - **Mawthooq Licence:** Influencer campaigns require verifying the influencer's Mawthooq (موثوق) licence.
  - **Saudi PDPL:** Privacy policy and data collection must address user rights under the Saudi Personal Data Protection Law (PDPL).
  - **Legal Review:** Privacy Policy, Terms of Service, and Refund & Revision Policy require qualified Saudi legal review.

---

### 2.9 All Documented Open Decisions (Preserved as Pending)
1. **OD-001 (Domain):** Confirm whether `bayyora.com` is available/owned, or select `bayyora.digital`, `bayyoradigital.com`, or `bayyora.sa` (via local partner).
2. **OD-002 (Trade Name):** Ministry of Commerce trade-name search result for **بيّورا** (run by local partner).
3. **OD-003 (Colour Palette):** Approve or modify the proposed palette (`#12233F`, `#F2A541`, `#1F7A5C`, `#F5EFE4`, `#1A1A1A`, `#FFFFFF`).
4. **OD-004 (Voice & Tone):** Approve the proposed voice and tone guide.
5. **OD-005 (Logo Artwork):** Final drawn vector artwork for the Rising Line logo and all 4 lockup/icon variants.
6. **OD-006 (Pricing Policy on Site):** Confirm strict "quote after we talk" (no public prices, as written in Doc A) vs. showing "starting from" prices later.
7. **OD-007 (Founding Offer Terms):** Keep the Founding Offer banner on `/packages/`? Show explicit terms (first 5–7 clients: no setup fee + 10% off for 6 months) or hold terms for the quote?
8. **OD-008 (Dawair Written Permission):** Obtain written permission from Dawair (دوائر) to display their name, work, before/after assets, and schedule case study publication.
9. **OD-009 (Payment Methods):** Confirm how local shops pay Bayyora (bank transfer, Mada, Sadad, payment links, VAT status, deposit terms) with an adviser for FAQ and Terms.
10. **OD-010 (Partner Profile on About Page):** Confirm whether to display the local partner's photo, name, and role on `/about/` (requires his permission).
11. **OD-011 (Contact Details & Working Hours):** Confirm official Saudi WhatsApp number, business email address, and exact working hours (Sunday–Thursday).

---

## 3. Summary Audit of Document B: HTML Design Reference (`index.html` & Screenshot)

*(Full technical and visual breakdown is documented in `04-HTML-REFERENCE-DESIGN-AUDIT.md`.)*

### 3.1 Key Characteristics Identified in `index.html`
- **File Structure:** Single 889-line self-contained HTML file (`lang="ar" dir="rtl"`) with embedded CSS, inline SVG sprite sheet (21 icons + rising arrow), and vanilla JS for language toggling (`ar`/`en`), hash routing (`#home`, `#services`, `#packages`, `#work`, `#about`, `#audit`, `#contact`), and dynamic DOM rendering.
- **Visual Language:** Warm cream/sand canvas (`#FFF8EC`), high-contrast deep navy cards/sections (`#12263A`), pill-shaped buttons (`border-radius: 999px`), generous rounded cards (`16px–24px`), clean Readex Pro typography, and a side-by-side Google Maps "Before vs. After" comparison card in the hero.
- **Critical Divergences from Document A:**
  1. **Displays Explicit Prices:** Shows SAR prices (`1,490`, `2,690`, `4,490`, `2,490`, `6,990`, service price table, and "+20% in Dammam/Khobar"), violating Document A's confirmed quote-only rule.
  2. **Uses Terracotta Orange (`#E4572E`) Instead of Proposed Palette:** Uses `--accent: #E4572E` and `--wa: #1FA855` instead of Document A's proposed Saffron Rise (`#F2A541`) and Oasis Green (`#1F7A5C`).
  3. **Form Bypass:** Submits `#auditForm` and `#visitForm` directly to `wa.me` via `window.open()` without capturing leads in GoHighLevel CRM or displaying the required on-page thank-you confirmation.
  4. **Missing Pages & Dropdowns:** Implements only 7 hash views; lacks individual service pages, city pages, FAQ standalone page, legal pages, blog, and header services dropdown.
  5. **Logo Arrow Direction Bug in LTR:** Flips decorative arrows in English (`transform: scaleX(-1)`) while keeping the header/footer logo arrow pointing left, violating Document A's rule (*"Never flip the direction inside one layout"*).

