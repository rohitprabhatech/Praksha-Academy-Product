import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Box,
    Stack,
    TextField,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    Button,
    Typography,
    Link,
    Divider,
    CircularProgress,
} from '@mui/material';
import {
    FiUser,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Visible keyboard focus ring */
const focusRingSx = {
    '&:focus-visible': {
        outline: '2px solid #2563EB',
        outlineOffset: '2px',
        borderRadius: '6px',
    },
};

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
            borderWidth: '2px',
        },
    },

    '& .MuiInputLabel-root.Mui-focused': {
        color: '#2563EB',
    },
};

const RegisterForm = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        mode: 'onBlur',

        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false,
        },
    });

    const passwordValue = watch('password');

    /* =====================================================
       REGISTER SUBMIT
    ===================================================== */

    const onSubmit = async (formData) => {
        /*
         * Backend is not connected yet.
         *
         * For Sprint 02 frontend flow we simulate the
         * registration request and then move the user to
         * Verify OTP.
         */

        await new Promise((resolve) =>
            setTimeout(resolve, 900)
        );

        console.log('Registration data:', formData);

        toast.success('Account created successfully');

        /*
         * IMPORTANT:
         *
         * Pass the registered email to Verify OTP through
         * React Router state.
         *
         * VerifyOtpForm already reads:
         *
         * location.state?.email
         *
         * so the email will automatically appear there.
         */

        navigate('/verify-otp', {
            state: {
                email: formData.email.trim().toLowerCase(),
            },
        });
    };

    return (
        <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            aria-label="Create account form"
        >
            <Stack spacing={3}>

                {/* =================================================
                    FULL NAME
                ================================================= */}

                <TextField
                    fullWidth
                    label="Full name"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    slotProps={{
                        htmlInput: {
                            'aria-required': true,
                        },

                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiUser
                                        size={18}
                                        color="#64748B"
                                        aria-hidden="true"
                                    />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={inputSx}
                    {...register('fullName', {
                        required:
                            'Full name is required',

                        minLength: {
                            value: 2,
                            message:
                                'Name must be at least 2 characters',
                        },
                    })}
                />

                {/* =================================================
                    EMAIL
                ================================================= */}

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
                        required:
                            'Email is required',

                        pattern: {
                            value: EMAIL_PATTERN,
                            message:
                                'Enter a valid email address',
                        },
                    })}
                />

                {/* =================================================
                    PASSWORD
                ================================================= */}

                <TextField
                    fullWidth
                    label="Password"
                    type={
                        showPassword
                            ? 'text'
                            : 'password'
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
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
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (prev) =>
                                                    !prev
                                            )
                                        }
                                        edge="end"
                                        size="small"
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                        title={
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
                        required:
                            'Password is required',

                        minLength: {
                            value: 8,
                            message:
                                'Password must be at least 8 characters',
                        },
                    })}
                />

                {/* =================================================
                    CONFIRM PASSWORD
                ================================================= */}

                <TextField
                    fullWidth
                    label="Confirm password"
                    type={
                        showConfirmPassword
                            ? 'text'
                            : 'password'
                    }
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    error={!!errors.confirmPassword}
                    helperText={
                        errors.confirmPassword?.message
                    }
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
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) =>
                                                    !prev
                                            )
                                        }
                                        edge="end"
                                        size="small"
                                        aria-label={
                                            showConfirmPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                        title={
                                            showConfirmPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                        sx={focusRingSx}
                                    >
                                        {showConfirmPassword ? (
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
                    {...register('confirmPassword', {
                        required:
                            'Please confirm your password',

                        validate: (value) =>
                            value === passwordValue ||
                            'Passwords do not match',
                    })}
                />

                {/* =================================================
                    TERMS & PRIVACY
                ================================================= */}

                <Box>
                    <FormControlLabel
                        sx={{
                            m: 0,
                            alignItems: 'flex-start',
                            mt: -0.5,
                        }}
                        control={
                            <Checkbox
                                size="small"
                                {...register(
                                    'agreeToTerms',
                                    {
                                        required:
                                            'You must accept the terms to continue',
                                    }
                                )}
                                sx={{
                                    color: '#CBD5E1',
                                    p: 0.5,
                                    mt: -0.4,

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
                                    fontSize:
                                        '0.86rem',
                                    color: '#475569',
                                    lineHeight: 1.4,
                                    ml: 1,
                                    mt: -0.25,
                                }}
                            >
                                I agree to the{' '}

                                <Link
                                    component={RouterLink}
                                    to="/terms"
                                    underline="none"
                                    aria-label="Read the Terms and Conditions"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#2563EB',

                                        '&:hover': {
                                            color: '#1D4ED8',
                                        },

                                        ...focusRingSx,
                                    }}
                                >
                                    Terms & Conditions
                                </Link>

                                {' '}and{' '}

                                <Link
                                    component={RouterLink}
                                    to="/privacy-policy"
                                    underline="none"
                                    aria-label="Read the Privacy Policy"
                                    sx={{
                                        fontWeight: 600,
                                        color: '#2563EB',

                                        '&:hover': {
                                            color: '#1D4ED8',
                                        },

                                        ...focusRingSx,
                                    }}
                                >
                                    Privacy Policy
                                </Link>
                            </Typography>
                        }
                    />

                    {errors.agreeToTerms && (
                        <FormHelperText
                            sx={{
                                color: '#EF4444',
                                ml: 4.5,
                            }}
                        >
                            {errors.agreeToTerms.message}
                        </FormHelperText>
                    )}
                </Box>

                {/* =================================================
                    CREATE ACCOUNT
                ================================================= */}

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

                            transform:
                                'translateY(-1px)',
                        },

                        '&:active': {
                            transform:
                                'translateY(0)',
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
                            aria-label="Creating account"
                        />
                    ) : (
                        'Create account'
                    )}
                </Button>

                {/* =================================================
                    DIVIDER
                ================================================= */}

                <Divider
                    sx={{
                        borderColor: '#E2E8F0',
                    }}
                />

                {/* =================================================
                    SIGN IN
                ================================================= */}

                <Typography
                    sx={{
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        color: '#64748B',
                    }}
                >
                    Already have an account?{' '}

                    <Link
                        component={RouterLink}
                        to="/login"
                        underline="none"
                        aria-label="Sign in to your account"
                        sx={{
                            fontWeight: 600,
                            color: '#2563EB',

                            '&:hover': {
                                color: '#1D4ED8',
                            },

                            ...focusRingSx,
                        }}
                    >
                        Sign in
                    </Link>
                </Typography>
            </Stack>
        </Box>
    );
};

export default RegisterForm;