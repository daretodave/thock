#!/usr/bin/env node
// scripts/article-crosslink-survey.mjs
//
// For each article pair sharing ≥2 tags, checks if either body has a prose
// cross-link to the other. Unlinked pairs → AUDIT rows.
//
// Stops the critique-driven cross-link iterate drip by surfacing gaps
// systematically at survey time and after each new article ships.
//
// Usage:
//   node scripts/article-crosslink-survey.mjs
//     Dry-run: prints unlinked pairs to stdout; exit 1 if any, 0 if clean.
//
//   node scripts/article-crosslink-survey.mjs --write
//     Scan mode: walks all articles, appends AUDIT.md rows for unlinked pairs.
//     Deduplicates: skips pairs already in AUDIT.md. Exit 0.
//
//   node scripts/article-crosslink-survey.mjs --json
//     JSON output: { "pairs": [...] }. Exit 0.
//
//   node scripts/article-crosslink-survey.mjs --slug <slug>
//     Scope to pairs involving this article slug only. Combines with all modes.
//     Used by ship-content Step 7c to scope to the newly shipped article.
//
// Exit codes:
//   0 → clean (dry-run) or scan complete (--write/--json)
//   1 → unlinked pairs found (dry-run) or error (any mode)

import { readFileSync, readdirSync, appendFileSync, existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const ARTICLES_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'articles')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

// ── Frontmatter parsing ───────────────────────────────────────────────────────

// Returns body lines and the 1-based line number of the first body line.
function extractBody(content) {
  const rawLines = content.split('\n')
  if (rawLines[0] !== '---') {
    return { bodyLines: rawLines, bodyStartLine: 1 }
  }
  for (let i = 1; i < rawLines.length; i++) {
    if (rawLines[i] === '---') {
      return { bodyLines: rawLines.slice(i + 1), bodyStartLine: i + 2 }
    }
  }
  return { bodyLines: rawLines, bodyStartLine: 1 }
}

// Parses slug, pillar, and tags from raw YAML frontmatter text.
// Handles inline tags: [a, b] and multi-line tags:\n  - a\n  - b formats.
function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return null
  const yaml = m[1]
  const lines = yaml.split('\n')

  let slug = null
  let pillar = null
  const tags = []
  let inTagsBlock = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Inline array: tags: [a, "b", 'c']
    const inlineTagsM = line.match(/^tags:\s*\[(.+)\]/)
    if (inlineTagsM) {
      inTagsBlock = false
      inlineTagsM[1].split(',').forEach((t) => {
        const clean = t.trim().replace(/^["']|["']$/g, '')
        if (clean) tags.push(clean)
      })
      continue
    }

    // Multi-line block start: tags:
    if (/^tags:\s*$/.test(line)) {
      inTagsBlock = true
      continue
    }

    // Multi-line block item:   - tagname
    if (inTagsBlock) {
      if (/^\s+-/.test(line)) {
        const tagM = line.match(/^\s+-\s*(.+)/)
        if (tagM) {
          const clean = tagM[1].trim().replace(/^["']|["']$/g, '')
          if (clean) tags.push(clean)
        }
        continue
      }
      // Non-indented line ends the block
      if (/^\w/.test(line)) {
        inTagsBlock = false
      }
    }

    const slugM = line.match(/^slug:\s*(.+)/)
    if (slugM) {
      slug = slugM[1].trim().replace(/^["']|["']$/g, '')
      continue
    }

    const pillarM = line.match(/^pillar:\s*(.+)/)
    if (pillarM) {
      pillar = pillarM[1].trim().replace(/^["']|["']$/g, '')
    }
  }

  return { slug, pillar, tags }
}

// ── Link detection ────────────────────────────────────────────────────────────

// Returns true if bodyLines contain a reference to /article/<targetSlug>.
function hasLinkTo(bodyLines, targetSlug) {
  const needle = `/article/${targetSlug}`
  return bodyLines.some((line) => line.includes(needle))
}

// ── Pair finding ─────────────────────────────────────────────────────────────

// Returns unlinked pairs from an article list.
// Each article: { slug, pillar, tags, bodyLines }.
function findUnlinkedPairs(articles, scopeSlug) {
  const pairs = []
  const scoped = scopeSlug
    ? articles.filter((a) => a.slug === scopeSlug)
    : articles

  for (const a of scoped) {
    for (const b of articles) {
      if (a.slug === b.slug) continue
      // Avoid duplicate pair (a,b) and (b,a) when not scoped
      if (!scopeSlug && a.slug > b.slug) continue

      const sharedTags = a.tags.filter((t) => b.tags.includes(t))
      if (sharedTags.length < 2) continue

      // Adjacent-pillar pairs suppressed per oversight 2026-06-14:
      // "raise the survey's adjacent-pillar floor rather than re-pruning by hand"
      const samePillar = a.pillar === b.pillar
      if (!samePillar) continue

      const aLinksB = hasLinkTo(a.bodyLines, b.slug)
      const bLinksA = hasLinkTo(b.bodyLines, a.slug)
      if (aLinksB || bLinksA) continue

      pairs.push({
        slugA: a.slug,
        slugB: b.slug,
        pillarA: a.pillar,
        pillarB: b.pillar,
        sharedTags,
        samePillar,
        impact: samePillar ? 5 : 4,
        ease: 9,
        score: samePillar ? 4.5 : 3.6,
      })
    }
  }
  return pairs
}

// ── Article loading ───────────────────────────────────────────────────────────

function loadArticles() {
  const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))
  const articles = []
  for (const file of files) {
    try {
      const content = readFileSync(join(ARTICLES_DIR, file), 'utf8')
      const fm = parseFrontmatter(content)
      if (!fm) continue
      const { bodyLines } = extractBody(content)
      const slug = fm.slug || basename(file, '.mdx')
      articles.push({
        slug,
        pillar: fm.pillar || 'unknown',
        tags: fm.tags,
        bodyLines,
        file,
      })
    } catch {
      // skip unreadable files
    }
  }
  return articles
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(pair, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const pillarDesc = pair.samePillar ? 'same pillar' : 'adjacent pillar'
  const impactDesc = pair.samePillar
    ? 'same-pillar articles sharing ≥2 tags with no cross-link; reader has no path to sibling'
    : 'cross-pillar articles sharing ≥2 tags with no cross-link; related content not discoverable'

  return `\n### [ ] [cross-links] [${pair.score.toFixed(1)}] ${pair.slugA} ↔ ${pair.slugB} — no prose cross-link (${pillarDesc}, ≥2 shared tags: ${pair.sharedTags.join(', ')})
- category: cross-links
- filed: ${todayStr} by article-crosslink-survey.mjs
- impact: ${pair.impact} (${impactDesc})
- ease: ${pair.ease} (add one inline markdown link to either article body)
- score: ${pair.score.toFixed(1)} (impact × ease / 10)
- shared-tags: ${pair.sharedTags.join(', ')}
- article-a: apps/web/src/content/articles/${pair.slugA}.mdx
- article-b: apps/web/src/content/articles/${pair.slugB}.mdx
- action: add [${pair.slugB}](/article/${pair.slugB}) to ${pair.slugA} body, or vice versa\n`
}

// ── Deduplication ─────────────────────────────────────────────────────────────

function alreadyFiled(auditContent, slugA, slugB) {
  return (
    auditContent.includes(`${slugA} ↔ ${slugB}`) ||
    auditContent.includes(`${slugB} ↔ ${slugA}`)
  )
}

// ── __test export (for scripts/__tests__/article-crosslink-survey.test.mjs) ──

export const __test = {
  parseFrontmatter,
  extractBody,
  hasLinkTo,
  findUnlinkedPairs,
}

// ── CLI entry (only runs when this file is invoked directly) ──────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Exported as a library — do nothing.
} else {

const args = process.argv.slice(2)
const doWrite = args.includes('--write')
const doJson = args.includes('--json')
const slugIdx = args.indexOf('--slug')
const scopeSlug = slugIdx !== -1 ? args[slugIdx + 1] : null

// Load articles
let articles
try {
  articles = loadArticles()
} catch (err) {
  console.error(`article-crosslink-survey: failed to read articles — ${err.message}`)
  process.exit(1)
}

if (articles.length === 0) {
  console.log('article-crosslink-survey: no articles found.')
  process.exit(0)
}

// Find unlinked pairs
const pairs = findUnlinkedPairs(articles, scopeSlug)

// JSON mode
if (doJson) {
  console.log(JSON.stringify({ pairs }, null, 2))
  process.exit(0)
}

// Write mode
if (doWrite) {
  if (pairs.length === 0) {
    console.log('article-crosslink-survey: all pairs linked — no AUDIT rows filed.')
    process.exit(0)
  }

  let existingContent = ''
  try {
    if (existsSync(AUDIT_MD)) {
      existingContent = readFileSync(AUDIT_MD, 'utf8')
    }
  } catch {
    // proceed without dedup
  }

  const today = new Date()
  const rows = []
  let filed = 0
  let skipped = 0

  for (const pair of pairs) {
    if (alreadyFiled(existingContent, pair.slugA, pair.slugB)) {
      skipped++
      continue
    }
    rows.push(formatAuditRow(pair, today))
    console.log(
      `article-crosslink-survey: unlinked pair ${pair.slugA} ↔ ${pair.slugB} (score ${pair.score.toFixed(1)}) — filing AUDIT row`,
    )
    filed++
  }

  if (filed === 0) {
    console.log(
      `article-crosslink-survey: ${pairs.length} pair(s) already in AUDIT.md — no new rows filed.`,
    )
    process.exit(0)
  }

  try {
    appendFileSync(AUDIT_MD, rows.join(''))
    console.log(`article-crosslink-survey: filed ${filed} AUDIT row(s)${skipped ? ` (${skipped} already filed)` : ''} → plan/AUDIT.md`)
  } catch (err) {
    console.error(`article-crosslink-survey: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  process.exit(0)
}

// Dry-run mode: print and exit 1 if any unlinked pairs
if (pairs.length === 0) {
  console.log('article-crosslink-survey: all pairs linked — no gaps found.')
  process.exit(0)
}

for (const pair of pairs) {
  const pillarNote = pair.samePillar ? `same pillar (${pair.pillarA})` : `${pair.pillarA} ↔ ${pair.pillarB}`
  console.log(`UNLINKED [score ${pair.score.toFixed(1)}] ${pair.slugA} ↔ ${pair.slugB}`)
  console.log(`  tags:   ${pair.sharedTags.join(', ')} (${pillarNote})`)
  console.log(`  fix:    add /article/${pair.slugB} link in ${pair.slugA}, or vice versa`)
  console.log()
}

console.error(
  `article-crosslink-survey: ${pairs.length} unlinked pair(s) found — add prose cross-links.`,
)
process.exit(1)

} // end isMain
