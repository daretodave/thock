# Phase 24 — `/ship-content` skill

> Agent-facing brief. Concise, opinionated, decisive. Ship without
> asking; document any judgment calls in the commit body.

## Outcome

A new autonomous skill `skills/ship-content.md` that bundles the
proven content-velocity pattern (content-curator + brander + tags.json
extend + verify + commit + push) as a single, first-class dispatch
target. Two existing skills (`march.md`, `iterate.md`) are updated to
route content-gap work through `/ship-content` instead of wiring
`content-curator` + `brander` ad-hoc inside iterate's Step 3.

**Why a dedicated skill:** `/iterate` already handles content-gap
findings but its general-purpose Step 3 dispatch is brittle — every
tick it re-derives the publishedAt algorithm, the tags.json extension
logic, and the brander brief shape. The 4 content-velocity rules in
`bearings.md` (pillar quota, tracker linkage, group-buy companion,
date staggering) generate ~30+ content rows at any given moment; the
loop's throughput is constrained by how reliably each tick follows the
pattern. `/ship-content` codifies the pattern once so every content
tick is identical and reviewable.

## Deliverables

1. `skills/ship-content.md` — new skill (the core deliverable)
2. `skills/march.md` — Step 3 amended to dispatch to `/ship-content`
   when the top AUDIT.md finding is content-gap-shaped
3. `skills/iterate.md` — Step 3 delegation and failure-mode 6
   amended to reference `/ship-content` for content-gap work

**No code changes.** No new e2e. The per-article `pnpm verify` gate
(typecheck + test:run + build + e2e) remains the regression guard for
every article that ships through this skill.

## Skill shape — `skills/ship-content.md`

### The flow (10 steps)

**Step 0 — Sync**
```bash
git pull --ff-only
```

**Step 1 — Read the content queue**

Open `plan/AUDIT.md`. Find all `Pending` content-gap findings. These
are rows with `category: content-gaps` that are not prefixed `[x]`.

Apply the same bias multiplier from the AUDIT.md header (`Bias:
content-gaps (set via oversight ...)` → multiply by 1.5). Pick the
top-scored row. Confirm it maps to one of the 4 bearings rules:

- Rule 1 — pillar quota: `pillarArticleCount < 8`
- Rule 2 — tracker linkage: non-flat row older than 14 days, no `articleSlug`
- Rule 3 — group-buy companion: `status ∈ {live, announced}`, no companion
- Rule 4 — publishedAt staggering: implicit in every new article

If no content-gap row exists or all rows score < 3.0, exit cleanly:
log "no content queue — falling through" and return to caller.

**Step 2 — Compute `publishedAt`**

*Default (Rules 1, 2, and most of Rule 3):*

1. Read all frontmatter `publishedAt` values from
   `apps/web/src/content/articles/*.mdx`.
2. Filter to the rolling-30-day window: dates in
   `[today - 30 days, today]` (inclusive, ISO date strings).
3. Sort chronologically. Insert `today - 30 days` and `today` as
   sentinels if the window is otherwise empty.
4. Find the largest gap between consecutive dates (including
   sentinel-to-first and last-to-sentinel).
5. Place the new article at the midpoint of that gap
   (integer day, round down).
6. If two gaps tie, pick the one containing the midpoint closest to
   today (fresher dates are editorially stronger).

*Group-buy companion exception (Rule 3):*

Use the group-buy record's `startDate`. If the buy has a pre-announce
(IC date) within 7 days of `startDate`, prefer the IC date; otherwise
use `startDate`. This maps the article to the moment the story breaks.

**Step 3 — Mirror to GitHub**

Open (or reuse) a GitHub issue for this content piece before writing
a word:

```bash
cat > /tmp/loop-issue-body.md <<EOF
**Source:** /ship-content dispatch — <bearings rule>
**Severity:** MED · **Category:** content · **Pillar:** <pillar>

## Topic
<one-line topic from the audit row>

## Why now
<audit row rationale — pillar count, tracker window, or GB status>

---
_Tracked by the autonomous loop. The article commit closes this issue via \`Closes #<this-issue>\`._
EOF

N=$(node scripts/loop-issue.mjs open \
    --severity med \
    --category content \
    --source audit \
    --title "<one-line topic, ≤ 70 chars, lowercase 'thock'>" \
    --body-file /tmp/loop-issue-body.md)
echo "content-issue: #$N"
```

On failure: log stderr, set `$N=""`, continue (mirror is best-effort).

**Step 4 — Spawn content-curator and brander in parallel**

Both agents are independent: the brander brief can be written from
the topic alone; prose and art run simultaneously.

*content-curator brief (pass as `prompt` arg):*

- Topic + pillar from the audit row.
- Target word count: 900–1400 words (varies by pillar: Guides 1200–1600,
  Deep Dives 1400–1800, News 900–1200, Ideas + Trends 900–1200).
- `publishedAt` from Step 2 (exact ISO date, e.g. `2026-05-05`).
- Voice from `plan/bearings.md` — "knowledgeable peer, not breathless hype."
- Rule 4 sub-rule for group-buy pieces: body prose uses absolute window
  phrasing ("a four-week buy," "open through May 17"), never relative
  time remaining.
- Tags: at least 2, at most 5; all must exist in `tags.json` OR be
  flagged for addition in Step 5.
- `heroImage` and `heroImageAlt` must be set in frontmatter
  (art ships in the same commit; never ship article without heroImage).
- Output: complete MDX at `apps/web/src/content/articles/<slug>.mdx`.

*brander brief (pass as `prompt` arg):*

- The article's pillar + one-line subject (drives the SVG subject mapping
  from `bearings.md` "Article hero art" style guide).
- Subject mapping: switch deep-dive → switch cross-section / housing
  exploded; keycap piece → keycap profile silhouette; build/mod piece
  → keyboard outline + callout; news/vendor piece → layout silhouette;
  guide → annotated keycap row; trends piece → sparkline silhouette.
- Splash hue: pick from {coral, dusty rose, ochre, muted terracotta}
  based on product character; avoid stock blues/greens.
- Canvas: 1200×750, stroke ~2px, background transparent or warm-paper.
- Output: SVG at `apps/web/public/hero-art/<slug>.svg` + sibling
  `<slug>.svg.json` provenance file.

After both agents return, confirm:
- MDX file exists at the expected path.
- SVG file exists at `apps/web/public/hero-art/<slug>.svg`.
- MDX frontmatter `heroImage` matches `/hero-art/<slug>.svg`.

**Step 5 — Validate and extend `tags.json`**

Read `apps/web/src/content/tags.json`. For every tag in the article's
frontmatter `tags` array, check if it already exists.

For each missing tag:

1. Pick a category using this heuristic (in priority order):
   - Contains a part brand (Gateron, Cherry, Kailh, GMK, MT3…) → `brand`
   - Contains a layout term (75%, TKL, Alice, ergo…) → `layout`
   - Contains a material term (POM, polycarbonate, brass…) → `material`
   - Contains a profile term (Cherry, OEM, SA, MT3, DSA…) → `profile`
   - Is a switch name or switch technique → `switch`
   - Otherwise → `misc`
2. Add the tag object: `{ "slug": "<slug>", "name": "<display name>",
   "category": "<category>" }`.

Commit the `tags.json` extension in the same article commit (Step 7),
not separately.

**Step 6 — Verify**

```bash
pnpm verify
```

Full gate: typecheck + test:run + data:validate + build + e2e.

Serial fallback for e2e flake: if e2e fails first, retry with
`pnpm --filter @thock/e2e e2e -- --workers=1` to rule out
parallelism-induced flake before treating as a real failure.

Iterate up to 3 times on the same root cause. Stop per §8 if
unresolvable.

**Step 7 — Commit + push**

Stage explicitly:

```bash
git add apps/web/src/content/articles/<slug>.mdx
git add apps/web/public/hero-art/<slug>.svg
git add apps/web/public/hero-art/<slug>.svg.json
git add apps/web/src/content/tags.json      # only if Step 5 added tags
git commit -m "$(cat <<'EOF'
content: <pillar> — "<article title>"

- Audit finding: <rule-N> content-gap, score <X>.
- publishedAt: <ISO date> (gap-fill: largest 30-day window gap).
- ~<N> words, <M> sections.
- Tags: <tag1>, <tag2>[, <tag3>].
- Hero SVG: /hero-art/<slug>.svg (<splash-hue> splash, <subject> motif).
[- tags.json: added <N> new tag(s): <slug> (<category>).]

Closes #<N>
Cloud-Run: https://github.com/daretodave/thock/actions/runs/25681707625
EOF
)"
git push origin main
```

(The `Cloud-Run:` trailer is mandatory for every cloud-shipped commit
per the cloud-mode brief. No `Co-Authored-By:`. No emojis.)

**Step 8 — Tick the audit**

Flip the addressed finding to `[x]` in `plan/AUDIT.md` and append
the commit hash. Commit:

```bash
git add plan/AUDIT.md
git commit -m "$(cat <<'EOF'
audit: content-gap finding addressed — <pillar> article

Cloud-Run: https://github.com/daretodave/thock/actions/runs/25681707625
EOF
)"
git push origin main
```

**Step 9 — Confirm deploy**

```bash
pnpm deploy:check
```

A red deploy is treated identically to a red verify gate: read the
log, patch the root cause, push again. Up to 3 iterations.

If green and `$N` is set:

```bash
node scripts/loop-issue.mjs close-comment \
  --number "$N" \
  --commit "$(git rev-parse HEAD~1)" \
  --deploy-url https://thock-coral.vercel.app
```

Failure of `close-comment` is a warning, not a blocker.

**Step 10 — Done**

Return cleanly. The loop's next tick re-dispatches.

## Invocation

```
/ship-content                # dispatch from content-gap queue
```

Called from:
- `/march` Step 3 (new direct dispatch lane for content-gap signals)
- `/iterate` Step 3 delegation (content-gap findings)
- `/iterate` failure-mode 6 (top score is content-gap, posture bold)

## Failure modes

1. **`pnpm verify` fails ≥ 3 times on the same root cause.** Stop
   and report. Open a GitHub issue:
   `gh issue create --title "Cloud march failed: <iso-date>" --body "..."`
2. **`pnpm deploy:check` fails ≥ 3 times after verify passes.** Same.
3. **`VERCEL_TOKEN` missing.** Stop; report config gap.
4. **content-curator returns empty or malformed MDX.** Retry once
   with a more explicit brief (add word-count floor, pillar voice
   example). If still malformed, skip this row, mark it
   `[blocked: content-curator]`, and fall through to the next row.
5. **brander fails to write the SVG.** Same retry once; if still
   failing, ship the article with `heroImage: null` as a last resort
   and file an AUDIT.md row for the backfill (the audit's "missing
   heroImage" finding already handles this case).
6. **No content-gap rows in AUDIT.md scoring ≥ 3.0.** Exit cleanly;
   log "no content queue." Caller (`/march`, `/iterate`) falls
   through to its next dispatch target.
7. **`git pull` divergence.** Stop and report.

## Hard rules

1. **One article per tick.** Batch content commits are unreviewable.
2. **Never commit a new article with `heroImage: null`.** Failure
   mode 5 is the only sanctioned exception; it files a backfill row.
3. **`publishedAt` must fill the 30-day gap** (Rule 4). Group-buy
   exception applies. Never set `publishedAt` to today unless today
   genuinely fills the largest gap.
4. **tags.json must be valid** after any addition — all tags must
   have `slug`, `name`, `category` fields; slugs must be kebab-case.
5. **No `Co-Authored-By:` trailers. No emojis.** Cloud-shipped
   commits include the `Cloud-Run:` trailer; nothing else.
6. **Verify gate is non-negotiable.** No `--no-verify`.

## Updates to sibling skills (shipped in the same phase commit)

### `skills/march.md` — Step 3 amendment

After Step 3b (pending data) and before Step 3c (expand), add a
new **Step 3b.5 — content queue check**:

```
ELSE IF AUDIT.md has content-gap Pending rows scoring ≥ 3.0:
  → /ship-content
```

This lets `/march` route directly to content shipping without going
through `/iterate`'s full audit loop. The audit score is fast to
compute (pillar counts, tracker age, GB status) and content-gap
rows score high under the current bias.

Full dispatch order becomes:
```
3a. Pending phase?        → /ship-a-phase
3b. Pending data?         → /ship-data
3b.5. Content queue?      → /ship-content
3c. Expand due?           → /expand
3d. Else                  → /iterate
```

### `skills/iterate.md` — two amendments

**Step 3 delegation (content-gap):**

Replace the existing "Content gaps → content-curator + brander"
delegation bullet with:

> **Content gaps** → delegate to `/ship-content`. Read
> `skills/ship-content.md` and execute its procedure from Step 1
> (the audit row is already selected — skip the queue-read and
> jump straight to Step 2, publishedAt computation). Do not
> re-implement the content-curator + brander + tags.json flow
> inline; the pattern lives in `/ship-content`.

**Failure-mode 6 (no actionable iterate work):**

Amend to include a content-gap pre-check before handing to expand:

> If top score < 3.0 AND `AUDIT.md` has content-gap Pending rows
> that were not scored above the threshold (e.g. all remaining
> content rows scored < 3.0 due to pillar-quota already met):
> → dispatch to `/expand` per the existing bold-posture rule.
>
> **But first:** if top score < 3.0 yet content-gap rows exist
> whose raw score (without bias) would be ≥ 3.0 once a future
> article ships (e.g. a tracker linkage row that just crossed 14
> days), dispatch to `/ship-content` instead of `/expand` —
> the content row is ripe.

## Decisions made upfront — DO NOT ASK

1. **Serial e2e fallback** — `--workers=1` retry is documented
   as the first remediation for e2e flake; no silent skip.
2. **tags.json extension in same commit** — tagging the commit with
   its new tag slugs keeps the article + taxonomy atomic.
3. **Splash hue selection** — heuristic from bearings (coral /
   dusty rose / ochre / terracotta); brander picks from the list.
4. **Step 8 audit tick is a separate commit** — same pattern as
   `/iterate` §6; keeps the article commit clean and revertable.
5. **No new e2e** — the per-article smoke walker
   (`apps/e2e/tests/smoke.spec.ts`) auto-includes new article slugs
   via `canonical-urls.ts` which is derived from `@thock/content`.
   Every new article is verified by the existing e2e harness without
   adding a new spec file.
6. **Failure mode 4 (content-curator malformed)** — retry once with
   a more explicit brief; skip and mark `[blocked]` after two
   failures rather than looping forever.

## DoD

- [ ] `skills/ship-content.md` created and complete (all 10 steps,
      invocation, failure modes, hard rules)
- [ ] `skills/march.md` Step 3 updated with 3b.5 content-queue lane
- [ ] `skills/iterate.md` Step 3 delegation and failure-mode 6 updated
- [ ] `pnpm verify` passes (typecheck + test:run + data:validate + build + e2e)
- [ ] Phase commit pushed; `plan/steps/01_build_plan.md` ticked `[x]`
- [ ] `pnpm deploy:check` green
