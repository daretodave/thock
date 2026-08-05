import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArticleOGContent, computeArticleOgLayout } from '../ArticleOG'

describe('<ArticleOGContent>', () => {
  it('renders the pillar kicker, title, lede, byline, and read time', () => {
    const { container } = render(
      <ArticleOGContent
        pillarLabel="Deep Dives"
        title="Why the Drop Holy Panda X feels the way it does"
        lede="A frankenswitch made factory."
        author="thock"
        readTime={12}
        titleFontSize={76}
      />,
    )
    const text = container.textContent ?? ''
    expect(text).toContain('Deep Dives')
    expect(text).toContain('Why the Drop Holy Panda X feels the way it does')
    expect(text).toContain('A frankenswitch made factory.')
    expect(text).toContain('by thock')
    expect(text).toContain('12 min read')
    expect(text).toContain('thock')
    expect(text).toContain('thock.xyz')
  })

  it('applies the supplied titleFontSize', () => {
    const { container } = render(
      <ArticleOGContent
        pillarLabel="Ideas"
        title="A long title that should trigger the smallest font size"
        lede="lede"
        author="thock"
        readTime={5}
        titleFontSize={58}
      />,
    )
    const titleDiv = container.querySelector('div[style*="font-size: 58px"]')
    expect(titleDiv).not.toBeNull()
  })
})

describe('computeArticleOgLayout', () => {
  it('picks the largest tier for short titles', () => {
    expect(computeArticleOgLayout('A short title', 'lede').titleFontSize).toBe(88)
  })

  it('steps down through the middle tiers', () => {
    expect(computeArticleOgLayout('x'.repeat(50), 'lede').titleFontSize).toBe(76)
    expect(computeArticleOgLayout('x'.repeat(70), 'lede').titleFontSize).toBe(66)
    expect(computeArticleOgLayout('x'.repeat(85), 'lede').titleFontSize).toBe(58)
  })

  it('drops to the smallest tier past 90 chars — the gmk-cyl-prussian-alert case', () => {
    const title =
      "GMK CYL Prussian Alert closed at KBDfans, capping the loudest GeekHack IC in the CYL sub-line's recent run"
    expect(title.length).toBeGreaterThan(90)
    expect(computeArticleOgLayout(title, 'lede').titleFontSize).toBe(48)
  })

  it('truncates the lede for titles at or under 90 chars (180-char cap)', () => {
    const lede = 'x'.repeat(200)
    const result = computeArticleOgLayout('a normal title', lede)
    expect(result.lede.length).toBeLessThanOrEqual(180)
    expect(result.lede.endsWith('…')).toBe(true)
  })

  it('truncates the lede tighter when the title exceeds 90 chars (130-char cap)', () => {
    const longTitle = 'x'.repeat(95)
    const lede = 'x'.repeat(200)
    const result = computeArticleOgLayout(longTitle, lede)
    expect(result.lede.length).toBeLessThanOrEqual(130)
    expect(result.lede.length).toBeLessThan(
      computeArticleOgLayout('a normal title', lede).lede.length,
    )
    expect(result.lede.endsWith('…')).toBe(true)
  })

  it('leaves the lede untouched when it fits', () => {
    const result = computeArticleOgLayout('a normal title', 'short lede')
    expect(result.lede).toBe('short lede')
  })
})
