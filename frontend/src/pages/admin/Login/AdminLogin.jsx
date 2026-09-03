import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiAlertCircle,
  FiX,
} from 'react-icons/fi'
import { useEffect, useRef, useState } from 'react'

import { useAuth } from '../../../context/AuthContext'
import AdminSurface from '../../../components/admin/common/AdminSurface'
import { adminIdentity } from '../../../constants/adminDashboard'
import logoMark from '../../../assets/praksha-mark.png'

function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const errorTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current)
      }
    }
  }, [])

  const showError = () => {
    setError('login-error')

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current)
    }

    errorTimerRef.current = setTimeout(() => {
      setError('')
      errorTimerRef.current = null
    }, 3500)
  }

  const clearError = () => {
    setError('')

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current)
      errorTimerRef.current = null
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    clearError()

    const normalizedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()

    // Frontend validation
    if (!normalizedEmail || !trimmedPassword) {
      showError()
      return
    }

    setIsSubmitting(true)

    try {
      // Owner portal: accept frontend `admin` alias and backend `owner`.
      const result = await login({
        email: normalizedEmail,
        password: trimmedPassword,
        rememberMe,
        allowedRoles: ['admin', 'owner'],
      })

      if (!result.success) {
        showError()
        return
      }

      navigate(result.redirectTo || '/admin/dashboard', {
        replace: true,
      })
    } catch (loginError) {
      console.error('ADMIN LOGIN ERROR:', loginError)
      showError()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 1.5, sm: 2, md: 3 },
        py: 4,
        bgcolor: 'background.default',
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(37,99,235,0.12), transparent 42%)'
            : 'radial-gradient(circle at top, rgba(37,99,235,0.07), transparent 42%)',
      }}
    >
      <AdminSurface
        sx={{
          width: '100%',
          maxWidth: 450,
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
        }}
      >
        <Stack spacing={3}>

          {/* Brand */}
          <Stack
            spacing={1.5}
            sx={{
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 2.5,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 10px 28px rgba(15, 23, 42, 0.10)',
              }}
            >
              <Box
                component="img"
                src={logoMark}
                alt="Praksha Academy"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: 'contain',
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: { xs: '1.55rem', sm: '1.8rem' },
                  fontWeight: 900,
                  lineHeight: 1.2,
                }}
              >
                Admin Login
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.75,
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                }}
              >
                Sign in to manage Praksha Academy operations.
              </Typography>
            </Box>
          </Stack>

          {/* Security badge */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.75,
              py: 0.8,
              px: 1.5,
              borderRadius: 1.5,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(37, 99, 235, 0.12)'
                  : 'rgba(37, 99, 235, 0.06)',
              color: 'primary.main',
            }}
          >
            <FiShield size={15} />

            <Typography
              sx={{
                fontSize: '0.76rem',
                fontWeight: 800,
              }}
            >
              Secure administrator access
            </Typography>
          </Box>

          {/* Login Error */}
          {error && (
            <Box
              role="alert"
              aria-live="assertive"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,

                px: 1.75,
                py: 1.35,

                borderRadius: '12px',

                bgcolor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderLeft: '4px solid #EF4444',

                boxShadow:
                  '0 10px 25px rgba(15, 23, 42, 0.08), 0 3px 8px rgba(15, 23, 42, 0.04)',

                animation:
                  'adminLoginAlertEnter 280ms cubic-bezier(0.16, 1, 0.3, 1)',

                '@keyframes adminLoginAlertEnter': {
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
              {/* Icon */}
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  minWidth: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  bgcolor: '#FEF2F2',
                  color: '#DC2626',
                }}
              >
                <FiAlertCircle
                  size={19}
                  strokeWidth={2.2}
                />
              </Box>

              {/* Message */}
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

              {/* Close */}
              <IconButton
                onClick={clearError}
                size="small"
                aria-label="Dismiss error message"
                sx={{
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  color: '#94A3B8',

                  '&:hover': {
                    color: '#475569',
                    bgcolor: '#F8FAFC',
                  },
                }}
              >
                <FiX size={16} />
              </IconButton>
            </Box>
          )}

          {/* Login form */}
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <TextField
              label="Administrator Email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (error) clearError()
              }}
              placeholder={adminIdentity.email}
              fullWidth
              required
              autoComplete="email"
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiMail size={18} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontWeight: 600,
                },

                '& .MuiInputBase-input': {
                  fontWeight: 500,
                },
              }}
            />

            {/* Password */}
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                if (error) clearError()
              }}
              placeholder="Enter password"
              fullWidth
              required
              autoComplete="current-password"
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiLock size={18} />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip
                      title={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                      arrow
                    >
                      <IconButton
                        type="button"
                        onClick={() =>
                          setShowPassword((value) => !value)
                        }
                        edge="end"
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontWeight: 600,
                },

                '& .MuiInputBase-input': {
                  fontWeight: 500,
                },
              }}
            />

            {/* Remember / Forgot */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                    size="small"
                    disabled={isSubmitting}
                  />
                }
                label={
                  <Typography
                    sx={{
                      color: 'text.primary',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                    }}
                  >
                    Remember me
                  </Typography>
                }
              />

              <Typography
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  color: 'primary.main',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  textDecoration: 'none',

                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot password?
              </Typography>
            </Stack>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              endIcon={
                !isSubmitting && (
                  <FiArrowRight size={18} />
                )
              }
              sx={{
                minHeight: 50,
                borderRadius: 1.5,
                fontWeight: 800,
                textTransform: 'none',
                fontSize: '0.95rem',
                boxShadow: 'none',

                '&:hover': {
                  boxShadow: 'none',
                },

                '&.Mui-disabled': {
                  opacity: 0.7,
                },
              }}
            >
              {isSubmitting ? 'Signing in...' : 'Login to Dashboard'}
            </Button>
          </Stack>

          {/* Footer */}
          <Box
            sx={{
              pt: 0.5,
              textAlign: 'center',
            }}
          >
            <Typography
              color="text.secondary"
              sx={{
                fontSize: '0.75rem',
                lineHeight: 1.5,
              }}
            >
              Authorized administrators only.
            </Typography>
          </Box>
        </Stack>
      </AdminSurface>
    </Box>
  )
}

export default AdminLogin