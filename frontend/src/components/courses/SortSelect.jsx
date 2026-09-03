import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import './SortSelect.css'

const sortOptions = [
 { value: 'popular', label: 'Most Popular' },
 { value: 'rating', label: 'Highest Rated' },
 { value: 'newest', label: 'Newest' },
 { value: 'price-low', label: 'Price: Low to High' },
 { value: 'price-high', label: 'Price: High to Low' },
]

function SortSelect({ value, onChange }) {
 return (
  <FormControl className="course-control course-sort-select" size="small">
   <InputLabel id="course-sort-select-label">Sort by</InputLabel>
   <Select
    labelId="course-sort-select-label"
    id="course-sort-select"
    value={value}
    label="Sort by"
    onChange={(event) => onChange(event.target.value)}
   >
    {sortOptions.map((option) => (
     <MenuItem value={option.value} key={option.value}>
      {option.label}
     </MenuItem>
    ))}
   </Select>
  </FormControl>
 )
}

export default SortSelect
