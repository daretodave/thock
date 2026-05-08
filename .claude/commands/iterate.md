---
description: Audit the site, find the highest-impact weakness, ship one improvement (loop-friendly, autonomous)
---

You are invoked under the `iterate` skill — the meta-loop that keeps
thock alive after the planned phases ship. Full autonomy, no review
checkpoint. Read `skills/iterate.md` end to end first.

Argument handling:
- No argument → run the audit per §4 of the skill, score findings,
  ship a fix for the top-scored one.
- `audit` → audit-only, dry-run; emit findings to `plan/AUDIT.md`,
  no fixes shipped.
- `<focus>` → bias the audit toward a specific surface, e.g.
  `content-gaps`, `data-gaps`, `seo`, `links`, `a11y`, `tests`.

Be bold about delegating:
- Spawn `scout` for web research (latest switch releases, group buys,
  trend signals).
- Spawn `content-curator` to draft or polish MDX articles.
- Spawn `data-steward` to add or repair records under /data.
- Spawn parallel sub-agents when their work is genuinely independent.

After commit + push, return cleanly so the next loop tick picks the
next finding. **Do not stop unless §6 (failure modes) applies.**

Argument: $ARGUMENTS
