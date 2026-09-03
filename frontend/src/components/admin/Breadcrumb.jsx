import { Breadcrumbs, Link, Typography } from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'

const labelize = (segment) =>
 segment
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')

function Breadcrumb() {
 const { pathname } = useLocation()
 const parts = pathname.split('/').filter(Boolean)

 return (
  <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.875rem' }}>
   <Link component={RouterLink} to="/admin/dashboard" underline="hover" color="text.secondary">
    Admin
   </Link>
   {parts.slice(1).map((part, index) => {
    const to = `/${parts.slice(0, index + 2).join('/')}`
    const isLast = index === parts.length - 2

    return isLast ? (
     <Typography key={to} color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 700 }}>
      {labelize(part)}
     </Typography>
    ) : (
     <Link key={to} component={RouterLink} to={to} underline="hover" color="text.secondary">
      {labelize(part)}
     </Link>
    )
   })}
  </Breadcrumbs>
 )
}

export default Breadcrumb
