import { FiAward, FiBookOpen, FiClock, FiGlobe, FiTrendingUp, FiUsers } from 'react-icons/fi'
import './CourseOverview.css'

function CourseOverview({ course }) {
 const overview = course.overview || {}
 const information = [
  { label: 'Level', value: course.level, icon: FiTrendingUp },
  { label: 'Duration', value: course.duration, icon: FiClock },
  { label: 'Lessons', value: `${course.lessons} lessons`, icon: FiBookOpen },
  { label: 'Students', value: course.students.toLocaleString(), icon: FiUsers },
  { label: 'Language', value: overview.language || 'English', icon: FiGlobe },
 ]

 return (
  <section className="course-section course-overview-section" aria-labelledby="course-overview-title">
   <div className="course-section-header">
    <span>Course Details</span>
    <h2 id="course-overview-title">Course Overview</h2>
   </div>

   <p className="course-overview-summary">{overview.summary || course.description}</p>

   <div className="course-information-grid" aria-label="Course information">
    {information.map((item) => {
     const Icon = item.icon

     return (
      <div className="course-information-item" key={item.label}>
       <Icon aria-hidden="true" />
       <div>
        <span>{item.label}</span>
        <strong>{item.value}</strong>
       </div>
      </div>
     )
    })}
   </div>

   <div className="course-overview-lists">
    <div>
     <h3>Requirements</h3>
     <ul>
      {(course.requirements || []).map((requirement) => (
       <li key={requirement}>{requirement}</li>
      ))}
     </ul>
    </div>

    <div>
     <h3>Who this course is for</h3>
     <ul>
      {(course.targetAudience || []).map((audience) => (
       <li key={audience}>{audience}</li>
      ))}
     </ul>
    </div>
   </div>

   {overview.benefits?.length > 0 && (
    <div className="course-benefits">
     <h3>
      <FiAward aria-hidden="true" />
      Course Benefits
     </h3>
     <ul>
      {overview.benefits.map((benefit) => (
       <li key={benefit}>{benefit}</li>
      ))}
     </ul>
    </div>
   )}
  </section>
 )
}

export default CourseOverview
