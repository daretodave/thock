# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The 3-window trigger resolved itself before the trigger fired.**
Since the last digest (`ab1f8733`, 2026-09-12T13:55:58Z), 7 cloud
`march` ticks completed — 6 no-ops, then the 7th (13:36→13:58Z)
shipped `#989`, the `[HOT PURSUIT]` news-pillar content-gap row this
digest and the one before it had both flagged as stuck. `content-curator`
drafted "Drop restocks /dev/tty, the 2017 set that built the MT3
profile" (`3520811a`), the audit-tick closed it out (`ed0b28e8`), and
the manifest/search/viz regen landed (`5c93d4a7`) — three commits,
one shipping tick, `#989` closed clean.

**This is direct counter-evidence against the standing `[score 6.5]`
march.yml diagnostic candidate** filed two digests ago (the hypothesis
that `.github/workflows/march.yml:156`'s dispatch-order summary,
which omits `/ship-content` from its own restated order, structurally
blinds cloud ticks to the content queue). If that hypothesis were
true as stated, this tick's cloud `march` run should not have been
able to reach `/ship-content` at all — it did, and drained the exact
row the hypothesis was built around. Not re-filing or editing that
candidate directly (digest proposes, `/oversight` disposes), but
flagging the update below under Tuning proposals since it changes
the confidence on an existing open row.

**A fresh HOT PURSUIT row already replaced it**: `content-gap-survey.mjs`
auto-refilled at 2026-09-13, filing `[HOT PURSUIT] [content-gap] [7]`
for the **ideas** pillar (1 of ≥2 articles in the last 30d,
window-start 2026-08-14). Zero digest windows old — not a repeat
pattern yet, just the next thing in line for `/ship-content`.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (86 records, all cross-refs resolve, unchanged), a
clean production build, `size` (all six tracked routes comfortably
under budget), and 1229/1229 e2e (~7.9m). Article count is up to 104
(from ~93 logged a few digests back) reflecting steady content
velocity. Deploy is `READY` at HEAD (`5c93d4a7`).

**The standing mistuned-gate signals are otherwise unchanged** —
re-flagged below with fresh ages.

## While you were out

| When (UTC, 09-12/09-13) | Tick | Outcome |
|---|---|---|
| 16:42→16:45 | cloud march | no-op — nothing to dispatch |
| 18:54→18:59 | cloud march | no-op — nothing to dispatch |
| 21:09→21:14 | cloud march | no-op — nothing to dispatch |
| 23:41→23:44 | cloud march | no-op — nothing to dispatch |
| 02:56→02:59 | cloud march | no-op — nothing to dispatch |
| 08:02→08:06 | cloud march | no-op — nothing to dispatch |
| 13:36→13:58 | cloud march | **shipped** — `/ship-content` drained `#989` (news pillar, MT3 `/dev/tty` restock) |

7 completed `march`-workflow runs since the last digest: **7 success,
0 failure, 0 cancelled, 6 no-op, 1 shipped**. `lighthouse`'s most
recent completed run (2026-09-13T13:58Z, tracking the new deploy) was
success. `night` (this workflow) ran success on its prior attempt
(2026-09-12 digest run); this tick is the current one.

## Shipped

**One content piece, one tick.** `/ship-content` drafted and shipped
"Drop restocks /dev/tty, the 2017 set that built the MT3 profile" at
`/article/mt3-devtty-restock` (publishedAt 2026-08-29, gap-fill
midpoint of the 30-day window), closing `#989` and the news-pillar
`[HOT PURSUIT]` row. Follow-up commit regenerated the manifest/search/
viz indices. No other shipping activity this window — the other 6
ticks found nothing to dispatch (no pending phase, no data backlog
row, no unlabeled issue, content queue empty until the ideas-pillar
row filed at the very end of the window).

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: 5 standing sub-3.0 rows unchanged (two Mode
  Sonnet hero-art 65%→75% redraws `[2.7]`/`[2.0]`, a plate-materials
  content-tension item `[2.4]`, a generated-manifest-drift observation
  `[2.4]`, the unreferenced `favicon.svg` duplicate `[1.8]`), 4
  `[needs-user-call]` rows unchanged (soft-404 structural trade-off
  `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`, GTM consent-gate
  `[3.6]`, dark-mode border-contrast WCAG 1.4.11 `[1.3]`), plus 1
  fresh `[HOT PURSUIT]` content-gap row (**ideas pillar, `[7]`**,
  filed 2026-09-13, window-start 2026-08-14) — the news-pillar row is
  now `[x]` closed.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **~126 days stale**, unchanged. Root cause
  confirmed since expand pass 218 (2026-07-23): cloud mode
  categorically skips `/critique` (no Chrome MCP on the runner); this
  is a `[needs-user-call]` decision sitting in `PHASE_CANDIDATES.md`,
  not a bug to re-diagnose. Only Pending row in the file itself is the
  standing non-actionable GA-beacon `[needs-user-call]` item.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 (2026-09-09-dated header,
  most recent pass notes through 431), **34 pending rows** (33 `[ ]`
  + 1 `[needs-user-call]`), unchanged count from the last digest —
  no new expand pass ran this window (march's Step 3c cadence gate
  never tripped: well under the 20-commit/48h threshold on every
  tick). Last promotion: phase 50, 2026-08-23T12:54Z — **21 days
  ago**. Highest-scored pending row is still `[7.5]` automated
  content-fact-vs-catalog numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 2 open, down from 3 — `#929` (`triage:reviewed`,
  informational) and `#898` (`bug` + `triage:needs-user`, the
  `ACTIONS_PAT` workflow-scope limitation, unchanged). `#989` is now
  closed (shipped this window).

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web)
- `test:scripts` — 230/230 passed (83 suites)
- `data:validate` — 86 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 19 trends) — unchanged from prior digest
- `build` — clean production build
- `size` — `/page` 146.7 KB gz (budget 200 KB), `/search/page`
  144.0 KB gz, `/quiz/switch` 145.2 KB gz, `/quiz/keycap-set`
  145.3 KB gz, `/compare/switch` 142.2 KB gz, `/compare/board`
  142.2 KB gz (budget 175 KB each) — all six routes comfortably
  under budget, figures unchanged from the prior digest (no
  client-JS-affecting commit landed this window)
- `e2e` — 1229/1229 passed (~7.9m), against `next start :4173`.
  The run again logged benign `Error: Internal: NoFallbackError`
  stderr noise on dynamic-route fallback lookups — not attached to
  any failing test, same unchanged shape as prior digests, not
  re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`5c93d4a7`) reports `READY`.

## Needs you

1. **Promote or reject the `/critique` cloud-skip diagnostic**
   (`[needs-user-call] [score 6.5]` in `PHASE_CANDIDATES.md`) — the
   fresh-eyes loop has been silent for ~126 days and the root cause
   (no Chrome MCP on the cloud runner) has been confirmed since
   expand pass 218, now 82 days ago. Options are laid out in the
   candidate row: accept as a local-only ritual, build a cloud-
   compatible substitute, or drop it.
2. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks `workflows`
   scope, blocking any cloud fix to `.github/workflows/*.yml`. This
   gates at least three pending candidates from ever landing
   autonomously: the march.yml dispatch-order summary fix `[6.5]`
   (see Headline — now weaker evidence, but the summary line genuinely
   is incomplete and still worth the one-line fix), the crash-issue
   `always()` gate fix `[6.0]`, and the permission gap itself `[5.5]`.
   A single local PAT rescope would unblock all three at once.
3. **The border-contrast finding** (`[needs-user-call] [a11y]
   [1.3]` in `AUDIT.md`) — still open, still a taste call: accept
   visibly heavier borders in dark mode for WCAG 1.4.11 compliance,
   or a lighter-touch alternative.
4. **The GTM consent-gate finding** (`[needs-user-call] [3.6]` in
   `AUDIT.md`) — names a taste call: consent-gate the existing GTM
   tag vs. revert to the originally planned cookieless Plausible tag.
5. **The asset-hygiene dispatch-gap candidate** (`[score 5.5]`,
   filed pass 399) — a named fix with no dispatch path; would drain
   the two standing Mode Sonnet hero-art redraw rows in one commit.
6. **34 pending phase candidates**, 21 days since the last promotion
   — cloud cannot promote by design. Worth a batch `/oversight` pass
   if any of the higher-scored rows (`[7.5]` fact-audit, `[6.5]`
   march.yml dispatch gap, `[6.0]` mirror-drain gap) are worth
   pulling forward.

## Today's intent

No pending phase — the loop stays in `/iterate` mode. The concrete
next item is the fresh ideas-pillar `[HOT PURSUIT]` row (`[7]`,
window-start 2026-08-14) — the next `/march` tick should dispatch
`/ship-content` for it directly, same shape as this window's news-
pillar drain. Worth a quiet watch: if this row survives past the next
tick or two without shipping (the pattern the news-pillar row fell
into), that would actually be informative evidence *for* the
march.yml dispatch-order hypothesis rather than against it, since
this window's clean same-tick drain argues the opposite. Beyond
content, `AUDIT.md` and `PHASE_CANDIDATES.md` remain otherwise
structurally empty of actionable, autonomously-shippable work.

## Tuning proposals

**None filed this tick.** The pulse is nominal — verify green, deploy
green, the one open content-gap row drained same-window. The one
notable signal is evidentiary, not a new proposal: this tick's clean
`/ship-content` dispatch (Headline) is direct counter-evidence against
the standing `[score 6.5]` march.yml dispatch-order-omission
candidate already sitting in `PHASE_CANDIDATES.md` — noted here for
whoever runs the next `/oversight` pass on that row, not applied as
an edit (digest proposes new candidates only; it doesn't revise
existing ones).

The standing candidates — `/critique` cloud-skip diagnostic
(`[needs-user-call] [score 6.5]`), asset-hygiene dispatch gap
(`[score 5.5]`), and the 34-deep promotion backlog — are unchanged in
shape since the last digest; re-cited with fresh ages in Needs You
above rather than re-filed as new rows.
