import { useEffect, useMemo, useRef, useState } from 'react'

import { prefersReducedMotion } from '../intro'
import './Loader.css'

type LoaderProps = {
  /** Called when the loader window starts opening onto the page. */
  onReveal: () => void
  /** Called when the window covers the whole viewport and the loader can be removed. */
  onDone: () => void
}

type Phase = 'loading' | 'opening' | 'expanding'

// The counter never runs faster than this, so the loading state stays readable on fast connections.
const MIN_LOADING_MS = 4200
const OPENING_MS = 450
const EXPAND_MS = 2200

function trackPageAssets(onProgress: (ratio: number) => void) {
  const images = Array.from(document.images)
  const tasks: Promise<unknown>[] = [
    document.fonts.ready,
    new Promise((resolve) =>
      document.readyState === 'complete' ? resolve(null) : window.addEventListener('load', resolve, { once: true }),
    ),
    ...images.map((image) =>
      image.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true })
            image.addEventListener('error', resolve, { once: true })
          }),
    ),
  ]
  let settled = 0
  tasks.forEach((task) =>
    task.finally(() => {
      settled += 1
      onProgress(settled / tasks.length)
    }),
  )
}

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2
// Accelerates towards the end, with a little initial speed so the start never looks stuck.
const easeExpand = (t: number) => 0.12 * t + 0.88 * t * t * t

/** Monotone cubic interpolation (Fritsch–Carlson): smooth and never overshoots. */
function monotoneCubic(xs: number[], ys: number[]) {
  const n = xs.length
  const d = xs.slice(1).map((x, i) => (ys[i + 1]! - ys[i]!) / (x - xs[i]!))
  const m = xs.map((_, i) => {
    if (i === 0) return d[0]!
    if (i === n - 1) return d[n - 2]!
    return d[i - 1]! * d[i]! <= 0 ? 0 : (d[i - 1]! + d[i]!) / 2
  })
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
      continue
    }
    const a = m[i]! / d[i]!
    const b = m[i + 1]! / d[i]!
    const s = a * a + b * b
    if (s > 9) {
      const k = 3 / Math.sqrt(s)
      m[i] = k * a * d[i]!
      m[i + 1] = k * b * d[i]!
    }
  }
  return (x: number) => {
    let i = 0
    while (i < n - 2 && x > xs[i + 1]!) i++
    const h = xs[i + 1]! - xs[i]!
    const t = (x - xs[i]!) / h
    const t2 = t * t
    const t3 = t2 * t
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i]! +
      (t3 - 2 * t2 + t) * h * m[i]! +
      (-2 * t3 + 3 * t2) * ys[i + 1]! +
      (t3 - t2) * h * m[i + 1]!
    )
  }
}

/**
 * The part of the page that is actually on screen. Usually the viewport, but when the page
 * is embedded in an iframe sized to the whole document (as in some previewers), the
 * viewport is the full page height and only part of it is visible; IntersectionObserver
 * reports that visible part in the page's own coordinates.
 */
type Stage = { top: number; height: number; width: number }

const viewportStage = (): Stage => ({ top: 0, height: window.innerHeight, width: window.innerWidth })

function measureStage(): Promise<Stage> {
  return new Promise((resolve) => {
    const target = document.querySelector('.home') ?? document.body
    const observer = new IntersectionObserver(([entry]) => {
      observer.disconnect()
      const rect = entry?.intersectionRect
      resolve(rect && rect.height > 40 ? { top: rect.top, height: rect.height, width: window.innerWidth } : viewportStage())
    })
    observer.observe(target)
  })
}

/** Page-coloured backdrop with a rounded-rectangle hole centred on the visible stage. */
function backdropClip(vw: number, vh: number, stage: Stage, w: number, h: number, r: number) {
  const x = (stage.width - w) / 2
  const y = stage.top + (stage.height - h) / 2
  const hole =
    r > 0
      ? `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}` +
        `H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
      : `M${x} ${y}H${x + w}V${y + h}H${x}Z`
  return `path(evenodd, "M0 0H${vw}V${vh}H0Z${hole}")`
}

/**
 * Ticks of the percentage badge: identical 1×8px bars placed evenly along a rounded
 * square and turned to face outwards, so every tick has the same size, corners included.
 */
function useRingTicks() {
  return useMemo(() => {
    const size = 33 // centre line of the 8px band inside the 41px ring
    const radius = 6
    const straight = size - 2 * radius
    const arc = (Math.PI / 2) * radius
    const perimeter = 4 * (straight + arc)
    const count = 44
    const origin = 4 // band centre line offset inside the 41px box
    const ticks: { x: number; y: number; angle: number }[] = []
    for (let i = 0; i < count; i++) {
      // Start from the middle of the top edge, clockwise.
      let s = (((i / count) * perimeter + straight / 2) % perimeter + perimeter) % perimeter
      let x = 0
      let y = 0
      let angle = 0
      for (let side = 0; side < 4; side++) {
        if (s <= straight) {
          const along = radius + s
          const points = [
            [along, 0, 0],
            [size, along, 90],
            [size - along, size, 180],
            [0, size - along, 270],
          ][side]!
          ;[x, y, angle] = points as [number, number, number]
          break
        }
        s -= straight
        if (s <= arc) {
          const theta = (s / radius) * (180 / Math.PI) // 0..90
          const centres = [
            [size - radius, radius],
            [size - radius, size - radius],
            [radius, size - radius],
            [radius, radius],
          ][side]!
          angle = side * 90 + theta
          const rad = ((angle - 90) * Math.PI) / 180
          x = centres[0]! + radius * Math.cos(rad)
          y = centres[1]! + radius * Math.sin(rad)
          break
        }
        s -= arc
      }
      ticks.push({ x: x + origin, y: y + origin, angle })
    }
    return ticks
  }, [])
}

export function Loader({ onReveal, onDone }: LoaderProps) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [percent, setPercent] = useState(0)
  const [stage, setStage] = useState<Stage>(viewportStage)
  const backdropRef = useRef<HTMLDivElement>(null)
  const ticks = useRingTicks()

  useEffect(() => {
    void measureStage().then(setStage)
  }, [])

  // Loading: follow the real asset progress, never faster than an eased minimum curve.
  useEffect(() => {
    const minDuration = prefersReducedMotion() ? 300 : MIN_LOADING_MS
    const startedAt = performance.now()
    let target = 0
    let shown = 0
    let frame = 0

    trackPageAssets((ratio) => {
      target = ratio * 100
    })

    const tick = (now: number) => {
      const cap = 100 * easeInOutSine(Math.min(1, (now - startedAt) / minDuration))
      shown = Math.max(shown, Math.min(target, cap))
      setPercent(Math.floor(shown))
      if (shown >= 100) {
        window.setTimeout(() => setPhase('opening'), 300)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Opening: the badge fades, leaving a window onto the page.
  useEffect(() => {
    if (phase !== 'opening') return
    const timer = window.setTimeout(() => setPhase('expanding'), OPENING_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  // Expanding: one continuous, accelerating motion through the storyboard sizes
  // 56×56 → 160×56 → 622×218 → full viewport.
  useEffect(() => {
    if (phase !== 'expanding') return
    onReveal()
    const backdrop = backdropRef.current
    if (!backdrop || prefersReducedMotion()) {
      onDone()
      return
    }
    const vw = window.innerWidth
    const vh = window.innerHeight
    const stops = [0, 0.2, 0.5, 1]
    const width = monotoneCubic(stops, [56, 160, 622, stage.width].map(Math.log))
    const height = monotoneCubic(stops, [56, 56, 218, stage.height].map(Math.log))

    let frame = 0
    let startedAt: number | null = null
    const tick = (now: number) => {
      startedAt ??= now
      const t = Math.min(1, (now - startedAt) / EXPAND_MS)
      const p = easeExpand(t)
      const w = Math.min(stage.width, Math.exp(width(p)))
      const h = Math.min(stage.height, Math.exp(height(p)))
      // Corners straighten out as the window meets the edges of the screen.
      const r = 8 * Math.min(1, (stage.width - w) / 60, (stage.height - h) / 60)
      backdrop.style.clipPath = backdropClip(vw, vh, stage, w, h, Math.max(0, r))
      if (t < 1) frame = requestAnimationFrame(tick)
      else onDone()
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [phase, stage, onReveal, onDone])

  // Keep the page still and at the top while the loader is up.
  useEffect(() => {
    const root = document.documentElement
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = ''
    }
  }, [])

  return (
    <div
      className={`loader loader--${phase}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${percent}%`}
      style={{ '--stage-top': `${stage.top}px`, '--stage-height': `${stage.height}px` } as React.CSSProperties}
    >
      <div
        ref={backdropRef}
        className="loader__backdrop"
        // Initial window; during the expansion the clip-path is driven frame by frame
        // (React leaves it alone as long as this value does not change).
        style={{ clipPath: backdropClip(window.innerWidth, window.innerHeight, stage, 56, 56, 8) }}
      />

      <div className="loader__scan" aria-hidden>
        <span className="loader__scan-glow" />
        <span className="loader__scan-line" />
        <span className="loader__scan-marker loader__scan-marker--left" />
        <span className="loader__scan-marker loader__scan-marker--right" />
      </div>

      <div className="loader__badge" aria-hidden>
        <svg className="loader__ring" width="41" height="41" viewBox="0 0 41 41">
          {ticks.map(({ x, y, angle }, index) => (
            <rect key={index} x={x - 0.5} y={y - 4} width="1" height="8" fill="white" transform={`rotate(${angle} ${x} ${y})`} />
          ))}
        </svg>
        <span className="loader__percent">{percent}%</span>
      </div>
    </div>
  )
}
