# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The standing `[HIGH]` critique finding that had carried across four consecutive digests — `/trends/tracker`'s Sleeper card showing a signed negative delta that read as a second Faller — is fixed and closed.** `c9f02e4b` dropped the Sleeper card's signed delta display (resolving both the HIGH magnitude-mismatch finding open since pass 16 and a MED duplicate-framing finding in the same commit); `32425c04` updated the critique log and AUDIT.md and closed issue `#1101`. Since the last digest (`166fbed4`, 2026-11-26T19:59:06Z): cloud `march` fired three times across three dispatch windows — 23:27→23:48 UTC (expand pass 447: no new candidates, auto-promoted the next-oldest eligible one, "Read-time visible-text regression guard," to spec 14, veto until 2026-11-27, issue `#1099`), 06:32→06:58 UTC (newsletter cadence row filed for issue 016 due, the tracker Sleeper fix, the critique-findings-addressed/close-`#1101` commit, and — separately, the loop's own Step 0 lock sweep — issue `#1100` opened because `#1068`'s lock ran past its 14-day `max_age` with no `fallback:` set), and 17:11→17:19 UTC (critique pass 23: 2 new findings, 0 HIGH). All three runs `success`, zero no-ops, zero failures, zero reverts. Tonight's own breadth pass is fully green: `pnpm verify` run as eight sequential foreground legs — typecheck, lint, `test:run` (1356 tests: 938 web + 167 content + 156 data + 46 seo + 32 ui + 11 tokens + 6 e2e-unit), `test:scripts` (510/510), `data:validate` (97 records, cross-refs resolve), `build` (126 articles), `size` (6/6 budgeted routes under budget) — plus `pnpm e2e` (1782/1782, 7.9m, every canonical URL; the per-commit run already crawls the full set, per the still-unpromoted `SMOKE_SAMPLE` candidate). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, `stale-updated-at-check.mjs --write`, `truncation-call-site-check.mjs --write`, and `heading-semantics-coverage-check.mjs --write` all came back clean or found only already-pending mismatches — nothing new filed tonight. No new tuning proposal: the two live mechanical-gap candidates (SMOKE_SAMPLE wiring gap, stale-`updatedAt` batching gap) still describe what this pass would otherwise flag.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-26 19:59:06 | *(last digest committed, `166fbed4`)* | baseline |
| 2026-11-26 19:59 → 23:27 | *(no scheduled fire logged)* | **quiet** — ~3.5h gap, no error signal |
| 2026-11-26 23:27 → 23:48 | cloud `march` (scheduled) | **shipped** — expand pass 447: no new candidates, auto-promoted "Read-time visible-text regression guard" to spec 14, veto until 2026-11-27 (`f8a53882`) |
| 2026-11-26 23:48 → 2026-11-27 06:32 | *(no scheduled fire logged)* | **quiet** — ~6.7h gap, no error signal |
| 2026-11-27 06:32 → 06:58 | cloud `march` (scheduled) | **shipped** — newsletter cadence row filed (`2a50bd41`), tracker Sleeper fix (`c9f02e4b`), critique findings addressed + `#1101` closed (`32425c04`); also opened issue `#1100` (lock past `max_age` escalation for `#1068`) |
| 2026-11-27 06:58 → 17:11 | *(no scheduled fire logged)* | **quiet** — ~10.2h gap, no error signal |
| 2026-11-27 17:11 → 17:19 | cloud `march` (scheduled) | **shipped** — critique pass 23: 2 findings (0 high, 1 medium, 1 low) (`813c6c35`) |
| 2026-11-27 17:19 → (now) | night (this tick) | in progress |

Since the last digest: **5 commits shipped** across 3 cloud `march` runs (3 dispatch windows, all `success`, all shipped), 0 clean no-ops logged, 0 local owner commits, 1 candidate auto-promoted to a spec (spec 14, by `/expand` pass 447; 0 newly filed), 1 new `plan/AUDIT.md` row (tonight's newsletter cadence row — issue 16 due), 1 GitHub issue opened by the loop itself (`#1100`, lock-`max_age` escalation), 1 GitHub issue closed (`#1101`, the standing HIGH critique finding), 0 failed ticks, 0 reverts.

## Shipped

- `f8a53882` — expand pass 447: no new candidates proposed; auto-promoted the next-oldest eligible candidate ("Read-time visible-text regression guard," 104d pending) to spec 14 (9 chunks), veto window open until 2026-11-27 (issue `#1099`).
- `2a50bd41` — audit: `newsletter-gap-survey.mjs` filed a new `[newsletter] [4.0]` row — issue 016 due (7 days since issue 015).
- `c9f02e4b` — fix: `/trends/tracker`'s Sleeper summary card no longer shows a signed negative delta alongside its forced-neutral tone — resolves the standing `[HIGH]` Sleeper/Faller magnitude-mismatch finding (open since critique pass 16, carried across passes 19/21/22) and a `[MED]` duplicate-framing finding in the same commit.
- `32425c04` — audit: critique log + `plan/AUDIT.md` updated to mark both findings addressed; closed issue `#1101` citing the fix commit.
- `813c6c35` — critique pass 23 (reader sub-agent walk): 2 new findings — `[MED]` a recurring, unexplained dot artifact now confirmed on a third unrelated card component (severity bumped from LOW), and `[LOW]` a dense, self-referential Sleeper-methodology caption sentence. 0 HIGH.
- Tonight's breadth pass: `pnpm verify` as 8 sequential foreground legs — typecheck, lint, `test:run` (1356 tests), `test:scripts` (510/510), `data:validate` (97 records), `build` (126 articles), `size` (6/6 under budget) — plus `pnpm e2e` (1782/1782, 7.9m, full canonical-URL crawl). `content-fact-audit`, `article-internal-consistency-check`, `group-buy-article-staleness-check`, `stale-updated-at-check`, `truncation-call-site-check`, and `heading-semantics-coverage-check` all ran `--write`: every surfaced item was already pending in `plan/AUDIT.md`, nothing new filed. `pnpm deploy:check` confirmed `READY` at HEAD (`813c6c35`) before the pass began; 3 generated-manifest timestamp-only diffs from the `test:run`/`build` legs were discarded (not part of this notes-only commit).

## Queues now

**plan:** 3 specs, 1 chunks left, 1 held by `pulse.mjs`'s count — this undercounts: the held-line counter only matches the bold human-authored format (a known candidate, score 3.2, filed 2026-11-16), so it misses the two auto-promoted Held lines. The real picture is 3 Held lines: **11.1** (blocked on `#1092` since 2026-11-21, max_age 14d, expires 2026-12-05), **13** (ItemList JSON-LD parity check, 7 chunks, auto-promoted, veto until 2026-11-27, `#1097`), **14** (Read-time visible-text regression guard, 9 chunks, auto-promoted, veto until 2026-11-27, `#1099`) — both veto windows close **today**. **No chunk is actually pickable today.**
**audit:** 161 total unresolved rows by hand count — 2 under `## Pending` (`[needs-user-call]` `#1068`, `[user-issue #1092]`) + 159 under `## Open findings`: 103 `[seo]` (100 at `[5.4]` stale-`updatedAt` + 3 legacy at `[2.7]`/`[2.0]`/`[1.8]`), 43 `[cross-links]` `[4.5]`, 9 `[content]` (8 at `[3.6]` + 1 at `[2.4]`), 1 `[newsletter]` `[4.0]` (new — issue 016 due), 1 `[a11y]` `[3.5]`, 1 `[data]` `[2.4]`, 1 `[engineering]` `[3.6]`. Up 160→161 this window — the one new newsletter row; tonight's breadth pass found nothing new to add.
**critique:** 13 pending, last pass ~2h ago (pass 23, 2026-11-27T17:16:18Z at `32425c04`). The standing `[HIGH]` `/trends/tracker` Sleeper/Faller magnitude mismatch (carried across passes 16/19/21/22 in every prior digest) **is now closed** — addressed in `c9f02e4b`, closes `#1101`.
**candidates:** 10 pending (2 `>21d`, oldest 97d — "Catalog primary-source verification pass," filed expand pass 345) — down from 11 this window: the prior oldest ("Read-time visible-text regression guard," 104d) was promoted to spec 14, nothing newly filed. Under `Promote: aged`: `node scripts/plan/promote.mjs sweep` → **auto-promoted none, 2 awaiting** (specs 13 `#1097` and 14 `#1099`, both veto until 2026-11-27 — today). `node scripts/plan/promote.mjs cuts --since 2026-11-26` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` by that definition.
- **New today — `[needs-user-call]` escalation via `#1100`:** `#1068`'s lock (`issue-1068-credential-call`, since 2026-11-12, max_age 14d) ran past its window on 2026-11-26 with no `fallback:` set, so the loop's own Step 0 lock sweep opened issue `#1100` this morning (2026-11-27T06:33:58Z) to ask once, per the lock-timeout contract — it will comment there every 7 days until the lock is edited (removed, re-dated, or given a `fallback:`). The underlying question (`#1068` — GH_TOKEN/GITHUB_TOKEN credential strategy for `march.yml`) is now ~20.8d old, still open, still `triage:needs-user`, no owner comment yet. This is the fourth digest carrying this question — now directly escalated, worth a look.
- **`user-issue #1092`** (cloud `march` failed 2026-11-20 — `ACTIONS_PAT` push to `.github/workflows/march.yml` rejected "without `workflows` permission"): opened 2026-11-21T00:11Z, now ~6.8d old, past the 24h SLA — still open, still `triage:needs-user`, no owner comment yet. Blocks chunk `11.1` via its Held line (since 2026-11-21, max_age 14d, expires 2026-12-05).
- **oversight needed: candidate queue silting (2 pending >21d, oldest 97d)** — the oldest-pending threshold (>45d) still trips even though the `>21d` count dropped 3→2 after spec 14's promotion (still below the ≥5 trigger). Standing condition, repeat observation from every digest since at least 2026-11-04; the mechanism itself (no cluster-drain path for old research-sourced candidates) hasn't changed.
- No motion-stalled alert — `pulse.mjs --motion` reports `shipped 13 / baseline 16.75 · 2026-W47 against 2026-W43..2026-W46 (8 so far in 2026-W48)`, `floor 8.38 · ok (50% of the baseline)`.
- No secrets-rotation note — `scripts/secrets.mjs audit` reports 0 events.
- **Resolved this window, no longer standing:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch — flagged across four consecutive digests (passes 16/19/21/22) — fixed and closed (`c9f02e4b`/`32425c04`, closes `#1101`).
- **Standing item, unchanged:** the AUDIT queue's `[seo] [5.4]` stale-`updatedAt` cluster holds steady at 100 rows (no new ones tonight, none drained) — the batching-gap candidate that would let `/iterate` drain them in one commit (score 5.6, filed 2026-11-21) is still unpromoted.

## Today's intent

No plan chunk is pickable today — `11.1` stays Held on the `#1092` credential question, `13` and `14` both stay Held on their own veto windows, **both expiring today (2026-11-27)**: whichever of `#1097`/`#1099` stays open past today releases its spec for `/next`; a closed one vetoes it instead. Absent plan work, the AUDIT queue's top mechanical picks: the 100 `[seo] [5.4]` stale-`updatedAt` rows, then the 43 `[cross-links] [4.5]` rows, then today's new `[newsletter] [4.0]` row (issue 16 due — routes to `/ship-content`), then the 8 `[content] [3.6]` rows and the `[engineering] [3.6]` row, then the smaller legacy rows (`[a11y] [3.5]` contrast sweep, `[seo]`/`[data]` `[1.8]`-`[2.7]` hero-art/favicon drift). Critique's queue (13 pending) carries no HIGH item now — its top is pass 23's new `[MED]` recurring dot-artifact finding.

## Tuning proposals

None. Both live mechanical-gap candidates already on file (SMOKE_SAMPLE wiring gap, scored 2026-11-23; stale-`updatedAt` batching-drain gap, scored 2026-11-21) still describe tonight's breadth pass accurately — no new mistuning observed.
