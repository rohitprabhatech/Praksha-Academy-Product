import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Button, Chip, Typography } from '@mui/material';
import { FiPlus, FiTrash2, FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import PageHeader from '../../../components/admin/common/PageHeader';
import DataTable from '../../../components/admin/common/DataTable';
import AdminModal from '../../../components/admin/common/AdminModal';

const TYPE_COLORS = {
  Info:    { bgcolor: 'rgba(37,99,235,0.1)',   color: '#2563EB' },
  Warning: { bgcolor: 'rgba(245,158,11,0.1)',  color: '#D97706' },
  Success: { bgcolor: 'rgba(34,197,94,0.1)',   color: '#16A34A' },
  Alert:   { bgcolor: 'rgba(239,68,68,0.1)',   color: '#DC2626' },
};

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'New Course Available: Python for Beginners', type: 'Info', audience: 'All Users', scheduled: '2025-08-10', status: 'Sent' },
  { id: 2, title: 'System Maintenance Tonight', type: 'Warning', audience: 'All Users', scheduled: '2025-08-12', status: 'Sent' },
  { id: 3, title: 'Congratulations to Batch 2025 Graduates!', type: 'Success', audience: 'Students', scheduled: '2025-08-14', status: 'Scheduled' },
  { id: 4, title: 'Payment Gateway Downtime', type: 'Alert', audience: 'All Users', scheduled: '2025-08-15', status: 'Draft' },
  { id: 5, title: 'New Feature: Live Classes Now Available', type: 'Info', audience: 'Students', scheduled: '2025-08-18', status: 'Scheduled' },
];

const STATUS_COLORS = {
  Sent:      { bgcolor: 'rgba(34,197,94,0.1)',  color: '#16A34A' },
  Scheduled: { bgcolor: 'rgba(37,99,235,0.1)',  color: '#2563EB' },
  Draft:     { bgcolor: 'rgba(100,116,139,0.1)',color: '#64748B' },
};

const NotificationList = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(MOCK_NOTIFICATIONS);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = () => {
    setRows((p) => p.filter((r) => r.id !== deleteTarget.id));
    toast.success('Notification deleted.');
    setDeleteTarget(null);
  };

  const sentCount = rows.filter((r) => r.status === 'Sent').length;
  const scheduledCount = rows.filter((r) => r.status === 'Scheduled').length;

  const columns = [
    {
      id: 'title',
      label: 'Title',
      minWidth: 240,
      render: (val) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FiBell size={14} color="#2563EB" />
          </Box>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#1E293B' }}>{val}</Typography>
        </Stack>
      ),
    },
    {
      id: 'type',
      label: 'Type',
      minWidth: 100,
      render: (val) => (
        <Chip label={val} size="small" sx={{ ...(TYPE_COLORS[val] ?? {}), fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', height: 24 }} />
      ),
    },
    { id: 'audience', label: 'Audience', minWidth: 120 },
    { id: 'scheduled', label: 'Date', minWidth: 110 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (val) => (
        <Chip label={val} size="small" sx={{ ...(STATUS_COLORS[val] ?? {}), fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', height: 24 }} />
      ),
    },
    {
      id: 'actions', label: 'Actions', align: 'right', minWidth: 80,
      render: (_, row) => (
        <Button size="small" variant="text" onClick={() => setDeleteTarget(row)}
          sx={{ minWidth: 32, p: 0.75, color: '#64748B', '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.06)' }, borderRadius: '8px' }}>
          <FiTrash2 size={15} />
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Notifications"
        subtitle="Send and manage notifications to users."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Notifications' }]}
        action={
          <Button variant="contained" startIcon={<FiPlus size={16} />} onClick={() => navigate('/admin/notifications/create')}
            sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}>
            New Notification
          </Button>
        }
      />

      {/* Quick stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total', value: rows.length, color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
          { label: 'Sent', value: sentCount, color: '#16A34A', bg: 'rgba(34,197,94,0.08)' },
          { label: 'Scheduled', value: scheduledCount, color: '#D97706', bg: 'rgba(245,158,11,0.08)' },
        ].map((s, i) => (
          <div key={s.label} className="col-12 col-sm-4">
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', p: 2, display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FiBell size={18} color={s.color} />
              </Box>
              <Stack>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#1E293B', lineHeight: 1 }}>{s.value}</Typography>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#64748B' }}>{s.label}</Typography>
              </Stack>
            </Box>
          </div>
        ))}
      </div>

      <DataTable columns={columns} rows={rows} searchKey="title" emptyText="No notifications found." />
      <AdminModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Notification" message={`Delete "${deleteTarget?.title}"?`} confirmLabel="Delete" variant="danger" />
    </Box>
  );
};

export default NotificationList;
