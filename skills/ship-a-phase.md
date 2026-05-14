# Skill: ship-a-phase

> **Full autonomy, get-it-done-at-all-costs persona.** When invoked
> (manually, via `/ship-a-phase`, or under `/loop` / `/march`), you
> have authority to ship one phase of the build plan end-to-end
> with **no review checkpoint**: build, write tests, run the verify
> gate, commit, push. The user reads the diff after — not before.
> The loop fires you again on the next phase until they're all
> shipped.
>
> **The bar for asking is high.** If you would have asked, decide
> instead and document the call in the commit body. Stop only on
> the hard blockers in §10 below.

## 1. Purpose

`plan/steps/01_build_plan.md` carves thock into ~17 phases —
substrate (1–4), page families (5–13), cross-cutting (14–17). Each
phase is one self-contained slice that ships end-to-end: code +
unit tests + e2e + commit + push (Netlify auto-deploys).

This skill drives the build **autonomously, in a loop**, so a
single overnight run can move the site forward by several phases.

## 2. Invocation

```
/ship-a-phase                       # next [ ] phase
/ship-a-phase phase 8               # specific phase by number
/ship-a-phase phase 8 dry-run       # plan + emit brief, no code commit
/loop 30m /ship-a-phase             # autonomous, every 30 min
/loop /ship-a-phase                 # autonomous, self-paced
/march                              # outer dispatcher (preferred)
/loop /march                        # the autonomous-beast endgame
```

When invoked from `/loop` or `/march`, **do not pause for review**.
After commit + push, return cleanly.

## 3. Autonomy contract (the philosophy)

The user's standing instruction: **"more get-it-done, less ask me
questions."** Internalize this:

- **Design ambiguity → decide.** Pick the choice most consistent
  with the design exports in `design/<family>/` and the
  already-shipped sibling. Document the call in the commit body
  under "Decisions". Never block on it.
- **`design/<family>/` not yet present → ship from
  `plan/bearings.md` + spec + sibling.** The user emits design
  exports asynchronously. Don't wait. When the design lands, the
  next phase that touches that surface integrates it.
- **Empty / missing content → render the empty state and ship.**
- **Missing brief → generate one** per `skills/plan-a-phase.md`
  §4 (the format is shared). Commit the brief separately, then
  proceed. Don't ask the user to write it.
- **Verify failure → read the log + patch.** Iterate up to 3 times
  on the same root cause. Treat it like a local engineering bug.
- **External research needed → spawn `scout`.** Don't research the
  open web from the main agent; that pollutes context with citations
  and source pages.
- **New article needed → spawn `content-curator`.** Don't write
  prose from the main agent; the curator is the editorial voice.
- **Schema-heavy data work → spawn `data-steward`.** Or use
  `/ship-data` flow inline.

The only things that warrant stopping are in §10.

## 4. Delegation (be bold)

Spawn sub-agents aggressively. They protect the main-agent context
window and parallelize independent work.

- **`scout`** — every external research need.
- **`content-curator`** — drafting MDX articles, polishing existing
  prose. Use it whenever a phase or audit requires copy that's
  longer than a hero lede.
- **`data-steward`** — schema additions, mass cross-ref repair.
- **Parallel calls** when work is independent. Example: a phase
  needs 3 new switch records sourced from manufacturer pages —
  spawn 3 scouts in one message, merge their returns into 3
  ship-data commits.

The main agent's job is wiring, code, and decisions. Delegate
prose and research.

## 5. The page-family shape (canonical structure)

Every page-family phase (5–13) ships **all** of these. Mirror
`apps/web/src/app/article/` (the canonical template, shipped in
phase 5):

```
apps/web/src/app/<route-segment>/
├── page.tsx                         # the canonical page
├── [slug]/page.tsx                  # detail page if applicable
├── loading.tsx                      # Suspense boundary
├── not-found.tsx                    # 404 for missing entities
└── opengraph-image.tsx              # per-route OG image

apps/web/src/components/<family>/
├── <Family>Hero.tsx
├── <Family>Body.tsx
├── <OtherSection>.tsx
└── __tests__/
    ├── <Family>Hero.test.tsx
    └── <OtherSection>.test.tsx

apps/web/src/lib/<family>/           # only if app-specific helpers
├── seo.ts                           # buildMetadata + JSON-LD per the URL contract
└── __tests__/seo.test.ts

apps/e2e/tests/<family>.spec.ts      # canonical render + cross-link checks
apps/e2e/tests/mobile/<family>.mobile.spec.ts  # 375px viewport
```

Page-family logic generally lives in `apps/web/`. Reusable atoms
go in `packages/ui/`. Content lookups go through `@thock/content`.
Data lookups go through `@thock/data`. SEO helpers come from
`@thock/seo`.

### Already-built primitives (don't re-derive after phases 1–3)

These ship in the substrate phases:

- **Layout (phase 1):** `<RootLayout>`, `<Header>`, `<Footer>`,
  `<Container>`, `<Stack>`, `<Wordmark>`, `<Mono>` — in
  `packages/ui/`.
- **Editorial atoms (phase 5+):** `<ArticleCard>` (variants:
  hero / large / row / compact), `<TagChip>`, `<PullQuote>`,
  `<Callout>`, `<Caption>`, `<Byline>`, `<ReadTime>`.
- **Trends primitives (phase 8):** `<Sparkline>`,
  `<TrendDirectionGlyph>`.
- **Parts/group buys (phase 13):** `<PartReference>`,
  `<GroupBuyCard>`.
- **Content loaders (phase 3):** `getAllArticles`,
  `getArticleBySlug`, `getArticlesByPillar`, `getArticlesByTag`,
  `getAllTags`, `getActiveGroupBuys`, `getRelatedArticles` from
  `@thock/content`.
- **Data loaders (phase 2):** `getAllSwitches`, `getSwitchBySlug`,
  etc. from `@thock/data`.
- **Design tokens (phase 1):** `@thock/tokens` provides
  `tokens.css` + a TS export for runtime token access.
- **SEO helpers (phase 4):** `buildMetadata`, `buildJsonLd`,
  `canonicalUrl`, `siteConfig` from `@thock/seo`.

If a primitive doesn't exist yet, build it inside `packages/ui/`
(if generic) or `apps/web/src/components/<family>/` (if
family-specific). Tests colocated under `__tests__/`.

### CSS / styling

Tailwind utility classes for one-off layout. Reusable patterns
(≥3 uses) become a class in
`apps/web/src/styles/components.css`. Dark mode is the default;
light mode is a class toggle (`html.light`). Never inline
arbitrary breakpoints — use Tailwind's `sm:` / `md:` / `lg:`.

## 6. The procedure

### Step 0 — Re-sync state

```bash
git pull --ff-only
```

If `git pull` fails (diverged), stop per §10. If no remote is
configured (very early phases), skip and use local commits.

### Step 1 — Pick the phase

Read the "Status (at-a-glance)" block at the top of
`plan/steps/01_build_plan.md`.

The next phase is the **first `[ ]` row**. If the user passed
`phase N`, ship that one regardless of order.

### Step 2 — Read the brief

`plan/phases/phase_<N>_<topic>.md`. If missing, follow
`skills/plan-a-phase.md` §5 to generate it (commit the brief
separately first, then proceed).

### Step 2.5 — Mirror the phase to GitHub

Open (or reuse, or reopen) the phase mirror issue. The thock
repo's Issues tab gets a public artifact for this phase the
moment work begins; the same artifact closes when the shipping
commit lands. The helper is **idempotent** — find-or-create-or-reopen
keyed on the title prefix `Phase <N> — `, so re-runs of the same
phase (or rapid-fire ticks) reuse the same number instead of
spamming duplicates.

```bash
# 1. Build the body file from the brief's Outcome / Why section.
#    Keep it user-readable: 1–2 lines goal summary, then a link
#    back to the phase brief in this repo.
cat > /tmp/phase-issue-body.md <<EOF
**Goal:** <one-line outcome from the brief's "Outcome" section>

<2–4 line summary of what shipping this phase delivers>

**Brief:** [\`plan/phases/phase_<N>_<topic>.md\`](https://github.com/daretodave/thock/blob/main/plan/phases/phase_<N>_<topic>.md)

---
_Tracked by the autonomous loop. The phase commit will close this issue via a \`Closes #<this-issue>\` trailer; deploy URL is posted as a follow-up comment._
EOF

# 2. Open / reuse / reopen.
PHASE_ISSUE=$(node scripts/loop-issue.mjs phase-open \
    --phase "<N>" \
    --title "Phase <N> — <topic>" \
    --body-file /tmp/phase-issue-body.md)
echo "phase mirror: #$PHASE_ISSUE"
```

`<N>` here is the phase identifier as it appears on the
`01_build_plan.md` row (e.g. `15a`, not `15`). The title format
**must** be `Phase <N> — <topic>` — the helper rejects mismatched
titles to keep prefix-match reuse working.

On **any failure** of `loop-issue.mjs phase-open` (auth, rate
limit, network, repo unreachable):

- Print stderr to the run log.
- Continue with the build. The mirror is best-effort, not gating
  (Hard rule §7.11).
- The next ship-a-phase tick on the same phase will retry.

If the open succeeded, capture `$PHASE_ISSUE` for use in Step 10
(commit trailer) and Step 12 (close-comment).

### Step 3 — Read the design + the canonical sibling

The design lives as flat files in `design/`. Read `design/INDEX.md`
to map family → file. Authoritative reads:

```bash
# Always read these for any phase touching a designed surface
cat design/INDEX.md                       # file → family map
cat design/decisions.jsx                  # SETTLED / PUSHED-BACK / OPEN-Qs
cat design/tokens.css                     # palette / type / spacing

# Family-specific reference (per INDEX.md mapping)
cat design/page-<family>.jsx              # e.g. page-article.jsx
cat design/atoms.jsx                      # if family uses editorial atoms
cat design/primitives.jsx                 # if family uses chart primitives

# Canonical sibling — phase 5's article is the structural template
ls Z:/keyboard/apps/web/src/app/article/
ls Z:/keyboard/apps/web/src/components/article/
```

If `design/page-<family>.jsx` is **0 bytes** (claude design hadn't
reached it), proceed using the brief + canonical sibling +
`design/atoms.jsx` + `design/decisions.jsx`. Note in commit-body
Decisions: "`design/page-<family>.jsx` empty — implementation will
be revisited after re-export."

**Conflict resolution:** if `design/decisions.jsx` and
`plan/bearings.md` disagree, the design wins. Bearings was authored
before the design landed; the design file was authored *with* the
bearings as input and can override.

### Step 4 — Build

Mirror the article-page structure into the new family. Content
reads via `@thock/content`; data reads via `@thock/data`; never
reach into the filesystem directly from a component.

For each new content read pattern, add a helper to
`packages/content/src/`. For each new data read pattern, add a
helper to `packages/data/src/`. Both with colocated tests.

### Step 5 — Wire the routes

Next.js App Router auto-discovers routes under
`apps/web/src/app/`. Just create the folder + `page.tsx`. Update
`apps/web/src/app/sitemap.ts` to enumerate the new routes.

### Step 6 — SEO

Use `@thock/seo`:
- `generateMetadata({ params })` — title / description / canonical
  / OG.
- `buildJsonLd(...)` — JSON-LD per the type chosen in the brief.

Per-route OG via `opengraph-image.tsx` colocated with the page.

### Step 7 — Tests

- **Unit:** colocated `__tests__/`. Mock `@thock/content` /
  `@thock/data` at the module boundary
  (`vi.mock('@thock/content')`).
- **E2E:** `apps/e2e/tests/<family>.spec.ts` — render H1 + canonical
  + at least one cross-link + the global footer.
- **Mobile:** `apps/e2e/tests/mobile/<family>.mobile.spec.ts` at
  375px viewport — assert
  `documentElement.scrollWidth - innerWidth ≤ 1`, H1 within
  viewport, sections stack.

### Step 8 — Cross-link retrofit

When this page family ships, retro-fit incoming links from
already-shipped families:

| Shipping | Retro-fit |
|---|---|
| article (phase 5) | (canonical — others link to it) |
| home (phase 6) | already has hero pick + trending; verify |
| pillar pages (7–11) | header nav adds the new pillar item |
| tag pages (phase 12) | every `<TagChip>` becomes clickable; verify |
| group buys (phase 13) | home widget reads from same loader |
| search (phase 14) | header search icon wires up |

Keep retro-fits **scoped** — modify the chip / nav / new section,
not whole pages. One retro-fit commit per family is fine.

### Step 9 — Verify

```bash
pnpm verify
```

Runs: `typecheck && test:run && data:validate && build && e2e`.
Iterate up to 3 times on the same root cause. If still failing,
stop per §10.

### Step 10 — Commit + push

Stage explicitly. Conventional subject; body in 4–8 bullets
describing **what shipped + what the user can now do**. Add a
"Decisions" section listing the design calls you made
autonomously.

**If Step 2.5 captured a phase issue number** (`$PHASE_ISSUE`),
add a `Closes #<N>` trailer to the commit body. GitHub auto-closes
the phase mirror when the commit pushes to main; that's the
canonical ship signal on the public timeline.

```bash
git add <explicit files>
git commit -m "$(cat <<'EOF'
feat: <family> page family — phase <N>

- /<path>, /<path>/[slug], + N sub-pages.
- Reads from <@thock/content / @thock/data helpers>.
- Cross-links: <in/out summary>.

Decisions:
- <design call 1 — picked X over Y because <reason>>
- <design call 2>

Closes #<phase-issue-number>
EOF
)"
git push origin main
```

**No `Co-Authored-By:` trailer. No emojis.**

Push triggers a Netlify deploy. **A red main = a red site.** If
verify passed locally and Netlify still fails, fetch the deploy log
and treat it like a verify failure (read, patch, push).

### Step 11 — Tick the DoD

Flip the shipped `[ ]` to `[x]` in the "Status (at-a-glance)"
block of `plan/steps/01_build_plan.md` and add the commit hash to
the "Phase log" section. Commit:

```bash
git add plan/steps/01_build_plan.md
git commit -m "plan: phase <N> shipped — <one-line>"
git push origin main
```

If you generated a brief in step 2, that's a separate prior commit
(subject `phases: brief for phase <N>`).

### Step 12 — Confirm deploy

Print `"Checking last deployment..."` and run the deploy gate:

```bash
pnpm deploy:check
```

Outcomes:

- **Exit 0 (ready)** — site is green at the pushed commit.
  Continue to Step 13.
- **Exit 1 (error)** — read the printed log + admin URL. Patch
  the root cause. Re-run from Step 9 (verify) onward. Up to 3
  iterations on the same root cause; otherwise stop per §10.
- **Exit 2 (timeout)** — Netlify is slow but not failed. Surface
  the timeout to the user (or the loop's tick log) and continue;
  the next tick will re-check.
- **Exit 3 (config)** — `VERCEL_TOKEN` is missing or the project
  is unreachable. Stop per §10 and report.

Until phase 1 ships, this gate **will** fail (Netlify can't build
an empty workspace). Phase 1's commits will trip this and patch
their way to the first green deploy. From phase 2 onward, a red
deploy is a real regression.

### Step 12.5 — Phase mirror close-comment

If Step 2.5 captured `$PHASE_ISSUE` and Step 12 was green:

```bash
node scripts/loop-issue.mjs phase-close \
  --phase "<N>" \
  --commit "<commit-sha>" \
  --deploy-url https://thock.xyz
```

The `Closes #<N>` trailer in Step 10's commit already auto-closed
the issue on push; this comment confirms the deploy URL on the
public timeline. Failures here are warnings, not blockers.

### Step 13 — Done

Return cleanly. The loop's next tick picks up the next phase. If
you ran outside the loop, summarize what shipped + what's next in
2–3 lines.

## 7. Hard rules

These are dictated by the user; do not relax:

1. **No `Co-Authored-By:` in commits.** Plain message bodies.
2. **No emojis** anywhere in code, content, or commit messages.
3. **No `--no-verify`, no force-push, no destructive resets.**
4. **Don't drag in stray working-tree changes.** `git status
   --short` first; stage explicitly.
5. **Don't restart the user's dev servers.** They keep `pnpm dev`
   up on `:3000`; the e2e harness runs on a separate port.
6. **Tests alongside code — never "add tests later".** Unit + e2e
   ship in the same commit as the code they cover.
7. **Small, focused components in folders.** Prefer 5 small files
   with clear names over 1 dense file.
8. **Content stays in MDX.** No hardcoded article copy in
   components. Even seed content goes through
   `apps/web/src/content/articles/*.mdx`.
9. **Data stays in `/data/`.** No hardcoded data records in
   components. Loaders read JSON.
10. **Site name is lowercase "thock"** in copy and code. Always.
11. **Phase issue mirror is best-effort, not gating.** If
    `loop-issue.mjs phase-open` fails, the phase still ships; log
    the stderr and continue. The mirror is a public timeline, not
    a verification step. Do not block phase delivery on GitHub
    issue API hiccups.

## 8. Cross-link retrofit policy

When shipping family X, retro-fit links from already-shipped
families to X. The retro-fit is part of the *same* phase commit —
one commit ships the new family + the incoming links. Keep edits
scoped:

- Header nav adds an item.
- A new chip / rail under existing page bottom sections.
- Verify existing `<TagChip>` / `<ArticleCard>` already routes
  correctly.

Do **not**: rewrite an already-shipped page's structure to make
room for the new family. If accommodation needs structural change,
that's a follow-up commit, not a retro-fit.

## 9. Brief generation (when missing)

If `plan/phases/phase_<N>_<topic>.md` doesn't exist, follow
`skills/plan-a-phase.md` §5. The brief format is shared; the
generation procedure is owned there. Generated briefs are committed
separately from the code that follows.

## 10. Failure modes — when to actually stop

These are the only conditions that warrant stopping the loop and
asking the user. Everything else: decide, ship, document.

1. **`pnpm verify` fails ≥3 times on the same root cause.** Cite
   the check that failed (typecheck / unit / data:validate / build
   / e2e), the suspected root cause, and what you'd try next.
2. **`pnpm deploy:check` fails ≥3 times on the same root cause
   after `pnpm verify` passes locally.** This means Netlify and
   local diverge — fetch the deploy log, cite it, and stop.
3. **`VERCEL_TOKEN` is missing or rejected** (deploy:check
   exit 3). Stop and ask the user to populate `.env`.
4. **A required dependency would require a paid service or other
   API key.** Stop and report which env var is missing.
5. **A `git pull` produces a divergence.** Don't `--rebase` blind;
   stop and report.
6. **The design export and the URL contract conflict** in a way
   you can't reconcile by trusting the URL contract.
7. **Phase scope is genuinely ambiguous after reading step 01 +
   the brief + bearings + spec.md.** Rare — usually a sign the
   brief is underspecified; generate a more decisive one and
   proceed. If even that fails, stop.

For everything else — design ambiguity, empty content, missing
brief, component that doesn't exist, copy that's not in the brief
— **decide and ship**. Document the call. Move on.

## 11. Quick reference

```bash
# Where you read
plan/steps/01_build_plan.md                 # status block + scope
plan/phases/phase_<N>_<topic>.md            # brief
plan/bearings.md                            # stack + conventions
design/INDEX.md                             # design file → family map
design/decisions.jsx                        # design's own brief (wins on conflicts)
design/tokens.css                           # palette / type / spacing
design/page-<family>.jsx                    # family-specific design (may be empty)
design/atoms.jsx, design/primitives.jsx     # component-level reference
spec.md                                     # product spec
apps/web/src/app/article/                   # canonical page-family template

# Where you write
apps/web/src/app/<family>/                  # routes
apps/web/src/components/<family>/           # components
apps/web/src/lib/<family>/                  # app-only helpers
apps/web/src/content/articles/<slug>.mdx    # via content-curator
packages/<pkg>/src/                         # shared logic
data/<entity>/<slug>.json                   # via /ship-data flow
apps/e2e/tests/<family>.spec.ts             # e2e
plan/steps/01_build_plan.md                 # tick boxes

# Sub-agents
Agent({ subagent_type: "scout", prompt: "..." })
Agent({ subagent_type: "content-curator", prompt: "..." })
Agent({ subagent_type: "data-steward", prompt: "..." })

# Verify + commit + push
pnpm verify
git add <explicit files>
git commit -m "<subject>"
git push origin main
```
