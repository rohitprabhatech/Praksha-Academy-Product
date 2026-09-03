import { Pagination } from '@mui/material'
import './CoursePagination.css'

function CoursePagination({ page, count, onChange }) {
 if (count <= 1) {
  return null
 }

 return (
  <div className="course-pagination-wrapper">
   <Pagination
    count={count}
    page={page}
    onChange={(_, nextPage) => onChange(nextPage)}
    color="primary"
    shape="rounded"
    size="medium"
    siblingCount={1}
    boundaryCount={1}
   />
  </div>
 )
}

export default CoursePagination
