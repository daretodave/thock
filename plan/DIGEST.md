# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean 23h41m, 29-commit window — 22/22 `march` runs green — with a
contained 2-instance undefined-Tailwind-token bug class (both fixed
same-tick as found, and a fresh systematic token-grep this window
turned up nothing further), and a second content-fabrication finding
(a fabricated group-buy open date) landing right after the window's
last `/expand` pass, so it hasn't been assessed against the first
fabrication instance yet.** Since the last digest (`536743fe`,
2026-07-25T11:09:07Z) the loop landed 29 commits: 10 fix/content/seo
+ audit-drain pairs (an archive empty-state contrast fix, a vendor
group-buy sort-order fix, RSS autodiscovery markup, 2 InlineViz
additions to an existing group-buy article, a fabricated trend-data
correction, an InlineViz color-prop typo across 6 diagrams, OG alt
text for `/part/[kind]` images, two undefined-Tailwind-token fixes,
and a fabricated group-buy date correction), and 9 `/expand` passes
(226, 227–233, 236: 226 updated the standing focus-visible candidate
in place with its 11th + 12th instances, the rest were zero-diff
windows — note passes 234–235 were never dispatched, not a gap in
this file; `/expand` only fires when `/iterate`'s failure-mode 6 or
march's own Step 3c cadence gate triggers it, and 3 of the intervening
`march` ticks dispatched `/iterate` fixes instead). This tick's own
fresh `pnpm verify` is green across all seven legs: typecheck (8
packages), 706 web unit tests / 98 files (up from 700/97), 168 script
tests / 61 suites (unchanged), 74 data records (cross-refs resolve,
unchanged), build — all canonical routes generated, homepage bundle
108.7 KB / 200 KB (unchanged), and **1080/1080 e2e** (up from 1074).
Deploy is `READY` at HEAD (`61aba590`).

`plan/CRITIQUE.md` is still **76 days / 1694 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis from prior digests: cloud mode architecturally cannot reach
`/critique` (no Chrome MCP on the runner), and every commit in this
window again carries the `Cloud-Run:` trailer, so the gap keeps
growing by construction until a human decision lands.
`plan/PHASE_CANDIDATES.md` holds at **18 pending rows + 1
needs-user-call** (unchanged count — this window's one update landed
in an existing row), now **45 days** since the last promotion
(2026-06-11, phases 43/44/45). No `march` runs failed this window
(22/22 green).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-25 11:39 | expand | pass 226 — 1 candidate updated in place (focus-visible, 11th + 12th instances) |
| 07-25 12:49-12:51 | iterate | a11y — archive empty-state `text-text-3` → `text-text-2` contrast fix `[3.6]` (`d2c83b22`/`b0ca8677`) |
| 07-25 13:37 | expand | pass 227 — no candidates (zero-diff window) |
| 07-25 15:37 | expand | pass 228 — no candidates (zero-diff window) |
| 07-25 16:40 | iterate | fix — vendor page group-buy sort buries soonest-closing active buy `[4.0]` (`8a45f670`/`603fb651`) |
| 07-25 18:08-18:09 | iterate | seo — RSS autodiscovery `<link>` markup on homepage + pillar pages `[5.4]` (`dade5098`/`128aed51`) |
| 07-25 18:27 | expand | pass 229 — no candidates (zero-diff window) |
| 07-25 19:40 | expand | pass 230 — no candidates (zero-diff window) |
| 07-25 21:21 | expand | pass 231 — no candidates (zero-diff window) |
| 07-25 22:37 | iterate | content — cannonkeys-blaine-v2-se-group-buy adds 2 InlineViz (mount menu + plate material) `[3.6]` (`bd982b3b`/`8be73953`) |
| 07-25 23:46-23:47 | iterate | data — cherry-xtrfy-tmr-pivot quotes fabricated W22 trend values as fact `[4.2]` (`e88569dd`/`84e73a8a`) |
| 07-26 00:57 | expand | pass 232 — no candidates (assessed the fabrication fix above as single-instance, no new candidate) |
| 07-26 01:51 | iterate | fix — InlineViz `accent="ochre"` typo drops connector color on 6 diagrams `[4.5]` (`6b9447b2`/`9ebee413`) |
| 07-26 05:26 | iterate | seo — `/part/[kind]` OG image handler gains alt text `[7.2]` (`a74a5db6`/`6f46bb70`) |
| 07-26 07:14 | expand | pass 233 — no candidates (zero-diff window) |
| 07-26 08:13-08:14 | iterate | fix — undefined `surface-1/2/3` Tailwind tokens break skeletons/hover/borders `[5.4]` (`522c13d2`/`3c1734a9`) |
| 07-26 09:08-09:09 | iterate | fix — `/search` PartResult heading uses undefined `text-h4` token `[5.4]` (`20ac1cce`/`833dc1d3`) |
| 07-26 09:55 | expand | pass 236 — no candidates (ran a systematic Tailwind-token grep sweep following the two token fixes above; found nothing further) |
| 07-26 10:50-10:51 | iterate | content — prototypist-vendor-spotlight fabricates a March 31 Paper 65 open date `[4.2]` (`ceffda9d`/`61aba590`) |

29 commits total in the window (~23h41m, `536743fe` → `61aba590`).
All 22 `march`-workflow runs since 2026-07-25T11:26 UTC report
`success` — no crash-issue-gate recurrence this window.

## Shipped

- **a11y**: archive empty-state text contrast bumped to WCAG AA
  (`text-text-3` → `text-text-2`).
- **bug**: undefined-Tailwind-token class hit twice in one window —
  `surface-1`/`surface-2`/`surface-3` (skeletons, hover states,
  borders) and `/search` PartResult's heading (`text-h4`). Both
  shipped same-tick as found; the pass-236 expand tick ran a fresh
  systematic grep across every `text-`/`bg-`/`border-`/`ring-`/
  `from-`/`to-`/`accent-`/`decoration-`/`fill-`/`stroke-` usage
  against the real token set and found no further instances — treat
  as contained for now, not (yet) a recurring class on the scale of
  the standing focus-visible candidate.
- **content (fabrication)**: two independent findings, same failure
  shape — an article states an authoritative-sounding fact that
  contradicts the `data/trends/` tracker record. `cherry-xtrfy-tmr-
  pivot.mdx` quoted W22 spark values with no historical basis (baked
  into two hand-authored SVG charts); `prototypist-vendor-spotlight
  .mdx` stated a specific "March 31" Paper 65 open date three times,
  contradicted by the W28/W29/W30 tracker notes which all described
  the kit as merely "teased." The first was assessed by expand pass
  232 and ruled single-instance; the second landed after the window's
  last expand pass (236) and hasn't been assessed yet — see Needs You.
- **fix**: vendor page group-buy sort no longer buries the
  soonest-closing active buy; InlineViz `accent="ochre"` typo
  (should've been a valid token) was silently dropping connector
  color on 6 diagrams.
- **content**: cannonkeys-blaine-v2-se-group-buy gains 2 InlineViz
  (mount menu + plate material) — closes an audit-flagged coverage
  gap, not new editorial output.
- **seo**: RSS autodiscovery `<link>` markup added to homepage +
  pillar pages; `/part/[kind]` OG image handler gains alt text.
- **expand**: 9 passes (226–233, 236). Pass 226 updated the standing
  focus-visible candidate in place (11th + 12th instances); 227–233
  were zero-diff windows; 236 ran a fresh token-grep sweep prompted
  by this window's 2 undefined-token fixes and came back clean.

## Queues now

- **Build plan**: 0 pending phases (51 shipped, unchanged) — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged — every
  `[cross-links]`-category AUDIT row is `[x]`.
- **`plan/AUDIT.md`**: 1 open row, unchanged from several digests
  running: `[4.0]` Lighthouse-CI disabled (still `next: /oversight
  call`). Every other finding this window was filed and drained
  same-tick, including both undefined-token fixes and both
  fabrication fixes.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **76 days / 1694 commits stale.** Diagnosis
  unchanged from prior digests: cloud mode architecturally cannot
  reach `/critique` (no Chrome MCP; every commit this window again
  carries `Cloud-Run:`). The standing `[6.5]` candidate remains a
  `[needs-user-call]` decision row.
- **`plan/PHASE_CANDIDATES.md`**: **18 pending rows + 1
  needs-user-call** (unchanged count), **45 days** since the last
  promotion (2026-06-11, phases 43/44/45). Top of the cluster: `[7.0]`
  trend-snapshot data-quality gate, `[7.0]` content-fact-vs-catalog
  numeric-spec audit (7 instances), `[7.0]` article internal-
  consistency checker (5 instances), `[6.5]` `/quiz/board`, `[6.5]`
  stale group-buy frontmatter/prose gate, `[6.5]` sitewide
  focus-visible default + coverage check (12 instances, unchanged
  this window — no new focus-visible fixes shipped since pass 226).
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work; a future `/ship-data` tick should move them to `## Done`).
- **Triage**: 12 open issues, unchanged shape — 0 unlabeled. 8
  duplicate content-gap issues (`#414-#416`, `#418-#422`) still await
  a manual consolidation pass. Two `triage:needs-user` issues
  unresolved: `#434` (Vercel never ingested commit `e312e09`, now 16
  days old) and `#499` (night digest crashed, now 10 days old). `#395`
  and `#437` are stable.
- **Expand cadence**: 9 passes this window (226: candidate updated;
  227-233, 236: nothing) — all mechanical surveys ran clean every
  pass.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as seven sequential blocking
legs (typecheck → test:run → test:scripts → data:validate → build →
size → e2e) — all green:

- `typecheck` — green, all 8 workspace packages.
- `test:run` — green, 706 web unit tests (98 test files, up from
  700/97); tokens/seo/data/ui/e2e-fixtures/content packages all green
  and unchanged.
- `test:scripts` — green, 168 tests / 61 suites, unchanged.
- `data:validate` — green, 74 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 12
  trend weeks — unchanged).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1080/1080**, up from 1074 (new tests from the
  content-contrast and RSS-autodiscovery fixes this window).
- `pnpm deploy:check` at HEAD (`61aba590`) — deploy `READY`
  (`dpl_BkNF3UhN`).
- `lighthouse` — the `gh run list --workflow lighthouse` pulse
  command still can't resolve the disabled workflow by display name
  (a known quirk, not a new failure — see standing `[4.0]` AUDIT.md
  row). No new signal this window.

One non-blocking observation, repeated from the last several digests:
the e2e run's server stderr again logged `NoFallbackError` several
dozen times against the five `dynamicParams = false` routes
(`/part/[kind]`, `/part/[kind]/[slug]`, `/vendor/[slug]`,
`/trends/tracker/[week]`, `/newsletter/[slug]`) — this is Next's
expected internal log for the not-found-page e2e tests hitting a
param outside the pre-generated set, not a real failure. Every one of
the 1080 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New: a second content-fabrication finding landed after this
   window's last `/expand` pass — worth a look next pass.** Two
   independent findings this window share the same shape: an article
   states a specific, authoritative-sounding fact (a trend-score
   history, a group-buy open date) that directly contradicts the
   `data/trends/` tracker record. Pass 232 assessed the first
   (`cherry-xtrfy-tmr-pivot`) as single-instance and correctly held
   off filing a candidate. The second (`prototypist-vendor-spotlight`,
   `ceffda9d`) shipped at 10:50 UTC, after pass 236 (09:55) — no
   expand pass has weighed the two together yet. Whether this clears
   the "3+ same category" bar or stays a coincidence is a call for the
   next `/expand` tick, not this digest.
2. **Standing: the sitewide focus-visible candidate held steady this
   window (12 instances, no new ones) but remains unpromoted since
   2026-07-22.** This is the single highest-leverage promotion still
   available — a shared `:focus-visible` default plus a mechanical
   coverage check would end the reactive one-component-at-a-time
   pattern for good.
3. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 76 days / 1694 commits since pass 11. Cloud mode
   can't reach `/critique` (no Chrome MCP on the runner); every
   commit since 2026-07-03 has been cloud-only. Needs a decision:
   accept `/critique` as local-only ritual, find a cloud-compatible
   path, or something else.
4. **Standing: Lighthouse CI has been disabled and failing for 6+
   weeks — `/oversight` call needed.** Unchanged since last digest.
5. **Standing, growing: the `/oversight` promotion backlog.** 18
   pending candidates + 1 needs-user-call, now **45 days** since the
   last promotion. Three candidates sit at 7.0, several more at 6.5.
6. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (16 days old) and `#499` (10 days old). Neither self-
   resolved.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (the sole open row is
`/oversight`-gated). The next `/march` tick will most likely repeat
this window's pattern: another `/expand` pass (which should weigh the
two content-fabrication instances together), or a fresh reactive
`/iterate` fix. The highest-leverage next move isn't a new fix — it's
an `/oversight` pass over the candidate cluster: the focus-visible
default (stops a 12-instance drain immediately), the two
content-accuracy checker candidates (7 + 5 instances, fully scoped),
and the Critique-gate decision.

## Tuning proposals

None new this pass. This window's dominant meta-loop-relevant
signal — two undefined-Tailwind-token bugs in one window — was
already self-corrected by expand pass 236's fresh token-grep sweep,
which found no further instances; a standing mechanical check isn't
yet justified off 2 instances the way the focus-visible class earned
one off 12. The `/expand` pass-numbering gap noted in "While you were
out" (234–235 never dispatched) is expected behavior, not a mistuned
gate — `/expand` only fires on `/iterate`'s failure-mode 6 or march's
own cadence gate, and confirming this cost a few extra `grep`/`git
log` calls this tick but surfaced no bug. No mistuned gate, cadence,
or ceiling surfaced this window beyond what prior digests have
already flagged.
