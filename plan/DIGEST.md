# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A fully clean ~24h window — 20 `march` runs, 20/20 success, zero
failures — 17 substantive ticks (12 iterate fix-pairs + 5 `/expand`
no-op passes) and 3 pure no-ops, for 29 commits total.** Since the
last digest (`0149d684`, 2026-07-30T11:30 UTC) the loop drained a
dozen small-to-medium `plan/AUDIT.md` findings, each shipped fix
paired with its own audit-tick commit: a `not-found` metadata leak on
`/article` and `/tag`, a `lubing-101` tag mismatch (`lubed` →
`lubing`), sitewide `prefers-reduced-motion` support for skeleton
animations, missing `flex-1` on the quiz page/loading `<main>`
templates, a Wuque Studio W29 tracker row mislabeled "flat" despite a
14-point crash, `RelatedArticleCard` and `ArticleByline`/
`TrackerHeader` date-format drift against sibling components, dead
`readTimeMinutes`/`wordCount` frontmatter stripped from 27 articles, a
`MentionedInArticles` test mock that didn't match the real `Article`
shape, `/search?q=...` variants gaining `noindex` while the bare page
stays indexable, the compare tool now explaining why its button is
disabled on identical picks, and a missing `kat` keycap-profile tag
(plus two retags). This tick's own fresh `pnpm verify` is green across
all eight legs, run as sequential foreground blocking calls: typecheck
(9 packages), lint (all lintable workspaces), 746 web unit tests / 104
files (up from 740/104), 175 script tests / 64 suites (unchanged), 75
data records / cross-refs resolve (unchanged), build — all canonical
routes generated, homepage bundle 108.7 KB / 200 KB (unchanged), and
1105/1105 e2e (up from 1100/1100). Deploy is `READY` at HEAD
(`0ccc44ca`, `dpl_5snUzRB5`).

`plan/CRITIQUE.md` is now **82 days / 1848 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner), and every commit this window again carries
the `Cloud-Run:` trailer, so the gap keeps growing by construction
until a human decision lands. `plan/PHASE_CANDIDATES.md` holds **19
pending rows + 1 needs-user-call**, unchanged, now **47 days** since
the last promotion (2026-06-14, phases 46-49). `plan/AUDIT.md` carries
**4** open rows, all `/oversight`-gated or blocked, not actionable by
an autonomous tick — unchanged from yesterday: the Lighthouse-CI row,
the march.yml `[6.3]` crash-gate row, the soft-404
`[needs-user-call]` `[4.2]` row, and the heartbeat.yml `[4.0]` row. No
transient failures this window — a fully clean run, better than the
single 529 API-overload blip in the prior window.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-30 11:37 | march | no-op — nothing additionally actionable this tick |
| 07-30 12:35 | expand | pass 260 — no candidates (`fa844a3d`) |
| 07-30 13:34 | expand | pass 261 — no candidates (`84924846`) |
| 07-30 14:46 | iterate | fix — `not-found` metadata leak on `/article` and `/tag` `[5.4]` (`f84a9814`/`48884949`) |
| 07-30 15:39 | iterate | content — `lubing-101` retag `'lubed'` → `'lubing'` topic tag `[3.6]` (`5d5d2386`/`c3765730`) |
| 07-30 16:32 | iterate | a11y — sitewide `prefers-reduced-motion` support for skeleton animations `[4.5]` (`5350d208`/`b5172240`) |
| 07-30 17:31 | march | no-op — nothing additionally actionable this tick |
| 07-30 18:31 | iterate | fix — quiz page/loading templates missing `flex-1` on `<main>` `[3.6]` (`5b8c0def`/`fff61bba`) |
| 07-30 19:31 | march | no-op — nothing additionally actionable this tick |
| 07-30 20:27 | iterate | data — Wuque Studio W29 tracker row mislabeled "flat" despite 14-point crash `[7.2]` (`81b3f295`/`02126b8d`) |
| 07-30 21:25 | iterate | fix — `RelatedArticleCard` date format matches sibling article cards `[3.6]` (`5318a703`/`8e421d0f`) |
| 07-30 22:23 | iterate | content — strip dead `readTimeMinutes`/`wordCount` frontmatter from 27 articles `[4.0]` (`d33a2441`/`abe5fcc3`) |
| 07-30 23:22 | expand | pass 262 — no candidates (`52a9359f`) |
| 07-31 00:33 | iterate | test — `MentionedInArticles` mock matches real `Article` shape `[4.5]` (`39f940a9`/`8ed1a4ef`) |
| 07-31 01:35 | iterate | fix — `ArticleByline`/`TrackerHeader` date format matches sibling components `[3.6]` (`919823b5`/`913bf208`) |
| 07-31 03:04 | iterate | seo — `/search?q=...` variants noindex, bare page stays indexable `[3.2]` (`298845bc`/`61c0a194`) |
| 07-31 05:10 | iterate | a11y — compare tool explains why the button is disabled on identical picks `[4.0]` (`9c16c537`/`f8fc7356`) |
| 07-31 07:00 | expand | pass 263 — no candidates (`c4f16310`) |
| 07-31 09:01 | iterate | content — add missing `kat` profile tag, retag two articles `[4.5]` (`b4913f02`/`e2de1256`) |
| 07-31 10:54 | expand | pass 264 — no candidates (`0ccc44ca`) |

20 `march`-workflow runs since 2026-07-30T11:30 UTC: **20 `success`,
0 `failure`** — the first fully clean window in recent memory.

## Shipped

- **fix/bug**: `not-found` metadata leak on `/article` and `/tag`;
  quiz page/loading templates missing `flex-1` on `<main>`;
  `RelatedArticleCard` and `ArticleByline`/`TrackerHeader` date-format
  drift against sibling components; compare tool now explains why its
  button is disabled on identical picks.
- **a11y**: sitewide `prefers-reduced-motion` support for skeleton
  animations.
- **content/data**: `lubing-101` retagged `'lubed'` → `'lubing'`;
  Wuque Studio W29 tracker row mislabel fixed (was "flat" despite a
  14-point crash); dead `readTimeMinutes`/`wordCount` frontmatter
  stripped from 27 articles; missing `kat` keycap-profile tag added,
  two articles retagged.
- **seo**: `/search?q=...` variants now `noindex`, bare `/search`
  page stays indexable.
- **test**: `MentionedInArticles` mock brought in line with the real
  `Article` shape.
- **expand**: 5 passes (260, 261, 262, 263, 264) — all zero-diff, no
  candidates filed or strengthened this window.

## Queues now

- **Build plan**: 0 pending phases, unchanged — pure `/iterate`
  maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged — every
  `[cross-links]`-category AUDIT row is `[x]`.
- **`plan/AUDIT.md`**: **4 open rows** (840 addressed, up from 828 —
  the 12 findings this window). `[6.3]` march.yml crash-gate
  (blocked-cloud-permission, filed 2026-07-05); `[4.0]` Lighthouse-CI
  disabled (`next: /oversight call`, filed 2026-07-18);
  `[needs-user-call] [4.2]` soft-404 structurally blocked (filed
  2026-07-18); `[4.0]` heartbeat.yml dedup (blocked-cloud-permission,
  filed 2026-07-26). All four unchanged from yesterday — non-
  autonomous, either genuinely blocked on the cloud push credential or
  gated to `/oversight`.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **82 days / 1848 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
- **`plan/PHASE_CANDIDATES.md`**: **19 pending rows + 1
  needs-user-call**, unchanged, **47 days** since the last promotion
  (2026-06-14, phases 46-49). Top of the cluster, all still `7.0`:
  trend-snapshot data-quality gate, automated
  content-fact-vs-catalog numeric-spec audit, article
  internal-consistency checker. Several `6.5`s follow: `/quiz/board`,
  stale group-buy frontmatter/prose gate, sitewide focus-visible
  default + coverage check, plus the `[6.5]` needs-user-call
  critique-gate decision. `/expand` filed nothing new for 17
  consecutive passes (last new candidate at pass 247) — expected given
  the existing 20-row backlog, not a starvation signal on its own.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work).
- **Triage**: 14 open issues, unchanged, 0 unlabeled. 8 duplicate
  content-gap issues (`#414-#422`) still await a manual consolidation
  pass. Three `triage:needs-user` issues remain open: `#639` (Vercel
  deploy-webhook drop, now 3 days old), `#434` (Vercel never ingested
  commit `e312e09`, now 21 days old), `#499` (night digest crashed,
  now 15 days old). `#395`, `#437`, `#620` are stable.
- **Expand cadence**: 5 passes this window (260-264), all zero-diff —
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
- `test:run` — green, 746 web unit tests (104 test files, up from
  740/104); tokens/seo/data/ui/e2e-fixtures/content packages all
  green and unchanged.
- `test:scripts` — green, 175 tests / 64 suites, unchanged.
- `data:validate` — green, 75 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 13
  trend weeks — unchanged).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1105/1105**, up from 1100/1100 (7.7m, single
  worker).
- `pnpm deploy:check` at HEAD (`0ccc44ca`) — deploy `READY`
  (`dpl_5snUzRB5`).
- `lighthouse` — confirmed via `gh workflow list --all`:
  `state: disabled_manually`, last 5 recorded runs all `failure`,
  unchanged. Same standing `[4.0]` AUDIT row, no new signal this
  window.

One non-blocking observation, repeated from prior digests: the e2e
run's server stderr again logged `NoFallbackError` several dozen times
against the five `dynamicParams = false` routes (`/part/[kind]`,
`/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
`/newsletter/[slug]`) — Next's expected internal log for not-found-
page e2e tests hitting a param outside the pre-generated set, not a
real failure. Every one of the 1105 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **Standing, growing: the `/oversight` promotion backlog.** 19
   pending candidates + 1 needs-user-call, now **47 days** since the
   last promotion. Three candidates sit at `7.0`, several more at
   `6.5`.
2. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 82 days / 1848 commits since pass 11. Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or something else.
3. **Standing: Lighthouse CI has been disabled and failing for 6+
   weeks — `/oversight` call needed.** Unchanged since last digest.
4. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (21 days old) and `#499` (15 days old). Neither
   self-resolved. `#639` (3 days old) looks like it already
   self-resolved (deploy is `READY` at HEAD) but stays open pending a
   look.
5. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`,
   heartbeat.yml `[4.0]`) — both fixes written and verified, neither
   can ship because the cloud push credential lacks `workflows` scope
   for `.github/workflows/*.yml` edits.

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

None new this pass. 20/20 `march` runs succeeded this window — no
crash-gate signal to add to. `/expand` ran 5 passes with 0 new
candidates, consistent with recent cadence (last new candidate at
pass 247, 17 passes ago) against a 20-row unpromoted backlog — proposing
new candidates faster than `/oversight` clears them would only widen
the backlog, not fix its root cause. The 20-candidate `/oversight`
backlog and 82-day critique staleness remain standing, already-
diagnosed decisions awaiting a human call, not new tuning signals.
