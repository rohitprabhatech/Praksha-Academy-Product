import { Box, Typography, Button } from '@mui/material';
import { FiInbox } from 'react-icons/fi';

/**
 * Shared "no data" state — Sprint 01, src/components/common/.
 *
 * Usage:
 *   <EmptyState title="No blog posts found" />
 *   <EmptyState
 *     title="No messages yet"
 *     message="New contact-form submissions will show up here."
 *     actionLabel="Refresh"
 *     onAction={() => refetch()}
 *   />
 */
const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'Nothing here yet',
  message,
  actionLabel,
  onAction,
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
          bgcolor: 'rgba(100, 116, 139, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748B',
        }}
      >
        <Icon size={24} aria-hidden="true" />
      </Box>

      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1E293B', mb: message ? 0.75 : 0 }}>
        {title}
      </Typography>

      {message && (
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>
          {message}
        </Typography>
      )}

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="outlined"
          size="small"
          sx={{ mt: 2.5, textTransform: 'none', fontWeight: 600 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
