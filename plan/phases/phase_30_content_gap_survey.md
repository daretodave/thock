# Phase 30 — Content-velocity queue auto-refill

> **Outcome:** the content-gap queue in `plan/AUDIT.md` is
> self-replenishing. A new Rule-1 row files automatically after every
> drain (via `skills/ship-content.md` Step 8 amendment) and the
> `skills/march.md` Step 3b.5 check queries the helper before falling
> through to expand. No external priming required.

---

## Why

The operational gap surfaced by expand pass 7: the seed-primed Rule-1
queue exhausted itself at commit `702b8a9` (40 articles total, 8/8 all
pillars) and the cloud loop started falling through to expand/iterate
polish instead of content velocity. Articles aged past 30 days will
silently drain pillar counts below the 2-article floor; without a row
to act on, the loop never ships the refill.

The fix: a lightweight Node script that computes the current 30-day
window count per pillar and emits the top-priority audit row. Two call
sites: `skills/ship-content.md` Step 8 (post-drain, writes next row in
same audit commit) and `skills/march.md` Step 3b.5 (inline check, refills
on empty queue before falling through).

---

## Scope

### New file: `scripts/content-gap-survey.mjs`

Pure Node.js (no TS compilation needed — same pattern as
`scripts/deploy-check.mjs`). ESM. No external deps beyond Node 20+
built-ins + gray-matter (installed in @thock/content dev-deps).

**Algorithm (Rule 1 sliding window):**

1. Read all MDX frontmatter from `apps/web/src/content/articles/*.mdx`
   using `fs` + `gray-matter` (no build step needed; reads raw files).
2. Compute `windowStart = today − 30 days` (midnight UTC, ISO string).
3. For each pillar `{news, trends, ideas, deep-dives, guides}`, count
   articles with `publishedAt >= windowStart`.
4. State classification:
   - count ≥ 2 → **comfortable** — skip
   - count === 1 → **hot pursuit** — score 7.0
   - count === 0 → **critical hot pursuit** — score 9.5
5. Collect only pillars that are hot-pursuit or critical.
6. If none, exit with "all pillars comfortable — no row filed." (exit 0,
   no AUDIT.md write).
7. Sort candidates: critical first, then hot; tie-break by oldest
   most-recent publishedAt (pillar that has gone longest without a new
   piece); secondary tie-break: lowest window count; tertiary:
   editorial prominence (Trends > News > Ideas > Deep Dives > Guides).
8. Take the top candidate.
9. **Output mode selection via `--write` flag:**
   - Without `--write` (dry-run default): print the formatted row to
     stdout. Exit 0.
   - With `--write`: append the formatted row to `plan/AUDIT.md` under
     "## Open findings" and print confirmation. Exit 0.

**Rule 4 (gap-fill) note:** the gap-fill date for the new article is
computed by `skills/ship-content.md` Step 2 at article-ship time, not
by this script. This script only files the audit row; the publish date
is set when the article is drafted.

**Rule 2 / Rule 3 (tracker linkage, group-buy companion):** out of scope
for this script — those rules require reading `data/trends/*.json` and
`data/group-buys/*.json`. They remain a manual `/iterate` audit pass for
now; this script handles the Rule-1 sliding window only.

**AUDIT.md row format emitted:**

```markdown
### [<state-label>] [content-gap] [<score>] <pillar> pillar — <count> of ≥2 articles in last 30d
- category: content-gaps
- impact: <pillar-impact> (Rule 1 sliding window — <state>)
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: <pillar>
- window-count: <count>
- window-start: <ISO-date>
- score: <score>
- next: /ship-content → <pillar> pillar article
> Filed <ISO-date> by content-gap-survey.mjs (auto-refill). <state-description>
```

Where `<state-label>` is `HOT PURSUIT` (score 7.0) or `CRITICAL HOT
PURSUIT` (score 9.5), and `<pillar-impact>` is:
- Trends: 8
- News: 7
- Ideas: 7
- Deep Dives: 6
- Guides: 5

**CLI interface:**

```bash
# Dry-run (print the row, no file write)
node scripts/content-gap-survey.mjs

# Write to plan/AUDIT.md
node scripts/content-gap-survey.mjs --write

# JSON output (for programmatic callers)
node scripts/content-gap-survey.mjs --json
```

Exit codes:
- 0: success (comfortable → no-op, or row found/written)
- 1: error (filesystem read failure, malformed frontmatter)

---

### Unit tests: `packages/content/src/__tests__/util/content-gap-survey.test.ts`

Two required tests (from build plan):

**Test A:** "1 article in 30d, deep-dives" → rule=1 pillar='deep-dives' score=7.0

```ts
// Mock article list: one deep-dives article dated yesterday;
// all other pillars have ≥2 articles.
// Expected: state='hot-pursuit', pillar='deep-dives', score=7.0
```

**Test B:** "0 articles in 30d, news" → score=9.5 with
critical-hot-pursuit framing

```ts
// Mock article list: no news articles in the window;
// all other pillars comfortable.
// Expected: state='critical-hot-pursuit', pillar='news', score=9.5
```

The script exports a pure `surveyContentGaps(articles, today)` function
for testing (the CLI wiring is the thin entry point that reads files).

---

### Amendment: `skills/ship-content.md` Step 8

After ticking the audit row to `[x]` and before the final push of the
audit commit, add:

> **Step 8a — Auto-refill (post-drain):**
>
> ```bash
> node scripts/content-gap-survey.mjs --write
> ```
>
> If the script exits 0 and wrote a new row, `git add plan/AUDIT.md` is
> already staged in the same audit commit (the `--write` flag appends to
> the same file). If the script prints "all pillars comfortable — no row
> filed," that is normal — skip the add. If the script exits non-zero,
> log the error and continue (the tick is not blocked by refill failure).

This keeps the article commit clean (one article per commit) and bundles
the next audit row into the same audit commit.

---

### Amendment: `skills/march.md` Step 3b.5

After the existing "collect Pending content-gap findings" check and the
"any row scores ≥ 3.0 → /ship-content" branch, add a new sub-step before
falling through:

> **Step 3b.5a — Empty-queue refill:**
>
> If no Pending content-gap rows exist (or all score < 3.0):
>
> ```bash
> node scripts/content-gap-survey.mjs --write
> ```
>
> Re-read `plan/AUDIT.md`. If a new row was written:
>
> ```bash
> git add plan/AUDIT.md
> git commit -m "audit: content-gap row auto-filed by content-gap-survey.mjs"
> git push origin main
> ```
>
> Then dispatch `/ship-content`. If still no row (all pillars
> comfortable), fall through to Step 3c (expand).

---

## Tests matrix

| Test file | What it covers |
|---|---|
| `packages/content/src/__tests__/util/content-gap-survey.test.ts` | Pure `surveyContentGaps()`: hot-pursuit scoring, critical-hot-pursuit scoring, comfortable no-op, tie-breaking by oldest publishedAt, prominence ordering |

No e2e change required — this is a scripts-layer utility with no
rendered surface. The verify gate already runs `test:run`.

---

## No new routes, no sitemap changes

Phase 30 is purely operational infrastructure (script + skill amendments).
No URL contract changes.

---

## Decisions made upfront — DO NOT ASK

1. **ESM plain JS, not TypeScript:** same pattern as `deploy-check.mjs`
   and `deploy-smoke.mjs` — avoids a separate tsconfig target and keeps
   the script runnable as `node scripts/content-gap-survey.mjs` with no
   build step.

2. **gray-matter for frontmatter parsing:** already a dep of
   `@thock/content`; imported directly by the script using a relative
   path to `node_modules` or `import.meta.resolve`. The scripts run from
   the repo root where `gray-matter` is installed via `@thock/content`
   devDeps.

3. **Exported pure function for testability:** `surveyContentGaps(articles,
   today)` is the testable core. The CLI entry reads files and calls it.
   Tests import the function directly — no filesystem mocking needed.

4. **Rule 1 only:** Rules 2/3 remain manual audit-pass territory.
   This script is scoped to the sliding-window freshness problem that the
   expand pass 7 surfaced. Adding Rules 2/3 is a follow-up if the loop's
   behavior shows they need similar automation.

5. **One row per run:** the script emits at most one row (the top
   candidate). Multi-row pre-fill was explicitly ruled out in the build
   plan — no pre-fill, one row per drain.

6. **`--write` flag design:** dry-run default is safer; explicit `--write`
   is required from the skill files. This prevents accidental duplicate
   row writes if the script is run manually.

7. **Impact ramp by pillar:** Trends=8, News=7, Ideas=7, Deep Dives=6,
   Guides=5. These match the bearings Rule 1 prominence ramp from
   `skills/iterate.md` §4.A.

8. **window-start in row metadata:** logged so future audits can verify
   the computation without re-running the script.

---

## DoD

- [ ] `scripts/content-gap-survey.mjs` exists, runs from repo root,
      passes dry-run and `--write` modes.
- [ ] `packages/content/src/__tests__/util/content-gap-survey.test.ts`
      exists with tests A and B passing.
- [ ] `skills/ship-content.md` Step 8 amended with Step 8a.
- [ ] `skills/march.md` Step 3b.5 amended with Step 3b.5a.
- [ ] `pnpm verify` green.
- [ ] `plan/steps/01_build_plan.md` Phase 30 ticked `[x]`.

---

## Follow-ups (out of scope)

- Rules 2/3 automation (tracker-linkage + group-buy companion) — a
  follow-up `/expand` candidate once the Rule-1 automation proves stable.
- `pnpm content:survey` npm script alias — cosmetic convenience for local
  use; not needed for the loop.
