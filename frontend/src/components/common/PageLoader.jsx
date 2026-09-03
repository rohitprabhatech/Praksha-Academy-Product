import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Shared loading state — Sprint 01, src/components/common/.
 * Centered spinner block; sized to sit inside a page/section, not the
 * whole viewport, so it can wrap an <Outlet /> or a single card later.
 *
 * Usage:
 *   <PageLoader />
 *   <PageLoader label="Loading blog posts..." />
 */
const PageLoader = ({ label = 'Loading...', minHeight = 240, sx = {} }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minHeight,
        width: '100%',
        px: { xs: 2, md: 0 },
        ...sx,
      }}
    >
      <CircularProgress size={30} thickness={4} sx={{ color: '#2563EB' }} />
      {label && (
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default PageLoader;
