import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  FiAlertCircle,
  FiRefreshCw,
} from 'react-icons/fi'
import DashboardCard from '../../../components/admin/DashboardCard'
import RecentActivities from '../../../components/admin/RecentActivities'
import UpcomingClasses from '../../../components/admin/UpcomingClasses'
import CourseEnrollmentChart from '../../../components/admin/charts/CourseEnrollmentChart'
import RevenueChart from '../../../components/admin/charts/RevenueChart'
import StudentChart from '../../../components/admin/charts/StudentChart'
import { fetchDashboardData } from '../../../services/dashboardService'

// ─── helpers ────────────────────────────────────────────────────────────────

const todayChip = () => {
  const now = new Date()
  return now.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

// ─── skeleton blocks ────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <Box
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'rgba(226,232,240,0.92)',
        borderRadius: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 2 }}>
        <Skeleton variant="rounded" width={36} height={36} />
        <Skeleton variant="text" width={100} height={16} />
      </Stack>
      <Skeleton variant="text" width={80} height={42} />
      <Skeleton variant="text" width={140} height={16} sx={{ mt: 1 }} />
    </Box>
  )
}

function ChartSkeleton({ height = 260 }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'rgba(226,232,240,0.92)',
        borderRadius: 1,
        bgcolor: 'background.paper',
        p: 2.5,
      }}
    >
      <Skeleton variant="text" width={160} height={22} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width={220} height={16} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" width="100%" height={height} />
    </Box>
  )
}

function ActivitySkeleton() {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'rgba(226,232,240,0.92)',
        borderRadius: 1,
        bgcolor: 'background.paper',
        p: 2.5,
      }}
    >
      <Skeleton variant="text" width={140} height={22} sx={{ mb: 1.5 }} />
      {[1, 2, 3, 4].map((i) => (
        <Stack key={i} direction="row" spacing={1.5} sx={{ py: 1.25, alignItems: 'flex-start' }}>
          <Skeleton variant="circular" width={8} height={8} sx={{ mt: 0.75, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={18} />
            <Skeleton variant="text" width="55%" height={15} />
          </Box>
          <Skeleton variant="text" width={48} height={14} />
        </Stack>
      ))}
    </Box>
  )
}

// ─── error banner ────────────────────────────────────────────────────────────

function ErrorBanner({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      icon={<FiAlertCircle size={20} />}
      action={
        <Button
          color="error"
          size="small"
          onClick={onRetry}
          sx={{ fontWeight: 700, textTransform: 'none', minWidth: 60 }}
        >
          Retry
        </Button>
      }
      sx={{ borderRadius: 1, fontWeight: 600 }}
    >
      {message}
    </Alert>
  )
}

// ─── main component ──────────────────────────────────────────────────────────

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const result = await fetchDashboardData()
      setData(result)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load(false)
  }, [load])

  const isLoadingOrRefreshing = loading || refreshing

  return (
    <Stack spacing={2.5}>
      {/* ── Page header ──────────────────────────────────────── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.75}
        sx={{
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              color: 'text.primary',
              fontSize: { xs: '1.48rem', md: '1.72rem' },
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: 0,
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mt: 0.45, fontSize: '0.86rem', lineHeight: 1.55 }}
          >
            Welcome back. Here is what is happening across Praksha Academy today.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}
        >
          {/* Refresh button */}
          <Button
            id="dashboard-refresh-btn"
            variant="outlined"
            size="small"
            disabled={isLoadingOrRefreshing}
            startIcon={
              <FiRefreshCw
                size={14}
                style={{
                  transition: 'transform 0.6s linear',
                  transform: isLoadingOrRefreshing ? 'rotate(360deg)' : 'none',
                  animation: isLoadingOrRefreshing
                    ? 'spin 0.7s linear infinite'
                    : 'none',
                }}
              />
            }
            onClick={() => load(true)}
            sx={{
              minHeight: 34,
              borderRadius: 1,
              px: 1.25,
              color: 'text.secondary',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.10)'
                  : 'rgba(226,232,240,0.95)',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? '#1B2A3A' : '#FFFFFF',
              fontSize: '0.76rem',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                borderColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.4),
                bgcolor: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === 'dark' ? 0.14 : 0.05
                  ),
              },
            }}
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </Button>

          {/* Date chip */}
          <Typography
            component="span"
            color="primary.contrastText"
            sx={{
              px: 1.25,
              py: 0.7,
              borderRadius: 1,
              bgcolor: 'primary.main',
              fontSize: '0.76rem',
              fontWeight: 800,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
            }}
          >
            {todayChip()}
          </Typography>
        </Stack>
      </Stack>

      {/* ── CSS keyframe for spin ─────────────────────────────── */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Error banner ─────────────────────────────────────── */}
      {error && !isLoadingOrRefreshing && (
        <ErrorBanner message={error} onRetry={() => load(true)} />
      )}

      {/* ── KPI cards ────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0,1fr))',
            xl: 'repeat(3, minmax(0,1fr))',
          },
          gap: 1.75,
        }}
      >
        {isLoadingOrRefreshing
          ? [1, 2, 3, 4, 5, 6].map((n) => <CardSkeleton key={n} />)
          : (data?.stats ?? []).map((stat) => (
              <DashboardCard key={stat.title} {...stat} />
            ))}
      </Box>

      {/* ── Empty state ──────────────────────────────────────── */}
      {!isLoadingOrRefreshing && !error && data?.stats?.length === 0 && (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            color: 'text.secondary',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>No dashboard data available.</Typography>
          <Typography sx={{ mt: 0.5, fontSize: '0.85rem' }}>
            Check back later or contact your administrator.
          </Typography>
        </Box>
      )}

      {/* ── Charts row 1 ─────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            xl: 'minmax(0, 1.38fr) minmax(320px, 0.62fr)',
          },
          gap: 1.75,
        }}
      >
        {isLoadingOrRefreshing ? (
          <>
            <ChartSkeleton height={240} />
            <ChartSkeleton height={240} />
          </>
        ) : (
          !error && (
            <>
              <RevenueChart />
              <CourseEnrollmentChart />
            </>
          )
        )}
      </Box>

      {/* ── Charts row 2 + widgets ────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'minmax(0, 1.12fr) minmax(320px, 0.88fr)',
          },
          gap: 1.75,
        }}
      >
        {isLoadingOrRefreshing ? (
          <>
            <ChartSkeleton height={220} />
            <Stack spacing={1.75}>
              <ActivitySkeleton />
              <ActivitySkeleton />
            </Stack>
          </>
        ) : (
          !error && (
            <>
              <StudentChart />
              <Box sx={{ display: 'grid', gap: 1.75 }}>
                <RecentActivities />
                <UpcomingClasses />
              </Box>
            </>
          )
        )}
      </Box>
    </Stack>
  )
}

export default Dashboard
