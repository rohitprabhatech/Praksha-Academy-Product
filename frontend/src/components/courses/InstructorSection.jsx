import { Avatar } from '@mui/material'
import { FiBookOpen, FiStar, FiUsers } from 'react-icons/fi'
import './InstructorSection.css'

function getInitials(name = 'Instructor') {
 return name
  .split(' ')
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()
}

function InstructorSection({ instructor = {} }) {
 const name = instructor.name || 'Praksha Academy Instructor'

 return (
  <section className="course-section instructor-section" aria-labelledby="instructor-title">
   <div className="course-section-header">
    <span>Instructor</span>
    <h2 id="instructor-title">Meet your instructor</h2>
   </div>

   <div className="instructor-profile">
    <Avatar src={instructor.image} alt={name} className="instructor-avatar">
     {getInitials(name)}
    </Avatar>

    <div className="instructor-content">
     <h3>{name}</h3>
     <p className="instructor-designation">{instructor.designation || 'Course Instructor'}</p>

     <div className="instructor-stats" aria-label="Instructor statistics">
      <span>
       <FiStar aria-hidden="true" />
       {instructor.rating || 4.7} Instructor Rating
      </span>
      <span>
       <FiUsers aria-hidden="true" />
       {(instructor.students || 0).toLocaleString()} Students
      </span>
      <span>
       <FiBookOpen aria-hidden="true" />
       {instructor.courses || 1} Courses
      </span>
     </div>

     <p className="instructor-bio">
      {instructor.bio || 'Experienced educator focused on practical, student-friendly learning.'}
     </p>
    </div>
   </div>
  </section>
 )
}

export default InstructorSection
