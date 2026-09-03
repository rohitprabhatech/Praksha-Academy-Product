import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import {
  FiBookOpen,
  FiEdit3,
  FiGlobe,
  FiImage,
  FiInfo,
  FiLayout,
  FiMail,
  FiNavigation,
} from 'react-icons/fi'
import { useWebsiteDraftEditor } from '../../../hooks/useWebsiteDraftEditor'

const LINKS = [
  {
    title: 'Branding',
    description: 'Logo, academy name, tagline, and primary colour.',
    to: '/admin/website/branding',
    icon: FiImage,
  },
  {
    title: 'Navigation',
    description: 'Menu labels and which public pages are visible.',
    to: '/admin/website/navigation',
    icon: FiNavigation,
  },
  {
    title: 'Home page',
    description: 'Hero text, highlights, and homepage section titles.',
    to: '/admin/website/home',
    icon: FiLayout,
  },
  {
    title: 'Courses page',
    description: 'Courses listing headline and supporting copy.',
    to: '/admin/website/courses',
    icon: FiBookOpen,
  },
  {
    title: 'Programs',
    description: 'Program cards shown on the public Programs page.',
    to: '/admin/website/programs',
    icon: FiEdit3,
  },
  {
    title: 'About',
    description: 'Story, beliefs, and differentiators.',
    to: '/admin/website/about',
    icon: FiInfo,
  },
  {
    title: 'Contact',
    description: 'Email, phone, address, hours, and social links.',
    to: '/admin/website/contact',
    icon: FiMail,
  },
  {
    title: 'Blog & media',
    description: 'Manage posts, gallery, FAQ, and testimonials.',
    to: '/admin/blog',
    icon: FiGlobe,
  },
]

function WebsiteOverview() {
  const { draft, loading } = useWebsiteDraftEditor()

  if (loading || !draft) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '1.4rem' }}>
          Website
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 0.5, maxWidth: 680 }}>
          Control the public site for this academy only. Each tenant has its own
          logo, copy, contact details, and pages. Save a draft, then publish when
          ready.
        </Typography>
      </Box>

      <Box
        sx={{
          p: 2.25,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography sx={{ fontWeight: 700 }}>
          {draft.branding.academyName}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
          {draft.branding.tagline}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: 1 }}>
          Last draft update:{' '}
          {draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : 'Not saved yet'}
          {' · '}
          Last publish:{' '}
          {draft.publishedAt
            ? new Date(draft.publishedAt).toLocaleString()
            : 'Not published yet'}
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 1.5, textTransform: 'none' }}
        >
          Open public site
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            lg: '1fr 1fr 1fr',
          },
        }}
      >
        {LINKS.map((item) => {
          const Icon = item.icon
          return (
            <Box
              key={item.to}
              component={RouterLink}
              to={item.to}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
                },
              }}
            >
              <Stack direction="row" spacing={1.25} alignItems="flex-start">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'action.hover',
                    color: 'primary.main',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={17} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 0.35 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    {item.description}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )
        })}
      </Box>
    </Stack>
  )
}

export default WebsiteOverview
