import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { toast } from 'react-toastify'
import {
  fetchRegistrationRequests,
  reviewRegistrationRequest,
} from '../../services/platformService'

const statusColor = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
}

const RegistrationRequests = () => {
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [items, setItems] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchRegistrationRequests({ status })
      setItems(result.items)
    } catch (err) {
      toast.error(err.message || 'Failed to load requests')
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    load()
  }, [load])

  const handleReview = async (id, action) => {
    setBusyId(id)
    try {
      await reviewRegistrationRequest(id, action)
      toast.success(action === 'approve' ? 'Request approved' : 'Request rejected')
      await load()
    } catch (err) {
      toast.error(err.message || 'Action failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Stack spacing={2.5} sx={{ pt: { xs: 5, md: 0 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={1.5}
        alignItems={{ sm: 'center' }}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>
            Academy registration requests
          </Typography>
          <Typography sx={{ color: '#64748B' }}>
            Accept or reject new academy (tenant) registration requests.
          </Typography>
        </Box>
        <TextField
          select
          size="small"
          label="Filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: 160, bgcolor: '#FFF' }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </TextField>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 220 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: '#FFF',
            borderRadius: 2.5,
            border: '1px solid #E2E8F0',
          }}
        >
          <Typography sx={{ color: '#64748B' }}>No requests found.</Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {items.map((row) => (
            <Box
              key={row.id}
              sx={{
                bgcolor: '#FFF',
                border: '1px solid #E2E8F0',
                borderRadius: 2.5,
                p: 2.25,
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                    <Typography sx={{ fontWeight: 700, color: '#0F172A', fontSize: '1.05rem' }}>
                      {row.academyName}
                    </Typography>
                    <Chip
                      size="small"
                      label={row.status}
                      color={statusColor[row.status] || 'default'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Stack>
                  <Typography sx={{ color: '#475569', fontSize: '0.9rem' }}>
                    Owner: {row.ownerName} ({row.ownerEmail})
                  </Typography>
                  <Typography sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                    {row.city} · Plan: {row.planRequested} · Phone: {row.phone}
                  </Typography>
                  {row.notes && (
                    <Typography sx={{ color: '#64748B', fontSize: '0.85rem', mt: 0.5 }}>
                      Notes: {row.notes}
                    </Typography>
                  )}
                </Box>

                {row.status === 'pending' && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      variant="contained"
                      color="success"
                      disabled={busyId === row.id}
                      onClick={() => handleReview(row.id, 'approve')}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      disabled={busyId === row.id}
                      onClick={() => handleReview(row.id, 'reject')}
                      sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                      Reject
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

export default RegistrationRequests
