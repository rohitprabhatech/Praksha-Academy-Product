import { Box, Typography, Button } from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Shared "something went wrong" state — Sprint 01, src/components/common/.
 *
 * Usage:
 *   <ErrorState onRetry={() => refetch()} />
 *   <ErrorState message="Couldn't load blog posts." onRetry={refetch} />
 */
const ErrorState = ({
  title = 'Something went wrong',
  message = "We couldn't load this. Please try again.",
  retryLabel = 'Retry',
  onRetry,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        px: { xs: 2, md: 0 },
        py: { xs: 5, md: 6 },
        maxWidth: 420,
        mx: 'auto',
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          mx: 'auto',
          mb: 2,
          borderRadius: '14px',
          bgcolor: 'rgba(239, 68, 68, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#EF4444',
        }}
      >
        <FiAlertTriangle size={24} aria-hidden="true" />
      </Box>

      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1E293B', mb: 0.75 }}>
        {title}
      </Typography>

      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
        {message}
      </Typography>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="contained"
          size="small"
          sx={{ mt: 2.5, textTransform: 'none', fontWeight: 600, bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}
        >
          {retryLabel}
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
