import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { FiMenu } from 'react-icons/fi';
import Sidebar, { SIDEBAR_WIDTH } from '../components/student/Sidebar';

/* Visible keyboard focus ring — only on :focus-visible */
const focusRingSx = {
  '&:focus-visible': {
    outline: '2px solid #2563EB',
    outlineOffset: '2px',
    borderRadius: '6px',
  },
};

const StudentLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Mobile top bar — hidden on desktop, sidebar is permanent there */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'sticky',
            top: 0,
            zIndex: 10,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #E2E8F0',
            px: 2,
            py: 1.5,
          }}
        >
          <IconButton
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            sx={{ color: '#1E293B', ...focusRingSx }}
          >
            <FiMenu size={22} />
          </IconButton>
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#1E293B',
            }}
          >
            Praksha Academy
          </Typography>
        </Stack>

        {/* Page content */}
        <Box
          sx={{
            flex: 1,
            width: '100%',
            maxWidth: `calc(1200px + ${SIDEBAR_WIDTH}px)`,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default StudentLayout;