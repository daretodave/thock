#!/usr/bin/env node
// scripts/og-coverage-check.mjs
//
// Gate script: detects Next.js App Router routes in apps/web/src/app that
// contain a page.tsx but no sibling opengraph-image.tsx. Prevents the class
// of "route ships without OG handler" that consumed ~28 iterate ticks across
// expand passes 127–134 (14 seo: commits, same mechanical pattern each time).
//
// Shape mirrors article-parts-check.mjs (phase 38) — a pure detection layer
// that gates at ship time and files AUDIT.md rows when called via --write.
//
// Usage:
//   node scripts/og-coverage-check.mjs [<routeDir> ...]
//     Gate mode: exit 1 if any listed route directories lack opengraph-image.tsx.
//
//   node scripts/og-coverage-check.mjs --write
//     Scan all routes; append seo AUDIT.md rows for gaps. Deduplicates.
//
//   node scripts/og-coverage-check.mjs --json
//     JSON output: { gaps: [...] } — for programmatic use.
//
// Exit codes:
//   0 → all routes covered (gate/scan mode) or scan complete (--write/--json)
//   1 → gaps found (gate mode) or error (any mode)

import { existsSync, readdirSync, readFileSync, appendFileSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const APP_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'app')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

// Directories inside app/ that are not page-route directories and do not
// need opengraph-image.tsx handlers.
const EXCLUDED_SEGMENTS = new Set(['api', '_components', '_lib', '_hooks'])

// ── Route enumeration ─────────────────────────────────────────────────────────

/**
 * Recursively collect directories under appDir that contain a page.tsx file.
 * Returns absolute directory paths.
 */
function findPageRouteDirs(appDir) {
  const results = []
  function walk(dir) {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    const hasPage = entries.some((e) => e.isFile() && e.name === 'page.tsx')
    if (hasPage) results.push(dir)
    for (const e of entries) {
      if (e.isDirectory() && !EXCLUDED_SEGMENTS.has(e.name)) {
        walk(join(dir, e.name))
      }
    }
  }
  walk(appDir)
  return results
}

// ── Gap detection ─────────────────────────────────────────────────────────────

/**
 * Given a list of route directories (absolute paths), return those that
 * lack a sibling opengraph-image.tsx file.
 *
 * Pure function — does not read filesystem. Pass pre-enumerated sets for
 * testing without touching disk.
 */
function findGaps(routeDirs, ogDirs) {
  const ogSet = new Set(ogDirs)
  return routeDirs.filter((dir) => !ogSet.has(dir))
}

/**
 * Collect the set of directories that already have an opengraph-image.tsx.
 */
function findOgDirs(appDir) {
  const results = []
  function walk(dir) {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    const hasOg = entries.some((e) => e.isFile() && e.name === 'opengraph-image.tsx')
    if (hasOg) results.push(dir)
    for (const e of entries) {
      if (e.isDirectory() && !EXCLUDED_SEGMENTS.has(e.name)) {
        walk(join(dir, e.name))
      }
    }
  }
  walk(appDir)
  return results
}

// ── Route labelling ───────────────────────────────────────────────────────────

/**
 * Convert an absolute route directory path to a human-readable route label.
 * e.g. /…/apps/web/src/app/about → /about
 *      /…/apps/web/src/app → / (root)
 */
function toRouteLabel(routeDir, appDir) {
  const rel = relative(appDir, routeDir)
  return rel === '' ? '/' : `/${rel}`
}

// ── Deduplication ─────────────────────────────────────────────────────────────

/**
 * Returns true if AUDIT.md already has a pending (unchecked) seo row for
 * the given route label filed by og-coverage-check.
 */
function alreadyFiled(auditContent, routeLabel) {
  const marker = `og-coverage-check.mjs — ${routeLabel}`
  // Only match pending rows ([ ]), not completed ones ([x])
  const lines = auditContent.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(marker)) {
      // Walk back to find the nearest ### heading
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

function formatAuditRow(routeLabel, today) {
  const todayStr = today.toISOString().slice(0, 10)
  return `
### [ ] [seo] [4.8] ${routeLabel} missing opengraph-image.tsx
- category: seo
- filed: ${todayStr} by og-coverage-check.mjs — ${routeLabel}
- impact: 6 (social shares of ${routeLabel} fall back to site-default OG card — no route-specific context)
- ease: 8 (additive file; PillarOGContent pattern is proven across 20+ routes)
- score: 4.8 (impact × ease / 10)
- route: ${routeLabel}
- action: add apps/web/src/app${routeLabel === '/' ? '' : routeLabel}/opengraph-image.tsx using the PillarOGContent pattern
`
}

// ── __test export ─────────────────────────────────────────────────────────────

export const __test = {
  findGaps,
  toRouteLabel,
  alreadyFiled,
  formatAuditRow,
  EXCLUDED_SEGMENTS,
}

// ── CLI entry (only runs when this file is invoked directly) ──────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Imported as library — do nothing.
} else {
  const args = process.argv.slice(2)
  const doWrite = args.includes('--write')
  const doJson = args.includes('--json')
  const routeDirArgs = args.filter((a) => !a.startsWith('--'))

  // Enumerate all route dirs and OG dirs under the app directory
  const allRouteDirs = findPageRouteDirs(APP_DIR)
  const allOgDirs = findOgDirs(APP_DIR)

  let dirsToCheck
  if (doWrite || (doJson && routeDirArgs.length === 0)) {
    dirsToCheck = allRouteDirs
  } else if (routeDirArgs.length > 0) {
    dirsToCheck = routeDirArgs
  } else {
    dirsToCheck = allRouteDirs
  }

  const gaps = findGaps(dirsToCheck, allOgDirs)

  if (doJson) {
    const result = gaps.map((dir) => ({ dir, route: toRouteLabel(dir, APP_DIR) }))
    console.log(JSON.stringify({ gaps: result }, null, 2))
    process.exit(0)
  }

  if (gaps.length === 0) {
    if (!doWrite) {
      console.log('og-coverage-check: all routes have opengraph-image.tsx — coverage complete.')
    } else {
      console.log('og-coverage-check: all routes covered — no AUDIT rows filed.')
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
      console.error(`og-coverage-check: failed to read plan/AUDIT.md — ${err.message}`)
      process.exit(1)
    }

    const today = new Date()
    const rows = []
    let filed = 0
    for (const dir of gaps) {
      const routeLabel = toRouteLabel(dir, APP_DIR)
      if (alreadyFiled(auditContent, routeLabel)) {
        console.log(`og-coverage-check: ${routeLabel} already pending in AUDIT.md — skipped`)
        continue
      }
      rows.push(formatAuditRow(routeLabel, today))
      console.log(`og-coverage-check: ${routeLabel} missing opengraph-image.tsx — filing AUDIT row`)
      filed++
    }

    if (rows.length > 0) {
      try {
        appendFileSync(AUDIT_MD, rows.join(''))
        console.log(`og-coverage-check: filed ${filed} AUDIT row(s) → plan/AUDIT.md`)
      } catch (err) {
        console.error(`og-coverage-check: failed to write plan/AUDIT.md — ${err.message}`)
        process.exit(1)
      }
    }

    process.exit(0)
  }

  // Gate mode: print gaps and exit 1
  for (const dir of gaps) {
    const routeLabel = toRouteLabel(dir, APP_DIR)
    console.error(`MISSING OG: ${routeLabel} — add apps/web/src/app${routeLabel === '/' ? '' : routeLabel}/opengraph-image.tsx`)
  }
  console.error(
    `og-coverage-check: ${gaps.length} route(s) missing opengraph-image.tsx — add OG handlers before shipping.`,
  )
  process.exit(1)
}
