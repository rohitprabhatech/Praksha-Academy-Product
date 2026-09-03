import { Box, Button, Stack, Typography } from '@mui/material'
import { FiBookOpen } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

/**
 * Minimal Teacher shell dashboard (requirements: redirect target until Sprint 14).
 */
const TeacherDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', p: { xs: 2, md: 4 } }}>
      <Stack
        spacing={2}
        sx={{
          maxWidth: 720,
          mx: 'auto',
          p: { xs: 3, md: 4 },
          bgcolor: '#FFFFFF',
          borderRadius: 3,
          border: '1px solid #E2E8F0',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: 'rgba(37,99,235,0.1)',
              color: '#2563EB',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <FiBookOpen size={20} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>
              Teacher Dashboard
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.875rem' }}>
              Welcome{user?.name ? `, ${user.name}` : ''}
            </Typography>
          </Box>
        </Stack>

        <Typography sx={{ color: '#475569' }}>
          This is a temporary shell so role-based login redirect works.
          Full teacher modules arrive in later frontend sprints.
        </Typography>

        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{ alignSelf: 'flex-start', textTransform: 'none', borderRadius: 2 }}
        >
          Log out
        </Button>
      </Stack>
    </Box>
  )
}

export default TeacherDashboard
