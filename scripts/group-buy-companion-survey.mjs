#!/usr/bin/env node
// scripts/group-buy-companion-survey.mjs
//
// Mechanically enforces bearings.md Rule 3: every group-buy record with
// status 'live' or 'announced' must have a relatedArticle field set.
//
// Phase 37 shipped the relatedArticle schema field. This script (Phase 40)
// audits for the gap at every march tick and when new group-buy records ship.
//
// Usage:
//   node scripts/group-buy-companion-survey.mjs
//     Dry-run: prints flagged slugs to stdout; exit 1 if any, 0 if clean.
//
//   node scripts/group-buy-companion-survey.mjs --write
//     Scan mode: appends plan/AUDIT.md rows for missing companions.
//     Deduplicates: skips slugs already in AUDIT.md. Exit 0.
//
//   node scripts/group-buy-companion-survey.mjs --json
//     JSON output: { "missing": [...] }. Exit 0.
//
// Exit codes:
//   0 → clean (dry-run) or scan complete (--write/--json)
//   1 → missing companions found (dry-run) or error (any mode)

import { readFileSync, readdirSync, appendFileSync, existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const GROUP_BUYS_DIR = join(REPO_ROOT, 'data', 'group-buys')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

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

// ── Gap detection ─────────────────────────────────────────────────────────────

// Returns records that violate Rule 3:
//   - status is 'live' or 'announced'
//   - relatedArticle is absent or falsy
function findMissingCompanions(records) {
  return records
    .filter(({ data }) => {
      const targetStatuses = ['live', 'announced']
      return targetStatuses.includes(data.status) && !data.relatedArticle
    })
    .map(({ file, data }) => ({
      slug: data.slug || basename(file, '.json'),
      name: data.name || basename(file, '.json'),
      vendorSlug: data.vendorSlug || 'unknown',
      status: data.status,
      file: `data/group-buys/${file}`,
    }))
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(record, today) {
  const todayStr = today.toISOString().slice(0, 10)
  return `\n### [ ] [content-gaps] [7.0] ${record.slug} — Rule 3 companion article missing
- category: content-gaps
- filed: ${todayStr} by group-buy-companion-survey.mjs
- impact: 7 (${record.status} group buy "${record.name}" has no thock companion piece; /group-buys card has no "Read our coverage →" link)
- ease: 5 (one companion article + relatedArticle field update in the group-buy record)
- score: 7.0 (impact × ease / 10)
- group-buy: ${record.file}
- rule: Rule 3
- action: ship companion article for ${record.name}, then set relatedArticle field in ${record.file}\n`
}

// ── Deduplication ─────────────────────────────────────────────────────────────

function alreadyFiled(auditContent, slug) {
  return auditContent.includes(`${slug} — Rule 3 companion article missing`)
}

// ── __test export (for scripts/__tests__/group-buy-companion-survey.test.mjs) ─

export const __test = {
  loadGroupBuys,
  findMissingCompanions,
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

// Load records
let records
try {
  records = loadGroupBuys()
} catch (err) {
  console.error(`group-buy-companion-survey: failed to read group-buys — ${err.message}`)
  process.exit(1)
}

// Find gaps
const missing = findMissingCompanions(records)

// JSON mode
if (doJson) {
  console.log(JSON.stringify({ missing }, null, 2))
  process.exit(0)
}

// Write mode
if (doWrite) {
  if (missing.length === 0) {
    console.log('group-buy-companion-survey: all live/announced group buys have companion articles — no AUDIT rows filed.')
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

  for (const record of missing) {
    if (alreadyFiled(existingContent, record.slug)) {
      skipped++
      continue
    }
    rows.push(formatAuditRow(record, today))
    console.log(
      `group-buy-companion-survey: ${record.slug} (${record.status}) missing companion article — filing AUDIT row`,
    )
    filed++
  }

  if (filed === 0) {
    console.log(
      `group-buy-companion-survey: ${missing.length} gap(s) already in AUDIT.md — no new rows filed.`,
    )
    process.exit(0)
  }

  try {
    appendFileSync(AUDIT_MD, rows.join(''))
    console.log(`group-buy-companion-survey: filed ${filed} AUDIT row(s)${skipped ? ` (${skipped} already filed)` : ''} → plan/AUDIT.md`)
  } catch (err) {
    console.error(`group-buy-companion-survey: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  process.exit(0)
}

// Dry-run mode: print and exit 1 if any missing
if (missing.length === 0) {
  console.log('group-buy-companion-survey: all live/announced group buys have companion articles.')
  process.exit(0)
}

for (const record of missing) {
  console.log(`MISSING COMPANION [score 7.0] ${record.slug} (${record.status})`)
  console.log(`  name:   ${record.name}`)
  console.log(`  file:   ${record.file}`)
  console.log(`  fix:    ship companion article, set relatedArticle in ${record.file}`)
  console.log()
}

console.error(
  `group-buy-companion-survey: ${missing.length} live/announced group buy(s) missing companion articles — Rule 3 violated.`,
)
process.exit(1)

} // end isMain
