# Skill: iterate

> **Full autonomy.** When invoked (manually, via `/iterate`, or
> under `/loop`), you have authority to audit thock, pick the
> highest-impact weakness, and ship one improvement end-to-end —
> no review checkpoint. The loop keeps the site alive after planned
> phases are done.

## 1. Purpose

Phases 1–15 build the structure. After they ship, the site is
**alive but thin**: 6 seed articles, sparse tags, manual data, no
weekly trend snapshots. `/iterate` is the loop that fills it in.

`/iterate` is also useful **during** the build phases as a separate
quality pass on already-shipped surfaces (broken links, missing
alt text, OG images that didn't render).

## 2. Invocation

```
/iterate                    # full audit, ship the top finding
/iterate audit              # audit-only; emit plan/AUDIT.md, no fix shipped
/iterate content-gaps       # bias audit toward content
/iterate data-gaps          # bias audit toward /data
/iterate seo                # bias toward metadata, OG, JSON-LD, sitemap
/iterate links              # broken-link sweep
/iterate a11y               # accessibility audit
/iterate tests              # missing tests, low coverage
/loop 1h /iterate           # autonomous improvement loop
```

When invoked under `/loop`, do not pause for review. Ship one
improvement per tick.

## 3. Autonomy contract

- **Many findings → one shipped fix per tick.** Multi-fix commits
  are unreviewable. The loop runs again; trust it.
- **Content gap → write the content.** If "no article tagged
  `gasket-mount` yet" is the top finding, **draft the article**
  (delegate to `content-curator`). Don't note the gap and move on.
- **Data gap → call `/ship-data` internally.** Read
  `skills/ship-data.md` and follow its procedure for the record
  fix; then return to iterate-mode for the commit-level work.
- **Trivial fix → still ships through verify.** Even a typo fix
  passes `pnpm typecheck && pnpm test:run`. The verify gate
  protects the loop from accidental regressions.

## 4. The audit (run unless `/iterate audit` is the only ask)

Score every finding `0–10` for `impact × ease`. Bias the score
toward shipping cheap wins; the loop favors momentum.

### Audit categories

#### Z. External critique (highest priority when present)

`plan/CRITIQUE.md` `## Pending` section is a finding source —
fresh-eyes feedback from `/critique` that hasn't been addressed.

- Each Pending row maps to a finding with category
  `external-critique`.
- Severity → impact:
  - `[HIGH]` → impact 8–10
  - `[MED]`  → impact 5–7
  - `[LOW]`  → impact 2–4
- Ease scored from suggested-fix complexity:
  - one-line edit / token tweak → ease 9
  - single-component change → ease 6
  - cross-cutting (multiple files, new component) → ease 4
  - design-rework or schema-touching → ease 2
- When you ship a fix for a critique finding, **move the row from
  `## Pending` to `## Done`** in `plan/CRITIQUE.md`, prefix with
  `[x]`, and append the addressing commit hash. This is the
  address-loop contract.

These findings compete fairly with the rest below — a high-severity
content gap can outrank a low-severity critique nitpick.

#### A. Content gaps

- Pillars with `< 5` articles → score by pillar prominence
  (Trends > News > Ideas > Deep Dives > Guides).
- Tags with `< 3` articles but high cross-link count → score high.
- Articles with `wordCount < 600` → flag for expansion (delegate
  to `content-curator`).
- Articles missing `heroImage` → flag (or defer to design pass).
- "Trend Tracker" rows lacking a linked deep-dive article.

#### B. Data gaps

- Run the audit in `skills/ship-data.md` §6 inline, score each
  finding the same way.
- Stale `data/trends/<YYYY-WW>.json` (no entry for current ISO
  week) → score 9; ship-data fix.
- Group buys past `endDate` not yet archived → score 6; ship-data
  fix.

#### C. SEO / discoverability

- Articles with default OG image (no per-article art) → score by
  pageviews (no analytics yet → score by recency).
- Pages missing JSON-LD or with malformed JSON-LD (run a parse
  check).
- Sitemap missing routes that exist in the code.
- `robots.txt` allowing/disallowing wrong paths.
- RSS feed validation failures.

#### D. Link integrity

- `<a href="/...">` to routes that don't exist.
- `<TagChip slug="...">` to tags not in `tags.json`.
- `<PartReference id="...">` to parts not in `frontmatter.mentionedParts`
  or not in `/data`.
- External vendor links that 404.

#### E. Accessibility

- Images without `alt`.
- Color contrast failures (run against the design tokens).
- Headings out of order.
- Focus-visible missing on interactive elements.

#### F. Tests

- Components without colocated `__tests__/`.
- E2E spec gaps (page family shipped with no e2e file).
- Untested helpers under `packages/*/src/`.

#### G. Performance

- Largest images on homepage (target: ≤ 200KB after Next/Image).
- Unused CSS classes in `components.css`.
- Bundle size regressions vs. last shipped phase (if Next.js
  build output is logged).

### Scoring

- Impact 0–10: how many readers / pages / queries does this affect?
- Ease 0–10: how cheap is the fix? Single edit = 9. New article =
  4. Schema migration = 1.
- Score = `impact × ease / 10`, clamped 0–10.

### User-source bump (from `/jot`)

Findings with `source: user` (filed via `/jot`) get a flat
**`+0.5`** on their final score, capped at `10`. Apply this
**after** `impact × ease / 10` and **before** the user-set
bias multiplier below.

Rationale: when the user has spotted something with their own
eyes (footer padding, a confusing CTA, a stranded `<Mono>`
span), it's almost always more valid than what the audit
auto-detected. The flat add (rather than a multiplier) means
high-severity user jots don't blow past everything; they just
edge ahead of comparable auto-detected findings at the same
severity. A user MED finding (default `/jot` severity) at
ease 7 lands around `5×7/10 + 0.5 ≈ 4.0`, beating most
ambient audit findings; a user HIGH lands around `8×7/10 +
0.5 ≈ 6.1` and typically wins the next pass.

### User-set bias (from `/oversight`)

Before scoring, check the top of `plan/AUDIT.md` for a line of the
form:

```
> Bias: <category> (set via oversight <date>)
```

If present, **multiply the score of every finding in that category
by 1.5** before ranking. The bias is sticky until removed; the user
clears it by running `/oversight reset` (which prompts to drop the
bias) or editing `AUDIT.md` directly. Apply this **after** the
user-source bump above (the multiplier sees the bumped score, but
the cap at `10` still holds).

Top 1 finding wins. Tie-break by:
1. Findings that unblock other findings (cascade).
2. Older findings (don't let things rot in AUDIT.md).
3. Cheapest-to-ship.

## 5. Procedure

### Step 0 — Sync

```bash
git pull --ff-only
```

If divergence, stop per §6.

### Step 1 — Audit (or read latest audit)

Run §4. Write findings to `plan/AUDIT.md` with this format:

```markdown
# Site audit — <ISO date>

## Top 5 findings (scored)

### [8.1] Trends pillar has 1 article — needs ≥ 4
- category: content-gaps
- impact: 9 (signature pillar)
- ease: 6 (one article per tick over 4 ticks)
- next: spawn content-curator → draft "<title>"

### [7.4] data/trends/2026-W19.json missing
- category: data-gaps
- impact: 8 (Trends Tracker dashboard)
- ease: 9 (templated weekly entry)
- next: /ship-data add trend 2026-W19

[...]
```

### Step 2 — Pick the work

Top scored finding. If `/iterate audit` was the invocation, stop
here — no fix shipped.

### Step 2.5 — Mirror to GitHub (phase 15a)

Open a public GitHub issue mirroring the picked finding **before**
doing the work. The issue tab on `daretodave/thock` becomes a live
timeline of "what the loop is shipping right now," with the issue
opening when work starts and auto-closing on the fix commit's
`Closes #N` trailer.

Skip this step in two cases:

1. The picked row already has an `- issue: #N` field (a previous
   tick mirrored it but didn't ship the fix; reuse the same number).
2. The picked row came from `/triage` routing (an `[user-issue
   #N]`-prefixed AUDIT.md row, or a `(issue #N)` reference in
   `data/BACKLOG.md`); the issue already exists publicly. Reuse `#N`.

Otherwise:

```bash
# 1. Build the body file from the finding row.
cat > /tmp/loop-issue-body.md <<EOF
**Source:** <pass description, e.g. "/critique pass 2 (reader sub-agent)" or "/jot 2026-05-09" or "/iterate audit 2026-05-09">
**Severity:** <HIGH|MED|LOW> · **Category:** <category from row> · **URL:** <url-or-"general">

## Observation
<verbatim from row's "observation" field>

## Evidence
<verbatim from row's "evidence" field>

## Suggested fix
<verbatim from row's "suggested fix" field>

---
_Tracked by the autonomous loop. The fix lands as a commit with \`Closes #<this-issue>\` in the body; this issue auto-closes when the commit pushes to main._
EOF

# 2. Map row severity → helper flag.
#    [HIGH] → high · [MED] → med · [LOW] → low
#
# 3. Map row "source" field → helper flag.
#    user → user · browser/reader → reader · audit/iterate → audit · external → external
#
# 4. Map row category → helper category.
#    visual / voice / navigation / mobile / external-critique → enhancement
#    content (article/data/copy gap) → content
#    a11y → a11y · seo → seo · perf → perf
#    bug-shaped (broken link, regression) → bug
#    Otherwise → enhancement.
#
# 5. Open the issue.
N=$(node scripts/loop-issue.mjs open \
    --severity <high|med|low> \
    --category <see mapping above> \
    --source <user|reader|audit|external> \
    --title "<one-line summary, ≤ 70 chars, lowercase 'thock'>" \
    --body-file /tmp/loop-issue-body.md)
echo "loop-issue: opened #$N"
```

Capture `$N` (the helper echoes only the number on stdout). On
**any failure** of `loop-issue.mjs open` (auth, rate limit,
network):

- Print the stderr to the iterate run log.
- Note the failure inline in the row as
  `- issue: [mirror-failed: <ISO timestamp>]` so the next tick
  knows to retry.
- Continue with the fix. **The mirror is best-effort, not gating**
  (Hard rule §7.7).

If the open succeeded, record the number on the row before
shipping. The CRITIQUE.md/AUDIT.md row gains a new line:

```markdown
- issue: #<N>
```

This row update is committed in Step 6 (Tick the audit), not
separately — keep tick churn low.

### Step 3 — Delegate or implement

For each category, default delegation:

- **Content gaps** → `content-curator` for the MDX prose, then
  `brander` for the article's hero SVG. New articles ship as a single
  bundle: prose at `apps/web/src/content/articles/<slug>.mdx` + hero
  at `apps/web/public/hero-art/<slug>.svg` (per `plan/bearings.md` §
  "Article hero art" — locked 2026-05-09) + provenance JSON sibling
  + frontmatter `heroImage` and `heroImageAlt` set in the same
  iterate commit. **Never commit a new article with `heroImage:
  null`** — the audit's "articles missing `heroImage`" finding
  (§4.A) exists to backfill *already-shipped* articles, not to let
  new ones ship art-less. Pass content-curator the topic, pillar,
  target word count, and voice guidelines from `bearings.md`. Pass
  brander the article's pillar + a one-line subject mapping
  (switch-deep-dive → cross-section, layout piece → silhouette,
  build piece → keyboard outline + callout, trends piece →
  sparkline, etc., per the directive's pillar examples) plus the
  per-article splash hue.
- **Data gaps** → follow `skills/ship-data.md` §5 inline (or
  effectively re-enter the ship-data flow within this tick).
- **SEO / link integrity / a11y / tests** → main agent implements.
- **Performance** → main agent investigates; may delegate to
  `scout` if external benchmarking needed.

For research-heavy fixes (a switch trend article, a vendor profile),
spawn `scout` in parallel with the implementation work to gather
context.

### Step 4 — Verify

```bash
pnpm verify
```

The full gate: typecheck + unit + data:validate + build + e2e.
Iterate up to 3 times on the same root cause. Stop per §6 if
unresolvable.

### Step 5 — Commit

Commit subject prefixes by category:
- `content:` — articles, pillar copy, MDX edits.
- `data:` — anything under `/data`.
- `seo:` — metadata, JSON-LD, sitemap, robots, RSS.
- `fix:` — bug fixes, broken links, regressions.
- `a11y:` — accessibility.
- `test:` — test additions or fixes only.
- `perf:` — performance work.
- `refactor:` — structural cleanup with no behavior change.

Body lists the audit finding ID/score, the fix, and the verify
result.

**If the addressed finding has an `- issue: #N` field on its row**
(populated either by Step 2.5 above, or carried in from `/triage`
routing), close the loop on GitHub in the same flow:

```bash
# Trailer in commit body (GitHub auto-links + auto-closes when pushed to main)
# - Closes #42

# After push + green deploy, post a follow-up confirmation comment.
# Step 7 (Confirm deploy) handles this — see below.
```

The `- Closes #<N>` trailer is **mandatory** in the commit body
when the row carries an issue number; it is the closing mechanism.
Multiple issues can be closed in a single commit (rare but supported)
by listing one trailer line per issue.

Load `GH_TOKEN` and `GH_REPO` from `.env` first if they aren't
already in the env (see `skills/triage.md` §3). The `loop-issue.mjs`
helper does this internally; manual `gh` calls outside the helper
need to do it themselves.

```bash
git add <explicit files>
git commit -m "$(cat <<'EOF'
content: trends — "Why low-profile is having a moment"

- Audit finding [8.1]: Trends pillar at 1 article.
- Drafted via content-curator; ~1100 words across 6 sections.
- Tagged: low-profile, choc, kailh, trends-2026.
- Cross-links: 3 switches, 2 boards, 1 vendor.

Decisions:
- Picked low-profile over Alice ergonomics — lower-volume but more
  movement vs. Alice which has plateaued (cf. Trends Tracker
  2026-W17).
EOF
)"
git push origin main
```

### Step 6 — Tick the audit

Flip the addressed finding to `[x]` in `plan/AUDIT.md` and append
the commit hash. Commit:

```bash
git add plan/AUDIT.md
git commit -m "audit: finding [8.1] addressed"
```

### Step 7 — Confirm deploy

```bash
pnpm deploy:check
```

Same contract as `ship-a-phase` Step 12. A red deploy after an
iterate fix is treated identically to a red verify gate: read the
log, patch, push again. Up to 3 same-root-cause iterations.

**Once deploy:check is green and the row carried an `- issue: #N`,
post the close-comment** (the `Closes #N` commit trailer already
auto-closed the issue; the comment confirms the deploy URL):

```bash
node scripts/loop-issue.mjs close-comment \
  --number <N> \
  --commit <commit-sha> \
  --deploy-url https://thock-coral.vercel.app
```

Failures of `close-comment` are warnings, not blockers — the fix
shipped, the issue is closed, the comment is just polish. Continue
to Step 8.

### Step 8 — Done

Return cleanly. Loop's next tick re-audits and ships the new top.

## 6. Failure modes — when to stop

1. **`pnpm verify` fails ≥3 times on the same root cause.**
2. **`pnpm deploy:check` fails ≥3 times on the same root cause
   after a fix shipped.** Read the log; if local + Vercel
   diverge, that's worth surfacing.
3. **`VERCEL_TOKEN` missing** (deploy:check exit 3). Stop.
4. **A finding requires schema migration > 20 records.** Push it
   to `/plan-a-phase` instead.
5. **A finding requires user judgment** (e.g. "should we cover
   this controversial vendor?"). Surface to AUDIT.md as a
   `[needs-user-call]` row, skip it, ship the next finding.
6. **No actionable iterate work** (top score < 3.0). Read
   `plan/bearings.md` "Plan expansion posture":
   - **bold** or **autonomous** (thock's default is bold) →
     dispatch to `/expand` instead of stopping. "Make things
     brilliant when delivery is not." Log "no actionable
     iterate work — handing to expand" and execute
     `skills/expand.md` procedure end-to-end.
   - **strict** posture → stop and report. Site is
     well-iterated; sleep until the user gives new direction.
7. **`git pull` divergence.**

Everything else: decide, ship, document. The loop continues.

## 7. Hard rules

1. **One fix per tick.** Multi-fix commits don't ship.
2. **Verify gate must pass.** No `--no-verify`.
3. **No emojis, no `Co-Authored-By:`.**
4. **Don't write content yourself if `content-curator` exists** —
   delegate. The main agent shouldn't be the bottleneck for prose.
5. **Don't audit blindly when work is queued.** If `data/BACKLOG.md`
   has rows, prefer running `/ship-data` for one tick over a fresh
   audit; the audit cost is amortized.
6. **Never delete shipped content silently.** Archive (move to
   `apps/web/src/content/articles/archive/`) and update routing.
7. **Issue mirror is best-effort, not gating.** If
   `loop-issue.mjs open` fails (auth, rate limit, network), note
   `- issue: [mirror-failed: <ISO timestamp>]` on the row and ship
   the fix anyway. Likewise, `close-comment` failures after a
   green deploy are warnings, not blockers. The mirror is a
   public timeline, not a verification step.

## 8. Quick reference

```bash
# Read
plan/AUDIT.md                            # latest findings
plan/bearings.md                         # voice + standing decisions
data/                                    # GitHub-as-DB
apps/web/src/content/                    # MDX articles + tags

# Sub-agents
Agent({ subagent_type: "content-curator", prompt: "..." })
Agent({ subagent_type: "scout", prompt: "..." })
Agent({ subagent_type: "data-steward", prompt: "..." })

# Verify + commit
pnpm verify
git add <explicit files>
git commit -m "<category>: <subject>"
git push origin main

# Issue mirror (phase 15a)
node scripts/loop-issue.mjs open --severity ... --category ... \
  --source ... --title "..." --body-file /tmp/loop-issue-body.md
node scripts/loop-issue.mjs close-comment --number N --commit SHA \
  --deploy-url https://thock-coral.vercel.app
```
