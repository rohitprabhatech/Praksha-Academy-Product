import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Stack, Button, TextField, MenuItem, Chip,
  Typography, FormControl, InputLabel, Select, OutlinedInput,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { FiUploadCloud, FiX, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/common/PageHeader';

const CATEGORIES = ['Technology', 'Cloud', 'Design', 'AI/ML', 'Development', 'Career', 'Data Science'];
const STATUS_OPTIONS = ['Draft', 'Published'];

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

const SectionCard = ({ title, children }) => (
  <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', p: 3 }}>
    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1E293B', mb: 2.5 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const CreateBlog = ({ prefill = null, editMode = false }) => {
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(prefill?.thumbnail ?? null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(prefill?.tags ?? []);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: prefill ?? {
      title: '', category: '', author: '', content: '',
      seoTitle: '', seoDescription: '', status: 'Draft',
    },
  });

  const handleThumbChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setThumbnail(URL.createObjectURL(file));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const onSubmit = (data) => {
    const payload = { ...data, tags, thumbnail };
    console.log('Blog payload:', payload);
    toast.success(editMode ? 'Blog post updated!' : 'Blog post created!');
    navigate('/admin/blog');
  };

  return (
    <Box>
      <PageHeader
        title={editMode ? 'Edit Blog Post' : 'Create Blog Post'}
        subtitle={editMode ? 'Update the blog post details below.' : 'Fill in the details to publish a new blog post.'}
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Blog', to: '/admin/blog' },
          { label: editMode ? 'Edit' : 'Create' },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="row g-4">
          {/* Left column */}
          <div className="col-12 col-lg-8">
            <Stack spacing={3}>
              <SectionCard title="Post Content">
                <Stack spacing={2.5}>
                  <TextField
                    label="Title *"
                    fullWidth
                    {...register('title', { required: 'Title is required' })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    sx={fieldSx}
                  />
                  <TextField
                    label="Content *"
                    fullWidth
                    multiline
                    rows={10}
                    {...register('content', { required: 'Content is required' })}
                    error={!!errors.content}
                    helperText={errors.content?.message ?? 'Tip: A rich text editor (e.g. React Quill) can be integrated here.'}
                    sx={fieldSx}
                  />
                </Stack>
              </SectionCard>

              <SectionCard title="SEO Settings">
                <Stack spacing={2.5}>
                  <TextField label="SEO Title" fullWidth {...register('seoTitle')} sx={fieldSx} />
                  <TextField label="SEO Description" fullWidth multiline rows={3} {...register('seoDescription')} sx={fieldSx} />
                </Stack>
              </SectionCard>
            </Stack>
          </div>

          {/* Right column */}
          <div className="col-12 col-lg-4">
            <Stack spacing={3}>
              <SectionCard title="Publish Settings">
                <Stack spacing={2.5}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={fieldSx}>
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status" input={<OutlinedInput label="Status" />}>
                          {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Category is required' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.category} sx={fieldSx}>
                        <InputLabel>Category *</InputLabel>
                        <Select {...field} label="Category *" input={<OutlinedInput label="Category *" />}>
                          {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <TextField label="Author *" fullWidth {...register('author', { required: 'Author is required' })} error={!!errors.author} helperText={errors.author?.message} sx={fieldSx} />
                </Stack>
              </SectionCard>

              <SectionCard title="Thumbnail">
                <Box
                  component="label"
                  htmlFor="thumbnail-upload"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    p: 3,
                    border: '2px dashed #E2E8F0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    bgcolor: '#F8FAFC',
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: '#2563EB' },
                    overflow: 'hidden',
                  }}
                >
                  {thumbnail ? (
                    <Box component="img" src={thumbnail} alt="Thumbnail preview" sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <>
                      <FiUploadCloud size={30} color="#94A3B8" />
                      <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#64748B', textAlign: 'center' }}>
                        Click to upload thumbnail<br />PNG, JPG up to 5 MB
                      </Typography>
                    </>
                  )}
                  <input id="thumbnail-upload" type="file" accept="image/*" hidden onChange={handleThumbChange} />
                </Box>
                {thumbnail && (
                  <Button size="small" onClick={() => setThumbnail(null)} sx={{ mt: 1, color: '#EF4444', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }}>
                    Remove
                  </Button>
                )}
              </SectionCard>

              <SectionCard title="Tags">
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="Add a tag…"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    sx={{ ...fieldSx, flex: 1 }}
                  />
                  <Button variant="outlined" size="small" onClick={addTag}
                    sx={{ borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B', fontFamily: 'Inter, sans-serif', '&:hover': { borderColor: '#2563EB', color: '#2563EB' } }}>
                    Add
                  </Button>
                </Stack>
                {tags.length > 0 && (
                  <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.5 }}>
                    {tags.map((t) => (
                      <Chip key={t} label={t} size="small" onDelete={() => removeTag(t)}
                        deleteIcon={<FiX size={12} />}
                        sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', bgcolor: 'rgba(37,99,235,0.08)', color: '#2563EB', fontWeight: 600 }}
                      />
                    ))}
                  </Stack>
                )}
              </SectionCard>
            </Stack>
          </div>
        </div>

        {/* Actions */}
        <Stack direction="row" spacing={2} sx={{ mt: 4, pt: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button variant="outlined" onClick={() => navigate('/admin/blog')}
            sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', borderColor: '#E2E8F0', color: '#64748B', '&:hover': { borderColor: '#CBD5E1' } }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" startIcon={<FiSave size={16} />}
            sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}>
            {editMode ? 'Update Post' : 'Publish Post'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default CreateBlog;
