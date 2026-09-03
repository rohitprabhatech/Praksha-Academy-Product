import { useState } from 'react'
import { toast } from 'react-toastify'
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import {
  FiBell,
  FiDatabase,
  FiMoon,
  FiSave,
  FiShield,
} from 'react-icons/fi'
import AdminSurface from '../../../components/admin/common/AdminSurface'
import { useThemeMode } from '../../../context/ThemeModeContext'
import { saveSettings } from '../../../services/dashboardService'

// ─── Section header ──────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 1.25,
          bgcolor: 'action.hover',
          color: 'primary.main',
          flexShrink: 0,
        }}
      >
        <Icon size={18} aria-hidden="true" />
      </Box>
      <Box>
        <Typography
          variant="h3"
          sx={{ color: 'text.primary', fontSize: '1.12rem', fontWeight: 900 }}
        >
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.2, fontSize: '0.78rem' }}>
          {description}
        </Typography>
      </Box>
    </Stack>
  )
}

// ─── Toggle row ──────────────────────────────────────────────────────────────

function ToggleRow({ id, label, description, checked, onChange, disabled }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        py: 0.5,
      }}
    >
      <Box>
        <Typography sx={{ color: 'text.primary', fontSize: '0.9rem', fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.25, fontSize: '0.78rem' }}>
          {description}
        </Typography>
      </Box>
      <Switch
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        inputProps={{ 'aria-label': label }}
      />
    </Box>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

function AdminSettings() {
  const { mode, toggleMode } = useThemeMode()

  // ── Controlled state ─────────────────────────────────────────────
  const [academyName, setAcademyName] = useState('Praksha Academy')
  const [contactEmail, setContactEmail] = useState('support@praksha.academy')
  const [academicYear, setAcademicYear] = useState('2026-2027')
  const [timezone, setTimezone] = useState('Asia/Kolkata')

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [activityAlerts, setActivityAlerts] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(false)

  const [sessionTimeout, setSessionTimeout] = useState('30 minutes')
  const [allowedRole, setAllowedRole] = useState('Super Admin, Operations Admin')

  const [savingAcademy, setSavingAcademy] = useState(false)
  const [savingInterface, setSavingInterface] = useState(false)
  const [savingSecurity, setSavingSecurity] = useState(false)

  // ── Save handlers ────────────────────────────────────────────────

  const makeSaveHandler = (setLoading, payload, section) => async () => {
    setLoading(true)
    try {
      await saveSettings({ section, ...payload })
      toast.success(`${section} settings saved successfully!`, { position: 'top-right' })
    } catch {
      toast.error(`Failed to save ${section.toLowerCase()} settings.`, { position: 'top-right' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAcademy = makeSaveHandler(
    setSavingAcademy,
    { academyName, contactEmail, academicYear, timezone },
    'Academy'
  )

  const handleSaveInterface = makeSaveHandler(
    setSavingInterface,
    { darkMode: mode === 'dark', emailNotifications, activityAlerts, weeklySummary },
    'Interface'
  )

  const handleSaveSecurity = makeSaveHandler(
    setSavingSecurity,
    { sessionTimeout, allowedRole },
    'Security'
  )

  // ── Save button helper ───────────────────────────────────────────

  const SaveButton = ({ saving, onClick, id }) => (
    <Stack direction="row" sx={{ justifyContent: 'flex-end', pt: 0.5 }}>
      <Button
        id={id}
        variant="contained"
        disabled={saving}
        onClick={onClick}
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
        {saving ? 'Saving…' : 'Save Settings'}
      </Button>
    </Stack>
  )

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
          Admin Settings
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ mt: 0.75, fontSize: '0.925rem', lineHeight: 1.6 }}
        >
          Configure dashboard preferences, academy defaults, and notification behaviour.
        </Typography>
      </Box>

      {/* ── Academy Defaults + Interface Preferences ─────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2,
        }}
      >
        {/* Academy Defaults */}
        <AdminSurface sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack spacing={2.5}>
            <SectionHeader
              icon={FiDatabase}
              title="Academy Defaults"
              description="Configure your academy's basic defaults."
            />
            <Divider />

            <TextField
              id="settings-academy-name"
              label="Academy name"
              value={academyName}
              onChange={(e) => setAcademyName(e.target.value)}
              fullWidth
              disabled={savingAcademy}
            />

            <TextField
              id="settings-contact-email"
              label="Primary contact email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              type="email"
              fullWidth
              disabled={savingAcademy}
            />

            <TextField
              id="settings-academic-year"
              select
              label="Default academic year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              fullWidth
              disabled={savingAcademy}
            >
              <MenuItem value="2025-2026">2025–2026</MenuItem>
              <MenuItem value="2026-2027">2026–2027</MenuItem>
              <MenuItem value="2027-2028">2027–2028</MenuItem>
            </TextField>

            <TextField
              id="settings-timezone"
              select
              label="Default timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              fullWidth
              disabled={savingAcademy}
            >
              <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="Asia/Dubai">Asia/Dubai (GST)</MenuItem>
            </TextField>

            <SaveButton
              id="settings-save-academy-btn"
              saving={savingAcademy}
              onClick={handleSaveAcademy}
            />
          </Stack>
        </AdminSurface>

        {/* Interface Preferences */}
        <AdminSurface sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack spacing={2.5}>
            <SectionHeader
              icon={FiMoon}
              title="Interface Preferences"
              description="Personalise your admin dashboard experience."
            />
            <Divider />

            {/* Dark mode */}
            <ToggleRow
              id="settings-dark-mode"
              label="Dark mode"
              description="Use the dark theme across the admin console."
              checked={mode === 'dark'}
              onChange={toggleMode}
              disabled={savingInterface}
            />

            <Divider />

            {/* Notification toggles */}
            <SectionHeader
              icon={FiBell}
              title="Notifications"
              description="Choose which notifications you receive."
            />
            <Divider />

            <Stack spacing={0.5}>
              <FormControlLabel
                control={
                  <Switch
                    id="settings-email-notifications"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    disabled={savingInterface}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ color: 'text.primary', fontSize: '0.9rem', fontWeight: 700 }}>
                      Email notifications
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                      Receive important administrative emails.
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    id="settings-activity-alerts"
                    checked={activityAlerts}
                    onChange={(e) => setActivityAlerts(e.target.checked)}
                    disabled={savingInterface}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ color: 'text.primary', fontSize: '0.9rem', fontWeight: 700 }}>
                      Dashboard activity alerts
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                      Get alerts about important dashboard activity.
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    id="settings-weekly-summary"
                    checked={weeklySummary}
                    onChange={(e) => setWeeklySummary(e.target.checked)}
                    disabled={savingInterface}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ color: 'text.primary', fontSize: '0.9rem', fontWeight: 700 }}>
                      Weekly summary report
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                      Receive a weekly overview of academy activity.
                    </Typography>
                  </Box>
                }
              />
            </Stack>

            <SaveButton
              id="settings-save-interface-btn"
              saving={savingInterface}
              onClick={handleSaveInterface}
            />
          </Stack>
        </AdminSurface>
      </Box>

      {/* ── Security ─────────────────────────────────────────── */}
      <AdminSurface sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={2.5}>
          <SectionHeader
            icon={FiShield}
            title="Security"
            description="Configure administrator access preferences."
          />
          <Divider />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              id="settings-session-timeout"
              label="Session timeout"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              fullWidth
              disabled={savingSecurity}
            />

            <TextField
              id="settings-allowed-role"
              label="Allowed admin role"
              value={allowedRole}
              onChange={(e) => setAllowedRole(e.target.value)}
              fullWidth
              disabled={savingSecurity}
            />
          </Box>

          <SaveButton
            id="settings-save-security-btn"
            saving={savingSecurity}
            onClick={handleSaveSecurity}
          />
        </Stack>
      </AdminSurface>
    </Stack>
  )
}

export default AdminSettings
