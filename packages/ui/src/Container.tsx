import type { HTMLAttributes, ReactElement, ReactNode } from 'react'

export type ContainerProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'header' | 'footer' | 'main' | 'article'
}

/**
 * Container — width-bounded wrapper that respects the editorial
 * grid. Max 1280px with 40px side margins (24px on mobile).
 */
export function Container({
  children,
  className = '',
  as = 'div',
  ...rest
}: ContainerProps): ReactElement {
  const Tag = as as 'div'
  return (
    <Tag
      {...rest}
      className={`mx-auto w-full max-w-[1280px] px-6 sm:px-10 ${className}`.trim()}
    >
      {children}
    </Tag>
  )
}
