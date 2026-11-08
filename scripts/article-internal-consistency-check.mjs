#!/usr/bin/env node
// scripts/article-internal-consistency-check.mjs
//
// Diffs an article's/newsletter's own lede/heading claims against its own
// body, so a punchy lede number stops silently contradicting a careful
// figure stated two paragraphs later. Mirrors the resolve-then-diff shape
// of scripts/article-language-check.mjs (CLI/mode conventions, AUDIT row
// formatting) and scripts/content-fact-audit.mjs (frontmatter/body
// extraction helpers, numeric-claim extraction near a token window).
//
// Chunk 06.1 scope (spec plan/06-article-internal-consistency.md,
// acceptance A1 + partial A2): count-style claims only — "N boards",
// "N colorways", "N sizes" — diffed against a comma-separated enumerated
// list elsewhere in the body (or inside an InlineViz `alt` string).
//
// Chunk 06.2 scope (acceptance A2, now complete): dollar/gram-style figure
// claims — "$150 kit", "62 grams" — diffed against a *restatement* of the
// same tagged quantity elsewhere in the body (not an enumeration — a
// dollar/gram mismatch is the same fact repeated with a different value,
// not a claimed count vs. a list).
//
// Chunk 06.3 scope (acceptance A3, now complete): sibling-citation
// cross-check — a markdown link (or `<Source href="/article/...">`) to a
// sibling article, diffed against that sibling's own headline dollar/gram
// claims (count-vs-sibling-headline comparisons are out of scope; the
// spec's "same fact" concept maps onto the dollar/gram figure extraction
// only). March/digest wiring (A4) is chunk 06.4 — out of scope here.
//
// Usage:
//   node scripts/article-internal-consistency-check.mjs <file.mdx> [...]
//     Gate mode: exit 1 if any mismatches, exit 0 if clean.
//
//   node scripts/article-internal-consistency-check.mjs --write
//     Scan mode: walks apps/web/src/content/articles/ and
//     apps/web/src/content/newsletters/, appends one `content` category
//     plan/AUDIT.md row per file with a mismatch. Exit 0 on completion,
//     1 only on an unrecoverable I/O error.
//
//   node scripts/article-internal-consistency-check.mjs --json [<file.mdx>...]
//     JSON output: { mismatches: [...] }. If no files given, walks the
//     full articles + newsletters corpus. Exit 0.
//
// Exit codes:
//   0 → clean (gate mode) or scan complete (--write / --json mode)
//   1 → mismatches found (gate mode) or unrecoverable error (any mode)
//
// Best-effort like every sibling survey: a parse miss or false negative
// is acceptable; a crash on one bad file is not — each file is wrapped in
// its own try/catch and skipped (logged) rather than aborting the run.

import { readFileSync, readdirSync, appendFileSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const ARTICLES_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'articles')
const NEWSLETTERS_DIR = join(REPO_ROOT, 'apps', 'web', 'src', 'content', 'newsletters')
const AUDIT_MD = join(REPO_ROOT, 'plan', 'AUDIT.md')

// ── Frontmatter / body extraction (mirrors content-fact-audit.mjs) ──────────

function extractBody(content) {
  const rawLines = content.split('\n')
  if (rawLines[0] !== '---') {
    return { body: content, frontmatterText: '' }
  }
  for (let i = 1; i < rawLines.length; i++) {
    if (rawLines[i] === '---') {
      return {
        body: rawLines.slice(i + 1).join('\n'),
        frontmatterText: rawLines.slice(1, i).join('\n'),
      }
    }
  }
  return { body: content, frontmatterText: '' }
}

// Extracts a double-quoted YAML scalar frontmatter field's value, joining
// any line-folded continuation lines (YAML line-folding: a newline plus
// the continuation's leading indent collapses to a single space) — the
// real corpus's `lede:` field is routinely written this way (see
// alice-layout-decline.mdx). Returns null when the field or its closing
// quote isn't found.
function extractFrontmatterField(frontmatterText, field) {
  const startRe = new RegExp(`^${field}:\\s*"`, 'm')
  const startMatch = startRe.exec(frontmatterText)
  if (!startMatch) return null
  const afterOpen = frontmatterText.slice(startMatch.index + startMatch[0].length)
  let raw = ''
  for (let i = 0; i < afterOpen.length; i++) {
    const ch = afterOpen[i]
    if (ch === '"' && afterOpen[i - 1] !== '\\') {
      return raw.replace(/\n\s*/g, ' ').trim()
    }
    raw += ch
  }
  return null // no closing quote found — malformed/truncated field.
}

// First `#`/`##` heading line's text in the body.
function extractFirstHeading(body) {
  const m = /^#{1,2}\s+(.+)$/m.exec(body)
  return m ? m[1].trim() : null
}

// Returns up to `maxParagraphs` plain-prose paragraphs from the start of
// the body — skipping heading lines and JSX/MDX component blocks (a line
// starting with `<`, skipped through its own closing `/>` or `</tag>`
// line). Best-effort, not a real MDX parser: an unusual multi-line JSX
// shape just gets skipped as a block, which only ever makes this stricter
// (fewer false paragraph lines), never looser.
function extractFirstParagraphs(body, maxParagraphs) {
  const lines = body.split('\n')
  const paragraphs = []
  let current = []
  let i = 0
  while (i < lines.length && paragraphs.length < maxParagraphs) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed === '') {
      if (current.length > 0) {
        paragraphs.push(current.join(' '))
        current = []
      }
      i++
      continue
    }
    if (/^#{1,6}\s/.test(trimmed)) {
      i++
      continue
    }
    if (trimmed.startsWith('<')) {
      while (i < lines.length && !/\/>\s*$/.test(lines[i]) && !/^<\/[\w.]+>\s*$/.test(lines[i].trim())) {
        i++
      }
      i++ // skip the closing line itself.
      continue
    }
    current.push(trimmed)
    i++
  }
  if (current.length > 0 && paragraphs.length < maxParagraphs) {
    paragraphs.push(current.join(' '))
  }
  return paragraphs.slice(0, maxParagraphs)
}

// Builds the standard "headline claim sources" list shared by every
// mismatch finder in this file: the lede, the first heading, and the
// first 2 body paragraphs — the spots a punchy figure gets stated "for
// effect" before the body's more careful number. Factored out of
// findCountMismatches/findFigureMismatches (chunk 06.1/06.2 duplicated
// this inline) so findSiblingMismatches (chunk 06.3) can reuse the exact
// same shape instead of building its own.
function getHeadlineClaimSources(frontmatterText, body) {
  const lede = extractFrontmatterField(frontmatterText, 'lede')
  const heading = extractFirstHeading(body)
  const paragraphs = extractFirstParagraphs(body, 2)

  return [
    { source: 'lede', text: lede },
    { source: 'first heading', text: heading },
    ...paragraphs.map((text, i) => ({ source: `body paragraph ${i + 1}`, text })),
  ]
}

// ── Count-style claim extraction ─────────────────────────────────────────────

const NUMBER_WORD_TO_VALUE = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
}

// Plural nouns that share the surface shape this check targets ("<number>
// <plural-noun>") but are measurement/time units, not a count of discrete
// named things with a body enumeration to diff against ("two years", "an
// eight-week window"). Dollar/gram-shaped figures are chunk 06.2's job —
// excluded here on purpose, not merely missed.
const COUNT_NOUN_STOPWORDS = new Set([
  'years',
  'year',
  'weeks',
  'week',
  'months',
  'month',
  'days',
  'day',
  'hours',
  'hour',
  'minutes',
  'minute',
  'seconds',
  'second',
  'dollars',
  'percent',
  'points',
  'point',
  'grams',
  'gram',
  'degrees',
  'degree',
  'times',
])

// A number (digit or number-word, one through twelve) immediately before a
// plural countable noun — "four colorways", "80 switches", "three boards".
// Judgment call: only "number before noun" is handled (never "noun before
// number") — every real-corpus instance surveyed for this chunk phrases the
// claim that way; see the chunk report for the follow-up note.
const COUNT_CLAIM_RE =
  /\b(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)[\s-]+([a-z]+)\b/gi

function extractCountClaims(text) {
  const claims = []
  if (!text) return claims
  COUNT_CLAIM_RE.lastIndex = 0
  let m
  while ((m = COUNT_CLAIM_RE.exec(text)) !== null) {
    const noun = m[2].toLowerCase()
    if (!noun.endsWith('s') || noun.length < 4) continue
    if (COUNT_NOUN_STOPWORDS.has(noun)) continue
    // "the other two switches that belong in the first two" — "other N
    // <noun>" names a remainder/complement count, not the article's
    // headline total, so it isn't comparable to a later full-set
    // enumeration. Real false positive this guards: tactile-stem-
    // geometry-deep-dive.mdx's "two switches" (the two not yet named out
    // of a four-switch set) read as a claim that the whole piece is
    // about two switches.
    const beforeMatch = text.slice(Math.max(0, m.index - 10), m.index)
    if (/\bother\s*$/i.test(beforeMatch)) continue
    const rawNumber = m[1].toLowerCase()
    const number = /^\d+$/.test(rawNumber) ? Number(rawNumber) : NUMBER_WORD_TO_VALUE[rawNumber]
    if (!number) continue
    // "one buckles", "a pre-bent one buckles the same way" — a literal
    // count of 1 is never phrased with a pluralized noun in the real
    // corpus (a genuine singular claim says "a single X", not "one Xs"),
    // so "one"/"1" immediately before an -s noun is a reliable signal
    // that the matched word is being used as a pronoun ("the pre-bent
    // one") or that the "noun" is actually a verb ("buckles") rather
    // than a real count claim. Real false positive this guards:
    // buckling-spring-deep-dive.mdx's "a pre-bent one buckles the same
    // way every time" was read as a claim of "one buckle".
    if (number === 1) continue
    claims.push({ number, noun, index: m.index, text: m[0] })
  }
  return claims
}

// ── Enumerated-list lookup ────────────────────────────────────────────────────

// An em-dash- or colon-introduced comma-separated (optionally
// "and"/"or"-joined) run of 2+ short items, anchored to appear (after
// only whitespace) immediately following the noun — the house corpus's
// own convention for stating a count claim right before its enumerated
// list (real examples: cannonkeys-nyawice-group-buy.mdx's "four
// colorways — orange, pink, baby blue, lilac"; brass-weight-mod.mdx's
// "one of three things: a milled brass ... plate ..., a set of brass
// weights ..., or brass feet ..."; an InlineViz `alt` string carries the
// same shape, e.g. "Three mount-style cards in a row — gasket-mount ...,
// leaf-spring F1 ..., and tray-mount ..."). Anchored with `^` (tested
// against the text starting right after the noun, not matched anywhere
// inside it) on purpose: an earlier, unrelated mention of the same noun —
// e.g. a heading like "## The colorways" with no list of its own — must
// not let a list several sentences later get credited to it, which a
// floating (non-anchored) search would otherwise do. The item character
// class deliberately excludes `.` and newlines, so a match can't run on
// past the end of its own sentence/line even though no explicit length
// cap is applied — items can be as long as a real sentence needs.
const LIST_INTRO_RE =
  /^\s*[—:]\s*([A-Za-z0-9][\w'’%×/() -]*(?:,\s*(?:and\s+|or\s+)?[A-Za-z0-9][\w'’%×/() -]*){1,})/

// Words allowed immediately before the noun occurrence an enumeration is
// read off of — determiners/quantifiers that keep the mention referring
// to the *whole* set the claim is about, same as the claim's own "<number>
// <noun>" phrasing. A capitalized word outside this list immediately
// before the noun (e.g. "Uniform profiles — DSA, KAT, XDA") signals a
// *qualified subset* mention instead, not the full set the lede/heading
// claim is about — real false positive this guards: keycap-profiles-
// compared.mdx's lede claims "four profiles" (DSA, KAT, SA, MT3 — the
// Cherry/OEM/SA/MT3 family — see its own body), but "Uniform profiles —
// DSA, KAT, XDA" only enumerates the uniform-sculpt subset of three.
const ENUMERATION_PRECEDING_WORD_ALLOWLIST =
  /^(?:the|these|those|all|both|its|our|a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\d+)$/i

// A short leading-preposition fragment ("and on tactiles,") is a fronted
// adverbial clause describing the *next* list item, not a parallel item
// of its own — comma-splitting can't tell the two shapes apart by
// punctuation alone, so this merges a short prepositional fragment into
// whichever item follows it. Real false positive this guards:
// lubing-switches-guide.mdx's "Lube changes three things: it quiets
// plastic-on-plastic friction, it dampens spring resonance, and on
// tactiles, it can eliminate the very feature..." was counting "on
// tactiles" as a fourth item instead of reading it as part of the third.
function mergeShortPrepositionalFragments(items) {
  const SHORT_PREP_FRAGMENT_RE = /^(?:on|in|at|for|with|under|among|during|after|before)\s+\S+(?:\s+\S+)?$/i
  const merged = []
  for (let i = 0; i < items.length; i++) {
    if (SHORT_PREP_FRAGMENT_RE.test(items[i]) && i + 1 < items.length) {
      merged.push(`${items[i]}, ${items[i + 1]}`)
      i++ // consumed the next item as part of this merge.
    } else {
      merged.push(items[i])
    }
  }
  return merged
}

// Finds the first occurrence of `noun` in `text` that has an enumerated
// list immediately after it, and returns the list's item count. Searches
// every occurrence of the noun (not just the first) since the claim's own
// source text (lede/heading/first-2-paragraphs) may itself mention the
// noun without an adjacent list — the list usually lives later in the
// body.
function findEnumeratedListNear(text, noun) {
  const nounRe = new RegExp(`\\b${noun}\\b`, 'gi')
  let m
  while ((m = nounRe.exec(text)) !== null) {
    const precedingWordMatch = /(\S+)\s*$/.exec(text.slice(0, m.index))
    const precedingWord = precedingWordMatch ? precedingWordMatch[1] : ''
    if (
      precedingWord &&
      /^[A-Z]/.test(precedingWord) &&
      !ENUMERATION_PRECEDING_WORD_ALLOWLIST.test(precedingWord)
    ) {
      continue // qualified-subset mention, not the full set — see comment above.
    }
    const afterNoun = text.slice(m.index + m[0].length)
    const listMatch = LIST_INTRO_RE.exec(afterNoun)
    if (listMatch) {
      const rawItems = listMatch[1]
        .split(',')
        .map((s) => s.trim().replace(/^(?:and|or)\s+/i, '').replace(/[.;:]+$/, '').trim())
        .filter(Boolean)
      const items = mergeShortPrepositionalFragments(rawItems)
      if (items.length >= 2) {
        return { count: items.length, items, index: m.index }
      }
    }
  }
  return null
}

// ── Count-style mismatch detection (acceptance A2, count half) ───────────────

// Extracts count claims from the lede, first heading, and first 2 body
// paragraphs, then diffs each against the nearest body enumeration of the
// same noun. First claim per noun wins (a repeat mention of the same noun
// in, say, both the lede and the first paragraph is the same claim, not a
// second independent one).
function findCountMismatches(frontmatterText, body) {
  const claimSources = getHeadlineClaimSources(frontmatterText, body)

  const mismatches = []
  const seenNouns = new Set()
  for (const { source, text } of claimSources) {
    for (const claim of extractCountClaims(text)) {
      if (seenNouns.has(claim.noun)) continue
      seenNouns.add(claim.noun)

      const found = findEnumeratedListNear(body, claim.noun)
      if (!found) continue // no body enumeration to diff against — skip, don't guess.
      if (found.count !== claim.number) {
        mismatches.push({
          kind: 'count',
          noun: claim.noun,
          claimSource: source,
          claimNumber: claim.number,
          foundCount: found.count,
          foundItems: found.items,
        })
      }
    }
  }
  return mismatches
}

// ── Dollar/gram-style figure extraction (acceptance A2, dollar/gram half) ───
//
// Unlike the count-style check above (which diffs a claimed number against
// a body *enumeration*'s item count), a dollar/gram mismatch is the same
// tagged quantity restated with a *different* value later in the article —
// e.g. a lede says a mod "adds 62 grams" and a later callout restates the
// same mod's weight as "67g". The tag (a nearby noun/verb) is what tells
// two figures of the same kind are the *same* fact rather than two
// unrelated figures — an article legitimately mentioning "$150 base kit"
// and "$55 add-on kit" is not a mismatch; they're different things keyed
// by different tags ("base kit" vs. "add-on kit" — in practice just the
// word "kit" repeats, but a different number right after a *different*
// tag is never flagged).

// A dollar amount followed immediately by a range dash/"to"/"and" plus
// another number ("$110 and $155", "$110–$155") is a single claim about
// two different things agreeing with itself, not a tagged quantity to diff
// against a later restatement — real shape seen in group-buy write-ups
// pricing an early-bird tier against a regular tier in the same sentence.
const DOLLAR_RE = /\$(\d+(?:\.\d+)?)\b/g
const RANGE_CONTINUATION_RE = /^\s*(?:[-–—]|to|and)\s*\$?\d/i
// The *second* half of a range ("$110–$155") needs its own check on the
// preceding side — RANGE_CONTINUATION_RE above only catches the range's
// first number (looking forward from it); without this, "$155" in
// "$110–$155" would be read as a standalone claim just because nothing
// about its own trailing text looks like a range.
const RANGE_PRECEDING_DOLLAR_RE = /\$?\d+(?:\.\d+)?\s*(?:[-–—]|to|and)\s*$/i

// Words that can sit immediately after a dollar figure but name no useful
// tagged thing ("$150, and that's before shipping" — tag would be "and").
// Without this filter, "$150 and" would be read as tag "and" and (almost
// certainly) never find a second occurrence, which is harmless on its own,
// but it is also indistinguishable from a genuine tag by shape alone, so
// it is filtered the same deliberate way COUNT_NOUN_STOPWORDS filters
// measurement nouns above rather than left to fail silently later.
const DOLLAR_TAG_STOPWORDS = new Set([
  'and',
  'or',
  'to',
  'for',
  'per',
  'off',
  'more',
  'less',
  'each',
  'a',
  'an',
  'the',
  'in',
  'on',
  'at',
  'with',
  'is',
  'was',
  'that',
  'which',
  'total',
  'worth',
])

// A dollar amount tagged by the noun immediately *following* it — "$150
// kit", "$62.50 add-on" — same "number before noun" direction as
// extractCountClaims above, which keeps this extractor's shape consistent
// with the count-style one. A figure with no following word (end of
// sentence/clause) or whose only following word is a stopword above is
// skipped: no tag means nothing to diff against, same philosophy as the
// count check's "no enumeration found" skip.
function extractDollarClaims(text) {
  const claims = []
  if (!text) return claims
  DOLLAR_RE.lastIndex = 0
  let m
  while ((m = DOLLAR_RE.exec(text)) !== null) {
    const afterNumber = text.slice(m.index + m[0].length)
    if (RANGE_CONTINUATION_RE.test(afterNumber)) continue // part of a range — see comment above.
    const beforeNumber = text.slice(0, m.index)
    if (RANGE_PRECEDING_DOLLAR_RE.test(beforeNumber)) continue // second half of a range — see comment above.
    const tagMatch = /^\s+([a-z][a-z'-]*)\b/i.exec(afterNumber)
    if (!tagMatch) continue
    const tag = tagMatch[1].toLowerCase()
    if (DOLLAR_TAG_STOPWORDS.has(tag)) continue
    claims.push({ kind: 'dollar', tag, value: Number(m[1]), index: m.index, text: m[0] })
  }
  return claims
}

// Matches "<N>g", "<N> gram(s)", "<N>-gram(s)" — but not "<N>g/cm³"
// (density, not weight). Reused shape from content-fact-audit.mjs's own
// GRAM_RE.
const GRAM_RE = /(\d+(?:\.\d+)?)[\s-]*(?:grams?|g)\b(?!\/)/gi

// A gram figure immediately preceded by another number plus a range
// dash/"to"/"and" ("110-155 grams", "110 to 155 grams") is the second half
// of a range, not an independent claim — same reasoning as
// RANGE_CONTINUATION_RE above, just checked on the *preceding* side since
// GRAM_RE anchors on the trailing "grams"/"g" rather than the leading
// number.
const RANGE_PRECEDING_RE = /\d+(?:\.\d+)?\s*(?:[-–—]|to|and)\s*$/i

// Words that can sit immediately before a gram figure but name no useful
// tag ("is about 62 grams" — the word right before is "about"). Mirrors
// DOLLAR_TAG_STOPWORDS's reasoning on the opposite side.
//
// Attribution adjectives ("published", "rated", "specified", "measured",
// "listed", "stated", "claimed", "quoted", "reported", "official",
// "known") are filtered for a sharper reason than the rest: they describe
// where a figure came from, not what it measures, so the *same* word
// routinely precedes two genuinely *different* quantities in one
// sentence — real false positive this guards: cherry-mx2a-revision.mdx's
// "the published 45g actuation and 75g bottom-out ... Cherry's published
// 75g bottom-out" tagged both the 45g actuation and the 75g bottom-out
// figure as "published" and flagged them as the same fact restated
// differently, when they are two different specs that both happen to be
// introduced with "published".
const GRAM_TAG_STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'is',
  'was',
  'about',
  'nearly',
  'roughly',
  'approximately',
  'at',
  'of',
  'than',
  'over',
  'under',
  'just',
  'only',
  'around',
  'some',
  'to',
  'published',
  'rated',
  'specified',
  'measured',
  'listed',
  'stated',
  'claimed',
  'quoted',
  'reported',
  'official',
  'known',
  'and',
])

// A gram figure tagged by the word immediately *preceding* it — "adds 62
// grams", "the switch weighs 62 grams" — the opposite direction from the
// dollar extractor above. Chosen over "noun after" because the real corpus
// almost always states a weight as the object of a verb ("adds/weighs/
// gains N grams") rather than as a prenominal modifier of a following noun
// ("a 62g spring"); best-effort, not exhaustive — a gram figure whose
// nearest preceding word is a stopword (or there is none) is simply
// skipped, same "no claim to diff" philosophy as everywhere else in this
// file.
function extractGramClaims(text) {
  const claims = []
  if (!text) return claims
  GRAM_RE.lastIndex = 0
  let m
  while ((m = GRAM_RE.exec(text)) !== null) {
    const beforeNumber = text.slice(0, m.index)
    if (RANGE_PRECEDING_RE.test(beforeNumber)) continue // second half of a range — see comment above.
    const tagMatch = /([a-z][a-z'-]*)\s*$/i.exec(beforeNumber)
    if (!tagMatch) continue
    const tag = tagMatch[1].toLowerCase()
    if (GRAM_TAG_STOPWORDS.has(tag)) continue
    claims.push({ kind: 'gram', tag, value: Number(m[1]), index: m.index, text: m[0] })
  }
  return claims
}

// Scans `body` for every dollar/gram claim (depending on `kind`) tagged
// with the same `tag`, and returns the first one whose value differs from
// `claimValue` — or null if the tag never recurs in the body, or every
// recurrence restates the same value (including the claim's own source
// occurrence, when that source is itself part of the body, e.g. a heading
// or paragraph claim re-finding itself — harmless, since a figure trivially
// agrees with itself and this just means "not yet proven inconsistent").
function findFigureMismatch(body, tag, kind, claimValue) {
  const extractor = kind === 'dollar' ? extractDollarClaims : extractGramClaims
  const occurrences = extractor(body).filter((c) => c.tag === tag)
  if (occurrences.length === 0) return null // no second mention — nothing to diff against.
  return occurrences.find((c) => c.value !== claimValue) || null
}

// Extracts dollar/gram claims from the lede, first heading, and first 2
// body paragraphs, then diffs each against the next *differing*
// restatement of the same tagged figure anywhere in the body. Mirrors
// findCountMismatches's shape: first claim per (kind, tag) wins, and a
// claim with no differing restatement is skipped rather than guessed at.
function findFigureMismatches(frontmatterText, body) {
  const claimSources = getHeadlineClaimSources(frontmatterText, body)

  const mismatches = []
  const seenTags = new Set() // keyed `${kind}:${tag}` — first claim per tagged quantity wins.
  for (const { source, text } of claimSources) {
    if (!text) continue
    for (const claim of [...extractDollarClaims(text), ...extractGramClaims(text)]) {
      const key = `${claim.kind}:${claim.tag}`
      if (seenTags.has(key)) continue
      seenTags.add(key)

      const differing = findFigureMismatch(body, claim.tag, claim.kind, claim.value)
      if (!differing) continue // no differing restatement found — skip, don't guess.
      mismatches.push({
        kind: claim.kind,
        tag: claim.tag,
        claimSource: source,
        claimValue: claim.value,
        foundValue: differing.value,
      })
    }
  }
  return mismatches
}

// ── Sibling-citation cross-check (acceptance A3) ─────────────────────────────
//
// An article that links to a sibling article and makes a claim about the
// same tagged dollar/gram fact the sibling also states can drift out of
// sync with it just as easily as with its own body — e.g. a round-up piece
// restates a group buy's "$150 kit" price from memory while the group buy's
// own article has since been corrected to "$180 kit". The real corpus's
// only shape for this kind of link is a markdown link to `/article/<slug>`;
// `<Source href="/article/<slug>">` is also matched for robustness (the
// spec names it explicitly) even though it doesn't occur in practice today
// — `<Source>` is only ever used for external (https://) citations in the
// current corpus.

const SIBLING_LINK_PATTERNS = [
  /\[[^\]]*\]\(\/article\/([a-z0-9-]+)\)/g,
  /<Source\s+href="\/article\/([a-z0-9-]+)"/g,
]

// Collects de-duplicated sibling-article slugs referenced anywhere in
// `body`, excluding a self-reference (an article linking to its own slug
// can't happen in practice, but it's a one-line guard against a
// self-vs-self "mismatch" that would otherwise always read as clean
// anyway, since every claim trivially agrees with itself).
function extractSiblingSlugs(body, ownSlug) {
  const slugs = new Set()
  if (!body) return []
  for (const re of SIBLING_LINK_PATTERNS) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(body)) !== null) {
      const slug = m[1]
      if (slug === ownSlug) continue
      slugs.add(slug)
    }
  }
  return [...slugs]
}

// Builds `${kind}:${tag}` -> value for the first dollar/gram claim per
// tagged quantity across `claimSources` — same "first claim per tag wins"
// rule findFigureMismatches uses for a single article's own headline
// claims, reused here for both the citing article and each resolved
// sibling.
function collectHeadlineFigureClaims(claimSources) {
  const claims = new Map()
  for (const { text } of claimSources) {
    if (!text) continue
    for (const claim of [...extractDollarClaims(text), ...extractGramClaims(text)]) {
      const key = `${claim.kind}:${claim.tag}`
      if (claims.has(key)) continue
      claims.set(key, claim.value)
    }
  }
  return claims
}

// Default sibling resolver: reads `<slug>.mdx` out of the articles corpus
// (sibling links only ever point into apps/web/src/content/articles/ in
// the real corpus — confirmed, no newsletter links of this form and no
// article links into .../newsletters/) and returns its frontmatter/body
// split, or null on any read error (missing file, renamed slug, etc. — a
// broken/renamed link is best-effort-skipped, not this script's problem).
function defaultResolveSibling(slug) {
  try {
    const content = readFileSync(join(ARTICLES_DIR, `${slug}.mdx`), 'utf8')
    return extractBody(content)
  } catch {
    return null
  }
}

// Diffs the citing article's own headline dollar/gram claims against each
// resolved sibling's headline dollar/gram claims, for every tagged
// quantity both sides claim with a differing value. `resolveSibling(slug)`
// is injected so this is unit-testable without touching the filesystem;
// the CLI wires `defaultResolveSibling` above. `ownSlug` (optional) guards
// against a self-link being diffed against itself — see
// extractSiblingSlugs.
function findSiblingMismatches(frontmatterText, body, resolveSibling, ownSlug) {
  const siblingSlugs = extractSiblingSlugs(body, ownSlug)
  if (siblingSlugs.length === 0) return []

  const ownClaimSources = getHeadlineClaimSources(frontmatterText, body)
  const ownClaims = collectHeadlineFigureClaims(ownClaimSources)
  if (ownClaims.size === 0) return []

  // Track which claim source first introduced each tagged quantity, for
  // the AUDIT row's `claimSource` field (e.g. "lede").
  const claimSourceByKey = new Map()
  for (const { source, text } of ownClaimSources) {
    if (!text) continue
    for (const claim of [...extractDollarClaims(text), ...extractGramClaims(text)]) {
      const key = `${claim.kind}:${claim.tag}`
      if (!claimSourceByKey.has(key)) claimSourceByKey.set(key, source)
    }
  }

  const mismatches = []
  for (const siblingSlug of siblingSlugs) {
    const sibling = resolveSibling(siblingSlug)
    if (!sibling) continue // broken/renamed link — best-effort skip.

    const siblingClaimSources = getHeadlineClaimSources(sibling.frontmatterText, sibling.body)
    const siblingClaims = collectHeadlineFigureClaims(siblingClaimSources)

    for (const [key, claimValue] of ownClaims) {
      if (!siblingClaims.has(key)) continue
      const siblingValue = siblingClaims.get(key)
      if (siblingValue === claimValue) continue
      const [kind, tag] = key.split(':')
      mismatches.push({
        kind: kind === 'dollar' ? 'sibling-dollar' : 'sibling-gram',
        tag,
        claimSource: claimSourceByKey.get(key),
        claimValue,
        siblingSlug,
        siblingValue,
      })
    }
  }
  return mismatches
}

// ── Content file resolution (articles + newsletters) ────────────────────────

// `dir` is 'articles' or 'newsletters' — carried on each mismatch so
// formatAuditRow can point at the right content path. Throws only on a
// problem with the file itself; callers wrap this in a try/catch.
function checkContentFile(filePath, dir) {
  const content = readFileSync(filePath, 'utf8')
  const slug = basename(filePath, '.mdx')
  const { body, frontmatterText } = extractBody(content)
  const mismatches = [
    ...findCountMismatches(frontmatterText, body),
    ...findFigureMismatches(frontmatterText, body),
    ...findSiblingMismatches(frontmatterText, body, defaultResolveSibling, slug),
  ].map((m) => ({ ...m, dir }))
  return { slug, mismatches }
}

function checkArticle(filePath) {
  return checkContentFile(filePath, 'articles')
}

function checkNewsletter(filePath) {
  return checkContentFile(filePath, 'newsletters')
}

// ── AUDIT.md row formatting ───────────────────────────────────────────────────

function describeMismatch(m) {
  if (m.kind === 'dollar') {
    return `${m.claimSource} claims "$${m.claimValue} ${m.tag}" but the body later says the ${m.tag} costs $${m.foundValue}`
  }
  if (m.kind === 'gram') {
    return `${m.claimSource} claims "${m.claimValue}g" (near "${m.tag}") but the body later restates the same "${m.tag}" figure as ${m.foundValue}g`
  }
  if (m.kind === 'sibling-dollar') {
    return `${m.claimSource} claims "$${m.claimValue} ${m.tag}" but the sibling article ${m.siblingSlug} says the ${m.tag} costs $${m.siblingValue}`
  }
  if (m.kind === 'sibling-gram') {
    return `${m.claimSource} claims "${m.claimValue}g" (near "${m.tag}") but the sibling article ${m.siblingSlug} restates the same "${m.tag}" figure as ${m.siblingValue}g`
  }
  return `${m.claimSource} claims "${m.claimNumber} ${m.noun}" but the body enumerates ${m.foundCount} ${m.noun}: ${m.foundItems.join(', ')}`
}

function formatAuditRow(slug, dir, mismatches, today) {
  const todayStr = today.toISOString().slice(0, 10)
  const count = mismatches.length
  const noun = count === 1 ? 'mismatch' : 'mismatches'
  const mismatchLines = mismatches.map((m) => `  - ${describeMismatch(m)}`).join('\n')

  return `\n### [ ] [content] [3.6] ${slug} — ${count} internal ${noun} detected by article-internal-consistency-check.mjs
- category: content
- filed: ${todayStr} by article-internal-consistency-check.mjs corpus scan
- impact: 4 (a lede/body figure contradiction undermines the article's own numbers on every reader visit)
- ease: 9 (reconcile the claimed figure with the body's restatement — no code or schema change needed)
- score: 3.6 (impact × ease / 10)
- file: apps/web/src/content/${dir}/${slug}.mdx
- mismatches:
${mismatchLines}
- action: make the lede/heading figure agree with the body (or fix the body if it's the one that's wrong)\n`
}

// ── __test export (for scripts/__tests__/article-internal-consistency-check.test.mjs) ─

export const __test = {
  extractBody,
  extractFrontmatterField,
  extractFirstHeading,
  extractFirstParagraphs,
  getHeadlineClaimSources,
  extractCountClaims,
  mergeShortPrepositionalFragments,
  findEnumeratedListNear,
  findCountMismatches,
  extractDollarClaims,
  extractGramClaims,
  findFigureMismatch,
  findFigureMismatches,
  extractSiblingSlugs,
  findSiblingMismatches,
  defaultResolveSibling,
  checkArticle,
  checkNewsletter,
  checkContentFile,
  describeMismatch,
  formatAuditRow,
}

// ── CLI entry (only runs when this file is invoked directly) ────────────────

const isMain = fileURLToPath(import.meta.url) === process.argv[1]
if (!isMain) {
  // Exported as a library — do nothing.
} else {

const args = process.argv.slice(2)
const doWrite = args.includes('--write')
const doJson = args.includes('--json')
const fileArgs = args.filter((a) => !a.startsWith('--') && a.endsWith('.mdx'))

function dirForPath(filePath) {
  return filePath.includes('/newsletters/') ? 'newsletters' : 'articles'
}

// Determine which files to scan.
let targets = []
if (doWrite || (doJson && fileArgs.length === 0)) {
  // Scan mode: walk both corpora.
  try {
    const articleFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'))
    targets.push(...articleFiles.map((f) => ({ filePath: join(ARTICLES_DIR, f), dir: 'articles' })))
  } catch (err) {
    console.error(`article-internal-consistency-check: failed to read articles dir — ${err.message}`)
    process.exit(1)
  }
  try {
    const newsletterFiles = readdirSync(NEWSLETTERS_DIR).filter((f) => f.endsWith('.mdx'))
    targets.push(
      ...newsletterFiles.map((f) => ({ filePath: join(NEWSLETTERS_DIR, f), dir: 'newsletters' })),
    )
  } catch (err) {
    console.error(`article-internal-consistency-check: failed to read newsletters dir — ${err.message}`)
    process.exit(1)
  }
} else if (fileArgs.length > 0) {
  // Gate mode: specific files.
  targets = fileArgs.map((filePath) => ({ filePath, dir: dirForPath(filePath) }))
} else if (!doWrite && !doJson) {
  console.error('article-internal-consistency-check: no files specified and --write not set')
  console.error('Usage: article-internal-consistency-check.mjs <file.mdx> [...] | --write | --json')
  process.exit(1)
}

// Scan files. Best-effort: a single file that fails to parse is logged and
// skipped, never crashes the whole run with a raw stack trace.
const results = []
for (const { filePath, dir } of targets) {
  try {
    results.push(checkContentFile(filePath, dir))
  } catch (err) {
    console.error(`article-internal-consistency-check: skipped ${filePath} — ${err.message}`)
    if (!doWrite && !doJson) process.exit(1)
  }
}

const allMismatches = []
for (const { slug, mismatches } of results) {
  for (const m of mismatches) allMismatches.push({ slug, ...m })
}

if (doJson) {
  console.log(JSON.stringify({ mismatches: allMismatches }, null, 2))
  process.exit(0)
}

if (doWrite) {
  if (allMismatches.length === 0) {
    console.log('article-internal-consistency-check: corpus clean — no AUDIT rows filed.')
    process.exit(0)
  }

  const bySlug = new Map() // slug -> { dir, mismatches: [] }
  for (const m of allMismatches) {
    if (!bySlug.has(m.slug)) bySlug.set(m.slug, { dir: m.dir, mismatches: [] })
    bySlug.get(m.slug).mismatches.push(m)
  }

  const today = new Date()
  const rows = []
  for (const [slug, { dir, mismatches }] of bySlug) {
    rows.push(formatAuditRow(slug, dir, mismatches, today))
    console.log(
      `article-internal-consistency-check: ${mismatches.length} mismatch(es) in ${dir}/${slug}.mdx — filing AUDIT row`,
    )
  }

  try {
    appendFileSync(AUDIT_MD, rows.join(''))
    console.log(`article-internal-consistency-check: filed ${bySlug.size} AUDIT row(s) → plan/AUDIT.md`)
  } catch (err) {
    console.error(`article-internal-consistency-check: failed to write plan/AUDIT.md — ${err.message}`)
    process.exit(1)
  }

  process.exit(0)
}

// Gate mode: print mismatches and exit 1 if any found.
if (allMismatches.length === 0) {
  console.log('article-internal-consistency-check: clean — no mismatches found.')
  process.exit(0)
}

for (const m of allMismatches) {
  console.log(`MISMATCH ${m.dir}/${m.slug}.mdx — ${describeMismatch(m)}`)
}

console.error(
  `article-internal-consistency-check: ${allMismatches.length} mismatch(es) found — fix before committing.`,
)
process.exit(1)

} // end isMain
