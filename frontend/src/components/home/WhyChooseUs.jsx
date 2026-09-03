import { FiCpu, FiCode, FiMessageCircle } from 'react-icons/fi'
import SectionHeader from './SectionHeader'
import FeatureCard from './FeatureCard'
import { programHighlights } from '../../constants/siteData'
import './WhyChooseUs.css'

// programHighlights in siteData has no icon field — mapped here by position
const PROGRAM_ICONS = [FiCpu, FiCode, FiMessageCircle]

function WhyChooseUs() {
 return (
  <section className="why-choose-section">
   <div className="section-wrapper">
    <SectionHeader
     badge="Why Praksha Academy"
     title="Built around outcomes, not just content"
     subtitle="Every track pairs structured lessons with mentorship and real practice."
    />
    <div className="why-choose-grid">
     {programHighlights.map((program, index) => {
      const Icon = PROGRAM_ICONS[index] ?? FiCpu
      return (
       <div key={program.title} data-aos="fade-up" data-aos-delay={index * 80}>
        <FeatureCard
         title={program.title}
         description={program.description}
         icon={<Icon size={22} aria-hidden="true" />}
        />
       </div>
      )
     })}
    </div>
   </div>
  </section>
 )
}

export default WhyChooseUs