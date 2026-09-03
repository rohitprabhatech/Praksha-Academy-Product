import { Link } from 'react-router-dom'
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiYoutube,
} from 'react-icons/fi'
import { navItems as fallbackNav, courseCategories } from '../../constants/siteData'
import { useWebsite } from '../../context/WebsiteContext'
import logoMark from '../../assets/praksha-mark.png'
import './Footer.css'

const LEGAL_LINKS = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms' },
  { label: 'Refund Policy', path: '/refund-policy' },
]

const SOCIAL_ICON_MAP = {
  twitter: FiTwitter,
  linkedin: FiLinkedin,
  instagram: FiInstagram,
  youtube: FiYoutube,
  facebook: FiLinkedin,
}

function Footer() {
  const { branding, content, navItems, loading } = useWebsite()

  const academyName = branding?.academyName || 'Praksha Academy'
  const logoSrc = branding?.logoUrl || logoMark
  const blurb =
    content?.footer?.blurb ||
    'Live mentor-led learning built for learners who want outcomes, not just content.'
  const explore = (!loading && navItems?.length ? navItems : fallbackNav)
  const contact = content?.contact || {}
  const socialEntries = Object.entries(content?.footer?.socialLinks || {}).filter(
    ([, url]) => Boolean(url)
  )

  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="section-wrapper footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src={logoSrc} alt={academyName} />
            <span>{academyName}</span>
          </Link>
          <p>{blurb}</p>
          {socialEntries.length > 0 && (
            <div className="footer-socials">
              {socialEntries.map(([key, href]) => {
                const Icon = SOCIAL_ICON_MAP[key] || FiGlobeFallback
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="footer-social-link"
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <ul>
            {explore.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4>Popular Categories</h4>
          <ul>
            {courseCategories.slice(0, 5).map((category) => (
              <li key={category.title}>
                <Link to="/courses">{category.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4>Get in Touch</h4>
          <ul className="footer-contact">
            {contact.email ? (
              <li>
                <FiMail size={15} aria-hidden="true" />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
            ) : null}
            {contact.phone ? (
              <li>
                <FiPhone size={15} aria-hidden="true" />
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </li>
            ) : null}
            {contact.address ? (
              <li>
                <FiMapPin size={15} aria-hidden="true" />
                <span>{contact.address}</span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="section-wrapper footer-bottom-inner">
          <p>
            &copy; {new Date().getFullYear()} {academyName}. All rights reserved.
          </p>
          <div className="footer-legal">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.path} to={link.path}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FiGlobeFallback(props) {
  return <FiMail {...props} />
}

export default Footer
