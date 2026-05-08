# agents.md

> The entry point for any AI agent landing in this repo cold
> (Claude Code, Cursor, Aider, anything else). Read this top to
> bottom; it's short, and the rules at the top are non-negotiable.

## Standing rules

These apply to every command, every skill, every session. They
are not optional. The skill files repeat them; this is the
canonical source.

### 1. Commit and push. Always. As a single atomic act.

Shipped work that isn't committed is rolled-back work waiting to
happen. Shipped work that's committed but not pushed is invisible
to Netlify and to future loop ticks. The autonomous loop assumes
`origin/main` is the source of truth.

Every shipping skill ends with `git commit` **immediately followed
by** `git push origin main`. Don't leave commits unpushed between
ticks. Don't leave the working tree dirty between ticks. If a tick
can't ship cleanly, fall through to the skill's failure modes —
don't half-commit.

### 2. No `Co-Authored-By:` trailers. No emojis.

Plain commit message bodies. **Never** add a `Co-Authored-By:`
line, a "🤖 Generated with…" footer, or any emoji — in commits, in
code, in content, in design notes. The site's voice is editorial
restraint; the commit log mirrors it.

### 3. The verify gate is non-negotiable.

`pnpm verify` runs **before** every commit:

```
typecheck → test:run → data:validate → build → e2e
```

Every check is a hard gate. **Hermetic e2e is part of the gate** —
it boots the production build (`next start`) on `:4173` and walks
every canonical URL from `apps/e2e/src/fixtures/canonical-urls.ts`.
A red e2e is a blocked push. Never `--no-verify`. Fix the root
cause.

### 4. The deploy gate runs **after** every push.

`pnpm deploy:check` polls Netlify for the deploy matching the
just-pushed commit. It prints `"Checking last deployment..."`,
shows state transitions (`building → ready`), and exits non-zero
on `error` / `failed` / timeout.

Every shipping skill calls it as Step 12. A red deploy is treated
identically to a red verify gate: read the log, patch the root
cause, push again. **Never push past a red deploy.** Repeated
failures escalate to the skill's failure modes (§10 of each
skill).

### 5. No `--no-verify`. No force-push. No destructive resets.

### 5. No `--no-verify`. No force-push. No destructive resets.

If a hook fails, fix the underlying issue. If `git pull` diverges,
stop and report — don't blind-rebase. Tests alongside code, never
"add tests later".

### 6. Site name is lowercase `thock`. Always.

In copy. In code (`siteConfig.name = "thock"`). In commit messages.
In meta tags. The wordmark may render with custom weight but never
with a capital T.

### 7. Content stays in MDX. Data stays in `/data`.

No hardcoded article copy in components. No hardcoded data records.
Content goes through `@thock/content`; data goes through
`@thock/data`. The repo is the database; that contract is forever.

---

## Operational secrets

The autonomous loop is hermetic for shipping; the awareness layer
needs two tokens. Both live in `.env` (gitignored). Configure once
per machine.

### `NETLIFY_AUTH_TOKEN` — deploy gate

Used by `pnpm deploy:check` to read deploy state after each push.

1. Get a token at
   https://app.netlify.com/user/applications#personal-access-tokens
2. Add to `.env`:
   ```
   NETLIFY_AUTH_TOKEN=nfp_...
   ```

Optional: `NETLIFY_SITE_NAME` (defaults to `thock`).

If missing, `pnpm deploy:check` exits with a clear error. Shipping
skills treat that as a blocked tick.

### `GH_TOKEN` — issue triage

Used by `/triage` to review and label open GitHub issues. The `gh`
CLI auto-reads `GH_TOKEN`.

1. Get a fine-grained PAT at https://github.com/settings/tokens
   scoped to the thock repo with `Issues: read+write`,
   `Metadata: read`. (An all-access classic PAT works too.)
2. Add to `.env`:
   ```
   GH_TOKEN=github_pat_...
   ```

Optional: `GH_REPO` (defaults to `daretodave/thock`).

If missing, `/triage` exits at its failure-mode condition with a
link to obtain a token. The loop continues — triage is rate-limited
and non-blocking.

### No other secrets

The autonomous loop never authenticates against anything else. If
a future feature requires a secret (Buttondown API, Plausible,
etc.), the relevant skill stops at its failure-mode condition
rather than inventing a placeholder.

---

## Project

**thock** /θɒk/ — an editorial content hub for mechanical keyboard
enthusiasts. Lives at https://thock.netlify.app.

The product spec is `spec.md` at the repo root. It's the canonical
description. Read it once.

## Repo shape

```
apps/web         Next.js 15 App Router site (the published product)
apps/e2e         Playwright workspace (hermetic against next start :4173)
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

Seven autonomous skills + one user-in-the-loop adjustment skill
(`oversight`). Two of the autonomous seven (`critique`, `triage`)
don't ship code — they read external signals (the live site, GitHub
issues) and feed findings into the iterate flywheel.

| Skill | Source of truth | What it does |
|---|---|---|
| `ship-a-phase` | `skills/ship-a-phase.md` | Ship one phase from the build plan: code + tests + e2e + commit + push. The Netlify deploy follows. |
| `ship-data` | `skills/ship-data.md` | Add or repair one record in `/data/`: validate schema, normalize cross-refs, commit, push. |
| `plan-a-phase` | `skills/plan-a-phase.md` | Refine the next phase brief without shipping code. Pre-flight for `ship-a-phase`. |
| `iterate` | `skills/iterate.md` | Audit the site, pick the highest-impact weakness, ship one improvement. Drains the `/critique` and `/triage` queues too. Closes GitHub issues when it ships their fix. |
| `critique` | `skills/critique.md` | External-observer pass — visit the live site as a stranger, file fresh-eyes findings to `plan/CRITIQUE.md`. The feedback half of the address loop. |
| `triage` | `skills/triage.md` | Issue review — read open GitHub issues, classify, label, comment, route to the right backlog. Cheap fast-exit when 0 unlabeled issues. |
| `march` | `skills/march.md` | Outer dispatcher: triage → rate-limited critique → pending phase → pending data → iterate. The autonomous-beast endgame. |
| `oversight` | `skills/oversight.md` | **User-in-the-loop.** Pause autonomy, brief the user, ask targeted questions, adjust the plan, push the adjustments. The only skill that asks the user anything. |

### Invocation (Claude Code-flavored)

```
/ship-a-phase                # ship next pending phase
/ship-data                   # ship next data backlog row
/plan-a-phase                # refine next phase brief
/iterate                     # audit + ship one improvement
/critique                    # external-observer pass (writes to CRITIQUE.md)
/triage                      # review unlabeled GitHub issues
/march                       # do the right thing (dispatches all of the above)
/oversight                   # course-correct (brief + questionnaire + adjustment)
/loop 30m /march             # autonomous loop
```

Other clients: read the skill file directly and follow its
procedure.

### Sub-agents

When a skill needs research, prose, schema-heavy data work, or a
fresh-eyes pass, it delegates to a specialist sub-agent. Definitions
live at `.claude/agents/*.md`:

| Agent | Use for | Does not do |
|---|---|---|
| `scout` | Open-web research, sourcing facts, vendor URLs, trend signals | Write code. Write articles. |
| `content-curator` | Drafting MDX articles in the editorial voice | Research the open web (delegates to scout). Modify code. |
| `data-steward` | Schema additions, mass cross-ref repair, normalize passes | One-record-at-a-time additions (the main agent runs `ship-data` for those). |
| `reader` | Fresh-eyes external observer of the live site (used by `/critique`) | Write code, content, or data. Returns observations only. |

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

## Operational notes

- **Netlify is the host.** `netlify.toml` at root pins the build.
  Every push to `main` deploys. Previews on PRs.
- **The repo is the database.** No external CMS, no external DB,
  no API keys. The autonomous loop is hermetic by design.
- **Schemas (Zod)** live in `packages/data/src/schemas/`;
  generated JSON Schema lives in `data/schemas/`. Edit the Zod
  source; regenerate.
- **Design exports** land asynchronously in `design/`. The loop
  ships without them and integrates when they appear.
