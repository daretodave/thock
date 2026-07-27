# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~22h15m, 21-commit window — 20/20 `march` runs green — five
small drained fixes (a dead-end content promise, an a11y autoComplete
gap, a web app manifest + its own test-coverage gap, and a print
stylesheet), one new blocked finding (a second workflow-file fix the
cloud credential can't push), the routine Monday W31 trend snapshot,
and 9 more zero-candidate `/expand` passes.** Since the last digest
(`2f95e271`, 2026-07-26T11:16 UTC at commit `61aba590`) the loop
landed 21 commits: 5 fix/content/seo/test-coverage + audit-drain pairs
(work-louder-openai-codex-micro's dead-end launch promise resolved,
newsletter email `autoComplete` for WCAG 1.3.5, a web app manifest +
`viewport`/`themeColor` export, a same-week test-coverage gap on that
manifest, and a print stylesheet fixing unreadable dark-theme text on
paper/PDF), 1 filed-but-blocked finding (heartbeat.yml's wedged-run
dedup search doesn't scope by workflow name — fix written, verified,
and reverted because the cloud push credential still lacks
`workflows` scope, same standing wall as the March.yml row), 1 routine
data commit (the Monday 2026-W31 trend snapshot), and 9 `/expand`
passes (237–245, all zero-diff — no new candidates surfaced or
updated). This tick's own fresh `pnpm verify` is green across all
seven legs, run as sequential foreground blocking calls: typecheck (8
packages), 711 web unit tests / 99 files (up from 706/98), 168 script
tests / 61 suites (unchanged), 75 data records / cross-refs resolve
(up from 74 — trends 12→13 from the W31 snapshot), build — all
canonical routes generated, homepage bundle 108.7 KB / 200 KB
(unchanged), and **1083/1083 e2e** (up from 1080). Deploy is `READY`
at HEAD (`d5470b7d`).

`plan/CRITIQUE.md` is still **78 days / 1716 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis from prior digests: cloud mode architecturally cannot reach
`/critique` (no Chrome MCP on the runner), and every commit in this
window again carries the `Cloud-Run:` trailer, so the gap keeps
growing by construction until a human decision lands.
`plan/PHASE_CANDIDATES.md` holds at **18 pending rows + 1
needs-user-call** (unchanged count), now **46 days** since the last
promotion (2026-06-11, 8 candidates including phases 43/44/45). One
correction from prior digests: `plan/AUDIT.md` actually carries **4**
open rows, not 1 — the Lighthouse-CI row prior digests tracked, plus
two pre-existing non-autonomous rows (march.yml crash-gate `[6.3]`,
filed 2026-07-05; soft-404 `[needs-user-call]` `[4.2]`, filed
2026-07-18) that earlier digests undercounted, plus this window's new
heartbeat.yml row. All four are `/oversight`-gated or blocked, not
actionable by an autonomous tick — see Needs You.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-26 12:01 | expand | pass 237 — no candidates (zero-diff window) |
| 07-26 12:40-12:41 | iterate | content — work-louder-openai-codex-micro dead-end launch promise resolved `[3.5]` (`e2972676`/`c3a673f4`) |
| 07-26 13:42 | expand | pass 238 — no candidates (zero-diff window) |
| 07-26 15:28 | expand | pass 239 — no candidates (zero-diff window) |
| 07-26 16:38 | expand | pass 240 — no candidates (zero-diff window) |
| 07-26 17:53 | iterate | audit — heartbeat.yml wedged-run dedup fix written + verified, **blocked** on push (`workflows` scope) `[4.0]` (`d9dd914a`) |
| 07-26 18:32 | expand | pass 241 — no candidates (zero-diff window) |
| 07-26 19:45 | expand | pass 242 — no candidates (zero-diff window) |
| 07-26 20:27 | expand | pass 243 — no candidates (zero-diff window) |
| 07-26 22:36 | iterate | a11y — newsletter email input missing `autoComplete` for WCAG 1.3.5 `[5.4]` (`c76fec98`/`79898e5c`) |
| 07-26 23:43 | expand | pass 244 — no candidates (zero-diff window) |
| 07-27 01:58 | data | routine Monday snapshot — `data/trends/2026-W31.json` (`d246a305`) |
| 07-27 03:24-03:25 | iterate | seo — web app manifest + `viewport`/`themeColor` export `[3.6]` (`aef0230d`/`89ef5291`) |
| 07-27 05:39-05:40 | iterate | test-coverage — `manifest.ts` + `viewport` gain unit tests `[3.2]` (`6b36e6cd`/`b19479b6`) |
| 07-27 07:20 | expand | pass 245 — no candidates (zero-diff window) |
| 07-27 09:31 | iterate | bug — print stylesheet added; dark-theme text was unreadable on paper/PDF `[4.0]` (`d07606b6`/`d5470b7d`) |

21 commits total in the window (~22h15m, `2f95e271` → `d5470b7d`). All
20 `march`-workflow runs since 2026-07-26T11:16 UTC report `success` —
no crash-issue-gate recurrence this window.

## Shipped

- **content**: work-louder-openai-codex-micro's dead-end "thock will
  cover the launch itself" promise resolved with an inline Update
  callout citing the confirmed $230/July 15 launch, retargeting the
  stale tracker link.
- **a11y**: newsletter email `<input>` gains `autoComplete="email"`
  (WCAG 1.3.5).
- **seo**: new `apps/web/src/app/manifest.ts` (name/short_name
  "thock", brand `theme_color`/`background_color`, icons) plus a
  `viewport` export on the root layout — mobile browser chrome and
  Android install banners now carry the brand color.
- **test-coverage**: same-week follow-up closing the new manifest
  route's zero-coverage gap — a ~30-line Vitest asserting shape,
  hex-format colors, and resolvable icon paths.
- **bug**: print stylesheet added — an `@media print` block hiding
  chrome (`header`/`footer`/`nav`/`.skip-link`) and forcing black-on-
  transparent text, verified against a real Chromium print pipeline
  (not just computed styles) on a live article. Every one of the
  site's 72 articles/guides was affected identically; total functional
  break for the print/PDF path, now fixed.
- **blocked**: the heartbeat.yml wedged-run dedup-scoping fix (same
  bug class and same push-permission wall as the standing march.yml
  `[6.3]` row) was written, verified through the full gate, then
  reverted locally rather than left unpushed — ready to apply verbatim
  once the workflow-file push credential is resolved.
- **data**: routine Monday W31 trend snapshot — no schema or
  cross-ref changes.
- **expand**: 9 passes (237–245), all zero-diff — every mechanical
  survey (content-gap, crosslink, group-buy-companion, group-buy-
  status, newsletter-gap, og-coverage, a11y-spec-coverage) re-ran
  clean, no new candidates filed or updated.

## Queues now

- **Build plan**: 0 pending phases (51 shipped, unchanged) — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged — every
  `[cross-links]`-category AUDIT row is `[x]`.
- **`plan/AUDIT.md`**: **4 open rows** (782 addressed). `[6.3]`
  march.yml crash-gate (blocked-cloud-permission, filed 2026-07-05);
  `[4.0]` Lighthouse-CI disabled (`next: /oversight call`, filed
  2026-07-18); `[needs-user-call] [4.2]` soft-404 structurally blocked
  (filed 2026-07-18); `[4.0]` heartbeat.yml dedup (blocked-cloud-
  permission, **new this window**, filed 2026-07-26). All four are
  non-autonomous — either genuinely blocked on the cloud push
  credential or gated to `/oversight`.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **78 days / 1716 commits stale.** Diagnosis
  unchanged from prior digests: cloud mode architecturally cannot
  reach `/critique` (no Chrome MCP; every commit this window again
  carries `Cloud-Run:`). The standing `[6.5]` candidate remains a
  `[needs-user-call]` decision row.
- **`plan/PHASE_CANDIDATES.md`**: **18 pending rows + 1
  needs-user-call** (unchanged count), **46 days** since the last
  promotion (2026-06-11, 8 candidates including phases 43/44/45). Top
  of the cluster: `[7.0]` trend-snapshot data-quality gate, `[7.0]`
  content-fact-vs-catalog numeric-spec audit, `[7.0]` article
  internal-consistency checker, `[6.5]` `/quiz/board`, `[6.5]` stale
  group-buy frontmatter/prose gate, `[6.5]` sitewide focus-visible
  default + coverage check, `[6.5]` needs-user-call critique-gate
  decision.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work; a future `/ship-data` tick should move them to `## Done`).
- **Triage**: 13 open issues (up from 12 — `#620` new this window,
  mirroring the heartbeat.yml AUDIT row), 0 unlabeled. 8 duplicate
  content-gap issues (`#414-#416`, `#418-#422`) still await a manual
  consolidation pass. Two `triage:needs-user` issues unresolved:
  `#434` (Vercel never ingested commit `e312e09`, now 17 days old) and
  `#499` (night digest crashed, now 11 days old). `#395` and `#437`
  are stable.
- **Expand cadence**: 9 passes this window (237–245, all nothing) —
  all mechanical surveys ran clean every pass.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as seven sequential blocking
legs (typecheck → test:run → test:scripts → data:validate → build →
size → e2e) — all green:

- `typecheck` — green, all 8 workspace packages.
- `test:run` — green, 711 web unit tests (99 test files, up from
  706/98); tokens/seo/data/ui/e2e-fixtures/content packages all green
  and unchanged.
- `test:scripts` — green, 168 tests / 61 suites, unchanged.
- `data:validate` — green, 75 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 13
  trend weeks — trends up from 12, the routine W31 snapshot).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1083/1083**, up from 1080 (new tests from the
  manifest-coverage and print-stylesheet-adjacent work this window).
- `pnpm deploy:check` at HEAD (`d5470b7d`) — deploy `READY`
  (`dpl_4u6XJtBX`).
- `lighthouse` — the `gh run list --workflow lighthouse` pulse command
  still can't resolve the disabled workflow by display name (a known
  quirk, not a new failure — see standing `[4.0]` AUDIT.md row). No
  new signal this window.

One non-blocking observation, repeated from the last several digests:
the e2e run's server stderr again logged `NoFallbackError` several
dozen times against the five `dynamicParams = false` routes
(`/part/[kind]`, `/part/[kind]/[slug]`, `/vendor/[slug]`,
`/trends/tracker/[week]`, `/newsletter/[slug]`) — this is Next's
expected internal log for the not-found-page e2e tests hitting a
param outside the pre-generated set, not a real failure. Every one of
the 1083 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this tick.

## Needs you

1. **New: a second blocked-cloud-permission row joined the standing
   one this window.** heartbeat.yml's wedged-run dedup-scoping fix
   (same shape as the march.yml `[6.3]` row from 2026-07-05) is
   written and verified but can't ship — the cloud push credential
   still lacks `workflows` scope for any `.github/workflows/*.yml`
   edit. The `[5.5]` PHASE_CANDIDATES row on this exact gap ("Cloud
   loop cannot push workflow-file changes") now has two concrete fixes
   waiting behind it, not one. A local `/oversight` session re-scoping
   the PAT (or accepting workflow-file edits as local-only) unblocks
   both at once.
2. **Standing: AUDIT.md's true open-row count was undercounted in
   prior digests.** The march.yml `[6.3]` and soft-404 `[4.2]` rows
   existed before this window (filed 2026-07-05 and 2026-07-18) but
   weren't reflected in the last several digests' "1 open row" framing.
   Worth a glance at how the pulse-gathering step counts AUDIT rows —
   possibly just a case of only checking for new rows against a
   remembered baseline instead of a fresh full-file scan each tick.
3. **Standing: the sitewide focus-visible candidate remains the
   single highest-leverage promotion still available.** 12 instances
   fixed reactively one component at a time; a shared `:focus-visible`
   default plus a mechanical coverage check would end the pattern for
   good. No new instances this window.
4. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 78 days / 1716 commits since pass 11. Cloud mode can't
   reach `/critique` (no Chrome MCP on the runner); every commit since
   2026-07-03 has been cloud-only. Needs a decision: accept
   `/critique` as local-only ritual, find a cloud-compatible path, or
   something else.
5. **Standing: Lighthouse CI has been disabled and failing for 6+
   weeks — `/oversight` call needed.** Unchanged since last digest.
6. **Standing, growing: the `/oversight` promotion backlog.** 18
   pending candidates + 1 needs-user-call, now **46 days** since the
   last promotion. Three candidates sit at 7.0, several more at 6.5.
7. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (17 days old) and `#499` (11 days old). Neither self-
   resolved.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all four open rows are
blocked or `/oversight`-gated). The next `/march` tick will most
likely repeat this window's pattern: another `/expand` pass, or a
fresh reactive `/iterate` fix off a general-purpose sweep. The
highest-leverage next move isn't a new fix — it's an `/oversight` pass
covering, in one sitting: the workflow-file push-permission wall (now
blocking two written fixes, not one), the focus-visible default (stops
a 12-instance drain immediately), the Critique-gate decision, and the
growing 19-row candidate cluster.

## Tuning proposals

None new this pass. The one meta-loop-relevant signal this window —
prior digests undercounting `plan/AUDIT.md`'s open-row total — is
noted above under Needs You rather than proposed as a gate change: it
reads as a one-off gathering-step slip (comparing against a remembered
baseline instead of re-scanning the full file each tick) rather than a
structural mistuning that needs a rule change. If a future digest
repeats the same undercount, that would upgrade it to a tuning
proposal for the pulse-gathering step in `skills/digest.md` Step 2. No
other mistuned gate, cadence, or ceiling surfaced this window.
