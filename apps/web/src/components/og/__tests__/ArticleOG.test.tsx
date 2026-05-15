import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArticleOGContent } from '../ArticleOG'

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
