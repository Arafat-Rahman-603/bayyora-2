# 13 — DevOps, CI/CD, Backup & Disaster Recovery Audit (Agent J)

**Project:** Bayyora (بيّورا)  
**Auditor:** Agent J (DevOps & Infrastructure Engineer)  
**Primary Audited Files:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md`, `14-OPEN-DECISIONS-AND-RISK-REGISTER.md`, `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`

---

## 1. DevOps, Backup & DR Findings

### Finding `AUD-041` — Pre-Deploy Destructive Migration Race Condition Breaking the `< 60s` Container Rollback Guarantee
- **Category:** DevOps / Database Migrations
- **Severity:** **High** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/20-SECURITY-PERFORMANCE-AND-DEVOPS.md:86, 95, 101`
- **Evidence:** `20:86` runs `payload migrate` before rolling out the new container image, and `20:101` promises `< 60 Seconds` instant container rollback if `/api/health` fails.
- **Problem & Impact:** If a migration drops or renames a column before the new container rolls out, the running old container immediately throws SQL 500 errors, and rolling back the container image (`< 60s`) fails because the database schema was already mutated.
- **Recommendation:** Enforce an **Expand-and-Contract Migration Policy** in `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`: additive-only SQL migrations (`ADD COLUMN NULLABLE`, `CREATE TABLE`) run pre-deploy, while destructive column drops run in a separate subsequent release verified by a CI SQL linter.
- **Priority:** `P1` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-042` — Missing Explicit RPO/RTO Targets, Media-to-DB Restore Verification & S3 Object Lock (WORM)
- **Category:** Disaster Recovery & Backup Integrity
- **Severity:** **Medium** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/20-SECURITY-PERFORMANCE-AND-DEVOPS.md:96-103`
- **Problem & Impact:** `20:97-103` defines WAL PITR and daily `pg_dump` jobs + monthly DB table-count restore checks, but omits formal RPO/RTO SLAs, omits checking S3/R2 media object consistency against restored `media` rows, and omits S3 Object Lock (Compliance Mode) on the backup bucket.
- **Recommendation:** Define formal `RPO <= 5 minutes` and `RTO <= 30 minutes`, enable S3 Object Lock (30-day WORM) with write-only backup credentials, and expand the monthly DR drill to verify S3 media object integrity and boot a test Next.js container.
- **Priority:** `P2` | **Complexity:** Small | **Approval Required:** No

---

### Finding `AUD-043` — Uncached `SELECT 1` Database Query in Public `/api/health` Endpoint
- **Category:** Availability / DoS Protection
- **Severity:** **Medium** | **Confidence:** Confirmed | **Status:** Open (Specification Gap)
- **Location:** `planning/bayyora/20-SECURITY-PERFORMANCE-AND-DEVOPS.md:111`
- **Problem & Impact:** Executing an uncached `SELECT 1` PostgreSQL query on every unauthenticated `/api/health` request allows attackers to exhaust the database connection pool via request flooding.
- **Recommendation:** Cache the health check DB probe result in memory for `5 seconds` (single-flight promise) or require a bearer token for deep DB probes.
- **Priority:** `P2` | **Complexity:** Small | **Approval Required:** No

