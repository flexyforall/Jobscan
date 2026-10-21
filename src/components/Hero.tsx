import { icons, images } from '../assets'
import { revealDelay, useIntroStage } from '../intro'
import { Badge } from './Badge'
import { CountUp } from './CountUp'
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

// Entrance timeline (ms after the loader window starts opening). Following the storyboard,
// the lead, upload and resume panel show first; the badge and heading come in after.
const HEADING_REVEAL_DELAY = 900

export function Hero() {
  const stage = useIntroStage()
  const started = stage !== 'loading'

  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__title">
          <Badge tone="sand" icon={icons.badgeResearch} data-reveal style={revealDelay(700)}>
            12 years pioneering ATS research
          </Badge>
          <h1 className="hero__heading" data-reveal="fade" style={revealDelay(600)}>
            <RevealText
              lines={['Your job search,', 'on autopilot']}
              start={started}
              delay={HEADING_REVEAL_DELAY}
              blur={{ width: 109, height: 80, offsetY: 3 }}
            />
          </h1>
          <p className="hero__lead" data-reveal>
            Jobscan matches you to the right roles, tailors your resume to each ATS, applies with your approval, and
            tracks every outcome. Built on the deepest ATS research in the industry.
          </p>
        </div>

        <ResumeUpload variant="hero" data-reveal style={revealDelay(120)} />

        <div className="hero__metrics">
          {metrics.map(({ value, label, rating }, index) => (
            <div key={label} className="hero__metric-group">
              <MetricDivider delay={240 + index * 90} />
              <div className="hero__metric" data-reveal style={revealDelay(260 + index * 90)}>
                <p className="hero__metric-value">
                  {value}
                  {rating && (
                    <span className="hero__star">
                      <img src={icons.star} alt="" />
                    </span>
                  )}
                </p>
                <p className="hero__metric-label">{label}</p>
              </div>
            </div>
          ))}
          <MetricDivider delay={510} />
        </div>
      </div>

      <div className="resume-panel" aria-hidden data-reveal="scale" style={revealDelay(80)}>
        <div className="resume-panel__bg">
          <img src={images.resumePanelBg} alt="" />
        </div>

        <ResumeDocument className="resume-panel__document" data-reveal style={revealDelay(250)} />

        <div className="resume-panel__score" data-reveal="scale" style={revealDelay(900)}>
          <div className="resume-panel__score-display">
            <img className="resume-panel__score-track" src={icons.scoreRingTrack} alt="" />
            <p className="resume-panel__score-value">
              <CountUp value={88} suffix="%" start={started} delay={950} />
            </p>
            <p className="resume-panel__score-label">ATS Match</p>
            <img className="resume-panel__score-ring" src={icons.scoreRing} alt="" />
          </div>
        </div>

        <div className="resume-panel__highlight resume-panel__highlight--first" data-reveal="wipe" style={revealDelay(1100)} />
        <div className="resume-panel__highlight resume-panel__highlight--second" data-reveal="wipe" style={revealDelay(1400)} />

        <div className="resume-panel__cursor" data-reveal style={revealDelay(1000)}>
          <span className="resume-panel__cursor-icon">
            <img src={icons.add} alt="" />
          </span>
          <span className="resume-panel__cursor-line" />
        </div>

        <Badge tone="success" icon={icons.badgeImproving} className="resume-panel__status" data-reveal style={revealDelay(1700)}>
          Improving your resume...
        </Badge>
      </div>
    </section>
  )
}
