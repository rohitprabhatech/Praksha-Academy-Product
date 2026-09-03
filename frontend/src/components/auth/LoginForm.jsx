import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../context/AuthContext';

import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Link,
  Divider,
  CircularProgress,
} from '@mui/material';

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiX,
} from 'react-icons/fi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* =========================================================
   Focus Ring
========================================================= */

const focusRingSx = {
  '&:focus-visible': {
    outline: '2px solid #2563EB',
    outlineOffset: '2px',
    borderRadius: '6px',
  },
};

/* =========================================================
   Input Styling
========================================================= */

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: '#FFFFFF',

    '& fieldset': {
      borderColor: '#CBD5E1',
    },

    '&:hover fieldset': {
      borderColor: '#94A3B8',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#2563EB',
      borderWidth: '2px',
    },
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: '#2563EB',
  },
};

/* =========================================================
   Login Error Alert
   Appears inside the login card
========================================================= */

const LoginAlert = ({ message, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <Box
      role="alert"
      aria-live="assertive"
      sx={{
        width: '100%',
        boxSizing: 'border-box',

        display: 'flex',
        alignItems: 'center',

        gap: 1.5,

        px: 1.75,
        py: 1.35,

        mb: 0.25,

        backgroundColor: '#FFFFFF',

        border: '1px solid #E2E8F0',
        borderLeft: '4px solid #EF4444',

        borderRadius: '12px',

        boxShadow:
          '0 10px 25px rgba(15, 23, 42, 0.08), 0 3px 8px rgba(15, 23, 42, 0.04)',

        animation:
          'loginAlertEnter 280ms cubic-bezier(0.16, 1, 0.3, 1)',

        '@keyframes loginAlertEnter': {
          from: {
            opacity: 0,
            transform: 'translateY(-6px)',
          },

          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      {/* Error Icon */}
      <Box
        sx={{
          width: 36,
          height: 36,
          minWidth: 36,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          borderRadius: '50%',

          backgroundColor: '#FEF2F2',
          color: '#DC2626',
        }}
      >
        <FiAlertCircle
          size={19}
          strokeWidth={2.2}
          aria-hidden="true"
        />
      </Box>

      {/* Error Content */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            color: '#172033',
            fontSize: '0.86rem',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}
        >
          Sign in failed
        </Typography>

        <Typography
          sx={{
            color: '#64748B',
            fontSize: '0.78rem',
            lineHeight: 1.4,
            mt: 0.25,
          }}
        >
          Check your credentials and try again.
        </Typography>
      </Box>

      {/* Close Button */}
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="Dismiss error message"
        sx={{
          width: 28,
          height: 28,

          flexShrink: 0,

          color: '#94A3B8',

          '&:hover': {
            color: '#475569',
            backgroundColor: '#F8FAFC',
          },

          ...focusRingSx,
        }}
      >
        <FiX
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      </IconButton>
    </Box>
  );
};

/* =========================================================
   Login Form
========================================================= */

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const errorTimerRef = useRef(null);

  /* -------------------------------------------------------
     Cleanup timer
  ------------------------------------------------------- */

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  /* -------------------------------------------------------
     Show error
  ------------------------------------------------------- */

  const showLoginError = () => {
    setLoginError('login-error');

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setLoginError('');
      errorTimerRef.current = null;
    }, 3500);
  };

  /* -------------------------------------------------------
     Form
  ------------------------------------------------------- */

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',

    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  /* -------------------------------------------------------
     Submit
  ------------------------------------------------------- */

  const onSubmit = async (formData) => {
    // Remove previous authentication error
    setLoginError('');

    try {
      // Unified login — all roles use the same page; redirect by role.
      const result = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (!result.success) {
        showLoginError();
        return;
      }

      const destination = result.redirectTo || '/unauthorized';

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      console.error('LOGIN ERROR:', error);

      showLoginError();
    }
  };

  /* -------------------------------------------------------
     Render
  ------------------------------------------------------- */

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-label="Sign in form"
    >
      <Stack spacing={3}>

        {/* =================================================
            IMPORTANT:
            LoginAlert appears here, above the email field.
        ================================================= */}

        <LoginAlert
          message={loginError}
          onClose={() => {
            setLoginError('');

            if (errorTimerRef.current) {
              clearTimeout(errorTimerRef.current);
              errorTimerRef.current = null;
            }
          }}
        />

        {/* Email */}
        <TextField
          fullWidth
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
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
          sx={inputSx}
          {...register('email', {
            required: 'Email is required',

            pattern: {
              value: EMAIL_PATTERN,
              message: 'Enter a valid email address',
            },
          })}
        />

        {/* Password */}
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            htmlInput: {
              'aria-required': true,
            },

            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FiLock
                    size={18}
                    color="#64748B"
                    aria-hidden="true"
                  />
                </InputAdornment>
              ),

              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    edge="end"
                    size="small"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    sx={focusRingSx}
                  >
                    {showPassword ? (
                      <FiEyeOff
                        size={18}
                        color="#64748B"
                        aria-hidden="true"
                      />
                    ) : (
                      <FiEye
                        size={18}
                        color="#64748B"
                        aria-hidden="true"
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={inputSx}
          {...register('password', {
            required: 'Password is required',

            minLength: {
              value: 6,
              message:
                'Password must be at least 6 characters',
            },
          })}
        />

        {/* Remember Me + Forgot Password */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -0.5,
            width: '100%',
          }}
        >
          <FormControlLabel
            sx={{
              m: 0,
              alignItems: 'center',
            }}
            control={
              <Checkbox
                size="small"
                {...register('rememberMe')}
                sx={{
                  color: '#CBD5E1',
                  p: 0.5,

                  '&.Mui-checked': {
                    color: '#2563EB',
                  },

                  ...focusRingSx,
                }}
              />
            }
            label={
              <Typography
                component="span"
                sx={{
                  fontSize: '0.875rem',
                  color: '#475569',
                  lineHeight: 1,
                  ml: 1,
                }}
              >
                Remember me
              </Typography>
            }
          />

          <Link
            component={RouterLink}
            to="/forgot-password"
            underline="none"
            aria-label="Forgot password? Reset it here"
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#2563EB',
              lineHeight: 1,
              flexShrink: 0,

              '&:hover': {
                color: '#1D4ED8',
              },

              ...focusRingSx,
            }}
          >
            Forgot password?
          </Link>
        </Box>

        {/* Sign In Button */}
        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
          endIcon={
            !isSubmitting && (
              <FiArrowRight
                size={16}
                aria-hidden="true"
              />
            )
          }
          aria-busy={isSubmitting}
          sx={{
            py: 2,

            borderRadius: '8px',

            bgcolor: '#2563EB',
            color: '#FFFFFF',

            fontWeight: 600,
            fontSize: '0.9375rem',

            textTransform: 'none',

            transition:
              'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',

            boxShadow:
              '0 1px 2px rgba(37, 99, 235, 0.1)',

            '&:hover': {
              bgcolor: '#1D4ED8',

              boxShadow:
                '0 12px 20px -6px rgba(37, 99, 235, 0.45)',

              transform: 'translateY(-1px)',
            },

            '&:active': {
              transform: 'translateY(0)',
            },

            '&.Mui-disabled': {
              bgcolor: '#93C5FD',
              color: '#FFFFFF',
              boxShadow: 'none',
            },

            ...focusRingSx,
          }}
        >
          {isSubmitting ? (
            <CircularProgress
              size={20}
              sx={{
                color: '#FFFFFF',
              }}
              aria-label="Signing in"
            />
          ) : (
            'Sign in'
          )}
        </Button>

        {/* Divider */}
        <Divider
          sx={{
            borderColor: '#E2E8F0',
          }}
        />

        {/* Create Account */}
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#64748B',
          }}
        >
          New to Praksha Academy?{' '}

          <Link
            component={RouterLink}
            to="/register"
            underline="none"
            aria-label="Create a new account"
            sx={{
              fontWeight: 600,
              color: '#2563EB',

              '&:hover': {
                color: '#1D4ED8',
              },

              ...focusRingSx,
            }}
          >
            Create an account
          </Link>
        </Typography>

      </Stack>
    </Box>
  );
};

export default LoginForm;