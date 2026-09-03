import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Button, Chip, Avatar, TextField, Divider } from '@mui/material';
import { FiArrowLeft, FiSend, FiMail, FiUser, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/common/PageHeader';

const MOCK_MESSAGE = {
  id: 1,
  name: 'Ananya Rao',
  email: 'ananya@email.com',
  subject: 'Inquiry about Data Science course',
  date: '2025-08-13',
  status: 'New',
  message: `Hello,

I would like to know more about the Data Science course — specifically about the duration and prerequisites.

Could you please provide more details about:
1. Total course duration
2. Required prior knowledge (Python, statistics, etc.)
3. Whether there are live sessions or only recorded videos
4. Certificate upon completion

Looking forward to your response.

Regards,
Ananya Rao`,
};

const STATUS_COLORS = {
  New:     { bgcolor: 'rgba(37,99,235,0.1)',   color: '#2563EB' },
  Read:    { bgcolor: 'rgba(100,116,139,0.1)', color: '#64748B' },
  Replied: { bgcolor: 'rgba(34,197,94,0.1)',   color: '#16A34A' },
};

const MetaItem = ({ icon: Icon, label, value }) => (
  <Stack direction="row" alignItems="center" spacing={1}>
    <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={13} color="#2563EB" />
    </Box>
    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#64748B' }}>
      <strong style={{ color: '#1E293B' }}>{label}:</strong> {value}
    </Typography>
  </Stack>
);

const MessageDetails = () => {
  const navigate = useNavigate();
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState(MOCK_MESSAGE.status);

  const message = MOCK_MESSAGE;

  const handleReply = () => {
    if (!reply.trim()) { toast.error('Reply cannot be empty.'); return; }
    console.log('Sending reply:', reply);
    setStatus('Replied');
    setReply('');
    toast.success('Reply sent successfully!');
  };

  const handleMarkRead = () => {
    setStatus('Read');
    toast.info('Message marked as read.');
  };

  return (
    <Box>
      <PageHeader
        title="Message Details"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Contact Messages', to: '/admin/contact-messages' }, { label: message.subject }]}
        action={
          <Button variant="outlined" startIcon={<FiArrowLeft size={15} />} onClick={() => navigate('/admin/contact-messages')}
            sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B', '&:hover': { borderColor: '#CBD5E1' } }}>
            Back
          </Button>
        }
      />

      <div className="row g-4">
        {/* Message content */}
        <div className="col-12 col-lg-8">
          <Stack spacing={3}>
            {/* Message card */}
            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden' }}>
              <Box sx={{ px: 3, py: 2.5, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={1.5}>
                  <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#1E293B' }}>
                    {message.subject}
                  </Typography>
                  <Chip
                    label={status}
                    size="small"
                    sx={{ ...(STATUS_COLORS[status] ?? {}), fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', height: 24 }}
                  />
                </Stack>
              </Box>

              <Box sx={{ p: 3 }}>
                <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ width: 44, height: 44, bgcolor: '#2563EB', fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}>
                    {message.name.charAt(0)}
                  </Avatar>
                  <Stack spacing={0.25}>
                    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B' }}>{message.name}</Typography>
                    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#94A3B8' }}>{message.email}</Typography>
                  </Stack>
                </Stack>

                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9375rem',
                    color: '#334155',
                    lineHeight: 1.85,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {message.message}
                </Typography>
              </Box>
            </Box>

            {/* Reply box */}
            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2 }}>Reply</Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                placeholder="Type your reply here…"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                    '& fieldset': { borderColor: '#E2E8F0' }, '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: 1.5 },
                  },
                }}
              />
              <Button variant="contained" startIcon={<FiSend size={15} />} onClick={handleReply}
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}>
                Send Reply
              </Button>
            </Box>
          </Stack>
        </div>

        {/* Sidebar */}
        <div className="col-12 col-lg-4">
          <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 2.5 }}>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1E293B', mb: 2 }}>Message Info</Typography>
            <Stack spacing={1.5}>
              <MetaItem icon={FiUser} label="Sender" value={message.name} />
              <MetaItem icon={FiMail} label="Email" value={message.email} />
              <MetaItem icon={FiCalendar} label="Received" value={message.date} />
            </Stack>

            <Divider sx={{ my: 2.5, borderColor: '#F1F5F9' }} />

            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1E293B', mb: 1.5 }}>Actions</Typography>
            <Stack spacing={1.5}>
              {status !== 'Read' && (
                <Button variant="outlined" fullWidth onClick={handleMarkRead}
                  sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B', '&:hover': { borderColor: '#CBD5E1' } }}>
                  Mark as Read
                </Button>
              )}
              <Button variant="outlined" fullWidth color="error" onClick={() => navigate('/admin/contact-messages')}
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', '&:hover': { bgcolor: 'rgba(239,68,68,0.04)' } }}>
                Archive Message
              </Button>
            </Stack>
          </Box>
        </div>
      </div>
    </Box>
  );
};

export default MessageDetails;
