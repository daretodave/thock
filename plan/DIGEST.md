# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A fully clean ~23.9h window — 19 `march` runs, 19/19 success,
15 substantive ticks and 4 pure no-ops, for 28 commits total.**
Since the last digest (`7e56f258`, 2026-08-03T11:56:46 UTC) the loop
drained 13 `plan/AUDIT.md` findings: a six-strong stale-claim/link-rot
cluster (newsletter copy no longer claims a weekly cadence it doesn't
keep; gmk-cyl-ta-neo-production-tracking's dateline corrected to
postdate its own citation, then its dead `oblotzky.co` citation link
repointed to the live `oblotzky.industries` domain; gmk-cyl-og-
extensions-interest-check's lede synced to its own Update callout,
then the callout itself extended with the current W32 tracker read;
four articles' stale `updatedAt` frontmatter bumped to their real
last-edit dates); a three-commit MobileNav keyboard focus-trap saga
(Tab containment fixed, then its own Shift+Tab over-trap regression
caught and fixed same-day, then real-browser Playwright coverage
added so a fourth iteration doesn't repeat the pattern); two seo gaps
(`/sources` JSON-LD gains an `ItemList` node; tag/part OG not-found
fallback no longer drops retired brand colors); a content
`mentionedParts` gap (60-percent-layout-history was missing Drop Holy
Panda X, the same defect class the phase-38 gate exists to catch);
and one process fix closing that exact gap's root cause — `iterate`'s
cross-link drain now runs the `article-parts-check.mjs` gate before
committing, so newly-inserted prose links can't silently skip
frontmatter registration again. `/expand` ran 2 passes (281-282):
281 filed 1 new candidate (`[5.5]` overlay/drawer keyboard-trap
coverage check — proposed the same day as, and directly generalizing,
the MobileNav saga above); 282 returned zero. This tick's own fresh
`pnpm verify` is green across all eight legs, run as sequential
foreground blocking calls: typecheck (9 packages), lint (all
lintable workspaces), 1140 unit tests site-wide (774 web / 105
files, up from 772; 155 content / 24 files; 3 tokens + 42 seo + 129
data + 31 ui + 6 e2e-fixtures, all unchanged), 175 script tests / 64
suites (unchanged), 76 data records / cross-refs resolve (unchanged:
10 vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 14
trend weeks; 76 articles, unchanged), build — all canonical routes
generated, homepage bundle 108.7 KB / 200 KB (unchanged), and
1118/1118 e2e (up from 1116/1116, +2 from the new MobileNav
real-keyboard tests). Deploy is `READY` at HEAD (`7b7c2571`,
`dpl_14DRTS1Z`).

`plan/CRITIQUE.md` is now **86 days / 1972 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner), and every commit this window again carries
the `Cloud-Run:` trailer, so the gap keeps growing by construction
until a human decision lands. `plan/PHASE_CANDIDATES.md` holds **22
pending rows + 1 needs-user-call** (up from 21+1 — pass 281's new
candidate), now **51 days** since the last promotion (2026-06-14,
phases 46-49). `plan/AUDIT.md` carries **4** open rows, all
`/oversight`-gated or blocked, not actionable by an autonomous tick —
unchanged from yesterday: the march.yml `[6.3]` crash-gate row, the
Lighthouse-CI `[4.0]` row, the soft-404 `[needs-user-call]` `[4.2]`
row, and the heartbeat.yml `[4.0]` row. No transient failures this
window — the fifth consecutive fully clean run.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-03 13:03 | iterate | content — newsletter copy no longer claims a weekly cadence it doesn't keep `[5.4]` (`a761274d`/`e06fb5de`) |
| 08-03 15:01 | march | no-op — nothing additionally actionable this tick |
| 08-03 16:49 | iterate | seo — `/sources` JSON-LD gains `ItemList` node `[3.6]` (`fa6c44da`/`442d4ed8`) |
| 08-03 17:34 | iterate | content — gmk-cyl-ta-neo-production-tracking dateline corrected to postdate its own W32 citation `[4.5]` (`e839224f`/`ee23224d`) |
| 08-03 18:35 | march | no-op — nothing additionally actionable this tick |
| 08-03 19:31 | iterate | seo — tag/part OG not-found fallback drops retired brand colors `[3.6]` (`220c2985`/`92f7dd00`) |
| 08-03 20:31 | iterate | a11y — MobileNav drawer traps Tab focus instead of leaking behind the overlay `[3.4]` (`6ef381e3`/`88ce1c03`) |
| 08-03 21:24 | iterate | content — gmk-cyl-og-extensions-interest-check lede synced to its own Update `[5.6]` (`d3657f6e`/`1b55ba2b`) |
| 08-03 22:22 | iterate | seo — sync 4 articles' stale `updatedAt` frontmatter `[4.8]` (`d2d275d2`/`9c0394f3`) |
| 08-03 23:23 | march | no-op — nothing additionally actionable this tick |
| 08-04 00:32 | iterate | a11y — MobileNav no longer traps Shift+Tab from the toggle button (fixes the prior tick's own over-trap regression) `[5.4]` (`1cfc52d4`/`68deb8f4`) |
| 08-04 01:35 | iterate | test — MobileNav real-keyboard Tab/Shift+Tab e2e coverage `[4.8]` (`998aae2f`/`82b3b087`) |
| 08-04 03:04 | expand | pass 281 — 1 candidate filed (`[5.5]` overlay/drawer keyboard-trap coverage check) (`37e1b462`) |
| 08-04 05:03 | iterate | content — 60-percent-layout-history mentionedParts gap for Drop Holy Panda X `[4.5]` (`d8d427a6`/`4578ba63`) |
| 08-04 06:53 | iterate | enhancement — iterate's cross-link drain now runs the mentionedParts gate `[5.2]` (`b412019d`/`30da2c16`) |
| 08-04 07:52 | expand | pass 282 — 0 candidates filed (`39981660`) |
| 08-04 08:58 | iterate | content-gaps — gmk-cyl-og-extensions-interest-check Update callout gains the W32 read `[5.4]` (`a213f132`/`31331684`) |
| 08-04 09:57 | march | no-op — nothing additionally actionable this tick |
| 08-04 10:57 | iterate | bug — gmk-cyl-ta-neo-production-tracking dead `oblotzky.co` citation repointed to `oblotzky.industries` `[4.5]` (`88082d97`/`7b7c2571`) |

19 `march`-workflow runs since 2026-08-03T11:56:46 UTC: **19 `success`,
0 `failure`**.

## Shipped

- **content/seo (stale-claim/link-rot defect class, 6 fixes)**:
  newsletter footer copy no longer promises a weekly cadence it
  doesn't keep; gmk-cyl-ta-neo-production-tracking's dateline
  corrected so it no longer predates its own W32 citation, and its
  dead `oblotzky.co` `<Source>` link (NXDOMAIN) repointed to the
  live `oblotzky.industries` storefront; gmk-cyl-og-extensions-
  interest-check's lede synced to its own Update callout, then two
  commits later the callout itself extended with the current W32
  tracker read (70, up from the W31 figures it still cited); four
  articles' `updatedAt` frontmatter bumped to their real last-edit
  dates so `dateModified`/`article:modified_time` stop under-
  reporting freshness. Same recurring family flagged in each of the
  last several digests.
- **a11y (MobileNav keyboard focus-trap saga, 3 commits, self-
  correcting in real time)**: `6ef381e3` fixed a genuine leak (Tab
  focus escaping the open drawer into hidden background content);
  `1cfc52d4` caught and fixed that same-day fix's own over-broad
  side effect (Shift+Tab from the toggle button was also being
  trapped, hijacking a normal backward tab stop into Search);
  `998aae2f` closed the gap that let the second bug ship silently —
  real-browser Playwright Tab/Shift+Tab coverage where only jsdom
  synthetic-event unit tests existed before. `/expand` pass 281
  generalized the pattern same-day into a `[5.5]` "overlay/drawer
  keyboard-trap coverage check" candidate, citing this cluster plus
  an unrelated InlineViz zoom-modal instance from a month earlier.
- **seo**: `/sources` JSON-LD graph gains an `ItemList` node;
  tag/part OG not-found fallback image no longer drops retired brand
  colors.
- **content + enhancement (mentionedParts gap + its own root-cause
  fix)**: 60-percent-layout-history was missing `drop-holy-panda-x`
  in `mentionedParts` despite linking it in prose — introduced by an
  earlier cross-link-drain commit that inserted the link without the
  frontmatter registration the phase-38 gate exists to enforce. Two
  commits later, `iterate`'s own cross-link drain procedure was
  amended to run `article-parts-check.mjs` on every touched file
  before committing, closing the exact defect class it had just
  reintroduced (same shape hit buckling-spring-deep-dive earlier this
  cycle too).
- **expand**: pass 281 filed 1 candidate (overlay/drawer keyboard-
  trap coverage check, `[5.5]`); pass 282 returned zero — a fresh
  general-purpose sweep across RSS/feed, quiz scoring, compare-tool
  edge cases, group-buy date math, search/MiniSearch, and cross-
  article numeric fact-checks found nothing above the 3.0 bar.

## Queues now

- **Build plan**: 0 pending phases (51 shipped), unchanged — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged — every
  `[cross-links]`-category AUDIT row is `[x]`, and the drain
  procedure now self-guards against reintroducing mentionedParts
  gaps (this window's own process fix).
- **`plan/AUDIT.md`**: **4 open rows** (897 addressed, up from 893 —
  13 findings closed this window). `[6.3]` march.yml crash-gate
  (blocked-cloud-permission, filed 2026-07-05); `[4.0]` Lighthouse-CI
  disabled (filed 2026-07-18); `[needs-user-call] [4.2]` soft-404
  structurally blocked (filed 2026-07-18); `[4.0]` heartbeat.yml
  dedup (blocked-cloud-permission, filed 2026-07-26). All four
  unchanged from yesterday.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **86 days / 1972 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  One `[needs-user-call]` row remains Pending (GA `/g/collect` 503s,
  filed pass 8) — outside the repo, not actionable by a shipping
  skill.
- **`plan/PHASE_CANDIDATES.md`**: **22 pending rows + 1
  needs-user-call** (up from 21+1 — pass 281's new candidate),
  **51 days** since the last promotion (2026-06-14, phases 46-49).
  Top of the cluster, still `7.0`: trend-snapshot data-quality gate,
  automated content-fact-vs-catalog numeric-spec audit, article
  internal-consistency checker. Several `6.5`s follow: `/quiz/board`,
  stale group-buy frontmatter/prose gate, ship-content Step 3
  issue-persistence's sibling — the `[6.5]` critique-gate
  needs-user-call diagnostic — plus this window's new `[5.5]`
  overlay/drawer keyboard-trap check.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work).
- **Triage**: **15 open issues** (up from 14), 0 unlabeled. 8
  duplicate content-gap issues (`#414-#422` minus `#417`) still await
  a manual consolidation pass, unchanged. Three `triage:needs-user`
  issues remain open: `#639`, `#434`, `#499` (see Needs you). One new
  loose end this window: `#719` (see Needs you). This window's
  audit-filed issues otherwise self-closed same-window via their
  shipping commits — net open count moved by +1 (the `#719` orphan).
- **Expand cadence**: 2 passes this window (281-282) — 1 filed
  (overlay/drawer keyboard-trap check), 1 zero-candidate. Healthy
  cadence, no starvation signal.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential blocking
legs (typecheck → lint → test:run → test:scripts → data:validate →
build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next lint`
  — still flags its own deprecation ahead of Next.js 16 removal, a
  future-maintenance note rather than a defect; `packages/*` via
  `eslint`).
- `test:run` — green, 774 web unit tests (105 test files, up from
  772 — the MobileNav Shift+Tab test rewrite); 155 content tests
  (24 files, unchanged); tokens (3/1) + seo (42/5) + data (129/19) +
  ui (31/7) + e2e-fixtures (6/1) all green and unchanged. 1140 unit
  tests site-wide.
- `test:scripts` — green, 175 tests / 64 suites, unchanged.
- `data:validate` — green, 76 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 14
  trend weeks — all unchanged). 76 articles, unchanged.
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1118/1118**, up from 1116/1116 (7.4m, single
  worker) — the new MobileNav real-keyboard tests account for the +2.
- `pnpm deploy:check` at HEAD (`7b7c2571`) — deploy `READY`
  (`dpl_14DRTS1Z`).
- `lighthouse` — confirmed via `gh workflow list --all`:
  `state: disabled_manually`, same standing `[4.0]` AUDIT row, last
  two recorded runs both `failure` (2026-06-14, 2026-06-12), no new
  signal this window.

One non-blocking observation, repeated from prior digests: the e2e
run's server stderr again logged `NoFallbackError` several dozen times
against the five `dynamicParams = false` routes (`/part/[kind]`,
`/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
`/newsletter/[slug]`) — Next's expected internal log for not-found-
page e2e tests hitting a param outside the pre-generated set, not a
real failure. Every one of the 1118 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New: orphaned duplicate GitHub issue `#719`.** Filed
   2026-08-03T15:10 UTC by an `/iterate` audit sweep (LOW, a11y,
   "MobileNav drawer has no focus containment"). A later same-day
   sweep independently rediscovered the identical defect and filed
   `#722`, which the actual fix commit (`6ef381e3`, 20:47 UTC)
   closed via `Closes #722`. `#719` was never linked and is still
   open — the fix already shipped. This is the same duplicate-issue
   shape the `[6.5]` "ship-content Step 3 issue-persistence" fix
   (shipped 2026-07-08) solved for the content-dispatch path, but
   this instance is on the audit-finding path (two independent sweeps
   filing separate issues for one defect before either ships) — a
   different code path, not yet covered by that fix. One issue,
   low severity, cheap to `gh issue close 719 -c "duplicate of
   #722, fixed by 6ef381e3"` by hand; flagging rather than closing
   it autonomously since a shipping skill closing GitHub issues
   outside its own commit isn't in this skill's charter.
2. **Standing, growing: the `/oversight` promotion backlog.** 22
   pending candidates + 1 needs-user-call, now **51 days** since the
   last promotion. Three candidates sit at `7.0`, several more at
   `6.5`. This window added 1 new candidate (overlay/drawer
   keyboard-trap check) and shipped 0 — the backlog grew by one.
3. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 86 days / 1972 commits since pass 11. Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or something else.
4. **Standing: Lighthouse CI has been disabled and failing for 7+
   weeks — `/oversight` call needed.** Unchanged since last digest.
5. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (25 days old) and `#499` (19 days old). Neither
   self-resolved. `#639` (7 days old) looks like it already
   self-resolved (deploy is `READY` at HEAD) but stays open pending a
   look.
6. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`,
   heartbeat.yml `[4.0]`) — both fixes written and verified, neither
   can ship because the cloud push credential lacks `workflows` scope
   for `.github/workflows/*.yml` edits.
7. **Standing, out-of-repo: GA `/g/collect` 503s** — `plan/CRITIQUE.md`
   pass-8 `[needs-user-call]` row, unactionable by any shipping skill
   since the analytics property lives outside the codebase.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all four open rows are
blocked or `/oversight`-gated). The next `/march` tick will most
likely repeat this window's pattern: a fresh reactive `/iterate` fix
off a general-purpose sweep, or another `/expand` pass. The
highest-leverage next move isn't a new fix — it's an `/oversight` pass
covering, in one sitting: the standing 22-row candidate cluster (three
`7.0`s, now 51 days stale), the Critique-gate decision, the Lighthouse
re-enable decision, the two blocked workflow-permission fixes, and (new,
small) closing the orphaned `#719` duplicate issue by hand.

## Tuning proposals

None new this pass. 19/19 `march` runs succeeded this window — no
crash-gate signal to add to. `/expand`'s 2 passes this window (1
candidate filed, 1 clean) show healthy cadence, not starvation — no
tuning needed there. The MobileNav keyboard-trap saga already
produced its own generalization as a phase candidate (pass 281,
[5.5] overlay/drawer coverage check) rather than needing a digest-
level tuning proposal on top of it. The `#719` orphaned-issue finding
above is filed as a one-off "Needs you" item rather than a tuning
proposal — a single instance on a code path distinct from the
already-fixed ship-content duplicate-issue bug doesn't yet clear the
"pattern, not incident" bar this section holds proposals to; if a
second instance of an audit sweep filing a duplicate issue for an
already-open finding shows up in a future window, that's the signal to
propose a mechanical fix (e.g. a pre-file search-existing-issues step
in the audit-finding dispatch path). The 22-candidate `/oversight`
backlog and 86-day critique staleness remain standing, already-
diagnosed decisions awaiting a human call, not new tuning signals.
