import { Chip, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { upcomingClasses } from '../../constants/adminDashboard'
import AdminSurface from './common/AdminSurface'

function UpcomingClasses() {
 return (
  <AdminSurface sx={{ p: { xs: 2, md: 2.5 }, height: '100%' }}>
   <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
    <Typography variant="h3" sx={{ fontSize: '1rem', fontWeight: 850 }}>
     Upcoming Classes
    </Typography>
   </Stack>
   <TableContainer sx={{ overflowX: 'auto' }}>
    <Table size="small" aria-label="Upcoming classes">
     <TableHead>
      <TableRow>
       {['Class', 'Teacher', 'Date', 'Time', 'Status'].map((label) => (
        <TableCell key={label} sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 800 }}>
         {label}
        </TableCell>
       ))}
      </TableRow>
     </TableHead>
     <TableBody>
      {upcomingClasses.map((item) => (
       <TableRow key={`${item.subject}-${item.time}`} hover>
        <TableCell sx={{ minWidth: 170, fontWeight: 700 }}>{item.subject}</TableCell>
        <TableCell sx={{ minWidth: 140, color: 'text.secondary' }}>{item.teacher}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.date}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{item.time}</TableCell>
        <TableCell>
         <Chip
          label={item.status}
          size="small"
          color={item.status === 'Live Soon' ? 'warning' : 'primary'}
          variant="outlined"
          sx={{ height: 22, fontSize: '0.72rem', fontWeight: 700 }}
         />
        </TableCell>
       </TableRow>
      ))}
     </TableBody>
    </Table>
   </TableContainer>
  </AdminSurface>
 )
}

export default UpcomingClasses
