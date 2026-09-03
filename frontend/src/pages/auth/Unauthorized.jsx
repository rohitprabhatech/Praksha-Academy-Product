import { Box, Button, Stack, Typography } from '@mui/material'
import { FiAlertTriangle, FiArrowLeft, FiHome } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: '#F8FAFC',
      }}
    >
      <Stack
        spacing={2.5}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            bgcolor: 'rgba(245, 158, 11, 0.12)',
            color: '#D97706',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <FiAlertTriangle size={24} />
        </Box>

        <Typography sx={{ fontWeight: 700, fontSize: '1.35rem', color: '#0F172A' }}>
          Unauthorized
        </Typography>
        <Typography sx={{ color: '#64748B', fontSize: '0.95rem' }}>
          Your account does not have a recognized role for this application area.
          Please sign in again or contact your academy administrator.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ width: '100%' }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FiArrowLeft />}
            onClick={() => navigate('/login')}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Back to login
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={<FiHome />}
            onClick={() => navigate('/')}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Go home
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default Unauthorized
