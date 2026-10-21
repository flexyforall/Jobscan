import { useRef } from 'react'

import { icons } from '../assets'
import { revealDelay, useInView } from '../intro'
import { CountUp } from './CountUp'
import { KeywordIcon, type KeywordStatus } from './KeywordIcon'
import { ResumeUpload } from './ResumeUpload'
import { RevealText } from './RevealText'
import './ScanCard.css'

type Metric = {
  label: string
  value: string
  status: KeywordStatus
  bar: string
  /** X position (px) of the marker inside the 552px bar. */
  marker: number
}

const metrics: Metric[] = [
  { label: 'Keywords found', value: '14 / 31', status: 'partial', bar: icons.metricBarKeywords, marker: 283 },
  { label: 'Impact language', value: 'Weak', status: 'missing', bar: icons.metricBarImpact, marker: 141 },
  { label: 'Format & structure', value: 'Clean', status: 'found', bar: icons.metricBarFormat, marker: 423 },
]

const keywords: { label: string; status: KeywordStatus }[] = [
  { label: 'Product strategy', status: 'found' },
  { label: 'OKRs', status: 'found' },
  { label: 'Agile', status: 'found' },
  { label: 'Cross-functional', status: 'partial' },
  { label: 'Go-to-market', status: 'missing' },
  { label: 'P&L ownership', status: 'missing' },
  { label: 'Enterprise SaaS', status: 'missing' },
]

const legend: { label: string; status: KeywordStatus }[] = [
  { label: 'Found', status: 'found' },
  { label: 'Partial', status: 'partial' },
  { label: 'Missing', status: 'missing' },
]

export function ScanCard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)

  return (
    <div ref={ref} className="scan-card">
      <div className="scan-card__score">
        <div className="scan-card__chart" data-reveal="wipe" style={revealDelay(200)}>
          <img src={icons.scoreChart} alt="" />
        </div>
        <div className="scan-card__score-content" data-reveal="scale" style={revealDelay(150)}>
          <p className="scan-card__score-value">
            <CountUp value={88} suffix="%" start={inView} delay={250} />
          </p>
          <p className="scan-card__score-label">ATS Match Score</p>
        </div>
      </div>

      <h3 className="scan-card__heading">
        <RevealText
          lines={['Scan your resume. Beat the ATS.']}
          start={inView}
          delay={500}
          blur={{ width: 117, height: 52, offsetY: 2 }}
        />
      </h3>

      <div className="scan-card__details">
        <ul className="scan-card__metrics">
          {metrics.map(({ label, value, status, bar, marker }, index) => (
            <li key={label} className="scan-card__metric">
              <img className="scan-card__metric-bar" src={bar} alt="" data-reveal="wipe" style={revealDelay(400 + index * 150)} />
              <div className="scan-card__metric-content" data-reveal="fade" style={revealDelay(500 + index * 150)}>
                <span className="scan-card__metric-label">{label}</span>
                <span className={`scan-card__metric-value scan-card__metric-value--${status}`}>{value}</span>
              </div>
              <span
                className={`scan-card__metric-marker scan-card__metric-marker--${status}`}
                style={{ left: marker, ...revealDelay(900 + index * 150) }}
                data-reveal="scale"
              />
            </li>
          ))}
        </ul>

        <div className="scan-card__keywords">
          <ul className="scan-card__keyword-list">
            {keywords.map(({ label, status }, index) => (
              <li
                key={label}
                className={`keyword-badge keyword-badge--${status}`}
                data-reveal="scale"
                style={revealDelay(900 + index * 70)}
              >
                <KeywordIcon status={status} />
                <span className="keyword-badge__label">{label}</span>
              </li>
            ))}
          </ul>

          <ul className="scan-card__legend" data-reveal="fade" style={revealDelay(1400)}>
            {legend.map(({ label, status }) => (
              <li key={label} className="scan-card__legend-item">
                <span className={`scan-card__legend-badge keyword-badge--${status}`}>
                  <KeywordIcon status={status} />
                </span>
                <span className="scan-card__legend-label">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ResumeUpload variant="card" data-reveal style={revealDelay(600)} />
    </div>
  )
}
