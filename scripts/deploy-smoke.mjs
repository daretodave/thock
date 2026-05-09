#!/usr/bin/env node
// scripts/deploy-smoke.mjs
//
// Production smoke. Runs after `pnpm deploy:check` (which only confirms
// the build state, not route health) — fetches one URL per pattern
// against the live site and exits non-zero on any non-2xx response.
//
// This closes the gap that let phase 4 ship a broken `/article/[slug]`
// to production: the local e2e walker hits `next start` with the full
// repo on disk; the bundled Netlify lambda doesn't, so dynamic routes
// 500'd while every local check stayed green.
//
//   exit 0  →  every probe returned 2xx; production is honest-to-god
//              serving the URL contract.
//   exit 1  →  one or more probes returned non-2xx (printed per URL).
//
// Usage:
//   pnpm deploy:smoke
//
// Optional env:
//   THOCK_SITE_URL    overrides the default `https://thock.netlify.app`
//                     (useful for branch deploys or local previews).

const SITE_URL = (
  process.env.THOCK_SITE_URL ?? 'https://thock-coral.vercel.app'
).replace(/\/+$/, '')

// One URL per pattern. The full canonical-URLs walker is local-only;
// this is a minimal post-push contract — every shape the contract
// promises must serve 2xx in production.
const PROBES = [
  { path: '/', label: 'home (static)' },
  { path: '/news', label: 'pillar landing' },
  { path: '/trends/tracker', label: 'trends tracker' },
  { path: '/article/trends-tracker-preview', label: 'article (dynamic)' },
  { path: '/tag/linear', label: 'tag (dynamic)' },
  { path: '/group-buys', label: 'group buys' },
  { path: '/sitemap.xml', label: 'sitemap' },
  { path: '/robots.txt', label: 'robots' },
  { path: '/feed.xml', label: 'feed (global)' },
  { path: '/feed/news.xml', label: 'feed (pillar)' },
]

const TIMEOUT_MS = 15_000

async function probe(probeSpec) {
  const url = `${SITE_URL}${probeSpec.path}`
  const start = Date.now()
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: ctrl.signal,
    })
    clearTimeout(t)
    const ms = Date.now() - start
    const ok = res.status >= 200 && res.status < 300
    return { ...probeSpec, url, status: res.status, ok, ms }
  } catch (err) {
    return {
      ...probeSpec,
      url,
      status: 0,
      ok: false,
      ms: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

console.log(`Smoking ${SITE_URL} (${PROBES.length} probes)...`)

const results = await Promise.all(PROBES.map(probe))

let failed = 0
for (const r of results) {
  const tag = r.ok ? 'PASS' : 'FAIL'
  const status = r.error ? `ERR ${r.error}` : `HTTP ${r.status}`
  console.log(
    `  [${tag}] ${status.padEnd(20)} ${r.ms.toString().padStart(5)}ms  ${r.path.padEnd(38)} ${r.label}`,
  )
  if (!r.ok) failed++
}

if (failed > 0) {
  console.log('')
  console.log(
    `${failed}/${results.length} probe(s) returned non-2xx. Production is not honoring the URL contract.`,
  )
  console.log(
    `Read the deploy log (\`pnpm deploy:check\` prints the admin URL) and patch the root cause before treating this phase as shipped.`,
  )
  process.exit(1)
}

console.log('')
console.log(`All ${results.length} probes returned 2xx. Production honors the URL contract.`)
process.exit(0)
