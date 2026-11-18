#!/usr/bin/env node
// scripts/truncation-call-site-check.mjs
//
// Gate script: detects user-facing display-text truncation call sites that
// bypass the two vetted boundary-aware helpers (apps/web/src/lib/truncate.ts's
// truncate() and packages/seo/src/buildMetadata.ts's truncateForMeta()).
//
// Five independent hard-cut-mid-word truncation defects shipped in one ~24h
// digest window (see plan/09-truncation-boundary-mechanical-survey.md) before
// anything mechanically caught the pattern. This is the mechanical net: a
// grep gate that flags a raw `.slice(0, N)` / `.substring(0, N)` call on a
// display-text-named receiver (description, title, summary, ...) anywhere
// outside the two vetted helpers.
//
// Shape mirrors og-coverage-check.mjs — a pure detection layer that gates at
// ship time and files AUDIT.md rows when called via --write.
//
// Usage:
//   node scripts/truncation-call-site-check.mjs
//     Gate mode: exit 1 if any flagged call sites, printing every file:line.
//
//   node scripts/truncation-call-site-check.mjs --write
//     Scan apps/web/src and packages/*/src; append engineering AUDIT.md rows
//     for each flagged call site. Deduplicates by file:line.
//
//   node scripts/truncation-call-site-check.mjs --json
//     JSON output: { hits: [...] } — for programmatic use.
//
// Exit codes:
//   0 → no flagged call sites (gate mode) or scan complete (--write/--json)
//   1 → flagged call sites found (gate mode) or error (any mode)

import { existsSync, readdirSync, readFileSync, appendFileSync } from 'node:fs'
import { join, relative, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

// Property/variable names that mark a `.slice(0, N)` / `.substring(0, N)`
// receiver as likely user-facing display text, not array pagination or an
// ISO-date-prefix extraction (the bulk of today's ~35 real .slice(0, N)
// call sites). Same list article-language-check.mjs / og-coverage-check.mjs
// style scripts use for their own narrowing — a name-pattern heuristic, not
// type-flow analysis.
const DISPLAY_IDENTIFIERS = new Set([
  'description',
  'summary',
  'title',
  'lede',
  'excerpt',
  'text',
  'body',
  'headline',
  'name',
])

// The two vetted, already boundary-aware truncation implementations. Any
// slicing inside these files is the helpers' own internal logic, not a call
// site bypassing them — never flagged regardless of identifier name.
const VETTED_HELPER_PATHS = new Set([
  'apps/web/src/lib/truncate.ts',
  'packages/seo/src/buildMetadata.ts',
])

// Directories excluded from the scan entirely.
const EXCLUDED_DIR_NAMES = new Set(['__tests__', 'node_modules'])

const SCAN_EXTENSIONS = new Set(['.ts', '.tsx'])

// ── File enumeration ──────────────────────────────────────────────────────────

/**
 * Root source directories to scan: apps/web/src and every packages sub-dir's src.
 */
function findScanRoots() {
  const roots = []
  const appsWebSrc = join(REPO_ROOT, 'apps', 'web', 'src')
  if (existsSync(appsWebSrc)) roots.push(appsWebSrc)

  const packagesDir = join(REPO_ROOT, 'packages')
  let packageNames = []
  try {
    packageNames = readdirSync(packagesDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  } catch {
    packageNames = []
  }
  for (const name of packageNames) {
    const src = join(packagesDir, name, 'src')
    if (existsSync(src)) roots.push(src)
  }
  return roots
}

function isScannableFile(filePath) {
  if (!SCAN_EXTENSIONS.has(extname(filePath))) return false
  const base = filePath.slice(0, -extname(filePath).length)
  if (base.endsWith('.test')) return false
  return true
}

/**
 * Recursively collect scannable file paths under the given root directories,
 * excluding __tests__ / node_modules directories and *.test.ts(x) files.
 */
function collectFiles(roots) {
  const results = []
  function walk(dir) {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (EXCLUDED_DIR_NAMES.has(e.name)) continue
        walk(join(dir, e.name))
      } else if (e.isFile()) {
        const full = join(dir, e.name)
        if (isScannableFile(full)) results.push(full)
      }
    }
  }
  for (const root of roots) walk(root)
  return results
}

// ── Detection ─────────────────────────────────────────────────────────────────

// Matches `<identifier>.slice(0, <integer>)` or `<identifier>.substring(0,
// <integer>)`, allowing whitespace/newlines around the dot and inside the
// argument list (so a receiver split across lines, e.g.
//   description
//     .slice(0, 160)
// is still caught). The length argument is restricted to a bare non-negative
// integer literal — this is a mechanical grep gate narrowing on the literal
// `.slice(0, <number>)` shape the spec describes, not a general expression
// parser; a call like `description.slice(0, someVar)` is a false negative by
// design (same acceptable-false-negative tradeoff the identifier-name
// heuristic itself makes).
const CALL_RE = /([A-Za-z_$][\w$]*)\s*\.\s*(slice|substring)\(\s*0\s*,\s*(\d+)\s*\)/g

/**
 * Returns the relative-to-repo-root path with forward slashes, for stable
 * comparison against VETTED_HELPER_PATHS and for display.
 */
function toRelPath(filePath) {
  return relative(REPO_ROOT, filePath).replace(/\\/g, '/')
}

function isVettedHelperPath(relPath) {
  return VETTED_HELPER_PATHS.has(relPath)
}

/**
 * Scan one file's content for flagged truncation call sites. Pure function —
 * takes content and a relative path (for the vetted-helper check and for
 * labelling), does not touch disk.
 */
function scanContent(content, relPath) {
  if (isVettedHelperPath(relPath)) return []

  const hits = []
  let match
  CALL_RE.lastIndex = 0
  while ((match = CALL_RE.exec(content)) !== null) {
    const [full, identifier, method] = match
    if (!DISPLAY_IDENTIFIERS.has(identifier)) continue

    // Not immediately .length-compared or array-indexed after the call —
    // that marks it as non-text slicing (e.g. measuring/re-indexing a
    // slice result) rather than producing display text directly.
    const after = content.slice(match.index + full.length)
    const trimmedAfter = after.replace(/^\s+/, '')
    if (trimmedAfter.startsWith('.length') || trimmedAfter.startsWith('[')) continue

    const line = content.slice(0, match.index).split('\n').length
    hits.push({
      file: relPath,
      line,
      identifier,
      method,
      snippet: full.trim(),
    })
  }
  return hits
}

/**
 * Scan a list of { path, content } file entries (absolute path + source
 * text) and return every flagged hit across all of them. Pure — no disk
 * access — so tests can pass fixture content directly.
 */
function findHits(fileEntries) {
  const hits = []
  for (const { path, content } of fileEntries) {
    const relPath = toRelPath(path)
    hits.push(...scanContent(content, relPath))
  }
  return hits
}

/**
 * Read every file under the given root directories from disk and return
 * their flagged hits. Thin disk-touching wrapper around collectFiles +
 * findHits.
 */
function scanRoots(roots) {
  const files = collectFiles(roots)
  const entries = files.map((path) => ({ path, content: readFileSync(path, 'utf8') }))
  return findHits(entries)
}

// ── Deduplication ─────────────────────────────────────────────────────────────

/**
 * Returns true if AUDIT.md already has a pending (unchecked) engineering
 * row for the given file:line, filed by this script.
 */
function alreadyFiled(auditContent, fileLine) {
  const marker = `truncation-call-site-check.mjs — ${fileLine}`
  const lines = auditContent.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(marker)) {
      for (let j = i; j >= 0; j--) {
        if (lines[j].startsWith('### ')) {
          return lines[j].startsWith('### [ ]')
        }
      }
    }
  }
  return false
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(hit, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const fileLine = `${hit.file}:${hit.line}`
  return `
### [ ] [engineering] [4.2] \`${fileLine}\` raw \`.${hit.method}(0, ${hit.snippet.match(/,\s*(\d+)/)?.[1] ?? 'N'})\` on \`${hit.identifier}\` bypasses the vetted truncation helper
- category: engineering
- filed: ${todayStr} by truncation-call-site-check.mjs — ${fileLine}
- impact: 6 (hard-cut-mid-word risk on user-facing display text — the exact defect class that shipped 5 times in plan/09-truncation-boundary-mechanical-survey.md's digest window)
- ease: 7 (swap the raw call for apps/web/src/lib/truncate.ts's \`truncate()\` or packages/seo/src/buildMetadata.ts's \`truncateForMeta()\`)
- score: 4.2 (impact × ease / 10)
- evidence: \`${fileLine}\` — \`${hit.snippet}\`
- action: route \`${hit.identifier}\` through the vetted \`truncate()\`/\`truncateForMeta()\` helper instead of a raw \`.${hit.method}()\` call
`
}

// ── __test export ─────────────────────────────────────────────────────────────

export const __test = {
  scanContent,
  findHits,
  toRelPath,
  isVettedHelperPath,
  alreadyFiled,
  formatAuditRow,
  isScannableFile,
  DISPLAY_IDENTIFIERS,
  VETTED_HELPER_PATHS,
}

// ── CLI entry (only runs when this file is invoked directly) ──────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Imported as library — do nothing.
} else {
  const args = process.argv.slice(2)
  const doWrite = args.includes('--write')
  const doJson = args.includes('--json')

  const roots = findScanRoots()
  const hits = scanRoots(roots)

  if (doJson) {
    console.log(JSON.stringify({ hits }, null, 2))
    process.exit(0)
  }

  if (hits.length === 0) {
    if (!doWrite) {
      console.log('truncation-call-site-check: no flagged call sites — all display-text truncation routes through the vetted helpers.')
    } else {
      console.log('truncation-call-site-check: no flagged call sites — no AUDIT rows filed.')
    }
    process.exit(0)
  }

  if (doWrite) {
    let auditContent = ''
    try {
      if (existsSync(AUDIT_MD)) {
        auditContent = readFileSync(AUDIT_MD, 'utf8')
      }
    } catch (err) {
      console.error(`truncation-call-site-check: failed to read plan/AUDIT.md — ${err.message}`)
      process.exit(1)
    }

    const today = new Date()
    const rows = []
    let filed = 0
    for (const hit of hits) {
      const fileLine = `${hit.file}:${hit.line}`
      if (alreadyFiled(auditContent, fileLine)) {
        console.log(`truncation-call-site-check: ${fileLine} already pending in AUDIT.md — skipped`)
        continue
      }
      rows.push(formatAuditRow(hit, today))
      console.log(`truncation-call-site-check: ${fileLine} flagged — filing AUDIT row`)
      filed++
    }

    if (rows.length > 0) {
      try {
        appendFileSync(AUDIT_MD, rows.join(''))
        console.log(`truncation-call-site-check: filed ${filed} AUDIT row(s) → plan/AUDIT.md`)
      } catch (err) {
        console.error(`truncation-call-site-check: failed to write plan/AUDIT.md — ${err.message}`)
        process.exit(1)
      }
    }

    process.exit(0)
  }

  // Gate mode: print hits and exit 1
  for (const hit of hits) {
    console.error(`TRUNCATION BYPASS: ${hit.file}:${hit.line} — \`${hit.snippet}\` on \`${hit.identifier}\``)
  }
  console.error(
    `truncation-call-site-check: ${hits.length} flagged call site(s) bypassing the vetted truncation helpers — route through apps/web/src/lib/truncate.ts's truncate() or packages/seo/src/buildMetadata.ts's truncateForMeta() before shipping.`,
  )
  process.exit(1)
}
