# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet, clean ~26-hour window — 8 cloud `march` ticks, 5 shipped
(6 commits, one tick shipped 2 in the same commit pair), 3 no-ops —
and the AUDIT queue picked up exactly one new actionable row, still
unaddressed at digest time.** Since the last digest (`d9e69026`,
2026-09-06T13:43:38Z), the loop closed one finding same-tick
(stale `updatedAt` on two factually-corrected articles, `[4.8]`,
closes `#986`), extended the bundle-size gate to the `/quiz/*` and
`/compare/*` routes, shipped the Monday-gated ISO week 37 trends
snapshot on schedule, and ran two more `/expand` passes (421, 422)
that both filed nothing. **One new actionable row landed and is
still open**: `[engineering] [4.0]` — `packages/content` and
`packages/seo` still peer/dev-depend on Next 15 while `apps/web`
runs Next 16, giving the workspace two resolved `next` installs (a
real test-validity gap: `AutoLink.test.tsx` exercises the Next 15
`next/link`, not the Next 16 one that ships to production). Filed
this window by cloud `/iterate`'s own audit, not yet drained — the
natural pick for the next `/iterate` tick.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green (typecheck, lint, test:run, test:scripts, data:validate,
build, size, e2e — 862 unit + 230 script + 1226 e2e, all passing),
run as sequential foreground legs per the standing rule. `data`
now carries 86 records (trends grew 18→19 with the new W37
snapshot). `size` holds comfortably under budget on all six
tracked routes, including the two newly-added ones this window
(`/quiz/switch` 145.2 KB gz / 175 KB budget, `/quiz/keycap-set`
145.3 KB gz / 175 KB budget, `/compare/switch` 142.2 KB gz / 175 KB
budget, `/compare/board` 142.2 KB gz / 175 KB budget). The e2e run
again logged the same benign `Error: Internal: NoFallbackError`
stderr noise on dynamic 404 requests — not attached to any failing
test (1226/1226 passed clean), unchanged shape from prior digests,
not re-filing. Deploy is `READY` at HEAD (`2797aa1e`).

**Two mistuned-gate signals remain flagged and unaddressed, both
already filed as pending `plan/PHASE_CANDIDATES.md` rows awaiting
`/oversight` — calling them out again, per the digest's own job:**

1. **`plan/CRITIQUE.md` is now 120 days stale** — last real pass
   (pass 11) landed 2026-05-10T20:35:00Z at commit `931c8a7`, 2,686
   commits ago. Root cause diagnosed and filed since 2026-07-03:
   `[needs-user-call] [score 6.5] Critique gate diagnostic` — cloud
   mode categorically skips `/critique` (no Chrome MCP on the cloud
   runner). Still unpromoted.
2. **`/expand` cadence** — pass 422's own note records **26
   consecutive no-candidate passes (397–422)**, a fresh streak that
   resumed after whatever candidate broke the prior 346–376 run.
   This digest appended an update note to the existing
   `[score 3.6] /expand dispatch cadence` candidate (proposed
   2026-08-29, still unpromoted) citing the fresh numbers rather
   than filing a duplicate row — the pattern has recurred, not
   changed in shape.

No new tuning proposal filed this tick — both signals are already
on record; this digest reinforced the second one with fresh pulse
numbers rather than duplicating a row.

## While you were out

| When (UTC, 09-06/09-07) | Tick | Outcome |
|---|---|---|
| 14:51→15:11 | cloud march | expand: pass 421 — no new candidates |
| 17:28→17:32 | cloud march | no-op — nothing to dispatch |
| 19:56→20:12 | cloud march | expand: pass 422 — no new candidates |
| 21:58→22:14 | cloud march | no-op — nothing to dispatch |
| 23:38→00:03 | cloud march | perf: bundle-size gate extended to `/quiz/*` + `/compare/*`; audit: `[4.8]` stale-`updatedAt` finding addressed same tick, files new `[4.0]` Next 15/16 dual-install follow-up |
| 02:41→02:58 | cloud march | no-op — nothing to dispatch |
| 07:52→08:08 | cloud march | data: trend snapshot 2026-W37 (Monday gate) |
| 13:55→14:26 | cloud march | seo: bump stale `updatedAt` on two factually-corrected articles, closes `#986` |

8 `march`-workflow runs since the last digest: **8 success, 0
failure, 0 cancelled, 3 no-ops.** `lighthouse` ran success on both
its two most recent completed attempts (14:26:14Z and 08:09:48Z).
`night` ran success on its prior attempt (2026-09-06T13:43:38Z);
this tick's own run is in progress as this file writes.

## Shipped

- **expand**: pass 421 — no new candidates (`fc47f2dd`); 34 pending
  rows (33 `[ ]` + 1 `[needs-user-call]`) unchanged.
- **expand**: pass 422 — no new candidates (`6d6144bc`); same 34
  pending rows unchanged. Pass notes record 26 consecutive
  no-candidate passes (397–422) — see Headline.
- **perf**: bundle-size gate (`pnpm size`) extended to cover
  `/quiz/switch`, `/quiz/keycap-set`, `/compare/switch`, and
  `/compare/board` (`9545d330`) — closes the standing `[4.8]`
  gate-coverage finding. All four new routes measure comfortably
  under their 175 KB gzip budget.
- **audit**: same tick, files a new `[engineering] [4.0]` row —
  `packages/content` and `packages/seo` still peer/dev-depend on
  Next 15 while `apps/web` runs Next 16.3.2, giving the workspace
  two resolved `next` installs (`1f84d8df`). Not yet drained.
- **data**: ISO week 37 trends snapshot (`fd0b599c`) — the Monday
  gate fired on schedule; `data/trends/` now has 19 records.
- **seo**: `gateron-oil-king-deep-dive.mdx` and
  `custom-keyboard-kit-buyers-guide.mdx` `updatedAt` bumped to their
  real correction-commit dates (`2797aa1e`), closes finding `[4.8]`
  + `#986` — the row had sat un-drained for a full day, the exact
  gap the standing `[needs-user-call] [3.0]` mirror/row-gap
  meta-finding describes; recovered same pattern as prior instances.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **1 actionable row above the 3.0 promotion
  floor**, unaddressed — `[engineering] [4.0]` Next 15/16
  dual-install follow-up, filed this window (see Headline/Shipped).
  5 standing sub-3.0 rows, unchanged (two Mode Sonnet hero-art
  65%→75% redraws `[2.7]`/`[2.0]`, a plate-materials
  content-tension item `[2.4]`, a generated-manifest-drift
  observation `[2.4]`, the unreferenced-`favicon.svg` duplicate
  `[1.8]`), plus 3 `[needs-user-call]` rows (soft-404 structural
  trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`, GTM
  consent-gate `[3.6]`).
- **`plan/CRITIQUE.md`**: last real pass 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **120 days stale, 2,686 commits**. Only
  Pending row is the standing non-actionable `[needs-user-call]`
  GA-beacon 503 item.
- **`plan/PHASE_CANDIDATES.md`**: pass 422 (ran the prior window,
  `6d6144bc`), 34 pending rows (33 `[ ]` + 1 `[needs-user-call]`),
  unchanged in count but the `/expand`-cadence row got a fresh
  update note this tick (see Headline). Last promotion: phase 50,
  2026-08-23 via local `/oversight`. Highest-scored pending row is
  still `[7.5]` Automated content-fact-vs-catalog numeric-spec
  audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 2 open — `#929` (`triage:reviewed`,
  informational) and `#898` (`bug` + `triage:needs-user`, the
  `ACTIONS_PAT` workflow-scope limitation — same root cause as the
  pending `[score 5.5]` "Cloud loop cannot push
  .github/workflows/*.yml" candidate). No unlabeled issues. `#986`
  closed this window via its shipping commit.

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
  144.0 KB gz (budget 175 KB), `/quiz/switch` 145.2 KB gz,
  `/quiz/keycap-set` 145.3 KB gz, `/compare/switch` 142.2 KB gz,
  `/compare/board` 142.2 KB gz (all four newly gated this window,
  budget 175 KB) — all six routes comfortably under budget
- `e2e` — 1226/1226 passed (~8.0m), against `next start :4173`

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`2797aa1e`) reports `READY`.

## Needs you

1. **Promote or reject the `/critique` cloud-skip diagnostic**
   (`[needs-user-call] [score 6.5]` in `PHASE_CANDIDATES.md`) — the
   fresh-eyes loop has been silent for 120 days and the root cause
   (no Chrome MCP on the cloud runner) has been confirmed since
   expand pass 218.
2. **The GTM consent-gate finding** (`[needs-user-call] [3.6]` in
   `AUDIT.md`) — names a taste call: consent-gate the existing GTM
   tag vs. revert to the originally planned cookieless Plausible
   tag. `bearings.md` still documents the Plausible plan and needs
   reconciling either way.
3. **Look at the asset-hygiene dispatch-gap candidate**
   (`[score 5.5]`, filed pass 399) — it names a concrete mechanism
   fix (route `next: /ship-asset` AUDIT rows through `/ship-asset`
   instead of letting them sit sub-3.0 forever) and would drain the
   two standing Mode Sonnet hero-art redraw rows in the same commit.
4. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks
   `workflows` scope, blocking any cloud fix to
   `.github/workflows/*.yml`. Same root cause as the pending
   `[score 5.5]` candidate. Needs a token scope change outside the
   loop's own reach.
5. **The `/expand` cadence candidate** (`[score 3.6]`, updated this
   tick) — a second 26-pass no-candidate streak has now happened
   since the first flag; worth a promote-or-reject call rather than
   a third silent recurrence.
6. The 5 standing sub-3.0 AUDIT rows and the soft-404 /
   mirror-drain-gap `[needs-user-call]` rows remain below (or
   outside) the promotion floor and are fine to leave — flagged
   here only for visibility.

## Today's intent

No pending phase — the loop stays in `/iterate` mode. The next
`/iterate` tick's natural pick is the freshly-filed `[4.0]` Next
15/16 dual-install follow-up (mechanical version bump in two
`package.json` files + reinstall + `pnpm -r test:run`). Worth
watching whether the 26-pass expand no-candidate streak breaks soon
or keeps climbing, and whether `/oversight` acts on either of the
two standing tuning candidates called out above.

## Tuning proposals

None filed as new rows this tick. The `/expand`-cadence candidate
(`[score 3.6]`) received an update note with fresh pulse numbers
(26-pass second streak) rather than a duplicate row; the critique
staleness signal is unchanged and already on record. See Headline
and Needs You above.
