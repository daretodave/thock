/**
 * Bundle-size budget gate.
 *
 * Reads `.next/app-build-manifest.json`, identifies the JS chunks
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
const manifestPath = resolve(webDir, '.next', 'app-build-manifest.json')

const DEFAULT_MAX_KB = 200
const SEARCH_MAX_KB = 150

type AppBuildManifest = {
  pages: Record<string, string[]>
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

function checkRoute(manifest: AppBuildManifest, budget: RouteBudget): boolean {
  const chunks = manifest.pages[budget.key]
  if (!chunks || chunks.length === 0) {
    console.error(
      `[size] expected manifest.pages["${budget.key}"] to list chunks; got ${JSON.stringify(chunks)}.`,
    )
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
  if (!existsSync(manifestPath)) {
    console.error(
      `[size] missing ${manifestPath} — run \`pnpm --filter @thock/web build\` first.`,
    )
    process.exit(2)
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as AppBuildManifest
  const budgets: RouteBudget[] = [
    { key: '/page', maxKb: parseMaxKb(process.argv.slice(2)) },
    { key: '/search/page', maxKb: SEARCH_MAX_KB },
  ]

  const results = budgets.map((b) => checkRoute(manifest, b))
  if (results.some((ok) => !ok)) {
    process.exit(1)
  }
  console.log('[size] OK')
}

main()
