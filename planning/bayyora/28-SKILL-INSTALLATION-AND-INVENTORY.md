# 28 — Workspace UI/UX & Motion Skills Installation Report & Inventory

**Project:** Bayyora (بيّورا) — Saudi Digital Marketing & Creative Agency  
**Document Version:** 1.0  
**Status:** Verified & Installed at Workspace Level (`.agents/skills/`)  
**Cross-References:** `24-UI-UX-SKILLS-AND-WORKFLOW.md`, `25-DESIGN-SYSTEM-SPECIFICATION.md`, `26-MOTION-AND-ANIMATION-SYSTEM.md`, `27-ACCESSIBILITY-DESIGN-STANDARDS.md`

---

## 1. Pre-Installation Security & Provenance Verification

Before installing any skill into `c:\Users\Backspace\Desktop\Bayyora\.agents\skills\`, all four upstream GitHub repositories were inspected via the GitHub API and raw file inspection:

1. **Repository & Commit Verification:** Verified exact repository ownership, default branch, commit SHA, and SPDX open-source license (`MIT` and `Apache-2.0`).
2. **Full `SKILL.md` Inspection:** Read 100% of every `SKILL.md` and companion reference file to detect hidden prompt-injection instructions, unsafe tool directives, or conflicting aesthetic rules.
3. **Executable Script Security Audit (`ui-ux-pro-max/scripts/*.py`):**
   - Inspected `search.py` (202 lines), `core.py` (1,054 lines), `design_system.py` (1,669 lines), and `reasoning_contract.py` (124 lines).
   - **Static Security Result:** All scripts use **only Python 3 standard-library modules** (`argparse`, `csv`, `difflib`, `json`, `os`, `re`, `sys`, `io`, `tempfile`, `datetime`, `pathlib`, `math`, `collections`).
   - **Zero Unsafe Calls:** Verified **zero** network sockets/HTTP calls (`urllib`, `requests`, `socket`), **zero** shell execution calls (`subprocess`, `os.system`, `Popen`), **zero** dynamic code execution (`eval`, `exec`), and **zero** external `pip` dependencies.
4. **External URL Hardening (`web-design-guidelines`):**
   - Upstream `vercel-labs/agent-skills` `web-design-guidelines/SKILL.md` fetches `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` live at runtime.
   - To eliminate network dependency and prevent indirect prompt injection from mutable external URLs, we inspected `command.md` (192 lines, pure Web Interface Guidelines checklist) and vendored an immutable local copy at `.agents/skills/web-design-guidelines/references/web-interface-guidelines.md`.
5. **No Global Modification:** All skills were installed strictly inside the Bayyora workspace root (`c:\Users\Backspace\Desktop\Bayyora\.agents\skills\`), leaving global machine configuration (`~/.gemini/config/`) untouched.

---

## 2. Installed Workspace Skill Inventory

| Skill ID & Name | Upstream Repository & Path | Verified Commit SHA | License | Workspace Installation Path | Included Assets & Scripts | Purpose in Bayyora | Trigger Conditions |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Skill A: `ui-ux-pro-max`** | `nextlevelbuilder/ui-ux-pro-max-skill` (`.claude/skills/ui-ux-pro-max`) | `4f2dbb67e64969a9a30ab00742f2d55d66ddec2b` | `MIT` | `.agents/skills/ui-ux-pro-max/` | `SKILL.md`, `LICENSE`, `references/` (`pro-rules.md`, `quick-reference.md`), `data/` (17 CSV/JSON catalogs + 22 stack CSVs), `scripts/` (`search.py`, `core.py`, `design_system.py`, `reasoning_contract.py`) | Searchable UI/UX intelligence, RTL layout checks (`--rtl=full`), UX rules, and Next.js/React/Tailwind/shadcn stack guidance. | Designing new page sections, selecting component UX patterns, resolving compact layout/RTL bugs, or checking stack-specific UI rules. |
| **Skill B: `frontend-design`** | `anthropics/claude-plugins-official` (`plugins/frontend-design/skills/frontend-design`) | `0412be76f50ab4f4f8abff3753efa9269fbbca5b` | `Apache-2.0` | `.agents/skills/frontend-design/` | `SKILL.md`, `LICENSE.txt` | Studio-grade visual direction, typographic hierarchy, intentional layout structure, and anti-AI-template self-critique. | Creating or refactoring visual layouts, hero sections, service/package cards, and marketing page hierarchy. |
| **Skill C: `web-design-guidelines`** | `vercel-labs/agent-skills` (`skills/web-design-guidelines`) + `vercel-labs/web-interface-guidelines` (`command.md`) | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | `MIT` | `.agents/skills/web-design-guidelines/` | `SKILL.md`, `references/web-interface-guidelines.md` (vendored 192-line local snapshot) | Auditing UI code against 100+ Web Interface Guidelines (accessibility, focus states, forms, typography, images, CWV performance, i18n). | Pre-PR UI reviews, accessibility audits, form usability checks, and responsive RTL/LTR verification. |
| **Skill D: `web-animation-design`** | `vercel-labs/open-agents` (`.agents/skills/web-animation-design`) | `cf865e94de7729751c747171785b6ce57e7b178c` | `MIT` | `.agents/skills/web-animation-design/` | `SKILL.md`, `PRACTICAL-TIPS.md`, `LICENSE.md` | Easing blueprint (`ease-out`, `ease-in-out`, `ease`), `< 300ms` duration discipline, GPU compositor optimization, touch hover isolation, and `prefers-reduced-motion`. | Designing or reviewing CSS transitions, `motion/react` interactive islands, drawers, accordions, tabs, or the Before/After slider. |

---

## 3. Workspace Path & Bayyora Governance Adaptations Applied to Installed `SKILL.md` Files

To ensure seamless execution inside Antigravity on Windows without path errors or brand overrides, the following safe header notes are maintained in the workspace skill definitions:

1. **`.agents/skills/ui-ux-pro-max/SKILL.md`:**
   - Replaced `${CLAUDE_PLUGIN_ROOT}/.claude/skills/ui-ux-pro-max/scripts/search.py` with the workspace-relative path `.agents/skills/ui-ux-pro-max/scripts/search.py`.
   - Added a Bayyora Brand Governance note clarifying that `planning/bayyora/25-DESIGN-SYSTEM-SPECIFICATION.md` and the Payload CMS `ThemeSettings` Global are the authoritative design tokens (never overwrite via `--persist --force` without owner approval).
2. **`.agents/skills/frontend-design/SKILL.md`:**
   - Added a Bayyora Context note pinning the subject matter (*Saudi Arabian Local Business Digital Marketing & Creative Agency — Bayyora / بيّورا*) and confirming that Bayyora's Warm Cream/Sand (`#F7F3EB`), Deep Navy (`#0D2235`), Oasis Teal (`#136F63`), and Saffron/Terracotta (`#F2A541` / `#C7441F`) palette is an explicit owner brief requirement.
3. **`.agents/skills/web-design-guidelines/SKILL.md`:**
   - Updated the Guidelines Source instruction to read the local verified snapshot `.agents/skills/web-design-guidelines/references/web-interface-guidelines.md` first before attempting any external network fetch.
4. **`.agents/skills/web-animation-design/SKILL.md`:**
   - Removed the blocking conversational greeting restriction (*"respond only with: I'm ready to help you..."*) so agents can apply the animation rules directly during implementation and review tasks, and noted `motion/react` as the React 19 import path.

---

## 4. Verification of Installed Skills & Functional Test

- **Installation Status:** **4 / 4 Skills Verified & Installed (`0` Installation Failures)**
- **Directory Structure Check:**
  ```text
  .agents/
  └── skills/
      ├── frontend-design/
      │   ├── LICENSE.txt
      │   └── SKILL.md
      ├── ui-ux-pro-max/
      │   ├── LICENSE
      │   ├── SKILL.md
      │   ├── data/ (39 catalog & stack CSV/JSON files)
      │   ├── references/ (pro-rules.md, quick-reference.md)
      │   └── scripts/ (core.py, design_system.py, reasoning_contract.py, search.py)
      ├── web-animation-design/
      │   ├── LICENSE.md
      │   ├── PRACTICAL-TIPS.md
      │   └── SKILL.md
      └── web-design-guidelines/
          ├── SKILL.md
          └── references/
              └── web-interface-guidelines.md
  ```

