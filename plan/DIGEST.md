# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23h34m, 35-commit window — 21/21 `march` runs green (19
shipped ticks, 2 no-ops) — sixteen small drained fixes across seo,
a11y, content, data, and docs, plus three `/expand` passes (one
filing a new candidate).** Since the last digest (`ba2659eb`,
2026-07-28T11:35 UTC) the loop landed 35 commits, each shipped fix
paired with its own audit-tick commit: a missing `Permissions-Policy`
security header, search-box autofocus stealing assistive-tech focus
on touch, RSS feeds missing `revalidate` config, the newsletter
archive's missing `ItemList` JSON-LD, newsletter issue 05's lede
contradicting its own body on the Cherry MX2A brand trend, a tag-page
"Latest first" kicker that lied for title-matched sort tiers, a
mounting-styles-compared article misclassifying the Bakeneko65's
burger mount as integrated, `agents.md`'s verify-gate diagram missing
three legs (lint/test:scripts/size), compare-tool `<select>`s
carrying a conflicting `aria-label`, four docs files with stale
`archive/` instructions for closed group buys, article/tag soft-404
pages missing `robots` noindex, a `wooting-60he` board-name
contradiction against its own vendor data and article prose, the home
Trending strip and the standalone Trends Tracker both ranking
risers/fallers by raw level instead of movement magnitude (two
separate fixes, same root cause pattern), the site's `WebSite`
JSON-LD missing a `SearchAction` for the `/search` deep link, and the
switch quiz's results screen missing a "Compare top 2" deep-link into
the compare tool. This tick's own fresh `pnpm verify` is green across
all eight legs, run as sequential foreground blocking calls:
typecheck (9 packages), lint (all lintable workspaces), 733 web unit
tests / 104 files (up from 721/101), 168 script tests / 61 suites
(unchanged), 75 data records / cross-refs resolve (unchanged), build
— all canonical routes generated, homepage bundle 108.7 KB / 200 KB
(unchanged), and 1089/1089 e2e (unchanged). Deploy is `READY` at HEAD
(`a5b31517`, `dpl_HSHSgS4n`).

`plan/CRITIQUE.md` is now **80 days / 1782 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner), and every commit this window again carries
the `Cloud-Run:` trailer, so the gap keeps growing by construction
until a human decision lands. `plan/PHASE_CANDIDATES.md` holds **19
pending rows + 1 needs-user-call** (up from 18 — pass 247 filed a new
`[4.0]` candidate: interactive-tools completion instrumentation gap),
now **48 days** since the last promotion (2026-06-11).
`plan/AUDIT.md` carries **4** open rows, all `/oversight`-gated or
blocked, not actionable by an autonomous tick — unchanged from
yesterday: the Lighthouse-CI row, the march.yml `[6.3]` crash-gate
row, the soft-404 `[needs-user-call]` `[4.2]` row, and the
heartbeat.yml `[4.0]` row. One new signal this window: a fresh
`triage:needs-user` GitHub issue (`#639`) reporting `deploy:check`
timed out 3x on a single push (a distinct trigger from the already-
fixed rapid-double-push class, `#540`) — see Needs You.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-28 11:41 | expand | pass 247 — 1 candidate filed: interactive-tools completion instrumentation gap `[4.0]` (`918d6d52`) |
| 07-28 12:37 | iterate | seo — missing `Permissions-Policy` security header `[4.5]` (`582b184c`/`1aeab22b`) |
| 07-28 13:34 | march | no-op — nothing actionable this tick |
| 07-28 14:50 | expand | pass 248 — no candidates (`3fde8627`) |
| 07-28 15:47 | iterate | a11y — search box autofocus steals AT focus on touch `[4.5]` (`4c7e079e`/`1e243612`) |
| 07-28 16:33 | march | no-op |
| 07-28 17:31 | iterate | perf — RSS feeds missing `revalidate` config `[4.0]` (`5a995cfb`/`202f6d9e`) |
| 07-28 18:30 | iterate | seo — newsletter archive missing `ItemList` JSON-LD `[3.6]` (`18c96afb`/`97d63c17`) |
| 07-28 19:31 | iterate | content — newsletter 005 lede contradicts its own body on Cherry MX2A brand trend `[5.4]` (`1ef1d711`/`28212d4a`) |
| 07-28 20:27 | iterate | fix — tag page "Latest first" kicker false for title-matched sort tiers `[4.5]` (`ac3ad01a`/`4e24885f`) |
| 07-28 21:25 | iterate | content — mounting-styles-compared misclassified Bakeneko65's burger mount as integrated, not gasket `[4.2]` (`26d2d9e0`/`204ba8a6`) |
| 07-28 22:22 | iterate | docs — `agents.md` verify-gate diagram missing lint/test:scripts/size legs `[3.6]` (`cdc3e09b`/`70dc938f`) |
| 07-28 23:21 | iterate | a11y — compare-tool selects carried a conflicting `aria-label` (label-in-name) `[4.5]` (`e6b8facc`/`4e3f5ef3`) |
| 07-29 00:29 | iterate | docs — stale `archive/` group-buy instructions across 4 docs `[4.5]` (`e6d0af5a`/`8a4fe0f4`) |
| 07-29 01:34 | iterate | seo — article/tag soft-404 pages missing `robots` noindex `[5.4]` (`e234aa6d`/`5c6fbd4e`) |
| 07-29 03:03 | expand | pass 249 — no candidates (`ebcc95ea`) |
| 07-29 05:05 | data | wooting-60he board name contradicted vendor data + article prose `[4.8]` (`621a545b`/`6492ab8d`) |
| 07-29 06:55 | iterate | fix — home Trending strip ranked by file order, not movement magnitude `[4.2]` (`c212d43f`/`2703e8af`) |
| 07-29 07:56 | iterate | fix — Trends Tracker riser/faller ranked by level, not movement `[4.8]` (`07dfd9b9`/`ffdb9f10`) |
| 07-29 09:03 | iterate | seo — `WebSite` JSON-LD missing `SearchAction` for `/search` deep link `[3.6]` (`072c3ce4`/`094b044e`) |
| 07-29 10:52 | iterate | fix — switch quiz results missing "Compare top 2" deep-link to compare tool `[4.5]` (`95a90109`/`a5b31517`) |

21/21 `march`-workflow runs since 2026-07-28T11:35 UTC report
`success` — no crash-issue-gate recurrence this window.

## Shipped

- **seo**: missing `Permissions-Policy` header; newsletter archive's
  missing `ItemList` JSON-LD; article/tag soft-404 pages now carry
  `robots` noindex; `WebSite` JSON-LD gained the missing
  `SearchAction` for the `/search` deep link.
- **a11y**: search-box autofocus no longer steals assistive-tech
  focus on touch; compare-tool `<select>`s no longer carry a
  conflicting `aria-label` alongside their visible label text.
- **perf**: RSS feeds gained `revalidate` config.
- **content**: newsletter 005's lede rewritten to stop contradicting
  its own body on the Cherry MX2A brand trend; mounting-styles-
  compared's Bakeneko65 mount reclassified from integrated to gasket.
- **data**: `wooting-60he`'s board name corrected to stop
  contradicting its own vendor record and article prose.
- **bug/fix**: tag-page "Latest first" kicker fixed for title-matched
  sort tiers; home Trending strip and the standalone Trends Tracker
  both fixed to rank risers/fallers by movement magnitude instead of
  raw level (two separate components, same underlying pattern); the
  switch quiz's results screen gained a "Compare top 2" deep-link
  into the compare tool.
- **docs**: `agents.md`'s verify-gate diagram corrected to show all
  eight legs; four docs files corrected for stale `archive/`
  group-buy instructions.
- **expand**: 3 passes (247, 248, 249) — pass 247 filed 1 new
  candidate (interactive-tools completion instrumentation gap,
  `[4.0]`); 248 and 249 zero-diff, no candidates.

## Queues now

- **Build plan**: 0 pending phases (51 shipped, unchanged) — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged — every
  `[cross-links]`-category AUDIT row is `[x]`.
- **`plan/AUDIT.md`**: **4 open rows** (810 addressed, up from 794).
  `[6.3]` march.yml crash-gate (blocked-cloud-permission, filed
  2026-07-05); `[4.0]` Lighthouse-CI disabled (`next: /oversight
  call`, filed 2026-07-18); `[needs-user-call] [4.2]` soft-404
  structurally blocked (filed 2026-07-18); `[4.0]` heartbeat.yml
  dedup (blocked-cloud-permission, filed 2026-07-26). All four
  unchanged from yesterday — non-autonomous, either genuinely blocked
  on the cloud push credential or gated to `/oversight`.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **80 days / 1782 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  The standing `[needs-user-call]` GA-503-beacon row is the only
  other pending critique item, also unchanged.
- **`plan/PHASE_CANDIDATES.md`**: **19 pending rows + 1
  needs-user-call** (up from 18), **48 days** since the last
  promotion (2026-06-11, 8 candidates including phases 43/44/45). Top
  of the cluster, all still `7.0`: trend-snapshot data-quality gate,
  content-fact-vs-catalog numeric-spec audit, article
  internal-consistency checker. Several `6.5`s follow: `/quiz/board`,
  stale group-buy frontmatter/prose gate, sitewide focus-visible
  default + coverage check (now documented as recurring 12 times
  component-by-component), plus the `[6.5]` needs-user-call
  critique-gate decision.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work).
- **Triage**: 14 open issues (up from 13), 0 unlabeled. 8 duplicate
  content-gap issues (`#414-#416`, `#418-#422`) still await a manual
  consolidation pass. Three `triage:needs-user` issues now open:
  `#639` (new — Vercel deploy-webhook drop on a single push, now 0
  days old), `#434` (Vercel never ingested commit `e312e09`, now 19
  days old), and `#499` (night digest crashed, now 13 days old).
  `#395`, `#437`, `#620` are stable.
- **Expand cadence**: 3 passes this window (247 filed 1 candidate,
  248/249 zero-diff) — all mechanical surveys ran clean.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential blocking
legs (typecheck → lint → test:run → test:scripts → data:validate →
build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next lint`
  — still flags its own deprecation ahead of Next.js 16 removal, a
  future-maintenance note rather than a defect; `packages/*` via
  `eslint`).
- `test:run` — green, 733 web unit tests (104 test files, up from
  721/101); tokens/seo/data/ui/e2e-fixtures/content packages all
  green and unchanged.
- `test:scripts` — green, 168 tests / 61 suites, unchanged.
- `data:validate` — green, 75 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 13
  trend weeks — unchanged).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1089/1089**, unchanged.
- `pnpm deploy:check` at HEAD (`a5b31517`) — deploy `READY`
  (`dpl_HSHSgS4n`).
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
real failure. Every one of the 1089 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New: a distinct Vercel deploy-webhook drop trigger, `#639`.**
   `deploy:check` timed out 3x (~35 min) after the Permissions-Policy
   push (`582b184c`/`1aeab22b`) — a *single* push containing both
   commits, unlike the already-fixed `#540` class (two rapid-fire
   pushes ~20s apart). The issue's own body says no code fix is
   available from the autonomous loop (no Vercel dashboard/webhook
   access) and that it's fine to close without action if this reads
   as a one-off blip. HEAD now shows `READY` instantly, so it likely
   self-resolved — but it's a second, distinct trigger condition for
   the same underlying flakiness class, worth a look if a third
   variant appears.
2. **Standing, growing: the `/oversight` promotion backlog.** 19
   pending candidates + 1 needs-user-call, now **48 days** since the
   last promotion. Three candidates sit at `7.0`, several more at
   `6.5` — including the sitewide focus-visible default, which its
   own candidate row now documents as fixed 12 separate times
   component-by-component.
3. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 80 days / 1782 commits since pass 11. Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or something else.
4. **Standing: Lighthouse CI has been disabled and failing for 6+
   weeks — `/oversight` call needed.** Unchanged since last digest.
5. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (19 days old) and `#499` (13 days old). Neither self-
   resolved. (Plus the new `#639` above.)
6. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`,
   heartbeat.yml `[4.0]`) — both fixes written and verified, neither
   can ship because the cloud push credential lacks `workflows` scope
   for `.github/workflows/*.yml` edits.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all four open rows
are blocked or `/oversight`-gated). The next `/march` tick will most
likely repeat this window's pattern: a fresh reactive `/iterate` fix
off a general-purpose sweep, or another zero-diff `/expand` pass. The
highest-leverage next move isn't a new fix — it's an `/oversight` pass
covering, in one sitting: the growing 20-row candidate cluster (three
`7.0`s, the 12-times-recurring focus-visible gap), the Critique-gate
decision, the Lighthouse re-enable decision, the two blocked
workflow-permission fixes, and a quick look at whether `#639`'s
webhook-drop pattern needs anything beyond a watch-and-close.

## Tuning proposals

None new this pass. The Vercel deploy-webhook drop (`#639`) is a
second distinct trigger condition for a class already partially
mitigated (`#540`'s single-push merge fix) — but the issue itself
has no in-repo remediation available (no Vercel-side access from the
autonomous loop) and reads as a one-off blip pending confirmation, so
it's filed as a Needs-You watch item rather than a gate change. No
other mistuned gate, cadence, or ceiling surfaced this window — the
19-candidate `/oversight` backlog and 80-day critique staleness are
both standing, already-diagnosed decisions awaiting a human call, not
new tuning signals.
