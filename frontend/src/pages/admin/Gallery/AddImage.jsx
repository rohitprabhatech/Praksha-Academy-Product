import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Button, TextField, Typography, Chip } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FiUploadCloud, FiX, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/common/PageHeader';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.9rem',
    '& fieldset': { borderColor: '#E2E8F0' },
    '&:hover fieldset': { borderColor: '#CBD5E1' },
    '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: 1.5 },
  },
  '& .MuiInputLabel-root': { fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' },
};

const AddImage = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { title: '', altText: '' },
  });

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((p) => [...p, t]);
    setTagInput('');
  };

  const onSubmit = (data) => {
    console.log('Image upload:', { ...data, tags, preview });
    toast.success('Image added to gallery!');
    navigate('/admin/gallery');
  };

  return (
    <Box>
      <PageHeader
        title="Add Image"
        subtitle="Upload a new image to the gallery."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Gallery', to: '/admin/gallery' }, { label: 'Add Image' }]}
      />

      <Box sx={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            {/* Upload area */}
            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2 }}>Upload Image</Typography>
              <Box
                component="label"
                htmlFor="image-upload"
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5,
                  p: 4, border: '2px dashed #E2E8F0', borderRadius: '12px', cursor: 'pointer', bgcolor: '#F8FAFC',
                  transition: 'border-color 0.2s', '&:hover': { borderColor: '#2563EB' }, overflow: 'hidden',
                }}
              >
                {preview ? (
                  <Box component="img" src={preview} alt="Preview" sx={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  <>
                    <Box sx={{ width: 56, height: 56, borderRadius: '14px', bgcolor: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiUploadCloud size={26} color="#2563EB" />
                    </Box>
                    <Stack spacing={0.25} alignItems="center">
                      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#1E293B' }}>Click to upload image</Typography>
                      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#94A3B8' }}>PNG, JPG, WEBP up to 10 MB</Typography>
                    </Stack>
                  </>
                )}
                <input id="image-upload" type="file" accept="image/*" hidden onChange={handleFile} />
              </Box>
              {preview && (
                <Button size="small" onClick={() => setPreview(null)} sx={{ mt: 1, color: '#EF4444', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }}>
                  Remove Image
                </Button>
              )}
            </Box>

            {/* Details */}
            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2 }}>Image Details</Typography>
              <Stack spacing={2.5}>
                <TextField label="Title *" fullWidth {...register('title', { required: 'Title is required' })} error={!!errors.title} helperText={errors.title?.message} sx={fieldSx} />
                <TextField label="Alt Text" fullWidth {...register('altText')} helperText="Describe the image for accessibility and SEO." sx={fieldSx} />
                <Box>
                  <Stack direction="row" spacing={1}>
                    <TextField size="small" placeholder="Add tag…" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} sx={{ ...fieldSx, flex: 1 }} />
                    <Button variant="outlined" size="small" onClick={addTag}
                      sx={{ borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B', fontFamily: 'Inter, sans-serif', '&:hover': { borderColor: '#2563EB', color: '#2563EB' } }}>
                      Add
                    </Button>
                  </Stack>
                  {tags.length > 0 && (
                    <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.5 }}>
                      {tags.map((t) => (
                        <Chip key={t} label={t} size="small" onDelete={() => setTags(prev => prev.filter(x => x !== t))} deleteIcon={<FiX size={12} />}
                          sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', bgcolor: 'rgba(37,99,235,0.08)', color: '#2563EB', fontWeight: 600 }}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => navigate('/admin/gallery')}
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" startIcon={<FiSave size={15} />}
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}>
                Save Image
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default AddImage;
