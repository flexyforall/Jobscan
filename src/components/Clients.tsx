import { icons, logos } from '../assets'
import { ProgressiveBlur } from './ProgressiveBlur'
import './Clients.css'

// Logo boxes and offsets inside each 200×72 cell come straight from Figma.
const clientLogos = [
  { src: logos.companyLogo1, alt: 'Company logo', left: 80.027, top: 13, width: 40.945, height: 46 },
  { src: logos.leanSolutions, alt: 'Lean Solutions Group', left: 19.23, top: 19, width: 161.538, height: 35 },
  { src: logos.amazon, alt: 'Amazon', left: 53, top: 22.667 },
  { src: logos.nvidia, alt: 'NVIDIA', left: 40, top: 25.667, clip: { width: 120, height: 21, offsetTop: 0.034 } },
  { src: logos.google, alt: 'Google', left: 48, top: 18.667, width: 103, height: 35 },
  { src: logos.meta, alt: 'Meta', left: 48, top: 25.667 },
  { src: logos.companyLogo7, alt: 'Company logo', left: 40.645, top: 22, width: 119.048, height: 30 },
]

export function Clients() {
  return (
    <section className="clients" aria-labelledby="clients-heading">
      <div className="clients__divider" aria-hidden>
        <span className="clients__divider-line">
          <img src={icons.clientsDivider} alt="" />
        </span>
      </div>

      <h2 id="clients-heading" className="clients__heading">
        Jobscan users have been hired by
      </h2>

      <ul className="clients__logos">
        {clientLogos.map(({ src, alt, left, top, width, height, clip }) => (
          <li key={src} className="clients__logo">
            {clip ? (
              <span
                className="clients__logo-clip"
                style={{ left, top, width: clip.width, height: clip.height }}
              >
                <img src={src} alt={alt} style={{ top: clip.offsetTop }} />
              </span>
            ) : (
              <img
                className={width ? 'clients__logo-raster' : undefined}
                src={src}
                alt={alt}
                style={{ left, top, width, height }}
              />
            )}
          </li>
        ))}
      </ul>

      <ProgressiveBlur className="clients__fade clients__fade--left" radius={10} direction="to left" />
      <ProgressiveBlur className="clients__fade clients__fade--right" radius={10} direction="to right" />
    </section>
  )
}
