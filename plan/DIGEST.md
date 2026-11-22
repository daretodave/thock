# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet, clean window — one standing `[HIGH]` critique finding got fixed (`/group-buys`'s false "active" lede), a new candidate was filed, and both open credential-permission issues (`#1068`, `#1092`) are still waiting on an owner with no new signal.** Since the last digest (`165b57cf`, 2026-11-21T17:57:56Z): cloud `march` fired four times, shipping five commits across three of them (the fourth, 15:53→15:54 UTC, was a clean no-op). `/expand` pass 446 filed one new candidate (stale-`updatedAt` backlog has no cluster-drain path, score 5.6). `/iterate`'s `issue-age` generator refilled a Pending row for `#1092` into `plan/AUDIT.md` (already tracked by chunk 11.1's Held line, now surfaced to the audit queue too). Then `/iterate` picked critique's standing `[HIGH]` `/group-buys` finding — the hero lede's unconditional "Active group buys..." claim, false whenever every record is `closed` (currently all 18 are) — and shipped the state-aware fix, closing `#1094` and flipping the AUDIT row Pending→Done (which also compacted 34 Done rows older than 30 days). `/critique` pass 21 then filed 4 fresh findings (0 high, 3 medium, 1 low) across `/trends/tracker`, `/tools`+`/compare/switch`+`/quiz/switch`, the home hero, and `/news`. Tonight's own breadth pass is fully green: `pnpm verify` run as eight sequential foreground legs — typecheck, lint, `test:run` (1347 tests: 929 web + 167 content + 156 data + 46 seo + 32 ui + 11 tokens + 6 e2e-unit), `test:scripts` (504/504), `data:validate` (96 records, cross-refs resolve), `build`, `size` (all 6 budgeted routes under budget) — plus the full-corpus `SMOKE_SAMPLE=full pnpm e2e` (1770/1770, 9.3m). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, `stale-updated-at-check.mjs --write`, and `truncation-call-site-check.mjs --write` all came back clean — every mismatch each found (4, 0, 4, 101, 0 respectively) was already filed in `plan/AUDIT.md`, so no new rows this tick. The verify run's own `build`/`test:run` steps regenerated the three `data-runtime`/`search` `*.generated.json` files with a fresh `generatedAt` timestamp (the standing `[data] [2.4]` AUDIT drift finding, reconfirmed) — discarded before this commit since the digest ships notes only. `pnpm deploy:check` confirmed `READY` at HEAD (`5b4e540`) before this tick's breadth pass began.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-21 17:58 | *(last digest committed, `165b57cf`)* | baseline |
| 2026-11-21 17:58 → 20:45 | *(no scheduled fire logged)* | **quiet** — ~2.8h gap, no error signal |
| 2026-11-21 20:45 → 20:54 | cloud `march` (scheduled) | **shipped** — `/expand` pass 446: 1 candidate filed (stale-`updatedAt` cluster-drain gap, score 5.6) |
| 2026-11-21 20:54 → 2026-11-22 00:54 | *(no scheduled fire logged)* | **quiet** — ~4.0h gap, no error signal |
| 2026-11-22 00:54 → 01:11 | cloud `march` (scheduled, chain) | **shipped** (3 commits) — plan refill (`#1092` Pending row); `/iterate` fixed `/group-buys` hero lede (closes `#1094`); AUDIT row flipped Pending→Done + 34 Done rows compacted |
| 2026-11-22 01:11 → 07:44 | *(no scheduled fire logged)* | **quiet** — ~6.5h gap, no error signal |
| 2026-11-22 07:44 → 07:52 | cloud `march` (scheduled) | **shipped** — `/critique` pass 21: 4 findings (0 high, 3 medium, 1 low) |
| 2026-11-22 07:52 → 15:53 | *(no scheduled fire logged)* | **quiet** — ~8.0h gap, no error signal |
| 2026-11-22 15:53 → 15:54 | cloud `march` (scheduled) | **no-op** — clean `success`, 53s, nothing to ship |
| 2026-11-22 15:54 → (now) | night (this tick) | in progress |

Since the last digest: **5 commits shipped**, all via cloud `march` (4 workflow runs, 3 of which shipped at least one commit, 1 clean no-op), 0 local owner commits, 1 candidate filed, 1 `[HIGH]` critique finding fixed (`/group-buys`, closes `#1094`), 4 new critique findings filed, 1 new AUDIT Pending row (`#1092`, surfaced not newly discovered), 0 failed ticks (all four workflow runs report `success`), 0 reverts.

## Shipped

- `3f106506` — `/expand` pass 446: filed `plan/CANDIDATES.md` candidate "Stale-`updatedAt` backlog has no cluster-drain path" (score 5.6) — 97 rows landed in one commit the day `stale-updated-at-check.mjs` first ran, 101 Pending now, none drained since.
- `44f2979d` — plan refill (`issue-age` generator): filed a Pending row for `#1092` (cloud `march` failure, `ACTIONS_PAT` lacks `workflows` permission) into `plan/AUDIT.md` — already tracked by chunk 11.1's Held line, now also visible to `/iterate`'s queue.
- `2f417b1a` — fix: `/group-buys` hero lede no longer reads "Active group buys..." unconditionally. Critique's standing `[HIGH]` finding (pass 18, re-observed pass 20): every one of the 18 `data/group-buys/*.json` records is `status: closed`, so `live.length === 0` for every current visitor while the page's only content block ("Just closed") directly contradicted the lede. Swapped to state-aware copy when `totalActive === 0`. `pnpm verify` green, 1770/1770 e2e. Closes `#1094`.
- `91d546f4` — audit: flips the `/group-buys` Pending row to Done (addressed in `2f417b1a`, closes `#1094`); also compacted 34 AUDIT.md Done rows older than 30 days.
- `5b4e5402` — `/critique` pass 21: 4 findings filed (0 high, 3 medium, 1 low) across `/trends/tracker` (Sleeper card's signed negative delta reads as a second faller), `/tools`+`/compare/switch`+`/quiz/switch` (inconsistent/missing eyebrow text), home hero (illegible italic epigraph), `/news` (raw ISO-date teaser lede).
- Tonight's breadth pass: `pnpm verify` run as 8 sequential foreground legs — typecheck, lint, `test:run` (1347 tests across 7 workspaces), `test:scripts` (504/504), `data:validate` (96 records), `build`, `size` (all 6 budgeted routes under budget) — plus `SMOKE_SAMPLE=full pnpm e2e` (1770/1770, 9.3m, every canonical URL). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, `stale-updated-at-check.mjs --write`, `truncation-call-site-check.mjs --write` all clean — every mismatch found was already pending in `plan/AUDIT.md`, 0 new rows. `pnpm deploy:check` confirmed `READY` at HEAD before this tick's breadth pass began.

## Queues now

**plan:** 1 spec (11, `march.yml` dispatch-summary one-liner), 1 chunk — still **Held** (`11.1`, blocked on `#1092`'s workflow-permission fix, since 2026-11-21, max_age 14d, expires 2026-12-05) — 0 chunks actually ready to pick.
**audit:** 141 total unresolved rows by hand count (2 `### ` rows under `## Pending` — `[needs-user-call]` `[HIGH]` `#1068`, and `[user-issue #1092]` `[HIGH]`, new this window — plus 139 `### [ ]` rows under `## Open findings`: 101 `[seo]` — 98 at `[5.4]` stale-`updatedAt` rows plus 1 each at `[2.7]`/`[2.0]`/`[1.8]` — 26 `[cross-links] [4.5]`, 9 `[content] [3.6]`, 1 `[a11y] [3.5]`, 1 `[data] [2.4]`, 1 `[engineering]`) — up from 140 last digest (the new `#1092` Pending row). Pulse's own "2 pending" happens to match the literal `## Pending` heading count tonight, but still misses the 139-row `## Open findings` backlog entirely — the standing `pulse.mjs` undercount bug (unpromoted score-4.0 candidate, filed 2026-11-09).
**critique:** 12 pending, last pass 10h ago (pass 21, 2026-11-22T07:50:12Z at `5b4e5402`). 4 new findings this window; the standing `[HIGH]` `/trends/tracker` Sleeper/Faller magnitude mismatch (pass 16/19) is still open; the prior `[HIGH]` `/group-buys` finding was addressed this window (`2f417b1a`, closes `#1094`).
**candidates:** 12 pending (5 `>21d`, oldest 113d) — one new row this window (expand pass 446, score 5.6). `node scripts/plan/promote.mjs sweep` → `clean`/`[]` (no auto-promoted Held lines exist to sweep — the one live Held line, `11.1`, is a manual triage block, not the auto-promotion shape). `node scripts/plan/promote.mjs pick --json` → `pick: null` / `ask` (top-aged candidate, "Heading-semantics coverage check," score 6.0, 112 days old, reason: "a contributor checkout files one needs-user ask instead") — same standing diagnostic as every digest since 2026-11-15; auto-promoted none, 0 awaiting. `node scripts/plan/promote.mjs cuts --since 2026-11-21` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` by that definition.
- **Standing — `[needs-user-call]` `#1068`** (GH_TOKEN/GITHUB_TOKEN invalid in `march.yml` run, masking triage/critique gh checks): opened 2026-11-07T01:52Z, now ~15.7d old — still open, still `triage:needs-user`, no owner comment yet. Locked (`issue-1068-credential-call`, since 2026-11-12, until owner comments or closes `#1068`, max_age 14d) — **expires 2026-11-26, 4 days from now.**
- **Standing — `user-issue #1092`** (cloud `march` failed 2026-11-20 — `ACTIONS_PAT` push to `.github/workflows/march.yml` rejected "without `workflows` permission"): opened 2026-11-21T00:11Z, now ~41.8h/1.7d old, past the 24h SLA — still open, still `triage:needs-user`, no owner comment yet. Blocks chunk 11.1 (the plan's only chunk) via its Held line (since 2026-11-21, max_age 14d, expires 2026-12-05).
- **oversight needed: candidate queue silting (5 pending >21d, oldest 113d)** — both thresholds still trip (≥5 pending >21d, oldest >45d). Standing condition, repeat observation from every digest since at least 2026-11-04.
- No motion-stalled alert — shipped 10 last full week (2026-W46) vs. 16.25 baseline (floor 8.13, reads `ok`); 13 shipped so far in 2026-W47, already past the floor.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).
- **Resolved this window:** critique's `[HIGH]` `/group-buys` finding (the page's "Active group buys" lede was never true while every group-buy record is closed) — addressed in `2f417b1a`, closes `#1094`.
- **Standing item, unchanged:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch is still unaddressed, still has no GitHub issue filed.
- **Standing item, unchanged:** the AUDIT queue is still dominated by the 98 `[seo] [5.4]` stale-`updatedAt` rows (trivial frontmatter-date bumps) — watch over the next few digests whether `/iterate`'s throughput clears this batch without starving `[cross-links]`/`[content]` or the one remaining unscored `[HIGH]` critique finding above.

## Today's intent

0 chunks are actually ready to pick — spec 11's only chunk is still Held pending the `#1092` workflow-credential call above, so the next dispatcher tick has no plan work to build until that's resolved. Absent that, the AUDIT queue's top mechanical picks are the 98 `[seo] [5.4]` stale-`updatedAt` rows, then the 26 `[cross-links] [4.5]` rows, then the 9 `[content] [3.6]` rows (numeric-citation mismatches + present-tense group-buy copy), then critique's remaining unscored `[HIGH]` finding (the `/trends/tracker` Sleeper/Faller mismatch — no filed issue, worth a deliberate pick even though the AUDIT queue's raw scores would bury it under the stale-`updatedAt` batch), then the smaller legacy rows (`[a11y] [3.5]` contrast sweep, `[seo]`/`[data] [1.8]`-`[2.7]` hero-art/favicon drift, `[engineering]` row).

## Tuning proposals

None new tonight. Everything in tonight's pulse points at execution gaps, not gate mistuning: a fully green breadth check (8/8 verify legs plus the full-sample nightly e2e, 1770/1770), all five content-consistency write scripts clean (every mismatch found already filed, 0 new rows), zero failed ticks across the window's four runs (including one clean no-op), no motion stall, and the credential/permission picture remains the dominant blocker — both `#1068` (gh auth for triage/critique checks) and `#1092` (workflow-file push permission) are repo-secret decisions the loop correctly continues to route to `/oversight` rather than attempting to work around. The two standing `pulse.mjs` undercount candidates (`pendingSection()`, score 4.0, filed 2026-11-09; held-counter, score 3.2, filed 2026-11-16) are unchanged and still unpromoted — not re-scored.
