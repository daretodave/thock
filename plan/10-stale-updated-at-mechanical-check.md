# 10 — Stale-`updatedAt` mechanical check

> A mechanical survey that diffs an article's frontmatter
> `updatedAt` against the git history of its own content, so a
> substantive edit that forgets to bump `updatedAt` — and so
> silently tells crawlers (`dateModified` JSON-LD,
> `article:modified_time` OG meta) nothing changed — is caught
> before it needs a sixth reactive fix.

## Why

Five independent reactive fixes landed across three weeks with
no gap longer than 9 days between recurrences, escalating
2 → 3 → 4 → 1 → 4 articles each time, 14 articles total:
`945836f0` (2026-07-24), `37994547` (2026-07-27, closes #628),
`d2d275d2` (2026-08-03, closes #724, AUDIT `[seo] [4.8]`),
`51fc2b8c` (2026-08-12, `gmk-cyl-just-beachy`), `00a98895`
(2026-08-14, closes #869). Same mechanism every time: a
content-fix commit (tense correction, trend-citation refresh,
factual repair) edits an article's body or frontmatter but
leaves `updatedAt` untouched, so `dateModified` JSON-LD and
`article:modified_time` OG meta (both sourced solely from
`updatedAt` per `packages/seo/src/buildJsonLd.ts`) keep telling
crawlers "unchanged since original publish" for days after a
substantive edit. Candidate `[score 6.5]` (proposed
2026-08-15, 94 days old), auto-promoted (aged) `/march`
depth promotion.

This is the fourth distinct recurring-defect class — after
`mentionedParts` (`article-parts-check.mjs`), OG coverage
(`og-coverage-check.mjs`), and a11y-spec-coverage
(`a11y-spec-coverage-check.mjs`) — to cross 3+ reactive
instances with no purpose-built script catching it. Each of
those three was mechanized at a comparable or lower instance
count. Two prior single-instance notes (pass 312's
`gmk-cyl-just-beachy` note, logged as "not enough evidence to
file") are the corroborating first instance; `00a98895` is the
second+ instance that graduates this past the §4A "3+" bar.

## Design

- **`scripts/stale-updated-at-check.mjs`**, mirroring the shape
  of `og-coverage-check.mjs` / `article-parts-check.mjs` (gate /
  `--write` / `--json` modes, AUDIT.md row filing, dedup):
  - For each article MDX file under
    `apps/web/src/content/articles/`, find the most recent git
    commit that touched the file's non-generated content:
    `git log -1 --format=%cI -- <path>`, walking back past any
    commit whose diff on that file touches `updatedAt` only
    (a self-referential bump commit) to find the underlying
    content-change timestamp. Compare that timestamp's date
    against the file's frontmatter `updatedAt` date.
  - A drift where the last content-changing commit's date is
    **after** the frontmatter `updatedAt` date is a flag —
    exactly the defect shape all 5 reactive fixes independently
    discovered by hand.
  - Exclude commits that are pure metadata/generated-file
    rebuilds (manifest, search-index) with no diff on the
    article's own MDX body/frontmatter — avoids false positives
    from unrelated repo-wide regen commits touching file mtimes
    without touching the file itself (a `git log` path-filtered
    query already scopes to commits that touched the file, so
    this is mostly about excluding self-referential
    `updatedAt`-only bump commits from being mistaken for the
    "last content edit," not a second filtering pass).
  - Gate mode (single file arg, or called from `pnpm verify`):
    exit 1 with every flagged article (`slug` + drift) if any
    hit.
  - `--write`: append a `seo`-category `plan/AUDIT.md` row per
    hit, deduplicated against existing pending rows, same
    contract as `og-coverage-check.mjs --write`.
  - `--json`: `{ stale: [...] }` for programmatic use (digest's
    nightly run).
- **Unit tests** (`scripts/__tests__/stale-updated-at-check.test.mjs`,
  mirroring `scripts/__tests__/og-coverage-check.test.mjs`):
  - A fixture article edited (content commit) after its
    `updatedAt` → flagged.
  - A fixture article whose `updatedAt` is already current (no
    content commit after it) → clean.
  - A fixture article whose only post-`updatedAt` commit is a
    self-referential `updatedAt`-only bump → not re-flagged (the
    fix-commit-itself exclusion).
  - Run via the existing `pnpm test:scripts` leg — no new verify
    leg for the test half.
- **Wiring**: add the `--write` invocation to
  `skills/march.lanes.md`'s survey chain (alongside
  `article-internal-consistency-check.mjs` and
  `group-buy-article-staleness-check.mjs`), same `--write`
  contract, never blocking the march commit — best-effort, log
  and continue on non-zero exit. Also add it to
  `skills/digest.md`'s nightly breadth-check list, same
  contract, the way `article-internal-consistency-check.mjs` and
  `group-buy-article-staleness-check.mjs` are already listed
  there.

### Decisions made upfront (do not ask)

- **Survey-chain placement, not a new `pnpm verify` leg**: unlike
  spec 09's truncation gate (a per-commit regression risk on code
  the loop itself writes), this defect is corpus drift on
  existing articles from edits that already landed — the
  mechanism `article-internal-consistency-check.mjs` and
  `group-buy-article-staleness-check.mjs` both use (survey-chain
  `--write`, AUDIT row, no blocking gate). A per-commit gate would
  also be structurally awkward: the "did this specific commit
  touch content without bumping `updatedAt`" question is decidable
  per-commit, but re-running a full-corpus git-log walk on every
  `pnpm verify` call is the kind of O(content) breadth `agents.md`
  §3 says belongs on the nightly path, not the per-commit one.
- **Date-level comparison, not timestamp-level**: `updatedAt` in
  existing frontmatter is typically a date (no time-of-day
  component); comparing at date granularity avoids false
  positives from a same-day fix-then-bump sequence landing in two
  commits minutes apart.
- **No change to `updatedAt` semantics or the JSON-LD/OG call
  sites**: `packages/seo/src/buildJsonLd.ts` already sources
  `dateModified` from `updatedAt` correctly; this spec adds
  detection of articles where the *data* is stale, not a change
  to how the data is consumed.

## Acceptance

- **A1** `scripts/stale-updated-at-check.mjs` exists, mirrors the
  `og-coverage-check.mjs` shape (gate / `--write` / `--json`).
- **A2** Gate mode flags a fixture article whose frontmatter
  `updatedAt` predates its most recent non-self-referential
  content commit, and passes a fixture article whose `updatedAt`
  is current.
- **A3** Gate mode does not re-flag an article whose only
  post-`updatedAt` commit is a self-referential `updatedAt`-only
  bump.
- **A4** `--write` appends a `seo`-category `plan/AUDIT.md` row
  per hit, deduplicated against existing pending rows.
- **A5** `scripts/__tests__/stale-updated-at-check.test.mjs`
  exercises A2/A3's three fixture cases, run via
  `pnpm test:scripts`.
- **A6** `skills/march.lanes.md`'s survey chain and
  `skills/digest.md`'s nightly breadth-check list both include
  the `--write` invocation, same best-effort / non-blocking
  contract as their sibling surveys.
- **A7** No schema, component, route, or URL-contract change; no
  change to `updatedAt` consumption in `buildJsonLd.ts` or any OG
  meta call site.

## Open questions

None.

## Chunks

Measure: 7 open · 0 closed · next A8

Not chunked yet.
