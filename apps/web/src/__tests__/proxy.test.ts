import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { caseNormalizeRedirect, config } from '../proxy'

describe('caseNormalizeRedirect', () => {
  it('redirects a mixed-case /Article/<slug> path to lowercase', () => {
    const request = new NextRequest(
      'https://thock.xyz/Article/60-percent-layout-history',
    )
    const response = caseNormalizeRedirect(request)
    expect(response).not.toBeNull()
    expect(response?.status).toBe(308)
    expect(response?.headers.get('location')).toBe(
      'https://thock.xyz/article/60-percent-layout-history',
    )
  })

  it('redirects an uppercase /TAG/<slug> path to lowercase', () => {
    const request = new NextRequest('https://thock.xyz/TAG/abs')
    const response = caseNormalizeRedirect(request)
    expect(response).not.toBeNull()
    expect(response?.status).toBe(308)
    expect(response?.headers.get('location')).toBe('https://thock.xyz/tag/abs')
  })

  it('passes through an already-lowercase /article/<slug> path', () => {
    const request = new NextRequest(
      'https://thock.xyz/article/60-percent-layout-history',
    )
    expect(caseNormalizeRedirect(request)).toBeNull()
  })

  it('ignores unrelated routes regardless of case', () => {
    const request = new NextRequest('https://thock.xyz/Part/switch/gateron-oil-king')
    expect(caseNormalizeRedirect(request)).toBeNull()
  })
})

describe('proxy config.matcher', () => {
  // Kept narrow so lowercase page views never invoke a function
  // (Vercel Hobby CPU budget). Mirrors Next's matcher compilation.
  const re = new RegExp(`^${config.matcher[0]}$`)

  it('matches article/tag paths that carry an uppercase letter', () => {
    for (const p of ['/Article/foo', '/article/Foo', '/TAG/x', '/Tag']) {
      expect(re.test(p)).toBe(true)
    }
  })

  it('skips lowercase article/tag paths and every other route', () => {
    for (const p of ['/article/foo', '/tag/x', '/tag', '/', '/about', '/Articles', '/switches/Foo']) {
      expect(re.test(p)).toBe(false)
    }
  })
})
