# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Another quiet window — 6 completed cloud `march` ticks since the
last digest (`e44f2fd0`, 2026-09-18T14:48:26Z), 1 shipped a
plan-only audit row, 5 no-opped.** The one shipped
tick (`9f86f7a0`, 01:04→01:08 UTC 09-19) filed a *second* live
`[HOT PURSUIT]` content-gap row — deep-dives pillar, window-start
2026-08-20 — on top of the still-open guides-pillar row (`#997`,
filed 2026-09-15). Article count holds at 96 (106 with 10 newsletter
issues), unchanged.

**`#997` (guides pillar) has now cleared a fourth consecutive digest
window** (2026-09-16, 17, 18, 19) without a single one of the 6+6=12
intervening cloud `march` ticks reaching `/ship-content` for it. This
is the same shape the standing `[score 6.5]` `PHASE_CANDIDATES.md`
candidate diagnosed back on 2026-09-12 (`.github/workflows/march.yml:156`'s
embedded dispatch-order summary omits `/ship-content` and the
content-gap refill step) — filing the candidate hasn't changed cloud's
behavior, and it still needs a local `/oversight` promotion + push,
blocked in turn by `#898` (`ACTIONS_PAT` lacks `workflows` scope).
Added a third dated update to the existing row rather than filing a
duplicate (see Tuning proposals). The new deep-dives row is one tick
old — not yet a repeat instance of anything — but the site now
carries **two simultaneous open content-gap rows** with no
autonomous drain path for either, which raises the stakes on this
fix landing.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (87 records, all cross-refs resolve — unchanged: 11
vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys /
20 trends), a clean production build, `size` OK (all four tracked
tool routes under budget, unchanged figures from the prior digest),
and 1238/1238 e2e (~7.7m, same count as the prior digest — no new
canonical URLs this window). The e2e run again logged the same
benign `Error: Internal: NoFallbackError` stderr noise on
dynamic-route fallback lookups — not attached to any failing test,
unchanged shape from prior digests, not re-filing. The verify run's
`build`/`data:validate` legs again touched the three
`*.generated.json` runtime files (the standing `[data] [2.4]` AUDIT
row's drift shape) — restored via `git checkout` before this commit
so the digest's own diff stays notes-only. Deploy is `READY` at HEAD
(`9f86f7a0`).

## While you were out

| When (UTC, 09-18/09-19) | Tick | Outcome |
|---|---|---|
| 17:26→17:30 | cloud march | no-op — nothing dispatched |
| 20:20→20:24 | cloud march | no-op — nothing dispatched |
| 22:58→23:03 | cloud march | no-op — nothing dispatched |
| 01:04→01:08 | cloud march | shipped — filed deep-dives `[HOT PURSUIT]` content-gap row (`9f86f7a0`) |
| 06:58→07:02 | cloud march | no-op — nothing dispatched |
| 11:52→11:56 | cloud march | no-op — nothing dispatched |

6 completed `march`-workflow runs since the last digest: **6
success, 0 failure, 0 cancelled, 1 shipped (plan-only), 5 no-ops**
(all report `success` at the workflow level — no-ops are a
clean-turn agent decision, not a workflow error). `lighthouse`'s last
2 recorded runs: 1 `success` (2026-09-19T01:07:30Z), 1 `success`
(2026-09-18T14:49:23Z). `night` (this workflow) last recorded
completed run was the 2026-09-18 digest (`success`); this tick is
the current one.

## Shipped

**One plan-only commit.** `9f86f7a0` — `content-gap-survey.mjs`
auto-filed a `[HOT PURSUIT] [content-gap] [7]` row for the
deep-dives pillar (1 of ≥2 articles published in the last 30 days,
window-start 2026-08-20) to `plan/AUDIT.md`. No code, no content, no
data shipped this window — the queues below explain why: build plan
and data backlog are both empty, and the two live content-gap rows
(`#997`, and the new unmirrored deep-dives row) sat un-dispatched
across all 6 ticks.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **11 open rows, up 1 from the prior digest**
  (the new deep-dives content-gap row) — 5 standing sub-3.0
  (`[seo] [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]`
  plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2
  hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]`
  orphaned `favicon.svg` duplicate), 4 `[needs-user-call]`
  (border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`,
  soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain
  gap `[3.0]`), plus 2 open `[HOT PURSUIT]` content-gap rows
  (**guides pillar `[7]` `#997`**, now 4 digest windows old; **deep-dives
  pillar `[7]`**, new this window, no mirrored GitHub issue yet — see
  Headline).
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **132 days stale**, unchanged. Root cause
  confirmed since expand pass 218 (2026-07-23): cloud mode
  categorically skips `/critique` (no Chrome MCP on the runner);
  this is a `[needs-user-call]` decision sitting in
  `PHASE_CANDIDATES.md`, not a bug to re-diagnose.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 still the most recent
  recorded pass — no new expand pass ran this window (every tick
  either shipped the audit row or no-opped, never falling through to
  failure-mode 6). **35 pending rows** (34 `[ ]` + 1
  `[needs-user-call]`), unchanged in count — the standing `[score
  6.5]` dispatch-order row got a third dated evidence update this
  tick, not a new row (see Tuning proposals). Last promotion: phase
  50, 2026-08-23T12:54Z — **27 days ago**. Highest-scored pending row
  is still `[7.5]` automated content-fact-vs-catalog numeric-spec
  audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open, unchanged — `#997` (guides-pillar
  content-gap row, sole mirrored content-gap issue — the new
  deep-dives row has no mirrored issue yet), `#929`
  (`triage:reviewed`, informational), `#898` (`bug` +
  `triage:needs-user`, the `ACTIONS_PAT` workflow-scope limitation —
  still gating the standing dispatch-order fix).

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web)
- `test:scripts` — 230/230 passed (83 suites)
- `data:validate` — 87 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 20 trends) — unchanged
- `build` — clean production build
- `size` — all tracked routes comfortably under budget, unchanged
  figures from the prior digest (`/quiz/switch` 145.2 KB,
  `/quiz/keycap-set` 145.3 KB, `/compare/switch` and
  `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — 1238/1238 passed (~7.7m), against `next start :4173` —
  unchanged count from the prior digest (no new content this
  window). Same benign `Error: Internal: NoFallbackError` stderr
  noise on dynamic-route fallback lookups as prior digests — not
  attached to any failing test, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`9f86f7a0`) reports `READY`.

## Needs you

1. **`#997` has now hit a fourth consecutive digest window** — one
   window past the three-window mark that originally triggered the
   standing `[score 6.5]` `PHASE_CANDIDATES.md` candidate
   (`.github/workflows/march.yml:156`'s dispatch-order summary
   omitting `/ship-content`) — and a second content-gap row (deep-
   dives) has now joined it with zero autonomous drain path. Only a
   local `/oversight` promotion + one-line push
   (`.github/workflows/march.yml:156`, add `→ ship-content` between
   `ship-data` and `expand`) lands the fix, or both rows can be
   dispatched manually via `/ship-content` in the meantime.
2. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks
   `workflows` scope, blocking any cloud fix to
   `.github/workflows/*.yml`. Gates the fix above plus at least two
   other pending candidates (the crash-issue `always()` gate fix
   `[6.0]`, the permission gap itself `[5.5]`). A single local PAT
   rescope would unblock all three at once.
3. **The border-contrast finding** (`[needs-user-call] [a11y]
   [1.3]` in `AUDIT.md`) — still open, still a taste call: accept
   visibly heavier borders in dark mode for WCAG 1.4.11 compliance,
   or a lighter-touch alternative.
4. **The GTM consent-gate finding** (`[needs-user-call] [3.6]` in
   `AUDIT.md`) — names a taste call: consent-gate the existing GTM
   tag vs. revert to the originally planned cookieless Plausible
   tag.
5. **35 pending phase candidates**, 27 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if any of the higher-scored rows (`[7.5]`
   fact-audit, `[6.5]` march.yml dispatch gap, `[6.0]` mirror-drain
   gap) are worth pulling forward.

## Today's intent

No pending phase — the loop stays in `/iterate` mode. The two
concrete next items are the open `[HOT PURSUIT]` content-gap rows —
`#997` (guides, now missed 12 consecutive `march` ticks across two
digest windows) and the new deep-dives row (1 tick old) — either of
which the next tick should dispatch `/ship-content` for before
guides becomes a fifth-window watch item. Beyond content, `AUDIT.md`
and `PHASE_CANDIDATES.md` remain otherwise structurally empty of
actionable, autonomously-shippable work.

## Tuning proposals

**No new candidate filed this tick — added a third dated evidence
update to the existing `[score 6.5]` `march.yml` dispatch-order
candidate** instead of duplicating it. `#997` clearing a fourth
consecutive digest window, plus a second content-gap row (deep-
dives) now sitting in the same undrained state after only one tick,
is corroborating evidence the diagnosed gap is real, still open, and
now affecting two independent rows rather than one — not a new
mistuned-gate shape. See `PHASE_CANDIDATES.md`'s `[score 6.5]` row
for the full update.
