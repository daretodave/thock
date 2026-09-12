# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A second straight fully-quiet window — and a concrete lead on why.**
Since the last digest (`e13ca4e7`, 2026-09-11T14:47:36Z), 6 more
cloud `march` ticks completed (a 7th was still in flight as this was
written), all 6 succeeded, and all 6 were no-ops — zero shipping
commits landed on `main`. `#989`, the `[HOT PURSUIT]` news-pillar
content-gap row (score 7.0, filed 2026-09-10), is **still un-drafted**
after **three consecutive digest windows**. The prior digest named its
own trigger for this exact situation — *"if a third window passes
with `#989` still open, that's the trigger"* — so this tick filed a
tuning candidate, and it comes with an actual mechanism, not just a
correlation: `.github/workflows/march.yml:156` embeds a one-line
dispatch-order summary in its cloud prompt that **omits `/ship-content`
entirely** (it lists `triage → critique (skipped) → ship-a-phase →
ship-data → expand → iterate`, skipping `skills/march.md`'s §3b.5
content-queue step, which sits between `ship-data` and `expand`).
Grepping the most recent completed tick's full log for
`content-gap-survey`, `ship-content`, or `3b.5` returns zero hits —
consistent with the content lane being structurally invisible to
cloud ticks. See `plan/PHASE_CANDIDATES.md`'s new `[score 6.5]` row
for the full evidence chain and the verify-then-fix plan. Cloud can't
land the one-line fix itself either way (`.github/workflows/*.yml`
push is blocked by `#898`'s `ACTIONS_PAT` scope gap) — this needs a
local `/oversight` pass.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (86 records, all cross-refs resolve), a clean
production build (317 routes), `size` (all six tracked routes
comfortably under budget), and 1226/1226 e2e (~8.0m). `data` holds
steady at 86 records — no growth this window. Deploy is `READY` at
HEAD (`e13ca4e7`).

**The two standing mistuned-gate signals from prior digests remain
unaddressed** — re-flagged below, now joined by the new march.yml
finding above.

## While you were out

| When (UTC, 09-11/09-12) | Tick | Outcome |
|---|---|---|
| 16:52→16:55 | cloud march | no-op — nothing to dispatch |
| 19:25→19:28 | cloud march | no-op — nothing to dispatch |
| 22:11→22:17 | cloud march | no-op — nothing to dispatch |
| 00:52→01:10 | cloud march | no-op — nothing to dispatch |
| 05:21→05:24 | cloud march | no-op — nothing to dispatch |
| 10:00→10:04 | cloud march | no-op — nothing to dispatch |
| 13:50→(in flight) | cloud march | still running as this digest was written |

6 completed `march`-workflow runs since the last digest: **6 success,
0 failure, 0 cancelled, 6 no-op** (1 additional run in flight,
unresolved). `lighthouse`'s most recent completed (non-skipped)
attempt was success (carried over from the prior window — no new
deploy to re-measure since 0 commits landed upstream of it).
`night` (this workflow) ran success on its prior attempt
(2026-09-11T14:31Z digest run).

## Shipped

**Nothing.** All 6 completed `march` ticks found nothing to dispatch
by their own accounting: no pending phase, no data backlog row, no
unlabeled GitHub issue, and (per the mechanism finding above) very
plausibly no visibility into the one item that *should* have fired —
`#989`'s content-queue row. This is the second consecutive fully-empty
digest window on record (the first was logged in the prior digest).

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **0 actionable rows above the 3.0 promotion
  floor** that aren't already gated `[needs-user-call]`. 10 open rows
  total, unchanged in shape from the last two digests: 5 standing
  sub-3.0 rows (two Mode Sonnet hero-art 65%→75% redraws `[2.7]`/`[2.0]`,
  a plate-materials content-tension item `[2.4]`, a generated-manifest-
  drift observation `[2.4]`, the unreferenced `favicon.svg` duplicate
  `[1.8]`), 4 `[needs-user-call]` rows (soft-404 structural trade-off
  `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`, GTM consent-gate
  `[3.6]`, dark-mode border-contrast WCAG 1.4.11 `[1.3]`), plus the 1
  `[HOT PURSUIT]` content-gap row (news pillar, `[7]`) — still
  cross-referenced to tracking issue `#989`, now **three digest
  windows** named but unshipped (see Headline).
- **`plan/CRITIQUE.md`**: last real pass 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **~125 days stale**. Only Pending row is the
  standing non-actionable `[needs-user-call]` GA-beacon item.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 (unchanged since the last
  digest — no new expand pass ran this window, consistent with 0
  commits landing upstream of the expand-rate-limit check), **34
  pending rows** (33 `[ ]` + 1 `[needs-user-call]`, up from 33+1 —
  this tick's own march.yml candidate is the +1). Last promotion:
  phase 50, 2026-08-23T12:54Z — **20 days ago**. Highest-scored
  pending row is still `[7.5]` automated content-fact-vs-catalog
  numeric-spec audit; the new march.yml candidate files at `[6.5]`.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open, unchanged from the last digest —
  `#929` (`triage:reviewed`, informational, the standing march-crash
  dedup target), `#898` (`bug` + `triage:needs-user`, the
  `ACTIONS_PAT` workflow-scope limitation — same root cause blocking
  this tick's own proposed fix), and `#989` (`loop:opened` + `content`,
  the named news-pillar topic still awaiting `/ship-content`). No
  unlabeled issues.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web)
- `test:scripts` — 230/230 passed (83 suites)
- `data:validate` — 86 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 19 trends)
- `build` — clean production build, 317 routes generated
- `size` — `/page` 146.7 KB gz (budget 200 KB), `/search/page`
  144.0 KB gz, `/quiz/switch` 145.2 KB gz, `/quiz/keycap-set`
  145.3 KB gz, `/compare/switch` 142.2 KB gz, `/compare/board`
  142.2 KB gz (budget 175 KB each) — all six routes comfortably
  under budget
- `e2e` — 1226/1226 passed (~8.0m), against `next start :4173`.
  The run again logged benign `Error: Internal: NoFallbackError`
  stderr noise on dynamic-route fallback lookups — not attached to
  any failing test, same unchanged shape as prior digests, not
  re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`e13ca4e7`) reports `READY`.

## Needs you

1. **New this tick — verify and fix the march.yml dispatch-order
   gap** (`[score 6.5]` in `PHASE_CANDIDATES.md`): re-run one cloud
   tick with `show_full_output: true` to confirm whether cloud ticks
   actually execute `skills/march.md` §3b.5 despite the workflow's
   own summary line omitting it; if confirmed, add `→ ship-content`
   to `.github/workflows/march.yml:156`'s dispatch-order sentence
   (between `ship-data` and `expand`). This needs a local push either
   way — cloud can't touch workflow files (`#898`).
2. **Ship `#989` directly** — regardless of the diagnostic above, the
   news-pillar article itself (Drop's MT3 `/dev/tty` restock) has been
   named and ready since 2026-09-10 and is the single highest-value
   thing sitting idle right now. A manual `/ship-content` (or an
   `/iterate` tick that explicitly checks the content queue first)
   would close it in one pass.
3. **Promote or reject the `/critique` cloud-skip diagnostic**
   (`[needs-user-call] [score 6.5]` in `PHASE_CANDIDATES.md`) — the
   fresh-eyes loop has been silent for ~125 days and the root cause
   (no Chrome MCP on the cloud runner) has been confirmed since
   expand pass 218, now 75 days ago.
4. **The `/expand` cadence candidate** (`[score 3.6]`) — still 32
   consecutive no-candidate passes (400–431), unchanged this window
   since zero ticks reached the expand dispatch step. Worth a
   promote-or-reject call rather than waiting for the number to move.
5. **The border-contrast finding** (`[needs-user-call] [a11y]
   [1.3]` in `AUDIT.md`) — still open, still a taste call: accept
   visibly heavier borders in dark mode for WCAG 1.4.11 compliance,
   or a lighter-touch alternative.
6. **The GTM consent-gate finding** (`[needs-user-call] [3.6]` in
   `AUDIT.md`) — names a taste call: consent-gate the existing GTM
   tag vs. revert to the originally planned cookieless Plausible tag.
7. **Look at the asset-hygiene dispatch-gap candidate**
   (`[score 5.5]`, filed pass 399) — same shape as this tick's finding
   (a named fix with no dispatch path); would drain the two standing
   Mode Sonnet hero-art redraw rows in the same commit.
8. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks `workflows`
   scope, blocking any cloud fix to `.github/workflows/*.yml`,
   including this tick's own proposed fix. Needs a token scope change
   outside the loop's own reach.
9. The 5 standing sub-3.0 AUDIT rows and the soft-404 /
   mirror-drain-gap `[needs-user-call]` rows remain below (or outside)
   the promotion floor and are fine to leave — flagged for visibility.

## Today's intent

No pending phase — the loop stays in `/iterate` mode. The single most
concrete piece of unfinished business is `#989` (see Needs You #2) —
three digest windows named-but-unshipped, with a plausible structural
reason why cloud ticks keep missing it (Needs You #1). Whichever gets
picked up first — a manual content dispatch or the march.yml
diagnostic — either should resolve both issues together, since fixing
the dispatch-order gap would let `#989` drain on its own on the next
cloud tick. Beyond that, `AUDIT.md` and `PHASE_CANDIDATES.md` remain
otherwise structurally empty of actionable, autonomously-shippable
work — the next several ticks are likely to keep looking like this
window's until `/oversight` acts on one of the standing items above.

## Tuning proposals

**One filed this tick**: `.github/workflows/march.yml`'s dispatch-order
summary omits `/ship-content` (`[score 6.5]` in
`plan/PHASE_CANDIDATES.md`) — see Headline and Needs You #1 for the
full evidence chain. This is the trigger the prior digest pre-committed
to firing once `#989` survived a third window; filed as a proposal per
the meta-loop rail, not applied directly (and cloud couldn't apply the
workflow-file edit itself even if it wanted to, per `#898`).

The two standing candidates — `/expand` cadence (`[score 3.6]`) and
the critique-staleness diagnostic (`[score 6.5]`) — are unchanged in
shape and headline numbers since the last digest; re-cited with fresh
dates in Needs You above rather than re-filed as new rows.
