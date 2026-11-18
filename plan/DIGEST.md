# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A productive day — spec 09 (Truncation-boundary mechanical survey) shipped end-to-end across three chained cloud ticks and closed out, a security fix landed, and one content-gap article shipped the pipeline from auto-filed finding to published piece.** Since the last digest (`cbb425ec`, 2026-11-17T19:32:19Z): the 2026-11-18 02:03 UTC tick shipped `03f0cf4e` (Next.js bumped to 16.4.6, patching two moderate cache-leak advisories) and chunked spec 09 (`d3a0f630`); three chained ticks (02:35, 03:13, 04:12) then shipped chunks 09.1 (`d6eaf1ad`/`893eb49e`/`09028550` — boundary-adjacent `truncate()`/`truncateForMeta()` fixtures), 09.2 (`0d5c9b7b`/`6b3544bd`/`229e9269` — the `truncation-call-site-check.mjs` mechanical grep gate), and 09.3 (`dd4efd8b`/`5af509dc` — settle and close), fully draining the spec. A local owner commit (`7544a1f6`) wired the new check into this very skill's breadth checks mid-window (already reflected in tonight's run, step 3 below). The 11:03 UTC tick then ran the full content-gap pipeline in one Cloud-Run: closed `#1084` as a duplicate already fixed by `03f0cf4e` (`a6f09e4b`), filed 2 new field-research candidates + regenerated manifests (`5753191f`), auto-filed a trends-pillar content-gap row and opened `#1086` (`8b217589`/`438b0cbb`), then dispatched and shipped the deep-dives article "The matrix, the diode, and the three keys that break it" closing `#1086` (`e6e0ae8a`/`989f90d7`). Tonight's own breadth pass is fully green: `pnpm verify` run as sequential foreground legs — typecheck, lint, unit tests, script tests, `data:validate`, build, size, and the full `SMOKE_SAMPLE=full pnpm e2e` (1758/1758, 8.0m, every canonical URL not just the sample). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, and `truncation-call-site-check.mjs --write` (its first nightly run, newly wired) all came back clean — every mismatch each found was already filed, zero new AUDIT rows. `pnpm deploy:check` confirmed `READY` at HEAD (`989f90d7`). **Housekeeping:** the full `pnpm e2e` build step regenerated the three `data-runtime`/search manifest files with a fresh `generatedAt` timestamp only — reverted before this commit (the standing `[data] [2.4]` AUDIT row, not new drift; this commit stays notes-only).

**New tonight:** both standing `pulse.mjs` undercount bugs reproduced for a third consecutive digest. The AUDIT `pendingSection()` bug (filed 2026-11-09, score 4.0) now hides **31** real unresolved rows behind a reported "1 pending" — up from 19 three nights ago, more than 60x off. The held-line counter bug (filed 2026-11-16, score 3.2) still reads "0 held" against spec 10's single active auto-promoted Held line (spec 09's line dropped out when it closed tonight, so this is the same bug on a fresh instance, not a new one). Added update notes to both existing candidates with tonight's numbers; neither re-filed nor re-scored, per the meta-loop rail.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-17 19:32 | *(last digest committed, `cbb425ec`)* | baseline |
| 2026-11-17 19:33 | cloud `march` (scheduled) | **quiet** — no commits |
| 2026-11-17 19:38 → 2026-11-18 02:03 | *(no scheduled fire logged)* | **quiet** — ~6.4h gap, no error signal, deploy stayed `READY` |
| 2026-11-18 02:03 → 02:35 | cloud `march` (scheduled) | **shipped** — Next.js 16.4.6 security fix + chunked spec 09 |
| 2026-11-18 02:35 → 03:13 | cloud `march` (chain) | **shipped** — chunk 09.1 (`truncate()`/`truncateForMeta()` boundary fixtures) |
| 2026-11-18 03:13 → 04:12 | cloud `march` (chain) | **shipped** — chunk 09.2 (`truncation-call-site-check.mjs` gate); owner's `7544a1f6` wired it into `/digest` mid-window |
| 2026-11-18 04:12 → 04:36 | cloud `march` (chain) | **shipped** — chunk 09.3 (settle + close); spec 09 fully drained |
| 2026-11-18 04:36 → 11:03 | *(no scheduled fire logged)* | **quiet** — ~6.4h gap, no error signal |
| 2026-11-18 11:03 → 11:49 | cloud `march` (scheduled) | **shipped** — content-gap pipeline: closed `#1084` (dup), 2 field candidates filed, trends-pillar gap auto-filed + `#1086` opened, deep-dives article shipped closing `#1086` |
| 2026-11-18 11:49 → 19:06 | *(no scheduled fire logged)* | **quiet** — ~7.3h gap, no error signal |
| 2026-11-18 19:06 → (now) | night (this tick) | in progress |

Since the last digest: **17 commits shipped** (6 cloud `march` ticks + 1 local owner commit), 1 spec closed (09, fully drained), 1 new article (content-gap fill, deep-dives pillar), 2 new candidates filed (field research), 1 issue closed as duplicate (`#1084`), 1 issue opened + closed same tick (`#1086`), 0 critique passes, 0 failed ticks, 0 reverts.

## Shipped

- `03f0cf4e` — fix: Next.js bumped to 16.4.6, patching two moderate cache-leak advisories.
- `d3a0f630` → `09028550` (3 commits) — spec 09 chunked, then chunk 09.1 shipped: boundary-adjacent fixtures for `truncate()`/`truncateForMeta()` exact-length and over-budget cases.
- `0d5c9b7b` → `229e9269` (3 commits) — chunk 09.2 shipped: `truncation-call-site-check.mjs`, a mechanical grep gate for raw display-text slices bypassing the vetted truncation helpers.
- `7544a1f6` — docs (local, owner-authored): wired `truncation-call-site-check.mjs` into `/digest`'s own breadth checks — ran clean on its first nightly pass tonight.
- `dd4efd8b` / `5af509dc` — chunk 09.3 shipped: settle and close. Spec 09 (Truncation-boundary mechanical survey) is now fully drained from `plan/README.md`.
- `a6f09e4b` — plan: issue-age refill closed `#1084` directly to Drained — the cloud-march failure it flagged was already fixed earlier the same tick by `03f0cf4e`, confirmed by several clean gate runs since.
- `5753191f` — build: regenerated `data-runtime`/search manifests; filed 2 field-research candidates ("Customs/duty shifts now affect group-buy landed cost", "Switch comparison tools standardize on force-curve charts") plus a re-evidence note on the standing "Recurring reader-questions column" candidate.
- `8b217589` / `438b0cbb` — audit: trends-pillar content-gap row auto-filed by `content-gap-survey.mjs` (score 7.0, HOT PURSUIT — 1 of ≥2 articles in the last 30d); content dispatch opened `#1086`.
- `e6e0ae8a` — content: deep-dives — "The matrix, the diode, and the three keys that break it" (~1700 words, mechanism-explainer on key matrix scanning, diodes, and ghosting; 3 `InlineViz` diagrams; closes `#1086`).
- `989f90d7` — audit: marked the deep-dives content-gap row addressed (closes `#1086`); the new article's own cross-link survey auto-filed 11 `[cross-links] [4.5]` rows (`key-matrix-ghosting-deep-dive` ↔ its deep-dives-pillar siblings); the content-gap survey then auto-filed the next hot-pursuit row (trends pillar, score 7.0 — the one `/march` dispatches `/ship-content` for next).
- Tonight's breadth pass: `pnpm verify` full gate green (typecheck, lint, unit + script tests, `data:validate`, build, size) plus the nightly `SMOKE_SAMPLE=full pnpm e2e` (1758/1758, 8.0m — every canonical URL). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, `truncation-call-site-check.mjs --write` (first nightly run) all clean — zero new AUDIT rows, every mismatch already filed. `pnpm deploy:check` confirmed `READY` at HEAD. The verify/e2e build legs regenerated the three `data-runtime`/search manifests with a fresh `generatedAt` timestamp; reverted before this commit (standing `[data] [2.4]` row, not new drift).

## Queues now

**plan:** 1 spec (10, Stale-`updatedAt` mechanical check — not yet chunked), 0 chunks ready, 1 held (10 · auto-promoted, veto until 2026-11-18 via `#1083`, issue still open — window has now elapsed in wall-clock terms). Spec 09 fully drained tonight. **Note:** `node scripts/pulse.mjs` reports "0 held" — the known undercount (third confirmed instance tonight, see Tuning proposals); do not read pulse's held number as the total.
**audit:** 31 total unresolved rows by hand count (1 `[HIGH]` `[needs-user-call]`, 1 `[HOT PURSUIT]` content-gap already queued for next `/ship-content` dispatch, 29 `### [ ]` rows under `## Open findings`) — up from 19 three nights ago; still badly off pulse's own undercounted "1 pending" (standing, unpromoted 2026-11-09 candidate, now updated with tonight's count).
**critique:** 8 pending, last pass 8d ago (pass 19, 2026-11-10T09:45Z at commit `b056da79`, unchanged — no new pass ran this window).
**candidates:** 12 pending (5 `>21d`, oldest 109d) — 2 new field-research rows filed this window (2026-11-18). `node scripts/plan/promote.mjs sweep` → spec 10 still `wait` (`#1083` until 2026-11-18) — 0 of 1 auto-promoted Held lines due, 1 awaiting. `node scripts/plan/promote.mjs cuts --since 2026-11-17` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` by that definition.
- **`[needs-user-call]` — `#1068`** (GH_TOKEN/GITHUB_TOKEN invalid in march.yml, masking triage/critique gh checks): opened 2026-11-07T01:52Z, now ~281h old (~11.7d) — still open, still `triage:needs-user`. Needs an owner call on push-credential strategy — a repo-secret decision the loop can't make unilaterally. Locked (`issue-1068-credential-call`, since 2026-11-12, until owner comments or closes #1068, max_age 14d — expires 2026-11-26).
- **Veto window on spec 10 has elapsed** — issue `#1083` ("Auto-promoted: Stale-`updatedAt` mechanical check — close to veto") carried `max_age: 1d` against "until 2026-11-18"; that window has now passed in wall-clock terms. The issue is still open (no veto), so the next tick that checks the depth valve should treat spec 10 as released to chunk and build. No action needed if the promotion is wanted; close `#1083` to veto it instead.
- **oversight needed: candidate queue silting (5 pending >21d, oldest 109d)** — both thresholds still trip (≥5 pending >21d, oldest >45d). Standing condition, repeat observation from every digest since at least 2026-11-04.
- No motion-stalled alert — shipped 10 last full week (2026-W46) vs. 16.25 baseline (floor 8.13, reads `ok`); 6 shipped so far in 2026-W47.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).
- **Standing item, unchanged:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch is still unaddressed, still has no GitHub issue filed. No critique pass ran in this window (last pass 8d ago).
- **Standing item, unchanged:** critique's `[HIGH]` `/group-buys` finding — the page's "Active group buys" lede is never true while every group-buy record is closed — is still unaddressed, still has no GitHub issue filed.

## Today's intent

Spec 10's veto window has elapsed (`#1083` still open) — the next dispatcher pass should chunk and build it unless the owner closes `#1083` first. The highest-score actionable item in the queue is the `[HOT PURSUIT] [content-gap] [7]` trends-pillar row filed this morning (1 of ≥2 articles in the last 30d) — the next `/march` tick dispatches `/ship-content` for it automatically. Otherwise, prioritize the standing AUDIT queue in score order: critique's two `[HIGH]` findings first (the `/trends/tracker` Sleeper/Faller mismatch and the `/group-buys` "active buys" lede contradiction, neither with a filed issue), then the mechanical queue — the 15 `[cross-links] [4.5]` rows (11 `key-matrix-ghosting-deep-dive` siblings, 3 `aurora-glow-theme-build` siblings, 1 `mm-studio-class80-discontinued` pair), the 8 `[content] [3.6]` rows (4 numeric-citation mismatches, 4 present-tense group-buy rows), the `[a11y] [3.5]` `ring-accent-mu` contrast sweep, the 2 stale `[seo]` hero-art rows, the `[content] [2.4]` plate-materials/Mode-flagship tension, the `[data] [2.4]` generated-manifest drift, and the `[seo] [1.8]` duplicate favicon.

## Tuning proposals

No new candidate filed tonight — added update notes to two still-unpromoted candidates with tonight's fresh numbers, neither re-scored:
- The `pulse.mjs` `pendingSection()` AUDIT-undercount candidate (score 4.0, filed 2026-11-09): real unresolved-row count is now 31, up from 19 three nights ago, against pulse's still-reported "1 pending."
- The `pulse.mjs` held-line-counter candidate (score 3.2, filed 2026-11-16): third confirmed instance — spec 09's Held line dropped out when it closed tonight, spec 10's remains active, pulse still reads "0 held" against a real 1.

Both are small, low-risk script edits already scoped in their respective rows; `/oversight` promotes.
