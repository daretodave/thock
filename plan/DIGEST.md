# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Another clean window — both HOT PURSUIT content-gap rows that
opened this window shipped and closed same-day, and the queue is
empty again.** Since the last digest (`37f4db46`,
2026-09-25T15:38:04Z), 6 cloud `march` ticks completed — all
`success`, HEAD advanced 8 commits (`37f4db46` → `3a397829`). A
mechanical-survey tick at 16:42 filed 3 rows (2 stale group-buy
statuses, 1 newsletter-cadence gap) and ran `/expand` pass 432 in
the same window (36th consecutive no-candidate pass, 397–432 —
steady-state maintenance, not a mistuned gate). The newsletter gap
opened as `#1004` at 20:15 and shipped in the very next content
tick at 03:32 ("thock weekly — issue 11," `be76bd99`). A fresh
ideas-pillar HOT PURSUIT row opened as `#1005` at 09:06 and closed
in the next tick at 14:28 ("Build of the week: the Bakeneko65...,"
`fd309b0a`) — both opens closed inside 7–11 hours, no stall.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects, clean), lint (0 warnings), 862/862
unit tests (109 files, apps/web — unchanged), 230/230 script tests
(83 suites — unchanged), `data:validate` (88 records, all
cross-refs resolve — unchanged: 11 vendors / 18 switches / 10
keycap-sets / 10 boards / 18 group-buys / 21 trends), a clean
production build, `size` OK (all four tracked tool routes under
budget, unchanged figures), and 1271/1271 e2e (~8.1m, +6 over the
last digest's 1265 — the two new articles' canonical-URL and
crosslink coverage). Same benign `Error: Internal: NoFallbackError`
stderr noise on dynamic-route fallback lookups as every prior
digest — not attached to any failing test, not filing. The build
also re-dirtied the three `*.generated.json` runtime files (the
standing `[data] [2.4]` drift row); discarded before this commit so
the digest stays notes-only. Deploy is `READY` at HEAD (`3a397829`).

**Still the loudest standing item: `plan/CRITIQUE.md` is 139 days
stale** (last real pass 2026-05-10T20:35:00Z, pass 11, `931c8a7`) —
unchanged again this window. Root cause confirmed since expand pass
218 (2026-07-23): cloud mode categorically cannot run `/critique`
(no Chrome MCP on the runner), and every commit in the last several
months has been a cloud tick. This is a standing
`[needs-user-call]` decision sitting in `plan/PHASE_CANDIDATES.md`,
not a bug to re-diagnose — it needs a conscious `/oversight` call
(accept local-only cadence, build a cloud-compatible substitute, or
drop it) before the fresh-eyes loop can restart.

## While you were out

| When (UTC, 09-25/09-26) | Tick | Outcome |
|---|---|---|
| 16:25→16:43 | cloud march | mechanical survey — filed 3 `AUDIT.md` rows (2 stale group-buy status, 1 newsletter-cadence) + `/expand` pass 432 (no candidates, `a4a2766f`) |
| 20:12→20:16 | cloud march | opened HOT PURSUIT issue `#1004` (newsletter cadence, `21313039`) |
| 23:46→23:50 | cloud march | no-op — nothing dispatched |
| 03:19→03:34 | cloud march | **shipped** — newsletter "thock weekly — issue 11" (`be76bd99`), closed `#1004` same-window (`1b28ab23`) |
| 09:02→09:07 | cloud march | opened HOT PURSUIT issue `#1005` (ideas pillar, `1a54e4ce`) |
| 14:02→14:31 | cloud march | **shipped** — ideas article "Build of the week: the Bakeneko65..." (`fd309b0a`), closed `#1005` same-window (`3a397829`) |

6 completed `march`-workflow runs since the last digest: **6
success, 0 failure, 0 cancelled, 2 content ships, 2 issue-opens, 1
mechanical-survey/expand tick, 1 no-op.** `lighthouse` ran 5 times
this window (16:42:59, 20:17:21, 03:33:51, 09:07:16, 14:30:19 —
all `success`). `night` (this workflow) last completed run was the
2026-09-25 digest (`success`); this tick is the current one.

## Shipped

- **newsletter**: "thock weekly — issue 11" (`be76bd99`) — closes
  `#1004`, 5 pillar picks + tracker check-in from
  `data/trends/2026-W39.json`, 21 days since issue 10.
- **ideas**: "Build of the week: the Bakeneko65 stops being a
  budget board under GMK Bentō R2 and Tecsee Sapphire V2"
  (`fd309b0a`) — closes `#1005`, publishedAt 2026-09-22
  (gap-fill), brings the ideas pillar to 2 articles in the last 30
  days (window satisfied).

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **24 open rows, up from 22** in the prior
  digest. Breakdown: 5 standing sub-3.0 `[ ]` rows (unchanged:
  `[seo] [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]`
  plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2
  hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]`
  orphaned `favicon.svg`); 4 `[needs-user-call]` rows (unchanged:
  border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`,
  soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain
  gap `[3.0]`); **12 `[cross-links] [4.5]` rows, unchanged** (hub
  articles `pcb-flex-cuts-explained`, 5 pairs, and
  `keyboard-cleaning-maintenance-guide`, 4 pairs); 1 standing
  `[user-issue #1001] [ci] [4.8]` row (heartbeat false-positive
  debounce fix — still blocked on `#898`'s workflow-write scope);
  and **2 new `[data] [3.6]` rows** (`divinikey-gmk-cyl-just-beachy`
  and `divinikey-gmk-cyl-orange-alert`, both stale group-buy status
  past `endDate`, filed this window by `group-buy-status-check.mjs`
  — first hits from that checker in several dozen passes, each a
  single-field status flip). **0 open content-gap HOT PURSUIT
  rows** — both `#1004` and `#1005` shipped and closed this window.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **139 days stale, unchanged and still
  growing.** See Headline; standing `[needs-user-call]` decision in
  `PHASE_CANDIDATES.md`.
- **`plan/PHASE_CANDIDATES.md`**: pass 432 (2026-09-25) is the most
  recent expand pass — 36th consecutive no-candidate pass
  (397–432). **36 pending rows** (35 `[ ]` + 1
  `[needs-user-call]`), unchanged. Last promotion: phase 50,
  2026-08-23 — **34 days ago**. Highest-scored pending row is still
  `[7.5]` automated content-fact-vs-catalog numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open — `#1001` (`triage:loop-queued` + `bug`
  + `ci`, heartbeat false-positive, mirrored in the `AUDIT.md`
  `[4.8]` row, still blocked on `#898`), `#929`
  (`triage:reviewed`, informational — root cause of the
  crash-dedupe gap, 0 new crashes to log this window either; all 6
  ticks completed clean), `#898` (`bug` + `triage:needs-user`, the
  `ACTIONS_PAT` workflow-scope limitation — still gating every
  pending `.github/workflows/*.yml` fix, including the heartbeat
  one). 0 unlabeled issues.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web) —
  unchanged from the prior digest
- `test:scripts` — 230/230 passed (83 suites) — unchanged
- `data:validate` — 88 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 21 trends) — unchanged from the prior digest
- `build` — clean production build (regenerates the 3
  `*.generated.json` runtime files — discarded before this commit,
  same standing `[data] [2.4]` drift row, not re-filed)
- `size` — all tracked routes comfortably under budget, unchanged
  figures from the prior digest (`/quiz/switch` 145.2 KB,
  `/quiz/keycap-set` 145.3 KB, `/compare/switch` and
  `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — 1271/1271 passed (~8.1m), against `next start :4173` —
  +6 over the prior digest's 1265 (the two new articles' canonical
  URLs and crosslink checks). Same benign `Error: Internal:
  NoFallbackError` stderr noise on dynamic-route fallback lookups as
  prior digests — not attached to any failing test, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`3a397829`) reports `READY`.

## Needs you

1. **`plan/CRITIQUE.md` is 139 days stale** — the fresh-eyes loop
   has been off for over four and a half months. Root cause
   confirmed (cloud categorically can't run it), sitting as a
   standing `[needs-user-call]` decision in `PHASE_CANDIDATES.md` —
   worth a conscious call rather than letting it drift further.
2. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks
   `workflows` scope, blocking cloud fixes to
   `.github/workflows/*.yml`. Directly gates the standing `[score
   6.0]` crash-dedupe fix, the `always()` march.yml gate fix, and
   the `#1001` heartbeat-debounce fix — all fully-scoped one-file
   changes sitting unpushable from cloud.
3. **The crash-issue safety net is still silently disabled** (0 new
   instances this window — all 6 ticks completed clean — but the
   mechanism is unchanged). Fix already described in the standing
   `[score 6.0]` `PHASE_CANDIDATES.md` row; blocked on `#898`.
4. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast
   WCAG 1.4.11 `[1.3]` (accept heavier dark-mode borders or a
   lighter-touch alternative), GTM consent-gate `[3.6]` (consent-gate
   vs. revert to cookieless Plausible), soft-404 structural
   trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`.
5. **36 pending phase candidates**, 34 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if the higher-scored rows (`[7.5]` fact-audit,
   `[6.0]` crash-dedupe fix, `#1001` debounce fix) are worth pulling
   forward together, since all three need the same local push
   anyway.

## Today's intent

No open HOT PURSUIT content-gap row is waiting — both `#1004` and
`#1005` shipped clean this window. The clearest next pick is still
the 12 `[cross-links] [4.5]` rows: `pcb-flex-cuts-explained` is the
hub for 5 pairs and `keyboard-cleaning-maintenance-guide` for 4 —
either drains cleanly in one commit via `/iterate`'s cluster-drain
(phase 46). The 2 new `[data] [3.6]` stale-group-buy rows are the
next-cheapest pick (single-field status flips, ease 9) if `/iterate`
wants a quick win first. The `[ci] [4.8]` heartbeat row is fully
scoped (one-line debounce to `.github/workflows/heartbeat.yml`) but,
like the standing crash-dedupe and gate fixes, needs a local
`/oversight` push rather than a cloud tick — `#898` blocks any
`.github/workflows/*.yml` edit from cloud. `AUDIT.md` and
`PHASE_CANDIDATES.md` are otherwise structurally empty of
actionable, autonomously-shippable work beyond the cross-link and
stale-data drains — everything else queued needs a local
`/oversight` pass.

## Tuning proposals

**None this tick.** All 6 ticks this window completed with a
genuine `success` conclusion and a clean commit or no-op — no
masked-crash evidence to corroborate the standing crash-dedupe
candidate. The mirror-drain mechanism worked correctly again this
window: both `#1004` and `#1005` closed via clean same-window ships
with no title-drift or missing-trailer instance. Expand's 36th
consecutive no-candidate pass reads as steady-state maintenance
(52/52 phases shipped, 0 data backlog, content queue draining same-
window) rather than a mistuned dispatch gate — the existing `[score
3.6]` "/expand dispatch cadence" candidate already tracks this
watch condition and doesn't need a fresh row for a continuation of
the same pattern. The 2 new stale-group-buy rows are organic data
drift with an existing mechanical checker and an ease-9 fix, not a
gate problem. Nothing else in this window's pulse suggests a
mistuned gate, ceiling, or cadence.
