import type { ReactNode } from 'react'

import './Badge.css'

type BadgeTone = 'sand' | 'success' | 'glass'

type BadgeProps = {
  tone: BadgeTone
  icon: string
  children: ReactNode
  className?: string
}

export function Badge({ tone, icon, children, className }: BadgeProps) {
  return (
    <span className={['badge', `badge--${tone}`, className].filter(Boolean).join(' ')}>
      <span className="badge__icon">
        <img src={icon} alt="" />
      </span>
      <span className="badge__label">{children}</span>
    </span>
  )
}
