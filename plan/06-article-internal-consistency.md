# 06 — Article internal-consistency checker

> A survey script that diffs an article's lede/heading claims
> against its own body (and, where it cites a sibling article, the
> sibling's claims), so a punchy lede number stops silently
> contradicting the careful figure two paragraphs later.

## Why

The same defect shape — a count or figure stated once "for effect"
in the lede/heading, then a different (usually correct) number in
the body or an embedded chart — has recurred 12+ times across
articles, newsletters, and chart captions (gasket-mount-reality,
zmk-mainstream-shift/keychron-q-ultra-zmk, computex-2026-keyboard-
highlights, pe-foam-mod, gmk-cyl-just-beachy, thock-weekly-007,
hall-effect-keyboard-guide, gmk-cyl-ta-neo, wuque-studio-summer-
update, and more). Every instance so far was caught by a reactive
manual sweep, one tick at a time. No existing survey covers this:
`article-language-check.mjs` catches stale temporal phrasing; the
numeric-spec-audit (shipped as spec 01) cross-checks prose against
*external* `data/` records. Nothing diffs an article against
*itself*. Candidate `[7.0]` (proposed 2026-07-22, expand pass 209;
12 reinforcing instances through pass 316), auto-promoted (aged,
107 days old) `/march` depth promotion, veto #1067.

## Design

- New `scripts/article-internal-consistency-check.mjs`, mirroring
  the resolve-then-diff shape of `group-buy-status-check.mjs` and
  `article-language-check.mjs`:
  1. Extract small integers and dollar/gram figures from an
     article's `lede` frontmatter field, its first heading, and its
     first 2 body paragraphs.
  2. For count-style claims ("N boards", "N sizes"), diff against
     enumerated lists later in the body (comma-separated model/size
     lists, `InlineViz` category counts).
  3. For dollar/gram figures, diff repeated mentions of the same
     tagged quantity across lede/body/callouts.
  4. Where an article's body links to a sibling article via
     `<Source>`/markdown link, extend the same lede/body extraction
     to the cited sibling and diff claims that reference the same
     fact.
  5. File `content` category `plan/AUDIT.md` rows on mismatch.
- Wired into `skills/march.md` §3b.5a's survey chain (alongside the
  other content surveys) and `skills/digest.md`'s nightly breadth
  check — `--write`-gated and best-effort, same contract as every
  sibling survey (never blocks the gate, never fails the tick).

### Decisions made upfront (do not ask)

- Read-only against existing content; writes only to
  `plan/AUDIT.md`. No schema, component, or URL contract change.
- Best-effort like every sibling survey: a parse miss or false
  negative is acceptable; a script crash is not — wrap per-article
  extraction in a try/catch and skip, don't abort the run.
- No fix-it-automatically mode. The script only files AUDIT rows;
  a human or a later `/iterate` tick writes the prose correction.

## Acceptance

- **A3** Given an article that links to a sibling via `<Source>`/
  markdown link and makes a conflicting claim about the same fact,
  the script files a row naming both articles.
- **A4** The script is wired into `skills/march.md`'s survey chain
  and `skills/digest.md`'s nightly breadth check, `--write`-gated,
  and never fails the verify gate or the march tick on its own
  (errors degrade to a logged skip).
- **A5** Unit tests cover: a clean article (no row filed), a count
  mismatch, a dollar/gram mismatch, and a sibling-citation mismatch.

## Open questions

None.

## Chunks

Measure: 3 open · 2 closed · next A6

- [ ] **06.3** Sibling-citation cross-check (`<Source>`/markdown link resolution + shared-fact diff), with sibling-mismatch test · M · closes A3, A5 · needs —
- [ ] **06.4** Wire into `skills/march.lanes.md`'s survey chain (§3b.5a, after `article-parts-check.mjs`) and `skills/digest.md`'s nightly breadth check, `--write`-gated · S · closes A4 · needs 06.3
