# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A fully green ~19-hour window — 19 cloud `march` ticks, all 19
success, zero no-ops.** Since the last digest (`18ee70ac`,
2026-08-31T10:46:22Z), every tick either shipped an AUDIT-drain fix
or ran a fresh `/expand` pass — 10 substantive fixes landed (perf,
a11y, seo, docs), plus one self-correcting AUDIT.md marker fix, plus
9 `/expand` passes (402–410), all no-candidate.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green (typecheck, lint, test:run, test:scripts, data:validate,
build, size, e2e — 862 unit + 230 script + 1217 e2e, all passing),
run as sequential foreground legs per the standing rule. The e2e
run again logged the same benign, previously-noted `Error: Internal:
NoFallbackError` stderr noise during dynamic OG-image route
requests — not attached to any failing test (1217/1217 passed
clean), unchanged shape from prior digests. Not re-filing. Deploy is
`READY` at HEAD (`63b44bbc`).

**Queues stay essentially drained.** The 52-phase build plan is
fully shipped (0 pending); `data/BACKLOG.md` is empty (0 pending);
`plan/AUDIT.md`'s only non-`[x]` rows remain the same 5 standing
sub-3.0 items carried since the last digest (two Mode Sonnet
hero-art 65%→75% redraws `[2.7]`/`[2.0]`, a plate-materials
content-tension item `[2.4]`, a generated-manifest-drift observation
`[2.4]`, the unreferenced-`favicon.svg` duplicate `[1.8]`) — no new
rows filed this window, and none of the day's 10 shipped fixes
touched these five.

**Two mistuned-gate signals remain flagged and unaddressed, both
already filed as pending `plan/PHASE_CANDIDATES.md` rows awaiting
`/oversight` — calling them out again, per the digest's own job:**

1. **`plan/CRITIQUE.md` is now ~113 days stale** — last real pass
   (pass 11) landed 2026-05-11T01:01:38Z at commit `1c4f6da5`. Root
   cause diagnosed and filed since 2026-07-03: `[needs-user-call]
   [score 6.5] Critique gate diagnostic` — cloud mode categorically
   skips `/critique` (no Chrome MCP on the cloud runner). Still
   unpromoted.
2. **`/expand` cadence** — the no-candidate streak since pass 399's
   asset-hygiene filing now stands at 11 consecutive passes (400–410).
   Nowhere near the 31–43-pass range that triggered the last
   cadence-flag cycle, so not re-escalating the score, but the
   underlying `[score 3.6] /expand dispatch cadence` candidate is
   still on record and still unpromoted — worth a look whenever
   `/oversight` next runs regardless of where the streak currently
   sits.

No new tuning proposal filed this tick — both signals are already on
record; this digest is reinforcing status, not duplicating rows.

## While you were out

| When (UTC, 08-31/09-01) | Tick | Outcome |
|---|---|---|
| 11:07→11:37 | cloud march | perf: article/tag routes now hit the edge cache, closes finding `[3.6]` |
| 12:14→12:40 | cloud march | perf: not-found suggestions no longer ship the search index to the client, closes finding `[4.2]` |
| 13:10→13:23 | cloud march | expand pass 402 — no new candidates |
| 14:10→14:44 | cloud march | a11y: 404 suggestions — restored aria-live announcement + CLS guard, closes finding `[4.2]` |
| 15:09→15:30 | cloud march | perf: static OG image / icon routes now hit the edge cache, closes finding `[4.2]` |
| 16:09→16:33 | cloud march | a11y: 404 suggestions — guarded the empty-hit CLS collapse too, closes finding `[4.0]` |
| 17:07→17:23 | cloud march | expand pass 403 — no new candidates |
| 18:11→18:35 | cloud march | perf: per-pillar RSS feeds now hit the edge cache, closes finding `[4.0]` |
| 19:06→19:24 | cloud march | fix: site-wide HSTS header now covers subdomains and is preload-eligible, closes finding `[4.05]` |
| 20:09→20:21 | cloud march | expand pass 404 — no new candidates |
| 21:08→21:15 | cloud march | expand pass 405 — no new candidates |
| 22:08→22:21 | cloud march | expand pass 406 — no new candidates |
| 23:07→23:15 | cloud march | expand pass 407 — no new candidates |
| 00:29→00:45 | cloud march | docs: bearings.md/agents.md Next.js 15 → 16, closes finding `[3.6]` |
| 01:27→01:46 | cloud march | perf: InlineViz diagrams stay legible when printed, closes finding `[4.8]` |
| 02:14→02:37 | cloud march | expand pass 408 — no new candidates |
| 03:11→03:27 | cloud march | fix: footer copyright year computed instead of hardcoded, closes finding `[3.6]` (+ self-corrected an earlier AUDIT.md marker) |
| 04:10→04:19 | cloud march | expand pass 409 — no new candidates |
| 05:09→05:15 | cloud march | expand pass 410 — no new candidates |

19 `march`-workflow runs since the last digest: **19 success, 0
failure, 0 cancelled, 0 no-ops.** `lighthouse` ran success on its
latest 3 completed attempts. `night` ran success on its prior
attempt (2026-08-31T10:32:51Z); this tick's own run is in progress
as this file writes.

## Shipped

- **perf**: article/tag routes now hit the edge cache (`b5a7bbc5`,
  closes finding `[3.6]`).
- **perf**: not-found suggestions no longer ship the search index to
  the client bundle (`1db33fba`, closes finding `[4.2]`).
- **a11y**: 404 suggestions — restored aria-live announcement + CLS
  guard (`1f07c70d`, closes finding `[4.2]`).
- **perf**: static OG image / icon routes now hit the edge cache
  (`f396e554`, closes finding `[4.2]`).
- **a11y**: 404 suggestions — guarded the empty-hit CLS collapse too
  (`4eb185ef`, closes finding `[4.0]`).
- **perf**: per-pillar RSS feeds now hit the edge cache (`0651e52b`,
  closes finding `[4.0]`).
- **fix**: site-wide HSTS header now covers subdomains and is
  preload-eligible (`dcced76a`, closes finding `[4.05]`).
- **docs**: `bearings.md`/`agents.md` corrected from Next.js 15 to
  16 (`b5bc8e13`, closes finding `[3.6]`).
- **perf**: `InlineViz` diagrams stay legible when printed
  (`bf6bdf1b`, closes finding `[4.8]`).
- **fix**: footer copyright year now computed instead of hardcoded
  (`6946a679`, closes finding `[3.6]`, closes #972).

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: 0 actionable open rows above the 3.0
  promotion floor. 5 standing sub-3.0 rows, unchanged from the last
  digest (2 Mode Sonnet hero-art redraws, 1 plate-materials
  content-tension item, 1 generated-manifest-drift observation, 1
  unreferenced-favicon-duplicate cleanup) — all correctly
  undispatched pending `/oversight` on the asset-hygiene dispatch-gap
  candidate.
- **`plan/CRITIQUE.md`**: last real pass 2026-05-11T01:01:38Z
  (pass 11, `1c4f6da5`) — **~113 days stale**. Only Pending row is
  the standing non-actionable `[needs-user-call]` GA-beacon 503 item.
- **`plan/PHASE_CANDIDATES.md`**: pass 410, 33 pending rows. Last
  promotion: phase 50, 2026-08-23 via local `/oversight`. Highest-
  scored pending row is `[7.5]` Automated content-fact-vs-catalog
  numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 2 open — `#929` (`triage:reviewed`,
  informational) and `#898` (`bug` + `triage:needs-user`, the
  `ACTIONS_PAT` workflow-scope limitation — same root cause as the
  pending `[score 5.5]` "Cloud loop cannot push .github/workflows/*.yml"
  candidate). No unlabeled issues.

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
- `e2e` — 1217/1217 passed (8.1m), against `next start :4173`

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`63b44bbc`) reports `READY`.

## Needs you

1. **Promote or reject the `/critique` cloud-skip diagnostic**
   (`[needs-user-call] [score 6.5]` in `PHASE_CANDIDATES.md`) — the
   fresh-eyes loop has been silent for ~113 days and the root cause
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
4. The 5 standing sub-3.0 AUDIT rows remain below the promotion
   floor and are fine to leave — flagged here only for visibility.

## Today's intent

No pending phase — the loop stays in `/iterate` mode. With AUDIT.md's
actionable queue empty and CRITIQUE.md's queue empty, the next
`/iterate`/`/march` ticks will most likely keep alternating between
fresh general-purpose audit sweeps (as most of this window's ticks
did) and `/expand` passes. Worth watching whether the 11-pass
no-candidate streak since pass 399 continues climbing back toward
flag territory or breaks again soon.

## Tuning proposals

None filed this tick. The two live signals (critique staleness,
expand cadence) are already on record in `plan/PHASE_CANDIDATES.md`;
see Headline and Needs You above.
