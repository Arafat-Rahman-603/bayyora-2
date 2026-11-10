# 05 — Database & Data Integrity Audit (Agent E)

**Project:** Bayyora (بيّورا)  
**Auditor:** Agent E (CMS & Database Architect)  
**Primary Audited Files:** `planning/bayyora/16-CMS-ADMIN-ARCHITECTURE.md`, `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md`, `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`, `21-TECH-STACK-DECISION-RECORD.md`

---

## 1. Database Choice Verification (PostgreSQL 16+ vs. MongoDB)
- **Verdict:** Selecting **PostgreSQL 16+ (`@payloadcms/db-postgres` + Drizzle ORM)** over MongoDB (`17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md` §1, `ADR-002`) is verified as the strongest architectural choice for Bayyora's relational schema (`Services <-> Packages <-> Projects <-> Cities`), indexed `*_locales` tables (`ar`/`en`), deterministic Git-tracked SQL migrations (`src/migrations/`), and continuous WAL Point-in-Time Recovery (PITR).

---

## 2. Database & Data Integrity Findings

### Finding `AUD-017` — Inaccurate Assumption of Default `ON DELETE RESTRICT` in `@payloadcms/db-postgres` & Incomplete `Media` `beforeDelete` Reference Check
- **Category:** Database Referential Integrity (`AC-CMS-14`)
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:16, 173`; `16-CMS-ADMIN-ARCHITECTURE.md:103`
- **Evidence:** `17:16` states PostgreSQL *"enforces `ON DELETE RESTRICT` at the database level so in-use media files can never be accidentally deleted"*, while `16:103` says the `beforeDelete` hook blocks deletion *"if any published document references the image."*
- **Problem & Impact:**
  1. `@payloadcms/db-postgres` generates upload foreign keys with `ON DELETE SET NULL` by default (not `ON DELETE RESTRICT`).
  2. If `beforeDelete` only checks **published** documents (`16:103`), deleting a `Media` item referenced by an active **Draft** (`_status: 'draft'`), a **Global** (`SiteSettings`, `FooterNav`), a **Page Builder block**, or a **Lexical rich-text upload node** deletes the file from S3/R2 and breaks Draft Previews, Globals, and Version Rollbacks (`CMS-010`).
- **Recommendation:** Configure the `Media` `beforeDelete` hook to query references across all collections (both `published` and `draft`), all Globals, all Page Builder block tables, and Lexical `upload` nodes before allowing S3 deletion.
- **Priority:** `P1` | **Complexity:** Medium | **Approval Required:** No

---

### Finding `AUD-018` — Auto-301 Redirect Self-Loop Bug (`A -> B -> A`) When Reverting a Slug Edit
- **Category:** Database / SEO Integrity (`AC-CMS-18`)
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/19-ADVANCED-SEO-AND-SEO-MAINTENANCE.md:91`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:174`
- **Evidence:** `19:91` states: *"Changing the `slug` of any published document automatically creates a `301` redirect in the `Redirects` collection (`fromPath -> toPath`)... Validates on save that `fromPath !== toPath` and resolves redirect chains (`A -> B -> C` flattened to `A -> C`)."*
- **Problem & Impact:** If an editor changes a service slug from `A` to `B` (inserting redirect `A -> B`) and later reverts the slug from `B` back to `A`, flattening `A -> B -> A` produces `A -> A` or leaves `A -> B` active in `Redirects`, causing the live URL `A` to redirect infinitely!
- **Recommendation:** In the slug-change `beforeChange` hook, before inserting `oldPath -> newPath`, delete any existing `Redirects` row where `fromPath === newPath` and update any row where `toPath === oldPath` to `toPath = newPath`.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-019` — `AuditLogs` Foreign Key to `Users` (`USERS ||--o{ AUDIT_LOGS`) Conflicts With Log Immutability When Deleting User Accounts
- **Category:** Database Schema / Security Audit Trail (`AC-CMS-24`)
- **Severity:** **Medium** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:50, 177`
- **Evidence:** `17:50` defines `USERS ||--o{ AUDIT_LOGS : "actor"`, and `17:177` defines `actor: relationship -> Users` on `AuditLogs` (`Update/Delete disabled for all roles`).
- **Problem & Impact:** If an `Owner` deletes a departing employee's `Users` record, `ON DELETE CASCADE` would destroy immutable security logs, while `ON DELETE SET NULL` without denormalized actor identity loses the historical record of who performed past actions.
- **Recommendation:** Store denormalized `actorId: text`, `actorEmail: text`, and `actorRole: text` columns on `AuditLogs` alongside an optional `ON DELETE SET NULL` relationship to `Users`.
- **Priority:** `P2` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-020` — Inconsistent Collection Counts Across Documents (`11` vs. `13` vs. `14` Collections) & Missing Global Schema Tables in `17`
- **Category:** Documentation & Schema Synchronization
- **Severity:** **Medium** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md:40, 119`; `13-IMPLEMENTATION-ROADMAP.md:47`; `16-CMS-ADMIN-ARCHITECTURE.md:20-30`; `17-CONTENT-MODELS-AND-DATABASE-SCHEMA.md:84-177`
- **Evidence:** `08:40` says `11 Collections`, `08:119` and `17:84` say `13 Collections`, while `16:20-30` and `17:86-177` actually define **14 Collections** (`LeadSubmissions` was omitted from `08:119` and `13:47`).
- **Recommendation:** Standardize on **14 Collections + 5 Globals** (`SiteSettings`, `HeaderNav`, `FooterNav`, `ThemeSettings`, `UIStrings`) across all architecture and roadmap documents.
- **Priority:** `P2` | **Complexity:** Small | **Approval Required:** No

