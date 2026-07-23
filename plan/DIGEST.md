# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean 23h42m, 36-commit window — 22/22 `march` runs green (up
from 21/22 last digest, no crash-issue-gate recurrence this time) —
dominated by a 7-instance burst of the same sitewide focus-visible
a11y gap the loop keeps fixing component-by-component instead of
once. This tick's own fresh `pnpm verify` is green top to bottom.**
Since the last digest (`8c517fb`, 2026-07-22T11:29:59Z) the loop
landed 36 commits: 7 focus-visible a11y fixes (search results
links, sitewide primary nav, group-buy row CTAs, error/not-found
boundaries, quiz result cards + footer links, footer nav links,
newsletter subscribe button + attribution link), 1 aria-live a11y
fix (search results panel), 2 content fact-fixes (newsletter
tracker-figure correction, keychron-nova-socket-hybrid alt-text/chart
week mismatch), 1 UX fix (home group-buys widget rows now
clickable), 1 Rule-1 content-gap dispatch (ideas pillar — "Mixing
keycap profiles on one board: what actually works") with its
cross-link follow-up, and **8** `/expand` passes (210–217: pass 210
filed 1 new candidate, `[score 6.5]` "Sitewide focus-visible default
+ coverage check," after reading a 5-instance cluster in its own
window; passes 211–217 filed nothing, seven consecutive no-candidate
ticks). The standout signal is that pass 210's candidate diagnosed
the focus-visible gap *before* this window ended, yet two more
instances (footer nav, newsletter form) shipped reactively *after*
the candidate was filed — the automation that would stop this
one-off-fix pattern is still sitting unpromoted while the ninth
cumulative instance across two digest windows just landed. This
tick's full breadth `pnpm verify` is green fresh, run as seven
sequential foreground legs: typecheck all 8 workspaces, 684 web unit
tests / 97 files (up from 675), 161 script tests / 59 suites
(unchanged), 74 data records (cross-refs resolve, unchanged), build
all canonical routes (72 articles, up from 71; 4 newsletters
unchanged), homepage bundle flat at 109.1 KB / 200 KB, and
**1074/1074 e2e** (up from 1071). Deploy is `READY` at HEAD
(`cd71e77`).

`plan/CRITIQUE.md` is now **74 days / 1604 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis, still the standing item, still unpromoted at `[score 6.5]`
in `plan/PHASE_CANDIDATES.md` (filed 2026-07-03, now 20 days
pending). `plan/PHASE_CANDIDATES.md` sits at **19 pending rows** (up
1 — pass 210's new focus-visible-default candidate). **Correction to
the last digest's promotion-age figure:** the file's actual most
recent `promoted:` line is **2026-06-11** (phases 43/44/45,
"promote all three"), not 2026-05-23 as previously reported — that
puts the promotion gap at **42 days**, not 60. No `march` runs failed
this window (22/22 green) — a clean improvement over the last
digest's one silent crash.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-22 11:55 | iterate | a11y — search results panel gains aria-live announcement `[4.8]` (`336d194`/`badb766`) |
| 07-22 12:46-12:47 | iterate | content — newsletter 01/02 tracker "eight weeks ago" figures corrected `[4.0]` (`cba64cf`/`7a1f6df`) |
| 07-22 13:55 | iterate | a11y — search result links gain focus-visible ring `[6.3]` (`1fe037e`/`542f9e0`) |
| 07-22 14:56-14:57 | iterate | a11y — sitewide primary nav gains focus-visible ring `[6.3]` (`0fdb837`/`f65c871`) |
| 07-22 15:48 | iterate | a11y — group-buy row CTAs gain focus-visible ring `[6.3]` (`428fb43`/`e7fb4dd`) |
| 07-22 16:54-16:55 | iterate | a11y — sitewide error/not-found boundaries gain focus-visible ring `[6.3]` (`f0d8aed`/`884ca21`) |
| 07-22 17:50-17:51 | iterate | fix — home group-buys widget rows are now clickable `[4.9]` (`2b4d60b`/`0270d96`) |
| 07-22 18:49-18:50 | iterate | a11y — quiz result cards + footer links gain focus-visible ring `[5.4]` (`cb95d0b`/`a48404d`) |
| 07-22 19:36 | expand | pass 210 — 1 candidate filed (sitewide focus-visible default + coverage check, `[6.5]`) |
| 07-22 20:41 | expand | pass 211 — no candidates |
| 07-22 21:42 | iterate | content — keychron-nova-socket-hybrid alt text says eight weeks, chart plots ten `[5.4]` (`a7da16d`/`8b24b12`) |
| 07-22 22:43 | iterate | a11y — footer nav links gain focus-visible ring `[7.2]` (`a698279`/`d062100`) |
| 07-22 23:40 | iterate | a11y — newsletter subscribe button + attribution link gain focus-visible ring `[6.3]` (`0d0ac29`/`4fba84b`) |
| 07-23 00:34-00:36 | ship-content (dispatch) | audit — content-gap survey auto-filed row + opened issue #585 (`0b2e585`/`c8095d2`) |
| 07-23 01:58 | ship-content | content — ideas: "Mixing keycap profiles on one board: what actually works" `[hot pursuit 7.0]` (`c9dbe67`/`aea3606`, closes #585) |
| 07-23 03:23 | iterate | cross-links — mixing-keycap-profiles ↔ retrobrighting-keycaps, 1 pair drained `[4.5]` (`b4941c5`/`265dd3e`) |
| 07-23 05:19 | expand | pass 212 — no candidates |
| 07-23 07:08 | expand | pass 213 — no candidates |
| 07-23 08:03 | expand | pass 214 — no candidates |
| 07-23 09:15 | expand | pass 215 — no candidates |
| 07-23 09:58 | expand | pass 216 — no candidates |
| 07-23 11:11 | expand | pass 217 — no candidates |

36 commits total in the window (~23h42m, `8c517fb` → `cd71e77`). All
22 `march`-workflow runs since 07-22T11:29 UTC report `success` — no
recurrence of the standing `[6.3]` crash-issue-gate bug this window.
The `night` workflow's prior run (07-22, digest `8c517fb`) also
reports `success`.

## Shipped

- **a11y**: 7 focus-visible ring fixes across distinct component
  families — search result links, sitewide primary nav
  (Header/MobileNav), group-buy row CTAs, error/not-found route
  boundaries, quiz result cards + footer links, footer nav links,
  newsletter subscribe button + attribution link — plus 1 aria-live
  announcement fix on the search results panel.
- **content**: newsletter tracker-figure correction ("eight weeks
  ago" fixed in 2 issues), keychron-nova-socket-hybrid alt-text/chart
  week-count mismatch fixed, 1 Rule-1 content-gap dispatch (ideas —
  "Mixing keycap profiles on one board: what actually works").
- **fix**: home group-buys widget rows are now clickable (were
  previously inert despite looking interactive).
- **cross-links**: 1 pair drained (mixing-keycap-profiles ↔
  retrobrighting-keycaps).
- **expand**: 8 passes (210–217). Pass 210 filed 1 new candidate
  (`[6.5]` sitewide focus-visible default + coverage check); passes
  211–217 filed nothing — seven straight no-candidate ticks, the
  densest expand cadence recorded in a single digest window to date.

## Queues now

- **Build plan**: 0 pending phases (51 shipped, unchanged) — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending `[4.5]` rows, unchanged — stays at
  zero (this window's 1 pair was filed and drained same-tick).
- **`plan/AUDIT.md`**: 1 open row, unchanged from the last several
  digests: `[4.0]` Lighthouse-CI disabled (confirmed still
  `disabled_manually`; the digest's own Step 2 pulse command still
  errors "could not find any workflows named lighthouse" — a
  `gh run list --workflow <display-name>` quirk against disabled
  workflows, not a missing workflow; see prior digest's discovery).
  Every other finding this window was filed and drained same-tick.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **74 days / 1604 commits stale.** The `[score
  6.5]` Critique gate diagnostic candidate is still standing,
  unpromoted, now 20 days since it was filed (2026-07-03).
- **`plan/PHASE_CANDIDATES.md`**: **19 pending rows** (up 1 from 18
  — pass 210's new candidate), **42 days** since the last promotion
  (2026-06-11, phases 43/44/45 — corrected from the prior digest's
  2026-05-23 figure, see Headline). Candidates now clustered at
  6.5–7.0: `[7.0]` trend-snapshot data-quality gate, `[7.0]`
  content-fact-vs-catalog numeric-spec audit, `[7.0]` article
  internal-consistency checker, `[6.5]` `/quiz/board`, `[6.5]` stale
  group-buy frontmatter/prose gate, `[6.5]` Critique gate diagnostic,
  `[6.5]` sitewide focus-visible default + coverage check (new).
- **`data/BACKLOG.md`**: 0 live pending rows (3 listed rows all
  `[x]`, unchanged).
- **Triage**: 12 open issues (down from 13) — 0 unlabeled. 8
  duplicate content-gap issues (`#414-#416`, `#418-#422`) still await
  a manual consolidation pass; `#421` remains a *shipped* duplicate
  (confirmed: `gazzew-boba-u4t-deep-dive.mdx` already exists in
  corpus) that still needs a manual close. Two `triage:needs-user`
  issues unresolved: `#434` (Vercel never ingested commit `e312e09`,
  now 13 days old) and `#499` (night digest crashed, now 7 days old).
  `#395` and `#437` are stable.
- **Expand cadence**: 8 passes this window (210: 1 new; 211–217: 0
  new each) — all 7 mechanical surveys ran clean every pass; the one
  fresh signal (the focus-visible cluster) came from a commit-pattern
  read, not the mechanical surveys.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as seven sequential
blocking legs (typecheck → test:run → test:scripts → data:validate
→ build → size → e2e) — all green:

- `typecheck` — green, all 8 workspace packages.
- `test:run` — green, 684 web unit tests (97 test files), up from
  675 (new focus-visible + aria-live regression coverage across the
  window's 7 a11y fixes).
- `test:scripts` — green, 161 tests / 59 suites, unchanged.
- `data:validate` — green, 74 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 12
  trend weeks — unchanged this window).
- `build` — green, all canonical routes generated (72 articles, up
  from 71 — the ideas-pillar content-gap fill landed this window; 4
  newsletters unchanged).
- `size` — green, homepage gzip 109.1 KB / 200 KB budget (flat).
- `e2e` — green, **1074/1074** (up from 1071).
- `pnpm deploy:check` at HEAD (`cd71e77`) — deploy `READY`
  (`dpl_34u1MxWK`).
- `lighthouse` — unchanged: `gh run list --workflow lighthouse`
  still errors "could not find any workflows named lighthouse" (the
  known display-name-vs-disabled-workflow quirk); workflow remains
  `disabled_manually` per the standing `[4.0]` AUDIT.md row. No new
  signal this window.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New, sharpest: the focus-visible defect class just got its own
   unpromoted fix-the-root-cause candidate, and two more instances
   shipped reactively after it was filed.** Pass 210's `[6.5]`
   "Sitewide focus-visible default + coverage check" candidate
   diagnosed the pattern after 5 instances; 2 more (footer nav,
   newsletter form) shipped in this same window *after* the
   candidate existed — 9 cumulative instances across two digest
   windows, all one-off component-by-component fixes, while the
   preventive automation sits in the queue. This is the single
   highest-leverage promotion available right now.
2. **Standing, growing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 74 days / 1604 commits since the last
   local `/critique` pass — the fresh-eyes loop has been dark for
   over two months, and the candidate diagnosing why has itself sat
   unpromoted for 20 days.
3. **Standing: Lighthouse CI has been disabled and failing for 6+
   weeks — `/oversight` call needed.** Unchanged since last digest.
   `.github/workflows/lighthouse.yml` is `disabled_manually`. Filed
   `plan/AUDIT.md` `[4.0]`. Still the site's only automated
   a11y/perf/SEO regression gate, still dark.
4. **Standing: `#421` is a shipped duplicate, not just an unwritten
   one.** Worth a manual close-as-duplicate pass, separate from the
   other 7 duplicate issues that still name genuinely unwritten
   topics.
5. **Standing, growing: the `/oversight` promotion backlog.** 19
   candidates pending (up 1), now **42 days** since the last
   promotion (2026-06-11 — corrected from a prior digest's stale
   2026-05-23 figure). Three candidates now sit at 7.0, four more at
   6.5.
6. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (Vercel silently dropped the deploy for commit `e312e09`,
   filed 2026-07-10, 13 days old) and `#499` (night digest crashed,
   filed 2026-07-16, 7 days old). Neither self-resolved; both still
   await a human look.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (the sole open row is
`/oversight`-gated). The next `/march` tick will most likely repeat
this window's pattern: either another `/expand` pass (the gate has
been firing roughly every 1-2 hours this window) or a reactive
`/iterate` fix if a fresh one-off surfaces. The highest-leverage next
move isn't a new fix — it's an `/oversight` pass over the
now-7-candidate cluster at 6.5-7.0, starting with the sitewide
focus-visible default (stops a 9-instance-and-counting drain
immediately) and the Critique gate diagnostic (the fresh-eyes loop
has been dark for 74 days).

## Tuning proposals

None new this pass. This window's dominant meta-loop signal — the
focus-visible defect class recurring twice more *after* pass 210
already filed the candidate to fix it — is already tracked as a
standing `plan/PHASE_CANDIDATES.md` row, not a new proposal; the
right action is promotion, not another candidate. The Critique
staleness figure was refreshed in the Headline/Needs-You sections
above rather than filed as a fresh candidate, since the existing
`[6.5]` Critique gate diagnostic candidate already owns that
diagnosis. The one correction made this pass — the promotion-age
figure (60 days → 42 days, last promotion 2026-06-11 not 2026-05-23)
— is a data correction to prior digest prose, not a gate/cadence
change, so it's noted in the Headline rather than filed as a
candidate.
