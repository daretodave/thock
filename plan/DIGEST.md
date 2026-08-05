# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A fully clean ~23.2h window — 22 `march` runs, 22/22 success, 19
substantive ticks (16 shipped fixes/content + 3 `expand` passes) and
3 no-ops, for 36 commits total.** Since the last digest (`72599c15`,
2026-08-04T11:44:42 UTC) the loop drained 16 `plan/AUDIT.md`
findings, all self-discovered by fresh general-purpose `/iterate`
sweeps (no pending build-plan phase, data backlog, or cross-link
work exists to draw from — every tick this window ran a from-scratch
audit angle): two dead/expiring citation-link fixes
(gmk-cyl-ta-neo-production-tracking's zFrontier link swapped for a
TLS-valid one; 60-percent-layout-history's misattributed
GeekHack-wiki ISO-60% claim corrected, plus a same-day ledger-
formatting follow-up on that row); a stale-copy cluster (gmk-cyl-og-
extensions-interest-check's Update callout mislabeled which week
closed the buy; group-buys/past's lede claimed a "freshest six" home-
rail behavior that had drifted; work-louder-openai-codex-micro's lede
still contradicted its own later Update callouts); an a11y gap (all
10 `error.tsx` boundaries gain `role="alert"`); a rendering gap (part
detail pages now render the outbound vendor link that was computed
but never wired to a template); a perf fix (InlineViz diagrams now
reserve layout space via a prebuild aspect-ratio manifest, closing a
CLS gap); two engineering hardening commits (`article-parts-check.mjs`
wired into march's own mechanical survey chain; the viz-manifest
generator now fails loud instead of silently skipping unparsable
SVGs); two seo fixes (`/article` + `/tag` routes now redirect non-
lowercase paths to canonical; sitemap tag entries now derive
`lastModified` from their tagged articles instead of the build
timestamp; article OG cards' font-size tiering fixed past 72-char
titles); a content-gap dispatch that filed and shipped "thock weekly
— issue 06" in the same tick; and the most severe finding of the
window — 75-percent-default.mdx's central thesis rested on a
fabricated "Sonnet 2026 refresh," corrected by re-anchoring the
article on KBD75 v3, a real in-catalog board already playing this
narrative role elsewhere in the corpus. `/expand` ran 3 passes
(283-285), all zero-candidate — a normal, non-alarming run (4
consecutive since pass 281's last filed candidate, well under the
"dozens" threshold this skill watches for). This tick's own fresh
`pnpm verify` is green across all eight legs, run as sequential
foreground blocking calls: typecheck (9 packages), lint (all
lintable workspaces), 1155 unit tests site-wide (787 web / 106
files, up from 774/105; 157 content / 24 files, up from 155; 3
tokens + 42 seo + 129 data + 31 ui + 6 e2e-fixtures, unchanged), 179
script tests / 65 suites (up from 175/64), 76 data records /
cross-refs resolve (unchanged), build — all canonical routes
generated, homepage bundle 108.7 KB / 200 KB (unchanged), and
1123/1123 e2e (up from 1118/1118, +5). Deploy is `READY` at HEAD
(`b21aca61`, `dpl_6U6PDDjv`).

`plan/CRITIQUE.md` is now **87 days / 2009 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner; `.github/workflows/march.yml` explicitly
skips it), and every commit this window again carries the
`Cloud-Run:` trailer, so the gap keeps growing by construction until
a human decision lands. `plan/PHASE_CANDIDATES.md` holds **22
pending rows + 1 needs-user-call**, unchanged (no new candidates
filed this window — all 3 expand passes returned zero), now **52
days** since the last promotion (2026-06-14, phases 46-49).
`plan/AUDIT.md` carries **4** open rows, all `/oversight`-gated or
blocked, not actionable by an autonomous tick — unchanged from
yesterday: the march.yml `[6.3]` crash-gate row, the Lighthouse-CI
`[4.0]` row, the soft-404 `[needs-user-call]` `[4.2]` row, and the
heartbeat.yml `[4.0]` row. No transient failures this window — a
fully clean run.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-04 11:46 | march | no-op — nothing additionally actionable this tick |
| 08-04 13:02 | iterate | content — gmk-cyl-ta-neo-production-tracking dead zFrontier citation repointed off an expired-TLS domain `[4.5]` (`28727d3a`/`a5804f49`) |
| 08-04 13:58 | iterate | content — 60-percent-layout-history misattributed ISO-60% GeekHack-wiki claim corrected `[4.4]` (`f825cc40`/`7b1aa9a2`) |
| 08-04 14:50 | march | no-op — nothing additionally actionable this tick |
| 08-04 15:52 | audit | ledger-formatting follow-up on the 60-percent-layout-history `[4.4]` row (`7521f350`) |
| 08-04 17:06 | iterate | content — gmk-cyl-og-extensions-interest-check Update callout mislabels which week closed the buy `[3.6]` (`1e316363`/`bbbcd479`) |
| 08-04 17:54 | iterate | enhancement — part detail pages render the outbound vendor link `[4.8]` (`81b4e291`/`b5acf05d`) |
| 08-04 19:04 | expand | pass 283 — 0 candidates filed (`3d2170c4`) |
| 08-04 19:59 | iterate | a11y — sitewide `error.tsx` boundaries gain `role="alert"` `[5.4]` (`74de277c`/`946f581c`) |
| 08-04 20:51 | iterate | content — group-buys/past lede's stale "freshest six" claim fixed `[4.5]` (`66767428`/`917301fb`) |
| 08-04 21:52 | iterate | perf — InlineViz diagrams reserve layout space via prebuild aspect-ratio manifest (CLS gap) `[3.6]` (`6e067569`/`f80b1560`) |
| 08-04 22:54 | iterate | engineering — `article-parts-check.mjs` wired into march's mechanical survey chain `[5.4]` (`83f1b350`/`9c356efd`) |
| 08-04 23:48 | iterate | seo — `/article` + `/tag` routes redirect non-lowercase paths to canonical `[4.0]` (`f40945b3`/`d742f60d`) |
| 08-05 00:34 | content dispatch | newsletter-gap-survey filed a backlog row + opened `#742`, then the same tick shipped "thock weekly — issue 06" (`8f46a84b`/`90267d9b`/`6a6459dd`/`77feecf0`, closes #742) |
| 08-05 01:34 | march | no-op — nothing additionally actionable this tick |
| 08-05 03:24 | iterate | content — work-louder-openai-codex-micro's lede fixed to stop contradicting its own Update callouts `[6.3]` (`dd46eb18`/`4c4b7f40`) |
| 08-05 05:37 | iterate | seo — article OG cards' font-size tiering fixed past 72-char titles `[4.2]` (`6e69868c`/`affa045d`) |
| 08-05 07:13 | iterate | engineering — viz-manifest generator fails loud on unparsable SVGs instead of silently skipping `[3.5]` (`a902d705`/`3185ee13`) |
| 08-05 08:08 | expand | pass 284 — 0 candidates filed (`bdc4175d`) |
| 08-05 09:16 | iterate | seo — sitemap tag entries derive `lastModified` from tagged articles instead of the build timestamp `[4.0]` (`4cb82f9f`/`0e1a8387`) |
| 08-05 10:26 | iterate | content — 75-percent-default's fabricated "Sonnet 2026 refresh" replaced with KBD75 v3, a real catalog anchor `[4.0]` (`191934db`/`2685d685`) |
| 08-05 11:05 | expand | pass 285 — 0 candidates filed (`b21aca61`) |

22 `march`-workflow runs since 2026-08-04T11:44:42 UTC: **22
`success`, 0 `failure`**.

## Shipped

- **content/seo (link-rot + stale-copy cluster, 5 fixes)**:
  gmk-cyl-ta-neo-production-tracking's zFrontier citation repointed
  off an expiring-TLS domain; 60-percent-layout-history's misattributed
  ISO-60% claim corrected (plus a same-day ledger-formatting
  follow-up); gmk-cyl-og-extensions-interest-check's Update callout
  mislabel fixed; group-buys/past's stale "freshest six" claim
  fixed; work-louder-openai-codex-micro's lede brought in line with
  its own later Update callouts. Same recurring stale-claim family
  flagged in prior digests, still the single highest-volume finding
  category.
- **content (fabrication fix, the window's most severe finding)**:
  75-percent-default.mdx's entire thesis — "how 75 percent became
  the default" — hinged on a "Sonnet 2026 refresh" that never
  happened; `data/boards/mode-sonnet.json` has always been a 65%
  board, confirmed against 4 other published articles. Re-anchored
  on KBD75 v3 (real, in-catalog, already playing this exact
  narrative role in `mounting-styles-compared.mdx`) across both
  InlineViz diagrams, their provenance JSON, and 3 trend-snapshot
  note strings that had leaked the same false claim onto live
  Trends Tracker pages.
- **a11y + enhancement + perf**: all 10 `error.tsx` boundaries gain
  `role="alert"`; part detail pages now render the outbound vendor
  link (`vendorUrl` was computed but never wired to a template);
  InlineViz diagrams reserve layout space via a prebuild
  aspect-ratio manifest, closing a CLS gap across ~185 inline
  article diagrams.
- **engineering (self-hardening, 2 fixes)**: `article-parts-check.mjs`
  wired into march's own mechanical survey chain; the viz-manifest
  generator now fails loud on unparsable SVGs instead of silently
  skipping them — both closing gaps in mechanisms the loop itself
  depends on.
- **seo (3 fixes)**: `/article` + `/tag` routes redirect non-lowercase
  paths to canonical; sitemap tag entries now derive `lastModified`
  from their tagged articles instead of reporting "modified today"
  on every build; article OG cards' font-size tiering fixed for
  titles past 72 characters.
- **content-gap dispatch**: newsletter-gap-survey filed a backlog
  row and opened `#742`, then the same tick shipped "thock weekly —
  issue 06," closing the issue in the same commit pair.
- **expand**: 3 passes (283-285), all zero-candidate — fresh
  general-purpose sweeps across the hero-art defect class, group-buy
  status, and other angles found nothing above the 3.0 bar. 4
  consecutive no-candidate passes since pass 281's last filing —
  normal cadence, not starvation.

## Queues now

- **Build plan**: 0 pending phases (51 shipped), unchanged — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged.
- **`plan/AUDIT.md`**: **4 open rows** (913 addressed, up from 897 —
  16 findings closed this window). `[6.3]` march.yml crash-gate
  (blocked-cloud-permission, filed 2026-07-05); `[4.0]` Lighthouse-CI
  disabled (filed 2026-07-18); `[needs-user-call] [4.2]` soft-404
  structurally blocked (filed 2026-07-18); `[4.0]` heartbeat.yml
  dedup (blocked-cloud-permission, filed 2026-07-26). All four
  unchanged from yesterday.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **87 days / 2009 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  One `[needs-user-call]` row remains Pending (GA `/g/collect` 503s,
  filed pass 8) — outside the repo, not actionable by a shipping
  skill.
- **`plan/PHASE_CANDIDATES.md`**: **22 pending rows + 1
  needs-user-call**, unchanged (0 new candidates this window — all 3
  expand passes returned zero), **52 days** since the last promotion
  (2026-06-14, phases 46-49). Top of the cluster, still `7.0`:
  trend-snapshot data-quality gate, automated content-fact-vs-catalog
  numeric-spec audit, article internal-consistency checker (this
  last one's exact target — an article's internal claims
  contradicting other in-corpus facts — is precisely the defect
  class the Sonnet-75%-fabrication fix drained by hand this window).
  Several `6.5`s follow: `/quiz/board`, stale group-buy
  frontmatter/prose gate, the critique-gate needs-user-call
  diagnostic, the `[5.5]` overlay/drawer keyboard-trap coverage
  check, the `[6.0]` heading-semantics coverage check.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work).
- **Triage**: **16 open issues** (up from 15), 0 unlabeled. 8
  duplicate content-gap issues (`#414-#422` minus `#417`) still await
  a manual consolidation pass, unchanged. Three `triage:needs-user`
  issues remain open: `#639`, `#434`, `#499` (see Needs you). One new
  loose end this window: `#733` (see Needs you) — filed yesterday
  afternoon by an `/iterate` sweep, not yet drained by any of this
  window's 19 ticks. `#719` from the prior digest's "Needs you" is
  still open too (unclosed duplicate; the underlying MobileNav
  focus-containment defect it names was already fixed).
- **Expand cadence**: 3 passes this window (283-285), all
  zero-candidate. 4 consecutive since pass 281's last filing — normal
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
- `test:run` — green, 787 web unit tests (106 test files, up from
  774/105); 157 content tests (24 files, up from 155); tokens (3/1) +
  seo (42/5) + data (129/19) + ui (31/7) + e2e-fixtures (6/1) all
  green and unchanged. 1155 unit tests site-wide (up from 1140).
- `test:scripts` — green, 179 tests / 65 suites (up from 175/64).
- `data:validate` — green, 76 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 14
  trend weeks — all unchanged). 76 articles, unchanged.
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1123/1123**, up from 1118/1118 (6.0m, single
  worker).
- `pnpm deploy:check` at HEAD (`b21aca61`) — deploy `READY`
  (`dpl_6U6PDDjv`).
- `lighthouse` — confirmed via `gh workflow list --all`:
  `state: disabled_manually`, same standing `[4.0]` AUDIT row, last
  two recorded runs both `failure` (2026-06-14, 2026-06-12), no new
  signal this window.

One non-blocking observation, same shape as recent digests: the e2e
run's server stderr again logged `NoFallbackError` several dozen
times against the five `dynamicParams = false` routes (`/part/[kind]`,
`/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
`/newsletter/[slug]`) — Next's expected internal log for not-found-
page e2e tests hitting a param outside the pre-generated set, not a
real failure. Every one of the 1123 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New: unaddressed audit finding, GitHub issue `#733`.** Filed
   2026-08-04T15:05 UTC by an `/iterate` audit sweep (MED, content):
   `hmx-cloud-deep-dive`'s lede claims "the Cloud sat second on our
   tracker" unqualified, when it was actually third overall in W19
   (second only *among switches* — exactly how the article's own
   body paragraph correctly scopes the same fact). Verified still
   live in the current source
   (`apps/web/src/content/articles/hmx-cloud-deep-dive.mdx:4`) —
   none of this window's 19 ticks picked it up (it's MED severity,
   likely outscored by the higher-impact findings that shipped
   instead). Suggested fix is a single-clause reword ("second among
   switches on our tracker"), already spelled out in the issue body.
   Should self-drain on a future `/iterate` tick; flagging since it's
   sat a full day.
2. **Standing, unclosed: orphaned duplicate GitHub issue `#719`.**
   Carried over from the last digest — still open. The MobileNav
   focus-containment defect it names was fixed same-day by `6ef381e3`
   (closed via a different issue, `#722`). Cheap to close by hand
   (`gh issue close 719 -c "duplicate of #722, fixed by 6ef381e3"`);
   flagging rather than closing autonomously, per the same reasoning
   as before.
3. **Standing, growing: the `/oversight` promotion backlog.** 22
   pending candidates + 1 needs-user-call, now **52 days** since the
   last promotion. Three candidates sit at `7.0`, several more at
   `6.5`. No movement this window (0 new, 0 promoted, 0 rejected).
4. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 87 days / 2009 commits since pass 11. Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or something else.
5. **Standing: Lighthouse CI has been disabled and failing for 7+
   weeks — `/oversight` call needed.** Unchanged since last digest.
6. **Standing: three unresolved `triage:needs-user` GitHub issues.**
   `#639` (8 days old, deploy is `READY` at HEAD so this likely
   self-resolved but stays open pending a look), `#499` (20 days
   old), `#434` (26 days old). Neither of the latter two has
   self-resolved.
7. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`,
   heartbeat.yml `[4.0]`) — both fixes written and verified, neither
   can ship because the cloud push credential lacks `workflows` scope
   for `.github/workflows/*.yml` edits.
8. **Standing, out-of-repo: GA `/g/collect` 503s** — `plan/CRITIQUE.md`
   pass-8 `[needs-user-call]` row, unactionable by any shipping skill
   since the analytics property lives outside the codebase.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all four open rows are
blocked or `/oversight`-gated). The next `/march` tick will most
likely repeat this window's pattern: a fresh reactive `/iterate` fix
off a general-purpose sweep (with `#733`'s hmx-cloud-deep-dive
scoping fix a good candidate to surface first, since it's the one
already-filed, already-scoped, unaddressed finding sitting in the
queue), or another `/expand` pass. The highest-leverage next move
isn't a new fix — it's an `/oversight` pass covering, in one sitting:
the standing 22-row candidate cluster (three `7.0`s, now 52 days
stale), the Critique-gate decision, the Lighthouse re-enable
decision, the two blocked workflow-permission fixes, and (small)
closing the orphaned `#719` duplicate issue by hand.

## Tuning proposals

None new this pass. 22/22 `march` runs succeeded this window — no
crash-gate signal to add to. `/expand`'s 3 passes this window (all
zero-candidate, 4 consecutive since pass 281) is within normal
cadence, not starvation — the digest's own bar is "dozens" of
consecutive no-candidate passes, and this window is nowhere close.
No cron-gap evidence of the 60-commit/24h ceiling hibernating a
productive stretch (runs landed roughly hourly all window, 36
commits total, well under the ceiling). The critique-gate staleness
(87 days) and the 22-row `/oversight` backlog remain standing,
already-diagnosed decisions awaiting a human call, not new tuning
signals — both are called out again under Needs you rather than
re-proposed here.
