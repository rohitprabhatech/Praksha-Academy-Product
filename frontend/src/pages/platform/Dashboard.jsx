import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { FiArrowRight, FiBriefcase, FiCheckSquare, FiClock } from 'react-icons/fi'
import { fetchPlatformDashboard } from '../../services/platformService'

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Box
      sx={{
        p: 2.25,
        borderRadius: 2.5,
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        minWidth: 0,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography sx={{ color: '#64748B', fontSize: '0.8rem', mb: 0.75 }}>
            {label}
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: '#0F172A' }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: color,
            color: '#FFF',
          }}
        >
          <Icon size={18} />
        </Box>
      </Stack>
    </Box>
  )
}

const statusColor = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
}

const PlatformDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const result = await fetchPlatformDashboard()
        if (alive) setData(result)
      } catch (err) {
        if (alive) setError(err.message || 'Failed to load dashboard')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 280 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Stack spacing={3} sx={{ pt: { xs: 5, md: 0 } }}>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0F172A' }}>
          Prabha Technology Dashboard
        </Typography>
        <Typography sx={{ color: '#64748B', mt: 0.5 }}>
          Review academy registration requests and manage platform tenants.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            lg: 'repeat(4, 1fr)',
          },
        }}
      >
        <StatCard
          label="Pending requests"
          value={data.stats.pendingRequests}
          icon={FiClock}
          color="#D97706"
        />
        <StatCard
          label="Approved"
          value={data.stats.approvedRequests}
          icon={FiCheckSquare}
          color="#059669"
        />
        <StatCard
          label="Active academies"
          value={data.stats.activeAcademies}
          icon={FiBriefcase}
          color="#2563EB"
        />
        <StatCard
          label="Rejected"
          value={data.stats.rejectedRequests}
          icon={FiCheckSquare}
          color="#DC2626"
        />
      </Box>

      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 2.5,
          p: 2.5,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ sm: 'center' }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>
            Recent registration requests
          </Typography>
          <Button
            component={RouterLink}
            to="/platform/requests"
            endIcon={<FiArrowRight />}
            sx={{ textTransform: 'none' }}
          >
            Manage requests
          </Button>
        </Stack>

        <Stack spacing={1.25}>
          {data.recentRequests.map((row) => (
            <Stack
              key={row.id}
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              spacing={1}
              sx={{
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                bgcolor: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {row.academyName}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                  {row.ownerName} · {row.ownerEmail} · {row.city}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={row.status}
                color={statusColor[row.status] || 'default'}
                sx={{ alignSelf: { xs: 'flex-start', md: 'center' }, textTransform: 'capitalize' }}
              />
            </Stack>
          ))}
        </Stack>
      </Box>
    </Stack>
  )
}

export default PlatformDashboard
