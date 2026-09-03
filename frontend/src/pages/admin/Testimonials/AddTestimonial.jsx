import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Button, TextField, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Typography, Rating } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { FiUploadCloud, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/common/PageHeader';

const STATUS_OPTIONS = ['Published', 'Draft'];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
    '& fieldset': { borderColor: '#E2E8F0' }, '&:hover fieldset': { borderColor: '#CBD5E1' },
    '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: 1.5 },
  },
  '& .MuiInputLabel-root': { fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' },
};

const AddTestimonial = ({ prefill = null, editMode = false }) => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(prefill?.avatar ?? null);
  const [rating, setRating] = useState(prefill?.rating ?? 5);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: prefill ?? { name: '', role: '', course: '', content: '', status: 'Published' },
  });

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const onSubmit = (data) => {
    console.log('Testimonial payload:', { ...data, rating, avatar });
    toast.success(editMode ? 'Testimonial updated!' : 'Testimonial added!');
    navigate('/admin/testimonials');
  };

  return (
    <Box>
      <PageHeader
        title={editMode ? 'Edit Testimonial' : 'Add Testimonial'}
        subtitle={editMode ? 'Update the testimonial details below.' : 'Add a new student testimonial.'}
        breadcrumbs={[{ label: 'Admin' }, { label: 'Testimonials', to: '/admin/testimonials' }, { label: editMode ? 'Edit' : 'Add' }]}
      />

      <Box sx={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2.5 }}>Reviewer Information</Typography>
              <Stack spacing={2.5}>
                {/* Avatar upload */}
                <Stack direction="row" alignItems="center" spacing={2.5}>
                  <Box
                    component="label"
                    htmlFor="avatar-upload"
                    sx={{
                      width: 80, height: 80, borderRadius: '50%', bgcolor: '#F1F5F9', border: '2px dashed #E2E8F0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      overflow: 'hidden', flexShrink: 0, transition: 'border-color 0.2s', '&:hover': { borderColor: '#2563EB' },
                    }}
                  >
                    {avatar ? (
                      <Box component="img" src={avatar} alt="Avatar" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Stack alignItems="center" spacing={0.5}>
                        <FiUploadCloud size={20} color="#94A3B8" />
                        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', color: '#94A3B8', textAlign: 'center' }}>Photo</Typography>
                      </Stack>
                    )}
                    <input id="avatar-upload" type="file" accept="image/*" hidden onChange={handleAvatar} />
                  </Box>
                  <Stack spacing={2} sx={{ flex: 1 }}>
                    <TextField label="Full Name *" fullWidth {...register('name', { required: 'Name is required' })} error={!!errors.name} helperText={errors.name?.message} sx={fieldSx} />
                    <TextField label="Role / Job Title" fullWidth {...register('role')} sx={fieldSx} />
                  </Stack>
                </Stack>

                <TextField label="Course Name" fullWidth {...register('course')} sx={fieldSx} />

                {/* Rating */}
                <Box>
                  <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#64748B', fontWeight: 500, mb: 1 }}>Rating *</Typography>
                  <Rating
                    value={rating}
                    onChange={(_, newVal) => setRating(newVal)}
                    size="large"
                    sx={{ color: '#F59E0B', '& .MuiRating-iconEmpty': { color: '#E2E8F0' } }}
                  />
                </Box>

                <TextField label="Review Content *" fullWidth multiline rows={4}
                  {...register('content', { required: 'Content is required' })} error={!!errors.content} helperText={errors.content?.message} sx={fieldSx} />

                <Controller name="status" control={control} render={({ field }) => (
                  <FormControl fullWidth sx={fieldSx} size="small">
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status" input={<OutlinedInput label="Status" />}>
                      {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                  </FormControl>
                )} />
              </Stack>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => navigate('/admin/testimonials')}
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" startIcon={<FiSave size={15} />}
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}>
                {editMode ? 'Update Testimonial' : 'Save Testimonial'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default AddTestimonial;
