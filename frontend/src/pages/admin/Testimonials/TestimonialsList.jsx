import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Button, Chip, Avatar, Rating } from '@mui/material';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/common/PageHeader';
import DataTable from '../../../components/admin/common/DataTable';
import AdminModal from '../../../components/admin/common/AdminModal';

const MOCK_TESTIMONIALS = [
  { id: 1, name: 'Aditi Sharma', role: 'React Developer', course: 'React & Modern JS', rating: 5, status: 'Published', content: 'Amazing course! Really helped me land my first job.' },
  { id: 2, name: 'Rohan Mehta', role: 'Cloud Engineer', course: 'Cloud Computing', rating: 4, status: 'Published', content: 'Very detailed and well-structured content.' },
  { id: 3, name: 'Priya Patel', role: 'Data Scientist', course: 'ML Fundamentals', rating: 5, status: 'Draft', content: 'The instructors are incredibly knowledgeable.' },
  { id: 4, name: 'Karan Singh', role: 'UI/UX Designer', course: 'UI/UX Principles', rating: 4, status: 'Published', content: 'Practical projects made learning much easier.' },
  { id: 5, name: 'Sneha Kapoor', role: 'Full Stack Dev', course: 'Full-Stack Roadmap', rating: 5, status: 'Published', content: 'Best investment I have made in my career.' },
];

const getInitials = (name = '') => name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
const AVATAR_COLORS = ['#2563EB', '#7C3AED', '#16A34A', '#D97706', '#DC2626'];

const TestimonialsList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(MOCK_TESTIMONIALS);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = () => {
    setRows((p) => p.filter((r) => r.id !== deleteTarget.id));
    toast.success('Testimonial deleted.');
    setDeleteTarget(null);
  };

  const columns = [
    {
      id: 'name',
      label: 'Reviewer',
      minWidth: 180,
      render: (val, row) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: AVATAR_COLORS[row.id % 5], fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
            {getInitials(val)}
          </Avatar>
          <Box>
            <Box sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>{val}</Box>
            <Box sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#94A3B8' }}>{row.role}</Box>
          </Box>
        </Stack>
      ),
    },
    { id: 'course', label: 'Course', minWidth: 160 },
    {
      id: 'rating',
      label: 'Rating',
      minWidth: 130,
      render: (val) => <Rating value={val} readOnly size="small" sx={{ color: '#F59E0B', '& .MuiRating-iconEmpty': { color: '#E2E8F0' } }} />,
    },
    {
      id: 'content',
      label: 'Review',
      minWidth: 220,
      render: (val) => (
        <Box sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#64748B', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {val}
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (val) => (
        <Chip label={val} size="small" sx={{
          bgcolor: val === 'Published' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
          color: val === 'Published' ? '#16A34A' : '#D97706',
          fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', height: 24,
        }} />
      ),
    },
    {
      id: 'actions', label: 'Actions', align: 'right', minWidth: 100,
      render: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Button size="small" variant="text" onClick={() => navigate(`/admin/testimonials/${row.id}/edit`)}
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
        title="Testimonials"
        subtitle="Manage student reviews and testimonials displayed on the website."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Testimonials' }]}
        action={
          <Button variant="contained" startIcon={<FiPlus size={16} />} onClick={() => navigate('/admin/testimonials/add')}
            sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}>
            Add Testimonial
          </Button>
        }
      />
      <DataTable columns={columns} rows={rows} searchKey="name" emptyText="No testimonials found." />
      <AdminModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Testimonial" message={`Delete testimonial from "${deleteTarget?.name}"? This action cannot be undone.`} confirmLabel="Delete" variant="danger" />
    </Box>
  );
};

export default TestimonialsList;
