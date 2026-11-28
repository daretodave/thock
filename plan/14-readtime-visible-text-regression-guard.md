# 14 — Read-time visible-text regression guard

> A mechanical check that cross-references `mdxComponents`
> (`packages/content/src/mdx/components.tsx`) against
> `computeReadTime()`'s visible-text allowlist
> (`packages/content/src/util/readTime.ts`), so a future MDX
> component (or a new prop on an existing one) that renders
> reader-visible text through a JSX attribute or a data lookup
> — rather than through tag children, which `computeReadTime`
> already counts correctly — cannot silently reintroduce the
> undercount defect five independent fixes just closed.

## Why

Five reactive fixes landed in one window, same root cause each
time: `computeReadTime()` (`packages/content/src/util/readTime.ts`)
counts words in the raw MDX string after stripping component tags,
but several `mdxComponents` entries render visible reader-facing
text through a channel the raw-string strip can't see — a JSX
*attribute* value (stripped along with the tag before the fix) or
a value *synthesized at render time* from a `@thock/data` lookup
(never present in the raw MDX string at all).

- `dc4eb368` — read time undercounted articles with
  `<InlineViz>`/`<KeyboardImage>` `caption`/`alt` text.
- `7a3f5e85` — undercounted `<Callout>` `title` text.
- `35c0c2a2` — undercounted `<PullQuote>` `attribution` text.
- `8bf441a0` — the inverse defect: over-counted raw markdown
  table-separator syntax (`|---|---|`) as words.
- `d2d2720f` — undercounted `<PartReference>`-rendered part
  names, the hardest instance: the visible text isn't in the raw
  MDX body at all, only synthesized at render time from a
  `@thock/data` lookup (`resolveMentionedPartNames()` in
  `packages/content/src/loaders/articles.ts`), passed in via
  `computeReadTime`'s second `extraVisibleText` parameter.

Candidate `[score 6.0]` (proposed 2026-08-15, expand pass 322,
103 days old), auto-promoted (aged) `/expand` Step 4b.

A dedicated audit sweep (pass 322) re-verified every entry in
`mdxComponents` (`PullQuote`, `Callout`, `Caption`, `Source`,
`PartReference`, `KeyboardImage`, `InlineViz`, plus the GFM table
cell components) against `readTime.ts`'s current attribute regex
(`caption|title|attribution`) and the `extraVisibleText` param —
confirmed all seven are now covered, zero live undercounts in the
current corpus. The bug class itself is closed. What's missing is
a **regression guard**: `mdxComponents` is a plain object literal
with no structural link to `readTime.ts`'s attribute allowlist, so
an eighth component (or an eighth prop on an existing one) can
reintroduce the identical defect with no test catching it until
the next reactive `/iterate` sweep happens to hand-count an
affected article.

## Design

A render-based integration test (compile an article's MDX body
and diff the rendered DOM's visible word count against
`computeReadTime()`'s result) was the candidate's first-choice
design, but `packages/content` renders MDX through
`next-mdx-remote`'s RSC path — there is no existing precedent in
this repo for compiling and rendering a full MDX document outside
the Next.js app runtime inside a Vitest test (the two existing
`mdxComponents`-rendering tests,
`packages/content/src/__tests__/mdx/table.test.tsx` and
`spacing.test.tsx`, render one component in isolation via
`@testing-library/react`, never a compiled MDX *document*). Building
that harness from scratch is exactly the "3+ chunks, unclear scope"
shape `/expand`'s own scoring rubric scores down — so this spec
takes the candidate's own documented fallback instead, which is
cheaper, certain to work with the existing test tooling, and
mirrors three already-shipped checks of the same shape
(`truncation-call-site-check.mjs`'s receiver-name heuristic,
`heading-semantics-coverage-check.mjs`'s curated-file + prop-name
scan, `itemlist-jsonld-parity-check.mjs`'s curated per-route
mapping):

- **`scripts/readtime-attribute-coverage-check.mjs`** — a static
  cross-reference, not a render:
  - A curated allowlist, one entry per `mdxComponents` key, each
    recording which of that component's props (if any) render
    visible reader-facing text through a channel other than plain
    tag children: `PullQuote.attribution`, `Callout.title`,
    `InlineViz.caption`, `KeyboardImage.caption`/`alt`,
    `PartReference` (flagged `extraVisibleText`-resolved, not an
    attribute — the id-lookup shape), and `Caption`/`Source`/`Mono`/
    the table-cell components/`h2`/`h3`/`a` recorded as
    children-only (nothing to allowlist).
  - Parse `packages/content/src/mdx/components.tsx`'s
    `mdxComponents` object literal to get the live key list (a
    small regex/string scan over the object literal, mirroring
    `truncation-call-site-check.mjs`'s style — not a full TSX
    parser).
  - For each key: (a) flag a **new key** not in the curated
    allowlist at all — an unreviewed component just joined the
    map; (b) for a key already in the allowlist with a
    channel-flagged prop, read that component's own prop
    type/interface (`packages/content/src/mdx/<Name>.tsx`) and
    flag any **string-typed prop not already in the allowlist's
    recorded set for that component** — a new prop joined an
    already-reviewed component.
  - Separately, read `readTime.ts`'s attribute regex
    (`/\b(?:caption|title|attribution)="([^"]*)"/g`) and flag a
    **mismatch** if the allowlist's attribute-channel prop names
    (`attribution`, `title`, `caption`) aren't a subset of that
    regex's alternation — catching the regex itself drifting out
    of sync with the allowlist, not just the component side.
  - Gate mode (default, called from `pnpm verify`): exit 1 with
    every flagged key/prop/mismatch if any hit, printing a one-line
    fix hint ("add `<Name>.<prop>` to the curated allowlist in
    `readtime-attribute-coverage-check.mjs`, then confirm
    `readTime.ts`'s regex or `extraVisibleText` wiring actually
    counts it").
  - `--write`: append a `content`-category `plan/AUDIT.md` row per
    hit, deduplicated against existing pending rows, same contract
    as the other mechanical surveys.
  - `--json`: `{ flagged: [...] }` for programmatic use.
- **Unit tests**
  (`scripts/__tests__/readtime-attribute-coverage-check.test.mjs`,
  mirroring `scripts/__tests__/heading-semantics-coverage-check.test.mjs`):
  - A fixture `mdxComponents`-shaped object + matching allowlist
    with no drift → clean.
  - A fixture adding a key not in the allowlist → flagged as an
    unreviewed component.
  - A fixture component file adding a new string prop not recorded
    for that key → flagged as an unreviewed prop.
  - A fixture `readTime.ts`-shaped attribute regex missing one of
    the allowlist's recorded attribute names → flagged as a
    regex/allowlist mismatch.
  - Run via the existing `pnpm test:scripts` leg.
- **Wiring**: add the gate invocation to `pnpm verify` as a new
  script-check leg — per-commit, not survey-chain-only, since (per
  the Why section) the defect is introduced the moment a new MDX
  component or prop is authored, the same "the loop itself can
  reintroduce this" reasoning spec 12 and spec 13 used for their
  own per-commit placement. No `--write` survey-chain wiring is
  needed beyond the one-time current-corpus pass this chunk's own
  acceptance check runs — there's no existing-corpus backlog to
  drain, since pass 322's audit already confirmed today's seven
  `mdxComponents` entries are clean.

### Decisions made upfront (do not ask)

- **Curated allowlist, not a generic string-prop scan.** Most
  string props genuinely aren't visible text (`PartReference.id`,
  `InlineViz.src`/`accent`, `Source.href`) — a bare "flag every
  string prop" heuristic would be mostly noise. The curated
  allowlist records, per component, which props are already known
  to render visible text and through which channel (attribute vs.
  `extraVisibleText`), so the check only has to notice *drift from
  that known-good baseline*, not re-derive "is this prop visible
  text" from scratch every run — the same one-time-authoring-cost
  tradeoff `og-coverage-check.mjs`,
  `heading-semantics-coverage-check.mjs`, and
  `itemlist-jsonld-parity-check.mjs` already accepted for their own
  curated mappings.
- **Static cross-reference, not a render-based integration test.**
  See the Design section above — no existing harness in this repo
  compiles a full MDX document for a non-RSC Vitest render, and
  building one is out of scope for a single guard chunk. If a
  future `/expand` pass or `/oversight` call decides the static
  check's false-negative risk (a prop that *is* already in the
  allowlist's recorded set, but whose visible-text-ness changes
  without a prop-name change) is worth closing, that's a separate,
  explicitly-scoped follow-up — not silently folded into this
  chunk.
- **No change to `readTime.ts` or any `mdxComponents` file.**
  Detection only. Any future flagged hit gets fixed (allowlist
  updated, `readTime.ts` regex widened, or `extraVisibleText`
  wiring extended) in a follow-up `/iterate` tick, not inline here.

## Acceptance

- **A1** `scripts/readtime-attribute-coverage-check.mjs` exists,
  mirrors the `og-coverage-check.mjs` shape (gate / `--write` /
  `--json`), with a curated allowlist covering all 7 current
  `mdxComponents` entries' visible-text channels (or explicit
  "children-only, nothing to allowlist" entries for the rest).
- **A2** Gate mode flags a fixture `mdxComponents` key not present
  in the curated allowlist.
- **A3** Gate mode flags a fixture component whose prop
  type/interface declares a string prop not recorded in the
  allowlist for that key.
- **A4** Gate mode flags a fixture `readTime.ts`-shaped attribute
  regex that's missing one of the allowlist's recorded attribute
  names.
- **A5** `--write` appends a `content`-category `plan/AUDIT.md` row
  per hit, deduplicated against existing pending rows.
- **A6** `scripts/__tests__/readtime-attribute-coverage-check.test.mjs`
  exercises A2–A4's fixture cases, run via `pnpm test:scripts`.
- **A7** The gate invocation is wired into `pnpm verify` as a new
  script-check leg.
- **A8** Running the gate against the current corpus (the live
  `packages/content/src/mdx/components.tsx` +
  `packages/content/src/util/readTime.ts`) exits 0 — no regression
  on the already-fixed seven components.
- **A9** No schema, component, or URL-contract change; no change to
  `readTime.ts`'s public signature or any `mdxComponents` entry.

## Open questions

None.

## Chunks

Measure: 9 open · 0 closed · next A10

- [ ] **14.1** `scripts/readtime-attribute-coverage-check.mjs` scanner (gate / `--write` / `--json`) · M · closes A1, A2, A3, A4, A5, A9 · needs —
  - New script mirroring `og-coverage-check.mjs`'s shape (gate /
    `--write` / `--json` modes, `plan/AUDIT.md` row filing with
    dedup, same CLI/exit-code contract).
  - A curated allowlist, one entry per `mdxComponents` key
    (`packages/content/src/mdx/components.tsx`): `PullQuote`
    (`attribution`, attribute channel), `Callout` (`title`,
    attribute channel), `InlineViz` (`caption`, attribute
    channel), `KeyboardImage` (`caption`, `alt`, attribute
    channel), `PartReference` (flagged `extraVisibleText`-resolved,
    not an attribute), `Caption`/`Source`/`Mono`/`h2`/`h3`/`a`/the
    six GFM table-cell components (`table`, `thead`, `tbody`,
    `tr`, `th`, `td`) recorded as children-only — nothing to
    allowlist.
  - Parse `mdxComponents`' object-literal key list out of
    `components.tsx` with a small regex/string scan (mirroring
    `truncation-call-site-check.mjs`'s receiver-name heuristic —
    no full TSX parser).
  - For each live key: flag a key missing from the curated
    allowlist entirely (an unreviewed component joined the map);
    for a key already in the allowlist with an attribute-channel
    or `extraVisibleText`-channel prop, read that component's own
    prop type/interface in `packages/content/src/mdx/<Name>.tsx`
    and flag any string-typed prop not already recorded in the
    allowlist's set for that component.
  - Read `readTime.ts`'s attribute regex
    (`/\b(?:caption|title|attribution)="([^"]*)"/g`) and flag a
    mismatch if the allowlist's attribute-channel prop names
    aren't a subset of that regex's alternation.
  - Gate mode (no args): exit 1 printing every flagged
    key/prop/mismatch with a one-line fix hint, exit 0 otherwise.
  - `--write`: append one `content` `plan/AUDIT.md` row per hit,
    deduplicated against existing pending rows, same contract as
    `og-coverage-check.mjs --write`.
  - `--json`: `{ flagged: [...] }`.
  - No change to `readTime.ts`, any `mdxComponents` entry, or any
    other shipped file — detection only (A9).
- [ ] **14.2** Unit tests + live-corpus regression gate · S · closes A6, A8 · needs 14.1
  - `scripts/__tests__/readtime-attribute-coverage-check.test.mjs`
    (mirroring `scripts/__tests__/heading-semantics-coverage-check.test.mjs`):
    a fixture `mdxComponents`-shaped map + matching allowlist with
    no drift (clean); a fixture adding a key not in the allowlist
    (flagged as unreviewed component); a fixture component file
    adding a new string prop not recorded for that key (flagged as
    unreviewed prop); a fixture `readTime.ts`-shaped attribute
    regex missing one of the allowlist's recorded attribute names
    (flagged as regex/allowlist mismatch).
  - A further test with no fixture: runs gate mode against the
    real `packages/content/src/mdx/components.tsx` +
    `packages/content/src/util/readTime.ts` and asserts exit 0
    today (A8) — covers all 7 current `mdxComponents` entries,
    confirmed clean by pass 322's audit, and makes any future
    regression fail `test:scripts`.
  - Runs via the existing `pnpm test:scripts` leg.
- [ ] **14.3** Wire the gate into `pnpm verify` · S · closes A7 · needs 14.1, 14.2
  - Add the gate invocation (`node
    scripts/readtime-attribute-coverage-check.mjs`) as a new
    script-check leg in `pnpm verify`'s chain, per-commit (not
    survey-chain-only) — the same placement spec 12 and spec 13
    used for their own per-commit checks, since the defect is
    introduced the moment a new MDX component or prop is authored.
  - No `--write` survey-chain or digest wiring — pass 322's audit
    already confirmed the current corpus is clean, so there's no
    existing backlog to drain beyond this chunk's own A8 pass.
