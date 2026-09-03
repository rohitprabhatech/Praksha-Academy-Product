import {
  Box,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';

import { motion } from 'framer-motion';

import {
  FiBookOpen,
  FiAward,
  FiClock,
  FiMessageCircle,
  FiBell,
  FiX,
} from 'react-icons/fi';

const TYPE_META = {
  course: {
    icon: FiBookOpen,
    color: '#2563EB',
    bg: '#EFF6FF',
    label: 'Course',
  },

  achievement: {
    icon: FiAward,
    color: '#D97706',
    bg: '#FFFBEB',
    label: 'Achievement',
  },

  reminder: {
    icon: FiClock,
    color: '#0284C7',
    bg: '#F0F9FF',
    label: 'Reminder',
  },

  message: {
    icon: FiMessageCircle,
    color: '#16A34A',
    bg: '#F0FDF4',
    label: 'Message',
  },

  system: {
    icon: FiBell,
    color: '#64748B',
    bg: '#F8FAFC',
    label: 'System',
  },
};

const NotificationCard = ({
  type = 'system',
  title,
  message,
  time,
  isRead,
  onMarkRead,
  onDismiss,
  index = 0,
}) => {
  const {
    icon: Icon,
    color,
    bg,
    label,
  } =
    TYPE_META[type] ||
    TYPE_META.system;

  return (
    <Box
      component={motion.article}
      layout
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        height: 0,
        marginBottom: 0,
      }}
      transition={{
        duration: 0.25,
        delay: index * 0.035,
        ease: 'easeOut',
      }}
      onClick={
        !isRead
          ? onMarkRead
          : undefined
      }
      sx={{
        position: 'relative',

        display: 'flex',

        alignItems:
          'flex-start',

        gap: 1.5,

        width: '100%',

        minWidth: 0,

        p: {
          xs: 1.5,
          sm: 1.75,
        },

        bgcolor:
          isRead
            ? '#FFFFFF'
            : '#F8FBFF',

        border:
          '1px solid',

        borderColor:
          isRead
            ? '#E2E8F0'
            : '#D7E7FF',

        borderRadius: '8px',

        boxShadow:
          '0 1px 2px rgba(15,23,42,0.03)',

        cursor:
          isRead
            ? 'default'
            : 'pointer',

        transition:
          'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',

        '&:hover': {
          bgcolor:
            isRead
              ? '#F8FAFC'
              : '#F4F8FF',

          borderColor:
            isRead
              ? '#CBD5E1'
              : '#BFDBFE',

          boxShadow:
            '0 4px 12px rgba(15,23,42,0.05)',
        },
      }}
    >
      {/* ===================================================
          TYPE ICON
      ==================================================== */}

      <Box
        sx={{
          position: 'relative',

          width: 40,
          height: 40,

          borderRadius: '9px',

          bgcolor: bg,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          flexShrink: 0,
        }}
      >
        <Icon
          size={18}
          color={color}
          aria-hidden="true"
        />

        {!isRead && (
          <Box
            sx={{
              position: 'absolute',

              width: 7,
              height: 7,

              borderRadius:
                '50%',

              bgcolor:
                '#2563EB',

              top: -2,
              right: -2,

              border:
                '2px solid #FFFFFF',
            }}
          />
        )}
      </Box>

      {/* ===================================================
          CONTENT
      ==================================================== */}

      <Stack
        spacing={0.35}
        sx={{
          flex: 1,

          minWidth: 0,
        }}
      >
        {/* Title row */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.8}
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            component="h2"
            sx={{
              minWidth: 0,

              fontFamily:
                'Inter, sans-serif',

              fontWeight:
                isRead
                  ? 600
                  : 700,

              fontSize:
                '0.875rem',

              lineHeight: 1.35,

              color:
                '#0F172A',

              overflow:
                'hidden',

              textOverflow:
                'ellipsis',

              whiteSpace:
                'nowrap',
            }}
          >
            {title}
          </Typography>

          {!isRead && (
            <Typography
              component="span"
              sx={{
                flexShrink: 0,

                px: 0.65,
                py: 0.2,

                borderRadius:
                  '4px',

                bgcolor:
                  '#EFF6FF',

                color:
                  '#2563EB',

                fontSize:
                  '0.6rem',

                fontWeight: 700,

                lineHeight: 1.2,
              }}
            >
              New
            </Typography>
          )}
        </Stack>

        {/* Type */}

        <Typography
          sx={{
            fontFamily:
              'Inter, sans-serif',

            fontSize:
              '0.65rem',

            fontWeight: 600,

            color,

            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>

        {/* Message */}

        <Typography
          sx={{
            fontFamily:
              'Inter, sans-serif',

            fontSize:
              '0.78rem',

            color:
              '#64748B',

            lineHeight:
              1.45,

            display:
              '-webkit-box',

            WebkitLineClamp: 2,

            WebkitBoxOrient:
              'vertical',

            overflow:
              'hidden',

            pr: 1,
          }}
        >
          {message}
        </Typography>

        {/* Time */}

        <Typography
          sx={{
            pt: 0.2,

            fontFamily:
              'Inter, sans-serif',

            fontSize:
              '0.67rem',

            color:
              '#94A3B8',
          }}
        >
          {time}
        </Typography>
      </Stack>

      {/* ===================================================
          DISMISS
      ==================================================== */}

      <IconButton
        onClick={(event) => {
          event.stopPropagation();

          onDismiss?.();
        }}
        aria-label={`Dismiss notification: ${title}`}
        size="small"
        sx={{
          width: 28,
          height: 28,

          mt: -0.25,

          flexShrink: 0,

          color:
            '#94A3B8',

          '&:hover': {
            bgcolor:
              '#F1F5F9',

            color:
              '#475569',
          },

          '&:focus-visible': {
            outline:
              '2px solid #2563EB',

            outlineOffset:
              '2px',
          },
        }}
      >
        <FiX
          size={15}
          aria-hidden="true"
        />
      </IconButton>
    </Box>
  );
};

export default NotificationCard;