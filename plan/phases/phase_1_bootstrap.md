# Phase 1 — Monorepo bootstrap

> Agent-facing brief. Concise, opinionated, decisive. Ship without
> asking; document any judgment calls in the commit body. This is
> the first phase — there is no shipped sibling to copy from.
> Substantial scope; pace yourself but ship in one phase commit.

## Scope

Stand up the **whole monorepo** so subsequent phases just fill in
rooms:

- `apps/web` — Next.js 15 App Router, renders a placeholder home
  with header + footer.
- `apps/e2e` — Playwright workspace with one passing smoke spec.
- `packages/tokens` — design tokens (CSS vars + TS export).
- `packages/ui` — `<Wordmark>`, `<Mono>`, `<Container>`, `<Stack>`.
- `packages/tsconfig` — shared TS configs (`base.json`, `react.json`,
  `next.json`).
- Root install works (`pnpm install` clean), `pnpm verify` passes,
  the dev server runs, push triggers a green Netlify deploy at
  https://thock.netlify.app.

Per-package SEO / content / data work is **deferred**:
- `@thock/seo` — phase 4.
- `@thock/content` — phase 3.
- `@thock/data` — phase 2.

Phase 1 only ships the substrate that those packages depend on.

## Outputs

```
apps/web/
├── package.json                          # @thock/web
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json                         # extends @thock/tsconfig/next.json
├── .eslintrc.json
├── public/
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── layout.tsx                    # RootLayout: html/body, fonts, header, footer
    │   ├── page.tsx                      # / — placeholder hero
    │   ├── globals.css                   # imports tokens + components.css + Tailwind
    │   ├── opengraph-image.tsx           # site default OG (deferred to phase 4 if not minimal)
    │   └── favicon.ico
    ├── components/
    │   └── ui/
    │       ├── Header.tsx
    │       ├── Footer.tsx
    │       ├── Container.tsx
    │       ├── Stack.tsx
    │       └── __tests__/
    │           ├── Header.test.tsx
    │           └── Footer.test.tsx
    ├── lib/
    │   └── siteConfig.ts                 # name, url, description (real @thock/seo lands phase 4)
    └── styles/
        └── components.css                # empty for now (phase 5+ adds patterns)

apps/e2e/
├── package.json                          # @thock/e2e
├── playwright.config.ts
├── tsconfig.json
└── tests/
    └── smoke.spec.ts                     # / renders header + h1 + footer @ desktop + mobile

packages/tokens/
├── package.json                          # @thock/tokens
├── tsconfig.json
├── src/
│   ├── index.ts                          # exports tokens object (TS)
│   └── tokens.css                        # CSS variables
└── __tests__/
    └── index.test.ts                     # exports match tokens.css var names

packages/ui/
├── package.json                          # @thock/ui (peerDeps: react)
├── tsconfig.json
├── src/
│   ├── index.ts                          # named exports
│   ├── Wordmark.tsx
│   ├── Mono.tsx
│   ├── Container.tsx
│   ├── Stack.tsx
│   └── __tests__/
│       ├── Wordmark.test.tsx
│       └── Mono.test.tsx
└── vitest.config.ts

packages/tsconfig/
├── package.json                          # @thock/tsconfig
├── base.json
├── react.json                            # extends base, jsx: react-jsx
└── next.json                             # extends react, jsx: preserve, paths
```

Root files (already shipped in scaffold prep):
- `package.json` (workspaces, scripts)
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `netlify.toml`
- `.gitignore`, `.nvmrc`, `.editorconfig`, `.prettierrc`

## Stack pins (versions; bump if a stable major has shipped)

- `next@^15`, `react@^19`, `react-dom@^19`
- `typescript@^5.6`
- `tailwindcss@^3.4`, `postcss@^8`, `autoprefixer@^10`
- `@vitejs/plugin-react@^4`, `vitest@^2`, `jsdom@^25`,
  `@testing-library/react@^16`, `@testing-library/jest-dom@^6`
- `@playwright/test@^1.48`
- `eslint@^8`, `eslint-config-next@^15`,
  `eslint-config-prettier@^9`
- `prettier@^3.3`, `prettier-plugin-tailwindcss@^0.6`

If a newer stable major has shipped at runtime (Tailwind 4,
Playwright 2, etc.), choose it and document in commit-body
Decisions.

## Workspace package.json scripts

Each workspace exports per-package scripts:

```json
// apps/web/package.json
{
  "name": "@thock/web",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "next lint"
  }
}
```

```json
// apps/e2e/package.json
{
  "name": "@thock/e2e",
  "private": true,
  "scripts": {
    "e2e": "playwright test",
    "e2e:install": "playwright install --with-deps",
    "typecheck": "tsc --noEmit"
  }
}
```

```json
// packages/tokens/package.json
{
  "name": "@thock/tokens",
  "exports": {
    ".": "./src/index.ts",
    "./tokens.css": "./src/tokens.css"
  },
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

```json
// packages/ui/package.json
{
  "name": "@thock/ui",
  "exports": { ".": "./src/index.ts" },
  "peerDependencies": { "react": "^19" },
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

Root `package.json` already has `pnpm -r` runners that fan out
across workspaces; no changes needed there.

## Tailwind theme extension (apps/web/tailwind.config.ts)

Wire OKLCH variables from `tokens.css` (post `--kh-*` → `--thock-*`
rename). Tailwind v3.4 supports CSS-variable-backed colors; OKLCH
passes through fine.

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  darkMode: ['class', '.thock-light'], // dark is default; light requires the class
  theme: {
    extend: {
      colors: {
        bg:        'var(--thock-bg)',
        'bg-2':    'var(--thock-bg-2)',
        surface:   'var(--thock-surface)',
        'surface-hi': 'var(--thock-surface-hi)',
        border:    'var(--thock-border)',
        'border-hi': 'var(--thock-border-hi)',
        text:      'var(--thock-text)',
        'text-2':  'var(--thock-text-2)',
        'text-3':  'var(--thock-text-3)',
        'text-4':  'var(--thock-text-4)',
        accent:    'var(--thock-accent)',
        'accent-hi': 'var(--thock-accent-hi)',
        'accent-mu': 'var(--thock-accent-mu)',
        up:        'var(--thock-up)',
        down:      'var(--thock-down)',
        flat:      'var(--thock-flat)',
        'tag-switch':   'var(--thock-tag-switch)',
        'tag-layout':   'var(--thock-tag-layout)',
        'tag-brand':    'var(--thock-tag-brand)',
        'tag-material': 'var(--thock-tag-material)',
        'tag-profile':  'var(--thock-tag-profile)',
      },
      fontFamily: {
        serif: ['var(--thock-serif)', 'Newsreader', 'Iowan Old Style', 'Georgia', 'serif'],
        sans:  ['var(--thock-sans)',  'IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono:  ['var(--thock-mono)',  'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        micro:   ['var(--thock-micro)',   { lineHeight: '1.4' }],
        small:   ['var(--thock-small)',   { lineHeight: '1.45' }],
        body:    ['var(--thock-body)',    { lineHeight: '1.55' }],
        h3:      ['var(--thock-h3)',      { lineHeight: '1.3' }],
        h2:      ['var(--thock-h2)',      { lineHeight: '1.2' }],
        h1:      ['var(--thock-h1)',      { lineHeight: '1.1' }],
        display: ['var(--thock-display)', { lineHeight: '1.02', letterSpacing: '-0.022em' }],
      },
    },
  },
  plugins: [],
}
export default config
```

The Tailwind utilities then read `bg-bg`, `text-text-2`,
`text-display`, `font-serif`, `bg-tag-switch` — names that reflect
intent, not raw color values.

## tokens.css — adopt from `design/tokens.css` verbatim

**Adopt `design/tokens.css` as the source.** Copy it to
`packages/tokens/src/tokens.css`, with one mechanical change:
rename CSS variables `--kh-*` → `--thock-*` (the design was
exported under the old name). Keep the OKLCH palette, the three
type families, the 4px spacing base, and the type ramp exactly
as designed.

The tokens you'll have after this transfer (paraphrased — see
`design/tokens.css` for exact values):

- **Palette (OKLCH):** deep cool charcoal bg, surface stepped
  +3% lightness, warm-bone text in three tiers, warm-brass accent.
  Tag-category hues at matched L=0.74 C=0.085. Trend semantics
  (up / down / flat) at matched lightness/chroma.
- **Light mode:** `.thock-light` (renamed from `.kh-light`) —
  warm paper background, intentionally undersaturated.
- **Type:** Newsreader (serif), IBM Plex Sans (sans), JetBrains
  Mono (mono).
- **Spacing:** 4px base, `--thock-1` through `--thock-9` (4 / 8 /
  12 / 16 / 24 / 32 / 48 / 64 / 96 px).
- **Type ramp:** display 56 / h1 40 / h2 28 / h3 20 / body 16 /
  small 14 / micro 12.

Load fonts via `next/font/google` in `apps/web/src/app/layout.tsx`:

```ts
import { Newsreader, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'

const serif = Newsreader({
  subsets: ['latin'],
  variable: '--thock-serif',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})
const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--thock-sans',
  weight: ['300', '400', '500', '600', '700'],
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--thock-mono',
  weight: ['400', '500', '600'],
})
```

Drop the `@import url('https://fonts.googleapis.com/...')` line at
the top of `design/tokens.css` when copying — `next/font` self-hosts
the same families.

## RootLayout shape (apps/web/src/app/layout.tsx)

```tsx
import '@thock/tokens/tokens.css'
import './globals.css'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'

export const metadata = {
  title: 'thock — keyboards, deeply.',
  description: 'Editorial content hub for mechanical keyboard enthusiasts.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-bg text-fg font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

## Header shape

- `<Wordmark>` from `@thock/ui` on the left → links to `/` —
  renders the literal lowercase string `thock`.
- Pillar nav placeholder (text-only, not yet wired): "News · Trends
  · Ideas · Deep Dives · Guides" — even if pages 404, the DOM ships
  for visual rhythm. Phase 4 wires real routes.
- Search icon button (inert; phase 14 wires it).

## Footer shape

- `<Wordmark>` (small variant).
- Copyright line: `© 2026 thock`.
- Inert newsletter signup placeholder: a single email input + button
  pointing at `/newsletter` (phase 15 makes it real).
- Nav: About · Sources · RSS · Newsletter.

## / page (placeholder hero)

- H1: `thock` in serif.
- Lede: `siteConfig.description`.
- CTA-ish chip: "Read the spec" → `/about` (404s until phase 16 —
  fine).

The home page is fully replaced in phase 6.

## SEO minimal (just enough for Netlify deploy not to look broken)

- `<html lang="en">`.
- `<title>` and `<meta name="description">` from `siteConfig`.
- Open Graph tags via `metadata` export (title, description, type).
- Default `opengraph-image.tsx` — wordmark + tagline on dark
  gradient (basic — phase 4 polishes).
- No JSON-LD until phase 4.

## Tests

### Unit (Vitest)
- `<Header>` renders the wordmark + the 5 pillar links.
- `<Footer>` renders the copyright + newsletter form + nav.
- `<Wordmark>` renders literal "thock", lowercase.
- `<Mono>` wraps children in mono font class.
- `tokens` index exports object whose keys match the CSS-variable
  names declared in tokens.css.

### E2E (Playwright)
`apps/e2e/tests/smoke.spec.ts`:
- Boot dev server on `:4173` (Playwright's webServer config).
- At 1280×720: H1 visible, header visible, footer visible.
- At 375×800: no horizontal scroll
  (`scrollWidth - innerWidth ≤ 1`), H1 within viewport.

## Decisions made upfront — DO NOT ASK

- **Next.js version:** App Router. RSC default. No Pages Router.
- **Tailwind:** v3.4. v4 only if it's the latest stable at runtime.
- **Test infra:** Vitest over Jest. Playwright over Cypress.
- **Pkg mgr:** pnpm 9. Lockfile committed.
- **Fonts:** `next/font/google` self-host. No CDN links.
- **Tokens:** adopt `design/tokens.css` verbatim (rename `--kh-*`
  → `--thock-*`). Three families: Newsreader / IBM Plex Sans /
  JetBrains Mono. OKLCH palette. 4px spacing base.
- **Light mode:** wired but not the default. Class is
  `.thock-light` on `<html>`. Toggle UI is phase 16.
- **Search icon:** present and inert. Better to ship the visual
  rhythm now than rearrange the header in phase 14.
- **Wordmark:** read `design/brand.jsx` for the composition. The
  design includes an accent dot on the H — adopt it. No bespoke
  crest at this phase (`design/decisions.jsx` voted against:
  "looked like every fintech logo").
- **README:** the pristine project README at root (already shipped
  in the bootstrap scaffold). No per-package READMEs unless a
  package is non-obvious.
- **CI:** none yet. Netlify is the only "CI" — the build fails the
  same way locally that it fails on Netlify, so the signal is
  parallel.
- **Light/dark toggle UI:** out of scope; class is enough.

## Mobile reflow

Tailwind handles it. Header is desktop-only nav at this phase
(hamburger lands phase 16). Footer reflows naturally.

## Verify gate

```bash
pnpm install
pnpm typecheck
pnpm test:run
pnpm build
pnpm e2e:install      # one-time per machine; idempotent
pnpm e2e
```

`pnpm verify` runs all four. Must pass before commit.

## Netlify check

After `git push origin main`, the Netlify build should run on its
own (the user has connected the repo). The first push will likely
fail until the Netlify Next.js plugin is detected — verify via the
Netlify UI or via `netlify status` (if `netlify-cli` is available).

If the deploy fails:
- Read the deploy log.
- If the failure is "package not found" → fix workspace
  resolution.
- If the failure is "image optimization needs API" → already
  handled by the plugin.
- If the failure is `next/font` related → make sure
  `experimental.optimizePackageImports` isn't misconfigured.
- Patch and push again. **Do not move on to phase 2 until the
  deploy is green.**

If the deploy doesn't fire at all, instruct the user to connect
the repo at https://app.netlify.com → "Add new site" → "Import an
existing project" → pick the GitHub repo → Netlify reads
`netlify.toml` automatically.

## Git

The repo is already initialized (the scaffold commit). Phase 1
ships its work as a new commit on `main`:

```bash
git add <explicit files>
git commit -m "$(cat <<'EOF'
feat: bootstrap monorepo — phase 1

- pnpm workspaces with apps/web (Next.js 15 App Router) and
  apps/e2e (Playwright).
- packages/tokens (CSS vars + TS), packages/ui (Wordmark, Mono,
  Container, Stack), packages/tsconfig (shared TS configs).
- RootLayout with Header + Footer; / renders placeholder hero.
- packages/tokens adopts design/tokens.css verbatim (one mechanical
  rename: --kh-* → --thock-*). Tailwind theme reads OKLCH vars.
- Three font families wired via next/font/google: Newsreader,
  IBM Plex Sans, JetBrains Mono.
- Dark mode default; .thock-light class enables light mode.
- Vitest unit tests across packages/ui and packages/tokens.
- Playwright smoke spec for /; mobile + desktop viewports.
- pnpm verify gate: typecheck + unit + build + e2e.
- Netlify deploy targets thock.netlify.app via netlify.toml.

Decisions:
- Tailwind v3.4 (v4 deferred to avoid churn).
- @thock/tokens adopts design/tokens.css verbatim with --kh-* →
  --thock-* rename; design intent is unchanged.
- @thock/ui peers React to avoid duplicate React in the bundle.
- E2E webServer on :4173 to keep :3000 free for dev.
- Wordmark composition follows design/brand.jsx (lowercase
  serif "thock" with accent dot on the H); no bespoke crest per
  design/decisions.jsx push-back.
EOF
)"
git push origin main
```

## DoD — tick in `plan/steps/01_build_plan.md`

Flip Phase 1's `[ ]` → `[x]`, append commit hash, add to phase
log. Commit:

```bash
git add plan/steps/01_build_plan.md
git commit -m "plan: phase 1 shipped — monorepo bootstrap"
git push origin main
```

## Follow-ups (out of scope this phase)

- Real CMS / preview UI — not on roadmap (MDX-in-repo is the
  contract).
- Light/dark mode UI toggle — phase 16 polish.
- Mobile hamburger menu — phase 16 polish.
- Per-route OG image art — phase 4 ships the default route handler;
  per-family templates land phase 16 polish.
- CI workflow file — Netlify is the only "CI" and that's enough.
- Vercel deploy config — out of scope (Netlify is the host).
- Per-package READMEs — only when a package is genuinely non-obvious.
