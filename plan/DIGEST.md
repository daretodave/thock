# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23.6h window — 23/23 completed `march` runs succeeded,
0 failures — 17 substantive ticks (13 shipped fix/data/content
pairs + 4 `expand` zero-candidate passes) for 31 commits total, the
other 6 completed runs landing as silent no-ops.** Since the last
digest (`e5375751`, 2026-08-11T11:22:11 UTC) the loop drained **13**
findings, all self-discovered by fresh `/iterate` audit sweeps or
mechanical surveys. The window's dominant shape is a **trend-snapshot
data-quality cluster**: 3 of the 13 fixes correct week-over-week
fulfillment/close-date contradictions in `data/trends/*.json` records
(GMK CYL Selene, Ramune, Prussian Alert) — the 13th, 14th, and 15th
instances of the already-Pending `[7.5]` "Trend-snapshot data-quality
gate" candidate, reinforced in place by `/expand` pass 312, no new
candidate needed. A second, smaller shape: two independent
"heading contradicts row content" bugs on group-buy surfaces
(`/vendor/[slug]` and the home `GroupBuysWidget`, one explicitly
citing the other's fix in its commit message) — `/expand` pass 312
checked for a third instance, found none, and correctly left it as a
2-instance watch item rather than filing a new candidate (below the
3+ bar). The rest: a sitemap `lastModified` fix (two passes, real-data
derivation then extended to quiz/compare pages), a Zod `.strict()`
hardening pass closing a recurring dead-key gap, a search
hotswap/hot-swap/hot swap tokenization fix, the newsletter
content-velocity cycle (issue 07 shipped end-to-end, closing #832),
a same-document self-contradiction in that newsletter's own TA Neo
tracker-score narrative (9th instance of the already-Pending `[7.0]`
"Article internal-consistency checker" candidate), a metadata-staleness
fix (`gmk-cyl-just-beachy` article `updatedAt` not covering its own
cited trend data), and a fresh "at the time of writing" temporal hedge
caught by a general sweep and folded into the Phase-36 language-check
gate as a new forbidden pattern.

**This tick's own fresh `pnpm verify` had one real story: the `build`
leg failed on its first attempt** — `next/font/google`'s build-time
fetch of a hashed Newsreader italic-400 file from `fonts.gstatic.com`
returned `404` after 3 retries, failing the whole compile. Two
immediate retries with zero code changes both succeeded (confirmed:
Next.js's bundled font manifest has drifted from Google's current
file hosting for that one weight/style — a live `curl` returns a
*different* hash for the same family/style/weight than the one
`next build` requested). Filed as a new `[4.2]` `plan/AUDIT.md` row
per the red-leg rule even though the leg is green again — see
"Needs you." Every other leg was clean on the first pass: typecheck
(9 packages), lint (all workspaces, `next lint`'s Next-16-deprecation
notice is cosmetic), 1198 unit tests across 7 workspaces (828 web +
157 content + 129 data + 44 seo + 31 ui + 6 e2e + 3 tokens — all
green, all new since the last digest's 811-web baseline), 207 script
tests / 74 suites (up from 205 — the two new `at-time-of-writing`
pattern cases), 80 data records / cross-refs resolve (unchanged),
homepage bundle 108.7 KB / 200 KB (unchanged), and 1140/1140 e2e
(benign `NoFallbackError` stderr noise on the five intentional
not-found probes — known, not a regression). Deploy is `READY` at
HEAD (`55727096`, `dpl_3viTCSAq`).

`plan/CRITIQUE.md` is now **93 days / 2228 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — architecturally
stuck, not neglected: cloud mode has no Chrome MCP to run the
external-observer pass, and every commit in this window again carries
the `Cloud-Run:` trailer. `plan/PHASE_CANDIDATES.md` holds **24
pending rows**, unchanged count this window (all instance-count
reinforcements landed in-place, no new candidate filed), **59 days**
since the last promotion (2026-06-14, phases 46-49). `plan/AUDIT.md`
carries **6 open rows** (5 standing non-autonomous items + this
tick's new `[4.2]` font-fetch row) — the Lighthouse-CI row is now
**~60 days** disabled with no autonomous path forward. See "Needs
you" below.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-11 11:34 | expand | pass 309 — 0 new candidates (`e9df19e8`) |
| 08-11 12:30 | expand | pass 310 — 0 new candidates (`44cd669b`) |
| 08-11 14:03 | seo | sitemap.ts `lastModified` derived from real data, not build-time `now()` `[4.0]` (`7326999f`/`9241fd20`) |
| 08-11 14:51 | fix | harden content/data Zod schemas with `.strict()` — closes recurring dead-key gap `[4.8]` (`5a86fae7`/`cfe221c2`) |
| 08-11 16:37 | seo | sitemap.ts derives `lastModified` for quiz/compare tool pages `[4.0]` (`0866a77f`/`d434f577`) |
| 08-11 20:25 | expand | pass 311 — 0 new candidates (`d60f59be`) |
| 08-11 21:48 | fix | search normalizes hotswap/hot swap/hot-swap to one indexed token `[3.5]` (`0e7d785f`/`eb3771a5`) |
| 08-11 22:38 | data | trends tracker W23/W25/W26 GMK CYL Selene fulfillment date corrected `[5.4]` (`6c974fe9`/`f0b4a8b4`) |
| 08-11 23:43 | data | trends tracker W24/W25/W26 Ramune close date corrected `[7.2]` (`cc029f5c`/`ffe62d86`) |
| 08-12 00:24 | content | newsletter "thock weekly — issue 07" — content-gap dispatch, ship, closure `[4.0]` (`9e7361ea`/`10bf942f`/`879fe9d5`, closes #832) |
| 08-12 01:45 | data | trends tracker W25 Prussian Alert fulfillment date corrected `[6.4]` (`990c7dc0`/`a436a51e`) |
| 08-12 04:01 | content | gmk-cyl-just-beachy `updatedAt` bumped to cover its own cited trend data `[4.8]` (`51fc2b8c`/`3ab3dd80`) |
| 08-12 05:54 | fix | vendor page — relabel heading when only upcoming group buys are active `[4.0]` (`2f0ecb86`/`a3e2138b`, closes #835) |
| 08-12 06:48 | fix | home group-buys widget — relabel heading when every non-urgent row is upcoming `[5.25]` (`9c7040d2`/`7c1b17d9`, closes #836) |
| 08-12 07:59 | content | newsletter issue 07 — TA Neo tracker score self-contradiction fixed `[4.8]` (`b271ba57`/`05aca84c`, closes #837) |
| 08-12 08:36 | expand | pass 312 — 0 candidates filed, 2 instance counts reinforced in place (`b1aa5332`) |
| 08-12 09:46 | fix | hmx-cloud-deep-dive — "at the time of writing" temporal hedge `[4.8]` (`6bd30f54`/`55727096`, closes #838) |

23 `march`-workflow runs since 2026-08-11T11:22:11 UTC (window start
12:17 UTC after the digest's own commit landed): **23 completed, all
`success`, 0 `failure`, 0 `cancelled`** — a fully clean window, no GH
Actions infra hiccups. `night` (1 prior run, 2026-08-11, success)
green; this tick is the current `night` run. 17 of the 23 completed
runs produced a commit (13 fix/data/content ticks — 12 two-commit
pairs + 1 three-commit newsletter-dispatch chain — plus 4 expand
passes = 31 commits); the other 6 completed runs were silent no-ops —
a fresh `/iterate` sweep or mechanical survey ran and found nothing
scoring ≥3.0.

## Shipped

- **Trend-snapshot data-quality cluster (3 fixes)**: GMK CYL Selene,
  Ramune, and Prussian Alert fulfillment/close-date contradictions in
  `data/trends/*.json` corrected — the 13th–15th instances of the
  already-Pending `[7.5]` data-quality-gate candidate, reinforced in
  place, no score change.
- **Group-buy heading/row contradiction (2 fixes)**: `/vendor/[slug]`
  and the home `GroupBuysWidget` both mislabeled not-yet-started
  buys under an "active"/"currently running" heading; both now
  relabel to "upcoming"/"opening soon" when nothing in the bucket has
  actually started, mirroring the canonical `/group-buys` index's
  existing Live-now/On-the-horizon split.
- **Newsletter issue 07 shipped + self-corrected**: weekly digest
  (5 pillar picks + W33 tracker snapshot) shipped end to end from the
  content-velocity queue (closes #832), then its own Trends-pillar
  blurb was caught contradicting its own later tracker-snapshot
  section on TA Neo's score sequence and fixed same-day (9th instance
  of the article-internal-consistency-checker candidate).
- **SEO/data hygiene**: `sitemap.ts` `lastModified` now derives from
  real record data instead of build-time `now()` (landed in two
  passes — core routes, then quiz/compare tool pages); content/data
  Zod schemas hardened with `.strict()` site-wide, closing a
  recurring silent-dead-key gap; search normalizes
  hotswap/hot-swap/"hot swap" spelling variants to one indexed token;
  `gmk-cyl-just-beachy`'s `updatedAt` bumped to cover the trend data
  its own chart cites; a fresh "at the time of writing" temporal
  hedge on `hmx-cloud-deep-dive` reworded and folded into the
  Phase-36 language-check gate as a new pattern.

## Queues now

- **Build plan**: all 49 phases shipped, 0 pending. No phase work
  queued.
- **Cross-link drain**: 0 open `[cross-links] [4.5]` rows — fully
  drained.
- **Critique**: pass 11, 2026-05-10 — **93 days / 2228 commits**
  stale. Diagnosed as architectural (no Chrome MCP on the cloud
  runner), not neglect. Unchanged from prior digests.
- **Phase candidates**: 24 pending in `plan/PHASE_CANDIDATES.md`,
  unchanged count this window. 59 days since the last `/oversight`
  promotion (2026-06-14, phases 46–49).
- **Data backlog**: `data/BACKLOG.md`'s "Pending" section lists 3
  rows, but all 3 are already checked `[x]` and their records already
  exist in `/data` (gateron-lanes switch, keychron vendor,
  keychron-q1-he board) — stale bookkeeping, not real pending work;
  the file was never moved to "## Done". Cosmetic only; `/ship-data`
  already treats this as an empty queue (no `[ ]` rows) and runs its
  own audit pass. Worth a one-line tidy next time `/ship-data` runs.
- **Open GitHub issues**: 18 open, 0 unlabeled (triage gate clean).
  4 labeled `triage:needs-user` (#756, #639, #499, #434 — all
  historical cloud-march/deploy-check or digest-crash reports, no new
  ones this window).

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 packages.
- `lint` — green, all lintable workspaces (`next lint` prints a
  Next-16 deprecation notice; cosmetic, not a failure).
- `test:run` — green, **1198 tests / 173 files** across 7 workspaces
  (828 web + 157 content + 129 data + 44 seo + 31 ui + 6 e2e + 3
  tokens).
- `test:scripts` — green, **207 tests / 74 suites** (up from 205 —
  the two new `at-time-of-writing` language-check cases).
- `data:validate` — green, 80 records, all cross-refs resolve.
- `build` — **red on first attempt**, green on 2 immediate retries.
  `next/font/google` failed to fetch a hashed Newsreader
  italic-400 `.woff2` from `fonts.gstatic.com` (`404` after 3
  retries) — Next.js 15.5.21's bundled font manifest has drifted from
  Google's current file hosting for that file. New `[4.2]`
  `plan/AUDIT.md` row filed per the red-leg rule; see "Needs you."
- `size` — green, homepage bundle 108.7 KB / 200 KB budget.
- `e2e` — green, **1140/1140**. Benign `NoFallbackError` stderr noise
  mid-run on the five intentional not-found probes
  (`/part/[kind]`, `/part/[kind]/[slug]`, `/vendor/[slug]`,
  `/trends/tracker/[week]`, `/newsletter/[slug]`) — known, not a
  regression.
- `pnpm deploy:check` at HEAD (`55727096`) — deploy `READY`
  (`dpl_3viTCSAq`).

One red leg this tick (the `build` font-fetch flake), self-resolved
on retry — new `[4.2]` `plan/AUDIT.md` finding filed, not shipped
(breadth-check findings become AUDIT rows, not fixes, per
`skills/digest.md` §4.2).

## Needs you

1. **New: `pnpm build`'s font-fetch fragility** (`[4.2]`
   `plan/AUDIT.md` row, filed this tick). `next/font/google`'s live
   fetch of Newsreader italic-400 404'd on this tick's first build
   attempt, then succeeded twice on retry with zero code changes —
   Next.js's bundled font manifest has drifted from Google's current
   file hosting. Not broken right now, but not proactively hardened
   either: the OG-image render path already vendors its font binaries
   locally for exactly this class of fragility
   (`apps/web/src/components/og/fonts.ts`); `layout.tsx`'s three
   `next/font/google` bindings (Newsreader, IBM Plex Sans, JetBrains
   Mono) don't. `/oversight` or the next `/iterate` tick should decide:
   vendor the three layout fonts now (proactive, matches precedent)
   or wait and see if the drift recurs.
2. **Standing: `/critique` is 93 days / 2228 commits stale.**
   Diagnosis unchanged — cloud mode architecturally cannot reach
   `/critique` (no Chrome MCP on the runner).
3. **Standing: Lighthouse CI disabled ~60 days**, `[4.0]`
   `plan/AUDIT.md` row, `needs: /oversight call` on whether to
   re-enable now or investigate the original disable reason first.
   Unchanged.
4. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[blocked-cloud-permission] [6.3]`/`[4.0]` AUDIT rows,
   companion `[5.5]` candidate, open issue `#395`). No PAT/App scope
   currently satisfies GitHub's workflow-write restriction. Unchanged.
5. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`[4.2]`) and **mirrored `loop:opened` issue drain gap** (`[3.0]`)
   — both non-autonomous, unchanged.
6. **Standing, growing: the `/oversight` promotion backlog.** 24
   candidates pending, flat this window (no new filed, none
   promoted), 59 days since the last promotion. Not a code defect —
   the supply of well-diagnosed candidates keeps outpacing promotion
   cadence.

## Today's intent

No pending build-plan phase — the loop stays in maintenance mode.
`plan/AUDIT.md`'s new `[4.2]` font-fetch row is now the
highest-scored *autonomously actionable* open finding (the other 5
open rows are explicitly blocked-cloud-permission or needs-user-call)
— expect the next `/iterate` tick to either pick it up (vendor the
layout fonts) or, if a fresher general-purpose sweep turns up a
higher-scoring defect, ship that instead and carry the font row
forward. `/expand`'s pass-312 note shows the queue is genuinely
clean: 8 mechanical surveys green, no pending phase/data/content-gap
work, 24 stable candidates. Watch for a third instance of the
group-buy heading/row contradiction shape (currently a 2-instance,
below-threshold watch item) — a third surface would clear the
promotion bar for a dedicated coverage check.

## Tuning proposals

None this tick. The pulse shows no mistuned gate: `/expand` is
running its own instance-count discipline correctly (13th–15th
trend-snapshot instances reinforced in place, 2-instance heading bug
correctly left unfiled), the ceiling isn't hibernating (23/23 clean
march runs, 17 substantive ticks), and the critique-staleness note is
an already-diagnosed architectural constant, not a fresh signal. The
new `[4.2]` AUDIT row from this tick's own breadth check is a defect
finding, not a gate/cadence tuning, so it's filed to `plan/AUDIT.md`
above rather than proposed here.
