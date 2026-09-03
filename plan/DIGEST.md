# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A calm ~22-hour window, mostly no-ops, with one real content
fix and one fresh content-gap filing.** Since the last digest
(`4fa20a20`, 2026-09-02T14:51:58Z), 7 cloud `march` ticks ran: 5
true no-ops (nothing to dispatch) and 2 substantive ticks — one
shipped a content-audit fix, the other filed and mirrored a new
`content-gap` finding as issue #975 (not yet drained).

**This tick's own fresh `pnpm verify` is fully clean** — all 8
legs green (typecheck, lint, test:run, test:scripts,
data:validate, build, size, e2e — 862 unit + 230 script + 1217
e2e, all passing), run as sequential foreground legs per the
standing rule. The e2e run again logged the same benign,
previously-noted `Error: Internal: NoFallbackError` stderr noise
during dynamic route requests — not attached to any failing test
(1217/1217 passed clean), unchanged shape from prior digests.
Not re-filing. Deploy is `READY` at HEAD (`b76de0c0`).

**The one shipped fix, closer look.** `e288aa37` + `a1c60c51`
rewrote the self-contradictory shipping-duration paragraph in
`divinikey-gmk-cyl-orange-alert-group-buy` — the article had
called a six-month open-to-delivery span "close-to-delivery"
while also saying the range is measured from close, an internal
contradiction caught by a fresh general-purpose sweep and fixed
same-tick (closes finding `[3.5]`, closes #974). Straightforward,
well-verified, nothing further to flag.

**The new content-gap filing (`#975`) is still open.** The
trends pillar dropped to 1 article in the rolling 30-day window
(hot-pursuit per Rule 1), so `content-gap-survey.mjs` auto-filed
a `[HOT PURSUIT] [content-gap] [7]` row proposing a "split/ergo
cohort, four months later" follow-up and mirrored it as issue
#975. The next `/march` tick should dispatch `/ship-content`
against this row — worth watching whether it drains within a
tick or two, same as prior hot-pursuit rows.

**Two mistuned-gate signals remain flagged and unaddressed, both
already filed as pending `plan/PHASE_CANDIDATES.md` rows awaiting
`/oversight` — calling them out again, per the digest's own job:**

1. **`plan/CRITIQUE.md` is now ~115 days stale** — last real pass
   (pass 11) landed 2026-05-10T20:35:00Z at commit `931c8a7`
   (2,649 commits ago). Root cause diagnosed and filed since
   2026-07-03: `[needs-user-call] [score 6.5] Critique gate
   diagnostic` — cloud mode categorically skips `/critique` (no
   Chrome MCP on the cloud runner). Still unpromoted.
2. **`/expand` cadence** — the no-candidate streak since pass
   399's asset-hygiene filing stands unchanged at 15 consecutive
   passes (400–414); no new expand pass ran in this window at
   all (0 commits touched `PHASE_CANDIDATES.md`). Still well
   under the 31–43-pass range that triggered the last
   cadence-flag cycle, so not re-escalating the score, but the
   underlying `[score 3.6] /expand dispatch cadence` candidate is
   still on record and still unpromoted.

No new tuning proposal filed this tick — both signals are already
on record; this digest is reinforcing status, not duplicating
rows.

## While you were out

| When (UTC, 09-02/09-03) | Tick | Outcome |
|---|---|---|
| 14:55→14:58 | cloud march | no-op — nothing to dispatch |
| 18:25→18:37 | cloud march | no-op — nothing to dispatch |
| 21:33→21:36 | cloud march | no-op — nothing to dispatch |
| 23:48→00:03 | cloud march | content: divinikey shipping-duration self-contradiction fixed, closes finding `[3.5]` + #974 |
| 02:47→03:08 | cloud march | content-gap: trends pillar hot-pursuit row filed + mirrored as #975 |
| 07:43→07:48 | cloud march | no-op — nothing further to dispatch this tick |
| 12:32→12:37 | cloud march | no-op — nothing to dispatch |

7 `march`-workflow runs since the last digest: **7 success, 0
failure, 0 cancelled, 5 no-ops.** `lighthouse` ran success on
both of its latest 2 completed attempts. `night` ran success on
its prior attempt (2026-09-02T~10:xx); this tick's own run is in
progress as this file writes.

## Shipped

- **content**: `divinikey-gmk-cyl-orange-alert-group-buy`'s
  Timing section shipping-estimate sentence rewritten to name
  both reference points plainly instead of contradicting itself
  (`e288aa37`, closes finding `[3.5]`, closes #974). Audit row
  closed same-tick (`a1c60c51`).

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: 1 actionable open row above the 3.0
  promotion floor — the `[HOT PURSUIT] [content-gap] [7]` trends
  pillar row (issue #975), awaiting `/ship-content` dispatch. Plus
  5 standing sub-3.0 rows, unchanged from the last digest (two
  Mode Sonnet hero-art 65%→75% redraws `[2.7]`/`[2.0]`, a
  plate-materials content-tension item `[2.4]`, a
  generated-manifest-drift observation `[2.4]`, the
  unreferenced-`favicon.svg` duplicate `[1.8]`), plus the 2
  standing `[needs-user-call]` rows (soft-404 structural
  trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`).
- **`plan/CRITIQUE.md`**: last real pass 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **~115 days stale**. Only Pending row is
  the standing non-actionable `[needs-user-call]` GA-beacon 503
  item.
- **`plan/PHASE_CANDIDATES.md`**: pass 414 (unchanged this
  window), 33 pending `[ ]` rows plus 1 standing
  `[needs-user-call]` row = 34 total. Last promotion: phase 50,
  2026-08-23 via local `/oversight`. Highest-scored pending row is
  still `[7.5]` Automated content-fact-vs-catalog numeric-spec
  audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open — `#975` (`loop:opened` +
  `source:audit` + `content`, the fresh trends content-gap row,
  awaiting `/ship-content`), `#929` (`triage:reviewed`,
  informational), and `#898` (`bug` + `triage:needs-user`, the
  `ACTIONS_PAT` workflow-scope limitation — same root cause as the
  pending `[score 5.5]` "Cloud loop cannot push
  .github/workflows/*.yml" candidate). No unlabeled issues.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web)
- `test:scripts` — 230/230 passed (83 suites)
- `data:validate` — 85 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 18 trends)
- `build` — clean production build, all routes compile
- `size` — `/page` 146.7 KB gz (budget 200 KB), `/search/page`
  144.0 KB gz (budget 175 KB) — both comfortably under budget
- `e2e` — 1217/1217 passed (~8.0m), against `next start :4173`

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`b76de0c0`) reports `READY`.

## Needs you

1. **Promote or reject the `/critique` cloud-skip diagnostic**
   (`[needs-user-call] [score 6.5]` in `PHASE_CANDIDATES.md`) — the
   fresh-eyes loop has been silent for ~115 days and the root cause
   (no Chrome MCP on the cloud runner) has been confirmed since
   expand pass 218.
2. **Look at the asset-hygiene dispatch-gap candidate**
   (`[score 5.5]`, filed pass 399) — it names a concrete mechanism
   fix (route `next: /ship-asset` AUDIT rows through `/ship-asset`
   instead of letting them sit sub-3.0 forever) and would drain the
   two standing Mode Sonnet hero-art redraw rows in the same commit.
3. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks `workflows`
   scope, blocking any cloud fix to `.github/workflows/*.yml`. Same
   root cause as the pending `[score 5.5]` candidate. Needs a token
   scope change outside the loop's own reach.
4. The 5 standing sub-3.0 AUDIT rows and 2 `[needs-user-call]` rows
   remain below (or outside) the promotion floor and are fine to
   leave — flagged here only for visibility.

## Today's intent

Top of the queue is the `#975` trends-pillar hot-pursuit content
gap — the next `/march` tick should dispatch `/ship-content`
against it. No pending phase otherwise — the loop stays in
`/iterate` mode. With AUDIT.md's other actionable queue empty and
CRITIQUE.md's queue empty, ticks after the content drain will most
likely go back to alternating between fresh general-purpose audit
sweeps and `/expand` passes, same shape as this window. Worth
watching whether the 15-pass expand no-candidate streak since
pass 399 continues climbing back toward flag territory or breaks
again soon.

## Tuning proposals

None filed this tick. The two live signals (critique staleness,
expand cadence) are already on record in `plan/PHASE_CANDIDATES.md`;
see Headline and Needs You above.
