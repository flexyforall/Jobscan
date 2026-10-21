import { icons } from '../assets'
import './KeywordIcon.css'

export type KeywordStatus = 'found' | 'partial' | 'missing'

const src: Record<KeywordStatus, string> = {
  found: icons.keywordFound,
  partial: icons.keywordPartial,
  missing: icons.keywordMissing,
}

export function KeywordIcon({ status }: { status: KeywordStatus }) {
  return (
    <span className="keyword-icon">
      <img className={`keyword-icon__glyph keyword-icon__glyph--${status}`} src={src[status]} alt="" />
    </span>
  )
}
