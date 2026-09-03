import { Box, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import {
  FiBookOpen,
  FiShield,
  FiClock,
  FiLock,
} from 'react-icons/fi';

import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

/* ======================================================
   Recovery highlights
====================================================== */

const RECOVERY_POINTS = [
  {
    title: 'Secure password recovery',
    description: 'Reset your account through a protected process.',
    icon: FiShield,
  },
  {
    title: 'One-time reset link',
    description: 'Your recovery link is temporary and secure.',
    icon: FiClock,
  },
  {
    title: 'Your account stays protected',
    description: 'Nothing changes until you create a new password.',
    icon: FiLock,
  },
];

/* ======================================================
   Animation
====================================================== */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
};

const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.15 + index * 0.08,
      ease: 'easeOut',
    },
  }),
};

/* ======================================================
   Forgot Password Page
====================================================== */

const ForgotPassword = () => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        bgcolor: '#F8FAFC',
        overflow: 'hidden',
      }}
    >
      {/* ==================================================
          LEFT BRAND PANEL
      ================================================== */}

      <Box
        sx={{
          display: {
            xs: 'none',
            md: 'flex',
          },

          position: 'relative',

          width: {
            md: '48%',
            lg: '47%',
          },

          minHeight: '100vh',

          flexDirection: 'column',
          justifyContent: 'center',

          px: {
            md: 6,
            lg: 9,
          },

          py: 6,

          overflow: 'hidden',

          background:
            'linear-gradient(155deg, #172554 0%, #1E40AF 42%, #2563EB 100%)',
        }}
      >
        {/* Grid */}

        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.055,

            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',

            backgroundSize: '40px 40px',

            maskImage:
              'linear-gradient(to bottom, black, transparent 90%)',
          }}
        />

        {/* Blue ambient glow */}

        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            width: 420,
            height: 420,
            right: -170,
            top: '25%',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(59,130,246,0.55), transparent 70%)',
            filter: 'blur(35px)',
          }}
        />

        {/* Bottom glow */}

        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            width: 420,
            height: 420,
            left: -220,
            bottom: -220,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(96,165,250,0.3), transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Content */}

        <Stack
          component={motion.div}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          spacing={4}
          sx={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 560,
            mx: 'auto',
          }}
        >
          {/* Brand */}

          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '12px',

                bgcolor: 'rgba(255,255,255,0.1)',
                border:
                  '1px solid rgba(255,255,255,0.18)',

                backdropFilter: 'blur(10px)',
              }}
            >
              <FiBookOpen
                size={21}
                color="#FFFFFF"
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </Box>

            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 750,
                fontSize: '1.05rem',
                color: '#FFFFFF',
                letterSpacing: '-0.015em',
              }}
            >
              Praksha Academy
            </Typography>
          </Stack>

          {/* Main message */}

          <Stack spacing={2.5}>
            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 34,
                  height: 3,
                  borderRadius: 999,
                  bgcolor: '#F59E0B',
                }}
              />

              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#F59E0B',
                }}
              >
                Account recovery
              </Typography>
            </Stack>

            <Typography
              component="h2"
              sx={{
                maxWidth: 590,

                fontFamily: 'Inter, sans-serif',
                fontWeight: 750,

                fontSize: {
                  md: '2.55rem',
                  lg: '3.05rem',
                },

                lineHeight: 1.12,

                letterSpacing: '-0.04em',

                color: '#FFFFFF',
              }}
            >
              Forgot your password?
            </Typography>

            <Typography
              sx={{
                maxWidth: 510,

                fontFamily: 'Inter, sans-serif',

                fontSize: {
                  md: '0.98rem',
                  lg: '1rem',
                },

                lineHeight: 1.75,

                color: 'rgba(255,255,255,0.78)',
              }}
            >
              Don&apos;t worry. We&apos;ll help you securely recover
              your account and get back to your learning journey.
            </Typography>
          </Stack>

          {/* Recovery cards */}

          <Stack spacing={1.5}>
            {RECOVERY_POINTS.map(
              ({ title, description, icon: Icon }, index) => (
                <Box
                  key={title}
                  component={motion.div}
                  custom={index}
                  variants={cardAnimation}
                  initial="hidden"
                  animate="visible"
                  whileHover={{
                    y: -2,
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.75,

                    minHeight: 72,

                    px: 1.75,
                    py: 1.25,

                    borderRadius: '14px',

                    bgcolor:
                      'rgba(255,255,255,0.075)',

                    border:
                      '1px solid rgba(255,255,255,0.13)',

                    backdropFilter: 'blur(12px)',

                    transition:
                      'background-color 160ms ease, border-color 160ms ease',

                    '&:hover': {
                      bgcolor:
                        'rgba(255,255,255,0.105)',

                      borderColor:
                        'rgba(255,255,255,0.22)',
                    },
                  }}
                >
                  {/* Icon */}

                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      flexShrink: 0,

                      display: 'grid',
                      placeItems: 'center',

                      borderRadius: '11px',

                      bgcolor:
                        'rgba(255,255,255,0.1)',

                      border:
                        '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <Icon
                      size={19}
                      color="#FFFFFF"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </Box>

                  {/* Text */}

                  <Stack spacing={0.25}>
                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                      }}
                    >
                      {title}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.74rem',
                        lineHeight: 1.45,
                        color:
                          'rgba(255,255,255,0.62)',
                      }}
                    >
                      {description}
                    </Typography>
                  </Stack>
                </Box>
              ),
            )}
          </Stack>
        </Stack>
      </Box>

      {/* ==================================================
          RIGHT FORM PANEL
      ================================================== */}

      <Box
        sx={{
          width: {
            xs: '100%',
            md: '52%',
            lg: '53%',
          },

          minHeight: '100vh',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          px: {
            xs: 2.25,
            sm: 4,
            md: 5,
            lg: 7,
          },

          py: {
            xs: 4,
            sm: 5,
            md: 6,
          },

          position: 'relative',

          bgcolor: '#F8FAFC',

          backgroundImage: `
            radial-gradient(
              circle at 70% 20%,
              rgba(37,99,235,0.055),
              transparent 35%
            )
          `,
        }}
      >
        {/* Form card */}

        <Box
          component={motion.div}
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            ease: 'easeOut',
          }}
          sx={{
            position: 'relative',

            width: '100%',

            maxWidth: {
              xs: 520,
              sm: 500,
              lg: 510,
            },

            bgcolor: '#FFFFFF',

            borderRadius: {
              xs: '20px',
              sm: '24px',
            },

            border:
              '1px solid rgba(15,23,42,0.07)',

            boxShadow:
              '0 1px 2px rgba(15,23,42,0.03), 0 18px 45px rgba(15,23,42,0.08), 0 35px 80px rgba(15,23,42,0.07)',

            overflow: 'hidden',

            px: {
              xs: 2.75,
              sm: 5,
            },

            py: {
              xs: 3.5,
              sm: 4.5,
            },

            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              bgcolor: '#2563EB',
            },
          }}
        >
          <ForgotPasswordForm />
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;