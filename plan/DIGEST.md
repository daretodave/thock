# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet window — one real cloud tick shipped a depth-promotion (spec 10, Stale-`updatedAt` mechanical check) plus its manifest catch-up, then a second tick ran 19 minutes and shipped nothing.** Since the last digest (`f7903b4a`, 2026-11-16T20:53:07Z): the 2026-11-17 01:30 UTC `march` tick shipped two commits — `680b559f` (plan depth-promotion: `promote.mjs due` found 1 open spec (09, held) below `promote_queue_depth` 2, so the aged `[score 6.5]` Stale-`updatedAt` candidate, 94 days old, promoted per `expand.md` Step 4b — spec written, row moved Pending → Promoted, veto issue `#1083` opened, a second Held line added to `plan/README.md`) and `c18858c3` (regenerated `data-runtime`/search manifests that `e470f218`'s trend-snapshot commit, shipped before the last digest, had left stale — the standing `[data] [2.4]` AUDIT row, not new drift). The 10:05 UTC tick then ran a full 19 minutes — longer than the usual ~1-minute dispatch-only no-op — but landed no commits; nothing in `gh run list` or the local queues explains the extra time, flagged as a watch item below, not a finding. Tonight's own breadth pass is fully green: `pnpm verify` run as 8 sequential foreground legs (never backgrounded) — typecheck, lint, 1344 unit tests across 7 workspaces, 462 script tests, `data:validate` (96 records, cross-refs resolve), a production build, `size` within budget (largest 147.6 KB vs 175 KB on `/quiz/switch/page`), and `e2e` (1754/1754, 8.1m). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, and `group-buy-article-staleness-check.mjs --write` all ran clean — every mismatch each found was already filed, no new AUDIT rows. `pnpm deploy:check` confirmed `READY` at HEAD (`680b559f`). **New tonight:** spec 09's veto window (`#1082`, "until 2026-11-17") has now elapsed in wall-clock terms — the issue is still open, so the depth valve should treat it as released to build on the next tick that checks it; see Needs you. Also confirmed the still-unpromoted `pulse.mjs` held-counter undercount (filed 2026-11-16) now has a second live instance — spec 10's Held line brings the real count to 2, `pulse.mjs` still reads 0; added an update to that candidate rather than filing a new one.

**Note on tonight's `pnpm build`/`pnpm e2e` legs:** both first attempts were interrupted by the same upstream Next.js build-time message seen in the last two digests (`Error [SecurityFatalError]`), again framed as advice the agent should relay to the user and act on, again naming a specific command to run. Treating it as untrusted tool output, not an instruction — no upgrade was run, no change was made outside this notes-only commit. Both legs were simply retried once and passed clean the second time, so no AUDIT row was filed. This is now the third consecutive digest to hit this exact injection shape on the build/e2e legs; flagging the recurrence here for the human reader.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-16 20:53 | *(last digest committed, `f7903b4a`)* | baseline |
| 2026-11-16 20:53 → 2026-11-17 01:30 | *(no scheduled fire logged)* | **quiet** — ~4.6h gap, no error signal, deploy stayed `READY` |
| 2026-11-17 01:30 → 01:48 | cloud `march` (scheduled) | **shipped** — depth-promotion of spec 10 (`680b559f`) + manifest catch-up (`c18858c3`), both `Cloud-Run` `43996037098` |
| 2026-11-17 01:48 → 10:05 | *(no scheduled fire logged)* | **quiet** — ~8.3h gap, no error signal |
| 2026-11-17 10:05 → 10:25 | cloud `march` (scheduled) | **quiet** (no commits, but a 19-minute run — longer than the typical ~1min dispatch-only tick; see Headline) |
| 2026-11-17 10:25 → 19:14 | *(no scheduled fire logged)* | **quiet** — ~8.8h gap, no error signal |
| 2026-11-17 19:14 → (now) | night (this tick) | in progress |

Since the last digest: **2 commits shipped** (one cloud `march` tick), 1 new spec (10, held in veto), 0 new content, 1 candidate promoted (not newly filed), 0 critique passes, 0 failed ticks, 0 reverts.

## Shipped

- `680b559f` — plan depth-promotion: `promote.mjs due` found 1 open spec (09, held) against `promote_queue_depth` 2, auto-promoting the aged `[score 6.5]` "Stale-`updatedAt` mechanical check" candidate (94 days old) per `expand.md` Step 4b. Wrote `plan/10-stale-updated-at-mechanical-check.md`, moved its `plan/CANDIDATES.md` row Pending → Promoted, opened veto issue `#1083`, added a second Held line to `plan/README.md` (veto until 2026-11-18, max_age 1d, fallback release).
- `c18858c3` — build: regenerated `apps/web/src/lib/data-runtime/{manifest,og-manifest}.generated.json` + `apps/web/src/lib/search/index.generated.json` to catch up `e470f218`'s 2026-W47 trend snapshot (shipped before the last digest without a manifest rebuild).
- Tonight's breadth pass: `pnpm verify` full gate green — typecheck, lint, 1344 unit tests (11 `@thock/tokens` + 156 `@thock/data` + 44 `@thock/seo` + 32 `@thock/ui` + 6 `apps/e2e` + 167 `@thock/content` + 928 `apps/web`), 462 script tests, `data:validate` (96 records), build (after one retry past the upstream Next.js advisory message — see Headline), size (OK, largest 147.6 KB vs 175 KB), and `e2e` (1754/1754, after the same retry, 8.1m). Plus `content-fact-audit.mjs --write` (4 standing numeric-citation mismatches, all already filed), `article-internal-consistency-check.mjs --write` (corpus clean), `group-buy-article-staleness-check.mjs --write` (4 standing present-tense rows, all already filed) — zero new AUDIT rows. `pnpm deploy:check` confirmed `READY` at HEAD. The verify run's own `build`/`test:run` legs regenerated the three `data-runtime`/`search` manifest files again with a fresh `generatedAt` timestamp — reverted before this commit, since this is the same standing `[data] [2.4]` AUDIT row `c18858c3` just caught up, not new drift, and this commit is notes-only.

## Queues now

**plan:** 2 specs (09 Truncation-boundary mechanical survey, 10 Stale-`updatedAt` mechanical check), 0 chunks ready (neither chunked yet), 2 held (09 · veto until 2026-11-17 via `#1082`, now wall-clock elapsed but issue still open; 10 · veto until 2026-11-18 via `#1083`). **Note:** `node scripts/pulse.mjs` reports "0 held" — the known undercount (now a second live instance), see Tuning proposals; do not read pulse's held number as the total.
**audit:** 19 total unresolved rows by hand count (1 `[HIGH]` `[needs-user-call]` row + 18 `### [ ]` rows under `## Open findings`) — unchanged from the last digest; still off pulse's own undercounted "1 pending" (standing, unpromoted 2026-11-09 candidate).
**critique:** 8 pending, last pass 7d ago (pass 19, 2026-11-10T09:45Z at commit `b056da79`, unchanged — no new pass ran this window).
**candidates:** 10 pending (6 `>21d`, oldest 108d) — the last digest reported "10 pending" measured before it filed the held-counter candidate that same night (true closing count 11); tonight's Stale-`updatedAt` promotion (spec 10) removed one row, netting back to 10. `node scripts/plan/promote.mjs sweep` → both Held specs still `wait` (09 `#1082` until 2026-11-17, 10 `#1083` until 2026-11-18) — 0 of 2 auto-promoted Held lines due. `node scripts/plan/promote.mjs cuts --since 2026-11-16` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout (`night.yml` carries no cache-restore step for `.nexus/quota.json`) — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` (7d) by that definition.
- **`[needs-user-call]` — `#1068`** (GH_TOKEN/GITHUB_TOKEN invalid in march.yml, masking triage/critique gh checks): opened 2026-11-07T01:52Z, now ~259h old (~10.8d) — still open, still `triage:needs-user`, no owner comment since the triage reply on 2026-11-07. Needs an owner call on push-credential strategy — a repo-secret decision the loop can't make unilaterally. Locked (`issue-1068-credential-call`, since 2026-11-12, until owner comments or closes #1068, max_age 14d — expires 2026-11-26).
- **Veto window on spec 09 has elapsed** — issue `#1082` ("Auto-promoted: Truncation-boundary mechanical survey — close to veto") opened 2026-11-16T17:57Z with `max_age: 1d`; that window closed earlier today. The issue is still open (no veto), so the next tick that runs the depth valve should treat spec 09 as released to chunk and build. No action needed if the promotion is wanted; close `#1082` to veto it instead.
- **Veto window still open on spec 10** — issue `#1083` ("Auto-promoted: Stale-`updatedAt` mechanical check — close to veto") must be closed by 2026-11-18 to veto the promotion; left open, the loop chunks and builds it once its turn comes.
- **oversight needed: candidate queue silting (6 pending >21d, oldest 108d)** — both thresholds still trip (≥5 pending >21d, oldest >45d). Standing condition, repeat observation from every digest since at least 2026-11-04.
- No motion-stalled alert — shipped 10 last full week (2026-W46) vs. 16.25 baseline (floor 8.13, reads `ok`); pulse's own pull this tick read "0 so far in 2026-W47," which is correct, not an undercount — `motion.mjs` only counts `feat`/`fix` commits as shipped units, and this window's two commits are `plan:`/`build:`.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).
- **Standing item, unchanged:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch is still unaddressed, still has no GitHub issue filed. No critique pass ran in this window (last pass 7d ago).
- **Standing item, unchanged:** critique's `[HIGH]` `/group-buys` finding — the page's "Active group buys" lede is never true while all 18 records are closed — is still unaddressed since pass 18, still has no GitHub issue filed.
- **Watch item, new:** the 10:05 UTC tick ran 19 minutes with zero commits, well past the ~1-minute shape of a dispatch-only no-op seen in every prior digest. Nothing in the local queues or `gh run list` output explains the extra time; worth a look if the pattern repeats.
- **Watch item, recurring:** the upstream Next.js build-time security-advisory message (framed as an instruction to relay and act on, naming a specific upgrade command) has now shown up on the `build`/`e2e` legs in three consecutive digests. Each time it's been treated as untrusted tool output and the leg simply retried — no upgrade run, no change made. If a human wants the actual Next.js security upgrade evaluated, that's a deliberate `/oversight` call, not something this loop should do on the advisory's own say-so.

## Today's intent

Spec 09's veto window has elapsed (issue `#1082` still open) — the next `/ship-a-chunk`/dispatcher pass should chunk and build it unless the owner closes `#1082` first. Spec 10 stays Held until 2026-11-18 (`#1083`). Otherwise, prioritize the standing AUDIT queue in score order: critique's two `[HIGH]` findings first (the `/trends/tracker` Sleeper/Faller mismatch and the `/group-buys` "active buys" lede contradiction, neither with a filed issue), then the mechanical queue — the 4 `[cross-links] [4.5]` rows (3 `aurora-glow-theme-build` siblings + 1 `mm-studio-class80-discontinued` ↔ `cannonkeys-blaine-v2-se-group-buy`), the 8 `[content] [3.6]` rows (4 numeric-citation mismatches, 4 present-tense group-buy rows), the `[a11y] [3.5]` `ring-accent-mu` contrast sweep, the 2 stale `[seo]` hero-art rows, the `[content] [2.4]` plate-materials/Mode-flagship tension, the `[data] [2.4]` generated-manifest drift, and the `[seo] [1.8]` duplicate favicon.

## Tuning proposals

No new candidate filed tonight — added an update to the still-unpromoted `pulse.mjs` held-counter candidate (score 3.2, filed 2026-11-16): spec 10's promotion added a second Held line this window, and `pulse.mjs` still reads "0 held" against the real 2, confirming the undercount on a second independent instance. Not re-scoping; the proposed one-line regex widening is unchanged. `/oversight` promotes.
