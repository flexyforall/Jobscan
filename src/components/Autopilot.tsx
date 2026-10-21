import { useState } from 'react'

import { icons, images } from '../assets'
import { revealDelay } from '../intro'
import { ShaderFill } from '../lib/custom-effect-runtime/index'
import {
  manifest as waterCausticManifest,
  render as renderWaterCaustic,
  setup as setupWaterCaustic,
} from '../lib/custom-effects/CodeComponentId_40f03f78407c1c973fc891fbca9ff3d0387485e6_435'
import { Badge } from './Badge'
import { LinesText } from './LinesText'
import { ProgressiveBlur } from './ProgressiveBlur'
import { ResumeDocument } from './ResumeDocument'
import { ScanCard } from './ScanCard'
import './Autopilot.css'

// "Water caustic" shader fill from Figma, with its exact parameters.
// Module-level constant keeps the shader identity stable across renders.
const waterCausticShader = {
  setup: setupWaterCaustic,
  render: renderWaterCaustic,
  manifest: waterCausticManifest,
  params: {
    center: { x: 50, y: 50 },
    scale: 3.9700000286102295,
    playhead: 46.47999954223633,
    highlightColor: { r: 1, g: 0.9589263200759888, b: 0.5892615914344788, a: 1 },
    waterColor: { r: 0.15005257725715637, g: 0.15005257725715637, b: 0.15005257725715637, a: 1 },
    intensity: 0.2800000011920929,
  },
}

const tabs = [
  { id: 'scan', label: 'Scan', icon: icons.scan },
  { id: 'match', label: 'Match', icon: icons.checkSquare },
  { id: 'optimize', label: 'Optimize', icon: icons.crop },
  { id: 'apply', label: 'Apply', icon: icons.paperPlaneTilt },
  { id: 'track', label: 'Track', icon: icons.chartBar },
]

export function Autopilot() {
  const [activeTab, setActiveTab] = useState('scan')

  return (
    <section className="autopilot" aria-labelledby="autopilot-heading">
      <div className="autopilot__bg" aria-hidden>
        <img src={images.contentSectionBg} alt="" />
        <ShaderFill className="autopilot__shader" shader={waterCausticShader} />
        <div className="autopilot__bg-dim" />
      </div>

      <div className="autopilot__title">
        <Badge tone="glass" icon={icons.badgeAutopilot} data-reveal>
          Autopilot — launching Jan 4, 2027
        </Badge>
        <LinesText
          as="h2"
          id="autopilot-heading"
          className="autopilot__heading"
          lines={['One agent.', 'Your entire search.']}
          delay={200}
        />
        <LinesText
          className="autopilot__lead"
          text="You approve every application before it goes out. Autopilot handles everything else."
          delay={600}
        />
      </div>

      <div className="autopilot__tabs">
        <div className="autopilot__tab-list" role="tablist" aria-label="Autopilot features" data-reveal style={revealDelay(900)}>
          {tabs.map(({ id, label, icon }) => {
            const isActive = id === activeTab
            return (
              <button
                key={id}
                id={`autopilot-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="autopilot-panel"
                className={`autopilot__tab${isActive ? ' autopilot__tab--active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <img className={`autopilot__tab-icon autopilot__tab-icon--${id}`} src={icon} alt="" />
                <span className="autopilot__tab-label">{label}</span>
                {isActive && (
                  <>
                    <span className="autopilot__tab-track" />
                    <span className="autopilot__tab-progress" />
                  </>
                )}
              </button>
            )
          })}
        </div>

        <div
          id="autopilot-panel"
          className="autopilot__panel"
          role="tabpanel"
          aria-labelledby={`autopilot-tab-${activeTab}`}
        >
          {/* Faded on its own layer: opacity on the panel would cut nested backdrop blurs off from the section background. */}
          <div className="autopilot__panel-bg" data-reveal="fade" style={revealDelay(1100)} />
          <div className="autopilot__feature">
            <div className="autopilot__preview" aria-hidden>
              <ResumeDocument size="compact" className="autopilot__document" data-reveal style={revealDelay(1400)} />
              <ProgressiveBlur
                className="autopilot__preview-blur"
                radius={32}
                direction="to bottom"
                steps={8}
                data-reveal="fade"
                style={revealDelay(1700)}
              />
              <div className="autopilot__scanline" data-reveal="fade" style={revealDelay(1900)}>
                <span className="autopilot__scan-glow" />
                <span className="autopilot__scan-line" />
                <span className="autopilot__scan-marker autopilot__scan-marker--left" />
                <span className="autopilot__scan-marker autopilot__scan-marker--right" />
              </div>
            </div>
            <ScanCard />
          </div>
        </div>
      </div>
    </section>
  )
}
