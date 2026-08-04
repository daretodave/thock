import { describe, expect, it } from 'vitest'
import { NextRequest } from 'next/server'
import { caseNormalizeRedirect } from '../middleware'

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
