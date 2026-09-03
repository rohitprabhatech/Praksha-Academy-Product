import { useEffect, useState } from 'react'
import {
  Box,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { fetchAcademies } from '../../services/platformService'

const statusColor = {
  active: 'success',
  trial: 'info',
  suspended: 'warning',
  pending: 'default',
}

const AcademiesList = () => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const result = await fetchAcademies()
        if (alive) setItems(result.items)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <Stack spacing={2.5} sx={{ pt: { xs: 5, md: 0 } }}>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#0F172A' }}>
          Academies (Tenants)
        </Typography>
        <Typography sx={{ color: '#64748B' }}>
          Academies managed on the Prabha Technology platform.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 220 }}>
          <CircularProgress />
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
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                spacing={1}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {row.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={row.status}
                      color={statusColor[row.status] || 'default'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Stack>
                  <Typography sx={{ color: '#64748B', fontSize: '0.875rem' }}>
                    Code: {row.tenantCode} · Owner: {row.ownerEmail}
                  </Typography>
                </Box>
                <Typography sx={{ color: '#475569', fontSize: '0.875rem' }}>
                  {row.students} students · {row.teachers} teachers · {row.courses} courses
                </Typography>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  )
}

export default AcademiesList
