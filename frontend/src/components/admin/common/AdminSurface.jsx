import { Paper } from '@mui/material'
import { alpha } from '@mui/material/styles'

function AdminSurface({ children, sx = {}, ...props }) {
 return (
  <Paper
   elevation={0}
   sx={{
    border: '1px solid',
    borderColor: (theme) =>
     theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.08)
      : 'rgba(226, 232, 240, 0.92)',
    borderRadius: 1,
    boxShadow: (theme) =>
     theme.palette.mode === 'dark'
      ? '0 10px 26px rgba(0, 0, 0, 0.18)'
      : '0 1px 2px rgba(15, 23, 42, 0.04)',
    bgcolor: (theme) =>
     theme.palette.mode === 'dark' ? '#1B2A3A' : '#FFFFFF',
    backgroundImage: 'none',
    ...sx,
   }}
   {...props}
  >
   {children}
  </Paper>
 )
}

export default AdminSurface
