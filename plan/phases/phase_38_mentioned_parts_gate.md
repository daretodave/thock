# Phase 38 — mentionedParts ship-time enforcement gate

> Score 6.5 · pass-94 candidate · promoted 2026-06-11 via /oversight

## Outcome

`scripts/article-parts-check.mjs` enforces the `mentionedParts` frontmatter contract at
ship time, before a new article can enter the corpus with silent gaps. The companion
amendment in `skills/ship-content.md` Step 7b wires it into the content velocity loop so
every article drafted by `content-curator` is automatically checked — same shape as the
Phase 36 language gate.

## Why

The prior iterate-drip for mentionedParts gaps (40+ commits across expand passes 94–124)
fixed individual articles one at a time without preventing new ones. The root cause is
purely mechanical: nothing checks the constraint at write time. This phase installs the
gate so future articles cannot ship with the same gap.

## What ships

### 1. `scripts/article-parts-check.mjs`

```
node scripts/article-parts-check.mjs <file.mdx> [...]
```

- **Catalog** — loads `{ slug, name, kind }` from all
  `data/{switches,keycap-sets,boards}/*.json` at startup.
- **Body extraction** — strips YAML frontmatter (same helper as Phase 36).
- **Mention detection** — case-insensitive search for each entity `name` in the
  article body; multi-word names matched as literal strings (no word-boundary
  regression on spaces).
- **Gap check** — for each detected mention, verifies the entity's `{ slug, kind }`
  pair appears in the article's `mentionedParts` array. Reports a violation if absent.
- **Gate mode** (default): named `.mdx` files → exit 1 if any violations; exit 0 if clean.
- **`--json`** mode: `{ violations: [...] }` for programmatic use.
- **`--write`** mode: walks all articles, appends AUDIT.md rows for residual gaps
  (one-time corpus scan).

Violation shape:
```json
{
  "file": "<path>",
  "slug": "<article-slug>",
  "entitySlug": "<entity-slug>",
  "entityKind": "switch|keycap-set|board",
  "entityName": "<human name>",
  "line": 42,
  "column": 7,
  "context": "<120-char excerpt>"
}
```

### 2. `scripts/__tests__/article-parts-check.test.mjs`

Three `node:test` unit tests against the exported `__test` object:
- **Violation** — entity name in prose, `{ slug, kind }` absent from `mentionedParts`
- **No-violation** — entity name in prose, `{ slug, kind }` present in `mentionedParts`
- **Not-in-catalog control** — name in prose but not a catalog entity → no violation

### 3. `skills/ship-content.md` Step 7b amendment

Current structure: `7a` language gate → `7b` commit + push.

After this phase:
- **Step 7a** — Language gate (Phase 36, unchanged)
- **Step 7b** — mentionedParts gate (Phase 38, NEW)
  - Run `node scripts/article-parts-check.mjs <slug>.mdx`
  - Exit 0 → proceed to Step 7c
  - Exit 1 → pass violation list back to `content-curator` for one revision; hard-fail
    if violations persist on second check
- **Step 7c** — Commit + push (renamed from 7b)

### 4. One-time corpus scan

Commit includes output of `node scripts/article-parts-check.mjs --write` — any AUDIT rows
filed for residual gaps in the existing corpus are committed to `plan/AUDIT.md` in the
same commit.

## Decisions (for the loop)

- Entity names are matched case-insensitively as literal strings. No word-boundary
  assertion on the ends — entity names are multi-word and specific enough that substring
  false positives are unlikely in practice. If a false positive surfaces, a per-entity
  exemption list in `scripts/article-parts-check-config.json` can suppress it (not
  pre-built; add when needed).
- `--write` mode scores audit rows at `[3.6]` (impact 4, ease 9 — identical to the
  language-check row shape, since fixing a mentionedParts gap is also a frontmatter edit).
- The script does not attempt to auto-fix `mentionedParts`; it only reports. The
  content-curator revision loop handles the fix.
- Articles without a `mentionedParts:` key at all are treated as having an empty array
  (same as the schema default).
