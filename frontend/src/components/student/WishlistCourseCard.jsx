import { Box, Stack, Typography, IconButton, Button } from '@mui/material';
import { motion } from 'framer-motion';
import {
  FiBookmark,
  FiStar,
  FiUser,
  FiArrowRight,
  FiClock,
  FiPlayCircle,
  FiCode,
  FiCpu,
  FiCloud,
  FiShield,
} from 'react-icons/fi';

const CATEGORY_META = {
  'Web Development': {
    icon: FiCode,
    background:
      'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    color: '#2563EB',
  },

  'Artificial Intelligence': {
    icon: FiCpu,
    background:
      'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
    color: '#7C3AED',
  },

  'Cloud Computing': {
    icon: FiCloud,
    background:
      'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)',
    color: '#0284C7',
  },

  'Cyber Security': {
    icon: FiShield,
    background:
      'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
    color: '#DC2626',
  },
};

const FALLBACK_META = {
  icon: FiCode,
  background:
    'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  color: '#2563EB',
};

/**
 * Converts prices such as ₹4,999 / ₹6,999
 * into a percentage discount.
 */
const getDiscountPercent = (price, originalPrice) => {
  if (!price || !originalPrice) {
    return null;
  }

  const parsePrice = (value) =>
    Number(String(value).replace(/[^\d]/g, ''));

  const current = parsePrice(price);
  const original = parsePrice(originalPrice);

  if (
    !current ||
    !original ||
    original <= current
  ) {
    return null;
  }

  return Math.round(
    ((original - current) / original) * 100
  );
};

/**
 * Wishlist course card.
 *
 * @param {string} title
 * @param {string} mentor
 * @param {string} category
 * @param {string} price
 * @param {string} originalPrice
 * @param {number} rating
 * @param {number} reviewCount
 * @param {string} duration
 * @param {number} lessons
 * @param {Function} onRemove
 * @param {number} index
 */
const WishlistCourseCard = ({
  title,
  mentor,
  category,
  price,
  originalPrice,
  rating,
  reviewCount,
  duration,
  lessons,
  onRemove,
  index = 0,
}) => {
  const meta =
    CATEGORY_META[category] || FALLBACK_META;

  const CategoryIcon = meta.icon;

  const discount = getDiscountPercent(
    price,
    originalPrice
  );

  return (
    <Box
      component={motion.article}
      layout
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.97,
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
        ease: 'easeOut',
      }}
      sx={{
        width: '100%',
        height: '100%',
        minWidth: 0,

        bgcolor: '#FFFFFF',

        border: '1px solid #E2E8F0',
        borderRadius: '10px',

        overflow: 'hidden',

        display: 'flex',
        flexDirection: 'column',

        boxShadow:
          '0 1px 2px rgba(15, 23, 42, 0.04)',

        transition:
          'box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease',

        '&:hover': {
          borderColor: '#CBD5E1',
          boxShadow:
            '0 8px 22px rgba(15, 23, 42, 0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* =====================================================
          COURSE VISUAL
      ====================================================== */}

      <Box
        sx={{
          position: 'relative',

          width: '100%',
          height: 148,

          background: meta.background,

          overflow: 'hidden',

          flexShrink: 0,
        }}
      >
        {/* Very subtle texture */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,

            opacity: 0.12,

            backgroundImage:
              'linear-gradient(135deg, rgba(255,255,255,0.7) 1px, transparent 1px)',

            backgroundSize: '18px 18px',

            pointerEvents: 'none',
          }}
        />

        {/* Soft center glow */}
        <Box
          sx={{
            position: 'absolute',

            width: 180,
            height: 180,

            left: '50%',
            top: '50%',

            transform:
              'translate(-50%, -50%)',

            borderRadius: '50%',

            bgcolor:
              'rgba(255,255,255,0.08)',

            pointerEvents: 'none',
          }}
        />

        {/* =================================================
            DISCOUNT BADGE
        ================================================== */}

        {discount && (
          <Box
            sx={{
              position: 'absolute',

              top: 10,
              left: 10,

              zIndex: 3,

              px: 1,
              py: 0.55,

              borderRadius: '4px',

              bgcolor: '#F59E0B',
              color: '#FFFFFF',

              fontSize: '0.68rem',
              fontWeight: 800,

              lineHeight: 1,

              letterSpacing: '0.01em',

              boxShadow:
                '0 2px 6px rgba(15,23,42,0.16)',
            }}
          >
            {discount}% OFF
          </Box>
        )}

        {/* =================================================
            BOOKMARK / REMOVE
        ================================================== */}

        <IconButton
          onClick={onRemove}
          aria-label={`Remove ${title} from wishlist`}
          size="small"
          sx={{
            position: 'absolute',

            top: 9,
            right: 9,

            zIndex: 3,

            width: 32,
            height: 32,

            bgcolor:
              'rgba(255,255,255,0.96)',

            color: '#2563EB',

            border:
              '1px solid rgba(226,232,240,0.9)',

            boxShadow:
              '0 2px 7px rgba(15,23,42,0.12)',

            '&:hover': {
              bgcolor: '#FFFFFF',
              color: '#1D4ED8',
            },

            '&:focus-visible': {
              outline:
                '2px solid #FFFFFF',
              outlineOffset: '2px',
            },
          }}
        >
          <FiBookmark
            size={16}
            fill="currentColor"
            aria-hidden="true"
          />
        </IconButton>

        {/* =================================================
            CATEGORY ICON
        ================================================== */}

        <Box
          sx={{
            position: 'absolute',

            left: '50%',
            top: '50%',

            transform:
              'translate(-50%, -50%)',

            width: 58,
            height: 58,

            borderRadius: '12px',

            bgcolor:
              'rgba(255,255,255,0.94)',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            boxShadow:
              '0 6px 18px rgba(15,23,42,0.14)',
          }}
        >
          <CategoryIcon
            size={27}
            color={meta.color}
            aria-hidden="true"
          />
        </Box>

        {/* Category label */}
        <Typography
          sx={{
            position: 'absolute',

            left: 12,
            bottom: 10,

            color:
              'rgba(255,255,255,0.96)',

            fontSize: '0.65rem',
            fontWeight: 700,

            letterSpacing: '0.06em',

            textTransform:
              'uppercase',

            textShadow:
              '0 1px 3px rgba(15,23,42,0.3)',
          }}
        >
          {category}
        </Typography>
      </Box>

      {/* =====================================================
          CARD CONTENT
      ====================================================== */}

      <Stack
        spacing={1.35}
        sx={{
          p: 2,

          flex: 1,

          minWidth: 0,
        }}
      >
        {/* Course title */}

        <Typography
          component="h3"
          sx={{
            fontFamily:
              'Inter, sans-serif',

            fontWeight: 700,

            fontSize:
              '0.98rem',

            lineHeight: 1.35,

            color: '#0F172A',

            letterSpacing:
              '-0.01em',

            minHeight: '2.65em',

            display:
              '-webkit-box',

            WebkitLineClamp: 2,

            WebkitBoxOrient:
              'vertical',

            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>

        {/* Instructor */}

        <Stack
          direction="row"
          spacing={0.7}
          alignItems="center"
        >
          <FiUser
            size={13}
            color="#64748B"
            aria-hidden="true"
          />

          <Typography
            sx={{
              fontSize:
                '0.76rem',

              color: '#64748B',

              lineHeight: 1.2,

              whiteSpace:
                'nowrap',

              overflow: 'hidden',

              textOverflow:
                'ellipsis',
            }}
          >
            {mentor}
          </Typography>
        </Stack>

        {/* =================================================
            COURSE META
        ================================================== */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{
            minHeight: 30,

            borderTop:
              '1px solid #F1F5F9',

            borderBottom:
              '1px solid #F1F5F9',

            py: 1,
          }}
        >
          {duration && (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
            >
              <FiClock
                size={13}
                color="#94A3B8"
                aria-hidden="true"
              />

              <Typography
                sx={{
                  fontSize:
                    '0.7rem',

                  color:
                    '#64748B',

                  whiteSpace:
                    'nowrap',
                }}
              >
                {duration}
              </Typography>
            </Stack>
          )}

          {lessons && (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
            >
              <FiPlayCircle
                size={13}
                color="#94A3B8"
                aria-hidden="true"
              />

              <Typography
                sx={{
                  fontSize:
                    '0.7rem',

                  color:
                    '#64748B',

                  whiteSpace:
                    'nowrap',
                }}
              >
                {lessons} lessons
              </Typography>
            </Stack>
          )}

          {rating && (
            <Stack
              direction="row"
              spacing={0.4}
              alignItems="center"
              sx={{
                ml: 'auto',
              }}
            >
              <FiStar
                size={13}
                color="#F59E0B"
                fill="#F59E0B"
                aria-hidden="true"
              />

              <Typography
                sx={{
                  fontSize:
                    '0.7rem',

                  fontWeight: 700,

                  color:
                    '#1E293B',
                }}
              >
                {rating.toFixed(1)}
              </Typography>

              {reviewCount && (
                <Typography
                  sx={{
                    fontSize:
                      '0.65rem',

                    color:
                      '#94A3B8',
                  }}
                >
                  ({reviewCount})
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        {/* =================================================
            PRICE + ACTION
        ================================================== */}

        <Stack
          spacing={1.15}
          sx={{
            mt: 'auto',
          }}
        >
          {/* Price */}

          <Stack
            direction="row"
            alignItems="baseline"
            spacing={1}
          >
            <Typography
              sx={{
                fontWeight: 700,

                fontSize:
                  '1.08rem',

                color:
                  '#0F172A',

                letterSpacing:
                  '-0.01em',
              }}
            >
              {price}
            </Typography>

            {originalPrice && (
              <Typography
                sx={{
                  fontSize:
                    '0.72rem',

                  color:
                    '#94A3B8',

                  textDecoration:
                    'line-through',
                }}
              >
                {originalPrice}
              </Typography>
            )}
          </Stack>

          {/* Enroll */}

          <Button
            fullWidth
            endIcon={
              <FiArrowRight
                size={15}
                aria-hidden="true"
              />
            }
            aria-label={`Enroll in ${title}`}
            sx={{
              minHeight: 40,

              px: 2,

              borderRadius: '6px',

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

              transition:
                'background-color 160ms ease',

              '&:hover': {
                bgcolor:
                  '#1D4ED8',

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
            Enroll now
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default WishlistCourseCard;