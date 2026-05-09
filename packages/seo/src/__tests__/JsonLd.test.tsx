import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { JsonLd } from '../JsonLd'

describe('<JsonLd>', () => {
  it('serializes a single graph object into a script tag', () => {
    const { container } = render(
      <JsonLd graph={{ '@context': 'https://schema.org', '@type': 'WebSite' }} />,
    )
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    expect(JSON.parse(script!.innerHTML)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
    })
  })

  it('serializes an array of graphs into a single script', () => {
    const { container } = render(
      <JsonLd
        graph={[
          { '@context': 'https://schema.org', '@type': 'WebSite' },
          { '@context': 'https://schema.org', '@type': 'BreadcrumbList' },
        ]}
      />,
    )
    const scripts = container.querySelectorAll(
      'script[type="application/ld+json"]',
    )
    expect(scripts.length).toBe(1)
    expect(Array.isArray(JSON.parse(scripts[0]!.innerHTML))).toBe(true)
  })
})
