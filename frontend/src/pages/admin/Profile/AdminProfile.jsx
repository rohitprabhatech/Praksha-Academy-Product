import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  FiCheck,
  FiEdit3,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiShield,
  FiUser,
  FiX,
} from 'react-icons/fi'
import AdminSurface from '../../../components/admin/common/AdminSurface'
import { adminIdentity } from '../../../constants/adminDashboard'
import { saveProfile } from '../../../services/dashboardService'

// ─── contact info row ────────────────────────────────────────────────────────

function ContactRow({ icon: Icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          borderRadius: 1.25,
          bgcolor: 'action.hover',
          color: 'primary.main',
        }}
      >
        <Icon size={16} aria-hidden="true" />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: 'text.primary', fontSize: '0.8rem', fontWeight: 800 }}>
          {label}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            mt: 0.15,
            fontSize: '0.825rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  )
}

// ─── main component ──────────────────────────────────────────────────────────

function AdminProfile() {
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: adminIdentity.name,
      role: adminIdentity.role,
      email: adminIdentity.email,
      phone: adminIdentity.phone,
      department: adminIdentity.department,
      location: adminIdentity.location,
      bio: 'Responsible for managing academy operations, dashboard preferences, profile information, and administrative settings.',
    },
  })

  // Live values used by the summary panel
  const watchedName = watch('name') || adminIdentity.name
  const watchedEmail = watch('email') || adminIdentity.email
  const watchedPhone = watch('phone') || adminIdentity.phone
  const watchedLocation = watch('location') || adminIdentity.location

  const handleEdit = () => setEditMode(true)

  const handleCancel = () => {
    reset()
    setEditMode(false)
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await saveProfile(data)
      toast.success('Profile updated successfully!', { position: 'top-right' })
      setEditMode(false)
    } catch {
      toast.error('Failed to save profile. Please try again.', { position: 'top-right' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Stack spacing={3}>
      {/* ── Page header ──────────────────────────────────────── */}
      <Box>
        <Typography
          variant="h1"
          sx={{
            color: 'text.primary',
            fontSize: { xs: '1.8rem', md: '2.25rem' },
            fontWeight: 900,
            lineHeight: 1.2,
          }}
        >
          Admin Profile
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ mt: 0.75, fontSize: '0.925rem', lineHeight: 1.6 }}
        >
          Manage your admin identity and contact details.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '320px minmax(0,1fr)' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        {/* ── Profile summary card ─────────────────────────── */}
        <AdminSurface sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack spacing={2.5}>
            <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  bgcolor: 'primary.main',
                  color: '#FFFFFF',
                  fontSize: '2rem',
                  fontWeight: 900,
                  boxShadow: (t) =>
                    t.palette.mode === 'dark'
                      ? '0 10px 30px rgba(0,0,0,0.28)'
                      : '0 10px 30px rgba(15,23,42,0.14)',
                }}
              >
                <FiUser size={34} aria-hidden="true" />
              </Avatar>

              <Box>
                <Typography sx={{ color: 'text.primary', fontSize: '1.2rem', fontWeight: 900 }}>
                  {watchedName}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.3, fontSize: '0.875rem', fontWeight: 600 }}
                >
                  {adminIdentity.role}
                </Typography>
              </Box>

              <Chip
                icon={<FiShield size={14} />}
                label="Super Admin"
                color="primary"
                size="small"
                sx={{
                  height: 28,
                  fontWeight: 800,
                  '& .MuiChip-icon': { color: 'inherit' },
                }}
              />
            </Stack>

            <Divider />

            <Stack spacing={1.75}>
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Contact Information
              </Typography>
              <ContactRow icon={FiMail} label="Email" value={watchedEmail} />
              <ContactRow icon={FiPhone} label="Phone" value={watchedPhone} />
              <ContactRow icon={FiMapPin} label="Location" value={watchedLocation} />
            </Stack>
          </Stack>
        </AdminSurface>

        {/* ── Profile details form ─────────────────────────── */}
        <AdminSurface sx={{ p: { xs: 2.5, sm: 3 } }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2.5}>
              {/* Section header */}
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1.5,
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    sx={{ color: 'text.primary', fontSize: '1.15rem', fontWeight: 900 }}
                  >
                    Profile Details
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.35, fontSize: '0.8rem' }}>
                    Update your account information.
                  </Typography>
                </Box>

                {!editMode ? (
                  <Button
                    id="profile-edit-btn"
                    variant="outlined"
                    startIcon={<FiEdit3 size={15} />}
                    onClick={handleEdit}
                    sx={{
                      minHeight: 38,
                      borderRadius: 1.25,
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<FiX size={15} />}
                    onClick={handleCancel}
                    disabled={saving}
                    sx={{
                      minHeight: 38,
                      borderRadius: 1.25,
                      fontWeight: 700,
                      textTransform: 'none',
                      color: 'text.secondary',
                      borderColor: 'divider',
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>

              <Divider />

              {/* Fields grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <TextField
                  id="profile-name"
                  label="Name"
                  fullWidth
                  disabled={!editMode || saving}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register('name', { required: 'Name is required' })}
                />

                <TextField
                  id="profile-role"
                  label="Role"
                  fullWidth
                  disabled
                  {...register('role')}
                />

                <TextField
                  id="profile-email"
                  label="Email"
                  type="email"
                  fullWidth
                  disabled={!editMode || saving}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />

                <TextField
                  id="profile-phone"
                  label="Phone"
                  fullWidth
                  disabled={!editMode || saving}
                  {...register('phone')}
                />

                <TextField
                  id="profile-department"
                  label="Department"
                  fullWidth
                  disabled={!editMode || saving}
                  {...register('department')}
                />

                <TextField
                  id="profile-location"
                  label="Location"
                  fullWidth
                  disabled={!editMode || saving}
                  {...register('location')}
                />
              </Box>

              <TextField
                id="profile-bio"
                label="Bio"
                fullWidth
                multiline
                minRows={4}
                disabled={!editMode || saving}
                {...register('bio')}
              />

              {/* Save button — only visible in edit mode */}
              {editMode && (
                <Stack direction="row" sx={{ justifyContent: 'flex-end', pt: 0.5 }}>
                  <Button
                    id="profile-save-btn"
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    startIcon={
                      saving ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <FiSave size={16} />
                      )
                    }
                    sx={{
                      minHeight: 42,
                      px: 2.5,
                      borderRadius: 1.25,
                      fontWeight: 800,
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': { boxShadow: 'none' },
                    }}
                  >
                    {saving ? 'Saving…' : 'Save Changes'}
                  </Button>
                </Stack>
              )}

              {/* Success indicator when not in edit mode */}
              {!editMode && (
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ alignItems: 'center', color: 'text.secondary' }}
                >
                  <FiCheck size={14} aria-hidden="true" />
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    Click "Edit Profile" to make changes.
                  </Typography>
                </Stack>
              )}
            </Stack>
          </form>
        </AdminSurface>
      </Box>
    </Stack>
  )
}

export default AdminProfile