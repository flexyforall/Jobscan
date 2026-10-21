import { createElement, useLayoutEffect, useRef, useState, type HTMLAttributes } from 'react'

import { revealDelay } from '../intro'
import './LinesText.css'

type LinesTextProps = HTMLAttributes<HTMLElement> & {
  as?: 'p' | 'span' | 'h2' | 'h3'
  /** Plain text; it is split into the lines it actually wraps to. */
  text?: string
  /** Explicit lines (for text that is already broken into lines in the design). */
  lines?: string[]
  delay?: number
}

/**
 * Text whose lines rise into place one after another (each line slides up from
 * below its own baseline). Uses the shared `data-reveal` trigger.
 */
export function LinesText({ as = 'p', text = '', lines: givenLines, delay = 0, style, ...rest }: LinesTextProps) {
  const ref = useRef<HTMLElement>(null)
  const [measured, setMeasured] = useState<string[] | null>(null)
  const lines = givenLines ?? measured

  // Group the words by the line they render on, once the web fonts are in.
  useLayoutEffect(() => {
    if (givenLines) return
    let cancelled = false
    void document.fonts.ready.then(() => {
      const element = ref.current
      if (cancelled || !element) return
      const groups: string[][] = []
      let lastTop: number | null = null
      element.querySelectorAll<HTMLElement>('[data-word]').forEach((word) => {
        if (lastTop === null || Math.abs(word.offsetTop - lastTop) > 2) groups.push([])
        lastTop = word.offsetTop
        groups[groups.length - 1]!.push(word.textContent ?? '')
      })
      setMeasured(groups.map((group) => group.join(' ')))
    })
    return () => {
      cancelled = true
    }
  }, [givenLines, text])

  const content = lines
    ? lines.map((line, index) => (
        <span key={index} className="lines-text__line">
          <span className="lines-text__inner" style={{ '--line-index': index } as React.CSSProperties}>
            {line}
          </span>
        </span>
      ))
    : text.split(' ').map((word, index, words) => (
        <span key={index}>
          <span data-word>{word}</span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))

  return createElement(
    as,
    { ref, 'data-reveal': 'lines', style: { ...revealDelay(delay), ...style }, ...rest },
    content,
  )
}
