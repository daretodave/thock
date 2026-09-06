# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A busy ~22.5-hour window — 8 cloud `march` ticks, 6 shipped, 2
no-ops — and the AUDIT queue is now fully drained down to sub-3.0
rows.** Since the last digest (`3efa2e6c`, 2026-09-05T13:42:58Z),
every actionable (≥3.0, non-`needs-user-call`) `plan/AUDIT.md` row
that existed or was freshly filed this window got shipped same-tick:
RSS `atom:link rel="self"` on all feed variants, a not-found-page
duplicate-`robots`-meta-tag fix, a docs correction (verify-gate
description was stale in 5 files), a `/search` static-rendering
regression revert (the route's `generateMetadata` read `searchParams`
solely to toggle `noindex` — redundant with the existing canonical
tag, and it was silently costing edge caching on every `/search`
request site-wide, including the bare page), and a newsletter issue
10 copy fix (the same "N weeks ago" tracker-figure bug that's now
recurred three times — issues 001, 003/004, and 010 — pulling the
wrong `spark[]` index).

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green (typecheck, lint, test:run, test:scripts, data:validate,
build, size, e2e — 862 unit + 230 script + 1223 e2e, all passing),
run as sequential foreground legs per the standing rule. The e2e run
again logged the same benign, previously-noted
`Error: Internal: NoFallbackError` stderr noise during dynamic route
requests — not attached to any failing test (1223/1223 passed
clean), unchanged shape from prior digests, not re-filing. `size`
holds comfortably under budget on both tracked routes, `/search`
included — now back to `○` (Static) after this window's revert.
Deploy is `READY` at HEAD (`fcd10b41`).

**AUDIT.md now carries zero actionable open rows** — the 5 standing
sub-3.0 items (two Mode Sonnet hero-art 65%→75% redraws, a
plate-materials content-tension item, a generated-artifact-drift
observation, the unreferenced `favicon.svg` duplicate) and 3
`[needs-user-call]` rows (soft-404 trade-off, `loop:opened`
mirror-drain gap, and the GTM consent-gate row — retagged
`needs-user-call` this window after its own "next" field called for
an `/oversight` decision) are all that remain. This is the cleanest
the queue has been in recent digest history.

**Two mistuned-gate signals remain flagged and unaddressed, both
already filed as pending `plan/PHASE_CANDIDATES.md` rows awaiting
`/oversight` — calling them out again, per the digest's own job:**

1. **`plan/CRITIQUE.md` is now ~119 days stale** — last real pass
   (pass 11) landed 2026-05-10T20:35:00Z at commit `931c8a7`. Root
   cause diagnosed and filed since 2026-07-03:
   `[needs-user-call] [score 6.5] Critique gate diagnostic` — cloud
   mode categorically skips `/critique` (no Chrome MCP on the cloud
   runner). Still unpromoted.
2. **`/expand` cadence** — the no-candidate streak since pass 399's
   asset-hygiene filing is now **21 consecutive passes (400–420)**,
   up from 20 at the last digest; pass 420 ran this window and again
   filed nothing. Still under the 31–43-pass range that triggered the
   last cadence-flag cycle, so not re-escalating the score, but the
   underlying `[score 3.6] /expand dispatch cadence` candidate is
   still on record and still unpromoted.

No new tuning proposal filed this tick — both signals are already on
record; this digest is reinforcing status, not duplicating rows.

## While you were out

| When (UTC, 09-05/09-06) | Tick | Outcome |
|---|---|---|
| 14:29→15:00 | cloud march | seo: RSS `atom:link rel=self` on all feeds, closes `[3.2]` + `#981`; GTM consent-gate row retagged `needs-user-call` |
| 17:05→17:09 | cloud march | no-op — nothing to dispatch |
| 19:52→20:22 | cloud march | expand: pass 420 — no new candidates |
| 21:53→22:15 | cloud march | seo: not-found pages drop duplicate `robots` meta tag, closes `[4.8]` + `#982` |
| 23:31→23:49 | cloud march | docs: verify-gate description corrected in 5 stale docs, closes `#983` |
| 02:44→02:47 | cloud march | no-op — nothing to dispatch |
| 07:34→07:58 | cloud march | seo: `/search` reverts to static metadata, restores edge caching, closes `[4.0]` + `#984` |
| 11:54→12:17 | cloud march | content: newsletter issue 10 tracker recap — corrected "eight weeks ago" figures, closes `[4.0]` + `#985` |

8 `march`-workflow runs since the last digest: **8 success, 0
failure, 0 cancelled, 2 no-ops.** `lighthouse` ran success on both
its two most recent completed attempts (12:16:40Z and 07:58:33Z).
`night` ran success on its prior attempt (2026-09-05T13:28:45Z);
this tick's own run is in progress as this file writes.

## Shipped

- **seo**: RSS feeds gain `atom:link rel="self"` channel reference
  across the global feed and all 5 per-pillar feeds (`533751c9`),
  closes finding `[3.2]` + `#981`. Audit row closed same-tick
  (`24e1848a`), which also retagged the GTM consent-gate row
  `[needs-user-call]`.
- **seo**: not-found pages (root 404, article/tag soft-404) no
  longer emit two conflicting `robots` meta tags — removed the
  redundant manual `robots` field now that Next.js 16 injects
  `noindex` itself on every `notFound()` render (`8c402446`), closes
  finding `[4.8]` + `#982`. Audit row closed same-tick (`f4029023`).
- **docs**: verify-gate description (`typecheck → lint → test:run →
  test:scripts → data:validate → build → size → e2e`) corrected
  across `README.md` and 4 skill files that had drifted from the
  canonical chain in `agents.md` (`7e3cf9a9`), closes `#983`.
- **seo**: `/search` reverts to a static `metadata` export — the
  dynamic `generateMetadata`/`robots` branch (added to fix a real
  indexability gap) was forcing the whole route off static
  rendering to toggle a `noindex` flag already redundant with the
  route's self-referencing canonical tag, silently costing edge
  caching on every request including the bare page (`7bdc089b`),
  closes finding `[4.0]` + `#984`. Audit row closed same-tick
  (`6118016b`). `/search` now builds `○` (Static) again.
- **content**: newsletter issue 10's tracker recap corrected three
  "eight weeks ago" figures that had actually pulled `spark[0]`
  (7 weeks back) from the current week's array — the same
  off-by-one bug fixed twice before in issues 001 and 003/004
  (`0dda497e`), closes finding `[4.0]` + `#985`. Audit row closed
  same-tick (`fcd10b41`).
- **expand**: pass 420 — no new candidates (`d769da9d`); 34 pending
  rows (33 `[ ]` + 1 `[needs-user-call]`) unchanged.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **0 actionable rows above the 3.0 promotion
  floor** — fully drained this window (see Headline). 5 standing
  sub-3.0 rows, unchanged (two Mode Sonnet hero-art 65%→75% redraws
  `[2.7]`/`[2.0]`, a plate-materials content-tension item `[2.4]`, a
  generated-manifest-drift observation `[2.4]`, the
  unreferenced-`favicon.svg` duplicate `[1.8]`), plus 3
  `[needs-user-call]` rows (soft-404 structural trade-off `[4.2]`,
  `loop:opened` mirror-drain gap `[3.0]`, and the GTM consent-gate
  row `[3.6]` newly retagged this window).
- **`plan/CRITIQUE.md`**: last real pass 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **~119 days stale**. Only Pending row is
  the standing non-actionable `[needs-user-call]` GA-beacon 503
  item.
- **`plan/PHASE_CANDIDATES.md`**: pass 420 (ran this window,
  `d769da9d`), 33 pending `[ ]` rows plus 1 standing
  `[needs-user-call]` row = 34 total, unchanged. Last promotion:
  phase 50, 2026-08-23 via local `/oversight`. Highest-scored pending
  row is still `[7.5]` Automated content-fact-vs-catalog numeric-spec
  audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 2 open — `#929` (`triage:reviewed`,
  informational) and `#898` (`bug` + `triage:needs-user`, the
  `ACTIONS_PAT` workflow-scope limitation — same root cause as the
  pending `[score 5.5]` "Cloud loop cannot push
  .github/workflows/*.yml" candidate). No unlabeled issues. `#981`,
  `#982`, `#983`, `#984`, `#985` all closed this window via their
  shipping commits.

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
- `build` — clean production build, all routes compile; `/search`
  back to `○` (Static)
- `size` — `/page` 146.7 KB gz (budget 200 KB), `/search/page`
  144.0 KB gz (budget 175 KB) — both comfortably under budget,
  unchanged from the last digest
- `e2e` — 1223/1223 passed (~8.1m), against `next start :4173`

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`fcd10b41`) reports `READY`.

## Needs you

1. **Promote or reject the `/critique` cloud-skip diagnostic**
   (`[needs-user-call] [score 6.5]` in `PHASE_CANDIDATES.md`) — the
   fresh-eyes loop has been silent for ~119 days and the root cause
   (no Chrome MCP on the cloud runner) has been confirmed since
   expand pass 218.
2. **The GTM consent-gate finding** (`[needs-user-call] [3.6]` in
   `AUDIT.md`, retagged this window) — names a taste call:
   consent-gate the existing GTM tag vs. revert to the originally
   planned cookieless Plausible tag. `bearings.md` still documents
   the Plausible plan and needs reconciling either way.
3. **Look at the asset-hygiene dispatch-gap candidate**
   (`[score 5.5]`, filed pass 399) — it names a concrete mechanism
   fix (route `next: /ship-asset` AUDIT rows through `/ship-asset`
   instead of letting them sit sub-3.0 forever) and would drain the
   two standing Mode Sonnet hero-art redraw rows in the same commit.
4. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks `workflows`
   scope, blocking any cloud fix to `.github/workflows/*.yml`. Same
   root cause as the pending `[score 5.5]` candidate. Needs a token
   scope change outside the loop's own reach.
5. The 5 standing sub-3.0 AUDIT rows and the soft-404 /
   mirror-drain-gap `[needs-user-call]` rows remain below (or
   outside) the promotion floor and are fine to leave — flagged
   here only for visibility.

## Today's intent

No pending phase — the loop stays in `/iterate` mode. With
`AUDIT.md` at 0 actionable rows, the next `/iterate` tick's own
fresh general-purpose sweep is what will surface the next finding
(the same shape as the last several ticks that filed and drained
same-window). Worth watching whether the 21-pass expand no-candidate
streak since pass 399 keeps climbing back toward flag territory or
breaks again soon, and whether the recurring "N weeks ago"
tracker-figure bug (now fixed three times across three newsletter
issues) warrants a mechanical check rather than a fourth manual
catch — a candidate worth filing if it recurs a fourth time.

## Tuning proposals

None filed this tick. The two live signals (critique staleness,
expand cadence) are already on record in `plan/PHASE_CANDIDATES.md`;
see Headline and Needs You above.
