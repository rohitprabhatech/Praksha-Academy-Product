import { Box, Stack, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  FiArrowRight,
  FiBookOpen,
  FiCompass,
} from 'react-icons/fi';

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';

  return 'Good evening';
};

/**
 * Student dashboard welcome header.
 *
 * @param {string} name
 * @param {number} continueProgress
 * @param {string} continueCourseTitle
 */

const DashboardHeader = ({
  name,
  continueProgress = 0,
  continueCourseTitle,
}) => {
  const greeting = getGreeting();

  const hasActiveCourse = Boolean(continueCourseTitle);

  const safeProgress = Math.min(
    100,
    Math.max(0, Number(continueProgress) || 0)
  );

  return (
    <Box
      component={motion.div}
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: 'easeOut',
      }}
      sx={{
        position: 'relative',
        overflow: 'hidden',

        /*
         * Shorter hero:
         * The dashboard content should remain the visual focus.
         */
        minHeight: {
          xs: 250,
          sm: 270,
          md: 285,
        },

        display: 'flex',
        alignItems: 'center',

        borderRadius: {
          xs: '18px',
          sm: '20px',
          md: '22px',
        },

        /*
         * Softer blue.
         * Less saturated than the previous version.
         */
        background:
          'linear-gradient(120deg, #1E3A8A 0%, #2454C6 52%, #3275E8 100%)',

        px: {
          xs: 2.5,
          sm: 3.5,
          md: 4,
        },

        py: {
          xs: 2.75,
          sm: 3,
          md: 3.25,
        },

        boxShadow:
          '0 12px 30px rgba(37, 99, 235, 0.16)',
      }}
    >
      {/* =====================================================
          VERY SUBTLE GRID
          ===================================================== */}

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,

          opacity: 0.025,

          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,1) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,1) 1px,
              transparent 1px
            )
          `,

          backgroundSize: '32px 32px',

          pointerEvents: 'none',
        }}
      />

      {/* =====================================================
          VERY SMALL AMBIENT LIGHT
          No large blur/glow.
          ===================================================== */}

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',

          width: 180,
          height: 180,

          right: -100,
          top: -100,

          borderRadius: '50%',

          background:
            'rgba(255,255,255,0.045)',

          pointerEvents: 'none',
        }}
      />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <Stack
        spacing={{
          xs: 1.35,
          sm: 1.5,
        }}
        sx={{
          position: 'relative',
          zIndex: 1,

          width: '100%',

          maxWidth: '760px',
        }}
      >
        {/* Greeting */}

        <Typography
          component="p"
          sx={{
            m: 0,

            fontFamily:
              'Inter, sans-serif',

            fontSize: {
              xs: '0.78rem',
              sm: '0.82rem',
            },

            fontWeight: 600,

            letterSpacing:
              '0.02em',

            color:
              'rgba(255,255,255,0.82)',
          }}
        >
          {greeting}
          {name ? `, ${name}` : ''}
        </Typography>

        {/* Main heading */}

        <Typography
          component="h1"
          sx={{
            m: 0,

            fontFamily:
              'Inter, sans-serif',

            fontWeight: 700,

            fontSize: {
              xs: '1.5rem',
              sm: '1.8rem',
              md: '2rem',
            },

            lineHeight: 1.18,

            letterSpacing:
              '-0.02em',

            color: '#FFFFFF',

            maxWidth: '700px',
          }}
        >
          {hasActiveCourse
            ? 'Ready to pick up where you left off?'
            : 'Welcome to your learning space'}
        </Typography>

        {/* Current course */}

        <Typography
          component="p"
          sx={{
            m: 0,

            fontFamily:
              'Inter, sans-serif',

            fontSize: {
              xs: '0.88rem',
              sm: '0.92rem',
            },

            lineHeight: 1.5,

            color:
              'rgba(255,255,255,0.78)',

            maxWidth: '620px',
          }}
        >
          {hasActiveCourse
            ? continueCourseTitle
            : 'You haven’t enrolled in a course yet — let’s find your first one.'}
        </Typography>

        {/* ===================================================
            PROGRESS
            =================================================== */}

        {hasActiveCourse && (
          <Stack
            spacing={0.8}
            sx={{
              width: '100%',

              maxWidth: {
                xs: '100%',
                sm: '560px',
              },

              pt: 0.3,
            }}
          >
            {/* Progress labels */}

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                width: '100%',
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontFamily:
                    'Inter, sans-serif',

                  fontSize:
                    '0.72rem',

                  fontWeight: 600,

                  color:
                    'rgba(255,255,255,0.72)',
                }}
              >
                Course progress
              </Typography>

              <Typography
                component="span"
                sx={{
                  fontFamily:
                    'Inter, sans-serif',

                  fontSize:
                    '0.72rem',

                  fontWeight: 700,

                  color: '#FFFFFF',
                }}
              >
                {safeProgress}%
              </Typography>
            </Stack>

            {/* Progress bar */}

            <Box
              sx={{
                width: '100%',

                height: 5,

                borderRadius: 999,

                background:
                  'rgba(255,255,255,0.18)',

                overflow: 'hidden',
              }}
            >
              <Box
                component={motion.div}
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${safeProgress}%`,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                  ease: 'easeOut',
                }}
                sx={{
                  height: '100%',

                  borderRadius: 999,

                  background:
                    '#F59E0B',
                }}
              />
            </Box>
          </Stack>
        )}

        {/* ===================================================
            CTA
            =================================================== */}

        <Button
          component={RouterLink}
          to={
            hasActiveCourse
              ? '/student/courses'
              : '/courses'
          }
          startIcon={
            hasActiveCourse ? (
              <FiBookOpen
                size={16}
                aria-hidden="true"
              />
            ) : (
              <FiCompass
                size={16}
                aria-hidden="true"
              />
            )
          }
          endIcon={
            <FiArrowRight
              size={15}
              aria-hidden="true"
            />
          }
          sx={{
            alignSelf: {
              xs: 'stretch',
              sm: 'flex-start',
            },

            width: {
              xs: '100%',
              sm: 'auto',
            },

            minHeight: 40,

            px: 2,

            borderRadius: '9px',

            bgcolor: '#FFFFFF',

            color: '#1D4ED8',

            fontFamily:
              'Inter, sans-serif',

            fontSize:
              '0.84rem',

            fontWeight: 600,

            textTransform: 'none',

            boxShadow:
              '0 4px 12px rgba(15,23,42,0.14)',

            transition:
              'transform 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease',

            '&:hover': {
              bgcolor: '#F8FAFC',

              transform:
                'translateY(-1px)',

              boxShadow:
                '0 7px 16px rgba(15,23,42,0.18)',
            },

            '&:focus-visible': {
              outline:
                '2px solid #FBBF24',

              outlineOffset: '3px',
            },
          }}
        >
          {hasActiveCourse
            ? 'Continue learning'
            : 'Explore courses'}
        </Button>
      </Stack>
    </Box>
  );
};

export default DashboardHeader;