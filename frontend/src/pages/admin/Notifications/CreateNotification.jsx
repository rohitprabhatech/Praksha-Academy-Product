import { useNavigate } from 'react-router-dom';
import { Box, Stack, Button, TextField, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/common/PageHeader';

const TYPES = ['Info', 'Warning', 'Success', 'Alert'];
const AUDIENCES = ['All Users', 'Students', 'Teachers', 'Specific User'];
const STATUS_OPTIONS = ['Draft', 'Scheduled', 'Send Now'];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
    '& fieldset': { borderColor: '#E2E8F0' }, '&:hover fieldset': { borderColor: '#CBD5E1' },
    '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: 1.5 },
  },
  '& .MuiInputLabel-root': { fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' },
};

const CreateNotification = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: { title: '', message: '', type: 'Info', audience: 'All Users', scheduledDate: '', status: 'Draft' },
  });

  const onSubmit = (data) => {
    console.log('Notification payload:', data);
    const isImmediate = data.status === 'Send Now';
    toast.success(isImmediate ? 'Notification sent!' : 'Notification saved!');
    navigate('/admin/notifications');
  };

  return (
    <Box>
      <PageHeader
        title="Create Notification"
        subtitle="Compose and send or schedule a notification for users."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Notifications', to: '/admin/notifications' }, { label: 'Create' }]}
      />

      <Box sx={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2.5 }}>Notification Content</Typography>
              <Stack spacing={2.5}>
                <TextField label="Title *" fullWidth {...register('title', { required: 'Title is required' })} error={!!errors.title} helperText={errors.title?.message} sx={fieldSx} />
                <TextField label="Message *" fullWidth multiline rows={4}
                  {...register('message', { required: 'Message is required' })} error={!!errors.message} helperText={errors.message?.message} sx={fieldSx} />
              </Stack>
            </Box>

            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2.5 }}>Delivery Settings</Typography>
              <Stack spacing={2.5}>
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <Controller name="type" control={control} render={({ field }) => (
                      <FormControl fullWidth sx={fieldSx}>
                        <InputLabel>Type</InputLabel>
                        <Select {...field} label="Type" input={<OutlinedInput label="Type" />}>
                          {TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                        </Select>
                      </FormControl>
                    )} />
                  </div>
                  <div className="col-12 col-sm-6">
                    <Controller name="audience" control={control} render={({ field }) => (
                      <FormControl fullWidth sx={fieldSx}>
                        <InputLabel>Audience</InputLabel>
                        <Select {...field} label="Audience" input={<OutlinedInput label="Audience" />}>
                          {AUDIENCES.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                        </Select>
                      </FormControl>
                    )} />
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <TextField label="Schedule Date & Time" fullWidth type="datetime-local" InputLabelProps={{ shrink: true }}
                      {...register('scheduledDate')} sx={fieldSx} />
                  </div>
                  <div className="col-12 col-sm-6">
                    <Controller name="status" control={control} render={({ field }) => (
                      <FormControl fullWidth sx={fieldSx}>
                        <InputLabel>Action</InputLabel>
                        <Select {...field} label="Action" input={<OutlinedInput label="Action" />}>
                          {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </Select>
                      </FormControl>
                    )} />
                  </div>
                </div>
              </Stack>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => navigate('/admin/notifications')}
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" startIcon={<FiSend size={15} />}
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}>
                Save Notification
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default CreateNotification;
