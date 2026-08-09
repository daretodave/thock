# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23.8h window — 24/24 `march` runs succeeded — 16
substantive ticks (13 shipped fixes + 3 `expand` passes) for 29
commits total.** Since the last digest (`495d281c`,
2026-08-08T10:59:21 UTC) the loop drained 13 `plan/AUDIT.md`
findings, all self-discovered by fresh `/iterate` audit sweeps (no
pending build-plan phase, data backlog, or cross-link work exists to
draw from). The window's dominant defect class was a single tangled
factual error — the Cherry/GMK ownership claim — and its cleanup: a
same-tick correction across 2 articles + the then-current 12 weeks
of trends data (`72ddac23`), then three separate follow-up ticks
found the fix's own stated scope was incomplete and mopped up
residue one slice at a time (W21-W28, then W19-W20, each catching
trend-snapshot weeks the original commit's stated range hadn't
covered). A second recurring class: numeric week-count overcounts on
the live V6 Ultra HE Kickstarter, fixed on the trends snapshot itself
(`666be6e1`) then found stale a second time in the newsletter archive
prose minutes later (`747a6b79`) — the same propagation-lag shape as
the Cherry/GMK cleanup, just smaller. Other fixes: a WCAG-AA contrast
miss on the vendor "inactive" status badge; a false claim that the
HMX Cloud is "an all-PC switch" contradicting the site's own
dedicated deep dive; a mischaracterized "monotonic decline" for a
tracker score shape that actually recovered mid-window; a missing
`role="alert"` on `global-error.tsx` (the one crash boundary a prior
10-file sweep's own `find` pattern structurally couldn't match); a
false claim that the Mode Sonnet R2 ships a Hall-effect switch
option, contradicted by two sibling articles and the board's own
data record; a wrong vendor HQ city (NovelKeys is Morgantown, WV,
not Indianapolis); and a 2-week undercount of the HE tracker streak
in `computex-2026-keyboard-highlights`. `/expand` ran 3 passes
(299-301) — all zero-new-candidate, though passes 300 and 301 each
strengthened an existing candidate's scope note (trend-snapshot
quality gate; article internal-consistency checker) using this
window's fresh fact-check evidence rather than filing duplicates.
This tick's own fresh `pnpm verify` is green across all eight legs,
run as sequential foreground blocking calls: typecheck (9 packages),
lint (all lintable workspaces), 805 unit tests site-wide (805 web /
107 files, up from 803/107), 198 script tests / 72 suites
(unchanged), 78 data records / cross-refs resolve (unchanged), a
clean build across all canonical routes, homepage bundle 108.7 KB /
200 KB (unchanged), and 1131/1131 e2e (unchanged). Deploy is `READY`
at HEAD (`54a125f3`, `dpl_DYh5bVuZ`).

`plan/CRITIQUE.md` is now **91 days / 2130 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`). Diagnosis
unchanged: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner; `.github/workflows/march.yml` explicitly
skips it), and every commit this window again carries the
`Cloud-Run:` trailer. `plan/PHASE_CANDIDATES.md` holds **23 pending
rows + 1 needs-user-call**, unchanged in count (passes 300/301
edited existing rows' scope notes rather than adding new ones),
**56 days** since the last promotion (2026-06-14, phases 46-49).
`plan/AUDIT.md` carries **1 open row** (the standing `[4.0]`
Lighthouse-CI row) plus **3 more `/oversight`-gated or blocked
rows**, unchanged from yesterday. Two fresh loop-opened GitHub
issues from this window's audit sweeps — `#789` (CannonKeys tracker
dropout) and `#799` (Ramune week-count) — were mirrored to GitHub
but not picked for a same-tick fix and carry **no corresponding
`plan/AUDIT.md` Pending row**; see "Needs you" below.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-08 11:12 | expand | pass 299 — no candidates (`70091d28`) |
| 08-08 12:27 | iterate | a11y — vendor "inactive" badge WCAG-AA contrast `[3.6]` (`1619b9ac`/`29109a54`, closes #786) |
| 08-08 13:44 | iterate | content — Cherry/GMK ownership claim, 2 articles + 12 weeks trends `[4.0]` (`72ddac23`/`90329819`, closes #787) |
| 08-08 14:31 | iterate | data — trends W31 GMK CYL TA Neo tracker linkage `[4.0]` (`55fa6096`/`361d5e4e`, closes #788) |
| 08-08 15:17 | audit | issue #789 mirrored (CannonKeys tracker dropout) — not picked for a fix this window |
| 08-08 16:28 | iterate | content — keyboard-acoustics-deep-dive HMX Cloud "all-PC" claim `[5.4]` (`a6c6c4fb`/`0b4032a6`, closes #790) |
| 08-08 18:30 | iterate | content — cherry-xtrfy-tmr-pivot tracker score mischaracterized as monotonic decline `[3.6]` (`3eb6993c`/`6ebc4ae1`, closes #791) |
| 08-08 19:33 | iterate | content/data — trends W21-W28 Cherry brand notes still attributed to GMK `[6.3]` (`149ae289`/`8530ac6a`, closes #792) |
| 08-08 22:33 | iterate | a11y — global-error.tsx crash boundary missing role="alert" `[3.6]` (`943b36eb`/`3c2224cd`, closes #793) |
| 08-08 23:24 | iterate | content/data — trends W19-W20 Cherry brand row same residue `[5.4]` (`8c0695b7`/`e9e6062e`, closes #794) |
| 08-09 00:23 | expand | pass 300 — no new candidates; strengthened trend-snapshot quality-gate candidate (`1dd77058`) |
| 08-09 03:05 | iterate | content — hall-effect-mainstream false Mode Sonnet R2 HE claim `[4.55]` (`672b1703`/`3a23ba2b`, closes #795) |
| 08-09 05:00 | iterate | data — novelkeys vendor HQ Indianapolis → Morgantown, WV `[5.4]` (`1c4246b0`/`42a1b799`, closes #796) |
| 08-09 06:33 | expand | pass 301 — no new candidates; strengthened internal-consistency-checker candidate (`c362c91a`) |
| 08-09 07:54 | iterate | content — computex-2026-keyboard-highlights HE streak undercounted 2 weeks `[3.6]` (`e2337ae9`/`effd0d8d`, closes #797) |
| 08-09 08:29 | iterate | data — 2026-W32 trend snapshot Kickstarter week-count overcount `[4.8]` (`666be6e1`/`4d9c8612`, closes #798) |
| 08-09 09:30 | iterate | content — thock-weekly-006 stale "third week" Kickstarter overcount `[3.6]` (`747a6b79`/`54a125f3`, same fact as #798, second surface) |
| 08-09 10:18 | audit | issue #799 mirrored (Ramune week-count miscount) — not picked for a fix this window |

24 `march`-workflow runs since 2026-08-08T10:59:21 UTC: **24
`success`, 0 `failure`, 0 `cancelled`** — a fully clean window, no
GH Actions infra hiccups. `heartbeat` (4 runs) and `night` (1 prior
run) both green throughout, no wedged-run alerts. 16 ticks produced
a commit (13 fixes + 3 expand passes); the remaining 8 runs were
no-ops.

## Shipped

- **content fact-checks (7)**: Cherry/GMK ownership claim corrected
  across 2 articles + the then-current 12 weeks of trends data, then
  found incomplete twice more (W21-W28, then W19-W20 — the original
  fix's stated week range didn't cover the row's full appearance
  window, the same "fix understated its own scope" shape seen
  earlier this week on other clusters); keyboard-acoustics-deep-dive
  called the HMX Cloud "an all-PC switch" against the catalog and
  the site's own dedicated HMX Cloud deep dive; cherry-xtrfy-tmr-pivot
  mischaracterized a tracker score's recovery-after-dip shape as a
  monotonic decline; hall-effect-mainstream falsely claimed the Mode
  Sonnet R2 has a Hall-effect option, contradicted by two sibling
  articles and the board's own data record; computex-2026-keyboard-
  highlights undercounted the HE tracker streak by 2 weeks;
  thock-weekly-006 still said "third week" for the V6 Ultra HE
  Kickstarter after the same fact had already been corrected to
  "second week" on the trends snapshot earlier the same window.
- **data (2)**: trends W31 — linked the GMK CYL TA Neo row to its
  companion article; novelkeys vendor description — wrong HQ city
  (Indianapolis, real HQ Morgantown, WV) rendered verbatim across 4
  live surfaces including JSON-LD.
- **a11y (2)**: vendor "inactive" status badge failed WCAG AA
  contrast; `global-error.tsx` — the one crash boundary a prior
  10-file `role="alert"` sweep's own `find apps/web/src/app
  -name "error.tsx"` pattern structurally couldn't match (the
  root-layout boundary is named `global-error.tsx`, not
  `error.tsx`).
- **expand**: 3 passes (299-301), all zero-new-candidate. Passes 300
  and 301 each used this window's fresh fact-check evidence to
  strengthen an existing candidate's scope note (trend-snapshot
  data-quality gate; article internal-consistency checker) rather
  than filing duplicates — the meta-loop reading its own commit
  pattern correctly instead of over-firing.

## Queues now

- **Build plan**: 0 pending phases (51 shipped), unchanged.
- **Cross-link drain**: 0 pending rows, unchanged.
- **`plan/AUDIT.md`**: **1 open row** (961 `[x]` rows now, up from
  948 — 13 findings closed this window) plus 3 more standing
  `/oversight`-gated or blocked rows, unchanged from yesterday:
  `[6.3]` march.yml crash-gate (blocked-cloud-permission, issue
  #395, filed 2026-07-05); `[4.0]` Lighthouse-CI disabled (filed
  2026-07-18, still `disabled_manually`); `[needs-user-call] [4.2]`
  soft-404 structurally blocked (issue #533, filed 2026-07-18);
  `[4.0]` heartbeat.yml dedup (blocked-cloud-permission, issue #620,
  filed 2026-07-26).
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **91 days / 2130 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  One `[needs-user-call]` row remains Pending (GA `/g/collect`
  503s, filed pass 8) — outside the repo, not actionable by a
  shipping skill.
- **`plan/PHASE_CANDIDATES.md`**: **23 pending rows + 1
  needs-user-call**, unchanged in count from yesterday. **56 days**
  since the last promotion (2026-06-14, phases 46-49). Top of the
  cluster remains three `7.0`s (trend-snapshot data-quality gate,
  automated content-fact-vs-catalog numeric-spec audit, article
  internal-consistency checker) — this window's 7 content
  fact-checks are fresh, repeated evidence for the first two of
  those three.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged.
- **Triage**: **19 open issues**, 0 unlabeled — up from 17. Net +2:
  13 issues opened and closed same-window for this window's 13
  fixes, plus 2 new issues opened by audit sweeps but not drained
  (`#789`, `#799` — see "Needs you"). Four `triage:needs-user`
  issues remain standing, ages unchanged in kind: `#756` (3 days
  old), `#639` (12 days old), `#499` (24 days old), `#434` (30 days
  old). Orphaned duplicate `#719` (MobileNav focus-containment,
  fixed weeks ago by `6ef381e3`) remains open, unchanged. The
  8-issue `deep-dives` content-gap cluster (`#414`-`#422`, filed
  2026-07-08) remains open and unchanged — already routed to
  existing Pending candidates per prior expand-pass audits, not a
  fresh finding.
- **Expand cadence**: 3 passes this window (299-301), all
  zero-new-candidate (2 of 3 strengthened existing rows instead).
  Normal cadence, no starvation signal.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential
blocking legs (typecheck → lint → test:run → test:scripts →
data:validate → build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next
  lint` — still flags its own deprecation ahead of Next.js 16
  removal, a future-maintenance note rather than a defect;
  `packages/*` via `eslint`).
- `test:run` — green, 805 web unit tests (107 test files, up from
  803/107 — the new global-error.tsx role="alert" assertion).
- `test:scripts` — green, 198 tests / 72 suites, unchanged.
- `data:validate` — green, 78 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 16 group-buys, 14
  trends) — unchanged, no new catalog entries this window.
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1131/1131** (~7.8m, single worker), unchanged.
  Server stderr again logged `NoFallbackError` several dozen times
  against the five `dynamicParams = false` routes (`/part/[kind]`,
  `/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
  `/newsletter/[slug]`) — same non-blocking shape flagged in recent
  digests, Next's expected internal log for not-found-page e2e tests
  hitting a param outside the pre-generated set. Every one of the
  1131 tests still passed.
- `pnpm deploy:check` at HEAD (`54a125f3`) — deploy `READY`
  (`dpl_DYh5bVuZ`).
- `lighthouse` — `gh run list --workflow lighthouse` still can't
  resolve the disabled workflow by display name (known quirk, use
  `--workflow lighthouse.yml` or `gh workflow list` instead); state
  remains `disabled_manually`, same standing `[4.0]` AUDIT row, no
  new signal this window.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New this window: two loop-opened GitHub issues with no
   `plan/AUDIT.md` Pending row.** `#789` (CannonKeys tracker
   dropout — the tracker stopped rowing CannonKeys after W27 despite
   a live, editorially-covered group buy running W28-W32) and `#799`
   (2026-W23 GMK CYL Ramune row miscounts a five-week buy window as
   four weeks) were both mirrored to GitHub during this window's
   audit sweeps but weren't the tick's top-scored pick, so no fix
   shipped and — unlike every other finding this window — neither
   left a durable `plan/AUDIT.md` row behind. Since `/iterate`'s
   Step 1 reads `plan/AUDIT.md` for pending work (not open GitHub
   issues directly), these two will only get drained if a future
   sweep happens to rediscover the same defect independently.
   Cheap to fix by hand (both have a stated one-line "suggested
   fix" in the issue body), or worth a small process note so
   mirrored-but-unpicked findings leave a Pending row too.
2. **Standing: `/critique` is 91 days / 2130 commits stale.** The
   diagnosis has been unchanged for weeks — cloud mode
   architecturally cannot reach `/critique` (no Chrome MCP on the
   runner). Needs a decision: accept `/critique` as local-only
   ritual, find a cloud-compatible path, or retire the gate
   formally.
3. **Standing, growing: the `/oversight` promotion backlog.** 23
   pending candidates + 1 needs-user-call, now **56 days** since the
   last promotion. Three candidates sit at `7.0`; this window's 7
   content fact-checks are fresh, repeated evidence for two of them
   (trend-snapshot data-quality gate, content-fact-vs-catalog
   numeric-spec audit).
4. **Standing, unclosed: orphaned duplicate GitHub issue `#719`.**
   Still open; the MobileNav focus-containment defect it names was
   fixed weeks ago by `6ef381e3` (closed via a different issue,
   `#722`). Cheap to close by hand.
5. **Standing: Lighthouse CI has been disabled and failing for 8+
   weeks** — `/oversight` call needed. Unchanged since last digest.
6. **Standing: four unresolved `triage:needs-user` GitHub issues.**
   `#756` (3 days old), `#639` (12 days old), `#499` (24 days old,
   not self-resolved), `#434` (30 days old, not self-resolved).
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
`/oversight`-gated). The two mirrored-but-undrained issues (`#789`,
`#799`) are the most concrete near-term targets — either lands as a
one-line data fix if a tick picks it up, or the `/oversight` pass
below can knock both out by hand in minutes. Otherwise the next
`/march` tick will most likely repeat this window's pattern: a fresh
reactive `/iterate` fix off a general-purpose sweep, or another
`/expand` pass. The highest-leverage next move isn't a new fix —
it's an `/oversight` pass covering, in one sitting: the two orphaned
issues above, the standing 23-row candidate cluster (three `7.0`s,
now 56 days stale, with fresh evidence from this window), the
Critique-gate decision (now past 90 days), the Lighthouse re-enable
decision, the two blocked workflow-permission fixes, and (small)
closing the orphaned `#719` duplicate issue by hand.

## Tuning proposals

None new this pass. 24/24 `march` runs succeeded this window — a
fully clean stretch, no infra incidents to weigh against a ceiling
or ratio. `/expand`'s 3 passes (299-301, all zero-new-candidate but
2 of 3 strengthened existing rows with fresh evidence) is within
normal cadence, not starvation, and shows the meta-loop correctly
avoiding duplicate filings. The one new process observation this
window — mirrored-but-unpicked GitHub issues (`#789`, `#799`)
leaving no `plan/AUDIT.md` trace — is filed under "Needs you" as a
concrete, small fix rather than a gate-tuning proposal; it's a
one-off procedural gap in how Step 2.5's issue-mirroring interacts
with a tick that doesn't ship the mirrored finding, not evidence of
a mistuned cadence, ceiling, or posture. The critique-gate
staleness (now 91 days), the 23-row `/oversight` backlog, and the
four standing `triage:needs-user` issues remain standing,
already-diagnosed decisions awaiting a human call, not new tuning
signals — all covered under Needs you rather than re-proposed here.
