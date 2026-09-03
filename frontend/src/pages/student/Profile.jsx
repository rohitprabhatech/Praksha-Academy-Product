import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';

import {
  FiUser,
  FiMail,
  FiPhone,
  FiSave,
  FiEdit3,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
} from 'react-icons/fi';

import { toast } from 'react-toastify';

import ProfileCard from '../../components/student/ProfileCard';

/* =========================================================
   STUDENT
========================================================= */

const STUDENT = {
  name: 'Aditi Sharma',
  email: 'aditi.sharma@example.com',
  phone: '+91 98765 43210',
  role: 'Student',
  joinedDate: 'Jan 2025',

  stats: [
    {
      label: 'Courses',
      value: 6,
    },
    {
      label: 'Certificates',
      value: 2,
    },
  ],
};

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* =========================================================
   COMMON INPUT STYLES
========================================================= */

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: '#FFFFFF',

    '& fieldset': {
      borderColor: '#E2E8F0',
    },

    '&:hover fieldset': {
      borderColor: '#CBD5E1',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#2563EB',
      borderWidth: '1px',
    },

    '&.Mui-error fieldset': {
      borderColor: '#EF4444',
    },
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: '#2563EB',
  },

  '& .MuiInputLabel-root.Mui-error': {
    color: '#EF4444',
  },

  '& .MuiInputBase-input': {
    fontFamily:
      'Inter, sans-serif',
    fontSize: '0.9rem',
    color: '#172033',
  },
};

/* =========================================================
   FOCUS RING
========================================================= */

const focusRingSx = {
  '&:focus-visible': {
    outline:
      '2px solid #2563EB',
    outlineOffset: '2px',
    borderRadius: '6px',
  },
};

/* =========================================================
   PASSWORD INPUT
========================================================= */

const passwordInputSx = {
  ...inputSx,

  '& .MuiOutlinedInput-root': {
    ...inputSx[
      '& .MuiOutlinedInput-root'
    ],

    minHeight: 54,

    borderRadius: '8px',
  },
};

/* =========================================================
   SECTION CARD
========================================================= */

const sectionCardSx = {
  bgcolor: '#FFFFFF',

  border:
    '1px solid #E2E8F0',

  borderRadius: '10px',

  boxShadow:
    '0 1px 2px rgba(15, 23, 42, 0.03)',

  p: {
    xs: 2,
    sm: 2.5,
  },
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
  icon,
  title,
  description,
}) => (
  <Stack
    direction="row"
    spacing={1.25}
    alignItems="center"
    sx={{
      mb: 2.5,
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '8px',
        bgcolor:
          'rgba(37, 99, 235, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>

    <Stack
      spacing={0.25}
      minWidth={0}
    >
      <Typography
        component="h2"
        sx={{
          fontFamily:
            'Inter, sans-serif',
          fontWeight: 700,
          fontSize: '1rem',
          color: '#0F172A',
          lineHeight: 1.25,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontFamily:
            'Inter, sans-serif',
          fontSize: '0.78rem',
          color: '#64748B',
          lineHeight: 1.4,
        }}
      >
        {description}
      </Typography>
    </Stack>
  </Stack>
);

/* =========================================================
   CHANGE PASSWORD
========================================================= */

const ChangePasswordSection = () => {
  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm({
    mode: 'onBlur',

    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword =
    watch('newPassword') || '';

  const confirmPassword =
    watch('confirmPassword') || '';

  /* PASSWORD STRENGTH */

  const passwordStrength = useMemo(() => {
    const hasLength =
      newPassword.length >= 6;

    const hasLetters =
      /[A-Za-z]/.test(
        newPassword
      );

    const hasNumbers =
      /\d/.test(newPassword);

    const hasSpecial =
      /[^A-Za-z0-9]/.test(
        newPassword
      );

    let score = 0;

    if (hasLength) score += 1;
    if (hasLetters) score += 1;
    if (hasNumbers) score += 1;
    if (hasSpecial) score += 1;

    let label =
      'Enter a password';

    let color = '#94A3B8';

    if (newPassword.length > 0) {
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
      score,
      label,
      color,
    };
  }, [newPassword]);

  /* SUBMIT */

  const onSubmit = async (
    formData
  ) => {
    await new Promise(
      (resolve) =>
        setTimeout(resolve, 900)
    );

    console.log(
      'Change password:',
      formData
    );

    toast.success(
      'Password changed successfully'
    );

    reset();
  };

  /* EYE BUTTON */

  const eyeButtonSx = {
    width: 36,
    height: 36,

    color: '#64748B',

    borderRadius: '7px',

    '&:hover': {
      color: '#2563EB',
      bgcolor:
        'rgba(37, 99, 235, 0.07)',
    },

    ...focusRingSx,
  };

  return (
    <Box sx={sectionCardSx}>
      <SectionHeader
        icon={
          <FiLock
            size={16}
            color="#2563EB"
          />
        }
        title="Change password"
        description="Update your password to keep your account secure."
      />

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(
          onSubmit
        )}
        aria-label="Change password form"
      >
        <Stack spacing={2}>
          {/* CURRENT PASSWORD */}

          <TextField
            fullWidth
            label="Current password"
            type={
              showCurrentPassword
                ? 'text'
                : 'password'
            }
            autoComplete="current-password"
            error={
              !!errors.currentPassword
            }
            helperText={
              errors.currentPassword
                ?.message
            }
            slotProps={{
              htmlInput: {
                'aria-required': true,
              },

              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FiLock
                      size={16}
                      color="#94A3B8"
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(
                          (value) =>
                            !value
                        )
                      }
                      aria-label={
                        showCurrentPassword
                          ? 'Hide current password'
                          : 'Show current password'
                      }
                      sx={
                        eyeButtonSx
                      }
                    >
                      {showCurrentPassword ? (
                        <FiEyeOff
                          size={18}
                        />
                      ) : (
                        <FiEye
                          size={18}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={passwordInputSx}
            {...register(
              'currentPassword',
              {
                required:
                  'Current password is required',
              }
            )}
          />

          {/* NEW PASSWORD */}

          <TextField
            fullWidth
            label="New password"
            type={
              showNewPassword
                ? 'text'
                : 'password'
            }
            autoComplete="new-password"
            error={
              !!errors.newPassword
            }
            helperText={
              errors.newPassword?.message
            }
            slotProps={{
              htmlInput: {
                'aria-required': true,
              },

              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FiLock
                      size={16}
                      color="#94A3B8"
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          (value) =>
                            !value
                        )
                      }
                      aria-label={
                        showNewPassword
                          ? 'Hide new password'
                          : 'Show new password'
                      }
                      sx={
                        eyeButtonSx
                      }
                    >
                      {showNewPassword ? (
                        <FiEyeOff
                          size={18}
                        />
                      ) : (
                        <FiEye
                          size={18}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={passwordInputSx}
            {...register(
              'newPassword',
              {
                required:
                  'New password is required',

                minLength: {
                  value: 6,
                  message:
                    'Password must be at least 6 characters',
                },

                validate: (value) => {
                  if (
                    value ===
                    watch(
                      'currentPassword'
                    )
                  ) {
                    return 'New password must be different from your current password';
                  }

                  return true;
                },
              }
            )}
          />

          {/* PASSWORD STRENGTH */}

          {newPassword.length >
            0 && (
            <Box
              sx={{
                mt: -0.5,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  mb: 0.6,
                }}
              >
                <Typography
                  sx={{
                    fontSize:
                      '0.7rem',
                    fontWeight: 600,
                    color:
                      '#64748B',
                  }}
                >
                  Password strength
                </Typography>

                <Typography
                  sx={{
                    fontSize:
                      '0.7rem',
                    fontWeight: 700,
                    color:
                      passwordStrength.color,
                  }}
                >
                  {
                    passwordStrength.label
                  }
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(4, 1fr)',
                  gap: 0.5,
                }}
              >
                {[0, 1, 2, 3].map(
                  (bar) => (
                    <Box
                      key={bar}
                      sx={{
                        height: 4,
                        borderRadius:
                          999,
                        bgcolor:
                          bar <
                          passwordStrength.score
                            ? passwordStrength.color
                            : '#E2E8F0',
                      }}
                    />
                  )
                )}
              </Box>
            </Box>
          )}

          {/* CONFIRM PASSWORD */}

          <TextField
            fullWidth
            label="Confirm new password"
            type={
              showConfirmPassword
                ? 'text'
                : 'password'
            }
            autoComplete="new-password"
            error={
              !!errors.confirmPassword
            }
            helperText={
              errors.confirmPassword
                ?.message
            }
            slotProps={{
              htmlInput: {
                'aria-required': true,
              },

              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FiLock
                      size={16}
                      color="#94A3B8"
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) =>
                            !value
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? 'Hide confirm password'
                          : 'Show confirm password'
                      }
                      sx={
                        eyeButtonSx
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff
                          size={18}
                        />
                      ) : (
                        <FiEye
                          size={18}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={passwordInputSx}
            {...register(
              'confirmPassword',
              {
                required:
                  'Please confirm your new password',

                validate: (value) =>
                  value ===
                    newPassword ||
                  'Passwords do not match',
              }
            )}
          />

          {/* MATCH STATUS */}

          {confirmPassword.length >
            0 && (
            <Stack
              direction="row"
              spacing={0.7}
              alignItems="center"
              sx={{
                mt: -0.75,
              }}
            >
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius:
                    '50%',
                  display: 'grid',
                  placeItems:
                    'center',
                  bgcolor:
                    confirmPassword ===
                    newPassword
                      ? '#DCFCE7'
                      : '#FEE2E2',
                  color:
                    confirmPassword ===
                    newPassword
                      ? '#16A34A'
                      : '#DC2626',
                }}
              >
                {confirmPassword ===
                newPassword ? (
                  <FiCheck
                    size={11}
                    strokeWidth={3}
                  />
                ) : (
                  <Typography
                    component="span"
                    sx={{
                      fontSize:
                        '0.65rem',
                      fontWeight: 900,
                    }}
                  >
                    ×
                  </Typography>
                )}
              </Box>

              <Typography
                sx={{
                  fontSize:
                    '0.7rem',
                  fontWeight: 700,
                  color:
                    confirmPassword ===
                    newPassword
                      ? '#16A34A'
                      : '#DC2626',
                }}
              >
                {confirmPassword ===
                newPassword
                  ? 'Passwords match'
                  : 'Passwords do not match'}
              </Typography>
            </Stack>
          )}

          {/* ACTIONS */}

          <Stack
            direction={{
              xs: 'column-reverse',
              sm: 'row',
            }}
            justifyContent="flex-end"
            spacing={1}
            sx={{
              pt: 0.5,
            }}
          >
            {isDirty &&
              !isSubmitting && (
                <Button
                  type="button"
                  onClick={() =>
                    reset()
                  }
                  sx={{
                    px: 2.5,
                    py: 1.1,
                    borderRadius: '7px',
                    color:
                      '#64748B',
                    fontWeight: 600,
                    fontSize:
                      '0.82rem',
                    textTransform:
                      'none',

                    '&:hover': {
                      bgcolor:
                        '#F1F5F9',
                    },

                    ...focusRingSx,
                  }}
                >
                  Cancel
                </Button>
              )}

            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !isDirty
              }
              startIcon={
                !isSubmitting && (
                  <FiLock
                    size={15}
                  />
                )
              }
              sx={{
                px: 2.75,
                py: 1.1,
                borderRadius: '7px',
                bgcolor:
                  '#2563EB',
                color:
                  '#FFFFFF',
                fontWeight: 600,
                fontSize:
                  '0.82rem',
                textTransform:
                  'none',
                boxShadow:
                  'none',

                '&:hover': {
                  bgcolor:
                    '#1D4ED8',
                  boxShadow:
                    'none',
                },

                '&.Mui-disabled': {
                  bgcolor:
                    '#CBD5E1',
                  color:
                    '#FFFFFF',
                },

                ...focusRingSx,
              }}
            >
              {isSubmitting ? (
                <CircularProgress
                  size={18}
                  sx={{
                    color:
                      '#FFFFFF',
                  }}
                />
              ) : (
                'Change password'
              )}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

/* =========================================================
   MAIN PROFILE PAGE
========================================================= */

const Profile = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm({
    mode: 'onBlur',

    defaultValues: {
      fullName:
        STUDENT.name,
      email:
        STUDENT.email,
      phone:
        STUDENT.phone,
    },
  });

  const onSubmit = async (
    formData
  ) => {
    await new Promise(
      (resolve) =>
        setTimeout(resolve, 900)
    );

    console.log(formData);

    toast.success(
      'Profile updated successfully'
    );
  };

  return (
    <Stack
      spacing={{
        xs: 2.5,
        md: 3,
      }}
      sx={{
        width: '100%',
        maxWidth: 1280,
        mx: 'auto',
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Stack
        spacing={0.4}
        sx={{
          pb: 2,
          borderBottom:
            '1px solid #E2E8F0',
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily:
              'Inter, sans-serif',
            fontWeight: 700,
            fontSize: {
              xs: '1.45rem',
              md: '1.65rem',
            },
            lineHeight: 1.2,
            color: '#0F172A',
            letterSpacing:
              '-0.025em',
          }}
        >
          My Profile
        </Typography>

        <Typography
          sx={{
            fontFamily:
              'Inter, sans-serif',
            fontSize:
              '0.84rem',
            color:
              '#64748B',
          }}
        >
          Manage your personal information and account security.
        </Typography>
      </Stack>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            md: '290px minmax(0, 1fr)',
          },

          gap: {
            xs: 2,
            md: 2.5,
          },

          alignItems:
            'start',
        }}
      >
        {/* ===================================================
            PROFILE SUMMARY
        =================================================== */}

        <Box
          sx={{
            width: '100%',
            minWidth: 0,
          }}
        >
          <ProfileCard
            {...STUDENT}
          />
        </Box>

        {/* ===================================================
            RIGHT CONTENT
        =================================================== */}

        <Box
          sx={{
            width: '100%',
            minWidth: 0,
          }}
        >
          <Stack spacing={2.5}>

            {/* ===============================================
                PERSONAL DETAILS
            =============================================== */}

            <Box sx={sectionCardSx}>
              <SectionHeader
                icon={
                  <FiEdit3
                    size={16}
                    color="#2563EB"
                  />
                }
                title="Personal details"
                description="Update your name, email and phone number."
              />

              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(
                  onSubmit
                )}
                aria-label="Update profile form"
              >
                <Stack spacing={2}>

                  {/* FULL NAME */}

                  <TextField
                    fullWidth
                    label="Full name"
                    type="text"
                    autoComplete="name"
                    error={
                      !!errors.fullName
                    }
                    helperText={
                      errors.fullName
                        ?.message
                    }
                    slotProps={{
                      htmlInput: {
                        'aria-required': true,
                      },

                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiUser
                              size={16}
                              color="#94A3B8"
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputSx}
                    {...register(
                      'fullName',
                      {
                        required:
                          'Full name is required',

                        minLength: {
                          value: 2,
                          message:
                            'Name must be at least 2 characters',
                        },

                        maxLength: {
                          value: 60,
                          message:
                            'Name is too long',
                        },
                      }
                    )}
                  />

                  {/* EMAIL */}

                  <TextField
                    fullWidth
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    error={
                      !!errors.email
                    }
                    helperText={
                      errors.email
                        ?.message
                    }
                    slotProps={{
                      htmlInput: {
                        'aria-required': true,
                      },

                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiMail
                              size={16}
                              color="#94A3B8"
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputSx}
                    {...register(
                      'email',
                      {
                        required:
                          'Email is required',

                        pattern: {
                          value:
                            EMAIL_PATTERN,
                          message:
                            'Enter a valid email address',
                        },
                      }
                    )}
                  />

                  {/* PHONE */}

                  <TextField
                    fullWidth
                    label="Phone number"
                    type="tel"
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    error={
                      !!errors.phone
                    }
                    helperText={
                      errors.phone
                        ?.message
                    }
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiPhone
                              size={16}
                              color="#94A3B8"
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={inputSx}
                    {...register(
                      'phone',
                      {
                        pattern: {
                          value:
                            /^[+]?[\d\s-]{10,15}$/,

                          message:
                            'Enter a valid phone number',
                        },
                      }
                    )}
                  />

                  {/* ACTIONS */}

                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={1}
                    sx={{
                      pt: 0.5,
                    }}
                  >
                    {isDirty &&
                      !isSubmitting && (
                        <Button
                          type="button"
                          onClick={() =>
                            reset()
                          }
                          sx={{
                            px: 2.5,
                            py: 1.1,
                            borderRadius:
                              '7px',
                            color:
                              '#64748B',
                            fontWeight: 600,
                            fontSize:
                              '0.82rem',
                            textTransform:
                              'none',

                            '&:hover': {
                              bgcolor:
                                '#F1F5F9',
                            },

                            ...focusRingSx,
                          }}
                        >
                          Reset
                        </Button>
                      )}

                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !isDirty
                      }
                      startIcon={
                        !isSubmitting && (
                          <FiSave
                            size={15}
                          />
                        )
                      }
                      aria-busy={
                        isSubmitting
                      }
                      sx={{
                        px: 2.75,
                        py: 1.1,
                        borderRadius:
                          '7px',
                        bgcolor:
                          '#2563EB',
                        color:
                          '#FFFFFF',
                        fontWeight: 600,
                        fontSize:
                          '0.82rem',
                        textTransform:
                          'none',
                        boxShadow:
                          'none',

                        '&:hover': {
                          bgcolor:
                            '#1D4ED8',
                          boxShadow:
                            'none',
                        },

                        '&.Mui-disabled': {
                          bgcolor:
                            '#CBD5E1',
                          color:
                            '#FFFFFF',
                        },

                        ...focusRingSx,
                      }}
                    >
                      {isSubmitting ? (
                        <CircularProgress
                          size={18}
                          sx={{
                            color:
                              '#FFFFFF',
                          }}
                        />
                      ) : (
                        'Save changes'
                      )}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            {/* ===============================================
                CHANGE PASSWORD
            =============================================== */}

            <ChangePasswordSection />

          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

export default Profile;