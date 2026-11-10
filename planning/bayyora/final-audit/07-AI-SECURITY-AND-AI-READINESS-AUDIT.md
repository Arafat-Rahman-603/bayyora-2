# 07 — AI Security & AI Readiness Audit (Agent G — OWASP AISVS)

**Project:** Bayyora (بيّورا)  
**Auditor:** Agent G (AI Security Specialist)  
**Framework Applied:** OWASP AI Security Verification Standard (AISVS) & Saudi SDAIA Generative AI Guidelines  
**Primary Audited Files:** `planning/bayyora/00-PROJECT-SOURCE-AUDIT.md`, `11-BUSINESS-OPERATIONS-AND-COMPLIANCE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md`, `19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md`, `24-UI-UX-SKILLS-AND-WORKFLOW.md`, `28-SKILL-INSTALLATION-AND-INVENTORY.md`

---

## 1. Runtime AI Security Applicability Determination

- **Runtime Web Application AI Status:** **`NOT APPLICABLE (N/A)`**
- **Evidence:** Inspection of all 29 planning specifications (`00`–`28`) confirms that the Bayyora Next.js + Payload CMS web application does **not** integrate any runtime LLM APIs, AI chatbots, RAG/vector databases, or autonomous runtime tool-calling agents. In accordance with Section 6 of the Audit Charter, we do not invent a runtime AI product requirement.

---

## 2. Non-Runtime AI Content, Deliverable & Agentic Tooling Audit

While the web app has no runtime AI, AI intersects with Bayyora in three operational areas that were audited against OWASP AISVS:

### 2.1 AI-Assisted Agency Deliverables (`AUD-032`)
- **Finding ID:** `AUD-032` | **Severity:** **Medium** | **Priority:** `P2`
- **Location:** `planning/bayyora/00-PROJECT-SOURCE-AUDIT.md:67-68`; `11-BUSINESS-OPERATIONS-AND-COMPLIANCE.md:68-71`
- **Evidence:** Service 5 (`/services/video-animation`) includes `"AI product videos"` (`00:67`) and Service 6 (`/services/photography`) includes `"AI product scenes"` (`00:68`).
- **Problem & Impact:** Using generative AI to place client products into synthetic scenes risks: (a) altering medical/pharmacy packaging claims in violation of SFDA rules (`BR-014`), or (b) fabricating food dishes for restaurant clients that mislead consumers (`BR-009`).
- **Recommendation:** Add an operational SOP guardrail in `11-BUSINESS-OPERATIONS-AND-COMPLIANCE.md` requiring human review of all AI product scenes, prohibiting AI generation of medical/pharmacy packaging text, and preserving authentic product photography for food/retail items.

### 2.2 AI-Generated Blog / City Content & SFDA Gate on `Posts` (`AUD-033`)
- **Finding ID:** `AUD-033` | **Severity:** **Medium** | **Priority:** `P2`
- **Location:** `planning/bayyora/11-BUSINESS-OPERATIONS-AND-COMPLIANCE.md:104`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:169`
- **Evidence:** `11:104` requires an `sfdaComplianceVerified` checkbox on both `Projects` and `Posts` tagged under Pharmacy, but `17:169` omitted `sfdaComplianceVerified` from the `Posts` schema.
- **Problem & Impact:** If an editor uses an LLM to draft Arabic blog articles (`2 articles/month` in Phase 3) covering pharmacy/clinic marketing, the CMS lacks the `sfdaComplianceVerified` field on `Posts` to enforce mandatory pharmacist partner review before publication.
- **Recommendation:** Add `isMedicalOrPharmacyContent: checkbox` and `sfdaComplianceVerified: checkbox` (`access.update: isOwnerOrAdmin`) to `Posts` (`17:169`) and enforce human review + `translationStatus` sign-off before publishing any AI-assisted draft.

### 2.3 AI-Assisted Software Development & Workspace Skill Supply-Chain Safety
- **Verification of `.agents/skills/` (`28-SKILL-INSTALLATION-AND-INVENTORY.md`):**
  1. All 4 installed workspace skills (`ui-ux-pro-max`, `frontend-design`, `web-design-guidelines`, `web-animation-design`) were audited for indirect prompt injection and unsafe script execution prior to installation.
  2. In `web-design-guidelines` (`SK-CONF-04` in `24-UI-UX-SKILLS-AND-WORKFLOW.md`), the upstream instruction to fetch `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` live from the internet on every run was mitigated by vendoring an inspected, immutable local snapshot at `.agents/skills/web-design-guidelines/references/web-interface-guidelines.md`.

