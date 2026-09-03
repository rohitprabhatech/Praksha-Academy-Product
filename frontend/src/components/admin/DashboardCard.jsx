import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { FiMoreVertical, FiTrendingUp } from 'react-icons/fi'
import AdminSurface from './common/AdminSurface'

function DashboardCard({ title, value, change, detail, trend = 'up', icon: Icon }) {
 const trendColor = trend === 'up' ? 'success.main' : 'text.secondary'

 return (
  <AdminSurface
   sx={{
    p: 2.5,
    height: '100%',
    transition: 'border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
    '&:hover': {
     borderColor: (theme) => alpha(theme.palette.primary.main, 0.34),
     boxShadow: (theme) =>
      theme.palette.mode === 'dark'
       ? '0 16px 34px rgba(0, 0, 0, 0.28)'
       : '0 18px 38px rgba(15, 23, 42, 0.08)',
     transform: 'translateY(-2px)',
    },
   }}
  >
   <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', minWidth: 0 }}>
     {Icon && (
      <Box
       sx={{
        width: 36,
        height: 36,
        borderRadius: 1.5,
        display: 'grid',
        placeItems: 'center',
        color: 'primary.main',
        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.09),
        flexShrink: 0,
       }}
      >
       <Icon size={18} aria-hidden="true" />
      </Box>
     )}
     <Typography color="text.secondary" sx={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: 0.2 }}>
      {title}
     </Typography>
    </Stack>
    <Box sx={{ color: 'text.secondary', opacity: 0.75 }}>
     <FiMoreVertical size={16} aria-hidden="true" />
    </Box>
   </Stack>
   <Typography
    component="strong"
    sx={{
     display: 'block',
     mt: 2,
     color: 'text.primary',
     fontSize: { xs: '1.75rem', md: '1.95rem' },
     fontWeight: 850,
     lineHeight: 1.05,
    }}
   >
    {value}
   </Typography>
   <Stack
    direction="row"
    spacing={0.75}
    sx={{
     alignItems: 'center',
     mt: 1.6,
     color: trendColor,
     minWidth: 0,
     flexWrap: 'wrap',
     rowGap: 0.25,
    }}
   >
    {trend === 'up' && <FiTrendingUp size={14} aria-hidden="true" />}
    <Typography sx={{ color: trendColor, fontSize: '0.8125rem', fontWeight: 800 }}>{change}</Typography>
    <Typography color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
     {detail}
    </Typography>
   </Stack>
  </AdminSurface>
 )
}

export default DashboardCard
