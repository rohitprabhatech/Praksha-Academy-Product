import { Box, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

/**
 * PageHeader — reusable admin page title + breadcrumb bar.
 *
 * Props:
 *  title       {string}  — page heading
 *  subtitle    {string}  — optional subtext
 *  breadcrumbs {Array}   — [{ label, to? }] (last item is always active/current)
 *  action      {node}    — optional action button (e.g. "Add New")
 */
const PageHeader = ({ title, subtitle, breadcrumbs = [], action }) => (
  <Box sx={{ mb: 3 }}>
    {/* Breadcrumbs */}
    {breadcrumbs.length > 0 && (
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <Stack key={idx} direction="row" alignItems="center" spacing={0.5}>
              {idx > 0 && <FiChevronRight size={13} color="#94A3B8" aria-hidden="true" />}
              {crumb.to && !isLast ? (
                <Typography
                  component={RouterLink}
                  to={crumb.to}
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8125rem',
                    color: '#64748B',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': { color: '#2563EB' },
                  }}
                >
                  {crumb.label}
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8125rem',
                    color: isLast ? '#2563EB' : '#64748B',
                    fontWeight: isLast ? 600 : 500,
                  }}
                >
                  {crumb.label}
                </Typography>
              )}
            </Stack>
          );
        })}
      </Stack>
    )}

    {/* Title row */}
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
      <Box>
        <Typography
          component="h1"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: { xs: '1.375rem', md: '1.625rem' },
            color: '#1E293B',
            lineHeight: 1.25,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: '#64748B',
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Stack>
  </Box>
);

export default PageHeader;
