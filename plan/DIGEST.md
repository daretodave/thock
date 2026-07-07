# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Clean day, zero crashes, one recurring bug class fully drained —
and finally promoted to a tuning candidate.** 20 `march` ticks in
the ~24 hours since yesterday's digest, all `success`. The window's
dominant theme: 6 separate group-buy companion articles were caught
with stale present-tense "is live"/"opens"/"runs through" framing
in their **frontmatter title/lede** (not just body prose) weeks
after their linked group buy closed — gmk-cyl-selene (18 days
stale), gmk-cyl-masterpiece-r2 (11 days, staleness had even leaked
into a baked SVG hero-art string), gmk-cyl-ramune,
gmk-cyl-prussian-alert (25 days stale — the worst instance),
divinikey-dcs-dolch, and gmk-cyl-pandemonium. Every instance shares
one root cause, and the audit log said so three times in a row
(passes 157, 158, 159) without ever promoting a fix — this digest
closes that gap: see **Tuning proposals** below. Also shipped: an
`</script>` JSON-LD escaping hardening fix, an a11y focus-trap fix
for `InlineViz`'s zoom dialog, a `PartReference` vendor-link
correction, an article meta-description frontmatter fix, and a
final stale "next month" prediction cleanup on the
cannonkeys-nyawice piece. Full breadth `pnpm verify` is green top
to bottom (935 unit tests, up from 928 — new JSON-LD-escape and
InlineViz coverage; 968/968 e2e), deploy is `READY` at HEAD.
`plan/CRITIQUE.md` is now **58 days / 1183 commits** since its last
pass — unchanged diagnosis from prior digests (cloud hard-skips
`/critique` by design; still an `/oversight` question, standing
candidate unchanged at `[6.5]`).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-06 13:16–13:25 | expand | pass 152 — no candidates |
| 07-06 15:10–15:25 | expand | pass 153 — no candidates |
| 07-06 17:01–17:28 | iterate | a11y fix — `InlineViz` zoom dialog keyboard focus trap (`3028a13`), closes #402, 2 residuals filed |
| 07-06 18:39–18:57 | iterate | seo fix — JSON-LD `</script>` breakout escaping (`118d6f5`), closes #403 |
| 07-06 19:33–19:53 | iterate | a11y fix — `PartReference` board/keycap-set links now point at the vendor, not product imagery (`160f0bd`), closes #404 |
| 07-06 20:38–21:12 | iterate | seo fix — article meta description now prefers hand-authored frontmatter over the `lede` fallback (`7a777f0`), closes #405 |
| 07-06 21:32–21:35 | march | no-op |
| 07-06 22:28–22:47 | expand | pass 154 — no candidates |
| 07-06 23:26–00:02 | iterate | content fix — cannonkeys-nyawice-group-buy stale "next month" prediction resolved to past tense (`c39f080`), closes #406 |
| 07-07 00:39–01:10 | iterate | content fix — gmk-cyl-selene-group-buy stale "is live" title/prose after June 19 close (`d372e1c`), closes #407 |
| 07-07 01:35–01:42 | march | no-op |
| 07-07 03:06–03:27 | iterate | content fix — gmk-cyl-masterpiece-r2-group-buy title/lede still framed a June 26 close as upcoming, 11 days later (`d0bd552`), closes #408 |
| 07-07 05:20–05:40 | iterate | content fix — gmk-cyl-ramune-group-buy stale "is live"/"runs through" prose after June 20 close (`ead8205`), closes #409 |
| 07-07 07:13–07:37 | iterate | content fix — gmk-cyl-prussian-alert stale "is live" title/prose 25 days after June 12 close, the most stale instance found (`6fc069b`), closes #410 |
| 07-07 09:08–09:29 | iterate | content fix — divinikey-dcs-dolch-group-buy stale "opens" title/prose 6 days after July 1 close (`13b0826`), closes #411 |
| 07-07 11:02–11:20 | iterate | content fix — gmk-cyl-pandemonium-group-buy stale "trending"/"is live" title/prose 6 days after July 1 close (`2edd08d`), closes #412 |

(Ticks before 07-06 13:16, including pass 151 and yesterday's own
digest commit, were reported in yesterday's briefing.)

## Shipped

- **Stale group-buy frontmatter/prose — 6 instances, one root
  cause, fully drained this window**: every group-buy companion
  article whose linked record had flipped to `status: "closed"`
  but whose `title`/`lede`/opening prose still read as present-tense
  ("is live", "opens", "runs through <date>") got a retrospective
  rewrite (precedent: the `gmk-cyl-ishtar-r2-group-buy` retrospective
  title shape). Two articles picked up a second collateral fix: the
  masterpiece-r2 piece had the staleness baked into its
  `tracker-arc.svg` hero-art text, and the prussian-alert fix also
  corrected a stale cross-reference sentence in the sibling
  `gmk-cyl-ishtar-r2-group-buy` article. All 6 bumped `updatedAt`.
- a11y: `InlineViz`'s zoom-dialog modal now traps `Tab`/`Shift+Tab`
  focus at its first/last focusable element — a keyboard user could
  previously Tab out of the open dialog into hidden background
  content. Affects all 61 articles that use the component.
- seo: JSON-LD script bodies now escape `<` → `<` after
  `JSON.stringify`, closing a latent `</script>`-breakout gap that
  no current content happened to trigger but any future field could.
- a11y: `PartReference` now resolves board/keycap-set links via the
  part's vendor `url` instead of the vendor-imagery `imageUrl`
  field — the bug was silently masked today (every board/keycap-set
  `imageUrl` is currently `null`) but would have sent readers to raw
  product JPGs the moment a vendor-image backfill landed.
- seo: article `<meta description>` and JSON-LD `Article.description`
  now prefer a hand-authored frontmatter `description` field over
  the longer narrative `lede` fallback — 6 of 61 articles had a
  tighter SERP-appropriate summary that Zod's schema was silently
  stripping.
- content: cannonkeys-nyawice-group-buy's one remaining stale
  "Reviewers will spend the next month figuring out..." prediction
  (missed by an earlier retrofit pass) rewritten to past tense; a
  new `relative-next-month` pattern added to
  `article-language-patterns.json` so this phrasing is caught
  mechanically going forward.

## Queues now

- **Build plan**: 0 pending phases — pure `/iterate` maintenance
  mode, unchanged.
- **Cross-link drain**: 0 pending, unchanged.
- **`plan/AUDIT.md`**: 1 open row — `[blocked-cloud-permission]
  [6.3]` the `march.yml` crash-gate fix, unchanged, still stuck on
  the same workflow-write permission wall.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **58 days / 1183 commits stale** (up from
  57/1157 yesterday — expected, not a regression). Unchanged
  diagnosis: `.github/CLOUD_LOOP.md` explicitly documents cloud
  `/march` skips `/critique` (needs Chrome for the `reader`
  sub-agent) — the open question of what local `/critique` cadence
  should exist is still standing, tracked by the `[6.5]` Critique
  gate diagnostic candidate.
- **`plan/PHASE_CANDIDATES.md`**: 13 pending rows — up from 12
  yesterday. New this window: **Stale group-buy frontmatter/prose
  gate (`[score 6.5]`, filed by this digest)** — see Tuning
  proposals below. Other incumbents unchanged: `/quiz/board` (6.5),
  Critique gate diagnostic (6.5), external link-rot survey (6.0),
  march.yml crash-issue gate fix (6.0), Parts catalog third data
  pass (5.5), `/compare/keycap-set` (5.5), Vitest coverage CI gate
  (5.5), ship-data mentionedParts rescan (5.5), Cloud loop
  workflow-push permission gap (5.5), Tracker 8-week editorial
  analysis (5.0), Accessory parts kind (5.0), Tracker topic history
  page (4.5).
- **`data/BACKLOG.md`**: 0 actionable rows (3 rows sit under
  `## Pending` marked `[x]` — done but not yet relocated to
  `## Done`; cosmetic, not a queue-pressure signal; unchanged).
- **Triage**: 1 open issue — `#395` "cloud march crash-issue gate
  silently skips on action failure" (bug, `severity:med`,
  `loop:opened`, `source:audit`), unchanged, still blocked by the
  same push-permission wall. 0 unlabeled, 0 `triage:needs-user`.
- **Expand cadence**: 14 commits / ~13h since pass 154 — under the
  20-commit/48h Step 3c threshold, gate not yet due.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, sequential legs — all
green:

- `typecheck` — green, 8/8 workspace packages.
- `test:run` — green, 935 tests across 7 workspaces (591 web + 121
  data + 33 seo + 31 ui + 150 content + 6 e2e-fixtures + 3 tokens —
  up from 928 yesterday; new coverage from the JSON-LD escape fix
  and the InlineViz focus-trap fix, 13 tests).
- `test:scripts` — green, 58 suites / 158 tests.
- `data:validate` — green, 69 records (9 vendors, 18 switches, 10
  keycap-sets, 9 boards, 13 group-buys, 10 trend weeks — unchanged),
  cross-refs resolve.
- `build` — green, no manifest churn issues.
- `size` — green, 108.5 KB / 200 KB homepage gzip budget
  (unchanged).
- `e2e` — green, 968/968 (unchanged). Same benign `NoFallbackError`
  logged mid-run on `/trends/tracker/[week]` as prior digests
  (expected 404-path behavior for a non-generated week param); did
  not fail any test.
- **Lighthouse**: no workflow found (`gh run list --workflow
  lighthouse` returns "could not find any workflows named
  lighthouse") — still no signal, consistent with prior digests
  noting the workflow disabled/absent.
- `pnpm deploy:check` at HEAD (`723e132`) — deploy `READY`.

No red legs. No new AUDIT rows filed by this breadth check itself.

## Needs you

1. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[score 5.5]` candidate, companion to the `[6.3]`
   blocked AUDIT row and open issue `#395`). Unchanged — the cloud
   push credential still lacks the `workflows` permission GitHub
   requires for any push touching `.github/workflows/*`. Two paths
   as before: re-scope the PAT backing `ACTIONS_PAT` with
   "Workflows: write" and confirm it's the actual push credential,
   or accept the constraint and document workflow-file edits as
   local/`/oversight`-only.
2. **Standing: refine or resolve the `[6.5]` Critique gate
   diagnostic candidate.** Unchanged — cloud `/march` hard-skips
   `/critique` by design (confirmed in `.github/CLOUD_LOOP.md`); the
   open question is what local `/critique` cadence, if any, should
   exist, now that 58 days and 1183 commits have passed with zero
   local passes.
3. **New: promote or reject the stale group-buy frontmatter/prose
   gate candidate** (`[score 6.5]`, filed this tick). Six near-
   identical fixes in ~10 hours is a strong, well-evidenced signal —
   worth a look at `/oversight` alongside the other two `[6.5]`
   incumbents (`/quiz/board`, Critique gate diagnostic) given all
   three now sit at the same score.

## Today's intent

No pending build-plan phase, no AUDIT/BACKLOG queue pressure, and
the stale-group-buy-prose cluster is now fully drained (0 remaining
instances found across the corpus per the pass-159 fresh sweep).
The most likely next `/iterate` tick is another fresh mechanical-
survey finding or an `/expand` no-op, unless `/oversight` promotes
one of the three `[6.5]` candidates first. `/quiz/board`, Critique
gate diagnostic, and the new stale-group-buy gate candidate are
the highest-scored incumbents overall, tied at 6.5.

## Tuning proposals

**Filed 1 new candidate this pass**: `[score 6.5]` Stale group-buy
frontmatter/prose gate — `plan/PHASE_CANDIDATES.md` Pending section.
Six near-identical fix cycles landed in a ~10-hour window (passes
157–159), each hitting the same root cause: `article-language-
check.mjs` only scans MDX body text, never frontmatter, and its
static string patterns don't generalize to every "still sounds
live" phrasing. The audit log diagnosed this exact gap three times
in a row (`d372e1c`, `e6a4680`, `ec7e7ba` pass notes) without ever
promoting a fix — a textbook case of a mistuned gate per this
skill's meta-loop rail. Proposing (not applying) a fix shape:
extend the language-check gate (or a new sibling script) to resolve
each group-buy companion article's linked record and cross-check
`status`/`endDate` against the article's frontmatter `title`/`lede`,
mirroring the precedent `group-buy-status-check.mjs` already sets
on the data side. `/oversight` promotes.
