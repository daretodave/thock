# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A fully clean ~23.8h window — 20 `march` runs, 20/20 success,
18 substantive ticks and 2 pure no-ops, for 27 commits total.**
Since the last digest (`2931831c`, 2026-08-02T11:16:31 UTC) the loop
drained 11 `plan/AUDIT.md` findings across 8 issues (one cross-link
cluster closed 4 rows under a single issue): a JSON-LD gap (quiz
`WebApplication` schema gains `offers`/`operatingSystem`), a stale
tracker-claim fix (keychron-quiet-takeover's "55 and rising" W25
citation updated to the current W31 score of 94), a false-superlative
fix (keychron-nova-socket-hybrid's "tracker's highest reading" scoped
to "switch-category reading" after a sibling article's competing 97
row made the claim false), two dead-plumbing removals (`ArticleCard`'s
unused `tagsBySlug`/`maxTags` prop-drilling across 8 page callers and
4 intermediate components; `Board`/`KeycapSet` schemas' dead `imageUrl`
field, always `null`, unread by any renderer), a full Rule-2
tracker-linkage content-gap cycle (GMK CYL TA Neo unlinked for 14
days — filed by `tracker-linkage-survey.mjs`, issue opened next tick,
companion trends article "GMK CYL TA Neo's group buy is closed —
here's what a November 2026 ship estimate actually means" shipped the
tick after that), the new article's 4-pair cross-link drain in the
following tick, and a hero-art factual fix (the new article's SVG
`<title>` + provenance JSON overstated its own peak score as 70 over
eight readings when the article and `data/trends/2026-W30.json` both
say 62 over three real tracker weeks — a brander-agent misreading of
the decorative 8-point spark array as literal history). `/expand` ran
8 passes (273-280), all returning zero new candidates — pass 278
downgraded a stale candidate in place and pass 279 re-rejected a
disproven `GroupBuySchema.imageUrl` lead for the second time; pass 280
closed the loop on the hero-art defect class, confirming (via a
scoped sub-agent sweep) it didn't recur elsewhere and that the new
article's cross-links and tracker citations both check out clean.
This tick's own fresh `pnpm verify` is green across all eight legs,
run as sequential foreground blocking calls: typecheck (9 packages),
lint (all lintable workspaces), 772 web unit tests / 105 files
(unchanged), 155 content tests / 24 files (unchanged), 211 tests
across tokens/seo/data/ui/e2e-fixtures (3+42+129+31+6, unchanged) —
1138 unit tests site-wide, 175 script tests / 64 suites (unchanged),
76 data records / cross-refs resolve (up from 75 — trend weeks
13→14, this window's own W32 snapshot), build — all canonical routes
generated, homepage bundle 108.7 KB / 200 KB (unchanged), and
1116/1116 e2e (up from 1110/1110, +6 new tests from the new article's
route). Deploy is `READY` at HEAD (`b7da8735`, `dpl_FRZr4994`).

`plan/CRITIQUE.md` is now **85 days / 1942 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner), and every commit this window again carries
the `Cloud-Run:` trailer, so the gap keeps growing by construction
until a human decision lands. `plan/PHASE_CANDIDATES.md` holds **21
pending rows + 1 needs-user-call**, unchanged (8 expand passes this
window, all zero-new-candidate), now **50 days** since the last
promotion (2026-06-14, phases 46-49). `plan/AUDIT.md` carries **4**
open rows, all `/oversight`-gated or blocked, not actionable by an
autonomous tick — unchanged from yesterday: the march.yml `[6.3]`
crash-gate row, the Lighthouse-CI `[4.0]` row, the soft-404
`[needs-user-call]` `[4.2]` row, and the heartbeat.yml `[4.0]` row.
No transient failures this window — the fourth consecutive fully
clean run.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-02 11:27 | iterate | seo — quiz `WebApplication` JSON-LD gains `offers`/`operatingSystem` `[3.2]` (`59f78e9c`/`5df0a538`) |
| 08-02 12:23 | march | no-op — nothing additionally actionable this tick |
| 08-02 13:30 | iterate | content — keychron-quiet-takeover stale W25 tracker claim resolved with W31 update `[4.8]` (`48e13dad`/`59fc1346`) |
| 08-02 14:31 | expand | pass 273 — no candidates (`55d11ae5`) |
| 08-02 15:23 | expand | pass 274 — no candidates (`8f252eca`) |
| 08-02 16:21 | expand | pass 275 — no candidates (`e1cfd822`) |
| 08-02 17:21 | expand | pass 276 — no candidates (`fabdeaf6`) |
| 08-02 18:21 | expand | pass 277 — no candidates (`e1f1982e`) |
| 08-02 19:26 | iterate | content — fix false "tracker's highest" superlative in keychron-nova-socket-hybrid `[5.4]` (`902ca18c`/`b99d3234`) |
| 08-02 20:20 | iterate | engineering — dead `tagsBySlug`/`maxTags` prop-drilling removed from `ArticleCard` `[3.2]` (`dc62c662`/`821634dd`) |
| 08-02 21:17 | iterate | engineering — dead `imageUrl` field removed from Board/KeycapSet schemas `[3.2]` (`75f0722a`/`c4afea6a`) |
| 08-02 22:18 | expand | pass 278 — no candidates, 1 stale candidate corrected (`99b99960`) |
| 08-02 23:19 | expand | pass 279 — no candidates, 1 disproven lead re-rejected (`7be04f78`) |
| 08-03 00:34 | march | data — trend snapshot 2026-W32; audit — tracker Rule 2 gap filed for GMK CYL TA Neo `[5.5]` (`8e5eb174`/`9463b6e2`) |
| 08-03 01:35 | march | content dispatch opened issue #715 (`b12648e3`) |
| 08-03 03:05 | ship-content | content — trends: "GMK CYL TA Neo's group buy is closed — here's what a November 2026 ship estimate actually means" `[5.5]` (`17a38a94`/`0e32ac28`) |
| 08-03 05:13 | iterate | content — gmk-cyl-ta-neo-production-tracking cross-links, 4 pairs drained `[4.5]` x4 (`58a9392d`/`a15a18a0`) |
| 08-03 07:09 | march | no-op — nothing additionally actionable this tick |
| 08-03 09:07 | iterate | content — hero-art peak-score/reading-count mismatch corrected in gmk-cyl-ta-neo `[4.5]` (`b8ecb765`/`09ea4c45`) |
| 08-03 11:04 | expand | pass 280 — no candidates, hero-art defect class checked clean (`b7da8735`) |

20 `march`-workflow runs since 2026-08-02T11:16:31 UTC: **20 `success`,
0 `failure`**.

## Shipped

- **seo**: quiz `WebApplication` JSON-LD gains `offers`/`operatingSystem`
  fields, closing the remaining structured-data gap on the two quiz
  routes.
- **content (stale-claim/superlative defect class)**: two fixes in the
  same recurring family — keychron-quiet-takeover's W25 "55 and
  rising" tracker citation updated to the current W31 score of 94;
  keychron-nova-socket-hybrid's "tracker's highest reading" scoped to
  "switch-category reading" after a sibling article's competing
  Work Louder x OpenAI Codex Micro row (97) made the unscoped claim
  false. Same defect class as 7-8 prior stale/wrong-superlative
  fixes this cycle (issues #661-664, #683, #711, #712).
- **engineering (dead-plumbing defect class)**: `ArticleCard`'s unused
  `tagsBySlug`/`maxTags` props removed, unwinding a forwarding chain
  through 4 intermediate components and 8 page-level callers that
  built a discarded `Map` on every render; `Board`/`KeycapSet`
  schemas' `imageUrl` field (always `null`, unread by any renderer,
  leftover from before the hero-art SVG pivot) deleted from both
  schemas, 20 data records, and generated JSON Schema.
- **content-gaps (Rule 2, full 3-tick cycle)**: `tracker-linkage-
  survey.mjs` filed a 14-day-unlinked GMK CYL TA Neo tracker row
  (score 5.5); the next tick opened issue #715; the tick after that
  shipped the companion trends article, then the tick after *that*
  drained all 4 same-pillar cross-link pairs the new article opened.
- **content (hero-art accuracy)**: the new article's hero-art SVG
  `<title>` and provenance JSON overstated its own peak score (70
  over eight readings, vs. the real 62 over three tracker weeks) — a
  brander-agent misreading of the decorative 8-point spark array as
  literal history rather than the documented arc-to-current-score
  convention. Fixed same-window; pass 280's follow-up sweep confirmed
  the defect class didn't recur on any sibling asset.
- **expand**: 8 passes (273-280) — all zero-new-candidate; pass 278
  downgraded a stale candidate in place, pass 279 re-rejected the
  same disproven `GroupBuySchema.imageUrl` lead for the second time
  (still correctly locked as intentional vendor-photo plumbing per
  the phase-23 design decision), pass 280 closed the loop on this
  window's own hero-art defect class.

## Queues now

- **Build plan**: 0 pending phases, unchanged — pure `/iterate`
  maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged — every
  `[cross-links]`-category AUDIT row is `[x]` (including today's
  4-row gmk-cyl-ta-neo-production-tracking cluster).
- **`plan/AUDIT.md`**: **4 open rows** (880 addressed, up from 869 —
  11 findings closed this window across 8 issues). `[6.3]` march.yml
  crash-gate (blocked-cloud-permission, filed 2026-07-05); `[4.0]`
  Lighthouse-CI disabled (`next: /oversight call`, filed 2026-07-18);
  `[needs-user-call] [4.2]` soft-404 structurally blocked (filed
  2026-07-18); `[4.0]` heartbeat.yml dedup (blocked-cloud-permission,
  filed 2026-07-26). All four unchanged from yesterday — non-
  autonomous, either genuinely blocked on the cloud push credential or
  gated to `/oversight`.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **85 days / 1942 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  One `[needs-user-call]` row remains Pending (GA `/g/collect` 503s,
  filed pass 8) — outside the repo, not actionable by a shipping
  skill.
- **`plan/PHASE_CANDIDATES.md`**: **21 pending rows + 1
  needs-user-call**, unchanged — 8 expand passes this window (273-280)
  all returned zero new candidates, **50 days** since the last
  promotion (2026-06-14, phases 46-49). Top of the cluster, all still
  `7.0`: trend-snapshot data-quality gate, automated
  content-fact-vs-catalog numeric-spec audit, article
  internal-consistency checker. Several `6.5`s follow: `/quiz/board`,
  stale group-buy frontmatter/prose gate, sitewide focus-visible
  default + coverage check, plus the `[6.5]` needs-user-call
  critique-gate decision.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work).
- **Triage**: 14 open issues, unchanged, 0 unlabeled. 8 duplicate
  content-gap issues (`#414-#422`) still await a manual consolidation
  pass. Three `triage:needs-user` issues remain open: `#639` (Vercel
  deploy-webhook drop, now 6 days old), `#434` (Vercel never ingested
  commit `e312e09`, now 24 days old), `#499` (night digest crashed,
  now 18 days old). `#395`, `#437`, `#620` are stable. This window's
  8 audit-filed issues (`#710-#717`) all self-closed same-window via
  their shipping commits — net open count unchanged.
- **Expand cadence**: 8 passes this window (273-280) — 0 filed new
  candidates, breaking the prior window's brief 2-candidate streak;
  activity was corrections/re-rejections of existing candidates
  instead.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential blocking
legs (typecheck → lint → test:run → test:scripts → data:validate →
build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next lint`
  — still flags its own deprecation ahead of Next.js 16 removal, a
  future-maintenance note rather than a defect; `packages/*` via
  `eslint`).
- `test:run` — green, 772 web unit tests (105 test files, unchanged);
  155 content tests (24 files, unchanged); tokens (3/1) + seo (42/5) +
  data (129/19) + ui (31/7) + e2e-fixtures (6/1) all green and
  unchanged. 1138 unit tests site-wide.
- `test:scripts` — green, 175 tests / 64 suites, unchanged.
- `data:validate` — green, 76 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 14
  trend weeks — trend weeks up from 13, this window's own W32
  snapshot). 76 articles (up from 75, this window's own GMK CYL TA
  Neo ship).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1116/1116**, up from 1110/1110 (7.9m, single
  worker) — the new article's route accounts for the +6.
- `pnpm deploy:check` at HEAD (`b7da8735`) — deploy `READY`
  (`dpl_FRZr4994`).
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
real failure. Every one of the 1116 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **Standing, growing: the `/oversight` promotion backlog.** 21
   pending candidates + 1 needs-user-call, now **50 days** since the
   last promotion. Three candidates sit at `7.0`, several more at
   `6.5`. This window's 8 expand passes filed zero new candidates —
   the backlog didn't grow, but it didn't shrink either.
2. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 85 days / 1942 commits since pass 11. Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or something else.
3. **Standing: Lighthouse CI has been disabled and failing for 7+
   weeks — `/oversight` call needed.** Unchanged since last digest.
4. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (24 days old) and `#499` (18 days old). Neither
   self-resolved. `#639` (6 days old) looks like it already
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
off a general-purpose sweep, or another `/expand` pass now that 8
consecutive passes have returned clean. The highest-leverage next move
isn't a new fix — it's an `/oversight` pass covering, in one sitting:
the standing 21-row candidate cluster (three `7.0`s, now 50 days
stale), the Critique-gate decision, the Lighthouse re-enable decision,
and the two blocked workflow-permission fixes.

## Tuning proposals

None new this pass. 20/20 `march` runs succeeded this window — no
crash-gate signal to add to. `/expand`'s 8 passes this window all
returned zero new candidates without a starvation pattern (2 were
corrections/re-rejections of existing leads, not empty sweeps), which
reads as healthy self-correcting cadence rather than a mistuned gate —
no tuning needed there. The 21-candidate `/oversight` backlog and
85-day critique staleness remain standing, already-diagnosed decisions
awaiting a human call, not new tuning signals.
