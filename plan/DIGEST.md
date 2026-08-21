# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Quiet, healthy night — the loop's first fully clean 24h since the
403 outage.** All 25 `march` ticks since the last digest
(`9d5b936b`, 2026-08-20T11:01:52Z) ran green, zero failures, zero
cancellations. The prior digest's top ask — confirm the Claude Code
OAuth credential behind `march.yml`/`night.yml` — now has a full
day of clean hourly ticks as supporting evidence; worth treating
that watch item as resolved unless another 403 cluster shows up.

**Six of those ticks shipped work; the rest were no-ops.** Three
content pieces landed (guides ANSI/ISO/JIS layout guide, ideas
hot-swap-sockets tradeoffs, trends Hall-effect plateau), each with
its audit-closure pair; two content dispatches opened mirror issues
(`#884`, `#885`); one `/expand` pass (328) reinforced the standing
mirror-drain-gap candidate with a 5th confirmed subsystem instance;
and two audit ticks drained cross-link clusters (hot-swap-sockets:
4 pairs, ansi-iso-jis: 2 pairs). The cross-link queue is now down to
a single open row — the closest it's been to fully drained.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground legs per the standing rule
(the full command timed out past 10 minutes as one call and was
split; every leg passed on its own). Deploy is `READY` at HEAD
(`17ec13fe`, `dpl_4jFtuQPJ`).

`plan/CRITIQUE.md` is **still 102 days / 2347 commits** since its
last pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) —
unchanged architectural diagnosis (no Chrome MCP on the cloud
runner), called out loudly again since it's the loop's longest-
running blind spot. `plan/PHASE_CANDIDATES.md` holds **30 live
pending rows**, **68 days** since the last `/oversight` promotion
(2026-06-14, phases 46-49). `plan/AUDIT.md` carries **7 open rows**
— 5 standing non-autonomous items, the single remaining cross-link
row, and a fresh routine newsletter-cadence row.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-20 10:08 → 08-20 15:11 | march ×5 | clean, no-op (nothing pending) |
| 08-20 16:08 | content | guides — "ANSI, ISO, or JIS: a practical layout buying guide" (`36011843`/`408f493e`) |
| 08-20 17:08 | content-dispatch + content | issue `#884` opened; ideas — "Hot-swap sockets: what you actually give up for the convenience" (`5b5434c6`/`d702feb9`/`b0998f54`) |
| 08-20 18:08 | content-dispatch | issue `#885` opened, no ship this tick (`8da8be9f`) |
| 08-20 19:13 → 08-21 05:11 | march ×10 | clean, no-op |
| 08-21 06:10 | content | trends — "Hall-effect stopped climbing. That's not the same as cooling off." (`6b67670a`/`f9faf6e0`) |
| 08-21 07:18 | expand | pass 328 — 0 new candidates, mirror-drain-gap reinforced (5th subsystem instance) |
| 08-21 08:13 | march | clean, no-op |
| 08-21 09:13 | audit | hot-swap-sockets-tradeoffs cross-link cluster addressed, 4 pairs drained (`84d1ffb2`/`9be93a50`) |
| 08-21 10:08 | audit | ansi-iso-jis-keyboard-layout-guide cross-link cluster addressed, 2 pairs drained (`c1a9e71a`/`17ec13fe`) |

25 `march`-workflow runs since the last digest: **25 success, 0
failure, 0 cancelled.** `night` ran success this tick — first
attempt after the prior digest, no missed days.

## Shipped

- **Three content pieces**, each with its audit-closure pair: guides
  pillar "ANSI, ISO, or JIS: a practical layout buying guide"
  (closing the outage-stranded `#881` hot-pursuit gap flagged in the
  last digest), ideas pillar "Hot-swap sockets: what you actually
  give up for the convenience," trends pillar "Hall-effect stopped
  climbing. That's not the same as cooling off."
- **Cross-link drain, 6 pairs across 2 articles**: hot-swap-sockets-
  tradeoffs (4 pairs) and ansi-iso-jis-keyboard-layout-guide
  (2 pairs) each got their prose cross-links written and their
  `[cross-links] [4.5]` AUDIT rows closed. `plan/AUDIT.md` now
  carries just one open cross-link row.
- **One `/expand` pass** (328): 0 new candidates, but confirmed a
  5th subsystem instance of the standing mirror-drain-gap candidate
  (`loop:opened` issues that survive the ship that should have
  closed them) — reinforcement, not a new finding.

## Queues now

- **Build plan**: all phases shipped, 0 pending. No phase work
  queued.
- **Cross-link drain**: **1 open `[cross-links]` row** —
  `hall-effect-rapid-trigger-plateau ↔ keychron-nova-socket-hybrid`
  (same pillar, ≥2 shared tags: magnetic, trends-2026). Down from 6
  open rows this morning; the closest the queue has been to fully
  drained.
- **Critique**: pass 11, 2026-05-10 — **102 days / 2347 commits**
  stale. Diagnosed as architectural (no Chrome MCP on the cloud
  runner), not neglect. Unchanged from the last digest — still the
  loop's longest-standing signal gap, worth an `/oversight` look at
  whether a local-only `/critique` cadence (run by hand, not cloud)
  is the right long-term shape rather than waiting on cloud Chrome
  MCP access.
- **Phase candidates**: **30 live pending** rows in
  `plan/PHASE_CANDIDATES.md`, pass 328. **68 days** since the last
  `/oversight` promotion (2026-06-14, phases 46-49). The `[7.5]`
  trend-snapshot data-quality gate and the `[7.5]` content-fact-vs-
  catalog numeric-spec audit remain the strongest candidates waiting
  on the next promotion pass.
- **Data backlog**: empty — all rows in `data/BACKLOG.md`'s Pending
  section are already shipped and checked off.
- **Open GitHub issues**: **23 open**, unchanged from the last
  digest. 0 unlabeled (triage gate clean). **5 labeled
  `triage:needs-user`** (`#883`, `#756`, `#639`, `#499`, `#434`) —
  unchanged; all are past cloud-infra incidents now confirmed stable
  by this window's 25 clean ticks. `#884`/`#885` (this window's
  content-dispatch mirror issues) are already closed by their
  matching ships.

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (the combined
command exceeded a single foreground budget and was split per the
standing rule — never backgrounded):

- `typecheck` — green, 9 packages.
- `lint` — green, all lintable workspaces (`next lint`'s Next-16
  deprecation notice is cosmetic, not a failure).
- `test:run` — green, **133 files / 999 tests** (web: 109 files /
  835 tests; content: 24 files / 164 tests).
- `test:scripts` — green, **74 suites / 207 tests**.
- `data:validate` — green, **81 records**, all cross-refs resolve
  (11 vendors, 18 switches, 10 keycap-sets, 10 boards, 17 group-buys,
  15 trends).
- `build` — green, first attempt, no retries, 270 static pages.
- `size` — green, homepage bundle **108.7 KB / 200 KB** budget.
- `e2e` — green, **1165/1165** in 8.0m. Console noise from
  intentional not-found-route `NoFallbackError` probes during the
  run is expected, not a regression.
- `pnpm deploy:check` at HEAD (`17ec13fe`) — deploy `READY`
  (`dpl_4jFtuQPJ`).

Zero red legs this tick — nothing new filed to `plan/AUDIT.md` from
breadth.

## Needs you

1. **Resolved (monitoring only): the OAuth-credential watch item
   from the last digest.** 25/25 clean `march` ticks since, 0 403s.
   Downgrading from an active ask to a passive watch — flag again
   only if another failure cluster with the same signature appears.
2. **Standing: `plan/CRITIQUE.md` is 102 days stale.** The fresh-
   eyes loop has been dark since pass 11 (2026-05-10); diagnosed as
   a cloud-runner Chrome MCP gap, not neglect, but it's been the
   same diagnosis for over three months now. Worth an `/oversight`
   call on whether to run `/critique` locally on a manual cadence in
   the meantime rather than leave the queue permanently waiting on
   cloud tooling.
3. **Standing: Lighthouse CI disabled ~70 days**, `[4.0]`
   `plan/AUDIT.md` row, `needs: /oversight call` on whether to
   re-enable now or investigate the original 2026-06-12 disable
   reason first.
4. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[blocked-cloud-permission]` on both the `[6.3]`
   march.yml crash-issue-gate row and the `[4.0]` heartbeat.yml
   dedup-scope row, issue `#395`). Resolving the PAT/App scope
   question unblocks two ready fixes in one `/oversight` pass.
5. **Standing: mirror-drain-gap `[needs-user-call] [3.0]`** —
   reinforced again this tick by expand pass 328 (5th confirmed
   subsystem instance). `loop:opened` issues can go permanently
   un-drained if a ship closes a different issue than the one that
   requested it; the underlying survey (`content-gap-survey.mjs`)
   never files the specific topic, only a generic pillar-quota row.
6. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`[4.2]`) — non-autonomous, unchanged.
7. **Standing, growing: the `/oversight` promotion backlog.** 30
   live candidates pending, 68 days since the last promotion. The
   two `[7.5]` candidates (trend-snapshot data-quality gate,
   content-fact-vs-catalog numeric audit) are the clearest next
   picks.

## Today's intent

No phase or content-gap work is queued — Rule 1 is comfortable and
the build plan is fully shipped. The next `/march` tick's most
likely autonomous action is draining the single remaining cross-
link row (`hall-effect-rapid-trigger-plateau ↔
keychron-nova-socket-hybrid`) or the newsletter-cadence row (issue
008 due, 8 days since issue 7, routine). Nothing urgent — the main
open question is the same one carried from the last digest's
resolved item: watching that the loop's clean run continues, plus
the standing `/oversight` asks above (critique staleness, Lighthouse,
workflow-push permission, promotion backlog) which only a human call
can move forward.

## Tuning proposals

**None new this tick.** The meta-loop signals visible tonight
(mirror-drain-gap, heartbeat.yml's completed-vs-successful alarm
logic) are already filed as pending `plan/PHASE_CANDIDATES.md`
candidates from prior ticks — pass 328's expand run reinforced
mirror-drain-gap rather than filing a duplicate. `/expand`'s cadence
and hit-rate look healthy (1 pass this window, reinforcement not
noise); no fresh gate mistuning found.
