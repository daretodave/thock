/**
 * Pre-build search index generator.
 *
 * Writes `apps/web/src/lib/search/index.generated.json` by
 * exercising the canonical article loader and instantiating a
 * MiniSearch index. The web app reads the serialized index at
 * runtime; the bundled Vercel lambda never needs to walk
 * `apps/web/src/content/articles/` on its own.
 *
 * Wired as part of `prebuild` in apps/web/package.json so any
 * `pnpm build` (and therefore any `pnpm verify`) regenerates the
 * index before Next.js touches it.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import MiniSearch from 'minisearch'

import { getAllArticles } from '@thock/content'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(here, '..', 'src', 'lib', 'search')
const outFile = resolve(outDir, 'index.generated.json')

type SearchDoc = {
  id: string
  slug: string
  title: string
  lede: string
  pillar: string
  tags: string[]
  publishedAt: string
  body: string
}

const articles = getAllArticles()
const documents: SearchDoc[] = articles.map((a) => ({
  id: a.slug,
  slug: a.slug,
  title: a.frontmatter.title,
  lede: a.frontmatter.lede,
  pillar: a.frontmatter.pillar,
  tags: a.frontmatter.tags,
  publishedAt: a.frontmatter.publishedAt,
  body: a.body,
}))

const ms = new MiniSearch<SearchDoc>({
  fields: ['title', 'tags', 'lede', 'body'],
  storeFields: ['slug', 'title', 'lede', 'pillar', 'tags', 'publishedAt'],
  searchOptions: {
    boost: { title: 4, tags: 3, lede: 2, body: 1 },
    fuzzy: 0.2,
    prefix: true,
  },
})
ms.addAll(documents)

const payload = {
  serialized: JSON.parse(JSON.stringify(ms.toJSON())),
  documents: documents.map(({ body: _body, ...rest }) => rest),
  generatedAt: new Date().toISOString(),
  count: documents.length,
}

mkdirSync(outDir, { recursive: true })
writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf-8')

console.log(`[search] wrote ${outFile}`)
console.log(`  articles indexed: ${documents.length}`)
