# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Spec 11's only chunk hit a hard wall — cloud can't push to `.github/workflows/march.yml` without `workflows` permission — and is now Held pending a repo-admin call; one content-gap article shipped and closed its own issue in the same breath.** Since the last digest (`c9ab2606`, 2026-11-20T19:10:43Z): a scheduled tick picked chunk 11.1 (the `march.yml` dispatch-summary one-liner), built and verified it clean, then had its push rejected — `! [remote rejected] HEAD -> main (refusing to allow a GitHub App to create or update workflow .github/workflows/march.yml without workflows permission)` — against both `GH_TOKEN`/`GITHUB_TOKEN` and `DEFAULT_WORKFLOW_TOKEN`. This falsifies spec 11's own premise (that `ACTIONS_PAT` already carries `workflow` scope, cited from a 2026-09-27 `heartbeat.yml` edit). Nothing was half-committed — the worktree was discarded and the tick opened issue `#1092` to surface it. The next tick's triage pass (`fe14eeaf`) labeled `#1092` `triage:needs-user` and wrote a Held line for chunk 11.1 in `plan/README.md`, so `/next` stops retrying the same rejected push every cycle until a repo admin confirms the PAT's `workflow` scope is actually fixed. After an ~8.4h quiet gap, the content-gap pipeline ran for the ideas pillar, shipping "Switch break-in: what running a switch in actually changes" (`9a848bad`→`9eb1e363`), closing issue `#1093` the same tick. Tonight's own breadth pass is fully green: `pnpm verify` run as sequential foreground legs — typecheck, lint, unit tests (1102 across workspaces: 929 web + 167 content + 6 e2e-unit), `test:scripts` (504/504), `data:validate` (96 records), `build`, `size` (all 6 budgeted routes under budget) — plus the full-corpus `SMOKE_SAMPLE=full pnpm e2e` (1770/1770, 8.1m). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, and `truncation-call-site-check.mjs --write` all came back clean (every mismatch each found was already filed). `stale-updated-at-check.mjs --write` filed exactly one new row: tonight's own fresh ideas article's `updatedAt` (2026-11-18, the content-gap generator's backfilled `publishedAt`) already predates the commit that actually wrote it (2026-11-21) — a one-line frontmatter bump. `pnpm deploy:check` confirmed `READY` at HEAD before this tick's breadth pass began.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-20 19:10 | *(last digest committed, `c9ab2606`)* | baseline |
| 2026-11-20 19:10 → 23:38 | *(no scheduled fire logged)* | **quiet** — ~4.5h gap, no error signal |
| 2026-11-20 23:38 → 2026-11-21 00:12 | cloud `march` (scheduled) | **blocked** — picked chunk 11.1, built + verified clean, push rejected (no `workflows` permission); opened `#1092`; worktree discarded, nothing committed |
| 2026-11-21 00:12 → 05:28 | *(no scheduled fire logged)* | **quiet** — ~5.3h gap, no error signal |
| 2026-11-21 05:28 → 05:44 | cloud `march` (scheduled) | **shipped** — triage labeled `#1092` `triage:needs-user`; added Held line for chunk 11.1 |
| 2026-11-21 05:44 → 14:07 | *(no scheduled fire logged)* | **quiet** — ~8.4h gap, no error signal |
| 2026-11-21 14:07 → 14:35 | cloud `march` (scheduled) | **shipped** — content-gap pipeline: ideas article "Switch break-in: what running a switch in actually changes" closing `#1093` |
| 2026-11-21 14:35 → (now) | night (this tick) | in progress |

Since the last digest: **5 commits shipped**, all via cloud `march` (3 workflow runs, 2 of which shipped a commit, 1 blocked-with-no-commit), 0 local owner commits, 1 spec's only chunk moved from ready to Held (blocked on `#1092`), 1 new article (content-gap fill), 1 issue opened+closed same tick (`#1093`), 1 issue triaged to needs-user (`#1092`), 0 failed ticks (all three workflow runs report `success`, including the one that discarded its own work), 0 reverts.

## Shipped

- `fe14eeaf` — triage: labeled `#1092` `triage:needs-user` (bug) — cloud's push to `.github/workflows/march.yml` was rejected "without `workflows` permission," re-falsifying spec 11's premise that `ACTIONS_PAT` already carries `workflow` scope. Added a Held line for chunk 11.1 in `plan/README.md` so `/next` stops retrying the same rejected push every tick.
- `9a848bad` / `b6ca9a7d` / `a081072c` / `9eb1e363` — content-gap pipeline: ideas article "Switch break-in: what running a switch in actually changes" shipped (~1180 words, tags: switches, linear, tactile, modding), closing `#1093` same tick. Cross-link survey filed 8 new pairs against existing switches/modding-pillar siblings (`frankenswitching-explained`, `holee-mod-explained`, `lubing-switches-guide`, `spring-swaps-explained`, `stabilizer-servicing-guide`, `switch-films-worth-it`, `tape-mod`, `typing-tests-lie`).
- Tonight's breadth pass: `pnpm verify` run as sequential foreground legs — typecheck, lint, `test:run` (1102 tests: 929 web + 167 content + 6 e2e-unit), `test:scripts` (504/504), `data:validate` (96 records, cross-refs resolve), `build`, `size` (all 6 budgeted routes under budget) — plus `SMOKE_SAMPLE=full pnpm e2e` (1770/1770, 8.1m, every canonical URL — doubles as both the verify gate's e2e leg and the nightly full-breadth leg). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, `truncation-call-site-check.mjs --write` all clean. `stale-updated-at-check.mjs --write` filed 1 new `[seo] [5.4]` row (tonight's own fresh article). `pnpm deploy:check` confirmed `READY` at HEAD before this tick's breadth pass began.

## Queues now

**plan:** 1 spec (11, march.yml dispatch-summary one-liner), 1 chunk — now **Held** (`11.1`, blocked on `#1092`'s workflow-permission fix, since 2026-11-21, max_age 14d) — 0 chunks actually ready to pick.
**audit:** 140 total unresolved rows by hand count (1 `[needs-user-call]` `[HIGH]` Pending row [`#1068`], 139 `### [ ]` rows under `## Open findings`: 101 `[seo]` — 98 at `[5.4]` stale-`updatedAt` rows [+1 tonight] plus 1 each at `[2.7]`/`[2.0]`/`[1.8]` — 26 `[cross-links] [4.5]` [+8 this window, the new ideas article's siblings], 9 `[content] [3.6]`, 1 `[a11y] [3.5]`, 1 `[data]`/`[content] [2.4]`, 1 `[engineering]`) — up from 131 last digest, still ~140x off pulse's own undercounted "1 pending" (standing, unpromoted 2026-11-09 candidate).
**critique:** 9 pending, last pass 33h ago (pass 20, 2026-11-20T08:40Z at commit `ed0de5df`, unchanged — no new pass ran this window).
**candidates:** 11 pending (5 `>21d`, oldest 112d) — unchanged in composition from the last digest; just aged a day. `node scripts/plan/promote.mjs sweep` → `[]` (no auto-promoted Held lines exist to sweep — the one live Held line, `11.1`, is a manual triage block, not the auto-promotion shape). `node scripts/plan/promote.mjs pick --json` → `pick: null` / `ask` (top-aged candidate, "Heading-semantics coverage check," score 6.0, 111 days old, reason: "a contributor checkout files one needs-user ask instead") — same standing diagnostic as every digest since 2026-11-15; auto-promoted none, 0 awaiting. `node scripts/plan/promote.mjs cuts --since 2026-11-20` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` by that definition.
- **New — `/oversight` call: cloud cannot push `.github/workflows/*` changes right now.** Chunk 11.1 (the only chunk in the plan) is blocked: the push was rejected "without `workflows` permission" against both `GH_TOKEN`/`GITHUB_TOKEN` and `DEFAULT_WORKFLOW_TOKEN`, with no `ACTIONS_PAT`-named secret present in `march.yml`'s env. This falsifies spec 11's own premise (that `ACTIONS_PAT` already carries `workflow` scope, established 2026-09-27 via a `heartbeat.yml` edit) — whatever token that used then, `march.yml` doesn't have an equivalent now. Filed as issue `#1092` (`triage:needs-user`) and a Held line on chunk 11.1 (`since: 2026-11-21`, `max_age: 14d`, expires 2026-12-05). Needs a repo admin to confirm/fix the workflow-scoped credential before any `.github/workflows/*`-touching chunk (spec 11 included) can land from cloud again.
- **Standing — `[needs-user-call]` `#1068`** (GH_TOKEN/GITHUB_TOKEN invalid in march.yml, masking triage/critique gh checks): opened 2026-11-07T01:52Z, now ~14.7d old — still open, still `triage:needs-user`. Locked (`issue-1068-credential-call`, since 2026-11-12, until owner comments or closes #1068, max_age 14d — expires 2026-11-26).
- **oversight needed: candidate queue silting (5 pending >21d, oldest 112d)** — both thresholds still trip (≥5 pending >21d, oldest >45d). Standing condition, repeat observation from every digest since at least 2026-11-04.
- No motion-stalled alert — shipped 10 last full week (2026-W46) vs. 16.25 baseline (floor 8.13, reads `ok`); 12 shipped so far in 2026-W47, already past the floor.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).
- **Standing item, unchanged:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch is still unaddressed, still has no GitHub issue filed.
- **Standing item, unchanged:** critique's `[HIGH]` `/group-buys` finding — the page's "Active group buys" lede is never true while every group-buy record is closed — is still unaddressed, still has no GitHub issue filed.
- **Standing item, unchanged:** tonight's AUDIT queue is still dominated by the 98 `[seo] [5.4]` stale-`updatedAt` rows (trivial frontmatter-date bumps) — watch over the next few digests whether `/iterate`'s throughput clears this batch without starving `[cross-links]`/`[content]` or the two unscored `[HIGH]` critique findings above.

## Today's intent

0 chunks are actually ready to pick — spec 11's only chunk is Held pending the `#1092` workflow-credential call above, so the next dispatcher tick has no plan work to build until that's resolved. Absent that, the AUDIT queue's top mechanical picks are the 98 `[seo] [5.4]` stale-`updatedAt` rows (trivial one-line frontmatter bumps, including tonight's fresh one), then the 26 `[cross-links] [4.5]` rows, then the 9 `[content] [3.6]` rows (numeric-citation mismatches + present-tense group-buy copy), then critique's two unscored `[HIGH]` findings (the `/trends/tracker` Sleeper/Faller mismatch and the `/group-buys` "active buys" lede contradiction — neither has a filed issue, both worth a deliberate pick even though the AUDIT queue's raw scores would bury them under the stale-`updatedAt` batch), then the smaller legacy rows (`[a11y] [3.5]` contrast sweep, `[seo]`/`[data]`/`[content] [2.0]`-`[2.7]` hero-art/favicon drift, `[engineering]` row).

## Tuning proposals

None new tonight. Everything in tonight's pulse points at execution gaps, not gate mistuning: a fully green breadth check (8/8 verify legs plus the full-sample nightly e2e, 1770/1770), all four content-consistency write scripts clean (one new, expected stale-`updatedAt` row from tonight's own fresh article), zero failed ticks across the window's three runs (including the one that discarded its own work cleanly rather than half-committing), no motion stall, and the credential/permission picture is now the dominant blocker — both `#1068` (gh auth for triage/critique checks) and the new `#1092` (workflow-file push permission) are repo-secret decisions the loop correctly routed to `/oversight` rather than attempting to work around. The two standing `pulse.mjs` undercount candidates (`pendingSection()`, score 4.0, filed 2026-11-09; held-counter, score 3.2, filed 2026-11-16) are unchanged and still unpromoted — not re-scored.
