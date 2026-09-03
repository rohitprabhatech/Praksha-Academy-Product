import { FiStar } from 'react-icons/fi'
import SectionHeader from './SectionHeader'
import { testimonialData } from '../../constants/siteData'
import './Testimonials.css'

function Testimonials() {
 return (
  <section className="testimonials-section">
   <div className="section-wrapper">
    <SectionHeader
     badge="Testimonials"
     title="Learners who leveled up with us"
     subtitle="Real feedback from students across our academic, coding, and professional tracks."
    />
    <div className="testimonials-grid">
     {testimonialData.map((testimonial, index) => (
      <div
       key={testimonial.name}
       className="card-surface testimonial-card"
       data-aos="fade-up"
       data-aos-delay={index * 80}
      >
       <div className="testimonial-rating" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, starIndex) => (
         <FiStar key={starIndex} size={16} fill="currentColor" />
        ))}
       </div>
       <p className="testimonial-quote">&ldquo;{testimonial.quote}&rdquo;</p>
       <div className="testimonial-author">
        <span className="testimonial-name">{testimonial.name}</span>
        <span className="testimonial-role">{testimonial.role}</span>
       </div>
      </div>
     ))}
    </div>
   </div>
  </section>
 )
}

export default Testimonials