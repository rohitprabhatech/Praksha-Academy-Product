import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { FiChevronDown } from 'react-icons/fi'
import './CourseFAQ.css'

function CourseFAQ({ faq = [] }) {
 const items = faq.length > 0 ? faq : [{ question: 'Is this course available?', answer: 'Course details are being updated.' }]

 return (
  <section className="course-section course-faq-section" aria-labelledby="course-faq-title">
   <div className="course-section-header">
    <span>Questions</span>
    <h2 id="course-faq-title">FAQ</h2>
   </div>

   <div className="course-faq-list">
    {items.map((item, index) => (
     <Accordion className="course-faq-accordion" disableGutters elevation={0} key={item.question}>
      <AccordionSummary
       expandIcon={<FiChevronDown aria-hidden="true" />}
       aria-controls={`course-faq-${index}-content`}
       id={`course-faq-${index}-header`}
      >
       <h3>{item.question}</h3>
      </AccordionSummary>
      <AccordionDetails id={`course-faq-${index}-content`}>
       <p>{item.answer}</p>
      </AccordionDetails>
     </Accordion>
    ))}
   </div>
  </section>
 )
}

export default CourseFAQ
