# Skill: ship-asset

> **Demand-pull only.** Render and ship **one** brand asset
> (OG image, favicon, social card, SVG → PNG, hero
> illustration, wordmark variant). Spawn `brander` to render,
> verify, commit, push, confirm deploy, return.
>
> **Hard-gated on `Surface:` field in `plan/bearings.md`.**
> thock declares `Surface: site`, so the skill is enabled. If
> the surface ever changes to `service`/`library`/`cli`, this
> skill self-disables on entry — no override flag.
>
> **Adopt-by-need capability** from nexus
> (`../nexus/customization/branding.md`). Same shape as
> `/ship-data` — opt-in by deliberate copy, not present in
> projects that don't need it.

## 1. Purpose

Asset generation that doesn't drift the autonomous loop. The
skill ships exactly **one** asset per invocation, scored
against the same impact × ease rubric `/iterate` uses.
Findings reach this skill via four demand-pull paths only:

1. `/critique` filed an SEO/visual finding the `reader`
   sub-agent surfaced (e.g. missing `og:image`, broken
   favicon, stranded social-card preview).
2. `/iterate`'s "asset hygiene" audit flagged a missing
   per-route OG handler, a 404'd image ref, a favicon gap.
3. A phase brief explicitly named an asset deliverable;
   `/ship-a-phase` delegates the asset chunk inline.
4. The user invoked `/ship-asset` directly with an explicit
   target.

There is **no** `/march` step that calls `/ship-asset`
proactively. The capability sits dormant until pulled.

## 2. Invocation

```
/ship-asset                            # next asset finding from CRITIQUE/AUDIT
/ship-asset og <route-path>            # render OG for one route (e.g. /article/<slug>)
/ship-asset favicon                    # (re)render the favicon set
/ship-asset social <route-path>        # render social card variants
/ship-asset svg2png <design-path>      # convert one SVG → PNG (+ provenance)
/ship-asset audit                      # audit-only; emit findings, no ship
```

## 3. The hard surface gate

**Step 0 of every invocation:** read
`plan/bearings.md`'s `Surface:` line.

| `Surface:` value | Skill behavior |
|---|---|
| `site` | proceed (thock today) |
| `hybrid` | proceed (assets land in the site portion) |
| `service` `library` `cli` | exit 0 with a one-line note: `ship-asset: surface=<x>, no asset path — exiting cleanly`. Do not commit. |
| missing / unparseable | exit with `[needs-user-call]` row appended to `plan/AUDIT.md`. Do not default. |

Unconditional. There is no `--force` flag.

## 4. Autonomy contract

- **Pick the highest-scoring asset finding** when invoked
  without arguments. Score the same way `/iterate` does.
- **Render, don't deliberate.** If the brief is clear, spawn
  `brander` and ship. Don't ask the user. For taste calls
  (mood / accent / wordmark style), the user runs
  `/oversight` — see §10.
- **One asset per invocation.** No batching. No "while we're
  in here, also do the favicon."
- **Provenance JSON sibling required** for every generated
  raster. The PNG never ships alone.
- **Never overwrite a hand-authored asset** (one without a
  provenance sibling). Refuse and flag `[needs-user-call]`.

## 5. Delegation

- **`brander`** at `.claude/agents/brander.md` — renders the
  asset. Always delegated. `ship-asset` does not call
  `satori`/`resvg` directly; that's the brander's job.
  Receives a brief, returns paths.
- **`scout`** — only if the asset task needs an external fact
  (e.g. correct color of a vendor logo for a coverage piece).
  Rare.
- **No parallel calls within one ship-asset invocation** —
  one asset, one render.

## 6. The procedure

### Step 0 — Surface gate + re-sync

```bash
git pull --ff-only
```

Read `plan/bearings.md`'s `Surface:` line per §3. thock today
is `site` — proceed. (Re-check anyway; it's free and the gate
is the contract.)

### Step 1 — Pick the work

- No argument → read `plan/CRITIQUE.md` Pending and
  `plan/AUDIT.md` for findings with `category: seo`,
  `category: visual`, or `category: asset` whose suggested
  fix is an asset render. Score by impact × ease. Pick the
  top one.
- Explicit argument (`og <route>`, `favicon`, etc.) → use it.

If no findings and no argument: run §7 audit pass and exit 0.

### Step 2 — Build the brief

A brander brief is a small JSON object:

```json
{
  "kind": "og" | "favicon" | "social-card" | "svg2png" | "wordmark" | "custom",
  "target": "<output path under apps/web/public/ or apps/web/src/app/>",
  "source": "<source SVG/JSX path, or null if generating from template>",
  "template": "<template name from design/ or null>",
  "size": [<w>, <h>] or null,
  "title": "<text content if applicable>",
  "subtitle": "<text content if applicable>",
  "tokens": "design/tokens.css",
  "fonts": ["Newsreader", "IBM Plex Sans", "JetBrains Mono"]
}
```

Resolve every field from `plan/bearings.md` + `design/` + the
finding. Don't ask the user.

For thock, the bearings-locked defaults:
- **Palette**: `oklch(0.175 0.006 250)` deep cool charcoal bg,
  brass accent `oklch(0.80 0.135 75)`. Read exact values from
  `design/tokens.css`.
- **Type**: Newsreader (italic ductus, headlines), IBM Plex
  Sans (body/UI), JetBrains Mono (technical terms).
- **Voice**: knowledgeable peer, lowercase "thock" always,
  tagline "keyboards, deeply.".
- **Default OG template**: wordmark + H1 over a dark gradient
  per the bearings "Decisions standing" entry.

### Step 3 — Spawn `brander`

```
Agent({ subagent_type: "brander", prompt: "<brief JSON + acceptance criteria>" })
```

Brander returns paths to the rendered file(s) + the provenance
JSON sibling(s). It does **not** commit.

### Step 4 — Wire (only if first instance of this asset type)

Examples:
- First per-route OG → add
  `apps/web/src/app/article/[slug]/opengraph-image.tsx` (or
  the equivalent route handler) pointing at the rendered
  template. The bearings URL contract already promises
  `/opengraph-image.png` as site-default plus per-route OGs
  via `opengraph-image.tsx`.
- First favicon set → update `apps/web/src/app/layout.tsx`
  metadata (or `app/icon.tsx` / `app/apple-icon.tsx` if using
  Next's metadata file convention).
- First social card variant → register Twitter/LinkedIn meta
  tags in the page metadata.

Subsequent assets of the same type re-use the existing wiring.

### Step 5 — Verify

```bash
pnpm verify
```

Hard gate. The new asset must not break `pnpm typecheck`,
`pnpm test:run`, `pnpm data:validate`, `pnpm build`, or `pnpm
e2e`. The Playwright walker covers every canonical URL —
metadata + image refs are exercised.

If verify fails: read the log, patch (likely the wiring, not
the asset), re-run. Up to 3 same-root-cause iterations.

### Step 6 — Commit + push

```bash
git add <asset path> <asset>.json <wiring file if any>
git commit -m "asset: <kind> <slug>

Brief: <one-line summary>
Source: <source path>
Provenance: <generated_by, source, commit-at-render>
"
git push origin main
```

**Always commit the provenance JSON in the same commit** as
the raster. They live and die together. No `Co-Authored-By:`,
no emojis.

### Step 7 — Confirm deploy

```bash
pnpm deploy:check
pnpm deploy:smoke
```

If the deploy doesn't go ready or the smoke fails: same
failure path as any other shipping skill — read log, patch,
push, retry up to 3.

### Step 8 — Drain the finding

If this invocation addressed a finding from
`plan/CRITIQUE.md` or `plan/AUDIT.md`, move it to the Done
section in a follow-up amendment to the same commit (or skip
if drained inline).

### Step 9 — Done

Return cleanly so the next loop tick picks the next finding.

## 7. Audit pass (Surface: site only)

Score 0–10 by impact × ease:

1. **Missing per-route OG.** Walk the canonical URL set from
   `apps/e2e/src/fixtures/canonical-urls.ts`; flag any route
   whose `<head>` lacks `og:image` (or points to the
   site-default when a per-route render would be richer).
2. **Default OG everywhere.** All routes share one OG with no
   per-route content — likely the dynamic handler isn't
   wired.
3. **Broken image refs.** MDX/JSX references an image file
   that doesn't exist on disk. Run a glob over
   `apps/web/src/content/**/*.mdx` and check `heroImage` /
   inline image refs.
4. **Favicon 404 or missing.** No `.ico`, no `.svg`, or the
   referenced file 404s on the live site.
5. **Social card variants missing** for routes that should
   have them (article, group-buys, trends-tracker).
6. **Provenance hygiene.** Generated assets without a sibling
   provenance JSON. Provenance pointing at a deleted source.
7. **Stale renders.** Provenance commit is older than the
   referenced template/source's last edit.

Write findings to `plan/AUDIT.md` under category `asset`.

## 8. Hard rules

1. **`Surface:` gate is unconditional.** No override, no
   force, no exception.
2. **One asset per invocation.** Batching is for an explicit
   phase, not for the iterate loop.
3. **Provenance JSON sibling required** for every generated
   raster. Hand-authored static assets are exempt.
4. **Never overwrite a hand-authored asset.** Refuse + flag.
5. **No external upload destinations.** Assets land in the
   repo, served by Vercel.
6. **No `Co-Authored-By:`. No emojis** — anywhere.
7. **Atomic commit** — asset + provenance + wiring in one.
8. **Lowercase "thock"** in any text rendered into an asset.

## 9. Failure modes

1. **`Surface:` field missing.** Exit, flag
   `[needs-user-call]`. Do not default.
2. **`brander` returns a render error.** Capture in
   `plan/AUDIT.md`; exit without committing.
3. **Generated PNG > 1 MB.** Re-render with optimization. If
   still oversized, flag as `[needs-user-call]`.
4. **Asset would clobber a hand-authored file.** Refuse.
5. **`pnpm verify` fails ≥3 times on same root cause.** Stop.
6. **`pnpm deploy:check` or `pnpm deploy:smoke` fails ≥3
   times.** Stop.
7. **Render dependencies missing** (`satori`,
   `@resvg/resvg-js`, `sharp`). Install once with
   `pnpm add -F @thock/web satori @resvg/resvg-js sharp` in
   the same commit. If install fails, flag
   `[needs-user-call]`.
8. **Source SVG references a font not available locally.**
   Either inline the font or flag `[needs-user-call]` — do not
   silently substitute. thock's three families (Newsreader,
   IBM Plex Sans, JetBrains Mono) ship with the project.

## 10. When taste calls are needed — use `/oversight`

`/ship-asset` is **autonomous**: drains **one** finding,
never asks the user.

When thock needs a real brand pass — refresh the wordmark
family, set up favicons properly the first time, introduce a
new social-card template — the user runs `/oversight` (the
existing user-in-the-loop skill, and the only one allowed to
use `AskUserQuestion`). `/oversight` audits the lay of the
land (`design/tokens.css`, `design/decisions.jsx`,
`apps/web/public/`, current metadata wiring), asks targeted
questions about mood / accent / wordmark / OG template,
captures the locked brief into `plan/bearings.md`'s
"Visual & tonal defaults" section, and appends concrete
asset-render rows to `plan/AUDIT.md` under
`category: asset`. `/ship-asset` then drains those rows on
subsequent ticks — every drift the loop notices.

This keeps the brand brief in durable repo state, ships
assets through the same demand-pull path as every other
improvement, and preserves the rule that `/oversight` is the
**only** skill allowed to use `AskUserQuestion`.

## 11. Quick reference

```bash
# Read
plan/bearings.md                      # Surface, design defaults
plan/CRITIQUE.md                      # asset findings filed by /critique
plan/AUDIT.md                         # asset findings filed by /iterate
design/tokens.css                     # palette + type ramp (canonical)
design/<template>.jsx                 # render templates if present
apps/e2e/src/fixtures/canonical-urls.ts  # URLs to walk during audit

# Write (rendered by brander, committed by ship-asset)
apps/web/public/og/<route-slug>.png   # per-route OG (static fallback)
apps/web/public/favicon.{ico,svg}     # favicon set
apps/web/public/brand/<asset>.{svg,png}  # wordmarks + social cards
apps/web/public/<asset>.json          # provenance siblings
apps/web/src/app/.../opengraph-image.tsx  # dynamic OG handler (preferred)

# Validate + commit + push + deploy
pnpm verify
git add <explicit files>
git commit -m "asset: ..."
git push origin main
pnpm deploy:check
pnpm deploy:smoke
```
