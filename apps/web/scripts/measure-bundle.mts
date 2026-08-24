/**
 * Bundle-size budget gate.
 *
 * Reads the prerendered HTML (or the client-reference manifest for
 * dynamic routes — see `resolveRouteChunks`), identifies the JS chunks
 * loaded by each budgeted route ("/page", "/search/page" in App
 * Router conventions), gzips each via node:zlib, and sums the
 * result per route. Fails non-zero if any route's gzipped JS
 * exceeds its budget. The homepage budget (200 KB — the bearings
 * target) shipped at phase 17 at 250 KB to leave iterate headroom;
 * the iterate ticks since have not added meaningful bundle weight
 * (current measured baseline is ~110 KB), so the budget tightens to
 * 200 KB to match bearings — drains the LOW 2.5 audit row at
 * plan/AUDIT.md:98. The `/search` budget (150 KB) was added after
 * an iterate finding caught the MiniSearch index payload (~200 KB
 * gzipped of tokenized article bodies) being bundled eagerly into
 * the route's initial JS via a static import — the fix code-splits
 * it behind a dynamic import in `SearchPanel.tsx`; this budget
 * guards against that regressing silently as the corpus grows.
 *
 * Usage: `pnpm --filter @thock/web size`
 *        `pnpm --filter @thock/web size -- --max=180`
 *          (overrides the homepage budget only)
 *
 * Wired into `pnpm verify` after `next build`. Reads from `.next/`,
 * does not invoke the build itself.
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const here = dirname(fileURLToPath(import.meta.url))
const webDir = resolve(here, '..')
const nextDir = resolve(webDir, '.next')
const buildManifestPath = join(nextDir, 'build-manifest.json')

const DEFAULT_MAX_KB = 200
// Raised from 150 after the Next 16 upgrade lifted the shared framework
// chunks every route carries (see homepage baseline above) — /search
// measured 144.4 KB against the old 150 KB budget, 5.6 KB of headroom,
// tripping the gate on any unrelated client-side addition to the search
// surface. The MiniSearch index itself is not in this number (it's
// deferred behind a dynamic import in `SearchPanel.tsx`, confirmed by
// inspecting the resolved chunk list — no index-sized chunk appears);
// the near-full reading is entirely shared-framework weight, so trimming
// the index would not move it. 175 KB restores comparable proportional
// headroom to the homepage's 200 KB / 147.1 KB baseline.
const SEARCH_MAX_KB = 175

type BuildManifest = {
  rootMainFiles?: string[]
}

type RouteBudget = {
  key: string
  maxKb: number
}

function parseMaxKb(argv: readonly string[]): number {
  for (const arg of argv) {
    const m = /^--max=(\d+)$/.exec(arg)
    if (m && m[1]) return Number(m[1])
  }
  return DEFAULT_MAX_KB
}

function gzippedSize(file: string): number {
  const buf = readFileSync(file)
  return gzipSync(buf).byteLength
}

function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

/**
 * Resolve the client JS chunks a route ships. Next 16 dropped
 * `.next/app-build-manifest.json` (both Turbopack and `--webpack`
 * builds), so the gate reads two sources instead:
 *
 * 1. The prerendered HTML (`.next/server/app/<route>.html`) when the
 *    route is static — its `<script src>` tags are exactly what the
 *    browser loads.
 * 2. Otherwise the route's client-reference manifest
 *    (`page_client-reference-manifest.js`) — the union of every
 *    client module's `chunks` plus `build-manifest.rootMainFiles`.
 *    This is a superset of what the route actually loads (shared
 *    modules from sibling routes appear too), which errs on the
 *    strict side for a budget gate.
 */
function resolveRouteChunks(key: string): string[] {
  const routeDir = key.replace(/\/page$/, '') // "/page" → "", "/search/page" → "/search"
  const htmlPath = join(nextDir, 'server', 'app', routeDir === '' ? 'index.html' : `${routeDir.slice(1)}.html`)
  if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, 'utf-8')
    const found = new Set<string>()
    for (const m of html.matchAll(/<script\b([^>]*)>/g)) {
      const attrs = m[1] ?? ''
      // `noModule` scripts (the legacy polyfill bundle) never load in
      // a modern browser; they are not part of the shipped payload.
      if (/\bnoModule\b/i.test(attrs)) continue
      const src = /src="\/_next\/(static\/[^"]+\.js)"/.exec(attrs)
      if (src?.[1]) found.add(src[1])
    }
    if (found.size > 0) return [...found]
  }

  const rscPath = join(nextDir, 'server', 'app', ...routeDir.split('/').filter(Boolean), 'page_client-reference-manifest.js')
  if (!existsSync(rscPath)) {
    console.error(`[size] neither ${htmlPath} nor ${rscPath} exists for "${key}" — run \`pnpm --filter @thock/web build\` first.`)
    process.exit(2)
  }
  const g = globalThis as unknown as { __RSC_MANIFEST?: Record<string, { clientModules?: Record<string, { chunks?: string[] }> }> }
  // The manifest file assigns into globalThis.__RSC_MANIFEST[key].
  new Function(readFileSync(rscPath, 'utf-8'))()
  const rsc = g.__RSC_MANIFEST?.[key]
  const chunks = new Set<string>()
  const buildManifest = existsSync(buildManifestPath)
    ? (JSON.parse(readFileSync(buildManifestPath, 'utf-8')) as BuildManifest)
    : {}
  for (const f of buildManifest.rootMainFiles ?? []) chunks.add(f)
  for (const mod of Object.values(rsc?.clientModules ?? {})) {
    // Turbopack prefixes chunk paths with `_next/`; webpack does not.
    for (const c of mod.chunks ?? []) chunks.add(c.replace(/^\/?_next\//, ''))
  }
  return [...chunks].filter((c) => c.endsWith('.js'))
}

function checkRoute(budget: RouteBudget): boolean {
  const chunks = resolveRouteChunks(budget.key)
  if (chunks.length === 0) {
    console.error(`[size] no client chunks resolved for "${budget.key}".`)
    process.exit(2)
  }

  const maxBytes = budget.maxKb * 1024
  const jsChunks = chunks.filter((p) => p.endsWith('.js'))
  let total = 0
  console.log(`[size] chunks for "${budget.key}":`)
  for (const chunk of jsChunks) {
    const file = join(webDir, '.next', chunk)
    if (!existsSync(file)) {
      console.error(`[size] chunk file missing on disk: ${file}`)
      process.exit(2)
    }
    const raw = statSync(file).size
    const gz = gzippedSize(file)
    total += gz
    console.log(`  ${chunk.padEnd(58)}  ${fmt(raw).padStart(8)} raw  →  ${fmt(gz).padStart(8)} gz`)
  }

  console.log(`[size] "${budget.key}" gzipped total: ${fmt(total)} (budget ${budget.maxKb} KB)`)
  if (total > maxBytes) {
    console.error(
      `[size] FAIL — "${budget.key}" gzipped (${fmt(total)}) exceeds budget (${budget.maxKb} KB).`,
    )
    return false
  }
  return true
}

function main(): void {
  const budgets: RouteBudget[] = [
    { key: '/page', maxKb: parseMaxKb(process.argv.slice(2)) },
    { key: '/search/page', maxKb: SEARCH_MAX_KB },
  ]

  const results = budgets.map((b) => checkRoute(b))
  if (results.some((ok) => !ok)) {
    process.exit(1)
  }
  console.log('[size] OK')
}

main()
