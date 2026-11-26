# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Spec 12 closed out clean (chunks 12.2 + 12.3 both shipped), the aged-promotion valve handed the loop a new spec (13, ItemList JSON-LD parity check, 7 chunks, veto until 2026-11-27), and a full content-gap cycle ran unattended end to end — survey found a gap, filed it, opened issue #1098, drafted and shipped the news article, closed the issue, and regenerated manifests, all in one 29-minute dispatch chain.** Since the last digest (`e2abe0b3`, 2026-11-25T20:13:52Z): cloud `march` fired four times across three dispatch windows — 22:55→00:06 UTC (chunk 12.2: `heading-semantics-coverage-check.mjs` unit tests + live-corpus gate, closed, settled, one same-tick archive-SHA fix), 04:41→04:57 UTC (depth promotion — the Pending cap's oldest surviving candidate, "ItemList JSON-LD parity check," auto-promoted to spec 13), and 14:41→15:10 UTC (content-gap chain: finding filed → issue #1098 opened → article drafted and shipped → finding addressed → manifests regenerated). All four runs `success`, zero no-ops, zero failures, zero reverts. Tonight's own breadth pass is fully green: `pnpm verify` run as eight sequential foreground legs — typecheck, lint, `test:run` (1338 tests: 931 web + 167 content + 156 data + 46 seo + 32 ui + 6 e2e-unit), `test:scripts` (510/510), `data:validate` (97 records, cross-refs resolve), `build` (126 articles), `size` (6/6 budgeted routes under budget) — plus `pnpm e2e` (1782/1782, 8.1m, every canonical URL; +4 URLs over last night from the new article). `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, and `truncation-call-site-check.mjs --write` came back fully clean. `content-fact-audit.mjs --write` found its 4 known mismatches already pending. `stale-updated-at-check.mjs --write` filed **one new row**: the new article's own `updatedAt` already predates tonight's content commit — a `[seo] [5.4]` row, same shape as the other 102 already queued. `heading-semantics-coverage-check.mjs --write` (now wired into the nightly chain per `d06a3ce1`) ran clean, confirming last night's a11y fix held. No new tuning proposal tonight — the two live candidates (SMOKE_SAMPLE wiring gap, stale-`updatedAt` batching gap) already cover what this pass would otherwise flag.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-25 20:13:52 | *(last digest committed, `e2abe0b3`)* | baseline |
| 2026-11-25 20:13 → 22:55 | *(no scheduled fire logged)* | **quiet** — ~2.7h gap, no error signal |
| 2026-11-25 22:55 → 23:29 | cloud `march` (scheduled) | **shipped** — chunk 12.2: `heading-semantics-coverage-check.mjs` unit tests + live-corpus regression gate (`7a8905d4`→`e111bdec`), closed and settled |
| 2026-11-25 23:29 → 2026-11-26 00:06 | cloud `march` (chained) | **shipped** — archive-SHA fix (`484c47a4`), skill wiring (`d06a3ce1`: heading-semantics check now runs via march + digest), chunk 12.3 closed + settled (`0c703f71`, `96d2d1a9`) — spec 12 fully done |
| 2026-11-26 00:06 → 04:41 | *(no scheduled fire logged)* | **quiet** — ~4.6h gap, no error signal |
| 2026-11-26 04:41 → 04:58 | cloud `march` (scheduled) | **shipped** — depth promotion: oldest surviving candidate ("ItemList JSON-LD parity check," 104d old) auto-promoted to spec 13, veto until 2026-11-27 (`472d88e5`) |
| 2026-11-26 04:58 → 14:41 | *(no scheduled fire logged)* | **quiet** — ~9.7h gap, no error signal |
| 2026-11-26 14:41 → 15:10 | cloud `march` (chained) | **shipped** — content-gap chain: finding filed (`9c275269`), issue #1098 opened (`1dc0eccf`), news article drafted + shipped (`abc1e39c`), finding addressed + #1098 closed (`6f1714d8`), manifests regenerated (`789dd970`) |
| 2026-11-26 15:10 → (now) | night (this tick) | in progress |

Since the last digest: **12 commits shipped** across 4 cloud `march` runs (3 dispatch windows, all `success`, all shipped), 0 clean no-ops logged, 0 local owner commits, 1 new candidate auto-promoted to a spec (0 newly filed by `/expand` — no fire this window), 1 new `plan/AUDIT.md` row (tonight's `stale-updated-at-check` on the new article), 0 failed ticks, 0 reverts.

## Shipped

- `7a8905d4`→`e111bdec` — chunk 12.2: `heading-semantics-coverage-check.mjs` unit tests + live-corpus regression gate, closed and settled.
- `484c47a4` — archive-line SHA fix after a trailer rewrite (same-day correction, not a new chunk).
- `d06a3ce1` — `heading-semantics-coverage-check.mjs` wired into the `march` + `digest` breadth chains (this digest ran it as a result).
- `0c703f71`/`96d2d1a9` — chunk 12.3: wire `--write` into the survey chain + nightly digest, closed and settled — **spec 12 is now fully closed** (2 chunks, both shipped).
- `472d88e5` — depth promotion: aged-promotion valve auto-promoted candidate "ItemList JSON-LD parity check" (104d pending) to spec 13, veto window open until 2026-11-27.
- `9c275269`→`789dd970` — content-gap chain: `content-gap-survey.mjs` filed a finding, opened issue #1098, `content-curator` drafted and shipped the news article "The Paper80 x Whatever Studio group buy wrapped in April. Nobody wrote about it.", the finding was marked addressed and #1098 closed, manifests regenerated.
- Tonight's breadth pass: `pnpm verify` as 8 sequential foreground legs — typecheck, lint, `test:run` (1338 tests), `test:scripts` (510/510), `data:validate` (97 records), `build` (126 articles), `size` (6/6 under budget) — plus `pnpm e2e` (1782/1782, 8.1m, full canonical-URL crawl). `article-internal-consistency-check`, `group-buy-article-staleness-check`, `truncation-call-site-check`, and `heading-semantics-coverage-check` all ran `--write` clean. `content-fact-audit` found nothing new (4 known mismatches already pending). `stale-updated-at-check` filed 1 new row for the new article. `pnpm deploy:check` confirmed `READY` at HEAD (`789dd970`) before the pass began.

## Queues now

**plan:** 2 specs, 1 chunks left, 1 held — spec 11 (`11.1`, Held on `#1092` since 2026-11-21, max_age 14d, expires 2026-12-05) and spec 13 (ItemList JSON-LD parity check, 7 chunks, not yet broken into phase briefs, Held on its own veto window since 2026-11-26, max_age 1d, expires 2026-11-27, fallback: release). **No chunk is actually pickable today** — 11.1 waits on a credential call, 13 waits on its veto clock.
**audit:** 160 total unresolved rows by hand count — 2 under `## Pending` (`[needs-user-call]` `#1068`, `[user-issue #1092]`) + 158 under `## Open findings`: 103 `[seo]` (100 at `[5.4]` stale-`updatedAt`, including tonight's new row, + 3 legacy at `[2.7]`/`[2.0]`/`[1.8]`), 43 `[cross-links]` `[4.5]` (up 2 from the new article's unlinked pillar neighbors), 9 `[content]` `[~3.6]`, 1 `[a11y]` `[3.5]`, 1 `[data]` `[2.4]`, 1 `[engineering]`. Up 157→160 this window — all from tonight's breadth pass + the new article's own cross-link gaps.
**critique:** 14 pending, last pass ~29h ago (pass 22, 2026-11-25T14:30:33Z at `76b1b65e`). The standing `[HIGH]` `/trends/tracker` Sleeper/Faller magnitude mismatch (pass 16/19/21/22) is still open, still no GitHub issue.
**candidates:** 11 pending (3 `>21d`, oldest 104d — "Read-time visible-text regression guard," filed expand pass 322) — down from 12 this window: the prior oldest ("ItemList JSON-LD parity check") was promoted to spec 13, nothing newly filed. Under `Promote: aged`: `node scripts/plan/promote.mjs sweep` → **auto-promoted none, 0 awaiting** (spec 13's own veto line isn't due until 2026-11-27, nothing else in the Held lane). `node scripts/plan/promote.mjs cuts --since 2026-11-25` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` by that definition.
- **`[needs-user-call]` `#1068`** (GH_TOKEN/GITHUB_TOKEN invalid in `march.yml` run, masking triage/critique gh checks): opened 2026-11-07T01:52Z, now ~19.8d old — still open, still `triage:needs-user`, no owner comment yet. Locked (`issue-1068-credential-call`, since 2026-11-12, until owner comments or closes `#1068`, max_age 14d) — **lock hits its 14-day max_age today (2026-11-26).** This is the third digest to carry it; worth a direct owner look now that the clock has run out.
- **`user-issue #1092`** (cloud `march` failed 2026-11-20 — `ACTIONS_PAT` push to `.github/workflows/march.yml` rejected "without `workflows` permission"): opened 2026-11-21T00:11Z, now ~5.8d old, past the 24h SLA — still open, still `triage:needs-user`, no owner comment yet. Blocks chunk `11.1` via its Held line (since 2026-11-21, max_age 14d, expires 2026-12-05).
- **oversight needed: candidate queue silting (3 pending >21d, oldest 104d)** — the oldest-pending threshold (>45d) still trips even though the `>21d` count dropped to 3 (below the ≥5 trigger) after tonight's promotion. Standing condition, repeat observation from every digest since at least 2026-11-04; one aged candidate left the queue this window (promoted), but the mechanism itself (no cluster-drain path for old research-sourced candidates) hasn't changed.
- No motion-stalled alert — `pulse.mjs --motion` reports `shipped 13 / baseline 16.75 · 2026-W47 against 2026-W43..2026-W46 (7 so far in 2026-W48)`, `floor 8.38 · ok (50% of the baseline)`.
- No secrets-rotation note — `scripts/secrets.mjs audit` reports 0 events.
- **Standing item, unchanged:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch is still unaddressed, still has no GitHub issue filed, now a fourth pass (16/19/21/22) citing it.
- **Standing item, unchanged:** the AUDIT queue's `[seo] [5.4]` stale-`updatedAt` cluster is now 100 rows — the batching-gap candidate that would let `/iterate` drain them in one commit (score 5.6, filed 2026-11-21) is still unpromoted.

## Today's intent

No plan chunk is pickable today — `11.1` stays Held on the `#1068`/`#1092` credential questions (and `#1068`'s lock just hit its max_age), `13` stays Held on its own 1-day veto window until 2026-11-27. Absent plan work, the AUDIT queue's top mechanical picks: the 100 `[seo] [5.4]` stale-`updatedAt` rows, then the 43 `[cross-links] [4.5]` rows, then the 9 `[content] [~3.6]` rows, then critique's remaining unscored `[HIGH]` finding (the `/trends/tracker` Sleeper/Faller mismatch), then the smaller legacy rows (`[a11y] [3.5]` contrast sweep, `[seo]`/`[data]` `[1.8]`-`[2.7]` hero-art/favicon drift, `[engineering]` row).

## Tuning proposals

None. Both live mechanical-gap candidates already on file (SMOKE_SAMPLE wiring gap, scored 2026-11-23; stale-`updatedAt` batching-drain gap, scored 2026-11-21) still describe tonight's breadth pass accurately — no new mistuning observed.
