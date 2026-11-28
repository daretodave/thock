#!/usr/bin/env node
// scripts/readtime-attribute-coverage-check.mjs
//
// Gate script: cross-references `mdxComponents`
// (packages/content/src/mdx/components.tsx) against
// `computeReadTime()`'s visible-text allowlist
// (packages/content/src/util/readTime.ts), so a future MDX component (or a
// new prop on an existing one) that renders reader-visible text through a
// JSX attribute or a data lookup — rather than through tag children, which
// `computeReadTime` already counts correctly — cannot silently reintroduce
// the read-time undercount defect five independent fixes just closed (see
// plan/14-readtime-visible-text-regression-guard.md's Why section:
// dc4eb368, 7a3f5e85, 35c0c2a2, 8bf441a0, d2d2720f).
//
// This is a static cross-reference, not a render-based integration test —
// see the spec's Design section for why. Three checks, each against a
// curated allowlist (one entry per current `mdxComponents` key):
//
//   1. A live `mdxComponents` key with no allowlist entry at all — an
//      unreviewed component just joined the map.
//   2. For a key already in the allowlist with an attribute-channel or
//      extraVisibleText-channel prop, a string-typed prop on that
//      component's own prop type (packages/content/src/mdx/<Name>.tsx) not
//      already recorded in the allowlist's known-string-props set for that
//      component — a new prop joined an already-reviewed component.
//   3. An allowlist attribute-channel prop name not present in
//      readTime.ts's own attribute regex alternation — the regex itself
//      drifting out of sync with the allowlist.
//
// Shape mirrors og-coverage-check.mjs — a pure detection layer that gates at
// ship time and files AUDIT.md rows when called via --write. Object-literal
// key parsing mirrors truncation-call-site-check.mjs's style: a small
// regex/string scan, not a full TSX parser.
//
// Usage:
//   node scripts/readtime-attribute-coverage-check.mjs
//     Gate mode: exit 1 if any flagged key/prop/mismatch, printing every hit
//     with a one-line fix hint.
//
//   node scripts/readtime-attribute-coverage-check.mjs --write
//     Scan; append content AUDIT.md rows for each flagged hit. Deduplicates.
//
//   node scripts/readtime-attribute-coverage-check.mjs --json
//     JSON output: { flagged: [...] } — for programmatic use.
//
// Exit codes:
//   0 → no flagged hits (gate mode) or scan complete (--write/--json)
//   1 → flagged hits found (gate mode) or error (any mode)

import { existsSync, readFileSync, appendFileSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')
const MDX_DIR = join(REPO_ROOT, 'packages', 'content', 'src', 'mdx')
const COMPONENTS_TSX = join(MDX_DIR, 'components.tsx')
const READTIME_TS = join(REPO_ROOT, 'packages', 'content', 'src', 'util', 'readTime.ts')

// ── Curated allowlist ──────────────────────────────────────────────────────
//
// One entry per current `mdxComponents` key (packages/content/src/mdx/
// components.tsx). `channel` is:
//   - 'attribute'       — renders visible reader-facing text through a JSX
//                         attribute value that readTime.ts's attribute
//                         regex must also know about (`channelProps`).
//   - 'extraVisibleText' — renders visible reader-facing text synthesized
//                         at render time from a data lookup, passed into
//                         `computeReadTime`'s `extraVisibleText` parameter
//                         rather than present in the raw MDX string at all
//                         (PartReference's id-lookup shape).
//   - 'none'            — children-only; nothing to allowlist, and its own
//                         prop file is never read for drift (most of its
//                         string props genuinely aren't visible text, e.g.
//                         Source.href — see the spec's "curated allowlist,
//                         not a generic string-prop scan" decision).
//
// `channelProps` (only meaningful for channel 'attribute') is the subset of
// `knownStringProps` that must also appear in readTime.ts's attribute
// regex alternation — checked independently below (check 3).
//
// `knownStringProps` is the *complete* recorded set of that component's
// string-typed props, channel-flagged or not (e.g. InlineViz.src/accent are
// recorded here as reviewed-but-not-visible, so they don't get flagged as
// "new" every run — only a genuinely new string prop should ever trip
// check 2).
const CURATED_ALLOWLIST = {
  PullQuote: {
    channel: 'attribute',
    channelProps: ['attribution'],
    knownStringProps: ['attribution'],
  },
  Callout: {
    channel: 'attribute',
    channelProps: ['title'],
    knownStringProps: ['title'],
  },
  InlineViz: {
    channel: 'attribute',
    channelProps: ['caption'],
    // src/alt/accent are reviewed string props that don't render visible
    // reader-facing text through this component (src is an image path,
    // alt is screen-reader-only fallback text never shown to sighted
    // readers, accent is a CSS color token/alias) — recorded so they're
    // not flagged as new/unreviewed, but deliberately not in channelProps.
    knownStringProps: ['src', 'alt', 'caption', 'accent'],
  },
  KeyboardImage: {
    channel: 'attribute',
    channelProps: ['caption'],
    // src is a reviewed, non-visible string prop (image path). alt is
    // the <img alt> fallback — screen-reader-only text never shown to
    // sighted readers, not a visible-text channel readTime.ts should
    // count — same reasoning as InlineViz.alt above.
    knownStringProps: ['src', 'alt', 'caption'],
  },
  PartReference: {
    // The visible text (the resolved part's name) isn't rendered through
    // any of PartReference's own props at all — it's resolved from
    // @thock/data by the article loader (resolveMentionedPartNames() in
    // packages/content/src/loaders/articles.ts) and passed into
    // computeReadTime's extraVisibleText parameter. `id` is a lookup key,
    // `fallback` is reviewed (rendered only when a referenced part can't
    // be resolved, not a steady-state visible-text channel).
    channel: 'extraVisibleText',
    channelProps: [],
    knownStringProps: ['id', 'fallback'],
  },
  // Children-only — nothing to allowlist. Caption/Source/Mono render their
  // string props (if any, e.g. Source.href) through non-text channels or
  // not as visible text; h2/h3/a and the six GFM table-cell components are
  // defined inline in components.tsx itself and only ever render
  // `children`.
  Caption: { channel: 'none' },
  Source: { channel: 'none' },
  Mono: { channel: 'none' },
  h2: { channel: 'none' },
  h3: { channel: 'none' },
  a: { channel: 'none' },
  table: { channel: 'none' },
  thead: { channel: 'none' },
  tbody: { channel: 'none' },
  tr: { channel: 'none' },
  th: { channel: 'none' },
  td: { channel: 'none' },
}

// ── mdxComponents key parsing ─────────────────────────────────────────────
//
// Small regex/string scan over the `export const mdxComponents = { ... } as
// const` object literal — mirroring truncation-call-site-check.mjs's
// receiver-name heuristic, not a full TSX parser. Each non-blank,
// non-comment line inside the block is either a shorthand key (`PullQuote,`)
// or a `key: Value,` pair (`h2: SerifH2,`) — either way the leading
// identifier is the live mdxComponents key.

const MDX_COMPONENTS_BLOCK_RE = /export const mdxComponents\s*=\s*\{([\s\S]*?)\}\s*as const/
const OBJECT_KEY_LINE_RE = /^([A-Za-z_$][\w$]*)\s*(?::.*)?,?$/

export function extractMdxComponentKeys(content) {
  const blockMatch = content.match(MDX_COMPONENTS_BLOCK_RE)
  if (!blockMatch) return []
  const keys = []
  for (const rawLine of blockMatch[1].split('\n')) {
    const line = rawLine.trim()
    if (line === '' || line.startsWith('//')) continue
    const keyMatch = line.match(OBJECT_KEY_LINE_RE)
    if (keyMatch) keys.push(keyMatch[1])
  }
  return keys
}

// ── Component prop-type parsing ───────────────────────────────────────────
//
// Reads a component's own `export type <Name>Props = { ... }` object type
// and returns the names of every prop whose type annotation is exactly
// `string` or `string | undefined` — a narrowing pattern (not a full TSX/
// type parser) deliberately strict enough to skip string-literal unions
// (e.g. Callout's `type?: 'note' | 'warn' | 'info'`) and non-string types
// (ReactNode, number, arrays, interfaces).

const STRING_TYPE_RE = /^string(\s*\|\s*undefined)?$/
const PROPS_TYPE_LINE_RE = /^\s*([A-Za-z_$][\w$]*)\??\s*:\s*([^\n]+?)\s*,?\s*$/gm

export function extractStringProps(content, componentName) {
  const blockRe = new RegExp(`export type ${componentName}Props\\s*=\\s*\\{([^}]*)\\}`, 's')
  const blockMatch = content.match(blockRe)
  if (!blockMatch) return []
  const props = []
  const lineRe = new RegExp(PROPS_TYPE_LINE_RE.source, 'gm')
  let m
  while ((m = lineRe.exec(blockMatch[1])) !== null) {
    const [, propName, typeExpr] = m
    if (STRING_TYPE_RE.test(typeExpr.trim())) props.push(propName)
  }
  return props
}

// ── readTime.ts attribute-regex parsing ───────────────────────────────────
//
// Reads the literal `(?:caption|title|attribution)="` alternation out of
// readTime.ts's source text (not executed as a regex itself — this script
// only needs the attribute *names*, not to run the match).

const ATTR_REGEX_ALTERNATION_RE = /\(\?:([a-zA-Z|]+)\)="/

export function extractReadTimeAttributeNames(content) {
  const m = content.match(ATTR_REGEX_ALTERNATION_RE)
  if (!m) return new Set()
  return new Set(m[1].split('|'))
}

// ── Path helpers ───────────────────────────────────────────────────────────

export function toRelPath(filePath) {
  return relative(REPO_ROOT, filePath).replace(/\\/g, '/')
}

// ── Scan ───────────────────────────────────────────────────────────────────

/**
 * Pure scan over already-read file contents. Takes:
 *   - componentsContent: packages/content/src/mdx/components.tsx source
 *   - readTimeContent: packages/content/src/util/readTime.ts source
 *   - readComponentFile(key): (key) => string | undefined — returns the
 *     source of packages/content/src/mdx/<key>.tsx, or undefined if it
 *     doesn't exist (e.g. moved/renamed — not this script's concern to
 *     error on).
 *   - allowlist: defaults to CURATED_ALLOWLIST; overridable for tests.
 *
 * Returns the flat list of flagged hits across all three checks.
 */
export function scanContents(componentsContent, readTimeContent, readComponentFile, allowlist = CURATED_ALLOWLIST) {
  const flagged = []
  const liveKeys = extractMdxComponentKeys(componentsContent)

  // Check 1 — unreviewed component: a live key missing from the allowlist.
  for (const key of liveKeys) {
    if (!(key in allowlist)) {
      flagged.push({
        kind: 'unreviewed-component',
        key,
        message: `mdxComponents key "${key}" is not in the curated allowlist`,
        hint: `add "${key}" to CURATED_ALLOWLIST in scripts/readtime-attribute-coverage-check.mjs — review whether any of its props render visible text through an attribute or extraVisibleText channel`,
      })
    }
  }

  // Check 2 — unreviewed prop: a channel-flagged key's own prop type
  // declares a string prop not already recorded in the allowlist.
  for (const key of liveKeys) {
    const entry = allowlist[key]
    if (!entry || entry.channel === 'none') continue
    const fileContent = readComponentFile(key)
    if (fileContent == null) continue
    const stringProps = extractStringProps(fileContent, key)
    const known = new Set(entry.knownStringProps ?? [])
    for (const prop of stringProps) {
      if (known.has(prop)) continue
      flagged.push({
        kind: 'unreviewed-prop',
        key,
        prop,
        message: `${key}.${prop} is a new string-typed prop not recorded in the curated allowlist`,
        hint: `add "${prop}" to CURATED_ALLOWLIST["${key}"].knownStringProps (and .channelProps, if it renders visible reader-facing text) in scripts/readtime-attribute-coverage-check.mjs, then confirm readTime.ts's regex or extraVisibleText wiring actually counts it if it does`,
      })
    }
  }

  // Check 3 — regex/allowlist mismatch: an allowlist attribute-channel
  // prop name missing from readTime.ts's own attribute regex alternation.
  const regexNames = extractReadTimeAttributeNames(readTimeContent)
  const attrChannelProps = new Set()
  for (const entry of Object.values(allowlist)) {
    if (entry.channel !== 'attribute') continue
    for (const prop of entry.channelProps ?? []) attrChannelProps.add(prop)
  }
  for (const prop of attrChannelProps) {
    if (regexNames.has(prop)) continue
    flagged.push({
      kind: 'regex-mismatch',
      prop,
      message: `allowlist attribute-channel prop "${prop}" is missing from readTime.ts's attribute regex alternation (${[...regexNames].join('|') || '(none)'})`,
      hint: `widen readTime.ts's attribute regex to include "${prop}=\\"...\\"", or confirm "${prop}" doesn't actually need counting and remove it from the allowlist's channelProps in scripts/readtime-attribute-coverage-check.mjs`,
    })
  }

  return flagged
}

/**
 * Disk-touching wrapper around scanContents() — reads components.tsx,
 * readTime.ts, and every allowlisted component's own file from disk.
 */
function scanAll(allowlist = CURATED_ALLOWLIST) {
  const componentsContent = readFileSync(COMPONENTS_TSX, 'utf8')
  const readTimeContent = readFileSync(READTIME_TS, 'utf8')
  const readComponentFile = (key) => {
    const filePath = join(MDX_DIR, `${key}.tsx`)
    try {
      return readFileSync(filePath, 'utf8')
    } catch {
      return undefined
    }
  }
  return scanContents(componentsContent, readTimeContent, readComponentFile, allowlist)
}

// ── Deduplication ─────────────────────────────────────────────────────────────

/**
 * Returns true if AUDIT.md already has a pending (unchecked) content row
 * for the given marker, filed by this script.
 */
export function alreadyFiled(auditContent, marker) {
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

export function markerFor(hit) {
  switch (hit.kind) {
    case 'unreviewed-component':
      return `readtime-attribute-coverage-check.mjs — unreviewed-component:${hit.key}`
    case 'unreviewed-prop':
      return `readtime-attribute-coverage-check.mjs — unreviewed-prop:${hit.key}.${hit.prop}`
    case 'regex-mismatch':
      return `readtime-attribute-coverage-check.mjs — regex-mismatch:${hit.prop}`
    default:
      return `readtime-attribute-coverage-check.mjs — ${JSON.stringify(hit)}`
  }
}

function titleFor(hit) {
  switch (hit.kind) {
    case 'unreviewed-component':
      return `mdxComponents key \`${hit.key}\` joined the map with no readTime visible-text review`
    case 'unreviewed-prop':
      return `\`${hit.key}.${hit.prop}\` is a new string prop unreviewed for readTime visible-text coverage`
    case 'regex-mismatch':
      return `readTime.ts's attribute regex is missing allowlisted prop \`${hit.prop}\``
    default:
      return 'readtime-attribute-coverage-check flagged hit'
  }
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function formatAuditRow(hit, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const marker = markerFor(hit)
  return `
### [ ] [content] [4.8] ${titleFor(hit)}
- category: content
- filed: ${todayStr} by ${marker}
- impact: 6 (an unreviewed visible-text channel can silently reintroduce the readTime undercount defect five independent fixes just closed — see plan/14-readtime-visible-text-regression-guard.md)
- ease: 8 (review the flagged key/prop, then update the curated allowlist in scripts/readtime-attribute-coverage-check.mjs and readTime.ts's regex/extraVisibleText wiring if it does render visible text)
- score: 4.8 (impact × ease / 10)
- evidence: ${hit.message}
- action: ${hit.hint}
`
}

// ── __test export ─────────────────────────────────────────────────────────────

export const __test = {
  extractMdxComponentKeys,
  extractStringProps,
  extractReadTimeAttributeNames,
  scanContents,
  toRelPath,
  alreadyFiled,
  markerFor,
  formatAuditRow,
  CURATED_ALLOWLIST,
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
        'readtime-attribute-coverage-check: no flagged hits — every mdxComponents entry is covered by readTime.ts\'s visible-text allowlist.',
      )
    } else {
      console.log('readtime-attribute-coverage-check: no flagged hits — no AUDIT rows filed.')
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
      console.error(`readtime-attribute-coverage-check: failed to read plan/AUDIT.md — ${err.message}`)
      process.exit(1)
    }

    const today = new Date()
    const rows = []
    let filed = 0
    for (const hit of flagged) {
      const marker = markerFor(hit)
      if (alreadyFiled(auditContent, marker)) {
        console.log(`readtime-attribute-coverage-check: ${hit.kind} ${marker} already pending in AUDIT.md — skipped`)
        continue
      }
      rows.push(formatAuditRow(hit, today))
      console.log(`readtime-attribute-coverage-check: ${hit.kind} flagged — filing AUDIT row (${marker})`)
      filed++
    }

    if (rows.length > 0) {
      try {
        appendFileSync(AUDIT_MD, rows.join(''))
        console.log(`readtime-attribute-coverage-check: filed ${filed} AUDIT row(s) → plan/AUDIT.md`)
      } catch (err) {
        console.error(`readtime-attribute-coverage-check: failed to write plan/AUDIT.md — ${err.message}`)
        process.exit(1)
      }
    }

    process.exit(0)
  }

  // Gate mode: print hits and exit 1
  for (const hit of flagged) {
    console.error(`READTIME COVERAGE: ${hit.message} — ${hit.hint}`)
  }
  console.error(
    `readtime-attribute-coverage-check: ${flagged.length} flagged hit(s) — review each and update the curated allowlist (and readTime.ts's regex/extraVisibleText wiring, if it genuinely renders visible text) before shipping.`,
  )
  process.exit(1)
}
