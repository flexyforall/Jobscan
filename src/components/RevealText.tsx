import { useEffect, useRef, useState } from 'react'

import { prefersReducedMotion, revealDelay } from '../intro'
import { ProgressiveBlur } from './ProgressiveBlur'
import './RevealText.css'

type RevealTextProps = {
  lines: string[]
  /** Start the colour sweep (it runs once). */
  start: boolean
  delay?: number
  /** Delay of the lines' rise-in (they show muted + blurred until the sweep). */
  enterDelay?: number
  /**
   * Blur over the end of the phrase, as placed in the Figma design: box size, vertical
   * offset from the line top, and how far its right edge sits past the end of the text.
   */
  endBlur: { width: number; height: number; offsetY: number; overhang: number }
  /** Sweep speed, px per millisecond. */
  speed?: number
}

// Width of the soft edge between revealed (black) and muted text.
const SOFT_EDGE = 140

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Heading reveal: the lines rise in muted with a blurred phrase ending (the state drawn in
 * Figma), then a soft front slowly sweeps them left to right, turning the text black; the
 * end blur dissolves as the front passes it.
 */
export function RevealText({ lines, start, delay = 0, enterDelay = 0, endBlur, speed = 0.24 }: RevealTextProps) {
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const blurRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!start || done) return
    if (prefersReducedMotion()) {
      setDone(true)
      return
    }

    // One continuous sweep across all lines, so the reveal never stops between them.
    const segments = lineRefs.current.map((line) => {
      const width = line?.getBoundingClientRect().width ?? 0
      return { line, length: width + SOFT_EDGE + 40 }
    })
    const total = segments.reduce((sum, segment) => sum + segment.length, 0)
    const duration = total / speed
    const last = segments[segments.length - 1]
    const lastWidth = last ? last.length - SOFT_EDGE - 40 : 0
    const blurLeft = lastWidth + endBlur.overhang - endBlur.width

    let frame = 0
    let startedAt: number | null = null
    const tick = (now: number) => {
      startedAt ??= now + delay
      const t = Math.min(1, Math.max(0, (now - startedAt) / duration))
      if (blurRef.current) blurRef.current.style.transition = 'none'
      let distance = easeInOut(t) * total
      for (const segment of segments) {
        const front = Math.min(segment.length, Math.max(0, distance)) - 40
        segment.line?.style.setProperty('--front', `${front}px`)
        if (segment === last && blurRef.current) {
          // Fade the end blur while the soft edge passes through it.
          const passed = (front - SOFT_EDGE * 0.5 - blurLeft) / (endBlur.width + SOFT_EDGE * 0.5)
          blurRef.current.style.opacity = String(Math.min(1, Math.max(0, 1 - passed)))
        }
        distance -= segment.length
      }
      if (t < 1) frame = requestAnimationFrame(tick)
      else setDone(true)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, done, delay, speed, endBlur.width, endBlur.overhang])

  return (
    <>
      {lines.map((text, index) => {
        const isLast = index === lines.length - 1
        return (
          <span
            key={index}
            ref={(element) => {
              lineRefs.current[index] = element
            }}
            // `done` is an attribute, not a class: the reveal observer adds `is-revealed`
            // to the class list, and a className update would wipe it.
            className="reveal-text"
            data-done={done || undefined}
            data-reveal="rise"
            style={revealDelay(enterDelay + index * 160)}
          >
            <span className="reveal-text__base">{text}</span>
            <span className="reveal-text__ink" aria-hidden>
              {text}
            </span>
            {isLast && !done && (
              <ProgressiveBlur
                ref={blurRef}
                className="reveal-text__blur"
                radius={10}
                data-reveal="fade"
                style={{
                  ...revealDelay(enterDelay + index * 160),
                  width: endBlur.width,
                  height: endBlur.height,
                  top: endBlur.offsetY,
                  right: -endBlur.overhang,
                }}
              />
            )}
          </span>
        )
      })}
    </>
  )
}
