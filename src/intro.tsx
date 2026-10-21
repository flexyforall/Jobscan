import { createContext, useContext, useEffect, useState, type RefObject } from 'react'

/**
 * Intro stage of the page:
 * - `loading`: the loader covers the page;
 * - `revealing`: the loader window is opening, page content animates in;
 * - `done`: the loader is gone.
 */
export type IntroStage = 'loading' | 'revealing' | 'done'

export const IntroContext = createContext<IntroStage>('done')

export const useIntroStage = () => useContext(IntroContext)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** True once the element has been on screen (after the loader has started opening). */
export function useInView(ref: RefObject<Element | null>, threshold = 0.4): boolean {
  const stage = useIntroStage()
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || inView || stage === 'loading') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, inView, stage, threshold])

  return inView
}

/**
 * Adds `is-revealed` to every `[data-reveal]` element once it scrolls into view.
 * Entrance styles live in styles/motion.css; per-element delays use `--reveal-delay`.
 */
export function useRevealOnScroll(stage: IntroStage) {
  useEffect(() => {
    if (stage === 'loading') return
    const reveal = (element: Element) => {
      element.classList.add('is-revealed')
      // Drop the wipe's clip-path once it has played, so the element renders exactly as designed.
      if ((element as HTMLElement).dataset.reveal === 'wipe') {
        const settle = (event: Event) => {
          if ((event as TransitionEvent).propertyName !== 'clip-path') return
          element.classList.add('is-settled')
          element.removeEventListener('transitionend', settle)
        }
        element.addEventListener('transitionend', settle)
      }
    }
    // A fully clipped element (the `wipe` variant) never reports as intersecting,
    // so those are tracked through their parent.
    const targets = new Map<Element, Element[]>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          targets.get(entry.target)?.forEach(reveal)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 },
    )
    document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)').forEach((element) => {
      const target = element.dataset.reveal === 'wipe' && element.parentElement ? element.parentElement : element
      targets.set(target, [...(targets.get(target) ?? []), element])
      observer.observe(target)
    })
    return () => observer.disconnect()
  }, [stage])
}

/** Inline style helper for `--reveal-delay`. */
export const revealDelay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as React.CSSProperties
