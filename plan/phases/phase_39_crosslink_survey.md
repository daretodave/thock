# Phase 39 — Companion-article prose cross-link auditor

> Score 5.5 · pass-119 candidate · promoted 2026-06-11 via /oversight

## Outcome

`scripts/article-crosslink-survey.mjs` surveys article pairs sharing ≥2 tags for missing
prose cross-links and files AUDIT rows so the iterate loop can drain them. The companion
amendments to `skills/march.md` Step 3b.5a and `skills/ship-content.md` Step 7c wire the
survey into the automatic dispatch path — new articles are checked at ship time; the full
corpus is swept whenever the content queue is empty.

## Why

The cross-link drain consumed ~40 iterate commits across expand passes 94–124 (same root
cause as mentionedParts: nothing mechanically surfaced these gaps at write time). Phase 38
added the mentionedParts gate; Phase 39 adds the cross-link survey so editorial links
between topically related articles are surfaced systematically rather than discovered
one-by-one in critique passes.

## What ships

### 1. `scripts/article-crosslink-survey.mjs`

```
node scripts/article-crosslink-survey.mjs
```

Dry-run default: prints unlinked pairs to stdout, exits 1 if any found, 0 if all clean.

```
node scripts/article-crosslink-survey.mjs --write
```

Scan mode: walks all articles, appends AUDIT rows for unlinked pairs. Deduplicates: skips
pairs whose slugs already appear together in AUDIT.md. Exits 0.

```
node scripts/article-crosslink-survey.mjs --json
```

JSON output: `{ "pairs": [...] }`. Full scan. Exits 0.

```
node scripts/article-crosslink-survey.mjs --slug <slug>
```

Scope flag: combined with dry-run / --write / --json, limits survey to pairs that include
this slug. Used by `ship-content` Step 7c to check only the newly shipped article's pairs.

**Algorithm:**

1. Read all `.mdx` files from `apps/web/src/content/articles/`.
2. Parse frontmatter for `slug`, `pillar`, `tags` (supports inline `tags: [a, b]` and
   multi-line `tags:\n  - a\n  - b` YAML; strips quotes from tags like `"75"`).
3. Extract body (text after closing `---` fence).
4. For each pair (A, B): compute shared tags. If `sharedTags.length < 2`, skip.
5. Check if A's body contains `/article/B.slug` OR B's body contains `/article/A.slug`.
6. If neither links the other → unlinked pair.
7. Score: same pillar → impact 5, ease 9, score 4.5. Cross-pillar → impact 4, ease 9,
   score 3.6.

**Deduplication in `--write` mode:**

Before appending, read current `plan/AUDIT.md` content. Skip any pair where both slugs
already appear on the same heading line (look for `<slugA> ↔ <slugB>` or
`<slugB> ↔ <slugA>` in existing AUDIT content). This prevents duplicate rows when
`--write` is called on successive march ticks before the queue is drained.

**Pair output shape (for `--json` and `__test` export):**

```json
{
  "slugA": "gateron-oil-king-deep-dive",
  "slugB": "switch-housings-compared",
  "pillarA": "deep-dives",
  "pillarB": "guides",
  "sharedTags": ["pom", "polycarbonate"],
  "samePillar": false,
  "impact": 4,
  "ease": 9,
  "score": 3.6
}
```

**AUDIT row shape:**

```
### [ ] [cross-links] [4.5] <slugA> ↔ <slugB> — no prose cross-link (same pillar, ≥2 shared tags: tag1, tag2)
- category: cross-links
- filed: YYYY-MM-DD by article-crosslink-survey.mjs
- impact: 5 (same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling)
- ease: 9 (add one inline markdown link to either article body)
- score: 4.5 (impact × ease / 10)
- shared-tags: tag1, tag2
- article-a: apps/web/src/content/articles/<slugA>.mdx
- article-b: apps/web/src/content/articles/<slugB>.mdx
- action: add [<slugB>](/article/<slugB>) to <slugA> body, or vice versa
```

Cross-pillar row uses impact 4, score 3.6, and "adjacent pillar" in the description.

**`__test` export (for `scripts/__tests__/article-crosslink-survey.test.mjs`):**

```javascript
export const __test = { parseFrontmatter, extractBody, hasLinkTo, findUnlinkedPairs }
```

### 2. `scripts/__tests__/article-crosslink-survey.test.mjs`

`node:test` unit tests (consistent with Phase 36 / 38 script tests):

- **Gap case:** two articles sharing ≥2 tags, neither body links to the other →
  `findUnlinkedPairs` returns one pair with correct slugs, sharedTags, samePillar, score.
- **Control — one link present:** two articles sharing ≥2 tags, article A body contains
  `/article/slugB` → `findUnlinkedPairs` returns empty array (pair is already linked).
- **Control — fewer than 2 shared tags:** two articles sharing only 1 tag →
  `findUnlinkedPairs` returns empty array (threshold not met).

### 3. `skills/march.md` Step 3b.5a amendment

Current Step 3b.5a invokes `content-gap-survey.mjs --write` when the content queue is
empty. After this phase, also invoke the crosslink survey at the same point:

```bash
# After content-gap-survey.mjs --write (already there from Phase 30):
node scripts/article-crosslink-survey.mjs --write
```

This runs silently (exit 0 always in --write mode) and files any new unlinked-pair AUDIT
rows. If it exits non-zero, log and continue — the survey is best-effort.

### 4. `skills/ship-content.md` Step 7c amendment

Current step numbering after Phase 38:
- Step 7a — Language gate
- Step 7b — mentionedParts gate
- Step 7c — Commit + push

After this phase:
- Step 7a — Language gate (Phase 36, unchanged)
- Step 7b — mentionedParts gate (Phase 38, unchanged)
- **Step 7c — Cross-link survey (Phase 39, NEW)**
  - Run `node scripts/article-crosslink-survey.mjs --write --slug <slug>` on the newly
    drafted article.
  - This files AUDIT rows for unlinked pairs between the new article and its tag-siblings.
  - Exit 0 always — the survey is informational, not a gate. Log any stderr but do not
    block the commit.
- Step 7d — Commit + push (renamed from 7c; no other changes)

The commit command in Step 7d is otherwise identical to the current Step 7c.

## Decisions (for the loop)

- Cross-link detection uses a substring check for `/article/<slug>` in the body text
  (case-sensitive, no word-boundary). This is sufficient because article slugs are
  kebab-case and unlikely to appear as a substring of another slug or other path segment.
- The `--slug` scope flag applies on top of any other mode flag. Combined: `--write --slug
  foo` files rows only for pairs involving `foo`; `--json --slug foo` returns only those
  pairs; dry-run `--slug foo` prints only those pairs.
- AUDIT rows use `category: cross-links` (new category, accepted by the iterate scoring
  loop as a generic improvement category).
- Deduplication in `--write` mode checks AUDIT.md for lines matching `<slugA> ↔ <slugB>`
  or `<slugB> ↔ <slugA>`. This is a cheap string scan; no YAML parsing needed.
- The survey is non-gating everywhere it is called (march Step 3b.5a, ship-content Step
  7c). It files rows for the iterate loop to drain over future ticks; it never blocks a
  commit.
- The one-time corpus scan is included in the phase's shipping commit via `node
  scripts/article-crosslink-survey.mjs --write` — any unlinked pairs in the existing
  corpus are filed immediately so the iterate loop can begin draining them the next tick.
