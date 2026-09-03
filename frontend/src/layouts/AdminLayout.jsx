import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import AdminSidebar, { ADMIN_SIDEBAR_WIDTH } from '../components/admin/AdminSidebar'
import TopNavbar from '../components/admin/TopNavbar'

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#0F1C2E' : '#F4F7FB',
      }}
    >
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top navbar — sticky, handles mobile hamburger + breadcrumb + search + dark-mode + notifications + profile */}
        <TopNavbar onOpenSidebar={() => setMobileOpen(true)} />

        {/* Page content */}
        <Box
          sx={{
            flex: 1,
            width: '100%',
            maxWidth: `calc(1280px + ${ADMIN_SIDEBAR_WIDTH}px)`,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout
