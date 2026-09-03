import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Chip, Button, Divider, Avatar } from '@mui/material';
import { FiEdit2, FiArrowLeft, FiCalendar, FiUser, FiTag, FiFolder } from 'react-icons/fi';
import PageHeader from '../../../components/admin/common/PageHeader';

const MOCK_BLOG = {
  id: 1,
  title: 'Top 10 React Patterns in 2025',
  category: 'Technology',
  author: 'Rohan Mehta',
  thumbnail: null,
  content: `React continues to evolve rapidly. In 2025, patterns like server components, concurrent rendering, and fine-grained subscriptions are shaping the way we build UIs.

## 1. Server Components
Server components allow rendering on the server without shipping JS to the client, dramatically reducing bundle sizes.

## 2. Concurrent Rendering
Using React 18's concurrent features like Suspense and startTransition enables smoother user experiences by deferring non-critical updates.

## 3. Custom Hooks for Business Logic
Separating business logic into custom hooks keeps components lean and testable.

## 4. Compound Components
Compound components share implicit state, making APIs more flexible and expressive.

## 5. Render Props & Higher-Order Components
Still relevant for cross-cutting concerns like analytics and feature flags.`,
  tags: ['React', 'JS', 'Frontend', 'Patterns'],
  seoTitle: 'Top 10 React Patterns 2025 | Praksha Academy',
  seoDescription: 'Explore the most important React design patterns every developer should know in 2025.',
  status: 'Published',
  createdAt: '2025-07-15',
};

const MetaRow = ({ icon: Icon, label, value }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={13} color="#2563EB" />
    </Box>
    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>
      <strong style={{ color: '#1E293B' }}>{label}:</strong> {value}
    </Typography>
  </Stack>
);

const BlogDetails = () => {
  const navigate = useNavigate();
  const blog = MOCK_BLOG;

  return (
    <Box>
      <PageHeader
        title="Blog Details"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Blog', to: '/admin/blog' }, { label: blog.title }]}
        action={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<FiArrowLeft size={15} />}
              onClick={() => navigate('/admin/blog')}
              sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B', '&:hover': { borderColor: '#CBD5E1' } }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<FiEdit2 size={15} />}
              onClick={() => navigate(`/admin/blog/${blog.id}/edit`)}
              sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}
            >
              Edit Post
            </Button>
          </Stack>
        }
      />

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Thumbnail placeholder */}
            <Box sx={{ height: 220, bgcolor: 'rgba(37,99,235,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Avatar variant="rounded" sx={{ width: 64, height: 64, bgcolor: 'rgba(37,99,235,0.12)', borderRadius: '16px', fontSize: '1.5rem', color: '#2563EB', fontWeight: 700 }}>
                {blog.title.charAt(0)}
              </Avatar>
            </Box>

            <Box sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <Chip label={blog.category} size="small" sx={{ bgcolor: 'rgba(37,99,235,0.08)', color: '#2563EB', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem' }} />
                <Chip
                  label={blog.status}
                  size="small"
                  sx={{
                    bgcolor: blog.status === 'Published' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                    color: blog.status === 'Published' ? '#16A34A' : '#D97706',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                />
              </Stack>

              <Typography component="h2" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.375rem', color: '#1E293B', mb: 1 }}>
                {blog.title}
              </Typography>

              <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9375rem',
                  color: '#334155',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line',
                }}
              >
                {blog.content}
              </Typography>
            </Box>
          </Box>
        </div>

        <div className="col-12 col-lg-4">
          <Stack spacing={3}>
            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 2.5 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1E293B', mb: 2 }}>
                Post Info
              </Typography>
              <Stack spacing={1.5}>
                <MetaRow icon={FiUser} label="Author" value={blog.author} />
                <MetaRow icon={FiFolder} label="Category" value={blog.category} />
                <MetaRow icon={FiCalendar} label="Published" value={blog.createdAt} />
              </Stack>
            </Box>

            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 2.5 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1E293B', mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <FiTag size={14} /> <span>Tags</span>
                </Stack>
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                {blog.tags.map((t) => (
                  <Chip key={t} label={t} size="small"
                    sx={{ bgcolor: '#F1F5F9', color: '#475569', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 500 }}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 2.5 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1E293B', mb: 1.5 }}>
                SEO Preview
              </Typography>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#2563EB', fontWeight: 600, mb: 0.5 }}>
                {blog.seoTitle}
              </Typography>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#64748B', lineHeight: 1.6 }}>
                {blog.seoDescription}
              </Typography>
            </Box>
          </Stack>
        </div>
      </div>
    </Box>
  );
};

export default BlogDetails;
