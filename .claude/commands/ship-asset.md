---
description: Render and ship one brand asset (OG image, favicon, social card, SVG → PNG, wordmark variant). Demand-pull only; gated on Surface: site. Loop-friendly, autonomous.
---

You are invoked under the `ship-asset` skill — full autonomy,
no review checkpoint. Read `skills/ship-asset.md` end to end
before touching anything else; that file is the single source
of truth for this command.

**Step 0 (unconditional):** read `plan/bearings.md`'s
`Surface:` line. If the value is not `site` or `hybrid`, exit
0 immediately with a one-line note. Do not commit. Do not
spawn `brander`. There is no override flag. thock today is
`Surface: site` — proceed.

Argument handling:
- No argument → pick the highest-scoring asset finding from
  `plan/CRITIQUE.md` Pending or `plan/AUDIT.md` (categories
  `seo` / `visual` / `asset` whose suggested fix is an asset
  render). Score by impact × ease per `/iterate`'s rubric.
- `og <route-path>` → render OG for one route.
- `favicon` → (re)render the favicon set
  (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`).
- `social <route-path>` → render Twitter/X + LinkedIn variants.
- `svg2png <design-path>` → one-shot SVG → PNG conversion.
- `audit` → audit-only; emit findings to `plan/AUDIT.md`
  under category `asset`; commit no rasters.

**Always delegate the render** to the `brander` sub-agent at
`.claude/agents/brander.md`. `ship-asset` does not call
`satori`/`resvg` directly. brander returns paths and
provenance; the skill commits + pushes.

**One asset per invocation.** No batching. Provenance JSON
sibling is required for every generated raster — never commit
the PNG without it. Never overwrite a hand-authored asset
(one without a provenance sibling).

Procedure: §6 of `skills/ship-asset.md`. Hard rules: §8.
Failure modes: §9. When taste calls are needed (mood,
accent, wordmark style), the user runs `/oversight` — see
§10. `/ship-asset` itself never asks questions.

After commit + push, run `pnpm deploy:check` then
`pnpm deploy:smoke`, return cleanly so the next loop tick
picks the next finding.

Argument: $ARGUMENTS
