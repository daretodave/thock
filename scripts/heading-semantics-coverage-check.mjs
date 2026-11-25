#!/usr/bin/env node
// scripts/heading-semantics-coverage-check.mjs
//
// Gate script: detects list/card-rendering components whose item
// title/name is rendered as a styled span or link with no heading
// (h1-h6, or an H-prefixed wrapper component like <Heading as="h3">)
// ancestor — the exact defect shape that shipped four independent times
// (commits e72b4bfd/f7be550c, 7b810d80/bf940e4d, 67f898dc/941fefe9,
// 2597054a/188a66b4; see plan/12-heading-semantics-coverage-check.md) before
// anything mechanically caught it. A screen-reader user navigating by
// heading landmark finds far fewer headings than the page visually implies.
//
// Shape mirrors og-coverage-check.mjs — a pure detection layer that gates at
// ship time and files AUDIT.md rows when called via --write.
//
// Scope, mirroring truncation-call-site-check.mjs's receiver-name heuristic
// (a per-component regex/string scan, not a full TSX parser):
//   1. A curated list of known list/card-rendering files (seeded from the
//      four precedent fix commits) is always scanned in full.
//   2. Every other *.tsx file under apps/web/src/components/** (excluding
//      __tests__) is scanned too, but only counts as a candidate when it
//      maps over an array AND the title/name/heading expression is the
//      first JSX child rendered after that map's callback opens — the same
//      "first text node of the mapped item" condition the spec's Design
//      section uses to avoid sweeping in tag chips, nav links, <select>
//      options, and citation/reference rails that happen to reuse the same
//      field names for non-identity text.
//
// Trigger field names are `title`, `name`, `heading` — deliberately NOT
// `label` from the spec's "title/name/label" list: this corpus's own two
// curated compare-table files (SwitchCompareTable.tsx / BoardCompareTable.tsx)
// render a `label` field for each spec row (e.g. "Layout", "Mount style"),
// which is correctly inside a <dt>, not a heading — including it produced a
// false positive against already-correct code. `heading` is added because
// apps/web/src/app/parts/page.tsx and tools/page.tsx use that exact field
// name for their card identity text.
//
// Usage:
//   node scripts/heading-semantics-coverage-check.mjs
//     Gate mode: exit 1 if any flagged title/name renders, printing every
//     file + expression + prop name.
//
//   node scripts/heading-semantics-coverage-check.mjs --write
//     Scan the curated list + sibling components; append a11y AUDIT.md rows
//     for each flagged hit. Deduplicates by file:line + expression.
//
//   node scripts/heading-semantics-coverage-check.mjs --json
//     JSON output: { flagged: [...] } — for programmatic use.
//
// Exit codes:
//   0 → no flagged renders (gate mode) or scan complete (--write/--json)
//   1 → flagged renders found (gate mode) or error (any mode)

import { existsSync, readdirSync, readFileSync, appendFileSync } from 'node:fs'
import { join, relative, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')
const COMPONENTS_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'components')

// Curated list of known list/card-rendering files, seeded from the four
// precedent fix commits (plan/12-heading-semantics-coverage-check.md's
// Design section). Scanned in full — unlike the sibling sweep below, no
// "first JSX child after a .map()" gate is applied, since the curated set
// was hand-picked specifically because it renders one item's identity text
// per card/row (including the two compare tables, whose `switchA`/`switchB`
// props aren't array elements at all, so the sibling sweep's map-based
// heuristic wouldn't reach them).
const CURATED_FILES = [
  'apps/web/src/components/vendor/VendorCard.tsx',
  'apps/web/src/components/vendor/VendorBoardSection.tsx',
  'apps/web/src/components/vendor/VendorSwitchSection.tsx',
  'apps/web/src/components/vendor/VendorKeycapSetSection.tsx',
  'apps/web/src/app/parts/page.tsx',
  'apps/web/src/app/tools/page.tsx',
  'apps/web/src/app/archive/page.tsx',
  'apps/web/src/app/part/[kind]/page.tsx',
  'apps/web/src/components/quiz/ResultCard.tsx',
  'apps/web/src/components/quiz/BoardResultCard.tsx',
  'apps/web/src/components/quiz/KeycapSetResultCard.tsx',
  'apps/web/src/components/compare/SwitchCompareTable.tsx',
  'apps/web/src/components/compare/BoardCompareTable.tsx',
]

const CURATED_SET = new Set(CURATED_FILES)

// Field names treated as a list/card item's identity text. See the
// file-header note above for why `label` is deliberately excluded and
// `heading` deliberately included.
const TITLE_FIELDS = new Set(['title', 'name', 'heading'])

const EXCLUDED_DIR_NAMES = new Set(['__tests__', 'node_modules'])

// JSX ancestor tag names that never count as a heading, even though a
// mapped-item's title is plausibly rendered inside them before reaching a
// real heading further out (e.g. <select>/<option> dropdown text is never
// a "list/card title missing a heading" defect — it's a native form
// control, not visually a card).
const NON_HEADING_FORM_TAGS = new Set(['select', 'option'])

// ── JSX tag tokenizer ─────────────────────────────────────────────────────────
//
// Not a full TSX parser (per the spec's explicitly-accepted tradeoff) — a
// lazy regex over raw text. Matches `<Name ...>`, `<Name ... />`, and
// `</Name>`. Known limitation: an attribute value containing a literal `>`
// before the tag's real close (e.g. an inline arrow-function handler written
// directly inside a JSX tag's attribute list) would terminate the match
// early. None of the curated files or the current apps/web/src/components
// corpus do this today (arrow functions here always appear as JSX
// *children*, e.g. `{items.map((x) => (...))}`, never inside a tag's own
// attribute span) — same accepted-false-negative-on-unusual-code shape
// truncation-call-site-check.mjs's own CALL_RE documents for itself.
const TAG_RE = /<(\/)?([A-Za-z][\w.]*)[^<>]*?(\/)?>/g

/**
 * Replays every JSX tag from the start of `content` up to (not including)
 * `index`, maintaining a stack of currently-open tag names, and returns
 * that stack. The last element is the nearest enclosing tag.
 */
function ancestorStackAt(content, index) {
  const stack = []
  const re = new RegExp(TAG_RE.source, 'g')
  let m
  while ((m = re.exec(content)) !== null) {
    if (m.index >= index) break
    const [full, closing, name] = m
    const selfClosing = full.trim().endsWith('/>')
    if (closing) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i] === name) {
          stack.length = i
          break
        }
      }
    } else if (!selfClosing) {
      stack.push(name)
    }
  }
  return stack
}

/**
 * A heading-ish ancestor is a literal h1-h6 tag, or a component whose name
 * starts with an uppercase `H` (e.g. `<Heading as="h3">`) — per the spec's
 * "component-name heuristic".
 */
function hasHeadingAncestor(stack) {
  return stack.some((tag) => /^h[1-6]$/.test(tag) || tag.startsWith('H'))
}

function hasFormFieldAncestor(stack) {
  return stack.some((tag) => NON_HEADING_FORM_TAGS.has(tag.toLowerCase()))
}

// ── Candidate-expression scanning ─────────────────────────────────────────────

// Matches a JSX child position (preceded by a tag's `>`) whose entire curly-
// brace content is a bare or dotted identifier chain, e.g. `{vendor.name}`,
// `{part.record.name}`, `{title}`. Deliberately excludes attribute
// positions (`name={tag.name}`, `key={row.name}`) by requiring the `{` be
// preceded by `>` (ignoring whitespace) rather than `=`.
const CHILD_EXPR_RE = />\s*\{\s*([A-Za-z_$][\w$]*(?:\s*\.\s*[A-Za-z_$][\w$]*)*)\s*\}/g

// Matches any JSX child expression position at all (not restricted to
// dotted-identifier content) — used only to test whether some *other*
// expression renders before a candidate title/name/heading expression
// within the same mapped item, i.e. the "first text node of the mapped
// item" condition from the spec's Design section.
const ANY_CHILD_EXPR_OPEN_RE = />\s*\{/g

const MAP_CALL_RE = /\.(?:map|flatMap)\(/g

function lineOf(content, index) {
  return content.slice(0, index).split('\n').length
}

/**
 * Finds every `{<dotted.chain>}` JSX-child expression in `content` whose
 * final segment is a title/name/heading field. Returns
 * { expr, propName, index, line } per match.
 */
function findTitleExpressions(content) {
  const hits = []
  const re = new RegExp(CHILD_EXPR_RE.source, 'g')
  let m
  while ((m = re.exec(content)) !== null) {
    const expr = m[1].replace(/\s+/g, '')
    const segments = expr.split('.')
    const propName = segments[segments.length - 1]
    if (!TITLE_FIELDS.has(propName)) continue
    // The match index points at the opening `>` of the preceding tag;
    // the expression itself starts at the `{`.
    const braceIndex = m.index + m[0].indexOf('{')
    hits.push({ expr, propName, index: braceIndex, line: lineOf(content, braceIndex) })
  }
  return hits
}

/**
 * Curated-file scan: group all title/name/heading expression occurrences by
 * their exact dotted-chain text, and flag a group only if *none* of its
 * occurrences has a heading ancestor. Grouping (rather than flagging each
 * occurrence independently) avoids false positives from legitimate
 * secondary renders of the same identity expression — e.g.
 * SwitchCompareTable.tsx repeats `{switchA.name}` a second time inside a
 * `sr-only` span for accessible row labelling; the *first* occurrence is
 * correctly inside an `<h2>`, so the group is covered even though the
 * second occurrence alone has no heading ancestor.
 */
function scanCuratedContent(relPath, content) {
  const hits = findTitleExpressions(content)
  const byExpr = new Map()
  for (const hit of hits) {
    const list = byExpr.get(hit.expr) ?? []
    list.push(hit)
    byExpr.set(hit.expr, list)
  }

  const flagged = []
  for (const [expr, occurrences] of byExpr) {
    const covered = occurrences.some((o) => hasHeadingAncestor(ancestorStackAt(content, o.index)))
    if (!covered) {
      const first = occurrences[0]
      flagged.push({ file: relPath, expr, propName: first.propName, line: first.line })
    }
  }
  return flagged
}

/**
 * Sibling-component scan: only treats a title/name/heading expression as a
 * candidate when (a) it's reached inside some `.map()`/`.flatMap()`
 * callback, (b) no other JSX child expression renders before it within that
 * same mapped item (the "first text node" condition), and (c) its ancestor
 * chain doesn't pass through a `<select>`/`<option>`. Flags it if it then
 * also lacks a heading ancestor.
 */
function scanSiblingContent(relPath, content) {
  const hits = findTitleExpressions(content)
  if (hits.length === 0) return []

  const mapOpens = []
  {
    const re = new RegExp(MAP_CALL_RE.source, 'g')
    let m
    while ((m = re.exec(content)) !== null) mapOpens.push(m.index)
  }
  if (mapOpens.length === 0) return []

  // Recorded at the `{` position (not the match's `>` start) so it's
  // directly comparable to `hit.index`, which findTitleExpressions also
  // anchors at `{`. Anchoring these two arrays at different characters
  // previously made every hit appear to be "preceded by itself".
  const childOpens = []
  {
    const re = new RegExp(ANY_CHILD_EXPR_OPEN_RE.source, 'g')
    let m
    while ((m = re.exec(content)) !== null) {
      childOpens.push(m.index + m[0].indexOf('{'))
    }
  }

  const flagged = []
  const seenExprs = new Set()
  for (const hit of hits) {
    // Nearest preceding .map()/.flatMap() — the hit must belong to a mapped
    // callback, not just share a file with an unrelated map elsewhere.
    let nearestMapOpen = -1
    for (const idx of mapOpens) {
      if (idx < hit.index && idx > nearestMapOpen) nearestMapOpen = idx
    }
    if (nearestMapOpen === -1) continue

    // Any other JSX child expression rendered between the map's opening and
    // this hit means this hit is not the first text node of the mapped item.
    const earlierSibling = childOpens.some((idx) => idx > nearestMapOpen && idx < hit.index)
    if (earlierSibling) continue

    const stack = ancestorStackAt(content, hit.index)
    if (hasFormFieldAncestor(stack)) continue
    if (hasHeadingAncestor(stack)) continue

    // Dedup within the file: the same expression text (e.g. a second
    // mapped item rendering `{board.name}` at a different position) only
    // needs one flagged row.
    if (seenExprs.has(hit.expr)) continue
    seenExprs.add(hit.expr)

    flagged.push({ file: relPath, expr: hit.expr, propName: hit.propName, line: hit.line })
  }
  return flagged
}

// ── File enumeration ──────────────────────────────────────────────────────────

function toRelPath(filePath) {
  return relative(REPO_ROOT, filePath).replace(/\\/g, '/')
}

function isScannableComponentFile(filePath) {
  if (extname(filePath) !== '.tsx') return false
  const base = filePath.slice(0, -'.tsx'.length)
  if (base.endsWith('.test')) return false
  return true
}

/**
 * Recursively collect *.tsx files under apps/web/src/components, excluding
 * __tests__/node_modules directories, *.test.tsx files, and anything
 * already in the curated list.
 */
function collectSiblingComponentFiles() {
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
        if (!isScannableComponentFile(full)) continue
        const relPath = toRelPath(full)
        if (CURATED_SET.has(relPath)) continue
        results.push(full)
      }
    }
  }
  if (existsSync(COMPONENTS_DIR)) walk(COMPONENTS_DIR)
  return results
}

/**
 * Scan the curated list + every sibling component under
 * apps/web/src/components/** and return all flagged hits. Thin
 * disk-touching wrapper around the pure scan functions above.
 */
function scanAll() {
  const flagged = []

  for (const relPath of CURATED_FILES) {
    const absPath = join(REPO_ROOT, relPath)
    let content
    try {
      content = readFileSync(absPath, 'utf8')
    } catch {
      continue // file moved/renamed — not this script's concern to error on
    }
    flagged.push(...scanCuratedContent(relPath, content))
  }

  for (const absPath of collectSiblingComponentFiles()) {
    const relPath = toRelPath(absPath)
    const content = readFileSync(absPath, 'utf8')
    flagged.push(...scanSiblingContent(relPath, content))
  }

  return flagged
}

// ── Deduplication ─────────────────────────────────────────────────────────────

/**
 * Returns true if AUDIT.md already has a pending (unchecked) a11y row for
 * the given file:line + expression, filed by this script.
 */
function alreadyFiled(auditContent, marker) {
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

function markerFor(hit) {
  return `heading-semantics-coverage-check.mjs — ${hit.file}:${hit.line} — ${hit.expr}`
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(hit, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const fileLine = `${hit.file}:${hit.line}`
  return `
### [ ] [a11y] [4.9] \`${fileLine}\` \`{${hit.expr}}\` renders with no heading ancestor — screen-reader heading navigation skips this item's title
- category: a11y
- filed: ${todayStr} by heading-semantics-coverage-check.mjs — ${fileLine} — ${hit.expr}
- impact: 7 (a screen-reader user navigating by heading landmark finds fewer headings than the page visually implies — the same defect shape fixed four independent times per plan/12-heading-semantics-coverage-check.md)
- ease: 7 (wrap \`{${hit.expr}}\`'s rendering in an \`h2\`/\`h3\` tag, or a \`<Heading as="hN">\`-style wrapper — the same pattern all four precedent fixes already used)
- score: 4.9 (impact × ease / 10)
- evidence: \`${fileLine}\` — \`{${hit.expr}}\` has no h1–h6 (or H-prefixed component) ancestor
- action: wrap \`{${hit.expr}}\`'s rendered text in a heading tag so the item's title participates in the document's heading outline
`
}

// ── __test export ─────────────────────────────────────────────────────────────

export const __test = {
  ancestorStackAt,
  hasHeadingAncestor,
  hasFormFieldAncestor,
  findTitleExpressions,
  scanCuratedContent,
  scanSiblingContent,
  toRelPath,
  alreadyFiled,
  markerFor,
  formatAuditRow,
  CURATED_FILES,
  TITLE_FIELDS,
}

// ── CLI entry (only runs when this file is invoked directly) ──────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Imported as library — do nothing.
} else {
  const args = process.argv.slice(2)
  const doWrite = args.includes('--write')
  const doJson = args.includes('--json')

  const flagged = scanAll()

  if (doJson) {
    console.log(JSON.stringify({ flagged }, null, 2))
    process.exit(0)
  }

  if (flagged.length === 0) {
    if (!doWrite) {
      console.log(
        'heading-semantics-coverage-check: no flagged renders — every checked item title has a heading ancestor.',
      )
    } else {
      console.log('heading-semantics-coverage-check: no flagged renders — no AUDIT rows filed.')
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
      console.error(`heading-semantics-coverage-check: failed to read plan/AUDIT.md — ${err.message}`)
      process.exit(1)
    }

    const today = new Date()
    const rows = []
    let filed = 0
    for (const hit of flagged) {
      const marker = markerFor(hit)
      const fileLine = `${hit.file}:${hit.line}`
      if (alreadyFiled(auditContent, marker)) {
        console.log(`heading-semantics-coverage-check: ${fileLine} — {${hit.expr}} already pending in AUDIT.md — skipped`)
        continue
      }
      rows.push(formatAuditRow(hit, today))
      console.log(`heading-semantics-coverage-check: ${fileLine} — {${hit.expr}} flagged — filing AUDIT row`)
      filed++
    }

    if (rows.length > 0) {
      try {
        appendFileSync(AUDIT_MD, rows.join(''))
        console.log(`heading-semantics-coverage-check: filed ${filed} AUDIT row(s) → plan/AUDIT.md`)
      } catch (err) {
        console.error(`heading-semantics-coverage-check: failed to write plan/AUDIT.md — ${err.message}`)
        process.exit(1)
      }
    }

    process.exit(0)
  }

  // Gate mode: print hits and exit 1
  for (const hit of flagged) {
    console.error(`MISSING HEADING: ${hit.file}:${hit.line} — {${hit.expr}} has no h1-h6 (or H-prefixed component) ancestor`)
  }
  console.error(
    `heading-semantics-coverage-check: ${flagged.length} flagged render(s) with no heading ancestor — wrap the title/name text in a heading tag before shipping.`,
  )
  process.exit(1)
}
