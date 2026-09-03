import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { FiBookOpen, FiChevronDown, FiFileText, FiPlayCircle } from 'react-icons/fi'
import './Curriculum.css'

function countLessons(curriculum) {
 return curriculum.reduce((total, section) => total + section.lessons.length, 0)
}

function Curriculum({ curriculum = [], totalLessons, duration }) {
 if (curriculum.length === 0) {
  return (
   <section className="course-section curriculum-section" aria-labelledby="curriculum-title">
    <div className="course-section-header">
     <span>Course Content</span>
     <h2 id="curriculum-title">Curriculum</h2>
    </div>
    <div className="curriculum-empty-state">
     <FiBookOpen aria-hidden="true" />
     <p>Course curriculum coming soon.</p>
    </div>
   </section>
  )
 }

 return (
  <section className="course-section curriculum-section" aria-labelledby="curriculum-title">
   <div className="course-section-header">
    <span>Course Content</span>
    <h2 id="curriculum-title">Curriculum</h2>
    <p>
     {curriculum.length} Sections • {totalLessons || countLessons(curriculum)} Lessons • {duration}
    </p>
   </div>

   <div className="curriculum-accordion-list">
    {curriculum.map((section, index) => (
     <Accordion className="curriculum-accordion" disableGutters elevation={0} key={section.id}>
      <AccordionSummary
       expandIcon={<FiChevronDown aria-hidden="true" />}
       aria-controls={`curriculum-section-${section.id}-content`}
       id={`curriculum-section-${section.id}-header`}
      >
       <div className="curriculum-section-summary">
        <strong>
         Section {index + 1} - {section.title}
        </strong>
        <span>
         {section.lessons.length} lessons • {section.duration}
        </span>
       </div>
      </AccordionSummary>
      <AccordionDetails id={`curriculum-section-${section.id}-content`}>
       <ul className="curriculum-lesson-list">
        {section.lessons.map((lesson) => {
         const LessonIcon = lesson.type === 'video' ? FiPlayCircle : FiFileText

         return (
          <li key={lesson.id}>
           <span>
            <LessonIcon aria-hidden="true" />
            {lesson.title}
           </span>
           <time>{lesson.duration}</time>
          </li>
         )
        })}
       </ul>
      </AccordionDetails>
     </Accordion>
    ))}
   </div>
  </section>
 )
}

export default Curriculum
