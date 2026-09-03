import {
 FiBookOpen,
 FiEdit3,
 FiMic,
 FiCode,
 FiAward,
 FiBriefcase,
} from 'react-icons/fi'
import SectionHeader from './SectionHeader'
import CategoryCard from './CategoryCard'
import { courseCategories } from '../../constants/siteData'
import './Categories.css'

// courseCategories in siteData has no icon field — mapped here by position
const CATEGORY_ICONS = [FiBookOpen, FiEdit3, FiMic, FiCode, FiAward, FiBriefcase]

function Categories() {
 return (
  <section className="categories-section">
   <div className="section-wrapper">
    <SectionHeader
     badge="Categories"
     title="Explore learning paths for every goal"
     subtitle="From school foundations to professional upskilling — pick the track that fits you."
    />
    <div className="categories-grid">
     {courseCategories.map((category, index) => {
      const Icon = CATEGORY_ICONS[index] ?? FiBookOpen
      return (
       <div key={category.title} data-aos="fade-up" data-aos-delay={index * 80}>
        <CategoryCard {...category} icon={<Icon size={22} aria-hidden="true" />} />
       </div>
      )
     })}
    </div>
   </div>
  </section>
 )
}

export default Categories