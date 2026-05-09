import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrendDirectionGlyph } from '../TrendDirectionGlyph'

describe('<TrendDirectionGlyph>', () => {
  it.each(['up', 'down', 'flat'] as const)(
    'renders the %s direction with a data attribute',
    (dir) => {
      render(<TrendDirectionGlyph dir={dir} />)
      const glyph = screen.getByTestId('trend-direction-glyph')
      expect(glyph.getAttribute('data-dir')).toBe(dir)
    },
  )

  it('forwards size to width and height', () => {
    render(<TrendDirectionGlyph dir="up" size={20} />)
    const glyph = screen.getByTestId('trend-direction-glyph')
    expect(glyph.getAttribute('width')).toBe('20')
    expect(glyph.getAttribute('height')).toBe('20')
  })

  it('uses currentColor for stroke so callers control the tone', () => {
    render(<TrendDirectionGlyph dir="down" />)
    const glyph = screen.getByTestId('trend-direction-glyph')
    expect(glyph.getAttribute('stroke')).toBe('currentColor')
  })

  it('honors an aria-label override', () => {
    render(<TrendDirectionGlyph dir="up" ariaLabel="rising 12%" />)
    const glyph = screen.getByTestId('trend-direction-glyph')
    expect(glyph.getAttribute('aria-label')).toBe('rising 12%')
  })
})
