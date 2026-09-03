import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Button, Chip, Typography, Avatar } from '@mui/material';
import { FiEye, FiMail } from 'react-icons/fi';
import PageHeader from '../../../components/admin/common/PageHeader';
import DataTable from '../../../components/admin/common/DataTable';

const STATUS_COLORS = {
  New:     { bgcolor: 'rgba(37,99,235,0.1)',  color: '#2563EB' },
  Read:    { bgcolor: 'rgba(100,116,139,0.1)', color: '#64748B' },
  Replied: { bgcolor: 'rgba(34,197,94,0.1)',  color: '#16A34A' },
};

const MOCK_MESSAGES = [
  { id: 1, name: 'Ananya Rao', email: 'ananya@email.com', subject: 'Inquiry about Data Science course', date: '2025-08-13', status: 'New', message: 'Hello, I would like to know more about the Data Science course duration and prerequisites. Could you please provide more details?' },
  { id: 2, name: 'Dev Patel', email: 'dev@email.com', subject: 'Payment issue with enrollment', date: '2025-08-12', status: 'Replied', message: 'I tried enrolling in the React course but the payment failed. Please help.' },
  { id: 3, name: 'Meera Iyer', email: 'meera@email.com', subject: 'Certificate request', date: '2025-08-11', status: 'Read', message: 'I completed the Python course last month but have not received my certificate yet.' },
  { id: 4, name: 'Arjun Nair', email: 'arjun@email.com', subject: 'Scholarship information', date: '2025-08-10', status: 'New', message: 'Are there any scholarship programs available for students from lower income backgrounds?' },
  { id: 5, name: 'Kavya Reddy', email: 'kavya@email.com', subject: 'Live class rescheduling', date: '2025-08-09', status: 'Replied', message: 'Can the Friday live class be rescheduled? I have a conflict at that time.' },
];

const getInitials = (name = '') => name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
const AVATAR_COLORS = ['#2563EB', '#7C3AED', '#16A34A', '#D97706', '#DC2626'];

const ContactMessagesList = () => {
  const navigate = useNavigate();
  const newCount = MOCK_MESSAGES.filter(m => m.status === 'New').length;

  const columns = [
    {
      id: 'name',
      label: 'Sender',
      minWidth: 180,
      render: (val, row) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: AVATAR_COLORS[row.id % 5], fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
            {getInitials(val)}
          </Avatar>
          <Stack>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>{val}</Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#94A3B8' }}>{row.email}</Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      id: 'subject', label: 'Subject', minWidth: 220,
      render: (val) => (
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: '#1E293B', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {val}
        </Typography>
      ),
    },
    { id: 'date', label: 'Date', minWidth: 110 },
    {
      id: 'status', label: 'Status', minWidth: 100,
      render: (val) => (
        <Chip label={val} size="small" sx={{ ...(STATUS_COLORS[val] ?? {}), fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', height: 24 }} />
      ),
    },
    {
      id: 'actions', label: 'Actions', align: 'right', minWidth: 80,
      render: (_, row) => (
        <Button size="small" variant="text" onClick={() => navigate(`/admin/contact-messages/${row.id}`)}
          sx={{ minWidth: 32, p: 0.75, color: '#64748B', '&:hover': { color: '#2563EB', bgcolor: 'rgba(37,99,235,0.06)' }, borderRadius: '8px' }}>
          <FiEye size={15} />
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Contact Messages"
        subtitle={`${newCount} new message${newCount !== 1 ? 's' : ''} awaiting response.`}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Contact Messages' }]}
      />

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Messages', value: MOCK_MESSAGES.length, color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
          { label: 'New', value: MOCK_MESSAGES.filter(m => m.status === 'New').length, color: '#DC2626', bg: 'rgba(239,68,68,0.08)' },
          { label: 'Replied', value: MOCK_MESSAGES.filter(m => m.status === 'Replied').length, color: '#16A34A', bg: 'rgba(34,197,94,0.08)' },
        ].map((s) => (
          <div key={s.label} className="col-12 col-sm-4">
            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiMail size={18} color={s.color} />
              </Box>
              <Stack>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#1E293B', lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#64748B' }}>{s.label}</Typography>
              </Stack>
            </Box>
          </div>
        ))}
      </div>

      <DataTable columns={columns} rows={MOCK_MESSAGES} searchKey="subject" emptyText="No messages found." />
    </Box>
  );
};

export default ContactMessagesList;
