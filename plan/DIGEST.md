# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The loop went fully dark for ~96 hours — the first multi-day
outage this project has recorded — and this digest is the first
successful `night` tick since it started.** The last commit before
the outage was `8ecfd869` (2026-08-16T00:15Z). `march` then failed
84 of the next 97 scheduled runs (13 more were cancelled), every
inspected failure showing `is_error: true` / `api_error_status: 403`
(a rejected Claude API call) from the first failure at
2026-08-16T09:07Z through the last at 2026-08-20T09:11Z. `night`
(this workflow) failed the same way on 08-16, 08-17, 08-18, and
08-19 — four straight missed digests. The very next scheduled `march`
tick (2026-08-20T10:08Z) ran clean end to end but shipped nothing
(nothing was pending); this `night` tick, running now, is the
recovery.

**Nobody's fault visible in the repo — this reads as an external
auth/access hiccup, not a code regression.** No commit in the outage
window touches auth, secrets, or CI config; the failure signature
(403 on every single call, for exactly this window, self-clearing
with no code change) is consistent with an expired or rotated
credential rather than a bug this loop introduced. **Needs you**
below has the specific ask: verify the Claude Code OAuth token
backing `march.yml`/`night.yml` isn't due to rotate again soon — this
is the fourth cloud-infra incident of this general shape in the
`triage:needs-user` queue (`#756`, `#639`, `#499`, `#434`), and this
one was by far the longest.

**Automated detection was thinner than expected.** `march.yml`'s own
per-run crash-issue gate has a known bug (`[6.3]` AUDIT row, open
since 2026-07-05, blocked on a workflow-file push-permission gap) —
it never fires on an action-level failure, so none of the 84 failed
runs this window filed their own issue. The only backstop was
`heartbeat.yml`'s independent 6-hourly flatline check, and it took
~75h to fire (issue `#883`, 2026-08-19T12:24Z) with a body claiming
"308h" since the last completed tick — a figure that doesn't
reconcile with the observed hourly failure cadence. Filed as a new
tuning proposal below (heartbeat measures *last completed* run, not
*last successful* one, which structurally can't catch a fail-fast
loop — plus the 308h number itself needs tracing).

**One concrete casualty: a content dispatch stranded mid-flight.**
At 2026-08-16T00:15Z, 9 minutes before the outage's first failure,
`march` opened issue `#881` for the guides-pillar hot-pursuit
article (Rule 1 sliding-window, ANSI/ISO/JIS layout buying guide) and
handed off to `/ship-content` — which never got a tick to run. The
issue is still open, no MDX file exists for it, and it's still the
single `[HOT PURSUIT]` row in `plan/AUDIT.md`. It's the obvious next
action once the loop resumes ticking on its normal cadence.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green on the first attempt, no retries, nothing new filed to
`plan/AUDIT.md`. Deploy is `READY` at HEAD (`8ecfd869`,
`dpl_8Lr9zrGV`).

`plan/CRITIQUE.md` is **102 days / 2333 commits** since its last pass
(11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
architectural diagnosis (no Chrome MCP on the cloud runner).
`plan/PHASE_CANDIDATES.md` holds **27 live pending rows** (up 1 —
pass 322's read-time regression-guard candidate; this tick adds a
28th, the heartbeat tuning proposal above), **67 days** since the
last `/oversight` promotion (2026-06-14, phases 46-49). `plan/AUDIT.md`
carries **6 open rows** — 5 standing non-autonomous items plus the
`[HOT PURSUIT]` content-gap row — unchanged by this tick's clean
breadth check.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-15 11:29 | fix | readTime doesn't count PullQuote attribution text `[2.8]` (`35c0c2a2`/`11f032df`) |
| 08-15 12:24 | data | link Wuque Studio W33 tracker row to its companion article `[4.5]` (`3a4dba88`/`0e0f3adc`) |
| 08-15 14:27 | fix | readTime doesn't strip markdown table syntax `[4.5]` (`8bf441a0`/`352c3644`) |
| 08-15 15:23 | data | trend snapshots W20 + W31 — direction contradicts same-file diff `[4.2]` (`69824664`/`a1989a19`) |
| 08-15 16:22 | fix | readTime doesn't count PartReference-rendered part names `[3.5]` (`d2d2720f`/`ab30875a`) |
| 08-15 17:41 | expand | pass 322 — 1 candidate filed (read-time regression guard, `[6.0]`) |
| 08-15 18:11 | expand | pass 323 — no candidates |
| 08-15 19:14 | expand | pass 324 — no candidates |
| 08-15 20:11 | expand | pass 325 — no candidates |
| 08-15 21:30 | expand | pass 326 — 0 new, 2 reinforced |
| 08-15 22:21 | fix | part pages — two truncation call sites missed the shared `truncate()` migration `[3.6]` (`089c0511`/`0039e0b0`, closes `#827`) |
| 08-15 23:13 | expand | pass 327 — 0 new, mirror-drain-gap candidate's `#827` instance resolved |
| 08-16 00:13 | audit | content-gap row auto-filed by `content-gap-survey.mjs` |
| 08-16 00:15 | content-dispatch | guides pillar hot-pursuit — issue `#881` opened, `/ship-content` handoff queued |
| **08-16 09:07 → 08-20 09:11** | **OUTAGE** | **84 failed + 13 cancelled `march` runs, 0 commits, ~96h — see Headline** |
| 08-20 10:08 | march | recovery tick — clean run, 0 commits (nothing pending, `#881` not yet picked up) |

120 `march`-workflow runs since the last digest (`bf811fc0`,
2026-08-15T10:55:14 UTC): **23 success, 84 failure, 13 cancelled.**
22 of the 23 successes landed in the first ~21h (the active window
above); the 23rd is this window's lone recovery no-op. `night` ran
success (08-15, the last digest) then **failure ×4** (08-16 through
08-19, same 403 signature) before this tick.

## Shipped

- **readTime undercount, 3 more instances (5 total across this
  window and the prior one)**: `computeReadTime()` now also folds in
  `<PullQuote attribution="...">` text, strips markdown table
  syntax it was previously mis-counting as words, and resolves
  `<PartReference id="...">` to the referenced part's real name
  before counting. Expand pass 322 audited the full `mdxComponents`
  map afterward and confirmed the bug class is now corpus-clean —
  filed a regression-guard candidate instead of a 6th reactive fix.
- **Two data fixes**: a W33 tracker row linked to its companion
  article (Wuque Studio); two trend-snapshot `direction` fields
  corrected where they contradicted their own same-file diff (W20,
  W31).
- **Part-page truncation, closing a 4-day-old gap**: two call sites
  (`page.tsx`'s `shortDescription()`, `PartIndexCard.tsx`'s
  `summarize()`) had hand-rolled the pre-`truncate()` slicing pattern
  and missed the shared-helper migration — filed publicly as `#827`
  on 2026-08-11, sat unfixed until this tick, which pass 326's notes
  had already flagged as a confirming instance of the standing
  mirror-drain-gap candidate.
- **6 expand passes** (322–327), 1 new candidate filed.

## Queues now

- **Build plan**: all phases shipped, 0 pending. No phase work
  queued.
- **Cross-link drain**: 0 open `[cross-links]` rows — unchanged.
- **Critique**: pass 11, 2026-05-10 — **102 days / 2333 commits**
  stale. Diagnosed as architectural (no Chrome MCP on the cloud
  runner), not neglect. Unchanged from prior digests.
- **Phase candidates**: **27 live pending** rows in
  `plan/PHASE_CANDIDATES.md` (up 1 from the last digest's 28... note:
  this digest recount used a stricter method that excludes the
  file's own archived/commented blocks, which the last few digests'
  headline counts did not consistently exclude — treat 27 as the
  corrected baseline going forward). This tick adds a 28th (the
  heartbeat tuning proposal, see Headline). **67 days** since the
  last `/oversight` promotion (2026-06-14, phases 46-49). The
  `[7.5]` trend-snapshot data-quality gate candidate remains the
  strongest single item for the next promotion pass.
- **Data backlog**: empty — all rows in `data/BACKLOG.md`'s Pending
  section are already shipped and checked off.
- **Open GitHub issues**: **23 open** (up from 21 at the last
  digest). 0 unlabeled (triage gate clean). **5 labeled
  `triage:needs-user`** (up from 4 — new: `#883`, this window's
  flatline alarm). `#881` (guides content-gap, opened 08-16, still
  unshipped) is the one fresh loop-opened issue from this window.

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 packages.
- `lint` — green, all lintable workspaces (`next lint`'s Next-16
  deprecation notice is cosmetic, not a failure).
- `test:run` — green, **1212 tests / 166 files** across 7 workspaces
  (835 web + 164 content + 129 data + 44 seo + 31 ui + 6 e2e + 3
  tokens).
- `test:scripts` — green, **207 tests / 74 suites**.
- `data:validate` — green, **81 records**, all cross-refs resolve
  (11 vendors, 18 switches, 10 keycap-sets, 10 boards, 17 group-buys,
  15 trends).
- `build` — green, first attempt, no retries.
- `size` — green, homepage bundle **108.7 KB / 200 KB** budget.
- `e2e` — green, **1153/1153**. Console noise from intentional
  not-found-route `NoFallbackError` probes during the run is
  expected, not a regression.
- `pnpm deploy:check` at HEAD (`8ecfd869`) — deploy `READY`
  (`dpl_8Lr9zrGV`).

Zero red legs this tick — nothing new filed to `plan/AUDIT.md` from
breadth. The 4-day outage above is a CI/auth incident, not a verify
failure, and shows up in Needs You instead.

## Needs you

1. **New, HIGH: verify the Claude Code OAuth credential backing
   `march.yml`/`night.yml`.** Every failed run in the 96h outage
   (2026-08-16T09:07Z → 2026-08-20T09:11Z, 84 runs) shows
   `api_error_status: 403` — a rejected API call, not a code or
   verify-gate failure. It self-cleared with no repo change, which
   points at a credential (expired token, temporary access issue) on
   the Anthropic/Claude Code side rather than anything in this repo.
   This is the 4th `triage:needs-user` cloud-infra incident on record
   (`#756`, `#639`, `#499`, `#434`) and by far the longest (prior
   ones were single-tick blips). Worth confirming the token's
   validity window now so a fifth incident isn't a surprise.
2. **New: pick up issue `#881`** (guides pillar — ANSI vs ISO vs JIS
   layout buying guide). Opened 08-16, stranded when the outage hit 9
   minutes later, still open, no article drafted. It's the one `[HOT
   PURSUIT]` row in `plan/AUDIT.md` — the next `/march` tick should
   dispatch `/ship-content` for it directly.
3. **New tuning proposal filed this tick** (see
   `plan/PHASE_CANDIDATES.md`): `heartbeat.yml`'s flatline alarm
   checks "last completed" run, not "last successful" one — a
   workflow that fails on every scheduled tick (this incident,
   exactly) can never trip a completed-based check, since failing
   runs still complete on schedule. It did eventually fire (`#883`,
   ~75h in) but with a "308h" figure that doesn't reconcile with the
   observed hourly cadence — worth tracing separately. Proposal is a
   workflow-file change, so it likely needs the same `/oversight`
   path as the item below.
4. **Standing, reinforced by this incident: `march.yml`'s crash-issue
   gate `[6.3]` AUDIT row** (blocked on cloud workflow-file push
   permission, open since 2026-07-05). This window is fresh evidence
   of the cost: 84 failed runs, 0 auto-filed crash issues — heartbeat
   was the only backstop, and it's the thing item 3 above just found
   a gap in.
5. **Standing: Lighthouse CI disabled ~66 days**, `[4.0]`
   `plan/AUDIT.md` row, `needs: /oversight call` on whether to
   re-enable now or investigate the original disable reason first.
6. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[blocked-cloud-permission] [5.5]` candidate, `[6.3]`/
   `[4.0]` AUDIT rows, issue `#395`). This is the shared blocker on
   items 3 and 4 above — resolving the PAT/App scope question unblocks
   both a ready two-line fix and a new one-line-ish fix in one
   `/oversight` pass.
7. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`[4.2]`) — non-autonomous, unchanged.
8. **Standing, growing: the `/oversight` promotion backlog.** 27 live
   candidates pending (28 after this tick), 67 days since the last
   promotion. The `[7.5]` trend-snapshot data-quality gate remains
   the clearest single item to act on next.

## Today's intent

`plan/AUDIT.md`'s one actionable row is the `[HOT PURSUIT]`
content-gap for the guides pillar (issue `#881`) — the next `/march`
tick should dispatch `/ship-content` for it directly, closing the
gap the outage opened. Beyond that, this tick's breadth check was
fully clean, so there's no fresh autonomously-actionable AUDIT.md row
to chase. The main open question isn't "what to fix" but "is the loop
actually back to its normal cadence" — worth watching the next few
scheduled `march` ticks land clean before treating this as fully
resolved.

## Tuning proposals

**One filed this tick**, in `plan/PHASE_CANDIDATES.md`: `[score 5.5]`
`heartbeat.yml`'s flatline alarm measures last-*completed* run
instead of last-*successful* run, which structurally can't catch a
fail-fast loop (exactly this incident's shape) until something
entirely different stops runs from completing at all — plus the
alarm's own "308h" figure in issue `#883` doesn't reconcile with the
observed hourly failure cadence and needs tracing. Filed as a
candidate, not applied — it's a workflow-file change subject to the
same cloud push-permission constraint as the sibling `[6.3]`
crash-issue-gate row, so it likely rides along with that row's
`/oversight` resolution. No other gate mistuning found this tick:
`/expand`'s cadence and hit-rate look healthy in the active window
(1 candidate filed across 6 passes), and the 60-commit/24h cloud
ceiling was nowhere near tested (0 cloud-shipped commits in the last
24h per this tick's own ceiling check).
