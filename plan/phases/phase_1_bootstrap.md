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

Read CSS variables from `@thock/tokens/tokens.css`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  darkMode: ['class', 'html:not(.light)'],
  theme: {
    extend: {
      colors: {
        bg:        'rgb(var(--color-bg) / <alpha-value>)',
        surface:   'rgb(var(--color-surface) / <alpha-value>)',
        fg:        'rgb(var(--color-fg) / <alpha-value>)',
        muted:     'rgb(var(--color-muted) / <alpha-value>)',
        hairline:  'rgb(var(--color-hairline) / <alpha-value>)',
        accent:    'rgb(var(--color-accent) / <alpha-value>)',
        'accent-up':   'rgb(var(--color-accent-up) / <alpha-value>)',
        'accent-down': 'rgb(var(--color-accent-down) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        sans:  ['var(--font-sans)',  'ui-sans-serif', 'system-ui'],
        mono:  ['var(--font-mono)',  'ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
}
export default config
```

## tokens.css (locked palette / type for v1)

```css
:root {
  --color-bg: 14 15 18;             /* #0e0f12 */
  --color-surface: 26 28 32;        /* #1a1c20 */
  --color-fg: 230 231 234;          /* #e6e7ea */
  --color-muted: 154 160 170;       /* #9aa0aa */
  --color-hairline: 50 54 60;       /* #32363c */
  --color-accent: 229 162 58;       /* #e5a23a — warm amber */
  --color-accent-up: 92 184 92;     /* #5cb85c */
  --color-accent-down: 217 83 79;   /* #d9534f */

  --font-serif: 'Source Serif 4', 'Fraunces', ui-serif;
  --font-sans:  'Inter', ui-sans-serif;
  --font-mono:  'JetBrains Mono', ui-monospace;
}

html.light {
  --color-bg: 250 250 251;
  --color-surface: 255 255 255;
  --color-fg: 18 19 22;
  --color-muted: 95 100 110;
  --color-hairline: 220 222 226;
}
```

Load fonts via `next/font` in `apps/web/src/app/layout.tsx`:

```ts
import { Source_Serif_4, Inter, JetBrains_Mono } from 'next/font/google'
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' })
const sans  = Inter({ subsets: ['latin'], variable: '--font-sans' })
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
```

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
- **Light mode:** wired but not the default. Toggle UI is phase 16.
- **Search icon:** present and inert. Better to ship the visual
  rhythm now than rearrange the header in phase 14.
- **Wordmark:** plain text `thock` in serif at this phase. The
  custom mark / glyph waits for design.
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
- Tailwind theme extension reads design tokens.
- Dark mode default; light mode via html.light class toggle.
- Vitest unit tests across packages/ui and packages/tokens.
- Playwright smoke spec for /; mobile + desktop viewports.
- pnpm verify gate: typecheck + unit + build + e2e.
- Netlify deploy targets thock.netlify.app via netlify.toml.

Decisions:
- Tailwind v3.4 (v4 deferred to avoid churn).
- @thock/tokens exports tokens.css for direct import; TS object
  is for runtime token access only.
- @thock/ui peers React to avoid duplicate React in the bundle.
- E2E webServer on :4173 to keep :3000 free for dev.
- Wordmark renders plain serif "thock" — custom mark waits for
  design export.
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
