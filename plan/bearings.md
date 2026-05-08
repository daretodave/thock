# Bearings — thock

> Standing context for every command invocation. Read this alongside
> the relevant skill file (`skills/<name>.md`) and the matching
> phase brief. If anything here changes, update this file in the
> same commit.

## What we're building

`spec.md` at the project root is the product spec — the canonical
description of thock. Read it once at session start. The TL;DR:

> **thock** /θɒk/ — *n.* the deep, satisfying sound of a well-tuned
> mechanical keyboard switch bottoming out.

A web-based content/news hub for **mechanical keyboard
enthusiasts**. Editorial content across five pillars (news, trends,
ideas, deep dives, guides). Signature feature is a weekly **Trends
Tracker** dashboard. Audience is hobbyists who care about switches,
keycaps, firmware, group buys. Voice is knowledgeable peer, not
breathless hype.

**Site name is lowercase, always.** "thock", not "Thock".

**Landing:** https://thock.netlify.app (Netlify-hosted, repo
auto-deploys on push to `main`).

## Stack (locked — do not re-litigate)

These were decided at project bootstrap to keep the autonomous loop
hermetic (no external services to authenticate against, no secrets
to manage, no API rate limits to babysit). Revisit only if a phase
genuinely cannot ship without changing one of these — and then stop
and ask.

| Layer | Choice | Why |
|---|---|---|
| Repo | **pnpm workspaces** monorepo | apps + packages share types; one install root |
| Framework | **Next.js 15 App Router** | Editorial-site primitives, RSC, ISR, image pipeline, OG image routes |
| Language | **TypeScript** strict, `noUncheckedIndexedAccess` | Standard |
| Styling | **Tailwind CSS** | Fast iteration; one-off layout in utilities, repeated patterns in `components.css` |
| Content | **MDX-in-repo** under `apps/web/src/content/` | Git-as-CMS — no auth, no API, no rate limits |
| Structured data | **JSON-in-repo** under `/data/` (GitHub-as-DB) | Same hermetic rationale; `@thock/data` exposes typed loaders |
| Schemas | **Zod** in `packages/data/src/schemas/`, generated to JSON Schema in `data/schemas/` | Single source of truth |
| Frontmatter | **gray-matter** | Standard, light |
| MDX renderer | **next-mdx-remote** + **remark-gfm** | RSC-compatible |
| Search | **Local MiniSearch** index built at build time | No Algolia secrets |
| Test (unit) | **Vitest** + **@testing-library/react** | Fast, ESM-native |
| Test (e2e) | **Playwright** | Standard |
| Lint | **ESLint** (Next config) + **Prettier** + `prettier-plugin-tailwindcss` | Default |
| Pkg mgr | **pnpm 9** | Lockfile committed |
| Hosting | **Netlify** with `@netlify/plugin-nextjs` | Auto-deploys; config in `netlify.toml` |
| Analytics | **Plausible** (script tag, eventual) | Privacy-respecting |
| Newsletter | **Buttondown** form embed (eventual) | No SDK / secret needed |

## URL contract (locked)

Every URL below is a permanent contract. Do not change shapes; only
add new ones via a new phase.

```
/                                Home
/news                            News pillar
/trends                          Trends pillar
/trends/tracker                  Trends Tracker dashboard
/ideas                           Ideas & Builds pillar
/deep-dives                      Deep Dives pillar
/guides                          Guides pillar
/article/[slug]                  Article (canonical entity hub)
/tag/[slug]                      Tag page (faceted)
/group-buys                      Curated active group buys
/about                           About / editorial standards
/newsletter                      Newsletter signup + archive
/search                          Search results
/sources                         Source citations index
/sitemap.xml                     Sitemap
/robots.txt                      Robots
/feed.xml                        Global RSS
/feed/<pillar>.xml               Per-pillar RSS
/opengraph-image.png             Site-default OG (per-route OG via opengraph-image.tsx)
```

Slugs are human-readable English. Tag slugs are kebab-case
categorical (`gateron-oil-king`, `gasket-mount`, `mt3`).

## Repository shape

```
Z:/keyboard/                              # repo root (will be renamed by user)
├── spec.md                               # product spec
├── README.md                             # skill explanations only
├── agents.md                             # tool-agnostic agent orientation
├── package.json                          # root workspaces
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.base.json
├── netlify.toml                          # build config for thock.netlify.app
├── .nvmrc                                # node 20
├── .editorconfig
├── .prettierrc
├── .gitignore
│
├── .claude/
│   ├── commands/<verb>.md                # slash commands
│   └── agents/<name>.md                  # sub-agent definitions
│
├── skills/                               # source-of-truth skill files
│   ├── ship-a-phase.md
│   ├── ship-data.md
│   ├── plan-a-phase.md
│   ├── iterate.md
│   └── march.md
│
├── plan/                                 # build plan
│   ├── README.md
│   ├── bearings.md                       # this file
│   ├── AUDIT.md                          # latest /iterate findings (rewritten by audit)
│   ├── steps/01_build_plan.md            # at-a-glance status + per-phase scope
│   └── phases/phase_<N>_<topic>.md       # per-phase briefs
│
├── design/                               # design exports (user-emitted, async)
│   └── <family>/
│
├── data/                                 # GitHub-as-DB
│   ├── README.md
│   ├── BACKLOG.md                        # [ ] rows ship-data reads next
│   ├── AUDIT.md                          # latest data audit
│   ├── schemas/<entity>.schema.json
│   ├── switches/<slug>.json
│   ├── keycap-sets/<slug>.json
│   ├── boards/<slug>.json
│   ├── vendors/<slug>.json
│   ├── group-buys/<slug>.json
│   ├── group-buys/archive/<slug>.json
│   └── trends/<YYYY-WW>.json
│
├── apps/
│   ├── web/                              # Next.js app — @thock/web
│   │   ├── src/
│   │   │   ├── app/                      # App Router
│   │   │   ├── components/               # UI components
│   │   │   ├── content/                  # MDX articles + tags.json
│   │   │   ├── lib/                      # app-only helpers
│   │   │   └── styles/
│   │   ├── public/
│   │   ├── next.config.mjs
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   └── e2e/                              # Playwright workspace — @thock/e2e
│       ├── tests/
│       ├── playwright.config.ts
│       └── package.json
│
└── packages/
    ├── tokens/                           # @thock/tokens — design tokens (CSS vars + TS)
    ├── ui/                               # @thock/ui — shared components (Wordmark, Mono, etc.)
    ├── seo/                              # @thock/seo — buildMetadata, JSON-LD, canonicalUrl
    ├── content/                          # @thock/content — MDX loaders
    ├── data/                             # @thock/data — GitHub-as-DB loaders + validate
    └── tsconfig/                         # @thock/tsconfig — shared TS configs
```

## The `design/` folder

The user emits design exports asynchronously into `design/<family>/`
(e.g. `design/article/`, `design/home/`, `design/trends-tracker/`).
Each export typically contains:

- Mockups (PNG/SVG/JSX) — annotated where possible.
- A `notes.md` with decisions, palette refs, copy.
- Component specs (sizes, variants).

**The loop does not wait for design.** If `design/<family>/` is
absent when shipping a page family, ship from the brief + canonical
sibling + bearings style hints. The next phase that touches that
surface integrates the design when it lands. Document in commit-body
Decisions: "design export not yet present — implementation may be
revisited when `design/<family>/` lands."

## The `data/` folder (GitHub-as-DB)

Structured data lives as JSON files. PRs are migrations. CI
validates. The web app reads via `@thock/data` typed loaders —
never reaches into the filesystem directly.

Entities (one folder per type, one file per record):
- `switches/` — Gateron Oil King, Cherry MX Black, Kailh Box Jade …
- `keycap-sets/` — GMK Olivia, MT3 /dev/tty, ePBT …
- `boards/` — Mode Sonnet, Bauer Lite, Lofree Flow …
- `vendors/` — Drop, NovelKeys, Cannonkeys, KBDFans …
- `group-buys/` — currently active (archive subfolder for past).
- `trends/` — weekly snapshots `YYYY-WW.json`.

Maintained by `/ship-data` (single record at a time) and
`data-steward` sub-agent (schema-heavy work).

## Sub-agents

Defined under `.claude/agents/`. Spawn aggressively — they
parallelize and protect main-agent context.

| Agent | When to spawn | Returns |
|---|---|---|
| `scout` | Need an external fact, spec, vendor URL, group-buy date, trend signal | Structured findings with citations |
| `content-curator` | Need a new MDX article drafted or an existing one polished | A complete MDX file written to `apps/web/src/content/articles/` |
| `data-steward` | Schema-heavy work (new entity type, schema migration, mass cross-ref repair) | Modified Zod schemas + loaders + validator-passing records |

The main agent does not write articles or research the open web
itself. Delegate.

## Visual & tonal defaults (until design lands)

These are the working defaults phase 1 establishes. The design
export overrides them on a per-family basis when present.

- **Dark mode default.** Light mode is a class toggle (`html.light`).
- **Type:** Display serif (Source Serif 4) for H1 and pull-quotes.
  Sans (Inter) for body and UI. Mono (JetBrains Mono) for switch
  names, firmware refs, part SKUs — wrap in `<Mono>` atom.
- **Palette:** Restrained dark surface (`#0e0f12` bg, `#1a1c20`
  cards, `#e6e7ea` text, `#9aa0aa` muted). Accent warm amber
  (`#e5a23a`).
- **Hero photography is the star.** Generous image real estate;
  cards quiet around it.
- **Spacing scale:** Tailwind defaults; vertical rhythm in 8px
  multiples.

## Decisions standing for the autonomous loop

(These exist so the loop never asks the user. Add to this list any
time you encounter a recurring class of design ambiguity.)

- **Pagination:** none until a list exceeds 30 entries.
- **Sort default:** newest first (by `publishedAt` frontmatter).
- **Card variant cascade in pillar pages:** index 0 → `hero`,
  indices 1–4 → `large`, rest → `row`.
- **Empty state copy template:** `"No <noun> yet — check back soon."`
- **Loading state:** skeleton elements via `<Skeleton>`. No spinners.
- **Error state:** red-tinted text in mono font, inline retry button.
- **Read time:** 200 wpm, rounded up. Floor 1 min.
- **Top-N count for any leaderboard / trending list:** 8.
- **Comments / community / login:** out of scope at every phase.
- **Affiliate links:** mark vendor URLs with `rel="sponsored
  noopener"` whenever they leave the site.
- **OG image:** every article and pillar gets one via Next.js
  `opengraph-image.tsx` route handler. Default template is the
  wordmark + H1 over a dark gradient — no per-article art unless
  `frontmatter.heroImage` is set.
- **Site name capitalization:** **always lowercase "thock"** in
  copy, headings, and code (`siteConfig.name = "thock"`). The
  wordmark may render with custom weight but never with a
  capital T.
- **Tagline (default):** "keyboards, deeply." — lowercase.

## Hard rules

These mirror `agents.md` (the canonical rule book). If a skill
needs to add a rule, it adds it to `agents.md` first, then this
file echoes it.

1. **Commit and push as a single atomic act.** Every shipping skill
   ends with `git commit` immediately followed by `git push origin
   main`. Don't leave commits unpushed between ticks.
2. **No `Co-Authored-By:` trailers.** No emojis — anywhere.
3. **No `--no-verify`. No force-push. No destructive resets.**
4. **The verify gate is non-negotiable** — see "Verify gate" below.
5. **Tests alongside code** — never "add tests later".
6. **Small focused components in folders** — never jam-pack one
   file.
7. **Content stays in MDX. Data stays in `/data`.** No hardcoded
   article copy in components; no hardcoded data records.
8. **Never commit secrets.** If a feature needs one, stop per the
   relevant skill's failure modes.
9. **Site name is lowercase `thock`** in copy and code, always.

## Verify gate (hermetic, mandatory)

Every shipping skill runs `pnpm verify` before commit. The gate is:

```
pnpm typecheck      # tsc --noEmit across all workspaces
pnpm test:run       # vitest single-run across all workspaces
pnpm data:validate  # every JSON in /data validates against its schema; cross-refs resolve
pnpm build          # next build of @thock/web (the production bundle)
pnpm e2e            # Playwright against next start on :4173 — hermetic
```

**The e2e leg is hermetic by design.** Phase 4 ships:

- `apps/e2e/src/fixtures/canonical-urls.ts` — single source of
  truth for every URL the site serves; derived from
  `@thock/content` + `@thock/data` so new articles, tags, and
  group buys join automatically.
- `apps/e2e/src/fixtures/page-reads.ts` — typed assertions per
  URL pattern (e.g. "/article/[slug] renders H1, ≥1 tag chip,
  footer; no console errors; no horizontal scroll at 375px").
  Each later page family appends its entry.
- `apps/e2e/tests/smoke.spec.ts` + `mobile/smoke.mobile.spec.ts`
  — walk every canonical URL at desktop and 375×800; assert 200
  + valid HTML + page-reads contract.
- `apps/e2e/playwright.config.ts` `webServer` boots the
  production build on `:4173`. No external network. No flake from
  live data.

A red e2e is a red deploy. Don't push past it. **Fix the root
cause** — that's the whole point of the gate.

## Useful commands (from repo root, after phase 1)

```bash
pnpm dev                        # Next.js dev server on :3000 (web)
pnpm build                      # production build of @thock/web
pnpm typecheck                  # tsc --noEmit across workspaces
pnpm test                       # vitest in watch mode (across workspaces)
pnpm test:run                   # vitest single run (CI style)
pnpm e2e                        # playwright
pnpm data:validate              # validate every JSON in /data
pnpm verify                     # the full gate (used by every shipping skill)
pnpm lint                       # eslint
pnpm format                     # prettier --write
```

## Netlify operational notes

- Site name: `thock` → `https://thock.netlify.app`.
- Build pinned in `netlify.toml`; the user does not need to set
  build commands in the Netlify UI (but can override there).
- The Netlify Next.js plugin is pinned in `netlify.toml` to avoid
  silent runtime upgrades.
- Auto-deploys: every push to `main` deploys; previews on PRs.
- **A red main = a red site.** The verify gate is the
  pre-flight; never push without `pnpm verify` passing.
- If a deploy fails, fetch logs via Netlify UI; treat the failure
  like a verify-gate failure (read log, patch, push).
