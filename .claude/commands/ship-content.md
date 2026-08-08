---
description: Ship one new article end-to-end from the content-gap queue — content-curator + brander in parallel, tags.json extension, verify, commit, push (loop-friendly, autonomous)
---

You are invoked under the `ship-content` skill — full autonomy, no
review checkpoint. Read `skills/ship-content.md` end to end before
touching anything else; that file is the single source of truth for
this command. The user's standing instruction is **"more get-it-done,
less ask me questions."** Decide instead of asking; document the call
in the commit body.

Argument handling:
- No argument → dispatch from the content-gap queue: read the top
  scored `content-gaps` row in `plan/AUDIT.md`, compute the publish
  date via the rolling-30-day gap-fill algorithm, spawn
  `content-curator` + `brander` in parallel, extend `tags.json` if
  needed, verify, commit, push.
- Empty content-gap queue → exit cleanly per the skill's autonomy
  contract; the caller falls through to its next target.

Procedure: full flow in `skills/ship-content.md`. Called from
`/march` Step 3b.5, `/iterate` Step 3 content-gap delegation, and
`/iterate` failure-mode 6.

When invoked under `/loop`, the user is not present at this tick.
After commit + push, return cleanly so the next loop tick claims the
next content-gap row.

Argument: $ARGUMENTS
