# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A productive ~21-hour window: both standing specs (07 — group-buy article staleness gate, 08 — OG image render-verification gate) shipped end-to-end, closed, settled, and archived, the Held lane cleared (08's veto window released clean), critique pass 19 ran (0 new findings, 1 recurring tracker display mismatch bumped MED → HIGH after 3 unaddressed passes), and spec 07's own brand-new scanner caught 4 real stale group-buy articles on its first live nightly run.** Since the last digest (`47ae5bbd`, 2026-11-09 21:23 UTC): a scheduled tick (01:51→02:08) swept the Held lane clean (`#1072` released, no veto — spec 08 cleared), the next two chained ticks (02:08→03:38) chunked spec 07 and shipped its scanner (`c1867b13`, phase 43 — `group-buy-article-staleness-check.mjs`), closing and settling 07.1 by 04:21. A later tick (09:09→09:48, chained) wired that scanner into `skills/march.lanes.md`'s survey chain and this skill's own nightly breadth checks (settling 07.2 — spec 07 fully archived), then ran critique pass 19 (0 new findings; the standing `/trends/tracker` Sleeper/Faller display-mismatch row re-observed with a wider gap, bumped MED → HIGH in place). A ninth tick (09:48→10:05) chunked spec 08. After a quiet ~7h gap with no further scheduled `march` fires (unconfirmed cause — no error signal, deploy stayed `READY` throughout, and the gap lines up with the loop having nothing left in the plan to dispatch between chunk and build), two more chained ticks (17:26→18:43) built spec 08 across two phases — 08.1 the OG render-verification e2e spec (route derivation off the same enumeration `og-coverage-check.mjs` uses, PNG fetch, content-type/IHDR/byte-floor checks via a shared `assertOgPng` helper), 08.2 extracting that helper and adding two fixture regression tests (zero-byte buffer, wrong-dimension PNG) — closing and settling both, archiving spec 08. All 9 scheduled/chained ticks in this window **succeeded** — no crash signal, no failed run, no revert. **Tonight's own breadth pass is fully green**: `pnpm verify` run as 7 sequential foreground legs — typecheck, lint (1344 unit tests across 7 workspaces), 462 script tests, `data:validate` (95 records, cross-refs resolve), a clean production build, `size` within budget on every route (largest 147.6 KB vs 175 KB budget), and `e2e` (1730/1730 — up from 1400 last digest, the new OG render-verification spec's own coverage). A full-sample `SMOKE_SAMPLE=full pnpm e2e` nightly re-run also came back 1730/1730. `article-internal-consistency-check.mjs --write` found the corpus clean; `content-fact-audit.mjs --write` found nothing new (its 4 standing mismatches are all already filed). The one breadth leg that found something new is spec 07's own scanner, running live in the nightly chain for the first time: `group-buy-article-staleness-check.mjs --write` flagged 4 real present-tense buy-window articles against now-`closed` group-buy records (`cannonkeys-blaine-v2-se-group-buy`, `gmk-cyl-just-beachy-group-buy-opens`, `divinikey-gmk-cyl-orange-alert-group-buy`, `gmk-cyl-king-of-the-seas-group-buy`) — filed as 4 new `[content] [3.6]` AUDIT rows, the gate working exactly as designed on its first real night. `pnpm deploy:check` confirmed `READY` at HEAD (`1534cee6`) going in.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-09 21:23 | *(last digest committed, `47ae5bbd`)* | baseline |
| 2026-11-10 01:51 → 02:08 | cloud `march` (scheduled) | **shipped** — Held lane swept clean, spec 08's veto released (`#1072` closed, no veto) |
| 2026-11-10 02:08 → 03:38 | cloud `march` (chained, 2 ticks) | **shipped** — spec 07 chunked; phase 43 (`group-buy-article-staleness-check.mjs`) built, closed + settled as 07.1 |
| 2026-11-10 09:09 → 09:48 | cloud `march` (scheduled + chained) | **shipped** — spec 07.2 wired the new scanner into the march survey chain + digest breadth checks, settled (spec 07 archived); critique pass 19 ran (0 new findings, 1 duplicate bumped MED → HIGH) |
| 2026-11-10 09:48 → 10:05 | cloud `march` (chained) | **shipped** — spec 08 chunked |
| 2026-11-10 10:05 → 17:26 | *(no scheduled fire logged)* | **quiet** — ~7h gap, unconfirmed cause; no error signal in this window, deploy stayed `READY` |
| 2026-11-10 17:26 → 18:43 | cloud `march` (scheduled + chained) | **shipped** — spec 08 built across phases 08.1 (OG render-verification e2e spec) and 08.2 (`assertOgPng` helper extraction + fixture regression tests), both closed + settled, spec 08 archived |
| 2026-11-09 ~21:30 → (now) | night (this tick) | in progress |

Since the last digest: **14 commits shipped** (all cloud `march`), spanning 2 full specs built end-to-end and archived (07, 08), 1 Held veto released clean, and 1 critique pass. Zero failed ticks, zero reverts. Tonight's own breadth pass caught 4 fresh stale-content rows from spec 07's own scanner running live for the first time — filed, not blocking. See Headline.

## Shipped

- Spec 07 — group-buy article staleness gate: `group-buy-article-staleness-check.mjs` (phase 43) flags a companion article whose title/lede/early body still reads present-tense ("is live", "runs through <date>") after its linked group-buy record's status flips to `closed`/`cancelled`; `delayed` records stay exempt. Wired into `skills/march.lanes.md`'s survey chain and this skill's nightly breadth checks. Spec fully archived (`plan/bearings.md` now carries it as a standing decision).
- Spec 08 — OG image render-verification gate: `apps/e2e/tests/og-render-check.spec.ts` fetches the real rendered PNG through the booted production server for every canonical route with an `opengraph-image.tsx`, checked via a shared `assertOgPng` helper (content-type, `IHDR` 1200×630, byte floor) — two fixture tests prove it rejects the historical "0-byte PNG" failure shape. Runs inside the existing hermetic e2e leg, no new `pnpm verify` leg. Spec fully archived.
- Held lane swept clean: spec 08's 1-day veto window released with no veto (`#1072` closed); the stale heartbeat-flatline alarm (`#1074`) also auto-closed itself 3 minutes after opening.
- Critique pass 19: 0 new findings (7 routes × 2 viewports walked). The standing `/trends/tracker` "Biggest Faller" vs. "Sleeper" display-mismatch finding (pass 16) was re-observed with a wider gap against `data/trends/2026-W46.json` and bumped MED → HIGH in place rather than filed as a new row — now unaddressed across 3 passes.
- Tonight's breadth pass: `group-buy-article-staleness-check.mjs --write`, running live in the nightly chain for the first time, filed 4 new `[content] [3.6]` AUDIT rows — all 4 are mechanical one-phrase rewrites (`cannonkeys-blaine-v2-se-group-buy`, `gmk-cyl-just-beachy-group-buy-opens`, `divinikey-gmk-cyl-orange-alert-group-buy`, `gmk-cyl-king-of-the-seas-group-buy`).
- `#1068` (not yet fixed, unchanged): `GH_TOKEN`/`GITHUB_TOKEN` 401 in march runs; `DEFAULT_WORKFLOW_TOKEN` still the working fallback. Still open, `triage:needs-user`, ~89h old, well under `escalate_days` (7d).

## Queues now

**plan:** 0 specs, 0 chunks ready, 0 held — both 07 and 08 fully shipped and archived tonight; `plan/README.md`'s specs table is empty. Nothing for `/plan-a-spec` to pick up until `/expand` proposes and `/oversight` promotes a new candidate.
**audit:** 20 total unresolved rows by hand count (1 `[HIGH]` external-issue row in `## Pending` + 19 in `## Open findings`, up from 15 open findings at the last digest — net +4, all from tonight's group-buy staleness rows). **Note:** `node scripts/pulse.mjs` still misreports this as "1 pending" — the known `pendingSection()` bug (only counts the `## Pending` sub-section once `plan/AUDIT.md` carries a second heading), filed as a tuning candidate 2026-11-09, still unpromoted/unfixed. Do not trust `pulse.mjs`'s audit number until it's fixed.
**critique:** 8 pending, last pass 9h ago (pass 19) — 1 row bumped MED → HIGH in place tonight, count unchanged.
**candidates:** 9 pending (8 `>21d`, oldest 101d) — unchanged in composition from the last digest; just aged a day. `node scripts/plan/promote.mjs sweep` → `clean` (Held lane empty, nothing awaiting, nothing auto-promoted this sweep). `node scripts/plan/promote.mjs cuts --since 2026-11-09` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout (`night.yml` carries no cache-restore step for `.nexus/quota.json`) — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (3 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `#1068` (GH_TOKEN 401) is the only open `triage:needs-user` issue, filed 2026-11-07T01:52Z (~89h ago), still well under `escalate_days` (7d). Unchanged since the last digest.
- No standing `[needs-user-call]` rows — none open in `plan/CRITIQUE.md` or `plan/AUDIT.md`.
- **oversight needed: candidate queue silting (8 pending >21d, oldest 101d)** — both thresholds still trip (≥5 pending >21d, oldest >45d). Standing condition, repeat observation from every digest since at least 2026-11-04: no new evidence beyond the count ticking from 100d to 101d oldest.
- `Promote: aged` — `node scripts/plan/promote.mjs sweep`: Held lane is empty tonight (spec 08's veto was released this morning), so there's nothing to auto-promote or wait on. This is the first digest since at least 2026-11-04 with a fully clean Held lane.
- No motion-stalled alert — shipped 26 last full week vs. 10.25 baseline (floor 5.13, reads `ok`); 5 so far in the current week (2026-W46).
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).
- **New standing item for the next `/iterate` or `/oversight` pass:** critique's `/trends/tracker` Sleeper/Faller display-mismatch finding is now `[HIGH]` (bumped tonight, 3 passes unaddressed) and has no GitHub issue yet — worth a look before the next critique pass re-observes it a 4th time.
- **Watch item, not yet actionable:** a ~7h gap (10:05→17:26 UTC) with no scheduled `march` tick logged. No error signal accompanies it (deploy stayed `READY`, no quota-skip or crash-issue filed), and it lines up with the loop having nothing chunked to build in that window, but it's worth a second look if the gap recurs without an obvious explanation.

## Today's intent

No ready chunk right now — the plan is fully drained (0 specs, 0 held) after tonight's double-spec sweep. Until `/expand` proposes and `/oversight` promotes a new candidate, the next `/iterate` pass should prioritize: critique's `[HIGH]` `/trends/tracker` Sleeper/Faller display-mismatch (highest-scoring open finding, no issue filed yet); then the 4 fresh `[content] [3.6]` group-buy staleness rows (each a one-phrase past-tense rewrite). Behind those: the standing 4 `[content] [3.6]` numeric-citation mismatches, the `[cross-links] [4.5]` MM Studio ↔ Blaine V2 SE row and its 4 hall-effect siblings, the 2 stale `[seo]` Mode Sonnet hero-art rows, the `[data] [2.4]` generated-manifest drift, the `[seo] [1.8]` duplicate favicon, and the `[a11y] [3.5]` `ring-accent-mu` contrast sweep (74 files, 4 already fixed).

## Tuning proposals

None new tonight. The standing proposal (`pulse.mjs`'s `pendingSection()` undercounting `plan/AUDIT.md`, filed 2026-11-09) remains unpromoted and unfixed — still the right read on tonight's numbers (hand-counted 20 unresolved AUDIT rows against pulse's reported "1 pending"). Everything else in tonight's pulse points the other way: a fully green breadth check (7/7 verify legs plus the full-sample nightly e2e re-run, 1730/1730 twice), a clean consistency-checker run, no crash signal across 9 successful ticks, no motion stall, a now-empty Held lane, and the one standing credential bug (`#1068`) unchanged and non-blocking.
