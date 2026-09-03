import { Box, Button, Typography } from '@mui/material';
import { FiLock, FiArrowLeft, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3 },
        py: { xs: 5, sm: 4 },
        bgcolor: '#F8FAFC',
        backgroundImage: `
          radial-gradient(circle at 18% 12%, rgba(37, 99, 235, 0.08), transparent 42%),
          radial-gradient(circle at 84% 88%, rgba(37, 99, 235, 0.06), transparent 40%)
        `,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 452,
          mx: 'auto',
          transform: 'translateY(-18px)',
        }}
      >
        {/* Ambient glow behind the card — soft, not a hard gradient block */}
        <Box sx={{ position: 'relative' }}>
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: '-20px',
              borderRadius: '26px',
              background:
                'radial-gradient(60% 60% at 50% 0%, rgba(37, 99, 235, 0.07), transparent 70%)',
              filter: 'blur(16px)',
              zIndex: 0,
            }}
          />

          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '18px',
              boxShadow:
                '0 1px 2px rgba(15, 23, 42, 0.04), 0 24px 48px -16px rgba(15, 23, 42, 0.16)',
              overflow: 'hidden',
            }}
          >
            {/* Status rail — quiet signal of the restricted state, not a red block */}
            <Box sx={{ height: 3, bgcolor: '#2563EB' }} />

            <Box sx={{ px: { xs: 3, sm: 5 }, pt: { xs: 4, sm: 4.5 }, pb: { xs: 3.5, sm: 4 } }}>
              {/* Icon treatment: one quiet, confident badge. The status rail above is the page's
                  single signature accent, so the icon itself carries no extra ornament. */}
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '14px',
                  bgcolor: '#172033',
                  boxShadow: '0 10px 22px -8px rgba(23, 32, 51, 0.5)',
                  mx: 'auto',
                  mb: 2.5,
                }}
              >
                <FiLock size={21} color="#FFFFFF" strokeWidth={2} aria-hidden="true" />
              </Box>

              {/* Eyebrow */}
              <Typography
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  mb: 1,
                  color: '#2563EB',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                }}
              >
                Restricted access
              </Typography>

              {/* Heading */}
              <Typography
                component="h1"
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  color: '#172033',
                  fontSize: { xs: '1.55rem', sm: '1.75rem' },
                  fontWeight: 700,
                  lineHeight: 1.25,
                  letterSpacing: '-0.015em',
                }}
              >
                Access denied
              </Typography>

              {/* Description — states plainly that this is a permission issue, not a logged-out
                  state. This single sentence carries that reassurance; no separate badge needed. */}
              <Typography
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  mt: 1,
                  maxWidth: 336,
                  mx: 'auto',
                  color: '#64748B',
                  fontSize: '0.925rem',
                  lineHeight: 1.6,
                }}
              >
                You're signed in, but this area isn't part of your current account's
                permissions. Head back to a section you have access to.
              </Typography>

              {/* Divider */}
              <Box sx={{ width: '100%', height: '1px', bgcolor: '#E2E8F0', mt: 4, mb: 3 }} />

              {/* Actions */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.25,
                  width: '100%',
                }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FiArrowLeft size={16} aria-hidden="true" />}
                  onClick={() => navigate(-1)}
                  aria-label="Go back to the previous page"
                  sx={{
                    order: { xs: 2, sm: 1 },
                    minHeight: 44,
                    borderRadius: '9px',
                    borderColor: '#CBD5E1',
                    color: '#334155',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    transition: 'transform 120ms ease, border-color 120ms ease, background-color 120ms ease',
                    '&:hover': {
                      borderColor: '#94A3B8',
                      bgcolor: '#F8FAFC',
                      transform: 'translateY(-1px)',
                    },
                    '&:focus-visible': {
                      outline: '2px solid #2563EB',
                      outlineOffset: '2px',
                    },
                  }}
                >
                  Go back
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  disableElevation
                  startIcon={<FiHome size={16} aria-hidden="true" />}
                  onClick={() => navigate('/')}
                  aria-label="Go to the home page"
                  sx={{
                    order: { xs: 1, sm: 2 },
                    minHeight: 44,
                    borderRadius: '9px',
                    bgcolor: '#2563EB',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    boxShadow: '0 1px 2px rgba(37, 99, 235, 0.1)',
                    transition: 'transform 120ms ease, background-color 120ms ease',
                    '&:hover': {
                      bgcolor: '#1D4ED8',
                      transform: 'translateY(-1px)',
                    },
                    '&:focus-visible': {
                      outline: '2px solid #172033',
                      outlineOffset: '2px',
                    },
                  }}
                >
                  Go to home
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Brand — quiet footer, outside the card so it reads as page chrome, not part of the message */}
        <Typography
          sx={{
            width: '100%',
            textAlign: 'center',
            mt: 3,
            color: '#94A3B8',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          Praksha Academy
        </Typography>
      </Box>
    </Box>
  );
};

export default AccessDenied;