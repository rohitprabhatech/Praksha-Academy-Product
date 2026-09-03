import { Box, Stack, Typography } from '@mui/material'
import AdminSurface from '../common/AdminSurface'

function ChartSurface({ title, subtitle, children }) {
 return (
  <AdminSurface sx={{ p: { xs: 2, md: 2.5 }, height: '100%' }}>
   <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
    <Box>
     <Typography variant="h3" sx={{ fontSize: '1rem', fontWeight: 850 }}>
      {title}
     </Typography>
     {subtitle && (
      <Typography color="text.secondary" sx={{ mt: 0.4, fontSize: '0.8125rem' }}>
       {subtitle}
      </Typography>
     )}
    </Box>
   </Stack>
   <Box sx={{ width: '100%', height: { xs: 260, md: 292 } }}>{children}</Box>
  </AdminSurface>
 )
}

export default ChartSurface
