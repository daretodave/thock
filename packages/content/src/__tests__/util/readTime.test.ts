import { describe, expect, it } from 'vitest'
import { computeReadTime } from '../../util/readTime'

describe('computeReadTime', () => {
  it('floors at 1 minute for short bodies', () => {
    expect(computeReadTime('A short hello.')).toBe(1)
  })

  it('rounds up via Math.ceil', () => {
    const body = Array.from({ length: 401 }).map(() => 'word').join(' ')
    expect(computeReadTime(body)).toBe(3) // 401 / 200 = 2.005 -> ceil 3
  })

  it('strips fenced code blocks before counting', () => {
    const body = '```\n' + Array.from({ length: 1000 }).map(() => 'x').join(' ') +
      '\n```\nA tiny line.'
    expect(computeReadTime(body)).toBe(1)
  })

  it('strips MDX/JSX component tags', () => {
    const body = '<PartReference id="x" /><Mono>NK87</Mono> a real word here.'
    expect(computeReadTime(body)).toBe(1)
  })

  it('counts caption="..." text since it renders as a visible figcaption', () => {
    const filler = Array.from({ length: 199 }).map(() => 'word').join(' ')
    const captionWords = Array.from({ length: 5 }).map(() => 'more').join(' ')
    const body = `${filler} <InlineViz caption="${captionWords}" data={data} description="d" />`
    expect(computeReadTime(body)).toBe(2) // 199 + 5 = 204 -> ceil(204/200) = 2
    expect(computeReadTime(filler)).toBe(1) // without the caption words, stays at 1
  })

  it('counts Callout title="..." text since it renders as a visible heading', () => {
    const filler = Array.from({ length: 199 }).map(() => 'word').join(' ')
    const titleWords = Array.from({ length: 5 }).map(() => 'more').join(' ')
    const body = `${filler} <Callout type="note" title="${titleWords}">body</Callout>`
    expect(computeReadTime(body)).toBe(2) // 199 + 5 = 204 -> ceil(204/200) = 2
    expect(computeReadTime(filler)).toBe(1) // without the title words, stays at 1
  })

  it('counts PullQuote attribution="..." text since it renders as a visible footer', () => {
    const filler = Array.from({ length: 199 }).map(() => 'word').join(' ')
    const attributionWords = Array.from({ length: 5 }).map(() => 'more').join(' ')
    const body = `${filler} <PullQuote attribution="${attributionWords}">quote</PullQuote>`
    expect(computeReadTime(body)).toBe(2) // 199 + 5 = 204 -> ceil(204/200) = 2
    expect(computeReadTime(filler)).toBe(1) // without the attribution words, stays at 1
  })

  it('strips table pipes and separator rows without dropping cell text', () => {
    const filler = Array.from({ length: 195 }).map(() => 'word').join(' ')
    const table = '| Alpha beta | Gamma delta |\n|---|---|\n| Five real words here now | Six more words right here |'
    // cell text: "Alpha beta" + "Gamma delta" + "Five real words here now" + "Six more words right here" = 21 words
    const body = `${filler} ${table}`
    expect(computeReadTime(body)).toBe(2) // 195 + 21 = 216 -> ceil(216/200) = 2
    expect(computeReadTime(filler)).toBe(1) // without the table, stays at 1
  })

  it('does not count the separator row itself as words', () => {
    const filler = Array.from({ length: 200 }).map(() => 'word').join(' ')
    const body = `${filler}\n\n|---|---|---|\n`
    // separator row alone (no header/body cells) must contribute zero words
    expect(computeReadTime(body)).toBe(1)
  })
})
