import type { CSSProperties } from 'react'

import { icons } from '../assets'
import './ResumeDocument.css'

type Line =
  | { kind: 'label'; text: string }
  | { kind: 'title'; text: string }
  | { kind: 'body'; text: string }
  | { kind: 'meta'; text: string }
  | { kind: 'gap'; size?: 'body' | 'meta' }

const ROLE = 'Senior Product Manager · Stripe, 2020–Present'

const lines: Line[] = [
  { kind: 'label', text: 'Professional Summary' },
  { kind: 'body', text: 'Product leader with 8+ years driving cross-functional product strategy across B2B SaaS platforms.' },
  {
    kind: 'body',
    text: 'Experienced in Lead the UI design with the accountability of the design system, collaborated with product and development teams on core projects to improve product interfaces and experiences.',
  },
  { kind: 'gap' },
  { kind: 'label', text: 'Experience' },
  { kind: 'title', text: ROLE },
  { kind: 'body', text: 'Enterprise name' },
  { kind: 'meta', text: 'Aug 2013 - Aug 2018 - 5 years, Paris' },
  { kind: 'body', text: 'Defined product strategy for payments infrastructure used by 2.4M+ merchants globally.' },
  { kind: 'body', text: 'Ran discovery and prioritization to reduce checkout abandonment by 34% through A/B testing and data analysis.' },
  { kind: 'body', text: '· Owned the roadmap for 3 product lines generating $40M ARR' },
  { kind: 'body', text: '· Led a cross-functional team of 12 engineers & designers' },
  { kind: 'gap' },
  { kind: 'title', text: ROLE },
  { kind: 'body', text: 'Enterprise name' },
  { kind: 'meta', text: 'Aug 2012 - jul 2013 - 1 year, Paris' },
  { kind: 'body', text: 'Led product discovery for mobile UI applications across Orange R&D departement, BNP Paribas, La Poste, Le Cned' },
  { kind: 'gap' },
  { kind: 'title', text: ROLE },
  { kind: 'body', text: 'Enterprise name' },
  { kind: 'meta', text: 'Sept 2010 - jul 2012 - 2 years, Paris' },
  {
    kind: 'body',
    text: 'Defined product vision for print and web applications for Pau Brasil, Renault, Le théatre du Mantois, La mairie de Mantes la Ville...',
  },
  { kind: 'gap' },
  { kind: 'label', text: 'education' },
  { kind: 'title', text: 'Bachelor European in Graphic Design' },
  { kind: 'body', text: 'School name' },
  { kind: 'meta', text: '2009 - 2010, Bagnolet' },
  { kind: 'gap', size: 'meta' },
  { kind: 'title', text: 'BTS Communication Visuelle option Multimédia' },
  { kind: 'body', text: 'School name' },
  { kind: 'meta', text: '2007 - 2009, Bagnolet' },
]

type ResumeDocumentProps = {
  /** `regular` = hero preview, `compact` = autopilot "Scan" preview (both sizes from Figma). */
  size?: 'regular' | 'compact'
  className?: string
  style?: CSSProperties
}

export function ResumeDocument({ size = 'regular', className, style }: ResumeDocumentProps) {
  return (
    <article
      className={['resume-document', `resume-document--${size}`, className].filter(Boolean).join(' ')}
      style={style}
      aria-label="Resume preview"
    >
      <div className="resume-document__body">
        <header className="resume-document__header">
          <p className="resume-document__name">Alexandra Chen</p>
          <div className="resume-document__contact">
            <p>Senior Product Manager · San Francisco, CA</p>
            <div className="resume-document__links">
              <p>alex.chen@email.com</p>
              <p>linkedin.com/in/alexchen</p>
              <p>(415) 555-0192</p>
            </div>
          </div>
        </header>

        <div className="resume-document__rule">
          <img src={size === 'compact' ? icons.resumeLineSmall : icons.resumeLine} alt="" />
        </div>

        <div className="resume-document__content">
          {lines.map((line, index) =>
            line.kind === 'gap' ? (
              <p key={index} className={`resume-document__line resume-document__line--gap-${line.size ?? 'body'}`}>
                {'​'}
              </p>
            ) : (
              <p key={index} className={`resume-document__line resume-document__line--${line.kind}`}>
                {line.text}
              </p>
            ),
          )}
        </div>
      </div>
    </article>
  )
}
