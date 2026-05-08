# /data — GitHub-as-DB

Structured data for thock. Every record is a JSON file. The repo is
the database. PRs are migrations. CI validates. The web app reads
via `@thock/data` typed loaders — never reaches into the filesystem
directly.

## Why JSON-in-repo

- **Hermetic.** No external DB to provision, no API keys, no rate
  limits. The autonomous loop never has to authenticate.
- **Diffable.** Every change is a reviewable PR.
- **Typed.** Zod schemas in `packages/data/src/schemas/`; generated
  JSON Schema in `data/schemas/`.
- **Portable.** If we outgrow this, exporting to a real DB is a
  one-time migration.

## Layout

```
data/
├── README.md                      # this file
├── BACKLOG.md                     # [ ] rows /ship-data reads next
├── AUDIT.md                       # latest /ship-data audit findings
├── schemas/                       # generated JSON Schema (do not hand-edit)
│   ├── switch.schema.json
│   ├── keycap-set.schema.json
│   ├── board.schema.json
│   ├── vendor.schema.json
│   ├── group-buy.schema.json
│   └── trend.schema.json
├── switches/<slug>.json           # one file per switch
├── keycap-sets/<slug>.json
├── boards/<slug>.json
├── vendors/<slug>.json
├── group-buys/<slug>.json
├── group-buys/archive/<slug>.json # past end-date; loader skips
└── trends/<YYYY-WW>.json          # weekly snapshot files
```

## Ground rules

1. **Zod is the source of truth.** Schemas live in
   `packages/data/src/schemas/<entity>.ts`. The JSON Schema files
   under `data/schemas/` are generated. Don't hand-edit them.
2. **One record per file.** No giant arrays-as-database.
3. **Slugs are URL-safe.** `kebab-case`, `[a-z0-9-]+`. The
   filename matches the `slug` field.
4. **Cross-refs use slugs.** A switch references its vendor by
   slug, not by name. Slugs are forever; names change.
5. **Append-mostly.** Never delete records. Archive (move to
   `archive/`) or set `status: "deprecated"`.
6. **`pnpm data:validate` must pass.** Every record validates
   against its schema; every cross-reference resolves.

## How records get added

Three flows, smallest to largest:

- **One record at a time** — `/ship-data add <entity> <slug>`. The
  agent (or its `scout` sub-agent) sources the data and writes the
  JSON. One commit per record.
- **Backfill from articles** — `/ship-data audit` walks article
  MDX, finds `<PartReference id="...">` ids that don't have records,
  appends them to `BACKLOG.md`. The loop drains the backlog one
  record per tick.
- **Schema migration** — `data-steward` sub-agent. New entity types
  or new fields across all records. Multi-commit; never bundles
  schema + backfill.

## Read paths (from the web app)

```ts
import {
  getAllSwitches, getSwitchBySlug,
  getAllVendors, getVendorBySlug,
  getActiveGroupBuys,           // hides archived
  getTrendSnapshot,             // for /trends/tracker
} from '@thock/data'
```

The loaders memoize at build time. Production builds read from
disk once and cache; dev mode re-reads on file change.

## Backlog format

`BACKLOG.md` is the queue:

```markdown
# Data backlog

## Pending

- [ ] add switch drop-holy-panda — referenced in 3 articles, no record
- [ ] add vendor mkultra — referenced by 2 group buys
- [ ] update trend 2026-W19 — current week missing

## Done

- [x] add switch gateron-oil-king (commit abc1234)
```

`/ship-data` flips `[ ]` → `[x]` in the same commit that ships the
record.
