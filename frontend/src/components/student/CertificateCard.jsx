import { Box, Stack, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import {
  FiAward,
  FiDownload,
  FiEye,
  FiCheckCircle,
  FiCalendar,
} from 'react-icons/fi';

const CertificateCard = ({
  courseTitle,
  mentor,
  issuedDate,
  certificateId,
  onView,
  onDownload,
  index = 0,
}) => (
  <Box
    component={motion.article}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.3,
      delay: index * 0.05,
      ease: 'easeOut',
    }}
    sx={{
      width: '100%',
      height: '100%',
      minWidth: 0,

      display: 'flex',
      flexDirection: 'column',

      bgcolor: '#FFFFFF',

      border: '1px solid #E2E8F0',
      borderRadius: '10px',

      overflow: 'hidden',

      boxShadow:
        '0 1px 2px rgba(15, 23, 42, 0.04)',

      transition:
        'border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',

      '&:hover': {
        borderColor: '#CBD5E1',
        boxShadow:
          '0 8px 22px rgba(15, 23, 42, 0.08)',
        transform: 'translateY(-2px)',
      },
    }}
  >
    {/* =====================================================
        CERTIFICATE PREVIEW
    ====================================================== */}

    <Box
      sx={{
        position: 'relative',

        height: {
          xs: 145,
          sm: 155,
        },

        flexShrink: 0,

        bgcolor: '#F8FAFC',

        borderBottom:
          '1px solid #E2E8F0',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        overflow: 'hidden',
      }}
    >
      {/* Certificate sheet */}

      <Box
        sx={{
          position: 'relative',

          width: '72%',
          height: '70%',

          bgcolor: '#FFFFFF',

          border:
            '1px solid #D9DEE7',

          boxShadow:
            '0 5px 14px rgba(15, 23, 42, 0.10)',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          transform: 'rotate(-1deg)',
        }}
      >
        {/* Certificate inner border */}

        <Box
          sx={{
            position: 'absolute',

            inset: 6,

            border:
              '1px solid #EAB308',

            opacity: 0.45,
          }}
        />

        <Stack
          alignItems="center"
          spacing={0.25}
          sx={{
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.5rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#64748B',
            }}
          >
            Praksha Academy
          </Typography>

          <FiAward
            size={24}
            color="#D97706"
            aria-hidden="true"
          />

          <Typography
            sx={{
              fontFamily:
                'Georgia, serif',

              fontSize: {
                xs: '0.62rem',
                sm: '0.7rem',
              },

              fontWeight: 700,

              color: '#1E293B',

              textAlign: 'center',

              maxWidth: '85%',
            }}
          >
            Certificate of Completion
          </Typography>
        </Stack>
      </Box>

      {/* Verified badge */}

      <Box
        sx={{
          position: 'absolute',

          top: 10,
          left: 10,

          display: 'inline-flex',
          alignItems: 'center',

          gap: 0.5,

          px: 1,

          py: 0.5,

          bgcolor: '#FFFFFF',

          border:
            '1px solid #DCFCE7',

          borderRadius: '5px',

          boxShadow:
            '0 2px 6px rgba(15,23,42,0.06)',
        }}
      >
        <FiCheckCircle
          size={12}
          color="#16A34A"
          aria-hidden="true"
        />

        <Typography
          sx={{
            fontSize: '0.65rem',
            fontWeight: 700,
            color: '#15803D',
            lineHeight: 1,
          }}
        >
          Verified
        </Typography>
      </Box>
    </Box>

    {/* =====================================================
        CONTENT
    ====================================================== */}

    <Stack
      spacing={1.5}
      sx={{
        p: 2,

        flex: 1,

        minWidth: 0,
      }}
    >
      {/* Course information */}

      <Stack spacing={0.45}>
        <Typography
          component="h2"
          sx={{
            fontFamily:
              'Inter, sans-serif',

            fontWeight: 700,

            fontSize:
              '0.98rem',

            lineHeight: 1.35,

            color: '#0F172A',

            display:
              '-webkit-box',

            WebkitLineClamp: 2,

            WebkitBoxOrient:
              'vertical',

            overflow: 'hidden',

            minHeight:
              '2.65em',
          }}
        >
          {courseTitle}
        </Typography>

        <Typography
          sx={{
            fontSize:
              '0.75rem',

            color:
              '#64748B',

            whiteSpace:
              'nowrap',

            overflow:
              'hidden',

            textOverflow:
              'ellipsis',
          }}
        >
          Completed with {mentor}
        </Typography>
      </Stack>

      {/* Details */}

      <Box
        sx={{
          borderTop:
            '1px solid #F1F5F9',

          borderBottom:
            '1px solid #F1F5F9',

          py: 1.15,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
        >
          {/* Issued */}

          <Stack
            spacing={0.25}
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Stack
              direction="row"
              spacing={0.45}
              alignItems="center"
            >
              <FiCalendar
                size={12}
                color="#94A3B8"
                aria-hidden="true"
              />

              <Typography
                sx={{
                  fontSize:
                    '0.65rem',

                  color:
                    '#94A3B8',

                  fontWeight: 500,
                }}
              >
                Issued
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize:
                  '0.75rem',

                fontWeight: 600,

                color:
                  '#334155',

                whiteSpace:
                  'nowrap',
              }}
            >
              {issuedDate}
            </Typography>
          </Stack>

          {/* Certificate ID */}

          <Stack
            spacing={0.25}
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize:
                  '0.65rem',

                color:
                  '#94A3B8',

                fontWeight: 500,
              }}
            >
              Certificate ID
            </Typography>

            <Typography
              sx={{
                fontFamily:
                  'monospace',

                fontSize:
                  '0.68rem',

                fontWeight: 600,

                color:
                  '#334155',

                whiteSpace:
                  'nowrap',

                overflow:
                  'hidden',

                textOverflow:
                  'ellipsis',
              }}
              title={certificateId}
            >
              {certificateId}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* =================================================
          ACTIONS
      ================================================== */}

      <Stack
        direction="row"
        spacing={1}
        sx={{
          mt: 'auto',
        }}
      >
        <Button
          fullWidth
          onClick={onView}
          startIcon={
            <FiEye
              size={14}
              aria-hidden="true"
            />
          }
          sx={{
            minHeight: 38,

            borderRadius: '6px',

            border:
              '1px solid #CBD5E1',

            bgcolor:
              '#FFFFFF',

            color:
              '#334155',

            fontSize:
              '0.76rem',

            fontWeight: 600,

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
          View
        </Button>

        <Button
          fullWidth
          onClick={onDownload}
          startIcon={
            <FiDownload
              size={14}
              aria-hidden="true"
            />
          }
          sx={{
            minHeight: 38,

            borderRadius: '6px',

            bgcolor:
              '#2563EB',

            color:
              '#FFFFFF',

            fontSize:
              '0.76rem',

            fontWeight: 600,

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

            '&:focus-visible': {
              outline:
                '2px solid #2563EB',

              outlineOffset:
                '2px',
            },
          }}
        >
          Download
        </Button>
      </Stack>
    </Stack>
  </Box>
);

export default CertificateCard;