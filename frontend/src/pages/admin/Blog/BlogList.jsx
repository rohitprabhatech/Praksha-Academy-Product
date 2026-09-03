import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Chip, Avatar } from '@mui/material';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/common/PageHeader';
import DataTable from '../../../components/admin/common/DataTable';
import AdminModal from '../../../components/admin/common/AdminModal';

const STATUS_COLORS = {
  Published: { bgcolor: 'rgba(34,197,94,0.1)', color: '#16A34A' },
  Draft:     { bgcolor: 'rgba(245,158,11,0.1)', color: '#D97706' },
};

const MOCK_BLOGS = [
  { id: 1, thumbnail: null, title: 'Top 10 React Patterns in 2025', category: 'Technology', author: 'Rohan Mehta', tags: ['React', 'JS'], status: 'Published', createdAt: '2025-07-15' },
  { id: 2, thumbnail: null, title: 'Getting Started with Cloud Computing', category: 'Cloud', author: 'Sneha Kapoor', tags: ['AWS', 'Cloud'], status: 'Draft', createdAt: '2025-07-20' },
  { id: 3, thumbnail: null, title: 'UI/UX Principles Every Developer Should Know', category: 'Design', author: 'Aarav Singh', tags: ['Design', 'UX'], status: 'Published', createdAt: '2025-08-01' },
  { id: 4, thumbnail: null, title: 'Machine Learning for Beginners', category: 'AI/ML', author: 'Priya Patel', tags: ['ML', 'Python'], status: 'Published', createdAt: '2025-08-05' },
  { id: 5, thumbnail: null, title: 'Full-Stack Development Roadmap', category: 'Development', author: 'Karan Sharma', tags: ['Fullstack', 'Career'], status: 'Draft', createdAt: '2025-08-10' },
];

const BlogList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(MOCK_BLOGS);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = () => {
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast.success('Blog post deleted successfully.');
    setDeleteTarget(null);
  };

  const columns = [
    {
      id: 'title',
      label: 'Title',
      minWidth: 200,
      render: (val, row) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            variant="rounded"
            sx={{ width: 40, height: 40, bgcolor: 'rgba(37,99,235,0.08)', borderRadius: '8px', fontSize: '0.7rem', color: '#2563EB', fontWeight: 700 }}
          >
            {val.charAt(0)}
          </Avatar>
          <Box>
            <Box sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>{val}</Box>
            <Box sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#94A3B8' }}>{row.createdAt}</Box>
          </Box>
        </Stack>
      ),
    },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'author', label: 'Author', minWidth: 130 },
    {
      id: 'tags',
      label: 'Tags',
      minWidth: 140,
      render: (val) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
          {val.map((t) => (
            <Chip key={t} label={t} size="small" sx={{ fontSize: '0.7rem', height: 22, bgcolor: '#F1F5F9', color: '#475569', fontFamily: 'Inter, sans-serif' }} />
          ))}
        </Stack>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (val) => (
        <Chip
          label={val}
          size="small"
          sx={{
            ...(STATUS_COLORS[val] ?? {}),
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 24,
          }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 130,
      render: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Button size="small" variant="text" onClick={() => navigate(`/admin/blog/${row.id}`)}
            sx={{ minWidth: 32, p: 0.75, color: '#64748B', '&:hover': { color: '#2563EB', bgcolor: 'rgba(37,99,235,0.06)' }, borderRadius: '8px' }}>
            <FiEye size={15} />
          </Button>
          <Button size="small" variant="text" onClick={() => navigate(`/admin/blog/${row.id}/edit`)}
            sx={{ minWidth: 32, p: 0.75, color: '#64748B', '&:hover': { color: '#F59E0B', bgcolor: 'rgba(245,158,11,0.06)' }, borderRadius: '8px' }}>
            <FiEdit2 size={15} />
          </Button>
          <Button size="small" variant="text" onClick={() => setDeleteTarget(row)}
            sx={{ minWidth: 32, p: 0.75, color: '#64748B', '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.06)' }, borderRadius: '8px' }}>
            <FiTrash2 size={15} />
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Blog Posts"
        subtitle="Manage all blog articles published on the website."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Blog' }]}
        action={
          <Button
            variant="contained"
            startIcon={<FiPlus size={16} />}
            onClick={() => navigate('/admin/blog/create')}
            sx={{
              bgcolor: '#2563EB',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              borderRadius: '10px',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
            }}
          >
            New Post
          </Button>
        }
      />
      <DataTable columns={columns} rows={rows} searchKey="title" emptyText="No blog posts found." />

      <AdminModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </Box>
  );
};

export default BlogList;
