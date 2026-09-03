import { useNavigate } from 'react-router-dom';
import { Box, Stack, Button, TextField, Typography, Chip } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiLink, FiX, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/common/PageHeader';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
    '& fieldset': { borderColor: '#E2E8F0' }, '&:hover fieldset': { borderColor: '#CBD5E1' },
    '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: 1.5 },
  },
  '& .MuiInputLabel-root': { fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' },
};

const isYouTube = (url) => url.includes('youtube.com') || url.includes('youtu.be');
const toEmbed = (url) => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const AddVideo = () => {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { title: '', description: '', videoUrl: '' },
  });

  const watchedUrl = watch('videoUrl');

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((p) => [...p, t]);
    setTagInput('');
  };

  const onSubmit = (data) => {
    console.log('Video payload:', { ...data, tags });
    toast.success('Video added to gallery!');
    navigate('/admin/gallery');
  };

  return (
    <Box>
      <PageHeader
        title="Add Video"
        subtitle="Add a YouTube, Vimeo, or direct video link to the gallery."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Gallery', to: '/admin/gallery' }, { label: 'Add Video' }]}
      />

      <Box sx={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2 }}>Video Details</Typography>
              <Stack spacing={2.5}>
                <TextField label="Title *" fullWidth {...register('title', { required: 'Title is required' })} error={!!errors.title} helperText={errors.title?.message} sx={fieldSx} />
                <TextField label="Description" fullWidth multiline rows={3} {...register('description')} sx={fieldSx} />
                <TextField
                  label="Video URL *"
                  fullWidth
                  placeholder="https://www.youtube.com/watch?v=..."
                  {...register('videoUrl', { required: 'Video URL is required' })}
                  error={!!errors.videoUrl}
                  helperText={errors.videoUrl?.message ?? 'Supports YouTube, Vimeo, or direct .mp4 links.'}
                  InputProps={{ startAdornment: <FiLink size={16} color="#94A3B8" style={{ marginRight: 8 }} /> }}
                  sx={fieldSx}
                />
              </Stack>
            </Box>

            {/* Embed preview */}
            {watchedUrl && isYouTube(watchedUrl) && (
              <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3 }}>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2 }}>Preview</Typography>
                <Box
                  component="iframe"
                  src={toEmbed(watchedUrl)}
                  title="Video preview"
                  frameBorder="0"
                  allowFullScreen
                  sx={{ width: '100%', height: 200, borderRadius: '10px', border: 'none' }}
                />
              </Box>
            )}

            {/* Tags */}
            <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3 }}>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2 }}>Tags</Typography>
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
                    <Chip key={t} label={t} size="small" onDelete={() => setTags(p => p.filter(x => x !== t))} deleteIcon={<FiX size={12} />}
                      sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', bgcolor: 'rgba(139,92,246,0.08)', color: '#7C3AED', fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              )}
            </Box>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => navigate('/admin/gallery')}
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" startIcon={<FiSave size={15} />}
                sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}>
                Save Video
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default AddVideo;
