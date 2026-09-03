import { useNavigate } from 'react-router-dom';
import { Box, Stack, Button, TextField, MenuItem, FormControl, InputLabel, Select, OutlinedInput, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/common/PageHeader';

const CATEGORIES = ['Enrollment', 'Payments', 'Classes', 'Certificates', 'Materials', 'Courses', 'General'];
const STATUS_OPTIONS = ['Active', 'Inactive'];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
    '& fieldset': { borderColor: '#E2E8F0' }, '&:hover fieldset': { borderColor: '#CBD5E1' },
    '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: 1.5 },
  },
  '& .MuiInputLabel-root': { fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' },
};

const AddFAQ = ({ prefill = null, editMode = false }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: prefill ?? { question: '', answer: '', category: '', status: 'Active' },
  });

  const onSubmit = (data) => {
    console.log('FAQ payload:', data);
    toast.success(editMode ? 'FAQ updated!' : 'FAQ added!');
    navigate('/admin/faq');
  };

  return (
    <Box>
      <PageHeader
        title={editMode ? 'Edit FAQ' : 'Add FAQ'}
        subtitle={editMode ? 'Update this FAQ entry.' : 'Add a new frequently asked question.'}
        breadcrumbs={[{ label: 'Admin' }, { label: 'FAQ', to: '/admin/faq' }, { label: editMode ? 'Edit' : 'Add' }]}
      />

      <Box sx={{ maxWidth: 700 }}>
        <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3 }}>
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2.5 }}>FAQ Details</Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2.5}>
              <TextField label="Question *" fullWidth {...register('question', { required: 'Question is required' })} error={!!errors.question} helperText={errors.question?.message} sx={fieldSx} />
              <TextField label="Answer *" fullWidth multiline rows={5} {...register('answer', { required: 'Answer is required' })} error={!!errors.answer} helperText={errors.answer?.message} sx={fieldSx} />
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <Controller name="category" control={control} rules={{ required: 'Category is required' }} render={({ field }) => (
                    <FormControl fullWidth error={!!errors.category} sx={fieldSx}>
                      <InputLabel>Category *</InputLabel>
                      <Select {...field} label="Category *" input={<OutlinedInput label="Category *" />}>
                        {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </Select>
                    </FormControl>
                  )} />
                </div>
                <div className="col-12 col-sm-6">
                  <Controller name="status" control={control} render={({ field }) => (
                    <FormControl fullWidth sx={fieldSx}>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status" input={<OutlinedInput label="Status" />}>
                        {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                  )} />
                </div>
              </div>

              <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                <Button variant="outlined" onClick={() => navigate('/admin/faq')}
                  sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B' }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" startIcon={<FiSave size={15} />}
                  sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}>
                  {editMode ? 'Update FAQ' : 'Save FAQ'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default AddFAQ;
