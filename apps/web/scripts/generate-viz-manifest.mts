/**
 * Pre-build InlineViz aspect-ratio manifest generator.
 *
 * `InlineViz` renders each article diagram as a plain lazy-loaded
 * `<img>` with no reserved height, so the figure collapses to 0px
 * until the SVG fetch resolves — a cumulative-layout-shift hit on
 * every one of the ~185 diagrams across the corpus, worst-case right
 * as the reader scrolls into one.
 *
 * This script walks `apps/web/public/article-viz/**\/*.svg`, reads
 * each file's `viewBox` (family convention: 1200×N, but heights vary
 * per diagram so no single ratio covers all of them), and writes a
 * `src -> "width / height"` lookup that `InlineViz` uses to set
 * `aspect-ratio` inline, reserving layout space before the image
 * loads.
 *
 * Wired as part of `prebuild` in apps/web/package.json, mirroring
 * `generate-data-manifest.mts` / `generate-search-index.mts`.
 */
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(here, '..', 'public', 'article-viz')
const outFile = resolve(here, '..', '..', '..', 'packages', 'content', 'src', 'mdx', 'viz-aspect-ratio.generated.json')

function walkSvgFiles(dir: string): string[] {
  const entries = readdirSync(dir)
  const files: string[] = []
  for (const entry of entries) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...walkSvgFiles(full))
    } else if (entry.endsWith('.svg')) {
      files.push(full)
    }
  }
  return files
}

const VIEW_BOX_RE = /viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/

const manifest: Record<string, string> = {}
const svgFiles = walkSvgFiles(publicDir).sort()

for (const filePath of svgFiles) {
  const contents = readFileSync(filePath, 'utf-8')
  const match = VIEW_BOX_RE.exec(contents)
  if (!match) continue
  const [, width, height] = match
  const src = `/article-viz/${relative(publicDir, filePath).split('\\').join('/')}`
  manifest[src] = `${width} / ${height}`
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8')

console.log(`[viz-manifest] wrote ${outFile}`)
console.log(`  diagrams: ${Object.keys(manifest).length}`)
