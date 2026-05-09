import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Sparkline } from '../Sparkline'

describe('<Sparkline>', () => {
  it('renders nothing for fewer than 2 values', () => {
    const { container } = render(<Sparkline values={[]} />)
    expect(container.firstChild).toBeNull()

    const single = render(<Sparkline values={[5]} />)
    expect(single.container.firstChild).toBeNull()
  })

  it('emits a polyline with N points for N values', () => {
    render(<Sparkline values={[1, 2, 3, 4]} />)
    const svg = screen.getByTestId('sparkline')
    const polyline = svg.querySelector('polyline')
    expect(polyline).not.toBeNull()
    const points = polyline!.getAttribute('points') ?? ''
    expect(points.trim().split(/\s+/)).toHaveLength(4)
  })

  it('applies the tone class so currentColor inherits the right hue', () => {
    render(<Sparkline values={[1, 2, 3]} tone="up" />)
    const svg = screen.getByTestId('sparkline')
    expect(svg.getAttribute('class')).toContain('text-up')
    expect(svg.getAttribute('data-tone')).toBe('up')
  })

  it('forwards width and height props to the SVG', () => {
    render(<Sparkline values={[1, 2]} w={100} h={30} />)
    const svg = screen.getByTestId('sparkline')
    expect(svg.getAttribute('width')).toBe('100')
    expect(svg.getAttribute('height')).toBe('30')
  })

  it('uses a flat horizontal line when all values are equal', () => {
    render(<Sparkline values={[5, 5, 5]} tone="flat" />)
    const polyline = screen
      .getByTestId('sparkline')
      .querySelector('polyline')!
    const ys = (polyline.getAttribute('points') ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => Number(p.split(',')[1]))
    const allEqual = ys.every((y) => y === ys[0])
    expect(allEqual).toBe(true)
  })
})
