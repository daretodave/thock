# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~24.0h window — 24/24 `march` runs succeeded — 21
substantive ticks (16 shipped fixes/content + 2 `expand` passes +
1 weekly trend snapshot + 1 content-gap dispatch + 1 mirror-only
tick) for 37 commits total.** Since the last digest (`d5e70487`,
2026-08-09T11:02:51 UTC) the loop drained **26** `plan/AUDIT.md`
findings (961 → 987 `[x]` rows), all self-discovered by fresh
`/iterate` audit sweeps except one content-gap dispatch and one
10-pair cross-link batch. The window's shape: a long tail of small,
independent factual/data corrections rather than one dominant defect
class — week-count off-by-ones (W31 Gateron Lanes, W23 Ramune, W32
Blaine V2 SE, cherry-xtrfy-tmr-pivot MX2A), stale/missing trend-row
state (CannonKeys tracker dropout restored, GMK Beachy row linked to
its companion article, cannonkeys-blaine-v2-se flipped to closed
status), a self-contradicting install-time figure in pe-foam-mod (10
vs 15 minutes), a missing citation link on gmk-cyl-og-extensions, a
regressed cross-link on hmx-cloud-deep-dive, and a fabricated third
vendor invented in the W33 OG Extensions trend note. A distinct
late-window cluster (5 ticks, 05:56-09:49 UTC) worked the same
article family — `gmk-cyl-just-beachy-group-buy-opens` and its
sibling trend rows — fixing an overreaching "widest spread" claim,
an unqualified vendor count, and the fabricated-vendor note in
succession, alongside the article's own content-gap dispatch (filed
`#806`, shipped same window) and a 10-pair cross-link drain
(`#807`). A non-content fix also shipped: `tracker-linkage-survey
.mjs`'s dedup logic ignored topic spelling drift (`d1045963`),
closing `#801`. Two issues cited by last night's digest as evidence
for a standing process gap — `#776` (pe-foam-mod, open since
2026-08-07) and `#799` (W23 Ramune, open since 2026-08-09) — were
both drained this window. `/expand` ran 2 passes (302-303), both
zero-new-candidate; pass 302 reinforced the numeric-spec-audit
candidate to `7.5`. This tick's own fresh `pnpm verify` is green
across all eight legs, run as sequential foreground blocking calls:
typecheck (9 packages), lint (all lintable workspaces), 805 unit
tests site-wide (unchanged from yesterday), 202 script tests / 72
suites (up from 198 — new dedup-drift coverage from `d1045963`), 79
data records / cross-refs resolve (up from 78 — the W33 snapshot),
a clean build across all canonical routes, homepage bundle 108.7 KB
/ 200 KB (unchanged), and 1137/1137 e2e (up from 1131 — new
canonical URLs for the just-shipped article). Deploy is `READY` at
HEAD (`e1256f3c`, `dpl_E5ZMpgqP`).

`plan/CRITIQUE.md` is now **92 days / 2168 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`). Diagnosis
unchanged: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner); every commit this window again carries
the `Cloud-Run:` trailer. `plan/PHASE_CANDIDATES.md` holds **23
pending rows + 1 needs-user-call**, unchanged in count (both this
window's expand passes were zero-new-candidate), **57 days** since
the last promotion (2026-06-14, phases 46-49). `plan/AUDIT.md`
carries **1 open row** (the standing `[4.0]` Lighthouse-CI row) plus
**4 more `/oversight`-gated or blocked rows** — one new since
yesterday: a `[needs-user-call] [3.0]` meta-finding (filed this
window, `bbde6417`) diagnosing that mirrored `loop:opened` GitHub
issues can go permanently un-drained if not picked the same tick
they're filed. That row cites `#776`/`#799` as its evidence — both
now closed — but a **fresh instance landed this morning**: `#813`
(RSS `validateRssXml` dead code, filed 10:33 UTC by the final march
run of this window) was mirrored to GitHub with no fix shipped and,
consistent with the diagnosed gap, carries no `plan/AUDIT.md`
Pending row of its own. See "Needs you" below.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-09 11:31 | iterate | data — W31 Gateron Lanes week-count + `[2.4]` manifest hygiene, 2 findings (`48de69cd`/`c0fc6913`, closes #800) |
| 08-09 12:30 | fix | tracker-linkage-survey dedup ignores topic spelling drift `[3.5]` (`d1045963`/`c2d249fc`, closes #801) |
| 08-09 13:36 | iterate | data — W32 CannonKeys tracker dropout restored `[4.2]` (`0fd5e963`/`a962153c`, closes #789) |
| 08-09 14:39 | iterate | content — cherry-xtrfy-tmr-pivot MX2A week-count off-by-one `[5.4]` (`7bb15759`/`ba063579`, closes #802) |
| 08-09 15:35 | iterate | content — gmk-cyl-og-extensions W30 citation gap `[4.5]` (`c0afce24`/`5c2e1703`, closes #803) |
| 08-09 16:26 | iterate | cross-links — hmx-cloud-deep-dive ↔ keyboard-acoustics-deep-dive regressed link restored `[4.5]` (`25319866`/`474a235e`, closes #804) |
| 08-09 17:15 | expand | pass 302 — 0 new candidates, numeric-spec audit reinforced to 7.5 (`bfa6f505`) |
| 08-09 18:28 | iterate | content — pe-foam-mod self-contradicting install time (10 vs 15 min) `[4.8]` (`4b8b667e`/`bbde6417`, closes #776) |
| 08-09 19:28 | iterate | data — W23 Ramune week-count undercount `[4.5]` (`a4179926`/`a2fa3569`, closes #799) |
| 08-09 21:26 | iterate | data — W32 Blaine V2 SE closing-week note fixed `[5.4]` (`51d21dbf`/`ed55ab4b`, closes #805) |
| 08-09 22:14 | expand | pass 303 — 0 new candidates, two candidates reinforced in place (`b2dcd442`) |
| 08-10 00:30 | weekly | 2026-W33 trend snapshot generated (`2aecc8a9`) |
| 08-10 01:34 | audit | content-gap row auto-filed by content-gap-survey.mjs; issue #806 opened (`1a353ecb`/`fe0f6750`) |
| 08-10 03:55 | ship-content | news — "GMK Just Beachy's group buy opens August 18 across five vendors on five continents" (`eda11aed`/`a0a74d63`, closes #806) |
| 08-10 04:48 | iterate | cross-links — gmk-cyl-just-beachy-group-buy-opens, 10 pairs drained (`fc877cfd`/`8fe793a2`, closes #807) |
| 08-10 05:56 | iterate | data — cannonkeys-blaine-v2-se status stale → closed `[3.6]` (`61f0ae14`/`63ebab21`, closes #808) |
| 08-10 06:45 | iterate | content — gmk-cyl-just-beachy "widest spread" claim qualified `[3.2]` (`f3c1b0e4`/`8fd0f077`, closes #809) |
| 08-10 07:49 | iterate | data — GMK Beachy trend rows linked to companion article `[6.3]` (`71325662`/`4ef5233f`, closes #810) |
| 08-10 09:03 | iterate | content — gmk-cyl-just-beachy TA Neo vendor count qualified `[4.2]` (`300475aa`/`0a9c278a`, closes #811) |
| 08-10 09:48 | iterate | data — W33 OG Extensions fabricated third vendor dropped `[6.3]` (`b0cc43d4`/`e1256f3c`, closes #812) |
| 08-10 10:28 | audit | issue #813 mirrored (RSS validateRssXml dead code) — not picked for a fix this window |

24 `march`-workflow runs since 2026-08-09T11:02:51 UTC: **24
`success`, 0 `failure`, 0 `cancelled`** — a fully clean window, no
GH Actions infra hiccups. `heartbeat` (4 runs) all green throughout,
no wedged-run alerts. `night` (1 prior run, 2026-08-09) green; this
tick is the current `night` run. 21 ticks produced a commit or
opened an issue; 3 of the 24 runs were silent no-ops.

## Shipped

- **content fact-checks (6)**: cherry-xtrfy-tmr-pivot's MX2A
  week-count off-by-one (eight vs actual seven); gmk-cyl-og
  -extensions-interest-check's missing W30 tracker citation link;
  pe-foam-mod's self-contradicting install-time figure (10 min at
  one point, 15 at another, with a sibling article depending on the
  10-minute figure); gmk-cyl-just-beachy's overreaching "widest
  spread of this year's tracked CYL buys" claim (Ramune's buy is
  wider) qualified; the same article's TA Neo vendor count converted
  from an unsupported exact "four vendors" + ranking claim to
  "four named vendors."
- **content (1, ship-content)**: news pillar article "GMK Just
  Beachy's group buy opens August 18 across five vendors on five
  continents" (970 words, 5 sections, 3 InlineViz), filling the news
  pillar's hot-pursuit content-gap window.
- **data (7)**: W31 trend snapshot Gateron Lanes week-count
  off-by-one; W32 trend snapshot CannonKeys tracker row restored
  after a dropout; W23 trend snapshot Ramune week-count undercount;
  W32 trend snapshot Blaine V2 SE closing-week note (fixed a
  "closes today" claim six days off plus a week-count miscount, the
  defect having been introduced by an *earlier* fix's author-time
  text leaking into snapshot-fixed prose); cannonkeys-blaine-v2-se
  group-buy record status flipped from live to closed (`endDate`
  had passed); GMK Beachy trend rows (W32, W33) linked to their
  already-live companion article; W33 trend snapshot's OG Extensions
  note had a fabricated third vendor ("Sandkeys Middle East",
  appearing in no data record) dropped.
- **cross-links (1 batch, 10 pairs)**:
  `gmk-cyl-just-beachy-group-buy-opens` linked to 10 same-pillar/
  shared-tag sibling articles; plus a separate regressed link
  restored between `hmx-cloud-deep-dive` and
  `keyboard-acoustics-deep-dive`.
- **engineering (1)**: `tracker-linkage-survey.mjs`'s dedup check
  ignored topic spelling/spacing drift between a filed row's topic
  string and a newly-discovered instance, risking duplicate rows for
  the same underlying defect; now normalizes before comparing.
- **manifest hygiene (1)**: a prior tick's content fix
  (`747a6b79`) had shipped without regenerating the committed
  data-runtime/search manifests — resolved as a byproduct of the W31
  fix's own regeneration step, no dedicated commit needed.
- **expand**: 2 passes (302-303), both zero-new-candidate. Pass 302
  used this window's pe-foam-mod contradiction as fresh evidence to
  reinforce the numeric-spec-audit candidate from 7.0 to 7.5; pass
  303 reinforced two existing candidates in place with this window's
  week-count-fix evidence rather than filing duplicates.

## Queues now

- **Build plan**: 0 pending phases (51 shipped), unchanged.
- **Cross-link drain**: 0 pending rows, unchanged (the 10-pair batch
  and the 1 regressed link both drained same-window as filed).
- **`plan/AUDIT.md`**: **1 open row** (987 `[x]` rows now, up from
  961 — 26 findings closed this window) plus **4 more**
  `/oversight`-gated or blocked rows, **one new since yesterday**:
  `[6.3]` march.yml crash-gate (blocked-cloud-permission, issue
  #395, filed 2026-07-05); `[4.0]` Lighthouse-CI disabled (filed
  2026-07-18, still `disabled_manually`); `[needs-user-call] [4.2]`
  soft-404 structurally blocked (issue #533, filed 2026-07-18);
  `[4.0]` heartbeat.yml dedup (blocked-cloud-permission, issue #620,
  filed 2026-07-26); **new** `[needs-user-call] [3.0]` mirrored
  `loop:opened` issues can go permanently un-drained (filed this
  window, `bbde6417`, citing `#776`/`#799` — both since closed, but
  reinforced this morning by a fresh instance, `#813`).
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **92 days / 2168 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  One `[needs-user-call]` row remains Pending (GA `/g/collect`
  503s, filed pass 8) — outside the repo, not actionable by a
  shipping skill.
- **`plan/PHASE_CANDIDATES.md`**: **23 pending rows + 1
  needs-user-call**, unchanged in count from yesterday. **57 days**
  since the last promotion (2026-06-14, phases 46-49). Top of the
  cluster remains three `7.5`s and `7.0`s (numeric-spec audit just
  reinforced to 7.5 this window; trend-snapshot data-quality gate at
  7.5; article internal-consistency checker at 7.0) — this window's
  content fact-checks are fresh, repeated evidence for all three.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged.
- **Triage**: **17 open issues**, 0 unlabeled — down from 19. Net
  -2: this window's fixes closed more issues (including 2 carried
  over from before last digest, `#776` and `#799`) than the 1 new
  mirror-gap issue (`#813`, not picked) plus the 1 content-gap issue
  that opened and closed same-window (`#806`) added. Four
  `triage:needs-user` issues remain standing, ages up by 1 day each:
  `#756` (4 days old), `#639` (13 days old), `#499` (25 days old),
  `#434` (31 days old). Orphaned duplicate `#719` (MobileNav
  focus-containment, fixed weeks ago by `6ef381e3`) remains open,
  unchanged. The 8-issue `deep-dives` content-gap cluster
  (`#414`-`#422`, filed 2026-07-08) remains open and unchanged —
  already routed to existing Pending candidates.
- **Expand cadence**: 2 passes this window (302-303), both
  zero-new-candidate but both strengthened existing rows with fresh
  evidence. Normal cadence, no starvation signal.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential
blocking legs (typecheck → lint → test:run → test:scripts →
data:validate → build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next
  lint` — still flags its own deprecation ahead of Next.js 16
  removal, a future-maintenance note rather than a defect;
  `packages/*` via `eslint`).
- `test:run` — green, 805 web unit tests / 107 test files,
  unchanged from yesterday.
- `test:scripts` — green, **202 tests / 72 suites**, up from 198 —
  new coverage for `tracker-linkage-survey.mjs`'s spelling-drift
  dedup fix (`d1045963`).
- `data:validate` — green, **79 records** walked, cross-refs
  resolve (10 vendors, 18 switches, 10 keycap-sets, 10 boards, 16
  group-buys, **15 trends**, up from 14 — the W33 snapshot).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1137/1137** (~7.7m, single worker), up from 1131
  — new canonical URLs for the news article shipped this window.
  Server stderr again logged `NoFallbackError` several dozen times
  against the five `dynamicParams = false` routes (`/part/[kind]`,
  `/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
  `/newsletter/[slug]`) — same non-blocking shape flagged in recent
  digests, Next's expected internal log for not-found-page e2e tests
  hitting a param outside the pre-generated set. Every one of the
  1137 tests still passed.
- `pnpm deploy:check` at HEAD (`e1256f3c`) — deploy `READY`
  (`dpl_E5ZMpgqP`).
- `lighthouse` — `gh run list --workflow lighthouse` still can't
  resolve the disabled workflow by display name (known quirk, use
  `--workflow lighthouse.yml`); state remains `disabled_manually`,
  same standing `[4.0]` AUDIT row, no new signal this window.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New this window: a fresh instance of the mirror-gap process
   finding.** `#813` (RSS `validateRssXml` dead code, filed 10:33
   UTC by this window's final march run) was mirrored to GitHub with
   a stated one-line suggested fix but wasn't the tick's top-scored
   pick, so no fix shipped and — same as `#776`/`#799` before it —
   it left no `plan/AUDIT.md` Pending row behind. The diagnosing
   `[needs-user-call] [3.0]` row already exists (filed this window,
   `bbde6417`) and explicitly frames this as a loop-bookkeeping
   decision for `/oversight` or `/plan-a-phase`, not something an
   autonomous tick should resolve unilaterally. `#813` is now the
   third live example — worth weighing when that call gets made.
2. **Standing: `/critique` is 92 days / 2168 commits stale.** The
   diagnosis has been unchanged for weeks — cloud mode
   architecturally cannot reach `/critique` (no Chrome MCP on the
   runner). Needs a decision: accept `/critique` as local-only
   ritual, find a cloud-compatible path, or retire the gate
   formally. A matching `[needs-user-call] [score 6.5]` candidate
   already sits in `plan/PHASE_CANDIDATES.md`.
3. **Standing, growing: the `/oversight` promotion backlog.** 23
   pending candidates + 1 needs-user-call, now **57 days** since the
   last promotion. Three candidates cluster at 7.0-7.5; this
   window's fact-checks are fresh, repeated evidence for the
   numeric-spec-audit and trend-snapshot-quality-gate candidates.
4. **Standing, unclosed: orphaned duplicate GitHub issue `#719`.**
   Still open; the MobileNav focus-containment defect it names was
   fixed weeks ago by `6ef381e3` (closed via a different issue,
   `#722`). Cheap to close by hand.
5. **Standing: Lighthouse CI has been disabled and failing for 8+
   weeks** — `/oversight` call needed. Unchanged since last digest.
6. **Standing: four unresolved `triage:needs-user` GitHub issues.**
   `#756` (4 days old), `#639` (13 days old), `#499` (25 days old,
   not self-resolved), `#434` (31 days old, not self-resolved).
7. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`
   issue #395, heartbeat.yml `[4.0]` issue #620) — both fixes
   written and verified, neither can ship because the cloud push
   credential lacks `workflows` scope for `.github/workflows/*.yml`
   edits.
8. **Standing, out-of-repo: GA `/g/collect` 503s** —
   `plan/CRITIQUE.md` pass-8 `[needs-user-call]` row, unactionable by
   any shipping skill since the analytics property lives outside the
   codebase.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (the one open row is
`/oversight`-gated). `#813` is the most concrete near-term target —
either lands as a one-line test-coverage fix if a tick picks it up,
or the `/oversight` pass below can knock it out by hand in minutes.
Otherwise the next `/march` tick will most likely repeat this
window's pattern: a fresh reactive `/iterate` fix off a
general-purpose sweep, or another `/expand` pass. The
highest-leverage next move isn't a new fix — it's an `/oversight`
pass covering, in one sitting: the mirror-gap process decision (now
with three live examples), the standing 23-row candidate cluster
(three 7.0-7.5s, now 57 days stale, with fresh evidence from this
window), the Critique-gate decision (now past 90 days), the
Lighthouse re-enable decision, the two blocked workflow-permission
fixes, and (small) closing the orphaned `#719` duplicate issue by
hand.

## Tuning proposals

None new this pass. 24/24 `march` runs succeeded this window — a
fully clean stretch, no infra incidents to weigh against a ceiling
or ratio. `/expand`'s 2 passes (302-303, both zero-new-candidate but
both strengthened existing rows with fresh evidence) is within
normal cadence, not starvation. The one process observation this
window — a third live instance (`#813`) of the mirrored-but-unpicked
GitHub issue gap — is filed under "Needs you" rather than as a new
tuning proposal, since the diagnosing `[needs-user-call]` AUDIT row
already exists (filed this same window) and explicitly defers the
fix shape to `/oversight`; a second candidate would just duplicate
it. The critique-gate staleness (now 92 days), the 23-row
`/oversight` backlog, and the four standing `triage:needs-user`
issues remain standing, already-diagnosed decisions awaiting a human
call, not new tuning signals — all covered under Needs you rather
than re-proposed here.
