import { Box, IconButton, InputBase, Stack, Tooltip, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { FiMenu, FiMoon, FiSearch, FiSun } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'
import { useThemeMode } from '../../context/ThemeModeContext'
import Breadcrumb from './Breadcrumb'
import NotificationDropdown from './NotificationDropdown'
import ProfileMenu from './ProfileMenu'

const getPageTitle = (pathname) => {
 const segment = pathname.split('/').filter(Boolean).at(-1) || 'dashboard'

 return segment
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')
}

function TopNavbar({ onOpenSidebar }) {
 const { mode, toggleMode } = useThemeMode()
 const { pathname } = useLocation()

 const isDark = mode === 'dark'

 return (
  <Box
   component="header"
   sx={{
    position: 'sticky',
    top: 0,
    zIndex: 20,
    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#162231' : '#F4F7FB'),
    borderBottom: '1px solid',
    borderColor: (theme) =>
     theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(226, 232, 240, 0.78)',
    px: { xs: 1.5, sm: 2.5, lg: 3.25 },
    py: { xs: 1, md: 1.15 },
   }}
  >
   <Stack
    direction="row"
    spacing={{ xs: 0.75, sm: 1.25, md: 1.5 }}
    sx={{
     alignItems: 'center',
     minWidth: 0,
    }}
   >
    {/* Mobile menu — breakpoint matches AdminSidebar's md switch-over
        (AdminSidebar.jsx uses `md` for permanent-vs-drawer). This used
        to be `lg` here, which left a "double hamburger" dead zone
        between md and lg widths: AdminSidebar would already be
        permanent (visible), but this button would still render too. */}
    <IconButton
     onClick={onOpenSidebar}
     aria-label="Open admin menu"
     sx={{
      display: { xs: 'inline-flex', md: 'none' },
      width: 38,
      height: 38,
      color: 'text.primary',
      border: '1px solid',
      borderColor: (theme) =>
       theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.95)',
      borderRadius: 1,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1B2A3A' : '#FFFFFF'),
      '&:hover': {
       bgcolor: 'action.hover',
      },
     }}
    >
     <FiMenu size={20} />
    </IconButton>

    {/* Page information */}
    <Box
     sx={{
      minWidth: 0,
      flex: 1,
     }}
    >
     <Typography
      sx={{
       color: 'text.primary',
       fontSize: { xs: '1rem', sm: '1.12rem' },
       fontWeight: 800,
       lineHeight: 1.25,
       overflow: 'hidden',
       textOverflow: 'ellipsis',
       whiteSpace: 'nowrap',
      }}
     >
      {getPageTitle(pathname)}
     </Typography>

     <Box
      sx={{
       display: { xs: 'none', sm: 'block' },
       mt: 0.25,
      }}
     >
      <Breadcrumb />
     </Box>
    </Box>

    {/* Search */}
    <Box
     sx={{
      display: { xs: 'none', md: 'flex' },
      alignItems: 'center',
      gap: 1,
      width: { md: 240, lg: 310 },
      minHeight: 38,
      px: 1.25,
      py: 0.55,
      border: '1px solid',
      borderColor: (theme) =>
       theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.95)',
      borderRadius: 1,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1B2A3A' : '#FFFFFF'),
      color: 'text.secondary',
      transition: 'all 0.2s ease',
      '&:focus-within': {
       borderColor: 'primary.main',
       boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.1)}`,
      },
     }}
    >
     <FiSearch size={17} aria-hidden="true" />

     <InputBase
      placeholder="Search topics..."
      aria-label="Search admin"
      fullWidth
      sx={{
       color: 'text.primary',
       fontSize: '0.82rem',
       fontWeight: 500,

       '& input::placeholder': {
        color: 'text.secondary',
        opacity: 1,
       },
      }}
     />
    </Box>

    {/* Theme toggle */}
    <Tooltip
     title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
     arrow
    >
     <IconButton
      onClick={toggleMode}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      sx={{
       width: 38,
       height: 38,
       color: 'text.primary',
       border: '1px solid',
       borderColor: (theme) =>
       theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.95)',
       borderRadius: 1,
       bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1B2A3A' : '#FFFFFF'),
       '&:hover': {
        bgcolor: 'action.hover',
       },
      }}
     >
      {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
     </IconButton>
    </Tooltip>

    {/* Notifications */}
    <NotificationDropdown />

    {/* Profile */}
    <ProfileMenu />
   </Stack>
  </Box>
 )
}

export default TopNavbar
