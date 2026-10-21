import { useEffect, useRef, useState } from 'react'

import { prefersReducedMotion } from '../intro'
import './Loader.css'

type LoaderProps = {
  /** Called when the loader window starts opening onto the page. */
  onReveal: () => void
  /** Called when the window covers the whole viewport and the loader can be removed. */
  onDone: () => void
}

type Phase = 'loading' | 'opening' | 'expanding'

// The bar never fills faster than this, so the loading state stays readable on fast connections.
const MIN_LOADING_MS = 1600
const OPENING_MS = 350

function trackPageAssets(onProgress: (ratio: number) => void) {
  const images = Array.from(document.images)
  const tasks: Promise<unknown>[] = [
    document.fonts.ready,
    new Promise((resolve) => (document.readyState === 'complete' ? resolve(null) : window.addEventListener('load', resolve, { once: true }))),
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
  onProgress(0)
  tasks.forEach((task) =>
    task.finally(() => {
      settled += 1
      onProgress(settled / tasks.length)
    }),
  )
}

export function Loader({ onReveal, onDone }: LoaderProps) {
  const [phase, setPhase] = useState<Phase>('loading')
  const [percent, setPercent] = useState(0)
  const windowRef = useRef<HTMLDivElement>(null)

  // Loading: follow the real asset progress, smoothed and rate-limited.
  useEffect(() => {
    const reducedMotion = prefersReducedMotion()
    const maxRate = 100 / (reducedMotion ? 300 : MIN_LOADING_MS)
    let target = 0
    let shown = 0
    let last = performance.now()
    let frame = 0

    trackPageAssets((ratio) => {
      target = ratio * 100
    })

    const tick = (now: number) => {
      const dt = now - last
      last = now
      shown = Math.min(target, shown + maxRate * dt, shown + (target - shown) * 0.12 + 0.2)
      setPercent(Math.floor(shown))
      if (shown >= 100) {
        setPercent(100)
        window.setTimeout(() => setPhase('opening'), 200)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Opening: the square loses its fill and becomes a window onto the page.
  useEffect(() => {
    if (phase !== 'opening') return
    const timer = window.setTimeout(() => setPhase('expanding'), OPENING_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  // Expanding: square → 160×56 → 622×218 → full viewport (sizes from the storyboard).
  useEffect(() => {
    if (phase !== 'expanding') return
    onReveal()
    const element = windowRef.current
    if (!element || prefersReducedMotion()) {
      onDone()
      return
    }
    const full = { width: `${window.innerWidth}px`, height: `${window.innerHeight}px` }
    const easing = 'cubic-bezier(0.65, 0, 0.35, 1)'
    const animation = element.animate(
      [
        { width: '56px', height: '56px', borderRadius: '8px', offset: 0, easing },
        { width: '160px', height: '56px', borderRadius: '8px', offset: 0.22, easing },
        { width: '622px', height: '218px', borderRadius: '8px', offset: 0.55, easing },
        { ...full, borderRadius: '0px', offset: 1 },
      ],
      { duration: 2000, fill: 'forwards' },
    )
    animation.finished.then(onDone, () => undefined)
    return () => animation.cancel()
  }, [phase, onReveal, onDone])

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
    <div className={`loader loader--${phase}`} role="status" aria-live="polite" aria-label={`Loading ${percent}%`}>
      <div ref={windowRef} className="loader__window" />

      <div className="loader__scan" aria-hidden>
        <span className="loader__scan-glow" />
        <span className="loader__scan-line" />
        <span className="loader__scan-marker loader__scan-marker--left" />
        <span className="loader__scan-marker loader__scan-marker--right" />
      </div>

      <div className="loader__badge" aria-hidden>
        <svg className="loader__ring" width="41" height="41" viewBox="0 0 41 41" fill="none">
          <rect x="4" y="4" width="33" height="33" rx="2" stroke="white" strokeWidth="8" strokeDasharray="1 2" />
        </svg>
        <span className="loader__percent">{percent}%</span>
      </div>
    </div>
  )
}
