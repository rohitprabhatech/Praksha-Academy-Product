import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Button, Tabs, Tab, Chip, IconButton } from '@mui/material';
import { FiPlus, FiTrash2, FiImage, FiVideo, FiPlay } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../../components/admin/common/PageHeader';
import AdminModal from '../../../components/admin/common/AdminModal';

const MOCK_ITEMS = [
  { id: 1, type: 'image', title: 'Campus Tour 2025', url: null, tags: ['campus', 'tour'], date: '2025-07-10' },
  { id: 2, type: 'video', title: 'Introduction to React', url: 'https://www.youtube.com/embed/N3AkSS5hXMA', tags: ['react', 'course'], date: '2025-07-15' },
  { id: 3, type: 'image', title: 'Graduation Ceremony', url: null, tags: ['graduation', 'students'], date: '2025-07-20' },
  { id: 4, type: 'image', title: 'Workshop Day', url: null, tags: ['workshop'], date: '2025-07-25' },
  { id: 5, type: 'video', title: 'Python for Beginners', url: 'https://www.youtube.com/embed/rfscVS0vtbw', tags: ['python', 'course'], date: '2025-08-01' },
  { id: 6, type: 'image', title: 'Lab Sessions', url: null, tags: ['lab', 'practical'], date: '2025-08-05' },
];

const PLACEHOLDER_BG = ['rgba(37,99,235,0.08)', 'rgba(245,158,11,0.08)', 'rgba(34,197,94,0.08)', 'rgba(139,92,246,0.08)'];
const PLACEHOLDER_COLOR = ['#2563EB', '#D97706', '#16A34A', '#7C3AED'];

const GalleryItem = ({ item, idx, onDelete }) => {
  const bg = PLACEHOLDER_BG[idx % 4];
  const color = PLACEHOLDER_COLOR[idx % 4];

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '14px',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': { boxShadow: '0 12px 28px rgba(15,23,42,0.1)', transform: 'translateY(-3px)' },
        '&:hover .overlay': { opacity: 1 },
      }}
    >
      {/* Thumbnail area */}
      <Box sx={{ height: 160, bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {item.type === 'video' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiPlay size={18} color="#fff" />
            </Box>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color, fontWeight: 600 }}>Video</Typography>
          </Box>
        ) : (
          <FiImage size={38} color={color} opacity={0.5} />
        )}
        {/* Hover overlay */}
        <Box
          className="overlay"
          sx={{
            position: 'absolute', inset: 0, bgcolor: 'rgba(15,23,42,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0, transition: 'opacity 0.2s ease',
          }}
        >
          <IconButton onClick={() => onDelete(item)} sx={{ bgcolor: 'rgba(239,68,68,0.9)', color: '#fff', '&:hover': { bgcolor: '#EF4444' }, width: 36, height: 36 }}>
            <FiTrash2 size={15} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 1.75 }}>
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#1E293B', mb: 0.75, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.title}
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} alignItems="center">
          <Chip
            label={item.type === 'image' ? 'Image' : 'Video'}
            size="small"
            sx={{ bgcolor: item.type === 'image' ? 'rgba(37,99,235,0.08)' : 'rgba(139,92,246,0.08)', color: item.type === 'image' ? '#2563EB' : '#7C3AED', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.7rem', height: 20 }}
          />
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#94A3B8', ml: 'auto' }}>{item.date}</Typography>
        </Stack>
      </Box>
    </Box>
  );
};

const GalleryList = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [items, setItems] = useState(MOCK_ITEMS);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = tab === 0 ? items : tab === 1 ? items.filter(i => i.type === 'image') : items.filter(i => i.type === 'video');

  const handleDelete = () => {
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    toast.success('Item deleted from gallery.');
    setDeleteTarget(null);
  };

  return (
    <Box>
      <PageHeader
        title="Gallery"
        subtitle="Manage images and videos displayed on the website."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Gallery' }]}
        action={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<FiImage size={15} />}
              onClick={() => navigate('/admin/gallery/add-image')}
              sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', borderColor: '#2563EB', color: '#2563EB', '&:hover': { bgcolor: 'rgba(37,99,235,0.06)' } }}
            >
              Add Image
            </Button>
            <Button
              variant="contained"
              startIcon={<FiVideo size={15} />}
              onClick={() => navigate('/admin/gallery/add-video')}
              sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none', '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' } }}
            >
              Add Video
            </Button>
          </Stack>
        }
      />

      {/* Filter Tabs */}
      <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', mb: 3, overflow: 'hidden' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 2,
            '& .MuiTab-root': { fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', color: '#64748B', minHeight: 52 },
            '& .Mui-selected': { color: '#2563EB' },
            '& .MuiTabs-indicator': { bgcolor: '#2563EB', height: 3, borderRadius: '3px 3px 0 0' },
          }}
        >
          <Tab label={`All (${items.length})`} />
          <Tab label={`Images (${items.filter(i => i.type === 'image').length})`} />
          <Tab label={`Videos (${items.filter(i => i.type === 'video').length})`} />
        </Tabs>
      </Box>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FiImage size={40} color="#CBD5E1" />
          <Typography sx={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8', mt: 1.5 }}>No items in this category.</Typography>
          <Button variant="contained" startIcon={<FiPlus size={15} />} onClick={() => navigate('/admin/gallery/add-image')}
            sx={{ mt: 2, fontFamily: 'Inter, sans-serif', fontWeight: 600, borderRadius: '10px', bgcolor: '#2563EB', boxShadow: 'none' }}>
            Add First Item
          </Button>
        </Box>
      ) : (
        <div className="row g-3">
          {filtered.map((item, idx) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-xl-3">
              <GalleryItem item={item} idx={idx} onDelete={setDeleteTarget} />
            </div>
          ))}
        </div>
      )}

      <AdminModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove from Gallery"
        message={`Delete "${deleteTarget?.title}" permanently? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </Box>
  );
};

export default GalleryList;
