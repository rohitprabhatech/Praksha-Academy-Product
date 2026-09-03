import {
  Box,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { FiChevronDown, FiLogOut, FiX } from 'react-icons/fi'
import { adminNavGroups } from '../../constants/adminDashboard'
import logoMark from '../../assets/praksha-mark.png'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

export const ADMIN_SIDEBAR_WIDTH = 258

const isActivePath = (pathname, path) =>
  pathname === path || pathname.startsWith(`${path}/`)

function SidebarContent({ onClose, showCloseButton = false }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    // Clear authentication from both localStorage and sessionStorage
    logout()

    // Close mobile drawer if open
    if (onClose) {
      onClose()
    }

    // Show confirmation
    toast.success('Logged out successfully')

    // Go to admin login
    navigate('/admin/login', { replace: true })
  }

  return (
    <Stack
      sx={{
        width: ADMIN_SIDEBAR_WIDTH,
        height: '100%',
        color: '#FFFFFF',
        bgcolor: '#2563EB',
        borderRight: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        boxShadow: {
          xs: '18px 0 38px rgba(15, 23, 42, 0.26)',
          lg: 'none',
        },
      }}
    >
      {/* Brand */}
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 68,
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.06)',
        }}
      >
        <Stack
          component={RouterLink}
          to="/admin/dashboard"
          direction="row"
          spacing={1.15}
          onClick={onClose}
          sx={{
            alignItems: 'center',
            minWidth: 0,
            textDecoration: 'none',
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 1.15,
              bgcolor: '#FFFFFF',
              boxShadow: '0 10px 22px rgba(0, 0, 0, 0.18)',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src={logoMark}
              alt="Praksha Academy"
              sx={{
                width: 27,
                height: 27,
                objectFit: 'contain',
              }}
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
                color: 'rgba(255, 255, 255, 0.70)',
                fontSize: '0.68rem',
                fontWeight: 700,
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
            sx={{
              width: 34,
              height: 34,
              color: '#FFFFFF',
              borderRadius: 1.25,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.12)',
              },
            }}
          >
            <FiX size={19} />
          </IconButton>
        )}
      </Stack>

      {/* Navigation */}
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
          scrollbarColor: 'rgba(255, 255, 255, 0.36) transparent',

          '&::-webkit-scrollbar': {
            width: 6,
          },

          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(255, 255, 255, 0.34)',
            borderRadius: 999,
          },
        }}
      >
        {adminNavGroups.map((group) => (
          <Stack key={group.title} spacing={0.3}>
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.15,
                pt: 0.35,
                pb: 0.45,
              }}
            >
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {group.title}
              </Typography>

              {group.items.length > 1 && (
                <FiChevronDown
                  size={12}
                  color="rgba(255, 255, 255, 0.65)"
                  aria-hidden="true"
                />
              )}
            </Stack>

            {group.items.map((item) => {
              const Icon = item.icon
              const active = isActivePath(pathname, item.path)

              return (
                <Tooltip
                  key={item.path}
                  title={
                    item.disabled
                      ? 'Assigned to another module'
                      : ''
                  }
                  placement="right"
                >
                  <Box
                    component={item.disabled ? 'div' : RouterLink}
                    to={item.disabled ? undefined : item.path}
                    onClick={item.disabled ? undefined : onClose}
                    aria-current={active ? 'page' : undefined}
                    aria-disabled={
                      item.disabled ? 'true' : undefined
                    }
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      minHeight: 36,
                      px: 1.15,
                      py: 0.7,
                      borderRadius: 1,
                      color: active
                        ? '#FFFFFF'
                        : item.disabled
                          ? 'rgba(255, 255, 255, 0.45)'
                          : '#FFFFFF',
                      bgcolor: active
                        ? 'rgba(255, 255, 255, 0.16)'
                        : 'transparent',
                      fontWeight: active ? 800 : 600,
                      cursor: item.disabled
                        ? 'not-allowed'
                        : 'pointer',
                      textDecoration: 'none',
                      transition:
                        'background-color 150ms ease, color 150ms ease',

                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 8,
                        bottom: 8,
                        width: 3,
                        borderRadius: 999,
                        bgcolor: active
                          ? '#FFFFFF'
                          : 'transparent',
                      },

                      '&:hover': {
                        bgcolor: item.disabled
                          ? 'transparent'
                          : 'rgba(255, 255, 255, 0.12)',
                        color: item.disabled
                          ? 'rgba(255, 255, 255, 0.45)'
                          : '#FFFFFF',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        display: 'grid',
                        placeItems: 'center',
                        color: item.disabled
                          ? 'rgba(255, 255, 255, 0.45)'
                          : '#FFFFFF',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={16} aria-hidden="true" />
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
                      {item.label}
                    </Typography>

                    {item.disabled && (
                      <Typography
                        component="span"
                        sx={{
                          px: 0.65,
                          py: 0.15,
                          borderRadius: 999,
                          bgcolor:
                            'rgba(255, 255, 255, 0.14)',
                          color:
                            'rgba(255, 255, 255, 0.72)',
                          fontSize: '0.58rem',
                          fontWeight: 800,
                          lineHeight: 1.4,
                        }}
                      >
                        Soon
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              )
            })}
          </Stack>
        ))}
      </Stack>

      {/* Logout */}
      <Box
        sx={{
          px: 1.35,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.06)',
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={handleLogout}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.15,
            width: '100%',
            minHeight: 38,
            px: 1.15,
            py: 0.8,
            border: 'none',
            borderRadius: 1,
            bgcolor: 'transparent',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.82rem',
            fontFamily: 'inherit',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background-color 150ms ease',

            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.12)',
            },
          }}
        >
          <FiLogOut size={16} />

          <Typography
            component="span"
            sx={{
              fontSize: '0.82rem',
              fontWeight: 'inherit',
              color: 'inherit',
            }}
          >
            Logout
          </Typography>
        </Box>
      </Box>
    </Stack>
  )
}

function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop */}
      <Box
        component="aside"
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: ADMIN_SIDEBAR_WIDTH,
          flexShrink: 0,
          height: '100vh',
        }}
      >
        <SidebarContent />
      </Box>

      {/* Mobile */}
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
          },
        }}
      >
        <SidebarContent
          showCloseButton
          onClose={onClose}
        />
      </Drawer>
    </>
  )
}

export default Sidebar