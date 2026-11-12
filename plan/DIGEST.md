# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet, clean ~24.5-hour window: 2 pieces shipped end-to-end through the content-gap/newsletter dispatch cycle (newsletter "thock weekly — issue 14," news pillar's "The Gateron Magnetic Jade gets a sensing field — and the catalog gets its first one"), a research pass filed 2 new field candidates, 9 commits total, all 4 cloud `march` ticks in this window succeeded, and tonight's own breadth pass came back fully green with zero new findings.** Since the last digest (`385942a9`, 2026-11-11 18:22 UTC): a tick straddling the last digest (18:19→18:40) shipped nothing (no commits attributable — a quiet dispatch cycle); a tick six and a half hours later (01:15→01:36) opened content-gap issue `#1077` and shipped newsletter issue 14 in the same run; a tick roughly seven and a half hours after that (09:12→10:02) filed 2 new research candidates (Group-buy lifecycle status index, Recurring reader-questions column) and separately opened + built content-gap issue `#1078`, shipping the Gateron Magnetic Jade news article in the same run; a final tick (17:52→18:13) ran `/expand` pass 445 and found no new candidates — signal review noted the weekly auto-promotion cap (3/7d) is already reached, so the 8 long-aged pending candidates sit untouched by design, not neglect. Three quiet gaps (~6.6h, ~7.6h, ~7.8h) separate these ticks with no error signal — same standing pattern as prior digests: nothing left to dispatch between content-gap/newsletter cycles while the plan sits empty (0 specs, 0 chunks, 0 held). **Tonight's own breadth pass is fully green**: `pnpm verify` run as 8 sequential foreground legs — typecheck, lint, 1344 unit tests across 7 workspaces, 462 script tests, `data:validate` (95 records, cross-refs resolve), a clean production build, `size` within budget on every route (largest 147.6 KB vs 175 KB budget), and `e2e` (1750/1750, up from 1742 last digest — the 2 new articles' own route coverage). A full-sample `SMOKE_SAMPLE=full pnpm e2e` nightly re-run also came back 1750/1750. `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, and `group-buy-article-staleness-check.mjs --write` all ran clean — every mismatch each found was already filed, no new rows. `pnpm deploy:check` confirmed `READY` at HEAD (`69ee0e35`). (The verify run's own `build`/`test:run` legs regenerated the three `data-runtime`/`search` manifest files with a fresh `generatedAt` timestamp — discarded before this commit; that's the standing `[data] [2.4]` AUDIT row, not new drift.)

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-11 18:22 | *(last digest committed, `385942a9`)* | baseline |
| 2026-11-11 18:19 → 18:40 | cloud `march` (scheduled) | **quiet** — no commits attributable to this tick's window; straddles the last digest |
| 2026-11-11 18:40 → 2026-11-12 01:15 | *(no scheduled fire logged)* | **quiet** — ~6.6h gap, no error signal, deploy stayed `READY` |
| 2026-11-12 01:15 → 01:36 | cloud `march` (scheduled) | **shipped** — content-gap issue `#1077` opened and built in one tick: newsletter "thock weekly — issue 14" |
| 2026-11-12 01:36 → 09:12 | *(no scheduled fire logged)* | **quiet** — ~7.6h gap, no error signal |
| 2026-11-12 09:12 → 10:02 | cloud `march` (scheduled) | **shipped** — research pass filed 2 new candidates; content-gap issue `#1078` opened and built in the same tick: news pillar "The Gateron Magnetic Jade gets a sensing field…" |
| 2026-11-12 10:02 → 17:52 | *(no scheduled fire logged)* | **quiet** — ~7.8h gap, no error signal |
| 2026-11-12 17:52 → 18:13 | cloud `march` (scheduled) | **shipped** (dispatch-only) — `/expand` pass 445: no new candidates, weekly auto-promotion cap already reached |
| 2026-11-12 18:13 → (now) | night (this tick) | in progress |

Since the last digest: **9 commits shipped** (all cloud `march`), 2 full pieces end-to-end (1 newsletter, 1 news), 2 new research candidates filed, 0 Held lines, 0 critique passes. Zero failed ticks, zero reverts. Tonight's own breadth pass caught nothing new — see Headline.

## Shipped

- Newsletter: "thock weekly — issue 14" — content-gap dispatch `#1077`, opened and closed in the same tick (01:15→01:36). 5 pillar picks (guides, ideas, trends, news, deep-dives) + a 2026-W46 tracker check-in, ~420 words, 7 sections. No new AUDIT rows from this one.
- News pillar: "The Gateron Magnetic Jade gets a sensing field — and the catalog gets its first one" — content-gap dispatch `#1078`, opened and built in the same tick (09:12→10:02); catalog-record-as-news framing (~980 words, 3 InlineViz diagrams). No new AUDIT rows from this one either.
- `/expand` pass 445: no new candidates — signal review (A-H) found no new clustering; 11 Pending rows already cover the live patterns, Pending cap (15) not reached, aged promotion already at its weekly cap (3 auto-promotions in the last 7 days: 2026-11-06, -07, -08).
- Research pass (same 09:12→10:02 tick): filed 2 new field candidates — Group-buy lifecycle status index, Recurring reader-questions column — both `[score 6.0]`, proposed 2026-11-12.
- `#1068` (not yet fixed, unchanged): `GH_TOKEN`/`GITHUB_TOKEN` 401 in march runs; `DEFAULT_WORKFLOW_TOKEN` still the working fallback. Still open, `triage:needs-user`, ~137h old, well under `escalate_days` (7d).
- Tonight's breadth pass: `content-fact-audit.mjs --write` (4 standing numeric-citation mismatches, all already filed, no new rows), `article-internal-consistency-check.mjs --write` (corpus clean), `group-buy-article-staleness-check.mjs --write` (4 standing present-tense rows, all already filed, no new rows).

## Queues now

**plan:** 0 specs, 0 chunks ready, 0 held — `plan/README.md`'s specs table is empty. Nothing for `/plan-a-spec` to pick up until `/expand` proposes and `/oversight` promotes a new candidate.
**audit:** 23 total unresolved rows by hand count (1 `[HIGH]` external-issue row in `## Pending` + 22 in `## Open findings`) — unchanged from the last digest. **Note:** `node scripts/pulse.mjs` still misreports this as "1 pending" — the known `pendingSection()` bug, filed as a tuning candidate 2026-11-09, still unpromoted/unfixed. Do not trust `pulse.mjs`'s audit number until it's fixed.
**critique:** 8 pending, last pass 2d ago (pass 19, unchanged since the last digest — no new pass ran in this window).
**candidates:** 11 pending (8 `>21d`, oldest 103d) — up from 9 at the last digest (+2, this morning's research filing: Group-buy lifecycle status index, Recurring reader-questions column, both too fresh to count toward the `>21d` figure). `node scripts/plan/promote.mjs sweep` → `clean` (Held lane empty, nothing awaiting, nothing auto-promoted this sweep — the weekly cap of 3 auto-promotions/7d is already spent on 2026-11-06/-07/-08). `node scripts/plan/promote.mjs cuts --since 2026-11-11` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout (`night.yml` carries no cache-restore step for `.nexus/quota.json`) — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `#1068` (GH_TOKEN 401) is the only open `triage:needs-user` issue, filed 2026-11-07T01:52Z (~137h ago), still well under `escalate_days` (7d). Unchanged since the last digest.
- No standing `[needs-user-call]` rows — none open in `plan/CRITIQUE.md` or `plan/AUDIT.md`.
- **oversight needed: candidate queue silting (8 pending >21d, oldest 103d)** — both thresholds still trip (≥5 pending >21d, oldest >45d). Standing condition, repeat observation from every digest since at least 2026-11-04. New context tonight: the weekly auto-promotion cap (3/7d) is already spent for this window (2026-11-06/-07/-08), so these 8 won't drain further via `Promote: aged` until the cap window rolls over — if the silting is unwanted, raising the weekly cap (not just promoting individual rows) is the `/oversight` lever that actually moves this number.
- `Promote: aged` — `node scripts/plan/promote.mjs sweep`: Held lane is empty tonight, nothing to auto-promote or wait on; see the cap note above for why.
- No motion-stalled alert — shipped 26 last full week (2026-W45) vs. 10.25 baseline (floor 5.13, reads `ok`); 9 so far in the current week (2026-W46) as of this morning's pulse read.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).
- **Standing item, unchanged:** critique's `/trends/tracker` Sleeper/Faller display-mismatch finding is still `[HIGH]`, still unaddressed across 3 passes, and still has no GitHub issue filed. No critique pass ran in this window (last pass 2d ago), so it hasn't been re-observed a 4th time yet — worth fixing before that happens.
- **Watch item, recurring:** three more quiet gaps (~6.6h, ~7.6h, ~7.8h) with no scheduled `march` tick logged, same shape as prior digests' noted gaps. No error signal accompanies any of them (deploy stayed `READY` throughout), and all line up with the loop having nothing chunked to build between content-gap/newsletter dispatch cycles while the plan sits empty. Not actionable on its own, but now a 4-digest-running pattern worth a second look if it ever coincides with an error signal.

## Today's intent

No ready chunk right now — the plan is fully drained (0 specs, 0 held). Until `/expand` proposes and `/oversight` promotes a new candidate (next opportunity once the weekly auto-promotion cap rolls over), the next `/iterate` pass should prioritize: critique's `[HIGH]` `/trends/tracker` Sleeper/Faller display-mismatch (highest-scoring open finding, still no issue filed, 3 passes unaddressed); then the 3 `[cross-links] [4.5]` `aurora-glow-theme-build` rows and the 4 `[cross-links] [4.5]` `hall-effect-score-dips-wooting-ship-slips` siblings plus the `mm-studio-class80-discontinued` cross-link row (mechanical one-line prose additions). Behind those: the standing 4 `[content] [3.6]` present-tense group-buy rows, the 4 `[content] [3.6]` numeric-citation mismatches, the 2 stale `[seo]` hero-art rows (Mode Sonnet, CannonKeys Mode Sonnet R2), the `[data] [2.4]` generated-manifest drift, the `[seo] [1.8]` duplicate favicon, the `[content] [2.4]` plate-materials/Mode-flagship tension, and the `[a11y] [3.5]` `ring-accent-mu` contrast sweep (74 files, 4 already fixed).

## Tuning proposals

None new tonight. The standing proposal (`pulse.mjs`'s `pendingSection()` undercounting `plan/AUDIT.md`, filed 2026-11-09) remains unpromoted and unfixed — still the right read on tonight's numbers (hand-counted 23 unresolved AUDIT rows against pulse's reported "1 pending"). Everything else in tonight's pulse points the other way: a fully green breadth check (8/8 verify legs plus the full-sample nightly e2e re-run, 1750/1750 twice), all three content-consistency scripts clean, no crash signal across 4 successful ticks, no motion stall, a clean Held lane, and the one standing credential bug (`#1068`) unchanged and non-blocking. The candidate-queue-silting observation in "Needs you" above is a repeat of a standing condition, not a new mistuning — the mechanism (weekly auto-promotion cap) is working as designed, so the fix is an `/oversight` cap-width call, not a script bug to file.
