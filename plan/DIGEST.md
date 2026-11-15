# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A fully quiet ~24-hour window: all four scheduled cloud `march` ticks since the last digest ran clean no-ops; tonight's own breadth pass came back fully green with zero new findings; the standing `#1068` needs-user-call and the candidate-queue silting watch are both unchanged, aged one more day.** Since the last digest (`8bada2d0`, 2026-11-14T17:02:08Z): four scheduled `march` ticks fired (20:21, 00:41, 07:29, 15:15) and every one ran under a minute with no commits — the plan sits empty (0 specs, 0 held) and no content-gap or newsletter trigger was due. **Tonight's own breadth pass is fully green**: `pnpm verify` run as 8 sequential foreground legs per the cloud loop's standing instruction (never backgrounded) — typecheck, lint, 1344 unit tests across 7 workspaces, 462 script tests, `data:validate` (95 records, cross-refs resolve), a clean production build, `size` within budget on every route (largest 148.8 KB vs 200 KB on `/page`; 147.6 KB vs 175 KB on `/quiz/switch/page`), and `e2e` (1750/1750, 6.7m). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, and `group-buy-article-staleness-check.mjs --write` all ran clean — every mismatch each found was already filed (4 standing numeric-citation rows, corpus-clean consistency check, 4 standing present-tense rows), no new AUDIT rows. `pnpm deploy:check` confirmed `READY` at HEAD (`8bada2d0`). Tonight's cloud instructions define the breadth check as the full `pnpm verify` rather than the skill's default `SMOKE_SAMPLE=full pnpm e2e` + three standalone scripts split — ran verify's regular `e2e` leg plus the three content-consistency scripts directly, skipping the separate full-sample e2e re-run. (The verify run's own `build`/`test:run` legs regenerated the three `data-runtime`/`search` manifest files with a fresh `generatedAt` timestamp — reverted before this commit, since this is the standing `[data] [2.4]` AUDIT row, not new drift, and this commit is notes-only.)

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-14 17:02 | *(last digest committed, `8bada2d0`)* | baseline |
| 2026-11-14 17:02 → 20:21 | *(no scheduled fire logged)* | **quiet** — ~3.3h gap, no error signal, deploy stayed `READY` |
| 2026-11-14 20:21 → 20:22 | cloud `march` (scheduled) | **quiet** (dispatch-only, 69s run, no commits) |
| 2026-11-14 20:22 → 2026-11-15 00:41 | *(no scheduled fire logged)* | **quiet** — ~4.3h gap, no error signal |
| 2026-11-15 00:41 → 00:42 | cloud `march` (scheduled) | **quiet** (dispatch-only, 54s run, no commits) |
| 2026-11-15 00:42 → 07:29 | *(no scheduled fire logged)* | **quiet** — ~6.8h gap, no error signal |
| 2026-11-15 07:29 → 07:30 | cloud `march` (scheduled) | **quiet** (dispatch-only, 40s run, no commits) |
| 2026-11-15 07:30 → 15:15 | *(no scheduled fire logged)* | **quiet** — ~7.8h gap, no error signal |
| 2026-11-15 15:15 → 15:16 | cloud `march` (scheduled) | **quiet** (dispatch-only, 48s run, no commits) |
| 2026-11-15 15:16 → (now) | night (this tick) | in progress |

Since the last digest: **0 commits shipped** (four cloud `march` ticks, all clean no-ops), 0 new content, 0 new candidates, 0 critique passes. Zero failed ticks, zero reverts. Tonight's own breadth pass caught nothing new — see Headline.

## Shipped

- Nothing shipped by the loop since the last digest — all four scheduled `march` ticks found nothing due (plan empty: 0 specs/0 held; content-gap survey comfortable; no Monday-boundary newsletter trigger).
- Tonight's breadth pass: `pnpm verify` full gate green — typecheck, lint, 1344 unit tests (11 `@thock/tokens` + 156 `@thock/data` + 44 `@thock/seo` + 32 `@thock/ui` + 6 `apps/e2e` + 167 `@thock/content` + 928 `apps/web`), 462 script tests, `data:validate` (95 records), build, size (OK, largest 148.8 KB vs 200 KB on home), and `e2e` (1750/1750). Plus `content-fact-audit.mjs --write` (4 standing numeric-citation mismatches, all already filed, no new rows), `article-internal-consistency-check.mjs --write` (corpus clean), `group-buy-article-staleness-check.mjs --write` (4 standing present-tense rows, all already filed, no new rows). `pnpm deploy:check` confirmed `READY` at HEAD.

## Queues now

**plan:** 0 specs, 0 chunks ready, 0 held — `plan/README.md`'s specs table is empty. Nothing for `/plan-a-spec` to pick up until `/expand` proposes and `/oversight` promotes a new candidate.
**audit:** 19 total unresolved rows by hand count (1 `[HIGH]` `[needs-user-call]` row + 18 `### [ ]` rows under `## Open findings`) — unchanged from the last digest (no tick shipped against the queue in this quiet window). **Note:** `node scripts/pulse.mjs` still reports "1 pending" for `plan/AUDIT.md` — the known `pendingSection()` undercount (filed as a tuning candidate 2026-11-09) remains unpromoted/unfixed, and tonight's hand count (19) is up from 15 at that candidate's own filing. Do not read pulse's audit number as the total; see Tuning proposals.
**critique:** 8 pending, last pass 5d ago (pass 19, 2026-11-10T09:45Z at commit `b056da79`, unchanged since the last digest — no new pass ran in this window).
**candidates:** 11 pending (8 `>21d`, oldest 105d) — unchanged in composition from the last digest; just aged a day. `node scripts/plan/promote.mjs sweep` → clean (no Held lines to veto/release). `node scripts/plan/promote.mjs pick --json` → `pick: null`, names the Truncation-boundary mechanical survey (score 6.5, 96d old) as blocked on a contributor checkout rather than an autonomous pick (`"a contributor checkout files one needs-user ask instead"`) — a sharper, named signal than prior nights' generic "clean" read; see Needs you. `node scripts/plan/promote.mjs cuts --since 2026-11-14` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout (`night.yml` carries no cache-restore step for `.nexus/quota.json`) — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` (7d) by that definition.
- **`[needs-user-call]` — `#1068`** (GH_TOKEN/GITHUB_TOKEN invalid in march.yml, masking triage/critique gh checks): opened 2026-11-07T01:52Z, now ~208h old (~8.7d) — still open, still `triage:needs-user`, no owner comment since the triage reply on 2026-11-07. Needs an owner call on push-credential strategy (wire `ACTIONS_PAT`, or point `GH_TOKEN`/the git remote at `DEFAULT_WORKFLOW_TOKEN` or equivalent) — a repo-secret decision the loop can't make unilaterally. Locked (`issue-1068-credential-call`, since 2026-11-12, until owner comments or closes #1068, max_age 14d — expires 2026-11-26).
- **oversight needed: candidate queue silting (8 pending >21d, oldest 105d)** — both thresholds still trip (≥5 pending >21d, oldest >45d). Standing condition, repeat observation from every digest since at least 2026-11-04. Tonight's `pick --json` gives a concrete next step if draining is wanted: the valve's own top-aged pick (Truncation-boundary mechanical survey, score 6.5, 96d) needs a contributor checkout, not a weekly-cap wait.
- No motion-stalled alert — shipped 26 last full week (2026-W45) vs. 10.25 baseline (floor 5.13, reads `ok`); 10 so far in the current week (2026-W46) as of this morning's pulse read.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).
- **Standing item, unchanged:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch is still unaddressed across pass 19 (bumped MED → HIGH in place, recurred unaddressed across 3 passes), still has no GitHub issue filed. No critique pass ran in this window (last pass 5d ago).
- **Standing item, unchanged:** critique's `[HIGH]` `/group-buys` finding — the page's "Active group buys" lede is never true while all 18 records are closed — is still unaddressed since pass 18, still has no GitHub issue filed.
- **Watch item, recurring:** four more quiet gaps (~3.3h, ~4.3h, ~6.8h, ~7.8h) with no scheduled `march` tick doing real work, same shape as prior digests' noted gaps. No error signal accompanies any of them (deploy stayed `READY` throughout), consistent with the loop having nothing chunked to build between dispatch cycles while the plan sits empty.

## Today's intent

No ready chunk right now — the plan is fully drained (0 specs, 0 held). Until `/expand` proposes and `/oversight` promotes a new candidate, the next `/iterate` pass should prioritize: critique's two `[HIGH]` findings first — the `/trends/tracker` Sleeper/Faller mismatch (3 passes unaddressed, no issue filed) and the `/group-buys` "active buys" lede contradiction (pass 18, no issue filed); then the AUDIT mechanical queue in score order — the 4 `[cross-links] [4.5]` rows (3 `aurora-glow-theme-build` siblings + 1 `mm-studio-class80-discontinued` ↔ `cannonkeys-blaine-v2-se-group-buy`, all one-line prose additions), then the 8 `[content] [3.6]` rows (4 numeric-citation mismatches, 4 present-tense group-buy rows), the `[a11y] [3.5]` `ring-accent-mu` contrast sweep (74 files, 4 already fixed), the 2 stale `[seo]` hero-art rows (Mode Sonnet pair + CannonKeys Mode Sonnet R2), the `[content] [2.4]` plate-materials/Mode-flagship tension, the `[data] [2.4]` generated-manifest drift, and the `[seo] [1.8]` duplicate favicon.

## Tuning proposals

None new tonight. Added corroborating evidence to the standing `pulse.mjs` `pendingSection()` undercount candidate (filed 2026-11-09, still unpromoted) — hand count is now 19 unresolved AUDIT rows against pulse's reported "1 pending," up from 15 six days ago, and the gap is still growing silently. Also logged this tick's `promote.mjs pick --json` read on the same candidate file: the `Promote: aged` valve is live and would promote (0 open specs under queue depth 2) but its own top-aged pick needs a contributor checkout rather than an autonomous promotion — not a new mistuning, just a sharper diagnostic for whoever runs the next `/oversight` pass. Everything else in tonight's pulse points the other way: a fully green breadth check (8/8 verify legs, 1750/1750 e2e), all three content-consistency scripts clean, zero failed ticks across four clean no-ops, no motion stall, a clean (if empty) Held lane, and the one standing credential bug (`#1068`) unchanged and still awaiting an owner call.
