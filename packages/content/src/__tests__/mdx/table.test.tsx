import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mdxComponents } from '../../mdx/components'

/**
 * Regression guard for the MDX-table bug surfaced 2026-05-14
 * ("/article/switch-films-worth-it has a table, but the table
 * doesn't render. does any other page have a table that doesn't
 * render? but also fix it"). Root cause: remark-gfm was not
 * registered with MDXRemote, so GFM-flavor markdown tables
 * stayed as raw `|`-pipe text in the article body. The fix
 * paired three things — install remark-gfm, pass it via
 * mdxOptions.remarkPlugins, and add styled table elements to
 * `mdxComponents` so the rendered tables match the editorial
 * ductus instead of inheriting browser defaults. This test
 * locks in the third leg so a future refactor of the
 * components map cannot quietly delete the table mappings.
 */
describe('MDX components — table family', () => {
  it('registers table, thead, tbody, tr, th, td', () => {
    const c = mdxComponents as Record<string, unknown>
    expect(typeof c.table).toBe('function')
    expect(typeof c.thead).toBe('function')
    expect(typeof c.tbody).toBe('function')
    expect(typeof c.tr).toBe('function')
    expect(typeof c.th).toBe('function')
    expect(typeof c.td).toBe('function')
  })

  it('wraps tables in a horizontal-scroll shell so wide tables do not blow past 60ch', () => {
    const Table = mdxComponents.table
    const { container } = render(
      <Table>
        <tbody>
          <tr>
            <td>x</td>
          </tr>
        </tbody>
      </Table>,
    )
    const wrapper = container.firstChild as HTMLElement | null
    expect(wrapper).not.toBeNull()
    expect(wrapper!.className).toContain('overflow-x-auto')
    const table = container.querySelector('table')
    expect(table).not.toBeNull()
    expect(table!.className).toContain('border-collapse')
  })

  it('renders th as a mono-caps eyebrow consistent with the rest of the site', () => {
    const Th = mdxComponents.th
    const { container } = render(<Th>Switch type</Th>)
    const th = container.querySelector('th')
    expect(th).not.toBeNull()
    expect(th!.getAttribute('scope')).toBe('col')
    expect(th!.className).toContain('font-mono')
    expect(th!.className).toContain('uppercase')
    expect(th!.className).toContain('tracking-[0.08em]')
  })

  it('renders td with the serif body face used in the article column', () => {
    const Td = mdxComponents.td
    const { container } = render(<Td>Audible seam rattle reduction</Td>)
    const td = container.querySelector('td')
    expect(td).not.toBeNull()
    expect(td!.className).toContain('font-serif')
    expect(td!.className).toContain('text-text-2')
  })
})
