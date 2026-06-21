#!/usr/bin/env node
// scripts/newsletter-gap-survey.mjs
//
// Newsletter cadence survey for plan/AUDIT.md.
//
// Reads all newsletter MDX files from apps/web/src/content/newsletters/*.mdx,
// finds the most-recent publishedAt, and files a content-gaps AUDIT row
// when ≥7 calendar days have elapsed since the last issue.
//
// Design mirrors content-gap-survey.mjs. Deduplicates against any existing
// pending newsletter row in plan/AUDIT.md so repeated runs are safe.
//
// Usage:
//   node scripts/newsletter-gap-survey.mjs           # dry-run: print row, no write
//   node scripts/newsletter-gap-survey.mjs --write   # append row to plan/AUDIT.md
//   node scripts/newsletter-gap-survey.mjs --json    # JSON output (programmatic)
//
// Exit codes:
//   0 → clean (last issue recent enough) or scan complete (--write/--json)
//   1 → gap found (dry-run) or error (any mode)

import { readFileSync, readdirSync, appendFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const NEWSLETTERS_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'newsletters')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

const GAP_DAYS = 7

// ── Frontmatter parser ───────────────────────────────────────────────────────

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return null
  const yaml = match[1]
  const publishedAtMatch = yaml.match(/^publishedAt:\s*['"]?([^'"\n]+)['"]?/m)
  const slugMatch = yaml.match(/^slug:\s*(.+)$/m)
  const issueMatch = yaml.match(/^issue:\s*(\d+)/m)
  if (!publishedAtMatch) return null
  return {
    slug: slugMatch ? slugMatch[1].trim() : null,
    publishedAt: publishedAtMatch[1].trim(),
    issue: issueMatch ? parseInt(issueMatch[1], 10) : null,
  }
}

// ── Newsletter loading ───────────────────────────────────────────────────────

function loadNewsletters() {
  if (!existsSync(NEWSLETTERS_DIR)) return []
  const files = readdirSync(NEWSLETTERS_DIR).filter((f) => f.endsWith('.mdx'))
  const newsletters = []
  for (const file of files) {
    const content = readFileSync(join(NEWSLETTERS_DIR, file), 'utf8')
    const fm = extractFrontmatter(content)
    if (fm && fm.publishedAt) newsletters.push(fm)
  }
  return newsletters
}

// ── Gap detection ─────────────────────────────────────────────────────────────

function surveyNewsletter(newsletters, today) {
  if (newsletters.length === 0) {
    const daysSince = null
    const nextIssue = 1
    return { status: 'gap', daysSince, lastSlug: null, lastIssue: 0, nextIssue, lastPublishedAt: null }
  }

  newsletters.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const latest = newsletters[0]
  const latestDate = new Date(latest.publishedAt)
  const todayMs = today.getTime()
  const daysSince = Math.floor((todayMs - latestDate.getTime()) / (1000 * 60 * 60 * 24))
  const lastIssue = latest.issue ?? newsletters.length
  const nextIssue = lastIssue + 1

  if (daysSince < GAP_DAYS) {
    return { status: 'current', daysSince, lastSlug: latest.slug, lastIssue, nextIssue, lastPublishedAt: latest.publishedAt }
  }

  return { status: 'gap', daysSince, lastSlug: latest.slug, lastIssue, nextIssue, lastPublishedAt: latest.publishedAt }
}

// ── Deduplication ─────────────────────────────────────────────────────────────

function alreadyFiled(auditContent) {
  return auditContent.includes('newsletter-gap-survey') && auditContent.includes('[ ] [newsletter]')
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(result, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const issueLabel = `issue ${String(result.nextIssue).padStart(3, '0')}`
  const dayDesc = result.daysSince !== null
    ? `${result.daysSince} days since issue ${result.lastIssue}`
    : 'no issues published yet'

  return `\n### [ ] [newsletter] [4.0] Weekly digest — ${issueLabel} due (${dayDesc})
- category: content-gaps
- filed: ${todayStr} by newsletter-gap-survey.mjs
- impact: 5 (newsletter archive going stale reduces /newsletter value and reader trust in cadence)
- ease: 8 (content-curator weekly round-up: 5 pillar picks + tracker insight)
- score: 4.0 (impact × ease / 10)
- next: /ship-content → newsletter type (weekly round-up, 5 pillar picks, tracker insight)
- last-issue: ${result.lastPublishedAt ? result.lastPublishedAt.slice(0, 10) : 'none'} (${result.lastSlug ?? 'none'})
- days-since: ${result.daysSince ?? 'n/a'}
- issue: [mirror-failed: ${todayStr}]
> Filed ${todayStr} by newsletter-gap-survey.mjs. ${dayDesc}. Threshold: ≥${GAP_DAYS} calendar days.\n`
}

// ── __test export (for scripts/__tests__/newsletter-gap-survey.test.mjs) ─────

export const __test = {
  extractFrontmatter,
  surveyNewsletter,
  formatAuditRow,
  alreadyFiled,
  GAP_DAYS,
}

// ── CLI entry (only runs when this file is invoked directly) ──────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Exported as a library — do nothing.
} else {
  const args = process.argv.slice(2)
  const doWrite = args.includes('--write')
  const doJson = args.includes('--json')

  let newsletters
  try {
    newsletters = loadNewsletters()
  } catch (err) {
    console.error(`newsletter-gap-survey: failed to read newsletters — ${err.message}`)
    process.exit(1)
  }

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const result = surveyNewsletter(newsletters, today)

  if (result.status === 'current') {
    if (doJson) {
      console.log(JSON.stringify({ status: 'current', daysSince: result.daysSince }))
    } else {
      console.log(`newsletter-gap-survey: last issue ${result.daysSince} day(s) ago — cadence current, no row filed.`)
    }
    process.exit(0)
  }

  // Gap found
  const row = formatAuditRow(result, today)

  if (doJson) {
    console.log(JSON.stringify({ status: 'gap', result, row }))
    process.exit(0)
  }

  if (!doWrite) {
    // Dry-run
    console.log(row)
    process.exit(1)
  }

  // --write mode: check dedup then append
  let auditContent = ''
  try {
    if (existsSync(AUDIT_MD)) {
      auditContent = readFileSync(AUDIT_MD, 'utf8')
    }
  } catch (err) {
    console.error(`newsletter-gap-survey: failed to read plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  if (alreadyFiled(auditContent)) {
    console.log('newsletter-gap-survey: pending newsletter row already in AUDIT.md — no duplicate filed.')
    process.exit(0)
  }

  try {
    appendFileSync(AUDIT_MD, row)
    console.log(`newsletter-gap-survey: filed newsletter digest row (issue ${result.nextIssue}, ${result.daysSince ?? 0} days since last) → plan/AUDIT.md`)
  } catch (err) {
    console.error(`newsletter-gap-survey: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  process.exit(0)
}
