# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet, clean night — four cloud `march` ticks, all success, all shipped, zero no-ops.** 20:49→21:15 gave the `/trends/tracker` Sleeper summary card a neutral visual treatment (no more down-arrow + declining spark duplicating the Biggest Faller card next to it), closing critique pass 13's MED finding (`07846bf0`/`9a775ad5`, closes #1060). 00:33→00:57 filled `/compare/switch`'s empty pre-selection state with three deterministic suggested switch pairs, closing critique pass 12's MED finding (`c6df4f89`, closes #1061). 06:44→06:53 ran critique pass 15 (7 routes × 2 viewports, scripted walk): 0 new findings, but one severity bump — the `/group-buys` lede's SaaS-feature-bullet fragment, open since pass 12, got re-confirmed by this independent pass and bumped LOW→MED (`ce1fde7c`). 13:47→14:08 drained that bumped finding — the lede's second sentence now reads as editorial prose instead of a three-term fragment — plus a state-diet sweep compacting 2 Done rows older than 30 days (`cbc53b81`/`e937f8a0`). **This tick's own fresh `pnpm verify`, run as 8 sequential foreground legs per the cloud instructions, is fully green**: typecheck, lint, 1250 unit tests across all 6 workspaces (data 129, seo 44, ui 32, e2e 6, content 167, web 872), 269 script tests, `data:validate` (93 records, cross-refs resolve), a clean production build, `size` within budget, and 1348/1348 e2e against `next start :4173`. The build/test run regenerated the three `*.generated.json` manifests with only a `generatedAt` timestamp diff (the standing `[2.4]` AUDIT drift finding, reconfirmed live, not re-filed) — reverted before this commit since the digest commit is notes-only. `pnpm deploy:check` confirmed `READY` at HEAD (`e937f8a0`) going in.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-10-29 17:15 | *(last digest committed, `5ae44f75`)* | baseline |
| 20:49→21:15 | cloud march | **shipped** — tracker Sleeper card neutral treatment, closes critique pass 13's `[MED]` finding (`07846bf0`/`9a775ad5`, closes #1060) |
| 2026-10-30 00:33→00:57 | cloud march | **shipped** — `/compare/switch` empty state gets 3 suggested switch pairs, closes critique pass 12's `[MED]` finding (`c6df4f89`, closes #1061) |
| 06:44→06:53 | cloud march | **shipped** — critique pass 15: 0 new findings, 1 severity bump (0 high, 1 med, 0 low) (`ce1fde7c`) |
| 13:47→14:08 | cloud march | **shipped** — `/group-buys` lede rewrite drains the bumped finding + audit state-diet compact (`cbc53b81`/`e937f8a0`) |
| 14:08→ (now) | night (this tick) | in progress |

Since the last digest: **4 completed `march` runs, all `success`, all shipped** — no no-ops, no failures. Every commit in the window carries its `Cloud-Run:` trailer correctly.

## Shipped

1. **Tracker Sleeper card fix** — `pickSleeper` can land a declining row, which was rendering the same red down-arrow + declining spark as the adjacent Biggest Faller card; the Sleeper card now gets a neutral visual treatment regardless of direction, keeping the four summary cards visually distinct (`07846bf0`, audit closure `9a775ad5`, closes #1060)
2. **`/compare/switch` suggested pairs** — added `getSuggestedSwitchPairs` (deterministic, type-diverse pick of 3 switch pairs) and a `SuggestedSwitchPairs` component rendering them under the "take the quiz" link, filling the dead space in the empty pre-selection state with an immediate preview of the tool's output (`c6df4f89`, closes #1061)
3. **Critique pass 15** — scripted walk of 7 routes × 2 viewports: 0 new Pending rows, but the `/group-buys` lede voice nit (open since pass 12) got re-confirmed by an independent pass and a sibling-LEDE comparison across every other pillar page, bumping it LOW→MED (`ce1fde7c`)
4. **`/group-buys` lede rewrite** — the lede's second sentence ("Time-aware, region-aware, vendor-linked.") read as a SaaS feature-bullet fragment, inconsistent with the site's editorial voice; rewritten as a full descriptive sentence, draining pass 15's bumped finding (`cbc53b81`, closes #1063)
5. **Audit state diet** — `state.mjs compact` swept 2 Done rows older than 30 days out of `AUDIT.md` (git history keeps them) (`e937f8a0`)

## Queues now

**plan:** 1 spec, 0 chunks left, 0 held chunks — spec 01 (content-fact-vs-catalog numeric-spec audit) still sits in the roadmap's Held lane, auto-promoted, veto window open until 2026-10-30 (issue #1055); no chunks defined yet.
**audit:** 9 pending (4 `[needs-user-call]`, see Needs you). The other 5: standing sub-3.0 rows — two Mode Sonnet hero-art rows (`[2.7]`/`[2.0]`, need `brander` key-layout redraws), one plate-materials content-tension row (`[2.4]`, needs scout research), one generated-manifest-drift row (`[2.4]`, reconfirmed live by this tick's own `pnpm verify`), one orphaned-favicon row (`[1.8]`, trivial dedup) — all below the 3.0 autonomous-pick floor.
**critique:** 3 pending, last pass 10h ago (pass 15) — both `[MED]`-and-above rows from the prior two passes are now drained; the 3 remaining are `[LOW]` (duplicate "recently ended" phrasing, missing `/tools`+`/group-buys` hero illustrations) and the standing `[needs-user-call]` GA-beacon row.
**candidates:** 28 pending (25 `>21d`), oldest 138d. `Promote: aged`. Unchanged from the last digest (no `/expand` pass ran in this window) aside from the oldest row aging one more day.
**Support (fix-all):** 0 open user issues · first response none (1 opened in 7d) · close 750.7h mean (2 closed in 7d).
**Quota:** unknown — no cached `seven_day` reading.
**data/BACKLOG.md:** 0 pending (3 `## Pending` rows are all `[x]` — gateron-lanes, keychron vendor, and keychron-q1-he board data files all confirmed present on disk — bookkeeping gap, not live work; `/ship-data` would just move them to `## Done`).

## Needs you

- No `escalate #N` lines (0 open `triage:needs-user` issues) and no `triage:needs-user`/`loop:do` issues open at all — the one open issue right now is #1055, spec 01's own veto window.
- 6 standing `[needs-user-call]` rows, all unchanged tonight:
  - AUDIT `[3.6]` GTM analytics ships with no consent gate; `bearings.md` still documents the originally-planned cookieless Plausible tag.
  - AUDIT `[4.2]` `/article`/`/tag` soft-404 fix is structurally blocked (real-404 vs. "did you mean" UX are mutually exclusive under current routing).
  - AUDIT `[3.0]` mirrored `loop:opened` GitHub issues can go permanently un-drained if not picked the same tick they're filed.
  - AUDIT `[1.3]` default-state UI-component borders fail WCAG 1.4.11 non-text contrast — needs a global dark-theme lightness call.
  - CRITIQUE `[MED]` production GA `/g/collect` beacons returning 503 — analytics config sits outside the repo.
  - CANDIDATES `[score 6.5]` "Critique gate diagnostic" — still awaiting `/oversight` close or retitle.
- **oversight needed: candidate queue silting (25 pending >21d, oldest 138d)** — unchanged thresholds-tripped state from the last digest (both ≥5 pending >21d and oldest >45d still trip); no `/expand` pass ran in this window to move the needle.
- `Promote: aged` — `node scripts/plan/promote.mjs sweep`: auto-promoted none this sweep, 1 awaiting (spec 01's own veto window, issue #1055, open until 2026-10-30 — already landed by expand pass 441, not a fresh promotion this tick).
- No candidates cut by the pending cap since the last digest (`node scripts/plan/promote.mjs cuts --since 2026-10-30` → none).
- No motion-stalled alert — shipped 10 last full week vs. 6.25 baseline (floor 3.13, reads `ok`); 16 shipped so far this week (2026-W44).
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).

## Today's intent

No ready spec/chunk — spec 01 is still in its veto window (releases 2026-10-31) with 0 chunks defined, so `/plan-a-spec` is the actionable next step there once it clears, not `/ship-a-chunk`. Top finding for the next `/iterate`/`/march` pass: the queue has fully drained to sub-floor items — every open AUDIT row scores 1.8–2.7 (below the 3.0 autonomous-pick floor) and every remaining non-needs-user-call CRITIQUE row is `[LOW]`. Nothing above the pick floor exists right now; the next autonomous tick will most likely run a fresh general-purpose sweep (iterate failure-mode 6) or dispatch a mechanical survey/content-gap refill.

## Tuning proposals

None filed tonight. Every signal this pass points the same way: a fully green breadth check (8/8 legs, 1348/1348 e2e), no motion stall, no crash signal, four-for-four shipped cloud ticks since the last digest, and a candidate queue whose silting is already a tracked `oversight needed` line with no new movement this window (no `/expand` pass ran). Nothing in tonight's pulse suggests a gate, cadence, or ceiling needs retuning.
