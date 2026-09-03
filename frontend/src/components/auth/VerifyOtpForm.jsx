import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Link,
  Button,
  CircularProgress,
} from '@mui/material';
import { FiShield, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

/* Visible keyboard focus ring — meets WCAG 2.4.7, only shows for :focus-visible */
const focusRingSx = {
  '&:focus-visible': {
    outline: '2px solid #2563EB',
    outlineOffset: '2px',
    borderRadius: '6px',
  },
};

const backLinkSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0.75,
  fontWeight: 600,
  fontSize: '0.875rem',
  color: '#2563EB',
  '&:hover': { color: '#1D4ED8' },
  ...focusRingSx,
};

const VerifyOtpForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email ?? null;

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    timerRef.current = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [cooldown]);

  const focusInput = (index) => {
    const el = inputRefs.current[index];
    if (el) el.focus();
  };

  const handleChange = (index, rawValue) => {
    const value = rawValue.replace(/\D/g, '');
    if (!value) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    setError('');
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value.slice(-1);
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = '';
          return next;
        });
      } else if (index > 0) {
        focusInput(index - 1);
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = '';
          return next;
        });
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    event.preventDefault();

    const nextDigits = Array(OTP_LENGTH).fill('');
    pasted
      .slice(0, OTP_LENGTH)
      .split('')
      .forEach((char, i) => {
        nextDigits[i] = char;
      });
    setDigits(nextDigits);
    setError('');

    const lastFilledIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
    focusInput(lastFilledIndex >= 0 ? lastFilledIndex : 0);
  };

  const code = digits.join('');
  const isComplete = code.length === OTP_LENGTH;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isComplete) {
      setError('Enter the complete 6-digit code');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.log({ email, code });
    setIsSubmitting(false);

    toast.success('Verified successfully');
    navigate('/login');
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    console.log({ email, action: 'resend-otp' });
    toast.success('Verification code resent');
    setDigits(Array(OTP_LENGTH).fill(''));
    setError('');
    setIsResending(false);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    focusInput(0);
  };

  const resendDisabled = cooldown > 0 || isResending;

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Stack spacing={0.75} sx={{ width: '100%', textAlign: 'center' }}>
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
          <FiShield size={20} color="#FFFFFF" aria-hidden="true" />
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
          }}
        >
          Verify your email
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem',
            color: '#64748B',
            textAlign: 'center',
          }}
        >
          {email ? (
            <>
              Enter the 6-digit code we sent to{' '}
              <Typography
                component="span"
                sx={{ fontWeight: 600, color: '#1E293B', fontSize: 'inherit' }}
              >
                {email}
              </Typography>
            </>
          ) : (
            'Enter the 6-digit verification code sent to your email.'
          )}
        </Typography>
      </Stack>

      <Box component="form" noValidate onSubmit={handleSubmit} aria-label="Verify OTP form">
        <Stack spacing={3}>
          <Stack spacing={1} alignItems="center">
            {/* 
              Fixed centering: explicit flex Box (not Stack) with gap,
              box-sizing border-box + flexShrink:0 on each input so the
              browser's native input sizing never fights the sx width.
            */}
            <Box
              onPaste={handlePaste}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              {digits.map((digit, index) => (
                <Box
                  key={index}
                  component="input"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                  aria-invalid={!!error}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  sx={{
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    width: { xs: 40, sm: 48 },
                    height: { xs: 48, sm: 56 },
                    p: 0,
                    m: 0,
                    borderRadius: '10px',
                    border: error ? '2px solid #EF4444' : '1px solid #E2E8F0',
                    bgcolor: '#FFFFFF',
                    textAlign: 'center',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: '#0F172A',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      borderColor: error ? '#EF4444' : '#CBD5E1',
                    },
                    '&:focus': {
                      borderColor: '#2563EB',
                      borderWidth: '2px',
                    },
                    '&:focus-visible': {
                      outline: '2px solid #2563EB',
                      outlineOffset: '2px',
                    },
                  }}
                />
              ))}
            </Box>
            {error && (
              <Typography
                role="alert"
                sx={{
                  textAlign: 'center',
                  fontSize: '0.8125rem',
                  color: '#EF4444',
                  fontWeight: 500,
                }}
              >
                {error}
              </Typography>
            )}
          </Stack>

          <Button
            type="submit"
            fullWidth
            disabled={isSubmitting || !isComplete}
            endIcon={!isSubmitting && <FiArrowRight size={16} aria-hidden="true" />}
            aria-busy={isSubmitting}
            sx={{
              py: 2,
              borderRadius: '8px',
              bgcolor: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textTransform: 'none',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
              boxShadow: '0 1px 2px rgba(37, 99, 235, 0.1)',
              '&:hover': {
                bgcolor: '#1D4ED8',
                boxShadow: '0 12px 20px -6px rgba(37, 99, 235, 0.45)',
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
              <CircularProgress size={20} sx={{ color: '#FFFFFF' }} aria-label="Verifying" />
            ) : (
              'Verify code'
            )}
          </Button>

          <Typography
            sx={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748B' }}
            aria-live="polite"
          >
            Didn&apos;t receive the code?{' '}
            {resendDisabled ? (
              <Typography
                component="span"
                sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#94A3B8' }}
              >
                {isResending ? 'resending…' : `resend in ${cooldown}s`}
              </Typography>
            ) : (
              <Link
                component="button"
                type="button"
                onClick={handleResend}
                underline="none"
                aria-label="Resend verification code"
                sx={{
                  fontWeight: 600,
                  color: '#2563EB',
                  fontSize: '0.875rem',
                  '&:hover': { color: '#1D4ED8' },
                  ...focusRingSx,
                }}
              >
                resend code
              </Link>
            )}
          </Typography>

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
      </Box>
    </Stack>
  );
};

export default VerifyOtpForm;