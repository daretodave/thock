# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Another fully clean ~23h window — 22 `march` runs, 22/22 success,
zero failures — 16 substantive ticks (12 iterate fix-pairs + 4
`/expand` no-op passes) and 6 pure no-ops, for 30 commits total.**
Since the last digest (`f8feb604`, 2026-07-31T11:32 UTC) the loop
drained 12 small `plan/AUDIT.md` findings, each shipped fix paired
with its own audit-tick commit: a stale "if it opens" group-buy
framing on `gmk-cyl-og-extensions-interest-check`, `root loading.tsx`
leaking home-specific copy onto other routes, the search catalog
ignoring its own stopword/short-query guard, `/sources` citation
index failing to dedupe `www` vs bare-host URLs, a Cherry MX2A W24
tracker row mislabeled "flat" despite a 3-point rise, the
compare-tool same-selection hint failing WCAG AA contrast, a stale
Q4 2026 claim on `prototypist-vendor-spotlight`, search + newsletter
date badges converging on the sitewide medium format, and a
three-commit run of tracker canonical-URL fixes ( `/trends/tracker`
JSON-LD contradiction, sitemap tracker-week gap, and the tracker
next-week link all pointing at the evergreen dashboard instead of a
non-canonical URL). This tick's own fresh `pnpm verify` is green
across all eight legs, run as sequential foreground blocking calls:
typecheck (9 packages), lint (all lintable workspaces), 753 web unit
tests / 105 files (up from 746/104) plus 358 tests across the other
six packages (tokens/seo/data/ui/e2e-fixtures/content, unchanged),
175 script tests / 64 suites (unchanged), 75 data records /
cross-refs resolve (unchanged), build — all canonical routes
generated, homepage bundle 108.7 KB / 200 KB (unchanged), and
1107/1107 e2e (up from 1105/1105). Deploy is `READY` at HEAD
(`3042a58b`, `dpl_GBN2qFkm`).

`plan/CRITIQUE.md` is now **83 days / 1878 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner), and every commit this window again carries
the `Cloud-Run:` trailer, so the gap keeps growing by construction
until a human decision lands. `plan/PHASE_CANDIDATES.md` holds **19
pending rows + 1 needs-user-call**, unchanged, now **48 days** since
the last promotion (2026-06-14, phases 46-49). `plan/AUDIT.md`
carries **4** open rows, all `/oversight`-gated or blocked, not
actionable by an autonomous tick — unchanged from yesterday: the
Lighthouse-CI row, the march.yml `[6.3]` crash-gate row, the
soft-404 `[needs-user-call]` `[4.2]` row, and the heartbeat.yml
`[4.0]` row. No transient failures this window — the second
consecutive fully clean run.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-31 11:42 | march | no-op — nothing additionally actionable this tick |
| 07-31 12:39 | march | no-op — nothing additionally actionable this tick |
| 07-31 13:34 | expand | pass 265 — no candidates (`2fb3568b`) |
| 07-31 14:49 | iterate | content — `gmk-cyl-og-extensions-interest-check` stale "if it opens" GB framing resolved `[5.4]` (`1dbaed9b`/`baf42c5b`) |
| 07-31 15:43 | iterate | fix — root `loading.tsx` no longer shows home-specific copy on other routes `[4.0]` (`bbcbd937`/`58dc7cd2`) |
| 07-31 16:34 | march | no-op — nothing additionally actionable this tick |
| 07-31 17:31 | iterate | fix — search catalog results honor stopword/short-query guard `[4.8]` (`043aa2d3`/`7542f583`) |
| 07-31 18:31 | march | no-op — nothing additionally actionable this tick |
| 07-31 19:31 | iterate | fix — `/sources` citation index dedupes `www` vs bare-host URLs `[3.6]` (`9730181c`/`a3ca2b5c`) |
| 07-31 20:29 | march | no-op — nothing additionally actionable this tick |
| 07-31 21:24 | march | no-op — nothing additionally actionable this tick |
| 07-31 22:21 | expand | pass 266 — no candidates (`1540eee0`) |
| 07-31 23:21 | expand | pass 267 — no candidates (`883bed69`) |
| 08-01 00:32 | expand | pass 268 — no candidates (`64af6c51`) |
| 08-01 01:35 | iterate | data — Cherry MX2A W24 tracker row mislabeled "flat" despite 3-pt rise `[4.5]` (`a1885baa`/`c5d8ee5d`); same tick filed the next pending row, compare-tool contrast (`017f4762`) |
| 08-01 03:03 | iterate | a11y — compare-tool same-selection hint fails WCAG AA contrast `[4.5]` (`5b78192a`/`b06be1e2`) |
| 08-01 05:05 | iterate | content — `prototypist-vendor-spotlight` stale Q4 2026 claim resolved with W31 tracker update `[5.6]` (`803ae690`/`a4d47e2d`) |
| 08-01 06:51 | iterate | fix — search + newsletter date badges converge on sitewide medium format `[4.0]` (`7cc0ad08`/`59991f0d`) |
| 08-01 07:45 | iterate | seo — `/trends/tracker/[week]` canonicalizes latest week to the evergreen dashboard `[4.8]` (`41bbda4a`/`308337d3`) |
| 08-01 08:47 | iterate | seo — `/trends/tracker/[week]` JSON-LD matches its own canonical fix `[4.8]` (`2ddc387f`/`5dfc0445`) |
| 08-01 09:39 | iterate | seo — sitemap excludes latest tracker week's non-canonical URL `[4.5]` (`81d3b78c`/`644b54dc`) |
| 08-01 10:32 | iterate | seo — tracker next-week link skips the latest-week canonical redirect `[4.5]` (`fede9337`/`3042a58b`) |

22 `march`-workflow runs since 2026-07-31T11:32 UTC: **22 `success`,
0 `failure`**.

## Shipped

- **fix/bug**: root `loading.tsx` no longer leaks home-specific copy
  onto other routes; search catalog honors its own stopword/
  short-query guard; `/sources` citation index dedupes `www` vs
  bare-host URLs; search + newsletter date badges converge on the
  sitewide medium format.
- **seo**: a four-commit run closing out `/trends/tracker/[week]`'s
  canonical URL family — the week-detail page canonicalizes the
  latest week to the evergreen dashboard, JSON-LD matches that
  canonical, the sitemap excludes the now-non-canonical latest-week
  URL, and the tracker's own "next week" link skips straight past
  the redirect.
- **a11y**: compare-tool same-selection hint now passes WCAG AA
  contrast.
- **content/data**: `gmk-cyl-og-extensions-interest-check`'s stale
  "if it opens" group-buy framing resolved; Cherry MX2A W24 tracker
  row mislabel fixed (was "flat" despite a 3-point rise);
  `prototypist-vendor-spotlight`'s stale Q4 2026 claim resolved with
  a W31 tracker update.
- **expand**: 4 passes (265, 266, 267, 268) — all zero-diff, no
  candidates filed or strengthened this window.

## Queues now

- **Build plan**: 0 pending phases, unchanged — pure `/iterate`
  maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged — every
  `[cross-links]`-category AUDIT row is `[x]`.
- **`plan/AUDIT.md`**: **4 open rows** (852 addressed, up from 840 —
  the 12 findings this window). `[6.3]` march.yml crash-gate
  (blocked-cloud-permission, filed 2026-07-05); `[4.0]` Lighthouse-CI
  disabled (`next: /oversight call`, filed 2026-07-18);
  `[needs-user-call] [4.2]` soft-404 structurally blocked (filed
  2026-07-18); `[4.0]` heartbeat.yml dedup (blocked-cloud-permission,
  filed 2026-07-26). All four unchanged from yesterday — non-
  autonomous, either genuinely blocked on the cloud push credential or
  gated to `/oversight`.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **83 days / 1878 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  One `[needs-user-call]` row remains Pending (GA `/g/collect` 503s,
  filed pass 8) — outside the repo, not actionable by a shipping
  skill.
- **`plan/PHASE_CANDIDATES.md`**: **19 pending rows + 1
  needs-user-call**, unchanged, **48 days** since the last promotion
  (2026-06-14, phases 46-49). Top of the cluster, all still `7.0`:
  trend-snapshot data-quality gate, automated
  content-fact-vs-catalog numeric-spec audit, article
  internal-consistency checker. Several `6.5`s follow: `/quiz/board`,
  stale group-buy frontmatter/prose gate, sitewide focus-visible
  default + coverage check, plus the `[6.5]` needs-user-call
  critique-gate decision. `/expand` filed nothing new for 21
  consecutive passes (last new candidate at pass 247, unchanged) —
  expected given the existing 20-row backlog, not a starvation signal
  on its own.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work).
- **Triage**: 14 open issues, unchanged, 0 unlabeled. 8 duplicate
  content-gap issues (`#414-#422`) still await a manual consolidation
  pass. Three `triage:needs-user` issues remain open: `#639` (Vercel
  deploy-webhook drop, now 4 days old), `#434` (Vercel never ingested
  commit `e312e09`, now 22 days old), `#499` (night digest crashed,
  now 16 days old). `#395`, `#437`, `#620` are stable.
- **Expand cadence**: 4 passes this window (265-268), all zero-diff —
  mechanical surveys ran clean.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential blocking
legs (typecheck → lint → test:run → test:scripts → data:validate →
build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next lint`
  — still flags its own deprecation ahead of Next.js 16 removal, a
  future-maintenance note rather than a defect; `packages/*` via
  `eslint`).
- `test:run` — green, 753 web unit tests (105 test files, up from
  746/104); tokens (3/1) + seo (42/5) + data (129/19) + ui (31/7) +
  e2e-fixtures (6/1) + content (153/24) all green and unchanged.
- `test:scripts` — green, 175 tests / 64 suites, unchanged.
- `data:validate` — green, 75 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 13
  trend weeks — unchanged).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1107/1107**, up from 1105/1105 (7.9m, single
  worker).
- `pnpm deploy:check` at HEAD (`3042a58b`) — deploy `READY`
  (`dpl_GBN2qFkm`).
- `lighthouse` — confirmed via `gh workflow list --all`:
  `state: disabled_manually`, same standing `[4.0]` AUDIT row, no new
  signal this window.

One non-blocking observation, repeated from prior digests: the e2e
run's server stderr again logged `NoFallbackError` several dozen times
against the five `dynamicParams = false` routes (`/part/[kind]`,
`/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
`/newsletter/[slug]`) — Next's expected internal log for not-found-
page e2e tests hitting a param outside the pre-generated set, not a
real failure. Every one of the 1107 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **Standing, growing: the `/oversight` promotion backlog.** 19
   pending candidates + 1 needs-user-call, now **48 days** since the
   last promotion. Three candidates sit at `7.0`, several more at
   `6.5`.
2. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 83 days / 1878 commits since pass 11. Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or something else.
3. **Standing: Lighthouse CI has been disabled and failing for 7+
   weeks — `/oversight` call needed.** Unchanged since last digest.
4. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (22 days old) and `#499` (16 days old). Neither
   self-resolved. `#639` (4 days old) looks like it already
   self-resolved (deploy is `READY` at HEAD) but stays open pending a
   look.
5. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`,
   heartbeat.yml `[4.0]`) — both fixes written and verified, neither
   can ship because the cloud push credential lacks `workflows` scope
   for `.github/workflows/*.yml` edits.
6. **Standing, out-of-repo: GA `/g/collect` 503s** — `plan/CRITIQUE.md`
   pass-8 `[needs-user-call]` row, unactionable by any shipping skill
   since the analytics property lives outside the codebase.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all four open rows are
blocked or `/oversight`-gated). The next `/march` tick will most
likely repeat this window's pattern: a fresh reactive `/iterate` fix
off a general-purpose sweep, or another zero-diff `/expand` pass. The
highest-leverage next move isn't a new fix — it's an `/oversight` pass
covering, in one sitting: the growing 20-row candidate cluster (three
`7.0`s), the Critique-gate decision, the Lighthouse re-enable
decision, and the two blocked workflow-permission fixes.

## Tuning proposals

None new this pass. 22/22 `march` runs succeeded this window — no
crash-gate signal to add to. `/expand` ran 4 passes with 0 new
candidates, consistent with recent cadence (last new candidate at
pass 247, 21 passes ago) against a 20-row unpromoted backlog — proposing
new candidates faster than `/oversight` clears them would only widen
the backlog, not fix its root cause. The 20-candidate `/oversight`
backlog and 83-day critique staleness remain standing, already-
diagnosed decisions awaiting a human call, not new tuning signals.
