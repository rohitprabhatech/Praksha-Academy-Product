import { useMemo, useState } from 'react';

import {
  Box,
  Stack,
  Typography,
  Button,
} from '@mui/material';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  FiBell,
  FiCheck,
} from 'react-icons/fi';

import NotificationCard from '../../components/student/NotificationCard';

// Mock data — no backend integration yet
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'achievement',
    title: 'Certificate earned',
    message:
      'You completed "Full Stack Web Development" and earned a certificate.',
    time: '2h ago',
    isRead: false,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Live class starting soon',
    message:
      '"Data Structures" with Rohan Mehta starts in 30 minutes.',
    time: '4h ago',
    isRead: false,
  },
  {
    id: 3,
    type: 'course',
    title: 'New lesson available',
    message:
      '"Cloud Computing Fundamentals" just added a new module: Serverless Basics.',
    time: '1d ago',
    isRead: false,
  },
  {
    id: 4,
    type: 'message',
    title: 'Mentor replied',
    message:
      'Sneha Kapoor replied to your question in "Cloud Computing Fundamentals".',
    time: '2d ago',
    isRead: true,
  },
  {
    id: 5,
    type: 'system',
    title: 'Profile updated',
    message:
      'Your profile details were updated successfully.',
    time: '3d ago',
    isRead: true,
  },
];

const FILTERS = [
  {
    key: 'all',
    label: 'All notifications',
  },
  {
    key: 'unread',
    label: 'Unread',
  },
];

const EmptyState = ({ filtered }) => (
  <Box
    component={motion.div}
    initial={{
      opacity: 0,
      y: 10,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      duration: 0.3,
      ease: 'easeOut',
    }}
    sx={{
      bgcolor: '#FFFFFF',

      border:
        '1px solid #E2E8F0',

      borderRadius: '10px',

      py: 7,
      px: 3,

      textAlign: 'center',
    }}
  >
    <Stack
      spacing={2}
      alignItems="center"
    >
      <Box
        sx={{
          width: 56,
          height: 56,

          borderRadius: '12px',

          bgcolor:
            'rgba(37, 99, 235, 0.07)',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FiBell
          size={24}
          color="#2563EB"
          aria-hidden="true"
        />
      </Box>

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

            fontSize:
              '1.05rem',

            color: '#0F172A',
          }}
        >
          {filtered
            ? "You're all caught up"
            : 'No notifications yet'}
        </Typography>

        <Typography
          sx={{
            fontFamily:
              'Inter, sans-serif',

            fontSize:
              '0.85rem',

            color:
              '#64748B',

            lineHeight:
              1.5,

            maxWidth: 380,
          }}
        >
          {filtered
            ? 'There are no unread notifications right now.'
            : "We'll let you know when something needs your attention."}
        </Typography>
      </Stack>
    </Stack>
  </Box>
);

const Notifications = () => {
  const [notifications, setNotifications] =
    useState(INITIAL_NOTIFICATIONS);

  const [activeFilter, setActiveFilter] =
    useState('all');

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (item) => !item.isRead
      ).length,
    [notifications]
  );

  const visibleNotifications =
    useMemo(
      () =>
        activeFilter === 'unread'
          ? notifications.filter(
              (item) => !item.isRead
            )
          : notifications,
      [notifications, activeFilter]
    );

  const handleMarkRead = (id) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              isRead: true,
            }
          : item
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({
        ...item,
        isRead: true,
      }))
    );
  };

  const handleDismiss = (id) => {
    setNotifications((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
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
        maxWidth: 1180,
        mx: 'auto',
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        alignItems={{
          xs: 'flex-start',
          sm: 'center',
        }}
        spacing={1.5}
        sx={{
          pb: 2,

          borderBottom:
            '1px solid #E2E8F0',
        }}
      >
        <Stack
          spacing={0.4}
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily:
                'Inter, sans-serif',

              fontWeight: 700,

              fontSize: {
                xs: '1.5rem',
                md: '1.7rem',
              },

              lineHeight: 1.2,

              color:
                '#0F172A',

              letterSpacing:
                '-0.025em',
            }}
          >
            Notifications
          </Typography>

          <Typography
            sx={{
              fontFamily:
                'Inter, sans-serif',

              fontSize:
                '0.85rem',

              color:
                '#64748B',
            }}
          >
            {unreadCount > 0
              ? `${unreadCount} unread notification${
                  unreadCount !== 1
                    ? 's'
                    : ''
                }`
              : "You're all caught up"}
          </Typography>
        </Stack>

        {unreadCount > 0 && (
          <Button
            onClick={
              handleMarkAllRead
            }
            startIcon={
              <FiCheck
                size={14}
                aria-hidden="true"
              />
            }
            sx={{
              flexShrink: 0,

              px: 1.75,
              py: 0.9,

              borderRadius: '6px',

              border:
                '1px solid #CBD5E1',

              bgcolor:
                '#FFFFFF',

              color:
                '#334155',

              fontFamily:
                'Inter, sans-serif',

              fontWeight: 600,

              fontSize:
                '0.76rem',

              textTransform:
                'none',

              boxShadow:
                'none',

              '&:hover': {
                bgcolor:
                  '#F8FAFC',

                borderColor:
                  '#94A3B8',

                boxShadow:
                  'none',
              },

              '&:focus-visible': {
                outline:
                  '2px solid #2563EB',

                outlineOffset:
                  '2px',
              },
            }}
          >
            Mark all as read
          </Button>
        )}
      </Stack>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <Stack
        direction="row"
        spacing={1}
        sx={{
          width: 'fit-content',
          maxWidth: '100%',
        }}
      >
        {FILTERS.map((filter) => {
          const isActive =
            activeFilter ===
            filter.key;

          return (
            <Box
              key={filter.key}
              component="button"
              type="button"
              onClick={() =>
                setActiveFilter(
                  filter.key
                )
              }
              sx={{
                px: 1.5,
                py: 0.75,

                borderRadius: '6px',

                border:
                  '1px solid',

                borderColor:
                  isActive
                    ? '#2563EB'
                    : '#E2E8F0',

                bgcolor:
                  isActive
                    ? '#EFF6FF'
                    : '#FFFFFF',

                color:
                  isActive
                    ? '#1D4ED8'
                    : '#64748B',

                fontFamily:
                  'Inter, sans-serif',

                fontWeight: 600,

                fontSize:
                  '0.76rem',

                cursor: 'pointer',

                transition:
                  'background-color 150ms ease, border-color 150ms ease, color 150ms ease',

                '&:hover': {
                  bgcolor:
                    isActive
                      ? '#DBEAFE'
                      : '#F8FAFC',

                  borderColor:
                    isActive
                      ? '#2563EB'
                      : '#CBD5E1',
                },

                '&:focus-visible': {
                  outline:
                    '2px solid #2563EB',

                  outlineOffset:
                    '2px',
                },
              }}
            >
              {filter.label}

              {filter.key ===
                'unread' &&
                unreadCount > 0 && (
                  <Box
                    component="span"
                    sx={{
                      ml: 0.65,

                      fontSize:
                        '0.68rem',

                      color:
                        isActive
                          ? '#1D4ED8'
                          : '#94A3B8',
                    }}
                  >
                    {unreadCount}
                  </Box>
                )}
            </Box>
          );
        })}
      </Stack>

      {/* =====================================================
          NOTIFICATIONS
      ====================================================== */}

      {visibleNotifications.length ===
      0 ? (
        <EmptyState
          filtered={
            activeFilter ===
            'unread'
          }
        />
      ) : (
        <Stack
          spacing={1}
          sx={{
            width: '100%',
          }}
        >
          <AnimatePresence
            initial={false}
            mode="popLayout"
          >
            {visibleNotifications.map(
              (item, index) => (
                <NotificationCard
                  key={item.id}
                  {...item}
                  index={index}
                  onMarkRead={() =>
                    handleMarkRead(
                      item.id
                    )
                  }
                  onDismiss={() =>
                    handleDismiss(
                      item.id
                    )
                  }
                />
              )
            )}
          </AnimatePresence>
        </Stack>
      )}
    </Stack>
  );
};

export default Notifications;