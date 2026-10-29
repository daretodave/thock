# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet, clean night — five cloud `march` ticks, all success, all shipped, zero no-ops.** 16:56→17:20 corrected a stale `plan/CANDIDATES.md` metadata header (pass 441's own commit never updated its "Last pass" pointer, which was making march's Step 3c rate-limit window look open when it wasn't) (`09b222e8`). 21:31→21:51 drained all 6 `article-crosslink-survey.mjs` rows filed for "Gateron Ink" — one cross-link sentence per sibling pairing, plus a 1288-row `state.mjs compact` sweep of 30-day-old Done rows across AUDIT/CANDIDATES/CRITIQUE (`ade2eb04`/`3f16c84b`, closes #1058). 01:29→01:39 ran critique pass 14 (7 routes × 2 viewports): 1 low finding (`5c416c28`). 07:57→08:16 fixed that finding — the `/tools` "Find your switch" card and `/quiz/switch` lede described the same quiz with drifting framing; the quiz lede now echoes the more-accurate tools-card wording (`5dc60b24`/`b36e644c`, closes #1059). 15:02→15:12 ran expand pass 442: 0 new candidates (no 3+-instance cluster cleared the bar), 1 re-evidenced (`/tools` blurb-accuracy check, now a 5th confirmed instance, score 5.5→6.0), 5 stale rows cut to Rejected under the pending cap (`019c3962`). **This tick's own fresh `pnpm verify`, run as one foreground pass, is fully green**: typecheck, lint, unit tests, script tests, `data:validate`, a clean production build, `size` within budget, and 1346/1346 e2e against `next start :4173`. `pnpm deploy:check` confirmed `READY` at HEAD (`019c3962`) going in.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-10-28 17:00 | *(last digest committed, `884df5de`)* | baseline |
| 16:56→17:20 | cloud march | **shipped** — corrected stale `CANDIDATES.md` metadata header that was confusing march's own rate-limit check (`09b222e8`) |
| 21:31→21:51 | cloud march | **shipped** — cross-link drain: 6 pairs for "Gateron Ink" + audit closure + 1288-row state compact (`ade2eb04`/`3f16c84b`, closes #1058) |
| 2026-10-29 01:29→01:39 | cloud march | **shipped** — critique pass 14: 1 finding (0 high, 0 medium, 1 low) (`5c416c28`) |
| 07:57→08:16 | cloud march | **shipped** — fix: `/quiz/switch` lede echoes `/tools` card framing, closes pass-14 finding + audit closure (`5dc60b24`/`b36e644c`, closes #1059) |
| 15:02→15:12 | cloud march | **shipped** — expand pass 442: 0 filed, 1 re-evidenced, 5 cut (`019c3962`) |
| 16:56→ (now) | night (this tick) | in progress |

Since the last digest: **5 completed `march` runs, all `success`, all shipped** — no no-ops, no failures. Every commit in the window carries its `Cloud-Run:` trailer correctly.

## Shipped

1. **Plan metadata correction** — `CANDIDATES.md`'s "Last pass" header still pointed at pass 440's commit after pass 441 landed, making march's Step 3c cadence check read the rate-limit window as open when it wasn't; corrected to the real pass-441 state (`09b222e8`)
2. **Gateron Ink cross-link drain** — 6 `[4.5]` cross-link pairs filed against the new deep-dive, each closed with one prose sentence linking the sibling article; audit row ticked; `state.mjs compact --write` also swept 1288 Done rows older than 30 days from AUDIT/CANDIDATES/CRITIQUE (git history keeps them) (`ade2eb04`/`3f16c84b`, closes #1058)
3. **Critique pass 14** — scripted walk of 7 routes × 2 viewports, 1 low finding filed: `/tools` card and `/quiz/switch` lede described the same quiz with different framing (`5c416c28`)
4. **Voice-drift fix** — `/quiz/switch`'s lede now echoes the more-accurate `/tools` card wording (named dimensions, digit numerals) instead of its own looser framing, closing pass 14's finding (`5dc60b24`/`b36e644c`, closes #1059)
5. **Expand pass 442** — 0 new candidates (no fresh 3+-instance cluster), 1 re-evidenced (`/tools` blurb-accuracy check: 5th confirmed instance, score 5.5→6.0), 5 stale Pending rows (60+ days old) cut to Rejected under the pending cap (`019c3962`)

## Queues now

**plan:** 1 spec, 0 chunks left, 0 held chunks — spec 01 (content-fact-vs-catalog numeric-spec audit) sits in the roadmap's Held lane, auto-promoted, veto window open until 2026-10-30 (issue #1055); no chunks defined yet.
**audit:** 9 pending (4 `[needs-user-call]`, see Needs you). The other 5: standing sub-3.0 rows — two Mode Sonnet hero-art rows (`[2.7]`/`[2.0]`, need `brander` key-layout redraws), one plate-materials content-tension row (`[2.4]`, needs scout research), one generated-manifest-drift row (`[2.4]`), one orphaned-favicon row (`[1.8]`, trivial dedup) — all below the 3.0 autonomous-pick floor.
**critique:** 6 pending, last pass 15h ago (pass 14).
**candidates:** 28 pending (25 `>21d`), oldest 137d. `Promote: aged`. Down from 33 pending / 168d oldest at the last digest — pass 441's aged-promotion (spec 01) and 5 fresh cuts this pass both drained the queue.
**Support (fix-all):** 0 open user issues · first response none (1 opened in 7d) · close 750.7h mean (2 closed in 7d).
**Quota:** unknown — no cached `seven_day` reading.
**data/BACKLOG.md:** 0 pending (3 rows, all `[x]` already shipped).

## Needs you

- No `escalate #N` lines (0 open `triage:needs-user` issues) and no `triage:needs-user`/`loop:do` issues open at all — the one open issue right now is #1055, spec 01's own veto window.
- 6 standing `[needs-user-call]` rows, all unchanged tonight:
  - AUDIT `[3.6]` GTM analytics ships with no consent gate; `bearings.md` still documents the originally-planned cookieless Plausible tag.
  - AUDIT `[4.2]` `/article`/`/tag` soft-404 fix is structurally blocked (real-404 vs. "did you mean" UX are mutually exclusive under current routing).
  - AUDIT `[3.0]` mirrored `loop:opened` GitHub issues can go permanently un-drained if not picked the same tick they're filed.
  - AUDIT `[1.3]` default-state UI-component borders fail WCAG 1.4.11 non-text contrast — needs a global dark-theme lightness call.
  - CRITIQUE `[MED]` production GA `/g/collect` beacons returning 503 — analytics config sits outside the repo.
  - CANDIDATES `[score 6.5]` "Critique gate diagnostic" — still awaiting `/oversight` close or retitle.
- **oversight needed: candidate queue silting (25 pending >21d, oldest 137d)** — improved since the last digest (was 44/168d) but both thresholds (≥5 pending >21d, oldest >45d) are still tripped; `Promote: aged`'s sweep only acts on `Held` roadmap lines with an open issue, not directly on `CANDIDATES.md`'s own aging Pending rows.
- `Promote: aged` — `node scripts/plan/promote.mjs sweep`: auto-promoted none this sweep, 1 awaiting (spec 01's own veto window, issue #1055, open until 2026-10-30 — already landed by expand pass 441, not a fresh promotion this tick).
- Candidates cut by the pending cap since the last digest: `/expand` dispatch cadence watch item (score 3.6), Rolling-latest-window consistency check (5.0), Rank-vs-label sign-agreement coverage check (5.0), Dev-toolchain major migration (5.0), Vitest coverage CI gate (5.5) — all 2026-10-29, `node scripts/plan/promote.mjs cuts --since 2026-10-28`.
- No motion-stalled alert — shipped 10 last full week vs. 6.25 baseline (floor 3.13, reads `ok`); 13 shipped so far this week (2026-W44).
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).

## Today's intent

No ready spec/chunk — spec 01 is still in its veto window (releases 2026-10-30) with 0 chunks defined, so `/plan-a-spec` is the actionable next step there once it clears, not `/ship-a-chunk`. Top finding for the next `/iterate`/`/march` pass: all 5 open AUDIT rows remain below the 3.0 autonomous-pick floor, so the two `[MED]` CRITIQUE rows are the highest-severity open items — the Sleeper summary card reading as a second Biggest Faller, and `/compare/switch`'s empty pre-selection state having no preview or suggested pairs. Runner-up: the two parked `[2.7]`/`[2.0]` Mode Sonnet hero-art rows (`next: /ship-asset`), unchanged and still below the autonomous-pick floor.

## Tuning proposals

None filed tonight. Every signal this pass points the same way: a fully green breadth check (8/8 legs, 1346/1346 e2e), no motion stall, no crash signal, five-for-five shipped cloud ticks since the last digest, and a candidate queue whose silting is already a tracked `oversight needed` line and visibly draining (168d→137d oldest, 44→25 count `>21d`) rather than a fresh mistuning. Nothing in tonight's pulse suggests a gate, cadence, or ceiling needs retuning.
