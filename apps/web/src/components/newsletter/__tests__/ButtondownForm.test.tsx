import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ButtondownForm } from '../ButtondownForm'

describe('<ButtondownForm>', () => {
  it('renders the locked Buttondown action + method on the footer variant', () => {
    render(<ButtondownForm variant="footer" />)
    const form = screen.getByTestId('buttondown-form-footer')
    expect(form).toHaveAttribute(
      'action',
      'https://buttondown.com/api/emails/embed-subscribe/thock',
    )
    expect(form).toHaveAttribute('method', 'post')
  })

  it('renders the locked Buttondown action + method on the full variant', () => {
    render(<ButtondownForm variant="full" />)
    const form = screen.getByTestId('buttondown-form-full')
    expect(form).toHaveAttribute(
      'action',
      'https://buttondown.com/api/emails/embed-subscribe/thock',
    )
    expect(form).toHaveAttribute('method', 'post')
  })

  it('keeps the email input name + type unchanged', () => {
    render(<ButtondownForm variant="full" />)
    const input = screen
      .getByTestId('buttondown-form-full')
      .querySelector('input[type="email"]') as HTMLInputElement | null
    expect(input).not.toBeNull()
    expect(input!.name).toBe('email')
    expect(input!.id).toBe('bd-email')
  })

  it('uses a variant-scoped input id so footer + full can co-exist on /newsletter', () => {
    render(
      <>
        <ButtondownForm variant="footer" />
        <ButtondownForm variant="full" />
      </>,
    )
    const ids = Array.from(document.querySelectorAll('input[type="email"]')).map(
      (el) => (el as HTMLInputElement).id,
    )
    expect(ids).toContain('bd-email-footer')
    expect(ids).toContain('bd-email')
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('renders a Subscribe submit input with the locked label', () => {
    render(<ButtondownForm variant="full" />)
    const submit = screen
      .getByTestId('buttondown-form-full')
      .querySelector('input[type="submit"]') as HTMLInputElement | null
    expect(submit).not.toBeNull()
    expect(submit!.value).toBe('Subscribe')
  })

  it('renders the "Powered by Buttondown" attribution with the refer link', () => {
    render(<ButtondownForm variant="full" />)
    const attribution = screen.getByText(/powered by buttondown/i)
    const link = attribution.closest('a')
    expect(link).not.toBeNull()
    expect(link).toHaveAttribute('href', 'https://buttondown.com/refer/thock')
    expect(link).toHaveAttribute('target', '_blank')
  })
})
