# 12 — External Integrations, CRM & Saudi PDPL Privacy Audit (Agents F & L)

**Project:** Bayyora (بيّورا)  
**Auditors:** Agent F (AppSec) & Agent L (Compliance & Privacy Auditor)  
**Primary Audited Files:** `planning/bayyora/09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md`, `11-BUSINESS-OPERATIONS-AND-COMPLIANCE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md`, `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`

---

## 1. Integrations & Privacy Findings

### Finding `AUD-029` — Missing Idempotency Key, Field Name Contradiction (`syncStatus` vs. `ghlSyncStatus`), Unauthenticated Cron & Missing Email Adapter for `LeadSubmissions`
- **Category:** CRM Integration Reliability & Security (`INT-001`)
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md:125-130`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:175`; `21-TECH-STACK-DECISION-RECORD.md:38-55`
- **Evidence:** `09:126` uses `syncStatus`, whereas `17:175` uses `ghlSyncStatus`. `09:130` relies on a fallback alert email and background retry cron job, but no email adapter (`@payloadcms/email-resend`), idempotency key, `dead_letter` state, or `CRON_SECRET` verification is defined.
- **Problem & Impact:** Retrying a partially succeeded GHL submission without an idempotency key creates duplicate Opportunities in Stage 1 (`New Audit Request`), and missing email configuration causes fallback lead alerts to fail silently.
- **Recommendation:** Standardize on `ghlSyncStatus` (`'pending' | 'synced' | 'failed_retry_queued' | 'dead_letter'`), add `idempotencyKey`, `ghlOpportunityId`, `nextRetryAt`, and `lastError` to `LeadSubmissions`, authenticate the retry job via `CRON_SECRET`, and add `@payloadcms/email-resend` to `21-TECH-STACK-DECISION-RECORD.md`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-030` — Saudi PDPL Consent Proof, Cross-Border Transfer Disclosure, AES-256-GCM Encryption & 90-Day PII Retention Gaps
- **Category:** Privacy & Saudi PDPL Compliance (`BR-014` / `OPS-COMP-04`)
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap — Flagged for Owner/Legal Review)
- **Location:** `planning/bayyora/09-INTEGRATIONS-AND-LEAD-WORKFLOWS.md:70-85`; `11-BUSINESS-OPERATIONS-AND-COMPLIANCE.md:60-66`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:175`
- **Evidence:** `09:70-79` (`auditFormSchema`) and `17:175` (`LeadSubmissions`) omit consent proof fields (`privacyConsentAccepted`, `consentTimestamp`, `privacyPolicyVersion`), omit AES-256-GCM encryption hooks for `payloadJson`, and define no retention purge policy.
- **Problem & Impact:**
  1. Under Saudi PDPL (Articles 5, 6, 18, and 29), collecting personal mobile numbers for WhatsApp marketing/audit follow-up and transferring them to cloud processors (GoHighLevel) requires provable consent records, explicit cross-border transfer disclosure in `/privacy`, and mandatory destruction once the retention purpose expires.
  2. Technical controls alone do not constitute legal certification; final `/privacy` text requires qualified Saudi legal review.
- **Recommendation:**
  1. Add `privacyConsentAccepted: z.literal(true)`, `consentTimestamp`, and `privacyPolicyVersion` to `auditFormSchema`, `contactFormSchema`, and `LeadSubmissions`.
  2. Encrypt `LeadSubmissions.payloadJson` at the application layer (AES-256-GCM using `LEAD_PII_ENCRYPTION_KEY`) and schedule a daily job to purge/anonymize synced leads older than 90 days.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

