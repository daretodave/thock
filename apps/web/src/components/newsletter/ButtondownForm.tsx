import type { ReactElement } from 'react'

export type ButtondownFormVariant = 'footer' | 'full'

export type ButtondownFormProps = {
  /**
   * `'footer'` — compact, label above input + submit on the same row at md+;
   * `'full'`   — page-level form on /newsletter, larger input + stacked label.
   */
  variant?: ButtondownFormVariant
}

const ACTION = 'https://buttondown.com/api/emails/embed-subscribe/thock'
const REFER = 'https://buttondown.com/refer/thock'
const INPUT_ID_BY_VARIANT: Record<ButtondownFormVariant, string> = {
  footer: 'bd-email-footer',
  full: 'bd-email',
}

/**
 * Buttondown signup wrapper. The form's `action`, `method`, and
 * `<input name="email">` attributes are locked per /oversight
 * 2026-05-09 (Buttondown handle: thock); only the wrapping
 * Tailwind classes change between variants. The "Powered by
 * Buttondown" attribution is retained — Buttondown's free-tier
 * embed terms require it.
 *
 * Native HTML POST: submit navigates to Buttondown's confirmation
 * page on their domain. No client-side validation, no in-flight
 * loading state, no Next.js route handler.
 */
export function ButtondownForm({
  variant = 'full',
}: ButtondownFormProps): ReactElement {
  const inputId = INPUT_ID_BY_VARIANT[variant]
  const isFooter = variant === 'footer'

  return (
    <form
      data-testid={`buttondown-form-${variant}`}
      action={ACTION}
      method="post"
      className={
        isFooter
          ? 'embeddable-buttondown-form flex flex-col gap-2 md:items-end'
          : 'embeddable-buttondown-form flex flex-col gap-3'
      }
    >
      <label
        htmlFor={inputId}
        data-testid="newsletter-form-label"
        className={
          isFooter
            ? 'font-mono text-micro uppercase tracking-[0.08em] text-text-2'
            : 'font-mono text-small uppercase tracking-[0.08em] text-text-2'
        }
      >
        Enter your email
      </label>
      <div
        className={
          isFooter
            ? 'flex w-full max-w-sm gap-2 md:justify-end'
            : 'flex w-full flex-col gap-3 sm:flex-row'
        }
      >
        <input
          id={inputId}
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className={
            isFooter
              ? 'flex-1 border border-border bg-surface px-3 py-2 text-small text-text placeholder:text-text-4 focus:outline-none focus:border-border-hi'
              : 'flex-1 border border-border bg-surface px-4 py-3 text-body text-text placeholder:text-text-4 focus:outline-none focus:border-border-hi'
          }
        />
        <input
          type="submit"
          value="Subscribe"
          className={
            isFooter
              ? 'cursor-pointer border border-border-hi px-4 py-2 font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text transition-colors'
              : 'cursor-pointer border border-accent-mu px-6 py-3 font-mono text-small uppercase tracking-[0.08em] text-accent hover:text-accent-hi transition-colors'
          }
        />
      </div>
      <p
        className={
          isFooter
            ? 'font-mono text-micro uppercase tracking-[0.08em] text-text-4'
            : 'font-mono text-micro uppercase tracking-[0.08em] text-text-4'
        }
      >
        <a
          href={REFER}
          target="_blank"
          rel="noopener"
          className="hover:text-text-3"
        >
          Powered by Buttondown.
        </a>
      </p>
    </form>
  )
}
