#!/usr/bin/env node
// scripts/content-gap-survey.mjs
//
// Rule-1 sliding-window content-gap survey for plan/AUDIT.md.
//
// Reads all article frontmatter from apps/web/src/content/articles/*.mdx,
// computes the 30-day window count per pillar, and emits the top-priority
// audit row when any pillar falls below the ≥2 floor.
//
// Three states (bearings.md Rule 1):
//   comfortable          → every pillar ≥ 2 in 30d — no row filed
//   hot-pursuit          → one or more pillars at exactly 1 — score 7.0
//   critical-hot-pursuit → one or more pillars at 0 — score 9.5
//
// Usage:
//   node scripts/content-gap-survey.mjs           # dry-run: print row, no write
//   node scripts/content-gap-survey.mjs --write   # append row to plan/AUDIT.md
//   node scripts/content-gap-survey.mjs --json    # JSON output (programmatic)
//
// Exit codes:
//   0 → success (comfortable → no-op, or row found / written)
//   1 → error (filesystem read failure, malformed frontmatter)

import { readFileSync, readdirSync, appendFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const ARTICLES_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'articles')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

// ── Pure algorithm (duplicated from packages/content/src/util/content-gap-survey.ts)
// Duplication is intentional: this script has no build step and cannot
// import TypeScript. The canonical tested implementation lives in the
// packages/content package; this is the operational CLI entry point.

const PILLARS = ['news', 'trends', 'ideas', 'deep-dives', 'guides']

const PROMINENCE = { trends: 0, news: 1, ideas: 2, 'deep-dives': 3, guides: 4 }

const PILLAR_IMPACT = { trends: 8, news: 7, ideas: 7, 'deep-dives': 6, guides: 5 }

function toDateOnly(iso) {
  return iso.slice(0, 10)
}

function addDays(date, days) {
  const d = new Date(date.getTime())
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

function surveyContentGaps(articles, today) {
  const windowStart = addDays(today, -30)
  const windowStartStr = toDateOnly(windowStart.toISOString())

  const counts = new Map(PILLARS.map((p) => [p, 0]))
  const mostRecent = new Map(PILLARS.map((p) => [p, null]))

  for (const article of articles) {
    const { pillar, publishedAt } = article
    if (!PILLARS.includes(pillar)) continue
    const dateStr = toDateOnly(publishedAt)
    const prev = mostRecent.get(pillar)
    if (prev === null || dateStr > prev) mostRecent.set(pillar, dateStr)
    if (dateStr >= windowStartStr) counts.set(pillar, (counts.get(pillar) ?? 0) + 1)
  }

  const candidates = []
  for (const pillar of PILLARS) {
    const count = counts.get(pillar) ?? 0
    let state, score
    if (count >= 2) continue
    if (count === 1) { state = 'hot-pursuit'; score = 7.0 }
    else { state = 'critical-hot-pursuit'; score = 9.5 }
    candidates.push({
      pillar, state, score,
      windowCount: count,
      windowStart: windowStartStr,
      mostRecentPublishedAt: mostRecent.get(pillar) ?? null,
      impact: PILLAR_IMPACT[pillar],
    })
  }

  if (candidates.length === 0) return { status: 'comfortable' }

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    const aDate = a.mostRecentPublishedAt ?? '0000-00-00'
    const bDate = b.mostRecentPublishedAt ?? '0000-00-00'
    if (aDate !== bDate) return aDate < bDate ? -1 : 1
    if (a.windowCount !== b.windowCount) return a.windowCount - b.windowCount
    return PROMINENCE[a.pillar] - PROMINENCE[b.pillar]
  })

  return { status: 'candidate', candidate: candidates[0] }
}

function formatAuditRow(candidate, today) {
  const todayStr = toDateOnly(today.toISOString())
  const stateLabel =
    candidate.state === 'critical-hot-pursuit' ? 'CRITICAL HOT PURSUIT' : 'HOT PURSUIT'
  const stateDesc =
    candidate.state === 'critical-hot-pursuit'
      ? `Zero articles published in the last 30 days — critical hot pursuit (score 9.5). Loop drops iterate/polish until the pillar recovers.`
      : `One article published in the last 30 days — hot pursuit (score 7.0). Next /march tick dispatches /ship-content for this pillar.`

  return `\n### [${stateLabel}] [content-gap] [${candidate.score}] ${candidate.pillar} pillar — ${candidate.windowCount} of ≥2 articles in last 30d
- category: content-gaps
- impact: ${candidate.impact} (Rule 1 sliding window — ${candidate.state})
- ease: 5 (one new article per tick via /ship-content)
- rule: Rule 1 — sliding-window freshness
- pillar: ${candidate.pillar}
- window-count: ${candidate.windowCount}
- window-start: ${candidate.windowStart}
- score: ${candidate.score}
- next: /ship-content → ${candidate.pillar} pillar article
> Filed ${todayStr} by content-gap-survey.mjs (auto-refill). ${stateDesc}\n`
}

// ── Inline frontmatter parser (no gray-matter dep needed)
// Reads the YAML block between the first --- and second --- markers.
// Only extracts `pillar` and `publishedAt` — the two fields we need.
function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return null
  const yaml = match[1]
  const pillarMatch = yaml.match(/^pillar:\s*(.+)$/m)
  const publishedAtMatch = yaml.match(/^publishedAt:\s*'?([^'\n]+)'?/m)
  if (!pillarMatch || !publishedAtMatch) return null
  return {
    pillar: pillarMatch[1].trim(),
    publishedAt: publishedAtMatch[1].trim(),
  }
}

// ── CLI entry ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const doWrite = args.includes('--write')
const doJson = args.includes('--json')

let articles
try {
  const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))
  articles = []
  for (const file of files) {
    const content = readFileSync(join(ARTICLES_DIR, file), 'utf8')
    const fm = extractFrontmatter(content)
    if (fm && fm.pillar && fm.publishedAt) {
      articles.push({ pillar: fm.pillar, publishedAt: fm.publishedAt })
    }
  }
} catch (err) {
  console.error(`content-gap-survey: failed to read articles — ${err.message}`)
  process.exit(1)
}

const today = new Date()
today.setUTCHours(0, 0, 0, 0)

const result = surveyContentGaps(articles, today)

if (result.status === 'comfortable') {
  if (doJson) {
    console.log(JSON.stringify({ status: 'comfortable' }))
  } else {
    console.log('content-gap-survey: all pillars comfortable — no row filed.')
  }
  process.exit(0)
}

const { candidate } = result
const row = formatAuditRow(candidate, today)

if (doJson) {
  console.log(JSON.stringify({ status: 'candidate', candidate, row }))
} else if (doWrite) {
  try {
    appendFileSync(AUDIT_MD, row)
    console.log(
      `content-gap-survey: filed [${candidate.state}] row for ${candidate.pillar} (score ${candidate.score}) → plan/AUDIT.md`
    )
  } catch (err) {
    console.error(`content-gap-survey: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }
} else {
  // Dry-run: print the row
  console.log(row)
}

process.exit(0)

// ── __test export (for scripts/__tests__/content-gap-survey.test.mjs) ─────────
export const __test = {
  surveyContentGaps,
  formatAuditRow,
  extractFrontmatter,
  PILLARS,
  PILLAR_IMPACT,
  PROMINENCE,
}
