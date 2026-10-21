import type { HTMLAttributes, ReactNode } from 'react'

import './Badge.css'

type BadgeTone = 'sand' | 'success' | 'glass'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone: BadgeTone
  icon: string
  children: ReactNode
}

export function Badge({ tone, icon, children, className, ...rest }: BadgeProps) {
  return (
    <span className={['badge', `badge--${tone}`, className].filter(Boolean).join(' ')} {...rest}>
      <span className="badge__icon">
        <img src={icon} alt="" />
      </span>
      <span className="badge__label">{children}</span>
    </span>
  )
}
