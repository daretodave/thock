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

**Landing:** https://thock.xyz (Vercel-hosted, repo
auto-deploys on push to `main`).

## Surface

**Surface:** `site`

thock is a content/news hub rendered for human readers — every
URL in the contract below is a page someone reads. This single
line is the hard gate for the opt-in branding capability
(`/ship-asset` + the `brander` sub-agent — see
`../nexus/customization/branding.md`). With `Surface: site`,
the capability is enabled; OG images, favicons, social cards,
and SVG → PNG conversions all flow through it. Brand-setup
taste calls (mood / accent / wordmark style) go through
`/oversight`, which captures the brief into this file's
"Visual & tonal defaults" section + `plan/AUDIT.md` rows that
`/ship-asset` then drains.

There is no override flag. If thock's surface ever changes
(e.g. a future API-only mode), update this line and the
branding skill self-disables.

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
| Hosting | **Vercel** (Hobby tier) | Native Next.js host, auto-deploys on push, generous free tier |
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
/quiz/switch                     Switch recommender quiz (phase 33)
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

The user emits design exports asynchronously from claude design
into `design/` as **flat `*.jsx` files** (no subfolders). The
authoritative map is `design/INDEX.md` — read it first whenever a
phase touches a designed surface.

Three files matter most:

- `design/tokens.css` — finalized design tokens (OKLCH palette,
  typography, spacing, type ramp). **Phase 1 adopts these
  verbatim** into `packages/tokens/`.
- `design/decisions.jsx` — the design team's own AI-facing brief
  (SETTLED / PUSHED-BACK / OPEN-QUESTIONS). **Decisions here win
  over `bearings.md` on conflict** — bearings was authored before
  the design landed.
- `design/INDEX.md` — file → family mapping; tells the loop which
  flat file to read for each phase.

Per-family files: `design/page-<family>.jsx` (e.g.
`page-article.jsx`, `page-trends-tracker.jsx`). Plus
`atoms.jsx`, `primitives.jsx`, `brand.jsx` for component-level
reference.

**The loop does not wait for design.** Some `page-*.jsx` files
may be 0 bytes (claude design hadn't reached them yet). When that
happens, the phase ships from the canonical sibling + bearings,
and a follow-up commit can integrate the design when it's
re-exported. Document in commit-body Decisions:
"`design/page-<family>.jsx` empty — implementation will be
revisited after re-export."

**Reading conventions:** the JSX files are structural reference,
not drop-in code. Inline styles use `var(--kh-*)` from a previous
naming round (the project was renamed thock after the design was
exported). Translate `--kh-*` → `--thock-*` when adopting into
`packages/tokens/`; the design intent is unchanged.

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
| `reader` | Fresh-eyes critique of the live site | Structured JSON findings — drained by `/critique` |
| `brander` | Render a brand asset (OG image, favicon, social card, SVG → PNG, wordmark variants). Spawned by `/ship-asset` (or inline by `/ship-a-phase` when a phase brief names an asset deliverable); never directly by the main agent | Rendered file paths + sibling provenance JSON |

The main agent does not write articles, research the open web,
or render images itself. Delegate.

## Visual & tonal defaults

**These were placeholders until the design landed.** The real
source of truth is now `design/tokens.css` (palette, type, spacing)
and `design/decisions.jsx` (intent). The placeholders below are
preserved for context; phase 1 adopts the design files verbatim.

What the design landed on (read `design/tokens.css` for exact
values):

- **Dark first.** Background is a deep cool charcoal in OKLCH
  (`oklch(0.175 0.006 250)`). Surfaces step lightness in 3%
  increments. Light mode is warm paper, intentionally
  undersaturated.
- **Type, three families:** **Newsreader** for headlines (italic
  ductus), **IBM Plex Sans** for body and UI, **JetBrains Mono**
  for technical terms (switch names, firmware, SKUs — wrap in
  `<Mono>`).
- **Single restrained accent:** warm brass / aged bronze
  (`oklch(0.80 0.135 75)`). Used sparingly — accent dot in the
  wordmark, last 72 hours of a group buy, hover states.
- **Tag color = category, not vibe.** Five categories (switch /
  layout / brand / material / profile) at matched L=0.74,
  C=0.085 with hue varying. Restrained on purpose — taxonomy,
  not decoration.
- **Trend semantics tokens:** distinct hues for up / down / flat
  at matched lightness/chroma.
- **Spacing:** 4px base (`--kh-1` … `--kh-9`).
- **Type ramp:** 56 / 40 / 28 / 20 / 16 / 14 / 12 px.

Earlier placeholder defaults (kept for historical reference; do
not adopt over the design):

- ~~Source Serif 4 / Inter / JetBrains Mono~~ — superseded by
  Newsreader / IBM Plex Sans / JetBrains Mono.
- ~~`#0e0f12` bg, `#1a1c20` surface, `#e5a23a` accent~~ —
  superseded by OKLCH values in `design/tokens.css`.
- ~~8px spacing base~~ — superseded by 4px base.

### Article hero art — colorful keyboard SVGs (locked 2026-05-09 via /oversight)

Every article (current and future) renders a colorful keyboard
SVG as its hero placeholder until real photography backfills.
The directive is durable — `content-curator` and `/ship-asset`
both read this section.

**Style guide:**
- Simple line drawing, single splash of color (one accent + the
  warm-bronze theme accent — never a multi-color palette).
- Stroke weight consistent across articles (~2px on a 1200×750
  canvas).
- Illustrative of the article's subject:
  - switch-deep-dive → switch cross-section / housing exploded
  - keycap piece → keycap profile silhouette (Cherry / OEM / SA)
  - build / mod piece → keyboard outline with a mod callout
  - news / vendor piece → vendor wordmark glyph or a layout
    silhouette
  - guide → a "how-to" arrow / annotated keycap row
  - trends piece → a sparkline silhouette
- Background transparent or warm-paper (light-mode safe).
- Color taste: avoid stock blues/greens. The thock palette is
  warm — bronze accent + a single splash like coral, dusty
  rose, ochre, or muted terracotta. Never primary-bright.

**Storage:** `apps/web/public/hero-art/<article-slug>.svg`. The
article's frontmatter `heroImage` field references the
absolute path (`/hero-art/<slug>.svg`); `heroImageAlt` is
required when `heroImage` is set.

**Delivery path:** the user runs `/ship-asset` to drain the
backlog after each article ships, OR the `content-curator`
agent emits an SVG draft alongside the prose for new articles
and `/ship-asset` polishes it.

### Group-buy hero art — colorful SVGs (locked 2026-05-10 via /oversight)

Every group buy (current and future) renders a colorful SVG as
its hero placeholder until vendor photography backfills. The
directive is durable — `brander` and `/ship-asset` both read
this section, and `/ship-data` bundles a `brander` invocation
in the same commit when adding a new group-buy record.

**Style guide:** mirrors the article hero-art rule above —
simple line drawing, single splash of color (one accent + the
warm-bronze theme accent — never multi-color), stroke weight
~2px on a 1200×750 canvas. Subject mapped from group-buy kind:
- `productKind: "board"` → keyboard outline silhouette,
  optional layout callout.
- `productKind: "keycap-set"` → keycap profile silhouette
  (Cherry / OEM / SA), 4–6 caps in cluster.
- `productKind: "switch"` → switch cross-section / housing
  exploded view (when group buys for switches happen).
- `productKind: null` (mixed kits) → fall back to a stylized
  vendor wordmark glyph + a layout silhouette.

Color taste: avoid stock blues/greens. Bronze accent + a
single splash like coral, dusty rose, ochre, or muted
terracotta — pick the splash from the group-buy's product
character (e.g., a bright accent kit gets coral; an earthy
designer set gets ochre). Background transparent or
warm-paper.

**Storage:** `apps/web/public/group-buy-art/<vendor>-<slug>.svg`
with a sibling `<vendor>-<slug>.svg.json` provenance file.
The data record's `heroImage` field references the absolute
path (`/group-buy-art/<vendor>-<slug>.svg`). Schema additive
landed in phase 23.

**Delivery path:** new group-buy records ship via `/ship-data`
which bundles a `brander` invocation in the same commit
(mirrors the article-hero rule for new articles). Backfill of
the existing 6 records lands as part of phase 23.

**Render fallback:** if a record's `heroImage` is null at
render time (e.g., partial backfill in flight), the card
renders a coral-tinted placeholder block — never a broken
image. The fallback is intentionally distinguishable from a
real hero so missing art is observable in QA.

### Inline-viz — 2–3 per article, no longer optional (locked 2026-05-14 via /oversight)

Every article ships with 2–3 inline visualizations embedded
inline in the body via the `<InlineViz>` MDX component. This
is the editorial baseline. Be bold about it: any article with
a comparison, a process, a layered structure, a price move,
a timeline, a forecast, a categorization, or a mechanism is
already carrying a viz inside it — the curator's job is to
render it.

**Renderer:** `<InlineViz src alt caption accent>` from
`@thock/content/mdx`. Mobile renders as an inline 60ch block;
desktop (xl ≥ 1280px) floats into the right-side whitespace,
centered between the article column and the scrollbar, with
an SVG step-shape connector arm tying the figure back to the
column. Layout math lives in
`apps/web/src/styles/components.css` under `.thock-inline-viz`.

**Assets:** SVG at
`apps/web/public/article-viz/<article-slug>/<viz-slug>.svg`
with a sibling `.svg.json` provenance file (schema in
`.claude/agents/content-curator.md` § "Provenance"). Family-
locked visual language — same warm-grey stroke, splash color
per article, brass-bronze theme dot as the article hero-art.

**Splash color is load-bearing:** the `accent` prop on
`<InlineViz>` must match the splash color used inside the SVG.
The desktop connector arm + dot both render in that accent,
visually tagging the viz to its data lineage. "The data has
its own accent color."

**No-fabrication discipline:** every number, label, and named
surface in the viz must be traceable to the article body or
to an already-cited source. The provenance JSON's
`data_sources` array documents this — file + section + quoted
phrase. A future ship-asset audit pass uses it to detect drift
if the article body changes after the viz lands.

**Two regimes — both apply:** data-bearing articles get
charts (comparison ladders, timelines, glyph strips).
Conceptual / no-numbers articles still get diagrams (process
strips, cross-sections, layered stacks, do/don't maps). If
after reading the brief the curator genuinely cannot find 2–3
viz moments, that's a signal the article is too thin — flag
it, don't pad the prose.

**Delivery path:** new articles ship the MDX + viz SVGs + viz
provenance JSONs in a single commit via the content-curator
agent. The agent spawns `brander` for any viz it can't
hand-author directly (multi-resolution, template-driven,
etc.). The historical-article retrofit shipped 2026-05-14
across all 40 articles (80 viz total) — see
`PHASE_CANDIDATES.md` § Promoted. Going forward this rule is
write-time only; there is no remaining backlog to drain.

## Content velocity & editorial cadence (locked 2026-05-10 via /oversight)

The autonomous loop is good at shipping individual articles when
`/iterate` finds a content-gap row. It is bad at *generating* the
audit rows that turn idle ticks into content ticks. This section
codifies four hard rules so `/iterate`'s audit perpetually
surfaces content work, making the loop a content-explosion
engine rather than a polish-the-existing-corpus engine.

### Rule 1 — Sliding-window freshness (replaces static pillar quota, locked 2026-05-14 via /oversight)

Each of the five pillars (`news`, `trends`, `ideas`, `deep-dives`,
`guides`) carries **≥2 articles published within the last 30 days**.
Measured rolling — there is no "we hit the bar, we're done"
finish line. As articles age past 30d they roll out of the
window and the pillar's freshness count decrements.

The prior rule was a static one-time milestone — ≥8 articles per
pillar, ever. That bar was hit 2026-05-13 at commit `702b8a9`
(40 articles total, 8/8 across all pillars). The static rule
then went silent — and the corpus has no protection against
aging out simultaneously when the 8-articles-in-one-month
clustering rolls past 30d. The sliding window keeps the rule
load-bearing forever: there is always a freshness shortfall to
ship toward.

**The three states:**

- **Comfortable** — every pillar ≥ 2 articles in last 30d. No
  Rule-1 row files. Loop ticks at normal cadence; content rows
  fire only when Rules 2/3/4 demand.

- **Hot pursuit** — one or more pillars at **exactly 1** article
  in last 30d. The audit files a Rule-1 row for that pillar
  scored at **7.0**, above almost any iterate / polish row. The
  next `/march` tick dispatches `/ship-content` for that pillar.

- **Critical hot pursuit** — one or more pillars at **0** articles
  in last 30d. The audit files a Rule-1 row for that pillar
  scored at **9.5**, above every other priority. The loop drops
  iterate / polish entirely and ships content until the pillar
  returns to ≥ 1. This is the "frozen pillar" emergency state.

**Pillar selection when multiple are cold:** choose the pillar
with the **oldest most-recent publishedAt** (the pillar that has
gone longest without a new piece). Tie-breaker: lowest count in
the window. Tie-breaker again: editorial prominence (Trends >
News > Ideas > Deep Dives > Guides).

**Why this works:** the rule is self-replenishing. Articles aging
out of the window automatically generate new shortfalls; no
external priming needed (which was the operational gap pass-7
expand surfaced — the seed-primed Rule-1 queue exhausted itself
at `702b8a9` and the cloud loop fell through to iterate-shaped
polish instead of content velocity). With a 30-day window and a
2-article floor, the steady-state cadence is roughly **1 article
per pillar every 15 days** = **1 article every 3 days globally**,
which is well within cloud-loop capacity.

**Current state (2026-05-14):** all 40 articles published within
the last 10 days; every pillar at 8 in 30d. Comfortable across
the board. In ~20 days the first articles begin aging out; the
rule will surface its first natural shortfall then.

**Implementation:** the audit-row generator promoted as candidate
[7.0] in `plan/PHASE_CANDIDATES.md` (`scripts/content-gap-survey.mjs`)
computes the window counts and files the row. Until that helper
ships, the rule is enforced by manual audit at `/oversight` time.

### Rule 2 — Tracker linkage (non-flat row → linked deep-dive within 2 weeks)

Every `data/trends/<YYYY-WNN>.json` row with `direction !== 'flat'`
must have its `articleSlug` populated within **2 calendar weeks**
of first appearing in any snapshot. The audit treats an unlinked
non-flat row older than 2 weeks as a content-gap finding scored
at impact 6 (the row is already editorially curated — a
companion piece is high-leverage, low-friction).

**Current state:** W19 has 13 non-flat rows; 12 linked, 1
unlinked (DCS Olivetti, +18 up, week-old). Threshold not yet
breached for DCS Olivetti, but the rule fires automatically
when it crosses 2 weeks.

### Rule 3 — Group-buy companion piece

Every `data/group-buys/<vendor>-<slug>.json` record with `status:
live` or `status: announced` has a companion editorial piece
(News or Ideas pillar — never Guides; build-the-anticipation
framing). The audit treats a live/announced group buy without a
companion article as a content-gap finding scored at impact 7
(time-sensitive, reader-visible on /group-buys cards). Group
buys with `status: closed` or `status: shipped` are exempt — the
finding is forward-looking, not retroactive.

**Current state:** 5 live + 1 closed group buys; companions
already shipped for 1 (Mode Sonnet R2 → /article/mode-sonnet-r2-group-buy-coverage).
The other 5 live (Nyawice, GMK CYL GREG 2, GMK CYL Ishtar R2,
GMK CYL King of the Seas, GSK Sweet Nightmare) each generate
one audit row.

### Rule 4 — Article date staggering (publishedAt across a rolling 30-day window)

`publishedAt` across the article corpus must spread across a
**rolling 30-day window** ending today. When `/iterate` ships a
new article it picks a publish date that fills the **largest
gap** in the existing distribution, not "today." This prevents
the bulk-publish artifact filed in critique pass 9 [MED] (six
of seven "By pillar" home tiles dated 2026-05-10).

**Exception (locked by user 2026-05-10):** group-buy coverage
pieces are exempt — their `publishedAt` matches the **earliest
date the group-buy story breaks** (typically `startDate`,
sometimes the IC-announce date a week before). This preserves
the editorial timeline a reader expects: a piece announcing
GREG 2 dated weeks before the buy opens reads wrong; dated the
day of the announcement reads right.

**Sub-rule for group-buy companion prose (locked 2026-05-10 via
/iterate drain of critique pass-11 issue #43):** when a piece is
dated its buy's startDate, body prose phrases the window
**absolutely**, never as relative time remaining. A static MDX
file cannot do per-render-time math — "roughly one week left"
written on the publish date is wrong on every reader visit
except the last one. Use absolute phrasings: "a four-week buy,"
"open through May 17," "the window runs 2026-04-17 through
2026-05-17." The /group-buys page handles relative countdown
chrome at render time; the article prose stays time-stable.

**Current state:** 9 of 15 articles dated 2026-05-10 (bulk
publish day). The directive doesn't retroactively restamp the
existing corpus — too lossy without external memory — but
**every new article the loop ships from this point** picks a
date that fills the gap. The existing-corpus restamp can be a
separate `/iterate` data-edit tick that user-jots or the audit
surfaces if the gap on /  By-pillar persists past 5 new articles
shipped.

### How `/iterate` audit consumes these rules

`skills/iterate.md` §4.A (content gaps) is amended to include:
- `pillarArticleCount < 8` → content-gap finding, impact = pillar
  prominence ramp (Trends=9, News=8, Ideas=7, Deep Dives=7,
  Guides=6).
- `unlinkedNonFlatTrackerRow.firstSeen ≤ now - 14d` →
  content-gap finding, impact 6, ease 5 (one article fills it).
- `liveOrAnnouncedGroupBuy.companionArticle == null` →
  content-gap finding, impact 7, ease 5.

When `/iterate` ships an article addressing one of these rows,
`content-curator` reads this section to pick the article's
`publishedAt`: rule 4 sets the date (gap-fill), the audit row
sets the topic, `bearings.md` "Article hero art" sets the
brander brief.

### Velocity expectations

With all 4 rules live, the autonomous loop has **~30+
content-shaped audit rows** at any moment until the corpus
catches up to quota. Each `/iterate` tick takes ~3 min of
shipping + verify-gate time. A focused weekend `/loop /march`
run can plausibly ship 20+ articles. The constraints are now
editorial quality (caught by `/critique` post-publish) and
brander throughput (one SVG per article), not "what should we
write?"

## Plan expansion posture

**Mode: bold.**

`/expand` reads accumulated signals (audit findings, critique
findings, GH issues, spec drift, design landings, data growth)
and proposes new phase candidates to
`plan/PHASE_CANDIDATES.md`. `/oversight` promotes them to the
build plan (or rejects).

Why bold for thock:

- The spec is real but young. Reality (data growth, real
  reader feedback, design re-exports) will reshape it.
- The user has explicitly invited the loop to "be bold but
  stay on track for deliverables, and when delivery is not,
  work on making things brilliant."
- `/march`'s dispatch order keeps deliveries first: pending
  phases ship before `/expand` ever runs. Expand fires only
  when the rate-limit window opens (≥20 commits or ≥48h) AND
  there's no pending phase, OR when `/iterate` has nothing to
  do (no findings score ≥ 3.0).
- Promotion is gated by `/oversight`; the loop doesn't
  unilaterally rewrite the build plan.

If boldness becomes friction at any point, change this
section to `Mode: strict` and `/expand` becomes a no-op. The
build plan then grows only via manual `/plan-a-phase` or
`/oversight` from then on.

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

## Verify gate (hermetic, mandatory) + deploy gate

Every shipping skill runs **two** gates around a commit. They are
both hard gates; never bypass.

### Pre-commit: `pnpm verify`

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

### Post-push: `pnpm deploy:check` then `pnpm deploy:smoke`

After `git push origin main`, every shipping skill runs **two**
post-push gates in sequence:

```
pnpm deploy:check   # polls Netlify REST API for the deploy at HEAD
pnpm deploy:smoke   # GETs one URL per pattern against the live site
```

**`pnpm deploy:check`** — confirms the deploy *built*:

- `0` → deploy ready (site green at the just-pushed commit)
- `1` → deploy errored / failed (read the log; patch; push again)
- `2` → timeout
- `3` → config / auth (VERCEL_TOKEN missing)

Implementation: `scripts/deploy-check.mjs` (no CLI install
required; uses Node 20+ built-in `fetch`). Polls
`https://api.vercel.com/v6/deployments` and matches by
`meta.githubCommitSha`.

**`pnpm deploy:smoke`** — confirms the deploy *serves*:

- `0` → every probe returned 2xx (home, pillar, tracker,
  article, tag, group-buys, sitemap, robots, global feed,
  pillar feed)
- `1` → at least one probe returned non-2xx; print per-URL,
  patch the runtime, push again

Implementation: `scripts/deploy-smoke.mjs` — minimal HTTP probe,
one URL per pattern, parallelized.

**Why two gates:** phase 4 shipped with `verify` green and
`deploy:check` ready, yet `/article/[slug]` and every other
dynamic route returned HTTP 500 in the bundled Netlify lambda
(this was on the prior Netlify host; phase 4b's manifest fix
makes the bundle runtime-agnostic). The local e2e walker hits
`next start` with the full repo on disk; the bundled lambda has
neither `pnpm-workspace.yaml` nor `/data` on its filesystem.
`deploy:smoke` is the post-push contract that catches that
class of regression on any host.

**A red deploy or a failed smoke is a blocked tick.** The skill
treats either identically to a red verify gate: read the log,
patch the root cause, push again. Up to 3 iterations on the same
root cause; otherwise the skill stops per its failure modes.

> **Historical note:** thock originally deployed to Netlify
> (`thock.netlify.app`); the project moved to Vercel after the
> free-tier build credits were exhausted mid-phase-4 and the
> Netlify-bundled lambda independently revealed the
> `import.meta.url` regression that phase 4b fixed. The deploy
> gate's contract is unchanged across hosts.

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

## Vercel operational notes

- Vercel **project name**: `thock`. Public **custom domain**:
  `https://thock.xyz` (the legacy `thock-coral.vercel.app` alias
  still resolves but is not primary). The two differ — the API
  takes the project name; the user types the domain.
- The project is team-scoped on Vercel, so `VERCEL_TEAM_ID` is
  **required** in `.env` for `pnpm deploy:check` to find it.
  See `agents.md` "Operational secrets" for the lookup command.
- No build config needed in repo: Vercel auto-detects Next.js,
  runs `pnpm build` (which runs `prebuild` → `build:manifest`
  → `next build`), and deploys.
- Auto-deploys: every push to `main` deploys; previews on PRs.
- **A red main = a red site.** Verify gate is pre-flight;
  `pnpm deploy:check` then `pnpm deploy:smoke` are post-flight.
- The deploy gate reads the Vercel REST API. The secrets it
  needs are `VERCEL_TOKEN` and `VERCEL_TEAM_ID`, both in `.env`
  (gitignored). See `agents.md` "Operational secrets" for setup.
