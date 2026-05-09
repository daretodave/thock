import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AboutBody } from '../AboutBody'

describe('<AboutBody>', () => {
  it('renders all four locked sections', () => {
    render(<AboutBody />)
    expect(screen.getByTestId('about-section-pillars')).toBeInTheDocument()
    expect(screen.getByTestId('about-section-voice')).toBeInTheDocument()
    expect(screen.getByTestId('about-section-trends')).toBeInTheDocument()
    expect(screen.getByTestId('about-section-disclosure')).toBeInTheDocument()
  })

  it('links to the five pillars in the pillars section', () => {
    render(<AboutBody />)
    const pillars = screen.getByTestId('about-section-pillars')
    const links = Array.from(pillars.querySelectorAll('a')).map((a) =>
      a.getAttribute('href'),
    )
    for (const href of [
      '/news',
      '/trends',
      '/ideas',
      '/deep-dives',
      '/guides',
    ]) {
      expect(links).toContain(href)
    }
  })

  it('links to /trends/tracker from the trends section', () => {
    render(<AboutBody />)
    const trends = screen.getByTestId('about-section-trends')
    const hrefs = Array.from(trends.querySelectorAll('a')).map((a) =>
      a.getAttribute('href'),
    )
    expect(hrefs).toContain('/trends/tracker')
  })

  it('links to /sources from the disclosure section', () => {
    render(<AboutBody />)
    const disclosure = screen.getByTestId('about-section-disclosure')
    const hrefs = Array.from(disclosure.querySelectorAll('a')).map((a) =>
      a.getAttribute('href'),
    )
    expect(hrefs).toContain('/sources')
  })
})
