# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Busy, clean window — ten shipped `/iterate` fixes (one a real
root-cause engineering fix), one newsletter ship, four `/expand`
no-op passes, zero red legs.** Since yesterday's digest (`fe4c80f`),
the loop shipped: a vendor cross-link fix (`PartReference` now links
inline switch mentions to the vendor, `b69b3ca`); two SEO/JSON-LD
resolution fixes (part-page `brand.name` and tag-page title/JSON-LD
both now resolve the display name instead of the raw slug, `05d7f4b`
+ `8b17f57`); an a11y fix (visible focus ring on search/newsletter/404
inputs, `fd09f7c`); a fresh newsletter issue ("thock weekly — issue
003", `e271893`, closes #439) auto-filed by `newsletter-gap-survey.mjs`
and drained same-window; a data fix restoring the W28 tracker's
Prototypist + Wuque Studio vendor links (`f4d14aa`, closes #440); and,
notably, a **durable root-cause fix** to `tracker-linkage-survey.mjs`
(`14d19e8`, closes #441) — this was the third recurrence of the same
masked-detection bug (W22, W24/W26, W28), each prior time patched with
a one-off data edit; this tick rewrote the detection algorithm itself
to track linkage per contiguous non-flat run instead of "ever linked
across all history," with 3 new regression tests reproducing the exact
masking bug. Three more content-accuracy fixes rounded out the window:
past-tense group-buy titles on two articles (`d2eedf2`, closes #442),
false claims in the `/sources` intro copy about vendor sponsored links
and a missing citation index (`6111844`, closes #443), and a broken
self-closing `<Source>` tag on `sound-dampening-compared` that rendered
an empty, invisible link (`4cc57d7`, closes #444). Four `/expand`
passes (171-174) filed 0 new candidates — the 13-row
`plan/PHASE_CANDIDATES.md` queue is unchanged, still awaiting
`/oversight` promotion (last oversight: **49 days ago**, 2026-05-23).
Full breadth `pnpm verify` is green top to bottom, run fresh this tick
as sequential foreground legs (981/981 e2e, homepage bundle flat at
108.5 KB / 200 KB). Deploy is `READY` at HEAD (`0e9f1a7`).
`plan/CRITIQUE.md` is now **61 days / 1261 commits** since its last
pass — unchanged diagnosis, still the standing item to resolve. New
since yesterday: a fresh GitHub issue (`#434`, `triage:needs-user`) —
Vercel silently dropped the webhook/ingestion for commit `e312e09`
(three consecutive `deploy:check` timeouts before the *next* commit
deployed normally); flagged in Needs you.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-10 13:06 | iterate | `PartReference` — link inline switch mentions to the vendor (`b69b3ca`) |
| 07-10 13:55 | expand | pass 171 — no candidates |
| 07-10 17:10 | iterate | a11y — search/newsletter/404 inputs visible focus ring (`fd09f7c`) |
| 07-10 17:50 | iterate | seo — part JSON-LD `brand.name` resolves vendor name, not raw slug (`05d7f4b`), audit `9fe1d6f` |
| 07-10 21:31 | expand | pass 172 — no candidates |
| 07-10 23:39-23:40 | iterate | seo — tag page title/JSON-LD resolves display name, not raw slug (`8b17f57`), audit `373ec96` |
| 07-11 00:34-00:37 | march | newsletter cadence row auto-filed (`900273e`); dispatch opened issue #439 (`b54554b`) |
| 07-11 00:49-00:50 | march | content: newsletter — "thock weekly — issue 003" (`e271893`), closes #439 |
| 07-11 01:53 | iterate | data — W28 tracker: restore Prototypist + Wuque Studio vendor link (`f4d14aa`), closes #440 |
| 07-11 03:18-03:19 | iterate | fix — `tracker-linkage-survey.mjs` durable per-run-linkage rewrite (`14d19e8`), closes #441 |
| 07-11 05:20 | iterate | content — mode-sonnet-r2 + gsk-sweet-nightmare past-tense group-buy titles (`d2eedf2`), closes #442 |
| 07-11 06:57 | expand | pass 173 — no candidates |
| 07-11 07:51 | expand | pass 174 — no candidates |
| 07-11 08:55 | iterate | content — `/sources` intro copy fix (`6111844`), closes #443 |
| 07-11 09:52-09:53 | iterate | content — sound-dampening-compared broken `<Source>` tag fix (`4cc57d7`), closes #444 |

24 commits total in the window; every `march`-workflow run in the last
30 (going back to 07-09 22:31) reports `success` at the GitHub Actions
level.

## Shipped

- **fix**: `PartReference` now links inline switch mentions to the
  vendor. Closes no tracked issue (direct `/iterate` fix).
- **a11y**: `search`/`newsletter`/`404` inputs gained a visible focus
  ring — same WCAG 2.4.7 class as prior focus-ring fixes, different
  component surface.
- **seo**: part-page JSON-LD `brand.name` and tag-page title/JSON-LD
  both resolved the raw slug instead of the display name — two
  separate one-line fixes, same bug shape, different routes.
- **content**: "thock weekly — issue 003" — auto-filed by
  `newsletter-gap-survey.mjs`, drained same-window. Closes #439.
- **data**: W28 tracker — restored Prototypist + Wuque Studio
  `vendor-first-customs` links. Third recurrence of the same
  `tracker-linkage-survey.mjs` masking bug (W22, W24/W26, W28). Closes
  #440.
- **engineering**: `tracker-linkage-survey.mjs` rewritten to track
  linkage per contiguous non-flat run instead of "ever linked across
  all history" — the root-cause fix for the bug class above, with 3
  new regression tests reproducing the exact masking scenario. Closes
  #441. This is the shape of fix `/digest` exists to surface: three
  data patches for the same symptom before the mechanism itself got
  fixed.
- **content**: two stale present-tense group-buy titles corrected to
  past tense (`mode-sonnet-r2-group-buy-coverage`,
  `gsk-sweet-nightmare-group-buy`) — the frontmatter-title variant of a
  known bug class the body-text gate can't see. Closes #442.
- **content**: `/sources` intro copy corrected two false claims (vendor
  links are not auto-flagged `rel="sponsored"`; the citation index
  already shipped, isn't "the next step"). Closes #443.
- **content**: `sound-dampening-compared` self-closing `<Source
  text="..." />` tag fixed to the paired form — the self-closing form
  rendered an empty, invisible link, silently dropping a citation from
  a live sentence. Closes #444.
- Four `/expand` passes (171-174) — 0 new candidates; the 13-row
  Pending queue is unchanged.

## Queues now

- **Build plan**: 0 pending phases (51/51 shipped) — pure `/iterate`
  maintenance mode, unchanged.
- **Cross-link drain**: 0 pending, unchanged.
- **`plan/AUDIT.md`**: 1 open row — the standing
  `[blocked-cloud-permission] [6.3]` `march.yml` crash-gate fix
  (unchanged, still stuck on the workflow-write permission wall; the
  two-line `always()` fix is written and verified, just unpushable
  from cloud). All 598 other rows closed.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **61 days / 1261 commits stale** (up from
  61/1236 two days ago). Unchanged diagnosis: cloud `/march` hard-skips
  `/critique` by design (`.github/CLOUD_LOOP.md`); the `[6.5]` Critique
  gate diagnostic candidate is still standing, unpromoted since
  2026-07-03 (8 days now).
- **`plan/PHASE_CANDIDATES.md`**: 13 pending rows, unchanged for the
  fourth straight digest. Top incumbents: Stale group-buy
  frontmatter/prose gate (6.5), `/quiz/board` (6.5), Critique gate
  diagnostic (6.5), external link-rot survey (6.0), march.yml
  crash-issue gate `always()` fix (6.0), Parts catalog third data pass
  (5.5), `/compare/keycap-set` (5.5), Vitest coverage CI gate (5.5),
  ship-data mentionedParts rescan (5.5), Cloud loop workflow-push
  permission gap (5.5), Tracker 8-week editorial analysis (5.0),
  Accessory parts kind (5.0), Tracker topic history page (4.5). **Last
  `/oversight` promotion: 2026-05-23 — 49 days ago.**
- **`data/BACKLOG.md`**: 0 pending rows.
- **Triage**: 11 open issues (up from 9) — `#395` (cloud march
  crash-issue gate, unchanged, blocked) plus 8 duplicate content-gap
  issues (#414-#416, #418-#422) from the pre-fix ship-content
  duplicate-issue loop, unchanged and still awaiting a
  manual/oversight consolidation pass, plus two new since yesterday:
  `#437` (transient 429 rate-limit on a cloud march run — already
  triaged to `triage:reviewed`, no action needed) and `#434`
  (`triage:needs-user` — Vercel never ingested commit `e312e09`; see
  Needs you). 0 unlabeled.
- **Expand cadence**: 23 consecutive no-candidate passes (152-174); 24
  passes since the last candidate was filed (pass 151, 2026-06-19).
  Not a mistuning signal on its own — the queue is full (13 unpromoted
  rows), not empty; expand correctly isn't re-proposing what's already
  filed and awaiting `/oversight`.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as sequential blocking legs
(typecheck → test:run → test:scripts → data:validate → build → size →
e2e) — all green:

- `typecheck` — green, all 8 workspace packages (apps/web, apps/e2e,
  packages/content, data, seo, tokens, ui).
- `test:run` — green, 94 test files / 591 tests (apps/web workspace;
  benign jsdom "Not implemented: navigation" stderr noise on
  `MobileNav.test.tsx`, doesn't fail the test).
- `test:scripts` — green, 161/161 (59 suites).
- `data:validate` — green (69 records: 9 vendors, 18 switches, 10
  keycap-sets, 9 boards, 13 group-buys, 10 trend weeks — cross-refs
  resolve).
- `build` — green, all routes generated, no manifest churn issues.
- `size` — green, homepage gzip 108.5 KB / 200 KB budget (unchanged).
- `e2e` — green, **981/981**. Benign `NoFallbackError` stderr noise
  logged mid-run on `/trends/tracker/[week]` for non-generated week
  params (expected fallback-404 behavior, same as prior digests) — did
  not fail any test.
- `lighthouse` — still `disabled_manually` (since 2026-06-14, per the
  2026-07-09 digest's correction); no new signal this tick.
- `pnpm deploy:check` at HEAD (`0e9f1a7`) — deploy `READY`
  (`dpl_GqB3bZ5r`).

No red legs, no new AUDIT.md finding from this breadth check.

## Needs you

1. **New: Vercel silently dropped the deploy for commit `e312e09`
   (2026-07-10).** Filed as issue `#434` (`triage:needs-user`).
   `pnpm deploy:check` timed out three times over ~30 minutes with "not
   ingested yet"; direct Vercel API checks confirmed no deployment was
   ever created for that commit, and GitHub's combined status shows no
   Vercel check registered at all — a dropped webhook delivery, not a
   build failure. Every commit before and after deployed normally
   within ~30-100s of push (confirmed again this tick: HEAD `0e9f1a7`
   deployed in 0s per `deploy:check`). Self-resolved for subsequent
   commits, but worth a look at the GitHub → Vercel webhook
   configuration if it recurs — a repeat would mean a real production
   page silently going stale post-push with no loop-visible signal
   (the loop only checks `deploy:check` at the commit that triggered
   it, not retroactively).
2. **Standing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 61 days / 1261 commits since the last local
   `/critique` pass — the fresh-eyes loop has been dark for two
   months. The candidate (filed 2026-07-03, 8 days unpromoted) already
   has a full diagnostic writeup and a proposed fix shape (resolve the
   AND/OR ambiguity between `march.md`'s Purpose section and its Step
   2 body, add a trace log, manually re-baseline the header).
3. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[score 5.5]` candidate, companion to the `[6.3]` blocked
   AUDIT row and open issue `#395`). Unchanged.
4. **Standing, now 49 days: the `/oversight` promotion backlog
   itself.** 13 candidates pending, three at 6.5 (`/quiz/board`,
   Critique gate diagnostic, stale group-buy frontmatter gate),
   unpromoted since 2026-05-23. Not a code defect — just a wide gap
   between candidate supply and promotion cadence. Worth a look next
   `/oversight` pass regardless of which specific candidates get
   promoted or rejected.
5. **Housekeeping, low urgency: 8 duplicate open GitHub issues**
   (#414-#416, #418-#422) from the pre-fix ship-content duplicate-issue
   loop are still open — each still names a genuine unwritten
   deep-dives topic (not a shipped duplicate, per repeated expand-pass
   verification), so closing them would discard real content backlog
   rather than being pure hygiene. A manual review pass would still
   tidy the tracker.

## Today's intent

No pending build-plan phase, no data backlog, cross-link drain and
content-gap queue both empty. Expect more single-fix `/iterate`
maintenance ticks — the corpus is clean per every mechanical survey
(content-gap, crosslink, companion, stale-GB, newsletter-gap,
OG-coverage, a11y-spec-coverage, tracker-linkage, article-parts-check,
article-language-check) as of pass 174. `/quiz/board`, the stale
group-buy frontmatter/prose gate, and the Critique gate diagnostic
remain the three highest-scored Pending candidates, all still awaiting
`/oversight` promotion — the queue hasn't moved in four digests
running. One live thread worth watching: the newly root-caused
`tracker-linkage-survey.mjs` fix (`14d19e8`) should mean no more W-N
tracker-linkage data patches going forward — the next tracker week
that would previously have needed one is the test of that.

## Tuning proposals

None this pass. No new mistuned-gate signal in the window: the two
live gaps this digest surfaces (critique staleness, cloud
workflow-push permission) both already have standing
`plan/PHASE_CANDIDATES.md` rows from earlier passes, unpromoted but
not newly worsened in a way that changes their shape — restating them
under **Needs you** rather than re-filing duplicate candidates. The
new Vercel-webhook-drop issue (`#434`) is also not filed as a
candidate: it's a one-off external infrastructure signal (GitHub →
Vercel webhook delivery), not a loop mechanism the loop controls or
can propose fixing on itself — flagged under Needs you instead. The
`/oversight` promotion-cadence gap (item 4 above) is also not filed as
a new candidate: it's a call about the user's own review cadence, not
a loop mechanism the loop can propose fixing on itself.
