# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23.3h window — 24/24 `march` runs succeeded, no infra
hiccups this time — 19 substantive ticks (14 shipped fixes/data/docs
+ 5 `expand` passes) for 33 commits total.** Since the last digest
(`0f7d4e3d`, 2026-08-07T11:09:27 UTC) the loop drained 14
`plan/AUDIT.md` findings, all self-discovered by fresh `/iterate`
audit sweeps (no pending build-plan phase, data backlog, or
cross-link work exists to draw from): a stale `pnpm.overrides` pin
that a new js-yaml GHSA had already bypassed, a 404ing group-buy
vendor URL, a mischaracterized flat-week tracker reversal in
`thock-weekly-001`, a fabricated $1,850 resale figure and a
fabricated restock-path claim in the same W32 Codex Micro trends
note (two separate fact-check hits on one snapshot), a missing
README skills-section entry, a missing `/ship-content` slash-command
wrapper, a dead `vendor status: "inactive"` field that silently
never rendered, and a three-part **OG-image render-pipeline
cluster**: length-tiered headline sizing shipped then found
under-sized at its own 84px tier for a 26-char name (`59de1dd0` →
`2012516f`), the `fonts` option was never wired into any of the
~30 `opengraph-image.tsx` routes so italic serif/mono declarations
were silent no-ops (`c04fc151`), and that very fix's 5-file font set
then pushed several OG edge functions past Vercel's 1 MB bundle
limit — a deploy-time error caught and fixed same-session
(`1e5617ad`). Two engineering fixes closed out the window's own
tooling gaps: `content-gap-survey.mjs` was the only one of 9
mechanical march-survey scripts with no `AUDIT.md` dedup check
(self-discovered and self-fixed in one commit, `99a0fe89`), and the
same script's own unit tests had never actually run for lack of an
`isMain` guard (`2daafbe9`). `/expand` ran 5 passes (294-298) — 4
zero-candidate, then pass 298 caught the OG cluster's own
fix-then-bug-in-the-fix pattern (§4G commit-pattern signal) and
filed a new `[score 6.5]` "OG image render-verification gate"
candidate, the first non-zero expand pass since 287. This tick's own
fresh `pnpm verify` is green across all eight legs, run as
sequential foreground blocking calls: typecheck (9 packages), lint
(all lintable workspaces), 803 unit tests site-wide (803 web / 107
files, up from 793/106; 198 script tests / 72 suites, up from
182/65), 78 data records / cross-refs resolve (unchanged — a
maintenance-only window, no new catalog entries), a clean build
across all canonical routes, homepage bundle 108.7 KB / 200 KB
(unchanged), and 1131/1131 e2e (unchanged). Deploy is `READY` at
HEAD (`ad6dabb7`, `dpl_J7556t7K`).

`plan/CRITIQUE.md` is now **90 days / 2100 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — crossing the
90-day mark this window. Diagnosis unchanged: cloud mode
architecturally cannot reach `/critique` (no Chrome MCP on the
runner; `.github/workflows/march.yml` explicitly skips it), and
every commit this window again carries the `Cloud-Run:` trailer, so
the gap keeps growing by construction until a human decision lands.
`plan/PHASE_CANDIDATES.md` holds **23 pending rows + 1
needs-user-call** (up from 22 + 1 — pass 298's OG-render-
verification-gate filing), **55 days** since the last promotion
(2026-06-14, phases 46-49). `plan/AUDIT.md` carries **1 open row**
(the standing `[4.0]` Lighthouse-CI row) plus **3 more
`/oversight`-gated or blocked rows**, none actionable by an
autonomous tick — unchanged from yesterday: `[6.3]` march.yml
crash-gate, `[needs-user-call] [4.2]` soft-404, `[4.0]` heartbeat.yml
dedup.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-07 11:09 | digest | 2026-08-07 |
| 08-07 12:31 | expand | pass 294 — 0 candidates filed (`c4b469c8`) |
| 08-07 13:47 | iterate | fix — js-yaml pnpm.overrides stale, new GHSA bypasses pins `[3.6]` (`ad7a4a1e`/`293c048e`) |
| 08-07 15:34 | iterate | data — trends W30 GMK CYL TA Neo tracker linkage `[4.5]` (`40654ed7`/`c4c0ca3a`) |
| 08-07 16:41 | iterate | fix — novelkeys-gmk-cyl-og-extensions group-buy vendor URL 404s `[5.4]` (`14c61536`/`b3c74843`) |
| 08-07 17:35 | iterate | content — thock-weekly-001 flat-week mischaracterization `[3.6]` (`72c723ee`/`5d8cb6ea`) |
| 08-07 18:36 | iterate | fix — trends W32 Codex Micro fabricated $1,850 resale figure `[5.4]` (`0c42490e`/`708dfb15`) |
| 08-07 19:41 | expand | pass 295 — 0 candidates filed (`f64698eb`) |
| 08-07 21:25 | expand | pass 296 — 0 candidates filed (`197d3963`) |
| 08-07 22:21 | expand | pass 297 — 0 candidates filed (`cd0f507f`) |
| 08-07 23:27 | iterate | docs — README skills section gap `[4.8]` (`d74041db`/`776d59da`) |
| 08-08 00:39 | iterate | seo — OG cards length-tiered headline sizing `[4.8]` (`59de1dd0`/`275a0699`) |
| 08-08 03:13 | iterate | fix — OG headline overflow, 26-char name still wrapped at 84px tier `[4.8]` (`2012516f`/`68041b9a`) |
| 08-08 03:46 | iterate | fix — trends W32 Codex Micro fabricated restock-path claim `[3.6]` (`d147703c`/`14b1ae7c`) |
| 08-08 04:42 | iterate | engineering — content-gap-survey.mjs missing AUDIT.md dedup check, self-filed+fixed `[4.8]` (`99a0fe89`) |
| 08-08 05:47 | iterate | fix — OG images ignore fonts option, italic serif/mono never render `[3.5]` (`c04fc151`/`5ec02b27`) + same-tick follow-up dropping 500-weight variants over Vercel's 1MB edge limit (`1e5617ad`) |
| 08-08 06:37 | iterate | fix — content-gap-survey.mjs missing isMain guard, its own tests never ran `[5.4]` (`2daafbe9`/`2e1cbcf2`) |
| 08-08 08:40 | iterate | fix — vendor status "inactive" dead field never renders `[4.0]` (`b354e011`/`b05fed05`) |
| 08-08 09:36 | expand | pass 298 — 1 candidate filed: OG image render-verification gate `[score 6.5]` (`5f38a374`) |
| 08-08 10:26 | iterate | docs — register `/ship-content` slash command wrapper `[6.3]` (`b03c3524`/`ad6dabb7`) |

24 `march`-workflow runs since 2026-08-07T11:09:27 UTC: **24
`success`, 0 `failure`, 0 `cancelled`** — a fully clean window, no
GH Actions infra hiccups (contrast with the prior window's four
runner-acquisition failures). 19 ticks produced a commit; the
remaining 5 runs were no-ops.

## Shipped

- **fix (7)**: a stale `pnpm.overrides` pin for a superseded js-yaml
  GHSA; a 404ing group-buy vendor URL
  (`novelkeys-gmk-cyl-og-extensions`); a fabricated restock-path
  claim in the W32 Codex Micro trends note (the second fact-check
  hit on that same snapshot this window); a dead `vendor status:
  "inactive"` field that silently never rendered on `/vendors` or
  `/vendor/[slug]`; `content-gap-survey.mjs`'s missing `isMain`
  guard (its own unit tests had never run despite green CI); the OG
  headline-sizing fix's own 84px tier still wrapping a 26-char name;
  the OG fonts fix's own 5-file font set pushing several edge
  functions past Vercel's 1 MB bundle limit.
- **content fact-check (2)**: `thock-weekly-001` mischaracterized a
  flat W24 tracker week as a reversal; the W32 Codex Micro trends
  note fabricated a $1,850 resale figure — the first of two separate
  fabrication hits on the same snapshot this window.
- **data (1)**: trends W30 — linked the GMK CYL TA Neo row to its
  companion article.
- **seo (1)**: OG cards — length-tiered headline font size for long
  vendor/tag/part names (immediately found under-sized at its own
  84px tier, fixed same window).
- **a11y/rendering (1)**: OG images ignored the `fonts` option
  entirely — every declared italic-serif/mono/non-700-weight
  request across ~30 routes silently fell back to bundled Noto Sans
  Regular. Fixed with a memoized 5-font loader, then trimmed to 3
  files same-session after the fix itself blew Vercel's 1 MB edge
  limit.
- **engineering (2)**: `content-gap-survey.mjs` was the one
  mechanical march-survey script (of 9) with no `AUDIT.md` dedup
  check before appending a row — self-discovered and self-fixed in
  one commit; the same script's tests never ran for lack of an
  `isMain` guard, fixed as a follow-up finding hours later.
- **docs (2)**: README skills section — documented `ship-content`,
  `ship-asset`, `jot`, `digest`; registered the missing
  `/ship-content` `.claude/commands` slash-command wrapper.
- **expand**: 5 passes (294-298) — 4 zero-candidate, then pass 298's
  commit-pattern signal (§4G) caught this window's own two
  same-session "fix, then a bug in the fix" pairs, both on the OG
  image surface, and filed a new `[score 6.5]` OG image
  render-verification gate candidate — the first non-zero expand
  pass since 287.

## Queues now

- **Build plan**: 0 pending phases (51 shipped), unchanged — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged.
- **`plan/AUDIT.md`**: **1 open row** (948 addressed, up from 934 —
  14 findings closed this window) plus 3 more standing
  `/oversight`-gated or blocked rows, unchanged from yesterday:
  `[6.3]` march.yml crash-gate (blocked-cloud-permission, filed
  2026-07-05); `[4.0]` Lighthouse-CI disabled (filed 2026-07-18,
  still `disabled_manually`); `[needs-user-call] [4.2]` soft-404
  structurally blocked (filed 2026-07-18); `[4.0]` heartbeat.yml
  dedup (blocked-cloud-permission, filed 2026-07-26).
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **90 days / 2100 commits stale**, crossing the
  90-day mark this window. Diagnosis unchanged: cloud mode
  architecturally cannot reach `/critique` (no Chrome MCP; every
  commit this window again carries `Cloud-Run:`). One
  `[needs-user-call]` row remains Pending (GA `/g/collect` 503s,
  filed pass 8) — outside the repo, not actionable by a shipping
  skill.
- **`plan/PHASE_CANDIDATES.md`**: **23 pending rows + 1
  needs-user-call**, up from 22 + 1 (pass 298 filed the OG
  render-verification gate). **55 days** since the last promotion
  (2026-06-14, phases 46-49). Top of the cluster remains three
  `7.0`s (trend-snapshot data-quality gate, automated
  content-fact-vs-catalog numeric-spec audit, article
  internal-consistency checker — all still unshipped). This window's
  three content fact-checks (thock-weekly-001, two on W32 Codex
  Micro) are fresh evidence for the numeric-spec-audit candidate;
  GitHub issue #776 (filed 2026-08-07T20:17, still open at digest
  time — `pe-foam-mod` gives two contradictory install-time
  estimates, 10 vs 15 minutes) is a live, undrained instance of
  exactly what the internal-consistency-checker candidate targets.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged.
- **Triage**: **17 open issues**, 0 unlabeled — up from 16 (net +1;
  8 issues opened and closed same-window for 8 of this window's
  fixes, plus #776 opened and still open). Four `triage:needs-user`
  issues remain standing: `#756` (2 days old), `#639` (11 days old),
  `#499` (23 days old), `#434` (29 days old). Orphaned duplicate
  `#719` (MobileNav focus-containment, fixed weeks ago by `6ef381e3`)
  remains open, unchanged.
- **Expand cadence**: 5 passes this window (294-298), 4
  zero-candidate + 1 non-zero. Normal cadence, no starvation signal.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential
blocking legs (typecheck → lint → test:run → test:scripts →
data:validate → build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next
  lint` — still flags its own deprecation ahead of Next.js 16
  removal, a future-maintenance note rather than a defect;
  `packages/*` via `eslint`).
- `test:run` — green, 803 web unit tests (107 test files, up from
  793/106).
- `test:scripts` — green, 198 tests / 72 suites, up from 182/65 (two
  rounds of new coverage on `content-gap-survey.mjs` this window).
- `data:validate` — green, 78 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 16 group-buys, 14
  trends) — unchanged, a maintenance-only window with no new catalog
  entries.
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1131/1131** (~7.6m, single worker), unchanged.
  Server stderr again logged `NoFallbackError` several dozen times
  against the five `dynamicParams = false` routes (`/part/[kind]`,
  `/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
  `/newsletter/[slug]`) — same non-blocking shape flagged in recent
  digests, Next's expected internal log for not-found-page e2e tests
  hitting a param outside the pre-generated set. Every one of the
  1131 tests still passed.
- `pnpm deploy:check` at HEAD (`ad6dabb7`) — deploy `READY`
  (`dpl_J7556t7K`).
- `lighthouse` — `gh run list --workflow lighthouse` still can't
  resolve the disabled workflow by display name (known quirk, use
  `--workflow lighthouse.yml` or `gh workflow list` instead); state
  remains `disabled_manually`, same standing `[4.0]` AUDIT row, no
  new signal this window.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **Standing, now at a milestone: `/critique` has crossed 90 days
   stale.** 90 days / 2100 commits since pass 11. The diagnosis has
   been unchanged for weeks — cloud mode architecturally cannot
   reach `/critique` (no Chrome MCP on the runner). Needs a decision:
   accept `/critique` as local-only ritual, find a cloud-compatible
   path, or retire the gate formally.
2. **Standing, growing: the `/oversight` promotion backlog.** 23
   pending candidates + 1 needs-user-call, now **55 days** since the
   last promotion. Three candidates sit at `7.0`; this window added
   direct evidence for two of them (three numeric fact-check fixes
   for the content-fact-vs-catalog candidate; open issue #776's
   self-contradicting install-time estimate for the
   internal-consistency-checker candidate).
3. **Standing, unclosed: orphaned duplicate GitHub issue `#719`.**
   Still open; the MobileNav focus-containment defect it names was
   fixed same-day by `6ef381e3` weeks ago (closed via a different
   issue, `#722`). Cheap to close by hand.
4. **Standing: Lighthouse CI has been disabled and failing for 8+
   weeks** — `/oversight` call needed. Unchanged since last digest.
5. **Standing: four unresolved `triage:needs-user` GitHub issues.**
   `#756` (2 days old), `#639` (11 days old), `#499` (23 days old,
   not self-resolved), `#434` (29 days old, not self-resolved).
6. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`,
   heartbeat.yml `[4.0]`) — both fixes written and verified, neither
   can ship because the cloud push credential lacks `workflows`
   scope for `.github/workflows/*.yml` edits.
7. **Standing, out-of-repo: GA `/g/collect` 503s** —
   `plan/CRITIQUE.md` pass-8 `[needs-user-call]` row, unactionable by
   any shipping skill since the analytics property lives outside the
   codebase.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (the one open row is
`/oversight`-gated). The next `/march` tick will most likely repeat
this window's pattern: a fresh reactive `/iterate` fix off a
general-purpose sweep (issue #776's pe-foam-mod self-contradiction is
sitting ready if nothing scores higher), or another `/expand` pass.
The highest-leverage next move isn't a new fix — it's an
`/oversight` pass covering, in one sitting: the standing 23-row
candidate cluster (three `7.0`s, now 55 days stale, two with fresh
evidence from this window), the Critique-gate decision (now past its
90-day milestone), the Lighthouse re-enable decision, the two
blocked workflow-permission fixes, and (small) closing the orphaned
`#719` duplicate issue by hand.

## Tuning proposals

None new this pass. 24/24 `march` runs succeeded this window — a
fully clean stretch, no infra incidents to weigh against a ceiling
or ratio. `/expand`'s 5 passes (294-298, 4 zero-candidate + 1
non-zero) is within normal cadence, not starvation — and pass 298
already captured this window's one genuine meta-signal (the
same-session fix-then-bug-in-the-fix pattern on the OG surface) as a
phase candidate rather than needing a digest-level tuning proposal.
No cron-gap evidence of the commit/24h ceiling hibernating a
productive stretch (19 substantive ticks landed roughly hourly all
window). The critique-gate staleness (now 90 days), the 23-row
`/oversight` backlog, and the four standing `triage:needs-user`
issues remain standing, already-diagnosed decisions awaiting a human
call, not new tuning signals — all covered under Needs you rather
than re-proposed here.
