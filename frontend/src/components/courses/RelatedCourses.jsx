import CourseCard from './CourseCard'
import './RelatedCourses.css'

function getRelatedCourses(currentCourse, courses, limit) {
 const sameCategory = courses.filter((course) => course.id !== currentCourse.id && course.category === currentCourse.category)
 const fallbackCourses = courses.filter(
  (course) => course.id !== currentCourse.id && course.category !== currentCourse.category,
 )

 return [...sameCategory, ...fallbackCourses].slice(0, limit)
}

function RelatedCourses({ currentCourse, courses = [], limit = 3 }) {
 const relatedCourses = getRelatedCourses(currentCourse, courses, limit)

 if (relatedCourses.length === 0) {
  return null
 }

 return (
  <section className="related-courses-section" aria-labelledby="related-courses-title">
   <div className="container">
    <div className="course-section-header">
     <span>Continue Learning</span>
     <h2 id="related-courses-title">You may also like</h2>
    </div>

    <div className="row g-4">
     {relatedCourses.map((course) => (
      <div className="col-12 col-md-6 col-lg-4" key={course.id}>
       <CourseCard course={course} />
      </div>
     ))}
    </div>
   </div>
  </section>
 )
}

export default RelatedCourses
