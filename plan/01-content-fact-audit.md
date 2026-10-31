# 01 — Content-fact-vs-catalog numeric-spec audit

> A survey script cross-checks numeric claims in article/newsletter
> prose (switch spring/actuation weights, tracker scores) against
> the `data/` records they cite, filing AUDIT rows on mismatch.

## Why

Since expand pass 192 (2026-07-14), 19 separate instances have
shipped as one-off reactive fixes, each its own content+audit
commit pair: an article or newsletter states a switch's spring
weight or actuation force, or a tracker week's score, and that
number silently disagrees with the canonical `data/switches/*.json`
(`springGrams.actuation` / `springGrams.bottomOut`) or
`data/trends/<week>.json` (`rows[].score`) record it's citing —
either the article was wrong at write time, or the underlying data
record was corrected afterward and the citation never caught up.

A recurring sub-shape (7+ of the last 14 instances) is "N weeks
ago" / "first gain in N weeks" tracker-arithmetic claims that
don't match the real elapsed time in `data/trends/`'s archived
weekly series.

Every sibling recurring-defect class already has a scheduled,
mechanical check: `scripts/article-language-check.mjs` (stale
present-tense phrasing), `scripts/article-parts-check.mjs`
(missing `mentionedParts` cross-references, shipped as prior spec
38), `scripts/group-buy-status-check.mjs` (stale group-buy
`status`/`endDate`). None of them cross-checks a *numeric value*
an article states in prose against the ground-truth field it's
quoting. Every one of the 19 instances was caught by a manual
Explore-agent sweep, not a scheduled check — full detail and every
cited commit in `plan/CANDIDATES.md`'s `[score 7.5]`
"Automated content-fact-vs-catalog numeric-spec audit" row
(proposed 2026-07-14, aged-promoted via `/expand` pass 441,
2026-10-27).

## Design

New `scripts/content-fact-audit.mjs`, mirroring
`scripts/article-parts-check.mjs`'s resolve-then-diff shape:

- **Switch numeric citations.** For each article in
  `apps/web/src/content/articles/*.mdx`, resolve its
  `mentionedParts` switch slugs. Regex-scan the body for
  `<N>g` / `<N> gram` / `<N>-gram` patterns within a short token
  window of the switch's name or alias. Diff each found value
  against that switch's `springGrams.actuation` /
  `springGrams.bottomOut` (`data/switches/<slug>.json`). Flag a
  mismatch.
- **Tracker-score citations.** Resolve any `W\d\d` tracker-week
  token near a numeric score mention in article or newsletter
  body text. Diff against `data/trends/<week>.json`'s matching
  `rows[].score`. Flag a mismatch.
- **"N weeks ago" / streak-length sub-shape.** For a claim of the
  form "N weeks ago" or "first <gain|drop> in N weeks" tied to a
  tracker row, resolve the cited entity's real first-appearance
  week (or the real turning point) by walking the archived
  `data/trends/<week>.json` series for that row, and diff the
  claimed week-count against the real one.
- **Newsletter surface.** Run the same three checks against
  `apps/web/src/content/newsletters/*.mdx` — this is where the
  "N weeks ago" sub-shape concentrates (3 of the last 4 catches
  were newsletter issues).
- **Filing.** On mismatch, file a `content` category row in
  `plan/AUDIT.md` (mirrors `group-buy-status-check.mjs`'s
  scoring: ease 8–9 since the fix is a one-line prose correction
  once the mismatch is found, impact 4–5 since it's a
  factual-accuracy concern on already-published content).
  Dedupe against existing AUDIT rows by article slug + claim, like
  every sibling survey.
- **Wiring.** `--write`-gated and best-effort (non-zero exit
  logged, never blocks), same contract as every sibling survey.
  Called from `skills/march.lanes.md`'s empty-queue-refill survey
  chain (§3b.5a, immediately after `og-coverage-check.mjs`) and
  from `skills/digest.md`'s nightly breadth check.

### Decisions made upfront (do not ask)

- Scope is numeric-value cross-checks only (spring/actuation
  weights, tracker scores, week-count arithmetic). The
  structurally adjacent non-numeric sub-shapes noted across expand
  passes 252 ("as of this writing" staleness), 301 (categorical
  HE-switch claims), and 304 (open-ended vendor-list precision)
  are **not** in scope for this spec — they're pattern-based or
  categorical, not a numeric diff, and belong to a future spec if
  they keep recurring independently.
- No schema, component, or route change. Read-only against
  `data/` and content; writes only to `plan/AUDIT.md`.

## Acceptance

- **A2** The same run scans tracker-score citations (near `W\d\d`
  tokens) across articles and newsletters against
  `data/trends/<week>.json` and files a row for each mismatch.
- **A3** The run also catches the "N weeks ago" / streak-length
  sub-shape — a claimed week-count that disagrees with the real
  elapsed time walked from the archived `data/trends/` series for
  the cited row.
- **A4** The script is wired into `skills/march.lanes.md`'s
  empty-queue-refill survey chain (after `og-coverage-check.mjs`)
  and `skills/digest.md`'s nightly breadth check, both
  `--write`-gated, both best-effort (a non-zero exit is logged,
  never blocks the tick).
- **A5** A manual spot-check of the script's first real-world
  mismatch batch against the live corpus confirms zero false
  positives.

## Open questions

None — scope, mechanism and wiring point are fully specified above
from the candidate's own accumulated evidence.

## Chunks

Measure: 4 open · 1 closed · next A6

- [ ] **01.2** Tracker-score citations (articles + newsletters) · M · closes A2 · needs —
- [ ] **01.3** "N weeks ago" / streak-length sub-shape · M · closes A3 · needs 01.2
- [ ] **01.4** Wire into refill chain + digest · S · closes A4 · needs 01.2, 01.3
- [ ] **01.5** Live-corpus spot-check · S · closes A5 · needs 01.4
