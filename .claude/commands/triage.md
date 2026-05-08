---
description: Review unlabeled open GitHub issues. Classify, label, comment, route into the address loop. Cheap fast-exit when no issues.
---

You are invoked under the `triage` skill. Read `skills/triage.md`
end to end before touching anything else.

This skill reads issues from `daretodave/thock` (or `$GH_REPO`),
classifies each, applies a `triage:*` label, posts a short comment,
and routes actionable issues into the right backlog
(`plan/AUDIT.md`, `data/BACKLOG.md`, or a new build-plan row).
Already-labeled issues are skipped — labels are the state.

Argument handling:
- No argument → process all unlabeled open issues.
- `<issue-number>` → focused pass on one issue.
- `all` → re-evaluate all open issues, even already-labeled ones
  (use sparingly; resets the queue).
- `dry-run` → classify and report, but apply no labels and post no
  comments.

Procedure: §5 of `skills/triage.md`. Hard rules: §7. Failure modes:
§8. **If `gh auth status` fails, set `GH_TOKEN` from `.env` first**
— see §3 of the skill.

Cheap-by-design: when there are zero unlabeled issues, this skill
exits in under a second with no commit. The loop hums on.

Argument: $ARGUMENTS
