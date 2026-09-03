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
import { navItems, courseCategories } from '../../constants/siteData'
import logoMark from '../../assets/praksha-mark.png'
import './Footer.css'

const SOCIAL_LINKS = [
 { icon: FiTwitter, label: 'Twitter', href: 'https://twitter.com' },
 { icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
 { icon: FiInstagram, label: 'Instagram', href: 'https://instagram.com' },
 { icon: FiYoutube, label: 'YouTube', href: 'https://youtube.com' },
]

const LEGAL_LINKS = [
 { label: 'Privacy Policy', path: '/privacy-policy' },
 { label: 'Terms & Conditions', path: '/terms' },
 { label: 'Refund Policy', path: '/refund-policy' },
]

function Footer() {
 return (
  <footer className="site-footer">
   <div className="footer-glow" aria-hidden="true" />

   <div className="section-wrapper footer-grid">
    <div className="footer-brand">
     <Link to="/" className="footer-logo">
      <img src={logoMark} alt="Praksha Academy" />
      <span>Praksha Academy</span>
     </Link>
     <p>
      Live mentor-led learning in Web Development, AI, Cloud Computing, and
      Cyber Security — built for learners who want outcomes, not just
      content.
     </p>
     <div className="footer-socials">
      {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
       <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="footer-social-link"
       >
        <Icon size={16} aria-hidden="true" />
       </a>
      ))}
     </div>
    </div>

    <div className="footer-column">
     <h4>Explore</h4>
     <ul>
      {navItems.map((item) => (
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
      <li>
       <FiMail size={15} aria-hidden="true" />
       <a href="mailto:support@prakshaacademy.com">support@prakshaacademy.com</a>
      </li>
      <li>
       <FiPhone size={15} aria-hidden="true" />
       <a href="tel:+919876543210">+91 98765 43210</a>
      </li>
      <li>
       <FiMapPin size={15} aria-hidden="true" />
       <span>Nashik, Maharashtra, India</span>
      </li>
     </ul>
    </div>
   </div>

   <div className="footer-bottom">
    <div className="section-wrapper footer-bottom-inner">
     <p>&copy; {new Date().getFullYear()} Praksha Academy. All rights reserved.</p>
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

export default Footer