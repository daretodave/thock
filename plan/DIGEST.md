# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean 23h19m, 23-commit window — 30/30 `march` runs green — but
the sitewide focus-visible defect class hit two more instances
overnight (11th, 12th) neither of which the last `/expand` pass
(225, 05:24 UTC) has folded into its candidate yet, and the same
content-fact-vs-catalog / self-contradiction failure shape hit the
gmk-cyl-selene article family twice in one day plus a second
newsletter tracker-claim miss (7th instance of that standing
candidate).** Since the last digest (`dc292750`, 2026-07-24T11:27:26Z)
the loop landed 23 commits: 9 fix/content/a11y+audit-drain pairs (a
tracker riser/faller flat-row mislabel, two separate gmk-cyl-selene
fulfillment-estimate self-contradictions on the same article family
hours apart, two newsletter tracker-claim corrections — issues 003
and 004 — a postcss CVE override bump, two more focus-visible ring
sweeps covering 6+18+5 elements across shared components and
route-level nav links, and an SEO fix dropping a nonexistent PCB
field from the compare/board OG tagline), 4 `/expand` passes
(222–225: 222 and 225 each updated a standing candidate in place with
a new instance, 223–224 were zero-diff windows), and 1 manifest
regeneration chore. This tick's own fresh `pnpm verify` is green
across all seven legs: typecheck (8 packages), 700 web unit tests /
97 files (up from 697), 168 script tests / 61 suites (unchanged), 74
data records (cross-refs resolve, unchanged), build — all canonical
routes generated, homepage bundle 108.7 KB / 200 KB (unchanged), and
**1074/1074 e2e** (unchanged). Deploy is `READY` at HEAD (`f186d659`).

`plan/CRITIQUE.md` is still **76 days / 1664 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis from prior digests: cloud mode architecturally cannot reach
`/critique` (no Chrome MCP on the runner), and every commit in this
window again carries the `Cloud-Run:` trailer, so the gap keeps
growing by construction until a human decision lands.
`plan/PHASE_CANDIDATES.md` holds at **18 pending rows + 1
needs-user-call** (unchanged count — this window's two updates landed
in existing rows), now **44 days** since the last promotion
(2026-06-11, phases 43/44/45). No `march` runs failed this window
(30/30 green).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-24 13:53 | iterate | fix — tracker summary riser/faller can mislabel a flat row as moving `[5.4]` (`d63e2890`/`bdaa62ac`) |
| 07-24 14:55 | iterate | content — gmk-cyl-selene-group-buy fulfillment estimate contradicts its own stated rule `[5.4]` (`3efb8c80`/`700c7660`) |
| 07-24 16:52-16:53 | iterate | content — newsletter 003 Hall Effect tracker recap cites a fabricated figure `[5.4]` (`1f9d70fc`/`4f47af8d`) |
| 07-24 17:51-17:52 | iterate | content — gmk-cyl-selene data records still cite Q4 2026 fulfillment `[5.4]` (`065f1fe6`/`30fbf21f`) |
| 07-24 18:41 | expand | pass 222 — no new candidates, 2 candidates updated in place |
| 07-24 19:44 | expand | pass 223 — no candidates (zero-diff window) |
| 07-24 20:36 | expand | pass 224 — no candidates (zero-diff window) |
| 07-25 00:50 | iterate | content — newsletter 004 Cherry MX2A tracker claim contradicts archive `[3.6]` (`d82846bf`/`bc0986da`) |
| 07-25 05:23 | chore | regenerate manifests stale since `d82846bf` (`415831a8`) |
| 07-25 05:24 | expand | pass 225 — 1 candidate updated in place (7th instance, content-fact-vs-catalog) |
| 07-25 08:02 | iterate | a11y — focus-visible ring on 6 more shared components, 11th instance `[6.4]` (`cd3c85d6`/`f3f68545`) |
| 07-25 09:08-09:09 | iterate | fix — postcss override bumped for GHSA-r28c-9q8g-f849 `[5.4]` (`6b39356d`/`d0b85135`) |
| 07-25 09:51 | iterate | a11y — focus-visible ring on home/tools/parts/tags/tracker links, 12th instance `[6.3]` (`94614c58`/`abbaaf67`) |
| 07-25 10:46 | iterate | seo — compare/board OG tagline drops nonexistent PCB field `[3.6]` (`4454038b`/`f186d659`) |

23 commits total in the window (~23h19m, `dc292750` → `f186d659`).
All 30 `march`-workflow runs since 2026-07-24T01:34 UTC report
`success` — no crash-issue-gate recurrence this window.

## Shipped

- **a11y**: 2 more focus-visible ring sweeps — 6 shared components
  (11th instance) and 18 route-level nav links across home/tools/
  parts/tags/tracker (12th instance). Same recurring defect class the
  standing `[6.5]` candidate tracks, now at **12 cumulative
  instances** — 2 landed after the candidate's last update (pass 225,
  05:24 UTC), so the candidate file still reads 10.
- **content**: 4 fixes across 2 recurring failure shapes —
  gmk-cyl-selene-group-buy's fulfillment estimate contradicted its
  own stated rule, then (3 hours later, same day) two `data/`
  records were found still citing the same stale Q4 2026 figure the
  prose fix had already corrected; newsletter 003's Hall Effect
  tracker recap cited a fabricated "62 eight weeks ago" figure, and
  newsletter 004's Cherry MX2A recap miscounted its decline streak as
  eight weeks when the real unbroken run is five. The newsletter
  pair is the 6th and 7th instances of the standing `[7.0]`
  content-fact-vs-catalog candidate; the gmk-cyl-selene pair matches
  the sibling `[7.0]` article-internal-consistency candidate (5th
  instance, expand pass 222).
- **fix**: tracker summary riser/faller helper could mislabel a flat
  week-over-week row as "moving"; postcss dependency override bumped
  for GHSA-r28c-9q8g-f849.
- **seo**: compare/board OG tagline no longer references a
  nonexistent PCB field.
- **expand**: 4 passes (222–225). Pass 222 updated the article-
  internal-consistency candidate (5th instance) and the content-fact-
  vs-catalog candidate (6th instance) in place; 223–224 were zero-diff
  windows; 225 updated the content-fact-vs-catalog candidate again
  (7th instance, the newsletter-004 fix).
- **chore**: manifest regeneration, stale since the newsletter-004
  content commit.

## Queues now

- **Build plan**: 0 pending phases (51 shipped, unchanged) — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged — every
  `[cross-links]`-category AUDIT row is `[x]`.
- **`plan/AUDIT.md`**: 1 open row + 1 needs-user-call, unchanged from
  several digests running: `[4.0]` Lighthouse-CI disabled (still
  `next: /oversight call`) and `[needs-user-call]` `[4.2]` the
  `/article/[slug]`/`/tag/[slug]` soft-404 fix being structurally
  blocked (real-404-status vs. "did you mean" UX are mutually
  exclusive under current Next.js routing — investigated and
  reverted same-tick on 2026-07-18, no further autonomous action
  possible). Every other finding this window was filed and drained
  same-tick.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **76 days / 1664 commits stale.** Diagnosis
  unchanged from prior digests: cloud mode architecturally cannot
  reach `/critique` (no Chrome MCP; every commit this window again
  carries `Cloud-Run:`). The standing `[6.5]` candidate remains a
  `[needs-user-call]` decision row.
- **`plan/PHASE_CANDIDATES.md`**: **18 pending rows + 1
  needs-user-call** (unchanged count — this window's updates landed
  in existing rows, not new ones), **44 days** since the last
  promotion (2026-06-11, phases 43/44/45). Top of the cluster: `[7.0]`
  trend-snapshot data-quality gate, `[7.0]` content-fact-vs-catalog
  numeric-spec audit (now 7 instances), `[7.0]` article internal-
  consistency checker (now 5 instances), `[6.5]` `/quiz/board`,
  `[6.5]` stale group-buy frontmatter/prose gate, `[6.5]` sitewide
  focus-visible default + coverage check (10 instances per the
  candidate file, 12 in reality per this window's commits).
- **`data/BACKLOG.md`**: 0 pending rows, unchanged.
- **Triage**: 12 open issues, unchanged shape — 0 unlabeled. 8
  duplicate content-gap issues (`#414-#416`, `#418-#422`) still await
  a manual consolidation pass (`#421` remains a *shipped* duplicate).
  Two `triage:needs-user` issues unresolved: `#434` (Vercel never
  ingested commit `e312e09`, now 15 days old) and `#499` (night
  digest crashed, now 9 days old). `#395` and `#437` are stable.
- **Expand cadence**: 4 passes this window (222: two candidates
  updated; 223–224: nothing; 225: one candidate updated) — all
  mechanical surveys ran clean every pass.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as seven sequential blocking
legs (typecheck → test:run → test:scripts → data:validate → build →
size → e2e) — all green:

- `typecheck` — green, all 8 workspace packages.
- `test:run` — green, 700 web unit tests (97 test files), up from
  697.
- `test:scripts` — green, 168 tests / 61 suites, unchanged.
- `data:validate` — green, 74 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 12
  trend weeks — unchanged).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1074/1074**, unchanged.
- `pnpm deploy:check` at HEAD (`f186d659`) — deploy `READY`.
- `lighthouse` — the `gh run list --workflow lighthouse` pulse
  command still can't resolve the disabled workflow by display name
  (a known quirk, not a new failure — see standing `[4.0]` AUDIT.md
  row). No new signal this window.

One non-blocking observation, repeated from the last several digests:
the e2e run's server stderr again logged `NoFallbackError` several
dozen times against the five `dynamicParams = false` routes
(`/part/[kind]`, `/part/[kind]/[slug]`, `/vendor/[slug]`,
`/trends/tracker/[week]`, `/newsletter/[slug]`) — this is Next's
expected internal log for the not-found-page e2e tests hitting a
param outside the pre-generated set, not a real failure. Every one of
the 1074 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New, sharpened: the focus-visible defect class is accelerating,
   not tapering — 12 instances now, 2 landed since the last `/expand`
   update.** The standing `[6.5]` candidate (shared `:focus-visible`
   default + mechanical coverage check) is unpromoted since
   2026-07-22. This window alone contributed 2 more reactive fixes in
   under 2 hours of each other. This remains the single highest-
   leverage promotion available.
2. **Standing, sharpened: two independent recurring content-accuracy
   failure shapes both grew this window.** The `[7.0]`
   content-fact-vs-catalog numeric-spec-audit candidate hit its 7th
   instance (2 newsletter tracker-claim misses in adjacent expand
   windows) and the `[7.0]` article-internal-consistency-checker
   candidate hit its 5th instance (gmk-cyl-selene's fulfillment math
   contradicting its own stated rule) — plus a same-day follow-up
   where the article-level fix didn't cascade to 2 `data/` records
   repeating the identical stale figure. Both candidates are fully
   scoped and awaiting `/oversight` promotion.
3. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 76 days / 1664 commits since pass 11. Cloud mode
   can't reach `/critique` (no Chrome MCP on the runner); every
   commit since 2026-07-03 has been cloud-only. Needs a decision:
   accept `/critique` as local-only ritual, find a cloud-compatible
   path, or something else.
4. **Standing: Lighthouse CI has been disabled and failing for 6+
   weeks — `/oversight` call needed.** Unchanged since last digest.
5. **Standing, growing: the `/oversight` promotion backlog.** 18
   pending candidates + 1 needs-user-call, now **44 days** since the
   last promotion. Three candidates sit at 7.0, several more at 6.5.
6. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (15 days old) and `#499` (9 days old). Neither self-
   resolved.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (the sole open row is
`/oversight`-gated, the other is `needs-user-call`). The next `/march`
tick will most likely repeat this window's pattern: another `/expand`
pass folding in the two un-logged focus-visible instances, or a fresh
reactive `/iterate` fix. The highest-leverage next move isn't a new
fix — it's an `/oversight` pass over the candidate cluster: the
focus-visible default (stops a 12-instance-and-accelerating drain
immediately), the two content-accuracy checker candidates (7 + 5
instances, fully scoped, would collapse several sweep-per-tick manual
verification passes into one script), and the Critique-gate decision.

## Tuning proposals

None new this pass. This window's dominant meta-loop signal — the
focus-visible defect class picking up 2 more instances in under 2
hours right after `/expand` pass 225 closed without seeing them — is
already fully captured by the existing `[6.5]` candidate; the right
action is promotion, not another candidate. Likewise the two
content-accuracy instances (newsletter 004, gmk-cyl-selene) landed in
already-Pending `[7.0]` candidates via passes 222 and 225. No
mistuned gate, cadence, or ceiling surfaced this window beyond what
prior digests have already flagged.
