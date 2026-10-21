import { icons, images } from '../assets'
import { revealDelay, useIntroStage } from '../intro'
import { Badge } from './Badge'
import { CountUp } from './CountUp'
import { LinesText } from './LinesText'
import { ResumeDocument } from './ResumeDocument'
import { ResumeUpload } from './ResumeUpload'
import { RevealText } from './RevealText'
import './Hero.css'

const metrics = [
  { value: '4.8', label: 'average user rating', rating: true },
  { value: '50%', label: 'less time job searching' },
  { value: '98', label: 'ATS systems mapped' },
]

function MetricDivider({ delay }: { delay: number }) {
  return (
    <span className="hero__metric-divider" aria-hidden data-reveal="fade" style={revealDelay(delay)}>
      <img src={icons.metricDivider} alt="" />
    </span>
  )
}

// Entrance timeline, in ms after the loader window starts opening (it fills the screen
// in ~2.2s). The heading's reveal starts as soon as the page is fully shown.
const T = {
  panel: 500,
  heading: 700,
  badge: 800,
  lead: 900,
  upload: 1100,
  metrics: 1300,
  sweepAfterShown: 150,
}

export function Hero() {
  const stage = useIntroStage()
  const started = stage !== 'loading'

  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__title">
          <Badge tone="sand" icon={icons.badgeResearch} data-reveal style={revealDelay(T.badge)}>
            12 years pioneering ATS research
          </Badge>
          <h1 className="hero__heading">
            <RevealText
              lines={['Your job search,', 'on autopilot']}
              start={stage === 'done'}
              delay={T.sweepAfterShown}
              enterDelay={T.heading}
            />
          </h1>
          <LinesText
            className="hero__lead"
            delay={T.lead}
            text="Jobscan matches you to the right roles, tailors your resume to each ATS, applies with your approval, and tracks every outcome. Built on the deepest ATS research in the industry."
          />
        </div>

        <ResumeUpload variant="hero" revealDelay={T.upload} />

        <div className="hero__metrics">
          {metrics.map(({ value, label, rating }, index) => (
            <div key={label} className="hero__metric-group">
              <MetricDivider delay={T.metrics + index * 200} />
              <div className="hero__metric">
                <p className="hero__metric-value" data-reveal style={revealDelay(T.metrics + 100 + index * 200)}>
                  {value}
                  {rating && (
                    <span className="hero__star">
                      <img src={icons.star} alt="" />
                    </span>
                  )}
                </p>
                <LinesText className="hero__metric-label" text={label} delay={T.metrics + 250 + index * 200} />
              </div>
            </div>
          ))}
          <MetricDivider delay={T.metrics + 600} />
        </div>
      </div>

      <div className="resume-panel" aria-hidden data-reveal="scale" style={revealDelay(0)}>
        <div className="resume-panel__bg">
          <img src={images.resumePanelBg} alt="" />
        </div>

        {/* Composition from Figma, kept centred when the panel is wider than 620px. */}
        <div className="resume-panel__stage">
          <ResumeDocument className="resume-panel__document" data-reveal style={revealDelay(T.panel - 300)} />

          <div className="resume-panel__score" data-reveal="scale" style={revealDelay(T.panel + 400)}>
            <div className="resume-panel__score-display">
              <img className="resume-panel__score-track" src={icons.scoreRingTrack} alt="" />
              <p className="resume-panel__score-value">
                <CountUp value={88} suffix="%" start={started} delay={T.panel + 500} duration={2200} />
              </p>
              <p className="resume-panel__score-label">ATS Match</p>
              <img className="resume-panel__score-ring" src={icons.scoreRing} alt="" />
            </div>
          </div>

          <div className="resume-panel__highlight resume-panel__highlight--first" data-reveal="wipe" style={revealDelay(T.panel + 900)} />
          <div className="resume-panel__highlight resume-panel__highlight--second" data-reveal="wipe" style={revealDelay(T.panel + 1300)} />

          <div className="resume-panel__cursor" data-reveal style={revealDelay(T.panel + 700)}>
            <span className="resume-panel__cursor-icon">
              <img src={icons.add} alt="" />
            </span>
            <span className="resume-panel__cursor-line" />
          </div>

          <Badge tone="success" icon={icons.badgeImproving} className="resume-panel__status" data-reveal style={revealDelay(T.panel + 1800)}>
            Improving your resume...
          </Badge>
        </div>
      </div>
    </section>
  )
}
