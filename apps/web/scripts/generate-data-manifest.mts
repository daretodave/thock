/**
 * Pre-build manifest generator.
 *
 * Writes `apps/web/src/lib/data-runtime/manifest.generated.json`
 * by exercising the canonical loaders in @thock/data and
 * @thock/content from a Node-on-disk context where their
 * filesystem walks succeed. The web app reads through that
 * manifest at request time so the bundled Netlify lambda never
 * needs to find `pnpm-workspace.yaml`, `/data`, or
 * `apps/web/src/content` on its own.
 *
 * Wired as `prebuild` in apps/web/package.json so any `pnpm build`
 * (and therefore any `pnpm verify` and any Playwright harness)
 * regenerates the manifest before Next.js touches it.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  getAllSwitches,
  getAllKeycapSets,
  getAllBoards,
  getAllVendors,
  getAllGroupBuys,
  getAllTrendSnapshots,
} from '@thock/data'
import {
  getAllArticles,
  getAllNewsletters,
  getAllTags,
} from '@thock/content'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(here, '..', 'src', 'lib', 'data-runtime')
const outFile = resolve(outDir, 'manifest.generated.json')

const manifest = {
  switches: getAllSwitches(),
  keycapSets: getAllKeycapSets(),
  boards: getAllBoards(),
  vendors: getAllVendors(),
  groupBuys: getAllGroupBuys(),
  trends: getAllTrendSnapshots(),
  articles: getAllArticles(),
  newsletters: getAllNewsletters(),
  tags: getAllTags(),
  generatedAt: new Date().toISOString(),
} as const

mkdirSync(outDir, { recursive: true })
writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8')

console.log(`[manifest] wrote ${outFile}`)
console.log(`  switches:    ${manifest.switches.length}`)
console.log(`  keycapSets:  ${manifest.keycapSets.length}`)
console.log(`  boards:      ${manifest.boards.length}`)
console.log(`  vendors:     ${manifest.vendors.length}`)
console.log(`  groupBuys:   ${manifest.groupBuys.length}`)
console.log(`  trends:      ${manifest.trends.length}`)
console.log(`  articles:    ${manifest.articles.length}`)
console.log(`  newsletters: ${manifest.newsletters.length}`)
console.log(`  tags:        ${manifest.tags.length}`)
