import { describe, expect, it } from 'vitest'
import { GET as getGlobalFeed } from '../feed.xml/route'
import { GET as getPillarFeed } from '../feed/[pillar]/route'

const xmlOf = async (response: Response) => {
  expect(response.headers.get('content-type')).toMatch(/application\/rss\+xml/)
  return response.text()
}

describe('global feed.xml', () => {
  it('returns RSS 2.0 with at least one item', async () => {
    const xml = await xmlOf(getGlobalFeed())
    expect(xml).toContain('<rss version="2.0">')
    expect(xml).toContain('<channel>')
    expect(xml).toContain('<item>')
  })
})

describe('pillar feed.xml', () => {
  const call = async (pillar: string) => {
    const req = new Request(`http://localhost/feed/${pillar}`)
    return getPillarFeed(req, {
      params: Promise.resolve({ pillar }),
    })
  }

  it('returns RSS for a known pillar', async () => {
    const res = await call('news.xml')
    expect(res.status).toBe(200)
    const xml = await xmlOf(res)
    expect(xml).toContain('<rss version="2.0">')
  })

  it('returns RSS without the .xml suffix too', async () => {
    const res = await call('news')
    expect(res.status).toBe(200)
  })

  it('404s on an unknown pillar', async () => {
    const res = await call('unknown.xml')
    expect(res.status).toBe(404)
  })
})
