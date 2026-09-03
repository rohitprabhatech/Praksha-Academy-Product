import { Box, Stack, Typography, Link as MuiLink } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { FiBookOpen, FiCheck, FiTrendingUp } from 'react-icons/fi';
import LoginForm from '../../components/auth/LoginForm';

const FEATURE_CARDS = [
  { title: 'Live Classes', description: 'Interactive mentor-led sessions' },
  { title: 'Placement Support', description: 'Career guidance and interview preparation' },
  { title: 'Industry Mentors', description: 'Learn from experienced professionals' },
  { title: 'Certificates', description: 'Industry-recognized completion certificates' },
];

const cardEntrance = {
  hidden: { opacity: 0, y: 14 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.15 + index * 0.08, ease: 'easeOut' },
  }),
};

const currentYear = new Date().getFullYear();

const Login = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      {/* ================= MAIN ROW (unchanged layout) ================= */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* ================= LEFT PANEL ================= */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'center',
            width: { md: '45%' },
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #1E40AF 0%, #2563EB 100%)',
            overflow: 'hidden',
            px: { md: 6, lg: 8 },
            py: 1,
          }}
        >
          {/* Decorative — soft grid */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.05,
              backgroundImage:
                'linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          {/* Decorative — blurred accent circles */}
          <Box
            sx={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 260,
              height: 260,
              borderRadius: '50%',
              bgcolor: 'rgba(245, 158, 11, 0.18)',
              filter: 'blur(70px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -100,
              left: -60,
              width: 300,
              height: 300,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              filter: 'blur(80px)',
            }}
          />

          <Stack
            component={motion.div}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            spacing={4}
            sx={{ position: 'relative', zIndex: 1, maxWidth: 410 }}
          >
            {/* Compact brand lockup */}
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: 'rgba(255,255,255,0.14)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FiBookOpen size={16} color="#FFFFFF" aria-hidden="true" />
              </Box>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#FFFFFF',
                  letterSpacing: '-0.01em',
                }}
              >
                Praksha Academy
              </Typography>
            </Stack>

            {/* Typography hierarchy */}
            <Stack spacing={2.5}>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.6875rem',
                  letterSpacing: '0.18em',
                  color: '#F59E0B',
                  textTransform: 'uppercase',
                }}
              >
                Learn &bull; Build &bull; Succeed
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '2rem',
                  lineHeight: 1.25,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                }}
              >
                Empowering Future Developers
              </Typography>
              {/* Readability polish: slightly higher opacity, wider line-height + letter-spacing — same color, size, weight */}
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.005em',
                }}
              >
                Learn Web Development, AI, Cloud Computing and Cyber Security through expert mentors, live classes and real-world projects.
              </Typography>
            </Stack>

            {/* Premium feature cards */}
            <Stack spacing={2}>
              {FEATURE_CARDS.map(({ title, description }, index) => (
                <motion.div
                  key={title}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardEntrance}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <Stack
                    direction="row"
                    spacing={1.75}
                    alignItems="center"
                    sx={{
                      borderRadius: '16px',
                      bgcolor: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                      px: 2,
                      py: 1.5,
                      transition: 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.13)',
                        borderColor: 'rgba(245, 158, 11, 0.35)',
                        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.16)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '9px',
                        bgcolor: 'rgba(245, 158, 11, 0.16)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FiCheck size={17} color="#F59E0B" aria-hidden="true" />
                    </Box>
                    <Stack spacing={0}>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: '#FFFFFF',
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.75rem',
                          color: 'rgba(255,255,255,0.7)',
                        }}
                      >
                        {description}
                      </Typography>
                    </Stack>
                  </Stack>
                </motion.div>
              ))}
            </Stack>
          </Stack>
        </Box>

        {/* ================= RIGHT PANEL ================= */}
        <Box
          sx={{
            width: { xs: '100%', md: '55%' },
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#F8FAFC',
            px: { xs: 3, sm: 4 },
            py: 6,
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            sx={{
              width: '100%',
              maxWidth: 520,
              ml: { md: -2 },
              bgcolor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid rgba(15, 23, 42, 0.06)',
              /* Softer, more premium elevation — layered blur, lower opacity */
              boxShadow:
                '0 1px 2px rgba(15, 23, 42, 0.03), 0 2px 8px rgba(15, 23, 42, 0.04), 0 40px 80px -24px rgba(15, 23, 42, 0.14)',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow:
                  '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.05), 0 48px 96px -24px rgba(15, 23, 42, 0.18)',
              },
              /* Reduced from 5/6 to 4/5 — trims unnecessary empty space, stays on the 8px grid */
              px: { xs: 3.5, sm: 5 },
              py: { xs: 2.5, sm: 3.5 },
            }}
          >
            <Stack
              spacing={0.5}
              sx={{
                width: '100%',
                textAlign: 'center',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  bgcolor: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 0,
                  mx: 'auto',
                  mb: 1.5,
                }}
              >
                <FiBookOpen size={20} color="#FFFFFF" aria-hidden="true" />
              </Box>
              <Typography
                component="h1"
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.625rem',
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  textAlign: 'center',
                  mb: 0.5,
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  color: '#64748B',
                  textAlign: 'center',
                  mb: 2,
                }}
              >
                Sign in to continue your learning journey.
              </Typography>
            </Stack>

            <LoginForm />
          </Box>
        </Box>
      </Box>

      {/* ================= FOOTER ================= */}
      <Box
        component="footer"
        sx={{
          width: '100%',
          bgcolor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          px: { xs: 3, sm: 4 },
          py: 3,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 3 }}
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              color: '#64748B',
              textAlign: 'center',
            }}
          >
            © {currentYear} Praksha Academy. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2} component="nav" aria-label="Legal">
            <MuiLink
              component={RouterLink}
              to="/terms"
              underline="hover"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#64748B',
                '&:hover': { color: '#2563EB' },
                '&:focus-visible': {
                  outline: '2px solid #2563EB',
                  outlineOffset: '2px',
                  borderRadius: '4px',
                },
              }}
            >
              Terms
            </MuiLink>
            <MuiLink
              component={RouterLink}
              to="/privacy"
              underline="hover"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#64748B',
                '&:hover': { color: '#2563EB' },
                '&:focus-visible': {
                  outline: '2px solid #2563EB',
                  outlineOffset: '2px',
                  borderRadius: '4px',
                },
              }}
            >
              Privacy Policy
            </MuiLink>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;