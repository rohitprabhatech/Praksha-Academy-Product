import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  Button,
  Typography,
  Link,
  CircularProgress,
} from '@mui/material';
import {
  FiMail,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiRefreshCw,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_SECONDS = 30;

/* -------------------------------------------------------
   Focus ring
------------------------------------------------------- */

const focusRingSx = {
  '&:focus-visible': {
    outline: '2px solid #2563EB',
    outlineOffset: '2px',
    borderRadius: '8px',
  },
};

/* -------------------------------------------------------
   Input styling
------------------------------------------------------- */

const inputSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 58,
    borderRadius: '12px',
    bgcolor: '#FFFFFF',
    transition: 'all 160ms ease',

    '& fieldset': {
      borderColor: '#DCE3EE',
      borderWidth: '1px',
    },

    '&:hover fieldset': {
      borderColor: '#B8C4D6',
    },

    '&.Mui-focused': {
      boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.08)',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#2563EB',
      borderWidth: '1.5px',
    },

    '&.Mui-error': {
      boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.06)',
    },

    '&.Mui-error fieldset': {
      borderColor: '#EF4444',
    },
  },

  '& .MuiInputBase-input': {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9375rem',
    color: '#172033',
    paddingTop: '17px',
    paddingBottom: '17px',

    '&::placeholder': {
      color: '#94A3B8',
      opacity: 1,
    },
  },

  '& .MuiInputLabel-root': {
    fontFamily: 'Inter, sans-serif',
    color: '#64748B',
    fontSize: '0.875rem',
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: '#2563EB',
  },

  '& .MuiFormHelperText-root': {
    marginLeft: 2,
    marginTop: 0.75,
    fontSize: '0.75rem',
    fontFamily: 'Inter, sans-serif',
  },
};

/* -------------------------------------------------------
   Primary button
------------------------------------------------------- */

const buttonSx = {
  minHeight: 56,
  borderRadius: '12px',
  bgcolor: '#2563EB',
  color: '#FFFFFF',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 700,
  fontSize: '0.9375rem',
  textTransform: 'none',
  boxShadow: '0 12px 26px rgba(37, 99, 235, 0.20)',
  transition:
    'background-color 160ms ease, transform 160ms ease, box-shadow 160ms ease',

  '&:hover': {
    bgcolor: '#1D4ED8',
    transform: 'translateY(-1px)',
    boxShadow: '0 16px 30px rgba(37, 99, 235, 0.25)',
  },

  '&:active': {
    transform: 'translateY(0)',
  },

  '&.Mui-disabled': {
    bgcolor: '#AFC5F8',
    color: '#FFFFFF',
    boxShadow: 'none',
  },

  ...focusRingSx,
};

/* -------------------------------------------------------
   Back link
------------------------------------------------------- */

const backLinkSx = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0.75,
  color: '#2563EB',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.875rem',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'color 160ms ease, transform 160ms ease',

  '&:hover': {
    color: '#1D4ED8',
    transform: 'translateX(-2px)',
  },

  ...focusRingSx,
};

/* -------------------------------------------------------
   Forgot Password Form
------------------------------------------------------- */

const ForgotPasswordForm = () => {
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const timerRef = useRef(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  /* -----------------------------------------------------
     Resend countdown
  ----------------------------------------------------- */

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined;
    }

    timerRef.current = setTimeout(() => {
      setCooldown((previous) => previous - 1);
    }, 1000);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [cooldown]);

  /* -----------------------------------------------------
     Submit
  ----------------------------------------------------- */

  const onSubmit = async ({ email }) => {
    // Temporary frontend simulation.
    // Replace this with the real API request later.
    await new Promise((resolve) => setTimeout(resolve, 900));

    console.log('Password reset requested:', email);

    toast.success('Reset link sent');

    setSubmittedEmail(email);
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  /* -----------------------------------------------------
     Resend
  ----------------------------------------------------- */

  const handleResend = async () => {
    if (cooldown > 0 || isResending) {
      return;
    }

    const email = getValues('email') || submittedEmail;

    if (!email) {
      return;
    }

    setIsResending(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    console.log('Password reset resent:', email);

    toast.success('Reset link resent');

    setIsResending(false);
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  /* =====================================================
     SUCCESS STATE
  ===================================================== */

  if (submittedEmail) {
    const resendDisabled = cooldown > 0 || isResending;

    return (
      <Stack
        spacing={3}
        sx={{
          width: '100%',
          textAlign: 'center',
        }}
        aria-live="polite"
      >
        {/* Success icon */}

        <Box
          sx={{
            width: 68,
            height: 68,
            mx: 'auto',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '20px',
            bgcolor: '#ECFDF3',
            border: '1px solid #BBF7D0',
            boxShadow: '0 10px 24px rgba(34, 197, 94, 0.10)',
          }}
        >
          <FiCheck
            size={30}
            color="#16A34A"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </Box>

        {/* Heading */}

        <Stack spacing={1}>
          <Typography
            component="h1"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 750,
              fontSize: {
                xs: '1.55rem',
                sm: '1.75rem',
              },
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
              color: '#172033',
            }}
          >
            Check your email
          </Typography>

          <Typography
            sx={{
              maxWidth: 360,
              mx: 'auto',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.925rem',
              lineHeight: 1.65,
              color: '#64748B',
            }}
          >
            We sent password reset instructions to:
          </Typography>

          <Typography
            sx={{
              maxWidth: 360,
              mx: 'auto',
              overflowWrap: 'anywhere',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#172033',
            }}
          >
            {submittedEmail}
          </Typography>
        </Stack>

        {/* Small status card */}

        <Box
          sx={{
            p: 1.75,
            borderRadius: '12px',
            bgcolor: '#F8FAFC',
            border: '1px solid #E2E8F0',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8rem',
              lineHeight: 1.55,
              color: '#64748B',
            }}
          >
            Check your inbox and spam folder. The reset link will expire
            automatically for security.
          </Typography>
        </Box>

        {/* Resend */}

        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.825rem',
            color: '#64748B',
          }}
        >
          Didn&apos;t receive it?{' '}
          {resendDisabled ? (
            <Box
              component="span"
              sx={{
                fontWeight: 600,
                color: '#94A3B8',
              }}
            >
              {isResending
                ? 'Sending again…'
                : `Resend in ${cooldown}s`}
            </Box>
          ) : (
            <Link
              component="button"
              type="button"
              onClick={handleResend}
              underline="none"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.825rem',
                fontWeight: 700,
                color: '#2563EB',
                cursor: 'pointer',
                ...focusRingSx,

                '&:hover': {
                  color: '#1D4ED8',
                },
              }}
            >
              Resend email
            </Link>
          )}
        </Typography>

        {/* Back */}

        <Link
          component={RouterLink}
          to="/login"
          underline="none"
          aria-label="Back to sign in"
          sx={backLinkSx}
        >
          <FiArrowLeft size={16} aria-hidden="true" />
          Back to sign in
        </Link>
      </Stack>
    );
  }

  /* =====================================================
     REQUEST STATE
  ===================================================== */

  return (
    <Stack
      spacing={3}
      sx={{
        width: '100%',
      }}
    >
      {/* Header */}

      <Stack
        spacing={1}
        sx={{
          textAlign: 'center',
        }}
      >
        {/* Mail icon */}

        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 0.75,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '18px',
            bgcolor: '#EEF4FF',
            border: '1px solid #D9E5FF',
            color: '#2563EB',
            boxShadow: '0 10px 25px rgba(37, 99, 235, 0.08)',
          }}
        >
          <FiMail
            size={27}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </Box>

        {/* Eyebrow */}

        <Typography
          sx={{
            mt: 0.5,
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#2563EB',
          }}
        >
          Account recovery
        </Typography>

        {/* Heading */}

        <Typography
          component="h1"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 750,
            fontSize: {
              xs: '1.6rem',
              sm: '1.8rem',
            },
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            color: '#172033',
          }}
        >
          Forgot your password?
        </Typography>

        {/* Description */}

        <Typography
          sx={{
            maxWidth: 360,
            mx: 'auto',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.925rem',
            lineHeight: 1.65,
            color: '#64748B',
          }}
        >
          Enter your email and we&apos;ll send you a secure link to
          create a new password.
        </Typography>
      </Stack>

      {/* Form */}

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        aria-label="Forgot password form"
      >
        <Stack spacing={2.25}>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            sx={inputSx}
            slotProps={{
              htmlInput: {
                'aria-required': true,
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FiMail
                      size={18}
                      color="#64748B"
                      aria-hidden="true"
                    />
                  </InputAdornment>
                ),
              },
            }}
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: EMAIL_PATTERN,
                message: 'Enter a valid email address',
              },
            })}
          />

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting}
            endIcon={
              !isSubmitting && (
                <FiArrowRight
                  size={17}
                  aria-hidden="true"
                />
              )
            }
            sx={buttonSx}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <CircularProgress
                  size={19}
                  thickness={4}
                  sx={{
                    color: '#FFFFFF',
                  }}
                />

                <Box component="span">
                  Sending link…
                </Box>
              </Stack>
            ) : (
              'Send reset link'
            )}
          </Button>
        </Stack>
      </Box>

      {/* Back */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          pt: 0.25,
        }}
      >
        <Link
          component={RouterLink}
          to="/login"
          underline="none"
          aria-label="Back to sign in"
          sx={backLinkSx}
        >
          <FiArrowLeft
            size={16}
            aria-hidden="true"
          />
          Back to sign in
        </Link>
      </Box>
    </Stack>
  );
};

export default ForgotPasswordForm;