# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23.6h window — 24/24 completed `march` runs succeeded, 0
failures — 10 substantive ticks (9 shipped fix/data/content pairs +
1 `expand` zero-candidate pass) for 19 commits total, the other 14
completed runs landing as silent no-ops.** Since the last digest
(`3d924a87`, 2026-08-12T11:11:33 UTC) the loop drained **9** findings.
The window closes out yesterday's top "Needs you" item first thing:
`c1a17004` vendors Newsreader/IBM Plex Sans/JetBrains Mono locally in
`layout.tsx`, matching the OG-render path's existing precedent — the
`next/font/google` fetch fragility flagged in the last digest is now
hardened, and (see Breadth verdict) this tick's build had zero
retries as a result. The dominant shape of the rest of the window is
a **trends-tracker sparkline data-quality cluster**: 4 of the 9
fix/data ticks (`a9f41545` W31/W32 shift-and-append repair,
`6b9500b3` W29 GMK CYL/DCS post-close fabricated-decline repair,
`59a4b2bc` a full origin-to-present recomputation after realizing the
two spot-fixes earlier in this *same window* had each cascaded from
an already-wrong predecessor, and `a6d2fd84` a 4-entity-rename
join-gap repair found by re-auditing that "full repair" for scope)
are all instances of the already-Pending `[7.5]` "Trend-snapshot
data-quality gate" candidate — see "Needs you," this is now urgent.
Smaller shape: a real data-hygiene gap (missing vendor `prototypist`,
closes #839) surfaced a same-vendor cross-week note self-contradiction
(`725e81e5`, closes #840, W31 said "Aug/Sept 2026" then W32 reverted
to "Q4 2026" while claiming "no date change this week" — a new
cross-week sub-shape of the same sparkline-cluster candidate); a
mechanical stale-group-buy-status catch (`8f2be166`, closes #844); and
a newsletter plateau-week miscount (`95bef593`, closes #846, the
recurring "newest newsletter issue contradicts its own cited tracker
data" pattern).

**This tick's own fresh `pnpm verify` was clean start to finish — all
8 legs green on the first attempt, no retries, no new `plan/AUDIT.md`
row needed.** typecheck (9 packages), lint (all workspaces, `next
lint`'s Next-16-deprecation notice is cosmetic), 1198 unit tests
across 7 workspaces (828 web + 157 content + 129 data + 44 seo + 31
ui + 6 e2e + 3 tokens — unchanged from the last digest), 207 script
tests / 74 suites (unchanged), 81 data records / cross-refs resolve
(up from 80 — the new Prototypist vendor record), homepage bundle
108.7 KB / 200 KB (unchanged), and 1143/1143 e2e (up from 1140).
Deploy is `READY` at HEAD (`70b3635f`, `dpl_CsNvF4A4`).

`plan/CRITIQUE.md` is now **95 days / 2248 commits** since its last
pass (11, 2026-05-10T20:28 UTC at commit `931c8a7`) — unchanged
architectural diagnosis (no Chrome MCP on the cloud runner).
`plan/PHASE_CANDIDATES.md` holds **24 pending rows**, unchanged count
this window, **61 days** since the last promotion (2026-06-14, phases
46-49). `plan/AUDIT.md` carries **5 open rows**, all standing
non-autonomous items, unchanged — this tick's breadth check filed no
new row. Confirmed via the GitHub API this tick: `lighthouse.yml` is
still `disabled_manually` (disabled 2026-06-14T23:59:43 UTC, ~60 days
now).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-12 13:48 | fix | layout.tsx fonts — vendor Newsreader/IBM Plex Sans/JetBrains Mono locally, closes last digest's `[4.2]` AUDIT row (`c1a17004`/`1b1ab665`) |
| 08-12 15:49 | data | add vendor prototypist `[4.8]` (`9f1c1740`/`68ad5c34`, closes #839) |
| 08-12 17:35 | content | prototypist trend-note/article date contradiction `[5.5]` (`725e81e5`/`1a02b510`, closes #840) |
| 08-12 22:38 | data | trends tracker W31/W32 sparkline shift-and-append repair `[3.5]` (`a9f41545`/`87c11556`, closes #841) |
| 08-12 23:32 | data | trends tracker W29 GMK CYL/DCS post-close score repair `[4.2]` (`6b9500b3`/`1ae5c353`, closes #842) |
| 08-13 01:46 | data | novelkeys-gmk-cyl-og-extensions status stale — flip to closed `[3.6]` (`8f2be166`/`89406205`, closes #844) |
| 08-13 04:55 | content | newsletter issue 07 — Hall Effect/Rapid Trigger plateau-week miscount `[4.0]` (`95bef593`/`5d273313`, closes #846) |
| 08-13 08:53 | data | trends tracker sparkline convention — full origin-to-present repair `[3.5]` (`59a4b2bc`/`91a10a35`, closes #847) |
| 08-13 09:32 | expand | pass 313 — 0 candidates filed (`4ccd77a9`) |
| 08-13 10:48 | data | trends tracker sparkline — repair 4 entity-rename join gaps `[3.5]` (`a6d2fd84`/`70b3635f`, closes #848) |

24 `march`-workflow runs since 2026-08-12T11:11:33 UTC: **24
completed, all `success`, 0 `failure`, 0 `cancelled`** — a fully
clean window. `night` (prior run 2026-08-12, success) green; this
tick is the current `night` run. 10 of the 24 completed runs produced
a commit (9 fix/data/content ticks, each a two-commit audit+fix pair,
plus 1 expand pass = 19 commits); the other 14 completed runs were
silent no-ops.

## Shipped

- **Font-fetch fragility hardened**: `layout.tsx`'s three
  `next/font/google` bindings now vendor their font files locally,
  closing out the `[4.2]` row the last digest filed after its own
  build leg flaked on a live Google-fonts fetch.
- **Trends-tracker sparkline cluster (4 fixes)**: W31/W32
  shift-and-append repair, W29 GMK CYL/DCS post-close fabricated-decline
  repair, a full origin-to-present recomputation (after finding the
  window's own earlier spot-fixes had each cascaded from an
  already-wrong predecessor), and a 4-entity-rename join-gap repair
  found by re-auditing that "full repair" for scope. All four are
  instances of the already-Pending `[7.5]` data-quality-gate
  candidate — see "Needs you."
- **Catalog + content hygiene**: added the missing `prototypist`
  vendor record (closes #839), then caught and fixed a cross-week
  note self-contradiction on that same vendor's tracker rows (W31 vs
  W32 fulfillment-date framing); flipped a stale `novelkeys-gmk-cyl-og-extensions`
  group-buy status past its `endDate`; corrected a newsletter
  plateau-week miscount against the tracker's own W31-W33 data.

## Queues now

- **Build plan**: all 49 phases shipped, 0 pending. No phase work
  queued.
- **Cross-link drain**: 0 open `[cross-links] [4.5]` rows — fully
  drained.
- **Critique**: pass 11, 2026-05-10 — **95 days / 2248 commits**
  stale. Diagnosed as architectural (no Chrome MCP on the cloud
  runner), not neglect. Unchanged from prior digests.
- **Phase candidates**: 24 pending in `plan/PHASE_CANDIDATES.md`,
  unchanged count this window. 61 days since the last `/oversight`
  promotion (2026-06-14, phases 46-49). The `[7.5]` trend-snapshot
  data-quality candidate is now the most-reinforced Pending row in
  the queue (6+ expand passes, ~20 instances) — see "Needs you."
- **Data backlog**: unchanged bookkeeping quirk noted in prior
  digests — `data/BACKLOG.md`'s "Pending" section lists 3 rows, all
  already `[x]`-checked with records already shipped; never moved to
  "## Done." Cosmetic only, `/ship-data` already treats it as empty.
- **Open GitHub issues**: 20 open (up from 18), 0 unlabeled (triage
  gate clean). 4 labeled `triage:needs-user` (#756, #639, #499, #434
  — all historical cloud-march/deploy-check or digest-crash reports,
  no new ones this window).

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 packages.
- `lint` — green, all lintable workspaces (`next lint` prints a
  Next-16 deprecation notice; cosmetic, not a failure).
- `test:run` — green, **1198 tests / 173 files** across 7 workspaces
  (828 web + 157 content + 129 data + 44 seo + 31 ui + 6 e2e + 3
  tokens) — unchanged from the last digest.
- `test:scripts` — green, **207 tests / 74 suites** — unchanged.
- `data:validate` — green, **81 records** (up from 80 — the new
  Prototypist vendor record), all cross-refs resolve.
- `build` — green, **first attempt, no retries** — the font-vendoring
  fix that shipped earlier this window resolved the fragility the
  last digest flagged.
- `size` — green, homepage bundle 108.7 KB / 200 KB budget —
  unchanged.
- `e2e` — green, **1143/1143** (up from 1140). Console noise from
  intentional not-found-route `NoFallbackError` probes during the
  run is expected, not a regression.
- `pnpm deploy:check` at HEAD (`70b3635f`) — deploy `READY`
  (`dpl_CsNvF4A4`).

Zero red legs this tick — nothing new filed to `plan/AUDIT.md`.

## Needs you

1. **Escalating: the Pending `[7.5]` "Trend-snapshot data-quality
   gate" candidate is now overdue for promotion.** It picked up its
   16th-19th instances at expand pass 313 this morning, and a 20th
   (`a6d2fd84`, the entity-rename join-gap repair) landed *after*
   that pass ran — so even pass 313's count already undersells the
   current total. Four of this window's nine ticks alone were this
   same defect class, including a "full origin-to-present repair"
   that itself needed a follow-up fix hours later. The candidate's
   proposed scope is fully drafted (`scripts/trend-snapshot-quality-check.mjs`,
   including a spark-array-vs-direction/score consistency check that
   would have caught 3 of this window's 4 instances mechanically) and
   has sat Pending since 2026-07-21 (pass 207), reinforced at 6+
   subsequent passes without promotion. This is the strongest
   candidate in the queue for the next `/oversight` promotion pass —
   the site's signature feature keeps shipping schema-valid-but-wrong
   data on an unattended weekly cron, and reactive spot-fixing has
   visibly hit diminishing returns (each fix needing its own
   follow-up fix, twice this window).
2. **Standing: `/critique` is 95 days / 2248 commits stale.**
   Diagnosis unchanged — cloud mode architecturally cannot reach
   `/critique` (no Chrome MCP on the runner).
3. **Standing: Lighthouse CI disabled ~60 days**, `[4.0]`
   `plan/AUDIT.md` row, `needs: /oversight call` on whether to
   re-enable now or investigate the original disable reason first.
   Confirmed still `disabled_manually` via the GitHub API this tick.
4. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[blocked-cloud-permission] [6.3]`/`[4.0]` AUDIT rows,
   companion `[5.5]` candidate, open issue `#395`). No PAT/App scope
   currently satisfies GitHub's workflow-write restriction. Unchanged.
5. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`[4.2]`) and **mirrored `loop:opened` issue drain gap** (`[3.0]`)
   — both non-autonomous, unchanged.
6. **Standing, growing: the `/oversight` promotion backlog.** 24
   candidates pending, flat this window, 61 days since the last
   promotion. Item 1 above is the clearest single candidate to act on
   next.

## Today's intent

No pending build-plan phase — the loop stays in maintenance mode.
This tick's breadth check was fully clean, so there's no fresh
autonomously-actionable AUDIT.md row to point the next `/iterate`
tick at; expect it to keep running fresh general-purpose sweeps, and
given this window's rate, a 21st sparkline-cluster instance surfacing
before `/oversight` promotes the data-quality gate (item 1 above)
would be the clearest possible signal that spot-fixing alone is no
longer sufficient for this surface.

## Tuning proposals

None filed this tick. The one gate-shaped issue in the pulse — the
trends-tracker sparkline cluster's escalating recurrence — already
has a fully-scoped Pending candidate in `plan/PHASE_CANDIDATES.md`
(reinforced by `/expand` pass 313 this morning); flagging its
promotion urgency belongs in "Needs you" above, not a duplicate
candidate. Everything else in the pulse reads as expected: `/expand`
filed 0 new candidates and correctly reinforced existing ones in
place, the ceiling isn't hibernating (24/24 clean march runs, 10
substantive ticks), and `/digest`'s own breadth check needed no
follow-up.
