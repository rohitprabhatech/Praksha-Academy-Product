import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Button, Chip } from '@mui/material';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/common/PageHeader';
import DataTable from '../../../components/admin/common/DataTable';
import AdminModal from '../../../components/admin/common/AdminModal';

const MOCK_FAQS = [
  { id: 1, question: 'How do I enroll in a course?', category: 'Enrollment', status: 'Active' },
  { id: 2, question: 'What payment methods are accepted?', category: 'Payments', status: 'Active' },
  { id: 3, question: 'Can I get a refund if I change my mind?', category: 'Payments', status: 'Active' },
  { id: 4, question: 'How do live classes work?', category: 'Classes', status: 'Inactive' },
  { id: 5, question: 'Is a certificate provided after completion?', category: 'Certificates', status: 'Active' },
  { id: 6, question: 'Can I download course materials?', category: 'Materials', status: 'Active' },
  { id: 7, question: 'How long is each course?', category: 'Courses', status: 'Active' },
];

const FAQList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(MOCK_FAQS);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = () => {
    setRows((p) => p.filter((r) => r.id !== deleteTarget.id));
    toast.success('FAQ deleted.');
    setDeleteTarget(null);
  };

  const columns = [
    {
      id: 'question',
      label: 'Question',
      minWidth: 280,
      render: (val) => (
        <Box sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem', color: '#1E293B', maxWidth: 380, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {val}
        </Box>
      ),
    },
    { id: 'category', label: 'Category', minWidth: 120 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (val) => (
        <Chip label={val} size="small" sx={{
          bgcolor: val === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)',
          color: val === 'Active' ? '#16A34A' : '#64748B',
          fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', height: 24,
        }} />
      ),
    },
    {
      id: 'actions', label: 'Actions', align: 'right', minWidth: 100,
      render: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Button size="small" variant="text" onClick={() => navigate(`/admin/faq/${row.id}/edit`)}
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
        title="FAQs"
        subtitle="Manage frequently asked questions displayed on the website."
        breadcrumbs={[{ label: 'Admin' }, { label: 'FAQ' }]}
        action={
          <Button variant="contained" startIcon={<FiPlus size={16} />} onClick={() => navigate('/admin/faq/add')}
            sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}>
            Add FAQ
          </Button>
        }
      />
      <DataTable columns={columns} rows={rows} searchKey="question" emptyText="No FAQs found." />
      <AdminModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete FAQ" message={`Delete this FAQ entry permanently?`} confirmLabel="Delete" variant="danger" />
    </Box>
  );
};

export default FAQList;
