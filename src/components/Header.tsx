import { icons } from '../assets'
import { revealDelay } from '../intro'
import './Header.css'

// Label widths are the text box widths from Figma (whole pixels), so the
// navigation keeps exactly the same rhythm as the design.
const navItems = [
  { label: 'How it works', width: 82, hasMenu: true },
  { label: 'ATS Research', width: 89, hasMenu: true },
  { label: 'For Coaches', width: 81, hasMenu: false },
  { label: 'Pricing', width: 46, hasMenu: false },
]

export function Header() {
  return (
    <header className="header">
      <nav className="header__nav" aria-label="Main" data-reveal="fade" style={revealDelay(2600)}>
        <a className="header__logo" href="/" aria-label="Jobscan home">
          <span className="header__logo-mark">
            <img src={icons.logoMark} alt="" />
          </span>
          <img src={icons.logoWordmark} alt="Jobscan" />
        </a>
        <ul className="header__sections">
          {navItems.map(({ label, width, hasMenu }) => (
            <li key={label}>
              {hasMenu ? (
                <button type="button" className="header__link" aria-haspopup="true">
                  <span className="header__label" style={{ width }}>
                    {label}
                  </span>
                  <span className="header__chevron">
                    <img src={icons.chevronDown} alt="" />
                  </span>
                </button>
              ) : (
                <a className="header__link" href="#">
                  <span className="header__label" style={{ width }}>
                    {label}
                  </span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="header__actions" data-reveal="fade" style={revealDelay(2800)}>
        <a className="header__sign-in header__label" href="#" style={{ width: 45 }}>
          Sign In
        </a>
        <a className="header__cta" href="#">
          <span className="header__cta-icon">
            <img src={icons.tryFree} alt="" />
          </span>
          <span className="header__label" style={{ width: 53 }}>
            Try Free
          </span>
        </a>
      </div>
    </header>
  )
}
