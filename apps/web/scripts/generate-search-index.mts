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

import { getAllArticles, getAllNewsletters } from '@thock/content'
import {
  getAllSwitches,
  getAllKeycapSets,
  getAllBoards,
  getAllVendors,
  getAllGroupBuys,
  getAllTrendSnapshots,
  isGroupBuyEnded,
} from '@thock/data'

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

type PartDoc = {
  id: string
  slug: string
  kind: 'switch' | 'keycap-set' | 'board' | 'vendor' | 'newsletter' | 'group-buy' | 'tracker-week'
  name: string
  href: string
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

/**
 * Mirrors `getAllClosedGroupBuys()` in `apps/web/src/lib/data-runtime`:
 * closed/shipped, or live/announced with an `endDate` already passed.
 * Determines whether a group buy's search result should point at the
 * live `/group-buys` index or the `/group-buys/past` archive.
 */
const todayIso = new Date().toISOString().slice(0, 10)

/** Mirrors `weekKicker()` in `apps/web/src/lib/tracker/index.ts`'s label format. */
function trackerWeekLabel(isoWeek: string): string {
  const m = /^(\d{4})-W(\d{2})$/.exec(isoWeek)
  if (!m) return isoWeek
  return `Week ${Number(m[2])} / ${Number(m[1])}`
}

const parts: PartDoc[] = [
  ...getAllSwitches().map((s) => ({
    id: s.slug,
    slug: s.slug,
    kind: 'switch' as const,
    name: s.name,
    href: `/part/switch/${s.slug}`,
  })),
  ...getAllKeycapSets().map((k) => ({
    id: k.slug,
    slug: k.slug,
    kind: 'keycap-set' as const,
    name: k.name,
    href: `/part/keycap-set/${k.slug}`,
  })),
  ...getAllBoards().map((b) => ({
    id: b.slug,
    slug: b.slug,
    kind: 'board' as const,
    name: b.name,
    href: `/part/board/${b.slug}`,
  })),
  ...getAllVendors().map((v) => ({
    id: v.slug,
    slug: v.slug,
    kind: 'vendor' as const,
    name: v.name,
    href: `/vendor/${v.slug}`,
  })),
  ...getAllNewsletters().map((n) => ({
    id: n.slug,
    slug: n.slug,
    kind: 'newsletter' as const,
    name: n.frontmatter.title,
    href: `/newsletter/${n.slug}`,
  })),
  ...getAllGroupBuys().map((g) => ({
    id: g.slug,
    slug: g.slug,
    kind: 'group-buy' as const,
    name: g.name,
    href: isGroupBuyEnded(g, todayIso) ? `/group-buys/past#${g.slug}` : `/group-buys#${g.slug}`,
  })),
  ...getAllTrendSnapshots().map((t) => ({
    id: t.isoWeek,
    slug: t.isoWeek,
    kind: 'tracker-week' as const,
    name: trackerWeekLabel(t.isoWeek),
    href: `/trends/tracker/${t.isoWeek}`,
  })),
]

const payload = {
  serialized: JSON.parse(JSON.stringify(ms.toJSON())),
  documents: documents.map(({ body: _body, ...rest }) => rest),
  parts,
  generatedAt: new Date().toISOString(),
  count: documents.length,
}

mkdirSync(outDir, { recursive: true })
writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf-8')

console.log(`[search] wrote ${outFile}`)
console.log(`  articles indexed: ${documents.length}`)
console.log(`  parts cataloged: ${parts.length}`)
