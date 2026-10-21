import { useEffect, useRef, useState } from 'react'

import { prefersReducedMotion } from '../intro'
import { ProgressiveBlur } from './ProgressiveBlur'
import './RevealText.css'

type RevealTextProps = {
  lines: string[]
  /** Start the reveal (it runs once). */
  start: boolean
  delay?: number
  /** Blur zone ahead of the reveal front, sized like the blur boxes in the Figma design. */
  blur: { width: number; height: number; offsetY: number }
  /** Reveal speed, px per millisecond. */
  speed?: number
}

/**
 * Heading reveal: the text starts muted, the reveal front sweeps each line left to right
 * turning it black, and the part that is not revealed yet stays blurred.
 */
export function RevealText({ lines, start, delay = 0, blur, speed = 0.6 }: RevealTextProps) {
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!start || done) return
    if (prefersReducedMotion()) {
      setDone(true)
      return
    }

    let cancelled = false
    const animations: Animation[] = []

    const run = async () => {
      let offset = delay
      for (const line of lineRefs.current) {
        if (!line) continue
        const width = line.getBoundingClientRect().width
        const from = -40
        const to = width + blur.width + 40
        const animation = line.animate([{ '--front': `${from}px` }, { '--front': `${to}px` }], {
          duration: (to - from) / speed,
          delay: offset,
          easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
          fill: 'both',
        })
        animations.push(animation)
        offset = 0
        await animation.finished.catch(() => undefined)
        if (cancelled) return
      }
      setDone(true)
    }
    void run()

    return () => {
      cancelled = true
      animations.forEach((animation) => animation.cancel())
    }
  }, [start, done, delay, blur.width, speed])

  return (
    <>
      {lines.map((text, index) => (
        <span
          key={index}
          ref={(element) => {
            lineRefs.current[index] = element
          }}
          className={`reveal-text${done ? ' reveal-text--done' : ''}`}
        >
          <span className="reveal-text__base">{text}</span>
          <span className="reveal-text__ink" aria-hidden>
            {text}
          </span>
          {!done && (
            <>
              <ProgressiveBlur
                className="reveal-text__blur"
                radius={10}
                style={{ width: blur.width, height: blur.height, top: blur.offsetY }}
              />
              <span className="reveal-text__blur-tail" style={{ left: `calc(var(--front) + ${blur.width}px)`, height: blur.height, top: blur.offsetY }} />
            </>
          )}
        </span>
      ))}
    </>
  )
}
