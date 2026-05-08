---
description: Pause autonomy. Audit current state, brief the user, ask targeted questions, adjust the plan, push the adjustments. The user-in-the-loop command.
---

You are invoked under the `oversight` skill — the **opposite of
autonomous**. The user has paused the loop (or never started one)
to course-correct. Read `skills/oversight.md` end to end before
touching anything.

This is the only skill that uses `AskUserQuestion`. The other
shipping skills decide and ship; this one observes, briefs, asks,
adjusts.

Argument handling:
- No argument → full audit + general questionnaire.
- `phase` → bias the audit toward phase progress + scope.
- `content` → bias toward content / `/iterate` findings.
- `deploy` → bias toward Netlify state + CI/CD signal.
- `reset` → bias toward scope reduction (drop work, simplify).

Procedure: §6 of `skills/oversight.md`. The skill writes plan
adjustments only — it does **not** modify code in `apps/` or
`packages/`. Adjustments commit as `oversight: <summary>` and
push.

If invoked under `/loop`, that's a misconfiguration — the loop
should never call oversight. Stop and tell the user.

Argument: $ARGUMENTS
