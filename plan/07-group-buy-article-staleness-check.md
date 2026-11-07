# 07 — Group-buy companion article staleness gate

> A survey script that cross-references a group-buy companion
> article's frontmatter `title`/`lede` and early body prose against
> the linked `data/group-buys/*.json` record's `status`, so a
> "the group buy is live" headline stops outliving the buy it
> describes.

## Why

Six near-identical fix cycles shipped in one ~10-hour window
(gmk-cyl-selene, gmk-cyl-masterpiece-r2, gmk-cyl-ramune,
gmk-cyl-prussian-alert, divinikey-dcs-dolch, gmk-cyl-pandemonium) —
every one a group-buy companion article whose frontmatter
`title`/`lede` (feeding `<title>`, the OG image, and JSON-LD
`headline`) stayed in present-tense "is live"/"opens"/"runs
through" framing after the linked `data/group-buys/*.json` record's
`status` had already flipped to `closed`. A seventh, distinct
sub-shape hit the same article three separate times (closes #549,
#683, #855) via a mid-body "Update — ..." callout, not the
frontmatter. Three consecutive `/iterate` AUDIT entries (passes
157–159) diagnosed the same mechanism gap — `article-language-
check.mjs`'s pattern-matcher is frontmatter-blind by construction
(`extractBody` skips the frontmatter block) and its fixed phrase
list doesn't cover this phrasing family — without promoting a fix.
`scripts/group-buy-status-check.mjs` already flags a stale group-
buy *record* against its own `endDate`; there is no sibling check
flagging a stale *article* against the record it companions.
Candidate `[6.5]` (proposed 2026-07-07, digest pass; 4 reinforcing
source signals through expand pass 316), auto-promoted (aged, 123
days old) `/march` depth promotion, veto #1069.

## Design

- New `scripts/group-buy-article-staleness-check.mjs`, mirroring
  the resolve-then-diff shape of `group-buy-status-check.mjs` and
  `group-buy-companion-survey.mjs`:
  1. Load every `data/group-buys/*.json` record and index by
     `relatedArticle` (the existing field — `group-buy-companion-
     survey.mjs` already proves this is the live article↔group-buy
     association; no new schema field).
  2. For any linked record with `status: "closed"` or
     `"cancelled"`, load the companion article
     (`apps/web/src/content/articles/<relatedArticle>.mdx`) and
     scan its frontmatter `title` + `lede` plus the first 2 body
     paragraphs (reusing `article-language-check.mjs`'s
     `extractBody` for body access, but — unlike that script —
     also scanning the frontmatter fields it skips).
  3. Reuse the present-tense patterns already in
     `article-language-patterns.json` (`stale-buy-live`, etc.) and
     add frontmatter-shaped variants ("is live", "opens", "runs
     through <date>") where the existing set doesn't already match
     title-cased phrasing.
  4. File one `content` category `plan/AUDIT.md` row per flagged
     article, naming the file, the group-buy record, and the
     matched phrase(s) — same row shape as
     `group-buy-companion-survey.mjs`.
  5. `delayed` records are exempt (bearings: "`delayed` ...
     active-but-late" — present-tense framing stays correct).
- Wired into `skills/march.md`'s survey chain and
  `skills/digest.md`'s nightly breadth check — `--write`-gated and
  best-effort, same contract as every sibling survey (never blocks
  the gate, never fails the tick).

### Decisions made upfront (do not ask)

- Read-only against existing content and data; writes only to
  `plan/AUDIT.md`. No schema, component, or URL contract change.
- Resolution is one-directional and exact: `relatedArticle` names
  the article slug directly (confirmed via
  `group-buy-companion-survey.mjs`'s existing use of the field) —
  no fuzzy slug matching needed.
- `delayed` and `live`/`announced` records are never flagged, only
  `closed`/`cancelled` ones whose companion article still reads as
  open.
- Best-effort like every sibling survey: a parse miss or false
  negative is acceptable; a script crash is not — wrap per-article
  work in a try/catch and skip, don't abort the run.
- No fix-it-automatically mode. The script only files AUDIT rows; a
  human or a later `/iterate` tick writes the prose correction.

## Acceptance

- **A1** `scripts/group-buy-article-staleness-check.mjs` exists,
  runs read-only over `data/group-buys/*.json` and
  `apps/web/src/content/articles/*.mdx`, and exits 0 on a clean
  corpus.
- **A2** Given a `closed` or `cancelled` group-buy record whose
  `relatedArticle` companion still has present-tense buy-window
  language in frontmatter `title`/`lede`, the script files one
  `content` category row to `plan/AUDIT.md` naming the article, the
  group-buy record, and the matched phrase.
- **A3** Given the same condition but the stale phrase is in the
  first 2 body paragraphs (the "Update — ..." mid-body-callout
  sub-shape) rather than frontmatter, the script still files the
  row.
- **A4** A `delayed` record's companion article is never flagged
  for present-tense framing.
- **A5** The script is wired into `skills/march.md`'s survey chain
  and `skills/digest.md`'s nightly breadth check, `--write`-gated,
  and never fails the verify gate or the march tick on its own
  (errors degrade to a logged skip).
- **A6** Unit tests cover: a clean article (no row filed), a
  frontmatter-staleness hit, a body-callout-staleness hit, and a
  `delayed` record (never flagged).

## Open questions

None.

## Chunks

Measure: 6 open · 0 closed · next A7

Not chunked yet.
