import { afterEach, describe, expect, it, vi } from 'vitest'
import { memo, __resetForTests } from '../../loaders/memo'

describe('memo', () => {
  afterEach(() => __resetForTests())

  it('calls the loader function exactly once across repeated invocations', () => {
    const fn = vi.fn().mockReturnValue([1, 2, 3])
    const memoized = memo<number[]>('once-key', fn)

    memoized()
    memoized()
    memoized()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('returns the same (identical) object on subsequent calls', () => {
    const obj = { slug: 'gateron-oil-king' }
    const fn = vi.fn().mockReturnValue(obj)
    const memoized = memo<typeof obj>('ref-key', fn)

    const first = memoized()
    const second = memoized()

    expect(second).toBe(first)
  })

  it('__resetForTests causes the loader to be called again on the next invocation', () => {
    const fn = vi.fn().mockReturnValue(['a'])
    const memoized = memo<string[]>('reset-key', fn)

    memoized()
    expect(fn).toHaveBeenCalledTimes(1)

    __resetForTests()

    memoized()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('independent keys do not share cached values', () => {
    const fn1 = vi.fn().mockReturnValue('value-a')
    const fn2 = vi.fn().mockReturnValue('value-b')
    const m1 = memo<string>('key-alpha', fn1)
    const m2 = memo<string>('key-beta', fn2)

    expect(m1()).toBe('value-a')
    expect(m2()).toBe('value-b')

    m1()
    expect(fn2).toHaveBeenCalledTimes(1)
  })

  it('__resetForTests clears all keys simultaneously', () => {
    const fn1 = vi.fn().mockReturnValue('x')
    const fn2 = vi.fn().mockReturnValue('y')
    const m1 = memo<string>('all-a', fn1)
    const m2 = memo<string>('all-b', fn2)

    m1()
    m2()
    __resetForTests()
    m1()
    m2()

    expect(fn1).toHaveBeenCalledTimes(2)
    expect(fn2).toHaveBeenCalledTimes(2)
  })
})
