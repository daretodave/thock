# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Quiet window, one real ship (a security patch), and the standing
HOT PURSUIT content-gap row just picked up a second concrete
instance of the evidence pattern flagged two digests ago.** Since
the last digest (`53e82ce8`, 2026-09-14T16:39:36Z), 5 cloud `march`
ticks completed — **4 genuine no-ops, 1 shipped** — landing 2
commits: `dcb8ca63` (bumped `next` 16.3.2→16.3.5, resolving 2
critical unauthenticated RCE advisories) and `149aae1a` (the AUDIT
row closure, closing issue `#995`). `pnpm audit` now reports 0
critical, 1 high (unchanged `js-yaml` via `gray-matter`, dev-time
MDX parsing only, previously assessed low real exploitability).

**The news-pillar `[HOT PURSUIT]` row (`#994`, filed 2026-09-14
~11:40Z, window-start 2026-08-15) has now sat open through this
entire digest window** — 5 completed ticks, ~23 hours, zero
dispatch. This is worth checking carefully rather than assuming a
cause: pulled the raw logs for all 4 no-op ticks (`17:35`, `21:23`,
`00:12`, `10:59`). None were blocked by the daily commit ceiling —
each computed `Cloud-shipped commits in last 24h: 5` or `6`, far
under the 60 threshold, so the ceiling-check echo text my first pass
matched was the *workflow's own script source* being logged, not an
executed skip branch; all 4 ticks genuinely ran the agent. And
`.github/workflows/march.yml:156`'s embedded dispatch-order sentence
— *"triage → critique (skipped) → ship-a-phase → ship-data → expand
→ iterate"* — is still live verbatim in every one of these ticks'
prompts, still omitting `/ship-content` (§3b.5) between `ship-data`
and `expand`, exactly as the standing `[score 6.5]`
`PHASE_CANDIDATES.md` candidate (proposed 2026-09-12) already
diagnosed from `#989`'s 3-window survival. This is a second,
independent instance of the same shape — not re-filing a duplicate
candidate (digest cites evidence on existing rows, doesn't edit
them), but the signal is now stronger: two separate content-gap
rows, two separate weeks, same unfixed line, same result.

**A fresh dry run of `content-gap-survey.mjs` this tick found a
second pillar has since dropped into hot-pursuit**: guides,
window-start 2026-08-16, score 7.0 — not yet filed to `plan/AUDIT.md`
(the script defaults to dry-run; filing is `/march`'s/`/iterate`'s
job, not the digest's). The news-pillar row not being one the script
re-printed is expected — its logic skips pillars with an
already-open unresolved row, so `#994` staying silent in this dry
run reflects it *still being open*, not being resolved.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (87 records, all cross-refs resolve — unchanged), a
clean production build, `size` (all six tracked routes comfortably
under budget, figures unchanged), and 1235/1235 e2e (~8.2m). The e2e
run again logged the same benign `Error: Internal: NoFallbackError`
stderr noise on dynamic-route fallback lookups — not attached to any
failing test, unchanged shape from prior digests, not re-filing.
Article count holds at 95 plus 10 newsletter issues — 105 content
pieces total, unchanged (no content shipped this window). Deploy is
`READY` at HEAD (`149aae1a`).

## While you were out

| When (UTC, 09-14/09-15) | Tick | Outcome |
|---|---|---|
| 17:35→17:41 | cloud march | no-op — nothing dispatched |
| 21:23→21:27 | cloud march | no-op — nothing dispatched |
| 00:12→00:15 | cloud march | no-op — nothing dispatched |
| 05:45→05:59 | cloud march | **shipped** — `next` 16.3.2→16.3.5 security patch, closes `#995` |
| 10:59→11:03 | cloud march | no-op — nothing dispatched |

5 completed `march`-workflow runs since the last digest: **5
success, 0 failure, 0 cancelled**, 4 no-op, 1 shipped. `lighthouse`'s
runs across the same window (`05:59`, `06:02`, `06:04`) show 1
success (tracking the security-patch push) and 2 `skipped` — the
skips are concurrency-dedup on rapid-fire pushes (two commits landed
15 seconds apart in the 05:45 tick), not failures; every other
lighthouse run in the trailing 8 was success. `night` (this
workflow) ran success on its prior attempt (the 2026-09-14 digest);
this tick is the current one.

## Shipped

**One security patch, one tick.** The 05:45 `march` tick bumped
`next` from `16.3.2` to `16.3.5` (`pnpm update next && pnpm install`,
within the existing `^16.2.12` semver range), which also resolved
`sharp` to `≥0.35.4` in the same lockfile refresh — closing 2
critical unauthenticated RCE advisories and 1 high libheif advisory
that were live in production. `pnpm audit` now shows 0 critical, 1
high remaining (`js-yaml` via `gray-matter`, dev-time-only MDX
parsing, lower real exploitability, left for a separate tick per the
original finding's own guidance). The AUDIT row closure landed as an
immediate follow-up commit in the same tick, closing issue `#995`.
The other 4 ticks found nothing to ship — see Headline for why that
matters for the standing content-gap row.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: 10 open rows — 5 standing sub-3.0 (`[seo]
  [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]`
  plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2
  hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]`
  orphaned `favicon.svg` duplicate), 4 `[needs-user-call]`
  (border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`,
  soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain
  gap `[3.0]`), plus 1 `[HOT PURSUIT]` content-gap row (**news
  pillar, `[7]`**, `#994`, unchanged, now ~23h old — see Headline).
  `[engineering] [7.2]` (the next.js RCE row) is now `[x]` closed.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **~128 days stale**, unchanged. Root cause
  confirmed since expand pass 218 (2026-07-23): cloud mode
  categorically skips `/critique` (no Chrome MCP on the runner);
  this is a `[needs-user-call]` decision sitting in
  `PHASE_CANDIDATES.md`, not a bug to re-diagnose.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 still the most recent
  recorded pass — no new expand pass ran this window (every tick
  either no-opped before reaching expand or shipped directly via
  `/iterate`'s own audit pick, never falling through to
  failure-mode 6). **35 pending rows** (34 `[ ]` + 1
  `[needs-user-call]`), unchanged in count. Last promotion: phase
  50, 2026-08-23T12:54Z — **23 days ago**. Highest-scored pending
  row is still `[7.5]` automated content-fact-vs-catalog
  numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open, unchanged in count — `#994` (still
  open, this window's news-pillar content-gap row, see Headline),
  `#929` (`triage:reviewed`, informational), `#898` (`bug` +
  `triage:needs-user`, the `ACTIONS_PAT` workflow-scope limitation,
  unchanged). `#995` is now closed (shipped this window).

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
- `size` — all six tracked routes comfortably under budget, figures
  unchanged from the prior digest (no client-JS-affecting commit
  landed this window)
- `e2e` — 1235/1235 passed (~8.2m), against `next start :4173`. The
  run again logged benign `Error: Internal: NoFallbackError` stderr
  noise on dynamic-route fallback lookups — not attached to any
  failing test, same unchanged shape as prior digests, not
  re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`149aae1a`) reports `READY`.

## Needs you

1. **`#994` and the march.yml dispatch-order candidate** (`[score
   6.5]` in `PHASE_CANDIDATES.md`) — the
   news-pillar HOT PURSUIT row has now survived a full digest
   window (5 ticks, ~23h) unshipped, the second such instance after
   `#989`'s 3-window survival. `.github/workflows/march.yml:156`'s
   dispatch-order summary still omits `/ship-content` verbatim in
   every tick's prompt. Cloud cannot patch its own workflow file
   (`#898` blocks it) — a local one-line push (append `→
   ship-content` between `ship-data` and `expand`) is the proposed
   fix, or `#994` can just be dispatched manually via
   `/ship-content` in the meantime.
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
5. **The asset-hygiene dispatch-gap candidate** (`[score 5.5]`,
   filed pass 399) — a named fix with no dispatch path; would drain
   the two standing Mode Sonnet hero-art redraw rows in one commit.
6. **35 pending phase candidates**, 23 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if any of the higher-scored rows (`[7.5]`
   fact-audit, `[6.5]` march.yml dispatch gap, `[6.0]` mirror-drain
   gap) are worth pulling forward.

## Today's intent

No pending phase — the loop stays in `/iterate` mode. The concrete
next item is still the news-pillar `[HOT PURSUIT]` row (`#994`,
`[7]`, now ~23h old) — the next `/march` tick should dispatch
`/ship-content` for it before the guides-pillar row (window-start
2026-08-16, not yet filed) stacks a second unaddressed hot-pursuit
row on top of it. Beyond content, `AUDIT.md` and
`PHASE_CANDIDATES.md` remain otherwise structurally empty of
actionable, autonomously-shippable work.

## Tuning proposals

**None filed this tick.** No new mistuned-gate shape emerged that
isn't already captured by a standing candidate. The one notable
signal is evidentiary, not a new proposal: this window's full-window
survival of `#994` alongside the still-unpatched
`.github/workflows/march.yml:156` line is a second concrete instance
of the exact pattern the standing `[score 6.5]` march.yml
dispatch-order candidate already describes — cited above in Headline
and Needs You for whoever runs the next `/oversight` pass on that
row, not applied as an edit (digest proposes new candidates only; it
doesn't revise existing ones).

The standing candidates — march.yml dispatch-order gap (`[score
6.5]`), `/critique` cloud-skip diagnostic (`[needs-user-call] [score
6.5]`), asset-hygiene dispatch gap (`[score 5.5]`), and the
35-deep promotion backlog — are unchanged
in shape since the last digest; re-cited with fresh ages in Needs
You above rather than re-filed as new rows.
