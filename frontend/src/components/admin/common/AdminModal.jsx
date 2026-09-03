import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

/**
 * AdminModal — reusable confirm/alert/delete dialog.
 *
 * Props:
 *  open       {boolean}
 *  onClose    {function}
 *  onConfirm  {function}
 *  title      {string}
 *  message    {string}
 *  confirmLabel {string}  default: 'Confirm'
 *  cancelLabel  {string}  default: 'Cancel'
 *  variant    {string}    'danger' | 'info' | 'warning'
 *  loading    {boolean}
 */
const AdminModal = ({
  open = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const colorMap = {
    danger:  { icon: '#EF4444', bg: 'rgba(239,68,68,0.08)',  btn: 'error' },
    warning: { icon: '#F59E0B', bg: 'rgba(245,158,11,0.08)', btn: 'warning' },
    info:    { icon: '#2563EB', bg: 'rgba(37,99,235,0.08)',  btn: 'primary' },
  };
  const { icon, bg, btn } = colorMap[variant] ?? colorMap.danger;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '18px',
          p: 0.5,
          boxShadow: '0 25px 50px rgba(15,23,42,0.15)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                bgcolor: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FiAlertTriangle size={18} color={icon} aria-hidden="true" />
            </Box>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                color: '#1E293B',
              }}
            >
              {title}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="Close dialog" sx={{ color: '#94A3B8' }}>
            <FiX size={18} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0.5, pb: 1.5 }}>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
            color: '#64748B',
            lineHeight: 1.65,
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            borderRadius: '10px',
            borderColor: '#E2E8F0',
            color: '#64748B',
            px: 2.5,
            '&:hover': { borderColor: '#CBD5E1', bgcolor: '#F8FAFC' },
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          color={btn}
          onClick={onConfirm}
          disabled={loading}
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            borderRadius: '10px',
            px: 2.5,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          }}
        >
          {loading ? 'Processing…' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminModal;
