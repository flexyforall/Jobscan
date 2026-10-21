import { useEffect, useState } from 'react'

import { prefersReducedMotion } from '../intro'

type CountUpProps = {
  value: number
  start: boolean
  delay?: number
  duration?: number
  suffix?: string
}

/** Counts from 0 to `value` once `start` becomes true. Renders the final value without JS motion. */
export function CountUp({ value, start, delay = 0, duration = 1200, suffix = '' }: CountUpProps) {
  const [current, setCurrent] = useState(prefersReducedMotion() ? value : 0)

  useEffect(() => {
    if (!start || prefersReducedMotion()) return
    let frame = 0
    let startedAt: number | null = null
    const tick = (now: number) => {
      startedAt ??= now + delay
      const t = Math.min(1, Math.max(0, (now - startedAt) / duration))
      const eased = 1 - Math.pow(1 - t, 3)
      setCurrent(Math.round(value * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, value, delay, duration])

  return (
    <>
      {current}
      {suffix}
    </>
  )
}
