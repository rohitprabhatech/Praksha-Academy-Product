import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import { FiArrowRight, FiCheckCircle, FiPlayCircle, FiAward, FiStar } from 'react-icons/fi'
import { heroHighlights } from '../../constants/siteData'
import './Hero.css'

const HERO_STATS = [
 { value: '500+', label: 'Courses' },
 { value: '50,000+', label: 'Students' },
 { value: '200+', label: 'Mentors' },
 { value: '95%', label: 'Satisfaction' },
]

function Hero() {
 return (
  <section className="hero-section">
   <div className="section-wrapper hero-inner">
    <div className="hero-content" data-aos="fade-up">
     <span className="hero-badge">🎓 500+ industry-ready courses</span>

     <h1>Learn skills that get you hired, not just certified.</h1>

     <p>
      Praksha Academy pairs live mentor-led classes with real projects in
      Web Development, AI, Cloud Computing, and Cyber Security — so you
      graduate with a portfolio, not just a certificate.
     </p>

     <ul className="hero-highlights">
      {heroHighlights.map((item) => (
       <li key={item}>
        <FiCheckCircle size={18} aria-hidden="true" />
        <span>{item}</span>
       </li>
      ))}
     </ul>

     <div className="hero-actions">
      <Button
       variant="contained"
       color="primary"
       size="large"
       component={Link}
       to="/courses"
       endIcon={<FiArrowRight size={18} aria-hidden="true" />}
      >
       Explore courses
      </Button>
      <Button variant="outlined" color="primary" size="large" component={Link} to="/contact">
       Talk to a mentor
      </Button>
     </div>

     <div className="hero-stats" data-aos="fade-up" data-aos-delay="200">
      {HERO_STATS.map((stat) => (
       <div key={stat.label} className="hero-stat">
        <strong>{stat.value}</strong>
        <span>{stat.label}</span>
       </div>
      ))}
     </div>
    </div>

    {/* Decorative — React-built, no stock images or video */}
    <div className="hero-visual" data-aos="fade-left" data-aos-delay="150">
     <div className="hero-visual-grid" aria-hidden="true" />
     <div className="hero-visual-blob hero-visual-blob--primary" aria-hidden="true" />
     <div className="hero-visual-blob hero-visual-blob--secondary" aria-hidden="true" />

     <div className="hero-float-card hero-float-card--top" data-aos="fade-up" data-aos-delay="300">
      <span className="hero-float-icon hero-float-icon--blue">
       <FiPlayCircle size={18} aria-hidden="true" style={{ display: 'block' }} />
      </span>
      <div>
       <strong>Live Class Today</strong>
       <span>Data Structures &middot; 6:00 PM</span>
      </div>
     </div>

     <div className="hero-float-card hero-float-card--mid" data-aos="fade-up" data-aos-delay="450">
      <span className="hero-float-icon hero-float-icon--green">
       <FiAward size={18} aria-hidden="true" style={{ display: 'block' }} />
      </span>
      <div>
       <strong>Certificate Earned</strong>
       <span>Web Development</span>
      </div>
     </div>

     <div className="hero-float-card hero-float-card--bottom" data-aos="fade-up" data-aos-delay="600">
      <span className="hero-float-icon hero-float-icon--amber">
       <FiStar size={16} aria-hidden="true" fill="currentColor" style={{ display: 'block' }} />
      </span>
      <div>
       <strong>4.9 out of 5</strong>
       <span>from 12,000+ reviews</span>
      </div>
     </div>
    </div>
   </div>
  </section>
 )
}

export default Hero