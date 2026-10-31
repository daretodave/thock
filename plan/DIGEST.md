# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A productive, clean night — eight cloud `march` ticks since the last digest, seven shipping, one a no-op, zero failures.** The headline arc is spec 01 (content-fact-vs-catalog numeric-spec audit): its veto window closed clean (`a93d8767`, issue #1055 auto-closed), it got chunked into 5 pieces (`8757fb7a`), and 3 of those 5 shipped tonight — `scripts/content-fact-audit.mjs` now catches switch spring-weight citation drift (chunk 01.1, `5ef79f34`), tracker-score citation drift (chunk 01.2, `2605b1ec`), and "N weeks ago"/streak-length citation drift (chunk 01.3, `b54d4c02`/`7ec6e52c`), each calibrated against the live corpus to drive false positives to zero before filing anything. Two chunks remain — 01.4 (wire into the refill chain + digest) and 01.5 (a live-corpus spot-check) — so the script exists but isn't filing AUDIT rows yet. In between, `/expand` ran passes 443–444 (0 candidates filed, 10 cut total — the Pending queue drops from 28 to 18), and critique pass 16 walked 7 routes × 2 viewports via the cloud-compatible `ui-walk.mjs` CDP walker, filing 2 fresh `[MED]` rows (tracker summary-card number mismatch, `/quiz/switch` missing kicker/breadcrumb). **This tick's own fresh `pnpm verify`, run as 8 sequential foreground legs per the cloud instructions, is fully green**: typecheck, lint, 1250 unit tests across all 6 workspaces (data 129, seo 44, ui 32, e2e 6, content 167, web 872), 375 script tests, `data:validate` (93 records, cross-refs resolve), a clean production build, `size` within budget on every route, and 1348/1348 e2e against `next start :4173`. The nightly breadth leg (`SMOKE_SAMPLE=full pnpm e2e`, every canonical URL rather than the per-commit sample) is also fully green at 1348/1348 — no HIGH AUDIT row to file tonight. `pnpm deploy:check` confirmed `READY` at HEAD (`b7de82b7`) going in.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-10-30 17:02 | *(last digest committed, `c2e6ca2b`)* | baseline |
| 18:57→19:15 | cloud march | **shipped** — `/expand` pass 443: 0 candidates filed, 5 cut (`1d304290`) |
| 22:49→23:08 | cloud march | **shipped** — `/expand` pass 444: 0 candidates filed, 5 cut (`04ed7462`) |
| 2026-10-31 01:57→02:15 | cloud march | **shipped** — spec 01 veto sweep released (issue #1055 closed) + chunked into 5 pieces (`a93d8767`/`8757fb7a`) |
| 02:15→03:01 | cloud march | **shipped** — chunk 01.1: switch spring-weight numeric citation check (`5ef79f34`) |
| 03:01→04:09 | cloud march | **shipped** — chunk 01.2: tracker-score citation check (`2605b1ec`) |
| 04:09→04:29 | cloud march | **shipped** — critique pass 16: 7 routes × 2 viewports, 2 new `[MED]` findings (`3244ed2a`) |
| 08:10→09:02 | cloud march | **shipped** — chunk 01.3: "N weeks ago"/streak-length citation check + unit/wiring tests (`b54d4c02`/`7ec6e52c`) |
| 14:58→14:59 | cloud march | **no-op** — nothing above the pick floor; no chunk claimed |
| 15:xx→ (now) | night (this tick) | in progress |

Since the last digest: **7 of 8 `march` runs shipped, 1 no-op, 0 failures.** Every commit in the window carries its `Cloud-Run:` trailer correctly.

## Shipped

1. **Spec 01 veto sweep + chunking** — the aged auto-promotion (issue #1055) cleared its veto window with no objection; spec 01 released from the Held lane and chunked into 5 pieces (3 M, 2 S) covering acceptance criteria A1–A5 (`a93d8767`, `8757fb7a`)
2. **Chunk 01.1 — switch numeric citation check** — `scripts/content-fact-audit.mjs` scans article bodies for `<N>g`/`<N> gram` spring-weight citations near a switch mention and diffs against `data/switches/<slug>.json`'s `springGrams`; sentence-scoped attribution avoids misattributing a trailing citation to the next sentence's subject (`5ef79f34`)
3. **Chunk 01.2 — tracker-score citation check** — extends the same script to `W\d\d` tracker-week citations in articles and newsletters, resolving the cited `data/trends/<week>.json` row and diffing against `rows[].score`; calibrated against the full live corpus first to drive false positives to zero (`2605b1ec`)
4. **Critique pass 16** — scripted walk of 7 routes × 2 viewports via `ui-walk.mjs` (CDP, no Chrome MCP needed on the cloud runner): filed `[MED]` /trends/tracker (Biggest Faller/Sleeper cards rank by one criterion, display an unrelated number) and `[MED]` /quiz/switch (no eyebrow kicker or Tools breadcrumb, unlike every sibling tool page) (`3244ed2a`)
5. **Chunk 01.3 — "N weeks ago"/streak-length citation check** — the third numeric-citation sub-shape, plus colocated unit + wiring tests (`b54d4c02`, `7ec6e52c`)
6. **`/expand` passes 443–444** — 0 new candidates filed either pass (every signal re-confirmed already-tracked), 5 Pending rows cut by the pending-cap sweep each pass (`1d304290`, `04ed7462`)

## Queues now

**plan:** 1 spec, 2 chunks left, 0 held — spec 01 is out of the Held lane and 3/5 chunks shipped (01.1–01.3, the content-fact-audit script itself); 01.4 (wire into the refill chain + digest) and 01.5 (live-corpus spot-check) remain, so the script exists but has filed no AUDIT rows yet. Next ready: 01.4.
**audit:** 9 pending (4 `[needs-user-call]`, see Needs you). The other 5: standing sub-3.0 rows — two Mode Sonnet hero-art rows (`[2.7]`/`[2.0]`, need `brander` key-layout redraws), one plate-materials content-tension row (`[2.4]`, needs scout research), one generated-manifest-drift row (`[2.4]`), one orphaned-favicon row (`[1.8]`, trivial dedup) — all below the 3.0 autonomous-pick floor, unchanged shape from the last digest.
**critique:** 5 pending, last pass 16 ~12h ago. 2 new `[MED]` (tracker summary-card number mismatch; `/quiz/switch` missing kicker/breadcrumb), 2 standing `[LOW]` (`/group-buys` "recently ended" said twice; `/tools`+`/group-buys` heroes have no illustration), 1 standing `[needs-user-call]` (GA beacon 503).
**candidates:** 18 pending (15 `>21d`), oldest 139d. `Promote: aged`. Down from 28 (25 `>21d`) at the last digest — the two `/expand` passes this window cut 10 Pending rows (5 each) at the pending-cap floor.
**Support (fix-all):** 0 open user issues · first response none (1 opened in 7d) · close 750.7h mean (2 closed in 7d). Unchanged from the last digest.
**Quota:** unknown — no cached `seven_day` reading.
**data/BACKLOG.md:** 0 pending.

## Needs you

- No `escalate #N` lines (0 open `triage:needs-user` issues) — in fact 0 open GitHub issues at all right now; #1055 (spec 01's veto window) closed cleanly this window.
- 6 standing `[needs-user-call]` rows, all unchanged tonight:
  - AUDIT `[3.6]` GTM analytics ships with no consent gate; `bearings.md` still documents the originally-planned cookieless Plausible tag.
  - AUDIT `[4.2]` `/article`/`/tag` soft-404 fix is structurally blocked (real-404 vs. "did you mean" UX are mutually exclusive under current routing).
  - AUDIT `[3.0]` mirrored `loop:opened` GitHub issues can go permanently un-drained if not picked the same tick they're filed.
  - AUDIT `[1.3]` default-state UI-component borders fail WCAG 1.4.11 non-text contrast — needs a global dark-theme lightness call.
  - CRITIQUE `[MED]` production GA `/g/collect` beacons returning 503 — analytics config sits outside the repo.
  - CANDIDATES `[score 6.5]` "Critique gate diagnostic" — still awaiting `/oversight` close or retitle, and the evidence for closing it is now stronger: this candidate's own text (updated expand pass 218) claims cloud mode "categorically skips `/critique`" because the reader sub-agent needs Chrome, and `.github/CLOUD_LOOP.md:266` still says the same ("Will not run `/critique`. Reader sub-agent needs Chrome"). But critique passes 11, 12, 13, 15, and now 16 have all shipped as cloud `march` ticks (each commit carries a `Cloud-Run:` trailer) via a scripted `ui-walk.mjs` CDP walker that needs no Chrome MCP — the exact substitute option (b) the candidate proposed as future-scoped work has, in effect, already been built and is running. The diagnosis text and `CLOUD_LOOP.md`'s line 266 are stale against observed behavior; recommend `/oversight` close this candidate and correct `CLOUD_LOOP.md` rather than leave both standing.
- **oversight needed: candidate queue silting (15 pending >21d, oldest 139d)** — both thresholds still trip (≥5 pending >21d, oldest >45d), though the count improved from 25 to 15 this window via the pending-cap cuts below.
- `Promote: aged` — `node scripts/plan/promote.mjs sweep`: auto-promoted none this sweep, 0 awaiting.
- Candidates cut by the pending cap since the last digest (`node scripts/plan/promote.mjs cuts --since 2026-10-30` → 10):
  - cut 2026-10-30 [score 5.5] `/compare/keycap-set` — keycap-set side-by-side comparison
  - cut 2026-10-30 [score 5.5] Parts catalog third data pass
  - cut 2026-10-30 [score 5.5] ship-data entity-arrival mentionedParts rescan
  - cut 2026-10-30 [score 5.5] Cloud loop cannot push `.github/workflows/*.yml` changes
  - cut 2026-10-30 [score 5.5] Overlay/drawer keyboard-trap coverage check
  - cut 2026-10-30 [score 5.5] heartbeat.yml's flatline alarm measures "last completed" not "last successful"
  - cut 2026-10-30 [score 5.5] Asset-hygiene AUDIT rows tagged `next: /ship-asset` have no dispatch path
  - cut 2026-10-30 [score 6] march.yml crash-issue gate never fires when the action itself fails
  - cut 2026-10-30 [score 6] Automated external-link-rot survey
  - cut 2026-10-30 [score 6] Automated `/tools` blurb-accuracy check
- No motion-stalled alert — shipped 10 last full week vs. 6.25 baseline (floor 3.13, reads `ok`); 19 shipped so far this week (2026-W44).
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).

## Today's intent

Next ready chunk: **01.4** (wire `content-fact-audit.mjs` into the refill chain + digest, S, closes A4, needs nothing) — the next `/march`/`/ship-a-chunk` tick ships it. Top finding for the next `/iterate` pass once the phase queue clears: critique pass 16's 2 fresh `[MED]` rows (tracker summary-card ranking-vs-display mismatch; `/quiz/switch` missing kicker/breadcrumb) are both drainable now. Everything else in the queue — all 9 AUDIT rows, all 4 remaining CRITIQUE rows beyond the fresh two — sits below the 3.0 pick floor or is `[needs-user-call]`.

## Tuning proposals

None filed tonight as new candidates — the one mistuning this pass surfaced is a correction to existing text, not a new gate/cadence/ceiling issue, and is already covered above (Needs you: the "Critique gate diagnostic" candidate and `CLOUD_LOOP.md` line 266 are stale against 5 successful cloud-mode critique passes). Every other signal points the same way: a fully green breadth check (8/8 verify legs, 1348/1348 nightly e2e), no motion stall, no crash signal, 7-of-8 shipped cloud ticks since the last digest, and the candidate queue visibly draining (28→18 pending) under the existing `Promote: aged` + pending-cap mechanism rather than silting further. Nothing in tonight's pulse suggests a gate, cadence, or ceiling needs retuning.
