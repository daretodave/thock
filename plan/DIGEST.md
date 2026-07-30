# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23h30m, 35-commit window — 22 `march` runs (21 success,
1 transient API-overload failure that self-recovered next tick) —
fifteen shipped fixes across content, seo, a11y, and bug categories,
plus four `/expand` passes (all zero-diff, one strengthening an
existing candidate) and one content-gap dispatch that opened and
then drained its own issue in the same window.** Since the last
digest (`c59dd8c4`, 2026-07-29T11:30 UTC) the loop landed 35
commits, each shipped fix paired with its own audit-tick commit: the
compare tool's empty states gained a link to quiz/catalog, a
deep-dives article on how buckling-spring switches work shipped
(closing a content-gap issue, `#656`) with 4 cross-link pairs and its
`mentionedParts` drained in the same tick, the trends tracker archive
OG image now differentiates per week, four separate articles had
stale tracker-score citations or "as of this writing" callbacks
corrected against the current `data/trends/` snapshot
(prototypist-vendor-spotlight, work-louder-openai-codex-micro,
rapid-trigger-gaming-crossover, cherry-xtrfy-tmr-pivot) plus a fifth
adjacent Kickstarter-status staleness fix
(keychron-nova-socket-hybrid), `agents.md`'s duplicated Rule 5
heading was removed, the home Trending strip now ranks by movement
magnitude instead of raw score level, group-buy hero images gained
schema-additive `heroImageAlt` text (closing `#668`), the article
loading skeleton now reserves space for the hero image to stop a
layout shift, and search now gates prefix/fuzzy expansion and strips
stopwords to stop corpus overmatch. This tick's own fresh `pnpm
verify` is green across all eight legs, run as sequential foreground
blocking calls: typecheck (9 packages), lint (all lintable
workspaces), 740 web unit tests / 104 files (up from 733/104), 175
script tests / 64 suites (up from 168/61), 75 data records /
cross-refs resolve (unchanged), build — all canonical routes
generated, homepage bundle 108.7 KB / 200 KB (unchanged), and
1100/1100 e2e (up from 1089/1089). Deploy is `READY` at HEAD
(`0a4ac958`, `dpl_EgiR4nRi`).

`plan/CRITIQUE.md` is now **81 days / 1818 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner), and every commit this window again carries
the `Cloud-Run:` trailer, so the gap keeps growing by construction
until a human decision lands. `plan/PHASE_CANDIDATES.md` holds **19
pending rows + 1 needs-user-call**, unchanged, now **46 days** since
the last promotion (2026-06-14, phases 46-49 — corrects a
transcription slip in the prior two digests, which cited
2026-06-11). `plan/AUDIT.md` carries **4** open rows, all
`/oversight`-gated or blocked, not actionable by an autonomous tick —
unchanged from yesterday: the Lighthouse-CI row, the march.yml
`[6.3]` crash-gate row, the soft-404 `[needs-user-call]` `[4.2]` row,
and the heartbeat.yml `[4.0]` row. One transient signal this window:
a single `march` run (2026-07-29T19:29:57Z) failed with
`api_error_status: 529` (Anthropic API overload) — the standing
`[6.3]` crash-issue-gate bug means no GitHub issue was opened for it,
but the next scheduled run (20:21:23Z) succeeded normally and no
commit was lost. Not a new finding — it's the same blocked-gate
mechanism the `[6.3]` row already documents, just its first observed
trigger since that row was filed.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-29 12:03 | expand | pass 250 — no candidates (`0be4b79c`) |
| 07-29 13:07 | iterate | fix — compare tool empty states, add link to quiz/catalog `[3.6]` (`94be6ea7`/`cd2161a9`) |
| 07-29 13:42 | expand | pass 251 — no candidates (`01029238`) |
| 07-29 14:57 | iterate | content dispatch — opened issue #656 (deep-dives content-gap) (`62d82f51`) |
| 07-29 15:38 | march | no-op — nothing additionally actionable this tick |
| 07-29 17:01 | iterate | content — deep-dives "How buckling-spring switches actually work," closes #656 (`da66d271`/`5b822e24`) |
| 07-29 17:48 | iterate | content — buckling-spring-deep-dive cross-links, 4 pairs drained, closes #658 `[4.5]`×4 (`8bb9e674`/`7f35e7cd`) |
| 07-29 18:44 | iterate | content — buckling-spring-deep-dive missing `mentionedParts` `[4.5]` (`b252c1c3`/`1e91d752`) |
| 07-29 19:30 | march | **failure** — transient `api_error_status: 529`, no commit shipped; crash-issue gate did not fire (known `[6.3]` blocked-cloud-permission gap); self-recovered next run |
| 07-29 20:43 | iterate | seo — trends tracker archive OG image differentiated per week `[3.6]` (`f8b78c7b`/`19d92343`) |
| 07-29 21:45 | iterate | content — prototypist-vendor-spotlight stale "this week" tracker refs, closes #661 `[4.0]` (`3513e620`/`a4ca88ef`) |
| 07-29 22:39 | iterate | content — work-louder-openai-codex-micro resolves stale W30 callback with W31 sellout, closes #662 `[5.6]` (`b17629f5`/`24185ea3`) |
| 07-29 23:45 | iterate | fix — rapid-trigger-gaming-crossover corrects fabricated W21-W23 tracker scores `[3.5]` (`35683971`/`1203fc3a`) |
| 07-30 00:49 | iterate | content — cherry-xtrfy-tmr-pivot resolves stale W29 tracker claims with W31 update `[5.6]` (`6686c326`/`c13f3aa2`) |
| 07-30 01:56 | iterate | content — keychron-nova-socket-hybrid resolves stale "has not opened" Kickstarter callback `[4.8]` (`ad385cac`/`31062092`) |
| 07-30 03:09 | expand | pass 252 — no candidates, 1 existing strengthened (`f090906f`) |
| 07-30 05:22 | iterate | docs — `agents.md` duplicated Rule 5 heading removed `[3.6]` (`8881ce29`/`9fda877d`) |
| 07-30 07:12 | iterate | fix — home Trending strip ranks by movement, not score level `[4.8]` (`cef1ee2f`/`37be360f`) |
| 07-30 08:07 | expand | pass 253 — no candidates (`204f02fe`) |
| 07-30 09:22 | iterate | a11y — group-buy hero images gain schema-additive `heroImageAlt`, closes #668 `[3.5]` (`bcf97c65`/`bb95e1b4`) |
| 07-30 10:10 | iterate | fix — article loading skeleton omits hero image, causing CLS `[5.6]` (`fd0aa96e`/`7371a047`) |
| 07-30 11:00 | iterate | fix — search: gate prefix/fuzzy expansion, strip stopwords to stop corpus overmatch `[4.9]` (`847dab94`/`0a4ac958`) |

22 `march`-workflow runs since 2026-07-29T11:30 UTC: 21 `success`, 1
`failure` (transient API overload, self-recovered).

## Shipped

- **content**: deep-dives article "How buckling-spring switches
  actually work" (closes #656), with 4 cross-link pairs and
  `mentionedParts` drained in the same window; four tracker-citation
  staleness fixes (prototypist-vendor-spotlight, closes #661;
  work-louder-openai-codex-micro, closes #662;
  rapid-trigger-gaming-crossover; cherry-xtrfy-tmr-pivot) plus one
  adjacent Kickstarter-status staleness fix
  (keychron-nova-socket-hybrid).
- **seo**: trends tracker archive OG image now differentiates per
  week instead of sharing one static image.
- **a11y**: group-buy hero images gained schema-additive
  `heroImageAlt` text, replacing boilerplate alt text (closes #668).
- **bug/fix**: compare tool empty states now link to quiz/catalog;
  home Trending strip ranks risers/fallers by movement magnitude
  instead of raw score level; article loading skeleton now reserves
  hero-image space to stop a layout shift; search now gates
  prefix/fuzzy expansion and strips stopwords to stop corpus
  overmatch.
- **docs**: `agents.md`'s duplicated Rule 5 heading removed.
- **expand**: 4 passes (250, 251, 252, 253) — all zero-diff; pass 252
  strengthened one existing candidate (trend-snapshot data-quality
  gate) with fresh evidence rather than filing new.

## Queues now

- **Build plan**: 0 pending phases (51 shipped, unchanged) — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged — every
  `[cross-links]`-category AUDIT row is `[x]`.
- **`plan/AUDIT.md`**: **4 open rows** (828 addressed, up from 810).
  `[6.3]` march.yml crash-gate (blocked-cloud-permission, filed
  2026-07-05); `[4.0]` Lighthouse-CI disabled (`next: /oversight
  call`, filed 2026-07-18); `[needs-user-call] [4.2]` soft-404
  structurally blocked (filed 2026-07-18); `[4.0]` heartbeat.yml
  dedup (blocked-cloud-permission, filed 2026-07-26). All four
  unchanged from yesterday — non-autonomous, either genuinely blocked
  on the cloud push credential or gated to `/oversight`.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **81 days / 1818 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  The standing `[needs-user-call]` GA-503-beacon row is the only
  other pending critique item, also unchanged.
- **`plan/PHASE_CANDIDATES.md`**: **19 pending rows + 1
  needs-user-call**, unchanged, **46 days** since the last promotion
  (2026-06-14, phases 46-49 — the prior two digests cited 2026-06-11,
  which was actually an earlier 8-candidate promotion batch; 2026-06-14
  is the true most-recent `promoted:` date in the file). Top of the
  cluster, all still `7.0`: trend-snapshot data-quality gate
  (strengthened this window with 2 more instances), automated
  content-fact-vs-catalog numeric-spec audit, article
  internal-consistency checker. Several `6.5`s follow: `/quiz/board`,
  stale group-buy frontmatter/prose gate, sitewide focus-visible
  default + coverage check, plus the `[6.5]` needs-user-call
  critique-gate decision.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work).
- **Triage**: 14 open issues, unchanged, 0 unlabeled. 8 duplicate
  content-gap issues (`#414-#416`, `#418-#422`) still await a manual
  consolidation pass. Three `triage:needs-user` issues remain open:
  `#639` (Vercel deploy-webhook drop, now 2 days old), `#434` (Vercel
  never ingested commit `e312e09`, now 20 days old), and `#499`
  (night digest crashed, now 14 days old). `#395`, `#437`, `#620` are
  stable.
- **Expand cadence**: 4 passes this window (250, 251, 253 zero-diff;
  252 strengthened 1 existing candidate) — all mechanical surveys ran
  clean.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential blocking
legs (typecheck → lint → test:run → test:scripts → data:validate →
build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next lint`
  — still flags its own deprecation ahead of Next.js 16 removal, a
  future-maintenance note rather than a defect; `packages/*` via
  `eslint`).
- `test:run` — green, 740 web unit tests (104 test files, up from
  733/104); tokens/seo/data/ui/e2e-fixtures/content packages all
  green and unchanged.
- `test:scripts` — green, 175 tests / 64 suites (up from 168/61).
- `data:validate` — green, 75 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 13
  trend weeks — unchanged).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1100/1100**, up from 1089/1089.
- `pnpm deploy:check` at HEAD (`0a4ac958`) — deploy `READY`
  (`dpl_EgiR4nRi`).
- `lighthouse` — confirmed via `gh api .../actions/workflows`:
  `state: "disabled_manually"`, unchanged. The `gh run list
  --workflow lighthouse` pulse command still can't resolve it by
  display name (known quirk, documented on the standing `[4.0]` AUDIT
  row) — no new signal this window.

One non-blocking observation, repeated from prior digests: the e2e
run's server stderr again logged `NoFallbackError` several dozen times
against the five `dynamicParams = false` routes (`/part/[kind]`,
`/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
`/newsletter/[slug]`) — Next's expected internal log for not-found-
page e2e tests hitting a param outside the pre-generated set, not a
real failure. Every one of the 1100 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **Standing, growing: the `/oversight` promotion backlog.** 19
   pending candidates + 1 needs-user-call, now **46 days** since the
   last promotion. Three candidates sit at `7.0` (the trend-snapshot
   data-quality gate just picked up two more instances this window),
   several more at `6.5`.
2. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 81 days / 1818 commits since pass 11. Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or something else.
3. **Standing: Lighthouse CI has been disabled and failing for 6+
   weeks — `/oversight` call needed.** Unchanged since last digest.
4. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (20 days old) and `#499` (14 days old). Neither self-
   resolved. `#639` (2 days old) looks like it already self-resolved
   (deploy is `READY` at HEAD) but stays open pending a look.
5. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`,
   heartbeat.yml `[4.0]`) — both fixes written and verified, neither
   can ship because the cloud push credential lacks `workflows` scope
   for `.github/workflows/*.yml` edits. This window's transient 529
   failure is the first observed live trigger of the `[6.3]` gap
   since it was filed — worth noting if it recurs.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all four open rows
are blocked or `/oversight`-gated). The next `/march` tick will most
likely repeat this window's pattern: a fresh reactive `/iterate` fix
off a general-purpose sweep, or another zero-diff `/expand` pass. The
highest-leverage next move isn't a new fix — it's an `/oversight` pass
covering, in one sitting: the growing 19-row candidate cluster (three
`7.0`s, the trend-snapshot gate now with 11 total instances across
its evidence trail), the Critique-gate decision, the Lighthouse
re-enable decision, and the two blocked workflow-permission fixes.

## Tuning proposals

None new this pass. The transient `api_error_status: 529` march
failure is a first live trigger of the already-filed `[6.3]`
crash-issue-gate gap, not a new mistuned gate — it self-recovered
within one cycle and cost nothing beyond the missing issue the `[6.3]`
row already accounts for. Expand ran 4 passes this window with 0 new
candidates (consistent with recent cadence, not "dozens of
consecutive no-candidate passes"), so no expand-cadence tuning is
warranted either. The 19-candidate `/oversight` backlog and 81-day
critique staleness remain standing, already-diagnosed decisions
awaiting a human call, not new tuning signals.
