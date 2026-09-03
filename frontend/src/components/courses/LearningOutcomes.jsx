import { FiCheckCircle } from 'react-icons/fi'
import './LearningOutcomes.css'

function LearningOutcomes({ outcomes = [] }) {
 const visibleOutcomes = outcomes.length > 0 ? outcomes : ['Build confidence through structured lessons.']

 return (
  <section className="course-section learning-outcomes-section" aria-labelledby="learning-outcomes-title">
   <div className="course-section-header">
    <span>Learning Outcomes</span>
    <h2 id="learning-outcomes-title">What you&apos;ll learn</h2>
   </div>

   <div className="learning-outcomes-grid">
    {visibleOutcomes.map((outcome) => (
     <div className="learning-outcome-item" key={outcome}>
      <FiCheckCircle aria-hidden="true" />
      <span>{outcome}</span>
     </div>
    ))}
   </div>
  </section>
 )
}

export default LearningOutcomes
