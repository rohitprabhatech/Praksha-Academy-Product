import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom' // <-- 1. Imported the hook
import { FiSearch, FiX } from 'react-icons/fi'
import CategoryFilter from '../components/courses/CategoryFilter'
import CourseGrid from '../components/courses/CourseGrid'
import CoursePagination from '../components/courses/CoursePagination'
import SortSelect from '../components/courses/SortSelect'
import courses from '../data/courses'
import './Courses.css'

const coursesPerPage = 6

function getSearchedCourses(courseList, searchTerm) {
 const query = searchTerm.trim().toLowerCase()

 if (!query) {
  return courseList
 }

 return courseList.filter((course) => {
  const searchableContent = [
   course.title,
   course.category,
   course.description,
   course.instructor,
   course.level,
  ]
   .join(' ')
   .toLowerCase()

  return searchableContent.includes(query)
 })
}

function getFilteredCourses(courseList, selectedCategory) {
 if (selectedCategory === 'All Categories') {
  return courseList
 }

 return courseList.filter((course) => course.category === selectedCategory)
}

function getSortedCourses(courseList, selectedSort) {
 return [...courseList].sort((firstCourse, secondCourse) => {
  switch (selectedSort) {
   case 'rating':
    return secondCourse.rating - firstCourse.rating
   case 'newest':
    return new Date(secondCourse.createdAt) - new Date(firstCourse.createdAt)
   case 'price-low':
    return firstCourse.price - secondCourse.price
   case 'price-high':
    return secondCourse.price - firstCourse.price
   case 'popular':
   default:
    return secondCourse.students - firstCourse.students
  }
 })
}

function Courses() {
 // 2. Initialize the search params hook
 const [searchParams, setSearchParams] = useSearchParams()
 
 // 3. Grab the initial value from the URL (e.g., ?q=python)
 const initialQuery = searchParams.get('q') || ''

 // 4. Set the state to match the URL instead of starting blank
 const [searchTerm, setSearchTerm] = useState(initialQuery)
 const [selectedCategory, setSelectedCategory] = useState('All Categories')
 const [selectedSort, setSelectedSort] = useState('popular')
 const [currentPage, setCurrentPage] = useState(1)
 const resultsRef = useRef(null)

 // 5. Listen for URL changes (in case the user searches from the Navbar while already on this page)
 useEffect(() => {
  const query = searchParams.get('q') || ''
  setSearchTerm(query)
 }, [searchParams])

 const visibleCourses = useMemo(() => {
  const searchedCourses = getSearchedCourses(courses, searchTerm)
  const filteredCourses = getFilteredCourses(searchedCourses, selectedCategory)

  return getSortedCourses(filteredCourses, selectedSort)
 }, [searchTerm, selectedCategory, selectedSort])

 const totalPages = Math.ceil(visibleCourses.length / coursesPerPage)
 const pageStartIndex = (currentPage - 1) * coursesPerPage
 const paginatedCourses = visibleCourses.slice(pageStartIndex, pageStartIndex + coursesPerPage)
 const showingStart = visibleCourses.length === 0 ? 0 : pageStartIndex + 1
 const showingEnd = Math.min(pageStartIndex + paginatedCourses.length, visibleCourses.length)
 const hasActiveFilters = Boolean(searchTerm.trim() || selectedCategory !== 'All Categories')

 useEffect(() => {
  if (currentPage > Math.max(totalPages, 1)) {
   setCurrentPage(1)
  }
 }, [currentPage, totalPages])

 const handleSearchChange = (event) => {
  const newTerm = event.target.value
  setSearchTerm(newTerm)
  
  // Update the URL to match what the user is typing
  if (newTerm) {
    setSearchParams({ q: newTerm })
  } else {
    setSearchParams({})
  }
  
  setCurrentPage(1)
 }

 const handleCategoryChange = (category) => {
  setSelectedCategory(category)
  setCurrentPage(1)
 }

 const handleSortChange = (sortValue) => {
  setSelectedSort(sortValue)
  setCurrentPage(1)
 }

 const handlePageChange = (nextPage) => {
  setCurrentPage(nextPage)

  window.requestAnimationFrame(() => {
   resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
 }

 const clearSearch = () => {
  setSearchTerm('')
  setSearchParams({}) // Clear the URL parameter too
  setCurrentPage(1)
 }

 const clearFilters = () => {
  setSearchTerm('')
  setSelectedCategory('All Categories')
  setSearchParams({}) // Clear the URL parameter too
  setCurrentPage(1)
 }

 return (
  <div className="courses-page">
   <section className="courses-hero">
    <div className="container">
     <div className="courses-hero-content">
      <span className="courses-eyebrow">PRAKSHA ACADEMY</span>

      <h1>Explore Courses</h1>

      <p>
       Learn new skills, strengthen your knowledge, and build your future with courses designed for every learner.
      </p>

      <div className="courses-search-wrapper">
       <FiSearch className="courses-search-icon" aria-hidden="true" />

       <input
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search courses, skills, subjects..."
        aria-label="Search courses"
       />

       {searchTerm && (
        <button type="button" className="courses-search-clear" onClick={clearSearch} aria-label="Clear course search">
         <FiX aria-hidden="true" />
        </button>
       )}
      </div>
     </div>
    </div>
   </section>

   <section className="courses-results-section" ref={resultsRef}>
    <div className="container">
     <div className="courses-results-header">
      <div>
       <span className="courses-results-label">{hasActiveFilters ? 'Filtered Courses' : 'All Courses'}</span>

       <h2>
        {hasActiveFilters
         ? `${visibleCourses.length} ${visibleCourses.length === 1 ? 'course' : 'courses'} found`
         : `${courses.length} Courses Available`}
       </h2>
      </div>

      {hasActiveFilters && (
       <button type="button" className="courses-clear-button" onClick={clearFilters}>
        Clear Filters
       </button>
      )}
     </div>

     <div className="courses-toolbar">
      <CategoryFilter value={selectedCategory} onChange={handleCategoryChange} />
      <SortSelect value={selectedSort} onChange={handleSortChange} />
     </div>

     <div className="courses-summary">
      <span>
       {visibleCourses.length === 0
        ? 'Showing 0 courses'
        : `Showing ${showingStart}-${showingEnd} of ${visibleCourses.length} courses`}
      </span>
     </div>

     <CourseGrid
      courses={paginatedCourses}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      onClearFilters={clearFilters}
     />

     <CoursePagination page={currentPage} count={totalPages} onChange={handlePageChange} />
    </div>
   </section>
  </div>
 )
}

export default Courses