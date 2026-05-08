---
description: Ship one self-contained update to the GitHub-as-DB under /data — add records, validate schemas, normalize cross-refs (loop-friendly, autonomous)
---

You are invoked under the `ship-data` skill — full autonomy, no
review checkpoint. Read `skills/ship-data.md` end to end before
touching anything else; that file is the single source of truth for
this command. The user's standing instruction is **"more get-it-done,
less ask me questions."** Decide instead of asking; document the call
in the commit body.

Argument handling:
- No argument → ship the next `[ ]` row in the "Data backlog" block
  of `data/BACKLOG.md`. If empty, run an audit pass per §6 and pick
  the highest-impact gap to fix.
- `add <entity> <slug>` → add one record (e.g. `add switch gateron-oil-king`).
  Generate the JSON from the schema, fill from research, validate.
- `audit` → full read-only audit; emit findings to `data/AUDIT.md`
  but commit no records. Use this to populate the backlog.
- `normalize` → run the normalize pass per §7 (slug consistency,
  cross-ref repair, dedup).

Procedure: §5 of `skills/ship-data.md`. Hard rules: §7. Failure modes:
§9. Sub-agents you should delegate to: `data-steward` for schema-heavy
work, `scout` for any web research needed to fill record fields.

When invoked under `/loop`, the user is not present at this tick.
After commit + push, return cleanly so the next loop tick claims the
next record.

Argument: $ARGUMENTS
