#!/usr/bin/env node
// scripts/group-buy-article-staleness-check.mjs
//
// Cross-references a group-buy companion article's frontmatter `title`/`lede`
// and early body prose against the linked data/group-buys/*.json record's
// `status`, so a "the group buy is live" headline stops outliving the buy it
// describes.
//
// Six near-identical fix cycles (gmk-cyl-selene, gmk-cyl-masterpiece-r2,
// gmk-cyl-ramune, gmk-cyl-prussian-alert, divinikey-dcs-dolch,
// gmk-cyl-pandemonium) were a group-buy companion article whose frontmatter
// stayed present-tense after the linked record's status flipped to 'closed'.
// A seventh sub-shape hit the same article three times via a mid-body
// "Update — ..." callout rather than the frontmatter. This script mirrors
// the resolve-then-diff shape of group-buy-status-check.mjs and
// group-buy-companion-survey.mjs, and reuses the 'stale-buy-*' pattern
// family in article-language-patterns.json (shared with
// article-language-check.mjs, which is frontmatter-blind by construction).
//
// Phase 43 — Group-buy companion article staleness gate
//
// Usage:
//   node scripts/group-buy-article-staleness-check.mjs
//     Dry-run: prints flagged articles to stdout; exit 1 if any, 0 if clean.
//
//   node scripts/group-buy-article-staleness-check.mjs --write
//     Scan mode: appends plan/AUDIT.md rows for flagged articles.
//     Deduplicates: skips article slug + matched phrase already pending in
//     AUDIT.md. Exit 0.
//
//   node scripts/group-buy-article-staleness-check.mjs --json
//     JSON output: { "flagged": [...] }. Exit 0.
//
// Exit codes:
//   0 → clean (dry-run) or scan complete (--write/--json)
//   1 → stale companions found (dry-run) or error (any mode)

import { readFileSync, readdirSync, appendFileSync, existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const GROUP_BUYS_DIR = join(REPO_ROOT, 'data', 'group-buys')
const ARTICLES_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'articles')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')
const PATTERNS_JSON = join(__dirname, 'article-language-patterns.json')

// Statuses whose companion article is scanned. 'delayed' is deliberately
// excluded — bearings.md: "'delayed' ... active-but-late" — present-tense
// buy-window framing stays correct for a delayed-but-still-running buy.
const STALE_STATUSES = ['closed', 'cancelled']

// ── Record loading ────────────────────────────────────────────────────────────

function loadGroupBuys() {
  const files = readdirSync(GROUP_BUYS_DIR).filter((f) => f.endsWith('.json'))
  const records = []
  for (const file of files) {
    try {
      const raw = readFileSync(join(GROUP_BUYS_DIR, file), 'utf8')
      const data = JSON.parse(raw)
      records.push({ file, data })
    } catch {
      // skip unreadable / unparseable files
    }
  }
  return records
}

// Returns closed/cancelled records that have a companion article to check.
// A record with no relatedArticle is skipped — that gap belongs to
// group-buy-companion-survey.mjs (Rule 3), not this script.
function findStaleCompanions(records) {
  return records
    .filter(({ data }) => STALE_STATUSES.includes(data.status) && !!data.relatedArticle)
    .map(({ file, data }) => ({
      slug: data.slug || basename(file, '.json'),
      name: data.name || basename(file, '.json'),
      status: data.status,
      relatedArticle: data.relatedArticle,
      file: `data/group-buys/${file}`,
    }))
}

// ── Pattern loading ───────────────────────────────────────────────────────────

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// A "runs through <date>" pattern is deliberately NOT added to the shared
// article-language-patterns.json file: article-language-check.mjs loads
// every pattern in that file and applies it, status-blind, to every
// article's body — and its own test suite already asserts "The buy opened
// on 2026-05-15 and runs through 2026-06-20." (absolute dates) is the
// *desired fixed form*, not a violation. Only this script can tell a
// closed/cancelled companion's lingering "runs through <date>" framing
// apart from a live companion's correct use of the same phrasing, because
// only this script cross-references the linked group-buy record's status.
// So this pattern stays local, merged in after the shared 'stale-buy-*'
// family is loaded.
const LOCAL_PATTERNS = [
  {
    id: 'stale-buy-runs-through-date',
    description:
      "Present-tense 'runs through <date>' framing implies the buy window is still open. Once the linked group-buy record's status is closed/cancelled, rewrite as past tense: 'ran through YYYY-MM-DD' or 'closed on YYYY-MM-DD'.",
    re: /runs through (?:January|February|March|April|May|June|July|August|September|October|November|December|\d{4}-\d{2}-\d{2})/gi,
  },
]

// Reuses the 'stale-buy-*' present-tense buy-window pattern family already
// defined in article-language-patterns.json (shared with
// article-language-check.mjs) — filtered to that family only, since the rest
// of the pattern list (tracker/revisit/report-back anti-patterns) is not
// about group-buy buy-window framing — plus LOCAL_PATTERNS (see above).
function loadPatterns() {
  const raw = readFileSync(PATTERNS_JSON, 'utf8')
  const config = JSON.parse(raw)
  const shared = config.patterns
    .filter((p) => p.id.startsWith('stale-buy'))
    .map((p) => ({
      id: p.id,
      description: p.description,
      re: new RegExp(p.regex ? p.match : escapeRegex(p.match), 'gi'),
    }))
  return [...shared, ...LOCAL_PATTERNS]
}

// ── Frontmatter / body extraction ────────────────────────────────────────────
// Follows article-parts-check.mjs's extractFrontmatterText/body-split shape
// (not article-language-check.mjs's extractBody alone) because this script
// needs the frontmatter title/lede fields extractBody deliberately skips.

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

function extractFrontmatterText(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return m ? m[1] : ''
}

// Parses a single scalar frontmatter field (e.g. title, lede) from raw YAML
// frontmatter text. Handles the double- or single-quoted string shapes every
// article in the corpus uses for these fields; returns '' if the field is
// absent.
function parseFrontmatterField(frontmatterText, field) {
  const re = new RegExp(`^${field}:\\s*(.*)$`, 'm')
  const m = frontmatterText.match(re)
  if (!m) return ''
  let value = m[1].trim()
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1)
  }
  return value
}

// Splits body lines into paragraphs (text blocks separated by a blank line),
// skipping headings (#, ##, ...) and JSX/component blocks (a block whose
// first line opens with '<'), then returns the first `limit` surviving
// paragraphs. A mid-body "Update — ..." callout paragraph is just another
// paragraph in this scheme — if it lands within the first `limit` prose
// blocks it is scanned like any other.
function extractBodyParagraphs(bodyLines, limit) {
  const paragraphs = []
  let current = []

  const flush = () => {
    if (current.length === 0) return
    const firstLine = current[0].trim()
    const text = current.join(' ').trim()
    current = []
    if (!text) return
    if (/^#{1,6}\s/.test(firstLine)) return
    if (/^<[A-Za-z]/.test(firstLine)) return
    paragraphs.push(text)
  }

  for (const line of bodyLines) {
    if (line.trim() === '') {
      flush()
    } else {
      current.push(line)
    }
  }
  flush()

  return paragraphs.slice(0, limit)
}

// ── Violation detection ───────────────────────────────────────────────────────

const BODY_PARAGRAPH_LIMIT = 2

// Scans one companion article's frontmatter title/lede and first two body
// paragraphs for present-tense buy-window language. Returns
// { matches: [{ location, patternId, match }] }. Throws on missing/unreadable
// file — callers wrap this in try/catch (a parse miss or missing file logs
// and skips, never aborts the run).
function checkArticle(filePath, patterns) {
  const content = readFileSync(filePath, 'utf8')
  const frontmatterText = extractFrontmatterText(content)
  const { bodyLines } = extractBody(content)

  const title = parseFrontmatterField(frontmatterText, 'title')
  const lede = parseFrontmatterField(frontmatterText, 'lede')
  const paragraphs = extractBodyParagraphs(bodyLines, BODY_PARAGRAPH_LIMIT)

  const matches = []
  const scan = (text, location) => {
    if (!text) return
    for (const pattern of patterns) {
      pattern.re.lastIndex = 0
      const m = pattern.re.exec(text)
      if (m) {
        matches.push({ location, patternId: pattern.id, match: m[0] })
      }
    }
  }

  scan(title, 'title')
  scan(lede, 'lede')
  paragraphs.forEach((p, i) => scan(p, `body-paragraph-${i + 1}`))

  return { matches }
}

// Resolves every closed/cancelled companion article and scans it. A parse
// miss or missing article file logs and is skipped — never aborts the run.
function scanArticles(records, articlesDir, patterns) {
  const staleCompanions = findStaleCompanions(records)
  const flagged = []

  for (const record of staleCompanions) {
    const articlePath = join(articlesDir, `${record.relatedArticle}.mdx`)
    let result
    try {
      result = checkArticle(articlePath, patterns)
    } catch (err) {
      console.error(
        `group-buy-article-staleness-check: failed to read/scan ${record.relatedArticle}.mdx (${record.file}) — ${err.message}`,
      )
      continue
    }

    if (result.matches.length > 0) {
      flagged.push({
        groupBuySlug: record.slug,
        groupBuyFile: record.file,
        status: record.status,
        articleSlug: record.relatedArticle,
        matches: result.matches,
      })
    }
  }

  return flagged
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(flagged, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const phrases = [...new Set(flagged.matches.map((m) => m.match))]
  const phraseList = phrases.map((p) => `"${p}"`).join(', ')
  const matchLines = flagged.matches
    .map((m) => `  - ${m.location}: \`${m.match}\` (${m.patternId})`)
    .join('\n')

  return `\n### [ ] [content] [3.6] ${flagged.articleSlug} — present-tense buy-window language after group-buy ${flagged.status}
- category: content
- filed: ${todayStr} by group-buy-article-staleness-check.mjs
- impact: 4 (frontmatter title/lede feeding <title>, the OG image, and JSON-LD headline — or early body prose — still reads present-tense after the linked group-buy record's status flipped to ${flagged.status})
- ease: 9 (phrase rewrite to past tense or absolute dates — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- group-buy: ${flagged.groupBuyFile}
- article: apps/web/src/content/articles/${flagged.articleSlug}.mdx
- matches:
${matchLines}
- action: rewrite ${phraseList} in ${flagged.articleSlug}.mdx using past-tense phrasing or absolute dates, matching the group-buy record's ${flagged.status} status\n`
}

// ── Deduplication ─────────────────────────────────────────────────────────────

// Dedup convention mirrors article-parts-check.mjs: only a still-pending
// ([ ]) row counts as "already filed" for a slug, and — per this script's
// own spec — dedup is scoped to article slug + matched phrase, so a newly
// introduced phrase for an already-flagged article still files.
function alreadyFiled(auditContent, articleSlug, matchedPhrases) {
  const marker = `${articleSlug} — present-tense buy-window language`
  const lines = auditContent.split('\n')

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('### [ ]')) continue
    if (!lines[i].includes(marker)) continue

    let block = lines[i]
    for (let j = i + 1; j < lines.length && !lines[j].startsWith('### '); j++) {
      block += '\n' + lines[j]
    }

    if (matchedPhrases.some((phrase) => block.includes(`\`${phrase}\``))) {
      return true
    }
  }

  return false
}

// ── __test export (for scripts/__tests__/group-buy-article-staleness-check.test.mjs)

export const __test = {
  loadGroupBuys,
  findStaleCompanions,
  escapeRegex,
  loadPatterns,
  extractBody,
  extractFrontmatterText,
  parseFrontmatterField,
  extractBodyParagraphs,
  checkArticle,
  scanArticles,
  formatAuditRow,
  alreadyFiled,
}

// ── CLI entry (only runs when this file is invoked directly) ──────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Exported as a library — do nothing.
} else {

const args = process.argv.slice(2)
const doWrite = args.includes('--write')
const doJson = args.includes('--json')

let records
try {
  records = loadGroupBuys()
} catch (err) {
  console.error(`group-buy-article-staleness-check: failed to read group-buys — ${err.message}`)
  process.exit(1)
}

let patterns
try {
  patterns = loadPatterns()
} catch (err) {
  console.error(`group-buy-article-staleness-check: failed to load patterns — ${err.message}`)
  process.exit(1)
}

const flagged = scanArticles(records, ARTICLES_DIR, patterns)

// JSON mode
if (doJson) {
  console.log(JSON.stringify({ flagged }, null, 2))
  process.exit(0)
}

// Write mode
if (doWrite) {
  if (flagged.length === 0) {
    console.log(
      'group-buy-article-staleness-check: all closed/cancelled group-buy companion articles read clean — no AUDIT rows filed.',
    )
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

  for (const item of flagged) {
    const phrases = item.matches.map((m) => m.match)
    if (alreadyFiled(existingContent, item.articleSlug, phrases)) {
      skipped++
      continue
    }
    rows.push(formatAuditRow(item, today))
    console.log(
      `group-buy-article-staleness-check: ${item.articleSlug}.mdx reads present-tense against ${item.groupBuySlug} (${item.status}) — filing AUDIT row`,
    )
    filed++
  }

  if (filed === 0) {
    console.log(
      `group-buy-article-staleness-check: ${flagged.length} finding(s) already pending in AUDIT.md — no new rows filed.`,
    )
    process.exit(0)
  }

  try {
    appendFileSync(AUDIT_MD, rows.join(''))
    console.log(
      `group-buy-article-staleness-check: filed ${filed} AUDIT row(s)${skipped ? ` (${skipped} already pending)` : ''} → plan/AUDIT.md`,
    )
  } catch (err) {
    console.error(`group-buy-article-staleness-check: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  process.exit(0)
}

// Dry-run mode: print and exit 1 if any flagged
if (flagged.length === 0) {
  console.log(
    'group-buy-article-staleness-check: all closed/cancelled group-buy companion articles read clean.',
  )
  process.exit(0)
}

for (const item of flagged) {
  console.log(`STALE [score 3.6] ${item.articleSlug}.mdx (companion of ${item.groupBuySlug}, status=${item.status})`)
  console.log(`  group-buy: ${item.groupBuyFile}`)
  for (const m of item.matches) {
    console.log(`  match:     ${m.location}: "${m.match}" (${m.patternId})`)
  }
  console.log(`  fix:       rewrite the matched phrase(s) using past-tense phrasing or absolute dates`)
  console.log()
}

console.error(
  `group-buy-article-staleness-check: ${flagged.length} companion article(s) still read present-tense against a closed/cancelled group-buy record.`,
)
process.exit(1)

} // end isMain
