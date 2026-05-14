# Skill: ship-content

> **Full autonomy, content-velocity mode.** When invoked (directly,
> via `/iterate` content delegation, or via `/march` Step 3b.5), you
> have authority to ship one new article end-to-end — no review
> checkpoint. Read the content queue, compute the publish date,
> spawn agents in parallel, extend tags if needed, verify, commit,
> push. The loop fires again on the next content row.

## 1. Purpose

The four content-velocity rules in `plan/bearings.md` "Content
velocity & editorial cadence" (locked 2026-05-10 via /oversight)
generate ~30+ content-gap findings at any moment until the corpus
reaches quota. This skill codifies the proven pattern — queue
read → publishedAt gap-fill → GitHub mirror → parallel
`content-curator` + `brander` → `tags.json` extension → verify →
commit → push — as a single, reviewable flow.

Every tick is identical. The only variables are the topic (from the
top-scored audit row) and the publish date (from the gap-fill
algorithm).

## 2. Invocation

```
/ship-content                # dispatch from content-gap queue
```

Called from:
- `/march` Step 3b.5 (direct dispatch when content-gap rows score ≥ 3.0)
- `/iterate` Step 3 delegation (content-gap finding selected)
- `/iterate` failure-mode 6 (content-gap rows ripe, posture bold)

## 3. Autonomy contract

- **Empty queue → exit cleanly.** Log "no content queue" and return.
  The caller falls through to its next target.
- **Ambiguous topic → pick the top row.** If two rows tie, prefer
  the one with the older original filing date.
- **publishedAt → always gap-fill.** Never use today's date unless
  today is genuinely the midpoint of the largest gap.
- **content-curator malformed output → retry once** with a more
  explicit brief. If still malformed after retry, mark the row
  `[blocked: content-curator]`, skip to the next row, ship that.
- **brander fails → heroImage: null as last resort.** Ship the
  article and file an AUDIT.md backfill row. Never hold the article
  back waiting for art.
- **tags.json extension → same commit.** Tagging the article with
  its new tag slugs keeps prose and taxonomy atomic.

## 4. Procedure

### Step 0 — Sync

```bash
git pull --ff-only
```

If divergence, stop per §8.

### Step 1 — Read the content queue

Open `plan/AUDIT.md`. Collect all `Pending` content-gap findings
(rows with `category: content-gaps`, not prefixed `[x]`). Score them
using the standard `impact × ease / 10` formula. Apply the
`plan/AUDIT.md` bias multiplier if the header reads:

```
> Bias: content-gaps (set via oversight …)
```

(Multiply each content-gap score by 1.5 before ranking.)

Confirm the top row maps to one of the 4 bearings rules:

- **Rule 1 — pillar quota:** `pillarArticleCount < 8`
- **Rule 2 — tracker linkage:** non-flat trend row older than 14 days
  with no `articleSlug` in `data/trends/<YYYY-WNN>.json`
- **Rule 3 — group-buy companion:** `data/group-buys/<slug>.json` with
  `status ∈ {live, announced}` and no companion article
- **Rule 4 — publishedAt staggering:** implicit; every new article
  must gap-fill

If no content-gap row exists, or all rows score < 3.0, exit cleanly:
log "no content queue — falling through" and return to caller.

### Step 2 — Compute `publishedAt`

**Default path (Rules 1, 2, and non-GB Rule 3):**

1. Read all frontmatter `publishedAt` dates from
   `apps/web/src/content/articles/*.mdx` via the manifest or direct
   frontmatter parse (use `@thock/content` `getAllArticles()` if
   accessible, otherwise grep).
2. Filter to the rolling-30-day window: dates in
   `[today − 30 days, today]`, inclusive.
3. Sort chronologically. Insert `today − 30 days` and `today` as
   sentinels if the window has fewer than 2 dates.
4. Find the largest gap between consecutive dates (including
   sentinel-to-first and last-to-sentinel).
5. Place the new article at the midpoint of that gap
   (integer day; round down).
6. Tie-break: if two gaps are equal size, pick the midpoint closest
   to today.

**Group-buy companion exception (Rule 3, §5 of bearings Rule 4):**

Use the group-buy record's `startDate`. If the record has an
`announceDate` field within 7 days before `startDate`, prefer
`announceDate`; otherwise use `startDate`. This maps the article
to the moment the story breaks.

**Rule 4 sub-rule (locked 2026-05-10):** body prose for any article
dated to a buy's `startDate` must use absolute window phrasing —
"a four-week buy," "open through May 17" — never relative phrasing
("roughly one week left"). Pass this constraint explicitly to
`content-curator`.

### Step 3 — Mirror to GitHub

Open (or reuse) a GitHub issue for this content piece **before**
writing a word. The issue documents intent on the public timeline;
the article commit closes it.

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

GH_REPO="${GH_REPO:-daretodave/thock}"

N=$(node scripts/loop-issue.mjs open \
    --severity med \
    --category content \
    --source audit \
    --title "<one-line topic, ≤ 70 chars, lowercase 'thock'>" \
    --body-file /tmp/loop-issue-body.md)
echo "content-issue: #$N"
```

On failure: log stderr, set `N=""`, continue (mirror is best-effort).

If the row already carries an `- issue: #N` field (prior tick filed
but didn't ship), reuse that number; skip this step.

### Step 4 — Spawn content-curator and brander in parallel

Both are independent: the SVG subject is derivable from the topic
alone; they run concurrently.

**content-curator brief:**

- Topic + pillar from the audit row.
- Target word count by pillar:
  - Guides: 1200–1600 words
  - Deep Dives: 1400–1800 words
  - News / Ideas / Trends: 900–1200 words
- `publishedAt`: exact ISO date string from Step 2 (e.g. `2026-05-05`).
- Voice: knowledgeable peer, not breathless hype
  (from `plan/bearings.md`).
- Group-buy companion rule 4 sub-rule: absolute window phrasing in
  prose, never relative time remaining.
- Tags: at least 2, at most 5. Each tag must exist in `tags.json`
  OR be flagged for addition in Step 5. List the desired tags in
  the brief so the curator can reference them.
- `heroImage`: set to `/hero-art/<slug>.svg` in frontmatter.
- `heroImageAlt`: required when `heroImage` is set.
- Output: complete MDX at
  `apps/web/src/content/articles/<slug>.mdx`.
- The article `slug` must be kebab-case, descriptive, ≤ 60 chars.
  Include the slug in the brief so brander targets the same name.

**brander brief:**

- Article slug (same as above, for output path).
- Pillar + one-line subject → SVG subject mapping
  (from `plan/bearings.md` "Article hero art" directive):
  - switch deep-dive → switch cross-section / housing exploded view
  - keycap piece → keycap profile silhouette (Cherry / OEM / SA / MT3)
  - build / mod piece → keyboard outline + callout
  - news / vendor piece → layout silhouette or vendor glyph
  - guide → annotated keycap row
  - trends piece → sparkline silhouette
- Splash hue: pick one from {coral, dusty rose, ochre, muted
  terracotta}; avoid stock blues/greens. Match to product character.
- Canvas: 1200 × 750, stroke ~2 px, background transparent or
  warm-paper (light-mode safe).
- Output: `apps/web/public/hero-art/<slug>.svg` + sibling
  `<slug>.svg.json` provenance file.

After both agents return, confirm:

1. MDX exists at `apps/web/src/content/articles/<slug>.mdx`.
2. SVG exists at `apps/web/public/hero-art/<slug>.svg`.
3. MDX frontmatter `heroImage: /hero-art/<slug>.svg` — path matches.
4. MDX frontmatter `heroImageAlt` is set and non-empty.

### Step 5 — Validate and extend `tags.json`

Read `apps/web/src/content/tags.json`. For every tag slug in the
article's frontmatter `tags` array, check for existence.

For each missing tag, apply the category heuristic (in priority order):

1. Contains a part brand name (Gateron, Cherry, Kailh, GMK, MT3,
   Topre, Alps, Boba…) → `brand`
2. Contains a layout term (75%, TKL, 60%, Alice, ergo, compact,
   split, ortho…) → `layout`
3. Contains a material term (POM, polycarbonate, aluminium, brass,
   PE, TPU…) → `material`
4. Contains a profile term (Cherry profile, OEM, SA, MT3, DSA,
   XDA, KAT, MDA…) → `profile`
5. Is a switch name, switch technique, or switch category
   (linear, tactile, clicky, spring, stem, housing…) → `switch`
6. Otherwise → `misc`

Add the missing tag(s) to `tags.json` as:

```json
{ "slug": "<slug>", "name": "<Display Name>", "category": "<category>" }
```

The `tags.json` array must remain sorted by `slug` (lexicographic
ascending) after any additions. If no tags are missing, skip this
step (no file change needed).

### Step 6 — Verify

```bash
pnpm verify
```

Full gate: `typecheck → test:run → data:validate → build → e2e`.

**Serial fallback for e2e flake:** if the e2e step fails, before
treating it as a real failure, retry once with:

```bash
pnpm --filter @thock/e2e e2e -- --workers=1
```

This rules out parallelism-induced flake (known class from the #418
hydration race). If the serial run also fails, that is a real failure
— debug the root cause.

Iterate up to 3 times on the same root cause. Stop per §8.

### Step 7 — Commit + push

Stage explicitly. Never `git add .`:

```bash
git add apps/web/src/content/articles/<slug>.mdx
git add apps/web/public/hero-art/<slug>.svg
git add apps/web/public/hero-art/<slug>.svg.json
# Only if Step 5 added tags:
git add apps/web/src/content/tags.json
```

Commit message (all lowercase "thock"):

```bash
git commit -m "$(cat <<'EOF'
content: <pillar> — "<article title>"

- Audit finding: rule-<N> content-gap, score <X>.
- publishedAt: <ISO date> (gap-fill: largest gap in 30-day window).
- ~<word-count> words, <section-count> sections.
- Tags: <tag1>, <tag2>[, <tag3>].
- Hero SVG: /hero-art/<slug>.svg (<splash-hue> splash, <motif>).
[- tags.json: added <N> new tag(s): <slug> (<category>).]

Closes #<N>
Cloud-Run: <cloud-run-url>
EOF
)"
git push origin main
```

**No `Co-Authored-By:` trailer. No emojis.**

The `Cloud-Run:` trailer is mandatory for every cloud-loop commit
(see `agents.md` cloud-mode rules). Local invocations omit it.

### Step 8 — Tick the audit

Flip the addressed finding to `[x]` in `plan/AUDIT.md` and append
the commit hash to the finding row. Commit separately (keeps the
article commit clean):

```bash
git add plan/AUDIT.md
git commit -m "$(cat <<'EOF'
audit: content-gap finding addressed — <pillar> article "<title>"

Cloud-Run: <cloud-run-url>
EOF
)"
git push origin main
```

### Step 9 — Confirm deploy

```bash
pnpm deploy:check
```

- **Exit 0 (ready):** site green. Continue to close-comment.
- **Exit 1 (error):** read log + patch + re-push. Up to 3 iterations
  on the same root cause; then stop per §8.
- **Exit 2 (timeout):** surface to log; continue.
- **Exit 3 (config):** `VERCEL_TOKEN` missing. Stop per §8.

Once green and `$N` is set:

```bash
node scripts/loop-issue.mjs close-comment \
  --number "$N" \
  --commit "$(git rev-parse HEAD~1)" \
  --deploy-url https://thock.xyz
```

Failure of `close-comment` is a warning, not a blocker.

### Step 10 — Done

Return cleanly. The loop's next tick re-dispatches.

## 5. Hard rules

1. **One article per tick.** Multi-article commits are unreviewable.
2. **Never commit a new article with `heroImage: null`.** Failure
   mode 5 in §8 is the only sanctioned exception; it files a
   backfill row so the gap is tracked.
3. **`publishedAt` must gap-fill** (Rule 4). Group-buy exception
   applies (use the buy's `startDate` / `announceDate`). Never set
   `publishedAt` to today unless today genuinely fills the largest
   gap in the 30-day window.
4. **`tags.json` must be valid** after any extension. Every tag
   object requires `slug`, `name`, `category` fields; slugs must be
   kebab-case; the array must remain sorted by `slug`.
5. **No `Co-Authored-By:` trailers. No emojis.** Cloud-shipped
   commits include the `Cloud-Run:` trailer; nothing else.
6. **Verify gate is non-negotiable.** No `--no-verify`.
7. **Issue mirror is best-effort, not gating.** Mirror failures
   are logged; the article ships regardless.

## 6. Quick reference

```bash
# Read state
plan/AUDIT.md                            # content-gap queue
plan/bearings.md                         # Rule 1–4 + voice + hero-art style
apps/web/src/content/articles/*.mdx      # existing articles + publishedAt dates
apps/web/src/content/tags.json           # existing tag taxonomy
data/group-buys/*.json                   # GB status + startDate
data/trends/<YYYY-WNN>.json              # tracker rows + articleSlug

# Write
apps/web/src/content/articles/<slug>.mdx    # via content-curator
apps/web/public/hero-art/<slug>.svg         # via brander
apps/web/public/hero-art/<slug>.svg.json    # via brander (provenance)
apps/web/src/content/tags.json              # extend for new tags
plan/AUDIT.md                               # tick the addressed row

# Sub-agents
Agent({ subagent_type: "content-curator", prompt: "..." })
Agent({ subagent_type: "brander", prompt: "..." })

# Verify + commit + push
pnpm verify
git add <explicit files>
git commit -m "<message>"
git push origin main

# Issue mirror
node scripts/loop-issue.mjs open --severity med --category content \
  --source audit --title "..." --body-file /tmp/loop-issue-body.md
node scripts/loop-issue.mjs close-comment --number N --commit SHA \
  --deploy-url https://thock.xyz
```

## 7. Call flow from `/march` and `/iterate`

```
/march
  Step 3a: pending phase?          → /ship-a-phase
  Step 3b: pending data?           → /ship-data
  Step 3b.5: content-gap queue ≥3? → /ship-content   ← NEW
  Step 3c: expand due?             → /expand
  Step 3d: else                    → /iterate

/iterate
  Step 3 delegation (content-gap) → /ship-content    ← UPDATED
  failure-mode 6 (no work, bold)  → /ship-content    ← UPDATED
                                    then /expand if no content queue
```

## 8. Failure modes — when to stop

1. **`pnpm verify` fails ≥ 3 times on the same root cause.** Open a
   GitHub issue: `gh issue create --title "Cloud march failed:
   <iso-date>" --body "<context + run URL>"`. Exit.
2. **`pnpm deploy:check` fails ≥ 3 times on the same root cause after
   verify passes.** Same — open an issue, exit.
3. **`VERCEL_TOKEN` missing** (deploy:check exit 3). Stop; report the
   config gap.
4. **content-curator returns empty or malformed MDX.** Retry once
   with a more explicit brief (add explicit word-count floor, pillar
   voice example, slug hint). If still malformed after retry, mark the
   row `[blocked: content-curator <ISO timestamp>]` in `AUDIT.md`,
   skip to the next-highest content-gap row, and attempt that one.
5. **brander fails to write the SVG.** Retry once with a more
   explicit subject mapping. If still failing, ship the article with
   `heroImage: null` in frontmatter and file an AUDIT.md row:
   `[LOW] <slug> missing heroImage — brander failed at <ISO timestamp>`.
6. **No content-gap rows scoring ≥ 3.0.** Exit cleanly. Log "no
   content queue." The caller (`/march`, `/iterate`) falls through to
   its next dispatch target.
7. **`git pull` divergence.** Stop and report; do not blind-rebase.
