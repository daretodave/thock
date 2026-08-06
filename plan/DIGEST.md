# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23.7h window — 22 `march` runs, 21/22 success (1 transient
Anthropic-API 529 overload, self-recovered next tick), 17
substantive ticks (13 shipped fixes/content + 4 `expand` passes) and
the rest no-ops, for 30 commits total.** Since the last digest
(`61c8aa01`, 2026-08-05T11:33:02 UTC) the loop drained 16
`plan/AUDIT.md` findings — all but one self-discovered by fresh
general-purpose `/iterate` sweeps (no pending build-plan phase, data
backlog, or cross-link work exists to draw from; every tick ran a
from-scratch audit angle): a content fact-check
(hmx-cloud-deep-dive's lede overstated its W19 tracker rank), a quiz
scoring-boundary fix (spring-weight thresholds didn't match the
displayed copy), a canonical-URL contradiction (the compare tool's
metadata disagreed with its own populated-state content), two
`mentionedParts` gaps on freshly-shipped articles (buckling-spring-
deep-dive, gazzew-boba-u4t-deep-dive — the same short-name blind
spot already fixed twice before this window), an off-by-one
(group-buy-status-check mishandled a buy's final valid day), an SEO
cap fix (archive ItemList JSON-LD now caps at 50 of 76 articles), a
content-gap dispatch that filed and shipped an ideas article
("The Holee mod") in the same tick, 4 cross-link pairs drained on
the holee-mod-explained hub, a rolling-latest canonicalization gap
(the search index disagreed with sitemap.ts and the tracker page's
own metadata on which URL the latest week canonicalizes to — the
same bug class already proposed as a standing `[5.0]`
"Rolling-latest-window consistency check" candidate), a metadata
overclaim (`/vendors`' description promised editorial coverage no
vendor page renders), and a newsletter numeric fact-check
(thock-weekly-006 paired the wrong historical week with the wrong
tracker score). One more commit closed a 16th row outside the usual
audit-pair pattern: `a2bf09de` closed a fresh `pnpm audit` DoS
advisory (GHSA-rgw5-rvv9-x895) that bypassed the prior
brace-expansion pin — the old ranged-key override syntax never
actually matched minimatch's declared specifier, so it wasn't
forcing the resolution it claimed to; consolidated to one
unconditional `"brace-expansion": ">=5.0.9"` override, `pnpm audit`
now clean. `/expand` ran 4 passes (286-289), all zero-candidate —
normal cadence, not starvation (4 consecutive since pass 285's last
filing). This tick's own fresh `pnpm verify` is green across all
eight legs, run as sequential foreground blocking calls: typecheck
(9 packages), lint (all lintable workspaces), 946 unit tests
site-wide (789 web / 106 files, up from 787/106; 157 content / 24
files, unchanged), 182 script tests / 65 suites (up from 179/65),
76 data records / cross-refs resolve (unchanged), build — all
canonical routes generated, homepage bundle 108.7 KB / 200 KB
(unchanged), and 1128/1128 e2e (up from 1123/1123, +5). Deploy is
`READY` at HEAD (`a2bf09de`, `dpl_HasYy3k8`).

`plan/CRITIQUE.md` is now **88 days / 2039 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner; `.github/workflows/march.yml` explicitly
skips it), and every commit this window again carries the
`Cloud-Run:` trailer, so the gap keeps growing by construction until
a human decision lands. `plan/PHASE_CANDIDATES.md` holds **22
pending rows + 1 needs-user-call**, unchanged (0 new candidates this
window — all 4 expand passes returned zero), now **53 days** since
the last promotion (2026-06-14, phases 46-49). `plan/AUDIT.md`
carries **4** open rows, all `/oversight`-gated or blocked, not
actionable by an autonomous tick — unchanged from yesterday: the
march.yml `[6.3]` crash-gate row, the Lighthouse-CI `[4.0]` row, the
soft-404 `[needs-user-call]` `[4.2]` row, and the heartbeat.yml
`[4.0]` row. One transient failure this window (API overload,
self-recovered) and one transient Vercel-side deploy-webhook drop
(also self-recovered, now the third recorded instance of that
class — see Needs you).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-05 11:33 | digest | 2026-08-05 |
| 08-05 11:55 | iterate | content — hmx-cloud-deep-dive lede overstated W19 tracker rank `[5.4]` (`c13cf993`/`03f27738`) |
| 08-05 13:55 | expand | pass 286 — 0 candidates filed (`f8178739`) |
| 08-05 16:47 | expand | pass 287 — 0 candidates filed (`5784d143`) |
| 08-05 17:53 | iterate | fix — quiz spring-weight scoring boundaries match displayed copy `[4.0]` (`f1c5283d`/`bb2fdb50`) |
| 08-05 18:39 | expand | pass 288 — 0 candidates filed (`05c78815`) |
| 08-05 19:58 | iterate | seo — compare tool canonical URL contradicts populated-state content `[4.8]` (`fca39d2c`/`ab0dace0`) |
| 08-05 21:45 | iterate | content — buckling-spring-deep-dive mentionedParts gap `[5.4]` (`2732415c`/`3e51ed7a`) |
| 08-05 22:45 | iterate | fix — group-buy-status-check off-by-one on a buy's final valid day `[5.4]` (`8682ca85`/`eafb0243`) |
| 08-05 23:50 | iterate | seo — archive ItemList JSON-LD caps at 50 of 76 articles `[3.6]` (`a436a626`/`0275ce31`) |
| 08-06 00:28 | march | failed — Anthropic API 529 overload, no commit; self-recovered next tick |
| 08-06 00:30 | audit | content-gap row auto-filed, dispatch opened `#753` (`5a5542e0`/`2390ecb7`) |
| 08-06 00:53 | iterate | content — ideas: "The Holee mod: what foam inside the switch actually buys you" (`99d331bc`/`89aeba13`) |
| 08-06 01:34 | march | no-op — nothing additionally actionable this tick |
| 08-06 01:48 | iterate | content — holee-mod-explained cross-links, 4 pairs drained `[4.5]×4` (`823b0a2e`/`feb10942`) |
| 08-06 03:03 | march | no-op — nothing additionally actionable this tick |
| 08-06 03:23 | iterate | content — gazzew-boba-u4t-deep-dive mentionedParts gap `[5.4]` (`bb24a5ea`/`b12917fa`) — deploy:check webhook drop, filed `#756`, self-recovered by next tick |
| 08-06 05:03 | march | no-op — nothing additionally actionable this tick |
| 08-06 07:26 | iterate | seo — search index promotes latest tracker week to non-canonical URL `[4.0]` (`ed35bca4`/`77dccbc3`) |
| 08-06 08:19 | iterate | seo — vendors index metadata stops overclaiming editorial coverage `[3.6]` (`5939a3b2`/`1e0afbda`) |
| 08-06 09:12 | expand | pass 289 — 0 candidates filed (`0eb75354`) |
| 08-06 10:20 | iterate | content — thock-weekly-006 W32 tracker recap misstated Hall Effect score `[4.5]` (`07b81d96`/`d4a0b17c`) |
| 08-06 11:17 | fix | brace-expansion override stale — new DoS advisory GHSA-rgw5-rvv9-x895 bypasses pin (`a2bf09de`), closes `#760` |

22 `march`-workflow runs since 2026-08-05T11:33:02 UTC: **21
`success`, 1 `failure`** (transient Anthropic API 529, cleared on
the very next tick, no commit lost).

## Shipped

- **content/seo fact-checks + gaps (7 fixes)**: hmx-cloud-deep-dive's
  lede overstated its W19 rank; two `mentionedParts` gaps on
  freshly-shipped articles (buckling-spring-deep-dive,
  gazzew-boba-u4t-deep-dive — third and fourth recorded instance of
  the short-name blind spot in `article-parts-check.mjs`);
  thock-weekly-006's W32 tracker recap paired the wrong week with the
  wrong historical score; `/vendors` metadata overclaimed a feature
  no vendor page renders; the compare tool's canonical URL
  contradicted its own populated-state content; the search index
  promoted the latest tracker week to a non-canonical URL, disagreeing
  with sitemap.ts and the page's own metadata (a fourth instance of
  the "rolling latest" canonicalization gap already tracked as a
  standing `[5.0]` phase candidate).
- **content-gap dispatch**: filed a backlog row, opened `#753`, then
  shipped the ideas piece "The Holee mod: what foam inside the switch
  actually buys you" in the same tick — closing the gap, then 4 fresh
  cross-link pairs on the new article's hub in the tick right after.
- **fix (2)**: quiz spring-weight scoring boundaries brought in line
  with displayed copy; group-buy-status-check off-by-one on a buy's
  final valid day.
- **seo (1)**: archive ItemList JSON-LD now caps at 50 of 76 articles
  (was emitting all 76, oversized for the schema's intended use).
- **engineering/security (1)**: `pnpm audit` DoS advisory
  GHSA-rgw5-rvv9-x895 closed — the prior brace-expansion pin's
  ranged-key override syntax never actually matched minimatch's
  declared specifier, so the mitigation from the earlier
  CVE-2026-14257 fix wasn't being enforced. Consolidated to one
  unconditional override; `pnpm audit` now reports 0 vulnerabilities
  (was 1 high, devDependencies-only, no production exposure either
  way).
- **expand**: 4 passes (286-289), all zero-candidate — fresh
  general-purpose sweeps found nothing above the 3.0 bar. Normal
  cadence, not starvation.

## Queues now

- **Build plan**: 0 pending phases (51 shipped), unchanged — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged (holee-mod-explained's
  4 pairs drained same-window as its content-gap ship).
- **`plan/AUDIT.md`**: **4 open rows** (924 addressed, up from 908 —
  16 findings closed this window). `[6.3]` march.yml crash-gate
  (blocked-cloud-permission, filed 2026-07-05); `[4.0]` Lighthouse-CI
  disabled (filed 2026-07-18, confirmed still `disabled_manually` via
  `gh workflow list`); `[needs-user-call] [4.2]` soft-404 structurally
  blocked (filed 2026-07-18); `[4.0]` heartbeat.yml dedup
  (blocked-cloud-permission, filed 2026-07-26). All four unchanged
  from yesterday.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **88 days / 2039 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  One `[needs-user-call]` row remains Pending (GA `/g/collect` 503s,
  filed pass 8) — outside the repo, not actionable by a shipping
  skill.
- **`plan/PHASE_CANDIDATES.md`**: **22 pending rows + 1
  needs-user-call**, unchanged (0 new candidates this window — all 4
  expand passes returned zero), **53 days** since the last promotion
  (2026-06-14, phases 46-49). Top of the cluster: three `7.0`s
  (trend-snapshot data-quality gate, automated
  content-fact-vs-catalog numeric-spec audit, article
  internal-consistency checker — all still unshipped); a `6.5`
  cluster follows (`/quiz/board`, stale group-buy frontmatter/prose
  gate, sitewide focus-visible coverage check). Notably, this
  window's own fixes are fresh evidence for existing Pending
  candidates without needing a new row (correct per §4A): the
  rolling-latest search-index gap reinforces the standing `[5.0]`
  "Rolling-latest-window consistency check" candidate (now its 4th
  documented instance on that route family), and the two
  mentionedParts gaps reinforce the recurring short-name blind spot
  already known to `article-parts-check.mjs`.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work).
- **Triage**: **16 open issues**, 0 unlabeled. One new issue this
  window: `#756` (Vercel deploy-webhook drop on the gazzew-boba-u4t
  tick, `triage:needs-user`, self-recovered — deploy:check confirmed
  `READY` at HEAD within the hour). `#760` (the security-fix issue)
  opened and closed same-commit. 8 duplicate content-gap issues
  (`#414-#422` minus `#417`) still await a manual consolidation pass,
  unchanged. Four `triage:needs-user` issues remain open: `#756`
  (new), `#639`, `#499`, `#434` (see Needs you). `#719` (orphaned
  duplicate, underlying defect already fixed) is still open,
  unchanged from prior digests.
- **Expand cadence**: 4 passes this window (286-289), all
  zero-candidate. 4 consecutive since pass 285's last filing — normal
  cadence, no starvation signal (the digest's own bar for concern is
  "dozens" of consecutive no-candidate passes).

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential blocking
legs (typecheck → lint → test:run → test:scripts → data:validate →
build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next lint`
  — still flags its own deprecation ahead of Next.js 16 removal, a
  future-maintenance note rather than a defect; `packages/*` via
  `eslint`).
- `test:run` — green, 789 web unit tests (106 test files, up from
  787/106); 157 content tests (24 files, unchanged). 946 unit tests
  site-wide.
- `test:scripts` — green, 182 tests / 65 suites (up from 179/65).
- `data:validate` — green, 76 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 14
  trend weeks — all unchanged). 77 articles (up from 76 — "The Holee
  mod" ideas piece).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1128/1128**, up from 1123/1123 (~8.0m, single
  worker). Server stderr again logged `NoFallbackError` several dozen
  times against the five `dynamicParams = false` routes (`/part/[kind]`,
  `/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
  `/newsletter/[slug]`) — same non-blocking shape flagged in recent
  digests, Next's expected internal log for not-found-page e2e tests
  hitting a param outside the pre-generated set. Every one of the
  1128 tests still passed.
- `pnpm deploy:check` at HEAD (`a2bf09de`) — deploy `READY`
  (`dpl_HasYy3k8`).
- `lighthouse` — confirmed via `gh workflow list`: `state:
  disabled_manually`, same standing `[4.0]` AUDIT row, no new signal
  this window.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New, self-recovered: third recorded Vercel deploy-webhook drop,
   `#756`.** Same class as `#639` (2026-07-28) and `#434`
   (2026-07-10) — a correctly configured GitHub↔Vercel integration
   (confirmed via direct Vercel API query) whose webhook silently
   didn't fire for one push (`bb24a5ea`/`b12917fa`); `deploy:check`
   timed out twice over ~20 minutes, then the next deploy landed
   normally. No in-repo remediation exists (no dashboard/webhook
   access from the autonomous loop). Third occurrence in a month
   (07-10, 07-28, 08-06 — roughly every 2-3 weeks) is enough of a
   pattern to warrant an `/oversight` look: either a Vercel-side
   support ticket, or a documented retry/backoff convention in
   `deploy:check` itself so a lone webhook drop doesn't file a fresh
   GitHub issue each time it happens.
2. **Standing, unclosed: orphaned duplicate GitHub issue `#719`.**
   Still open; the MobileNav focus-containment defect it names was
   fixed same-day by `6ef381e3` weeks ago (closed via a different
   issue, `#722`). Cheap to close by hand
   (`gh issue close 719 -c "duplicate of #722, fixed by 6ef381e3"`).
3. **Standing, growing: the `/oversight` promotion backlog.** 22
   pending candidates + 1 needs-user-call, now **53 days** since the
   last promotion. Three candidates sit at `7.0` (trend-snapshot
   data-quality gate, content-fact-vs-catalog numeric audit, article
   internal-consistency checker) — this window's own fixes are live
   evidence for at least two of them (the numeric-fact-check class
   caught the thock-weekly-006 and hmx-cloud-deep-dive errors by
   hand; a mechanical gate would catch the next one before publish).
4. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 88 days / 2039 commits since pass 11. Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or something else.
5. **Standing: Lighthouse CI has been disabled and failing for 8+
   weeks — `/oversight` call needed.** Unchanged since last digest.
6. **Standing: four unresolved `triage:needs-user` GitHub issues.**
   `#756` (new, see item 1), `#639` (9 days old), `#499` (21 days
   old), `#434` (27 days old). The latter two have not self-resolved.
7. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`,
   heartbeat.yml `[4.0]`) — both fixes written and verified, neither
   can ship because the cloud push credential lacks `workflows` scope
   for `.github/workflows/*.yml` edits.
8. **Standing, out-of-repo: GA `/g/collect` 503s** — `plan/CRITIQUE.md`
   pass-8 `[needs-user-call]` row, unactionable by any shipping skill
   since the analytics property lives outside the codebase.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all four open rows
are blocked or `/oversight`-gated). The next `/march` tick will most
likely repeat this window's pattern: a fresh reactive `/iterate` fix
off a general-purpose sweep, or another `/expand` pass. The
highest-leverage next move isn't a new fix — it's an `/oversight`
pass covering, in one sitting: the standing 22-row candidate cluster
(three `7.0`s, now 53 days stale — two of them targeting exactly the
defect class this window's numeric fact-checks caught by hand), the
Critique-gate decision, the Lighthouse re-enable decision, the two
blocked workflow-permission fixes, the newly-recurring Vercel
deploy-webhook drop (item 1), and (small) closing the orphaned `#719`
duplicate issue by hand.

## Tuning proposals

None new this pass. 21/22 `march` runs succeeded this window (the
one failure was a transient Anthropic API 529, not a gate or ceiling
problem) — no crash-gate signal to add to. `/expand`'s 4 passes this
window (all zero-candidate, 4 consecutive since pass 285) is within
normal cadence, not starvation. No cron-gap evidence of the
commit/24h ceiling hibernating a productive stretch (runs landed
roughly hourly all window, 30 commits total). The critique-gate
staleness (88 days), the 22-row `/oversight` backlog, and the
now-third-instance Vercel deploy-webhook drop remain standing,
already-diagnosed decisions awaiting a human call, not new tuning
signals — all three are called out under Needs you rather than
re-proposed here.
