#!/usr/bin/env node
// scripts/article-parts-check.mjs
//
// Ship-time gate: flags catalog entity names found in article prose that are
// absent from the article's `mentionedParts` frontmatter.
//
// Prevents the 40+ iterate-drip fix pattern for missing mentionedParts by
// enforcing the constraint before a new article enters the corpus.
//
// Usage:
//   node scripts/article-parts-check.mjs <file.mdx> [<file.mdx>...]
//     Gate mode: exit 1 if any violations, exit 0 if clean
//
//   node scripts/article-parts-check.mjs --write
//     Scan mode: walks apps/web/src/content/articles/, appends AUDIT.md rows
//     for each article with violations. Exit 0 on completion, 1 on write error.
//
//   node scripts/article-parts-check.mjs --json [<file.mdx>...]
//     JSON output: { violations: [...] } — for programmatic use.
//     If no files given with --json, walks the full articles directory.
//
// Exit codes:
//   0 → clean (gate mode) or scan complete (--write / --json mode)
//   1 → violations found (gate mode) or error (any mode)

import { readFileSync, readdirSync, appendFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const ARTICLES_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'articles')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')
const DATA_DIR = join(REPO_ROOT, 'data')

const ENTITY_KINDS = ['switches', 'keycap-sets', 'boards']
const KIND_MAP = { switches: 'switch', 'keycap-sets': 'keycap-set', boards: 'board' }

// ── Catalog loading ───────────────────────────────────────────────────────────

function loadCatalog() {
  const catalog = []
  for (const folder of ENTITY_KINDS) {
    const dir = join(DATA_DIR, folder)
    let files
    try {
      files = readdirSync(dir).filter((f) => f.endsWith('.json'))
    } catch {
      continue
    }
    for (const file of files) {
      try {
        const raw = readFileSync(join(dir, file), 'utf8')
        const entity = JSON.parse(raw)
        if (entity.slug && entity.name) {
          catalog.push({
            slug: entity.slug,
            name: entity.name,
            kind: KIND_MAP[folder],
          })
        }
      } catch {
        // skip malformed records
      }
    }
  }
  // Sort by name length descending so longer names match before shorter prefixes
  catalog.sort((a, b) => b.name.length - a.name.length)
  return catalog
}

// ── Frontmatter / body extraction ────────────────────────────────────────────

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

// Returns the raw YAML frontmatter string (between the two --- fences).
function extractFrontmatterText(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return m ? m[1] : ''
}

// Parses mentionedParts from raw YAML frontmatter text.
// Returns Array<{ slug: string, kind: string }>.
function parseMentionedParts(frontmatterText) {
  const lines = frontmatterText.split('\n')
  const parts = []
  let inParts = false
  let currentPart = null

  for (const line of lines) {
    if (/^mentionedParts:/.test(line)) {
      inParts = true
      continue
    }
    if (inParts) {
      // A non-indented line that is a YAML key signals we left the block
      if (/^\w/.test(line)) {
        inParts = false
        if (currentPart && currentPart.slug && currentPart.kind) parts.push(currentPart)
        currentPart = null
        continue
      }
      // New list item
      if (/^\s+-/.test(line)) {
        if (currentPart && currentPart.slug && currentPart.kind) parts.push(currentPart)
        currentPart = {}
        continue
      }
      // Property within list item
      if (currentPart !== null) {
        const slugM = line.match(/^\s+slug:\s*(.+)/)
        const kindM = line.match(/^\s+kind:\s*(.+)/)
        if (slugM) currentPart.slug = slugM[1].trim()
        if (kindM) currentPart.kind = kindM[1].trim()
      }
    }
  }

  if (currentPart && currentPart.slug && currentPart.kind) parts.push(currentPart)
  return parts
}

// ── Violation detection ───────────────────────────────────────────────────────

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function checkFile(filePath, catalog) {
  const content = readFileSync(filePath, 'utf8')
  const { bodyLines, bodyStartLine } = extractBody(content)
  const frontmatterText = extractFrontmatterText(content)
  const mentionedParts = parseMentionedParts(frontmatterText)
  const slug = basename(filePath, '.mdx')
  const violations = []

  // Build a Set of "slug|kind" keys already declared in mentionedParts
  const declared = new Set(mentionedParts.map((p) => `${p.slug}|${p.kind}`))

  for (const entity of catalog) {
    const key = `${entity.slug}|${entity.kind}`
    if (declared.has(key)) continue

    const re = new RegExp(escapeRegex(entity.name), 'gi')

    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i]
      re.lastIndex = 0
      let m
      while ((m = re.exec(line)) !== null) {
        violations.push({
          file: filePath,
          slug,
          entitySlug: entity.slug,
          entityKind: entity.kind,
          entityName: entity.name,
          line: bodyStartLine + i,
          column: m.index + 1,
          context: line.trim().slice(0, 120),
        })
        // Only report first occurrence per entity per article to avoid noise
        break
      }
      if (violations.some((v) => v.slug === slug && v.entitySlug === entity.slug)) break
    }
  }

  return violations
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(slug, violations, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const count = violations.length
  const noun = count === 1 ? 'entity' : 'entities'

  const entityLines = violations
    .map(
      (v) =>
        `  - ${v.entityName} (${v.entityKind} \`${v.entitySlug}\`) — prose line ${v.line}`,
    )
    .join('\n')

  return `\n### [ ] [mentionedParts] [3.6] ${slug} — ${count} catalog ${noun} mentioned in prose but absent from mentionedParts
- category: mentionedParts
- filed: ${todayStr} by article-parts-check.mjs corpus scan
- impact: 4 (missing mentionedParts entries break the /part/[kind]/[slug] "mentioned in" rail)
- ease: 9 (frontmatter edit — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- file: apps/web/src/content/articles/${slug}.mdx
- entities:
${entityLines}
- action: add each entity to the article's mentionedParts frontmatter with the correct slug and kind\n`
}

// ── __test export (for scripts/__tests__/article-parts-check.test.mjs) ────────

export const __test = {
  loadCatalog,
  extractBody,
  extractFrontmatterText,
  parseMentionedParts,
  checkFile,
  escapeRegex,
}

// ── CLI entry (only runs when this file is invoked directly) ──────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Exported as a library — do nothing.
} else {

const args = process.argv.slice(2)
const doWrite = args.includes('--write')
const doJson = args.includes('--json')
const fileArgs = args.filter((a) => !a.startsWith('--') && a.endsWith('.mdx'))

let catalog
try {
  catalog = loadCatalog()
} catch (err) {
  console.error(`article-parts-check: failed to load entity catalog — ${err.message}`)
  process.exit(1)
}

if (catalog.length === 0) {
  console.error('article-parts-check: no entities found in data/ — check data/ directory')
  process.exit(1)
}

// Determine which files to scan
let filesToScan = []
if (doWrite || (doJson && fileArgs.length === 0)) {
  try {
    const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))
    filesToScan = files.map((f) => join(ARTICLES_DIR, f))
  } catch (err) {
    console.error(`article-parts-check: failed to read articles dir — ${err.message}`)
    process.exit(1)
  }
} else if (fileArgs.length > 0) {
  filesToScan = fileArgs
} else if (!doWrite && !doJson) {
  console.error('article-parts-check: no files specified and --write not set')
  console.error('Usage: article-parts-check.mjs <file.mdx> [...] | --write | --json')
  process.exit(1)
}

// Scan files
const allViolations = []
for (const filePath of filesToScan) {
  try {
    const violations = checkFile(filePath, catalog)
    allViolations.push(...violations)
  } catch (err) {
    console.error(`article-parts-check: failed to read ${filePath} — ${err.message}`)
    if (!doWrite) process.exit(1)
  }
}

// Output / action
if (doJson) {
  console.log(JSON.stringify({ violations: allViolations }, null, 2))
  process.exit(0)
}

if (doWrite) {
  const bySlug = new Map()
  for (const v of allViolations) {
    if (!bySlug.has(v.slug)) bySlug.set(v.slug, [])
    bySlug.get(v.slug).push(v)
  }

  if (bySlug.size === 0) {
    console.log('article-parts-check: corpus clean — no AUDIT rows filed.')
    process.exit(0)
  }

  const today = new Date()
  const rows = []
  for (const [slug, violations] of bySlug) {
    rows.push(formatAuditRow(slug, violations, today))
    console.log(
      `article-parts-check: ${violations.length} gap(s) in ${slug}.mdx — filing AUDIT row`,
    )
  }

  try {
    appendFileSync(AUDIT_MD, rows.join(''))
    console.log(`article-parts-check: filed ${bySlug.size} AUDIT row(s) → plan/AUDIT.md`)
  } catch (err) {
    console.error(`article-parts-check: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  process.exit(0)
}

// Gate mode: print violations and exit 1 if any found
if (allViolations.length === 0) {
  console.log('article-parts-check: clean — no violations found.')
  process.exit(0)
}

// Group by entity for cleaner output
const byEntity = new Map()
for (const v of allViolations) {
  const key = `${v.slug}:${v.entitySlug}`
  if (!byEntity.has(key)) byEntity.set(key, v)
}

for (const v of byEntity.values()) {
  const relFile = v.file.includes('/articles/') ? v.file.split('/articles/')[1] : basename(v.file)
  console.log(`VIOLATION [${v.entityKind}] ${relFile}:${v.line}:${v.column}`)
  console.log(`  entity:  "${v.entityName}" (slug: ${v.entitySlug})`)
  console.log(`  context: ${v.context}`)
  console.log(
    `  fix:     add { id: "${v.entitySlug}", kind: "${v.entityKind}", slug: "${v.entitySlug}" } to mentionedParts`,
  )
  console.log()
}

console.error(
  `article-parts-check: ${allViolations.length} violation(s) found — add missing entities to mentionedParts.`,
)
process.exit(1)

} // end isMain
