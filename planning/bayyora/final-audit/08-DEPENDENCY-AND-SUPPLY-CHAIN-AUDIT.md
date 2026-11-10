# 08 — Tech Stack, Dependency & Supply-Chain Audit (Agents C, F & K)

**Project:** Bayyora (بيّورا)  
**Auditors:** Agent C (TypeScript/React), Agent F (AppSec), Agent K (QA & Dependencies)  
**Primary Audited Files:** `planning/bayyora/08-NEXTJS-TECHNICAL-ARCHITECTURE.md`, `20-SECURITY-PERFORMANCE-AND-DEVOPS.md`, `21-TECH-STACK-DECISION-RECORD.md`, `26-MOTION-AND-ANIMATION-SYSTEM.md`

---

## 1. Lockfile & Manifest Ground-Truth Status
- **Repository Check:** No `package.json`, `pnpm-lock.yaml`, or `package-lock.json` exists yet (`00-AUDIT-SCOPE-AND-EVIDENCE.md`), as the project has not entered implementation. Therefore, `npm audit` / `pnpm audit` cannot be executed against an installed lockfile yet.
- **Planned Dependency Matrix Audit:** We audited every package in `21-TECH-STACK-DECISION-RECORD.md` for version compatibility, known CVEs, licensing, bundle weight, and missing peer dependencies.

---

## 2. Planned Dependency Compatibility & Advisory Matrix

| Dependency | Planned Spec (`21`) | Recommended Pinned Version Range | License | Known Advisory / Compatibility Check | Necessity Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`next`** | `15.x` (Unpinned) | **`^15.2.4`** (Minimum `15.2.3`) | `MIT` | **CRITICAL:** Versions `< 15.2.3` are vulnerable to `CVE-2025-29927` (`x-middleware-subrequest` authorization bypass). | **Mandatory Core** |
| **`react` & `react-dom`** | `19 / 18.3+` (`08:17`) | **`^19.0.0`** | `MIT` | **HIGH (`AUD-010`):** `@payloadcms/next` 3.x and `useActionState` (`08:161`) require **React 19** (`18.3` will fail peer dependencies). | **Mandatory Core** |
| **`typescript`** | `5.x` (`strict: true`) | **`^5.7.0`** | `Apache-2.0` | Compatible with Next.js 15 & Payload 3.x auto-generated `payload-types.ts`. | **Mandatory Core** |
| **`@payloadcms/next` & `payload`** | `3.x` | **`^3.28.0`** (Lock exact minor across all `@payloadcms/*` packages) | `MIT` | All `@payloadcms/*` packages (`next`, `db-postgres`, `richtext-lexical`, `storage-s3`, `ui`) **must share the exact same version** in `package.json` to prevent duplicate React context bugs. | **Mandatory Core** |
| **`tailwindcss`** | `3.4+ / 4.x` | **`^3.4.17`** (with `tailwindcss-animate`) | `MIT` | `08:143` and `18:55` use `tailwind.config.ts` (`v3.4` format), which is also required by `shadcn/ui` CLI and Payload 3.x compatibility. Pin `^3.4.17` so `npm install tailwindcss` does not pull breaking `v4.0` CSS-only config. | **Mandatory Core** |
| **`motion` (`motion/react`)** | Added in `26` & `21` (`ADR-004`) | **`^12.0.0`** | `MIT` | Official React 19 compatible package (replaces legacy `framer-motion`). Use `<LazyMotion features={domAnimation}>` (`~15 KB`). | **Approved (Interactive Islands)** |
| **`zod` & `react-hook-form`** | `3.x` & `7.x` | **`zod@^3.24.0`**, `react-hook-form@^7.54.0`, `@hookform/resolvers@^3.9.0` | `MIT` | Pin `zod@^3.24.0` (compatible with `@t3-oss/env-nextjs` and `@hookform/resolvers`). | **Mandatory Core** |
| **`@radix-ui/*` & `lucide-react`** | Latest stable | `@radix-ui/react-accordion`, `dialog`, `navigation-menu`, `tabs`, `direction`; `lucide-react@^0.475.0` | `MIT` | Ensure `@radix-ui/react-direction` is included so RTL (`dir="rtl"`) keyboard navigation mirrors automatically. | **Mandatory Core** |
| **`sharp`** | Bundled with Payload/Next | **`^0.33.5`** | `Apache-2.0` | Configure `limitInputPixels: 36_000_000` (`AUD-028`) to prevent decompression bombs. | **Mandatory Core** |
| **`file-type` & `@payloadcms/email-resend`** | **Missing from `21`** | `file-type@^20.0.0`, `@payloadcms/email-resend@^3.28.0` | `MIT` | Required to fulfill magic-byte upload checks (`01:112`, `AUD-028`) and fallback lead emails (`09:130`, `AUD-029`). | **Add to `21`** |

---

## 3. Supply-Chain Security Controls for Implementation
1. **Lockfile Integrity:** Enforce `pnpm install --frozen-lockfile` in CI/CD (`20-SECURITY-PERFORMANCE-AND-DEVOPS.md:83`) and commit `pnpm-lock.yaml`.
2. **Exact Version Pinning for `@payloadcms/*`:** Use `pnpm` overrides or exact versions (`save-exact=true` for `@payloadcms/*`) so transitive updates never mix two versions of `payload`.
3. **Disable Untrusted Postinstall Scripts:** Configure `.npmrc` with `ignore-scripts=true` and explicitly allowlist only `sharp` and `esbuild` via `pnpm.onlyBuiltDependencies`.

