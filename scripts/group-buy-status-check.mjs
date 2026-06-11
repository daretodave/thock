#!/usr/bin/env node
// scripts/group-buy-status-check.mjs
//
// Mechanically enforces data hygiene for group-buy records: any record with
// status 'live' or 'announced' whose endDate is in the past is a staleness
// violation. Files a 'data' AUDIT row so the next /ship-data tick corrects
// the status field.
//
// Phase 42 — Stale group-buy status scanner
//
// Usage:
//   node scripts/group-buy-status-check.mjs
//     Dry-run: prints flagged slugs to stdout; exit 1 if any, 0 if clean.
//
//   node scripts/group-buy-status-check.mjs --write
//     Scan mode: appends plan/AUDIT.md rows for stale records.
//     Deduplicates: skips slugs already in AUDIT.md. Exit 0.
//
//   node scripts/group-buy-status-check.mjs --json
//     JSON output: { "stale": [...] }. Exit 0.
//
// Exit codes:
//   0 → clean (dry-run) or scan complete (--write/--json)
//   1 → stale records found (dry-run) or error (any mode)

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

// ── Staleness detection ───────────────────────────────────────────────────────

// Returns records that are stale:
//   - status is 'live' or 'announced'
//   - endDate is set and is in the past (< today)
function findStaleRecords(records, today) {
  const cutoff = today instanceof Date ? today : new Date(today)
  return records
    .filter(({ data }) => {
      if (!['live', 'announced'].includes(data.status)) return false
      if (!data.endDate) return false
      return new Date(data.endDate) < cutoff
    })
    .map(({ file, data }) => ({
      slug: data.slug || basename(file, '.json'),
      name: data.name || basename(file, '.json'),
      status: data.status,
      endDate: data.endDate,
      file: `data/group-buys/${file}`,
    }))
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(record, today) {
  const todayStr = (today instanceof Date ? today : new Date(today))
    .toISOString()
    .slice(0, 10)
  return `\n### [ ] [data] [3.6] ${record.slug} — status stale, endDate ${record.endDate} passed
- category: data
- filed: ${todayStr} by group-buy-status-check.mjs
- impact: 4 (buy shows status "${record.status}" but endDate ${record.endDate} has passed — data hygiene gap)
- ease: 9 (update status field to 'closed' in data/group-buys/${basename(record.file)})
- score: 3.6 (impact × ease / 10)
- group-buy: ${record.file}
- action: update status from '${record.status}' to 'closed' in ${record.file}\n`
}

// ── Deduplication ─────────────────────────────────────────────────────────────

function alreadyFiled(auditContent, slug) {
  return auditContent.includes(`${slug} — status stale,`)
}

// ── __test export (for scripts/__tests__/group-buy-status-check.test.mjs) ─────

export const __test = {
  loadGroupBuys,
  findStaleRecords,
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
  console.error(`group-buy-status-check: failed to read group-buys — ${err.message}`)
  process.exit(1)
}

const today = new Date()

// Find stale records
const stale = findStaleRecords(records, today)

// JSON mode
if (doJson) {
  console.log(JSON.stringify({ stale }, null, 2))
  process.exit(0)
}

// Write mode
if (doWrite) {
  if (stale.length === 0) {
    console.log('group-buy-status-check: all live/announced group buys have current endDate — no AUDIT rows filed.')
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

  const rows = []
  let filed = 0
  let skipped = 0

  for (const record of stale) {
    if (alreadyFiled(existingContent, record.slug)) {
      skipped++
      continue
    }
    rows.push(formatAuditRow(record, today))
    console.log(
      `group-buy-status-check: ${record.slug} (status=${record.status}, endDate=${record.endDate}) is stale — filing AUDIT row`,
    )
    filed++
  }

  if (filed === 0) {
    console.log(
      `group-buy-status-check: ${stale.length} stale record(s) already in AUDIT.md — no new rows filed.`,
    )
    process.exit(0)
  }

  try {
    appendFileSync(AUDIT_MD, rows.join(''))
    console.log(`group-buy-status-check: filed ${filed} AUDIT row(s)${skipped ? ` (${skipped} already filed)` : ''} → plan/AUDIT.md`)
  } catch (err) {
    console.error(`group-buy-status-check: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  process.exit(0)
}

// Dry-run mode: print and exit 1 if any stale
if (stale.length === 0) {
  console.log('group-buy-status-check: all live/announced group buys have current endDate.')
  process.exit(0)
}

for (const record of stale) {
  console.log(`STALE [score 3.6] ${record.slug} (${record.status})`)
  console.log(`  name:    ${record.name}`)
  console.log(`  endDate: ${record.endDate}`)
  console.log(`  file:    ${record.file}`)
  console.log(`  fix:     update status to 'closed' in ${record.file}`)
  console.log()
}

console.error(
  `group-buy-status-check: ${stale.length} live/announced group buy(s) have passed their endDate — data hygiene gap.`,
)
process.exit(1)

} // end isMain
