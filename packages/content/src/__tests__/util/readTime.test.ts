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
})
