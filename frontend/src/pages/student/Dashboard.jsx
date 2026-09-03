import { Box, Stack, Typography, LinearProgress, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import {
  FiBookOpen,
  FiCheckCircle,
  FiAward,
  FiClock,
  FiArrowRight,
  FiPlay,
  FiTrendingUp,
} from 'react-icons/fi';
import DashboardHeader from '../../components/student/DashboardHeader';

// Mock data — no backend integration yet
const STUDENT = { name: 'Aditi' };

const STATS = [
  { label: 'Enrolled Courses', value: 6, icon: FiBookOpen, color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)' },
  { label: 'Completed', value: 3, icon: FiCheckCircle, color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' },
  { label: 'Certificates', value: 2, icon: FiAward, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  { label: 'Hours Learned', value: 42, icon: FiClock, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
];

const IN_PROGRESS_COURSES = [
  { id: 1, title: 'React & Modern JavaScript', mentor: 'Rohan Mehta', progress: 68 },
  { id: 2, title: 'Cloud Computing Fundamentals', mentor: 'Sneha Kapoor', progress: 35 },
  { id: 3, title: 'UI/UX Design Principles', mentor: 'Aarav Singh', progress: 82 },
];

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const cardEntrance = {
  hidden: { opacity: 0, y: 14 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.06, ease: 'easeOut' },
  }),
};

const StatCard = ({ label, value, icon: Icon, color, bg, index }) => (
  <Box
    component={motion.div}
    custom={index}
    initial="hidden"
    animate="visible"
    variants={cardEntrance}
    whileHover={{ y: -4 }}
    sx={{
      position: 'relative',
      bgcolor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '18px',
      p: 2.5,
      height: '100%',
      overflow: 'hidden',
      transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
      '&:hover': {
        boxShadow: '0 16px 32px rgba(15, 23, 42, 0.09)',
        borderColor: 'transparent',
      },
    }}
  >
    {/* Colored top accent */}
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: color }} />

    <Stack spacing={1.75} alignItems="center" sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          bgcolor: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={21} color={color} aria-hidden="true" />
      </Box>
      <Stack spacing={0.25} alignItems="center">
        <Typography
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.06, duration: 0.3 }}
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '1.75rem',
            color: '#1E293B',
            lineHeight: 1,
            m: 0,
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8125rem',
            color: '#64748B',
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Stack>
  </Box>
);

const CourseProgressCard = ({ title, mentor, progress, index }) => (
  <Box
    component={motion.div}
    custom={index}
    initial="hidden"
    animate="visible"
    variants={cardEntrance}
    whileHover={{ y: -3 }}
    sx={{
      bgcolor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      p: { xs: 2, sm: 2.5 },
      transition: 'box-shadow 0.25s ease',
      '&:hover': {
        boxShadow: '0 14px 30px rgba(15, 23, 42, 0.08)',
      },
    }}
  >
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={2}
    >
      {/* Icon badge */}
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: '13px',
          bgcolor: 'rgba(37, 99, 235, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <FiBookOpen size={20} color="#2563EB" aria-hidden="true" />
      </Box>

      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '0.9375rem',
            color: '#1E293B',
          }}
        >
          {title}
        </Typography>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              bgcolor: 'rgba(37, 99, 235, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: '#2563EB' }}>
              {getInitials(mentor)}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8125rem',
              color: '#64748B',
            }}
          >
            {mentor}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        spacing={0.75}
        sx={{ width: { xs: '100%', sm: 200 }, flexShrink: 0 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
            Progress
          </Typography>
          <Chip
            label={`${progress}%`}
            size="small"
            sx={{
              ml: 'auto',
              height: 20,
              bgcolor: 'rgba(37, 99, 235, 0.1)',
              color: '#2563EB',
              fontWeight: 700,
              fontSize: '0.6875rem',
              fontFamily: 'Inter, sans-serif',
              '& .MuiChip-label': { px: 1 },
            }}
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 999,
            bgcolor: '#E2E8F0',
            '& .MuiLinearProgress-bar': {
              borderRadius: 999,
              bgcolor: '#2563EB',
            },
          }}
        />
      </Stack>

      <Box
        component={RouterLink}
        to="/student/courses"
        aria-label={`Continue ${title}`}
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '10px',
          bgcolor: '#2563EB',
          color: '#FFFFFF',
          textDecoration: 'none',
          transition: 'background-color 0.2s ease, transform 0.2s ease',
          '&:hover': {
            bgcolor: '#1D4ED8',
            transform: 'scale(1.06)',
          },
          '&:focus-visible': {
            outline: '2px solid #2563EB',
            outlineOffset: '2px',
          },
        }}
      >
        <FiPlay size={16} aria-hidden="true" />
      </Box>
    </Stack>
  </Box>
);

const Dashboard = () => {
  const activeCourse = IN_PROGRESS_COURSES[0];
  const inProgressCount = IN_PROGRESS_COURSES.length;

  return (
    <Stack spacing={4}>
      <DashboardHeader
        name={STUDENT.name}
        continueCourseTitle={activeCourse?.title}
        continueProgress={activeCourse?.progress}
      />

      {/* Stats grid — Bootstrap grid + MUI content per tech stack */}
      <div className="row g-3">
        {STATS.map((stat, index) => (
          <div key={stat.label} className="col-6 col-md-3">
            <StatCard {...stat} index={index} />
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: 'rgba(139, 92, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FiTrendingUp size={17} color="#8B5CF6" aria-hidden="true" />
          </Box>
          <Stack spacing={0}>
            <Typography
              component="h2"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '1.125rem',
                color: '#1E293B',
              }}
            >
              Continue Learning
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                color: '#64748B',
              }}
            >
              {inProgressCount} courses in progress
            </Typography>
          </Stack>

          <Chip
            component={RouterLink}
            to="/student/courses"
            clickable
            label="View all"
            deleteIcon={<FiArrowRight size={14} aria-hidden="true" />}
            onDelete={() => {}}
            sx={{
              ml: 'auto',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '0.8125rem',
              color: '#2563EB',
              bgcolor: 'rgba(37, 99, 235, 0.08)',
              '& .MuiChip-deleteIcon': { color: '#2563EB' },
              '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.14)' },
              '&:focus-visible': {
                outline: '2px solid #2563EB',
                outlineOffset: '2px',
              },
            }}
          />
        </Stack>

        <Stack spacing={1.5}>
          {IN_PROGRESS_COURSES.map((course, index) => (
            <CourseProgressCard key={course.id} {...course} index={index} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Dashboard;