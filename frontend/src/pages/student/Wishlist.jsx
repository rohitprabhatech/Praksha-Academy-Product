import { useState } from 'react';

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
  Link as RouterLink,
} from 'react-router-dom';

import {
  FiBookmark,
  FiCompass,
} from 'react-icons/fi';

import { toast } from 'react-toastify';

import WishlistCourseCard from '../../components/student/WishlistCourseCard';

/* =========================================================
   MOCK WISHLIST DATA
   ========================================================= */

const INITIAL_WISHLIST = [
  {
    id: 1,

    title:
      'Advanced React Patterns',

    mentor:
      'Rohan Mehta',

    category:
      'Web Development',

    price:
      '₹4,999',

    originalPrice:
      '₹6,999',

    rating: 4.8,

    reviewCount: 238,

    duration: '18h',

    lessons: 64,
  },

  {
    id: 2,

    title:
      'AI & Machine Learning Foundations',

    mentor:
      'Priya Nair',

    category:
      'Artificial Intelligence',

    price:
      '₹6,499',

    originalPrice:
      '₹8,999',

    rating: 4.9,

    reviewCount: 412,

    duration: '26h',

    lessons: 91,
  },

  {
    id: 3,

    title:
      'Cloud Computing Fundamentals',

    mentor:
      'Sneha Kapoor',

    category:
      'Cloud Computing',

    price:
      '₹5,499',

    originalPrice:
      '',

    rating: 4.6,

    reviewCount: 156,

    duration: '14h',

    lessons: 48,
  },

  {
    id: 4,

    title:
      'Cyber Security Essentials',

    mentor:
      'Aarav Singh',

    category:
      'Cyber Security',

    price:
      '₹5,999',

    originalPrice:
      '₹7,499',

    rating: 4.7,

    reviewCount: 189,

    duration: '20h',

    lessons: 57,
  },
];

/* =========================================================
   EMPTY STATE
   ========================================================= */

const EmptyState = () => (
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
    }}
    sx={{
      bgcolor: '#FFFFFF',

      border:
        '1px solid #E2E8F0',

      borderRadius:
        '10px',

      py: 8,
      px: 3,

      textAlign:
        'center',
    }}
  >
    <Stack
      spacing={2.25}
      alignItems="center"
    >
      <Box
        sx={{
          width: 56,
          height: 56,

          borderRadius:
            '10px',

          bgcolor:
            'rgba(37, 99, 235, 0.08)',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FiBookmark
          size={25}
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
            fontWeight: 700,

            fontSize:
              '1.05rem',

            color:
              '#0F172A',
          }}
        >
          Your wishlist is empty
        </Typography>

        <Typography
          sx={{
            fontSize:
              '0.875rem',

            color:
              '#64748B',

            maxWidth:
              360,
          }}
        >
          Save courses you are
          interested in and they
          will appear here.
        </Typography>
      </Stack>

      <Button
        component={RouterLink}
        to="/courses"
        startIcon={
          <FiCompass
            size={16}
            aria-hidden="true"
          />
        }
        sx={{
          mt: 0.5,

          px: 2.5,
          py: 1.15,

          borderRadius:
            '6px',

          bgcolor:
            '#2563EB',

          color:
            '#FFFFFF',

          fontWeight: 600,

          fontSize:
            '0.8rem',

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
        }}
      >
        Browse courses
      </Button>
    </Stack>
  </Box>
);

/* =========================================================
   WISHLIST PAGE
   ========================================================= */

const Wishlist = () => {
  const [items, setItems] =
    useState(INITIAL_WISHLIST);

  const handleRemove = (
    id,
    title
  ) => {
    setItems((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );

    toast.success(
      `"${title}" removed from wishlist`
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
        maxWidth: 1440,
        mx: 'auto',
      }}
    >
      {/* =================================================
          PAGE HEADER
      ================================================== */}

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
          My Wishlist
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
          {items.length > 0
            ? `${items.length} course${
                items.length > 1
                  ? 's'
                  : ''
              } saved for later`
            : 'Courses you save will appear here'}
        </Typography>
      </Stack>

      {/* =================================================
          CONTENT
      ================================================== */}

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <Box
          sx={{
            display: 'grid',

            gridTemplateColumns: {
              xs:
                '1fr',

              sm:
                'repeat(2, minmax(0, 1fr))',

              lg:
                'repeat(4, minmax(0, 1fr))',
            },

            columnGap: {
              xs: 0,
              sm: 2,
              lg: 2,
            },

            rowGap: {
              xs: 2,
              sm: 2.5,
              lg: 2.5,
            },

            alignItems:
              'stretch',
          }}
        >
          <AnimatePresence mode="popLayout">
            {items.map(
              (
                course,
                index
              ) => (
                <WishlistCourseCard
                  key={course.id}
                  {...course}
                  index={index}
                  onRemove={() =>
                    handleRemove(
                      course.id,
                      course.title
                    )
                  }
                />
              )
            )}
          </AnimatePresence>
        </Box>
      )}
    </Stack>
  );
};

export default Wishlist;