import { Box, Typography } from '@mui/material';
import {
  FiAward,
  FiBookOpen,
  FiLock,
  FiShield,
} from 'react-icons/fi';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';
import logoMark from '../../assets/praksha-mark.png';

const ResetPassword = () => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          lg: '46% 54%',
        },
        bgcolor: '#F8FAFC',
      }}
    >
      {/* =========================================================
          LEFT BRAND PANEL
      ========================================================= */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { lg: 8, xl: 12 },
          py: 8,

          background:
            'linear-gradient(145deg, #172554 0%, #1D4ED8 48%, #2563EB 100%)',

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '42px 42px',
            pointerEvents: 'none',
          },

          '&::after': {
            content: '""',
            position: 'absolute',
            width: 520,
            height: 520,
            right: -240,
            bottom: -250,
            borderRadius: '50%',
            background:
              'rgba(255,255,255,0.08)',
            filter: 'blur(2px)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: 570,
            mx: 'auto',
          }}
        >
          {/* Brand */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 7,
            }}
          >
            <Box
              component="img"
              src={logoMark}
              alt="Praksha Academy"
              sx={{
                width: 42,
                height: 42,
                objectFit: 'contain',
              }}
            />

            <Typography
              sx={{
                color: '#FFFFFF',
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              Praksha Academy
            </Typography>
          </Box>

          {/* Eyebrow */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 2,
                bgcolor: '#FBBF24',
                borderRadius: 99,
              }}
            />

            <Typography
              sx={{
                color: '#FBBF24',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
              }}
            >
              Reset your password
            </Typography>
          </Box>

          {/* Main heading */}
          <Typography
            component="h1"
            sx={{
              color: '#FFFFFF',
              fontSize: {
                lg: '2.65rem',
                xl: '3.05rem',
              },
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.035em',
              maxWidth: 560,
            }}
          >
            Create a new password and secure your learning journey.
          </Typography>

          <Typography
            sx={{
              mt: 3,
              maxWidth: 500,
              color: 'rgba(255,255,255,0.78)',
              fontSize: '1rem',
              lineHeight: 1.75,
            }}
          >
            A strong password keeps your account safe and your
            learning progress protected.
          </Typography>

          {/* Feature cards */}
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              mt: 5,
            }}
          >
            <Feature
              icon={<FiShield size={20} />}
              title="Strong password protection"
              description="Keep your account safe with a strong password."
            />

            <Feature
              icon={<FiLock size={20} />}
              title="Secure account recovery"
              description="Reset your password through a secure process."
            />

            <Feature
              icon={<FiBookOpen size={20} />}
              title="Your learning stays protected"
              description="Your courses, certificates and account data remain secure."
            />
          </Box>
        </Box>
      </Box>

      {/* =========================================================
          RIGHT FORM AREA
      ========================================================= */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 4, md: 6 },
          background:
            'radial-gradient(circle at 50% 45%, rgba(37,99,235,0.045), transparent 45%)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 500,
          }}
        >
          <ResetPasswordForm />
        </Box>
      </Box>
    </Box>
  );
};

const Feature = ({ icon, title, description }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 1.5,
        py: 1.35,
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.16)',
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          width: 38,
          height: 38,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '10px',
          color: '#FFFFFF',
          background: 'rgba(255,255,255,0.12)',
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            color: '#FFFFFF',
            fontSize: '0.86rem',
            fontWeight: 800,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.3,
            color: 'rgba(255,255,255,0.68)',
            fontSize: '0.75rem',
            lineHeight: 1.4,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default ResetPassword;