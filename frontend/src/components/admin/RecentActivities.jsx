import { Box, Divider, Stack, Typography } from '@mui/material'
import { adminTokens, recentActivities } from '../../constants/adminDashboard'
import AdminSurface from './common/AdminSurface'

const activityStyle = {
 success: adminTokens.colors.success,
 warning: adminTokens.colors.warning,
 error: adminTokens.colors.error,
 info: adminTokens.colors.info,
}

function RecentActivities() {
 return (
  <AdminSurface sx={{ p: { xs: 2, md: 2.5 }, height: '100%' }}>
   <Typography variant="h3" sx={{ fontSize: '1rem', fontWeight: 850, mb: 1.5 }}>
    Recent Activities
   </Typography>
   <Stack>
    {recentActivities.map((activity, index) => (
     <Box key={activity.title}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start', py: 1.25 }}>
       <Box
        sx={{
         width: 8,
         height: 8,
         borderRadius: 999,
         mt: 0.75,
         bgcolor: activityStyle[activity.type],
         flexShrink: 0,
        }}
       />
       <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{activity.title}</Typography>
        <Typography color="text.secondary" sx={{ fontSize: '0.825rem', lineHeight: 1.55 }}>
         {activity.description}
        </Typography>
       </Box>
       <Typography color="text.secondary" sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
        {activity.time}
       </Typography>
      </Stack>
      {index < recentActivities.length - 1 && <Divider />}
     </Box>
    ))}
   </Stack>
  </AdminSurface>
 )
}

export default RecentActivities
