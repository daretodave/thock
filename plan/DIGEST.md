# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A full, productive 23h — the cross-link queue is now fully
drained for the first time, and a real root cause landed for the
oldest `blocked-cloud-permission` item.** All 24 `march` ticks since
the last digest (`1b8d5bd3`, 2026-08-21T11:07:03Z) ran green, zero
failures, zero cancellations. Roughly 11 of those ticks shipped
work; 7 more were `/expand` passes that filed no new candidates
(routine); the rest were clean no-ops.

**The last open `[cross-links]` AUDIT row closed.** The single
remaining pair flagged in yesterday's digest
(`hall-effect-rapid-trigger-plateau ↔ keychron-nova-socket-hybrid`)
drained at 13:30 UTC. `plan/AUDIT.md` now carries **zero** open
cross-link rows for the first time this loop has been tracked.

**A cloud tick tried to ship the fix for issue #395
(march.yml's crash-issue gate) and hit the predicted wall
head-on.** `pnpm verify` passed locally, but `git push` was
rejected: the `ACTIONS_PAT` backing cloud pushes lacks the
`workflows` PAT scope, so no cloud tick can ever land a change to
`.github/workflows/*.yml`. This confirms — with an exact error
message and an exact remedy — what the standing
`[blocked-cloud-permission]` rows already suspected. New issue
`#898` carries the fix instructions (add the `workflows` scope to
the PAT). This is now the clearest, most actionable `/oversight`
ask in the queue.

**Three `/search` fixes landed back-to-back on the same surface**
overnight (03:31–05:24 UTC): a URL-sync gap, then a trailing-space
regression the URL-sync fix itself introduced, then a runtime-
loading flash. Each fix's regression guard caught the next bug
within about an hour — reactive, but the surface is now stable
(no fourth instance since).

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground legs per the standing rule.
Deploy is `READY` at HEAD (`f44964fe`, `dpl_1syuR3BV`).

`plan/CRITIQUE.md` is **still 104 days / 2,378 commits** since its
last pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
architectural diagnosis (no Chrome MCP on the cloud runner), called
out again as the loop's longest-running blind spot.
`plan/PHASE_CANDIDATES.md` holds **30 live pending rows** (plus 1
`needs-user-call`), **69 days** since the last `/oversight`
promotion (2026-06-14, phases 46-49). `plan/AUDIT.md` carries **5
open rows**, all standing non-autonomous items — no routine or
content rows open.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-21 11:13 → 11:26 | content-dispatch + content | issue `#888` opened; newsletter — "thock weekly — issue 08" (`1c90fc34`/`3fa0b851`/`993e33ce`) |
| 08-21 13:30 | audit | hall-effect-rapid-trigger-plateau cross-link addressed, closes 1 row — **cross-link queue now fully drained** (`3e65b13e`/`88036fa5`) |
| 08-21 14:29 | audit | hot-swap-sockets-tradeoffs dangling verdict-paragraph referent fixed, closes `#891` (`3ae38750`/`e2e3a483`) |
| 08-21 15:30 | audit | pillar `loading.tsx` right-rail skeleton fix, closes `#892` (`26d06b6b`/`70b7f7d4`) |
| 08-21 16:34 | audit | `/search` bundle-size — dynamic-import MiniSearch runtime, closes `#893` (`9b1bced8`/`354ce246`) |
| 08-21 18:27 | expand | pass 329 — 0 new candidates, mirror-drain-gap reinforced (9th instance) |
| 08-21 19:26 | audit | stale `updatedAt` bumped on 3 articles (`c309e5d7`/`155c85e8`) |
| 08-21 20:20 | expand | pass 330 — 0 new candidates, unchanged |
| 08-21 21:26 | expand | pass 331 — 0 new candidates, unchanged |
| 08-21 22:23 | audit | quiz `setTimeout` unmount leak fixed, closes 4 stale issues (`912ded26`/`a79cc413`) |
| 08-21 23:16 | expand | pass 332 — 0 new candidates, mirror-drain-gap partially resolved |
| 08-22 00:11 → 00:21 | march + expand | clean; pass 333 — 0 new candidates, unchanged |
| 08-22 01:30 → 02:23 | march ×2 | clean, no-op |
| 08-22 03:17 → 03:31 | march + audit | `/search` URL-sync gap fixed, closes `#895` (`e6677518`/`6950a8ee`) |
| 08-22 04:12 → 04:34 | march + audit | `/search` trailing-space regression fixed, closes `#896` (`c956d70c`/`1d296c45`) |
| 08-22 05:07 → 05:24 | march + audit | `/search` runtime-loading flash fixed, closes `#897` (`d5ee391c`/`d1a11eac`) |
| 08-22 06:07 → 06:14 | march + expand | clean; pass 334 — 0 new candidates, unchanged |
| 08-22 07:13 | march | clean, no-op — cloud tick attempted the `#395` fix, `git push` rejected on `.github/workflows/march.yml` (no commit; issue `#898` filed) |
| 08-22 08:06 → 09:07 | march ×2 | clean, no-op |
| 08-22 09:32 | audit | 404 did-you-mean off-catalog relevance fixed, closes `#899` (`5039d888`/`07400cfc`) |
| 08-22 10:05 → 10:10 | march + expand | clean; pass 335 — 0 new candidates, unchanged |

24 `march`-workflow runs since the last digest: **24 success, 0
failure, 0 cancelled.** `night` ran success on its prior attempt
(2026-08-21); this tick's run is in progress as this file writes.

## Shipped

- **One content piece**: newsletter "thock weekly — issue 08" —
  routine cadence, 8 days since issue 07.
- **Cross-link drain, 1 pair**: `hall-effect-rapid-trigger-plateau ↔
  keychron-nova-socket-hybrid` — the last open `[cross-links]` row.
  `plan/AUDIT.md` now carries **zero** open cross-link rows.
- **Six bug fixes**: a dangling verdict-paragraph referent
  (hot-swap-sockets-tradeoffs), a pillar `loading.tsx` right-rail
  skeleton gap, a `/search` bundle-size regression (dynamic-import
  fix), a quiz `setTimeout` unmount leak (closed 4 stale mirrored
  issues in one commit), and three sequential `/search` fixes
  (URL-sync gap → trailing-space regression → runtime-loading
  flash).
- **One SEO maintenance commit**: bumped stale `updatedAt` on 3
  articles touched by same-window content fixes.
- **Seven `/expand` passes** (329–335): 0 new candidates each;
  pass 329 reinforced the standing mirror-drain-gap candidate to a
  9th confirmed instance, pass 332 noted a partial resolution.
  Nothing new promoted or filed.
- **One blocked ship attempt, root-caused**: a cloud tick tried to
  land the `#395` fix (`march.yml`'s crash-issue gate) and confirmed
  the `ACTIONS_PAT` lacks `workflows` scope — filed as `#898` with
  the exact remedy. No code shipped from that tick (correctly — the
  push was rejected, not skipped).

## Queues now

- **Build plan**: all 51 phases shipped, 0 pending.
- **Cross-link drain**: **0 open `[cross-links]` rows** — fully
  drained for the first time this loop has been tracked (down from
  1 in the last digest, 6 the digest before).
- **Critique**: pass 11, 2026-05-10 — **104 days / 2,378 commits**
  stale. Diagnosed as architectural (no Chrome MCP on the cloud
  runner), not neglect. Same diagnosis for over three months now —
  see Needs You below.
- **Phase candidates**: **30 live pending** rows in
  `plan/PHASE_CANDIDATES.md` (plus 1 `needs-user-call`), pass 335.
  **69 days** since the last `/oversight` promotion (2026-06-14,
  phases 46-49). The `[7.5]` trend-snapshot data-quality gate and
  the `[7.5]` content-fact-vs-catalog numeric-spec audit remain the
  strongest candidates waiting on the next promotion pass.
- **Data backlog**: empty — `data/BACKLOG.md`'s Pending section is
  fully checked off.
- **Open GitHub issues**: **19 open**, down from 23 in the last
  digest. 0 unlabeled (triage gate clean). **6 labeled
  `triage:needs-user`** (`#898` new, `#883`, `#756`, `#639`, `#499`,
  `#434`) — `#898` is the fresh, concrete `ACTIONS_PAT` scope
  finding; the other 5 are past cloud-infra incidents already
  confirmed stable by this window's clean ticks. 2 labeled
  `triage:reviewed` (`#882`, `#437`, no action needed). 11 remaining
  `loop:opened` issues are the standing mirror-drain-gap set,
  unchanged.

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 packages.
- `lint` — green, all lintable workspaces (`next lint`'s Next-16
  deprecation notice is cosmetic, not a failure).
- `test:run` — green, **166 files / 1,222 tests** (web: 109 files /
  845 tests; content: 24 files / 164 tests; data: 19 files / 129
  tests; seo: 5 files / 44 tests; ui: 7 files / 31 tests; e2e-unit:
  1 file / 6 tests; tokens: 1 file / 3 tests).
- `test:scripts` — green, **74 suites / 207 tests**.
- `data:validate` — green, **81 records**, all cross-refs resolve
  (11 vendors, 18 switches, 10 keycap-sets, 10 boards, 17 group-buys,
  15 trends).
- `build` — green, first attempt, no retries.
- `size` — green, homepage bundle **108.8 KB / 200 KB** budget;
  `/search` **106.5 KB / 150 KB** budget (the dynamic-import fix
  from this window holds).
- `e2e` — green, **1,168/1,168** in ~6.0m. Console noise from
  intentional not-found-route `NoFallbackError` probes during the
  run is expected, not a regression (documented in prior digests).
- `pnpm deploy:check` at HEAD (`f44964fe`) — deploy `READY`
  (`dpl_1syuR3BV`).

Zero red legs this tick — nothing new filed to `plan/AUDIT.md` from
breadth.

## Needs you

1. **New, concrete: `ACTIONS_PAT` lacks the `workflows` PAT scope
   (`#898`).** Root-caused this window with an exact rejection
   message: no cloud tick can ever push a change to
   `.github/workflows/*.yml`, confirmed by a live attempt to ship
   `#395`. Fix is a one-time token-settings change (Settings →
   Developer settings → Personal access tokens → add "Workflows:
   Read and write" scope, or fine-grained equivalent). Unblocks two
   ready-to-ship fixes at once: `#395` (march.yml crash-issue gate,
   `[6.3]`) and `#620` (heartbeat.yml dedup scope, `[4.0]`). This is
   now the single highest-leverage `/oversight` action available —
   a 5-minute token change clears two standing AUDIT rows.
2. **Standing: `plan/CRITIQUE.md` is 104 days stale.** The
   fresh-eyes loop has been dark since pass 11 (2026-05-10);
   diagnosed as a cloud-runner Chrome MCP gap, not neglect, but it's
   been the same diagnosis for over three months now. Worth an
   `/oversight` call on whether to run `/critique` locally on a
   manual cadence in the meantime rather than leave the queue
   permanently waiting on cloud tooling.
3. **Standing: Lighthouse CI disabled ~71 days**, `[4.0]`
   `plan/AUDIT.md` row, `needs: /oversight call` on whether to
   re-enable now or investigate the original 2026-06-12 disable
   reason first.
4. **Standing: mirror-drain-gap `[needs-user-call] [3.0]`** — now
   at 9 confirmed instances across 5 subsystems (expand pass 329).
   The quiz-`setTimeout` fix this window closed 4 of the mirrored
   issues in one commit, which is encouraging, but the underlying
   survey (`content-gap-survey.mjs`) still never files the specific
   topic, only a generic pillar-quota row — the structural gap is
   unchanged.
5. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`[4.2]`) — non-autonomous, unchanged.
6. **Standing, growing: the `/oversight` promotion backlog.** 30
   live candidates pending, 69 days since the last promotion. The
   two `[7.5]` candidates (trend-snapshot data-quality gate,
   content-fact-vs-catalog numeric audit) are the clearest next
   picks.

## Today's intent

No phase or content-gap work is queued — Rule 1 is comfortable, the
build plan is fully shipped, and the cross-link queue is fully
drained for the first time. The next `/march` tick's most likely
autonomous action is another routine drain (newsletter cadence not
due for ~6 more days) or a fresh audit sweep if nothing else is
pending — the loop has been finding roughly one qualifying `≥3.0`
finding per tick even in maintenance-shaped windows. The main open
question is the same one carried forward: the `#898` PAT-scope fix
is now sitting ready and is the highest-leverage `/oversight` action
in the queue, alongside the standing asks above (critique staleness,
Lighthouse, promotion backlog).

## Tuning proposals

**None new this tick.** The meta-loop signals visible tonight
(mirror-drain-gap, the `ACTIONS_PAT` workflow-scope block) are
already filed as pending `plan/PHASE_CANDIDATES.md` candidates or
GitHub issues from prior ticks — tonight's activity reinforced and,
in the quiz-setTimeout case, partially drained the mirror-drain-gap
signal rather than surfacing a new one. `/expand`'s cadence and
hit-rate look healthy (7 passes this window, all reinforcement or
clean, no thrash); no fresh gate mistuning found.
