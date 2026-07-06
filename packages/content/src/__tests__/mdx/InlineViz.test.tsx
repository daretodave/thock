import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InlineViz, resolveAccent } from '../../mdx/InlineViz'

describe('InlineViz — MDX inline visualization component', () => {
  it('renders a trigger button with the diagram image', () => {
    const { container } = render(
      <InlineViz src="/article-viz/test/chart.svg" alt="A test chart" />,
    )
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/article-viz/test/chart.svg')
    expect(img?.getAttribute('alt')).toBe('A test chart')
    expect(container.querySelector('[role="dialog"]')).toBeNull()
  })

  it('opens the zoom dialog on trigger click and focuses the close button', () => {
    const { container, getByRole } = render(
      <InlineViz src="/article-viz/test/chart.svg" alt="A test chart" />,
    )
    fireEvent.click(getByRole('button', { name: 'Zoom diagram: A test chart' }))
    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog).not.toBeNull()
    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Close zoomed diagram',
    )
  })

  it('closes the dialog on Escape', () => {
    const { container, getByRole } = render(
      <InlineViz src="/article-viz/test/chart.svg" alt="A test chart" />,
    )
    fireEvent.click(getByRole('button', { name: 'Zoom diagram: A test chart' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(container.querySelector('[role="dialog"]')).toBeNull()
  })

  it('traps Tab focus on the close button — the only focusable element in the dialog', () => {
    const { getByRole } = render(
      <InlineViz src="/article-viz/test/chart.svg" alt="A test chart" />,
    )
    fireEvent.click(getByRole('button', { name: 'Zoom diagram: A test chart' }))
    const closeButton = getByRole('button', { name: 'Close zoomed diagram' })
    expect(document.activeElement).toBe(closeButton)

    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(closeButton)

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(closeButton)
  })

  it('renders a caption in both the inline figure and the zoomed dialog', () => {
    const { getAllByText, getByRole } = render(
      <InlineViz
        src="/article-viz/test/chart.svg"
        alt="A test chart"
        caption="Figure 1"
      />,
    )
    expect(getAllByText('Figure 1')).toHaveLength(1)
    fireEvent.click(getByRole('button', { name: 'Zoom diagram: A test chart' }))
    expect(getAllByText('Figure 1')).toHaveLength(2)
  })
})

describe('resolveAccent', () => {
  it('returns OKLCH value for named alias "coral"', () => {
    expect(resolveAccent('coral')).toBe('oklch(0.68 0.165 28)')
  })

  it('returns OKLCH value for named alias "amber"', () => {
    expect(resolveAccent('amber')).toBe('oklch(0.78 0.10 80)')
  })

  it('returns OKLCH value for named alias "bronze"', () => {
    expect(resolveAccent('bronze')).toBe('oklch(0.80 0.135 75)')
  })

  it('returns OKLCH value for named alias "bordeaux"', () => {
    expect(resolveAccent('bordeaux')).toBe('oklch(0.62 0.13 25)')
  })

  it('returns site accent token for "default" alias', () => {
    expect(resolveAccent('default')).toBe('var(--thock-accent)')
  })

  it('returns site accent token when accent is undefined', () => {
    expect(resolveAccent(undefined)).toBe('var(--thock-accent)')
  })

  it('passes through a raw oklch value with no alias match', () => {
    expect(resolveAccent('oklch(0.65 0.14 220)')).toBe('oklch(0.65 0.14 220)')
  })

  it('passes through a CSS var reference as raw color', () => {
    expect(resolveAccent('var(--my-accent)')).toBe('var(--my-accent)')
  })
})
