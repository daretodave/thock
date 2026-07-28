# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23h22m, 29-commit window — 19/19 `march` runs green — ten
small drained fixes/content pieces, one same-day self-caught content
correction, one routine no-op `/expand` pass, and the verify gate
itself grew an eighth leg (lint, split across two ticks after two
coverage gaps in it were found and closed the same day it was added).**
Since the last digest (`d373f3c8`, 2026-07-27T11:53 UTC) the loop
landed 29 commits: a lint leg added to `pnpm verify` then immediately
found to only cover `apps/web` (fixed same window, now spans all 5
`packages/*` too), a stale-`updatedAt`-frontmatter bump on 3 articles,
a zero-diff `/expand` pass (246), a suffixed-`<title>` SERP-truncation
clamp, a new `global-error.tsx` root crash boundary (plus its own
same-window test-coverage follow-up), an Article JSON-LD author-type
fix (`Organization`, not `Person`), primary-nav `aria-current`, a new
guides article ("ZMK for wireless and split builds"), a cross-link
between it and `split-ergo-buyers-guide`, newsletter issue 05 (5
pillar picks + W31 tracker snapshot), and — inside the same content
dispatch — a same-day self-correction to issue 05 itself: a fabricated
"entered the tracker two weeks ago" claim on the Hall Effect/Rapid
Trigger row, caught by a fresh sweep and reworded against the real
`data/trends/` history. This tick's own fresh `pnpm verify` is green
across all **eight** legs, run as sequential foreground blocking
calls: typecheck (9 packages), **lint (new leg this window, all
lintable workspaces clean)**, 721 web unit tests / 101 files (up from
711/99), 168 script tests / 61 suites (unchanged), 75 data records /
cross-refs resolve (unchanged), build — all canonical routes
generated, homepage bundle 108.7 KB / 200 KB (unchanged), and
**1089/1089 e2e** (up from 1083). Deploy is `READY` at HEAD
(`6f3a7a64`, `dpl_7fzKMfG9`).

`plan/CRITIQUE.md` is still **78 days / 1746 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner), and every commit in this window again
carries the `Cloud-Run:` trailer, so the gap keeps growing by
construction until a human decision lands. `plan/PHASE_CANDIDATES.md`
holds at **18 pending rows + 1 needs-user-call** (unchanged count),
now **47 days** since the last promotion (2026-06-11). `plan/AUDIT.md`
carries **4** open rows, all `/oversight`-gated or blocked, not
actionable by an autonomous tick — unchanged from yesterday: the
Lighthouse-CI row, the march.yml `[6.3]` crash-gate row, the soft-404
`[needs-user-call]` `[4.2]` row, and the heartbeat.yml `[4.0]` row.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-27 13:04 | iterate | engineering — lint leg added to `pnpm verify`; 245+ prior commits had shipped unlinted `[5.4]` (`203e83bb`/`5be8b389`) |
| 07-27 15:00 | march | no-op — nothing actionable this tick |
| 07-27 16:43 | iterate | engineering — same-day follow-up: the new lint leg only covered `apps/web`, not the 5 `packages/*` workspaces `[4.9]` (`68c2ee24`/`cced8a66`) |
| 07-27 17:33 | iterate | content — stale `updatedAt` frontmatter bumped on 3 recently-edited articles `[3.6]` (`37994547`/`43266e1d`) |
| 07-27 18:32 | expand | pass 246 — no candidates (zero-diff window) |
| 07-27 19:31 | iterate | seo — suffixed `<title>` clamped to 60 chars, SERP truncation risk `[4.0]` (`86789f78`/`b3e023e2`) |
| 07-27 20:31 | iterate | bug — new `global-error.tsx` root crash boundary; root layout crash previously bypassed all error boundaries `[5.4]` (`c56a4492`/`cd4bf00a`) |
| 07-27 21:25 | test | test-coverage — same-window follow-up: `global-error.tsx` had zero tests `[4.0]` (`e2444dc5`/`f07da4fe`) |
| 07-27 22:23 | iterate | seo — Article JSON-LD author type fixed to `Organization`, was `Person` `[5.4]` (`c2db17c8`/`3b486c48`) |
| 07-27 23:23 | iterate | a11y — primary nav marks the current page via `aria-current` + active styling `[4.2]` (`066145d2`/`7645cbb3`) |
| 07-28 00:31 | content | content-gap row auto-filed by `content-gap-survey.mjs`; dispatch opened issue #634 (guides pillar) |
| 07-28 01:33 | march | no-op — content dispatch in flight, nothing else actionable |
| 07-28 03:03 | march | no-op |
| 07-28 05:04 | march | no-op |
| 07-28 06:54 | march | no-op |
| 07-28 07:52 | content | guides — "ZMK for wireless and split builds: a practical guide" shipped, closes #634 (`0d557d2b`/`9c32e2fb`) |
| 07-28 08:57 | audit+content | cross-link + newsletter cadence rows filed by content-velocity surveys, then drained same tick — `split-ergo-buyers-guide` ↔ `zmk-wireless-split-firmware-guide` cross-link shipped `[4.5]` (`c72645c9`, `63dd722d`/`d633f795`) |
| 07-28 09:56 | content | newsletter — dispatch opened issue #636, then "thock weekly — issue 05" shipped same tick (5 pillar picks + W31 tracker snapshot) (`c1c46dbf`, `c42f846d`/`fd58a099`) |
| 07-28 10:53 | iterate | content-accuracy — same-day self-correction: issue 05's own Hall Effect/Rapid Trigger row fabricated an "entered the tracker two weeks ago" claim; reworded against the real W21–W29 tracker history `[5.4]` (`67099997`/`6f3a7a64`) |

19/19 `march`-workflow runs since 2026-07-27T11:53 UTC report
`success` — no crash-issue-gate recurrence this window.

## Shipped

- **engineering**: `pnpm verify` gained an eighth leg — `lint` — after
  a fresh sweep found 245+ commits had shipped with zero linting.
  Same-window follow-up caught that the new leg only wired `apps/web`,
  missing all 5 `packages/*` workspaces; both are fixed and the gate
  now lints every lintable workspace.
- **content**: 3 articles' stale `updatedAt` frontmatter bumped to
  match their real last-edit dates; a new guides pillar article
  ("ZMK for wireless and split builds: a practical guide") closing
  the guides content-gap dispatch (#634); a cross-link from
  `split-ergo-buyers-guide` to the new ZMK guide (same pillar, shared
  tags: split, beginner, wireless); newsletter issue 05 (5 pillar
  picks + W31 tracker snapshot), with a same-day self-correction after
  a fresh sweep caught the issue's own Hall Effect/Rapid Trigger row
  fabricating an "entered the tracker two weeks ago" claim — the row
  has actually been present and climbing since W21. This is the third
  time this fabrication class has been caught and fixed (closes #553,
  #574, and now #637) — see Needs You.
- **seo**: suffixed `<title>` clamped to 60 characters to avoid SERP
  truncation; Article JSON-LD `author` field corrected from `Person`
  to `Organization`.
- **bug**: new root-level `global-error.tsx` — the root layout crash
  previously bypassed every error boundary in the app; same-window
  follow-up added its missing test coverage.
- **a11y**: primary nav now marks the current page with
  `aria-current` + active styling.
- **expand**: 1 pass (246), zero-diff — all mechanical surveys ran
  clean, no new candidates filed or updated.

## Queues now

- **Build plan**: 0 pending phases (51 shipped, unchanged) — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged — every
  `[cross-links]`-category AUDIT row is `[x]`.
- **`plan/AUDIT.md`**: **4 open rows** (794 addressed, up from 782).
  `[6.3]` march.yml crash-gate (blocked-cloud-permission, filed
  2026-07-05); `[4.0]` Lighthouse-CI disabled (`next: /oversight
  call`, filed 2026-07-18); `[needs-user-call] [4.2]` soft-404
  structurally blocked (filed 2026-07-18); `[4.0]` heartbeat.yml
  dedup (blocked-cloud-permission, filed 2026-07-26). All four
  unchanged from yesterday — non-autonomous, either genuinely blocked
  on the cloud push credential or gated to `/oversight`.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **78 days / 1746 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  The standing `[6.5]` needs-user-call candidate remains the decision
  row.
- **`plan/PHASE_CANDIDATES.md`**: **18 pending rows + 1
  needs-user-call** (unchanged count), **47 days** since the last
  promotion (2026-06-11, 8 candidates including phases 43/44/45). Top
  of the cluster: `[7.0]` trend-snapshot data-quality gate, `[7.0]`
  content-fact-vs-catalog numeric-spec audit, `[7.0]` article
  internal-consistency checker, `[6.5]` `/quiz/board`, `[6.5]` stale
  group-buy frontmatter/prose gate, `[6.5]` sitewide focus-visible
  default + coverage check, `[6.5]` needs-user-call critique-gate
  decision.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work).
- **Triage**: 13 open issues (unchanged), 0 unlabeled. 8 duplicate
  content-gap issues (`#414-#416`, `#418-#422`) still await a manual
  consolidation pass. Two `triage:needs-user` issues unresolved:
  `#434` (Vercel never ingested commit `e312e09`, now 17 days old) and
  `#499` (night digest crashed, now 12 days old). `#395`, `#437`,
  `#620` are stable.
- **Expand cadence**: 1 pass this window (246, no candidates) — all
  mechanical surveys ran clean.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential blocking
legs (typecheck → lint → test:run → test:scripts → data:validate →
build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next lint`
  — deprecated in favor of the ESLint CLI ahead of Next.js 16, a
  future-maintenance note rather than a defect; `packages/*` via
  `eslint`). New leg this window.
- `test:run` — green, 721 web unit tests (101 test files, up from
  711/99); tokens/seo/data/ui/e2e-fixtures/content packages all green
  and unchanged.
- `test:scripts` — green, 168 tests / 61 suites, unchanged.
- `data:validate` — green, 75 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 13
  trend weeks — unchanged).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1089/1089**, up from 1083.
- `pnpm deploy:check` at HEAD (`6f3a7a64`) — deploy `READY`
  (`dpl_7fzKMfG9`).
- `lighthouse` — confirmed via `gh api .../actions/workflows`:
  `state: "disabled_manually"`, unchanged. The `gh run list
  --workflow lighthouse` pulse command still can't resolve it by
  display name (known quirk, documented on the standing `[4.0]` AUDIT
  row) — no new signal this window.

One non-blocking observation, repeated from prior digests: the e2e
run's server stderr again logged `NoFallbackError` several dozen times
against the five `dynamicParams = false` routes (`/part/[kind]`,
`/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
`/newsletter/[slug]`) — Next's expected internal log for not-found-page
e2e tests hitting a param outside the pre-generated set, not a real
failure. Every one of the 1089 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this tick.

## Needs you

1. **Standing, worth a closer look: the tracker-fabrication class has
   now recurred a third time**, each time inside the same newsletter
   feature — `[4.5]` (issue 04, closes #553), `[4.2]` (closes #574,
   superlative-vs-archive), and now `[5.4]` (issue 05, closes #637,
   fixed same-day this window). Issue 05's own shipping commit
   explicitly claimed to have checked every tracker claim against the
   real archive to guard against exactly this class, and still missed
   one. The already-Pending `[7.0]` trend-snapshot data-quality-gate
   candidate targets the data side of this; nothing yet targets the
   newsletter-prose side specifically. Worth considering whether a
   mechanical guard belongs in the newsletter content-dispatch path
   itself, not just the data layer.
2. **Standing: the sitewide focus-visible candidate remains the
   single highest-leverage promotion still available.** No new
   instances this window.
3. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 78 days / 1746 commits since pass 11. Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or something else.
4. **Standing: Lighthouse CI has been disabled and failing for 6+
   weeks — `/oversight` call needed.** Unchanged since last digest.
5. **Standing, growing: the `/oversight` promotion backlog.** 18
   pending candidates + 1 needs-user-call, now **47 days** since the
   last promotion. Three candidates sit at 7.0, several more at 6.5.
6. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (17 days old) and `#499` (12 days old). Neither self-
   resolved.
7. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`,
   heartbeat.yml `[4.0]`) — both fixes written and verified, neither
   can ship because the cloud push credential lacks `workflows` scope
   for `.github/workflows/*.yml` edits.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all four open rows
are blocked or `/oversight`-gated). The next `/march` tick will most
likely repeat this window's pattern: a fresh reactive `/iterate` fix
or content-gap dispatch off a general-purpose sweep, or another
zero-diff `/expand` pass. The highest-leverage next move isn't a new
fix — it's an `/oversight` pass covering, in one sitting: the
recurring tracker-fabrication class (now 3 instances, all in the
newsletter path), the workflow-file push-permission wall (blocking
two written fixes), the focus-visible default, the Critique-gate
decision, and the growing 19-row candidate cluster.

## Tuning proposals

None new this pass. The recurring tracker-fabrication class (Needs
You item 1) reads as a real signal but not yet a specific gate change
to propose — the data-side fix is already a Pending `[7.0]` candidate,
and the newsletter-prose side needs a clearer proposed mechanism
(a pre-publish claim-checker script? a stricter content-curator
prompt constraint?) before it's ready to file as its own candidate
rather than restated as a Needs-You flag. If a fourth instance lands,
that's the trigger to file it as a `plan/PHASE_CANDIDATES.md` row. No
other mistuned gate, cadence, or ceiling surfaced this window.
