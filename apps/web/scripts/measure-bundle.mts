/**
 * Bundle-size budget gate.
 *
 * Reads `.next/app-build-manifest.json`, identifies the JS chunks
 * loaded by the homepage route ("/page" in App Router conventions),
 * gzips each via node:zlib, and sums the result. Fails non-zero if
 * the homepage's gzipped JS exceeds the budget (default 250 KB —
 * bearings target is 200 KB, current baseline ~120 KB so 250 KB
 * leaves one or two iterate ticks of headroom).
 *
 * Usage: `pnpm --filter @thock/web size`
 *        `pnpm --filter @thock/web size -- --max=200`
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

const DEFAULT_MAX_KB = 250
const HOMEPAGE_KEY = '/page'

type AppBuildManifest = {
  pages: Record<string, string[]>
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

function main(): void {
  if (!existsSync(manifestPath)) {
    console.error(
      `[size] missing ${manifestPath} — run \`pnpm --filter @thock/web build\` first.`,
    )
    process.exit(2)
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as AppBuildManifest
  const homepageChunks = manifest.pages[HOMEPAGE_KEY]
  if (!homepageChunks || homepageChunks.length === 0) {
    console.error(
      `[size] expected manifest.pages["${HOMEPAGE_KEY}"] to list chunks; got ${JSON.stringify(homepageChunks)}.`,
    )
    process.exit(2)
  }

  const maxKb = parseMaxKb(process.argv.slice(2))
  const maxBytes = maxKb * 1024

  const jsChunks = homepageChunks.filter((p) => p.endsWith('.js'))
  let total = 0
  console.log(`[size] homepage chunks for "${HOMEPAGE_KEY}":`)
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

  console.log(`[size] homepage gzipped total: ${fmt(total)} (budget ${maxKb} KB)`)
  if (total > maxBytes) {
    console.error(
      `[size] FAIL — homepage gzipped (${fmt(total)}) exceeds budget (${maxKb} KB).`,
    )
    process.exit(1)
  }
  console.log('[size] OK')
}

main()
