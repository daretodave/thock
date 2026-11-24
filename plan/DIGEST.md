# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**An unusually active window — all three cloud `march` ticks shipped (zero no-ops), closing a deep-dives content gap same-day — while both plan specs stayed fully Held throughout.** Since the last digest (`edca43d2`, 2026-11-23T22:36:36Z): cloud `march` fired three times, every one a ship — 23:19→23:36 UTC landed a trend snapshot (`1e855133`, 2026-W48), 08:12→08:29 UTC re-evidenced 3 field candidates in `plan/CANDIDATES.md` (`e7bcc708`), and 19:54→20:33 UTC ran a full content-gap cycle: `content-gap-survey.mjs` auto-filed a deep-dives hot-pursuit row, opened `#1096`, `/ship-content` drafted "Shortened Travel: The Lever Builders Keep Confusing With Spring Weight," and the finding closed in the same tick (`8308e838`…`2915d289`). Neither `#1068` nor `#1092` got an owner comment, so chunk `11.1` stayed blocked all window, and spec 12's aged-promotion veto (`#1095`) is still open as of tonight — today is its veto deadline. Tonight's own breadth pass is fully green: `pnpm verify` run as eight sequential foreground legs — typecheck, lint, `test:run` (1347 tests: 929 web + 167 content + 156 data + 46 seo + 32 ui + 11 tokens + 6 e2e-unit), `test:scripts` (504/504), `data:validate` (97 records, cross-refs resolve — +1 trend snapshot since last digest), `build` (125 articles), `size` (all 6 budgeted routes under budget) — plus `pnpm e2e` (1778/1778, 6.9m, every canonical URL; +8 over last digest's 1770 from tonight's new article's own URLs). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, and `group-buy-article-staleness-check.mjs --write` all came back clean (every mismatch already pending). `stale-updated-at-check.mjs --write` filed **one new row** — `shortened-travel-switches-deep-dive` (shipped tonight, `updatedAt` already behind HEAD) — and `truncation-call-site-check.mjs --write` stayed clean. `pnpm deploy:check` confirmed `READY` at HEAD (`2915d289`) before the breadth pass began. No new tuning proposal tonight — the standing unpromoted set is unchanged.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-23 22:37 | *(last digest committed, `edca43d2`)* | baseline |
| 2026-11-23 22:37 → 23:19 | *(no scheduled fire logged)* | **quiet** — ~42min gap, no error signal |
| 2026-11-23 23:19 → 23:36 | cloud `march` (scheduled) | **shipped** — data: trend snapshot 2026-W48 + manifest regen (`1e855133`, `76923b4e`) |
| 2026-11-23 23:36 → 2026-11-24 08:12 | *(no scheduled fire logged)* | **quiet** — ~8.6h gap, no error signal |
| 2026-11-24 08:12 → 08:29 | cloud `march` (scheduled) | **shipped** — `/expand`-adjacent field re-evidence: 3 pending candidates (group-buy lifecycle index, customs/duty landed-cost, switch-comparison force-curve charts) each gained a 2026-11-24 field signal (`e7bcc708`) |
| 2026-11-24 08:29 → 19:54 | *(no scheduled fire logged)* | **quiet** — ~11.4h gap, no error signal |
| 2026-11-24 19:54 → 20:33 | cloud `march` (scheduled) | **shipped** — content-gap hot-pursuit, filed and closed same tick: deep-dives row auto-filed (`8308e838`), issue `#1096` opened (`f12c606b`), article "Shortened Travel: The Lever Builders Keep Confusing With Spring Weight" shipped (`c95c61b9`), finding addressed + `#1096` closed (`81502122`), manifests regenerated (`2915d289`) |
| 2026-11-24 20:33 → (now) | night (this tick) | in progress |

Since the last digest: **8 commits shipped** across 3 cloud `march` runs (all `success`, all shipped — zero no-ops this window, a change from the prior window's 2-clean-no-ops-of-3 pattern), 0 local owner commits, 0 candidates newly filed by `/expand` (3 existing candidates re-evidenced instead), 0 critique findings filed (`/critique` wasn't dispatched this window), +16 `plan/AUDIT.md` rows net (see Queues now), 0 failed ticks, 0 reverts.

## Shipped

- `1e855133` + `76923b4e` — data: trend snapshot 2026-W48, manifests regenerated.
- `e7bcc708` — plan: research — field re-evidence added to 3 Pending `plan/CANDIDATES.md` rows (group-buy lifecycle index, customs/duty landed-cost, switch-comparison force-curve charts); header's `Last field research` bumped to 2026-11-24.
- `8308e838`→`2915d289` — content-gap hot-pursuit, filed and drained same tick: deep-dives pillar row auto-filed by `content-gap-survey.mjs`, issue `#1096` opened, "Shortened Travel: The Lever Builders Keep Confusing With Spring Weight" shipped via `/ship-content`, finding closed, manifests regenerated.
- Tonight's breadth pass: `pnpm verify` as 8 sequential foreground legs — typecheck, lint, `test:run` (1347 tests), `test:scripts` (504/504), `data:validate` (97 records), `build` (125 articles), `size` (6/6 budgeted routes under budget) — plus `pnpm e2e` (1778/1778, 6.9m, full canonical-URL crawl). `content-fact-audit.mjs --write` / `article-internal-consistency-check.mjs --write` / `group-buy-article-staleness-check.mjs --write` / `truncation-call-site-check.mjs --write` all clean (0 new rows). `stale-updated-at-check.mjs --write` filed 1 new row (`shortened-travel-switches-deep-dive`). `pnpm deploy:check` confirmed `READY` at HEAD (`2915d289`) before the pass began.

## Queues now

**plan:** 2 specs (11, 1 chunk left — Held on `#1092` since 2026-11-21, max_age 14d, expires 2026-12-05; 12, 7 chunks per its progress count — Held behind aged-promotion veto `#1095` until 2026-11-24, i.e. today) — 0 chunks actually ready to pick. Unchanged from last digest; pulse's own "chunks left"/"held" numbers still don't surface spec 12's auto-promoted Held line (standing `pulse.mjs` held-counter bug, score 3.2, unpromoted).
**audit:** 157 total unresolved rows by hand count — 2 under `## Pending` (`[needs-user-call]` `#1068`, `[user-issue #1092]`) + 155 under `## Open findings`: 102 `[seo]` (99 at `[5.4]` stale-`updatedAt` + 3 legacy at `[2.7]`/`[2.0]`/`[1.8]`), 41 `[cross-links]` `[4.5]`, 9 `[content]` `[~3.6]`, 1 `[a11y]` `[3.5]`, 1 `[data]` `[2.4]`, 1 `[engineering]`. Net **+16** since last digest (141→157): +1 stale-`updatedAt` row (tonight's breadth check) and +15 `[cross-links]` rows (`article-crosslink-survey.mjs` firing against this window's newly-shipped/clustered articles — aurora-glow-theme-build, key-matrix-ghosting-deep-dive, mode-lull-breaks-crown-mounting-encore, switch-break-in-myth, shortened-travel-switches-deep-dive, mm-studio-class80-discontinued). Pulse's own "2 pending" still only matches the literal `## Pending` heading (standing `pulse.mjs` undercount, score 4.0, unpromoted).
**critique:** 12 pending, last pass ~61h ago (pass 21, 2026-11-22T07:49:30Z at `91d546f4`) — no new pass this window (`/critique` wasn't dispatched; all 3 ticks ran other lanes). The standing `[HIGH]` `/trends/tracker` Sleeper/Faller magnitude mismatch (pass 16/19/21) is still open, still no GitHub issue.
**candidates:** 12 pending (4 `>21d`, oldest 102d, "ItemList JSON-LD parity check") — unchanged this window: no new candidates filed, none promoted, none cut. Under `Promote: aged`: `node scripts/plan/promote.mjs sweep` → **auto-promoted none, 1 awaiting** (spec 12's `#1095` veto still open, due today). `node scripts/plan/promote.mjs cuts --since 2026-11-23` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` by that definition.
- **Standing — `[needs-user-call]` `#1068`** (GH_TOKEN/GITHUB_TOKEN invalid in `march.yml` run, masking triage/critique gh checks): opened 2026-11-07T01:52Z, now ~17.8d old — still open, still `triage:needs-user`, no owner comment yet. Locked (`issue-1068-credential-call`, since 2026-11-12, until owner comments or closes `#1068`, max_age 14d) — **expires 2026-11-26, 2 days from now.**
- **Standing — `user-issue #1092`** (cloud `march` failed 2026-11-20 — `ACTIONS_PAT` push to `.github/workflows/march.yml` rejected "without `workflows` permission"): opened 2026-11-21T00:11Z, now ~3.9d old, past the 24h SLA — still open, still `triage:needs-user`, no owner comment yet. Blocks chunk `11.1` (the plan's only non-held chunk by pulse's count) via its Held line (since 2026-11-21, max_age 14d, expires 2026-12-05).
- **oversight needed: candidate queue silting (4 pending >21d, oldest 102d)** — the oldest-pending threshold (>45d) still trips even though the `>21d` count sits at 4, below the ≥5 trigger. Standing condition, repeat observation from every digest since at least 2026-11-04; the queue didn't move this window (no field-research-only candidates age out of Pending).
- No motion-stalled alert — pulse (read at the start of this tick, before tonight's own 3 shipped ticks) reports `shipped 13 / baseline 16.75 · 2026-W47 against 2026-W43..2026-W46`, `floor 8.38 · ok (50% of the baseline)`.
- No secrets-rotation note — this cloud checkout carries no local secrets-audit log.
- **New this window:** spec 12's aged-promotion veto window (`#1095`) reaches its deadline today (2026-11-24) — a repo-admin decision point: closing `#1095` vetoes the spec; leaving it open lets the next dispatcher tick build spec 12's first chunk.
- **Standing item, unchanged:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch is still unaddressed, still has no GitHub issue filed.
- **Standing item, growing:** the AUDIT queue's `[seo] [5.4]` stale-`updatedAt` cluster is now 99 rows (was 98) — the batching-gap candidate that would let `/iterate` drain them in one commit (score 5.6, filed 2026-11-21) is still unpromoted.

## Today's intent

0 chunks are actually ready to pick. `11.1` stays Held pending the `#1092` credential call; spec 12's chunks are Held behind the `#1095` veto window through today (2026-11-24) — if that closes without a veto, the next dispatcher tick picks up spec 12's first chunk. Absent plan work, the AUDIT queue's top mechanical picks are unchanged in shape from last digest, just larger: the 99 `[seo] [5.4]` stale-`updatedAt` rows, then the 41 `[cross-links] [4.5]` rows, then the 9 `[content] [~3.6]` rows, then critique's remaining unscored `[HIGH]` finding (the `/trends/tracker` Sleeper/Faller mismatch), then the smaller legacy rows (`[a11y] [3.5]` contrast sweep, `[seo]`/`[data]` `[1.8]`-`[2.7]` hero-art/favicon drift, `[engineering]` row).

## Tuning proposals

None new tonight. The standing unpromoted set is unchanged: stale-`updatedAt` cluster-drain mode (score 5.6), `march.yml` crash-dedupe (score 6.0), ItemList JSON-LD parity survey (score 6.0), read-time regression guard (score 6.0), catalog primary-source verification (score 6.0), `pulse.mjs` `pendingSection()` undercount (score 4.0), `pulse.mjs` held-line undercount (score 3.2), `SMOKE_SAMPLE` nightly-breadth split never wired (score 4.2, filed last digest). Tonight's breadth pass surfaced no new mistuned-gate signal beyond reinforcing the stale-`updatedAt` and cross-links growth already covered above.
