import { Box, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * StatCard — admin summary stat card.
 *
 * Props:
 *  label  {string}
 *  value  {string|number}
 *  icon   {React component}  — react-icons icon
 *  color  {string}           — accent color hex
 *  bg     {string}           — icon bg color (rgba)
 *  trend  {string}           — optional trend text e.g. "+12% this month"
 *  trendUp {boolean}         — true = green, false = red
 *  index  {number}           — for staggered animation
 */
const StatCard = ({ label, value, icon: Icon, color, bg, trend, trendUp, index = 0 }) => (
  <Box
    component={motion.div}
    custom={index}
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
    whileHover={{ y: -4 }}
    sx={{
      position: 'relative',
      bgcolor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      p: { xs: 2, md: 2.5 },
      height: '100%',
      overflow: 'hidden',
      transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
      '&:hover': {
        boxShadow: '0 16px 32px rgba(15, 23, 42, 0.09)',
        borderColor: 'transparent',
      },
    }}
  >
    {/* Top accent line */}
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: color }} />

    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
      <Stack spacing={0.5}>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '1.875rem',
            color: '#1E293B',
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>
        {trend && (
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: trendUp ? '#22C55E' : '#EF4444',
              mt: 0.25,
            }}
          >
            {trend}
          </Typography>
        )}
      </Stack>

      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '13px',
          bgcolor: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={22} color={color} aria-hidden="true" />}
      </Box>
    </Stack>
  </Box>
);

export default StatCard;
