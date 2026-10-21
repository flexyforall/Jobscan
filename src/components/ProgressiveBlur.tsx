import type { CSSProperties } from 'react'

import './ProgressiveBlur.css'

type Direction = 'to right' | 'to left' | 'to bottom' | 'to top'

type ProgressiveBlurProps = {
  className?: string
  style?: CSSProperties
  /** Figma background-blur radius reached at the far edge. */
  radius: number
  /** Direction in which the blur grows, from 0 to `radius`. */
  direction?: Direction
  /** Number of stacked backdrop layers used to approximate the ramp. */
  steps?: number
}

// Figma "progressive" background blur: CSS has no native equivalent, so it is
// approximated with stacked backdrop-filter layers, each masked to its own band.
// A Figma blur radius R renders like CSS `blur(R / 2)` (checked against the Figma export).
export function ProgressiveBlur({
  className,
  style,
  radius,
  direction = 'to right',
  steps = 6,
}: ProgressiveBlurProps) {
  const layers = Array.from({ length: steps }, (_, index) => {
    const step = 100 / steps
    const start = Math.max(0, (index - 1) * step)
    const peak = index * step
    const end = Math.min(100, (index + 1) * step)
    const mask =
      index === steps - 1
        ? `linear-gradient(${direction}, transparent ${start}%, #000 ${peak}%)`
        : `linear-gradient(${direction}, transparent ${start}%, #000 ${peak}%, #000 ${end}%, transparent ${Math.min(100, end + step)}%)`
    const blur = (radius / 2) * ((index + 1) / steps)
    return { mask, blur }
  })

  return (
    <div className={['progressive-blur', className].filter(Boolean).join(' ')} style={style} aria-hidden>
      {layers.map(({ mask, blur }, index) => (
        <div
          key={index}
          className="progressive-blur__layer"
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      ))}
    </div>
  )
}
