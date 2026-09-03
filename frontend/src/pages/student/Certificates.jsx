import {
  Box,
  Stack,
  Typography,
  Button,
} from '@mui/material';

import { motion } from 'framer-motion';

import {
  Link as RouterLink,
} from 'react-router-dom';

import {
  FiAward,
  FiCompass,
} from 'react-icons/fi';

import { toast } from 'react-toastify';

import CertificateCard from '../../components/student/CertificateCard';

import {
  downloadCertificatePdf,
  viewCertificatePdf,
} from '../../utils/certificatePdf';

/* =========================================================
   MOCK DATA
   ========================================================= */

const STUDENT_NAME =
  'Aditi Sharma';

const CERTIFICATES = [
  {
    id: 1,

    courseTitle:
      'Full Stack Web Development',

    mentor:
      'Rohan Mehta',

    issuedDate:
      '12 Jun 2025',

    certificateId:
      'PA-WD-2025-0412',
  },

  {
    id: 2,

    courseTitle:
      'Spoken English Mastery',

    mentor:
      'Kavya Reddy',

    issuedDate:
      '28 Mar 2025',

    certificateId:
      'PA-SE-2025-0187',
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
      bgcolor:
        '#FFFFFF',

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
            'rgba(245, 158, 11, 0.08)',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FiAward
          size={25}
          color="#D97706"
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

            color:
              '#0F172A',
          }}
        >
          No certificates yet
        </Typography>

        <Typography
          sx={{
            fontFamily:
              'Inter, sans-serif',

            fontSize:
              '0.85rem',

            color:
              '#64748B',

            maxWidth:
              390,

            lineHeight:
              1.55,
          }}
        >
          Complete a course to earn
          your certificate. Your
          achievements will appear
          here once you finish.
        </Typography>
      </Stack>

      <Button
        component={RouterLink}
        to="/student/courses"
        startIcon={
          <FiCompass
            size={16}
            aria-hidden="true"
          />
        }
        sx={{
          mt: 0.5,

          px: 2.5,
          py: 1.1,

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
        Go to My Courses
      </Button>
    </Stack>
  </Box>
);

/* =========================================================
   PAGE
   ========================================================= */

const Certificates = () => {
  const handleView = (
    certificate
  ) => {
    viewCertificatePdf({
      studentName:
        STUDENT_NAME,

      courseTitle:
        certificate.courseTitle,

      mentor:
        certificate.mentor,

      issuedDate:
        certificate.issuedDate,

      certificateId:
        certificate.certificateId,
    });
  };

  const handleDownload = (
    certificate
  ) => {
    downloadCertificatePdf({
      studentName:
        STUDENT_NAME,

      courseTitle:
        certificate.courseTitle,

      mentor:
        certificate.mentor,

      issuedDate:
        certificate.issuedDate,

      certificateId:
        certificate.certificateId,
    });

    toast.success(
      `Downloaded certificate for "${certificate.courseTitle}"`
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
          HEADER
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
          My Certificates
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
          {CERTIFICATES.length > 0
            ? `${CERTIFICATES.length} certificate${
                CERTIFICATES.length > 1
                  ? 's'
                  : ''
              } earned`
            : 'Certificates you earn will appear here'}
        </Typography>
      </Stack>

      {/* =================================================
          CERTIFICATES
      ================================================== */}

      {CERTIFICATES.length === 0 ? (
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
                'repeat(3, minmax(0, 1fr))',
            },

            gap: {
              xs: 2,
              sm: 2.5,
            },

            alignItems:
              'stretch',
          }}
        >
          {CERTIFICATES.map(
            (
              certificate,
              index
            ) => (
              <CertificateCard
                key={
                  certificate.id
                }
                {...certificate}
                index={index}
                onView={() =>
                  handleView(
                    certificate
                  )
                }
                onDownload={() =>
                  handleDownload(
                    certificate
                  )
                }
              />
            )
          )}
        </Box>
      )}
    </Stack>
  );
};

export default Certificates;