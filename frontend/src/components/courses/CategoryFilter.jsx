import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import './CategoryFilter.css'

const courseCategories = [
 'Class 8',
 'Class 9',
 'Class 10',
 'Class 11',
 'Class 12',
 'English Grammar',
 'Spoken English',
 'Programming',
 'Web Development',
 'AI',
 'Data Science',
]

function CategoryFilter({ value, onChange }) {
 return (
  <FormControl className="course-control course-category-filter" size="small">
   <InputLabel id="course-category-filter-label">Category</InputLabel>
   <Select
    labelId="course-category-filter-label"
    id="course-category-filter"
    value={value}
    label="Category"
    onChange={(event) => onChange(event.target.value)}
   >
    <MenuItem value="All Categories">All Categories</MenuItem>
    {courseCategories.map((category) => (
     <MenuItem value={category} key={category}>
      {category}
     </MenuItem>
    ))}
   </Select>
  </FormControl>
 )
}

export default CategoryFilter
