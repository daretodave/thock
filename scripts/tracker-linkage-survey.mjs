#!/usr/bin/env node
// scripts/tracker-linkage-survey.mjs
//
// Mechanically enforces bearings.md Rule 2: every trend row with
// direction !== 'flat' must have its articleSlug populated within
// 14 calendar days of first appearing in any snapshot.
//
// Phase 41. Companion to group-buy-companion-survey.mjs (Phase 40).
//
// Usage:
//   node scripts/tracker-linkage-survey.mjs
//     Dry-run: prints flagged topics to stdout; exit 1 if any, 0 if clean.
//
//   node scripts/tracker-linkage-survey.mjs --write
//     Scan mode: appends plan/AUDIT.md rows for unlinked topics older than
//     14 days. Deduplicates: skips topics already in AUDIT.md. Exit 0.
//
//   node scripts/tracker-linkage-survey.mjs --json
//     JSON output: { "missing": [...] }. Exit 0.
//
// Exit codes:
//   0 → clean (dry-run) or scan complete (--write/--json)
//   1 → missing links found (dry-run) or error (any mode)

import { readFileSync, readdirSync, appendFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const TRENDS_DIR = join(REPO_ROOT, 'data', 'trends')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000

// ── Snapshot loading ──────────────────────────────────────────────────────────

function loadSnapshots() {
  const files = readdirSync(TRENDS_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort() // alphabetical = chronological for YYYY-WNN names

  const snapshots = []
  for (const file of files) {
    try {
      const raw = readFileSync(join(TRENDS_DIR, file), 'utf8')
      const data = JSON.parse(raw)
      snapshots.push(data)
    } catch {
      // skip unreadable / unparseable files
    }
  }
  return snapshots
}

// ── Gap detection ─────────────────────────────────────────────────────────────

// Returns missing-link records for topics whose CURRENT contiguous non-flat
// run has no articleSlug on its latest row, where the run started more than
// 14 days before `today`.
//
// A "run" is a maximal streak of consecutive snapshots (chronological) in
// which the topic appears with direction !== 'flat'. A flat row, or the
// topic being absent from a snapshot, breaks the run — the next non-flat
// appearance starts a fresh run with its own start date.
//
// This intentionally does NOT treat "linked once, ever" as permanently
// linked: each weekly snapshot is independently authored (Phase 31 cadence),
// so an articleSlug set in an earlier run does not carry forward into a
// later run automatically. Checking only the latest row's slug against the
// current run's start date is what catches a topic that was linked, went
// flat, and came back non-flat unlinked — the "ever linked" version of this
// function masked exactly that case across three recurrences (W22, W24/W26,
// W28 — see plan/AUDIT.md).
//
// `today` is a Date object (injectable for tests).
function findMissingLinks(snapshots, today) {
  // Map: topic name → { runStartDate, runStartWeek, latestHasSlug, latestNonFlat }
  const topicMap = new Map()

  for (const snapshot of snapshots) {
    const snapshotDate = new Date(snapshot.publishedAt)
    const isoWeek = snapshot.isoWeek
    const seenThisSnapshot = new Set()

    for (const row of snapshot.rows || []) {
      const name = row.name
      if (!name) continue
      seenThisSnapshot.add(name)

      const isNonFlat = row.direction !== 'flat'
      const hasSlug = Boolean(row.articleSlug)

      let entry = topicMap.get(name)
      if (!entry) {
        entry = { runStartDate: null, runStartWeek: null, latestHasSlug: false, latestNonFlat: false }
        topicMap.set(name, entry)
      }

      if (isNonFlat) {
        // Start a new run only if the prior run was broken (flat/absent).
        if (entry.runStartDate === null) {
          entry.runStartDate = snapshotDate
          entry.runStartWeek = isoWeek
        }
      } else {
        // Flat row breaks the run.
        entry.runStartDate = null
        entry.runStartWeek = null
      }

      entry.latestHasSlug = hasSlug
      entry.latestNonFlat = isNonFlat
    }

    // Topics absent from this snapshot also have their run broken — a gap
    // in coverage is not a continuation of the prior trending streak.
    for (const [name, entry] of topicMap) {
      if (!seenThisSnapshot.has(name)) {
        entry.runStartDate = null
        entry.runStartWeek = null
        entry.latestNonFlat = false
      }
    }
  }

  const missing = []
  const todayMs = today.getTime()

  for (const [name, entry] of topicMap) {
    if (!entry.latestNonFlat) continue // latest row is flat or topic dropped out
    if (entry.latestHasSlug) continue // current run's latest row is linked
    if (!entry.runStartDate) continue // should be unreachable when latestNonFlat is true
    const age = todayMs - entry.runStartDate.getTime()
    if (age > FOURTEEN_DAYS_MS) {
      missing.push({
        name,
        firstSeenWeek: entry.runStartWeek,
        firstSeenDate: entry.runStartDate.toISOString().slice(0, 10),
        agedays: Math.floor(age / (24 * 60 * 60 * 1000)),
      })
    }
  }

  // Sort by age descending (oldest first)
  missing.sort((a, b) => b.agedays - a.agedays)
  return missing
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(record, today) {
  const todayStr = today.toISOString().slice(0, 10)
  return `\n### [ ] [content-gaps] [5.5] ${record.name} — Rule 2 tracker linkage missing
- category: content-gaps
- filed: ${todayStr} by tracker-linkage-survey.mjs
- impact: 6 (non-flat trend row "${record.name}" unlinked for ${record.agedays} days; no companion deep-dive)
- ease: 9 (one article fills it; topic already editorially curated in tracker)
- score: 5.5 (impact × ease / 10, rounded)
- first-seen: ${record.firstSeenWeek}
- rule: Rule 2
- action: ship companion article for "${record.name}", set articleSlug in relevant trend snapshot(s)\n`
}

// ── Deduplication ─────────────────────────────────────────────────────────────

function alreadyFiled(auditContent, name) {
  return auditContent.includes(`${name} — Rule 2 tracker linkage missing`)
}

// ── __test export (for scripts/__tests__/tracker-linkage-survey.test.mjs) ────

export const __test = {
  loadSnapshots,
  findMissingLinks,
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

// Load snapshots
let snapshots
try {
  snapshots = loadSnapshots()
} catch (err) {
  console.error(`tracker-linkage-survey: failed to read trends — ${err.message}`)
  process.exit(1)
}

// Find gaps
const today = new Date()
const missing = findMissingLinks(snapshots, today)

// JSON mode
if (doJson) {
  console.log(JSON.stringify({ missing }, null, 2))
  process.exit(0)
}

// Write mode
if (doWrite) {
  if (missing.length === 0) {
    console.log('tracker-linkage-survey: all non-flat trend rows are linked or within the 14-day window — no AUDIT rows filed.')
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

  for (const record of missing) {
    if (alreadyFiled(existingContent, record.name)) {
      skipped++
      continue
    }
    rows.push(formatAuditRow(record, today))
    console.log(
      `tracker-linkage-survey: "${record.name}" (first-seen ${record.firstSeenWeek}, ${record.agedays}d ago) unlinked — filing AUDIT row`,
    )
    filed++
  }

  if (filed === 0) {
    console.log(
      `tracker-linkage-survey: ${missing.length} gap(s) already in AUDIT.md — no new rows filed.`,
    )
    process.exit(0)
  }

  try {
    appendFileSync(AUDIT_MD, rows.join(''))
    console.log(`tracker-linkage-survey: filed ${filed} AUDIT row(s)${skipped ? ` (${skipped} already filed)` : ''} → plan/AUDIT.md`)
  } catch (err) {
    console.error(`tracker-linkage-survey: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  process.exit(0)
}

// Dry-run mode: print and exit 1 if any missing
if (missing.length === 0) {
  console.log('tracker-linkage-survey: all non-flat trend rows are linked or within the 14-day window.')
  process.exit(0)
}

for (const record of missing) {
  console.log(`MISSING LINK [score 5.5] "${record.name}"`)
  console.log(`  first-seen: ${record.firstSeenWeek} (${record.firstSeenDate}, ${record.agedays}d ago)`)
  console.log(`  fix: ship companion article, set articleSlug in relevant snapshot(s)`)
  console.log()
}

console.error(
  `tracker-linkage-survey: ${missing.length} non-flat trend row(s) unlinked >14 days — Rule 2 violated.`,
)
process.exit(1)

} // end isMain
