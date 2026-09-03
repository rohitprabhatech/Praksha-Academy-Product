import { useMemo, useState } from 'react';

import {
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  IconButton,
} from '@mui/material';

import {
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

import { toast } from 'react-toastify';

import CourseCard from '../../components/student/CourseCard';

/* ============================================================
   COURSE DATA
   ============================================================ */

const COURSES = [
  {
    id: 1,
    title: 'React & Modern JavaScript',
    mentor: 'Rohan Mehta',
    category: 'Web Development',
    duration: 24,
    progress: 68,
    thumbnail:
      'https://picsum.photos/seed/react-modern-javascript/640/360',
  },
  {
    id: 2,
    title: 'Cloud Computing Fundamentals',
    mentor: 'Sneha Kapoor',
    category: 'Cloud Computing',
    duration: 18,
    progress: 35,
    thumbnail:
      'https://picsum.photos/seed/cloud-computing/640/360',
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    mentor: 'Aarav Singh',
    category: 'Design',
    duration: 16,
    progress: 82,
    thumbnail:
      'https://picsum.photos/seed/uiux-design/640/360',
  },
  {
    id: 4,
    title: 'Node.js Backend Development',
    mentor: 'Rohan Mehta',
    category: 'Web Development',
    duration: 22,
    progress: 12,
    thumbnail:
      'https://picsum.photos/seed/node-backend/640/360',
  },
  {
    id: 5,
    title: 'Python for Data Science',
    mentor: 'Priya Nair',
    category: 'AI & Data',
    duration: 30,
    progress: 100,
    thumbnail:
      'https://picsum.photos/seed/python-data/640/360',
  },
  {
    id: 6,
    title: 'Cyber Security Essentials',
    mentor: 'Vikram Rao',
    category: 'Cyber Security',
    duration: 20,
    progress: 100,
    thumbnail:
      'https://picsum.photos/seed/cyber-security/640/360',
  },
];

/* ============================================================
   FILTER SELECT
   ============================================================ */

const FilterSelect = ({
  value,
  onChange,
  children,
}) => (
  <FormControl
    size="small"
    sx={{
      minWidth: 132,

      '@media (max-width: 600px)': {
        flex: 1,
        minWidth: 0,
      },
    }}
  >
    <Select
      value={value}
      onChange={onChange}
      IconComponent={FiChevronDown}
      sx={{
        height: 38,
        borderRadius: '5px',
        bgcolor: '#FFFFFF',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#334155',

        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#CBD5E1',
        },

        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#94A3B8',
        },

        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#2563EB',
          borderWidth: '1px',
        },

        '& .MuiSelect-select': {
          px: 1.4,
          py: 0.9,
        },
      }}
    >
      {children}
    </Select>
  </FormControl>
);

/* ============================================================
   PAGE
   ============================================================ */

const MyCourses = () => {
  const [category, setCategory] = useState('all');
  const [progress, setProgress] = useState('all');
  const [search, setSearch] = useState('');

  /* ==========================================================
     COURSE COUNTS
     ========================================================== */

  const activeCourses = COURSES.filter(
    (course) => course.progress < 100
  );

  const completedCourses = COURSES.filter(
    (course) => course.progress >= 100
  );

  /* ==========================================================
     FILTER COURSES
     ========================================================== */

  const filteredCourses = useMemo(() => {
    let result = [...COURSES];

    /* CATEGORY FILTER */

    if (category !== 'all') {
      result = result.filter(
        (course) =>
          course.category === category
      );
    }

    /* PROGRESS FILTER */

    if (progress === 'incomplete') {
      result = result.filter(
        (course) => course.progress < 100
      );
    }

    if (progress === 'completed') {
      result = result.filter(
        (course) => course.progress >= 100
      );
    }

    /* SEARCH */

    if (search.trim()) {
      const query = search
        .trim()
        .toLowerCase();

      result = result.filter(
        (course) =>
          course.title
            .toLowerCase()
            .includes(query) ||
          course.mentor
            .toLowerCase()
            .includes(query) ||
          course.category
            .toLowerCase()
            .includes(query)
      );
    }

    return result;
  }, [
    category,
    progress,
    search,
  ]);

  /* ==========================================================
     RESET
     ========================================================== */

  const resetFilters = () => {
    setCategory('all');
    setProgress('all');
    setSearch('');

    toast.info('Filters cleared');
  };

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1180,
        mx: 'auto',
        pb: 7,
      }}
    >
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <Box
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
              xs: '1.65rem',
              sm: '1.8rem',
              md: '2rem',
            },

            lineHeight: 1.2,

            letterSpacing:
              '-0.025em',

            color: '#0F172A',
          }}
        >
          My Courses
        </Typography>

        <Typography
          sx={{
            mt: 0.45,

            fontFamily:
              'Inter, sans-serif',

            fontSize: '0.8rem',

            color: '#64748B',
          }}
        >
          {COURSES.length} courses enrolled
        </Typography>
      </Box>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <Stack
        spacing={2.4}
        sx={{
          mt: 2.5,
        }}
      >
        {/* ===================================================
            LEARNING SUMMARY
        =================================================== */}

        <Box
          sx={{
            border:
              '1px solid #D9DEE6',

            borderRadius: '8px',

            bgcolor: '#FFFFFF',

            px: {
              xs: 2,
              md: 2.25,
            },

            py: 1.8,
          }}
        >
          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            justifyContent="space-between"
            alignItems={{
              xs: 'flex-start',
              sm: 'center',
            }}
            spacing={2}
          >
            {/* LEFT */}

            <Stack spacing={0.4}>
              <Typography
                sx={{
                  fontSize:
                    '0.95rem',

                  fontWeight: 700,

                  color: '#111827',

                  lineHeight: 1.3,
                }}
              >
                Keep your learning
                momentum going
              </Typography>

              <Typography
                sx={{
                  fontSize:
                    '0.72rem',

                  color: '#64748B',

                  lineHeight: 1.5,
                }}
              >
                Continue one of your
                active courses and keep
                making progress.
              </Typography>
            </Stack>

            {/* RIGHT STATS */}

            <Stack
              direction="row"
              spacing={{
                xs: 2.5,
                sm: 3,
              }}
              sx={{
                flexShrink: 0,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize:
                      '0.67rem',

                    color: '#94A3B8',
                  }}
                >
                  In progress
                </Typography>

                <Typography
                  sx={{
                    mt: 0.15,

                    fontSize:
                      '0.95rem',

                    fontWeight: 700,

                    color: '#111827',
                  }}
                >
                  {activeCourses.length}{' '}
                  courses
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize:
                      '0.67rem',

                    color: '#94A3B8',
                  }}
                >
                  Completed
                </Typography>

                <Typography
                  sx={{
                    mt: 0.15,

                    fontSize:
                      '0.95rem',

                    fontWeight: 700,

                    color: '#16A34A',
                  }}
                >
                  {completedCourses.length}{' '}
                  courses
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {/* ===================================================
            TOOLBAR
            FILTERS LEFT
            SEARCH RIGHT
        =================================================== */}

        <Box
          sx={{
            width: '100%',

            display: 'flex',

            alignItems: 'center',

            justifyContent:
              'space-between',

            gap: 2,

            '@media (max-width: 700px)': {
              flexDirection:
                'column',

              alignItems:
                'stretch',
            },
          }}
        >
          {/* =========================
              LEFT FILTERS
          ========================== */}

          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexShrink: 0,

              '@media (max-width: 600px)': {
                width: '100%',
              },
            }}
          >
            <FilterSelect
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value
                )
              }
            >
              <MenuItem value="all">
                Categories
              </MenuItem>

              <MenuItem value="Web Development">
                Web Development
              </MenuItem>

              <MenuItem value="Cloud Computing">
                Cloud Computing
              </MenuItem>

              <MenuItem value="Design">
                Design
              </MenuItem>

              <MenuItem value="AI & Data">
                AI & Data
              </MenuItem>

              <MenuItem value="Cyber Security">
                Cyber Security
              </MenuItem>
            </FilterSelect>

            <FilterSelect
              value={progress}
              onChange={(event) =>
                setProgress(
                  event.target.value
                )
              }
            >
              <MenuItem value="all">
                Progress
              </MenuItem>

              <MenuItem value="incomplete">
                In progress
              </MenuItem>

              <MenuItem value="completed">
                Completed
              </MenuItem>
            </FilterSelect>
          </Stack>

          {/* =========================
              SEARCH — RIGHT SIDE
          ========================== */}

          <TextField
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search my courses"
            size="small"
            aria-label="Search my courses"
            sx={{
              width: 300,

              flexShrink: 0,

              ml: 'auto',

              '@media (max-width: 700px)': {
                width: '100%',
                ml: 0,
              },

              '& .MuiOutlinedInput-root': {
                height: 40,

                borderRadius: '5px',

                bgcolor: '#FFFFFF',

                fontSize:
                  '0.75rem',

                '& fieldset': {
                  borderColor:
                    '#CBD5E1',
                },

                '&:hover fieldset': {
                  borderColor:
                    '#94A3B8',
                },

                '&.Mui-focused fieldset': {
                  borderColor:
                    '#2563EB',

                  borderWidth: '1px',
                },
              },

              '& .MuiInputBase-input': {
                px: 1.5,
                py: 1,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <FiSearch
                    size={16}
                    color="#64748B"
                    aria-hidden="true"
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* ===================================================
            COURSE COUNT
        =================================================== */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.35}
          sx={{
            mt: 0.2,
          }}
        >
          <Typography
            sx={{
              fontSize:
                '0.78rem',

              fontWeight: 700,

              color: '#111827',
            }}
          >
            {filteredCourses.length}{' '}
            courses
          </Typography>

          <Typography
            sx={{
              fontSize:
                '0.7rem',

              color: '#64748B',
            }}
          >
            Recently accessed
          </Typography>
        </Stack>

        {/* ===================================================
            COURSE GRID
        =================================================== */}

        {filteredCourses.length > 0 ? (
          <Box
            sx={{
              display: 'grid',

              gridTemplateColumns: {
                xs: '1fr',

                sm:
                  'repeat(2, minmax(0, 1fr))',

                md:
                  'repeat(3, minmax(0, 1fr))',

                lg:
                  'repeat(4, minmax(0, 1fr))',
              },

              columnGap: {
                xs: 0,
                sm: 2,
                md: 2.25,
                lg: 2,
              },

              rowGap: {
                xs: 3.5,
                sm: 4,
                md: 4,
                lg: 4.5,
              },
            }}
          >
            {filteredCourses.map(
              (course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                />
              )
            )}
          </Box>
        ) : (
          /* =================================================
             EMPTY STATE
          ================================================= */

          <Box
            sx={{
              minHeight: 220,

              display: 'flex',

              alignItems: 'center',

              justifyContent:
                'center',

              border:
                '1px solid #D9DEE6',

              borderRadius: '8px',

              bgcolor: '#FFFFFF',
            }}
          >
            <Stack
              alignItems="center"
              spacing={1}
            >
              <Typography
                sx={{
                  fontWeight: 700,

                  color: '#334155',
                }}
              >
                No courses found
              </Typography>

              <Typography
                sx={{
                  fontSize:
                    '0.78rem',

                  color: '#64748B',

                  textAlign:
                    'center',
                }}
              >
                Try changing your
                filters or search.
              </Typography>

              <Typography
                component="button"
                onClick={resetFilters}
                sx={{
                  mt: 0.5,

                  border: 0,

                  bgcolor:
                    'transparent',

                  color: '#2563EB',

                  fontSize:
                    '0.75rem',

                  fontWeight: 600,

                  cursor: 'pointer',

                  p: 0,

                  '&:hover': {
                    textDecoration:
                      'underline',
                  },
                }}
              >
                Clear filters
              </Typography>
            </Stack>
          </Box>
        )}

        {/* ===================================================
            PAGINATION — CENTER
        =================================================== */}

        {filteredCourses.length > 0 && (
          <Box
            sx={{
              width: '100%',

              display: 'flex',

              justifyContent:
                'center',

              alignItems: 'center',

              pt: 1.5,

              pb: 2,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              {/* PREVIOUS */}

              <IconButton
                size="medium"
                disabled
                aria-label="Previous page"
                sx={{
                  width: 46,
                  height: 46,

                  border:
                    '1px solid #D8DEE6',

                  borderRadius: '50%',

                  color: '#A1A9B5',

                  bgcolor: '#FFFFFF',

                  '&.Mui-disabled': {
                    color: '#A1A9B5',
                    borderColor:
                      '#D8DEE6',
                    bgcolor:
                      '#FFFFFF',
                  },
                }}
              >
                <FiChevronLeft
                  size={20}
                />
              </IconButton>

              {/* CURRENT PAGE */}

              <Box
                aria-current="page"
                sx={{
                  width: 46,
                  height: 46,

                  display: 'flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  borderRadius: '4px',

                  bgcolor:
                    '#2563EB',

                  color:
                    '#FFFFFF',

                  fontSize:
                    '0.85rem',

                  fontWeight: 700,

                  userSelect:
                    'none',
                }}
              >
                1
              </Box>

              {/* NEXT */}

              <IconButton
                size="medium"
                aria-label="Next page"
                onClick={() =>
                  toast.info(
                    'Next page is not available yet.'
                  )
                }
                sx={{
                  width: 46,
                  height: 46,

                  border:
                    '1px solid #2563EB',

                  borderRadius: '50%',

                  color: '#2563EB',

                  bgcolor: '#FFFFFF',

                  transition:
                    'all 160ms ease',

                  '&:hover': {
                    bgcolor:
                      '#EFF6FF',

                    borderColor:
                      '#1D4ED8',

                    color:
                      '#1D4ED8',
                  },
                }}
              >
                <FiChevronRight
                  size={20}
                />
              </IconButton>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default MyCourses;