#!/usr/bin/env node
// scripts/article-language-check.mjs
//
// Mechanical linter for static-MDX temporal anti-patterns.
// Catches phrases that decay after publication — unfulfillable editorial
// promises, imprecise date claims, relative time references — at ship time,
// before they enter the corpus.
//
// Usage:
//   node scripts/article-language-check.mjs <file.mdx> [<file.mdx>...]
//     Gate mode: exit 1 if any violations, exit 0 if clean
//
//   node scripts/article-language-check.mjs --write
//     Scan mode: walks apps/web/src/content/articles/, appends AUDIT.md rows
//     for each article with violations. Exit 0 on completion, 1 on write error.
//
//   node scripts/article-language-check.mjs --json [<file.mdx>...]
//     JSON output: { violations: [...] } — for programmatic use
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
const PATTERNS_JSON = join(__dirname, 'article-language-patterns.json')

// ── Pattern loading ───────────────────────────────────────────────────────────

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function loadPatterns() {
  const raw = readFileSync(PATTERNS_JSON, 'utf8')
  const config = JSON.parse(raw)
  return config.patterns.map((p) => ({
    id: p.id,
    description: p.description,
    re: new RegExp(p.regex ? p.match : escapeRegex(p.match), 'gi'),
  }))
}

// ── Frontmatter extraction ────────────────────────────────────────────────────

// Returns body lines and the 1-based line number of the first body line.
function extractBody(content) {
  const rawLines = content.split('\n')
  if (rawLines[0] !== '---') {
    return { bodyLines: rawLines, bodyStartLine: 1 }
  }
  // Find the closing --- of frontmatter
  for (let i = 1; i < rawLines.length; i++) {
    if (rawLines[i] === '---') {
      return { bodyLines: rawLines.slice(i + 1), bodyStartLine: i + 2 }
    }
  }
  // No closing --- found — treat entire file as body
  return { bodyLines: rawLines, bodyStartLine: 1 }
}

// ── Violation detection ───────────────────────────────────────────────────────

function checkFile(filePath, patterns) {
  const content = readFileSync(filePath, 'utf8')
  const { bodyLines, bodyStartLine } = extractBody(content)
  const slug = basename(filePath, '.mdx')
  const violations = []

  for (let i = 0; i < bodyLines.length; i++) {
    const lineNum = bodyStartLine + i
    const line = bodyLines[i]

    for (const pattern of patterns) {
      // Reset lastIndex for stateful regex
      pattern.re.lastIndex = 0
      let m
      while ((m = pattern.re.exec(line)) !== null) {
        violations.push({
          file: filePath,
          slug,
          line: lineNum,
          column: m.index + 1,
          match: m[0],
          patternId: pattern.id,
          description: pattern.description,
          context: line.trim().slice(0, 120),
        })
      }
    }
  }

  return violations
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(slug, violations, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const count = violations.length
  const noun = count === 1 ? 'violation' : 'violations'
  const patternList = [...new Set(violations.map((v) => v.patternId))].join(', ')

  const violationLines = violations
    .map((v) => `  - line ${v.line}: \`${v.match}\` (${v.patternId})`)
    .join('\n')

  return `\n### [ ] [copy] [3.6] ${slug} — ${count} temporal anti-pattern ${noun} detected by article-language-check.mjs
- category: copy
- filed: ${todayStr} by article-language-check.mjs corpus scan
- impact: 4 (static MDX temporal phrase decays on every reader visit after publication)
- ease: 9 (phrase rewrite — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- patterns: ${patternList}
- file: apps/web/src/content/articles/${slug}.mdx
- violations:
${violationLines}
- action: rewrite each flagged phrase using absolute dates or past-tense phrasing; see pattern descriptions in scripts/article-language-patterns.json\n`
}

// ── __test export (for scripts/__tests__/article-language-check.test.mjs) ────

export const __test = {
  extractBody,
  checkFile,
  loadPatterns,
  escapeRegex,
}

// ── CLI entry (only runs when this file is invoked directly) ──────────────────

// Guard: skip CLI code when imported as a module during tests.
const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Exported as a library — do nothing.
} else {

const args = process.argv.slice(2)
const doWrite = args.includes('--write')
const doJson = args.includes('--json')
const fileArgs = args.filter((a) => !a.startsWith('--') && a.endsWith('.mdx'))

let patterns
try {
  patterns = loadPatterns()
} catch (err) {
  console.error(`article-language-check: failed to load patterns — ${err.message}`)
  process.exit(1)
}

// Determine which files to scan
let filesToScan = []
if (doWrite || (doJson && fileArgs.length === 0)) {
  // Scan mode: walk all articles
  try {
    const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))
    filesToScan = files.map((f) => join(ARTICLES_DIR, f))
  } catch (err) {
    console.error(`article-language-check: failed to read articles dir — ${err.message}`)
    process.exit(1)
  }
} else if (fileArgs.length > 0) {
  // Gate mode: specific files
  filesToScan = fileArgs
} else if (!doWrite && !doJson) {
  console.error('article-language-check: no files specified and --write not set')
  console.error('Usage: article-language-check.mjs <file.mdx> [...] | --write | --json')
  process.exit(1)
}

// Scan files
const allViolations = []
for (const filePath of filesToScan) {
  try {
    const violations = checkFile(filePath, patterns)
    allViolations.push(...violations)
  } catch (err) {
    console.error(`article-language-check: failed to read ${filePath} — ${err.message}`)
    if (!doWrite) process.exit(1)
  }
}

// Output / action
if (doJson) {
  console.log(JSON.stringify({ violations: allViolations }, null, 2))
  process.exit(0)
}

if (doWrite) {
  // Group by slug, one AUDIT row per article
  const bySlug = new Map()
  for (const v of allViolations) {
    if (!bySlug.has(v.slug)) bySlug.set(v.slug, [])
    bySlug.get(v.slug).push(v)
  }

  if (bySlug.size === 0) {
    console.log('article-language-check: corpus clean — no AUDIT rows filed.')
    process.exit(0)
  }

  const today = new Date()
  const rows = []
  for (const [slug, violations] of bySlug) {
    rows.push(formatAuditRow(slug, violations, today))
    console.log(
      `article-language-check: ${violations.length} violation(s) in ${slug}.mdx — filing AUDIT row`
    )
  }

  try {
    appendFileSync(AUDIT_MD, rows.join(''))
    console.log(
      `article-language-check: filed ${bySlug.size} AUDIT row(s) → plan/AUDIT.md`
    )
  } catch (err) {
    console.error(`article-language-check: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  process.exit(0)
}

// Gate mode: print violations and exit 1 if any found
if (allViolations.length === 0) {
  console.log('article-language-check: clean — no violations found.')
  process.exit(0)
}

for (const v of allViolations) {
  const relFile = v.file.includes('/articles/') ? v.file.split('/articles/')[1] : basename(v.file)
  console.log(`VIOLATION [${v.patternId}] ${relFile}:${v.line}:${v.column}`)
  console.log(`  match:   "${v.match}"`)
  console.log(`  context: ${v.context}`)
  console.log(`  fix:     ${v.description}`)
  console.log()
}

console.error(
  `article-language-check: ${allViolations.length} violation(s) found — fix before committing.`
)
process.exit(1)

} // end isMain
