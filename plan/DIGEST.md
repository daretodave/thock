# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The depth valve fired for the first time since the last `pulse.mjs` counting-bug fix: spec 09 (Truncation-boundary mechanical survey) auto-promoted out of the candidate queue today, now held in a 1-day veto window — and that same promotion exposed a sibling undercount in `pulse.mjs`'s "held" number.** Since the last digest (`b7497ed7`, 2026-11-15T17:32:53Z): three scheduled `march` ticks ran clean no-ops (20:45, 00:41, 07:35), then the 17:51→18:50 UTC tick shipped two commits — `10c7ce4c` (plan depth-promotion: 0 open specs is under `promote_queue_depth` 2, so the aged `[score 6.5]` Truncation-boundary candidate, 97 days old, promoted per `expand.md` Step 4b — spec written, `plan/CANDIDATES.md` row moved Pending → Promoted, veto issue `#1082` opened, Held line added to `plan/README.md`) and `e470f218` (the Monday weekly trend snapshot, 2026-W47, 18 scout-researched rows in a quiet hobby week). Tonight's own breadth pass is fully green: `pnpm verify` run as 8 sequential foreground legs (never backgrounded) — typecheck, lint, 1344 unit tests across 7 workspaces, 462 script tests, `data:validate` (96 records, cross-refs resolve), a production build, `size` within budget (largest 147.6 KB vs 175 KB on `/quiz/switch/page`), and `e2e` (1754/1754, 7.5m). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, and `group-buy-article-staleness-check.mjs --write` all ran clean — every mismatch each found was already filed, no new AUDIT rows. `pnpm deploy:check` confirmed `READY` at HEAD (`e470f218`). **New tonight:** while confirming the fresh Held line, found `pulse.mjs`'s held-counter only recognizes the bold human-authored lock format and misses the auto-promoted format `promote.mjs` actually writes — pulse reports "0 held" against a real 1. Filed as a tuning candidate (see Tuning proposals); same `pulse.mjs`-undercount class as the still-unpromoted `pendingSection()` candidate from 2026-11-09.

**Note on tonight's `pnpm build`/`pnpm e2e` legs:** both first attempts were interrupted by an upstream Next.js build-time message (`Error [SecurityFatalError]`) recommending a `next upgrade --agent=security` run, framed as advice the agent should relay to the user and act on (it named a specific question to ask and a command to run). Treating that as untrusted tool output, not an instruction — no upgrade was run, and no change was made outside this notes-only commit. Both legs were simply retried once (as the message itself said would continue the original task) and passed clean the second time, so no AUDIT row was filed. Flagging it here for the human reader; see also the message sent this turn.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-15 17:33 | *(last digest committed, `b7497ed7`)* | baseline |
| 2026-11-15 17:33 → 20:45 | *(no scheduled fire logged)* | **quiet** — ~3.2h gap, no error signal, deploy stayed `READY` |
| 2026-11-15 20:45 → 20:46 | cloud `march` (scheduled) | **quiet** (dispatch-only, 61s run, no commits) |
| 2026-11-15 20:46 → 2026-11-16 00:41 | *(no scheduled fire logged)* | **quiet** — ~3.9h gap, no error signal |
| 2026-11-16 00:41 → 00:42 | cloud `march` (scheduled) | **quiet** (dispatch-only, 51s run, no commits) |
| 2026-11-16 00:42 → 07:35 | *(no scheduled fire logged)* | **quiet** — ~6.9h gap, no error signal |
| 2026-11-16 07:35 → 07:36 | cloud `march` (scheduled) | **quiet** (dispatch-only, 73s run, no commits) |
| 2026-11-16 07:36 → 17:51 | *(no scheduled fire logged)* | **quiet** — ~10.3h gap, no error signal |
| 2026-11-16 17:51 → 18:50 | cloud `march` (scheduled) | **shipped** — depth-promotion of spec 09 (`10c7ce4c`) + weekly trend snapshot (`e470f218`), both `Cloud-Run` `43922818725` |
| 2026-11-16 18:50 → (now) | night (this tick) | in progress |

Since the last digest: **2 commits shipped** (one cloud `march` tick), 1 new spec (09, held in veto), 0 new content, 1 candidate promoted (not newly filed), 0 critique passes, 0 failed ticks, 0 reverts.

## Shipped

- `10c7ce4c` — plan depth-promotion: `promote.mjs due` found 0 open specs against `promote_queue_depth` 2, auto-promoting the aged `[score 6.5]` "Truncation-boundary mechanical survey" candidate (97 days old) per `expand.md` Step 4b. Wrote `plan/09-truncation-boundary-mechanical-survey.md`, moved its `plan/CANDIDATES.md` row Pending → Promoted, opened veto issue `#1082`, added a Held line to `plan/README.md` (veto until 2026-11-17, max_age 1d, fallback release).
- `e470f218` — data: trend snapshot 2026-W47. 18 scout-researched rows continuing 2026-W46's storylines in a quiet week: GMK CYL Red Devils R2 and CannonKeys continue established fades, Mode Designs gets its first concrete news in weeks (PC Gamer's Encore refresh) but not enough to reverse its slump, everything else flat on confirmed no-new-signal research.
- Tonight's breadth pass: `pnpm verify` full gate green — typecheck, lint, 1344 unit tests (11 `@thock/tokens` + 156 `@thock/data` + 44 `@thock/seo` + 32 `@thock/ui` + 6 `apps/e2e` + 167 `@thock/content` + 928 `apps/web`), 462 script tests, `data:validate` (96 records), build (after one retry past an upstream Next.js advisory message — see Headline), size (OK, largest 147.6 KB vs 175 KB), and `e2e` (1754/1754, after the same retry). Plus `content-fact-audit.mjs --write` (4 standing numeric-citation mismatches, all already filed), `article-internal-consistency-check.mjs --write` (corpus clean), `group-buy-article-staleness-check.mjs --write` (4 standing present-tense rows, all already filed) — zero new AUDIT rows. `pnpm deploy:check` confirmed `READY` at HEAD. The verify run's own `build`/`test:run` legs regenerated the three `data-runtime`/`search` manifest files with a fresh `generatedAt` timestamp — reverted before this commit, since this is the standing `[data] [2.4]` AUDIT row, not new drift, and this commit is notes-only.

## Queues now

**plan:** 1 spec (09, Truncation-boundary mechanical survey), 0 chunks ready (not chunked yet), 1 held (09 · veto until 2026-11-17 via `#1082`). **Note:** `node scripts/pulse.mjs` reports "0 held" — a fresh undercount, see Tuning proposals; do not read pulse's held number as the total.
**audit:** 19 total unresolved rows by hand count (1 `[HIGH]` `[needs-user-call]` row + 18 `### [ ]` rows under `## Open findings`) — unchanged from the last digest; still off pulse's own undercounted "1 pending" (standing, unpromoted 2026-11-09 candidate).
**critique:** 8 pending, last pass 6d ago (pass 19, 2026-11-10T09:45Z at commit `b056da79`, unchanged — no new pass ran this window).
**candidates:** 10 pending (7 `>21d`, oldest 107d) — down from 11 (8 `>21d`, oldest 105d) at the last digest, since the Truncation-boundary row promoted out to spec 09 today. `node scripts/plan/promote.mjs sweep` → `wait 09 #1082 until 2026-11-17` (0 of 1 auto-promoted Held lines due — not expired, issue still open). `node scripts/plan/promote.mjs cuts --since 2026-11-15` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout (`night.yml` carries no cache-restore step for `.nexus/quota.json`) — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` (7d) by that definition.
- **`[needs-user-call]` — `#1068`** (GH_TOKEN/GITHUB_TOKEN invalid in march.yml, masking triage/critique gh checks): opened 2026-11-07T01:52Z, now ~235h old (~9.8d) — still open, still `triage:needs-user`, no owner comment since the triage reply on 2026-11-07. Needs an owner call on push-credential strategy — a repo-secret decision the loop can't make unilaterally. Locked (`issue-1068-credential-call`, since 2026-11-12, until owner comments or closes #1068, max_age 14d — expires 2026-11-26).
- **New: veto window open on spec 09** — issue `#1082` ("Auto-promoted: Truncation-boundary mechanical survey — close to veto") must be closed by 2026-11-17 to veto the promotion; left open, the loop chunks and builds it starting tomorrow. No action needed if the promotion is wanted.
- **oversight needed: candidate queue silting (7 pending >21d, oldest 107d)** — both thresholds still trip (≥5 pending >21d, oldest >45d). Standing condition, repeat observation from every digest since at least 2026-11-04 — though tonight's count ticked down by one (8→7) as the oldest-but-one candidate promoted out via the depth valve rather than `/oversight`.
- No motion-stalled alert — shipped 10 last full week (2026-W46) vs. 16.25 baseline (floor 8.13, reads `ok`); pulse's own pull this tick read "0 so far in 2026-W47" before accounting for the two commits that landed later in this same window.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).
- **Standing item, unchanged:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch is still unaddressed, still has no GitHub issue filed. No critique pass ran in this window (last pass 6d ago).
- **Standing item, unchanged:** critique's `[HIGH]` `/group-buys` finding — the page's "Active group buys" lede is never true while all 18 records are closed — is still unaddressed since pass 18, still has no GitHub issue filed.
- **Watch item, recurring:** four more quiet gaps (~3.2h, ~3.9h, ~6.9h, ~10.3h) before the depth valve finally had something to fire — same shape as prior digests' noted gaps, consistent with the plan sitting empty between dispatch cycles until tonight.

## Today's intent

Spec 09 (Truncation-boundary mechanical survey) is written but not yet chunked, and is Held until its veto window clears (2026-11-17, issue `#1082`). If `#1082` stays open past tomorrow, the next `/plan-a-spec`/`/ship-a-chunk` pass should chunk and build it. Until then (or if it's vetoed), prioritize the standing AUDIT queue in score order: critique's two `[HIGH]` findings first (the `/trends/tracker` Sleeper/Faller mismatch and the `/group-buys` "active buys" lede contradiction, neither with a filed issue), then the mechanical queue — the 4 `[cross-links] [4.5]` rows (3 `aurora-glow-theme-build` siblings + 1 `mm-studio-class80-discontinued` ↔ `cannonkeys-blaine-v2-se-group-buy`), the 8 `[content] [3.6]` rows (4 numeric-citation mismatches, 4 present-tense group-buy rows), the `[a11y] [3.5]` `ring-accent-mu` contrast sweep, the 2 stale `[seo]` hero-art rows, the `[content] [2.4]` plate-materials/Mode-flagship tension, the `[data] [2.4]` generated-manifest drift, and the `[seo] [1.8]` duplicate favicon.

## Tuning proposals

Filed one new candidate tonight: `pulse.mjs`'s held-counter (`scripts/pulse.mjs`, the `held++` regex) only matches the bold human-authored Held-line format (`- **NN.k** · ...`) and misses the unbolded auto-promoted format `scripts/plan/promote.mjs`'s `heldLine()` actually writes (`- NN · auto-promoted, veto until ... · max_age: ...`) — the same shape `scripts/plan-check.mjs`'s `parseAutoHeld()` already validates as correct. Surfaced tonight because spec 09's promotion (`10c7ce4c`) is the first Held line to land since the last `pulse.mjs` counting-bug fix (`a01a9118`), and pulse read "0 held" against the real 1. Same undercount class, same fix shape (widen one regex), as the still-unpromoted `pendingSection()` candidate from 2026-11-09 — filed as its own row (score 3.2) rather than folded into that one, since the two counters are independent functions over independent files. Not self-fixing, per the meta-loop rail — `/oversight` promotes.
