# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Quiet content window, one real find: the deep-dives content-gap
dispatch has been stuck in a duplicate-issue loop for ~10.5 hours.**
Since yesterday's digest (`e9fc20e`), the loop shipped exactly one
content fix — a same-root-cause stale-cross-reference pass on
divinikey-dcs-dolch + gsk-sweet-nightmare (closes #413) — plus three
consecutive `/expand` no-candidate passes (155, 156, 157). Then, at
00:34 UTC, `content-gap-survey.mjs` auto-filed a fresh `[HOT
PURSUIT]` deep-dives row, and every hourly `march` tick since has
re-dispatched `/ship-content` against it. **All nine dispatches
opened a brand-new GitHub issue for a different sub-topic (#414
through #422) and shipped nothing** — no MDX, no SVG, no commit.
The first tick ran a full 47 turns / $4.55 / 10.5 minutes and ended
with a clean SDK-level stop (not a crash — the `[6.3]` bug isn't
the cause); every tick since has been a quick 4-6 minute no-op that
just opens one more issue. Root cause, as far as it's visible from
outside the hidden transcript: `ship-content.md` Step 3 never
persists the opened issue number back onto the AUDIT.md row until
the article actually ships, so a dispatch that stops early leaves
the row looking fresh and the next tick opens a duplicate. Filed a
`[4.9]` `plan/AUDIT.md` finding and a `[score 6.5]`
`plan/PHASE_CANDIDATES.md` candidate for the well-scoped half (issue
persistence); the deeper "why does the turn end early" question is
noted as an unresolved follow-up — see **Needs you**. Full breadth
`pnpm verify` is green top to bottom (935 unit tests, 158 script
tests, 69 data records, 968/968 e2e), deploy is `READY` at HEAD
(`4bc3af6`). `plan/CRITIQUE.md` is now **58 days / 1190 commits**
since its last pass — unchanged diagnosis from prior digests.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-07 12:50–13:18 | iterate | content fix — divinikey-dcs-dolch + gsk-sweet-nightmare stale present-tense cross-refs to closed Selene/Ramune buys (`e14c412`), closes #413 |
| 07-07 13:44–13:47 | march | no-op |
| 07-07 15:01–15:20 | expand | pass 155 — no candidates (`98c9af9`) |
| 07-07 16:48–17:04 | march | no-op |
| 07-07 17:40–17:43 | march | no-op |
| 07-07 18:41–18:50 | expand | pass 156 — no candidates (`36ca91a`) |
| 07-07 19:34–23:21 | march | no-op ×5 (19:34, 20:36, 21:30, 22:25, 23:21 start) |
| 07-07 23:21–23:31 | expand | pass 157 — no candidates (`e10ae68`) |
| 07-08 00:32–00:43 | march | content-gap refill: `content-gap-survey.mjs` auto-filed a deep-dives `[HOT PURSUIT]` row (`4bc3af6`); dispatched `/ship-content`, opened issue #414 (Gazzew Boba family) — **no article shipped** |
| 07-08 01:35–01:38 | march | `/ship-content` re-dispatched — opened issue #415 (split/ergo mechanics), no ship |
| 07-08 03:04–03:08 | march | `/ship-content` re-dispatched — opened issue #416 (leaf-spring mount), no ship |
| 07-08 05:04–05:08 | march | `/ship-content` re-dispatched — opened issue #417 (Durock T1), no ship |
| 07-08 06:51–06:55 | march | `/ship-content` re-dispatched — opened issue #418 (keycap manufacturing), no ship |
| 07-08 07:48–07:54 | march | `/ship-content` re-dispatched — opened issue #419 (stabilizer rattle), no ship |
| 07-08 08:53–08:59 | march | `/ship-content` re-dispatched — opened issue #420 (silent-switch damping), no ship |
| 07-08 09:49–09:53 | march | `/ship-content` re-dispatched — opened issue #421 (Gazzew Boba U4T), no ship |
| 07-08 10:42–10:47 | march | `/ship-content` re-dispatched — opened issue #422 (Gateron Magnetic Jade), no ship |

(20 `march`-workflow runs total in the window, all reporting
`success` at the GitHub Actions level — the 9 issue-opening no-ops
included, since Claude's own turn ended cleanly each time rather
than crashing.)

## Shipped

- **content**: `divinikey-dcs-dolch-group-buy.mdx` +
  `gsk-sweet-nightmare-group-buy.mdx` — past-tensed present-tense
  cross-reference prose pointing at the now-closed GMK CYL Selene
  and Ramune buys ("runs through" → "ran through"; "open
  through"/"running through" → "closed"); both `updatedAt` bumped
  to 2026-07-07. Same root cause as the six frontmatter/prose fixes
  from the prior digest window, one tier removed (hits cross-
  reference sentences in *other* articles, not just a buy's own
  companion piece). Closes #413.
- **audit-only**: `content-gap-survey.mjs` auto-filed one new
  `[HOT PURSUIT]` deep-dives row (`4bc3af6`) — no code/content
  shipped in that commit, just the AUDIT.md row that then triggered
  the duplicate-issue loop described above.
- Three `/expand` passes (155, 156, 157) all returned "no
  candidates" — nothing new to report there.

## Queues now

- **Build plan**: 0 pending phases — pure `/iterate` maintenance
  mode, unchanged.
- **Cross-link drain**: 0 pending, unchanged.
- **`plan/AUDIT.md`**: 2 open rows now — the standing `[6.3]
  blocked-cloud-permission]` `march.yml` crash-gate fix (unchanged,
  still stuck on the workflow-write permission wall), plus this
  digest's new `[4.9] [engineering]` finding on the ship-content
  duplicate-issue loop. The `[HOT PURSUIT] [content-gap] [7]`
  deep-dives row is technically still open too but is the subject
  of the finding above, not an independent queue item.
- **`plan/CRITIQUE.md`**: pass 11, last pass
  2026-05-10T20:35 UTC at commit `931c8a7`. **58 days / 1190 commits
  stale** (up from 58/1183 yesterday — same day-count, +7 commits,
  expected). Unchanged diagnosis: cloud `/march` hard-skips
  `/critique` by design (`.github/CLOUD_LOOP.md`); the `[6.5]`
  Critique gate diagnostic candidate is still standing, unpromoted.
- **`plan/PHASE_CANDIDATES.md`**: 14 pending rows — up from 13
  yesterday. New this window: **ship-content Step 3
  issue-persistence (`[score 6.5]`, filed by this digest)** — see
  Tuning proposals below. Incumbents unchanged: Stale group-buy
  frontmatter/prose gate (6.5), `/quiz/board` (6.5), Critique gate
  diagnostic (6.5), external link-rot survey (6.0), march.yml
  crash-issue gate fix (6.0), Parts catalog third data pass (5.5),
  `/compare/keycap-set` (5.5), Vitest coverage CI gate (5.5),
  ship-data mentionedParts rescan (5.5), Cloud loop workflow-push
  permission gap (5.5), Tracker 8-week editorial analysis (5.0),
  Accessory parts kind (5.0), Tracker topic history page (4.5).
- **`data/BACKLOG.md`**: 0 actionable rows (same 3 cosmetic
  already-`[x]`-but-unfiled rows as prior digests; unchanged).
- **Triage**: 10 open issues — the standing `#395` (cloud march
  crash-issue gate, unchanged, blocked) plus the 9 new duplicate
  content-gap issues (#414-#422) from this window's stuck dispatch,
  all still open. 0 unlabeled, 0 `triage:needs-user`.
- **Expand cadence**: 21 commits / ~36.7h since pass 154 — over the
  20-commit/48h threshold (that's why passes 155-157 fired this
  window); next pass due whenever either threshold trips again.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, sequential legs — all
green:

- `typecheck` — green, 8/8 workspace packages.
- `test:run` — green, 935 tests across 7 workspaces (591 web + 121
  data + 33 seo + 31 ui + 150 content + 6 e2e-fixtures + 3 tokens —
  unchanged from yesterday).
- `test:scripts` — green, 58 suites / 158 tests.
- `data:validate` — green, 69 records (9 vendors, 18 switches, 10
  keycap-sets, 9 boards, 13 group-buys, 10 trend weeks —
  unchanged), cross-refs resolve.
- `build` — green, no manifest churn issues.
- `size` — green, 108.5 KB / 200 KB homepage gzip budget
  (unchanged).
- `e2e` — green, 968/968 (unchanged). Same benign `NoFallbackError`
  logged mid-run on `/trends/tracker/[week]` as prior digests
  (expected 404-path behavior for a non-generated week param); did
  not fail any test.
- **Lighthouse**: no workflow found (`gh run list --workflow
  lighthouse` returns "could not find any workflows named
  lighthouse") — still no signal, consistent with prior digests.
- `pnpm deploy:check` at HEAD (`4bc3af6`) — deploy `READY`.

No red legs. This digest's own AUDIT.md row (the `[4.9]`
ship-content finding) was filed from the pulse review, not from a
breadth-check failure — worth restating per this skill's own
distinction, since it's the headline item this tick.

## Needs you

1. **New, most actionable: promote the ship-content Step 3
   issue-persistence candidate** (`[score 6.5]`, filed this tick).
   Well-scoped, low-risk (procedure-text + one script test, no app
   code), and stops the visible symptom (duplicate issues, wasted
   spend) immediately. Also worth a manual pass to close/consolidate
   the 9 duplicate open issues (#414-#422) — the digest doesn't
   touch GitHub state itself.
2. **Open question, not yet actionable: why does `/ship-content`
   stop before Step 4 on every attempt?** No root cause is visible
   from outside the hidden transcript (`gh run view --log` shows
   only SDK init/result frames; the transcript-upload step never
   fires because these are clean stops, not crashes). If the
   issue-persistence fix alone doesn't unstick the pillar, the next
   move is a live repro with `show_full_output: true` temporarily
   enabled on the workflow, or an explicit self-check inside
   `ship-content.md` that fails loudly instead of quietly ending
   the turn.
3. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[score 5.5]` candidate, companion to the `[6.3]`
   blocked AUDIT row and open issue `#395`). Unchanged.
4. **Standing: refine or resolve the `[6.5]` Critique gate
   diagnostic candidate.** Unchanged — 58 days / 1190 commits since
   the last local `/critique` pass.

## Today's intent

No pending build-plan phase, no data backlog, and the stale-group-
buy-prose cluster from prior windows stays fully drained. The
deep-dives content-gap row will keep re-dispatching `/ship-content`
every hour and keep opening duplicate issues until either the
Step-3 persistence fix lands or `/oversight` intervenes — that's
the most likely next real signal, alongside whatever `/iterate`
picks up from a fresh mechanical survey once the content queue
stops dominating march's dispatch order. `/quiz/board`, the stale
group-buy gate, Critique gate diagnostic, and the new ship-content
candidate are the four highest-scored incumbents, tied at 6.5.

## Tuning proposals

**Filed 1 new candidate this pass**: `[score 6.5]` ship-content Step
3 issue-persistence — `plan/PHASE_CANDIDATES.md` Pending section.
Nine consecutive `/ship-content` dispatches against the same
deep-dives content-gap row each opened a new GitHub issue for a
different sub-topic and shipped nothing, over ~10.5 hours. The
procedure (`skills/ship-content.md:158-159`) already documents the
intended behavior — reuse an existing `- issue: #N` field instead of
opening a new one — but nothing writes that field back onto the
AUDIT.md row until an article actually ships, so a dispatch that
stops early (for reasons not visible from outside the hidden
transcript) leaves every subsequent tick treating the row as fresh.
Proposing (not applying) a fix shape: Step 3 commits `- issue: #N`
onto the matched row immediately after the issue-open call succeeds,
before spawning content-curator/brander, so a died-mid-flight
dispatch resumes on the same issue next tick instead of duplicating.
Companion `plan/AUDIT.md` `[4.9]` finding has the full diagnostic
writeup, including the open question of why the turn ends before
Step 4 in every observed case. `/oversight` promotes.
