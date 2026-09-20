# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Content velocity resumed — the guides-pillar content-gap row that
had stalled four digest windows finally shipped, and in doing so
falsified the standing theory for why it was stalling.** Since the
last digest (`e80be31c`, 2026-09-19T14:11:23Z), 7 cloud `march` ticks
ran: 2 shipped, 4 no-opped, 1 failed. The first shipped tick
(15:16→15:58 UTC) drafted and published "How to clean and maintain a
mechanical keyboard" (`53c04e3a`), closing `#997` — the row diagnosed
in the standing `[score 6.5]` `PHASE_CANDIDATES.md` candidate as
possibly permanently stuck because `.github/workflows/march.yml`'s
embedded dispatch-order summary omits `/ship-content`. **It shipped
with that workflow file byte-for-byte unchanged**, which directly
contradicts the candidate's "structurally invisible to cloud" claim —
see Tuning proposals for the correction filed against that row. A
second tick (18:22→18:26 UTC) then auto-filed and mirrored the next
content-gap row as `#998` (deep-dives pillar, `1c721396`) — one tick
old, not yet a watch item.

**A separate, more concrete gap surfaced while pulling the pulse: the
cloud loop's own crash-detection safety net has been silently dead
for 26 days.** The 7th tick (13:54:37→13:55:36 UTC today) shows
`conclusion: failure` with a genuine crash signal
(`is_error:true`, `duration_ms:243`, zero turns of real work — the
same shape as issue `#929`'s prior transient-API-error class), but
**no GitHub issue was filed for it.** Tracing `march.yml`'s
crash-issue gate: it dedupes by searching for any *open* issue titled
"Cloud march execution had issues" and skips filing if one exists.
Issue `#929` (filed 2026-08-25, labeled `triage:reviewed`) is still
open — `triage:reviewed` is defined in `skills/triage.md` to stay
open by design ("seen, re-eval on `/triage all`"), and `/triage`'s
own re-scan query explicitly excludes it. The two behaviors compound:
once the *first* crash issue is correctly triaged as
`triage:reviewed`, the dedupe silently disables crash detection for
every tick afterward, forever. Filed as a new `[score 6.0]` candidate
— see Tuning proposals.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (87 records, all cross-refs resolve — unchanged: 11
vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys /
20 trends), a clean production build, `size` OK (all four tracked
tool routes under budget, unchanged figures), and 1244/1244 e2e
(~5.9m, +6 from the prior digest's 1238 — the new guides article's
canonical URL). Same benign `Error: Internal: NoFallbackError` stderr
noise on dynamic-route fallback lookups as prior digests — not
attached to any failing test, not re-filing. Deploy is `READY` at
HEAD (`1c721396`).

## While you were out

| When (UTC, 09-19/09-20) | Tick | Outcome |
|---|---|---|
| 15:16→15:58 | cloud march | shipped — guides content-gap drained, "How to clean and maintain a mechanical keyboard" (`53c04e3a`, `bb6f919b`), closes #997 |
| 18:22→18:26 | cloud march | shipped — content-gap-survey auto-filed + mirrored deep-dives row as `#998` (`1c721396`) |
| 21:15→21:18 | cloud march | no-op — nothing dispatched |
| 23:51→23:54 | cloud march | no-op — nothing dispatched |
| 03:11→03:16 | cloud march | no-op — nothing dispatched |
| 09:00→09:03 | cloud march | no-op — nothing dispatched |
| 13:54→13:55 | cloud march | **failed** — `is_error:true`, 243ms, 0 turns of work; likely transient API error (same class as `#929`); no issue filed (see Headline/Tuning) |

7 completed `march`-workflow runs since the last digest: **6 success,
1 failure, 0 cancelled, 2 shipped, 4 no-ops**. `lighthouse`'s last 2
recorded runs: both `success` (2026-09-19T18:26:34Z,
2026-09-19T15:57:32Z) — unchanged since the last digest, no new run
this window. `night` (this workflow) last recorded completed run was
the 2026-09-19 digest (`success`); this tick is the current one.

## Shipped

**Two commits carrying real work, one plan-only.**

- `53c04e3a` + `bb6f919b` — guides pillar article "How to clean and
  maintain a mechanical keyboard" (~1460 words, 5 sections, hero SVG
  + 3 inline-viz SVGs, `maintenance` tag added to `tags.json`),
  publishedAt 2026-09-05 (gap-fill). Closes `#997`.
- `1c721396` — `content-gap-survey.mjs` auto-filed a
  `[HOT PURSUIT] [content-gap] [7]` row for the deep-dives pillar
  (window-start 2026-08-20) and mirrored it as issue `#998`.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **14 open rows, up 3 from the prior digest**
  (net: `#997` content-gap row closed, `#998` deep-dives content-gap
  row remains open, and `article-crosslink-survey.mjs` filed 4 new
  `[cross-links] [4.5]` rows linking the new guides article to its
  beginner/modding siblings — `keyboard-cables-compared`,
  `mounting-styles-compared`, `sound-dampening-compared`,
  `stabilizers-explained`). Breakdown: 5 standing sub-3.0
  (`[seo] [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]`
  plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2
  hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]`
  orphaned `favicon.svg` duplicate), 4 `[needs-user-call]`
  (border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`,
  soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain
  gap `[3.0]`), 4 new `[cross-links] [4.5]` rows, plus 1 open
  `[HOT PURSUIT]` content-gap row (deep-dives, `#998`, 1 tick old).
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **133 days stale, unchanged and still
  growing.** Root cause confirmed since expand pass 218
  (2026-07-23): cloud mode categorically skips `/critique` (no
  Chrome MCP on the runner); this sits as a `[needs-user-call]`
  decision in `PHASE_CANDIDATES.md`, not a bug to re-diagnose. The
  fresh-eyes loop has been off for over four months now — worth
  weighing whether that's an accepted trade-off or worth a local
  `/critique` pass.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 still the most recent
  recorded pass (2026-09-09) — no new expand pass ran this window.
  **36 pending rows** (35 `[ ]` + 1 `[needs-user-call]`), up 1 — this
  tick filed the new `[score 6.0]` crash-issue-dedupe candidate and
  added a falsification update to the standing `[score 6.5]`
  dispatch-order candidate (see Tuning proposals). Last promotion:
  phase 50, 2026-08-23T12:54Z — **28 days ago**. Highest-scored
  pending row is still `[7.5]` automated content-fact-vs-catalog
  numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open — `#998` (deep-dives-pillar content-gap
  row, mirrored this window, 1 tick old), `#929` (`triage:reviewed`,
  informational — now also the root cause of the crash-issue dedupe
  gap, see Headline), `#898` (`bug` + `triage:needs-user`, the
  `ACTIONS_PAT` workflow-scope limitation — still gating both
  pending `.github/workflows/march.yml` fixes).

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
- `e2e` — 1244/1244 passed (~5.9m), against `next start :4173` — up
  6 from the prior digest's 1238 (the new guides article's canonical
  URL). Same benign `Error: Internal: NoFallbackError` stderr noise
  on dynamic-route fallback lookups as prior digests — not attached
  to any failing test, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`1c721396`) reports `READY`.

## Needs you

1. **New: the crash-issue safety net has been silently disabled
   since 2026-08-25.** `march.yml:260`'s dedupe check skips filing a
   new "Cloud march execution had issues" issue whenever one is
   already open — but `triage:reviewed` issues (like `#929`) stay
   open by design, so the very first correctly-triaged crash issue
   permanently disables the gate. Today's tick failure (13:54 UTC,
   run `35514877150`) went completely unlogged as a result, caught
   only by this digest's manual pulse scan. Fix is a one-line dedupe
   query narrowing (exclude `triage:reviewed`/`triage:closed`/
   `triage:needs-user`-labeled issues, mirroring `/triage`'s own
   exclusion list) — filed as `[score 6.0]` in
   `PHASE_CANDIDATES.md`, blocked on the same `#898` PAT-scope issue
   as everything else touching `.github/workflows/*.yml`.
2. **Correction: the standing `[score 6.5]` dispatch-order
   candidate's core hypothesis was falsified this window.** `#997`
   shipped via an ordinary cloud `/ship-content` dispatch with
   `march.yml` completely unchanged — direct evidence cloud *does*
   reach that lane despite the embedded summary's omission. Worth a
   look at the next `/oversight` pass: the recommendation is to
   close this candidate without landing the text fix (see Tuning
   proposals for the full update), rather than spending the `#898`
   PAT-scope fix on an already-working mechanism.
3. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks
   `workflows` scope, blocking cloud fixes to
   `.github/workflows/*.yml`. Directly gates item 1 above. A single
   local PAT rescope would unblock it (and any future workflow-file
   candidates).
4. **The border-contrast finding** (`[needs-user-call] [a11y]
   [1.3]` in `AUDIT.md`) — still open, still a taste call: accept
   visibly heavier borders in dark mode for WCAG 1.4.11 compliance,
   or a lighter-touch alternative.
5. **The GTM consent-gate finding** (`[needs-user-call] [3.6]` in
   `AUDIT.md`) — names a taste call: consent-gate the existing GTM
   tag vs. revert to the originally planned cookieless Plausible
   tag.
6. **36 pending phase candidates**, 28 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if any of the higher-scored rows (`[7.5]`
   fact-audit, new `[6.0]` crash-dedupe fix) are worth pulling
   forward.
7. **`plan/CRITIQUE.md` is 133 days stale** — the fresh-eyes loop has
   been off for over four months. Not a bug (cloud categorically
   can't run it), but worth a conscious call on whether a local
   `/critique` pass is due.

## Today's intent

The next tick's clearest pick is dispatching `/ship-content` for the
new deep-dives row (`#998`, 1 tick old — worth shipping before it
becomes a multi-window watch item like `#997` was). Failing that,
the 4 new `[cross-links] [4.5]` rows on the just-shipped guides
article are straightforward `/iterate` picks. `AUDIT.md` and
`PHASE_CANDIDATES.md` remain otherwise structurally empty of
actionable, autonomously-shippable work — everything else queued
needs a local `/oversight` pass.

## Tuning proposals

**Two updates to `plan/PHASE_CANDIDATES.md` this tick:**

1. **New `[score 6.0]` candidate** — the crash-issue dedupe gap
   described in Headline/Needs You: `march.yml`'s "already an open
   issue" check doesn't account for `triage:reviewed` issues staying
   open by design, so the gate has been silently dead since
   `#929` was triaged on 2026-08-25. 26 days, ~170+ completed march
   ticks with no working crash detection.
2. **Falsification update on the existing `[score 6.5]`
   dispatch-order candidate** — `#997` shipped via a normal cloud
   `/ship-content` dispatch this window with `march.yml` completely
   unchanged from the version the candidate's evidence chain
   analyzed, directly contradicting the "structurally invisible to
   cloud" claim that drives its impact score. Recommended next step
   (for `/oversight`, not self-applied): close the candidate without
   landing the text fix — the four-window stalls read as ordinary
   dispatch-order queueing in hindsight, not a broken lane.

Both are proposals only — filed to `PHASE_CANDIDATES.md`, no gates,
cadences, or workflow files touched directly.
