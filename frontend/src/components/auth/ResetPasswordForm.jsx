import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import {
  FiArrowLeft,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  // =========================================================
  // PASSWORD STRENGTH
  // =========================================================

  const passwordAnalysis = useMemo(() => {
    const hasLength = password.length >= 6;
    const hasLetters = /[A-Za-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score = 0;

    if (hasLength) score++;
    if (hasLetters) score++;
    if (hasNumbers) score++;
    if (hasSpecial) score++;

    let label = 'Enter a password';
    let color = '#94A3B8';

    if (password.length > 0) {
      if (score <= 1) {
        label = 'Weak';
        color = '#EF4444';
      } else if (score === 2) {
        label = 'Fair';
        color = '#F59E0B';
      } else if (score === 3) {
        label = 'Good';
        color = '#2563EB';
      } else {
        label = 'Strong';
        color = '#16A34A';
      }
    }

    return {
      hasLength,
      hasLetters,
      hasNumbers,
      hasSpecial,
      score,
      label,
      color,
    };
  }, [password]);

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const canSubmit =
    passwordAnalysis.hasLength &&
    passwordAnalysis.hasLetters &&
    passwordAnalysis.hasNumbers &&
    passwordsMatch;

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    if (!canSubmit) {
      return;
    }

    /*
      TODO:
      Connect your real reset-password API here.

      Example:

      await resetPassword(password);

      After successful API response:
      navigate('/login');
    */

    navigate('/login');
  };

  // =========================================================
  // COMMON INPUT STYLES
  // =========================================================

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      minHeight: 58,
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',

      transition:
        'border-color 160ms ease, box-shadow 160ms ease',

      '& fieldset': {
        borderColor: '#DCE3EC',
        borderWidth: '1px',
      },

      '&:hover fieldset': {
        borderColor: '#B8C4D4',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
        borderWidth: '1.5px',
      },

      '&.Mui-error fieldset': {
        borderColor: '#EF4444',
      },

      '&.Mui-focused': {
        boxShadow:
          '0 0 0 3px rgba(37, 99, 235, 0.10)',
      },

      '&.Mui-error.Mui-focused': {
        boxShadow:
          '0 0 0 3px rgba(239, 68, 68, 0.08)',
      },
    },

    '& .MuiInputLabel-root': {
      color: '#64748B',
      fontSize: '0.82rem',
      fontWeight: 600,
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: '#2563EB',
    },

    '& .MuiInputLabel-root.Mui-error': {
      color: '#EF4444',
    },

    '& .MuiInputBase-input': {
      fontSize: '0.95rem',
      fontWeight: 500,
      color: '#172033',

      // Prevent password text from touching the eye
      paddingRight: '4px',
    },

    '& .MuiFormHelperText-root': {
      marginLeft: 0,
      marginTop: '6px',
      fontSize: '0.74rem',
      fontWeight: 600,
    },

    // =======================================================
    // IMPORTANT:
    // Hide Edge / Internet Explorer native password eye.
    // Our React eye remains visible.
    // =======================================================

    '& input::-ms-reveal': {
      display: 'none',
      width: 0,
      height: 0,
    },

    '& input::-ms-clear': {
      display: 'none',
      width: 0,
      height: 0,
    },

    '& input::-webkit-credentials-auto-fill-button': {
      visibility: 'hidden',
      display: 'none !important',
      pointerEvents: 'none',
      position: 'absolute',
      right: 0,
    },
  };

  // =========================================================
  // CUSTOM EYE BUTTON
  // =========================================================

  const eyeButtonSx = {
    width: 38,
    height: 38,
    color: '#64748B',
    borderRadius: '9px',

    '&:hover': {
      color: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.07)',
    },

    '&:active': {
      transform: 'scale(0.94)',
    },

    '&:focus-visible': {
      outline: '2px solid #2563EB',
      outlineOffset: '2px',
    },

    transition:
      'color 140ms ease, background-color 140ms ease, transform 100ms ease',
  };

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '22px',
        overflow: 'hidden',

        boxShadow:
          '0 1px 2px rgba(15, 23, 42, 0.03), 0 24px 60px rgba(15, 23, 42, 0.10)',
      }}
    >
      {/* =====================================================
          TOP ACCENT
      ===================================================== */}

      <Box
        sx={{
          height: 3,
          bgcolor: '#2563EB',
        }}
      />

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          px: {
            xs: 3,
            sm: 4.5,
          },

          pt: {
            xs: 3.5,
            sm: 4,
          },

          pb: {
            xs: 3.25,
            sm: 3.75,
          },
        }}
      >
        {/* =====================================================
            LOCK ICON
        ===================================================== */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2.25,
          }}
        >
          <Box
            sx={{
              width: 58,
              height: 58,

              display: 'grid',
              placeItems: 'center',

              borderRadius: '16px',

              background:
                'linear-gradient(145deg, #EFF6FF, #E8F0FF)',

              border: '1px solid #D8E5FF',

              color: '#2563EB',

              boxShadow:
                '0 10px 24px rgba(37, 99, 235, 0.10)',
            }}
          >
            <FiLock
              size={23}
              strokeWidth={2}
            />
          </Box>
        </Box>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <Box
          sx={{
            textAlign: 'center',
            mb: 3,
          }}
        >
          <Typography
            sx={{
              color: '#2563EB',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              mb: 0.8,
            }}
          >
            Account security
          </Typography>

          <Typography
            component="h2"
            sx={{
              color: '#172033',

              fontSize: {
                xs: '1.55rem',
                sm: '1.75rem',
              },

              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
            }}
          >
            Create a new password
          </Typography>

          <Typography
            sx={{
              mt: 0.9,
              color: '#64748B',
              fontSize: '0.88rem',
              lineHeight: 1.55,
              maxWidth: 360,
              mx: 'auto',
            }}
          >
            Choose a strong password to keep your
            Praksha Academy account secure.
          </Typography>
        </Box>

        {/* =====================================================
            NEW PASSWORD
        ===================================================== */}

        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            label="New password"
            placeholder="Enter your new password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setSubmitted(false);
            }}
            autoComplete="new-password"
            error={submitted && !passwordAnalysis.hasLength}
            helperText={
              submitted && !passwordAnalysis.hasLength
                ? 'Password must be at least 6 characters'
                : ''
            }
            sx={{
              ...inputSx,

              '& .MuiInputBase-input': {
                paddingRight: '52px !important',
              },

              '& input::-ms-reveal': {
                display: 'none',
              },

              '& input::-ms-clear': {
                display: 'none',
              },
            }}
          />

          <IconButton
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 42,
              height: 42,
              zIndex: 5,
              color: '#64748B',
              borderRadius: '9px',

              '&:hover': {
                color: '#2563EB',
                bgcolor: 'rgba(37, 99, 235, 0.07)',
              },

              '&:focus-visible': {
                outline: '2px solid #2563EB',
                outlineOffset: '2px',
              },
            }}
          >
            {showPassword ? (
              <FiEyeOff size={20} />
            ) : (
              <FiEye size={20} />
            )}
          </IconButton>
        </Box>

        {/* =====================================================
            CONFIRM PASSWORD
        ===================================================== */}

        <Box sx={{ position: 'relative', mt: 1.75 }}>
          <TextField
            fullWidth
            label="Confirm password"
            placeholder="Re-enter your new password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setSubmitted(false);
            }}
            autoComplete="new-password"
            error={
              submitted &&
              confirmPassword.length > 0 &&
              !passwordsMatch
            }
            helperText={
              submitted &&
                confirmPassword.length > 0 &&
                !passwordsMatch
                ? 'Passwords do not match'
                : ''
            }
            sx={{
              ...inputSx,

              '& .MuiInputBase-input': {
                paddingRight: '52px !important',
              },

              '& input::-ms-reveal': {
                display: 'none',
              },

              '& input::-ms-clear': {
                display: 'none',
              },
            }}
          />

          <IconButton
            type="button"
            onClick={() =>
              setShowConfirmPassword((prev) => !prev)
            }
            aria-label={
              showConfirmPassword
                ? 'Hide confirm password'
                : 'Show confirm password'
            }
            title={
              showConfirmPassword
                ? 'Hide password'
                : 'Show password'
            }
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 42,
              height: 42,
              zIndex: 5,
              color: '#64748B',
              borderRadius: '9px',

              '&:hover': {
                color: '#2563EB',
                bgcolor: 'rgba(37, 99, 235, 0.07)',
              },

              '&:focus-visible': {
                outline: '2px solid #2563EB',
                outlineOffset: '2px',
              },
            }}
          >
            {showConfirmPassword ? (
              <FiEyeOff size={20} />
            ) : (
              <FiEye size={20} />
            )}
          </IconButton>
        </Box>

        {/* =====================================================
            PASSWORD STRENGTH
        ===================================================== */}

        <Box
          sx={{
            mt: 1.75,
            px: 0.25,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 0.7,
            }}
          >
            <Typography
              sx={{
                color: '#64748B',
                fontSize: '0.73rem',
                fontWeight: 600,
              }}
            >
              Password strength
            </Typography>

            <Typography
              sx={{
                color: passwordAnalysis.color,
                fontSize: '0.73rem',
                fontWeight: 800,
              }}
            >
              {passwordAnalysis.label}
            </Typography>
          </Box>

          {/* Strength bars */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(4, 1fr)',
              gap: 0.6,
            }}
          >
            {[0, 1, 2, 3].map((bar) => (
              <Box
                key={bar}
                sx={{
                  height: 4,
                  borderRadius: 99,

                  bgcolor:
                    bar <
                      passwordAnalysis.score
                      ? passwordAnalysis.color
                      : '#E2E8F0',

                  transition:
                    'background-color 180ms ease',
                }}
              />
            ))}
          </Box>

          {/* =================================================
              PASSWORD MATCH
          ================================================= */}

          {confirmPassword.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.7,
                mt: 1.1,
              }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,

                  display: 'grid',
                  placeItems: 'center',

                  borderRadius: '50%',

                  bgcolor: passwordsMatch
                    ? '#DCFCE7'
                    : '#FEE2E2',

                  color: passwordsMatch
                    ? '#16A34A'
                    : '#DC2626',
                }}
              >
                {passwordsMatch ? (
                  <FiCheck size={11} />
                ) : (
                  <Box
                    component="span"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </Box>
                )}
              </Box>

              <Typography
                sx={{
                  color: passwordsMatch
                    ? '#16A34A'
                    : '#DC2626',

                  fontSize: '0.73rem',
                  fontWeight: 700,
                }}
              >
                {passwordsMatch
                  ? 'Passwords match'
                  : 'Passwords do not match'}
              </Typography>
            </Box>
          )}
        </Box>

        {/* =====================================================
            UPDATE PASSWORD BUTTON
        ===================================================== */}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disableElevation
          disabled={!canSubmit}
          sx={{
            mt: 2.5,

            minHeight: 52,

            borderRadius: '11px',

            bgcolor: '#2563EB',
            color: '#FFFFFF',

            textTransform: 'none',

            fontSize: '0.92rem',
            fontWeight: 800,

            boxShadow:
              '0 12px 26px rgba(37, 99, 235, 0.20)',

            '&:hover': {
              bgcolor: '#1D4ED8',

              boxShadow:
                '0 14px 30px rgba(37, 99, 235, 0.25)',

              transform: 'translateY(-1px)',
            },

            '&:disabled': {
              bgcolor: '#E2E8F0',
              color: '#94A3B8',
              boxShadow: 'none',
            },

            transition:
              'all 160ms ease',
          }}
        >
          Update password
        </Button>

        {/* =====================================================
            BACK TO LOGIN
        ===================================================== */}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2.1,
          }}
        >
          <Button
            type="button"
            variant="text"
            startIcon={
              <FiArrowLeft size={16} />
            }
            onClick={() => navigate('/login')}
            sx={{
              color: '#2563EB',

              textTransform: 'none',

              fontSize: '0.84rem',
              fontWeight: 700,

              borderRadius: '8px',

              px: 1.5,

              '&:hover': {
                bgcolor:
                  'rgba(37, 99, 235, 0.06)',
              },
            }}
          >
            Back to sign in
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPasswordForm;