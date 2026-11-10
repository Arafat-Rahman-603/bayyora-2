# 15 — Saudi Business Compliance & Content Trust Audit (Agent L)

**Project:** Bayyora (بيّورا)  
**Auditor:** Agent L (Product, Business & Saudi Regulatory Compliance Auditor)  
**Primary Audited Files:** `planning/bayyora/00-PROJECT-SOURCE-AUDIT.md`, `01-PRD.md`, `11-BUSINESS-OPERATIONS-AND-COMPLIANCE.md`, `14-OPEN-DECISIONS-AND-RISK-REGISTER.md`, `16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md`

---

## 1. Verification of Mandatory Business Requirements (Section 2 & 11)

| Business Requirement | Verification Status in v2.0 Specs | Audit Notes |
| :--- | :--- | :--- |
| **9 Service Categories (`BR-001`)** | **Verified Preserved** | All 9 services preserved in `01`, `05`, `07`, `10`, `17`. |
| **5 Package Types (`Bidaya`, `Numow`, `Riyada`, `Look`, `Go Online` — `BR-002`)** | **Verified Preserved** | Modeled in `Packages` (`17:114-135`); `AUD-014` adds missing 30s video & bundle deliverable fields. |
| **Public Pricing Disabled by Default (`BR-003`)** | **Verified Preserved** | `SiteSettings.publicPricingEnabled = false` (`16:41`); `AUD-001` ensures `overrideAccess: false` prevents RSC leakage. |
| **48h Free Mini Audit (6 Checkpoints + 1 Free Sample — `BR-005`, `BR-006`)** | **Verified Preserved** | Enforced across `06`, `09`, `11`. |
| **Sample Concepts Clearly Labelled (`نموذج توضيحي` — `BR-009`)** | **Verified Preserved** | Enforced via `Projects.isSampleConcept` (`17:140`). |
| **Dawair Publication Permission-Gated (`BR-010`)** | **Verified Preserved** | Enforced via `Projects.clientPermissionVerified` (`17:141`); `AUD-005` adds field-level `access.update: isOwnerOrAdmin`. |
| **Client Account Ownership (`100% Client Owned` — `BR-011`)** | **Verified Preserved** | Documented in `11:76-85` and `/terms`. |

---

## 2. Saudi Regulatory & Compliance Findings

### Finding `AUD-015` — Missing Saudi E-Commerce Law Credentials (`CR`, `ZATCA VAT`, `National Address`, & `Saudi Business Center` Replacing Retired `Maroof`) in `SiteSettings`
- **Category:** Saudi Commercial Compliance (`OD-002`, `OD-009`, `RSK-007`)
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/14-OPEN-DECISIONS-AND-RISK-REGISTER.md:16, 23, 65`; `16-CMS-ADMIN-ARCHITECTURE.md:36-43, 55-64`
- **Evidence:** `14:16 & 65` states that `SiteSettings` holds the modular formal legal entity name and CR number, and `14:23` (`OD-009`) references `CR / Maroof`. However, `16:36-43` (`SiteSettings` fields) omits all legal registration fields, and `14:23` does not note that **Maroof (`معروف`) was officially superseded in Saudi Arabia by the Saudi Business Center (`المركز السعودي للأعمال` — توثيق التجارة الإلكترونية)**.
- **Recommendation:** Add a `legalAndCompliance` group to `SiteSettings` (`legalEntityName`, `commercialRegistrationNumber`, `vatRegistrationNumber`, `saudiBusinessCenterAuthId`, `saudiBusinessCenterUrl`, `nationalAddress`) rendered conditionally in `FooterNav` and `/terms`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-045` — Unenforced Mawthooq (`موثوق`) License Field in `Projects` / `Posts` & Inline `beforeAndAfter` Block Compliance Bypass
- **Category:** Saudi Media & SFDA Compliance (`BR-014` / `OPS-COMP-01` / `OPS-COMP-02`)
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/11-BUSINESS-OPERATIONS-AND-COMPLIANCE.md:72-74, 103-105`; `16-CMS-ADMIN-ARCHITECTURE.md:75`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:137-152, 169`
- **Evidence:** `11:72-74` mandates verifying an influencer's active **Mawthooq (`موثوق`)** license from GAMR before publishing influencer work, yet zero fields in `Projects` or `Posts` (`17:137, 169`) track Mawthooq verification. Additionally, the `beforeAndAfter` Page Builder block (`16:75`) allows custom inline comparisons without linking to a permission-verified `Project`.
- **Recommendation:** Add `includesInfluencerWork: checkbox`, `mawthooqLicenseVerified: checkbox`, and `mawthooqLicenseNumber: text` to `Projects` and `Posts`, and require inline `beforeAndAfter` blocks to either link a verified `Project` or display the mandatory `isSampleConcept` (`نموذج توضيحي`) badge.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

