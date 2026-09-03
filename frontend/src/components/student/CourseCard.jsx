import { Box, Stack, Typography, IconButton } from '@mui/material';
import {
  FiClock,
  FiMoreVertical,
  FiCheckCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const CATEGORY_COLORS = {
  'Web Development': '#2563EB',
  'Cloud Computing': '#0284C7',
  Design: '#D97706',
  'AI & Data': '#7C3AED',
  'Cyber Security': '#DC2626',
};

const CourseCard = ({ course }) => {
  const completed = course.progress >= 100;

  const categoryColor =
    CATEGORY_COLORS[course.category] || '#2563EB';

  const handleOpen = () => {
    toast.success(
      completed
        ? `Opening ${course.title}`
        : `Continuing ${course.title}`
    );
  };

  return (
    <Box
      component="article"
      onClick={handleOpen}
      sx={{
        minWidth: 0,
        cursor: 'pointer',
        position: 'relative',

        '&:hover .course-image': {
          transform: 'scale(1.035)',
        },

        '&:hover .course-title': {
          color: '#1D4ED8',
        },

        '&:hover .course-menu': {
          opacity: 1,
        },
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          bgcolor: '#E5E7EB',
          borderRadius: '3px',
        }}
      >
        <Box
          component="img"
          className="course-image"
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          sx={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
            transition: 'transform 220ms ease',
          }}
        />

        {/* More menu */}
        <IconButton
          className="course-menu"
          aria-label={`More options for ${course.title}`}
          size="small"
          onClick={(event) => {
            event.stopPropagation();
            toast.info(`More options for ${course.title}`);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 30,
            height: 30,
            bgcolor: 'rgba(255,255,255,0.96)',
            color: '#111827',
            opacity: 0.92,
            boxShadow: '0 1px 4px rgba(15,23,42,0.18)',

            '&:hover': {
              bgcolor: '#FFFFFF',
            },
          }}
        >
          <FiMoreVertical size={16} />
        </IconButton>
      </Box>

      {/* Progress */}
      <Box
        sx={{
          height: 4,
          width: '100%',
          bgcolor: '#D9DEE8',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${Math.min(course.progress, 100)}%`,
            height: '100%',
            bgcolor: completed ? '#16A34A' : '#2563EB',
            transition: 'width 300ms ease',
          }}
        />
      </Box>

      {/* Category */}
      <Typography
        sx={{
          mt: 1.05,
          mb: 0.35,
          fontSize: '0.67rem',
          lineHeight: 1.2,
          fontWeight: 700,
          letterSpacing: '0.055em',
          textTransform: 'uppercase',
          color: categoryColor,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {course.category}
      </Typography>

      {/* Title */}
      <Typography
        component="h3"
        className="course-title"
        sx={{
          fontSize: '0.96rem',
          lineHeight: 1.35,
          fontWeight: 700,
          color: '#111827',
          letterSpacing: '-0.01em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          transition: 'color 150ms ease',
          minHeight: '2.6em',
        }}
      >
        {course.title}
      </Typography>

      {/* Instructor */}
      <Typography
        sx={{
          mt: 0.55,
          fontSize: '0.72rem',
          lineHeight: 1.35,
          color: '#64748B',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {course.mentor}
      </Typography>

      {/* Meta */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.55}
        sx={{
          mt: 0.55,
        }}
      >
        {completed ? (
          <FiCheckCircle
            size={13}
            color="#16A34A"
          />
        ) : (
          <FiClock
            size={13}
            color="#64748B"
          />
        )}

        <Typography
          sx={{
            fontSize: '0.7rem',
            lineHeight: 1.3,
            color: completed ? '#16A34A' : '#64748B',
            fontWeight: completed ? 600 : 400,
          }}
        >
          {completed
            ? '100% complete'
            : `${course.progress}% complete`}
        </Typography>

        <Typography
          sx={{
            color: '#CBD5E1',
            fontSize: '0.7rem',
          }}
        >
          •
        </Typography>

        <Typography
          sx={{
            fontSize: '0.7rem',
            color: '#64748B',
          }}
        >
          {course.duration}h
        </Typography>
      </Stack>
    </Box>
  );
};

export default CourseCard;