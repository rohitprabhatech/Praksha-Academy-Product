import { FiRotateCcw, FiSearch } from 'react-icons/fi'
import CourseCard from './CourseCard'
import './CourseGrid.css'

function CourseGrid({ courses, searchTerm, selectedCategory, onClearFilters }) {
 if (courses.length === 0) {
  const searchText = searchTerm.trim()
  const categoryText = selectedCategory !== 'All Categories' ? selectedCategory : ''

  return (
   <div className="course-empty-state">
    <div className="course-empty-icon">
     <FiSearch aria-hidden="true" />
    </div>

    <h3>No courses found</h3>

    <p>
     We couldn&apos;t find courses matching your current
     {searchText && (
      <>
       {' '}
       search for <strong>&quot;{searchText}&quot;</strong>
      </>
     )}
     {categoryText && (
      <>
       {' '}
       in <strong>{categoryText}</strong>
      </>
     )}
     .
    </p>

    <span>Try searching for Python, AI, Web Development, or English.</span>

    <button type="button" className="course-empty-reset" onClick={onClearFilters}>
     <FiRotateCcw aria-hidden="true" />
     Reset filters
    </button>
   </div>
  )
 }

 return (
  <div className="row g-4">
   {courses.map((course) => (
    <div className="col-12 col-md-6 col-lg-4" key={course.id}>
     <CourseCard course={course} />
    </div>
   ))}
  </div>
 )
}

export default CourseGrid
