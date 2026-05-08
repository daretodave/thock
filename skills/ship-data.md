# Skill: ship-data

> **Full autonomy.** When invoked (manually, via `/ship-data`, or
> under `/loop`), you have authority to add, repair, or normalize
> records in `/data` (the GitHub-as-DB) end-to-end with **no review
> checkpoint**: derive the JSON, validate against the schema, run
> `pnpm data:validate`, commit, push.
>
> **The bar for asking is high.** If you would have asked, decide.
> Document the call in the commit body. Stop only on §9.

## 1. Purpose

`/data/` is the structured-data layer of thock. Every keyboard
entity that articles reference lives here as a JSON file:

```
data/
├── README.md
├── BACKLOG.md                  # [ ] rows ship-data reads next
├── AUDIT.md                    # latest audit findings (rewritten by audit pass)
├── schemas/                    # JSON Schema files (Zod-derived)
│   ├── switch.schema.json
│   ├── keycap-set.schema.json
│   ├── board.schema.json
│   ├── vendor.schema.json
│   ├── group-buy.schema.json
│   └── trend.schema.json
├── switches/<slug>.json
├── keycap-sets/<slug>.json
├── boards/<slug>.json
├── vendors/<slug>.json
├── group-buys/<slug>.json
└── trends/<YYYY-WW>.json       # weekly snapshot files
```

The package `@thock/data` exposes typed loaders for the web app
(`getSwitch`, `getAllSwitches`, `getActiveGroupBuys`, etc.) plus
the validate script (`pnpm --filter @thock/data validate`). Every
JSON file under `/data/` is the database; PRs are migrations; CI
validates.

## 2. Invocation

```
/ship-data                          # next [ ] in data/BACKLOG.md, or audit→fix
/ship-data add switch gateron-oil-king
/ship-data audit                    # audit-only; rewrites data/AUDIT.md
/ship-data normalize                # cross-ref + slug repair
/loop 30m /ship-data                # autonomous backlog burndown
```

When invoked under `/loop`, do not pause for review.

## 3. Autonomy contract

- **Missing field → research, don't ask.** Spawn `scout` (sub-agent
  with WebSearch/WebFetch) to gather the field, then fill it. If the
  field is genuinely unknowable from public sources, pick the most
  conservative valid value the schema allows and note in the commit
  body under "Decisions".
- **Schema gap → propose an addition.** If a field belongs in the
  schema but isn't there yet, add it as `optional()` in the Zod
  source, regenerate the JSON Schema, and proceed. Never invent
  fields outside the schema.
- **Cross-reference broken → repair, don't ignore.** If a switch
  record references `vendor: "novelkeys"` but `data/vendors/novelkeys.json`
  doesn't exist, create the vendor stub as part of the same commit.
- **Audit finds 50 problems → ship one fix per phase, not all at
  once.** A loop tick ships one cohesive change. Multi-fix
  commits are unreviewable.

## 4. Delegation (be bold)

- **`scout` sub-agent** — delegate any web research. Switch specs,
  vendor URLs, group-buy dates, manufacturer details. Give scout
  the entity slug + schema fields needed; let it return a populated
  JSON object you validate.
- **`data-steward` sub-agent** — delegate schema-heavy work: adding
  a new entity type, restructuring a schema, mass cross-reference
  audits.
- **Parallel calls** when work is independent: e.g. researching 5
  new switches in parallel before merging the results into one
  commit (one commit per record is the default; bundle only if all
  are tightly related).

## 5. The procedure

### Step 0 — Re-sync

```bash
git pull --ff-only
```

If divergence, stop per §9.

### Step 1 — Pick the work

Read `data/BACKLOG.md`. The next item is the first `[ ]` row.

If the backlog is empty (or the user passed `audit`), run the audit
in §6, write findings to `data/AUDIT.md`, pick the highest-scored
finding, and append it to `data/BACKLOG.md` as a new `[ ]` row, then
proceed with that as the work.

If the user passed `add <entity> <slug>`, that's the work. If the
user passed `normalize`, jump to §7.

### Step 2 — Read the schema

```bash
cat data/schemas/<entity>.schema.json
```

This is your contract. The Zod source lives at
`packages/data/src/schemas/<entity>.ts`. The JSON Schema file is
generated from it; if you need to edit the schema, edit the Zod
source and regenerate via `pnpm --filter @thock/data schema:generate`.

### Step 3 — Research the record

If the record needs external research (specs, dates, URLs), spawn
`scout`:

> Agent({ subagent_type: "scout", prompt: "Research <entity> <slug>:
> fill these fields per schema: ..." })

Scout returns a populated draft. Validate it locally before committing.

### Step 4 — Write the JSON

```bash
data/<entity>/<slug>.json
```

Use the schema. Slug convention: `kebab-case`, derived from the
canonical name. No spaces, no underscores, no apostrophes (strip them
or substitute with `-`).

### Step 5 — Validate

```bash
pnpm data:validate
```

This runs every record under `/data/` through its schema and checks
cross-references (e.g. every `switches[].vendorId` must point to an
existing `vendors/<id>.json`). Iterate up to 3 times on the same
root cause. If still failing, stop per §9.

### Step 6 — Wire (only if first record of a new entity type)

If you just added the first record of a new entity type, also:
- Add a loader in `packages/data/src/<entity>.ts`
  (`getAll<Entity>`, `get<Entity>BySlug`).
- Add the loader's tests under `packages/data/src/__tests__/`.
- Re-export from `packages/data/src/index.ts`.

For subsequent records of an existing type, skip this — the loader
already exists.

### Step 7 — Commit

```bash
git add data/<entity>/<slug>.json [+ schema if changed] [+ loader if new entity]
git commit -m "$(cat <<'EOF'
data: add <entity> <slug>

- Source: <where the data came from — vendor site, manufacturer
  spec sheet, etc.>
- Cross-refs: <if any — vendors, parent boards, etc.>

Decisions:
- <judgement call you made>
EOF
)"
git push origin main
```

If the backlog had this row, flip its `[ ]` → `[x]` in `data/BACKLOG.md`
in the same commit.

### Step 8 — Confirm deploy

Same as `ship-a-phase` Step 12. Run:

```bash
pnpm deploy:check
```

Data-only commits still trip a Netlify rebuild (the site reads
data at build time). A red deploy after a data ship is a real
regression — read the log, patch (often: revert the data edit
that broke validation in production), push again. Up to 3 same-
root-cause iterations; otherwise stop per §9.

### Step 9 — Done

Return cleanly. Loop's next tick picks up the next backlog row.

## 6. Audit pass (when invoked with `audit` or empty backlog)

Score each finding 0–10 by impact × ease.

**Findings to surface:**

1. **Orphan references.** Articles or other records reference a
   slug that doesn't exist in `/data`. Score by reference count.
2. **Schema drift.** A record validates against an old schema but
   the schema has new required fields.
3. **Stale group buys.** `endDate < today`. Move to
   `data/group-buys/archive/<slug>.json` (subdirectory), update
   loader to skip archived.
4. **Trend snapshot stale.** No new file in `data/trends/` for the
   current ISO week.
5. **Switch coverage gaps.** Articles mention switches with no
   record. (Cross-grep `<Mono>` and `<PartReference>` usages
   against `data/switches/`.)
6. **Vendor coverage gaps.** Same idea for vendors.
7. **Image fields empty.** Records with `image: null` should be
   filled (delegate to scout for hero image URLs from vendor pages).
8. **Cross-reference symmetry.** If `switch.vendor === "novelkeys"`,
   does `vendors/novelkeys.json` list this switch? Both directions
   should agree (or only one side is canonical — document which in
   `data/README.md`).

Write findings to `data/AUDIT.md` with this format:

```markdown
# Data audit — <ISO date>

## Findings (scored 0–10)

### [9] Orphan reference: switch "drop-holy-panda" mentioned in 3 articles, no record
- impact: 9 (3 articles, 1 home-page hero)
- ease: 4 (need to research the rebadge story)
- next: `add switch drop-holy-panda`

### [7] Stale group buy: keycult-no2-r4
- ...
```

## 7. Normalize pass

When invoked with `normalize`:

- **Slug consistency.** Every JSON filename must match its `slug`
  field. Walk the tree, fix mismatches.
- **Cross-ref repair.** Walk every record's foreign-keys; if a
  target doesn't exist, either create a stub (with `status:
  "stub"`) or remove the orphan ref.
- **Dedup.** If two records share a `name` or `aliases`, merge.
- **Archive expired.** Group buys with `endDate < today` move to
  `archive/`.
- **Sort numeric arrays.** `aliases`, `tags`, `cross-refs` — sort
  alphabetically for stable diffs.

Commit each category as its own commit (`data: normalize slugs`,
`data: archive expired group buys`, etc.). Many small commits beat
one mega-commit; the loop can be interrupted between them safely.

## 8. Hard rules

1. **Schema is law.** Never write a JSON file that doesn't validate.
2. **No `Co-Authored-By:` in commits. No emojis.**
3. **One record per file.** No giant arrays-as-database files.
4. **Slugs are URL-safe.** `kebab-case`, `[a-z0-9-]+` only.
5. **Cross-refs use slugs, not names.** Slugs are forever; names
   change.
6. **Never delete records.** Archive (move to `archive/`) or mark
   `status: "deprecated"`. The DB is append-mostly.
7. **`pnpm data:validate` must pass before commit.**

## 9. Failure modes — when to stop

1. **`pnpm data:validate` fails ≥3 times on the same root cause.**
2. **`pnpm deploy:check` fails ≥3 times on the same root cause
   after a data ship.** Often this means the data crossed a
   schema boundary that local validate didn't catch; fetch the
   deploy log and surface it.
3. **`NETLIFY_AUTH_TOKEN` missing** (deploy:check exit 3). Stop
   and ask the user to populate `.env`.
4. **Schema change requires migration of >20 existing records.**
   That's a /plan-a-phase task; don't bundle into a ship-data tick.
5. **A research task requires login or paid access.** Scout reports
   the gate; you stop and report.
6. **`git pull` produces divergence.**

Everything else: decide and ship. The loop continues.

## 10. Quick reference

```bash
# Read
data/BACKLOG.md                          # what to ship next
data/AUDIT.md                            # latest findings
data/schemas/<entity>.schema.json        # contract
packages/data/src/<entity>.ts            # loaders

# Write
data/<entity>/<slug>.json                # the record
packages/data/src/schemas/<entity>.ts    # only if extending the schema
packages/data/src/<entity>.ts            # only first record of a new type

# Validate + commit + push
pnpm data:validate
git add <explicit files>
git commit -m "..."
git push origin main
```
