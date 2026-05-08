# agents.md

> Tool-agnostic orientation for any AI agent landing in this repo
> cold (Claude Code, Cursor, Aider, anything else). Treat this as
> the entry point. After reading this, you'll know where to look
> next.

## Project

**thock** /θɒk/ — an editorial content hub for mechanical keyboard
enthusiasts. Lowercase always. Lives at https://thock.netlify.app.

The product spec is `spec.md` at the repo root. It's the canonical
description. Read it once.

## Repo shape

```
apps/web         Next.js 15 App Router site (the published product)
apps/e2e         Playwright workspace
packages/*       Shared TS packages (@thock/tokens, ui, content,
                 data, seo, tsconfig)
data/            GitHub-as-DB — JSON records for switches, vendors,
                 group buys, etc. Validated by @thock/data.
plan/            Build plan, phase briefs, audit findings.
skills/          Source-of-truth skill files invoked by slash
                 commands.
.claude/         Claude Code config — slash commands and sub-agent
                 definitions.
design/          Design exports (mockups, notes, component specs).
```

## How work happens

This project is **driven autonomously** by a small set of skills.
You don't normally write code by manually editing files in
`apps/web/`; you invoke a skill that does the right thing
end-to-end.

### Skills (the verbs)

| Skill | Source of truth | What it does |
|---|---|---|
| `ship-a-phase` | `skills/ship-a-phase.md` | Ship one phase from the build plan: code + tests + e2e + commit + push. The Netlify deploy follows. |
| `ship-data` | `skills/ship-data.md` | Add or repair one record in `/data/`: validate schema, normalize cross-refs, commit, push. |
| `plan-a-phase` | `skills/plan-a-phase.md` | Refine the next phase brief without shipping code. Pre-flight for `ship-a-phase`. |
| `iterate` | `skills/iterate.md` | Audit the site, pick the highest-impact weakness, ship one improvement. The post-build loop. |
| `march` | `skills/march.md` | Outer dispatcher: pending phase → `ship-a-phase`; pending data → `ship-data`; else → `iterate`. The autonomous-beast endgame. |

### Invocation (Claude Code-flavored)

```
/ship-a-phase                # ship next pending phase
/ship-data                   # ship next data backlog row
/plan-a-phase                # refine next phase brief
/iterate                     # audit + ship one improvement
/march                       # do the right thing
/loop 30m /march             # autonomous loop
```

Other clients: read the skill file directly and follow its
procedure.

### Sub-agents

When a skill needs research, prose, or schema-heavy data work, it
delegates to a specialist sub-agent. Their definitions live at
`.claude/agents/*.md`:

| Agent | Use for | Does not do |
|---|---|---|
| `scout` | Open-web research, sourcing facts, vendor URLs, trend signals | Write code. Write articles. |
| `content-curator` | Drafting MDX articles in the editorial voice | Research the open web (delegates to scout). Modify code. |
| `data-steward` | Schema additions, mass cross-ref repair, normalize passes | One-record-at-a-time additions (the main agent runs `ship-data` for those). |

The main agent (you, when invoked at the top level) writes wiring
code, makes architectural decisions, and runs the verify gate.
Spawn sub-agents aggressively for everything else.

## Standing context

`plan/bearings.md` holds the always-relevant context:

- **Stack pins** — Next.js 15, TypeScript strict, Tailwind, MDX,
  Vitest, Playwright, pnpm 9.
- **URL contract** — every URL the site will ever serve, locked.
- **Visual defaults** — palette, type, dark-mode-first, mono accent
  for switch names.
- **Standing decisions** — pagination rules, sort order, empty-state
  copy, all the "don't ask the user about this" defaults.

Read it before your first edit.

## Hard rules (non-negotiable across all skills)

1. **Tests alongside code** — never "add tests later".
2. **No emojis, no `Co-Authored-By:`** in commits.
3. **No `--no-verify`, no force-push, no destructive resets.**
4. **Site name is lowercase `thock`** in copy and code, always.
5. **Content stays in MDX** under `apps/web/src/content/articles/`.
6. **Data stays in `/data/`** — typed JSON, schema-validated.
7. **Every commit pushes** — Netlify auto-deploys. A red `main` is
   a red site. Run `pnpm verify` before pushing.

## Where to look

| If you need… | Read |
|---|---|
| What thock is | `spec.md` |
| Stack, conventions, defaults | `plan/bearings.md` |
| What ships next | `plan/steps/01_build_plan.md` |
| How a phase is built | `plan/phases/phase_<N>_<topic>.md` |
| How a skill works | `skills/<skill>.md` |
| What a sub-agent does | `.claude/agents/<name>.md` |
| Latest known weaknesses | `plan/AUDIT.md`, `data/AUDIT.md` |
| Backlog of pending data work | `data/BACKLOG.md` |

## Verify gate

Run before every commit:

```bash
pnpm verify
```

Which is `typecheck && test:run && data:validate && build && e2e`.
The skill files won't let you push without it.

## Operational notes

- Netlify is the host. `netlify.toml` at root pins the build.
  Every push to `main` deploys. Previews on PRs.
- The repo is the database — there's no external CMS, no external
  DB, no API keys. The autonomous loop is hermetic by design.
- Schemas (Zod) live in `packages/data/src/schemas/`; generated
  JSON Schema lives in `data/schemas/`. Edit the Zod source;
  regenerate.
- The user emits design exports asynchronously into `design/`. The
  loop ships without them and integrates when they land.
