import { Button } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import {
 FiBookOpen,
 FiClock,
 FiStar,
 FiTrendingUp,
 FiUsers,
} from 'react-icons/fi'
import CourseFAQ from '../components/courses/CourseFAQ'
import CourseOverview from '../components/courses/CourseOverview'
import Curriculum from '../components/courses/Curriculum'
import InstructorSection from '../components/courses/InstructorSection'
import LearningOutcomes from '../components/courses/LearningOutcomes'
import RelatedCourses from '../components/courses/RelatedCourses'
import ReviewsSection from '../components/courses/ReviewsSection'
import courses from '../data/courses'
import './CourseDetails.css'

function formatPrice(price) {
 return `₹${price.toLocaleString()}`
}

function CourseDetails() {
 const { slug } = useParams()
 const course = courses.find((courseItem) => courseItem.slug === slug || courseItem.aliases?.includes(slug))

 if (!course) {
  return (
   <section className="course-details-page course-details-not-found">
    <div className="container">
     <div className="course-not-found-card">
      <span>Course not found</span>
      <h1>We could not find that course.</h1>
      <p>The course may have moved, or the link might be incorrect. Explore the course catalog to continue learning.</p>
      <Button component={Link} to="/courses" variant="contained" className="course-primary-cta">
       Back to Courses
      </Button>
     </div>
    </div>
   </section>
  )
 }

 const savings = course.originalPrice - course.price
 const discountPercent = Math.round((savings / course.originalPrice) * 100)

 return (
  <div className="course-details-page">
   <section className="course-details-hero">
    <div className="container">
     <nav className="course-breadcrumb" aria-label="Course breadcrumb">
      <Link to="/">Home</Link>
      <span>/</span>
      <Link to="/courses">Courses</Link>
      <span>/</span>
      <span>{course.category}</span>
     </nav>

     <div className="row g-4 align-items-start">
      <div className="col-12 col-lg-7">
       <div className="course-hero-copy">
        <span className="course-detail-category">{course.category}</span>
        <h1>{course.title}</h1>
        <p className="course-detail-description">{course.description}</p>

        <div className="course-detail-rating" aria-label={`${course.rating} rating from ${course.reviews} reviews`}>
         <strong>{course.rating}</strong>
         <FiStar aria-hidden="true" />
         <span>({course.reviews.toLocaleString()} reviews)</span>
        </div>

        <p className="course-detail-instructor">
         Created by <strong>{course.instructor}</strong>
        </p>

        <div className="course-detail-stats" aria-label="Course statistics">
         <span>
          <FiUsers aria-hidden="true" />
          {course.students.toLocaleString()} students
         </span>
         <span>
          <FiClock aria-hidden="true" />
          {course.duration}
         </span>
         <span>
          <FiBookOpen aria-hidden="true" />
          {course.lessons} lessons
         </span>
         <span>
          <FiTrendingUp aria-hidden="true" />
          {course.level}
         </span>
        </div>
       </div>
      </div>

      <div className="col-12 col-lg-5">
       <aside className="course-purchase-card" aria-label={`${course.title} purchase card`}>
        <div className="course-purchase-image-wrap">
         <img src={course.image} alt={course.title} className="course-purchase-image" />
         {course.badge && <span className="course-purchase-badge">{course.badge}</span>}
        </div>

        <div className="course-purchase-content">
         <div className="course-price-row">
          <strong>{formatPrice(course.price)}</strong>
          <span>{formatPrice(course.originalPrice)}</span>
         </div>

         {savings > 0 && (
          <p className="course-savings">
           Save {formatPrice(savings)} ({discountPercent}% off)
          </p>
         )}

         <Button component={Link} to="/contact" variant="contained" fullWidth className="course-primary-cta">
          Start Learning
         </Button>

         <p className="course-supporting-text">Includes guided lessons, practice activities and learner support.</p>
        </div>
       </aside>
      </div>
     </div>
    </div>
   </section>

   <section className="course-details-content">
    <div className="container">
     <CourseOverview course={course} />
     <LearningOutcomes outcomes={course.learningOutcomes} />
     <Curriculum curriculum={course.curriculum} totalLessons={course.lessons} duration={course.duration} />
     <InstructorSection instructor={course.instructorDetails} />
     <ReviewsSection
      rating={course.rating}
      reviewCount={course.reviews}
      reviews={course.reviewList}
      distribution={course.ratingDistribution}
     />
     <CourseFAQ faq={course.faq} />
    </div>
   </section>

   <RelatedCourses currentCourse={course} courses={courses} />
  </div>
 )
}

export default CourseDetails
