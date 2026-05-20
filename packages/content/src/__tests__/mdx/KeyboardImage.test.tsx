import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KeyboardImage } from '../../mdx/KeyboardImage'

describe('KeyboardImage — MDX image wrapper component', () => {
  it('renders an <img> with the given src and alt', () => {
    const { container } = render(
      <KeyboardImage src="/hero-art/test.svg" alt="A test keyboard" />,
    )
    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/hero-art/test.svg')
    expect(img?.getAttribute('alt')).toBe('A test keyboard')
  })

  it('renders a <figcaption> with data-testid when caption is provided', () => {
    const { container, getByText } = render(
      <KeyboardImage
        src="/hero-art/test.svg"
        alt="A keyboard"
        caption="The PCB layout"
      />,
    )
    const fig = container.querySelector('[data-testid="article-figcaption"]')
    expect(fig).not.toBeNull()
    expect(getByText('The PCB layout')).not.toBeNull()
  })

  it('renders no <figcaption> when caption is omitted', () => {
    const { container } = render(
      <KeyboardImage src="/hero-art/test.svg" alt="A keyboard" />,
    )
    expect(container.querySelector('figcaption')).toBeNull()
  })

  it('forwards width and height to <img> when provided', () => {
    const { container } = render(
      <KeyboardImage
        src="/hero-art/test.svg"
        alt="A keyboard"
        width={1200}
        height={750}
      />,
    )
    const img = container.querySelector('img')
    expect(img?.getAttribute('width')).toBe('1200')
    expect(img?.getAttribute('height')).toBe('750')
  })

  it('omits width and height attributes when not provided', () => {
    const { container } = render(
      <KeyboardImage src="/hero-art/test.svg" alt="A keyboard" />,
    )
    const img = container.querySelector('img')
    expect(img?.hasAttribute('width')).toBe(false)
    expect(img?.hasAttribute('height')).toBe(false)
  })
})
