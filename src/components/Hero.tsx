import { icons, images } from '../assets'
import { Badge } from './Badge'
import { ProgressiveBlur } from './ProgressiveBlur'
import { ResumeDocument } from './ResumeDocument'
import { ResumeUpload } from './ResumeUpload'
import './Hero.css'

const metrics = [
  { value: '4.8', label: 'average user rating', rating: true },
  { value: '50%', label: 'less time job searching' },
  { value: '98', label: 'ATS systems mapped' },
]

function MetricDivider() {
  return (
    <span className="hero__metric-divider" aria-hidden>
      <img src={icons.metricDivider} alt="" />
    </span>
  )
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__title">
          <Badge tone="sand" icon={icons.badgeResearch}>
            12 years pioneering ATS research
          </Badge>
          <h1 className="hero__heading">
            <span className="hero__heading-line">Your job search,</span>
            <span className="hero__heading-line">
              on auto<span className="hero__heading-muted">pilot</span>
            </span>
          </h1>
          <p className="hero__lead">
            Jobscan matches you to the right roles, tailors your resume to each ATS, applies with your approval, and
            tracks every outcome. Built on the deepest ATS research in the industry.
          </p>
          <ProgressiveBlur className="hero__heading-blur" radius={10} />
        </div>

        <ResumeUpload variant="hero" />

        <div className="hero__metrics">
          {metrics.map(({ value, label, rating }) => (
            <div key={label} className="hero__metric-group">
              <MetricDivider />
              <div className="hero__metric">
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
          <MetricDivider />
        </div>
      </div>

      <div className="resume-panel" aria-hidden>
        <div className="resume-panel__bg">
          <img src={images.resumePanelBg} alt="" />
        </div>

        <ResumeDocument className="resume-panel__document" />

        <div className="resume-panel__score">
          <div className="resume-panel__score-display">
            <img className="resume-panel__score-track" src={icons.scoreRingTrack} alt="" />
            <p className="resume-panel__score-value">88%</p>
            <p className="resume-panel__score-label">ATS Match</p>
            <img className="resume-panel__score-ring" src={icons.scoreRing} alt="" />
          </div>
        </div>

        <div className="resume-panel__highlight resume-panel__highlight--first" />
        <div className="resume-panel__highlight resume-panel__highlight--second" />

        <div className="resume-panel__cursor">
          <span className="resume-panel__cursor-icon">
            <img src={icons.add} alt="" />
          </span>
          <span className="resume-panel__cursor-line" />
        </div>

        <Badge tone="success" icon={icons.badgeImproving} className="resume-panel__status">
          Improving your resume...
        </Badge>
      </div>
    </section>
  )
}
