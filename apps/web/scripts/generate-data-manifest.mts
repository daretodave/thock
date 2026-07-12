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
const ogOutFile = resolve(outDir, 'og-manifest.generated.json')

const articles = getAllArticles()

const manifest = {
  switches: getAllSwitches(),
  keycapSets: getAllKeycapSets(),
  boards: getAllBoards(),
  vendors: getAllVendors(),
  groupBuys: getAllGroupBuys(),
  trends: getAllTrendSnapshots(),
  articles,
  newsletters: getAllNewsletters(),
  tags: getAllTags(),
  generatedAt: new Date().toISOString(),
} as const

// Minimal manifest for edge OG image handlers — article body and filePath
// are not needed for OG generation; stripping them keeps the edge bundle
// well under Vercel's 1 MB edge-function size limit.
const ogManifest = {
  articles: articles.map((a) => ({
    slug: a.slug,
    readTime: a.readTime,
    frontmatter: {
      title: a.frontmatter.title,
      lede: a.frontmatter.lede,
      pillar: a.frontmatter.pillar,
      author: a.frontmatter.author,
    },
  })),
  tags: manifest.tags.map((t) => ({ slug: t.slug, name: t.name, category: t.category })),
  parts: [
    ...manifest.switches.map((s) => ({ slug: s.slug, kind: 'switch' as const, name: s.name })),
    ...manifest.keycapSets.map((k) => ({ slug: k.slug, kind: 'keycap-set' as const, name: k.name })),
    ...manifest.boards.map((b) => ({ slug: b.slug, kind: 'board' as const, name: b.name })),
  ],
  vendors: manifest.vendors.map((v) => ({ slug: v.slug, name: v.name, description: v.description })),
  newsletters: manifest.newsletters.map((n) => ({
    slug: n.slug,
    title: n.frontmatter.title,
    lede: n.frontmatter.lede,
    issue: n.frontmatter.issue,
  })),
  generatedAt: manifest.generatedAt,
}

mkdirSync(outDir, { recursive: true })
writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8')
writeFileSync(ogOutFile, `${JSON.stringify(ogManifest, null, 2)}\n`, 'utf-8')

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
console.log(`[manifest] wrote ${ogOutFile} (OG manifest: ${ogManifest.articles.length} articles, ${ogManifest.tags.length} tags, ${ogManifest.parts.length} parts, ${ogManifest.vendors.length} vendors, ${ogManifest.newsletters.length} newsletters)`)
