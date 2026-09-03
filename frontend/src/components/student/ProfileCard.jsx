import {
  Box,
  Stack,
  Typography,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiCalendar,
  FiCamera,
  FiBookOpen,
  FiAward,
  FiCheck,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const STAT_ICONS = {
  Courses: FiBookOpen,
  Certificates: FiAward,
};

const ProfileCard = ({
  name,
  email,
  avatarUrl,
  role = 'Student',
  joinedDate,
  stats = [],
  verified = true,
}) => {
  const initials = name
    ? name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  const handlePhotoChange = () => {
    toast.info('Photo upload is coming soon');
  };

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      sx={{
        width: '100%',
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow:
          '0 1px 2px rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* PROFILE HEADER */}

      <Box
        sx={{
          height: 64,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 170,
            height: 170,
            top: -115,
            right: -50,
            borderRadius: '50%',
            border:
              '30px solid rgba(37, 99, 235, 0.05)',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 90,
            height: 90,
            bottom: -60,
            left: 20,
            borderRadius: '50%',
            bgcolor:
              'rgba(37, 99, 235, 0.035)',
          }}
        />
      </Box>

      {/* CONTENT */}

      <Stack
        spacing={1.8}
        sx={{
          px: {
            xs: 2,
            sm: 2.5,
          },
          pb: 2.5,
          mt: -4,
        }}
      >
        {/* AVATAR */}

        <Box
          sx={{
            position: 'relative',
            width: 'fit-content',
            mx: 'auto',
          }}
        >
          <Avatar
            src={avatarUrl || undefined}
            alt={
              name
                ? `${name}'s profile photo`
                : 'Profile photo'
            }
            sx={{
              width: 76,
              height: 76,
              bgcolor: '#2563EB',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1.4rem',
              fontWeight: 700,
              border: '4px solid #FFFFFF',
              boxShadow:
                '0 2px 8px rgba(15, 23, 42, 0.12)',
            }}
          >
            {!avatarUrl && initials}
          </Avatar>

          {verified && (
            <Box
              aria-label="Verified account"
              sx={{
                position: 'absolute',
                bottom: 1,
                left: -1,
                width: 21,
                height: 21,
                borderRadius: '50%',
                bgcolor: '#16A34A',
                border: '2px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiCheck
                size={10}
                color="#FFFFFF"
                strokeWidth={3}
                aria-hidden="true"
              />
            </Box>
          )}

          <IconButton
            onClick={handlePhotoChange}
            aria-label="Change profile photo"
            size="small"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: -2,
              width: 27,
              height: 27,
              bgcolor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#475569',
              boxShadow:
                '0 2px 5px rgba(15, 23, 42, 0.1)',

              '&:hover': {
                bgcolor: '#F8FAFC',
                color: '#2563EB',
              },

              '&:focus-visible': {
                outline:
                  '2px solid #2563EB',
                outlineOffset: '2px',
              },
            }}
          >
            <FiCamera
              size={13}
              aria-hidden="true"
            />
          </IconButton>
        </Box>

        {/* NAME */}

        <Stack
          spacing={0.6}
          alignItems="center"
        >
          <Typography
            component="h2"
            sx={{
              fontFamily:
                'Inter, sans-serif',
              fontWeight: 700,
              fontSize: '1.1rem',
              lineHeight: 1.25,
              color: '#0F172A',
              textAlign: 'center',
            }}
          >
            {name || 'Unnamed Student'}
          </Typography>

          <Chip
            label={role}
            size="small"
            sx={{
              height: 22,
              borderRadius: '5px',
              bgcolor: '#EFF6FF',
              color: '#1D4ED8',
              fontFamily:
                'Inter, sans-serif',
              fontSize: '0.66rem',
              fontWeight: 700,

              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        </Stack>

        {/* DETAILS */}

        <Stack
          spacing={0.8}
          sx={{ pt: 0.25 }}
        >
          {email && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                minWidth: 0,
              }}
            >
              <FiMail
                size={14}
                color="#94A3B8"
                aria-hidden="true"
              />

              <Typography
                sx={{
                  minWidth: 0,
                  fontFamily:
                    'Inter, sans-serif',
                  fontSize: '0.76rem',
                  color: '#64748B',
                  overflow: 'hidden',
                  textOverflow:
                    'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {email}
              </Typography>
            </Stack>
          )}

          {joinedDate && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <FiCalendar
                size={14}
                color="#94A3B8"
                aria-hidden="true"
              />

              <Typography
                sx={{
                  fontFamily:
                    'Inter, sans-serif',
                  fontSize: '0.76rem',
                  color: '#64748B',
                }}
              >
                Joined {joinedDate}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* STATS */}

        {stats.length > 0 && (
          <Box
            sx={{
              pt: 1.4,
              borderTop:
                '1px solid #E2E8F0',
              display: 'grid',
              gridTemplateColumns:
                `repeat(${Math.min(
                  stats.length,
                  2
                )}, minmax(0, 1fr))`,
              gap: 1,
            }}
          >
            {stats.map((stat) => {
              const StatIcon =
                STAT_ICONS[
                  stat.label
                ] || FiBookOpen;

              return (
                <Box
                  key={stat.label}
                  sx={{
                    px: 1.15,
                    py: 1,
                    bgcolor: '#F8FAFC',
                    border:
                      '1px solid #E2E8F0',
                    borderRadius: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.9,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '7px',
                      bgcolor: '#EFF6FF',
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      flexShrink: 0,
                    }}
                  >
                    <StatIcon
                      size={14}
                      color="#2563EB"
                      aria-hidden="true"
                    />
                  </Box>

                  <Stack
                    spacing={0.1}
                    minWidth={0}
                  >
                    <Typography
                      sx={{
                        fontFamily:
                          'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        color: '#0F172A',
                        lineHeight: 1.1,
                      }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily:
                          'Inter, sans-serif',
                        fontSize: '0.62rem',
                        color: '#64748B',
                        whiteSpace:
                          'nowrap',
                        overflow: 'hidden',
                        textOverflow:
                          'ellipsis',
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ProfileCard;