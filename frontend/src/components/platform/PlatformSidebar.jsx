import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import {
  FiBriefcase,
  FiCheckSquare,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

export const PLATFORM_SIDEBAR_WIDTH = 260

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/platform/dashboard', icon: FiGrid },
  { label: 'Registration Requests', to: '/platform/requests', icon: FiCheckSquare },
  { label: 'Academies', to: '/platform/academies', icon: FiBriefcase },
]

function NavLinks({ pathname, onNavigate }) {
  return (
    <Stack spacing={0.75} sx={{ px: 2 }}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`)
        const Icon = item.icon
        return (
          <Box
            key={item.to}
            component={RouterLink}
            to={item.to}
            onClick={onNavigate}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: 1.5,
              py: 1.1,
              borderRadius: 2,
              textDecoration: 'none',
              color: active ? '#FFFFFF' : 'rgba(255,255,255,0.82)',
              bgcolor: active ? 'rgba(255,255,255,0.16)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
            }}
          >
            <Icon size={17} />
            <Typography sx={{ fontSize: '0.9rem', fontWeight: active ? 700 : 500 }}>
              {item.label}
            </Typography>
          </Box>
        )
      })}
    </Stack>
  )
}

function SidebarPanel({ onClose, showClose }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login', { replace: true })
  }

  return (
    <Stack
      sx={{
        width: PLATFORM_SIDEBAR_WIDTH,
        height: '100%',
        bgcolor: '#0F172A',
        color: '#FFFFFF',
        py: 2.5,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, mb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em' }}>
            Prabha Technology
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)' }}>
            Master Admin
          </Typography>
        </Box>
        {showClose && (
          <IconButton onClick={onClose} sx={{ color: '#FFF' }} aria-label="Close menu">
            <FiX size={18} />
          </IconButton>
        )}
      </Stack>

      <NavLinks pathname={pathname} onNavigate={onClose} />

      <Box sx={{ flex: 1 }} />
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 2, mb: 1.5 }} />
      <Box sx={{ px: 2.5, mb: 1 }}>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.name}</Typography>
        <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)' }}>
          {user?.email}
        </Typography>
      </Box>
      <Box sx={{ px: 2 }}>
        <Box
          component="button"
          type="button"
          onClick={handleLogout}
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: 0,
            cursor: 'pointer',
            borderRadius: 2,
            px: 1.5,
            py: 1.1,
            bgcolor: 'rgba(255,255,255,0.08)',
            color: '#FFF',
          }}
        >
          <FiLogOut size={16} />
          <Typography sx={{ fontSize: '0.875rem' }}>Log out</Typography>
        </Box>
      </Box>
    </Stack>
  )
}

function PlatformSidebar({ mobileOpen, onClose, onOpen }) {
  return (
    <>
      <IconButton
        onClick={onOpen}
        sx={{
          display: { xs: 'inline-flex', md: 'none' },
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 1200,
          bgcolor: '#0F172A',
          color: '#FFF',
          '&:hover': { bgcolor: '#1E293B' },
        }}
        aria-label="Open menu"
      >
        <FiMenu size={18} />
      </IconButton>

      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          inset: '0 auto 0 0',
          width: PLATFORM_SIDEBAR_WIDTH,
          zIndex: 1100,
        }}
      >
        <SidebarPanel />
      </Box>

      <Drawer
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: PLATFORM_SIDEBAR_WIDTH, border: 0 },
        }}
      >
        <SidebarPanel onClose={onClose} showClose />
      </Drawer>
    </>
  )
}

export default PlatformSidebar
