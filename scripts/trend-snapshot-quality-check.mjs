#!/usr/bin/env node
// scripts/trend-snapshot-quality-check.mjs
//
// Mechanically enforces four cross-reference invariants over
// data/trends/*.json that nothing currently checks:
//
//   A. Vendor/group-buy name casing — a row's `note` must spell a
//      canonical name (from data/vendors + data/group-buys) exactly as
//      that record spells it, when it's mentioned at all.
//   B. articleSlug topical relevance — when set, the linked article must
//      actually mention the row's topic somewhere in its content.
//   C. Status-claim agreement — when a note is specifically about a
//      linked group buy (name-gated), closing/opening language must
//      agree with the record's own `status` field.
//   D. direction/spark consistency — `direction` must agree with the
//      sign of the last spark delta (tolerant for 'flat'), and
//      week-over-week spark arrays for the same topic must be
//      shift-and-append continuous. Also: consecutive snapshot files on
//      disk must cover consecutive ISO weeks — a skipped week produces a
//      shift-and-append-*shaped* spark array (each snapshot's rows still
//      pass D-continuity against whichever file precedes them on disk)
//      that silently compresses N calendar weeks into N-1 plotted points.
//
// Phase 50 (checks A-D). skills/march.md Step 0.5 runs this as a HARD
// GATE against the newly-written snapshot file (--file); a corpus-wide
// --write scan is a best-effort survey like every other
// scripts/*-survey.mjs.
//
// Usage:
//   node scripts/trend-snapshot-quality-check.mjs [--file <path>]
//     Dry-run: prints violations; exit 1 if any, 0 if clean.
//
//   node scripts/trend-snapshot-quality-check.mjs --write [--file <path>]
//     Scan mode: appends plan/AUDIT.md rows. Deduplicates against
//     existing rows. Exit 0.
//
//   node scripts/trend-snapshot-quality-check.mjs --json [--file <path>]
//     JSON output: { "violations": [...] }. Exit 0.
//
// --file scopes checks A/B/C/D-sign to one snapshot; D-continuity still
// reads the chronologically prior snapshot from disk to compare against.
//
// Exit codes:
//   0 → clean (dry-run) or scan complete (--write/--json)
//   1 → violations found (dry-run) or error (any mode)

import { readFileSync, readdirSync, appendFileSync, existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isoWeekString } from './iso-week.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const TRENDS_DIR = join(REPO_ROOT, 'data', 'trends')
const VENDORS_DIR = join(REPO_ROOT, 'data', 'vendors')
const GROUP_BUYS_DIR = join(REPO_ROOT, 'data', 'group-buys')
const ARTICLES_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'articles')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

// Common-word collision, confirmed 100% false-positive in a corpus dry run
// ("stock drop", "score drop") — see phase 50 brief Decisions.
const CASING_NAME_EXCLUSIONS = new Set(['Drop'])

const FLAT_TOLERANCE = 2

const CLOSED_WORDS = ['closed', 'wrapped up', 'has ended', 'now ended']
const LIVE_WORDS = ['now live', 'just opened', 'opens ', 'open for orders']

const STOPWORDS = new Set(['the', 'and', 'of', 'a', 'an', 'in', 'on', 'for', 'to', 'is', 'with'])

// ── Loading ────────────────────────────────────────────────────────────────────

function loadJsonDir(dir) {
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
  const records = []
  for (const file of files) {
    try {
      records.push({ file, data: JSON.parse(readFileSync(join(dir, file), 'utf8')) })
    } catch {
      // skip unreadable / unparseable files
    }
  }
  return records
}

function loadSnapshotFiles() {
  return readdirSync(TRENDS_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort() // alphabetical = chronological for YYYY-WNN names
}

function loadSnapshot(file) {
  return JSON.parse(readFileSync(join(TRENDS_DIR, file), 'utf8'))
}

// ── Frontmatter + body parsing (mirrors article-crosslink-survey.mjs) ─────────

function readArticleContent(slug) {
  const path = join(ARTICLES_DIR, `${slug}.mdx`)
  if (!existsSync(path)) return null
  return readFileSync(path, 'utf8')
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function keywordsOf(name) {
  return name
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
}

function normalizeTopicKey(name) {
  return name
    .toLowerCase()
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Check A — name-casing drift ─────────────────────────────────────────────────

function canonicalNames(vendors, groupBuys) {
  const names = new Set()
  for (const { data } of vendors) {
    if (data.name && !CASING_NAME_EXCLUSIONS.has(data.name)) names.add(data.name)
  }
  for (const { data } of groupBuys) {
    if (data.name && !CASING_NAME_EXCLUSIONS.has(data.name)) names.add(data.name)
  }
  return [...names]
}

function checkCasingDrift(snapshot, names) {
  const violations = []
  for (const row of snapshot.rows) {
    if (!row.note) continue
    for (const canonical of names) {
      const re = new RegExp(`\\b${escapeRegExp(canonical)}\\b`, 'gi')
      const matches = row.note.match(re) || []
      for (const found of matches) {
        if (found !== canonical) {
          violations.push({
            check: 'A',
            isoWeek: snapshot.isoWeek,
            row: row.name,
            detail: `note spells "${canonical}" as "${found}"`,
          })
        }
      }
    }
  }
  return violations
}

// ── Check B — articleSlug topical relevance ──────────────────────────────────────

function checkTopicRelevance(snapshot, articleContentLookup) {
  const violations = []
  for (const row of snapshot.rows) {
    if (!row.articleSlug) continue
    const content = articleContentLookup(row.articleSlug)
    if (content === null || content === undefined) {
      violations.push({
        check: 'B',
        isoWeek: snapshot.isoWeek,
        row: row.name,
        detail: `articleSlug "${row.articleSlug}" does not resolve to an article file`,
      })
      continue
    }
    const haystack = content.toLowerCase()
    const kws = keywordsOf(row.name)
    const hit = kws.length === 0 || kws.some((k) => haystack.includes(k))
    if (!hit) {
      violations.push({
        check: 'B',
        isoWeek: snapshot.isoWeek,
        row: row.name,
        detail: `none of [${kws.join(', ')}] appear anywhere in "${row.articleSlug}"`,
      })
    }
  }
  return violations
}

// ── Check C — status-claim agreement ─────────────────────────────────────────────

function buildGroupBuyByArticle(groupBuys) {
  const map = new Map()
  for (const { data } of groupBuys) {
    if (data.relatedArticle) map.set(data.relatedArticle, data)
  }
  return map
}

// Notes routinely discuss several concurrently-running group buys in one
// paragraph (a vendor row's note is about the vendor, not one buy) — gating
// on "the gb's name appears anywhere in the note" still lets a status word
// attached to a *different* buy leak onto this one. Segment the note on
// sentence-ish punctuation (`.` `;` `:`) and require the name mention and
// the status word to land in the same segment.
function splitSegments(note) {
  return note.split(/[.;:]/)
}

function checkStatusClaims(snapshot, gbByArticle) {
  const violations = []
  for (const row of snapshot.rows) {
    if (!row.articleSlug || !row.note) continue
    const gb = gbByArticle.get(row.articleSlug)
    if (!gb) continue

    const note = row.note.toLowerCase()
    const nameKeywords = keywordsOf(gb.name)
    const gatedSegments = splitSegments(note).filter((seg) => nameKeywords.some((k) => seg.includes(k)))
    if (gatedSegments.length === 0) continue // note isn't specifically about this group buy

    const saysClosed = gatedSegments.some((seg) => CLOSED_WORDS.some((w) => seg.includes(w)))
    const saysLive = gatedSegments.some((seg) => LIVE_WORDS.some((w) => seg.includes(w)))

    if (saysClosed && !['closed', 'shipped'].includes(gb.status)) {
      violations.push({
        check: 'C',
        isoWeek: snapshot.isoWeek,
        row: row.name,
        detail: `note claims "${gb.name}" closed but data/group-buys/${gb.slug}.json status is "${gb.status}"`,
      })
    }
    if (saysLive && !['live', 'announced'].includes(gb.status)) {
      violations.push({
        check: 'C',
        isoWeek: snapshot.isoWeek,
        row: row.name,
        detail: `note claims "${gb.name}" is live/open but data/group-buys/${gb.slug}.json status is "${gb.status}"`,
      })
    }
  }
  return violations
}

// ── Check D — direction/spark consistency ────────────────────────────────────────

function checkDirectionSign(snapshot) {
  const violations = []
  for (const row of snapshot.rows) {
    if (!Array.isArray(row.spark) || row.spark.length < 2) continue
    const delta = row.spark[row.spark.length - 1] - row.spark[row.spark.length - 2]

    if (row.direction === 'flat') {
      if (Math.abs(delta) > FLAT_TOLERANCE) {
        violations.push({
          check: 'D-sign',
          isoWeek: snapshot.isoWeek,
          row: row.name,
          detail: `direction "flat" but last spark delta is ${delta} (tolerance ${FLAT_TOLERANCE})`,
        })
      }
      continue
    }

    const expectedSign = row.direction === 'up' ? delta > 0 : delta < 0
    if (!expectedSign) {
      violations.push({
        check: 'D-sign',
        isoWeek: snapshot.isoWeek,
        row: row.name,
        detail: `direction "${row.direction}" contradicts last spark delta ${delta}`,
      })
    }
  }
  return violations
}

// Monday of the ISO week identified by a "YYYY-WNN" string — the inverse
// of isoWeekString's own week-1-Monday computation, so date math round-trips.
function mondayOfIsoWeek(isoWeek) {
  const [yearStr, weekStr] = isoWeek.split('-W')
  const year = Number(yearStr)
  const week = Number(weekStr)

  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() === 0 ? 7 : jan4.getDay()
  const weekOneMonday = new Date(jan4)
  weekOneMonday.setDate(jan4.getDate() - (jan4Day - 1))

  const monday = new Date(weekOneMonday)
  monday.setDate(weekOneMonday.getDate() + (week - 1) * 7)
  return monday
}

function nextIsoWeek(isoWeek) {
  const monday = mondayOfIsoWeek(isoWeek)
  const next = new Date(monday)
  next.setDate(monday.getDate() + 7)
  return isoWeekString(next)
}

// Snapshot-level (not per-row) check: the file preceding `snapshot` on disk
// must cover the calendar week immediately before it. Per-row D-continuity
// only checks that a spark array is *a* shift-and-append of the prior
// file's — it can't tell a skipped week from a normal one, since a missed
// week still produces an array shaped like a valid one-week shift relative
// to whichever file happens to be alphabetically/chronologically previous.
function checkMissingWeek(prevSnapshot, snapshot) {
  const violations = []
  if (!prevSnapshot) return violations

  const expected = nextIsoWeek(prevSnapshot.isoWeek)
  if (snapshot.isoWeek !== expected) {
    violations.push({
      check: 'D-missing-week',
      isoWeek: snapshot.isoWeek,
      missingWeek: expected,
      row: 'snapshot-gap',
      detail: `expected ISO week ${expected} to follow ${prevSnapshot.isoWeek}, found ${snapshot.isoWeek} — a snapshot for ${expected} is missing`,
    })
  }
  return violations
}

function checkContinuity(prevSnapshot, snapshot) {
  const violations = []
  if (!prevSnapshot) return violations

  const prevByKey = new Map(prevSnapshot.rows.map((r) => [normalizeTopicKey(r.name), r]))
  for (const row of snapshot.rows) {
    const prev = prevByKey.get(normalizeTopicKey(row.name))
    if (!prev || !Array.isArray(prev.spark) || !Array.isArray(row.spark)) continue

    const expected = JSON.stringify(prev.spark.slice(1))
    const actualPrefix = JSON.stringify(row.spark.slice(0, row.spark.length - 1))
    if (expected !== actualPrefix) {
      violations.push({
        check: 'D-continuity',
        isoWeek: snapshot.isoWeek,
        row: row.name,
        detail: `spark [${row.spark.join(',')}] is not a shift-and-append of prior week's [${prev.spark.join(',')}]`,
      })
    }
  }
  return violations
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

const SCORES = {
  A: { score: '2.7', impact: 3, ease: 9, label: 'name-casing drift' },
  B: { score: '3.0', impact: 5, ease: 6, label: 'articleSlug topic mismatch' },
  C: { score: '4.8', impact: 6, ease: 8, label: 'status-claim mismatch' },
  'D-sign': { score: '3.6', impact: 4, ease: 9, label: 'direction/spark contradiction' },
  'D-continuity': { score: '3.5', impact: 7, ease: 5, label: 'spark continuity break' },
  'D-missing-week': { score: '4.8', impact: 6, ease: 8, label: 'missing weekly snapshot (ISO-week gap)' },
}

function rowSignature(v) {
  return `${v.isoWeek} ${v.row} — ${SCORES[v.check].label}`
}

function formatAuditRow(v, today) {
  const meta = SCORES[v.check]
  const todayStr = today.toISOString().slice(0, 10)
  const easeNote =
    v.check === 'D-missing-week'
      ? `research + write the missing data/trends/${v.missingWeek}.json snapshot (scout + ship-data, templated shape)`
      : `correct the field in data/trends/${v.isoWeek}.json`
  return `\n### [ ] [data] [${meta.score}] ${rowSignature(v)}
- category: data
- filed: ${todayStr} by trend-snapshot-quality-check.mjs
- impact: ${meta.impact} (${v.detail})
- ease: ${meta.ease} (${easeNote})
- score: ${meta.score} (impact × ease / 10)
- trend-row: ${v.isoWeek} / ${v.row}
- action: ${v.detail}\n`
}

function alreadyFiled(auditContent, v) {
  return auditContent.includes(rowSignature(v))
}

// ── Orchestration ─────────────────────────────────────────────────────────────

function runAllChecks({ scopeFile } = {}) {
  const vendors = loadJsonDir(VENDORS_DIR)
  const groupBuys = loadJsonDir(GROUP_BUYS_DIR)
  const names = canonicalNames(vendors, groupBuys)
  const gbByArticle = buildGroupBuyByArticle(groupBuys)

  const files = loadSnapshotFiles()
  const targetFiles = scopeFile ? files.filter((f) => f === basename(scopeFile)) : files

  const violations = []
  for (const file of targetFiles) {
    const snapshot = loadSnapshot(file)
    violations.push(...checkCasingDrift(snapshot, names))
    violations.push(...checkTopicRelevance(snapshot, readArticleContent))
    violations.push(...checkStatusClaims(snapshot, gbByArticle))
    violations.push(...checkDirectionSign(snapshot))

    const idx = files.indexOf(file)
    const prevSnapshot = idx > 0 ? loadSnapshot(files[idx - 1]) : null
    violations.push(...checkContinuity(prevSnapshot, snapshot))
    violations.push(...checkMissingWeek(prevSnapshot, snapshot))
  }
  return violations
}

// ── __test export ──────────────────────────────────────────────────────────────

export const __test = {
  checkCasingDrift,
  checkTopicRelevance,
  checkStatusClaims,
  checkDirectionSign,
  checkContinuity,
  checkMissingWeek,
  nextIsoWeek,
  buildGroupBuyByArticle,
  canonicalNames,
  alreadyFiled,
  rowSignature,
  normalizeTopicKey,
  keywordsOf,
}

// ── CLI entry ──────────────────────────────────────────────────────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (isMain) {
  const args = process.argv.slice(2)
  const doWrite = args.includes('--write')
  const doJson = args.includes('--json')
  const fileFlagIdx = args.indexOf('--file')
  const scopeFile = fileFlagIdx !== -1 ? args[fileFlagIdx + 1] : undefined

  let violations
  try {
    violations = runAllChecks({ scopeFile })
  } catch (err) {
    console.error(`trend-snapshot-quality-check: failed — ${err.message}`)
    process.exit(1)
  }

  if (doJson) {
    console.log(JSON.stringify({ violations }, null, 2))
    process.exit(0)
  }

  if (doWrite) {
    if (violations.length === 0) {
      console.log('trend-snapshot-quality-check: no violations — no AUDIT rows filed.')
      process.exit(0)
    }

    let existingContent = ''
    try {
      if (existsSync(AUDIT_MD)) existingContent = readFileSync(AUDIT_MD, 'utf8')
    } catch {
      // proceed without dedup
    }

    const today = new Date()
    const rows = []
    let filed = 0
    let skipped = 0
    for (const v of violations) {
      if (alreadyFiled(existingContent, v)) {
        skipped++
        continue
      }
      rows.push(formatAuditRow(v, today))
      console.log(`trend-snapshot-quality-check: [${v.check}] ${v.isoWeek} ${v.row} — filing AUDIT row`)
      filed++
    }

    if (filed === 0) {
      console.log(
        `trend-snapshot-quality-check: ${violations.length} violation(s) already in AUDIT.md — no new rows filed.`,
      )
      process.exit(0)
    }

    try {
      appendFileSync(AUDIT_MD, rows.join(''))
      console.log(
        `trend-snapshot-quality-check: filed ${filed} AUDIT row(s)${skipped ? ` (${skipped} already filed)` : ''} → plan/AUDIT.md`,
      )
    } catch (err) {
      console.error(`trend-snapshot-quality-check: failed to write plan/AUDIT.md — ${err.message}`)
      process.exit(1)
    }
    process.exit(0)
  }

  // Dry-run
  if (violations.length === 0) {
    console.log('trend-snapshot-quality-check: clean — no violations.')
    process.exit(0)
  }

  for (const v of violations) {
    console.log(`VIOLATION [${v.check}] ${v.isoWeek} ${v.row}`)
    console.log(`  ${v.detail}`)
    console.log()
  }
  console.error(`trend-snapshot-quality-check: ${violations.length} violation(s) found.`)
  process.exit(1)
}
