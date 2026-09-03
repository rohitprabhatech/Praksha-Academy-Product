import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { FiChevronDown, FiLogOut, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { adminNavGroups } from '../../constants/adminDashboard'
import praksaMark from '../../assets/praksha-mark.png'
import { useAuth } from '../../context/AuthContext'

export const ADMIN_SIDEBAR_WIDTH = 258

// ─── helpers ────────────────────────────────────────────────────────────────

const isActivePath = (pathname, path) =>
  pathname === path || pathname.startsWith(`${path}/`)

// ─── sub-components ─────────────────────────────────────────────────────────

function NavItem({ item, pathname, onNavigate }) {
  const { icon: Icon, label, path, disabled } = item
  const active = !disabled && isActivePath(pathname, path)

  const commonSx = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    minHeight: 36,
    px: 1.15,
    py: 0.7,
    borderRadius: 1,
    fontWeight: active ? 800 : 600,
    textDecoration: 'none',
    transition: 'background-color 150ms ease, color 150ms ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? 'rgba(255,255,255,0.42)' : '#FFFFFF',
    bgcolor: active ? 'rgba(255,255,255,0.16)' : 'transparent',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 8,
      bottom: 8,
      width: 3,
      borderRadius: 999,
      bgcolor: active ? '#FFFFFF' : 'transparent',
    },
    '&:hover': {
      bgcolor: disabled ? 'transparent' : 'rgba(255,255,255,0.10)',
    },
  }

  const inner = (
    <>
      <Box
        sx={{
          width: 20,
          display: 'grid',
          placeItems: 'center',
          color: 'inherit',
          flexShrink: 0,
        }}
      >
        <Icon size={15} aria-hidden="true" />
      </Box>

      <Typography
        component="span"
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: '0.82rem',
          fontWeight: 'inherit',
          color: 'inherit',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>

      {disabled && (
        <Typography
          component="span"
          sx={{
            px: 0.65,
            py: 0.15,
            borderRadius: 999,
            bgcolor: 'rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.62)',
            fontSize: '0.58rem',
            fontWeight: 800,
            lineHeight: 1.4,
            flexShrink: 0,
          }}
        >
          Soon
        </Typography>
      )}
    </>
  )

  if (disabled) {
    return (
      <Tooltip title="Coming Soon" placement="right" arrow>
        <Box
          role="menuitem"
          aria-disabled="true"
          sx={commonSx}
        >
          {inner}
        </Box>
      </Tooltip>
    )
  }

  return (
    <Box
      component={RouterLink}
      to={path}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      sx={commonSx}
    >
      {inner}
    </Box>
  )
}

function SidebarContent({ onClose, showCloseButton = false }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login', { replace: true })
  }

  return (
    <Stack
      sx={{
        width: ADMIN_SIDEBAR_WIDTH,
        height: '100%',
        bgcolor: '#1D3461',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        boxShadow: { xs: '18px 0 38px rgba(15,23,42,0.26)', lg: 'none' },
      }}
    >
      {/* ── Brand header ─────────────────────────────────────── */}
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
          px: 2,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <Stack
          component={RouterLink}
          to="/admin/dashboard"
          direction="row"
          spacing={1.15}
          onClick={onClose}
          sx={{ alignItems: 'center', minWidth: 0, textDecoration: 'none' }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 1.15,
              bgcolor: '#FFFFFF',
              boxShadow: '0 6px 16px rgba(0,0,0,0.22)',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={praksaMark}
              alt="Praksha Academy"
              sx={{ width: 26, height: 26, objectFit: 'contain' }}
            />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: '#FFFFFF',
                fontSize: '0.92rem',
                fontWeight: 800,
                lineHeight: 1.1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              Praksha
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.60)',
                fontSize: '0.68rem',
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              Academy Admin
            </Typography>
          </Box>
        </Stack>

        {showCloseButton && (
          <IconButton
            onClick={onClose}
            aria-label="Close admin menu"
            size="small"
            sx={{
              color: '#FFFFFF',
              borderRadius: 1.25,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
            }}
          >
            <FiX size={18} />
          </IconButton>
        )}
      </Stack>

      {/* ── Navigation ───────────────────────────────────────── */}
      <Stack
        component="nav"
        aria-label="Admin navigation"
        spacing={1.35}
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 1.35,
          py: 2,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.24) transparent',
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(255,255,255,0.22)',
            borderRadius: 999,
          },
        }}
      >
        {adminNavGroups.map((group) => (
          <Stack key={group.title} spacing={0.25}>
            {/* Group label */}
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.15,
                pt: 0.4,
                pb: 0.5,
              }}
            >
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.50)',
                  fontSize: '0.635rem',
                  fontWeight: 800,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                }}
              >
                {group.title}
              </Typography>
              {group.items.length > 1 && (
                <FiChevronDown
                  size={11}
                  color="rgba(255,255,255,0.40)"
                  aria-hidden="true"
                />
              )}
            </Stack>

            {/* Items */}
            {group.items.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                pathname={pathname}
                onNavigate={onClose}
              />
            ))}
          </Stack>
        ))}
      </Stack>

      {/* ── Logout ───────────────────────────────────────────── */}
      <Box
        sx={{
          px: 1.35,
          py: 1.5,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={handleLogout}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            width: '100%',
            minHeight: 38,
            px: 1.15,
            py: 0.8,
            border: 'none',
            borderRadius: 1,
            bgcolor: 'transparent',
            color: 'rgba(255,255,255,0.80)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background-color 150ms ease, color 150ms ease',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.10)',
              color: '#FFFFFF',
            },
          }}
        >
          <FiLogOut size={16} aria-hidden="true" />
          <span>Logout</span>
        </Box>
      </Box>
    </Stack>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

/**
 * AdminSidebar
 * Desktop: permanent sidebar (hidden on mobile).
 * Mobile: temporary Drawer triggered by TopNavbar hamburger.
 */
function AdminSidebar({ mobileOpen = false, onClose = () => { } }) {
  return (
    <>
      {/* Desktop permanent sidebar */}
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: ADMIN_SIDEBAR_WIDTH,
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        <SidebarContent />
      </Box>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            border: 0,
            bgcolor: 'transparent',
            width: ADMIN_SIDEBAR_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <SidebarContent showCloseButton onClose={onClose} />
      </Drawer>
    </>
  )
}

export default AdminSidebar
