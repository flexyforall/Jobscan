import { useEffect, useRef, useState } from 'react'

import { prefersReducedMotion, revealDelay } from '../intro'
import './RevealText.css'

type RevealTextProps = {
  lines: string[]
  /** Start the reveal (it runs once). */
  start: boolean
  delay?: number
  /** Delay of the lines' fade-in, before the reveal starts. */
  enterDelay?: number
  /** Reveal speed, px per millisecond. */
  speed?: number
}

// Width of the cross-fade between revealed and unrevealed text.
const SOFT_EDGE = 160
// Room around the glyphs for the blur to spread without being clipped by the mask box.
const BLEED = 24

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

/**
 * Heading reveal. Two layers of the same text cross-fade along a front that sweeps each
 * line left to right: ahead of it the text is muted and blurred, behind it black and
 * sharp — the blur clears and the colour comes in together.
 */
export function RevealText({ lines, start, delay = 0, enterDelay = 0, speed = 0.3 }: RevealTextProps) {
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!start || done) return
    if (prefersReducedMotion()) {
      setDone(true)
      return
    }

    // One continuous sweep across all lines, so the reveal never pauses between them.
    const segments = lineRefs.current.map((line) => ({
      line,
      length: (line?.getBoundingClientRect().width ?? 0) + SOFT_EDGE,
    }))
    const total = segments.reduce((sum, segment) => sum + segment.length, 0)
    const duration = total / speed

    let frame = 0
    let startedAt: number | null = null
    const tick = (now: number) => {
      startedAt ??= now + delay
      const t = Math.min(1, Math.max(0, (now - startedAt) / duration))
      let distance = easeInOut(t) * total
      for (const segment of segments) {
        const front = Math.min(segment.length, Math.max(0, distance))
        segment.line?.style.setProperty('--front', `${front}px`)
        distance -= segment.length
      }
      if (t < 1) frame = requestAnimationFrame(tick)
      else setDone(true)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, done, delay, speed])

  return (
    <>
      {lines.map((text, index) => (
        <span
          key={index}
          ref={(element) => {
            lineRefs.current[index] = element
          }}
          // `done` is an attribute, not a class: the reveal observer adds `is-revealed`
          // to the class list, and a className update would wipe it.
          className="reveal-text"
          data-done={done || undefined}
          data-reveal="fade"
          style={{ ...revealDelay(enterDelay + index * 120), '--bleed': `${BLEED}px` } as React.CSSProperties}
        >
          <span className="reveal-text__sizer">{text}</span>
          <span className="reveal-text__muted" aria-hidden>
            {text}
          </span>
          <span className="reveal-text__ink">{text}</span>
        </span>
      ))}
    </>
  )
}
